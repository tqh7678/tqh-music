import { memo, useState, useRef, useEffect, useCallback } from "react";
import { Container, Menu, TopDesc } from "./style";
import { CSSTransition } from "react-transition-group";
import { useNavigate, useParams } from "react-router";
import Header from "./../../baseUI/header/index";
import Scroll from "../../baseUI/scroll/index";
import { getCount, isEmptyObject } from "./../../api/utils";
import style from "../../assets/global-style";
import { HEADER_HEIGHT } from "./../../api/config";
import { getAlbumDetailAsync } from "./store/slice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../baseUI/loading/index";
import MusicNote from "../../baseUI/music-note/index";
import SongsList from "../SongList";

function Album() {
  const [showStatus, setShowStatus] = useState(true);
  const [title, setTitle] = useState("歌单");
  const [isMarquee, setIsMarquee] = useState(false); // 是否跑马灯
  const headerEl = useRef();
  const navigate = useNavigate();
  const id = useParams();
  const dispatch = useDispatch();
  const { currentAlbum, enterLoading } = useSelector(
    (state) => state.albumReducer
  );
  const musicNoteRef = useRef();
  const { playList } = useSelector((state) => state.playerReducer);

  useEffect(() => {
    dispatch(getAlbumDetailAsync(id));
  }, [dispatch, id]);

  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({ x, y });
  };

  const renderTopDesc = () => {
    return (
      <TopDesc background={currentAlbum.coverImgUrl}>
        <div className="background">
          <div className="filter"></div>
        </div>
        <div className="img_wrapper">
          <div className="decorate"></div>
          <img src={currentAlbum.coverImgUrl} alt="" />
          <div className="play_count">
            <i className="iconfont play">&#xe885;</i>
            <span className="count">
              {getCount(currentAlbum.subscribedCount)}
            </span>
          </div>
        </div>
        <div className="desc_wrapper">
          <div className="title">{currentAlbum.name}</div>
          <div className="person">
            <div className="avatar">
              <img src={currentAlbum.creator.avatarUrl} alt="" />
            </div>
            <div className="name">{currentAlbum.creator.nickname}</div>
          </div>
        </div>
      </TopDesc>
    );
  };

  const renderMenu = () => {
    return (
      <Menu>
        <div>
          <i className="iconfont">&#xe6ad;</i>
          评论
        </div>
        <div>
          <i className="iconfont">&#xe86f;</i>
          点赞
        </div>
        <div>
          <i className="iconfont">&#xe62d;</i>
          收藏
        </div>
        <div>
          <i className="iconfont">&#xe606;</i>
          更多
        </div>
      </Menu>
    );
  };

  // const renderSongList = () => {
  //   return (
  //     <SongList>
  //       <div className="first_line">
  //         <div className="play_all">
  //           <i className="iconfont">&#xe6e3;</i>
  //           <span>
  //             播放全部{" "}
  //             <span className="sum">(共{currentAlbum.tracks.length}首)</span>
  //           </span>
  //         </div>
  //         <div className="add_list">
  //           <i className="iconfont">&#xe62d;</i>
  //           <span>收藏({getCount(currentAlbum.subscribedCount)})</span>
  //         </div>
  //       </div>
  //       <SongItem>
  //         {currentAlbum.tracks.map((item, index) => {
  //           return (
  //             <li key={index}>
  //               <span className="index">{index + 1}</span>
  //               <div className="info">
  //                 <span>{item.name}</span>
  //                 <span>
  //                   {getName(item.ar)} - {item.al.name}
  //                 </span>
  //               </div>
  //             </li>
  //           );
  //         })}
  //       </SongItem>
  //     </SongList>
  //   );
  // };

  const handleBack = useCallback(() => {
    setShowStatus(false);
  }, []);

  const handleScroll = useCallback(
    (pos) => {
      let minScrollY = -HEADER_HEIGHT;
      let percent = Math.abs(pos.y / minScrollY);
      let headerDom = headerEl.current;
      // 滑过顶部的高度开始变化
      if (pos.y < minScrollY) {
        headerDom.style.backgroundColor = style["theme-color"];
        headerDom.style.opacity = Math.min(1, (percent - 1) / 2);
        setTitle(currentAlbum.name);
        setIsMarquee(true);
      } else {
        headerDom.style.backgroundColor = "";
        headerDom.style.opacity = 1;
        setTitle("歌单");
        setIsMarquee(false);
      }
    },
    [currentAlbum]
  );

  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={() => navigate(-1)}
    >
      <Container play={playList}>
        <Header
          ref={headerEl}
          title={title}
          handleClick={handleBack}
          isMarquee={isMarquee}
        ></Header>
        {!isEmptyObject(currentAlbum) ? (
          <Scroll bounceTop={false} onScroll={handleScroll}>
            <div>
              {renderTopDesc()}
              {renderMenu()}
              <SongsList
                songs={currentAlbum.tracks}
                collectCount={currentAlbum.subscribedCount}
                showCollect={true}
                showBackground={true}
                musicAnimation={musicAnimation}
              ></SongsList>
            </div>
          </Scroll>
        ) : null}
        {enterLoading ? <Loading></Loading> : null}
        <MusicNote ref={musicNoteRef}></MusicNote>
      </Container>
    </CSSTransition>
  );
}

export default memo(Album);
