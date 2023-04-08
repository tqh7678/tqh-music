import { memo, useEffect, useState } from "react";
import Horizon from "../../baseUI/horizon-item";
import { categoryTypes, alphaTypes, categoryMap } from "../../api/config";
import { NavContainer, List, ListItem, ListContainer } from "./style";
import Scroll from "../../baseUI/scroll";
import {
  getSingerList,
  getHotSingerList,
  refreshMoreSingerList,
  refreshMoreHotSingerList,
  changePageCount,
  changePullDownLoading,
  changePullUpLoading,
  changeEnterLoading,
} from "./store/slice";
import { useSelector, useDispatch } from "react-redux";
import LazyLoad, { forceCheck } from "react-lazyload";
import Loading from "../../baseUI/loading";
import { Outlet } from "react-router";
import { useNavigate } from "react-router-dom";

function Singers() {
  let [category, setCategory] = useState(
    //缓存
    sessionStorage.getItem("tqh_category") || ""
  );
  let [alpha, setAlpha] = useState(sessionStorage.getItem("tqh_alpha") || "");

  const dispatch = useDispatch();
  const {
    singerList,
    enterLoading,
    pullUpLoading,
    pullDownLoading,
    pageCount,
  } = useSelector((state) => state.singerReducer);
  const navigate = useNavigate();
  const { playList } = useSelector((state) => state.playerReducer);

  useEffect(() => {
    if (!singerList.length) {
      dispatch(getHotSingerList());
    }
  }, []);

  let handleUpdateAlpha = (val) => {
    setAlpha(val);
    sessionStorage.setItem("tqh_alpha", val);
    const type = categoryMap.get(category).type;
    const area = categoryMap.get(category).area;
    const obj = { type: type, area: area, alpha: val };
    dispatch(changePageCount(0));
    dispatch(changeEnterLoading(true));
    dispatch(getSingerList(obj));
  };

  let handleUpdateCatetory = (val) => {
    setCategory(val);
    sessionStorage.setItem("tqh_category", val);
    const type = categoryMap.get(val).type;
    const area = categoryMap.get(val).area;
    const obj = { type: type, area: area, alpha: alpha };
    dispatch(changePageCount(0));
    dispatch(changeEnterLoading(true));
    dispatch(getSingerList(obj));
  };

  const handlePullUp = () => {
    dispatch(changePullUpLoading(true));
    dispatch(changePageCount(pageCount + 1));
    if (category === "") {
      dispatch(refreshMoreHotSingerList(pageCount + 1));
    } else {
      const type = categoryMap.get(category).type;
      const area = categoryMap.get(category).area;
      const obj = {
        type: type,
        area: area,
        alpha: alpha,
        offset: pageCount + 1,
      };
      dispatch(refreshMoreSingerList(obj));
    }
  };

  //顶部下拉
  const handlePullDown = () => {
    dispatch(changePageCount(0));
    dispatch(changePullDownLoading(true));
    if (category === "" && alpha === "") {
      dispatch(getHotSingerList());
    } else {
      const type = categoryMap.get(category).type;
      const area = categoryMap.get(category).area;
      const obj = { type: type, area: area, alpha: alpha };
      dispatch(getSingerList(obj));
    }
  };

  const enterDetail = (id) => {
    navigate(`/singers/${id}`);
  };

  const renderSingerList = () => {
    return (
      <List>
        {singerList?.map((item, index) => {
          return (
            <ListItem
              key={item.accountId + "" + index}
              onClick={() => enterDetail(item.id)}
            >
              <div className="img_wrapper">
                <LazyLoad
                  placeholder={
                    <img
                      width="100%"
                      height="100%"
                      src={require("./singer.png")}
                      alt="music"
                    />
                  }
                >
                  <img
                    src={`${item.picUrl}?param=300x300`}
                    width="100%"
                    height="100%"
                    alt="music"
                  />
                </LazyLoad>
              </div>
              <span className="name">{item.name}</span>
            </ListItem>
          );
        })}
      </List>
    );
  };

  return (
    <div>
      <NavContainer>
        <Horizon
          list={categoryTypes}
          title={"分类 (默认热门):"}
          handleClick={(val) => handleUpdateCatetory(val)}
          oldVal={category}
        ></Horizon>
        <Horizon
          list={alphaTypes}
          title={"首字母:"}
          handleClick={(val) => handleUpdateAlpha(val)}
          oldVal={alpha}
        ></Horizon>
      </NavContainer>
      <ListContainer play={playList}>
        <Scroll
          pullUp={handlePullUp}
          pullDown={handlePullDown}
          pullUpLoading={pullUpLoading}
          pullDownLoading={pullDownLoading}
          onScroll={forceCheck}
        >
          {renderSingerList()}
        </Scroll>
        {enterLoading ? <Loading></Loading> : null}
      </ListContainer>
      <Outlet />
    </div>
  );
}

export default memo(Singers);
