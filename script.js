document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const theme = urlParams.get('theme');
    
    if (!theme || !allQuestions[theme]) {
        window.location.href = 'index.html';
        return;
    }
    
    const themeTitles = {
        basics: "Основы холодильной техники",
        refrigerants: "Хладагенты и масла",
        compressors: "Компрессоры",
        maintenance: "Монтаж и обслуживание"
    };
    
    document.getElementById('theme-title').textContent = themeTitles[theme];
    
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let questionsRemaining = 0;
    
    const questionText = document.getElementById('question-text');
    const answersContainer = document.getElementById('answers');
    const explanationContainer = document.getElementById('explanation');
    const explanationText = document.getElementById('explanation-text');
    const nextButton = document.getElementById('next-btn');
    const currentQElement = document.getElementById('current-q');
    const totalQElement = document.getElementById('total-q');
    const scoreDisplay = document.getElementById('score-display');
    const scoreElement = document.getElementById('score');
    
    function showQuestion() {
        const randomIndex = Math.floor(Math.random() * questions.length);
        currentQuestionIndex = randomIndex;
        const question = questions[currentQuestionIndex];
        
        currentQElement.textContent = (questionsRemaining - questions.length + 1) + '/' + questionsRemaining;
        
        questionText.textContent = question.question;
        answersContainer.innerHTML = '';
        explanationContainer.classList.add('hidden');
        
        const shuffledAnswers = [...question.answers].sort(() => Math.random() - 0.5);
        
        shuffledAnswers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.classList.add('answer-btn');
            button.textContent = answer.text;
            button.addEventListener('click', () => selectAnswer(answer, shuffledAnswers));
            answersContainer.appendChild(button);
        });
        
        questions.splice(currentQuestionIndex, 1);
    }
    
    function selectAnswer(selectedAnswer, answers) {
        const buttons = document.querySelectorAll('.answer-btn');
        buttons.forEach(button => button.disabled = true);
        
        buttons.forEach(button => {
            const answerText = button.textContent;
            const answer = answers.find(a => a.text === answerText);
            
            if (answer.correct) {
                button.classList.add('correct');
            } else if (answer === selectedAnswer) {
                button.classList.add('wrong');
            }
        });
        
        explanationText.textContent = questions[currentQuestionIndex]?.explanation || "Объяснение отсутствует";
        explanationContainer.classList.remove('hidden');
        
        if (selectedAnswer.correct) {
            score++;
            scoreElement.textContent = score;
        }
        
        if (questionsRemaining - questions.length >= 3) {
            scoreDisplay.classList.remove('hidden');
        }
    }
    
    function nextQuestion() {
        if (questions.length > 0) {
            showQuestion();
        } else {
            questionText.textContent = `Тест завершен! Ваш результат: ${score}/${questionsRemaining}`;
            answersContainer.innerHTML = "";
            explanationContainer.classList.add('hidden');
            nextButton.classList.add('hidden');
            scoreDisplay.classList.remove('hidden');
        }
    }
    
    nextButton.addEventListener('click', nextQuestion);
    
    // Инициализация теста
    questions = [...allQuestions[theme]];
    questionsRemaining = questions.length;
    totalQElement.textContent = questionsRemaining;
    showQuestion();
});