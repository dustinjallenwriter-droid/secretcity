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
