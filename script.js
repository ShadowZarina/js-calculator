/* Display and Buttons */
const display = document.getElementById("display");
const clear = document.querySelector(".clear");
const equal = document.querySelector(".equal");
const decimal = document.querySelector(".decimal");

let numbers = document.querySelectorAll(".number");
let operators = document.querySelectorAll(".operator-btn");

/* Screens, Number, Operator Values */
let previousScreen = document.querySelector(".previous");
let currentScreen = document.querySelector(".current");

let currentNum = "";
let previousNum = "";
let operator = "";

const currentDisplayNumber = document.querySelector(".currentNumber");
const previousDisplayNumber = document.querySelector(".previousNumber");

/* Append to Display */

if (numbers && numbers.length) {
  numbers.forEach((button) => {
    button.addEventListener("click", (e) => {
      handleNumber(e.target.textContent.trim());
    });
  });
}


function handleNumber(number) {
  if (currentNum.length <= 6) {          
    currentNum += number;             
    currentDisplayNumber.textContent = currentNum; 
  }
}

/* Clear Button */
if (clear) {
  clear.addEventListener("click", clearEntry);
}

function clearEntry() {
  if (display && typeof display.value !== "undefined") display.value = "";
    currentNum = "";
    previousNum = "";
    operator = "";
    if (currentDisplayNumber) currentDisplayNumber.textContent = "";
    if (previousDisplayNumber) previousDisplayNumber.textContent = "";
}

/* Decimal */
if (decimal) {
  decimal.addEventListener("click", () => {
    addDecimal();
  });
}

/* Equal Button */
if (equal) {
  equal.addEventListener("click", () => {
    if (currentNum !== "" && previousNum !== "") {
      compute();
    }
  });
}

/* Operate Function */

if (operators && operators.length) {
  operators.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // get operator text (like "+", "-", "x", "÷") - trim in case of white space
      const op = e.target.textContent.trim();
      handleOperator(op);
    });
  });
}

function handleOperator(op) {
  if (previousNum === "") {
    previousNum = currentNum;
    operatorCheck(op);
  } else if (currentNum === "") {
    operatorCheck(op);
  } else {
    compute();
    operator = op;
    currentDisplayNumber.textContent = "0";
    previousDisplayNumber.textContent = previousNum + " " + operator;
  }
}

function operatorCheck(text) {
  operator = text;
  if (previousDisplayNumber) previousDisplayNumber.textContent = previousNum + " " + operator;
  if (currentDisplayNumber) currentDisplayNumber.textContent = "0";
  currentNum = "";
}

/* ROUND OFF LONG DECIMALS */

function roundNumber(num) {
  return Math.round(num * 100000) / 100000;
}

/* Functions for Addition, Subtraction, Multiplication, Division */

/* Addition */

function addDecimal() {
  if (!currentNum.includes(".")) {
    if (currentNum === "") currentNum = "0";
    currentNum += ".";
    currentDisplayNumber.textContent = currentNum;
  }
}

/* Display Results */

function displayResults() {
  if (previousNum.length <= 5) {
    currentDisplayNumber.textContent = previousNum;
  } else {
    currentDisplayNumber.textContent = previousNum.slice(0, 11) + "...";
  }
  if (previousDisplayNumber) previousDisplayNumber.textContent = "";
  operator = "";
  currentNum = "";
}

/* Keyboard Presses */
window.addEventListener("keydown", handleKeyPress);
function handleKeyPress(e) {
  if (
    (e.key >= "0" && e.key <= "9") ||
    e.key === "Enter" ||
    e.key === "=" ||
    e.key === "+" ||
    e.key === "-" ||
    e.key === "/" ||
    e.key === "*" ||
    e.key === "." ||
    e.key === "Backspace"
  ) {
    e.preventDefault();
  }

  if (e.key >= "0" && e.key <= "9") {
    handleNumber(e.key);
  }
  if (e.key === "Enter" || (e.key === "=" && currentNum !== "" && previousNum !== "")) {
    compute();
  }
  if (e.key === "+" || e.key === "-" || e.key === "/") {
    handleOperator(e.key);
  }
  if (e.key === "*") {
    handleOperator("*"); 
  }
  if (e.key === ".") {
    addDecimal();
  }
  if (e.key === "Backspace") {
    handleDelete();
  }
}

/* COMPUTE FUNCTION */

function compute() {
  let result;

  const prev = parseFloat(previousNum);
  const curr = parseFloat(currentNum);

  if (isNaN(prev) || isNaN(curr)) return; 

  switch (operator) {
    case "+":
      result = prev + curr;
      break;
    case "-":
      result = prev - curr;
      break;
    case "x":
    case "*":
      result = prev * curr;
      break;
    case "÷":
    case "/":
      if (curr === 0) {
        currentDisplayNumber.textContent = "Error";
        previousDisplayNumber.textContent = "";
        currentNum = "";
        previousNum = "";
        operator = "";
        return;
      }
      result = prev / curr;
      break;
    default:
      return;
  }

  result = roundNumber(result);

  previousNum = result.toString();
  currentNum = "";
  operator = "";

  displayResults();
}
