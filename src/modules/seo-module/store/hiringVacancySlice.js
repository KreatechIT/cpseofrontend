import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  vacancies: null,
};

const hiringVacancySlice = createSlice({
  name: "hiringVacancy",
  initialState,
  reducers: {
    storeAllVacanciesData: (state, { payload }) => {
      state.vacancies = payload;
    },

    addVacancyData: (state, { payload }) => {
      state.vacancies?.unshift(payload);
    },

    editVacancyData: (state, { payload }) => {
      const index = state.vacancies.findIndex(
        (vacancy) => vacancy.id === payload.id
      );
      if (index !== -1) state.vacancies[index] = payload;
    },

    removeVacancyData: (state, { payload }) => {
      state.vacancies = state.vacancies.filter(
        (vacancy) => vacancy.id !== payload.id
      );
    },
  },
});

export const {
  storeAllVacanciesData,
  addVacancyData,
  editVacancyData,
  removeVacancyData,
} = hiringVacancySlice.actions;
export default hiringVacancySlice.reducer;
