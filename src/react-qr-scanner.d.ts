declare module 'react-qr-scanner' {
    import { CSSProperties } from 'react';
  
    export interface QrReaderProps {
      delay?: number;
      onError?: (error: any) => void;
      onScan?: (data: { text: string } | null) => void;
      style?: CSSProperties;
      facingMode?: 'user' | 'environment';
      legacyMode?: boolean;
      maxImageSize?: number;
    }
  
    const QrReader: React.FC<QrReaderProps>;
  
    export default QrReader;
  }
  