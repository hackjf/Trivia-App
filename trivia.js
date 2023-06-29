let questions = [];
let score = 0;
let questionIndex = 0;

// Carga las categorías al cargar la página
window.addEventListener('DOMContentLoaded', () => {
  loadCategories();
});

// Manejador de eventos para el botón de inicio
document.getElementById('start-btn').addEventListener('click', () => {
  startTrivia();
});

// Manejador de eventos para el botón de reinicio
document.getElementById('reset-btn').addEventListener('click', () => {
  location.reload();
});

// Cargar las categorías de la API
async function loadCategories() {
  const response = await fetch('https://opentdb.com/api_category.php');
  const data = await response.json();
  const categorySelect = document.getElementById('category');

  data.trivia_categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });
}

// Iniciar la trivia
async function startTrivia() {
  const difficulty = document.getElementById('difficulty').value;
  const type = document.getElementById('type').value;
  const category = document.getElementById('category').value;

  const url = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=${type}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.response_code === 0) {
    questions = data.results;
    showQuestion();
    document.getElementById('trivia-settings').classList.add('d-none');
    document.getElementById('trivia-questions').classList.remove('d-none');
  } else {
    alert('No se pudieron obtener las preguntas de la trivia. Por favor, prueba con otra configuración.');
  }
}

// Mostrar una pregunta
function showQuestion() {
  const questionContainer = document.getElementById('trivia-questions');
  questionContainer.innerHTML = '';
  
  const question = questions[questionIndex];
  
  const questionElement = document.createElement('h2');
  questionElement.innerHTML = question.question;  // changed from textContent to innerHTML
  questionContainer.appendChild(questionElement);
  
  const answers = [...question.incorrect_answers, question.correct_answer];
  
  answers.forEach((answer) => {
    const button = document.createElement('button');
    button.innerHTML = answer;  // changed from textContent to innerHTML
    button.classList.add('btn', 'btn-light', 'd-block', 'my-3');
    button.addEventListener('click', () => checkAnswer(answer, question.correct_answer));
    questionContainer.appendChild(button);
  });
}

// Comprobar una respuesta
function checkAnswer(answer, correctAnswer) {
  if (answer === correctAnswer) {
    score += 100;
  }

  questionIndex++;

  if (questionIndex < questions.length) {
    showQuestion();
  } else {
    showResults();
  }
}

// Mostrar los resultados
function showResults() {
  const resultsContainer = document.getElementById('trivia-results');
  resultsContainer.innerHTML = `<h2>Tu puntuación es: ${score}</h2>`;
  resultsContainer.classList.remove('d-none');
  document.getElementById('reset-btn').classList.remove('d-none');
}
