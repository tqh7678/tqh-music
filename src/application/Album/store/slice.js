import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAlbumDetailRequest } from "../../../api/request";

const initialState = {
  currentAlbum: {},
  enterLoading: false,
};

export const getAlbumDetailAsync = createAsyncThunk(
  "album/getAlbumDetail",
  async (id) => {
    const res = await getAlbumDetailRequest(id.id);
    return res;
  }
);

export const albumSlice = createSlice({
  name: "album",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getAlbumDetailAsync.pending, (state) => {
        state.enterLoading = true;
      })
      .addCase(getAlbumDetailAsync.fulfilled, (state, actions) => {
        state.enterLoading = false;
        state.currentAlbum = actions.payload.playlist;
      })
      .addCase(getAlbumDetailAsync.rejected, (state, actions) => {
        console.log("加载失败", actions.error);
      });
  },
});

export default albumSlice.reducer;
