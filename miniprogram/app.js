//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'garbage-eflyw',
        traceUser: true,
      })
    }
    
    this.globalData = {
      /*
      region: [],
      detailed: '请选择城市',
      customItem: ["全部"],
      clas: 'ccc'*/
    }
    try {
      const e = wx.getSystemInfoSync()
      this.globalData.systemInfo = e;
      this.globalData.StatusBar = e.statusBarHeight;
      let custom = wx.getMenuButtonBoundingClientRect();
      this.globalData.Custom = custom;
      this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      let rank = wx.getStorageSync('rank');
      this.globalData.rank = rank > 0 ? rank : 10000;
      let points = wx.getStorageSync('points');
      this.globalData.points =  points > 0 ? points : 0;
    } catch (e) {
      // Do something when catch error
      wx.showToast({
        title: '程序初始化失败',
        icon: 'none'
      })
    }
    
  }
})
