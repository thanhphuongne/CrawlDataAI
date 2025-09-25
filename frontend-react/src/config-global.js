import { paths } from 'src/routes/paths';

// FAKE DATA
export const TMP_BEARER = process.env.NEXT_PUBLIC_FAKE_BEARER;
export const TMP_VENDOR_ID = process.env.NEXT_PUBLIC_FAKE_VENDOR_ID;

// API
// ----------------------------------------------------------------------

export const HOST_API = process.env.NEXT_PUBLIC_HOST_API;
export const HOST_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN;
export const ASSETS_API = process.env.NEXT_PUBLIC_ASSETS_API;
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
export const CONTRACT_AIRDROP = process.env.NEXT_PUBLIC_CONTRACT_AIRDROP;
export const TOKEN_AIRDROP = process.env.NEXT_PUBLIC_TOKEN_AIRDROP;

export const INVITE_LINK = (code) => {
  if (code) return `${ASSETS_API}/register?xoffer=${code}`
  return null
};

export const FIREBASE_API = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const AMPLIFY_API = {
  userPoolId: process.env.NEXT_PUBLIC_AWS_AMPLIFY_USER_POOL_ID,
  userPoolWebClientId: process.env.NEXT_PUBLIC_AWS_AMPLIFY_USER_POOL_WEB_CLIENT_ID,
  region: process.env.NEXT_PUBLIC_AWS_AMPLIFY_REGION,
};

export const AUTH0_API = {
  clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
  callbackUrl: process.env.NEXT_PUBLIC_AUTH0_CALLBACK_URL,
};

export const SUPABASE_API = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

export const MAPBOX_API = process.env.NEXT_PUBLIC_MAPBOX_API;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = paths.activities // paths.dashboard.root; // as '/dashboard'
export const PATH_TERMS_OF_SERVICE = process.env.NEXT_PUBLIC_TERMS_OF_SERVICE;
export const PATH_PRIVACY_POLICY = process.env.NEXT_PUBLIC_PRIVACY_POLICY;
