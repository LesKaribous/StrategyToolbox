let terrainImage;
let ajustementHauteur = 90; // Pourcentage de la taille originale.


function preload() {
    terrainImage = loadImage('vinyle2024.png');
}

function setup() {

    const container = select('#p5-container');
    let height = (windowHeight * ajustementHauteur) / 100;
    let width = (height * 2) / 3;
  
    if (width > container.width) {
      width  = container.width;
      height = (width * 3) / 2;
    }
  
    height  = (height * ajustementHauteur) / 100; 
    width   = (width  * ajustementHauteur) / 100;
  
    let canvas = createCanvas(width, height);
    canvas.parent('p5-container');

}

function draw() {
    drawTerrain();
}

function windowResized() {
    setup(); 
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
