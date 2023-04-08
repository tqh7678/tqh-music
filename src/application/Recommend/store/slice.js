import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getBannerRequest,
  getRecommendListRequest,
} from "../../../api/request";

const initialState = {
  bannerList: [],
  recommendList: [],
  loading: false,
};

export const getBannerListAsync = createAsyncThunk(
  "recommend/getBannerList",
  async () => {
    const res = await getBannerRequest();
    return res; // 此处的返回结果会在 .fulfilled中作为payload的值
  }
);

export const getRecommendListAsync = createAsyncThunk(
  "recommend/getRecommendList",
  async () => {
    const res = await getRecommendListRequest();
    return res;
  }
);

export const recommendSlice = createSlice({
  name: "recommend", // 命名空间，在调用action的时候会默认的设置为action的前缀,保证唯一.不重名
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBannerListAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBannerListAsync.fulfilled, (state, actions) => {
        state.loading = false;
        state.bannerList = actions.payload.banners;
      })
      .addCase(getBannerListAsync.rejected, (state, actions) => {
        state.loading = false;
        console.log(__filename, "请求错误", actions.error);
      });

    builder
      .addCase(getRecommendListAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRecommendListAsync.fulfilled, (state, actions) => {
        state.loading = false;
        state.recommendList = actions.payload.result;
      })
      .addCase(getRecommendListAsync.rejected, (state, actions) => {
        state.loading = false;
        console.log(__filename, "请求错误", actions.error);
      });
  },
});

export default recommendSlice.reducer;
