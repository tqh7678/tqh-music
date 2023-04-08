import { memo } from "react";
import { List, ListItem, ListWrapper } from "./style";
import { getCount } from "../../api/utils";
import LazyLoad from "react-lazyload";
import { useNavigate } from "react-router-dom";

function RecommendList(props) {
  const navigate = useNavigate();

  const enterDetail = (id) => {
    navigate(`/recommend/${id}`);
  };

  return (
    <ListWrapper>
      <h1 className="title">推荐歌单</h1>
      <List>
        {props.recommendList?.map((item, index) => {
          return (
            <ListItem key={item.id} onClick={() => enterDetail(item.id)}>
              <div className="img_wrapper">
                <div className="decorate"></div>
                {/* 视口内显示真实资源，视口外显示占位资源 */}
                <LazyLoad
                  placeholder={
                    <img
                      height="100%"
                      width="100%"
                      src={require("./music.png").default}
                      alt="music"
                    />
                  }
                >
                  <img
                    src={item.picUrl + "?param=300x300"}
                    width="100%"
                    height="100%"
                    alt="music"
                  />
                </LazyLoad>
                <div className="play_count">
                  <i className="iconfont play">&#xe885;</i>
                  <span className="count">{getCount(item.playCount)}</span>
                </div>
              </div>
              <div className="desc">{item.name}</div>
            </ListItem>
          );
        })}
      </List>
    </ListWrapper>
  );
}

export default memo(RecommendList);
