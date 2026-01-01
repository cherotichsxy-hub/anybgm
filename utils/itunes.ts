
import { Song } from '../types';

// iTunes Search API Endpoint
const ITUNES_API = 'https://itunes.apple.com/search';

// Custom SVG Placeholder (Data URI)
// Style: Y2K "No Signal" / Industrial Error style
const PLACEHOLDER_SVG = `
<svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#111111"/>
  <rect x="0" y="0" width="600" height="600" fill="none" stroke="#333" stroke-width="20"/>
  <line x1="0" y1="0" x2="600" y2="600" stroke="#222" stroke-width="2"/>
  <line x1="600" y1="0" x2="0" y2="600" stroke="#222" stroke-width="2"/>
  
  <!-- Central Box -->
  <rect x="150" y="220" width="300" height="160" fill="#000" stroke="#444" stroke-width="4"/>
  
  <!-- Text -->
  <text x="50%" y="280" font-family="monospace" font-weight="bold" font-size="40" fill="#555" text-anchor="middle">NO DISC</text>
  <text x="50%" y="330" font-family="monospace" font-size="20" fill="#333" text-anchor="middle" letter-spacing="4">COVER_NOT_FOUND</text>
  
  <!-- Glitch bars -->
  <rect x="160" y="350" width="280" height="4" fill="#333" />
  <rect x="200" y="240" width="10" height="10" fill="#900" />
</svg>
`;

const FALLBACK_IMAGE = `data:image/svg+xml;base64,${btoa(PLACEHOLDER_SVG)}`;

interface iTunesResult {
  artworkUrl100: string;
  previewUrl: string;
  trackName: string;
  artistName: string;
}

// Helper to normalize strings for comparison (remove spaces, lowercase)
const normalize = (str: string) => str.toLowerCase().replace(/\s/g, '').replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");

export async function enrichSongMetadata(song: Song): Promise<Song> {
  // If we already have a specific cover (not a placeholder) and preview, skip
  if (song.coverUrl && !song.coverUrl.includes('picsum') && !song.coverUrl.startsWith('data:image') && song.previewUrl) {
    return song;
  }

  try {
    const cleanArtist = song.artist.split(',')[0].trim(); // Take first artist
    // Search stricter: include artist name in query
    const query = `${cleanArtist} ${song.title}`;
    
    const params = new URLSearchParams({
      term: query,
      media: 'music',
      entity: 'song',
      limit: '5', // Fetch a few to check matches
      country: 'CN' 
    });

    const response = await fetch(`${ITUNES_API}?${params.toString()}`);
    const data = await response.json();

    if (data.resultCount > 0) {
      // STRICT MATCHING LOGIC
      // We iterate through results to find one where the artist name actually matches.
      // This prevents "Wang Yiling" searching returning a random pop song with same title.
      
      const targetArtist = normalize(cleanArtist);
      
      const validResult = data.results.find((res: iTunesResult) => {
          const resArtist = normalize(res.artistName);
          // Check if one contains the other (handles "Linkin Park" vs "Linkin Park (Band)" etc)
          return resArtist.includes(targetArtist) || targetArtist.includes(resArtist);
      });

      if (validResult) {
        const highResCover = validResult.artworkUrl100.replace('100x100bb', '600x600bb');
        return {
          ...song,
          coverUrl: highResCover,
          previewUrl: validResult.previewUrl
        };
      } else {
        console.warn(`iTunes found results for "${query}" but artist didn't match. Using fallback.`);
      }
    }
  } catch (error) {
    console.error(`Failed to fetch metadata for ${song.title}`, error);
  }

  // Fallback if not found or mismatch
  return {
    ...song,
    coverUrl: song.coverUrl || FALLBACK_IMAGE,
    previewUrl: undefined // Ensure it is undefined so UI knows to show "No Preview"
  };
}
