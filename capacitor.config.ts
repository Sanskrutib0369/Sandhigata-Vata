import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.sandhigata',
  appName: 'sandhigata-vata',
  webDir: 'dist',
  cordova: {
    plugins: {
      'cordova-plugin-printer': {}
    }
  }
};

export default config;
