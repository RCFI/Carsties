import { create } from "zustand";

type State = {
  pageNumber: number;
  pageSize: number;
  pageCount: number;
  searchTerm: string;
  searchValue: string;
  orderBy: string;
  filterBy: string;
};

type Actions = {
  setParams: (params: Partial<State>) => void;
  reset: () => void;
  setSearchValue: (nextValue: string) => void;
};

const initialState: State = {
  pageNumber: 1,
  pageSize: 12,
  pageCount: 1,
  searchTerm: "",
  searchValue: "",
  orderBy: "make",
  filterBy: "live"
};

export const useParamsStore = create<State & Actions>()((set) => ({
  ...initialState,
  setParams: (params) =>
    set((state) => {
      if (params.pageNumber) {
        return { ...state, pageNumber: params.pageNumber };
      } else {
        return { ...state, ...params, pageNumber: 1 };
      }
    }),
  reset: () => set(initialState),
  setSearchValue: (nextValue: string) => set({ searchValue: nextValue }),
}));
