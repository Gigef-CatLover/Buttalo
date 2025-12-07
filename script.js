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

// cursore personalizzato con flip
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