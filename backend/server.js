// server.js (Backend con Google Cloud TTS)
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const path = require('path');

// Inicializar cliente TTS de Google
const client = new textToSpeech.TextToSpeechClient({
  keyFilename: './asistentevirtual-438503-2057896226ed.json', // Ruta correcta de tu archivo JSON de credenciales
});

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

io.on('connection', (socket) => {
  console.log('New client connected');

  // Envía gestos aleatorios cada 5 segundos
  setInterval(() => {
    const gestures = ['neutral', 'happy', 'sad', 'surprised'];
    const randomGesture = gestures[Math.floor(Math.random() * gestures.length)];
    socket.emit('gesture', randomGesture);
  }, 5000);

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Función para ajustar parámetros de voz en función de la emoción
function getVoiceSettings(emotion) {
  let pitch = 0;   // tono neutral
  let speakingRate = 1.0;  // velocidad normal

  switch (emotion) {
    case 'happy':
      pitch = 5.0;  // tono más alto
      speakingRate = 1.2;  // hablar más rápido
      break;
    case 'sad':
      pitch = -5.0;  // tono más bajo
      speakingRate = 0.8;  // hablar más lento
      break;
    case 'surprised':
      pitch = 10.0;  // tono mucho más alto
      speakingRate = 1.5;  // hablar muy rápido
      break;
    default:
      break;
  }

  return { pitch, speakingRate };
}

// Endpoint para generar y enviar voz con TTS
app.post('/speak', async (req, res) => {
  const { text, emotion } = req.body; // Incluye la emoción desde la petición

  // Ajusta la configuración de voz basada en la emoción
  const { pitch, speakingRate } = getVoiceSettings(emotion);

  const request = {
    input: { text },
    voice: { languageCode: 'es-ES', name: 'es-ES-Neural2-A', ssmlGender: 'FEMALE' }, // Voz femenina avanzada WaveNet en español
    audioConfig: { audioEncoding: 'MP3', pitch, speakingRate },
  };

  try {
    const [response] = await client.synthesizeSpeech(request);

    const filePath = path.join(__dirname, 'public', 'output.mp3');
    await util.promisify(fs.writeFile)(filePath, response.audioContent, 'binary');

    console.log('Audio content written to file: output.mp3');
    res.json({ audioUrl: '/output.mp3' });
  } catch (error) {
    console.error('Error con Google Cloud TTS:', error);
    res.status(500).json({ error: 'Error al generar la voz' });
  }
});

server.listen(4000, () => console.log('Server running on port 4000'));
