document.addEventListener('DOMContentLoaded', function() {
    // Получаем параметры URL
    const urlParams = new URLSearchParams(window.location.search);
    const theme = urlParams.get('theme');
    
    // Если тема не указана, перенаправляем на главную
    if (!theme || !allQuestions[theme]) {
        window.location.href = 'index.html';
        return;
    }
    
    // Настраиваем интерфейс
    const themeTitles = {
        basics: "Основы холодильной техники",
        refrigerants: "Хладагенты и масла",
        compressors: "Компрессоры",
        maintenance: "Монтаж и обслуживание"
    };
    
    document.getElementById('theme-title').textContent = themeTitles[theme];
    
    // Загружаем вопросы
    const questions = allQuestions[theme];
    let currentQuestionIndex = 0;
    let score = 0;
    
    // DOM элементы
    const questionText = document.getElementById('question-text');
    const answersContainer = document.getElementById('answers');
    const explanationContainer = document.getElementById('explanation');
    const explanationText = document.getElementById('explanation-text');
    const nextButton = document.getElementById('next-btn');
    const currentQElement = document.getElementById('current-q');
    const totalQElement = document.getElementById('total-q');
    
    // Инициализация теста
    totalQElement.textContent = questions.length;
    showQuestion();
    
    // Показать вопрос
    function showQuestion() {
        const question = questions[currentQuestionIndex];
        currentQElement.textContent = currentQuestionIndex + 1;
        
        questionText.textContent = question.question;
        answersContainer.innerHTML = '';
        explanationContainer.classList.add('hidden');
        
        question.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.classList.add('answer-btn');
            button.textContent = answer.text;
            button.addEventListener('click', () => selectAnswer(index));
            answersContainer.appendChild(button);
        });
    }
    
    // Выбор ответа
    function selectAnswer(index) {
        const question = questions[currentQuestionIndex];
        
        // Блокируем все кнопки
        const buttons = document.querySelectorAll('.answer-btn');
        buttons.forEach(button => {
            button.disabled = true;
        });
        
        // Помечаем правильный/неправильный ответ
        buttons.forEach((button, i) => {
            if (question.answers[i].correct) {
                button.classList.add('correct');
            } else if (i === index) {
                button.classList.add('wrong');
            }
        });
        
        // Показываем пояснение
        explanationText.textContent = question.explanation;
        explanationContainer.classList.remove('hidden');
        
        // Увеличиваем счет при правильном ответе
        if (question.answers[index].correct) {
            score++;
        }
    }
    
    // Следующий вопрос
    nextButton.addEventListener('click', function() {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            // Тест завершен
            questionText.textContent = `Тест завершен! Ваш результат: ${score}/${questions.length}`;
            answersContainer.innerHTML = "";
            explanationContainer.classList.add('hidden');
            nextButton.classList.add('hidden');
        }
    });
});
// Переключение темы
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggle.checked = true;
}

themeToggle.addEventListener('change', function() {
    if (this.checked) {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
    }
});