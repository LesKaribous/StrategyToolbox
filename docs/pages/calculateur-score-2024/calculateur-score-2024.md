---
layout: default
title: Calculateur de Score
nav_order: 5
---
<form id="formScore">
    <label>Plantes valides: <input type="number" id="plantesValides" min="0" value="0"></label><br>
    <label>Plantes en pot: <input type="number" id="plantesEnPot" min="0" value="0"></label><br>
    <label>Plantes en jardinière: <input type="number" id="plantesEnJardiniere" min="0" value="0"></label><br>
    <label>Panneaux solaires orientés: <input type="number" id="panneauxSolaires" min="0" value="0"></label><br>
    <label>Zones de pollinisation: <input type="number" id="zonesPollinisation" min="0" value="0"></label><br>
    <label>Zones de pollinisation avec contact: <input type="number" id="zonesPollinisationAvecContact" min="0" value="0"></label><br>
    <label>Robot dans l'aire valide: <input type="checkbox" id="robotDansAireValide"></label><br>
    <label>Equipe non forfait (1pt): <input type="checkbox" id="equipeNonForfait"></label><br>
    <label>Score estimé: <input type="number" id="scoreEstime" min="0" value="0"></label><br>
    <button type="button" onclick="calculerEtAfficherScore()">Calculer le Score</button>
</form>
<div id="scoreSansBonus">Score sans bonus : 0</div>
<div id="bonus">Bonus : 0</div>
<div id="scorePollinisation">Score de Pollinisation : 0</div>
<div id="scoreTotal">Score total : 0</div>


<script src="calculateur-score-2024.js"></script>