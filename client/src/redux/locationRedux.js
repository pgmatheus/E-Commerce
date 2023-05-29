import { createSlice } from "@reduxjs/toolkit";

export const locationSlice = createSlice({
  name: "location",
  initialState: {
    prev: [],
    curr: {
      currLocation: "/",
      currYScroll: 0,
    },
  },
  reducers: {
    addPrevLocation: (state, action) => {
      state.prev = action.payload;
    },
    addCurrentLocation: (state, action) => {
      state.curr = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addPrevLocation, addCurrentLocation } = locationSlice.actions;

export default locationSlice.reducer;
