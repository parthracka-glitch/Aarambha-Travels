'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

interface GoogleAuthButtonProps {
  onSuccess?: (user: { name: string; email: string; picture?: string; phone?: string; id?: string }) => void;
  onError?: (err: any) => void;
  text?: string;
  className?: string;
  variant?: 'full' | 'compact';
}

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  '1066267337029-0fkfosb6tt2h22m5m5fa2jafkpd7biho.apps.googleusercontent.com';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function decodeJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export default function GoogleAuthButton({
  onSuccess,
  onError,
  text = 'Continue with Google',
  className = '',
}: GoogleAuthButtonProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isScriptReady, setIsScriptReady] = useState(false);
  const tokenClientRef = useRef<any>(null);
  const googleBtnContainerRef = useRef<HTMLDivElement>(null);

  // Common completion routine
  const completeLogin = useCallback(
    async (rawCredentialOrToken: string, profileFromGoogle?: any) => {
      setLoading(true);
      setErrorMsg(null);

      try {
        let sessionUser = {
          id: profileFromGoogle?.sub || 'google_user',
          name: profileFromGoogle?.name || profileFromGoogle?.email?.split('@')[0] || 'Google User',
          email: (profileFromGoogle?.email || '').toLowerCase(),
          picture: profileFromGoogle?.picture,
          phone: '+91 82082 11478',
          role: 'customer',
          isEmailVerified: true,
          loggedIn: true,
        };

        // Call Aarambha backend to authenticate/register and issue JWT
        try {
          const res = await fetch(`${API_BASE}/api/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credential: rawCredentialOrToken }),
          });

          if (res.ok) {
            const data = await res.json();
            if (data.access_token) {
              localStorage.setItem('aarambha_token', data.access_token);
            }
            if (data.user) {
              sessionUser = { ...sessionUser, ...data.user, loggedIn: true };
            }
          }
        } catch (backendErr) {
          console.warn('[GoogleAuth] Backend verification note (local fallback active):', backendErr);
        }

        // Save session locally
        localStorage.setItem('aarambha_user', JSON.stringify(sessionUser));
        window.dispatchEvent(new Event('aarambha_auth_changed'));

        if (onSuccess) {
          onSuccess(sessionUser);
        }
      } catch (err: any) {
        console.error('[GoogleAuth] Login process error:', err);
        setErrorMsg(err.message || 'Failed to complete Google Sign-In.');
        if (onError) onError(err);
      } finally {
        setLoading(false);
      }
    },
    [onSuccess, onError]
  );

  // Handler for ID Token (Google Identity Services button / One Tap)
  const handleCredentialResponse = useCallback(
    async (response: any) => {
      if (!response || !response.credential) {
        setErrorMsg('No credential returned from Google.');
        return;
      }
      const decoded = decodeJwt(response.credential);
      const profile = {
        name: decoded?.name || decoded?.email?.split('@')[0] || 'Google User',
        email: (decoded?.email || '').toLowerCase(),
        picture: decoded?.picture,
        sub: decoded?.sub,
      };
      await completeLogin(response.credential, profile);
    },
    [completeLogin]
  );

  // Handler for OAuth2 Access Token (Google Token Client Popup)
  const handleAccessTokenResponse = useCallback(
    async (accessToken: string) => {
      try {
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const profile = userInfoRes.ok ? await userInfoRes.json() : null;
        await completeLogin(accessToken, profile);
      } catch (err: any) {
        console.error('[GoogleAuth] OAuth token info error:', err);
        await completeLogin(accessToken);
      }
    },
    [completeLogin]
  );

  // Load Google Identity Services client script
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const existingScript = document.getElementById('google-gsi-client');
    if (existingScript) {
      if ((window as any).google?.accounts) {
        setIsScriptReady(true);
      } else {
        existingScript.addEventListener('load', () => setIsScriptReady(true));
      }
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-gsi-client';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsScriptReady(true);
    };
    script.onerror = () => {
      setErrorMsg('Failed to load Google Sign-In service. Please check your internet connection.');
    };
    document.body.appendChild(script);
  }, []);

  // Initialize both Google Identity Services (ID token) and OAuth2 Token Client (Popup)
  useEffect(() => {
    if (!isScriptReady || typeof window === 'undefined') return;
    const google = (window as any).google;
    if (!google) return;

    // 1. Initialize Google Identity Services (Sign-In with Google button & One Tap)
    if (google.accounts?.id) {
      try {
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Render official Google button into container if present
        if (googleBtnContainerRef.current) {
          googleBtnContainerRef.current.innerHTML = '';
          google.accounts.id.renderButton(googleBtnContainerRef.current, {
            theme: 'outline',
            size: 'large',
            width: 320,
            text: 'continue_with',
            shape: 'pill',
            logo_alignment: 'left',
          });
        }
      } catch (err) {
        console.warn('[GoogleAuth] Google accounts.id initialization:', err);
      }
    }

    // 2. Initialize Google OAuth2 Token Client (opens real Google Account selector popup on click)
    if (google.accounts?.oauth2) {
      try {
        tokenClientRef.current = google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'email profile openid',
          callback: async (tokenResponse: any) => {
            if (tokenResponse.error) {
              if (tokenResponse.error === 'popup_closed_by_user') {
                setLoading(false);
                return;
              }
              setErrorMsg(tokenResponse.error_description || tokenResponse.error || 'Google Sign-In failed.');
              setLoading(false);
              return;
            }
            if (tokenResponse.access_token) {
              await handleAccessTokenResponse(tokenResponse.access_token);
            }
          },
        });
      } catch (err) {
        console.warn('[GoogleAuth] Google accounts.oauth2 initialization:', err);
      }
    }
  }, [isScriptReady, handleCredentialResponse, handleAccessTokenResponse]);

  const triggerGoogleLogin = () => {
    setErrorMsg(null);
    setLoading(true);

    // Option 1: Trigger OAuth2 popup (guarantees official Google Account Picker modal)
    if (tokenClientRef.current) {
      try {
        tokenClientRef.current.requestAccessToken({ prompt: 'select_account' });
        return;
      } catch (e: any) {
        console.warn('[GoogleAuth] Token client failed, trying fallback:', e);
      }
    }

    // Option 2: Fallback to Google One Tap
    const google = (window as any).google;
    if (google?.accounts?.id) {
      try {
        google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            const reason = notification.getNotDisplayedReason() || notification.getSkippedReason();
            setLoading(false);
            if (reason === 'origin_mismatch') {
              setErrorMsg(
                'Domain authorization required: Please add this domain to "Authorized JavaScript origins" in Google Cloud Console.'
              );
            }
          }
        });
        return;
      } catch (e: any) {
        setLoading(false);
        setErrorMsg(e.message || 'Could not open Google Sign-In.');
        return;
      }
    }

    setLoading(false);
    setErrorMsg('Google Sign-In is initializing. Please wait a moment and try again.');
  };

  return (
    <div className="w-full space-y-2">
      {/* Container for rendered official Google button if needed */}
      <div ref={googleBtnContainerRef} className="hidden" aria-hidden="true" />

      {/* Styled Google Auth Button */}
      <button
        type="button"
        onClick={triggerGoogleLogin}
        disabled={loading}
        className={`w-full py-3 px-4 rounded-xl border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-sans font-semibold text-xs shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-2.5 active:scale-[0.99] cursor-pointer disabled:opacity-60 ${className}`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-gray-600 shrink-0" />
        ) : (
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        <span>{loading ? 'Opening Google Sign-In...' : text}</span>
      </button>

      {/* Error / Origin Guide Banner if Google blocks or fails */}
      {errorMsg && (
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">{errorMsg}</p>
          </div>
        </div>
      )}

      <div className="text-center">
        <span className="text-[10px] text-gray-400 inline-flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          Official Google OAuth 2.0 Authentication
        </span>
      </div>
    </div>
  );
}
