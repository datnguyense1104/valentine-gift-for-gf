// Các nội dung cần thiết
const greetingText = "Happy Valentine yayyyyyy!";
const typingElement = document.getElementById("typing-text");
const welcomeScreen = document.getElementById("welcome-screen");
const galleryScreen = document.getElementById("gallery-screen");
const startBtn = document.getElementById("start-btn");
const backBtn = document.getElementById("back-btn");

// Logic hiệu ứng Typing
let index = 0;
function typeWriter() {
    if (index < greetingText.length) {
        typingElement.innerHTML += greetingText.charAt(index);
        index++;
        setTimeout(typeWriter, 100); // Tốc độ gõ (100ms)
    } else {
        // Sau khi gõ xong thì thêm con trỏ nhấp nháy (tùy chọn)
        typingElement.innerHTML += '<span class="cursor">|</span>';
    }
}

// Chạy hiệu ứng khi tải trang
window.onload = function() {
    typeWriter();
};

// Logic chuyển trang
startBtn.addEventListener("click", () => {
    // Ẩn màn hình chào mừng
    welcomeScreen.style.opacity = "0";
    
    // Đợi 0.5s (bằng thời gian transition trong CSS) rồi ẩn hẳn và hiện gallery
    setTimeout(() => {
        welcomeScreen.classList.add("hidden");
        galleryScreen.classList.remove("hidden");
        
        // Thêm timeout nhỏ để CSS transition hoạt động (opacity từ 0 -> 1)
        setTimeout(() => {
            galleryScreen.style.opacity = "1";
        }, 50);
    }, 500);
});

// Logic quay lại (nếu cần)
backBtn.addEventListener("click", () => {
    galleryScreen.style.opacity = "0";
    setTimeout(() => {
        galleryScreen.classList.add("hidden");
        welcomeScreen.classList.remove("hidden");
        setTimeout(() => {
            welcomeScreen.style.opacity = "1";
        }, 50);
    }, 500);
});