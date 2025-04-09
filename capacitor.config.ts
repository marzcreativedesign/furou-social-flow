
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.aeaddccd17ac4b8b8c824b72dc963f2b',
  appName: 'furou-social-flow',
  webDir: 'dist',
  server: {
    url: 'https://aeaddccd-17ac-4b8b-8c82-4b72dc963f2b.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#F75E7E",
      showSpinner: true,
      spinnerColor: "#ffffff"
    }
  }
};

export default config;
