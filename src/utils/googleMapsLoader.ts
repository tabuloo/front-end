// Google Maps API Loader - Best Practice Implementation
// This utility loads Google Maps API asynchronously with proper error handling

interface GoogleMapsLoaderOptions {
  libraries?: string[];
  language?: string;
  region?: string;
}

class GoogleMapsLoader {
  private static instance: GoogleMapsLoader;
  private isLoaded = false;
  private isLoading = false;
  private loadPromise: Promise<void> | null = null;
  private callbacks: Array<() => void> = [];
  private errorCallbacks: Array<(error: Error) => void> = [];

  private constructor() {}

  public static getInstance(): GoogleMapsLoader {
    if (!GoogleMapsLoader.instance) {
      GoogleMapsLoader.instance = new GoogleMapsLoader();
    }
    return GoogleMapsLoader.instance;
  }

  public async load(options: GoogleMapsLoaderOptions = {}): Promise<void> {
    // If already loaded, resolve immediately
    if (this.isLoaded) {
      return Promise.resolve();
    }

    // If already loading, return the existing promise
    if (this.isLoading && this.loadPromise) {
      return this.loadPromise;
    }

    // Start loading
    this.isLoading = true;
    this.loadPromise = this.loadScript(options);

    try {
      await this.loadPromise;
      this.isLoaded = true;
      this.isLoading = false;
      
      // Execute all pending callbacks
      this.callbacks.forEach(callback => {
        try {
          callback();
        } catch (error) {
          console.error('Error in Google Maps callback:', error);
        }
      });
      this.callbacks = [];
      
    } catch (error) {
      this.isLoading = false;
      this.loadPromise = null;
      
      // Execute error callbacks
      this.errorCallbacks.forEach(callback => {
        try {
          callback(error as Error);
        } catch (err) {
          console.error('Error in Google Maps error callback:', err);
        }
      });
      
      throw error;
    }
  }

  private loadScript(options: GoogleMapsLoaderOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if Google Maps is already loaded (in case script was loaded elsewhere)
      if (window.google && window.google.maps) {
        resolve();
        return;
      }

      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        reject(new Error('Google Maps API key is not configured. Please set VITE_GOOGLE_MAPS_API_KEY in your environment variables.'));
        return;
      }

      // Create script element
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.defer = true;

      // Build URL with proper parameters
      const params = new URLSearchParams({
        key: apiKey,
        loading: 'async', // This is the key parameter for performance
        callback: 'initGoogleMaps'
      });

      if (options.libraries && options.libraries.length > 0) {
        params.append('libraries', options.libraries.join(','));
      }

      if (options.language) {
        params.append('language', options.language);
      }

      if (options.region) {
        params.append('region', options.region);
      }

      script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;

      // Global callback function
      (window as any).initGoogleMaps = () => {
        delete (window as any).initGoogleMaps; // Clean up
        resolve();
      };

      // Error handling
      script.onerror = () => {
        delete (window as any).initGoogleMaps; // Clean up
        document.head.removeChild(script);
        reject(new Error('Failed to load Google Maps API script'));
      };

      // Add timeout
      const timeout = setTimeout(() => {
        delete (window as any).initGoogleMaps; // Clean up
        document.head.removeChild(script);
        reject(new Error('Timeout loading Google Maps API'));
      }, 10000);

      // Clear timeout on success
      const originalCallback = (window as any).initGoogleMaps;
      (window as any).initGoogleMaps = () => {
        clearTimeout(timeout);
        originalCallback();
      };

      // Append script to head
      document.head.appendChild(script);
    });
  }

  public onLoad(callback: () => void): void {
    if (this.isLoaded) {
      callback();
    } else {
      this.callbacks.push(callback);
    }
  }

  public onError(callback: (error: Error) => void): void {
    this.errorCallbacks.push(callback);
  }

  public isGoogleMapsLoaded(): boolean {
    return this.isLoaded && !!(window.google && window.google.maps);
  }
}

// Export singleton instance
export const googleMapsLoader = GoogleMapsLoader.getInstance();

// Export types
export type { GoogleMapsLoaderOptions };

// Utility function for components
export const loadGoogleMaps = (options?: GoogleMapsLoaderOptions): Promise<void> => {
  return googleMapsLoader.load({
    libraries: ['places', 'geometry'],
    language: 'en',
    region: 'IN',
    ...options
  });
};

// Type declarations for Google Maps
declare global {
  interface Window {
    google: typeof google;
    initGoogleMaps?: () => void;
  }
}
