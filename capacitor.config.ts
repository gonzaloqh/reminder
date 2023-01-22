import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.reminder.app',
  appName: 'Reminder',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    LocalNotifications: {
      smallIcon: "res://ic_launcher.png",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
  }
};

export default config;
