import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRankListRequest } from "../../../api/request";

const initialState = {
  rankList: [],
  loading: true,
};

export const getRankListAsync = createAsyncThunk(
  "rank/getRankList",
  async () => {
    const res = await getRankListRequest();
    return res;
  }
);

export const rankSlice = createSlice({
  name: "rank",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getRankListAsync.pending, (state) => {})
      .addCase(getRankListAsync.fulfilled, (state, actions) => {
        state.loading = false;
        state.rankList = actions.payload.list;
      })
      .addCase(getRankListAsync.rejected, (state, actions) => {
        console.log("加载失败", actions.error);
      });
  },
});

export default rankSlice.reducer;
