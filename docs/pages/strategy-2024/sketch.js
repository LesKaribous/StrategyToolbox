let terrainImage;
let ajustement = 90; // Pourcentage de la taille originale.

// GUI
let cb_POI;
let afficherPOI = true;

// Points
let echelleX, echelleY; // Facteurs d'échelle pour les axes X et Y

let pois = [
    { x: 1500, y: 0, nom: "POI 1", couleur: "red" },
    { x: 1500, y: 500, nom: "POI 2", couleur: "#00FF00" },
    { x: 1500, y: 1000, nom: "POI 3", couleur: "rgb(0, 0, 255)" },
    { x: 1500, y: 1500, nom: "POI 3", couleur: "rgb(0, 0, 255)" },
    { x: 1500, y: 2000, nom: "POI 3", couleur: "rgb(0, 0, 255)" }
  ];
  

  function calculerEchelle() {
    // Le canvas vise à représenter une surface de 3m x 2m (3000mm x 2000mm)
    echelleX = height   / 3000;
    echelleY = width    / 2000;
  }


function preload() {
    terrainImage = loadImage('vinyle2024.png');
}

function setup() {

    const container = select('#p5-container');
    let height = (windowHeight * ajustement) / 100;
    let width = (height * 2) / 3;
  
    if (width > container.width) {
      width  = container.width;
      height = (width * 3) / 2;
    }
  
    height  = (height * ajustement) / 100; 
    width   = (width  * ajustement) / 100;
  
    let canvas = createCanvas(width, height);
    canvas.parent('p5-container');
    calculerEchelle();

    setupUI();
}

function draw() {
    drawTerrain();
    drawPOI();
}

function setupUI() {
    cb_POI = createCheckbox("POI", afficherPOI);
    cb_POI.parent('ui-container');
    cb_POI.changed(majPOI);
}

function majPOI(){
    afficherPOI = cb_POI.checked();
}

function drawPOI(){
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
    width  = (width * ajustement) / 100;

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
    // Inversion des axes
    let canvasX = point.y * echelleY;
    let canvasY = (3000-point.x) * echelleX;
  
    let taillePoint = 10;
    
    fill(point.couleur);
    noStroke(); // Assurez-vous qu'il n'y a pas de contour sur le cercle
    ellipse(canvasX, canvasY, taillePoint, taillePoint);
  
    if (dist(mouseX, mouseY, canvasX, canvasY) < taillePoint / 2) { // Ajustez la détection de proximité selon la taille du point
      let decalageTexte = 5; // Espacement entre le point et le texte
      let tailleTexte = 14;
      textSize(tailleTexte);
      fill(255); // Texte blanc
      stroke(0); // Contour noir
      strokeWeight(1); // Épaisseur du contour
      text(`${point.nom}: (${point.x}, ${point.y})`, canvasX + 10, canvasY + decalageTexte + taillePoint / 2);
      noStroke(); // Réinitialisez le contour pour les autres éléments à dessiner
    }
  }
  

function drawList(points) {
    points.forEach(point => {
      drawPoint(point);
    });
  }
  
