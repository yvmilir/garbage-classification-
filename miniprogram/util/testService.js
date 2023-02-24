const db = wx.cloud.database();
const _ = db.command;
const ponstColleciton = 'points';
const openidConstant = '_openid';
//测试服务
var testService = {
  _question: require('question.js'),
  //获取题目
  getTestTitle: async function(callback) {
    let topic = new Array();
    let numlist = this.getRandomNumber();
    for (let i = 0; i < numlist.length; i++) {
      await db.collection('product').skip(numlist[i]).limit(1).get().then(res => {
        if (res.data.length > 0) {
          topic.push({
            title: res.data[0].name,
            question: ' 在垃圾分类标准中属于____?',
            type: res.data[0].type,
            answerTag: false,
            answer: null,
            correctAnswer:""
          });
        } else {
          //如果网络请求失败则从本地提取题目
          topic.push({
            title: this._question.data[i].name,
            question: ' 在垃圾分类标准中属于____?',
            type: this._question.data[i].type,
            answerTag: false,
            answer: null,
            correctAnswer:""
          });
        }
      }).catch(console.error);
    }
    console.log(numlist);
    callback(topic);
  },

  //对答题进行判卷
  checkTheAnswer: async function(answer,levelNumber, callback) {
    let grade = 0;
    for (let i = 0; i < answer.length; i++) {
      await db.collection('product').where({
        name: answer[i].title
      }).limit(1).get().then(res => {
        if (res.data.length > 0) {
          answer[i].correctAnswer = res.data[0].sortId;
          if (res.data[0].sortId == answer[i].answer) {
            grade += 1*levelNumber;
          }
        } else { //没有找到正确答案
        }
      });
    }
    let result = new Object();
    result.topic = answer;
    result.grade = grade;
    let count = wx.getStorageSync('ponits');
    count = (count!=null && count > 0) ? count : 0;
    db.collection('rank').add({
      data: {
        grade: count + grade
      }
    });
    let ranknum;
    await db.collection('rank').where({
      grade: _.gt(count + grade)
    }).count().then(s => {
      ranknum = s.total;
    });
    this.updateStorage(ranknum, grade);//更新本地缓存
    result.ranknum = ranknum;
    callback(result);
  },

  //更新本地缓存数据以及云数据库数据
  updateStorage:async function(ranknum, grade) {
    let id;
    if (!wx.getStorageSync(openidConstant)) {
      await wx.cloud.callFunction({
        // 云函数名称
        name: 'login',
        // 传给云函数的参数
        data: {
        },
        success: function(res) {
          console.log(res);
          wx.setStorageSync(openidConstant, res.result.event.userInfo.openId);
          id = res.result.event.userInfo.openId;
        },
        fail: console.error
      })
    } else {
      id = wx.getStorageSync(openidConstant);
    }
    let temp = wx.getStorageSync('rank');
    if(!temp){
      temp = 0;
    }
    ranknum = temp > ranknum ? ranknum : temp;
    wx.setStorage({
      key: 'rank',
      data: ranknum > 0 ? ranknum : 1,
    });
    await db.collection(ponstColleciton).where({
      _openid: id
    }).limit(1).get().then(async pp=>{
      console.log(pp);
      if(pp.data.length>0){
        await db.collection(ponstColleciton).doc(pp.data[0]._id).update({
          data: {
            points: _.inc(grade)
          }
        }).then(async s=>{
          console.log(s);
          if(s.stats.updated>0){
            wx.setStorageSync(ponstColleciton, pp.data[0].points+grade);
          }else{
            if(grade>0){
              //积分更新失败
              wx.showToast({
                title: '积分更新失败',
                icon: 'none'
              });
            }
          }
        })
      }else{
        await db.collection(ponstColleciton).add({
          data:{
            points:grade
          }
        }).then(sss=>{
          console.log(sss);
          if(sss._id){
            //创建成功
            wx.setStorageSync(ponstColleciton, grade);
          }else{
            //创建失败
            wx.showToast({
              title: '更新积分失败',
              icon:'none'
            })
          }
        })
      }
    });
    return;
  },

  //获取倒计时
  dateformat(micro_second, callback) {
    let second = Math.floor(micro_second / 1000);
    let hr = Math.floor(second / 3600);
    let min = Math.floor((second - hr * 3600) / 60);
    let sec = (second - hr * 3600 - min * 60);
    callback(sec);
  },

  //随机生成10个数字
  getRandomNumber: function() {
    let list = new Array();
    list.push(this.getARandomNumber());
    let l = 1;
    while (l < 10) {
      let num = this.getARandomNumber();
      if (!this.checkNumber(num, list)) {
        list.push(num)
        l++;
      }
    }
    return list;
  },

  //判断该随机数是否已存在
  checkNumber: function(num, list) {
    let tag = false;
    for (let i = 0; i < list.length; i++) {
      if (num == list[i]) {
        tag = true;
        break;
      }
    }
    return tag;
  },

  //获取一个随机数(在0~2534之间)
  getARandomNumber: function() {
    let num = 0;
    let i = true;
    while (i) {
      let temp = Math.round(Math.random() * 2535);
      if (temp < 2535) {
        i = false;
      }
      num = temp;
    }
    return num;
  }
};
module.exports = testService;