// miniprogram/pages/about/option/region/region.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    region: [],
    detailed: '请选择城市',
    customItem: ["全部"],
    clas: 'ccc',
  },
  
 
  bindRegionChange: function (e) {
    var that = this
    //为了让选择框有个默认值，
    that.setData({
      clas: ''
    })
    　　　//下拉框所选择的值
    console.log(e.detail.value)
    this.setData({
      //拼的字符串传后台
      detailed: e.detail.value[0] + "," + e.detail.value[1] + "," + e.detail.value[2],
      //下拉框选中的值
      region: e.detail.value
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