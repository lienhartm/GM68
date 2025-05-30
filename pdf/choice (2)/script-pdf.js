  document.getElementById('import').addEventListener('click', () => {
  const fileInput = document.getElementById('fileInput');
  if (!fileInput.files.length) {
    alert('Veuillez sélectionner un fichier.');
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();
  // Déterminer le type de fichier
  const fileType = file.name.split('.').pop().toLowerCase();

  reader.onload = (event) => {
    let data;
    console.log("read");
    // Traitement selon le type de fichier
    if (fileType === 'csv' || fileType === 'tsv') {
      // Conversion des fichiers CSV/TSV en tableau
      const delimiter = fileType === 'csv' ? ',' : '\t';
      const content = event.target.result;
      const parsed = Papa.parse(content, {
        delimiter: delimiter,
        header: false, // Indique si la première ligne contient des noms de colonnes
        skipEmptyLines: true,
      });
      data = parsed.data;
    } else if (fileType === 'xlsx' || fileType === 'xls') {
      // Lecture des fichiers Excel avec SheetJS
      const workbook = XLSX.read(event.target.result, { type: 'binary' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      // Nettoyer les données
      //data = data.filter(row => row.length > 0);
      //data = data.map(row => row.map(cell => (cell !== null && cell !== undefined) ? String(cell) : ''));
    } else {
      alert('Format de fichier non pris en charge.');
      return;
    }

    if (!data || data.length === 0) {
      alert('Le fichier est vide ou corrompu.');
      return;
    }
    console.log("data");
    displayColumnSelection(data[0]);

  };

  if (fileType === 'xlsx' || fileType === 'xls') {
    reader.readAsBinaryString(file);
  } else {
    reader.readAsText(file);
  }

});

function displayColumnSelection(headers) {
  const columnSelectionDiv = document.getElementById('columnSelection');
  const checkboxContainer = document.getElementById('checkboxContainer');
  checkboxContainer.innerHTML = '';

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  // En-têtes
  const headerRow = document.createElement('tr');
  ['Nom de colonne', 'Afficher', 'Ordre', 'Couleur', 'Taille', 'Gras', 'Position', 'Ligne', 'Texte'].forEach(text => {
    const th = document.createElement('th');
    th.textContent = text;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  
  headers.forEach((header, index) => {
    const row = document.createElement('tr');

    // Nom de la colonne
    const nameCell = document.createElement('td');
    nameCell.textContent = header;
    row.appendChild(nameCell);

    const cellCheckbox = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'checkbox';
    checkbox.id = `checkbox_${index}`;
    checkbox.value = header;
    checkbox.checked = false;
    checkbox.style.border = '1px solid black';
    checkbox.style.padding = '5px';
    cellCheckbox.appendChild(checkbox);
    row.appendChild(cellCheckbox);
      
    const cellNumber = document.createElement('td');
    const number = document.createElement('input');
    number.type = 'number';
    number.className = 'number';
    number.id = `number_${index}`;       
    number.min = 1;
    number.style.width = '50px';
    //number.max = `${selectedColumns.length}`;
    cellNumber.appendChild(number);
    row.appendChild(cellNumber);
      
    const cellColor = document.createElement('td');
    const textColor = document.createElement('input');
    textColor.type = 'color';
    textColor.className = 'color';
    textColor.id = `color_${index}`;
    textColor.value = '#000000';
    textColor.addEventListener('input', (e) => {
      title.style.color = e.target.value;
    });
    cellColor.appendChild(textColor);
    row.appendChild(cellColor);
    
    const cellSize = document.createElement('td');    
    const textSize = document.createElement('input');
    textSize.type = 'number';
    textSize.className = 'number';
    textSize.id = `size_${index}`;
    textSize.min = 6;
    textSize.max = 20;
    textSize.value = 12;
    textSize.addEventListener('input', (e) => {
      title.style.fontSize = `${e.target.value}px`;
    });
    cellSize.appendChild(textSize);
    row.appendChild(cellSize);
    
    const cellWeight = document.createElement('td');         
    const textWeight = document.createElement('input');
    textWeight.type = 'checkbox';
    textWeight.className = 'checkbox';
    textWeight.id = `weight_${index}`;
    textWeight.checked = false;
    textWeight.addEventListener('input', (e) => {
      title.style.fontWeight = `${e.target.value}` ? '900' : '100';
    });
    cellWeight.appendChild(textWeight);
    row.appendChild(cellWeight);
    
    const cellPosition = document.createElement('td');
    const textPosition = document.createElement('input');
    textPosition.type = 'range';
    textPosition.className = 'range';
    textPosition.id = `position_${index}`;
    textPosition.min = 1;
    textPosition.max = 3;
    textPosition.value = 2;
    switch(textPosition.value) {
      case 1:
      title.style.float = 'left';
      break;
      case 2:
      title.style.float = 'center';
      break;
      case 3:
      title.style.float = 'right';
      break;
    }
    cellPosition.appendChild(textPosition);
    row.appendChild(cellPosition);
    
    const cellLine = document.createElement('td');
    const textLine = document.createElement('input');
    textLine.type = 'number';
    textLine.className = 'number';
    textLine.id = `line_${index}`;
    textLine.min = 1;
    textLine.max = 7;
    textLine.value = 0;
    textLine.addEventListener('input', (e) => {
      // console.log(e.target.value);
    });
    cellLine.appendChild(textLine);
    row.appendChild(cellLine);
    
    const cellText = document.createElement('td');
    const textText = document.createElement('input');
    textText.type = 'text';
    textText.className = 'text';
    textText.id = `text_${index}`;
    textText.value = "";
    cellText.appendChild(textText);
    row.appendChild(cellText);

    tbody.appendChild(row);

  });

  table.appendChild(thead);
  table.appendChild(tbody);
  checkboxContainer.appendChild(table);
  columnSelectionDiv.style.display = 'block';

}

document.getElementById('generate').addEventListener('click', () => {
  alert('Les étiquettes PDF seront générées ici.');
  // Intégration de la logique de génération de PDF avec la bibliothèque jsPDF ou similaire
});
