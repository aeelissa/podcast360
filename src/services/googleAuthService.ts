
interface GoogleAuthConfig {
  clientId: string;
  apiKey: string;
  scope: string;
}

class GoogleAuthService {
  private config: GoogleAuthConfig;
  private isInitialized = false;

  constructor() {
    // For now, using hardcoded values - in production these should be in environment variables
    this.config = {
      clientId: 'your-client-id.googleusercontent.com',
      apiKey: 'AIzaSyD621AddmCtGDwyLoWlv2VOQvyUzhhgNMI',
      scope: 'https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive.file'
    };
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
      // Load Google API script
      if (!document.querySelector('script[src*="apis.google.com"]')) {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => {
          this.loadGoogleAuth().then(resolve).catch(reject);
        };
        script.onerror = reject;
        document.head.appendChild(script);
      } else {
        this.loadGoogleAuth().then(resolve).catch(reject);
      }
    });
  }

  private async loadGoogleAuth(): Promise<void> {
    return new Promise((resolve, reject) => {
      (window as any).gapi.load('auth2', {
        callback: () => {
          (window as any).gapi.auth2.init({
            client_id: this.config.clientId,
          }).then(() => {
            this.isInitialized = true;
            resolve();
          }).catch(reject);
        },
        onerror: reject,
      });
    });
  }

  async signIn(): Promise<string> {
    await this.initialize();
    
    const authInstance = (window as any).gapi.auth2.getAuthInstance();
    const user = await authInstance.signIn({
      scope: this.config.scope
    });
    
    return user.getAuthResponse().access_token;
  }

  async getAccessToken(): Promise<string | null> {
    if (!this.isInitialized) return null;
    
    const authInstance = (window as any).gapi.auth2.getAuthInstance();
    if (authInstance.isSignedIn.get()) {
      return authInstance.currentUser.get().getAuthResponse().access_token;
    }
    return null;
  }

  async signOut(): Promise<void> {
    if (!this.isInitialized) return;
    
    const authInstance = (window as any).gapi.auth2.getAuthInstance();
    await authInstance.signOut();
  }
}

export const googleAuthService = new GoogleAuthService();
