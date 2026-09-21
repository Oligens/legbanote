import { useState, useEffect } from 'react';

export type Environment = 'web' | 'mobile-android' | 'mobile-ios' | 'unknown';

export function useEnvironment(): Environment {
  const [env, setEnv] = useState<Environment>('unknown');

  useEffect(() => {
    // Check if running in a browser
    const isBrowser = typeof window !== 'undefined';
    
    if (!isBrowser) {
      setEnv('unknown');
      return;
    }

    // Check for mobile indicators
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = /android/.test(userAgent);
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    
    // Check if running in a WebView (mobile app)
    const isWebView = 
      /wv/.test(userAgent) || // Android WebView
      /iphone|ipad|ipod/.test(userAgent) && !/safari/.test(userAgent); // iOS WebView

    if (isWebView) {
      setEnv(isAndroid ? 'mobile-android' : 'mobile-ios');
    } else {
      setEnv('web');
    }
  }, []);

  return env;
}

export function isMobileEnvironment(env: Environment): boolean {
  return env === 'mobile-android' || env === 'mobile-ios';
}

export function isWebEnvironment(env: Environment): boolean {
  return env === 'web';
}
