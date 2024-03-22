function calculerScoreEtBonus(options) {
    let scoreSansBonus = 0;
    let scorePollinisation = 0;
    let bonusNonForfait = 0;
    let scoreTotal = 0;
    //  REMPOTER LES PLANTES ET LES METTRE EN CULTURE
    scoreSansBonus += options.plantesValides * 3;
    scoreSansBonus += options.plantesEnPot; 
    scoreSansBonus += options.plantesEnJardiniere; 
    // ORIENTER LES PANNEAUX SOLAIRES
    scoreSansBonus += options.panneauxSolaires * 5;
    // RETOURNER SE RECHARGER LES BATTERIES
    scoreSansBonus += options.robotDansAireValide ? 10 : 0;
    // CALCUL DE l'ECART avec le SCORE ESTIME
    let ecart = Math.abs(scoreSansBonus - options.scoreEstime);
    let bonus = Math.min(20 - ecart / 2, scoreSansBonus);
    bonus = Math.round(Math.max(bonus, 0));

    //  ASSURER LA POLLINISATION DES PLANTES
    scorePollinisation += options.zonesPollinisation * 5;
    scorePollinisation += options.zonesPollinisationAvecContact * 5;
    //  BONUS NON FORFAIT
    bonusNonForfait += options.equipeNonForfait ? 1 : 0;
    //  CALCUL SCORE TOTAL 
    scoreTotal = (scoreSansBonus + bonus + scorePollinisation + bonusNonForfait)*bonusNonForfait;

    return { scoreSansBonus, bonus, scorePollinisation, scoreTotal };
}

function calculerEtAfficherScore() {
    const optionsDeMatch = {
        plantesValides: parseInt(document.getElementById('plantesValides').value, 10),
        plantesEnPot: parseInt(document.getElementById('plantesEnPot').value, 10),
        plantesEnJardiniere: parseInt(document.getElementById('plantesEnJardiniere').value, 10),
        panneauxSolaires: parseInt(document.getElementById('panneauxSolaires').value, 10),
        zonesPollinisation: parseInt(document.getElementById('zonesPollinisation').value, 10),
        zonesPollinisationAvecContact: parseInt(document.getElementById('zonesPollinisationAvecContact').value, 10),
        robotDansAireValide: document.getElementById('robotDansAireValide').checked,
        equipeNonForfait: document.getElementById('equipeNonForfait').checked,
        scoreEstime: parseInt(document.getElementById('scoreEstime').value, 10),
    };

    // Sauvegarde des valeurs dans localStorage
    for (const [cle, valeur] of Object.entries(optionsDeMatch)) {
        localStorage.setItem(cle, valeur);
    }

    const { scoreSansBonus, bonus, scorePollinisation, scoreTotal } = calculerScoreEtBonus(optionsDeMatch);
    document.getElementById('scoreSansBonus').innerText = `Score sans bonus : ${scoreSansBonus}`;
    document.getElementById('bonus').innerText = `Bonus : ${bonus}`;
    document.getElementById('scorePollinisation').innerText = `Score de Pollinisation : ${scorePollinisation}`;
    document.getElementById('scoreTotal').innerText = `Score total : ${scoreTotal}`;
}

function chargerValeursDuFormulaire() {
    // Charger les valeurs pour les champs de type 'text' ou 'number'
    if (localStorage.getItem('plantesValides') !== null) {
        document.getElementById('plantesValides').value = localStorage.getItem('plantesValides');
    }
    if (localStorage.getItem('plantesEnPot') !== null) {
        document.getElementById('plantesEnPot').value = localStorage.getItem('plantesEnPot');
    }
    if (localStorage.getItem('plantesEnJardiniere') !== null) {
        document.getElementById('plantesEnJardiniere').value = localStorage.getItem('plantesEnJardiniere');
    }
    if (localStorage.getItem('panneauxSolaires') !== null) {
        document.getElementById('panneauxSolaires').value = localStorage.getItem('panneauxSolaires');
    }
    if (localStorage.getItem('zonesPollinisation') !== null) {
        document.getElementById('zonesPollinisation').value = localStorage.getItem('zonesPollinisation');
    }
    if (localStorage.getItem('zonesPollinisationAvecContact') !== null) {
        document.getElementById('zonesPollinisationAvecContact').value = localStorage.getItem('zonesPollinisationAvecContact');
    }
    if (localStorage.getItem('scoreEstime') !== null) {
        document.getElementById('scoreEstime').value = localStorage.getItem('scoreEstime');
    }

    // Charger les valeurs pour les champs de type 'checkbox'
    document.getElementById('robotDansAireValide').checked = localStorage.getItem('robotDansAireValide') === 'true';
    document.getElementById('equipeNonForfait').checked = localStorage.getItem('equipeNonForfait') === 'true';
}


// Appeler chargerValeursDuFormulaire lors du chargement de la page
window.onload = function() {
    chargerValeursDuFormulaire();
};