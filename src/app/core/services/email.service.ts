import { Injectable } from '@angular/core';

export interface ConsultaEmail {
  nombre: string;
  telefono: string;
  email: string;
  comentario: string;
  producto: {
    nombre: string;
    precio: number;
    imagen?: string;
  };
  seccion: 'cerco' | 'rural';
}

export interface RespuestaEmail {
  success: boolean;
  data?: any;
  error?: string;
  details?: any;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = '/api/send-email';

  constructor() {}

  async enviarConsulta(consulta: ConsultaEmail): Promise<RespuestaEmail> {
    try {
      console.log('📧 Enviando consulta por email:', consulta);

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(consulta)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Error al enviar email:', data);
        return {
          success: false,
          error: data.error || 'Error al enviar la consulta',
          details: data.details
        };
      }

      console.log('✅ Email enviado exitosamente:', data);
      return {
        success: true,
        data: data.data
      };

    } catch (error) {
      console.error('❌ Error en el servicio de email:', error);
      return {
        success: false,
        error: 'Error de conexión. Por favor, intente nuevamente.',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
