var app = getApp()

var host ="https://api.lila-info.com"
// var host = "http://127.0.0.1:3000"

const fetchMoreAudios = (catalogid, maxid, callback) => {
    var data = {}
    data.maxid = maxid
    data.catalogid = catalogid
    var url = host + "/api/news_wx"
    wx.request({
        url:  url,
        data: data,
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success:(res) => {
            if (res.data.message="ok") {
                callback(res.data.results)
            } else {
                callback(null)
            }
        },
        fail:(res) => {
            callback(null)
            try {
                console.error(res)
            } catch (error) {
                console.error(error)
            }
        },
        complete: () => {
            app.globalData.fetchdataing = false
        }
    })
    // callback(JSON.parse(infos))
}

const reloadAllCatalogsAudios = (callback) => {
    
        app.globalData.fetchdataing = true
        var url = host + "/api/catalog_wx"
        wx.request({
            url:  url,
            success:(res) => {
                if (res.data.message="ok") {
                    callback(res.data.catalogs)
                } else {
                    callback(null)
                }
            },
            fail:(res) => {
                callback(null)
                try {
                    console.error(res)
                } catch (error) {
                    console.error(error)
                }
            },
            complete: () => {
                app.globalData.fetchdataing = false
            }
        })
    }

module.exports = {
    fetchMoreAudios: fetchMoreAudios,
    reloadAllCatalogsAudios:reloadAllCatalogsAudios
}