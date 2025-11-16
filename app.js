// Predefined users
const users = [
  { username: "user1", password: "Pass@123" },
  { username: "user2", password: "Demo@456" },
  { username: "admin", password: "Admin@789" }
];

// SPA Pages
const pages = [
  { label: "Page 1", url: "https://example.com/page1" },
  { label: "Page 2", url: "https://example.com/page2" },
  { label: "Page 3", url: "https://example.com/page3" }
];

// DOM Elements
const loginForm = document.getElementById("loginForm");
const loginBtn = document.getElementById("loginBtn");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("loginError");

const spaContainer = document.getElementById("spaContainer");
const userLabel = document.getElementById("userLabel");
const logoutBtn = document.getElementById("logoutBtn");

const buttonContainer = document.getElementById("buttonContainer");

const pageModal = document.getElementById("pageModal");
const modalIframe = document.getElementById("modalIframe");
const closeModalBtn = document.getElementById("closeModal");

// Login
loginBtn.addEventListener("click", () => {
  const username = usernameInput.value;
  const password = passwordInput.value;
  const user = users.find(u => u.username === username && u.password === password);

  if(user) {
    loginForm.style.display = "none";
    spaContainer.style.display = "block";
    userLabel.textContent = username;
    generateButtons();
    loginError.textContent = "";
  } else {
    loginError.textContent = "Invalid username or password";
  }
});

// Logout
logoutBtn.addEventListener("click", () => {
  loginForm.style.display = "flex";
  spaContainer.style.display = "none";
  usernameInput.value = "";
  passwordInput.value = "";
  loginError.textContent = "";
  closeModal();
});

// Generate SPA buttons
function generateButtons() {
  buttonContainer.innerHTML = "";
  pages.forEach(page => {
    const btn = document.createElement("button");
    btn.textContent = page.label;
    btn.className = "page-btn";
    btn.onclick = () => openModal(page.url);
    buttonContainer.appendChild(btn);
  });
}

// Modal functions
function openModal(url) {
  modalIframe.src = url;
  pageModal.style.display = "block";
}

function closeModal() {
  modalIframe.src = "";
  pageModal.style.display = "none";
}

// Close modal when clicking outside
window.onclick = function(event) {
  if(event.target == pageModal) closeModal();
}

closeModalBtn.addEventListener("click", closeModal);
