<?php

session_start();

$user = isset($_POST['identifiant']) ? $_POST['identifiant'] : null;
$auth = isset($_POST['motdepasse']) ? $_POST['motdepasse'] : null;

if ($auth === "root" && $user === "admin") {
    $_SESSION['Utilisateur'] = True;
}

Redirection('index.php?page=page-home');

?>