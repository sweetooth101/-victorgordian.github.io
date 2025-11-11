// Buttons
document.querySelector("#guessBtn").addEventListener("click", checkGuess);
document.querySelector("#resetBtn").addEventListener("click", initializeGame);

let randomNumber;
let attempts;
const maxAttempts = 7;
let wins = 0;
let losses = 0;

initializeGame();

function initializeGame() {
  randomNumber = Math.floor(Math.random() * 99) + 1; // 1..99
  attempts = 0;

  const playerGuess = document.querySelector("#playerGuess");
  const feedback = document.querySelector("#feedback");
  document.querySelector("#guesses").textContent = "";
  feedback.textContent = "";
  feedback.style.color = "";
  playerGuess.value = "";
  playerGuess.focus();


  document.querySelector("#guessBtn").disabled = false;
  document.querySelector("#guessBtn").style.display = "inline-block";
  document.querySelector("#resetBtn").style.display = "none";

  updateAttemptsLeft();
  updateScore();
}

function checkGuess() {
  const feedback = document.querySelector("#feedback");
  feedback.textContent = "";
  const inputEl = document.querySelector("#playerGuess");
  const val = parseInt(inputEl.value, 10);

  if (Number.isNaN(val)) {
    feedback.textContent = "Please enter a number.";
    feedback.style.color = "red";
    inputEl.focus();
    return;
  }
  if (val < 1 || val > 99) {
    feedback.textContent = "Enter a number between 1 and 99.";
    feedback.style.color = "red";
    inputEl.focus();
    return;
  }

  attempts++;
  document.querySelector("#guesses").textContent += (document.querySelector("#guesses").textContent ? " " : "") + val;
  updateAttemptsLeft();

  if (val === randomNumber) {
    feedback.textContent = "You guessed it! You Won!";
    feedback.style.color = "darkgreen";
    wins++;
    gameOver();
    return;
  }

  if (attempts === maxAttempts) {
    feedback.textContent = `Sorry, you lost. The number was ${randomNumber}.`;
    feedback.style.color = "red";
    losses++;
    gameOver();
    return;
  }

  feedback.textContent = val > randomNumber ? "Guess was high" : "Guess was low";
  feedback.style.color = "blue";
  document.querySelector("#playerGuess").focus();
}

function gameOver() {
  document.querySelector("#guessBtn").disabled = true;
  document.querySelector("#guessBtn").style.display = "none";
  document.querySelector("#resetBtn").style.display = "inline-block";
  updateScore();
  updateAttemptsLeft(); 
}

function updateAttemptsLeft() {
  const left = Math.max(0, maxAttempts - attempts);
  document.querySelector("#attemptsLeft").textContent = `Attempts left: ${left}`;
}

function updateScore() {
  document.querySelector("#wins").textContent = wins;
  document.querySelector("#losses").textContent = losses;
}

document.querySelector("#playerGuess").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !document.querySelector("#guessBtn").disabled) {
    checkGuess();
  }
});