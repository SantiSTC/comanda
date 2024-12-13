declare module 'modern-react-qr-reader' {
    import React from 'react';
  
    export interface QrReaderProps {
      delay?: number; // Intervalo entre intentos de escaneo
      onError?: (error: any) => void; // Callback para manejar errores
      onScan?: (data: string | null) => void; // Callback cuando se detecta un QR válido
      facingMode?: 'user' | 'environment'; // Cámara frontal o trasera
      style?: React.CSSProperties; // Estilo del componente
      legacyMode?: boolean; // Usa selector de archivo si es necesario
      className?: string; // Clase CSS personalizada
    }
  
    const QrReader: React.FC<QrReaderProps>;
  
    export default QrReader;
  }
  