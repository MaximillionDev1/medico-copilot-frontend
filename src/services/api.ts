/**
 * Serviço de comunicação com a API backend
 * Centraliza todas as chamadas HTTP
 */

/// <reference types="vite/client" />

import axios, { AxiosInstance, AxiosError } from 'axios';
import { DiagnosisResponse, TranscriptionResponse, ApiError } from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    // Configurar base URL da API
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    this.api = axios.create({
      baseURL,
      timeout: 30000, // 30 segundos
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para logging de requisições
    this.api.interceptors.request.use(
      (config) => {
        console.log(`📡 [API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ [API] Erro na requisição:', error);
        return Promise.reject(error);
      }
    );

    // Interceptor para logging de respostas
    this.api.interceptors.response.use(
      (response) => {
        console.log(`✅ [API] Resposta recebida:`, response.data);
        return response;
      },
      (error: AxiosError<ApiError>) => {
        console.error('❌ [API] Erro na resposta:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Health check da API
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.api.get('/api/health');
      return response.data.success;
    } catch (error) {
      console.error('❌ API não está respondendo');
      return false;
    }
  }

  /**
   * Transcrever áudio ou processar texto
   */
  async transcribe(text: string): Promise<TranscriptionResponse> {
    try {
      const response = await this.api.post<TranscriptionResponse>('/api/transcribe', {
        text,
        language: 'pt-BR',
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Gerar diagnóstico baseado na transcrição
   */
  async diagnose(transcript: string, options?: {
    patientAge?: number;
    patientGender?: string;
  }): Promise<DiagnosisResponse> {
    try {
      const response = await this.api.post<DiagnosisResponse>('/api/diagnose', {
        transcript,
        ...options,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Tratamento padronizado de erros
   */
  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const apiError = error.response?.data as ApiError;
      
      if (apiError?.message) {
        return new Error(apiError.message);
      }

      if (error.code === 'ECONNREFUSED') {
        return new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
      }

      if (error.code === 'ETIMEDOUT') {
        return new Error('Tempo de resposta excedido. Tente novamente.');
      }

      return new Error(error.message);
    }

    return new Error('Erro desconhecido ao comunicar com o servidor');
  }
}

// Exportar instância singleton
export const apiService = new ApiService();