<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require __DIR__ . '/../vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\IOFactory;
use Dompdf\Dompdf;

// Récupération du fichier TSV depuis l'URL
if (!isset($_GET['file'])) {
    die("Erreur : Aucun fichier spécifié.");
}

$uploadDir = __DIR__ . '/uploads/';
$tsvFile = $uploadDir . basename($_GET['file']);

// Vérification de l'existence du fichier
if (!file_exists($tsvFile)) {
    die("Erreur : Le fichier n'existe pas.");
}

// Lecture des données TSV
$data = [];
if (($handle = fopen($tsvFile, "r")) !== false) {
    while (($row = fgetcsv($handle, 0, "\t")) !== false) {
        $data[] = $row;
    }
    fclose($handle);
}

// Configuration des dimensions
$labelWidth = 320; // 85; // mm
$labelHeight = 200; // 54; // mm
$pageWidth = 794; // 210; // A4 largeur (mm)
$pageHeight = 1122; // 297; // A4 hauteur (mm)
$marginTop = 45; // 12; // mm
$marginSide = 76; // 20; // mm

// Génération du contenu HTML pour Dompdf
$html = '<html><head>
          <style>
            body {
              font-family: Arial, sans-serif;
            }
            .page-break {
              page-break-before: always; /* Force un saut de page avant cet élément */
            }
          </style>
          </head><body style="margin: 0; padding: 0;">';
$rowPosition = $marginTop;
$colPosition = $marginSide;
//var_dump($data);
foreach ($data as $index => $row) {

    $html .= '<div style="position: absolute; top: ' . $rowPosition . 'px; left: ' . $colPosition . 'px;
                    width: ' . $labelWidth . 'px; height: ' . $labelHeight . 'px; 
                    border: 1px solid black; padding: 0px; font-size: 10px;text-align:center;">
                <div style="margin-top:50px;">
                    <strong style="margin-top:20px;">' . htmlspecialchars($row[0]) . '</strong><br>
                    <span style="font-size: 16px;margin-top:50px;">' . htmlspecialchars($row[1] ?? '') . ' ' . htmlspecialchars($row[2] ?? '') . '</span><br>
                    <div style="margin-top:20px;">' . htmlspecialchars($row[6] ?? '') . '<br>
                    ' . htmlspecialchars($row[7] ?? '') . '<br>
                    ' . htmlspecialchars($row[8] ?? '') . '
                    </div>
                </div>
              </div>';

    $colPosition += $labelWidth;

    if ($colPosition + $labelWidth > $pageWidth) {
        $rowPosition += $labelHeight;
        $colPosition = $marginSide;

        if ($rowPosition + $labelHeight > $pageHeight) {
            $html .= '<div class="page-break"></div>';
            $rowPosition = $marginTop;
            $colPosition = $marginSide;
        }
    }
}

$html .= '</body></html>';

// Génération du PDF
$dompdf = new Dompdf();
$dompdf->loadHtml($html);
$dompdf->setPaper('A4', 'portrait');
$dompdf->render();

// Sauvegarder le fichier PDF
$pdfOutput = $uploadDir . 'etiquettes.pdf';
file_put_contents($pdfOutput, $dompdf->output());

echo "PDF généré avec succès : <a href='uploads/etiquettes.pdf'>Télécharger les étiquettes</a>";
