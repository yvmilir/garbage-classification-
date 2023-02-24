// miniprogram/pages/testmenu/testmenu.js
var app = getApp();
var systemInfo = app.globalData.systemInfo;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    toppic: [{
      name: 'low',
      content: '低级',
      checked: true
    }, {
      name: 'middle',
      content: '中级',
      checked: false
    }, {
      name: 'high',
      content: '高级',
      checked: false
    }],
    rank: app.globalData.rank,
    points: app.globalData.points,
    windowHeight: systemInfo.windowHeight,
    level: 'low',
    levelname: '低级'
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  radioChange: function(e) {
    // console.log(e);
    switch (e.detail.value) {
      case "low":
        this.setData({
          levelname: '低级'
        });
        break;
      case "middle":
        this.setData({
          levelname: '中级'
        });
        break;
      case "high":
        this.setData({
          levelname: '高级'
        });
        break;
      default:
        this.setData({
          levelname: '低级'
        });
        wx.showToast({
          title: '错误:E01X00001',
          icon: 'none'
        })
        break;
    }
    this.updateData();
  },
  startTest: function(e) {
    let that = this;
    wx.navigateTo({
      url: '/pages/test/test?level=' + this.data.levelname,
    events: {
        // 为指定事件添加一个监听器
        acceptDataFromOpenedPage: function(e) {
          that.updateData();
        }
      },
      success: function(res) {}
    })
    // wx.navigateTo({
    //   url: '/pages/test/test?level=' + this.data.levelname,
    //   success: function(res) {},
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })
  },
updateData:function(){
  let rank = wx.getStorageSync('rank');
  let points = wx.getStorageSync('points');
  this.setData({
    rank: rank > 0 ? rank : 10000,
    points: points > 0 ? points : 0
  });
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(app.globalData);
    console.log('页面加载');
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log('页面出现');
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
 
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})