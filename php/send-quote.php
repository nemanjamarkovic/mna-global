<?php
declare(strict_types=1);

header("Content-Type: application/json; charset=UTF-8");

$configPath = __DIR__ . "/mail-config.php";
if (!is_readable($configPath)) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Mail is not configured on the server.",
    ]);
    exit;
}

$config = require $configPath;

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Method not allowed.",
    ]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);
if (!is_array($input)) {
    $input = $_POST;
}

function field(array $input, string $key): string
{
    return trim((string) ($input[$key] ?? ""));
}

function respond(bool $success, string $message, int $status = 200): void
{
    http_response_code($status);
    echo json_encode([
        "success" => $success,
        "message" => $message,
    ]);
    exit;
}

function normalizeRecipients(array $config): array
{
    $recipients = [];

    if (isset($config["to_emails"]) && is_array($config["to_emails"])) {
        $recipients = $config["to_emails"];
    } elseif (!empty($config["to_email"])) {
        $recipients = [(string) $config["to_email"]];
    }

    $valid = [];
    foreach ($recipients as $recipient) {
        $email = trim((string) $recipient);
        if ($email !== "" && filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $valid[] = $email;
        }
    }

    return array_values(array_unique($valid));
}

if (field($input, "botcheck") !== "") {
    respond(true, "Thank you.");
}

$name = field($input, "name");
$email = field($input, "email");
$product = field($input, "product");

if ($name === "") {
    respond(false, "Please enter your name.", 400);
}

if ($email === "" || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, "Please enter a valid email address.", 400);
}

if ($product === "") {
    respond(false, "Please enter the product you are interested in.", 400);
}

$quantity = field($input, "quantity");
$specification = field($input, "specification");
$origin = field($input, "origin");
$destination = field($input, "destination");
$deliveryPeriod = field($input, "delivery_period");
$incoterm = field($input, "incoterm");
$message = field($input, "message");

$toEmails = normalizeRecipients($config);
$fromEmail = (string) ($config["from_email"] ?? "");
$fromName = (string) ($config["from_name"] ?? "MNA Global Trading");
$subjectPrefix = (string) ($config["subject_prefix"] ?? "New Quote Request");

if ($toEmails === [] || $fromEmail === "") {
    respond(false, "Mail is not configured on the server.", 500);
}

$subject = $subjectPrefix . " — " . $product;

$bodyLines = [
    "New quote request from the MNA Global Trading website",
    "",
    "Name: " . $name,
    "Email: " . $email,
    "Product: " . $product,
    "Quantity: " . ($quantity !== "" ? $quantity : "—"),
    "Specification: " . ($specification !== "" ? $specification : "—"),
    "Origin: " . ($origin !== "" ? $origin : "—"),
    "Destination: " . ($destination !== "" ? $destination : "—"),
    "Delivery Period: " . ($deliveryPeriod !== "" ? $deliveryPeriod : "—"),
    "Incoterm: " . ($incoterm !== "" ? $incoterm : "—"),
    "",
    "Additional Details:",
    $message !== "" ? $message : "—",
    "",
    "Submitted: " . gmdate("Y-m-d H:i:s") . " UTC",
];

$body = implode("\r\n", $bodyLines);

$encodedFromName = "=?UTF-8?B?" . base64_encode($fromName) . "?=";
$headers = [
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "From: " . $encodedFromName . " <" . $fromEmail . ">",
    "Reply-To: " . $name . " <" . $email . ">",
    "X-Mailer: PHP/" . phpversion(),
];

$sent = mail(implode(", ", $toEmails), $subject, $body, implode("\r\n", $headers));

if (!$sent) {
    respond(false, "Unable to send your request. Please try again later.", 500);
}

respond(true, "Thank you — your quote request has been sent.");
