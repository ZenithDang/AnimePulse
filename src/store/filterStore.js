import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const SEASONS = ['winter', 'spring', 'summer', 'fall'];

export function getCurrentSeason() {
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
const DEFAULT_FORMAT  = 'TV';

export { defaultStart, defaultEnd, DEFAULT_GENRES, DEFAULT_FORMAT };

const useFilterStore = create(
  persist(
    (set, get) => ({
      startSeason:          defaultStart.season,
      startYear:            defaultStart.year,
      endSeason:            defaultEnd.season,
      endYear:              defaultEnd.year,
      selectedGenres:       DEFAULT_GENRES,
      format:               DEFAULT_FORMAT,
      includeCurrentSeason: false,
      fullData:             false,

      setStartSeason:    (season) => set({ startSeason: season }),
      setStartYear:      (year)   => set({ startYear: year }),
      setEndSeason:      (season) => set({ endSeason: season }),
      setEndYear:        (year)   => set({ endYear: year }),
      setFormat:         (format) => set({ format }),

      toggleCurrentSeason: () =>
        set((s) => ({ includeCurrentSeason: !s.includeCurrentSeason })),

      toggleFullData: () =>
        set((s) => ({ fullData: !s.fullData })),

      toggleGenre: (genre) => {
        const { selectedGenres } = get();
        if (selectedGenres.includes(genre)) {
          set({ selectedGenres: selectedGenres.filter((g) => g !== genre) });
        } else {
          set({ selectedGenres: [...selectedGenres, genre] });
        }
      },

      setSelectedGenres: (genres) => set({ selectedGenres: genres }),

      resetFilters: () => set({
        startSeason:          defaultStart.season,
        startYear:            defaultStart.year,
        endSeason:            defaultEnd.season,
        endYear:              defaultEnd.year,
        selectedGenres:       DEFAULT_GENRES,
        format:               DEFAULT_FORMAT,
        includeCurrentSeason: false,
        fullData:             false,
      }),

      /** Returns ordered list of { season, year } in the current range.
       *  Accepts optional overrides so callers can pass debounced values. */
      getSeasonRange: (ss, sy, es, ey) => {
        const state      = get();
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
        }

        // Append current in-progress season when toggled on
        if (state.includeCurrentSeason) {
          const curSeason = getCurrentSeason();
          const curYear   = new Date().getFullYear();
          const last      = result[result.length - 1];
          if (!last || last.year !== curYear || last.season !== curSeason) {
            result.push({ season: curSeason, year: curYear });
          }
        }

        return result;
      },
    }),
    {
      name:       'animepulse-filters-v1',
      version:    1,
      partialize: (state) => ({
        startSeason:          state.startSeason,
        startYear:            state.startYear,
        endSeason:            state.endSeason,
        endYear:              state.endYear,
        selectedGenres:       state.selectedGenres,
        format:               state.format,
        includeCurrentSeason: state.includeCurrentSeason,
        fullData:             state.fullData,
      }),
    }
  )
);

export default useFilterStore;
