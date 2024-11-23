import * as AuthSession from 'expo-auth-session';

const CLIENT_ID = '63b34a4e691c4c81bc0eb33debea5e02';
const CLIENT_SECRET = 'b949c921b84f4c9c994bd562766a9033';
const REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: 'spotifyuserstats',
  useProxy: true,
});

// This is your redirect URI. Add Redirect URI to developer dashboard. Working at the moment on everyone.
console.log('Redirect URI:', REDIRECT_URI);


const SCOPE = 'user-read-private user-read-email user-top-read playlist-read-private';

const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
};

export async function authenticateWithSpotify() {
  const request = new AuthSession.AuthRequest({
    clientId: CLIENT_ID,
    redirectUri: REDIRECT_URI,
    scopes: SCOPE.split(' '),
    responseType: AuthSession.ResponseType.Token,
  });

  await request.makeAuthUrlAsync(discovery);
  const authResult = await request.promptAsync(discovery);

  if (authResult.type === 'success') {
    return authResult.params.access_token;
  } else {
    console.log('Spotify Authentication failed:', authResult);
    return null;
  }
}