document.addEventListener('DOMContentLoaded', () => {
    const fileCartesInput = document.getElementById('file-cartes');
    const btnGenererPdf = document.getElementById('btn-generer-pdf');
    const pdfPreview = document.getElementById('pdf-preview');

    // Lecture du fichier Excel, CSV ou TSV via SheetJS
    function lireFichierCartes(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    const json = XLSX.utils.sheet_to_json(firstSheet, { defval: "" });
                    resolve(json);
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = () => reject(new Error("Erreur de lecture du fichier"));
            reader.readAsArrayBuffer(file);
        });
    }

    // Extraction souple des colonnes (insensible à la casse et aux accents)
    function normaliser(str) {
        return String(str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
    }

    function getValeur(row, nomsPossibles) {
        const keys = Object.keys(row);
        for (const nom of nomsPossibles) {
            const target = normaliser(nom);
            const found = keys.find(k => normaliser(k) === target);
            if (found && row[found] !== "") {
                return String(row[found]).trim();
            }
        }
        return "";
    }

    // Génération du PDF au clic
    btnGenererPdf.addEventListener('click', async () => {
        const file = fileCartesInput.files[0];
        if (!file) {
            alert("Veuillez d'abord sélectionner un fichier (Excel, CSV ou TSV).");
            return;
        }

        try {
            const adherents = await lireFichierCartes(file);
            if (!adherents.length) {
                alert("Le fichier semble vide.");
                return;
            }

            // 1. Initialisation du document A4 (210 x 297 mm)
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // 2. Constantes géométriques exactes (Page 5 du PDF)
            const MARGE_GAUCHE = 20; // 2 cm
            const MARGE_HAUTE = 12;  // 1,2 cm
            const LARGEUR_CARTE = 85; // 8,5 cm
            const HAUTEUR_CARTE = 54; // 5,4 cm
            const COLONNES = 2;
            const LIGNES = 5;
            const CARTES_PAR_PAGE = COLONNES * LIGNES; // 10 cartes

            // Optionnel : mettre à true si tu imprimes sur papier blanc (dessine le fond et les repères)
            // Laisser à false si tu imprimes sur les planches pré-imprimées Générations Mouvement
            const MODE_PAPIER_BLANC = false; 

            adherents.forEach((row, index) => {
                // Ajouter une nouvelle page toutes les 10 cartes
                if (index > 0 && index % CARTES_PAR_PAGE === 0) {
                    doc.addPage();
                }

                // Position sur la page courante (0 à 9)
                const indexSurPage = index % CARTES_PAR_PAGE;
                const col = indexSurPage % COLONNES;          // 0 (gauche) ou 1 (droite)
                const ligne = Math.floor(indexSurPage / COLONNES); // 0 à 4

                // Coordonnées du coin haut-gauche (x, y) de la carte en mm
                const x = MARGE_GAUCHE + (col * LARGEUR_CARTE);
                const y = MARGE_HAUTE + (ligne * HAUTEUR_CARTE);

                // Récupération des informations adaptées à tes colonnes CSV/SAGA
                const numAdherent = getValeur(row, ['ID du Contact', 'Numéro', 'Numero', 'N°', 'ID']);
                const prenom = getValeur(row, ['Prénom', 'Prenom']);
                const nom = getValeur(row, ['Nom']).toUpperCase();
                const numClub = getValeur(row, ['Numéro club', 'Numero club']);
                const nomClub = getValeur(row, ['Nom du club', 'Club', 'Association']);
                const club = `${numClub} ${nomClub}`.trim(); // Donne ex: "68014 FLEURS D'AUTOMNE"
                const ville = getValeur(row, ['Ville du club', 'Ville', 'Commune']).toUpperCase();


                // Si papier blanc : dessine les repères et textes fixes (Page 4)
                if (MODE_PAPIER_BLANC) {
                    doc.setDrawColor(180);
                    doc.setLineDashPattern([2, 2], 0);
                    doc.rect(x, y, LARGEUR_CARTE, HAUTEUR_CARTE);
                    doc.setLineDashPattern([], 0);

                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(10);
                    doc.setTextColor(80);
                    doc.text("Carte adhérent 2025 n°", x + 3, y + 7);

                    doc.setFontSize(6.5);
                    doc.text("Mutuaide assistance 01 45 16 66 05 (de l'étranger +33 1 45 16 66 05)", x + (LARGEUR_CARTE / 2), y + HAUTEUR_CARTE - 3, { align: "center" });
                }

                // --- PLACEMENT DES TEXTES VARIABLES (selon maquette Page 4) ---
                doc.setTextColor(0, 0, 0);

                // 1. Numéro d'adhérent en haut à droite de la mention "Carte adhérent 2025 n°"
                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);
                doc.text(numAdherent, x + 44, y + 7);

                // 2. Prénom NOM en gras centré au milieu de la carte
                doc.setFont("helvetica", "bold");
                doc.setFontSize(12);
                const nomComplet = `${prenom} ${nom}`.trim();
                doc.text(nomComplet, x + (LARGEUR_CARTE / 2), y + 23, { align: "center" });

                // 3. Nom/Numéro du club + Ville alignés à gauche en bas (Page 4)
                doc.setFont("helvetica", "bold");
                doc.setFontSize(9.5);
                if (club) {
                    doc.text(club, x + 6, y + 36);
                }

                doc.setFont("helvetica", "normal");
                doc.setFontSize(9.5);
                if (ville) {
                    doc.text(ville, x + 6, y + 41);
                }
            });

            // 3. Affichage dans l'iframe de prévisualisation (Page 3)
            const pdfBlobUrl = doc.output('bloburl');
            pdfPreview.src = pdfBlobUrl;

        } catch (error) {
            console.error(error);
            alert("Erreur lors de la génération du PDF. Vérifiez le format de votre fichier.");
        }
    });
});
