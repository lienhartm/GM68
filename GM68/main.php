<main>
    <div class="div-main">

<?php

	$page = isset($_GET['page']) ? $_GET['page'] : 'home'; // Détecte la page active

    switch ($page) {
        case 'page-one':
            include './templates/generePdf.php';
            break;
        case 'page-two':
            include './templates/compareXlxs.php';
            break;
        case 'page-logout':
            include './templates/logout.php';
            break;
        case 'page-home':
            include './templates/home.php';
            break;
        default:
            include './templates/acceuil.php';
            break;
    }
?>

    </div>
</main>
