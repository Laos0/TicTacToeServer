
let count = 10;
let intervalId = null;
let isTimerUp = false;
let hasTimerStarted = false;

// start the countdonw
function startCountdown() {
  //console.log(' The io is: ', server.getIo() , ' The socket is: ', server.getSocket(), ' The current player is: ', server.getCurPlayer());

  return new Promise((resolve, reject) => {

    hasTimerStarted = true;
  
    intervalId = setInterval(() => {
      count--;
      console.log(count);
      if (count === 0) {
        setIsTimerUp(true);
        clearInterval(intervalId);
        resolve();
      }
    }, 1000);
  });
}

function stopCountdown() {
  clearInterval(intervalId);
}

function resetCount(){
  count = 10;
}

function setIsTimerUp(trueOrFalse){
  isTimerUp = trueOrFalse;
}

function getIsTimerUp(){
  return isTimerUp;
}

function setHasTimerStarted(trueOrFalse){
  hasTimerStarted = trueOrFalse;
}

function getHasTimerStarted(){
  return hasTimerStarted;
} 

function getCurrentCountDown(){
  return count;
}



module.exports = {startCountdown, stopCountdown, resetCount, setIsTimerUp, 
  getIsTimerUp, setHasTimerStarted, getHasTimerStarted, getCurrentCountDown}