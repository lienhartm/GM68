#!/bin/zsh
# Se place automatiquement dans le dossier où se trouve ce fichier .command
cd "$(dirname "$0")"

echo "Génération des fichiers de test (CSV, TSV, XLSX)..."

python3 - << 'EOF'
import csv, zipfile
from xml.sax.saxutils import escape

headers = [
    "ID du Contact", "Nom", "Prénom", "Adresse", "Code postal",
    "Ville", "Numéro club", "Nom du club", "Ville du club", "Détail"
]

adherents_a = [
    ["11525917", "BOSSHARD", "Doris", "12 rue des Vignes", "68320", "GRUSSENHEIM", "68014", "FLEURS D'AUTOMNE", "GRUSSENHEIM", "Renouvellement 2025"],
    ["12210711", "BOSSHARD-CLERGUE", "Isabelle", "12 rue des Vignes", "68320", "GRUSSENHEIM", "68014", "FLEURS D'AUTOMNE", "GRUSSENHEIM", "Conjoint"],
    ["12203586", "BUFFARD", "Christiane", "4 impasse des Lilas", "68320", "GRUSSENHEIM", "68014", "FLEURS D'AUTOMNE", "GRUSSENHEIM", "Cotisation payée"],
    ["6724654",  "DANNER", "Annette", "27 route de Colmar", "68320", "GRUSSENHEIM", "68014", "FLEURS D'AUTOMNE", "GRUSSENHEIM", ""],
    ["9304618",  "DIETSCH", "François", "8 rue de l'Église", "68320", "GRUSSENHEIM", "68014", "FLEURS D'AUTOMNE", "GRUSSENHEIM", "Membre bureau"],
    ["6724656",  "DIETSCH", "Lydia", "8 rue de l'Église", "68320", "GRUSSENHEIM", "68014", "FLEURS D'AUTOMNE", "GRUSSENHEIM", ""],
    ["6724657",  "DOLT", "Marcel", "19 rue Principale", "68320", "GRUSSENHEIM", "68014", "FLEURS D'AUTOMNE", "GRUSSENHEIM", ""],
    ["6724658",  "DOLT", "Marie-Andrée", "19 rue Principale", "68320", "GRUSSENHEIM", "68014", "FLEURS D'AUTOMNE", "GRUSSENHEIM", ""],
    ["9304639",  "FOESCHTERLE", "Laurette", "3 rue des Champs", "68320", "JEBSHEIM", "68014", "FLEURS D'AUTOMNE", "GRUSSENHEIM", "Externe"],
    ["6724663",  "GASCHY", "Joseph", "41 route de Marckolsheim", "68320", "GRUSSENHEIM", "68014", "FLEURS D'AUTOMNE", "GRUSSENHEIM", ""],
    # --- 5 adhérents supplémentaires absents de la liste -b ---
    ["13451287", "OBERLÉ", "Jean-Charles", "8 route de Colmar", "68320", "GRUSSENHEIM", "68014", "FLEURS D'AUTOMNE", "GRUSSENHEIM", "Nouvel adhérent"],
    ["13451288", "LIENHART", "Michael", "14 rue du Moulin", "68320", "GRUSSENHEIM", "68014", "FLEURS D'AUTOMNE", "GRUSSENHEIM", "Nouvel adhérent"],
    ["13451289", "MULLER", "Sophie", "22 rue des Vergers", "68320", "MUNTZENHEIM", "68014", "FLEURS D'AUTOMNE", "GRUSSENHEIM", "Inscription forum"],
    ["13451290", "SCHNEIDER", "Jean-Marie", "5 place de la Mairie", "68320", "GRUSSENHEIM", "68014", "FLEURS D'AUTOMNE", "GRUSSENHEIM", ""],
    ["13451291", "WEIXLER", "Colette", "30 rue Principale", "68320", "GRUSSENHEIM", "68014", "FLEURS D'AUTOMNE", "GRUSSENHEIM", ""]
]

def write_xlsx(filename, rows):
    all_rows = [headers] + rows
    xml = ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://openxmlformats.org"><sheetData>']
    for r_i, row in enumerate(all_rows, 1):
        xml.append(f'<row r="{r_i}">')
        for c_i, val in enumerate(row):
            xml.append(f'<c r="{chr(65+c_i)}{r_i}" t="inlineStr"><is><t>{escape(str(val))}</t></is></c>')
        xml.append('</row>')
    xml.append('</sheetData></worksheet>')
    with zipfile.ZipFile(filename, 'w', zipfile.ZIP_DEFLATED) as zf:
        zf.writestr('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://openxmlformats.org"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>')
        zf.writestr('_rels/.rels', '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://openxmlformats.org"><Relationship Id="rId1" Type="http://openxmlformats.org" Target="xl/workbook.xml"/></Relationships>')
        zf.writestr('xl/workbook.xml', '<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://openxmlformats.org" xmlns:r="http://openxmlformats.org"><sheets><sheet name="Adherents" sheetId="1" r:id="rId1"/></sheets></workbook>')
        zf.writestr('xl/_rels/workbook.xml.rels', '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://openxmlformats.org"><Relationship Id="rId1" Type="http://openxmlformats.org/worksheet" Target="worksheets/sheet1.xml"/></Relationships>')
        zf.writestr('xl/worksheets/sheet1.xml', ''.join(xml))

for name, rows in [('adherents-a', adherents_a), ('adherents-b', adherents_a[:10])]:
    with open(f'{name}.csv', 'w', newline='', encoding='utf-8-sig') as f:
        csv.writer(f, delimiter=',').writerows([headers] + rows)
    with open(f'{name}.tsv', 'w', newline='', encoding='utf-8-sig') as f:
        csv.writer(f, delimiter='\t').writerows([headers] + rows)
    write_xlsx(f'{name}.xlsx', rows)
EOF

echo "✅ Terminé ! Les 6 fichiers (adherents-a et adherents-b en .xlsx, .csv, .tsv) ont été créés dans ce dossier."
