<template>
  <div class="friends">
    <div class="mask"></div>
    <div class="panel">
      <div class="head">好友助力</div>
      <div class="wood">
        <div class="help" @click="helpRules"></div>
        <div class="close" @click="closeAll()"></div>
      </div>
      <div class="content">
        <div class="content-top">
          <p>
            已邀请<span>{{ friendNum }}</span
            >人，再邀请<span>{{ 3 - friendNum }}</span
            >人助力可获得<span>500g</span>水滴
          </p>
          <ul>
            <li v-for="(item, index) in friendList" :key="index">
              <img v-if="item" :src="item.headimg" alt="" />
              <img v-else src="@/assets/welfare/icon_add.png" alt="" />
            </li>
          </ul>
        </div>
        <div class="content-mid"></div>
        <div class="content-footer">
          <ul>
            <li v-for="(item, index) in rewardList" :key="index">
              <div class="pic-box">
                <img src="@/assets/welfare/friend_box.png" alt="" />
              </div>
              <div class="info">
                <img src="@/assets/welfare/img_waterdouble.png" alt="" />
                <p><span>500g</span>水滴</p>
              </div>
              <div class="btn">
                <div class="btn-pic1">分享领取</div>
                <!-- <div class="btn-pic2">分享领取</div> -->
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      friendNum: "",
      friendList: [],
      rewardList: [],
    };
  },
  methods: {
    helpRules() {},
    powerFull() {
      let inverter = 33316;
      this.$axios.post("Power/Support", { inverter }).then((res) => {
        console.log(res);
      });
    },
    closeAll() {
      this.$parent.isShowFriends = false;
    },
  },
  created() {
    // this.powerFull()
    this.$axios.get("Power/GetFriendPower").then((res) => {
      this.rewardList = res.Data.rewardlist;
      this.friendList = res.Data.friendlist;
      this.friendNum = res.Data.friendlist.length;
      this.friendList.length = 3;
    });
  },
};
</script>

<style lang="scss" scoped>
.friends {
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
    height: 86%;
    transition: all 0.4s;
    background: url("~@/assets/welfare/bg_communal.png") no-repeat;
    background-size: 100% 100%;
    .head {
      line-height: 45px;
      text-align: center;
      color: #fcf9e8;
      font-size: 20px;
      text-shadow: 0px 1px 3px rgba(208, 108, 32, 0.64);
    }
    .wood {
      position: relative;
      width: 95.2%;
      height: 33px;
      margin: 0 auto;
      background: url("~@/assets/welfare/bg_announcement_mission.png") no-repeat;
      background-size: 100% 100%;
      .help {
        position: absolute;
        left: 15px;
        top: 5px;
        width: 22px;
        height: 24px;
        background: url("~@/assets/welfare/icon_rule.png") no-repeat;
        background-size: 100% 100%;
      }
      .close {
        position: absolute;
        right: -10px;
        top: -10px;
        width: 32px;
        height: 32px;
        background: url("~@/assets/welfare/icon_cllose.png") no-repeat;
        background-size: 100% 100%;
      }
    }
    .content {
      position: relative;
      margin: 0 auto;
      width: 92.53%;
      &-top {
        margin-top: 10px;
        width: 100%;
        height: 141px;
        padding-top: 20px;
        box-sizing: border-box;
        background: url("~@/assets/welfare/bg1_assistance.png") no-repeat;
        background-size: 100% 100%;
        p {
          margin-bottom: 20px;
          width: 100%;
          text-align: center;
          font-size: 15px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 600;
          color: #a3894c;
          span {
            color: #ff7938;
          }
        }
        ul {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-around;
          li {
            img {
              width: 50px;
              height: 50px;
              border-radius: 50%;
            }
          }
        }
      }
      &-mid {
        position: absolute;
        left: 20px;
        top: 114px;
        width: 307px;
        height: 44px;
        background: url("~@/assets/welfare/img_srting_assistance.png") no-repeat;
        background-size: 100% 100%;
      }
      &-footer {
        width: 100%;
        height: calc(100vh - 340px);
        padding-top: 30px;
        box-sizing: border-box;
        background: url("~@/assets/welfare/bg_renwu.png") no-repeat;
        background-size: 100% 100%;
        ul {
          width: 100%;
          height: calc(100vh - 380px);
          overflow: scroll;
          li {
            width: 325px;
            height: 73px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-around;
            border-bottom: 1px solid rgba(200, 176, 150, 0.41);
            .pic-box {
              width: 50px;
              height: 50px;
              border-radius: 50%;
              img {
                width: 50px;
                height: 50px;
              }
            }
            .info {
              display: flex;
              align-items: center;
              img {
                width: 50px;
                height: 50px;
              }
              p {
                font-size: 14px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #a3894c;
                span {
                  color: #ff7938;
                }
              }
            }
            .btn {
              &-pic1 {
                width: 100px;
                height: 42px;
                background: url("~@/assets/welfare/bt_orangelight_small.png")
                  no-repeat;
                background-size: 100% 100%;
                text-align: center;
                line-height: 38px;
                font-size: 14px;
                font-family: SourceHanSansCN-Medium, SourceHanSansCN;
                font-weight: 500;
                color: #fff1d0;
                text-shadow: 0px 2px 4px rgba(248, 118, 57, 0.62);
              }
              &-pic2 {
                width: 100px;
                height: 42px;
                background: url("~@/assets/welfare/bt_orange_small.png")
                  no-repeat;
                background-size: 100% 100%;
                text-align: center;
                line-height: 38px;
                font-size: 14px;
                font-family: SourceHanSansCN-Medium, SourceHanSansCN;
                font-weight: 500;
                color: #fff;
                filter: contrast(50%) brightness(150%);
              }
            }
          }
        }
      }
    }
  }
}
</style>