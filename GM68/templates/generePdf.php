
<h1>Créer des Étiquettes PDF</h1>
<p>À partir de Fichiers au formats ( *.csv, *xlxs, *.xls, *.tsv ) , comprenant les colonnes suivantes :</p>
<br>
<table>
    <tr>
        <th>Identifiant</th>
        <th>Nom</th>
        <th>Prénom</th>
        <th>N° du Club</th>
        <th>Nom du Club</th>
        <th>Ville du Club</th>
    </tr>
    <tr>
        <td>(0)</td>
        <td>(1)</td>
        <td>(2)</td>
        <td>(3)</td>
        <td>(4)</td>
        <td>(5)</td>
    </tr>
</table>
<div class="div-import">
    <p>Veuillez sélectionner le fichier à importer ...</p>
    <br>
    <input type="file" id="fileInput" accept=".csv,.xlsx,.xls,.tsv">
    <button id="generatePdf">Générer Étiquettes PDF</button>
</div>

<script async src="./scripts/script-pdf.js"></script>