var playing = false
var playList = {}
var playIndex = 0;
var _changePlayStateCallback = null;
var _audioSourceChangedCallback = null;
/**
 * _needMoreSourceDelegate(maxid, didupdatedcallback) 保护两个参数：
 * maxid: playlist列表中最后一个音频的audioid
 * didupdatedcallback(newMp3list) 在数据更新成功后的回调函数，该回调函数包含一个参数
 * newMp3list:更新的音频列表，newMp3list加到playlist最后
 */
var _needMoreSourceDelegate = null

const setMp3List = (mp3List) => {
    console.log("getlist...")
    playList = mp3List
}

const audioPlay = (didSkipReaded) => {

    const backgroundAudioManager = wx.getBackgroundAudioManager()
    backgroundAudioManager.play()
    changePlayState(true)
    if (didSkipReaded) {
        playNextUnreadAudio(-1)
    } else {
        backPlay(didSkipReaded)
    }
}

const setMonitorPlayState = (changePlayStateCallback) => {
    _changePlayStateCallback = changePlayStateCallback
}

const setAudioSourceChangedCallback = (audioSourceChangedCallback) => {
    _audioSourceChangedCallback = audioSourceChangedCallback
}

const changePlayState = (state) => {
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
        if (_needMoreSourceDelegate) {
            _needMoreSourceDelegate(playList[playList.length-1].audioid, (newMp3list) => {
                playList = playList.concat(newMp3list)
            });
        }
        return
    }
    wx.showLoading({
        title: '正在努力准备..',
    })

    var audioinfo = playList[playIndex]
    const backgroundAudioManager = wx.getBackgroundAudioManager()
    backgroundAudioManager.title = audioinfo.title
    // backgroundAudioManager.epname = ""
    backgroundAudioManager.singer = audioinfo.catalog_name
    backgroundAudioManager.coverImgUrl = audioinfo.image
    backgroundAudioManager.src = audioinfo.src
    changePlayState(true);
    if (_audioSourceChangedCallback) {
        _audioSourceChangedCallback(audioinfo)
    }
}

const nextOne = (didSkipReaded) => {

    if (didSkipReaded) {
        playNextUnreadAudio(playIndex)
    } else {
        console.log("next one。。");
        console.log("playIndex:" + playIndex)
        backPlay(didSkipReaded);
    }
}

const playNextUnreadAudio = (startIndex) => {
    
        //自动跳过已经播放的新闻
        playIndex = startIndex
        while (1) {
            playIndex = playIndex + 1;
            if (playIndex > playList.length - 3) {
                if (_needMoreSourceDelegate) {
                    _needMoreSourceDelegate(playList[playList.length-1].audioid, (newMp3list) => {
                        playList = playList.concat(newMp3list)
                    });
                }
            }
            if (playIndex < playList.length) {
                if (didPlayedAudio(playList[playIndex].audioid) == false) {
                    break
                }
            } else {
                playIndex = playList.length - 1
                console.log("所有消息都已播放")
                wx.showToast({
                    title: '所有消息都已播放,请拉去最新内容',
                    icon: 'loading',
                    duration: 2000
                })
                break
            }
        }
        console.log("next one。。");
        console.log("playIndex:" + playIndex)
        backPlay(true);
    }

const prevOne = (didSkipReaded) => {

    // 返回上一首,则清楚当前音频的播放记录
    deleteFromStorageWithAudioId(playList[playIndex].audioid)
    playIndex = playIndex - 1;
    if (playIndex >= 0) {
        console.log("prev one。。");
        console.log("playIndex:" + playIndex)
        backPlay(didSkipReaded);
    } else {
        playIndex = 0;
        console.log("返回到第一首")
        wx.showToast({
            title: '已经是第一首',
            icon: 'loading',
            duration: 2000
        })
    }
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
        try {
            recodPlayerId(playList[playIndex].audioid)
        } catch (error) {
            console.error(error)
        }
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
    // backgroundAudioManager.onTimeUpdate(function() {

    // })
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

const recodPlayerId = (audioid) => {
    try {
        var localRecord = wx.getStorageSync("localplayed_record") || {}
        localRecord[audioid] = new Date().getTime();
        wx.setStorageSync('localplayed_record', localRecord)
    } catch (error) {
        console.error(error)
    }
}

const deleteFromStorageWithAudioId = (audioid) => {
    try {
        var localRecord = wx.getStorageSync("localplayed_record")
        // localRecord = JSON.parse(localRecord)
        delete localRecord[audioid]
        wx.setStorageSync('localplayed_record', localRecord)
    } catch (error) {
        console.error(error)
    }
}

const didPlayedAudio = (audioid) => {
    try {
        var localRecord = wx.getStorageSync("localplayed_record") || {}
        if (localRecord) {
            // localRecord = JSON.parse(localRecord)
            if (localRecord[audioid] > 0) {
                return true
            }
        }
    } catch (error) {
        console.error(error)
    }
    return false
}

const setNeedMoreSourceDelegate =(needMoreSourceDelegate) => {
    _needMoreSourceDelegate = needMoreSourceDelegate
}

module.exports = {
    setMp3List: setMp3List,
    audioPlay: audioPlay,
    audioPause: audioPause,
    nextOne: nextOne,
    prevOne: prevOne,
    onAudioState: onAudioState,
    setMonitorPlayState,
    manager: wx.getBackgroundAudioManager(),
    setAudioSourceChangedCallback:setAudioSourceChangedCallback,
    setNeedMoreSourceDelegate:setNeedMoreSourceDelegate
}