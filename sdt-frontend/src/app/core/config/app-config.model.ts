export interface IAppConfig {
  env: {
    name: string;
    socketIOEndpoint: string;
    apiEndpoint: string;
  };
  header: {
    appName: string;
  };
  footer: {
    copyrightString: string;
    showPoweredBy: boolean;
    showLogin: boolean;
  };
}
