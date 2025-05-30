let dataA, dataB;

document.getElementById('compareButton').addEventListener('click', () => {
    const fileInputA = document.getElementById('fileInputA');
    const fileInputB = document.getElementById('fileInputB');

    if (!fileInputA.files.length || !fileInputB.files.length) {
        alert('Veuillez sélectionner les deux fichiers.');
        return;
    }

    const fileA = fileInputA.files[0];
    const fileB = fileInputB.files[0];

    const readerA = new FileReader();
    const readerB = new FileReader();

    const fileTypeA = fileA.name.split('.').pop().toLowerCase();
    const fileTypeB = fileB.name.split('.').pop().toLowerCase();

    // Charger les fichiers A et B, puis comparer
    readerA.onload = (eventA) => {
        dataA = processFile(eventA, fileTypeA);

        readerB.onload = (eventB) => {
            dataB = processFile(eventB, fileTypeB);

            // Une fois les fichiers lus, comparer les données
            const differences = compareFiles(dataA, dataB);

            // Afficher les résultats
            displayResults(differences);
        };
        readerB.readAsBinaryString(fileB);
    };
    readerA.readAsBinaryString(fileA);
});

function processFile(event, fileType) {
    let data;

    if (fileType === 'csv' || fileType === 'tsv') {
        const delimiter = fileType === 'csv' ? ',' : '\t';
        const parsed = Papa.parse(event.target.result, {
            delimiter: delimiter,
            header: false,
            skipEmptyLines: true,
        });
        data = parsed.data;
    } else if (fileType === 'xlsx' || fileType === 'xls') {
        const workbook = XLSX.read(event.target.result, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        // Nettoyer les données
        data = data.filter(row => row.length > 0);
        data = data.map(row => row.map(cell => (cell !== null && cell !== undefined) ? String(cell) : ''));
    } else {
        alert('Format de fichier non pris en charge.');
        return [];
    }

    return data;
}

function compareFiles(dataA, dataB) {
    const idsA = new Set(dataA.map(row => row[0])); // Supposons que la première colonne contient l'identifiant
    return dataB.filter(row => !idsA.has(row[0]));
}

function displayResults(differences) {
    const resultDiv = document.getElementById('result');
    if (differences.length === 0) {
        resultDiv.innerHTML = '<p>Aucun enregistrement unique trouvé dans le fichier B.</p>';
    } else {
        resultDiv.innerHTML = '<p>Différences :</p>';
        const list = document.createElement('ul');
        differences.forEach(row => {
            const listItem = document.createElement('li');
            listItem.textContent = row.join(', ');
            list.appendChild(listItem);
        });
        resultDiv.appendChild(list);
    }
}