var app = getApp();
Page({
  data: {
    PageCur: 'search'
  },
  NavChange(e) {
    console.log(e.currentTarget.dataset.cur)
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    });
  },
  onshow:function(){
    app.globalData.rank = wx.getStorageSync('rank');
  },
  onShareAppMessage() {
    return {
      title: '垃圾垃圾去哪里',
      imageUrl: '/images/logo.jpg',
      path: '/pages/index/index'
    }
  },
})