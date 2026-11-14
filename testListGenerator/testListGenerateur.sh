#!/usr/bin/env bash
set -e

echo "Génération des fichiers de test (CSV, TSV, XLSX)..."

# On utilise Python (intégré à macOS/Linux) pour générer proprement CSV, TSV et XLSX
python3 - << 'EOF'
import csv
import os

# En-têtes exacts demandés
headers = [
    "ID du Contact", "Nom", "Prénom", "Adresse", "Code postal",
    "Ville", "Numéro club", "Nom du club", "Ville du club", "Détail"
]

# 15 adhérents fictifs pour la liste -a (Liste du club)
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
    # --- Les 5 suivants sont absents de la liste -b (apparaîtront dans "Nouveaux") ---
    ["13451287", "OBERLÉ", "Jean-Charles", "8 route de Colmar", "68320", "GRUSSENHEIM", "68014", "FLEURS D'AUTOMNE", "GRUSSENHEIM", "Nouvel adhérent"],
    ["13451288", "LIENHART", "Michael", "14 rue du Moulin", "68320", "GRUSSENHEIM", "68014", "FLEURS D'AUTOMNE", "GRUSSENHEIM", "Nouvel adhérent"],
    ["13451289", "MULLER", "Sophie", "22 rue des Vergers", "68320", "MUNTZENHEIM", "68014", "FLEURS D'AUTOMNE", "GRUSSENHEIM", "Inscription forum"],
    ["13451290", "SCHNEIDER", "Jean-Marie", "5 place de la Mairie", "68320", "GRUSSENHEIM", "68014", "FLEURS D'AUTOMNE", "GRUSSENHEIM", ""],
    ["13451291", "WEIXLER", "Colette", "30 rue Principale", "68320", "GRUSSENHEIM", "68014", "FLEURS D'AUTOMNE", "GRUSSENHEIM", ""]
]

# Liste -b : contient uniquement les 10 premiers adhérents (données moindres)
adherents_b = adherents_a[:10]

datasets = {
    "adherents-a": adherents_a,
    "adherents-b": adherents_b
}

# 1. Génération des fichiers CSV et TSV
for name, rows in datasets.items():
    # CSV (UTF-8 avec BOM pour compatibilité Excel)
    with open(f"{name}.csv", "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f, delimiter=",")
        writer.writerow(headers)
        writer.writerows(rows)

    # TSV (séparateur tabulation)
    with open(f"{name}.tsv", "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f, delimiter="\t")
        writer.writerow(headers)
        writer.writerows(rows)

# 2. Génération des fichiers XLSX (via openpyxl si installé, sinon création d'un mini-XLSX natif)
try:
    import openpyxl
    for name, rows in datasets.items():
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Adherents"
        ws.append(headers)
        for r in rows:
            ws.append(r)
        wb.save(f"{name}.xlsx")
    print("Fichiers XLSX générés via openpyxl.")
except ImportError:
    # Générateur XLSX minimaliste sans dépendance externe (archive ZIP XML conforme)
    import zipfile
    from xml.sax.saxutils import escape

    def write_minimal_xlsx(filename, headers, rows):
        all_rows = [headers] + rows
        sheet_xml = ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
                     '<worksheet xmlns="http://openxmlformats.org"><sheetData>']
        for r_idx, row in enumerate(all_rows, 1):
            sheet_xml.append(f'<row r="{r_idx}">')
            for c_idx, val in enumerate(row):
                col_letter = chr(65 + c_idx)
                sheet_xml.append(f'<c r="{col_letter}{r_idx}" t="inlineStr"><is><t>{escape(str(val))}</t></is></c>')
            sheet_xml.append('</row>')
        sheet_xml.append('</sheetData></worksheet>')

        with zipfile.ZipFile(filename, 'w', zipfile.ZIP_DEFLATED) as zf:
            zf.writestr('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://openxmlformats.org"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>')
            zf.writestr('_rels/.rels', '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://openxmlformats.org"><Relationship Id="rId1" Type="http://openxmlformats.org" Target="xl/workbook.xml"/></Relationships>')
            zf.writestr('xl/workbook.xml', '<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://openxmlformats.org" xmlns:r="http://openxmlformats.org"><sheets><sheet name="Adherents" sheetId="1" r:id="rId1"/></sheets></workbook>')
            zf.writestr('xl/_rels/workbook.xml.rels', '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://openxmlformats.org"><Relationship Id="rId1" Type="http://openxmlformats.org/worksheet" Target="worksheets/sheet1.xml"/></Relationships>')
            zf.writestr('xl/worksheets/sheet1.xml', ''.join(sheet_xml))

    for name, rows in datasets.items():
        write_minimal_xlsx(f"{name}.xlsx", headers, rows)
    print("Fichiers XLSX générés (mode autonome sans dépendance).")
EOF

echo "Terminé ! Fichiers créés :"
ls -lh adherents-a.* adherents-b.*
