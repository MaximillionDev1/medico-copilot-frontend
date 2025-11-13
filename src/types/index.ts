/**
 * Tipos TypeScript compartilhados
 * @author Matheus Vinicius Rodrigues da Silva
 */

export interface Diagnosis {
  diagnostico: string;
  doencas: string[];
  exames: string[];
  medicamentos: string[];
  observacoes: string;
  confianca?: number;
}

export interface Consultation {
  id: number;
  date: string;
  transcript: string;
  diagnosis: Diagnosis;
}

export interface DiagnosisResponse {
  success: boolean;
  diagnostico: string;
  doencas: string[];
  exames: string[];
  medicamentos: string[];
  observacoes: string;
  confianca?: number;
  timestamp: string;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
  timestamp: string;
}

export interface TranscriptionResponse {
  success: boolean;
  transcript: string;
  confidence?: number;
  timestamp: string;
}