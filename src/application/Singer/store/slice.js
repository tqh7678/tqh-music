import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getSingerInfoRequest } from "../../../api/request";

const initialState = {
  artist: {},
  songsOfArtist: [],
  loading: true,
};

export const getSingerInfoAsync = createAsyncThunk(
  "singer/getSingerInfo",
  async (id) => {
    const res = await getSingerInfoRequest(id.id);
    // console.log(res);
    return res;
  }
);

export const singerInfoSlice = createSlice({
  name: "singer",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getSingerInfoAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSingerInfoAsync.fulfilled, (state, actions) => {
        state.loading = false;
        state.artist = actions.payload.artist;
        state.songsOfArtist = actions.payload.hotSongs;
      })
      .addCase(getSingerInfoAsync.rejected, (state, actions) => {
        console.log("加载失败", actions.error);
      });
  },
});

export default singerInfoSlice.reducer;
