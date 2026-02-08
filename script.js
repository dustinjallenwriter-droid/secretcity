document.addEventListener('DOMContentLoaded', () => {
    const crawl = document.querySelector('.crawl');
    const beginBtn = document.getElementById('beginBtn');
    
    // Lock the crawl in place after animation completes
    setTimeout(() => {
        crawl.classList.add('locked');
    }, 12000); // Matches 5s animation duration
    
    // Begin button click handler
    beginBtn.addEventListener('click', () => {
        // Fade out intro
        document.querySelector('.intro-container').style.opacity = '0';
        document.querySelector('.intro-container').style.transition = 'opacity 1s';
        
        // Navigate to main content after fade
        setTimeout(() => {
            window.location.href = 'module.html'; // Your main training page
        }, 1000);
    });
});

let currentStep = 1;
const totalSteps = 4;

function showStep(stepNumber) {
    currentStep = stepNumber;
    
    // Hide all step cards
    document.querySelectorAll('.step-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Show selected step
    document.getElementById('step' + stepNumber).classList.add('active');
    
    // Update dots
    document.querySelectorAll('.step-dot').forEach(dot => {
        dot.classList.remove('active');
        if (parseInt(dot.dataset.step) < stepNumber) {
            dot.classList.add('completed');
        }
    });
    document.querySelector('.step-dot[data-step="' + stepNumber + '"]').classList.add('active');
}

function prevStep() {
    if (currentStep > 1) {
        showStep(currentStep - 1);
    }
}

function nextStep() {
    if (currentStep < totalSteps) {
        showStep(currentStep + 1);
    }
}

function completeSteps() {
    document.querySelectorAll('.step-dot').forEach(dot => {
        dot.classList.add('completed');
    });
}