import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getHotSingerListRequest,
  getSingerListRequest,
} from "../../../api/request";

const initialState = {
  singerList: [],
  enterLoading: true, //控制进场Loading
  pullUpLoading: false, //控制上拉加载动画
  pullDownLoading: false, //控制下拉加载动画
  pageCount: 0, //这里是当前页数，我们即将实现分页功能
};

//第一次加载热门歌手
export const getHotSingerList = createAsyncThunk(
  "singers/getHotSingerList",
  async () => {
    const res = await getHotSingerListRequest(0);
    return res;
  }
);

//加载更多热门歌手
export const refreshMoreHotSingerList = createAsyncThunk(
  "singers/refreshMoreHotSingerList",
  async (pageCount) => {
    console.log(pageCount);
    const res = await getHotSingerListRequest(pageCount);
    console.log(res);
    return res;
  }
);

//第一次加载对应类别的歌手
export const getSingerList = createAsyncThunk(
  "singers/getSingerList",
  async (obj) => {
    console.log(obj);
    const res = await getSingerListRequest(obj.type, obj.area, obj.alpha, 0);
    return res;
  }
);

//加载更多歌手
export const refreshMoreSingerList = createAsyncThunk(
  "singers/refreshMoreSingerList",
  async (obj) => {
    console.log(obj.offset);
    const res = await getSingerListRequest(
      obj.type,
      obj.area,
      obj.alpha,
      obj.offset
    );
    console.log(res);
    return res;
  }
);

export const singerSlice = createSlice({
  name: "singers",
  initialState,
  reducers: {
    changeSingerList(state, actions) {
      state.singerList = actions.payload;
    },
    changePageCount(state, actions) {
      state.pageCount = actions.payload;
    },
    changeEnterLoading(state, actions) {
      state.enterLoading = actions.payload;
    },
    changePullUpLoading(state, actions) {
      state.pullUpLoading = actions.payload;
    },
    changePullDownLoading(state, actions) {
      state.pullDownLoading = actions.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getHotSingerList.pending, (state) => {})
      .addCase(getHotSingerList.fulfilled, (state, actions) => {
        state.singerList = actions.payload.artists;
        state.enterLoading = false;
        state.pullDownLoading = false;
      })
      .addCase(getHotSingerList.rejected, (state, actions) => {
        console.log("热门歌手数据获取失败", actions.error);
      });

    builder
      .addCase(refreshMoreHotSingerList.pending, (state) => {})
      .addCase(refreshMoreHotSingerList.fulfilled, (state, actions) => {
        state.singerList = [...state.singerList, ...actions.payload.artists];
        state.pullUpLoading = false;
      })
      .addCase(refreshMoreHotSingerList.rejected, (state, actions) => {
        console.log("热门歌手数据获取失败", actions.error);
      });

    builder
      .addCase(getSingerList.pending, (state) => {})
      .addCase(getSingerList.fulfilled, (state, actions) => {
        state.singerList = actions.payload.artists;
        state.enterLoading = false;
        state.pullDownLoading = false;
      })
      .addCase(getSingerList.rejected, (state, actions) => {
        console.log("歌手数据获取失败", actions.error);
      });

    builder
      .addCase(refreshMoreSingerList.pending, (state) => {})
      .addCase(refreshMoreSingerList.fulfilled, (state, actions) => {
        state.singerList = [...state.singerList, ...actions.payload.artists];
        state.pullUpLoading = false;
      })
      .addCase(refreshMoreSingerList.rejected, (state, actions) => {
        console.log("歌手数据获取失败", actions.error);
      });
  },
});

export const {
  changeEnterLoading,
  changePageCount,
  changePullDownLoading,
  changePullUpLoading,
  changeSingerList,
} = singerSlice.actions;

export default singerSlice.reducer;
