import { memo, useEffect } from "react";
import Slider from "../../components/slider";
import RecommendList from "../../components/list";
import { Content } from "./style";
import Scroll from "../../baseUI/scroll/index";
import { getBannerListAsync, getRecommendListAsync } from "./store/slice";
import { useSelector, useDispatch } from "react-redux";
import { forceCheck } from "react-lazyload";
import Loading from "../../baseUI/loading/index";
import { Outlet } from "react-router-dom";

function Recommend() {
  const dispatch = useDispatch();
  const { bannerList, recommendList, loading } = useSelector(
    (state) => state.recommendReducer
  );
  const { playList } = useSelector((state) => state.playerReducer);

  useEffect(() => {
    if (!bannerList.length) {
      dispatch(getBannerListAsync());
    }
  }, [dispatch, bannerList]);

  useEffect(() => {
    if (!recommendList.length) {
      dispatch(getRecommendListAsync());
    }
  }, [dispatch, recommendList]);

  return (
    <Content play={playList}>
      <Scroll className="list" onScroll={forceCheck}>
        <div>
          <Slider bannerList={bannerList}></Slider>
          <RecommendList recommendList={recommendList}></RecommendList>
        </div>
      </Scroll>
      {loading ? <Loading></Loading> : null}
      <Outlet />
    </Content>
  );
}

export default memo(Recommend);
