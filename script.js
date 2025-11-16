// Скрипт для мінігри «Додай “н”»
// Реалізує логіку заповнення прогалин у словах правильними літерами та
// відображає пояснення після кожного раунду.

document.addEventListener('DOMContentLoaded', () => {
  const startScreen = document.getElementById('start-screen');
  const startBtn = document.getElementById('start-btn');
  const gameContainer = document.getElementById('game-container');
  const finishScreen = document.getElementById('finish-screen');
  const triesContainer = document.getElementById('tries-container');
  const currentIndexSpan = document.getElementById('current-index');
  const totalWordsSpan = document.getElementById('total-words');
  const wordArea = document.getElementById('word-area');
  const choicesContainer = document.getElementById('choices-container');
  const explanationEl = document.getElementById('explanation');
  const progressFill = document.querySelector('.general-progress-fill');

  // Створення мерехтливих зірок
  const starContainer = document.getElementById('star-container');
  const NUM_STARS = 80;
  function createStars() {
    for (let i = 0; i < NUM_STARS; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.animationDelay = Math.random() * 2 + 's';
      starContainer.appendChild(star);
    }
  }
  createStars();

  // Набір слів із пропущеною літерою «н»
  const wordsData = [
    {
      text: 'свяще_ик',
      blankIndex: 6,
      insertion: 'нн',
      correctWord: 'священник',
      explanation:
        'У слові «священник» подвоюється звук [н], бо збігаються приголосні кореня і суфікса (правило §29 п.3.2 Правопису).',
    },
    {
      text: 'письме_ик',
      blankIndex: 6,
      insertion: 'нн',
      correctWord: 'письменник',
      explanation:
        'У слові «письменник» також подвоюється «н», оскільки приголосні кореня й суфікса збігаються. Тому пишемо «письменник».',
    },
  ];

  // Варіанти для кнопок. Один з них відповідає правильній вставці
  const choicesVariants = ['н', 'нн', 'ннн'];

  let shuffledData = [];
  let currentWordIndex = 0;
  let mistakes = 0;
  let solved = false;

  // Перемішати масив слів
  function shuffle(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  startBtn.addEventListener('click', () => {
    startGame();
  });

  function startGame() {
    startScreen.classList.add('hidden');
    finishScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');

    shuffledData = shuffle(wordsData);
    currentWordIndex = 0;
    totalWordsSpan.textContent = shuffledData.length.toString();
    showNextWord();
  }

  function showNextWord() {
    // Кінець гри
    if (currentWordIndex >= shuffledData.length) {
      finishGame();
      return;
    }
    solved = false;
    mistakes = 0;
    // Відновити серця
    triesContainer.innerHTML = '';
    for (let i = 0; i < 2; i++) {
      const heart = document.createElement('span');
      heart.classList.add('heart');
      heart.textContent = '❤';
      triesContainer.appendChild(heart);
    }
    // Очистити пояснення
    explanationEl.classList.add('hidden');
    explanationEl.textContent = '';
    // Оновити лічильник слів
    currentIndexSpan.textContent = (currentWordIndex + 1).toString();
    // Показати слово з пропуском
    const wordObj = shuffledData[currentWordIndex];
    wordArea.innerHTML = '';
    const chars = Array.from(wordObj.text);
    chars.forEach((ch, idx) => {
      const span = document.createElement('span');
      span.classList.add('letter');
      if (ch === '_') {
        span.classList.add('blank');
        span.dataset.blank = 'true';
        span.textContent = ' ';
      } else {
        span.textContent = ch;
      }
      wordArea.appendChild(span);
    });
    // Згенерувати кнопки вибору
    choicesContainer.innerHTML = '';
    // Вибираємо випадкові варіанти з choicesVariants, щоб включити потрібний варіант
    const options = shuffle(choicesVariants).slice(0, 2);
    // Переконатися, що правильний варіант присутній
    if (!options.includes(wordObj.insertion)) {
      options[0] = wordObj.insertion;
    }
    // Перемішати перед показом
    const displayOptions = shuffle(options);
    displayOptions.forEach((opt) => {
      const btn = document.createElement('button');
      btn.classList.add('choice-btn');
      btn.textContent = opt;
      btn.dataset.value = opt;
      btn.addEventListener('click', () => handleChoiceClick(btn));
      choicesContainer.appendChild(btn);
    });
  }

  function handleChoiceClick(button) {
    if (solved) return;
    const wordObj = shuffledData[currentWordIndex];
    const selected = button.dataset.value;
    // Вимкнути кнопку, щоб не натискати повторно
    button.classList.add('disabled');
    button.disabled = true;
    if (selected === wordObj.insertion) {
      // Правильний вибір
      button.classList.add('correct');
      solved = true;
      fillBlankAndHighlight(true);
    } else {
      // Неправильний вибір
      mistakes++;
      button.classList.add('incorrect');
      // Прибираємо одне серце
      const hearts = triesContainer.querySelectorAll('.heart');
      if (hearts.length > 0) {
        hearts[hearts.length - 1].style.opacity = '0.2';
        hearts[hearts.length - 1].classList.remove('heart');
      }
      if (mistakes >= 2) {
        solved = true;
        fillBlankAndHighlight(false);
      }
    }
  }

  function fillBlankAndHighlight(answerWasCorrect) {
    const wordObj = shuffledData[currentWordIndex];
    const letters = wordArea.querySelectorAll('.letter');
    // Заповнити прогалину правильною вставкою
    letters.forEach((span) => {
      if (span.dataset.blank) {
        span.textContent = wordObj.insertion;
        span.classList.remove('blank');
        span.classList.add('filled');
      } else {
        // Підсвітити вже наявні літери
        span.classList.add('filled');
      }
    });
    // Заблокувати всі кнопки
    const buttons = choicesContainer.querySelectorAll('.choice-btn');
    buttons.forEach((btn) => {
      btn.disabled = true;
      btn.classList.add('disabled');
    });
    // Показати пояснення
    explanationEl.textContent = wordObj.explanation;
    explanationEl.classList.remove('hidden');
    // Затримка перед наступним словом
    setTimeout(() => {
      currentWordIndex++;
      showNextWord();
    }, 2500);
  }

  function finishGame() {
    gameContainer.classList.add('hidden');
    finishScreen.classList.remove('hidden');
    // Заповнити прогрес-бар (6/9)
    const percent = (6 / 9) * 100;
    progressFill.style.width = percent + '%';
  }
});