// background.js
chrome.action.onClicked.addListener(tab => {
  chrome.tabCapture.capture({ audio: true, video: false }, stream => {
    const port = chrome.runtime.connect({ name: "meet-audio" });
    const reader = stream.getReader();
    // Usa MediaRecorder se preferir container, ou ScriptProcessor para PCM
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm; codecs=opus' });
    mediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) port.postMessage(e.data);
    };
    mediaRecorder.start(1000);
  });
});