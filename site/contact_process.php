<?php
// Minimal contact handler.
// Note: This only works on hosts with PHP enabled.

$to = 'contact@tributrip.fr';

$firstName = isset($_POST['first_name']) ? trim((string)$_POST['first_name']) : '';
$lastName = isset($_POST['last_name']) ? trim((string)$_POST['last_name']) : '';
$email = isset($_POST['email']) ? trim((string)$_POST['email']) : '';
$phone = isset($_POST['phone']) ? trim((string)$_POST['phone']) : '';
$project = isset($_POST['project']) ? trim((string)$_POST['project']) : '';

$from = filter_var($email, FILTER_VALIDATE_EMAIL) ? $email : '';

$subject = 'New message from Tributrip contact form';

$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
if ($from !== '') {
  $headers .= "From: {$from}\r\n";
  $headers .= "Reply-To: {$from}\r\n";
}

$bodyLines = [
  'You have received a new message from the Tributrip contact form.',
  '',
  'First name: ' . $firstName,
  'Last name: ' . $lastName,
  'Email: ' . $email,
  'Phone: ' . $phone,
  '',
  'Project:',
  $project,
  ''
];
$body = implode("\n", $bodyLines);

@mail($to, $subject, $body, $headers);

// Simple redirect back to contact page
header('Location: contact.html');
exit;
