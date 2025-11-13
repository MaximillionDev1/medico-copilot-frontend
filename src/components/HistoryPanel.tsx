/**
 * Componente: Painel de histórico de consultas
 */

import React from 'react';
import { X, Trash2, Eye } from 'lucide-react';
import { Consultation } from '../types';
import { formatRelativeTime, truncateText } from '../utils/formatters';

interface HistoryPanelProps {
  consultations: Consultation[];
  onClose: () => void;
  onLoadConsultation: (consultation: Consultation) => void;
  onDeleteConsultation: (id: number) => void;
  onClearHistory: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  consultations,
  onClose,
  onLoadConsultation,
  onDeleteConsultation,
  onClearHistory,
}) => {
  const handleClearAll = () => {
    if (window.confirm('Tem certeza que deseja limpar todo o histórico? Esta ação não pode ser desfeita.')) {
      onClearHistory();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-primary-100 p-6 mb-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Consultas Anteriores</h2>
        <div className="flex items-center space-x-2">
          {consultations.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1 rounded hover:bg-red-50 transition"
            >
              Limpar Tudo
            </button>
          )}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Lista de Consultas */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {consultations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhuma consulta registrada ainda</p>
            <p className="text-sm text-gray-400 mt-1">
              As consultas processadas aparecerão aqui
            </p>
          </div>
        ) : (
          consultations.map((consult) => (
            <div
              key={consult.id}
              className="group p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all cursor-pointer"
            >
              {/* Informações principais */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900">
                    {formatRelativeTime(consult.date)}
                  </span>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {truncateText(consult.transcript, 150)}
                  </p>
                </div>
              </div>

              {/* Prévia do diagnóstico */}
              <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600 group-hover:bg-white transition">
                <strong>Diagnóstico:</strong> {truncateText(consult.diagnosis.diagnostico, 100)}
              </div>

              {/* Ações */}
              <div className="flex items-center space-x-2 mt-3">
                <button
                  onClick={() => onLoadConsultation(consult)}
                  className="flex items-center space-x-1 text-xs text-primary-600 hover:text-primary-700 font-medium px-2 py-1 rounded hover:bg-primary-100 transition"
                >
                  <Eye className="w-3 h-3" />
                  <span>Ver detalhes</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Deseja remover esta consulta do histórico?')) {
                      onDeleteConsultation(consult.id);
                    }
                  }}
                  className="flex items-center space-x-1 text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Excluir</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};