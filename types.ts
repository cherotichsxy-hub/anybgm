
export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  coverUrl: string; // If empty, will try to fetch
  previewUrl?: string; // URL for 30s audio clip
  description?: string;
}

export interface Episode {
  id: string;
  title: string;
  date: string;
  coverUrl: string;
  theme: string;
  linkUrl?: string; // Link to the podcast episode (e.g. Xiaoyuzhou)
  songs: Song[];
}

export enum ViewMode {
  ALBUMS = 'ALBUMS',     // Level 1: Browse Episodes (CD Rack)
  SONGS = 'SONGS',       // Level 2: Browse Songs (Gallery Wall)
  DETAIL = 'DETAIL'      // Level 3: Song Details (Discman View)
}
