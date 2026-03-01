let completedQuestions = [];
let currentQuestion = 1;
const totalQuestions = 3;

// Sorting activity state
const sortCards = [
    { text: "Ignoring each other and looking at you for help", category: "unproductive" },
    { text: "Animated discussion", category: "productive" },
    { text: "Extended silence and checking phones", category: "unproductive" },
    { text: "Physical engagement with game pieces", category: "productive" },
    { text: "Players pointing at puzzle elements", category: "productive" },
    { text: "Arms crossed, heads down", category: "unproductive" }
];
let currentCardIndex = 0;
let sortScore = 0;

// Multiple choice submission
function submitAnswer(questionNum) {
    const selected = document.querySelector(`input[name="q${questionNum}"]:checked`);
    if (!selected) return;
    
    const isCorrect = selected.dataset.correct === 'true';
    const feedback = document.getElementById(`feedback${questionNum}`);
    
    // Show feedback
    feedback.classList.add('show');
    if (!isCorrect) {
        feedback.classList.add('incorrect');
        feedback.querySelector('.feedback-label').textContent = 'Incorrect';
        feedback.querySelector('.checkmark').textContent = '✗';
    }
    
    // Disable further input
    document.querySelectorAll(`input[name="q${questionNum}"]`).forEach(input => {
        input.disabled = true;
    });
    
    // Hide submit button
    const submitBtn = document.querySelector(`#question${questionNum} .submit-btn`);
    submitBtn.style.display = 'none';
    
    // Mark as completed
    markCompleted(questionNum);
}

// Mark question completed and move to next
function markCompleted(questionNum) {
    if (!completedQuestions.includes(questionNum)) {
        completedQuestions.push(questionNum);
    }
    
    // Update progress dots
    const dot = document.querySelector(`.progress-dot[data-q="${questionNum}"]`);
    dot.classList.remove('active');
    dot.classList.add('completed');
    
    // Check if all done
    if (completedQuestions.length === totalQuestions) {
        document.getElementById('continueBtn').classList.add('show');
    } else {
        // Auto-advance after delay
        setTimeout(() => {
            const nextQ = questionNum + 1;
            if (nextQ <= totalQuestions) {
                showQuestion(nextQ);
            }
        }, 2000);
    }
}

function showQuestion(questionNum) {
    currentQuestion = questionNum;
    
    // Hide all questions
    document.querySelectorAll('.quiz-question').forEach(q => {
        q.classList.remove('active');
    });
    
    // Show selected question
    document.getElementById(`question${questionNum}`).classList.add('active');
    
    // Update progress dots
    document.querySelectorAll('.progress-dot').forEach(dot => {
        const dotNum = parseInt(dot.dataset.q);
        if (!completedQuestions.includes(dotNum)) {
            dot.classList.remove('active');
        }
        if (dotNum === questionNum && !completedQuestions.includes(dotNum)) {
            dot.classList.add('active');
        }
    });
    
    // Initialize sorting if question 2
    if (questionNum === 2) {
        initSorting();
    }
}

// Initialize sorting activity
function initSorting() {
    currentCardIndex = 0;
    sortScore = 0;
    document.getElementById('totalCards').textContent = sortCards.length;
    updateProgressBar();
    showCurrentCard();
}

// Show the current card
function showCurrentCard() {
    const cardElement = document.getElementById('currentCard');
    const cardNumberElement = document.getElementById('cardNumber');
    
    if (currentCardIndex < sortCards.length) {
        cardElement.textContent = sortCards[currentCardIndex].text;
        cardElement.className = 'current-card';
        cardNumberElement.textContent = currentCardIndex + 1;
    }
}

// Handle sorting a card
function sortCard(chosenCategory) {
    document.activeElement.blur();
    if (currentCardIndex >= sortCards.length) return;
    
    const card = sortCards[currentCardIndex];
    const cardElement = document.getElementById('currentCard');
    const isCorrect = card.category === chosenCategory;
    
    // Visual feedback on card
    if (isCorrect) {
        cardElement.classList.add('card-correct');
        sortScore++;
    } else {
        cardElement.classList.add('card-incorrect');
    }
    
    // Brief pause to show feedback, then next card
    setTimeout(() => {
        currentCardIndex++;
        updateProgressBar();
        
        if (currentCardIndex < sortCards.length) {
            showCurrentCard();
        } else {
            finishSorting();
        }
    }, 600);
}

// Update progress bar
function updateProgressBar() {
    const progress = (currentCardIndex / sortCards.length) * 100;
    document.getElementById('sortProgressBar').style.width = progress + '%';
}

// Finish sorting and show feedback
function finishSorting() {
    const feedback = document.getElementById('feedback2');
    const feedbackText = document.getElementById('feedback2Text');
    const cardContainer = document.querySelector('.current-card-container');
    const tapZones = document.querySelector('.tap-zones');
    
    // Hide the card and zones
    cardContainer.style.display = 'none';
    tapZones.style.display = 'none';
    
    // Show feedback
    feedback.classList.add('show');
    
    if (sortScore === sortCards.length) {
        feedbackText.textContent = `Perfect! You correctly identified all ${sortCards.length} behaviors.`;
    } else if (sortScore >= sortCards.length - 1) {
        feedbackText.textContent = `Nice work! You got ${sortScore} out of ${sortCards.length} correct.`;
    } else {
        feedback.classList.add('incorrect');
        feedback.querySelector('.feedback-label').textContent = 'Not quite';
        feedback.querySelector('.checkmark').textContent = '✗';
        feedbackText.textContent = `You got ${sortScore} out of ${sortCards.length} correct. Review the signs of productive stewing versus unproductive frustration.`;
    }
    
    // Mark completed
    markCompleted(2);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Click to select options
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', () => {
            const input = option.querySelector('input');
            input.checked = true;
            
            // Update visual selection
            const parent = option.closest('.options');
            parent.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
        });
    });
    
    // Initialize sorting if starting on question 2
    if (document.querySelector('#question2.active')) {
        initSorting();
    }
});
