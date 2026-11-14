document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.tab-section');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 1. Retirer l'état actif de tous les boutons et de toutes les sections
            navButtons.forEach(btn => btn.classList.remove('active'));
            sections.forEach(sec => sec.classList.remove('active'));

            // 2. Activer le bouton cliqué
            button.classList.add('active');

            // 3. Afficher la section correspondante via l'attribut data-target
            const targetId = button.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
});
