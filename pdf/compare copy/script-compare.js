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
        data = parsed.data.flat(); // Aplatir les données si elles sont sur plusieurs colonnes
    } else if (fileType === 'xlsx' || fileType === 'xls') {
        const workbook = XLSX.read(event.target.result, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        data = data.flat().filter(cell => cell); // Aplatir et nettoyer les données
    } else {
        alert('Format de fichier non pris en charge.');
        return [];
    }

    return data.map(cell => String(cell).trim()); // Retourner les données sous forme de chaînes nettoyées
}

function compareFiles(dataA, dataB) {
    const setA = new Set(dataA); // Identifiants uniques dans A
    const setB = new Set(dataB); // Identifiants uniques dans B

    // Trouver les éléments dans A mais pas dans B, et vice versa
    const uniqueToA = [...setA].filter(item => !setB.has(item));
    const uniqueToB = [...setB].filter(item => !setA.has(item));

    return { uniqueToA, uniqueToB };
}

function displayResults(differences) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Réinitialiser les résultats précédents

    const { uniqueToA, uniqueToB } = differences;

    if (uniqueToA.length === 0 && uniqueToB.length === 0) {
        resultDiv.innerHTML = '<p>Aucun enregistrement unique trouvé dans les fichiers.</p>';
        return;
    }

    // Créer un tableau pour afficher les résultats
    const table = document.createElement('table');
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';
    table.style.marginTop = '10px';
    table.style.border = '1px solid black';

    // Ajouter les en-têtes
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th style="border: 1px solid black; padding: 5px; text-align: left;">Uniquement dans A</th>
        <th style="border: 1px solid black; padding: 5px; text-align: left;">Uniquement dans B</th>
    `;
    table.appendChild(headerRow);

    // Trouver la longueur maximale entre les deux listes
    const maxRows = Math.max(uniqueToA.length, uniqueToB.length);

    // Ajouter une ligne par donnée
    for (let i = 0; i < maxRows; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="border: 1px solid black; padding: 5px;">${uniqueToA[i] || ''}</td>
            <td style="border: 1px solid black; padding: 5px;">${uniqueToB[i] || ''}</td>
        `;
        table.appendChild(row);
    }

    resultDiv.appendChild(table);
}
