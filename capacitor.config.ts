import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.sandhigata',
  appName: 'sandhigata-vata',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  cordova: {
    preferences: {
      'AndroidLaunchMode': 'singleTop',
      'AllowInlineMediaPlayback': 'true',
      'MediaPlaybackRequiresUserAction': 'false',
      'AndroidPersistentFileLocation': 'Compatibility',
      'AndroidExtraFilesystems': 'files,cdv,documents',
      'AndroidExtraFilesystemTypes': 'files://localhost/files/*,cdv://localhost/files/*,documents://localhost/files/*'
    },
    plugins: {
      'cordova-plugin-printer': {}
    }
  }
};

export default config;
