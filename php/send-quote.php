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

function escapeHtml(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, "UTF-8");
}

function displayField(string $value): string
{
    return $value !== "" ? escapeHtml($value) : "&#8212;";
}

function buildPlainBody(
    string $name,
    string $email,
    string $product,
    string $quantity,
    string $specification,
    string $origin,
    string $destination,
    string $deliveryPeriod,
    string $incoterm,
    string $message
): string {
    $lines = [
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

    return implode("\r\n", $lines);
}

function buildHtmlBody(
    string $name,
    string $email,
    string $product,
    string $quantity,
    string $specification,
    string $origin,
    string $destination,
    string $deliveryPeriod,
    string $incoterm,
    string $message
): string {
    $rows = [
        ["Name", displayField($name)],
        ["Email", '<a href="mailto:' . escapeHtml($email) . '" style="color:#2d6a8a;text-decoration:none;">' . escapeHtml($email) . "</a>"],
        ["Product", displayField($product)],
        ["Quantity", displayField($quantity)],
        ["Specification", displayField($specification)],
        ["Origin", displayField($origin)],
        ["Destination", displayField($destination)],
        ["Delivery Period", displayField($deliveryPeriod)],
        ["Incoterm", displayField($incoterm)],
    ];

    $rowHtml = "";
    foreach ($rows as [$label, $value]) {
        $rowHtml .= '
          <tr>
            <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:14px;width:160px;vertical-align:top;">' . escapeHtml($label) . '</td>
            <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#1e293b;font-size:14px;vertical-align:top;">' . $value . '</td>
          </tr>';
    }

    $messageHtml = nl2br(displayField($message));

    return '<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Quote Request</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Segoe UI,system-ui,-apple-system,BlinkMacSystemFont,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background:linear-gradient(180deg,#e8f4fc 0%,#ffffff 100%);padding:24px 28px;border-bottom:1px solid #e2e8f0;">
              <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#4caf50;">MNA Global Trading</p>
              <h1 style="margin:0;font-size:24px;line-height:1.3;color:#2d6a8a;">New Quote Request</h1>
              <p style="margin:10px 0 0;font-size:14px;color:#64748b;">A new inquiry was submitted from the website contact form.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">' . $rowHtml . '</table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px 8px;">
              <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#4caf50;">Additional Details</p>
              <div style="padding:14px 16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;color:#1e293b;font-size:14px;line-height:1.6;">' . $messageHtml . '</div>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 24px;">
              <p style="margin:0;font-size:12px;color:#64748b;">Submitted: ' . escapeHtml(gmdate("Y-m-d H:i:s")) . ' UTC</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>';
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

$plainBody = buildPlainBody(
    $name,
    $email,
    $product,
    $quantity,
    $specification,
    $origin,
    $destination,
    $deliveryPeriod,
    $incoterm,
    $message
);

$htmlBody = buildHtmlBody(
    $name,
    $email,
    $product,
    $quantity,
    $specification,
    $origin,
    $destination,
    $deliveryPeriod,
    $incoterm,
    $message
);

$boundary = "mna-quote-" . md5(uniqid("", true));
$encodedFromName = "=?UTF-8?B?" . base64_encode($fromName) . "?=";

$headers = [
    "MIME-Version: 1.0",
    'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
    "From: " . $encodedFromName . " <" . $fromEmail . ">",
    "Reply-To: " . $name . " <" . $email . ">",
    "X-Mailer: PHP/" . phpversion(),
];

$body = "--" . $boundary . "\r\n"
    . "Content-Type: text/plain; charset=UTF-8\r\n"
    . "Content-Transfer-Encoding: 8bit\r\n\r\n"
    . $plainBody . "\r\n\r\n"
    . "--" . $boundary . "\r\n"
    . "Content-Type: text/html; charset=UTF-8\r\n"
    . "Content-Transfer-Encoding: 8bit\r\n\r\n"
    . $htmlBody . "\r\n\r\n"
    . "--" . $boundary . "--";

$sent = mail(implode(", ", $toEmails), $subject, $body, implode("\r\n", $headers));

if (!$sent) {
    respond(false, "Unable to send your request. Please try again later.", 500);
}

respond(true, "Thank you — your quote request has been sent.");
