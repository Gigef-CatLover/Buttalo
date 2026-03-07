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
}

// Abilita il clic sui bottoni (mouse e touch)
const buttons = document.querySelectorAll('.bt');
buttons.forEach(button => {
    button.style.cursor = 'pointer';
    button.setAttribute('role', 'button');
    button.setAttribute('tabindex', '0');
    
    // Feedback al click/tocco: solo al press rimpicciolisce
    const press = () => {
        button.style.transform = 'scale(0.95)';
    };
    const release = () => {
        button.style.transform = ''; // togli inline così :hover può tornare a ingrandire
    };
    
    button.addEventListener('mousedown', press);
    button.addEventListener('mouseup', release);
    button.addEventListener('mouseleave', release);
    
    button.addEventListener('touchstart', press);
    button.addEventListener('touchend', release);
});

// Popup Opzioni: apri/chiudi e carousel
const optionsOverlay = document.getElementById('options-overlay');
const optionsSlides = document.querySelectorAll('.options-slide');
const optionsPrev = document.querySelector('.options-prev');
const optionsNext = document.querySelector('.options-next');
const optionsClose = document.querySelector('.options-close');
const optionsButton = document.querySelector('.bt-options');

let optionsIndex = 0;

function showOptionsSlide(i) {
    optionsIndex = ((i % optionsSlides.length) + optionsSlides.length) % optionsSlides.length;
    optionsSlides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === optionsIndex);
    });
}

function openOptions() {
    if (optionsOverlay) {
        optionsOverlay.classList.add('is-open');
        optionsOverlay.setAttribute('aria-hidden', 'false');
        showOptionsSlide(optionsIndex);
    }
}

function closeOptions() {
    if (optionsOverlay) {
        optionsOverlay.classList.remove('is-open');
        optionsOverlay.setAttribute('aria-hidden', 'true');
    }
}

if (optionsButton) {
    optionsButton.addEventListener('click', (e) => {
        e.preventDefault();
        openOptions();
    });
    optionsButton.addEventListener('touchend', (e) => {
        e.preventDefault();
        openOptions();
    });
}

if (optionsOverlay) {
    optionsOverlay.addEventListener('click', (e) => {
        if (e.target === optionsOverlay) closeOptions();
    });
}

if (optionsClose) {
    optionsClose.addEventListener('click', closeOptions);
    optionsClose.addEventListener('touchend', (e) => {
        e.preventDefault();
        closeOptions();
    });
}

if (optionsPrev) {
    optionsPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        showOptionsSlide(optionsIndex - 1);
    });
    optionsPrev.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showOptionsSlide(optionsIndex - 1);
    });
}

if (optionsNext) {
    optionsNext.addEventListener('click', (e) => {
        e.stopPropagation();
        showOptionsSlide(optionsIndex + 1);
    });
    optionsNext.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showOptionsSlide(optionsIndex + 1);
    });
}

// Quando si clicca il bottone Start si entra nel gioco
const startButton = document.querySelector('.bt-start');
if (startButton) {
    const goToGame = (e) => {
        if (e) e.preventDefault();

        document.body.classList.add('fade-out');

        setTimeout(() => {
            window.location.href = 'game/game.html';
        }, 500);
    };
    
    startButton.addEventListener('click', goToGame);
    startButton.addEventListener('touchend', (e) => {
        goToGame(e);
    });
}

// Riduci la frequenza delle immagini che cadono su mobile per performance
if (isTouchDevice) {
    setInterval(createFallingImage, 500); // 500ms invece di 300ms
} else {
    setInterval(createFallingImage, 300);
}