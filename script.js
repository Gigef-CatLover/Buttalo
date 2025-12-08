const fallingImages = [
    "assets/gm/falling/bananao.png",
    "assets/gm/falling/bottleg.png",
    "assets/gm/falling/bottlep.png",
    "assets/gm/falling/boxp.png",
    "assets/gm/falling/paperp.png"
];

const container = document.getElementById("falling-container");

function createFallingImage() {
    const img = document.createElement("img");
    img.src = fallingImages[Math.floor(Math.random() * fallingImages.length)];
    img.classList.add("falling-image");
    img.style.left = Math.random() * (window.innerWidth - 50) + "px";
    container.appendChild(img);
    setTimeout(() => img.remove(), 5000);
}

setInterval(createFallingImage, 300);


const cursor = document.getElementById('custom-cursor');
document.addEventListener('mousemove', e => {
    const x = e.clientX;
    const screenWidth = window.innerWidth;

    if (x < screenWidth / 2) {
        cursor.style.transform = "translate(-50%, -50%) scaleX(-1)";
    } else {
        cursor.style.transform = "translate(-50%, -50%) scaleX(1)";
    }

    cursor.style.left = x + "px";
    cursor.style.top = e.clientY + "px";
});

const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;


if (isTouchDevice) {
    const cursor = document.getElementById('custom-cursor');
    if (cursor) {
        cursor.style.display = "none";
    }
    
    // Abilita il clic sui bottoni per touch
    const buttons = document.querySelectorAll('.bt');
    buttons.forEach(button => {
        button.style.cursor = 'pointer';
        button.setAttribute('role', 'button');
        button.setAttribute('tabindex', '0');
        
        // Aggiungi feedback al tocco
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Riduci la frequenza delle immagini che cadono su mobile per performance
if (isTouchDevice) {
    setInterval(createFallingImage, 500); // 500ms invece di 300ms
} else {
    setInterval(createFallingImage, 300);
}