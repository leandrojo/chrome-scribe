# Chrome Scribe

This project contains three parts:

1. **Backend** – a small Node.js server that serves the web front-end and exposes WebSocket endpoints to receive audio data. Incoming audio is written to WAV files on disk.
2. **Front-end** – a minimal web page located in `web/` that captures microphone and screen audio and streams it to the backend.
3. **Chrome Extension** – found in `extension/`. When the extension action button is clicked, it captures audio from the current tab and streams it to the backend.

## Running the backend

Install dependencies and start the server:

```bash
pnpm install
pnpm start
```

The HTTP server serves `web/` on [http://localhost:3000](http://localhost:3000) and the WebSocket server listens on port `8080`.

## Using the front-end

Open `http://localhost:3000` after starting the backend. Use the **Start Recording** button to begin streaming your microphone and screen audio. Press **Stop Recording** to end the streams. Audio is saved as `user_audio.wav` and `screen_audio.wav` in the project root.

## Using the Chrome extension

Load the `extension/` directory as an unpacked extension in Chrome. Click the extension icon to start streaming audio from the active tab. Click the icon again to stop. A small "REC" badge indicates when the extension is recording. Debug logs from the service worker can be viewed in the **Extensions** page to help during development. The received audio is written to `meet_audio.wav` in the project root.

