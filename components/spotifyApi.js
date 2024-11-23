// Client ID: 63b34a4e691c4c81bc0eb33debea5e02
// Client Secret: b949c921b84f4c9c994bd562766a9033

export async function fetchUserData(token) {
  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}

// Fetch user's top tracks
export async function fetchUserTopTracks(token, limit = 10) {
  try {
    const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error('Error fetching top tracks:', response.statusText);
      return [];
    }

    const data = await response.json();
    console.log('Fetched Top Tracks Data:', data);
    return data.items; 
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    return [];
  }
}

// Top Artists
export async function fetchUserTopArtists(token, limit = 10) {
  try {
    const response = await fetch(`https://api.spotify.com/v1/me/top/artists?limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error('Error fetching top artists:', response.statusText);
      return [];
    }

    const data = await response.json();
    console.log('Fetched Top Artists Data:', data);
    return data.items; 
  } catch (error) {
    console.error('Error fetching top artists:', error);
    return [];
  }
}

// Recently played tracks fetch
export async function fetchUserRecentlyPlayedTracks(token, limit = 10) {
  try {
    const response = await fetch(`https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error('Error fetching recently played tracks:', response.statusText);
      return [];
    }

    const data = await response.json();
    console.log('Fetched Recently Played Tracks Data:', data);
    return data.items.map((item) => item.track); // Return only the track details
  } catch (error) {
    console.error('Error fetching recently played tracks:', error);
    return [];
  }
}

// Genre Fetch ( WIP, processes only artist date)
export async function fetchUserTopGenres(token, limit = 10) {
  try {
    const topArtists = await fetchUserTopArtists(token, limit);
    const genres = topArtists.flatMap((artist) => artist.genres);
    const uniqueGenres = Array.from(new Set(genres)); // Remove duplicate genres
    console.log('Fetched Top Genres Data:', uniqueGenres);
    return uniqueGenres;
  } catch (error) {
    console.error('Error fetching top genres:', error);
    return [];
 
  }

}
