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
    //  console.log('Fetched Top Tracks Data:', data);
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
    // console.log('Fetched Top Artists Data:', data);
    return data.items;
  } catch (error) {
    console.error('Error fetching top artists:', error);
    return [];
  }
}

// Recently played tracks fetch
export async function fetchUserRecentlyPlayedTracks(token) {
  const endpoint = 'https://api.spotify.com/v1/me/player/recently-played';
  try {
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.items.map((item) => item.track);
  } catch (error) {
    console.error('Error fetching recently played tracks:', error);
    throw error;
  }
}

// Genre Fetch ( WIP, processes only artist date)
export async function fetchUserTopGenres(token, limit = 10) {
  try {
    const topArtists = await fetchUserTopArtists(token, limit);
    const genres = topArtists.flatMap((artist) => artist.genres);
    const uniqueGenres = Array.from(new Set(genres)); // Remove duplicate genres
   // console.log('Fetched Top Genres Data:', uniqueGenres);
    return uniqueGenres;
  } catch (error) {
    console.error('Error fetching top genres:', error);
    return [];

  }

}

// Fetch user playlists

export const fetchUserPlaylists = async (spotifyApiToken) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {
        Authorization: `Bearer ${spotifyApiToken}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user playlists');
    }
    const data = await response.json();
    return data.items; // Return all playlists
  } catch (error) {
    console.error('Error fetching playlists:', error);
    return [];
  }
};

// GET/POST request for Playlist Management (Suggestion)

export const addTracksToPlaylist = async (token, playlistId, trackUris) => {
  try {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uris: trackUris }),
    });
    if (!response.ok) {
      throw new Error('Failed to add tracks');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding tracks to playlist:', error);
    return null;
  }
};


// Recommendations (Suggestion)

export const fetchRecommendations = async (token, seedData) => {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/recommendations?${new URLSearchParams(seedData)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch recommendations');
    }
    const data = await response.json();
    return data.tracks; // List of recommended tracks
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
};

//Listening times
export async function fetchListeningTime(token, periodDays) {
  try {
    const now = new Date();
    const periodStart = new Date(now - periodDays * 24 * 60 * 60 * 1000); 
    console.log(`Fetching listening time from: ${periodStart.toISOString()}`);

    const response = await fetch(
      `https://api.spotify.com/v1/me/player/recently-played?limit=50&after=${periodStart.toISOString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch data from Spotify API');
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return 0;
    }

    const totalListeningTimeMs = data.items.reduce((total, item) => {
      if (item.track && item.track.duration_ms) {
        return total + item.track.duration_ms;
      }
      return total;
    }, 0);

    return (totalListeningTimeMs / (1000 * 60 * 60)).toFixed(2); 
  } catch (error) {
    console.error('Error fetching listening time:', error);
    return 0;
  }
}

export async function fetchListeningTimes(token) {
  const weekListeningTime = await fetchListeningTime(token, 7);
  const monthListeningTime = await fetchListeningTime(token, 30);
  const yearListeningTime = await fetchListeningTime(token, 365);

  return {
    Week: weekListeningTime,
    Month: monthListeningTime,
    Year: yearListeningTime,
  };
}

