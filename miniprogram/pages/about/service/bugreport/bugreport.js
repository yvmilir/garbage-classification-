// miniprogram/pages/about/service/bugreport/bugreport.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getInput_name: null,
    getInput_time: null,
    getInput_doing: null
  },
  getInput_name: function (e) {
    this.data.getInput_name = e.detail.value;
    console.log(this.data.getInput_name);
    wx.showToast({
      title: '数据已保存',
      icon: "none"
    })
  },
  getInput_time: function (e) {
    this.data.getInput_time = e.detail.value;
    console.log(this.data.getInput_time);
    wx.showToast({
      title: '数据已保存',
      icon: "none"
    })
  },
  getInput_doing: function (e) {
    this.data.getInput_doing = e.detail.value;
    console.log(this.data.getInput_doing);
    wx.showToast({
      title: '数据已保存',
      icon: "none"
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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