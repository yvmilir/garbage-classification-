// miniprogram/pages/test/test.js
var app = getApp();
var systemInfo = app.globalData.systemInfo;
var _testService = require("../../util/testService.js");
var touchDot = 0; //触摸时的原点 
var time = 0; // 时间记录，用于滑动时且时间小于1s则执行左右滑动 
var interval = ""; // 记录/清理时间记录 
var touchRight = false; //记录向右滑动
var touchLeft = false; //记录向左滑动
var noAnswerList = new Array(); //用来记录未完成的答题
var total_micro_second; //这是倒计时
var hadPostAnswer = false; //用来记录是否已经判卷
var levelNumber = 1;//答题难度等级,低级积分为1,中级积分为2,高级积分为3
var eventChannel;
/* 毫秒级倒计时 */
function countdown(that) {
  _testService.dateformat(total_micro_second, function(second) {
    // 渲染倒计时时钟
    that.setData({
      clock: second //格式化时间
    });
  });
  if (total_micro_second <= 0) {
    that.setData({
      clock: "0"
    });
    // timeout则跳出递归
    that.postAnswer();
    return;
  }
  if (total_micro_second <= 30000) {
    if (total_micro_second <= 10000) {
      that.setData({
        timeColor: "red"
      });
      //把颜色修改为红色
    }else{
      that.setData({
        timeColor: "yellow"
      });
    //把颜色修改为黄色
    }
  }
  //settimeout实现倒计时效果
  setTimeout(function() {
    // 放在最后--
    total_micro_second -= 10;
    countdown(that);
  }, 10);
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: systemInfo.windowWidth,
    // margintTop: (systemInfo.windowHeight - app.globalData.CustomBar - 450) / 3,
    height: systemInfo.windowHeight - app.globalData.CustomBar - app.globalData.StatusBar,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    currentTopicNum: 1, //当前答题序号
    limitTime: 60, //初始答题时间
    clock: 60, //剩余答题时间
    timeColor: 'green', //时间条的颜色
    answer: [{
      name: '可回收物',
      id: 1
    }, {
      name: '有害垃圾',
      id: 2
    }, {
      name: '湿垃圾',
      id: 3
    }, {
      name: '干垃圾',
      id: 4
    }]
  },

  //=================选择答案的点击动作函数
  chooseAnswer: function(e) {
    // console.log(e);
    let that = this;
    that.setData({
      animation: 'fade'
    });
    let _currentTopic = that.data.currentTopic;
    _currentTopic.answer = e.currentTarget.id;
    _currentTopic.answerTag = true;
    that.setData({
      currentTopic: _currentTopic
    });
    that.updateTopic(that.data.currentTopicNum - 1, _currentTopic); //更新题目数据
    setTimeout(async function() {
      await that.setData({
        animation: ''
      });
      that.nextPage();
    }, 800);
    if(that.data.currentTopicNum > 9){//当前题目为第10题时检查是否全部已答题.如果是提醒是否直接交卷
      if (that.checkTopic()){
        wx.showModal({
          title: '提示',
          content: '已完成所有答题,是否直接获取结果?',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              that.postAnswer();
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        });
      }
    }else{
      console.log('没有答完题');
    }
  },

  //==========分页动作相关函数
  choosePage: function(e) { //点击某一页的行为
    // console.log(e);
    let that = this;
    this.setData({
      currentTopicNum: e.currentTarget.id,
      currentTopic: this.data.topic[e.currentTarget.id - 1],
      anotherOne: 'slide-bottom'
    });
    setTimeout(function() {
      that.setData({
        anotherOne: ''
      })
    }, 800);
  },
  nextPage: function(e) { //点击下一页
    // console.log(e)
    let that = this;
    if (this.data.currentTopicNum < 10) {
      this.setData({
        currentTopicNum: Number(this.data.currentTopicNum) + 1,
        currentTopic: this.data.topic[Number(this.data.currentTopicNum)],
        anotherOne: 'slide-right'
      });
      setTimeout(function() {
        that.setData({
          anotherOne: ''
        })
      }, 800);
    } else { //检查一下是否已完成答题,完成的话就交卷,没有完成则提示跳到为完成的题目
    }

  },
  previousPage: function(e) { //点击上一页
    //console.log(e)
    let that = this;
    if (this.data.currentTopicNum > 1) {
      this.setData({
        currentTopicNum: Number(this.data.currentTopicNum) - 1,
        currentTopic: this.data.topic[Number(this.data.currentTopicNum) - 2],
        anotherOne: 'slide-left'
      });
      setTimeout(function() {
        that.setData({
          anotherOne: ''
        })
      }, 800);
    } else {
      wx.showToast({
        title: '已经返回到第一题',
        icon: 'none'
      })
    }
  },

  //==========滑动事件相关函数

  // 触摸开始事件 
  touchStart: function(e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点 
    // 使用js计时器记录时间  
    interval = setInterval(function() {
      time++;
    }, 100);
  },
  // 触摸移动事件 
  touchMove: function(e) {
    var touchMove = e.touches[0].pageX;
    //console.log("touchMove:" + touchMove + " touchDot:" + touchDot + " diff:" + (touchMove - touchDot));
    // 向左滑动  
    if (touchMove - touchDot <= -40 && time < 10) {
      touchLeft = true;
      touchRight = false;
    }
    // 向右滑动 
    if (touchMove - touchDot >= 40 && time < 10) {
      // console.log('向右滑动');
      touchRight = true;
      touchLeft = false;
    }
  },
  // 触摸结束事件 
  touchEnd: function(e) {
    if (touchLeft == true && this.data.currentTopicNum != 10) {
      this.nextPage();
    } else if (touchRight == true && this.data.currentTopicNum != 1) {
      this.previousPage();
    }

    clearInterval(interval); // 清除setInterval 
    time = 0;
    touchLeft = false;
    touchRight = false;
  },

  //===============用来更新页面数据
  updateTopic: function(num, topic) {
    let upTopic = "topic[" + num + "]"; //先用一个变量，把某个数组的名称用字符串拼接起来
    this.setData({
      [upTopic]: topic
    });
  },

  //================用来检测是否已经答完题
  checkTopic: function(e) {
    let checkTag = false;
    let _this = this;
    noAnswerList = new Array();
    for (let i = 0; i < _this.data.topic.length; i++) {
      if (_this.data.topic[i].answerTag == false) { //找出没有答完的题
        _this.data.topic[i].num = i + 1;
        noAnswerList.push(_this.data.topic[i]);
      }
    }
    checkTag = noAnswerList.length < 1 ? true : false; //答完则应该返回true
    console.log(noAnswerList);
    return checkTag;
  },
  //================用来提交答案
  postAnswer: async function(e) {
    if (!hadPostAnswer) {
      wx.showLoading({
        title: '批改中',
      })
      let that = this;
      await _testService.checkTheAnswer(that.data.topic, levelNumber, function(res) {
        console.log(res);
        wx.hideLoading();
        that.setData({
          grade: res.grade,
          topic: res.topic,
          ranknum: res.ranknum,
          currentTopic: res.topic[0],
          resultModel:true
        });
        hadPostAnswer = true //只会判一次卷子
        //改变上一页监听的数据时调用
        eventChannel.emit('acceptDataFromOpenedPage', true);
      });
    }

  },
  hideModal:function(e){
    this.setData({
      resultModel:false
    });
  },
  levelToTime:function(level){
    var time = 60 * 1000; //默认答题时间为60s
    switch(level){
      case "低级":
        time = 60 * 1000; //低级难度
        levelNumber = 1; //低级每题得分为1
        break; 
      case "中级":
        time = 40 * 1000; //中级难度
        levelNumber = 2;
        break;
      case "高级":
        time = 20 * 1000; //高级难度
        levelNumber = 3;
        break;
      default :
        time = 60 * 1000; //默认答题时间为60s
        levelNumber = 1;
        break;
    }
    return time;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(e) {
    let that = this;
    let level = e.level;
    eventChannel = this.getOpenerEventChannel();
    console.log(level);
    wx.showLoading({
      title: '正在加载题目',
    })
    await _testService.getTestTitle(function(resultTopic) {
      that.setData({
        topic: resultTopic,
        currentTopic: resultTopic[0]
      });
    }); //获取题目
    total_micro_second = that.levelToTime(level);//根据难度来设置时间
    countdown(that); //答题倒计时
    hadPostAnswer = false; //用来记录是否已经判卷
    wx.hideLoading();
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