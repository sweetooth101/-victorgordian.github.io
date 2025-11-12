
document.querySelector("button").addEventListener("click", gradeQuiz);


function isFormValid() {
  let isValid = true;

  if (document.querySelector("#q1").value.trim() === "") {
    isValid = false;
    const box = document.querySelector("#validationFdbk");
    box.innerHTML = "Question 1 was not answered";
    box.className = "fw-semibold bg-danger text-white p-2 mt-2";
  }
  return isValid;
}


var score = 0;    
var attempts = 0;  


function rightAnswer(index) {
  document.querySelector(`#q${index}Feedback`).innerHTML = "Correct";
  document.querySelector(`#q${index}Feedback`).className = "bg-success text-white p-2 mt-2";
  document.querySelector(`#markImg${index}`).innerHTML =
    "<img src='img/checkmark.png' alt='Checkmark' width='30' height='30'>";
  score += 10;
}

function wrongAnswer(index, msg) {
  document.querySelector(`#q${index}Feedback`).innerHTML = msg || "Incorrect";
  document.querySelector(`#q${index}Feedback`).className = "bg-warning text-white p-2 mt-2";
  document.querySelector(`#markImg${index}`).innerHTML =
    "<img src='img/xmark.png' alt='X mark' width='30' height='30'>";
}


function displayQ4Choices() {
  let q4ChoicesArray = ["Maine", "Rhode Island", "Maryland", "Delaware"];
  if (typeof _ !== "undefined" && _.shuffle) {
    q4ChoicesArray = _.shuffle(q4ChoicesArray);
  }
  const container = document.querySelector("#q4Choices");
  container.innerHTML = "";
  for (let i = 0; i < q4ChoicesArray.length; i++) {
    container.innerHTML += `
      <input type="radio" name="q4" id="${q4ChoicesArray[i]}" value="${q4ChoicesArray[i]}">
      <label for="${q4ChoicesArray[i]}"> ${q4ChoicesArray[i]} </label>
    `;
  }
}


function gradeQuiz() {
  console.log("Grading quiz…");

  const v = document.querySelector("#validationFdbk");
  v.innerHTML = "";
  v.className = "fw-semibold";


  if (!isFormValid()) return;

  score = 0;


  let q1Response = document.querySelector("#q1").value.trim().toLowerCase();
  if (q1Response === "sacramento") rightAnswer(1); else wrongAnswer(1);


  let q2Response = document.querySelector("#q2").value;
  if (q2Response === "Missouri River") rightAnswer(2); else wrongAnswer(2);


  const jeff = document.querySelector("#Jefferson").checked;
  const roos = document.querySelector("#Roosevelt").checked;
  const jack = document.querySelector("#Jackson").checked;
  const frank = document.querySelector("#Franklin").checked;
  if (jeff && roos && !jack && !frank) rightAnswer(3);
  else wrongAnswer(3, "Select T. Jefferson and T. Roosevelt only.");


  const q4Sel = document.querySelector('input[name="q4"]:checked');
  const q4Response = q4Sel ? q4Sel.value : "";
  if (q4Response === "Rhode Island") rightAnswer(4); else wrongAnswer(4);


  const q5Val = Number(document.querySelector("#q5")?.value);
  if (Number.isFinite(q5Val) && q5Val >= 750 && q5Val <= 850) {
    rightAnswer(5);
  } else {
    wrongAnswer(5, "Expected about 800 (accept 750–850).");
  }


  const q6Response = document.querySelector("#q6")?.value;
  if (q6Response === "Tennessee" || q6Response === "Missouri") {
    rightAnswer(6);
  } else {
    wrongAnswer(6);
  }


  const q7Sel = document.querySelector('input[name="q7"]:checked');
  const q7Response = q7Sel ? q7Sel.value : "";
  if (q7Response === "West Virginia") rightAnswer(7); else wrongAnswer(7);


  const q8Sel = document.querySelector('input[name="q8"]:checked');
  const q8Response = q8Sel ? q8Sel.value : "";
  if (q8Response === "Wyoming") rightAnswer(8); else wrongAnswer(8);


  const q9Opts = Array.from(document.querySelector("#q9")?.selectedOptions || []).map(o => o.value);
  const correct9 = ["California", "Arizona", "New Mexico", "Texas"];
  const all9 = q9Opts.length === 4 && q9Opts.every(v => correct9.indexOf(v) !== -1);
  if (all9) rightAnswer(9); else wrongAnswer(9, "Select California, Arizona, New Mexico, and Texas only.");


  const q10Response = document.querySelector("#q10")?.value?.trim().toLowerCase() || "";
  if (q10Response === "albany") rightAnswer(10); else wrongAnswer(10);


  const total = document.querySelector("#totalScore");
  total.innerHTML = `Total Score: ${score}`;


  if (score >= 80) {
    total.className = "text-success fw-bold";
  } else {
    total.className = "text-danger fw-bold";
  }


  const msg = document.querySelector("#congratsMsg");
  if (score >= 80) {
    msg.innerHTML = "Great job! You passed.";
    msg.className = "mt-2 text-success";
  } else {
    msg.innerHTML = "Keep trying! 80 or higher.";
    msg.className = "mt-2 text-danger";
  }

  attempts = Number(localStorage.getItem("total_attempts") || 0);
  attempts++;
  document.querySelector("#totalAttempts").innerHTML =
    `This quiz has been taken ${attempts} time${attempts === 1 ? "" : "s"}.`;
  localStorage.setItem("total_attempts", String(attempts));
}

document.addEventListener("DOMContentLoaded", function () {
  displayQ4Choices();
});
