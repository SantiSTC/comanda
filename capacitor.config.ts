import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'rest.ops',
  appName: 'RestOps2',
  webDir: 'dist',
  plugins: {
    QrScanner: {
      enabled: true,
    },
  },
};

export default config;
