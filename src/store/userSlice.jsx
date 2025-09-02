import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    data: null,
    loading: false,
    error: null,
    weeklyGoal: 5, // 👈 Default goal: 5 commits/week
  },
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setData: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    // ✅ Add this reducer
    setWeeklyGoal: (state, action) => {
      state.weeklyGoal = action.payload; // action.payload = number
    },
  },
});

// ✅ Now you can export it
export const { setLoading, setData, setError, setWeeklyGoal } = userSlice.actions;

export default userSlice.reducer;