document.getElementById('generatePdf').addEventListener('click', () => {
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

    if (!data || data.length < 1 || data[0].length < 6) {
      alert('Le fichier doit contenir au moins 6 colonnes : Identifiant(0), Nom(1), Prénom(2), Adresse(3), Code Postal(4), Ville(5).');
      return;
    }

    // Indices des colonnes nécessaires
    const columnMapping = {
      identifiant: 0, // Indice pour Identifiant
      nom: 1,         // Indice pour Prénom
      prenom: 2,      // Indice pour Nom
      adresse: 3,     // Indice pour Adresse
      codePostal: 4,  // Indice pour Code Postal
      ville: 5        // Indice pour Ville
    };

    // Initialiser jsPDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('portrait', 'mm', 'a4');

    // Dimensions des étiquettes
    const labelWidth = 85;  // Largeur d'une étiquette en mm
    const labelHeight = 54; // Hauteur d'une étiquette en mm
    const marginX = 20;     // Marge gauche
    const marginY = 12;     // Marge haute
    const spacingX = 5;     // Espace horizontal entre étiquettes
    const spacingY = 5;     // Espace vertical entre étiquettes
    const columns = 2;      // Nombre d'étiquettes par ligne

    let x = marginX;
    let y = marginY;

    const d = new Date();
    let year = d.getFullYear();

    data.forEach((row, index) => {
      // Contenu de l'étiquette
      const identifiantText = `Carte adhérent ${year} n° `;
      const identifiantValue = row[columnMapping.identifiant] || '';

      const prenomNom = `${row[columnMapping.nom] || ''} ${row[columnMapping.prenom] || ''}`;
      const adresse = `${row[columnMapping.adresse] || ''}`;
      const codePostalVille = `${row[columnMapping.codePostal] || ''} ${row[columnMapping.ville] || ''}`;

      // Dessiner l'étiquette
      //pdf.rect(x, y, labelWidth, labelHeight); // Dessiner un cadre
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      const centerX = x + labelWidth / 2; // Centre horizontal de l'étiquette
      pdf.text(identifiantText, x + 5, y + 10); // Text précédent l'identifiant
      pdf.setFont('helvetica', 'bold');
      pdf.text(identifiantValue, x + 5 + pdf.getTextWidth(identifiantText), y + 10);  // identifiant
      pdf.setFontSize(12);
      pdf.setTextColor(0, 128, 0); // Vert (R: 0, G: 128, B: 0)
      pdf.text(prenomNom, centerX, y + 25, { align: 'center' }); // Prénom + Nom
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0); // Vert (R: 0, G: 128, B: 0)
      pdf.text(adresse, centerX, y + 40, { align: 'center' });  // Adresse
      pdf.text(codePostalVille, centerX, y + 45, { align: 'center' });  // Code postal + Nom de ville
      // Passer à l'étiquette suivante
      x += labelWidth /*+spacingX*/; // espacement X
      if ((index + 1) % columns === 0) {
        x = marginX;
        y += labelHeight /*+spacingY*/; // espacement Y
      }

      // Ajouter une nouvelle page si nécessaire
      if (y + labelHeight > 297 - marginY) {
        pdf.addPage();
        x = marginX;
        y = marginY;
      }
    });

    // Sauvegarder le PDF
    pdf.save('etiquettes.pdf');

  };

  // Lire le fichier selon le type
  if (fileType === 'xlsx' || fileType === 'xls') {
    reader.readAsBinaryString(file);
  } else {
    reader.readAsText(file);
  }
});
