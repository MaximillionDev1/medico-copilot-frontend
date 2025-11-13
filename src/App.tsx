/**
 * Componente Principal da Aplicação
 * @author Matheus Vinicius Rodrigues da Silva
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { RecordingPanel } from './components/RecordingPanel';
import { DiagnosisPanel } from './components/DiagnosisPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { Footer } from './components/Footer';
import { apiService } from './services/api';
import { useConsultations } from './hooks/useConsultations';
import { Diagnosis, Consultation } from './types';
import { WifiOff } from 'lucide-react';

function App() {
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [apiConnected, setApiConnected] = useState(true);
  const [currentTranscript, setCurrentTranscript] = useState('');

  const { 
    consultations, 
    saveConsultation, 
    deleteConsultation, 
    clearHistory 
  } = useConsultations();

  // Verificar conexão com API ao montar
  useEffect(() => {
    checkApiConnection();
  }, []);

  const checkApiConnection = async () => {
    const isConnected = await apiService.healthCheck();
    setApiConnected(isConnected);
    
    if (!isConnected) {
      console.warn('⚠️ Não foi possível conectar ao backend');
    }
  };

  /**
   * Processar diagnóstico
   */
  const handleProcessDiagnosis = async (transcript: string) => {
    if (!transcript.trim()) {
      alert('Por favor, forneça uma transcrição válida.');
      return;
    }

    setIsProcessing(true);
    setCurrentTranscript(transcript);

    try {
      console.log('🔄 Enviando transcrição para análise...');
      
      // Chamar API de diagnóstico
      const response = await apiService.diagnose(transcript);
      
      console.log('✅ Diagnóstico recebido com sucesso');

      // Criar objeto de diagnóstico
      const diagnosisData: Diagnosis = {
        diagnostico: response.diagnostico,
        doencas: response.doencas,
        exames: response.exames,
        medicamentos: response.medicamentos,
        observacoes: response.observacoes,
        confianca: response.confianca,
      };

      setDiagnosis(diagnosisData);

      // Salvar no histórico
      const consultation: Consultation = {
        id: Date.now(),
        date: new Date().toISOString(),
        transcript,
        diagnosis: diagnosisData,
      };

      saveConsultation(consultation);

      // Scroll suave para o resultado
      setTimeout(() => {
        document.querySelector('#diagnosis-panel')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);

    } catch (error: any) {
      console.error('❌ Erro ao processar diagnóstico:', error);
      alert(`Erro ao processar diagnóstico: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Carregar consulta do histórico
   */
  const handleLoadConsultation = (consultation: Consultation) => {
    setCurrentTranscript(consultation.transcript);
    setDiagnosis(consultation.diagnosis);
    setShowHistory(false);

    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      {/* Header */}
      <Header 
        onToggleHistory={() => setShowHistory(!showHistory)} 
        showHistory={showHistory}
      />

      {/* Aviso de Conexão */}
      {!apiConnected && (
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
            <WifiOff className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-900">
                Não foi possível conectar ao servidor backend
              </p>
              <p className="text-xs text-red-700 mt-1">
                Verifique se o backend está rodando em http://localhost:3001
              </p>
            </div>
            <button
              onClick={checkApiConnection}
              className="ml-auto text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Painel de Histórico */}
        {showHistory && (
          <HistoryPanel
            consultations={consultations}
            onClose={() => setShowHistory(false)}
            onLoadConsultation={handleLoadConsultation}
            onDeleteConsultation={deleteConsultation}
            onClearHistory={clearHistory}
          />
        )}

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Painel de Gravação */}
          <RecordingPanel
            onProcessDiagnosis={handleProcessDiagnosis}
            isProcessing={isProcessing}
          />

          {/* Painel de Diagnóstico */}
          <div id="diagnosis-panel">
            <DiagnosisPanel diagnosis={diagnosis} />
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}

export default App;