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
        isplaying: false,
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }

        this.reloadNewestAudios(this)
    },

    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },

    /**
     * 重新加载最新消息
     */
    reloadNewestAudios: (obj) => {
        const that = obj
        wx.showLoading({
            title: '更新最新消息...',
        })
        audioInfos.fetchMoreAudios(1, 0, (infos) => {
            if (infos != null) {
                if (infos.length <= 0) {
                    console.log("没有更多消息")
                    wx.hideLoading();
                    wx.showToast({
                        title: '太棒了,无所不知,无所不能的你已经阅完所有消息了',
                        icon: 'loading',
                        duration: 2000
                    })
                    return
                }
                that.setData({
                    audioInfo: infos[0]
                })
                if (wx.canIUse('getBackgroundAudioManager')) {
                    backgroundAudioManager.setMp3List(infos)
                    backgroundAudioManager.onAudioState()
                    backgroundAudioManager.setMonitorPlayState((state) => {
                        that.setData({
                            isplaying: state
                        })
                    })
                    backgroundAudioManager.setAudioSourceChangedCallback((audioInfo) => {
                        that.setData({
                            audioInfo: audioInfo
                        })
                    })
                    backgroundAudioManager.setNeedMoreSourceDelegate((maxid, didupdatedcallback) => {
                        that.loadMoreAudios(maxid, didupdatedcallback);
                    })
                }
                wx.hideLoading();
            } else {
                console.error("加载最新消息失败")
                wx.hideLoading();
                wx.showToast({
                    title: '道路太拥堵,消息更新失败了',
                    icon: 'loading',
                    duration: 2000
                })
            }
        })
    },


    /**
     * 加载更多消息
     */
    loadMoreAudios: (maxid, didupdatedcallback) => {

        if (app.globalData.fetchdataing == true) {
            didupdatedcallback([])
            return
        }
        wx.showLoading({
            title: '更新最多消息...',
        })
        audioInfos.fetchMoreAudios(1, maxid, (infos) => {
            if (infos != null) {
                if (infos.length <= 0) {
                    console.log("没有更多消息")
                    wx.hideLoading();
                    wx.showToast({
                        title: '太棒了,无所不知,无所不能的您已经阅完所有消息了',
                        icon: 'loading',
                        duration: 2000
                    })
                    return
                }
                didupdatedcallback(infos)
                wx.hideLoading();
            } else {
                console.error("加载最新消息失败")
                wx.hideLoading();
                wx.showToast({
                    title: '道路太拥堵,消息更新失败了',
                    icon: 'loading',
                    duration: 2000
                })
            }
        })
    },

    getUserInfo: function (e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },

    play: function (e) {
        if (this.data.isplaying) {
            backgroundAudioManager.audioPause()
        } else {
            backgroundAudioManager.audioPlay(this.data.didSkipReaded)
        }
    },

    playNextAudio: function (e) {
        backgroundAudioManager.nextOne(this.data.didSkipReaded)
    },

    playPreAudio: function (e) {
        backgroundAudioManager.prevOne(false)
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