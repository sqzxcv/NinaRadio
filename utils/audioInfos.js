var app = getApp()
var fetchdataing = app.globalData.fetchdataing
/**
 * @param  {} currentId 当前播放的 id, 如果为-1则返回数组第一个音频
 * @param  {} audioArr
 * @param  {} didSkipReaded 是否跳过已经播放的内容
 */
const findNextAudio = (currentId, audioArr, didSkipReaded) => {

    if (currentId == -1) {
        if (audioArr.length != 0) {
            return audioArr[0]
        } else {
            console.warn("audioArr.length = 0")
            return null
        }
    }
    if (currentId !== undefined) {
        var didFindCurrent = false
        var nextElement = null
        for (var index = 0; index < audioArr.length; index++) {
            var element = audioArr[index];
            if (didSkipReaded) {
                if (didFindCurrent && element.doc_id != currentId && didPlayedAudio(element.doc_id) == false) {
                    nextElement = element
                    if (index < audioArr.length - 3 && fetchdataing == false) {
                        //将播放倒数第三个,自动请求新数据
                        // fetchNewsData()
                    }
                    break
                }
            } else {
                if (didFindCurrent && element.doc_id != currentId) {
                    nextElement = element
                    if (index < audioArr.length - 3 && fetchdataing == false) {
                        //将播放倒数第三个,自动请求新数据
                        // fetchNewsData()
                    }
                    break
                }
            }
            if (element.doc_id == currentId) {
                didFindCurrent = true
            }
        }
        if (nextElement == null && fetchdataing == false) {
            // fetchNewsData()
        }
        return nextElement
    } else {
        alert("audioPlayingId = undefined")
        return null
    }
}

const fetchAudioInfos = (catalogid, maxid, callback) => {
    var infos = `[{"doc_id":116798,"catalog_name":"科技","audio":"3f213e5e-09e2-41a1-9799-90e21796c2ae.mp3","news_id":"efd53f3c-a0e7-4a55-9095-23b9f11a9028","title":"[36氪]App Store史上最大规模升级 下个月即将发布","image":"b49af009-aaed-4dd9-abae-ce319bc83517.jpg","duration":0,"catalog_id":"f5cff467-2d78-4656-9b72-8e064c373874","news_time":1503756467,"summary":"","text":"","tags":"苹果","source":"","hot":0,"collect_time":1505051988,"catalogid":1},{"doc_id":116797,"catalog_name":"科技","audio":"49ab7630-ad31-49fd-866a-b65cf34b5547.mp3","news_id":"baa37359-2596-4464-848f-4b145bfc3b43","title":"[新浪新闻]国家网信办: 10月1日施行未实名用户将不得跟帖评论","image":"5d5e559f-816a-4759-bb98-899329246ed0.jpg","duration":0,"catalog_id":"f5cff467-2d78-4656-9b72-8e064c373874","news_time":1503756503,"summary":"","text":"","tags":"论坛，贴吧","source":"","hot":0,"collect_time":1505051088,"catalogid":1},{"doc_id":116796,"catalog_name":"科技","audio":"1efd7ff0-6c0f-4813-8f6a-b209c18fd4c5.mp3","news_id":"8cb17d0e-4880-4e82-aea6-b70b056ea631","title":"[腾讯科技]27亿美金罚单之后 欧盟将对谷歌展开新一轮反垄断调查","image":"3d62df67-5171-4eaf-b806-4bd81fc4c0d4.jpg","duration":0,"catalog_id":"f5cff467-2d78-4656-9b72-8e064c373874","news_time":1503876908,"summary":"","text":"","tags":"谷歌","source":"","hot":0,"collect_time":1505050188,"catalogid":1},{"doc_id":116795,"catalog_name":"科技","audio":"7ef40d10-99b9-4cb6-b18c-584fc1631c56.mp3","news_id":"d285d231-9841-4560-a1cb-5d504a04a669","title":"[36氪]易到重新开放司机提现 韬蕴资本称和乐视还没办完股权交割","image":"31aa782b-f12b-4496-80d1-a98fc7cc0347.jpg","duration":0,"catalog_id":"f5cff467-2d78-4656-9b72-8e064c373874","news_time":1503876924,"summary":"","text":"","tags":"易到，乐视","source":"","hot":0,"collect_time":1505049288,"catalogid":1},{"doc_id":116794,"catalog_name":"科技","audio":"9d8fa697-8454-484b-ac12-5b873cc36e2d.mp3","news_id":"b0b3b2a4-59b6-42c0-9e89-64c21103e35f","title":"[江苏卫视]目前人工智能模式与其资本价值不符","image":"24e9d34d-369b-40e0-b99c-45812c0c7507.jpg","duration":0,"catalog_id":"f5cff467-2d78-4656-9b72-8e064c373874","news_time":1503895813,"summary":"","text":"","tags":"人工智能","source":"","hot":0,"collect_time":1505048388,"catalogid":1},{"doc_id":116793,"catalog_name":"科技","audio":"9c99d416-7ef2-4626-bfc6-a697037cfc5c.mp3","news_id":"41a9ec04-20ee-42bb-95b8-cdc815144ed0","title":"[凤凰科技]支付宝闲置账号一年未登录被注销","image":"766f6fe1-6a3b-459c-9a5c-aa98df9da756.jpg","duration":0,"catalog_id":"f5cff467-2d78-4656-9b72-8e064c373874","news_time":1503904056,"summary":"","text":"","tags":"支付宝","source":"","hot":0,"collect_time":1505047488,"catalogid":1},{"doc_id":116792,"catalog_name":"科技","audio":"3fb33c52-8e3d-4ab7-8c3b-d2ad32abf9fd.mp3","news_id":"9cde60ab-914b-46f7-9def-9a71a66e63b4","title":"[36氪]Uber今日投票选 CEO 关键人选却在此时宣布退出","image":"3dd77e0f-b33b-49cc-8e41-803b4800c082.jpg","duration":0,"catalog_id":"f5cff467-2d78-4656-9b72-8e064c373874","news_time":1503907606,"summary":"","text":"","tags":"Uber","source":"","hot":0,"collect_time":1505046588,"catalogid":1},{"doc_id":116791,"catalog_name":"科技","audio":"247b86da-7050-496f-ad90-d0287c230ae7.mp3","news_id":"013f2126-f1aa-4a5e-a613-d7441c320773","title":"[36氪]京东拟申请在北京南六环试点无人机送快递","image":"30471ef0-1e48-4db6-9c6f-06c0c4f406e2.jpg","duration":0,"catalog_id":"f5cff467-2d78-4656-9b72-8e064c373874","news_time":1503908569,"summary":"","text":"","tags":"京东","source":"","hot":0,"collect_time":1505045688,"catalogid":1},{"doc_id":116790,"catalog_name":"科技","audio":"e134a3ed-ecbd-4015-a1a7-ea67b7d8e435.mp3","news_id":"b94d80a5-0bfe-4d35-be07-d48a16d4c276","title":"[36氪]摩拜单车+三星Galaxy Note8=新的解锁姿势","image":"d7c7aeba-c992-47e4-8e2b-9cc7f5c332cc.jpg","duration":0,"catalog_id":"f5cff467-2d78-4656-9b72-8e064c373874","news_time":1503909724,"summary":"","text":"","tags":"摩拜，三星","source":"","hot":0,"collect_time":1505044788,"catalogid":1},{"doc_id":116789,"catalog_name":"科技","audio":"66bec7a1-f540-4c64-9902-d08495383199.mp3","news_id":"61f0c571-29cd-458c-9702-80bd2b9bbafd","title":"[36氪]刚刚落幕的腾讯QGC夏季赛 能否助推移动电竞生态?","image":"76dc2e55-68c6-4737-9e86-6d2498dfb003.jpg","duration":0,"catalog_id":"f5cff467-2d78-4656-9b72-8e064c373874","news_time":1503964069,"summary":"","text":"","tags":"腾讯，电竞","source":"","hot":0,"collect_time":1505043888,"catalogid":1}]`
    callback(JSON.parse(infos))
}

module.exports = {
    fetchAudioInfos: fetchAudioInfos,
    findNextAudio: findNextAudio
}