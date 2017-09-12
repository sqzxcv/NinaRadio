// pages/Index/index.js

const util = require('../../utils/util.js')
const audioInfos = require('../../utils/audioInfos')
const backgroundAudioManager = require("../../utils/backgroundAudioManager")

var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        audioInfo: {
            title: "[江苏卫视]目前人工智能模式与其资本价值不符",
        },
        didSkipReaded: true,
        isplaying:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        audioInfos.fetchAudioInfos(1, 0, (infos) => {
            app.globalData.audioInfos = infos
            var audioInfo = audioInfos.findNextAudio(-1, app.globalData.audioInfos, true)
            if (audioInfo) {
                this.setData({
                    audioInfo: audioInfo
                })

                if (wx.canIUse('getBackgroundAudioManager')) {
                    var mp3list = []
                    for (var index = 0; index < app.globalData.audioInfos.length; index++) {
                        var audioinfo = app.globalData.audioInfos[index];
                        var mp3 = {}
                        mp3.title = audioinfo.title
                        mp3.image = "http://image.leting.io/" + audioinfo.image
                        mp3.src = "http://audio.leting.io/" + audioinfo.audio
                        mp3list.push(mp3)
                    }
                    backgroundAudioManager.setMp3List(mp3list)
                    backgroundAudioManager.onAudioState()
                    backgroundAudioManager.setMonitorPlayState((state) =>{
                        this.setData({isplaying:state})
                    })
                    //backgroundAudioManager.audioPlay(true)
                }
            }
        })
    },

    tuodong: function (e) {
        var newwz = e.detail.value;
        var duration =this.data.duration;
        var position = newwz*duration/100;
        const backgroundAudioManager = wx.getBackgroundAudioManager()

        backgroundAudioManager.seek(position)
        console.log(position);


    },

    play:function(e) {
        if (this.data.isplaying ) {
            backgroundAudioManager.audioPause()
        } else {
            backgroundAudioManager.audioPlay(this.data.didSkipReaded)
        }
    },

    playNextAudio:function(e) {
        backgroundAudioManager.nextOne(this.data.didSkipReaded)
    },

    playPreAudio:function(e) {
        backgroundAudioManager.prevOne(this.data.didSkipReaded)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})