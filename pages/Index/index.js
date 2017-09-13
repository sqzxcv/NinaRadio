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
        didSkipReaded: true,
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        catalogs:[]
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

        this.reloadAllCatalogsAudios(this)
    },

        /**
     * 重新加载所有目录
     */
    reloadAllCatalogsAudios: function(obj) {
        const that = obj
        wx.showLoading({
            title: '更新最新消息...',
        })
        audioInfos.reloadAllCatalogsAudios((catalogs) => {
            if (catalogs != null) {
                if (catalogs.length <= 0) {
                    console.log("没有更多消息")
                    wx.hideLoading();
                    wx.showToast({
                        title: '太棒了,无所不知,无所不能的你已经阅完所有消息了',
                        icon: 'loading',
                        duration: 2000
                    })
                    return
                }
                var localCatalogs = that.data.catalogs
                for (var index = 0; index < catalogs.length; index++) {
                    var catalog = catalogs[index];
                    var localCatalog = null
                    for (var j = 0; j < localCatalogs.length; j++) {
                        var element = localCatalogs[j];
                        if (catalog.catalogid == element.catalogid) {
                            localCatalog = element
                            break
                        }
                    }
                    catalogs[index].isplaying = false
                    catalogs[index].audioInfo = catalog.results[0] 
                }
                that.setData({
                    catalogs: catalogs
                })

                //todo
                // var mp3list = []
                // if (currentShowIndex >= this.data.catalogs.length) {
                //     console.error("当前的页currentShowIndex已经超出catalogs长度")
                // } else {
                //     mp3list = catalogs[currentShowIndex].results
                // }
                // if (wx.canIUse('getBackgroundAudioManager')) {
                //     backgroundAudioManager.setMp3List(mp3list)
                //     backgroundAudioManager.onAudioState()
                //     backgroundAudioManager.setMonitorPlayState((state) => {
                        
                //         that.setData({
                //             isplaying: state
                //         })
                //     })
                //     backgroundAudioManager.setAudioSourceChangedCallback((audioInfo) => {
                //         that.setData({
                //             audioInfo: audioInfo
                //         })
                //     })
                //     backgroundAudioManager.setNeedMoreSourceDelegate((maxid, didupdatedcallback) => {
                //         that.loadMoreAudios(maxid, didupdatedcallback);
                //     })
                // }
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

    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },

    /**
     * 重新加载最新消息
     */
    reloadNewestAudios: function(obj) {
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
    loadMoreAudios: function(maxid, didupdatedcallback) {

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