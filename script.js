// Lấy các elements
const giftScreen = document.getElementById("gift-screen");
const greetingScreen = document.getElementById("greeting-screen");
const letterScreen = document.getElementById("letter-screen");
const photoScreen = document.getElementById("photo-screen");
const recordScreen = document.getElementById("record-screen");

const giftBox = document.getElementById("gift-box");
const typingElement = document.getElementById("typing-text");
const letterCard = document.getElementById("letter-card");
const photoCard = document.getElementById("photo-card");
const recordCard = document.getElementById("record-card");
const backFromLetter = document.getElementById("back-from-letter");
const backFromPhoto = document.getElementById("back-from-photo");
const backFromRecord = document.getElementById("back-from-record");

// Record player elements
const vinylRecord = document.getElementById("vinyl-record");
const tonearm = document.getElementById("tonearm");
const nowPlaying = document.getElementById("now-playing");
const playbackSpeed = document.getElementById("playback-speed");

// Nội dung typing
const greetingText = "Happy Valentine yayyyyyy!";
let typingIndex = 0;

// Function: Typing effect
function typeWriter() {
    if (typingIndex < greetingText.length) {
        typingElement.innerHTML += greetingText.charAt(typingIndex);
        typingIndex++;
        setTimeout(typeWriter, 100);
    } else {
        typingElement.innerHTML += '<span class="cursor">|</span>';
    }
}

// Function: Chuyển screen
function switchScreen(hideScreen, showScreen) {
    hideScreen.style.opacity = "0";
    
    setTimeout(() => {
        hideScreen.classList.add("hidden");
        showScreen.classList.remove("hidden");
        
        setTimeout(() => {
            showScreen.style.opacity = "1";
        }, 50);
    }, 500);
}

// EVENT: Click vào hộp quà
giftBox.addEventListener("click", () => {
    if (giftBox.classList.contains('open')) return;
    
    // Mở hộp quà
    giftBox.classList.add('open');
    
    // Sau 1 giây chuyển sang màn hình chúc mừng
    setTimeout(() => {
        switchScreen(giftScreen, greetingScreen);
        
        // Bắt đầu typing effect
        setTimeout(() => {
            typeWriter();
        }, 300);
    }, 1000);
});

// EVENT: Click vào card thư
letterCard.addEventListener("click", () => {
    switchScreen(greetingScreen, letterScreen);
});

// EVENT: Click vào card ảnh
photoCard.addEventListener("click", () => {
    switchScreen(greetingScreen, photoScreen);
});

// EVENT: Click vào card record
recordCard.addEventListener("click", () => {
    switchScreen(greetingScreen, recordScreen);
});

// EVENT: Quay lại từ màn hình thư
backFromLetter.addEventListener("click", () => {
    switchScreen(letterScreen, greetingScreen);
});

// EVENT: Quay lại từ màn hình ảnh
backFromPhoto.addEventListener("click", () => {
    switchScreen(photoScreen, greetingScreen);
});

// EVENT: Quay lại từ màn hình record
backFromRecord.addEventListener("click", () => {
    stopAudio();
    switchScreen(recordScreen, greetingScreen);
});

// ====== RECORD PLAYER LOGIC ======

// Audio setup - Bạn thay URL này bằng link nhạc của bạn
const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
audio.loop = true;

let isDraggingTonearm = false;
let isDraggingVinyl = false;
let currentRotation = 0;
let lastAngle = 0;
let rotationSpeed = 0;
let animationId = null;
let isPlaying = false;

// Function: Calculate angle from center
function getAngle(event, element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const clientX = event.type.includes('touch') ? event.touches[0].clientX : event.clientX;
    const clientY = event.type.includes('touch') ? event.touches[0].clientY : event.clientY;
    
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    
    return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
}

// Function: Update playback based on rotation speed
function updatePlayback() {
    const speedFactor = Math.abs(rotationSpeed) / 10;
    
    if (speedFactor > 0.1) {
        if (!isPlaying) {
            audio.play();
            isPlaying = true;
            nowPlaying.textContent = '🎵 Đang phát nhạc...';
        }
        
        // Adjust playback rate based on rotation speed
        const playbackRate = Math.min(Math.max(speedFactor, 0.25), 3);
        audio.playbackRate = playbackRate;
        playbackSpeed.textContent = `Speed: ${playbackRate.toFixed(1)}x`;
        
        // Reverse audio direction if rotating backwards
        if (rotationSpeed < 0) {
            nowPlaying.textContent = '🔄 Đang tua ngược...';
        }
    } else {
        stopAudio();
    }
}

// Function: Stop audio
function stopAudio() {
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
        nowPlaying.textContent = 'Kéo cần gạt hoặc quay đĩa để phát ✨';
        playbackSpeed.textContent = 'Speed: 0.0x';
    }
}

// Tonearm drag logic
tonearm.addEventListener('mousedown', startDragTonearm);
tonearm.addEventListener('touchstart', startDragTonearm);

function startDragTonearm(e) {
    e.preventDefault();
    isDraggingTonearm = true;
    
    document.addEventListener('mousemove', dragTonearm);
    document.addEventListener('touchmove', dragTonearm);
    document.addEventListener('mouseup', stopDragTonearm);
    document.addEventListener('touchend', stopDragTonearm);
}

function dragTonearm(e) {
    if (!isDraggingTonearm) return;
    
    const angle = getAngle(e, tonearm);
    const clampedAngle = Math.max(-45, Math.min(45, angle - 45));
    
    tonearm.style.transform = `rotate(${clampedAngle}deg)`;
    
    // Start playing when tonearm is moved
    if (Math.abs(clampedAngle) > 5 && !isPlaying) {
        audio.play();
        isPlaying = true;
        nowPlaying.textContent = '🎵 Đang phát nhạc...';
        playbackSpeed.textContent = 'Speed: 1.0x';
        startVinylRotation();
    }
}

function stopDragTonearm() {
    isDraggingTonearm = false;
    document.removeEventListener('mousemove', dragTonearm);
    document.removeEventListener('touchmove', dragTonearm);
    document.removeEventListener('mouseup', stopDragTonearm);
    document.removeEventListener('touchend', stopDragTonearm);
}

// Vinyl drag and rotate logic
vinylRecord.addEventListener('mousedown', startDragVinyl);
vinylRecord.addEventListener('touchstart', startDragVinyl);

function startDragVinyl(e) {
    e.preventDefault();
    isDraggingVinyl = true;
    lastAngle = getAngle(e, vinylRecord);
    
    document.addEventListener('mousemove', dragVinyl);
    document.addEventListener('touchmove', dragVinyl);
    document.addEventListener('mouseup', stopDragVinyl);
    document.addEventListener('touchend', stopDragVinyl);
}

function dragVinyl(e) {
    if (!isDraggingVinyl) return;
    
    const currentAngle = getAngle(e, vinylRecord);
    let delta = currentAngle - lastAngle;
    
    // Handle angle wrap-around
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    
    currentRotation += delta;
    rotationSpeed = delta;
    lastAngle = currentAngle;
    
    vinylRecord.style.transform = `translate(-50%, -50%) rotate(${currentRotation}deg)`;
    
    updatePlayback();
}

function stopDragVinyl() {
    isDraggingVinyl = false;
    rotationSpeed = 0;
    
    setTimeout(() => {
        if (!isDraggingVinyl) {
            stopAudio();
        }
    }, 100);
    
    document.removeEventListener('mousemove', dragVinyl);
    document.removeEventListener('touchmove', dragVinyl);
    document.removeEventListener('mouseup', stopDragVinyl);
    document.removeEventListener('touchend', stopDragVinyl);
}

// Auto-rotate vinyl when playing from tonearm
function startVinylRotation() {
    if (animationId) return;
    
    function rotate() {
        if (isPlaying && !isDraggingVinyl) {
            currentRotation += 1;
            vinylRecord.style.transform = `translate(-50%, -50%) rotate(${currentRotation}deg)`;
            animationId = requestAnimationFrame(rotate);
        } else {
            animationId = null;
        }
    }
    
    rotate();
}