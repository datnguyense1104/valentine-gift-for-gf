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
const letterTextEl = document.getElementById("letter-text");

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

// ====== LETTER TYPING EFFECT ======
let letterFullHTML = '';
let letterPlainText = '';
let letterTypingTimer = null;

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

if (letterTextEl) {
    letterFullHTML = letterTextEl.innerHTML;
    letterPlainText = letterFullHTML.replace(/<br\s*\/?>/gi, '\n');
}

function startLetterTyping(speed = 28) {
    if (!letterTextEl) return;
    // cancel previous
    if (letterTypingTimer) { clearTimeout(letterTypingTimer); letterTypingTimer = null; }
    letterTextEl.innerHTML = '';
    let i = 0;

    function step() {
        if (i >= letterPlainText.length) return;
        const ch = letterPlainText.charAt(i);
        if (ch === '\n') {
            letterTextEl.innerHTML += '<br>';
        } else {
            letterTextEl.innerHTML += escapeHtml(ch);
        }
        i++;
        letterTypingTimer = setTimeout(step, speed);
    }
    step();
}

function stopLetterTyping() {
    if (letterTypingTimer) { clearTimeout(letterTypingTimer); letterTypingTimer = null; }
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

    // Bắt đầu typing thư sau khi màn hình hiện
    setTimeout(() => {
        startLetterTyping();
    }, 600);
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
    // Khi quay lại, hủy typing và khôi phục nội dung đầy đủ
    stopLetterTyping();
    if (letterTextEl) letterTextEl.innerHTML = letterFullHTML;
    switchScreen(letterScreen, greetingScreen);
});

// EVENT: Quay lại từ màn hình ảnh
backFromPhoto.addEventListener("click", () => {
    switchScreen(photoScreen, greetingScreen);
});

// EVENT: Quay lại từ màn hình record
backFromRecord.addEventListener("click", () => {
    // Stop and reset audio
    audio.pause();
    audio.currentTime = 0;
    isPlaying = false;
    playIcon.textContent = '▶️';
    
    switchScreen(recordScreen, greetingScreen);
});

// ====== VOICE MESSAGE LOGIC ======

// Audio setup - Bạn thay URL này bằng link âm thanh của bạn
const audio = new Audio('https://res.cloudinary.com/dnekdzet8/video/upload/v1770989303/bemy_yfazwm.m4a');

const waveformContainer = document.getElementById('waveform-container');
const waveformCanvas = document.getElementById('waveform-canvas');
const playhead = document.getElementById('playhead');
const playPauseBtn = document.getElementById('play-pause-btn');
const playIcon = document.getElementById('play-icon');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const voiceDurationEl = document.getElementById('voice-duration');

let isPlaying = false;
let isDragging = false;
let waveformData = [];

// Format time in MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Generate random waveform data (simulating audio waveform)
function generateWaveform() {
    waveformData = [];
    const barCount = 80;
    for (let i = 0; i < barCount; i++) {
        // Create varied heights for visual interest
        const height = Math.random() * 0.7 + 0.3;
        waveformData.push(height);
    }
}

// Draw waveform on canvas
function drawWaveform() {
    const ctx = waveformCanvas.getContext('2d');
    const width = waveformCanvas.width;
    const height = waveformCanvas.height;
    const barCount = waveformData.length;
    const barWidth = width / barCount;
    const gap = 2;
    
    ctx.clearRect(0, 0, width, height);
    
    const currentProgress = audio.duration ? audio.currentTime / audio.duration : 0;
    
    for (let i = 0; i < barCount; i++) {
        const barHeight = waveformData[i] * height * 0.8;
        const x = i * barWidth;
        const y = (height - barHeight) / 2;
        
        // Color based on playback progress
        const barProgress = i / barCount;
        if (barProgress <= currentProgress) {
            ctx.fillStyle = '#ff4d8d'; // Played portion - pink
        } else {
            ctx.fillStyle = '#ddd'; // Unplayed portion - gray
        }
        
        ctx.fillRect(x + gap / 2, y, barWidth - gap, barHeight);
    }
}

// Update playhead position
function updatePlayhead() {
    if (audio.duration) {
        const progress = audio.currentTime / audio.duration;
        playhead.style.left = `${progress * 100}%`;
        currentTimeEl.textContent = formatTime(audio.currentTime);
        drawWaveform();
    }
}

// Play/Pause button
playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        playIcon.textContent = '▶️';
        isPlaying = false;
    } else {
        audio.play();
        playIcon.textContent = '⏸️';
        isPlaying = true;
    }
});

// Handle seeking by clicking/dragging on waveform
function seek(clientX) {
    const rect = waveformContainer.getBoundingClientRect();
    const x = clientX - rect.left;
    const progress = Math.max(0, Math.min(1, x / rect.width));
    
    if (audio.duration) {
        audio.currentTime = progress * audio.duration;
        updatePlayhead();
    }
}

// Mouse events for scrubbing
waveformContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    seek(e.clientX);
    
    // Auto-play when scrubbing
    if (!isPlaying) {
        audio.play();
        playIcon.textContent = '⏸️';
        isPlaying = true;
    }
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        seek(e.clientX);
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

// Touch events for mobile
waveformContainer.addEventListener('touchstart', (e) => {
    isDragging = true;
    const touch = e.touches[0];
    seek(touch.clientX);
    
    if (!isPlaying) {
        audio.play();
        playIcon.textContent = '⏸️';
        isPlaying = true;
    }
});

document.addEventListener('touchmove', (e) => {
    if (isDragging) {
        const touch = e.touches[0];
        seek(touch.clientX);
    }
});

document.addEventListener('touchend', () => {
    isDragging = false;
});

// Audio event listeners
audio.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = formatTime(audio.duration);
    voiceDurationEl.textContent = formatTime(audio.duration);
    generateWaveform();
    drawWaveform();
});

audio.addEventListener('timeupdate', () => {
    if (!isDragging) {
        updatePlayhead();
    }
});

audio.addEventListener('ended', () => {
    isPlaying = false;
    playIcon.textContent = '▶️';
    audio.currentTime = 0;
    updatePlayhead();
});

// Initialize waveform on load
generateWaveform();
drawWaveform();