// Select Elements
let countSpan = document.querySelector(".count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
let resultContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");
// Set Options
let currentIndex = 0;
let rightAnswer = 0;
let countdownInterval;
function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if ((this.readyState === 4) & (this.status === 200)) {
      let questionsObject = JSON.parse(this.responseText);
      let questionsCount = questionsObject.length;
      getBullets(questionsCount);
      addQuestionData(questionsObject[currentIndex], questionsCount);
      countdown(5, questionsCount);
      submitButton.onclick = () => {
        let theRightAnswer = questionsObject[currentIndex].right_answer;
        currentIndex++;
        checkAnswer(theRightAnswer, questionsCount);
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        addQuestionData(questionsObject[currentIndex], questionsCount);
        // Handle Bullets Class
        handleBullets();
        clearInterval(countdownInterval)
        countdown(5, questionsCount);
        // Show Results
        showResults(questionsCount);
      };
    }
  };
  myRequest.open("GET", "html_questions.json", true);
  myRequest.send();
}
getQuestions();
function getBullets(num) {
  countSpan.innerHTML = num;
  for (let i = 0; i < num; i++) {
    let theBullet = document.createElement("span");
    if (i === 0) {
      theBullet.className = "on";
    }
    bulletsSpanContainer.appendChild(theBullet);
  }
}
function addQuestionData(opj, count) {
  console.log(count);
  if (currentIndex < count) {
    // create h2
    let head = document.createElement("h2");
    // create text
    let headText = document.createTextNode(opj.title);
    // append headText to head
    head.appendChild(headText);
    // append head to quiz area
    quizArea.appendChild(head);
    // create the answers
    for (let i = 1; i <= 4; i++) {
      // create main div
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";
      // create the input + type + id + set attr
      let inputRadio = document.createElement("input");
      inputRadio.name = "questions";
      inputRadio.type = "radio";
      inputRadio.id = `answer_${i}`;
      inputRadio.dataset.answer = opj[`answer_${i}`];
      // create label
      let theLabel = document.createElement("label");
      // create the label for
      theLabel.htmlFor = `answer_${i}`;
      // create text to the label
      let labelText = document.createTextNode(opj[`answer_${i}`]);
      // add label text to tle label
      theLabel.appendChild(labelText);
      // add the input and the label to the main div
      mainDiv.appendChild(inputRadio);
      mainDiv.appendChild(theLabel);
      // add the main div to the answers area
      answersArea.appendChild(mainDiv);
    }
  }
}
function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("questions");
  let chooseAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      chooseAnswer = answers[i].dataset.answer;
    }
  }
  if (rAnswer === chooseAnswer) {
    rightAnswer++;
  }
}
// Handle Bullets Class
function handleBullets() {
  let theBulletSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(theBulletSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}
// Show Results
function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();
    if (rightAnswer > count / 2 && rightAnswer < count) {
      theResults = `<span class ="good">Good</span> ${rightAnswer} From ${count}`;
    } else if (rightAnswer === count) {
      theResults = `<span class="perfect">Perfect</span>, All Answers Is Good`;
    } else {
      theResults = `<span class="bad">Bad</span>, ${rightAnswer} From ${count}`;
    }
    resultContainer.innerHTML = theResults;
    resultContainer.style.padding = "10px";
    resultContainer.style.backgroundColor = "white";
    resultContainer.style.marginTop = "10px";
  }
}
//count down
function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
