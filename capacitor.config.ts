import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'msp',
  webDir: 'www',
  bundledWebRuntime: false,
  server: {
		url: "http://192.168.201.216:8100",
    cleartext: true,
	}
};

export default config;
