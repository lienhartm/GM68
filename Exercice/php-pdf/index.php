<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Génération d'Étiquettes</title>
</head>
<body>
    <h1>Importer un fichier TSV</h1>
    <form action="upload.php" method="POST" enctype="multipart/form-data">
        <label for="file">Choisir un fichier TSV :</label>
        <input type="file" name="file" id="file" accept=".tsv" required>
        <button type="submit">Importer</button>
    </form>
</body>
</html>
