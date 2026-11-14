document.addEventListener('DOMContentLoaded', () => {
    const fileClubInput = document.getElementById('file-club');
    const fileSagaInput = document.getElementById('file-saga');
    const btnComparer = document.getElementById('btn-comparer');

    // Fonction pour lire un fichier (xlsx, xls, csv, tsv) et le convertir en JSON
    function lireFichierTableau(file) {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject(new Error("Fichier manquant"));
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    // CORRECTION ICI : [0] pour cibler le premier onglet du classeur
                    const firstSheetName = workbook.SheetNames[0]; 
                    const worksheet = workbook.Sheets[firstSheetName];
                    const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
                    resolve(json);
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = () => reject(new Error("Erreur lors de la lecture du fichier"));
            reader.readAsArrayBuffer(file);
        });
    }

    // Normalise une chaîne (sans accents, en minuscules, sans espaces superflus)
    function normaliserTexte(str) {
        if (!str) return "";
        return String(str)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim()
            .toLowerCase();
    }

    // Récupère la valeur d'une colonne même si la casse ou les accents diffèrent légèrement
    function getColonne(row, possiblesNoms) {
        const keys = Object.keys(row);
        for (const possible of possiblesNoms) {
            const target = normaliserTexte(possible);
            const foundKey = keys.find(k => normaliserTexte(k) === target);
            if (foundKey && row[foundKey] !== "") {
                return String(row[foundKey]).trim();
            }
        }
        return "";
    }

    // Crée une clé unique "nom|prenom" pour identifier un adhérent
    function creerCleAdherent(row) {
        const nom = normaliserTexte(getColonne(row, ['Nom', 'Nom de famille', 'NOM']));
        const prenom = normaliserTexte(getColonne(row, ['Prénom', 'Prenom', 'PRENOM', 'Prénoms']));
        return `${nom}|${prenom}`;
    }

    // Lancement de la comparaison au clic
    btnComparer.addEventListener('click', async () => {
        // CORRECTION ICI : [0] pour récupérer le premier fichier sélectionné
        const fileClub = fileClubInput.files[0];
        const fileSaga = fileSagaInput.files[0];

        if (!fileClub || !fileSaga) {
            alert("Veuillez sélectionner les deux fichiers (Liste du club et Liste SAGA) avant de comparer.");
            return;
        }

        try {
            const [dataClub, dataSaga] = await Promise.all([
                lireFichierTableau(fileClub),
                lireFichierTableau(fileSaga)
            ]);

            const clesSaga = new Set(dataSaga.map(creerCleAdherent).filter(cle => cle !== "|"));

            const nouveaux = [];
            const anciensClub = [];
            const anciensSaga = [];

            // 1. Analyser la liste du Club par rapport à SAGA
            dataClub.forEach(row => {
                const cle = creerCleAdherent(row);
                if (cle === "|") return;

                if (!clesSaga.has(cle)) {
                    nouveaux.push(row);
                } else {
                    anciensClub.push(row);
                }
            });

            // 2. Lister les membres déjà présents dans SAGA
            dataSaga.forEach(row => {
                const cle = creerCleAdherent(row);
                if (cle === "|") return;
                anciensSaga.push(row);
            });

            afficherResultats(nouveaux, anciensClub, anciensSaga);

        } catch (error) {
            console.error("Détail de l'erreur :", error);
            alert("Impossible de lire l'un des fichiers : " + error.message);
        }
    });

    // Mise à jour de l'interface
    function afficherResultats(nouveaux, anciensClub, anciensSaga) {
        const listNouveauxEl = document.getElementById('list-nouveaux');
        const listAnciensClubEl = document.getElementById('list-anciens-club');
        const listAnciensSagaEl = document.getElementById('list-anciens-saga');

        document.getElementById('count-nouveaux').textContent = nouveaux.length;
        document.getElementById('count-anciens-club').textContent = anciensClub.length;
        document.getElementById('count-anciens-saga').textContent = anciensSaga.length;

        listNouveauxEl.innerHTML = nouveaux.map(row => {
            const prenom = getColonne(row, ['Prénom', 'Prenom']);
            const nom = getColonne(row, ['Nom']).toUpperCase();
            const adresse = getColonne(row, ['Adresse', 'Rue', 'Adresse 1']);
            const cp = getColonne(row, ['CP', 'Code postal', 'Code_Postal']);
            const ville = getColonne(row, ['Ville', 'Commune']).toUpperCase();
            const tel = getColonne(row, ['Téléphone', 'Telephone', 'Tel', 'Portable', 'Mobile']);
            const email = getColonne(row, ['Email', 'E-mail', 'Mail', 'Courriel']);

            let bloc = `<strong>${prenom} ${nom}</strong><br>`;
            if (adresse) bloc += `${adresse}<br>`;
            if (cp || ville) bloc += `${cp} ${ville}<br>`;
            if (tel) bloc += `${tel}<br>`;
            if (email) bloc += `${email}<br>`;
            
            return `<div style="margin-bottom: 15px;">${bloc}</div>`;
        }).join('');

        listAnciensClubEl.innerHTML = anciensClub.map(row => {
            const prenom = getColonne(row, ['Prénom', 'Prenom']);
            const nom = getColonne(row, ['Nom']).toUpperCase();
            return `<li>${prenom} ${nom}</li>`;
        }).join('');

        listAnciensSagaEl.innerHTML = anciensSaga.map(row => {
            const prenom = getColonne(row, ['Prénom', 'Prenom']);
            const nom = getColonne(row, ['Nom']).toUpperCase();
            return `<li>${prenom} ${nom}</li>`;
        }).join('');
    }
});
