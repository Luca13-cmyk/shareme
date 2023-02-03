import { create } from "zustand";
import { persist } from "zustand/middleware";

const authStore = (set) => ({
  user: null,
  addUser: (user) => set({ user }),
  removeUser: () => set({ user: null }),
});

const useAuthStore = create(
  persist(authStore, {
    name: "auth",
  })
);

export default useAuthStore;
