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
    // ✅ FIXED: This was the problem - missing action parameter handling
    setLoading: (state, action) => {
      state.loading = action.payload !== undefined ? action.payload : true;
      state.error = null;
      console.log("🔄 Redux: setLoading", state.loading);
    },
    setData: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
      console.log("✅ Redux: setData received:", {
        username: action.payload?.username,
        totalCommits: action.payload?.totalCommits,
        streak: action.payload?.streak,
      });
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      console.log("❌ Redux: setError", action.payload);
    },
    // ✅ Add this reducer
    setWeeklyGoal: (state, action) => {
      state.weeklyGoal = action.payload; // action.payload = number
    },
    clearData: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
});

// ✅ Export actions
export const { setLoading, setData, setError, setWeeklyGoal, clearData } = userSlice.actions;

export default userSlice.reducer;