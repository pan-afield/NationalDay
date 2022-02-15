<template>
  <div class="sign-in-popup">
    <div class="mask"></div>
    <div class="panel" v-if="!showRemark">
      <div class="head">
        <div class="head-title">每日签到</div>
        <div class="head-close" @click="closeSign"></div>
        <div class="head-info">
          <div class="pic"><img :src="userPic" alt="" /></div>
          <div class="info">
            <div class="nick">{{ nick }}</div>
            <div class="box">
              <img src="@/assets/sign_img/icon_Mywater@2x.png" alt="" />
              <span>{{ $store.state.totalNums }}</span>
            </div>
          </div>
          <div class="record" @click="showRemark = true">记录</div>
        </div>
      </div>
      <div class="sign">
        <div class="sign-head">
          您已签到{{ currentDay }}次<span>继续签到抽大奖</span>
        </div>
        <div class="sign-content">
          <ul>
            <li
              v-for="(item, index) in signList"
              :key="index"
              @click="signDay(currentDay + 1, item)"
            >
              <div class="time">
                <p class="today" v-if="currentDay + 1 === item.day && cansign">
                  今天
                </p>
                <p v-else>第{{ item.day }}天</p>
              </div>
              <div class="water">
                <div class="pic" v-if="currentDay + 1 >= item.day"></div>
                <div class="picB" v-else></div>
                <div class="num-box">
                  <div :class="{ num: true, num1: index < currentDay }">
                    {{ item.reward }}
                  </div>
                </div>
                <div class="tab" v-if="index < currentDay"></div>
              </div>
              <div class="gift" v-if="item.isdrawday">神秘礼包</div>
              <div
                class="finger"
                v-if="currentDay + 1 === item.day && cansign"
              ></div>
              <div class="repair" v-if="item.canrepair">补签</div>
            </li>
          </ul>
        </div>
      </div>
      <div class="remark">
        注：活动期间当日获得水滴超过100g可补签一次，活动期间只能补签一次，需连续签到才可参与签到抽取实物。
      </div>
      <div class="footer">
        <div class="footer-head">签到动态</div>
        <ul>
          <li v-for="(item, index) in allRecord" :key="index">
            <div class="pic"><img :src="item.headimg" alt="" /></div>
            <div class="info">
              <div class="nick">{{ item.nick }}</div>
              <div class="get">
                签到获得<span>{{ item.reward }}g</span>水滴
              </div>
            </div>
            <div class="time">{{ item.writetime }}</div>
          </li>
        </ul>
        <div class="more">
          滑动查看更多<img src="@/assets/sign_img/icon_more@2x.png" alt="" />
        </div>
      </div>
    </div>
    <div class="signRemak" v-else>
      <div class="head">签到记录</div>
      <div class="close" @click="showRemark = false"></div>
      <ul class="content">
        <li v-for="(item, index) in myRecord" :key="index">
          <div class="left">
            <p>签到获得</p>
            <div class="time">{{ item.writetime }}</div>
          </div>
          <div class="right">
            <img src="@/assets/sign_img/img_water@2x.png" alt="" />+{{
              item.reward
            }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "SignIn",
  components: {},
  props: {},
  data() {
    return {
      userPic: "",
      cansign: "",
      nick: "",
      allRecord: [],
      myRecord: [],
      currentDay: "",
      signList: [],
      showRemark: false,
    };
  },
  methods: {
    closeSign() {
      this.$parent.isShowSignIn = false;
    },
    signDay(day, item) {
      if (this.currentDay + 1 !== item.day) return;
      this.$axios.post("Sign/DailySign", { day }).then((res) => {
        if (res.Result === 0) {
          if (this.cansign) {
            if (res.Data.giftinfo) {
              this.$tips.showTips({
                title: "签到",
                content: res.Msg,
                type: 1,
                name: 1,
                gift: res.Data.giftinfo.name,
              });
            } else {
              this.$tips.showTips({
                title: "签到",
                content: res.Msg,
                type: 1,
                name: 1,
              });
            }
          } else {
            this.$tips.showTips({
              title: "签到",
              content: res.Msg,
              type: 1,
              name: 2,
            });
          }
          this.getSignList();
        }
        if (res.Result === -2) {
          this.$tips.showTips({
            title: "签到",
            content: res.Msg,
            type: 0,
          });
        }
      });
    },
    getSignList() {
      this.$axios.get("Sign/GetSignList", {}).then((res) => {
        this.signList = res.Data.signlist;
        this.currentDay = res.Data.curday;
        this.cansign = res.Data.cansign;
        this.$store.commit("setTotal", res.Data.nums);
        this.nick = res.Data.nickname;
        this.userPic = res.Data.headimg;
      });
    },
  },
  created() {
    this.getSignList();
    this.$axios
      .get("Sign/GetSignRecord", {
        params: { type: 0, page: 1, pagesize: 20 },
      })
      .then((res) => {
        this.allRecord = res.Data.signrecord;
      });
    this.$axios
      .get("Sign/GetSignRecord", {
        params: { type: 1, page: 1, pagesize: 20 },
      })
      .then((res) => {
        this.myRecord = res.Data.signrecord;
      });
  },
  mounted() {},
};
</script>

<style lang='scss' scoped>
@keyframes fingerMoveing {
  0% {
    transform: none;
  }
  70% {
    transform: scale3d(0.8, 0.8, 0.8);
  }
  100% {
    transform: none;
  }
}
.sign-in-popup {
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
  .tips-view {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 500;
    top: 0;
    .mask {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      transition: opacity 0.2s;
      z-index: 100;
    }
    .box {
      width: 300px;
      height: 270px;
      background: #ffffff;
      border-radius: 10px;
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 500;
      transform: translate(-50%, -50%);
      transition: opacity 0.3s, transform 0.4s;
      text-align: center;

      img {
        transform: scale(0.5);
      }
      p {
        font-size: 16px;
        color: #333333;
      }
      .btn {
        position: absolute;
        left: 50%;
        bottom: 20px;
        transform: translateX(-50%);
        width: 160px;
        height: 36px;
        background: #43ab5d;
        border-radius: 20px;
        font-size: 14px;
        line-height: 36px;
        text-align: center;
        color: #ffffff;
      }
      .close {
        width: 35px;
        height: 81px;
        position: absolute;
        bottom: -81px;
        left: 50%;
        transform: translateX(-50%);
        background: url("~@/assets/tips/icon_close@2x.png") no-repeat;
        background-size: 100% 100%;
      }
      .title {
        position: absolute;
        left: 50%;
        top: -20px;
        transform: translateX(-50%);
        width: 190px;
        height: 36px;
        font-size: 18px;
        text-align: center;
        font-family: PingFang SC;
        font-weight: bold;
        line-height: 32px;
        color: #fff;
        background: url("~@/assets/tips/img_Headline@2x.png") no-repeat;
        background-size: 100% 100%;
      }
    }
  }
  .signRemak {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 86%;
    background: #fff;
    transition: all 0.4s;
    border-radius: 16px 16px 0px 0px;
    .head {
      text-align: center;
      height: 25px;
      font-size: 18px;
      font-weight: bold;
      line-height: 25px;
      margin: 20px auto;
      color: #333333;
    }
    .close {
      position: absolute;
      right: 20px;
      top: 20px;
      width: 24px;
      height: 24px;
      background: url("~@/assets/icon_close.png") no-repeat;
      background-size: 100% 100%;
    }
    .content {
      width: 100%;
      height: calc(86vh - 65px);
      overflow: scroll;
      li {
        margin: 0 auto;
        width: 335px;
        height: 55px;
        border-bottom: 1px solid #dddee2;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left {
          p {
            font-size: 14px;
            color: #333333;
          }
          .time {
            font-size: 12px;
            color: #999999;
            text-align: right;
          }
        }
        .right {
          font-size: 15px;
          color: #333333;
          img {
            width: 14px;
            height: 18px;
            margin-right: 10px;
            transform: translateY(2px);
          }
        }
      }
    }
  }
  .panel {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 86%;
    background: #f8f6f7;
    transition: all 0.4s;
    border-radius: 16px 16px 0px 0px;
    .head {
      width: 100%;
      height: 150px;
      background: url("~@/assets/sign_img/img_banner@2x.png") no-repeat;
      background-size: 100% 100%;
      &-info {
        margin: 0 auto;
        width: 92%;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .pic {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          img {
            width: 60px;
            height: 60px;
            border-radius: 50%;
          }
        }
        .info {
          transform: translateX(-20%);
          .nick {
            font-size: 18px;
            font-family: PingFang SC;
            font-weight: bold;
            color: #ffffff;
            text-shadow: 0px 1px 6px #43ab5d;
          }
          .box {
            position: relative;
            margin-top: 10px;
            width: 100px;
            height: 24px;
            line-height: 24px;
            background: rgba(17, 132, 89, 0.4);
            border-radius: 13px;
            text-align: center;
            img {
              position: absolute;
              left: -10px;
              top: -6px;
              width: 42px;
              height: 42px;
            }
            span {
              font-size: 16px;
              font-family: PingFang SC;
              color: #ffffff;
              text-shadow: 0px 1px 6px #43ab5d;
              margin-left: 18px;
            }
          }
        }
        .record {
          width: 66px;
          height: 26px;
          border: 1px solid #ffffff;
          border-radius: 30px;
          line-height: 26px;
          text-align: center;
          font-size: 13px;
          font-family: PingFang SC;
          color: #ffffff;
          text-shadow: 0px 1px 6px #43ab5d;
        }
      }
      &-title {
        width: 80%;
        height: 50px;
        line-height: 50px;
        margin: 0 auto;
        text-align: center;
        color: #fff;
        font-size: 18px;
        text-shadow: 0px 1px 6px #43ab5d;
        font-weight: 600;
      }
      &-close {
        position: absolute;
        right: 18px;
        top: 15px;
        width: 24px;
        height: 24px;
        background: url("~@/assets/icon_close.png") no-repeat;
        background-size: 100% 100%;
      }
    }
    .sign {
      position: absolute;
      left: 10px;
      top: 120px;
      width: 94.67%;
      height: 160px;
      background: #ffffff;
      box-shadow: 0px 0px 6px rgba(217, 228, 243, 0.3);
      border-radius: 10px;
      &-head {
        margin-left: 5px;
        margin-top: 10px;
        font-size: 16px;
        font-weight: bold;
        color: #333333;
        span {
          font-weight: normal;
          margin-left: 5px;
          font-size: 12px;
          color: #999999;
        }
      }
      &-content {
        width: 100%;
        height: 100px;
        ul {
          overflow-x: scroll;
          white-space: nowrap;
          li {
            margin: 10px 8px;
            position: relative;
            display: inline-block;
            width: 40px;
            height: 100px;
            .time {
              width: 40px;
              text-align: center;
              position: absolute;
              left: 0;
              top: 20px;
              p {
                font-size: 12px;
                color: #666666;
              }
              .today {
                font-size: 14px;
                color: #f87a39;
              }
            }
            .water {
              position: absolute;
              left: 2px;
              top: 40px;
              .pic {
                width: 36px;
                height: 46px;
                background: url("~@/assets/sign_img/icon_water01@2x.png")
                  no-repeat;
                background-size: 100% 100%;
              }
              .picB {
                width: 36px;
                height: 46px;
                background: url("~@/assets/sign_img/icon_water02@2x.png")
                  no-repeat;
                background-size: 100% 100%;
              }
              .num-box {
                position: absolute;
                left: 0;
                text-align: center;
                top: 30px;
                width: 36px;
                height: 20px;
                line-height: 20px;
                .num {
                  font-size: 12px;
                  color: #999999;
                }
                .num1 {
                  color: #20983e;
                }
              }

              .tab {
                position: absolute;
                bottom: -6px;
                right: -6px;
                width: 15px;
                height: 15px;
                background: url("~@/assets/sign_img/icon_complete@2x.png")
                  no-repeat;
                background-size: 100% 100%;
              }
            }
            .gift {
              position: absolute;
              left: -10px;
              top: 0;
              width: 60px;
              height: 20px;
              background: url("~@/assets/sign_img/img_label@2x.png") no-repeat;
              background-size: 100% 100%;
              text-align: center;
              color: #fff;
              line-height: 20px;
            }
            .repair {
              position: absolute;
              left: -2px;
              bottom: -14px;
              width: 40px;
              height: 20px;
              background: #fff7f1;
              border: 1px solid #f87a39;
              border-radius: 10px;
              font-size: 12px;
              color: #f87a39;
              text-align: center;
              line-height: 22px;
            }
            .finger {
              z-index: 1;
              position: absolute;
              right: -30px;
              bottom: -15px;
              width: 44px;
              height: 45px;
              background: url("~@/assets/sign_img/img_hand@2x.png") no-repeat;
              background-size: 100% 100%;
              animation: fingerMoveing 1s ease infinite both;
            }
          }
        }
      }
    }
    .remark {
      width: 330px;
      height: 37px;
      margin: 146px auto 0;
      font-size: 12px;
      line-height: 18px;
      color: #999999;
    }
    .footer {
      margin: 5px auto 0;
      width: 355px;
      height: 222px;
      background: #ffffff;
      box-shadow: 0px 0px 6px rgba(217, 228, 243, 0.3);
      border-radius: 10px;
      &-head {
        margin: 0 auto;
        width: 120px;
        height: 24px;
        background: url("~@/assets/sign_img/img_Signin@2x.png") no-repeat;
        background-size: 100% 100%;
        text-align: center;
        font-size: 16px;
        line-height: 22px;
        color: #ffffff;
      }
      ul {
        width: 330px;
        height: 153px;
        margin: 10px auto;
        overflow: scroll;
        li {
          width: 100%;
          height: 50px;
          border-bottom: 1px solid #dddee2;
          display: flex;
          align-items: center;
          .pic {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: #000;
            margin-right: 10px;
            img {
              width: 30px;
              height: 30px;
            }
          }
          .info {
            width: 240px;
            .nick {
              font-size: 12px;
              color: #999999;
            }
            .get {
              font-size: 14px;
              color: #333333;
              span {
                color: #43ab5d;
              }
            }
          }
          .time {
            font-size: 13px;
            color: #666666;
            text-align: right;
          }
        }
      }
      .more {
        width: 100px;
        height: 17px;
        font-size: 12px;
        font-weight: 400;
        line-height: 17px;
        color: #999999;
        margin: 0 auto;
        text-align: center;
        img {
          width: 8px;
          height: 7px;
          margin: 0 5px;
        }
      }
    }
  }
}
</style>
