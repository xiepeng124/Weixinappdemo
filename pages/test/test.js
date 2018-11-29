// pages/test/test.js
const util = require('../../utils/util.js')
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
let recordTimeInterval
Page({

  data: {
    recorddata:[],
    voiceDetail:{
     voiceUrl:'',
     recordtime:''
    },
    imageData:[]
  },


  /**  
   * 生命周期函数--监听页面加载  
   */
  onLoad: function (options) {

    console.log(recorderManager)



  },

  //开始录音的时候
  start: function () {
    const that = this;
    let recordTime = 0
    recordTimeInterval = setInterval(function () {
      recordTime += 1
      that.setData({
        'voiceDetail.recordtime': util.formatDayTime(recordTime),
      })
      console.log(that.data.voiceDetail);
    }, 1000)
    //https://www.cnblogs.com/danielWise/p/9020884.html
    const options = {
      duration: 10000,//指定录音的时长，单位 ms
      sampleRate: 16000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 96000,//编码码率
      format: 'mp3',//音频格式，有效值 aac/mp3
      frameSize: 50,//指定帧大小，单位 KB
    }
    //开始录音--旧版
    wx.startRecord({
      success: function (res) {
        var tempFilePath = res.tempFilePath
        that.setData({
          'voiceDetail.voiceUrl': tempFilePath,
          recorddata: that.data.recorddata.concat(that.data.voiceDetail)
        })
        //that.tip("录音完成")
      },
      fail: function (res) {
        //录音失败
        console.log(res);
      }
    })
    // //开始录音
    // recorderManager.start(options);
    // recorderManager.onStart(() => {
    //   console.log('recorder start')
    // });
    // //错误回调
    // recorderManager.onError((res) => {
      
    // })
  },

  //停止录音
  stop: function () {
    clearInterval(recordTimeInterval);
    var that = this;
    recorderManager.stop();
    recorderManager.onStop((res) => {
      that.setData({
        'voiceDetail.voiceUrl':res.tempFilePath,
        recorddata:that.data.recorddata.push(that.data.voiceDetail)
      })
       
      // console.log('停止录音', that.recorddata)
      // const { tempFilePath } = res
    })
  },


  //播放声音
  play: function () {
    innerAudioContext.src = this.tempFilePath;
    innerAudioContext.play()
  
      // innerAudioContext.onPlay(() => {
      //   console.log('开始播放')
      // })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },

  longTap: function () {
    console.log('longTap....')
  },

  touchStart: function () {
    console.log('touchStart....')
    this.start();
  },


  touchEnd: function () {
    console.log('touchEnd....')
    //停止录音--旧版
    clearInterval(recordTimeInterval);
    wx.stopRecord()
    //this.stop()
  },
  //播放录音--旧版
  playRecord: function(e){
    console.log(e.currentTarget.id);
    const id = e.currentTarget.id;
    const src = this.data.recorddata[id].voiceUrl;
    wx.playVoice({
      filePath: src,
      fail: function (res) {
       console.log(res)
      }
    })
    
    // innerAudioContext.src = this.data.recorddata[id].voiceUrl;
    // innerAudioContext.play()
  },
  deletelongtap:function(e){
    var that = this;
    // const id = e.currentTarget.id;
    const id = parseInt(e.currentTarget.id);
    console.log(id);
    wx.showActionSheet({
      itemList: ['删除'],
      success(res) {
        that.data.recorddata.splice(id, 1)
        that.setData({
          recorddata:that.data.recorddata
        })
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  //发送图片
  updata_img: function () {
    var that = this;
    wx.chooseImage({
      count: 3, // 默认9
      success: function (res) {
        that.setData({
          imageData : res.tempFilePaths
        })
        // console.log('tempFiles', res.tempFiles[0].size)
        // var size = res.tempFiles[0].size;
        // var size_kb = (size / 1000).toFixed(2);//
        // if (size_kb > 2048) {
        //   console.log('2048', '2048')
        // }
        // console.log('size_kb', size_kb)
      },
       fail(res) {
        console.log('图片选中失败', res);
      }
    })
  },
  touchimageAction: function(e){
    console.log(e);
    const currentimg = e.currentTarget.dataset.image;
    wx.previewImage({
      current: currentimg,
      urls:this.data.imageData
    })
  }

});