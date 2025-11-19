
// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const passwordToggle = document.getElementById('passwordToggle');
const rememberMeCheckbox = document.getElementById('rememberMe');
const loginButton = document.querySelector('.login-button');
 
// Password Toggle Functionality
passwordToggle.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
   
    const icon = this.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
});
 
// Form Validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
 
function validatePassword(password) {
    return password.length >= 3;
}
 
function showError(input, message) {
    const formGroup = input.closest('.form-group');
    const existingError = formGroup.querySelector('.error-message');
   
    if (existingError) {
        existingError.remove();
    }
   
    input.classList.add('error');
    input.classList.remove('success');
   
    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    formGroup.appendChild(errorElement);
}
 
function showSuccess(input) {
    const formGroup = input.closest('.form-group');
    const existingError = formGroup.querySelector('.error-message');
   
    if (existingError) {
        existingError.remove();
    }
   
    input.classList.remove('error');
    input.classList.add('success');
}
 
function clearValidation(input) {
    const formGroup = input.closest('.form-group');
    const existingError = formGroup.querySelector('.error-message');
   
    if (existingError) {
        existingError.remove();
    }
   
    input.classList.remove('error', 'success');
}
 
// Real-time Validation
emailInput.addEventListener('input', function() {
    const email = this.value.trim();
   
    if (email === '') {
        clearValidation(this);
    } else if (!validateEmail(email)) {
        showError(this, 'Please enter a valid email address');
    } else {
        showSuccess(this);
    }
});
 
passwordInput.addEventListener('input', function() {
    const password = this.value;
   
    if (password === '') {
        clearValidation(this);
    } else if (!validatePassword(password)) {
        showError(this, 'Password must be at least 6 characters long');
    } else {
        showSuccess(this);
    }
});
 
// Form Submission
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
   
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const rememberMe = rememberMeCheckbox.checked;
   
    // Clear previous validations
    clearValidation(emailInput);
    clearValidation(passwordInput);
   
    let isValid = true;
   
    // Validate email
    if (email === '') {
        showError(emailInput, 'Email is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError(emailInput, 'Please enter a valid email address');
        isValid = false;
    }
   
    // Validate password
    if (password === '') {
        showError(passwordInput, 'Password is required');
        isValid = false;
    } else if (!validatePassword(password)) {
        showError(passwordInput, 'Password must be at least 6 characters long');
        isValid = false;
    }
   
    if (isValid) {
        // Show loading state
        loginButton.classList.add('loading');
        loginButton.disabled = true;
       
        // Simulate API call
        setTimeout(() => {
            // Remove loading state
            loginButton.classList.remove('loading');
            loginButton.disabled = false;
           
            // Show success message (in a real app, you'd redirect or show a success state)
            showSuccessMessage();
        }, 2000);
    }
});
 
// Success Message
function showSuccessMessage() {
    const buttonText = loginButton.querySelector('.button-text');
    const originalText = buttonText.textContent;
   
    buttonText.textContent = 'Login Successful!';
    loginButton.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
   
    setTimeout(() => {
        buttonText.textContent = originalText;
        loginButton.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }, 3000);
}
 
// Social Login Buttons
document.querySelector('.google-button').addEventListener('click', function() {
    // Simulate Google login
    console.log('Google login clicked');
    showSocialLoginMessage('Google');
});
 
document.querySelector('.microsoft-button').addEventListener('click', function() {
    // Simulate Microsoft login
    console.log('Microsoft login clicked');
    showSocialLoginMessage('Microsoft');
});
 
function showSocialLoginMessage(provider) {
    const button = document.querySelector(`.${provider.toLowerCase()}-button`);
    const originalContent = button.innerHTML;
   
    button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> <span>Connecting to ${provider}...</span>`;
    button.disabled = true;
   
    setTimeout(() => {
        button.innerHTML = originalContent;
        button.disabled = false;
    }, 2000);
}
 
// Forgot Password Link
document.querySelector('.forgot-password').addEventListener('click', function(e) {
    e.preventDefault();
   
    const email = emailInput.value.trim();
   
    if (email === '' || !validateEmail(email)) {
        showError(emailInput, 'Please enter a valid email address first');
        emailInput.focus();
        return;
    }
   
    // Simulate forgot password functionality
    alert(`Password reset link has been sent to ${email}`);
});
 
// Signup Link
document.querySelector('.signup-text').addEventListener('click', function(e) {
    e.preventDefault();
    alert('Sign up functionality would be implemented here');
});
 
// Keyboard Navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.classList.contains('form-input')) {
        const inputs = Array.from(document.querySelectorAll('.form-input'));
        const currentIndex = inputs.indexOf(e.target);
       
        if (currentIndex < inputs.length - 1) {
            inputs[currentIndex + 1].focus();
        } else {
            loginForm.dispatchEvent(new Event('submit'));
        }
    }
});
 
// Auto-focus on email input when page loads
window.addEventListener('load', function() {
    emailInput.focus();
});
 
// Add smooth scrolling for better UX
document.documentElement.style.scrollBehavior = 'smooth';
 
// Add some interactive animations
const floatingCircles = document.querySelectorAll('.floating-circle');
floatingCircles.forEach((circle, index) => {
    circle.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.background = 'rgba(255, 255, 255, 0.2)';
    });
   
    circle.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.background = 'rgba(255, 255, 255, 0.1)';
    });
});
 
// Add ripple effect to buttons
function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
   
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');
   
    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }
   
    button.appendChild(circle);
}
 
// Add ripple effect to login button
loginButton.addEventListener('click', createRipple);
 
// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
   
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
 
 