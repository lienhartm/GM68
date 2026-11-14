# GM68

[Your site is live](https://lienhartm.github.io/GM68/)

## Lancement de l'application

Aucune installation serveur n'est requise : toutes les données sont traitées localement dans le navigateur pour garantir la confidentialité des adhérents (RGPD).

1. Cloner ou télécharger ce dépôt.
2. Ouvrir simplement le fichier `index.html` dans un navigateur web moderne (Chrome, Firefox, Edge, Safari).

## Format des fichiers importés

L'application accepte les fichiers **Excel (`.xlsx`, `.xls`)**, **CSV (`.csv`)** et **TSV (`.tsv`)** contenant les colonnes suivantes :
`ID du Contact`, `Nom`, `Prénom`, `Adresse`, `Code postal`, `Ville`, `Numéro club`, `Nom du club`, `Ville du club`, `Détail` *(ainsi que Téléphone / Email si présents)*.

### Générateur de liste pour effectuer les tests :

- [Apple](./testListGenerator/testListGenerateur.command)
- [Linux](./testListGenerator/testListGenerateur.sh)
- [Windows](./testListGenerator/testListGenerateur.bat)



## Devis

[ => Document disponible](./images/CahierDesCharges.pdf)

Ce document PDF de 5 pages présente la maquette fonctionnelle d'un outil web d'aide à l'administration et à la gestion conçu pour l'association Générations Mouvement.

Voici l'analyse détaillée des fonctionnalités et de la structure du projet :

### 1. Architecture générale (Page 1)

L'interface s'articule autour d'un menu latéral gauche composé de trois onglets principaux :

- Comparateur des listes (en vert)
- Impression de cartes (en rouge)
- Mémo / Pratique (en jaune — écran non détaillé dans le PDF)

### 2. Le comparateur de listes (Page 2)

Cet outil permet de croiser deux fichiers d'adhérents : la « Liste du club » et la « Liste 2 (SAGA) » (le logiciel de gestion de la fédération). Le résultat s'affiche en trois colonnes :

- Nouveaux : Affiche les adhérents présents dans une liste mais absents de l'autre. Le cahier des charges précise que leurs coordonnées complètes (nom, adresse, téléphone, e-mail) doivent s'afficher ici afin de pouvoir les copier-coller facilement.
- Anciens (2 colonnes) : Affiche uniquement les noms et prénoms des membres déjà connus dans chaque liste, servant uniquement de contrôle visuel rapide.
- Note technique : Il y a une petite coquille typographique à corriger dans le titre de cette page (« Comprer des listes » au lieu de « Comparer des listes »).

### 3. Le générateur de cartes d'adhérents (Pages 3, 4 et 5)

Cette section permet de générer automatiquement un fichier PDF prêt à imprimer à partir d'un fichier de données importé (Excel, CSV ou TSV).

- Prévisualisation (Page 3) : L'interface intègre un lecteur PDF permettant de visualiser le rendu de la planche avant l'impression.

- Mise en page d'une carte (Page 4) : L'outil vient remplir un modèle préexistant (« Carte adhérent 2025 n° » avec la mention Mutuaide assistance en bas). Il ajoute dynamiquement :
  
>	- Le numéro d'adhérent en haut à droite.
>	- Le Prénom et NOM en gras au centre.
>	- Le numéro de club + nom du club ainsi que la commune en dessous.

- Gabarit d'impression (Page 5) : Cette page fournit les cotes exactes (en cm) pour le développement du générateur PDF (type jsPDF ou PDFKit côté client, ou FPDF/WeasyPrint côté serveur) sur une feuille A4 de 10 cartes (2 colonnes × 5 lignes) :
  
>	- Dimensions d'une carte : 8,5 cm de large × 5,4 cm de haut (format carte de visite standard).
>	- Marges de la page : 1,2 cm en haut et en bas ; 2 cm à gauche et à droite.
>	- Espacement entre les colonnes : 4,5 cm ? (Attention : sur le schéma page 5, la cote de 4,5 cm est indiquée sur la largeur de la deuxième colonne, ce qui semble être une erreur de cotation sur la maquette puisque 2 cm + 8,5 cm + 8,5 cm + 2 cm = 21 cm, soit la largeur exacte d'une feuille A4 sans espace central.)
