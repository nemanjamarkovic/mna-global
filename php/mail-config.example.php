<?php
/**
 * Copy this file to mail-config.php and set your domain mailbox details.
 * Do not commit mail-config.php — it is listed in .gitignore.
 */
return [
    // Use to_emails for multiple recipients, or to_email for a single address.
    "to_emails" => [
        "info@mnaglobal.rs",
        "sales@mnaglobal.rs",
    ],
    "from_email" => "noreply@mnaglobal.rs",
    "from_name" => "MNA Global Trading",
    "subject_prefix" => "MNA Global Trading — New Quote Request",
];
