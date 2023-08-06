function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

function startColorChange() {
    const startButton = document.querySelector('[data-start]');
    const stopButton = document.querySelector('[data-stop]');
    
    startButton.disabled = true;
    stopButton.disabled = false;

    const intervalId = setInterval(() => {
        document.body.style.backgroundColor = getRandomHexColor();
    }, 1000);


    stopButton.addEventListener('click', () => {
        startButton.disabled = false;
        stopButton.disabled = true;
        clearInterval(intervalId);
    }, { once: true });
    
}

document.querySelector('[data-start]').addEventListener('click', startColorChange);