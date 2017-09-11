var playing = false
var playList = {}
var playIndex = 0;
var _changePlayStateCallback = null

const setMp3List = (mp3List) => {
    console.log("getlist...")
    playList = mp3List
}

const audioPlay = (didSkipReaded) => {

    const backgroundAudioManager = wx.getBackgroundAudioManager()
    backgroundAudioManager.play()
    changePlayState(true)
    backPlay(didSkipReaded)
}

const setMonitorPlayState = (changePlayStateCallback) => {
    _changePlayStateCallback = changePlayStateCallback
}

const changePlayState =(state) =>{
    playing = state
    if (_changePlayStateCallback != null) {
        _changePlayStateCallback(playing)
    }
}

const audioPause = () => {

    const backgroundAudioManager = wx.getBackgroundAudioManager()
    backgroundAudioManager.pause()
    changePlayState(false)
}

const backPlay = (didSkipReaded) => {
    if (playIndex >= playList.length) {
        console.error("playIndex 超出了playList,需要加载新数据")
        //todo 加载更多数据
        return
    }
    wx.showLoading({
        title: '正在努力准备..',
    })
    var audioinfo = playList[playIndex]
    const backgroundAudioManager = wx.getBackgroundAudioManager()
    backgroundAudioManager.title = audioinfo.title
    // backgroundAudioManager.epname = ""
    // backgroundAudioManager.singer = that.data.singer
    backgroundAudioManager.coverImgUrl = audioinfo.image
    backgroundAudioManager.src = audioinfo.src
    changePlayState(true);
}

const nextOne = (didSkipReaded) => {

    playIndex = playIndex + 1;
    console.log("next one。。");
    console.log("playIndex:" + playIndex)
    //todo: 设置下一首音频
    backPlay(`didSkipReaded`);
}

const prevOne = (didSkipReaded) => {

    playIndex = playIndex - 1;
    console.log("prev one。。");
    console.log("playIndex:" + playIndex)
    //todo: 设置下一首音频
    backPlay(didSkipReaded);
}

const onAudioState = () => {
    console.log("开始监听音乐播放状态...");

    wx.onBackgroundAudioPlay(function () {
        // 当 wx.playBackgroundAudio() 执行时触发
        // 改变 coverImg 和 播放状态
        changePlayState(true)
        // dingshiqi();
        wx.hideLoading();
        console.log("on play");
    });
    wx.onBackgroundAudioPause(function () {
        // 当 wx.pauseBackgroundAudio() 执行时触发
        // 仅改变 播放状态
        changePlayState(false)
        console.log("on pause");
    });
    wx.onBackgroundAudioStop(function () {
        // 当 音乐自行播放结束时触发
        // 改变 coverImg 和 播放状态
        changePlayState(false)
        console.log("on stop");
    });
    const backgroundAudioManager = wx.getBackgroundAudioManager()
    backgroundAudioManager.onPrev(function () {
        prevOne();
    });
    backgroundAudioManager.onNext(function () {
        nextOne();
    });
    backgroundAudioManager.onEnded(function () {
        nextOne();
    });
    backgroundAudioManager.onCanplay(function () {
        wx.hideLoading();
        console.log("可以播放了。");
    });
}

const formatTime = (seconds) => {
    var min = Math.floor(seconds / 60),
        second = seconds % 60,
        hour, newMin, time;

    if (min > 60) {
        hour = Math.floor(min / 60);
        newMin = min % 60;
    }
    if (second < 10) {
        second = '0' + second;
    }
    if (min < 10) {
        min = '0' + min;
    }

    return time = hour ? (hour + ':' + newMin + ':' + second) : (min + ':' + second);
}

module.exports = {
    setMp3List:setMp3List,
    audioPlay:audioPlay,
    audioPause:audioPause,
    nextOne:nextOne,
    prevOne:prevOne,
    onAudioState:onAudioState,
    setMonitorPlayState
}