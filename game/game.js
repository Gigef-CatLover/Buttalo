const fallingImages = [
    { path: "../assets/gm/falling/bananao.png", type: "organic", zone: "left" },
    { path: "../assets/gm/falling/bottleg.png", type: "glass", zone: "center-left" },
    { path: "../assets/gm/falling/bottlep.png", type: "plastic", zone: "center-right" },
    { path: "../assets/gm/falling/paperp.png", type: "paper", zone: "center" }
];

const catImages = [
    "../assets/gm/falling/boxp.png"  // Gattino
];

const container = document.getElementById("falling-container");
const catsContainer = document.getElementById("cats-container");

const healthFill = document.getElementById("player-hp-fill");


let health = 100;
let activeImages = 0;
let activeCats = 0;
const maxImages = 15;
const maxCats = 1;

const bins = document.querySelectorAll('.bin');
let draggedBin = null;
let startX = 0;
let startLeft = 0;
let lastDirection = null;
let bossHealth = 100;
const bossFill = document.querySelector(".boss-fill");

const activeTrash = {
    organic: [],
    glass: [],
    plastic: [],
    paper: []
};

const cursor = document.getElementById('custom-cursor');
const leftGrabbing = "../assets/ui/lefthandgrabbing.png";
const rightGrabbing = "../assets/ui/righthandgrabbing.png";

function updateHealth(damage) {
    health = Math.max(0, health - damage);
    healthFill.style.width = health + '%';
    healthValue.textContent = Math.round(health) + '%';
    
    if (health <= 0) {
        setTimeout(() => {
            alert('GAME OVER! Hai perso tutta la vita!');
            health = 100;
            updateHealth(0);
        }, 100);
    }
}

function getRandomPosition(zone, trashType) {
    const screenWidth = window.innerWidth;
    const trashWidth = 50;
    
    let minX, maxX;
    
    if (zone === "left") {
        minX = 0;
        maxX = screenWidth * 0.2;
    } else if (zone === "center-left") {
        minX = screenWidth * 0.2;
        maxX = screenWidth * 0.4;
    } else if (zone === "center") {
        minX = screenWidth * 0.4;
        maxX = screenWidth * 0.6;
    } else if (zone === "center-right") {
        minX = screenWidth * 0.6;
        maxX = screenWidth * 0.8;
    } else if (zone === "right") {
        minX = screenWidth * 0.8;
        maxX = screenWidth;
    }
    
    let attempts = 0;
    let position;
    let validPosition = false;
    
    while (attempts < 50 && !validPosition) {
        position = minX + Math.random() * (maxX - minX - trashWidth);
        
        validPosition = true;
        
        for (const trash of activeTrash[trashType]) {
            if (Math.abs(trash.position - position) < 80) {
                validPosition = false;
                break;
            }
        }
        
        attempts++;
    }
    
    if (!validPosition) {
        position = minX + Math.random() * (maxX - minX - trashWidth);
    }
    
    activeTrash[trashType].push({ position: position });
    
    return position;
}
function updateHealth(damage) {
    health = Math.max(0, health - damage);
    healthFill.style.width = health + "%";

    if (health <= 0) {
        setTimeout(() => {
            alert("GAME OVER!");
            health = 100;
            healthFill.style.width = "100%";
        }, 100);
    }
}

function checkCollision(img) {
    const imgRect = img.getBoundingClientRect();
    const imgBottom = imgRect.bottom;
    const imgLeft = imgRect.left;
    const imgRight = imgRect.right;
    let hasCollided = false;
    let correctBin = false;
    let collidedBin = null;
    
    bins.forEach(bin => {
        const binRect = bin.getBoundingClientRect();
        const binTop = binRect.top;
        const binBottom = binRect.bottom;
        const binLeft = binRect.left;
        const binRight = binRect.right;
        
        const verticalOverlap = imgBottom >= binTop - 5 && imgRect.top <= binBottom + 5;
        const horizontalOverlap = imgRight > binLeft + 20 && imgLeft < binRight - 20;
        
        if (verticalOverlap && horizontalOverlap) {
            hasCollided = true;
            const binType = bin.dataset.type;
            const trashType = img.dataset.type;
            collidedBin = bin;
            
            if (binType === trashType) {
                correctBin = true;
            }
        }
    });
    
    if (hasCollided) {
        if (correctBin) {
            if (collidedBin) {
                const binFront = collidedBin.querySelector('.bin-front');
                binFront.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    binFront.style.transform = 'scale(1)';
                }, 200);
            }
        } else {
            updateHealth(10);
        }
        
        setTimeout(() => {
            if (img.parentNode === container) {
                img.remove();
                activeImages--;
                
                const trashType = img.dataset.type;
                activeTrash[trashType] = activeTrash[trashType].filter(t => 
                    t.position !== parseInt(img.style.left)
                );
            }
        }, 50);
    }
    
    return hasCollided;
}

function createFallingImage() {
    if (activeImages >= maxImages) return;
    
    const randomIndex = Math.floor(Math.random() * fallingImages.length);
    const item = fallingImages[randomIndex];
    
    const img = document.createElement("img");
    img.src = item.path;
    img.classList.add("falling-image");
    img.dataset.type = item.type;
    
    const position = getRandomPosition(item.zone, item.type);
    img.style.left = position + "px";
    
    const speed = 15 + Math.random() * 10;
    img.style.animation = `fall ${speed}s linear forwards`;
    
    container.appendChild(img);
    activeImages++;
    
    let collisionChecked = false;
    
    const checkInterval = setInterval(() => {
        if (!collisionChecked) {
            const hasCollided = checkCollision(img);
            if (hasCollided) {
                collisionChecked = true;
                clearInterval(checkInterval);
            }
        }
    }, 30);
    
    const trashType = item.type;
    const trashPosition = position;
    
    setTimeout(() => {
        clearInterval(checkInterval);
        
        if (!collisionChecked) {
            const imgRect = img.getBoundingClientRect();
            const gameHeight = window.innerHeight - 60;
            
            if (imgRect.bottom >= gameHeight - 30) {
                updateHealth(5);
            }
        }
        
        activeTrash[trashType] = activeTrash[trashType].filter(t => t.position !== trashPosition);
        
        if (img.parentNode === container) {
            img.remove();
            activeImages--;
        }
    }, speed * 1000);
}

function createCat() {
    if (activeCats >= maxCats) return;
    
    const catImg = document.createElement("img");
    catImg.src = catImages[0];
    catImg.classList.add("cat");
    
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight - 60;
    
    const startX = Math.random() * (screenWidth - 60);
    const startY = 60 + Math.random() * (screenHeight - 120);
    
    catImg.style.left = startX + "px";
    catImg.style.top = startY + "px";
    
    catsContainer.appendChild(catImg);
    activeCats++;
    
    let currentX = startX;
    let currentY = startY;
    let targetX, targetY;
    let speed = 0.5 + Math.random() * 1.5;
    
    function moveCat() {
        if (!catImg.parentNode) return;
        
        if (!targetX || !targetY || 
            Math.abs(currentX - targetX) < 1 && Math.abs(currentY - targetY) < 1) {
            
            targetX = Math.random() * (screenWidth - 60);
            targetY = 60 + Math.random() * (screenHeight - 120);
            speed = 0.5 + Math.random() * 1.5;
            
            if (targetX < currentX) {
                catImg.style.transform = "scaleX(-1)";
            } else {
                catImg.style.transform = "scaleX(1)";
            }
        }
        
        const dx = targetX - currentX;
        const dy = targetY - currentY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            currentX += (dx / distance) * speed;
            currentY += (dy / distance) * speed;
            
            catImg.style.left = currentX + "px";
            catImg.style.top = currentY + "px";
        }
        
        requestAnimationFrame(moveCat);
    }
    
    moveCat();
    
    const catDuration = 10000 + Math.random() * 20000;
    
    setTimeout(() => {
        if (catImg.parentNode === catsContainer) {
            catImg.remove();
            activeCats--;
        }
    }, catDuration);
}

function updateCursor(direction, x, y) {
    if (direction === 'left') {
        cursor.src = leftGrabbing;
    } else if (direction === 'right') {
        cursor.src = rightGrabbing;
    }
    
    cursor.style.left = x + "px";
    cursor.style.top = y + "px";
    cursor.style.transform = "translate(-50%, -50%)";
}

function resetCursor(x, y) {
    cursor.src = "../assets/ui/handpointing.cur";
    cursor.style.left = x + "px";
    cursor.style.top = y + "px";
    
    const screenWidth = window.innerWidth;
    
    if (x < screenWidth / 2) {
        cursor.style.transform = "translate(-50%, -50%) scaleX(-1)";
    } else {
        cursor.style.transform = "translate(-50%, -50%) scaleX(1)";
    }
}

function updateBinImage(direction) {
    if (!draggedBin) return;
    
    const binFront = draggedBin.querySelector('.bin-front');
    const binType = draggedBin.dataset.type;
    
    if (direction === 'left') {
        if (binType === 'paper') binFront.src = "../assets/gm/dump/bluedumpleft.png";
        else if (binType === 'plastic') binFront.src = "../assets/gm/dump/yellowdumpleft.png";
        else if (binType === 'glass') binFront.src = "../assets/gm/dump/greendumpleft.png";
        else if (binType === 'organic') binFront.src = "../assets/gm/dump/browndumpleft.png";
    } else if (direction === 'right') {
        if (binType === 'paper') binFront.src = "../assets/gm/dump/bluedumpright.png";
        else if (binType === 'plastic') binFront.src = "../assets/gm/dump/yellowdumpright.png";
        else if (binType === 'glass') binFront.src = "../assets/gm/dump/greendumpright.png";
        else if (binType === 'organic') binFront.src = "../assets/gm/dump/browndumpright.png";
    }
    
    lastDirection = direction;
}

function resetBinImage() {
    if (!draggedBin) return;
    
    const binFront = draggedBin.querySelector('.bin-front');
    const binType = draggedBin.dataset.type;
    
    if (binType === 'paper') binFront.src = "../assets/gm/dump/bluedumpfrt.png";
    else if (binType === 'plastic') binFront.src = "../assets/gm/dump/yellowdumpfrt.png";
    else if (binType === 'glass') binFront.src = "../assets/gm/dump/greendumpfrt.png";
    else if (binType === 'organic') binFront.src = "../assets/gm/dump/browndumpfrt.png";
    
    lastDirection = null;
}

function startDrag(e) {
    e.preventDefault();
    draggedBin = this;
    draggedBin.classList.add('dragging');
    
    let clientX, clientY;
    
    if (e.type === 'touchstart') {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
        startX = clientX;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
        startX = clientX;
    }
    
    startLeft = parseInt(getComputedStyle(draggedBin).left) || 0;
    
    const currentDirection = 'right';
    updateCursor(currentDirection, clientX, clientY);
    
    if (e.type === 'mousedown') {
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', stopDrag);
    } else {
        document.addEventListener('touchmove', onDrag);
        document.addEventListener('touchend', stopDrag);
    }
}

function onDrag(e) {
    if (!draggedBin) return;
    
    e.preventDefault();
    let clientX, clientY;
    
    if (e.type === 'touchmove') {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    
    const deltaX = clientX - startX;
    let newLeft = startLeft + deltaX;
    
    const screenWidth = window.innerWidth;
    const binWidth = draggedBin.offsetWidth;
    const minLeft = 10;
    const maxLeft = screenWidth - binWidth - 10;
    
    if (newLeft < minLeft) newLeft = minLeft;
    if (newLeft > maxLeft) newLeft = maxLeft;
    
    draggedBin.style.left = newLeft + 'px';
    
    const currentDirection = deltaX > 0 ? 'right' : 'left';
    
    if (Math.abs(deltaX) > 10 && currentDirection !== lastDirection) {
        updateBinImage(currentDirection);
    }
    
    updateCursor(currentDirection, clientX, clientY);
}

function stopDrag(e) {
    let clientX, clientY;
    
    if (e.type === 'touchend') {
        if (e.changedTouches && e.changedTouches[0]) {
            clientX = e.changedTouches[0].clientX;
            clientY = e.changedTouches[0].clientY;
        } else {
            clientX = 0;
            clientY = 0;
        }
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    
    if (draggedBin) {
        draggedBin.classList.remove('dragging');
        resetBinImage();
        resetCursor(clientX, clientY);
        draggedBin = null;
        lastDirection = null;
    }
    
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchmove', onDrag);
    document.removeEventListener('touchend', stopDrag);
}

function initBinsPositions() {
    const screenWidth = window.innerWidth;
    const binWidth = 180;
    const spacing = (screenWidth - (binWidth * 4)) / 5;
    
    bins.forEach((bin, index) => {
        const left = spacing + (spacing + binWidth) * index;
        bin.style.left = left + 'px';
    });
}

const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

setInterval(createFallingImage, 1500);

setTimeout(() => {
    createCat();
}, 2000);

document.addEventListener('mousemove', e => {
    if (draggedBin) return;
    
    const x = e.clientX;
    const y = e.clientY;
    const screenWidth = window.innerWidth;

    if (x < screenWidth / 2) {
        cursor.style.transform = "translate(-50%, -50%) scaleX(-1)";
    } else {
        cursor.style.transform = "translate(-50%, -50%) scaleX(1)";
    }

    cursor.style.left = x + "px";
    cursor.style.top = y + "px";
});

if (isTouchDevice) {
    if (cursor) {
        cursor.style.display = "none";
    }
}

bins.forEach(bin => {
    bin.addEventListener('mousedown', startDrag);
    bin.addEventListener('touchstart', startDrag);
});

window.addEventListener('resize', initBinsPositions);
initBinsPositions();