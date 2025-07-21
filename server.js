import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'

import { WebSocketServer } from 'ws';
import fs from 'fs';
import wav from 'wav';
import path from 'path';

// HTTP server

const app = new Hono()

app.use('/*', serveStatic({ root: './web' }))

serve(app, (info) => {
  console.log(`Server is running at http://localhost:${info.port}`)
})

// WebSocket server

const userWavWriter = new wav.FileWriter(path.join(process.cwd(), 'user_audio.wav'), {
  sampleRate: 48000,
  channels: 2
});
const meetWavWriter = new wav.FileWriter(path.join(process.cwd(), 'meet_audio.wav'), {
  sampleRate: 48000,
  channels: 2
});

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws, request) => {
  console.log('Client connected on', request.url);
  const writer = request.url === '/meet' ? meetWavWriter : userWavWriter;

  ws.on('message', message => {
    // message is a Buffer of raw PCM data
    writer.write(message);
  });

  ws.on('close', () => {
    console.log('Client disconnected on', request.url);
    // optionally finalize the writer when both connections are closed
  });
});

console.log('WebSocket server started on port 8080');