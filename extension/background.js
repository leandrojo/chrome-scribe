// background.js for Meet Audio Capture Chrome extension

let recording = false;
let recorder;
let ws;
let currentStream;

function log(...args) {
  // Prefix logs so they are easy to spot in the service worker console
  console.log('[MeetAudio]', ...args);
}

function startCapture() {
  chrome.tabCapture.capture({ audio: true, video: false }, stream => {
    if (!stream) {
      log('Failed to capture tab audio');
      return;
    }
    currentStream = stream;

    ws = new WebSocket('ws://localhost:8080/meet');
    ws.binaryType = 'arraybuffer';

    ws.addEventListener('open', () => log('WebSocket connected'));
    ws.addEventListener('close', () => log('WebSocket closed'));
    ws.addEventListener('error', err => log('WebSocket error', err));

    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = async e => {
      if (e.data.size > 0 && ws.readyState === WebSocket.OPEN) {
        const buffer = await e.data.arrayBuffer();
        ws.send(buffer);
      }
    };
    recorder.onstop = () => {
      log('Recorder stopped');
      ws.close();
    };
    recorder.start(1000);
    recording = true;
    chrome.action.setBadgeText({ text: 'REC' });
    log('Recording started');
  });
}

function stopCapture() {
  if (recorder) recorder.stop();
  if (currentStream) {
    currentStream.getTracks().forEach(t => t.stop());
    currentStream = null;
  }
  recording = false;
  chrome.action.setBadgeText({ text: '' });
  log('Recording stopped');
}

chrome.action.onClicked.addListener(() => {
  if (recording) {
    stopCapture();
  } else {
    startCapture();
  }
});
