import { memo, useEffect, useRef, useState } from "react";
import MiniPlayer from "./miniPlayer";
import NormalPlayer from "./normalPlayer";
import {
  changeFullScreen,
  changePlaying,
  changeCurrentIndex,
  changeCurrentSong,
  changeMode,
  changePlayList,
  // changeSequencePlayList,
  changeShowPlayList,
} from "./store/slice";
import { useSelector, useDispatch } from "react-redux";
import { getSongUrl, isEmptyObject, shuffle, findIndex } from "../../api/utils";
import Toast from "./../../baseUI/toast/index";
import { playMode } from "../../api/config";
import PlayList from "./play-list";
import { getLyricRequest } from "../../api/request";
import Lyric from "./../../api/lyric-parser";

function Player(props) {
  const [currentTime, setCurrentTime] = useState(0); //目前播放时间
  const [duration, setDuration] = useState(0); //歌曲总时长
  let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration; //歌曲播放进度
  const [preSong, setPreSong] = useState({}); //记录当前的歌曲，以便于下次重渲染时比对是否是一首歌
  const [modeText, setModeText] = useState("");
  const [currentPlayingLyric, setPlayingLyric] = useState("");
  const songReady = useRef(true);
  const dispatch = useDispatch();
  const {
    fullScreen,
    playing,
    sequencePlayList,
    playList,
    mode,
    currentIndex,
    // showPlayList,
    currentSong,
  } = useSelector((state) => state.playerReducer);
  const audioRef = useRef();
  const toastRef = useRef();
  const currentLyric = useRef();
  const currentLineNum = useRef(0);

  useEffect(() => {
    if (
      !playList.length ||
      currentIndex === -1 ||
      !playList[currentIndex] ||
      // playList[currentIndex].id === preSong.id ||
      !songReady.current
    )
      return;
    let current = playList[currentIndex];
    setPreSong(current);
    songReady.current = false;
    dispatch(changeCurrentSong(current));
    audioRef.current.src = getSongUrl(current.id);
    setTimeout(() => {
      audioRef.current.play().then(() => {
        songReady.current = true;
      });
    });
    if (!playing) dispatch(changePlaying());
    getLyric(current.id);
    setCurrentTime(0); //从头开始播放
    setDuration((current.dt / 1000) | 0); //时长
  }, [playList, currentIndex]);

  useEffect(() => {
    playing ? audioRef.current.play() : audioRef.current.pause();
  }, [playing]);

  const handleLyric = ({ lineNum, txt }) => {
    if (!currentLyric.current) return;
    currentLineNum.current = lineNum;
    setPlayingLyric(txt);
  };

  const getLyric = (id) => {
    let lyric = "";
    if (currentLyric.current) {
      currentLyric.current.stop();
    }
    // 避免 songReady 恒为 false 的情况
    getLyricRequest(id)
      .then((data) => {
        lyric = data.lrc.lyric;
        if (!lyric) {
          currentLyric.current = null;
          return;
        }
        currentLyric.current = new Lyric(lyric, handleLyric);
        currentLyric.current.play();
        currentLineNum.current = 0;
        currentLyric.current.seek(0);
      })
      .catch(() => {
        songReady.current = true;
        audioRef.current.play();
      });
  };

  const updateMode = () => {
    let newMode = (mode + 1) % 3;
    if (newMode === 0) {
      //顺序模式
      dispatch(changePlayList(sequencePlayList));
      let index = findIndex(currentSong, sequencePlayList);
      dispatch(changeCurrentIndex(index));
      setModeText("顺序循环");
    } else if (newMode === 1) {
      //单曲循环
      dispatch(changePlayList(sequencePlayList));
      setModeText("单曲循环");
    } else if (newMode === 2) {
      //随机播放
      let newList = shuffle(sequencePlayList);
      let index = findIndex(currentSong, newList);
      dispatch(changePlayList(newList));
      dispatch(changeCurrentIndex(index));
      setModeText("随机播放");
    }
    dispatch(changeMode(newMode));
    toastRef.current.show();
  };

  //一首歌循环
  const handleLoop = () => {
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  };

  const handlePrev = () => {
    //播放列表只有一首歌时单曲循环
    if (playList.length === 1) {
      handleLoop();
      return;
    }
    let index = currentIndex - 1;
    if (index < 0) index = playList.length - 1;
    if (!playing) dispatch(changePlaying());
    dispatch(changeCurrentIndex(index));
  };

  const handleNext = () => {
    //播放列表只有一首歌时单曲循环
    if (playList.length === 1) {
      handleLoop();
      return;
    }
    let index = currentIndex + 1;
    if (index === playList.length) index = 0;
    if (!playing) dispatch(changePlaying());
    dispatch(changeCurrentIndex(index));
  };

  const toggleFullScreen = (bool) => {
    dispatch(changeFullScreen(bool));
  };

  const toggleShowPlayList = (bool) => {
    dispatch(changeShowPlayList(bool));
  };

  const clickPlaying = (e) => {
    e.stopPropagation();
    dispatch(changePlaying());
    if (currentLyric.current) {
      currentLyric.current.togglePlay(currentTime * 1000);
    }
  };

  const updateTime = (e) => {
    setCurrentTime(e.target.currentTime);
  };

  const onProgressChange = (curPercent) => {
    const newTime = curPercent * duration;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
    if (!playing) {
      dispatch(changePlaying());
    }
    if (currentLyric.current) {
      currentLyric.current.seek(newTime * 1000);
    }
  };

  const handleEnd = () => {
    if (mode === playMode.loop) {
      handleLoop();
    } else {
      handleNext();
    }
  };

  const handleError = () => {
    alert("播放出错");
    handleNext();
  };

  return (
    <div>
      {isEmptyObject(currentSong) ? null : (
        <MiniPlayer
          song={currentSong}
          fullScreen={fullScreen}
          playing={playing}
          toggleFullScreen={toggleFullScreen}
          clickPlaying={clickPlaying}
          percent={percent}
          toggleShowPlayList={toggleShowPlayList}
        />
      )}
      {isEmptyObject(currentSong) ? null : (
        <NormalPlayer
          song={currentSong}
          fullScreen={fullScreen}
          playing={playing}
          toggleFullScreen={toggleFullScreen}
          clickPlaying={clickPlaying}
          percent={percent}
          duration={duration} //总时长
          currentTime={currentTime} //播放时间
          onProgressChange={onProgressChange}
          handlePrev={handlePrev}
          handleNext={handleNext}
          mode={mode}
          updateMode={updateMode}
          toggleShowPlayList={toggleShowPlayList}
          currentLyric={currentLyric.current}
          currentPlayingLyric={currentPlayingLyric}
          currentLineNum={currentLineNum.current}
        />
      )}

      <audio
        ref={audioRef}
        onTimeUpdate={updateTime}
        onEnded={handleEnd}
        onError={handleError}
      ></audio>
      <PlayList></PlayList>
      <Toast text={modeText} ref={toastRef}></Toast>
    </div>
  );
}

export default memo(Player);
