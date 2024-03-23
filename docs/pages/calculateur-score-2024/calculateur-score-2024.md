---
layout: default
title: Calculateur de Score
nav_order: 5
---

# Calculateur de Score 2024

<div class="container mt-5">
    <form id="formScore">
        <div class="form-group">
            <label for="plantesValides">Plantes valides:</label>
            <input type="number" class="form-control" id="plantesValides" min="0" value="0">
        </div>
        <div class="form-group">
            <label for="plantesEnPot">Plantes en pot:</label>
            <input type="number" class="form-control" id="plantesEnPot" min="0" value="0">
        </div>
        <div class="form-group">
            <label for="plantesEnJardiniere">Plantes en jardinière:</label>
            <input type="number" class="form-control" id="plantesEnJardiniere" min="0" value="0">
        </div>
        <div class="form-group">
            <label for="panneauxSolaires">Panneaux solaires orientés:</label>
            <input type="number" class="form-control" id="panneauxSolaires" min="0" value="0">
        </div>
        <div class="form-group">
            <label for="zonesPollinisation">Zones de pollinisation:</label>
            <input type="number" class="form-control" id="zonesPollinisation" min="0" value="0">
        </div>
        <div class="form-group">
            <label for="zonesPollinisationAvecContact">Zones de pollinisation avec contact:</label>
            <input type="number" class="form-control" id="zonesPollinisationAvecContact" min="0" value="0">
        </div>
        <div class="form-group form-check">
            <input type="checkbox" class="form-check-input" id="robotDansAireValide">
            <label class="form-check-label" for="robotDansAireValide">Robot dans l'aire valide</label>
        </div>
        <div class="form-group form-check">
            <input type="checkbox" class="form-check-input" id="equipeNonForfait">
            <label class="form-check-label" for="equipeNonForfait">Equipe non forfait (1pt)</label>
        </div>
        <div class="form-group">
            <label for="scoreEstime">Score estimé:</label>
            <input type="number" class="form-control" id="scoreEstime" min="0" value="0">
        </div>
        <button type="button" class="btn btn-primary mt-4" onclick="calculerEtAfficherScore()">Calculer le Score</button>
    </form>
    <div id="scoreSansBonus" class="mt-3">Score sans bonus : 0</div>
    <div id="bonus" class="mt-3">Bonus : 0</div>
    <div id="scorePollinisation" class="mt-3">Score de Pollinisation : 0</div>
    <div id="scoreTotal" class="mt-3">Score total : 0</div>
</div>


<script src="calculateur-score-2024.js"></script>