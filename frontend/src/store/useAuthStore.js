import { create } from "zustand";

const useAuthStore = create((set) => ({
  token: localStorage.getItem("token") || null,
  first_name: localStorage.getItem("first_name") || "", // Add first_name here
  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },
  setFirstName: (first_name) => {
    localStorage.setItem("first_name", first_name); // Update localStorage
    set({ first_name }); // Update Zustand state
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("first_name");
    set({ token: null, first_name: "" });
  },
}));

export default useAuthStore;
