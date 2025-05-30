  let rows;
  let data;
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
      data = data.filter(row => row.length > 0);
      data = data.map(row => row.map(cell => (cell !== null && cell !== undefined) ? String(cell) : ''));
    } else {
      alert('Format de fichier non pris en charge.');
      return;
    }

    if (!data || data.length === 0) {
      alert('Le fichier est vide ou corrompu.');
      return;
    }

    rows = data[0].length;
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
    nameCell.id = `name_${index}`;
    nameCell.textContent = header;
    row.appendChild(nameCell);

    const cellCheckbox = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'checkbox';
    checkbox.id = `checkbox_${index}`;
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
    cellNumber.appendChild(number);
    row.appendChild(cellNumber);
      
    const cellColor = document.createElement('td');
    const textColor = document.createElement('input');
    textColor.type = 'color';
    textColor.className = 'color';
    textColor.id = `color_${index}`;
    textColor.value = '#000000';
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
    cellSize.appendChild(textSize);
    row.appendChild(cellSize);
    
    const cellWeight = document.createElement('td');         
    const textWeight = document.createElement('input');
    textWeight.type = 'checkbox';
    textWeight.className = 'checkbox';
    textWeight.id = `weight_${index}`;
    textWeight.checked = false;
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
    /*
    1 -> left
    2 -> center
    3 -> right
    */
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
  alert('Création du fichier JSON pour permettre l\'édition des étiquettes\n\nLes étiquettes PDF seront générées ici.');
  // Intégration de la logique de génération de PDF avec la bibliothèque jsPDF ou similaire

  const cartes = [];

  for(let i = 0; i <= rows-1; i++){
    id = i,
    name = document.getElementById(`name_${i}`).innerHTML;
    checkbox = document.getElementById(`checkbox_${i}`).checked;
    number = parseInt(document.getElementById(`number_${i}`).value, 10);
    color = document.getElementById(`color_${i}`).value;
    size = parseInt(document.getElementById(`size_${i}`).value, 10);
    weight = document.getElementById(`weight_${i}`).checked ? true : false;
    position = parseInt(document.getElementById(`position_${i}`).value, 10);
    line = parseInt(document.getElementById(`line_${i}`).value, 10);
    text = document.getElementById(`text_${i}`).value;
    const carte = { name, checkbox, number, color, size, weight, position, line, text };

    cartes.push(carte);
  }

  // Fonction pour structurer les données des étiquettes
  const structureDocs = (data, cartes) => {
    //const dataRows = docs.slice(1); // Exclure les en-têtes
//console.log(data)
    return data.map((row) => {
      const structured = {};

      cartes.forEach((label) => {
        if (label.checkbox && label.number !== null) {
          const columnIndex = label.number - 1;
          const lineKey = label.line;

          if (!structured[lineKey]) structured[lineKey] = [];
          structured[lineKey].push({
            id: label.id,
            name: label.name,
            value: `${label.text}${row[columnIndex]}`,
            size: label.size,
            color: label.color,
            weight: label.weight,
            position: label.position,
            line: label.line,
          });
        }
      });

      return structured; // Retourne les cartes regroupés par ligne
    });
  };

  // Structurer les données
  const structuredDocs = structureDocs(data, cartes);

  // Générer le PDF
  generatePDF(structuredDocs, cartes);
});

function drawLabel(pdf, data, cartes, x, y) {
  const lineSpacing = 5; // Espacement vertical entre les lignes d'une étiquette
//console.log(data)
  Object.keys(data).forEach((lineKey) => {
    const lineLabels = data[lineKey]; // Les labels sur une même ligne
    let currentXOffset = x + 5; // Position horizontale initiale pour cette ligne
    let yOffset = y + lineSpacing * (lineKey - 1); // Position verticale de la ligne

    let totalLineWidth = 0;
    let totalValue = '';

    lineLabels.forEach((label) => {
      const { value } = label;
      totalValue += ` ${value} `;
      totalLineWidth += pdf.getTextWidth(value) + 2; // Ajouter la largeur de chaque label + espacement
    });

  //console.log(lineLabels)
    
    lineLabels.forEach((label) => {
      //console.log(label)
      const { value, color, size, weight, position } = label;

      // Style du texte
      const fontWeight = weight ? "bold" : "normal";
      const fontSize = size;
      const [r, g, b] = color.match(/\w\w/g).map((c) => parseInt(c, 16));

      pdf.setFont("Helvetica", fontWeight);
      pdf.setFontSize(fontSize);
      pdf.setTextColor(r, g, b);

      switch (position) {
          case 1:
              // Alignement à gauche
              pdf.text(totalValue, currentXOffset, yOffset);
              break;
          case 2:
              // Alignement central
              pdf.text(totalValue, x + 85 / 2, yOffset, { align: 'center' });
              break;
          case 3:
              // Alignement à droite
              pdf.text(totalValue, x + 85 - currentXOffset, yOffset, { align: 'right' });
              break;
          default:
              break;
          }

      currentXOffset += pdf.getTextWidth(value) + 2; // Ajouter un espacement entre les labels
    });
  });
}

// Fonction pour générer le PDF
function generatePDF(docData, cartes) {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  const labelWidth = 85;
  const labelHeight = 54;
  const marginX = 20;
  const marginY = 12;
  const spacingX = 5;
  const spacingY = 5;
  const columns = 2;

  let x = marginX;
  let y = marginY;

  docData.forEach((data, index) => {
    pdf.rect(x, y, labelWidth, labelHeight); // Dessiner un cadre pour l'étiquette
    drawLabel(pdf, data, cartes, x, y + 5); // Dessiner le contenu de l'étiquette

    x += labelWidth + spacingX;

    if ((index + 1) % columns === 0) {
      x = marginX;
      y += labelHeight + spacingY;
    }

    if (y + labelHeight > pdf.internal.pageSize.height - marginY) {
      pdf.addPage(); // Ajouter une nouvelle page si nécessaire
      x = marginX;
      y = marginY;
    }
  });

  pdf.save("etiquettes.pdf");

  location.reload(); 
}

