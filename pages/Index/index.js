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
        catalogs: [],
        currentShowIndex: 0,
        currentPlayIndex: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        })
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            app.globalData.userInfo = res.userInfo
                            this.setData({
                                userInfo: app.globalData.userInfo,
                                hasUserInfo: true
                            })

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (app.userInfoReadyCallback) {
                                app.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
        if (this.data.canIUse == false) {
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
     * 重新加载所有目录,本地内存状态需全部清空.程序第一次启动执行该方法
     */
    reloadAllCatalogsAudios: function (obj) {
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

                var mp3list = []
                if (this.data.currentShowIndex >= this.data.catalogs.length) {
                    console.error("当前的页currentShowIndex已经超出catalogs长度")
                } else {
                    mp3list = catalogs[this.data.currentShowIndex].results
                }
                if (wx.canIUse('getBackgroundAudioManager')) {
                    backgroundAudioManager.setMp3List(mp3list)
                    backgroundAudioManager.onAudioState()
                    backgroundAudioManager.setMonitorPlayState((state) => {

                        var catalogs = this.data.catalogs;
                        catalogs[this.data.currentPlayIndex].isplaying = state
                        that.setData({
                            catalogs: catalogs
                        })
                    })
                    backgroundAudioManager.setAudioSourceChangedCallback((audioInfo) => {
                        var catalogs = this.data.catalogs;
                        catalogs[this.data.currentPlayIndex].audioInfo = audioInfo
                        that.setData({
                            catalogs: catalogs
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

    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },

    /**
     * 重新加载最新消息
     */
    reloadNewestAudios: function (obj) {
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
    loadMoreAudios: function (maxid, didupdatedcallback) {

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

    pause: function (event) {

        //当前显示的 index
        var tapIndex = event.currentTarget.dataset.index
        // 当前正在播放音频
        backgroundAudioManager.audioPause()

        if (tapIndex != this.data.currentPlayIndex) {
            // reload newest data and reset audio sources
            this.checkAudioManagerSourceToIndex(tapIndex)
        }
    },

    play: function (event) {
        //当前不在播放音频
        var tapIndex = event.currentTarget.dataset.index
        if (tapIndex != this.data.currentPlayIndex) {
            // reload newest data and reset audio sources
            backgroundAudioManager.audioPause()
            this.checkAudioManagerSourceToIndex(tapIndex)
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

    checkAudioManagerSourceToIndex: function (index) {
        if (index >= this.data.catalogs.length) {
            console.error("index 超出当前类目范围")
            return
        }
        // backgroundAudioManager.setMp3List()
        wx.showLoading({
            title: '更新最新消息...',
        })
        audioInfos.fetchMoreAudios(this.data.catalogs[index].catalogid, 0, (infos) => {
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
                if (wx.canIUse('getBackgroundAudioManager')) {
                    backgroundAudioManager.setMp3List(infos)
                    this.setData({
                        currentPlayIndex: index
                    })
                    backgroundAudioManager.audioPlay(this.data.didSkipReaded)
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

    catalogChanged: function (event) {
        this.data.currentShowIndex = event.detail.current;
        wx.setNavigationBarTitle({
            title: this.data.catalogs[event.detail.current].catalog_name
        })
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