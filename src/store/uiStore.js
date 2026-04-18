import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Persists ephemeral UI state that should survive page reloads —
 * specifically the active tab/mode for each chart panel.
 */
const useUiStore = create(
  persist(
    (set) => ({
      chartMode:    'score',   // GenreTrendChart: 'score' | 'members' | 'titles'
      momentumMode: 'score',   // GenreMomentum:   'score' | 'members' | 'titles'
      studioMode:   'score',   // StudioMomentum:  'score' | 'members'

      setChartMode:    (mode) => set({ chartMode: mode }),
      setMomentumMode: (mode) => set({ momentumMode: mode }),
      setStudioMode:   (mode) => set({ studioMode: mode }),
    }),
    { name: 'animepulse-ui-v1' }
  )
);

export default useUiStore;
