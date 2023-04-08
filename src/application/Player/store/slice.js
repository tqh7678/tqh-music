import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { playMode } from "./../../../api/config";
import { findIndex } from "../../../api/utils";
import { getSongDetailRequest } from "../../../api/request";

const initialState = {
  fullScreen: false, // 播放器是否为全屏模式
  playing: false, // 当前歌曲是否播放
  sequencePlayList: [], // 顺序列表 (因为之后会有随机模式，列表会乱序，因从拿这个保存顺序列表)
  playList: [],
  mode: playMode.sequence, // 播放模式
  currentIndex: -1, // 当前歌曲在播放列表的索引位置
  showPlayList: false, // 是否展示播放列表
  currentSong: {},
};

export const getSongDetailAsync = createAsyncThunk(
  "player/getSongDetail",
  async (id) => {
    const res = await getSongDetailRequest(id);
    const data = res.songs[0];
    return data;
  }
);

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    changeFullScreen(state, actions) {
      state.fullScreen = actions.payload;
    },
    changePlaying(state, actions) {
      state.playing = !state.playing;
    },
    changeSequencePlayList(state, actions) {
      state.sequencePlayList = actions.payload;
    },
    changePlayList(state, actions) {
      state.playList = actions.payload;
    },
    changeMode(state, actions) {
      state.mode = actions.payload;
    },
    changeCurrentIndex(state, actions) {
      state.currentIndex = actions.payload;
    },
    changeShowPlayList(state, actions) {
      state.showPlayList = actions.payload;
    },
    changeCurrentSong(state, actions) {
      state.currentSong = actions.payload;
    },
    deleteSong(state, actions) {
      const song = actions.payload;
      const fpIndex = findIndex(song, state.playList);
      state.playList = state.playList.splice(fpIndex, 1);
      const fsIndex = findIndex(song, state.sequencePlayList);
      state.sequencePlayList = state.sequencePlayList.splice(fsIndex, 1);
      if (fpIndex < state.currentIndex) state.currentIndex--;
    },
    deleteConfirmClear(state, actions) {
      state.playList = [];
      state.sequencePlayList = [];
      state.currentIndex = -1;
      state.showPlayList = false;
      state.currentSong = {};
      state.playing = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSongDetailAsync.pending, (state) => {})
      .addCase(getSongDetailAsync.fulfilled, (state, actions) => {
        const song = actions.payload;
        const fpIndex = findIndex(song, state.playList); // 看看有没有同款
        if (!state.playList.length && !state.sequencePlayList.length) {
          //播放列表没有歌曲
          state.playList = [song];
          state.sequencePlayList = [song];
          state.currentIndex = 0;
        }
        if (fpIndex === state.currentIndex) return; // 如果是当前歌曲直接不处理
        state.currentIndex++;
        state.playList.splice(state.currentIndex, 0, song); // 把歌放进去，放到当前播放曲目的下一个位置
        if (fpIndex > -1) {
          // 如果 oldSong 的索引在目前播放歌曲的索引小，那么删除它，同时当前 index 要减一
          if (state.currentIndex > fpIndex) {
            state.playList.splice(fpIndex, 1);
            state.currentIndex--;
          } else {
            // 否则直接删掉 oldSong
            state.playList.splice(fpIndex + 1, 1);
          }
        }
        const sequenceIndex =
          findIndex(
            state.playList[state.currentIndex],
            state.sequencePlayList
          ) + 1;
        const fsIndex = findIndex(song, state.sequencePlayList);
        state.sequencePlayList.splice(sequenceIndex, 0, song);
        if (fsIndex > -1) {
          // 如果 oldSong 的索引在目前播放歌曲的索引小，那么删除它，同时当前 index 要减一
          if (sequenceIndex > fsIndex) {
            state.sequencePlayList.splice(fsIndex, 1);
            state.sequencePlayList--;
          } else {
            // 否则直接删掉 oldSong
            state.sequencePlayList.splice(fsIndex + 1, 1);
          }
        }
      })
      .addCase(getSongDetailAsync.rejected, (state, actions) => {
        console.log("加载失败", actions.error);
      });
  },
});

export const {
  changeFullScreen,
  changePlaying,
  changeCurrentIndex,
  changeCurrentSong,
  changeMode,
  changePlayList,
  changeSequencePlayList,
  changeShowPlayList,
  deleteSong,
  deleteConfirmClear,
} = playerSlice.actions;
export default playerSlice.reducer;
