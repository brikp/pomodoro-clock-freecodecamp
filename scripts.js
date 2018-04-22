const TIME_INCREMENT_VALUE = 60; // time change on button press in seconds
const TIMER_STATES = ['started', 'stopped', 'reset']; // available timer states
const POMODORO_STATES = ['work', 'break'];

let timerState = 'reset';
let pomodoroState = 'work'; 
let timerValue = 25 * 60; 
let timer;

let breakTime = 1 * 60; // break time in seconds
let workTime = 25 * 60; // work time in seconds

let timerElement = document.getElementById('timer');
let workTimeElement = document.getElementById('work-time');
let breakTimeElement = document.getElementById('break-time');

let processTimer = function () {
  if (timerState == 'started') {
    if (timerValue <= 0) {
      changePomodoroState();
      updateTimerElement()
    }
    else {
      timerSecondElapsed();
      updateTimerElement();
    }
  }
};

let changePomodoroState = function () {
  if (pomodoroState == 'work') {
    pomodoroState = 'break';
    timerValue = breakTime;
  } else {
    pomodoroState = 'work';
    timerValue = workTime;
  }
};

let changeWorkTime = function (value) {
  workTime += value * TIME_INCREMENT_VALUE;
  if (workTime < 0)
    workTime = 0;
  if (timerState == 'reset') {
    timerValue = workTime;
    updateTimerElement();
  }
  updateWorkTimeElement();
};

let changeBreakTime = function (value) {
  breakTime += value * TIME_INCREMENT_VALUE;
  if (breakTime < 0) 
    breakTime = 0;

  updateBreakTimeElement();
};

let timerSecondElapsed = function () {
  timerValue -= 1;
};

let startTimer = function () {
  timerState = 'started';
  timer = setInterval(() => processTimer(), 1000);
};

let stopTimer = function () {
  timerState = 'stopped';
  clearInterval(timer);
};

let resetTimer = function () {
  stopTimer();
  timerValue = workTime;
  timerState = 'reset';
  pomodoroState = 'work';
  updateTimerElement();
};

let toggleTimer = function () {
  if (timerState == 'started')
    stopTimer();
  else 
    startTimer();
};

let updateTimerElement = function () {
  let minutes = Math.floor(timerValue / 60);
  let seconds = timerValue % 60;
  if (seconds < 10)
    seconds = '0' + seconds;
  timerElement.textContent = `${pomodoroState}: ${minutes}:${seconds}`;
};

let updateBreakTimeElement = function () {
  let minutes = Math.floor(breakTime / 60);
  let seconds = breakTime % 60;
  if (seconds < 10)
    seconds = '0' + seconds;
  breakTimeElement.textContent = `Break time: ${minutes}:${seconds}`;
};

let updateWorkTimeElement = function () {
  let minutes = Math.floor(workTime / 60);
  let seconds = workTime % 60;
  if (seconds < 10)
    seconds = '0' + seconds;
    
  workTimeElement.textContent = `Work time: ${minutes}:${seconds}`;
};

let bindEventListeners = function () {
  updateTimerElement();
  updateBreakTimeElement();
  updateWorkTimeElement();
  document.getElementById('toggle-timer').addEventListener('click', () => toggleTimer());
  document.getElementById('reset-timer').addEventListener('click', () => resetTimer());
  document.getElementById('work-time-minus').addEventListener('click', () => changeWorkTime(-1));
  document.getElementById('work-time-plus').addEventListener('click', () => changeWorkTime(1));
  document.getElementById('break-time-minus').addEventListener('click', () => changeBreakTime(-1));
  document.getElementById('break-time-plus').addEventListener('click', () => changeBreakTime(1));
};

if (document.readyState != 'loading') 
  bindEventListeners();
else 
  document.addEventListener('DOMContentLoaded', () => bindEventListeners());