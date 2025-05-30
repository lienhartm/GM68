<h1>Comparaitre deux fichiers</h1>
<p>À partir de Fichiers au formats ( *.csv, *xlxs, *.xls, *.tsv ).</p>
<br>

<div class="div-import">
    <p>Veuillez sélectionner les fichiers à importer ...</p>
    <br>
    <label>Fichier 1
    <input type="file" id="fileInputA" accept=".csv,.xlsx,.xls,.tsv">
    </label>
    <label>Fichier 2
    <input type="file" id="fileInputB" accept=".csv,.xlsx,.xls,.tsv">
    </label>
    <button id="compareButton">Comparer</button>
    <h2>Résultats :</h2>
    <div id="result"></div>
</div>

<script async src="./scripts/script-compare.js"></script>