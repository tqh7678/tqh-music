import { memo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getRankListAsync } from "./store/slice";
import { filterIndex } from "../../api/utils";
import { List, ListItem, SongList, Container } from "./style";
import Scroll from "../../baseUI/scroll/index";
import { EnterLoading } from "./../Singers/style";
import Loading from "../../baseUI/loading";
import { Outlet } from "react-router";
import { useNavigate } from "react-router-dom";

function Rank() {
  const dispatch = useDispatch();
  const { rankList, loading } = useSelector((state) => state.rankReducer);
  const navigate = useNavigate();
  const { playList } = useSelector((state) => state.playerReducer);

  useEffect(() => {
    if (!rankList.length) {
      dispatch(getRankListAsync());
    }
  }, []);

  let globalStartIndex = filterIndex(rankList);
  let officialList = rankList.slice(0, globalStartIndex);
  let globalList = rankList.slice(globalStartIndex);

  const enterDetail = (name) => {
    navigate(`/rank/${name.id}`);
  };

  const renderSongList = (list) => {
    return list.length ? (
      <SongList>
        {list.map((item, index) => {
          return (
            <li key={index}>
              {index + 1}. {item.first} - {item.second}
            </li>
          );
        })}
      </SongList>
    ) : null;
  };

  // 这是渲染榜单列表函数，传入 global 变量来区分不同的布局方式
  const renderRankList = (list, global) => {
    return (
      <List globalRank={global}>
        {list.map((item) => {
          return (
            <ListItem
              key={item.coverImgId}
              tracks={item.tracks}
              onClick={() => enterDetail(item)}
            >
              <div className="img_wrapper">
                <img src={item.coverImgUrl} alt="" />
                <div className="decorate"></div>
                <span className="update_frequecy">{item.updateFrequency}</span>
              </div>
              {renderSongList(item.tracks)}
            </ListItem>
          );
        })}
      </List>
    );
  };

  let displayStyle = loading ? { display: "none" } : { display: "" };

  return (
    <Container play={playList}>
      <Scroll>
        <div>
          <h1 className="offical" style={displayStyle}>
            官方榜
          </h1>
          {renderRankList(officialList)}
          <h1 className="global" style={displayStyle}>
            全球榜
          </h1>
          {renderRankList(globalList, true)}
          {loading ? (
            <EnterLoading>
              <Loading></Loading>
            </EnterLoading>
          ) : null}
        </div>
      </Scroll>
      <Outlet />
    </Container>
  );
}

export default memo(Rank);
