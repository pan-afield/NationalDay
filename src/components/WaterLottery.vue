<template>
  <div class="water-lottery-popup">
    <div class="mask"></div>
    <div class="panel">
      <div class="close" @click="$emit('close')">
        <img src="../assets/popup/icon_clsoe.png" alt="">
      </div>
      <div class="title">水滴抽奖</div>
      <div class="head-btn">
        <div class="record" @click="isShowAwardRecord = true">抽奖记录</div>
        <div class="award" @click="myGoods">我的奖品</div>
        <div class="current-water">当前拥有: {{$store.state.totalNums}}g</div>
      </div>
      <div class="award-pool">
        <img v-show="switchLights" class="lights-img" src="../assets/popup/lights1.png" alt="">
        <img v-show="!switchLights" class="lights-img" src="../assets/popup/lights2.png" alt="">
        <ul class="pool-ul">
          <li class="award-li" v-for="(item, index) in awardList" :key="item.rid" :class="{'active': item.active, 'inactive': !item.active && running && item.rid !== 5}" @click="showAwardDetail(item)">
            <div v-if="index === 4" class="award-content center">
              <div class="middle">
                <p class="right-now">立即抽奖</p>
                <p class="cost">消耗100g水滴</p>
              </div>
            </div>
            <div v-else :class="{'award-content': true, 'yellow': yellowClass(index) ,'active': item.active}">
              <div class="award-img">
                <img :src="item.imgurl" alt="">
                <p v-if="item.level === 0" class="cate">参与奖</p>
                <p v-else-if="item.level === 1" class="cate">二等奖</p>
                <p v-else-if="item.level === 2" class="cate">一等奖</p>
                <p v-else-if="item.level === 3" class="cate">特等奖</p>
              </div>
              <p class="text">{{item.titel}}</p>
            </div>
          </li>
        </ul>
        <div class="bot-container">
          <div class="award-message">中奖动态</div>
          <vue-seamless-scroll :data="messageList" :class-option="scrollOption" class="scroll-box">
            <ul class="scroll-ul">
              <li class="message-li" v-for="(item, index) in messageList" :key="index">
                <div class="left">恭喜&nbsp;<div class="user-name">{{item.nickname}} </div>抽中奖励{{item.name}}</div>
                <div class="time">{{dealTime(item.drawtime)}}</div>
              </li>
            </ul>
          </vue-seamless-scroll>
        </div>
      </div>
      <!-- 奖品详细信息弹窗 -->
      <div v-if="isShowAwardDetail" class="award-detail-box">{{currentDetail.name}}</div>
      <!-- 抽奖记录弹窗 -->
      <div v-if="isShowAwardRecord" class="award-record-box">
        <div class="mask-in"></div>
        <div class="award-record">
          <div class="head-title">抽奖记录</div>
          <div class="tab-bar">
            <div>时间</div>
            <div>奖品</div>
          </div>
          <div class="outer">
            <ul class="record-ul">
              <li class="record-item" v-for="(item, index) in lotteryRecord" :key="index">
                <div class="record-time">{{item.drawtime}}</div>
                <div class="record-num">
                  <img src="../assets/popup/img_water_alone.png" alt="">
                  <span>{{item.name}}</span>
                </div>
              </li>
            </ul>
          </div>
          <div class="tips">上滑加载更多</div>
          <div class="hide" @click="isShowAwardRecord = false">
            <img src="../assets/popup/icon_close_toast.png" alt="">
          </div>
        </div>
      </div>
      <!-- 抽奖结果弹窗 -->
      <div v-if="isShowAwardResult" class="award-result-box">
        <div class="mask-in"></div>
        <div class="award-result">
          <div class="head-title">恭喜你</div>
          <div class="resilt-img">
            <img :src="drawResult.giftinfo.imgurl" alt="">
          </div>
          <div class="lucky-text">恭喜您获得<span style="color: #F85534;">{{drawResult.giftinfo.name}}</span></div>
          <div class="tips">可在 <span class="my-goods">我的物品</span> 进行查看哦</div>
          <div class="hide" @click="closeResult">
            <img src="../assets/popup/icon_close_toast.png" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import util from '../utils/utils'
export default {
  name: 'WaterLottery',
  components: {},
  props: {},
  data() {
    return {
      // 抽奖列表数据
      awardList: [],
      awardPosition: [0, 1, 2, 5, 8, 7, 6, 3],   // 跑马灯位置position
      running: false,                            // 是否正在抽奖
      runTimer: null,                            // 跑马灯计时器
      slowDownPosition: 5,
      // 抽奖结果
      drawResult: {},
      // 抽奖记录
      lotteryRecord: [],
      // 底部滚动数据
      messageList: [
        { nickname: '游戏辣妹 抽中超级大奖 iPhone13 手机', time: '11:25' },
      ],
      // 切换抽奖氛围灯
      switchLights: false,
      lightsTimer: null,
      // 当前点击的奖品
      currentDetail: {},
      // 奖品详细信息
      isShowAwardDetail: false,
      // 抽奖记录弹窗
      isShowAwardRecord: false,
      // 抽奖结果
      isShowAwardResult: false
    }
  },
  computed: {
    scrollOption() {
      return {
        step: 0.3,
        limitMoveNum: this.messageList.length,
        hoverStop: false,
        direction: 1,
        openWatch: true,
      }
    },
  },
  created() {
    this.getLotteryList()
    this.getLotteryRecord()
    this.getLotteryMessage()
  },
  mounted() {
    this.runLights()
  },
  methods: {
    yellowClass(index) {
      return [1, 3, 5, 7].includes(index);
    },
    // 展示奖品详情
    showAwardDetail(data) {
      if (this.running) return
      if (data.rid === 5) return this.start()
      this.currentDetail = data
      this.isShowAwardDetail = true
      const timer = setTimeout(() => {
        this.isShowAwardDetail = false
        clearTimeout(timer)
      }, 500)
    },
    // 切换氛围灯
    runLights() {
      this.lightsTimer = setInterval(() => {
        this.switchLights = !this.switchLights
      }, 200)
    },
    // 请求抽奖列表
    getLotteryList() {
      this.$axios.get('/Draw/GetDrawList').then(data => {
        if (data.Result === 0) {
          this.$store.commit('setTotal', data.Data.nums)
          const list = data.Data.drawlist
          list.forEach((item, index) => {
            const pos = this.awardPosition.findIndex(ele => index === ele)
            item.position = pos
            item.active = false
          })
          this.awardList = list
        }
      })
    },
    // 请求抽奖记录
    getLotteryRecord() {
      const obj = {
        type: 1,
        page: 1,
        pagesize: 99
      }
      this.$axios.get('/Draw/GetDrawRecord', { params: obj }).then(data => {
        if (data.Result === 0) {
          this.lotteryRecord = data.Data.drawrecord
        }
      })
    },
    // 请求底部抽奖动态
    getLotteryMessage() {
      const obj = {
        type: 0,
        page: 1,
        pagesize: 99
      }
      this.$axios.get('/Draw/GetDrawRecord', { params: obj }).then(data => {
        if (data.Result === 0) {
          this.messageList = data.Data.drawrecord
        }
      })
    },
    // 关闭抽奖结果弹窗
    closeResult() {
      this.isShowAwardResult = false
      this.allLightsOff()
    },
    // 点击我的奖品
    myGoods() {
      this.isShowAwardResult = false
      this.$emit('to-mine')
    },
    // 点击抽奖
    async start() {
      // 如果水滴少于100，弹窗提示 return
      if (this.$store.state.totalNums < 100) {
        this.currentDetail = { name: '抱歉，您的水滴不足，快去"领水滴"页面获取吧！' }
        this.isShowAwardDetail = true
        const timer = setTimeout(() => {
          this.isShowAwardDetail = false
          clearTimeout(timer)
        }, 2500)
        return false
      }
      // 如果跑马灯正在进行，那么直接return
      if (this.running) return
      this.running = true
      // 全部灭灯
      this.allLightsOff()
      // 发起抽奖请求，获得抽奖结果
      this.$store.commit('addTotal', -100)
      const drawResult = await this.$axios.post('/Draw/DrawReward')
      this.drawResult = drawResult.Data
      const resId = drawResult.Data.rid
      // 拿到最终目的地的位置
      let findResult = this.awardList.find(item => item.rid === resId)
      let target = findResult.position;
      // 调用跑马灯方法，返回值为最终的落点
      await this.horseRaceLamp(200, target, 0)
      // 延迟500ms
      await this.delay(500)
      // 弹窗提示
      this.isShowAwardResult = true
      // 标志位恢复
      this.running = false
      // 更新页面数据
      this.getLotteryList()
      this.getLotteryRecord()
    },
    // 跑马灯方法
    /*@params
              totalStep:总共的步数, time:亮灯的时间, target:目标落点, currentPos:当前亮灯的位置
     */
    horseRaceLamp(time = 60, target, currentPos) {
      const totalStep = target + 2 * 8 + (8 - currentPos)
      return this.marquee({ totalStep, time, currentPos })
    },
    async marquee({ totalStep, time, currentPos }) {
      // console.log('总步数：' + totalStep)
      // console.log('当前位置' + currentPos)

      // 开始减速
      if (totalStep < this.slowDownPosition) {
        time *= 1.6
      }
      if (currentPos === 8) {
        currentPos = 0
      }
      // 找出对应的奖品，亮灯
      let pos = this.awardPosition[currentPos];
      let findResult = this.awardList.find((item, index) => index === pos)
      findResult.active = true
      // 总步数-1
      totalStep--
      if (totalStep < 0) return currentPos
      // 延迟灭灯
      await this.delay(time)
      // 将当前奖品灭灯
      findResult.active = false
      // 递归调用，当前位置位置+1
      return this.marquee({ totalStep, time, currentPos: currentPos + 1 })
    },
    // 延时函数
    delay(time) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve()
        }, time);
      })
    },
    // 全部灭灯
    allLightsOff() {
      this.awardList.forEach(item => {
        item.active = false
      })
    },
    // 处理时间显示格式
    dealTime(time) {
      const ms = +new Date(time)
      return util.timeToNow(ms)
    }
  },
  beforeDestroy() {
    clearInterval(this.lightsTimer)
  }
}

</script>

<style lang='scss' scoped>
.water-lottery-popup {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 9;
  .mask {
    width: 100%;
    height: 100%;
    background-color: rgba(13, 12, 12, 0.6);
    transition: all 0.2s;
  }
  .panel {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 94%;
    background-color: #fff;
    transition: all 0.4s;
    background: url('../assets/popup/bg_.png') no-repeat center;
    background-size: 100.8% 100%;
    background-position-y: 4px;
    .close {
      position: absolute;
      top: 40px;
      right: 0;
      width: 32px;
      height: 31px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .title {
      text-align: center;
      font-size: 20px;
      color: #fcf9e8;
      line-height: 8.25vh;
      text-shadow: 0px 1px 3px rgba(208, 108, 32, 0.64);
    }
    .head-btn {
      display: flex;
      justify-content: space-around;
      margin: 20px 0 8px 0;
      padding: 0 40px 0 20px;
      .record,
      .award {
        width: 82px;
        height: 35px;
        line-height: 35px;
        text-align: center;
        font-size: 15px;
        color: #fff3e0;
        background: url('../assets/popup/btn_bg.png') no-repeat;
        background-size: 100% 100%;
        border-radius: 5px;
      }
      .award {
        margin-left: -10px;
      }
      .current-water {
        position: relative;
        line-height: 36px;
        font-size: 16px;
        color: #ffe8c4;
        white-space: nowrap;
        &::after {
          content: '';
          position: absolute;
          top: 10px;
          right: -22px;
          width: 14px;
          height: 17px;
          background: url('../assets/popup/img_water_.png') no-repeat;
          background-size: 100% 100%;
        }
      }
    }
    .award-pool {
      position: relative;
      padding: 8.8vh 30px 0;
      width: 100%;
      height: 75.5vh;
      background: url('../assets/popup/img_machine.png') no-repeat;
      background-size: 100% 100%;
      box-sizing: border-box;
      .lights-img {
        position: absolute;
        top: 18px;
        left: 50%;
        width: 84%;
        height: 50.22vh;
        transform: translateX(-50%);
      }
      .pool-ul {
        position: relative;
        display: flex;
        justify-content: space-evenly;
        flex-wrap: wrap;
        margin: auto;
        padding-top: 5px;
        width: 268px;
        height: 263px;
        z-index: 2;
        .award-li {
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          width: 82px;
          height: 82px;
          border-radius: 8px;
          &.active {
            box-shadow: 0px 2px 4px #ffe272;
          }
          &.inactive {
            &::after {
              content: '';
              position: absolute;
              width: 84px;
              height: 84px;
              top: 0;
              left: 0;
              background: url('../assets/home_img/mask.png') no-repeat;
              background-size: 100% 100%;
              z-index: 2;
            }
          }
          .award-content {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            width: 100%;
            height: 100%;
            text-align: center;
            font-size: 18px;
            background: url('../assets/popup/img_frame_orange.png') no-repeat;
            background-size: 100% 100%;
            transition: all 0.3s;
            .middle {
              .right-now {
                text-align: center;
                font-size: 16px;
                font-weight: 600;
                color: #fd3a08;
                z-index: 2;
              }
              .cost {
                margin-top: 4px;
                text-align: center;
                font-size: 12px;
                color: #f56540;
              }
            }

            .award-img {
              overflow: hidden;
              position: relative;
              margin-top: 5px;
              width: 47px;
              height: 51px;
              background: #fcaf87;
              border-radius: 3px;
              img {
                width: 100%;
                height: 100%;
              }
              .cate {
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                height: 14px;
                line-height: 13px;
                background-color: #ee6133;
                color: #fff;
                font-size: 10px !important;
              }
            }
            .text {
              color: #f74f40;
              font-size: 12px;
            }
            &.center {
              font-size: 14px;
              color: #0dabe6;
              border-radius: 8px;
              background: url('../assets/popup/bt.png') no-repeat center;
              background-size: 115% 108%;
            }
            &.yellow {
              background: url('../assets/popup/img_frame_yellow.png') no-repeat;
              background-size: 100% 100%;
            }
            &.active {
              background: url('../assets/popup/active.png') no-repeat;
              background-size: 100% 100%;
            }
          }
        }
      }
      .bot-container {
        position: absolute;
        left: 0;
        bottom: 20px;
        width: 100%;
        padding: 0 30px;
        box-sizing: border-box;
        .award-message {
          margin: 0 0 5px 0;
          text-align: center;
          font-size: 16px;
          color: #ffe9c4;
          background: url('../assets/popup/img_decorate .png') no-repeat center;
          background-size: 161px 9px;
        }
        .scroll-box {
          overflow: hidden;
          height: 52px;
          .scroll-ul {
            padding: 0 15px;
            .message-li {
              display: flex;
              justify-content: space-between;
              height: 26px;
              line-height: 26px;
              font-size: 12px;
              color: #fddfac;
              .left {
                display: flex;
                .user-name {
                  overflow: hidden;
                  max-width: 100px !important;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
              }
            }
          }
        }
      }
    }
  }
  .award-detail-box {
    position: absolute;
    top: 45%;
    left: 50%;
    padding: 8px 16px;
    text-align: center;
    font-size: 14px;
    background-color: #fff;
    transform: translateX(-50%);
    border-radius: 10px;
    border: 1px solid #fd8246;
    z-index: 3;
  }
  .award-record-box {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    .mask-in {
      position: absolute;
      top: -6%;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(13, 12, 12, 0.6);
      transition: all 0.2s;
      z-index: 3;
    }
    .award-record {
      position: absolute;
      top: 100px;
      left: 50%;
      transform: translateX(-50%);
      width: 300px;
      height: 367px;
      background: url('../assets/popup/bg_toast.png') no-repeat center;
      background-size: 100% 100%;
      z-index: 4;
      .head-title {
        text-align: center;
        line-height: 45px;
        font-size: 20px;
        color: #fcf9e8;
        text-shadow: 0px 1px 3px rgba(208, 108, 32, 0.64);
      }
      .tab-bar {
        display: flex;
        align-items: center;
        margin: 18px auto 5px;
        width: 255px;
        height: 27px;
        background: linear-gradient(270deg, #ffa164 0%, #ff7c55 100%);
        border-radius: 14px;
        div {
          flex: 1;
          text-align: center;
          font-size: 14px;
          color: #ffffff;
        }
      }
      .outer {
        overflow-x: hidden;
        overflow-y: scroll;
        padding: 0 30px;
        height: 230px;
        .record-ul {
          .record-item {
            overflow-x: hidden;
            display: flex;
            align-items: center;
            height: 48px;
            font-size: 14px;
            color: #a3894c;
            border-bottom: 1px solid #e3cc8c;
            .record-time {
              width: 138px;
            }
            .record-num {
              flex: 1;
              display: flex;
              align-items: center;
              img {
                width: 32px;
                height: 38px;
                vertical-align: middle;
              }
            }
          }
        }
      }
      .tips {
        position: absolute;
        top: 90.5%;
        left: 50%;
        transform: translateX(-50%);
        width: 100px;
        font-size: 12px;
        color: #a3894c;
        text-align: center;
        &::after {
          content: '';
          position: absolute;
          top: 3px;
          right: 5px;
          width: 6px;
          height: 9px;
          background: url('../assets/popup/icon_more.png') no-repeat center;
          background-size: 100% 100%;
        }
      }
      .hide {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        width: 37px;
        height: 63px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .award-result-box {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    .mask-in {
      position: absolute;
      top: -6%;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(13, 12, 12, 0.6);
      transition: all 0.2s;
      z-index: 3;
    }
    .award-result {
      position: absolute;
      top: 60px;
      left: 50%;
      transform: translateX(-50%);
      width: 333px;
      height: 462px;
      background: url('../assets/popup/bg_toast_congratulation.png') no-repeat;
      background-size: 100% 100%;
      background-position-x: 4px;
      z-index: 4;
      .head-title {
        margin-top: 70px;
        text-align: center;
        line-height: 45px;
        font-size: 20px;
        color: #fcf9e8;
        text-shadow: 0px 1px 3px rgba(208, 108, 32, 0.64);
      }
      .resilt-img {
        margin: 54px auto 40px;
        width: 79px;
        height: 100px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .lucky-text {
        text-align: center;
        font-size: 16px;
        font-weight: 600;
        color: #a3894c;
      }
      .tips {
        margin-top: 52px;
        line-height: 22px;
        text-align: center;
        font-size: 14px;
        color: #a3894c;
        .my-goods {
          color: #f85534;
          text-decoration: underline;
        }
      }
      .hide {
        position: absolute;
        top: 93%;
        left: 50%;
        transform: translateX(-50%);
        width: 37px;
        height: 63px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
