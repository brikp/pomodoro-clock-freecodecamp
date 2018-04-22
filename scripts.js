const TIME_INCREMENT_VALUE = 60; // time change on button press in seconds
const TIMER_STATES = ['started', 'stopped', 'reset']; // available timer states
const POMODORO_STATES = ['Work', 'Break'];
const RED = '#c21414';
const GREEN = '#0fa71c';

let timerState = 'reset';
let pomodoroState = 'Work'; 
let lastFrameOfState = false;

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
    if (timerValue == 0) {
      setColorTheme('green');
      circle.set(0);
    }
    
    pomodoroState = 'Break';
    timerValue = breakTime;
    startedTimerLength = breakTime;
    
    
  } else {
    if (timerValue == 0) {
      setColorTheme('red');
      circle.set(0);
    }

    pomodoroState = 'Work';
    timerValue = workTime;
    startedTimerLength = workTime;
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
  if ( pomodoroState == 'Work') { 
    setColorTheme('red');
  }
  if (pomodoroState == 'Break') { 
    setColorTheme('green');
  }
  /*
  if (pomodoroState == 'Break')
    circle.path.setAttribute('stroke', GREEN);
  if (pomodoroState == 'Work')
    circle.path.setAttribute('stroke', RED);
    */
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
  setColorTheme('red');
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
  let divider = '<hr id="divider" class="red-hr">';
  if (timerState == 'reset') 
    stateText = 'Click to start timer';
  else if (pomodoroState == 'Work') {
    stateText = 'Time to work!';
    divider = '<hr id="divider" class="red-hr">'
  }
  else {
    stateText = 'Break time';
    divider = '<hr id="divider" class="green-hr">'
  }
  circle.setText('<p id="pomodoro-state">' + stateText + '</p>' + divider + '<p id="time-left">' + minutes + ':' + seconds + '</p>');
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

let setColorTheme = function (color) {

  let hrTag = document.getElementById('divider');
  let aTags = Array.prototype.slice.call(document.getElementsByTagName('a'));
  let h2Tags = Array.prototype.slice.call(document.getElementsByTagName('h2'));
  let timeTextTags = Array.prototype.slice.call(document.getElementsByClassName('time-text'));
  let iTags = Array.prototype.slice.call(document.getElementsByTagName('i'));

  if (color == 'red') {
    circle.path.setAttribute('stroke', RED);
    
    if (hrTag.classList.contains('green-text')) {
      hrTag.classList.remove('green-text');
      hrTag.classList.add('red-text');
    }
    aTags.map((el) => {
      if (el.classList.contains('green-text')) {
        el.classList.remove('green-text');
      }
      el.classList.add('red-text');

      if (el.classList.contains('green-link-hover')) {
        el.classList.remove('green-link-hover');
      }
      el.classList.add('red-link-hover');
    });

    timeTextTags.map((el) => {
      if (el.classList.contains('green-text')) {
        el.classList.remove('green-text');
      }
      el.classList.add('red-text');
    });

    h2Tags.map((el) => {
      if (el.classList.contains('green-text')) {
        el.classList.remove('green-text');
      }
      el.classList.add('red-text');
    });

    iTags.map((el) => {
      if (el.classList.contains('green-icon-hover')) {
        el.classList.remove('green-icon-hover');
      }
      el.classList.add('red-icon-hover');
    });
    
  }

  if (color == 'green') {
    circle.path.setAttribute('stroke', GREEN);

    if (hrTag.classList.contains('red-text')) {
      hrTag.classList.remove('red-text');
      hrTag.classList.add('green-text');
    }
    aTags.map((el) => {
      if (el.classList.contains('red-text')) {
        el.classList.remove('red-text');
      }
      el.classList.add('green-text');

      if (el.classList.contains('red-link-hover')) {
        el.classList.remove('red-link-hover');
      }
      el.classList.add('green-link-hover');
    });

    timeTextTags.map((el) => {
      if (el.classList.contains('red-text')) {
        el.classList.remove('red-text');
      }
      el.classList.add('green-text');
    });

    h2Tags.map((el) => {
      if (el.classList.contains('red-text')) {
        el.classList.remove('red-text');
      }
      el.classList.add('green-text');
    });

    iTags.map((el) => {
      if (el.classList.contains('red-icon-hover')) {
        el.classList.remove('red-icon-hover');
      }
      el.classList.add('green-icon-hover');
    });
  }
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

  circle.setText('<hr id="divider" class="red-text">');

  if (pomodoroState == 'Work') {
    setColorTheme('red');
  }
  else {
    setColorTheme('green');
  }

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
