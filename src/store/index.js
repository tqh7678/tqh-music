import { configureStore } from "@reduxjs/toolkit";
import recommendSlice from "../application/Recommend/store/slice";
import singerSlice from "../application/Singers/store/slice";
import rankSlice from "../application/Rank/store/slice";
import albumSlice from "../application/Album/store/slice";
import singerInfoSlice from "../application/Singer/store/slice";
import playerSlice from "../application/Player/store/slice";
import searchSlice from "../application/Search/store/slice";

const store = configureStore({
  reducer: {
    recommendReducer: recommendSlice,
    singerReducer: singerSlice,
    rankReducer: rankSlice,
    albumReducer: albumSlice,
    singerInfoReducer: singerInfoSlice,
    playerReducer: playerSlice,
    searchReducer: searchSlice,
  },
}); //configureStore已经配置好了thunk

export default store;
