document.getElementById("generatePdf").addEventListener("click", () => {
    // Fonction pour structurer les données des étiquettes
    console.log(docs)
    console.log(labels)
    const structureDocs = (docs, labels) => {
      //const dataRows = docs.slice(1); // Exclure les en-têtes
  
      return docs.map((row) => {
        const structured = {};
  
        labels.forEach((label) => {
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
  
        return structured; // Retourne les labels regroupés par ligne
      });
    };
  
    // Structurer les données
    const structuredDocs = structureDocs(docs, labels);

    // Générer le PDF
    generatePDF(structuredDocs, labels);
  });
  
  function drawLabel(pdf, data, labels, x, y) {
    const lineSpacing = 5; // Espacement vertical entre les lignes d'une étiquette
  
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
      
      lineLabels.forEach((label) => {
        
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
  function generatePDF(docData, labels) {
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
      drawLabel(pdf, data, labels, x, y + 5); // Dessiner le contenu de l'étiquette
  
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
  }

//  docs    =>  documents
//  labels  =>  paramètres
  
  // Données des documents
  const docs = 
    [
        [
          "ID du Contact",
          "Nom",
          "Prénom",
          "Adresse",
          "Code postal",
          "Ville",
          "Numéro club",
          "Nom du club",
          "Ville du club",
          "Détail"
        ],
        [
          "11525917",
          "BOSSHARD",
          "Doris",
          "5,rue du Mauchen",
          "68320",
          "Grussenheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/11525917?vendorId=303231"
        ],
        [
          "12210711",
          "BOSSHARD-CLERGUE",
          "Isabelle",
          "17,rue des Houblons",
          "68320",
          "Grussenheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/12210711?vendorId=303231"
        ],
        [
          "12203586",
          "BUFFARD",
          "Christiane",
          "24 Route de Colmar",
          "68320",
          "Grussenheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/12203586?vendorId=303231"
        ],
        [
          "6724654",
          "DANNER",
          "Annette",
          "51 route de Colmar",
          "68320",
          "Grussenheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/6724654?vendorId=303231"
        ],
        [
          "9304618",
          "DIETSCH",
          "François",
          "14 Rue De La Concorde",
          "68000",
          "Colmar",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/9304618?vendorId=303231"
        ],
        [
          "6724656",
          "DIETSCH",
          "Lydia",
          "Grand rue",
          "68320",
          "Grussenheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/6724656?vendorId=303231"
        ],
        [
          "6724657",
          "DOLT",
          "Marcel",
          "18 rue Principale",
          "67390",
          "Artolsheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/6724657?vendorId=303231"
        ],
        [
          "6724658",
          "DOLT",
          "Marie-Andrée",
          "18 rue Principale",
          "67390",
          "Artolsheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/6724658?vendorId=303231"
        ],
        [
          "9304639",
          "FOESCHTERLE",
          "Laurette",
          "14 Rue De La 2e Division Blindée",
          "68320",
          "Grussenheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/9304639?vendorId=303231"
        ],
        [
          "6724663",
          "GASCHY",
          "Joseph",
          "Grande rue",
          "68320",
          "Grussenheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/6724663?vendorId=303231"
        ],
        [
          "6724665",
          "GOETZ",
          "Christine",
          "1 rue de la Libération",
          "68320",
          "Grussenheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/6724665?vendorId=303231"
        ],
        [
          "9304647",
          "GOETZ",
          "Geneviève",
          "05 Rue D'alsace",
          "68320",
          "Grussenheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/9304647?vendorId=303231"
        ],
        [
          "11718253",
          "GREYER",
          "Eugène",
          "4,rue du LT.Durrmeyer",
          "68320",
          "Jebsheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/11718253?vendorId=303231"
        ],
        [
          "11718261",
          "GREYER",
          "Fernande",
          "4,rue du LT.Durrmeyer",
          "68320",
          "Jebsheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/11718261?vendorId=303231"
        ],
        [
          "9304655",
          "GRUTTER",
          "Irène",
          "01 Rue Du stade",
          "68320",
          "Grussenheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/9304655?vendorId=303231"
        ],
        [
          "9304678",
          "GUTH",
          "Bernard",
          "09 Rue de la Libération",
          "68320",
          "Grussenheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/9304678?vendorId=303231"
        ],
        [
          "9304669",
          "GUTH",
          "Hélène",
          "09 Rue De La Libération",
          "68320",
          "Grussenheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/9304669?vendorId=303231"
        ],
        [
          "6724664",
          "GUTH",
          "Lucie",
          "33 rue des Vosges",
          "68320",
          "Grussenheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/6724664?vendorId=303231"
        ],
        [
          "11525920",
          "HABERKORN",
          "Simone",
          "10,rue la Paix",
          "68320",
          "Grussenheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/11525920?vendorId=303231"
        ],
        [
          "9304683",
          "HARTMANN",
          "François",
          "37c Rue De L'église",
          "67390",
          "Ohnenheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/9304683?vendorId=303231"
        ],
        [
          "9264454",
          "HAUMESSER",
          "Gérard",
          "6,grand-rue\t",
          "68320",
          "Grussenheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/9264454?vendorId=303231"
        ],
        [
          "9304726",
          "HAUMESSER",
          "Jean-Paul",
          "19 Route De Colmar",
          "68320",
          "Grussenheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/9304726?vendorId=303231"
        ],
        [
          "9304731",
          "HAUMESSER",
          "Marie-Louise",
          "19 Route De Colmar",
          "68320",
          "Grussenheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/9304731?vendorId=303231"
        ],
        [
          "9304737",
          "HAUMESSER",
          "Yvonne",
          "6 Grand' Rue",
          "68320",
          "Grussenheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/9304737?vendorId=303231"
        ],
        [
          "9730559",
          "HEITZLER",
          "Agnès",
          "15,grand-rue",
          "68320",
          "Grussenheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/9730559?vendorId=303231"
        ],
        [
          "11525901",
          "HEITZLER",
          "René",
          "15,grand-rue",
          "68320",
          "Grussenheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/11525901?vendorId=303231"
        ],
        [
          "6724671",
          "KLIPFEL",
          "Martin",
          "53 route de Colmar",
          "68320",
          "Grussenheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/6724671?vendorId=303231"
        ],
        [
          "6724672",
          "LOLL",
          "Anne",
          "13;rue Paul Verlaine",
          "68000",
          "Colmar",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/6724672?vendorId=303231"
        ],
        [
          "11053274",
          "LOLL",
          "Jacky",
          "13;rue Paul Verlaine",
          "68000",
          "Colmar",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/11053274?vendorId=303231"
        ],
        [
          "11053223",
          "MARIN",
          "Nicole",
          "59,route de Colmar",
          "68320",
          "Grussenheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/11053223?vendorId=303231"
        ],
        [
          "13451287",
          "OBERLÉ",
          "Jean-Charles",
          "8 Route De Colmar",
          "68320",
          "Grussenheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/13451287?vendorId=303231"
        ],
        [
          "6724674",
          "OBERLE",
          "Marie-Eve",
          "8 route de Colmar",
          "68320",
          "Grussenheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/6724674?vendorId=303231"
        ],
        [
          "9304748",
          "OBERT",
          "Claire",
          "09 Rue D'alsace",
          "68320",
          "Grussenheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/9304748?vendorId=303231"
        ],
        [
          "11785882",
          "PEROD",
          "Patricia",
          "Rue de la Blind",
          "68320",
          "Grussenheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/11785882?vendorId=303231"
        ],
        [
          "9304760",
          "RINDERKNECHT",
          "Fernand",
          "42 Route De Colmar",
          "68320",
          "Grussenheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/9304760?vendorId=303231"
        ],
        [
          "9304777",
          "RINDERKNECHT",
          "Madeleine",
          "42 Route De Colmar",
          "68320",
          "Grussenheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/9304777?vendorId=303231"
        ],
        [
          "11725295",
          "RISCH",
          "Mireille",
          "4,rue d'Alsace",
          "68320",
          "Grussenheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/11725295?vendorId=303231"
        ],
        [
          "11725299",
          "RISCH",
          "Paul",
          "4,rue d'Alsace",
          "68320",
          "Grussenheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/11725299?vendorId=303231"
        ],
        [
          "6724675",
          "ROSSI",
          "Fabienne",
          "8 rue Grillenbreit",
          "68000",
          "Colmar",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/6724675?vendorId=303231"
        ],
        [
          "6724676",
          "ROSSI",
          "Victor",
          "8 rue de Grillenbreit",
          "68000",
          "Colmar",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/6724676?vendorId=303231"
        ],
        [
          "9304634",
          "SANTENOY",
          "Jacqueline",
          "14 Rue De La Concorde",
          "68000",
          "Colmar",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/9304634?vendorId=303231"
        ],
        [
          "9550535",
          "SCHNEIDER",
          "Jean-Marie",
          "10,rue du Stade",
          "68320",
          "Grussenheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/9550535?vendorId=303231"
        ],
        [
          "6724677",
          "SCHONSTEIN",
          "Angèle",
          "10 rue des Vosges",
          "68320",
          "Grussenheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/6724677?vendorId=303231"
        ],
        [
          "6724679",
          "SCHONSTEIN",
          "Jean-Paul",
          "10 rue des Vosges",
          "68320",
          "Grussenheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/6724679?vendorId=303231"
        ],
        [
          "6724681",
          "SCHREIBER",
          "Monique",
          "21,Rue Oberfeld",
          "68320",
          "Riedwihr",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/6724681?vendorId=303231"
        ],
        [
          "9304780",
          "SIMLER",
          "Marie-Jo",
          "13 Rue Henri Schaedelin",
          "68000",
          "Colmar",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/9304780?vendorId=303231"
        ],
        [
          "11525905",
          "SIMLER",
          "Roland",
          "33,rue de la DB.",
          "68320",
          "Grussenheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/11525905?vendorId=303231"
        ],
        [
          "11785884",
          "SUTTER",
          "Christine",
          "1,chemin des Pruniers",
          "68320",
          "Grussenheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/11785884?vendorId=303231"
        ],
        [
          "9550550",
          "VOGEL",
          "Solange",
          "10,rue du Stade",
          "68320",
          "Grussenheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/9550550?vendorId=303231"
        ],
        [
          "6724687",
          "WEIXLER",
          "Colette",
          "26 rue de la 2ème DB",
          "68320",
          "Grussenheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/6724687?vendorId=303231"
        ],
        [
          "6724688",
          "WEIXLER",
          "Patrick",
          "26 rue de la 2ème DB",
          "68320",
          "Grussenheim",
          "68014",
          "FLEURS D'AUTOMNE",
          "GRUSSENHEIM",
          "https://fleurs-d-automne.assoconnect.com/contacts/admin/6724688?vendorId=303231"
        ]
      ];
  
  // Paramètres des labels
  const labels = 
  [
    {
    "id":0,
      "name": "ID du Contact",
      "checkbox": true,
      "number": 1,
      "color": "#000000",
      "size": 8,
      "weight": true,
      "position": 1,
      "line": 1,
      "text": "ID N° "
    },
    {
        "id": 1,
      "name": "Nom",
      "checkbox": true,
      "number": 3,
      "color": "#26a269",
      "size": 14,
      "weight": true,
      "position": 2,
      "line": 4,
      "text": ""
    },
    {
        "id":2,
      "name": "Prénom",
      "checkbox": true,
      "number": 2,
      "color": "#26a269",
      "size": 14,
      "weight": true,
      "position": 2,
      "line": 4,
      "text": ""
    },
    {
        "id":3,
      "name": "Adresse",
      "checkbox": true,
      "number": 4,
      "color": "#000000",
      "size": 12,
      "weight": false,
      "position": 2,
      "line": 6,
      "text": ""
    },
    {
        "id":4,
      "name": "Code postal",
      "checkbox": true,
      "number": 5,
      "color": "#000000",
      "size": 12,
      "weight": false,
      "position": 2,
      "line": 7,
      "text": ""
    },
    {
        "id":5,
      "name": "Ville",
      "checkbox": true,
      "number": 6,
      "color": "#000000",
      "size": 12,
      "weight": false,
      "position": 2,
      "line": 7,
      "text": ""
    },
    {
        "id":6,
      "name": "Numéro club",
      "checkbox": false,
      "number": null,
      "color": "#000000",
      "size": 12,
      "weight": false,
      "position": 2,
      "line": 0,
      "text": ""
    },
    {
        "id":7,
      "name": "Nom du club",
      "checkbox": false,
      "number": null,
      "color": "#000000",
      "size": 12,
      "weight": false,
      "position": 2,
      "line": 0,
      "text": ""
    },
    {
        "id":8,
      "name": "Ville du club",
      "checkbox": false,
      "number": null,
      "color": "#000000",
      "size": 12,
      "weight": false,
      "position": 2,
      "line": 0,
      "text": ""
    },
    {
        "id":9,
      "name": "Détail",
      "checkbox": false,
      "number": null,
      "color": "#000000",
      "size": 12,
      "weight": false,
      "position": 2,
      "line": 0,
      "text": ""
    }
  ]
  