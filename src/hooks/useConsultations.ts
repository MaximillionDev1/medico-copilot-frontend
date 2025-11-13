/**
 * Hook para gerenciar histórico de consultas
 * Persiste dados no localStorage
 */

import { useState, useEffect } from 'react';
import { Consultation } from '../types';

const STORAGE_KEY = 'medico-copilot-consultations';

export const useConsultations = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);

  // Carregar consultas do localStorage ao montar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setConsultations(parsed);
        console.log(`📦 Carregadas ${parsed.length} consultas do histórico`);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar histórico:', error);
    }
  }, []);

  // Salvar consulta
  const saveConsultation = (consultation: Consultation) => {
    try {
      const updated = [consultation, ...consultations].slice(0, 20); // Máximo 20 consultas
      setConsultations(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      console.log('💾 Consulta salva no histórico');
    } catch (error) {
      console.error('❌ Erro ao salvar consulta:', error);
    }
  };

  // Deletar consulta
  const deleteConsultation = (id: number) => {
    try {
      const updated = consultations.filter((c) => c.id !== id);
      setConsultations(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      console.log('🗑️ Consulta removida do histórico');
    } catch (error) {
      console.error('❌ Erro ao deletar consulta:', error);
    }
  };

  // Limpar todo o histórico
  const clearHistory = () => {
    try {
      setConsultations([]);
      localStorage.removeItem(STORAGE_KEY);
      console.log('🧹 Histórico limpo');
    } catch (error) {
      console.error('❌ Erro ao limpar histórico:', error);
    }
  };

  return {
    consultations,
    saveConsultation,
    deleteConsultation,
    clearHistory,
  };
};