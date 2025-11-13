/**
 * Componente: Rodapé da aplicação
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12">
      {/* Aviso Legal */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Aviso Importante</h3>
            <p className="text-sm text-blue-800 leading-relaxed">
              Este sistema é uma ferramenta de apoio à decisão médica e não substitui o julgamento clínico profissional. 
              Todas as recomendações devem ser validadas por um médico qualificado antes da aplicação clínica. 
              Em caso de emergência, procure atendimento médico imediatamente.
            </p>
          </div>
        </div>
      </div>

      {/* Créditos */}
      <div className="py-6 border-t border-primary-100 bg-white rounded-lg">
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Desenvolvido por{' '}
            <span className="font-semibold text-primary-600">
              Matheus Vinicius Rodrigues da Silva
            </span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Teste Técnico MedNote.IA • {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
};