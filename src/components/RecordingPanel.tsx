/**
 * Componente: Painel de gravação e transcrição
 */

import React, { useState } from 'react';
import { Mic, Square, Send, AlertCircle } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface RecordingPanelProps {
  onProcessDiagnosis: (transcript: string) => void;
  isProcessing: boolean;
}

export const RecordingPanel: React.FC<RecordingPanelProps> = ({
  onProcessDiagnosis,
  isProcessing,
}) => {
  const {
    transcript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  const [manualTranscript, setManualTranscript] = useState('');
  const [useManualMode, setUseManualMode] = useState(false);

  const currentTranscript = useManualMode ? manualTranscript : transcript;

  const handleStartRecording = () => {
    if (!isSupported) {
      alert('Seu navegador não suporta reconhecimento de voz. Use o modo manual.');
      setUseManualMode(true);
      return;
    }
    resetTranscript();
    startListening();
  };

  const handleStopRecording = () => {
    stopListening();
  };

  const handleProcess = () => {
    if (!currentTranscript.trim()) {
      alert('Por favor, grave ou digite a transcrição da consulta primeiro.');
      return;
    }
    onProcessDiagnosis(currentTranscript);
  };

  const handleReset = () => {
    resetTranscript();
    setManualTranscript('');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-primary-100 p-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Mic className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900">Captura de Consulta</h2>
        </div>
        
        {/* Toggle Manual/Voz */}
        <button
          onClick={() => {
            setUseManualMode(!useManualMode);
            if (!useManualMode) stopListening();
          }}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          {useManualMode ? '🎤 Usar Voz' : '⌨️ Digitar Manualmente'}
        </button>
      </div>

      {/* Aviso se não suportado */}
      {!isSupported && !useManualMode && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            Seu navegador não suporta reconhecimento de voz. Use o modo manual ou tente o Chrome/Edge.
          </p>
        </div>
      )}

      {/* Controles de Gravação (Modo Voz) */}
      {!useManualMode && (
        <div className="flex justify-center mb-6">
          {!isListening ? (
            <button
              onClick={handleStartRecording}
              disabled={isProcessing}
              className="group relative w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Mic className="w-10 h-10 text-white mx-auto" />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-600 whitespace-nowrap">
                Iniciar gravação
              </span>
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              className="group relative w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 animate-pulse"
            >
              <Square className="w-10 h-10 text-white mx-auto" />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-600 whitespace-nowrap">
                Parar gravação
              </span>
            </button>
          )}
        </div>
      )}

      {/* Status de Gravação */}
      {isListening && (
        <div className="flex items-center justify-center space-x-2 mb-6 text-red-600">
          <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Gravando... Fale agora</span>
        </div>
      )}

      {/* Área de Transcrição */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {useManualMode ? 'Digite a transcrição' : 'Transcrição em tempo real'}
        </label>
        
        {useManualMode ? (
          <textarea
            value={manualTranscript}
            onChange={(e) => setManualTranscript(e.target.value)}
            placeholder="Digite aqui a transcrição da consulta médica..."
            className="w-full min-h-[200px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-y"
          />
        ) : (
          <div className="min-h-[200px] max-h-[400px] overflow-y-auto p-4 bg-gray-50 rounded-lg border border-gray-200">
            {transcript ? (
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{transcript}</p>
            ) : (
              <p className="text-gray-400 italic">
                {isListening ? 'Aguardando fala...' : 'Clique no botão de microfone para iniciar'}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Botões de Ação */}
      <div className="flex space-x-3">
        <button
          onClick={handleProcess}
          disabled={!currentTranscript.trim() || isProcessing}
          className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processando...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Gerar Diagnóstico</span>
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          disabled={isProcessing || !currentTranscript.trim()}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Limpar
        </button>
      </div>
    </div>
  );
};