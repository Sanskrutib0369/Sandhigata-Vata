import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.sandhigata',
  appName: 'sandhigata-vata',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  cordova: {
    preferences: {
      'AndroidLaunchMode': 'singleTop',
      'AllowInlineMediaPlayback': 'true',
      'MediaPlaybackRequiresUserAction': 'false'
    },
    plugins: {
      'cordova-plugin-printer': {}
    }
  }
};

export default config;
