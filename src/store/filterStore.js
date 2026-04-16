import { create } from 'zustand';

const SEASONS = ['winter', 'spring', 'summer', 'fall'];

/** Get the current season based on month */
function getCurrentSeason() {
  const month = new Date().getMonth() + 1; // 1-12
  if (month <= 3) return 'winter';
  if (month <= 6) return 'spring';
  if (month <= 9) return 'summer';
  return 'fall';
}

/** Get last N seasons before (but not including) the current one */
function getDefaultRange(n = 6) {
  const currentYear   = new Date().getFullYear();
  const currentSeason = getCurrentSeason();
  const currentIdx    = SEASONS.indexOf(currentSeason);

  const seasons = [];
  let idx  = currentIdx;
  let year = currentYear;

  // Step back one from current to start at last complete season
  idx--;
  if (idx < 0) { idx = 3; year--; }

  for (let i = 0; i < n; i++) {
    seasons.unshift({ season: SEASONS[idx], year });
    idx--;
    if (idx < 0) { idx = 3; year--; }
  }

  return seasons;
}

const defaultRange    = getDefaultRange(6);
const defaultStart    = defaultRange[0];
const defaultEnd      = defaultRange[defaultRange.length - 1];
const DEFAULT_GENRES  = ['Action', 'Comedy', 'Fantasy', 'Romance', 'Drama'];

const useFilterStore = create((set, get) => ({
  startSeason:    defaultStart.season,
  startYear:      defaultStart.year,
  endSeason:      defaultEnd.season,
  endYear:        defaultEnd.year,
  selectedGenres: DEFAULT_GENRES,
  format:         'TV',

  setStartSeason:    (season) => set({ startSeason: season }),
  setStartYear:      (year)   => set({ startYear: year }),
  setEndSeason:      (season) => set({ endSeason: season }),
  setEndYear:        (year)   => set({ endYear: year }),
  setFormat:         (format) => set({ format }),

  toggleGenre: (genre) => {
    const { selectedGenres } = get();
    if (selectedGenres.includes(genre)) {
      set({ selectedGenres: selectedGenres.filter((g) => g !== genre) });
    } else {
      set({ selectedGenres: [...selectedGenres, genre] });
    }
  },

  setSelectedGenres: (genres) => set({ selectedGenres: genres }),

  /** Returns ordered list of { season, year } in the current range.
   *  Accepts optional overrides so callers can pass debounced values. */
  getSeasonRange: (ss, sy, es, ey) => {
    const state = get();
    const startSeason = ss ?? state.startSeason;
    const startYear   = sy ?? state.startYear;
    const endSeason   = es ?? state.endSeason;
    const endYear     = ey ?? state.endYear;
    const result = [];

    let year   = startYear;
    let idx    = SEASONS.indexOf(startSeason);
    const endIdx = SEASONS.indexOf(endSeason);

    while (year < endYear || (year === endYear && idx <= endIdx)) {
      result.push({ season: SEASONS[idx], year });
      idx++;
      if (idx >= SEASONS.length) { idx = 0; year++; }
      // Safety cap
      if (result.length > 24) break;
    }

    return result;
  },
}));

export { SEASONS };
export default useFilterStore;
