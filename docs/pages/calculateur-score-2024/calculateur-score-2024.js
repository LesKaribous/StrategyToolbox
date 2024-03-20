function calculerScoreEtBonus(options) {
    let scoreSansBonus = 0;
    scoreSansBonus += options.plantesValides * 3;
    scoreSansBonus += options.plantesEnPot; 
    scoreSansBonus += options.plantesEnJardiniere; 
    scoreSansBonus += options.panneauxSolaires * 5;
    scoreSansBonus += options.zonesPollinisation * 5;
    scoreSansBonus += options.zonesPollinisationAvecContact * 5;
    scoreSansBonus += options.robotDansAireValide ? 10 : 0;

    let ecart = Math.abs(scoreSansBonus - options.scoreEstime);
    let bonus = Math.min(20 - ecart / 2, scoreSansBonus);
    bonus = Math.round(Math.max(bonus, 0));

    let scoreTotal = scoreSansBonus + bonus;

    return { scoreSansBonus, bonus, scoreTotal };
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
        scoreEstime: parseInt(document.getElementById('scoreEstime').value, 10),
    };

    const { scoreSansBonus, bonus, scoreTotal } = calculerScoreEtBonus(optionsDeMatch);
    document.getElementById('scoreSansBonus').innerText = `Score sans bonus : ${scoreSansBonus}`;
    document.getElementById('bonus').innerText = `Bonus : ${bonus}`;
    document.getElementById('scoreTotal').innerText = `Score total : ${scoreTotal}`;
}
