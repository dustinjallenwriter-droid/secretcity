let completedQuestions = [];
let currentQuestion = 1;
const totalQuestions = 3;

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
}

// Drag and drop functionality
let draggedCard = null;

document.addEventListener('DOMContentLoaded', () => {
    initDragAndDrop();
    
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
});

function initDragAndDrop() {
    const cards = document.querySelectorAll('.sort-card');
    const zones = document.querySelectorAll('.drop-zone');

    cards.forEach(card => {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
        
        // Touch support
        card.addEventListener('touchstart', handleTouchStart, { passive: false });
        card.addEventListener('touchmove', handleTouchMove, { passive: false });
        card.addEventListener('touchend', handleTouchEnd);
    });

    zones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.addEventListener('drop', handleDrop);
    });
}

function handleDragStart(e) {
    draggedCard = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd() {
    this.classList.remove('dragging');
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.classList.remove('drag-over');
    });
}

function handleDragOver(e) {
    e.preventDefault();
    this.classList.add('drag-over');
}

function handleDragLeave() {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    
    if (draggedCard) {
        const zoneCards = this.querySelector('.zone-cards');
        draggedCard.classList.add('placed');
        zoneCards.appendChild(draggedCard);
        draggedCard = null;
        
        checkIfAllCardsSorted();
    }
}

// Touch support for mobile
let touchOffsetX, touchOffsetY;

function handleTouchStart(e) {
    draggedCard = this;
    const touch = e.touches[0];
    const rect = this.getBoundingClientRect();
    touchOffsetX = touch.clientX - rect.left;
    touchOffsetY = touch.clientY - rect.top;
    this.classList.add('dragging');
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!draggedCard) return;
    
    const touch = e.touches[0];
    draggedCard.style.position = 'fixed';
    draggedCard.style.left = (touch.clientX - touchOffsetX) + 'px';
    draggedCard.style.top = (touch.clientY - touchOffsetY) + 'px';
    draggedCard.style.zIndex = '1000';
}

function handleTouchEnd(e) {
    if (!draggedCard) return;
    
    const touch = e.changedTouches[0];
    const dropZones = document.querySelectorAll('.drop-zone');
    
    dropZones.forEach(zone => {
        const rect = zone.getBoundingClientRect();
        if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
            touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
            const zoneCards = zone.querySelector('.zone-cards');
            draggedCard.classList.add('placed');
            draggedCard.style.position = '';
            draggedCard.style.left = '';
            draggedCard.style.top = '';
            draggedCard.style.zIndex = '';
            zoneCards.appendChild(draggedCard);
        }
    });
    
    draggedCard.classList.remove('dragging');
    draggedCard.style.position = '';
    draggedCard.style.left = '';
    draggedCard.style.top = '';
    draggedCard.style.zIndex = '';
    draggedCard = null;
    
    checkIfAllCardsSorted();
}

function checkIfAllCardsSorted() {
    const remainingCards = document.querySelectorAll('#cardStack .sort-card');
    if (remainingCards.length === 0) {
        document.querySelector('#question2 .submit-btn').style.display = 'block';
    }
}

function checkSorting() {
    const productiveZone = document.getElementById('productiveZone');
    const unproductiveZone = document.getElementById('unproductiveZone');
    let allCorrect = true;

    // Check productive zone
    productiveZone.querySelectorAll('.sort-card').forEach(card => {
        if (card.dataset.category === 'productive') {
            card.classList.add('correct');
        } else {
            card.classList.add('incorrect');
            allCorrect = false;
        }
    });

    // Check unproductive zone
    unproductiveZone.querySelectorAll('.sort-card').forEach(card => {
        if (card.dataset.category === 'unproductive') {
            card.classList.add('correct');
        } else {
            card.classList.add('incorrect');
            allCorrect = false;
        }
    });

    // Show feedback
    const feedback = document.getElementById('feedback2');
    feedback.classList.add('show');
    if (!allCorrect) {
        feedback.classList.add('incorrect');
    }

    // Hide submit
    document.querySelector('#question2 .submit-btn').style.display = 'none';

    // Mark completed
    markCompleted(2);
}