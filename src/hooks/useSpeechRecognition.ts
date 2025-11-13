/**
 * Hook customizado para reconhecimento de voz
 * Encapsula a Web Speech API
 */

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSpeechRecognitionReturn {
  transcript: string;
  isListening: boolean;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export const useSpeechRecognition = (): UseSpeechRecognitionReturn => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  // Verificar suporte do navegador
  useEffect(() => {
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);
      
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'pt-BR';
      recognition.maxAlternatives = 1;

      // Evento: resultado da transcrição
      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPiece + ' ';
          } else {
            interimTranscript += transcriptPiece;
          }
        }

        setTranscript((prev) => prev + finalTranscript);
      };

      // Evento: erro
      recognition.onerror = (event: any) => {
        console.error('❌ Erro no reconhecimento de voz:', event.error);
        
        if (event.error === 'no-speech') {
          console.log('⚠️ Nenhuma fala detectada');
        } else if (event.error === 'aborted') {
          console.log('⚠️ Reconhecimento abortado');
        } else {
          alert(`Erro no reconhecimento de voz: ${event.error}`);
        }
        
        setIsListening(false);
      };

      // Evento: fim
      recognition.onend = () => {
        console.log('🎤 Reconhecimento de voz finalizado');
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      console.warn('⚠️ Web Speech API não suportada neste navegador');
      setIsSupported(false);
    }

    // Cleanup
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Iniciar escuta
  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        console.log('🎤 Iniciando reconhecimento de voz...');
      } catch (error) {
        console.error('❌ Erro ao iniciar reconhecimento:', error);
      }
    }
  }, [isListening]);

  // Parar escuta
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      console.log('🛑 Parando reconhecimento de voz...');
    }
  }, [isListening]);

  // Resetar transcrição
  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    transcript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
};