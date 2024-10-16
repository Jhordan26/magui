import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Face.css'; // Archivo CSS

// Lista de gestos
const gestures = {
  happy: {
    eyes: { cx1: 60, cx2: 140, cy: 80, r: 8 },
    mouth: 'M 70 110 Q 100 180 130 110',
    eyebrows: { d1: 'M 45 40 Q 55 30 65 40', d2: 'M 135 40 Q 145 30 155 40' },
    phrase: "Uff, ya me tenían harta con tantas preguntas",
    backgroundColor: 'lightgreen' // Color de fondo para feliz
  },
  happy2: {
    eyes: { cx1: 60, cx2: 140, cy: 80, r: 8 },
    mouth: 'M 70 110 Q 100 180 130 110',
    eyebrows: { d1: 'M 45 40 Q 55 30 65 40', d2: 'M 135 40 Q 145 30 155 40' },
    phrase: "¡Hola! ¡Bienvenidos al FabLab de Tecsup en Trujillo! Soy MAGUI, su asistente virtual, y estoy aquí para llevarlos por una aventura de innovación y creatividad. Si aún están afuera, ¡adelante! Los espero en la puerta principal para darles la bienvenida y acompañarlos en este increíble espacio.\n\n¿Saben lo que es un FabLab? Pues es mucho más que un laboratorio. Aquí, la tecnología se convierte en tu mejor aliada para dar vida a todas esas ideas que tienes en la cabeza. Desde crear tus propios prototipos con impresoras 3D hasta usar las cortadoras láser para darle forma a tus diseños más locos. ¡Todo es posible en el FabLab!\n\nPero eso no es todo. Este lugar es un punto de encuentro para los amantes de la tecnología, los curiosos, los innovadores, y los creadores como tú. Si tienes una idea en mente o un proyecto en desarrollo, no dudes en preguntar, ¡estoy aquí para ayudarte en cada paso! Ya sea que quieras aprender a usar las máquinas, experimentar con nuevos materiales, o incluso recibir asesoría sobre diseño o programación, ¡el FabLab es el lugar perfecto para que tu imaginación no tenga límites!\n\nAsí que, ¿están listos para comenzar? Vamos a recorrer juntos el FabLab, a experimentar, a fallar y a aprender, ¡porque aquí cada intento nos acerca un poco más a grandes logros! Recuerden, la creatividad no tiene límites en este espacio, y juntos podemos crear cosas increíbles. ¡Bienvenidos a su laboratorio de ideas!",
    backgroundColor: 'lightgreen'
  },
  sad: {
    eyes: { cx1: 60, cx2: 140, cy: 90, r: 8 },
    mouth: 'M 70 120 Q 100 110 130 120',
    eyebrows: { d1: 'M 45 50 Q 55 60 65 50', d2: 'M 135 50 Q 145 60 155 50' },
    phrase: "Ya se van tan rápido.",
    backgroundColor: 'lightblue' // Color de fondo para triste
  },
  surprised: {
    eyes: { cx1: 60, cx2: 140, cy: 80, r: 12 },
    mouthCircle: { cx: 100, cy: 140, r: 15 },
    eyebrows: { d1: 'M 45 30 Q 55 20 65 30', d2: 'M 135 30 Q 145 20 155 30' },
    phrase: "Wuauhhh",
    backgroundColor: 'psychedelic' // Aquí aplicamos el fondo animado
  },
  angry: {
    eyes: { cx1: 60, cx2: 140, cy: 80, r: 8 },
    mouth: 'M 70 110 Q 100 100 130 110',
    eyebrows: { d1: 'M 45 30 L 65 40', d2: 'M 135 40 L 155 30' },
    phrase: "Maldita sea quien me abre la puerta, no ven que no tengo manos",
    backgroundColor: 'lightcoral' // Color de fondo para enojado
  }
};

const Face = () => {
  const [gesture, setGesture] = useState('happy2'); // Estado inicial: feliz
  const [isTalking, setIsTalking] = useState(false); // Estado para manejar si la boca está hablando

  // Función para hacer que el navegador "hable" la frase según la emoción
  const speakEmotion = (emotion) => {
    const utterance = new SpeechSynthesisUtterance(gestures[emotion].phrase);
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => voice.lang.startsWith('es') && voice.name.includes('Female'));

    if (femaleVoice) {
      utterance.voice = femaleVoice; // Asignar la voz femenina
    }

    utterance.onstart = () => {
      setGesture(emotion);
      setIsTalking(true);
    };

    utterance.onend = () => {
      setIsTalking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const currentGesture = gestures[gesture];
  const backgroundColorClass = currentGesture.backgroundColor === 'psychedelic' ? 'psychedelic-bg' : '';

  return (
    <div 
      className={`face-container ${backgroundColorClass}`}
      style={{ 
        textAlign: 'center', 
        marginTop: '50px', 
        padding: '20px',
        backgroundColor: currentGesture.backgroundColor !== 'psychedelic' ? currentGesture.backgroundColor : undefined
      }}
    >
      <div>
        <button onClick={() => speakEmotion('happy2')}>Feliz</button>
        <button onClick={() => speakEmotion('sad')}>Triste</button>
        <button onClick={() => speakEmotion('surprised')}>Sorprendido</button>
        <button onClick={() => speakEmotion('angry')}>Enojado</button>
      </div>

      <svg width="200" height="200">
        {currentGesture.eyebrows && (
          <>
            <path
              d={currentGesture.eyebrows.d1}
              stroke="black"
              strokeWidth="3"
              fill="transparent"
            />
            <path
              d={currentGesture.eyebrows.d2}
              stroke="black"
              strokeWidth="3"
              fill="transparent"
            />
          </>
        )}

        <circle cx={currentGesture.eyes.cx1} cy={currentGesture.eyes.cy} r={currentGesture.eyes.r} fill="black" />
        <circle cx={currentGesture.eyes.cx2} cy={currentGesture.eyes.cy} r={currentGesture.eyes.r} fill="black" />

        {gesture === 'surprised' ? (
          <motion.circle
            cx={currentGesture.mouthCircle.cx}
            cy={currentGesture.mouthCircle.cy}
            r={isTalking ? 18 : 15}
            fill="black"
            animate={{
              r: [15, 20, 15]
            }}
            transition={{
              duration: 0.5,
              repeat: isTalking ? Infinity : 0
            }}
          />
        ) : (
          <motion.path
            d={currentGesture.mouth}
            stroke="black"
            strokeWidth="3"
            fill="black"
            animate={
              isTalking
                ? { d: gesture === 'sad'
                    ? ['M 70 130 Q 100 90 130 130', 'M 75 120 Q 100 100 125 120', 'M 70 130 Q 100 90 130 130'] // Animación para triste
                    : gesture === 'angry'
                    ? ['M 70 130 Q 100 90 130 130', 'M 75 120 Q 100 100 125 120', 'M 70 130 Q 100 90 130 130'] // Animación para enojado
                    : ['M 70 110 Q 100 150 130 110', 'M 75 120 Q 100 140 125 120', 'M 70 110 Q 100 150 130 110'] // Animación para otros gestos
                  }
                : {}
            }
            transition={{ duration: 0.5, repeat: isTalking ? Infinity : 0 }}
          />
        )}
      </svg>
    </div>
  );
};

export default Face;
