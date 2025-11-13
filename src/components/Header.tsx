/**
 * Componente: Cabeçalho da aplicação
 */

import React from 'react';
import { Brain, Clock } from 'lucide-react';

interface HeaderProps {
  onToggleHistory: () => void;
  showHistory: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleHistory, showHistory }) => {
  return (
    <header className="bg-white shadow-sm border-b border-primary-100">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo e Título */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-md">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Médico Copilot</h1>
              <p className="text-sm text-gray-500">Sistema inteligente de diagnóstico assistido</p>
            </div>
          </div>

          {/* Botão Histórico */}
          <button
            onClick={onToggleHistory}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all shadow-sm ${
              showHistory
                ? 'bg-primary-500 text-white hover:bg-primary-600'
                : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span className="text-sm">Histórico</span>
          </button>
        </div>
      </div>
    </header>
  );
};