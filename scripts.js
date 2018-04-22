const TIME_INCREMENT_VALUE = 60; // time change on button press in seconds
const TIMER_STATES = ['started', 'stopped', 'reset']; // available timer states
const POMODORO_STATES = ['Work', 'Break'];

let timerState = 'reset';
let pomodoroState = 'Work'; 

let timer;

let breakTime = 5 * 60; // break time in seconds
let workTime = 25 * 60; // work time in seconds
let timerValue = workTime; 
let startedTimerLength = workTime;

let workTimeElement = document.getElementById('work-time');
let breakTimeElement = document.getElementById('break-time');

let circle;

let processTimer = function () {
  if (timerState == 'started') {
    if (timerValue <= 0) {
      changePomodoroState();
      updateTimerElement();
    }
    else {
      timerSecondElapsed();
      updateTimerElement();
    }
  }
};

let changePomodoroState = function () {
  if (pomodoroState == 'Work') {
    pomodoroState = 'Break';
    timerValue = breakTime;
    startedTimerLength = breakTime;
    circle.animate(0);
    
  } else {
    pomodoroState = 'Work';
    timerValue = workTime;
    startedTimerLength = workTime;
    
    circle.animate(0);
  }
};

let changeWorkTime = function (value) {
  workTime += value * TIME_INCREMENT_VALUE;
  if (workTime < 0)
    workTime = 0;
  if (timerState == 'reset') {
    timerValue = workTime;
    startedTimerLength = workTime;
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
  if (pomodoroState == 'Break')
    circle.path.setAttribute('stroke', '#0fa71c');
  if (pomodoroState == 'Work')
    circle.path.setAttribute('stroke', '#c21414');
  timerValue -= 1;
  let progress = 1 - (timerValue / startedTimerLength);
  circle.animate(progress);
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
  startedTimerLength = workTime;
  timerState = 'reset';
  pomodoroState = 'Work';
  circle.animate(0);
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
  
  let stateText;
  if (timerState == 'reset') 
    stateText = 'Click to start timer';
  else if (pomodoroState == 'Work')
    stateText = 'Time to work!';
  else 
    stateText = 'Break time';
  circle.setText('<p id="pomodoro-state">' + stateText + '</p><hr><p id="time-left">' + minutes + ':' + seconds + '</p>');
};

let updateBreakTimeElement = function () {
  let minutes = Math.floor(breakTime / 60);
  let seconds = breakTime % 60;
  if (seconds < 10)
    seconds = '0' + seconds;
  breakTimeElement.textContent = `${minutes}:${seconds}`;
};

let updateWorkTimeElement = function () {
  let minutes = Math.floor(workTime / 60);
  let seconds = workTime % 60;
  if (seconds < 10)
    seconds = '0' + seconds;
    
  workTimeElement.textContent = `${minutes}:${seconds}`;
};

let bindEventListeners = function () {

  circle = new ProgressBar.Circle('#progress', {
    strokeWidth: 2.5,
    color: 'red',
    easing: 'easeInOut',
    duration: 250,
    text: {
      autoStyleContainer: false
    },
  });

  updateTimerElement();
  updateBreakTimeElement();
  updateWorkTimeElement();
  document.getElementById('progress').addEventListener('click', () => toggleTimer());
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