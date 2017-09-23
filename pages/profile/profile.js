//index.js
//获取应用实例
const app = getApp()

Page({


    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    onLoad: function () {

    },
    readdoc: function () {
        wx.getClipboardData({
            success: function (res) {
                // console.log(res.data)
                var links = pitchLinkFromContent(res.data)
            }
        })

        function pitchLinkFromContent(content) {
            str = /(http:\/\/|https:\/\/|www)((\S)+)/g
            return content.match(str)
        }
    }
})