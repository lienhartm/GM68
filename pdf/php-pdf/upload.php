<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
    $uploadDir = __DIR__ . '/uploads/';
    $fileName = $_FILES['file']['name'];
    $fileTmp = $_FILES['file']['tmp_name'];
    $fileExt = pathinfo($fileName, PATHINFO_EXTENSION);

    // Vérification du format du fichier
    if ($fileExt !== 'tsv') {
        die("Erreur : Le fichier doit être au format TSV.");
    }

    // Déplacement du fichier dans le dossier d'upload
    $fileName = preg_replace('/[^A-Za-z0-9_\-\.]/', '_', $fileName);
    $destination = $uploadDir . basename($fileName);
    if (move_uploaded_file($fileTmp, $destination)) {
        echo "Fichier importé avec succès : <a href='generate_labels.php?file=" . urlencode($fileName) . "'>Générer les étiquettes</a>";
    } else {
        echo "Erreur lors de l'importation du fichier.";
        error_log("Erreur lors de l'importation : " . print_r($_FILES, true));
    }
} else {
    echo "Aucun fichier téléchargé.";
}

