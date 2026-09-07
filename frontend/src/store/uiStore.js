import { create } from 'zustand';

/**
 * Ephemeral client UI state — sidebar collapse, active modal, toast queue.
 * Not persisted; resets on refresh by design.
 */
export const useUiStore = create((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  activeModal: null,
  openModal: (name) => set({ activeModal: name }),
  closeModal: () => set({ activeModal: null }),
}));
