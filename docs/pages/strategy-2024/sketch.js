let terrainImage;
let ajustement = 90; // Pourcentage de la taille originale.

// GUI
let cb_POI;
let afficherPOI = true;
let cb_DeleteOption;
let deleteOption = false;
let etatRobot = 'arrêté'; // Peut être 'lecture', 'pause', ou 'arrêté'
let positionRobot = 0; // Indice du point de stratégie actuel
let vitesseRobot = 1; // Vitesse de déplacement entre les points (modifiable par un curseur)


// Points
let echelleX, echelleY; // Facteurs d'échelle pour les axes X et Y
let rawPOIs = [];
let pois = [];
let pointsStrategie = [];
let numeroPointStrategie = 1; // Commencez à numéroter à partir de 1
let pointSelectionne = null;




function calculerEchelle() {
    // Le canvas vise à représenter une surface de 3m x 2m (3000mm x 2000mm)
    echelleX = height / 3000;
    echelleY = width / 2000;
}


function preload() {
    terrainImage = loadImage('vinyle2024.png');
    rawPOIs = loadStrings('https://raw.githubusercontent.com/LesKaribous/Twinsystem/2024/src/poi.h');
}

function setup() {

    const container = select('#p5-container');
    let height = (windowHeight * ajustement) / 100;
    let width = (height * 2) / 3;

    if (width > container.width) {
        width = container.width;
        height = (width * 3) / 2;
    }

    height = (height * ajustement) / 100;
    width = (width * ajustement) / 100;

    let canvas = createCanvas(width, height);
    canvas.parent('p5-container');
    calculerEchelle();
    extractPOIs(); // Extrait les points après le chargement du fichier
    setupUI();
}

function draw() {
    drawTerrain();
    drawPOI();
    drawPath(pointsStrategie);
    drawList(pointsStrategie);
    drawRobot();
}

function setupUI() {
    cb_POI = createCheckbox("POIs", afficherPOI);
    cb_POI.parent('ui-container');
    cb_POI.changed(majPOI);

    cb_DeleteOption = createCheckbox("Delete Option", deleteOption);
    cb_DeleteOption.parent('ui-container');
    cb_DeleteOption.changed(majDeleteOption);

    let btnClear = createButton("Clear Stratégie");
    btnClear.parent('ui-container');
    btnClear.mousePressed(clearStrategie);

    let btnSave = createButton("Sauvegarder Stratégie");
    btnSave.parent('ui-container');
    btnSave.mousePressed(saveStrategie);

    let btnLoad = createButton("Charger Stratégie");
    btnLoad.parent('ui-container');
    btnLoad.mousePressed(loadStrategie);

    let btnExport = createButton('Exporter Stratégie');
    btnExport.parent('ui-container');
    btnExport.mousePressed(exporterStrategie);

    let inputImport = createFileInput(handleFile);
    inputImport.parent('ui-container');

    let btnLecture = createButton('Lecture');
    btnLecture.mousePressed(() => etatRobot = 'lecture');
    btnLecture.parent('ui-container');

    let btnPause = createButton('Pause');
    btnPause.mousePressed(() => etatRobot = 'pause');
    btnPause.parent('ui-container');

    let btnStop = createButton('Stop');
    btnStop.mousePressed(() => {
        etatRobot = 'arrêté';
        positionRobot = 0; // Réinitialiser la position du robot
    });
    btnStop.parent('ui-container');

    let curseurVitesse = createSlider(0, 100, 50); // Min, Max, Valeur par défaut
    curseurVitesse.input(() => vitesseRobot = curseurVitesse.value() / 100);
    curseurVitesse.parent('ui-container');
}

function drawRobot(){
    if (etatRobot === 'lecture' || etatRobot === 'pause') {
        if (pointsStrategie.length > 0) {
            let pointActuel = pointsStrategie[positionRobot];
            let canvasX = pointActuel.y * echelleY;
            let canvasY = (3000 - pointActuel.x) * echelleX;
            fill('red');
            ellipse(canvasX, canvasY, 40, 40); // Dessiner le robot

            if (etatRobot === 'lecture') {
                positionRobot += vitesseRobot;
                if (positionRobot >= pointsStrategie.length) {
                    positionRobot = 0; // Recommencer au début si on atteint la fin
                }
            }
        }
    }
}

function majDeleteOption() {
    deleteOption = cb_DeleteOption.checked();
}

function majPOI() {
    afficherPOI = cb_POI.checked();
}

function drawPOI() {
    if (afficherPOI) {
        drawList(pois);
    }
}

function windowResized() {
    const container = select('#p5-container');
    let height = (windowHeight * ajustement) / 100;
    let width = (height * 2) / 3;

    if (width > container.width) {
        width = container.width;
        height = (width * 3) / 2;
    }

    height = (height * ajustement) / 100;
    width = (width * ajustement) / 100;

    resizeCanvas(width, height);

    calculerEchelle();
}

function drawTerrain() {
    background(220);
    // Calculez le ratio d'aspect de l'image et du canvas
    let imgRatio = terrainImage.width / terrainImage.height;
    let canvasRatio = width / height;

    // Déterminez si l'image doit être ajustée en largeur ou en hauteur pour remplir le canvas
    let drawWidth, drawHeight;
    if (imgRatio < canvasRatio) {
        // L'image est plus étroite que le canvas (en comparaison), ajustez en largeur
        drawWidth = width;
        drawHeight = drawWidth / imgRatio;
    } else {
        // L'image est plus large que le canvas (en comparaison), ajustez en hauteur
        drawHeight = height;
        drawWidth = drawHeight * imgRatio;
    }

    // Centrez l'image si nécessaire
    let x = (width - drawWidth) / 2;
    let y = (height - drawHeight) / 2;

    image(terrainImage, 0, 0, width, height);
}

function drawPoint(point) {
    let canvasX = point.y * echelleY;
    let canvasY = (3000 - point.x) * echelleX;
    let taillePoint = 20;

    // Vérifier si la souris est proche du point pour décider si on affiche un contour
    let estProche = dist(mouseX, mouseY, canvasX, canvasY) < taillePoint / 2;

    // Si la souris est proche, définir le contour en blanc
    if (estProche) {
        stroke(255); // Couleur du contour
        strokeWeight(2); // Épaisseur du contour
    } else {
        noStroke();
    }

    fill(point.couleur);
    ellipse(canvasX, canvasY, taillePoint, taillePoint);

    // Réinitialiser le contour pour le texte et autres éléments
    noStroke();

    // Afficher le numéro au centre du point, si disponible
    if (point.numero !== undefined) {
        fill(255); // Couleur du numéro
        textAlign(CENTER, CENTER);
        text(point.numero, canvasX, canvasY);
    }

    if (estProche) {
        textSize(20);
        fill(0); // Couleur du texte
        stroke(255); // Contour du texte pour améliorer la lisibilité
        strokeWeight(3);
        textFont('Verdana');
        textStyle(BOLD);

        // Détermine l'alignement et la position du texte en fonction de la position du curseur
        let offsetX, offsetY;
        offsetX = (mouseX < width / 2) ? 15 : -15;
        offsetY = (mouseY < height / 2) ? 20 : -40;

        // Appliquer l'alignement et le décalage pour le nom et les coordonnées
        textAlign((mouseX < width / 2) ? LEFT : RIGHT, (mouseY < height / 2) ? BOTTOM : TOP);
        text(`${point.nom}`, canvasX + offsetX, canvasY + offsetY);
        text(`(${point.x}, ${point.y})`, canvasX + offsetX, canvasY + offsetY + 20);

        // Réinitialisez le contour pour les autres éléments à dessiner après le texte
        noStroke();
    }
}

function drawList(points) {
    points.forEach(point => {
        drawPoint(point);
    });
}

function drawPath(points) {
    if (points.length < 2) return; // Besoin d'au moins deux points pour dessiner un chemin

    stroke(255, 204, 0); // Couleur du chemin
    strokeWeight(2); // Épaisseur de la ligne
    noFill();

    beginShape();
    for (let i = 0; i < points.length; i++) {
        let canvasX = points[i].y * echelleY;
        let canvasY = (3000 - points[i].x) * echelleX;
        vertex(canvasX, canvasY);
    }
    endShape();
}


function extractPOIs() {
    const regex = /const Vec2 (\w+) = Vec2\((\d+),(\d+)\);/; // Regex pour matcher les points

    rawPOIs.forEach(line => {
        const match = line.match(regex);
        if (match) {
            const name = match[1];
            const x = parseInt(match[2], 10);
            const y = parseInt(match[3], 10);
            const numero = undefined; // ou un numéro spécifique si disponible
            pois.push({ nom: name, x: x, y: y, couleur: "red", numero: numero });
        }
    });
}
function mousePressed() {
    if (deleteOption && mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        // Logique de suppression des points
        for (let i = pointsStrategie.length - 1; i >= 0; i--) {
            let point = pointsStrategie[i];
            let canvasX = point.y * echelleY;
            let canvasY = (3000 - point.x) * echelleX;
            if (dist(mouseX, mouseY, canvasX, canvasY) < 15) {
                // Supprime le point et met à jour les numéros des points suivants
                pointsStrategie.splice(i, 1);
                renumeroterPoints();
                return; // Arrêtez la recherche dès qu'un point est trouvé et supprimé
            }
        }
    } else {
        let pointTrouve = false;
        // Tentez d'abord de sélectionner un point de stratégie existant pour le déplacer
        for (let point of pointsStrategie) {
            let canvasX = point.y * echelleY;
            let canvasY = (3000 - point.x) * echelleX;
            if (dist(mouseX, mouseY, canvasX, canvasY) < 15) {
                pointSelectionne = point;
                pointTrouve = true;
                break; // Un point est trouvé pour déplacement, arrêter la recherche
            }
        }

        if (!pointTrouve && mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
            // Si aucun point de stratégie n'est sélectionné, vérifiez l'aimantation ou créez un nouveau point
            verifierAimantationEtCreerPoint();
        }
    }
}





function renumeroterPoints() {
    numeroPointStrategie = 1;
    for (let point of pointsStrategie) {
        point.numero = numeroPointStrategie++;
    }
}

function mouseDragged() {
    if (pointSelectionne) {
        let aimante = false;
        for (let poi of pois) {
            let canvasX = poi.y * echelleY;
            let canvasY = (3000 - poi.x) * echelleX;
            if (dist(mouseX, mouseY, canvasX, canvasY) < 15) {
                // Si proche d'un POI, aimantez le point
                pointSelectionne.x = poi.x;
                pointSelectionne.y = poi.y;
                pointSelectionne.couleur = "green"; // Changez la couleur pour indiquer l'aimantation
                aimante = true;
                break;
            }
        }

        if (!aimante) {
            // Si le point n'est pas aimanté, mettez à jour selon la position de la souris et remettez en bleu
            pointSelectionne.x = Math.round((3000 - (mouseY / echelleY)));
            pointSelectionne.y = Math.round(mouseX / echelleX);
            pointSelectionne.couleur = "blue"; // La couleur originale des points de stratégie
        }
    }
}


function verifierAimantationEtCreerPoint() {
    let aimante = false;
    for (let poi of pois) {
        let canvasX = poi.y * echelleY;
        let canvasY = (3000 - poi.x) * echelleX;
        if (dist(mouseX, mouseY, canvasX, canvasY) < 15) {
            pointsStrategie.push({
                x: poi.x,
                y: poi.y,
                nom: `Stratégie ${numeroPointStrategie}`,
                couleur: "green",
                numero: numeroPointStrategie++
            });
            aimante = true;
            break;
        }
    }

    if (!aimante) {
        // Crée un nouveau point à l'emplacement de la souris si non aimanté
        let xTerrain = Math.round((3000 - (mouseY / echelleY)));
        let yTerrain = Math.round(mouseX / echelleX);
        pointsStrategie.push({
            x: xTerrain,
            y: yTerrain,
            nom: `Stratégie ${numeroPointStrategie}`,
            couleur: "blue",
            numero: numeroPointStrategie++
        });
    }
}


function mouseReleased() {
    pointSelectionne = null; // Réinitialiser le point sélectionné après le glissement
}

function clearStrategie() {
    pointsStrategie = [];
    numeroPointStrategie = 1;
}

function saveStrategie() {
    localStorage.setItem('strategie', JSON.stringify(pointsStrategie));
}

function loadStrategie() {
    let strategie = localStorage.getItem('strategie');
    if (strategie) {
        pointsStrategie = JSON.parse(strategie);
        // Assurez-vous que le numéro suit correctement le dernier point ajouté
        numeroPointStrategie = pointsStrategie.length ? pointsStrategie[pointsStrategie.length - 1].numero + 1 : 1;
    }
}

function exporterStrategie() {
    let dataStr = JSON.stringify(pointsStrategie, null, 2);
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    let exportFileDefaultName = 'strategie.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

function handleFile(file) {
    if (file.type === 'application/json' || true) { // Ignore le type de fichier
        let reader = new FileReader();
        reader.onload = function(e) {
            try {
                let contents = e.target.result;
                pointsStrategie = JSON.parse(contents);
                numeroPointStrategie = pointsStrategie.length ? pointsStrategie[pointsStrategie.length - 1].numero + 1 : 1;
                redraw(); // Force le redessinage pour afficher les points importés
            } catch (error) {
                console.error("Erreur lors du parsing du fichier JSON : ", error);
                alert("Le fichier choisi ne contient pas de JSON valide.");
            }
        };
        reader.readAsText(file.file);
    } else {
        console.log("Tentative de lecture du fichier comme JSON indépendamment du type.");
    }
}
