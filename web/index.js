const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');

let audioRecorder;
let screenRecorder;
let wsAudio;
let wsScreen;

startButton.addEventListener('click', () => {
  wsAudio = new WebSocket('ws://localhost:8080/audio');
  wsScreen = new WebSocket('ws://localhost:8080/screen');
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(audioStream => {
      audioRecorder = new MediaRecorder(audioStream);
      audioRecorder.ondataavailable = e => {
        if (e.data.size > 0) wsAudio.send(e.data);
      };
      audioRecorder.start(1000);

      return navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 0, width: 0, height: 0 },
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          channelCount: 2
        },
        systemAudio: "include"
      });
    })
    .then(screenStream => {
      screenRecorder = new MediaRecorder(screenStream);
      screenRecorder.ondataavailable = e => {
        if (e.data.size > 0) wsScreen.send(e.data);
      };
      screenRecorder.start(1000);
    })
    .catch(err => console.error(err));
});

stopButton.addEventListener('click', () => {
  if (audioRecorder) audioRecorder.stop();
  if (screenRecorder) screenRecorder.stop();
  if (wsAudio) wsAudio.close();
  if (wsScreen) wsScreen.close();
});