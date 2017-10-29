const audioInfos = require('../../utils/audioInfos')

var app = getApp()
// list.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        messages:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.loadMoreAudios(0);
    },

    /**
     * 加载更多消息
     */
    loadMoreAudios: function (maxid) {

        if (app.globalData.fetchdataing == true) {
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
                var s = ['百度消息', '雷锋网', '加速会', '砍柴网', '猎云网', '亿欧网', '思路商道','央视消息', '科技头条', '江苏卫视']
                infos.forEach(function(info) {
                    var source = s[Math.floor(Math.random() * 10)]
                    info['source'] = source + "    " + Math.floor(Math.random() * 60) + "分钟前"
                }, this);
                this.setData({messages:this.data.messages.concat(infos)});
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

    TTSPage:function(){
        wx.navigateTo({
            url: '../Index/index',
            success: function(res){
                // success
            },
            fail: function() {
                // fail
            },
            complete: function() {
                // complete
            }
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
        this.loadMoreAudios(this.data.messages[this.data.messages.length - 1].audioid)        
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})