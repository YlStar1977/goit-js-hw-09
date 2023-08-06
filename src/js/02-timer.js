import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Notiflix from "notiflix";

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const currentDate = new Date();
    if (selectedDate <= currentDate) {
      Notiflix.Notify.failure("Please choose a date in the future");
      return;
    }
  },
};

const picker = flatpickr("#datetime-picker", options);

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return value.toString().padStart(2, "0");
}

let intervalId;

function startCountdown(countdown) {
  const daysElement = document.querySelector("[data-days]");
  const hoursElement = document.querySelector("[data-hours]");
  const minutesElement = document.querySelector("[data-minutes]");
  const secondsElement = document.querySelector("[data-seconds]");

  function updateCountdown() {
    const { days, hours, minutes, seconds } = countdown;

    daysElement.textContent = addLeadingZero(days);
    hoursElement.textContent = addLeadingZero(hours);
    minutesElement.textContent = addLeadingZero(minutes);
    secondsElement.textContent = addLeadingZero(seconds);

    if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
      clearInterval(intervalId);
      Notiflix.Notify.success("Countdown finished!");
    }
  }

  updateCountdown();
  intervalId = setInterval(() => {
    countdown.seconds -= 1;

    if (countdown.seconds < 0) {
      countdown.minutes -= 1;
      countdown.seconds = 59;

      if (countdown.minutes < 0) {
        countdown.hours -= 1;
        countdown.minutes = 59;

        if (countdown.hours < 0) {
          countdown.days -= 1;
          countdown.hours = 23;
        }
      }
    }

    updateCountdown();
  }, 1000);
}

const startButton = document.querySelector("[data-start]");
startButton.addEventListener("click", () => {
  const selectedDate = picker.selectedDates[0];
  const currentDate = new Date();
  if (selectedDate <= currentDate) {
    Notiflix.Notify.failure("Please choose a date in the future");
    return;
  }

  const difference = selectedDate.getTime() - currentDate.getTime();
  const countdown = convertMs(difference);

  startCountdown(countdown);
});