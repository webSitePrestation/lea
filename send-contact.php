<?php
/**
 * Formulaire de contact - Maîtresse Lea
 * Compatible IONOS avec PHPMailer
 */

error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/logs/errors.log');

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit;
}

// ═══════════════════════════════════════════════════════════
// CONFIGURATION IONOS - À PERSONNALISER
// ═══════════════════════════════════════════════════════════

$IONOS_EMAIL = 'votre-email@votre-domaine.com';
$IONOS_PASSWORD = 'votre-mot-de-passe';
$SMTP_HOST = 'smtp.ionos.fr';
$SMTP_PORT = 587;
$SMTP_SECURE = 'tls';
$EMAIL_DESTINATAIRE = 'votre-email@votre-domaine.com';

// ═══════════════════════════════════════════════════════════

require_once __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function cleanInput($data) {
    if (is_null($data)) return '';
    return htmlspecialchars(trim(stripslashes($data)), ENT_QUOTES, 'UTF-8');
}

// Récupération des données
$name    = cleanInput($_POST['name']    ?? '');
$email   = cleanInput($_POST['email']   ?? '');
$subject = cleanInput($_POST['subject'] ?? '');
$message = cleanInput($_POST['message'] ?? '');

// Validation
$errors = [];

if (empty($name)) {
    $errors[] = 'Le nom est obligatoire';
}

if (empty($email)) {
    $errors[] = "L'email est obligatoire";
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "L'email n'est pas valide";
}

if (empty($subject)) {
    $errors[] = 'Le type de demande est obligatoire';
}

if (empty($message)) {
    $errors[] = 'Le message est obligatoire';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => implode('. ', $errors)
    ]);
    exit;
}

// Traduction du sujet
$subjectLabels = [
    'pack'    => 'Pack 200€/mois',
    'seance'  => 'Séance à l\'unité',
    'virtuel' => 'Services virtuels',
    'info'    => 'Demande d\'informations'
];
$subjectLabel = $subjectLabels[$subject] ?? $subject;

// Préparation de l'email
$emailSubject = "💌 Nouveau message : $subjectLabel - $name";

$corpsHTML = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: Arial, sans-serif; background: #0a0a0a; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #1a1a1a; border-radius: 8px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #c41e3a 0%, #8b0000 100%); color: #d4af37; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 3px; }
        .badge { display: inline-block; background: #8b0000; color: #d4af37; padding: 8px 20px; border-radius: 20px; margin-top: 15px; font-size: 14px; }
        .section { padding: 25px; background: #222; margin: 15px; border-left: 3px solid #c41e3a; }
        .section h2 { color: #d4af37; font-size: 16px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 15px 0; }
        .field { margin-bottom: 15px; }
        .label { color: #d4af37; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; }
        .value { color: #ccc; margin-top: 5px; line-height: 1.6; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>💌 Nouveau Message</h1>
            <div class='badge'>$subjectLabel</div>
        </div>

        <div class='section'>
            <h2>📋 Informations</h2>
            <div class='field'>
                <div class='label'>Nom / Pseudo</div>
                <div class='value'>$name</div>
            </div>
            <div class='field'>
                <div class='label'>Email</div>
                <div class='value'>$email</div>
            </div>
        </div>

        <div class='section'>
            <h2>💬 Message</h2>
            <div class='value'>" . nl2br($message) . "</div>
        </div>

        <div class='footer'>
            Reçu le " . date('d/m/Y à H:i') . "
        </div>
    </div>
</body>
</html>";

$corpsTexte = "
NOUVEAU MESSAGE DE CONTACT
==========================

TYPE : $subjectLabel

=== CONTACT ===
Nom/Pseudo : $name
Email      : $email

=== MESSAGE ===
$message

Reçu le " . date('d/m/Y à H:i') . "
";

// Envoi avec PHPMailer
$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = $SMTP_HOST;
    $mail->SMTPAuth   = true;
    $mail->Username   = $IONOS_EMAIL;
    $mail->Password   = $IONOS_PASSWORD;
    $mail->SMTPSecure = $SMTP_SECURE;
    $mail->Port       = $SMTP_PORT;
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom($IONOS_EMAIL, 'Site Maîtresse Lea');
    $mail->addReplyTo($email, $name);
    $mail->addAddress($EMAIL_DESTINATAIRE);

    $mail->isHTML(true);
    $mail->Subject = $emailSubject;
    $mail->Body    = $corpsHTML;
    $mail->AltBody = $corpsTexte;

    $mail->send();

    echo json_encode([
        'success' => true,
        'message' => 'Message envoyé avec succès ! Je vous répondrai sous 24h.'
    ]);

} catch (Exception $e) {
    error_log("Erreur PHPMailer: " . $mail->ErrorInfo);
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => "Une erreur est survenue. Contactez-moi directement via Telegram."
    ]);
}
?>
