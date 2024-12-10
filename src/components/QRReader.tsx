import React from 'react';
import QrScanner from 'react-qr-scanner';

type QRScannerProps = {
  onScanSuccess: (data: string) => void;
  onError?: (error: any) => void;
};

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, onError }) => {
  const handleScan = (data: any) => {
    if (data && data.text) {
      onScanSuccess(data.text); // Enviar datos al padre
    }
  };

  const handleError = (error: any) => {
    console.error('Error al escanear QR:', error);
    if (onError) onError(error);
  };

  return (
    <div>
      <QrScanner
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '100%' }}
      />
    </div>
  );
};

export default QRScanner;
