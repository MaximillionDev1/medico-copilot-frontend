/**
 * Componente: Painel de exibição do diagnóstico
 */

import React from 'react';
import { FileText, Brain, Activity, TestTube, Pill, AlertCircle } from 'lucide-react';
import { Diagnosis } from '../types';

interface DiagnosisPanelProps {
  diagnosis: Diagnosis | null;
}

export const DiagnosisPanel: React.FC<DiagnosisPanelProps> = ({ diagnosis }) => {
  if (!diagnosis) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-primary-100 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <FileText className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900">Resultado do Diagnóstico</h2>
        </div>

        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 mb-2">Nenhum diagnóstico gerado ainda</p>
          <p className="text-sm text-gray-400">Grave a consulta e clique em "Gerar Diagnóstico"</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-primary-100 p-6">
      {/* Cabeçalho */}
      <div className="flex items-center space-x-2 mb-6">
        <FileText className="w-5 h-5 text-primary-600" />
        <h2 className="text-lg font-semibold text-gray-900">Resultado do Diagnóstico</h2>
      </div>

      <div className="space-y-6">
        {/* Diagnóstico Principal */}
        <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
          <div className="flex items-start space-x-3">
            <Brain className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Diagnóstico Provável</h3>
              <p className="text-gray-700 leading-relaxed">{diagnosis.diagnostico}</p>
              {diagnosis.confianca && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Nível de confiança</span>
                    <span className="font-semibold text-primary-600">{diagnosis.confianca}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${diagnosis.confianca}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Doenças Associadas */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Activity className="w-4 h-4 text-primary-600" />
            <h3 className="font-semibold text-gray-900">Condições Possíveis</h3>
          </div>
          <div className="space-y-2">
            {diagnosis.doencas.map((doenca, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">{doenca}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Exames Sugeridos */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <TestTube className="w-4 h-4 text-primary-600" />
            <h3 className="font-semibold text-gray-900">Exames Recomendados</h3>
          </div>
          <div className="space-y-2">
            {diagnosis.exames.map((exame, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">{exame}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Medicamentos */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Pill className="w-4 h-4 text-primary-600" />
            <h3 className="font-semibold text-gray-900">Medicamentos Sugeridos</h3>
          </div>
          <div className="space-y-2">
            {diagnosis.medicamentos.map((med, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition"
              >
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">{med}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Observações */}
        {diagnosis.observacoes && (
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Observações Importantes</h3>
                <p className="text-gray-700 leading-relaxed">{diagnosis.observacoes}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};