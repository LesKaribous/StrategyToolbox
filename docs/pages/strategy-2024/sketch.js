let terrainImage;
let ajustement = 90; // Pourcentage de la taille originale.
let rawPOIs = [];

// GUI
let cb_POI;
let afficherPOI = true;

// Points
let echelleX, echelleY; // Facteurs d'échelle pour les axes X et Y

let pois = [];


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
}

function setupUI() {
    cb_POI = createCheckbox("POIs", afficherPOI);
    cb_POI.parent('ui-container');
    cb_POI.changed(majPOI);
}

function majPOI() {
    afficherPOI = cb_POI.checked();
}

function drawPOI() {
    if (afficherPOI) {
        drawList(pois); // Dessinez tous les points d'intérêt
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


// Dessiner le terrain
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
    let taillePoint = 15;

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