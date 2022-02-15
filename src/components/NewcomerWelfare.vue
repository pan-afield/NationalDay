<template>
  <div class="newcomer-welfare-popup">
    <div class="mask"></div>
    <div class="panel">
      <div class="head">国庆新人专属福利</div>
      <div class="content">
        <div class="close" @click="closeAll()"></div>
        <div class="free-award">
          <div class="free-item">
            <p class="time" v-if="boxInfo1.status === -1">
              {{ startTime1 }}~{{ endTime1 }}
            </p>
            <div class="get" v-else-if="boxInfo1.status === 0">可领取</div>
            <div class="geted" v-else-if="boxInfo1.status === 1">已领取</div>
            <img
              @click="getBoxReward(boxInfo1.rid)"
              v-if="boxInfo1.status === 0"
              class="reward-box"
              src="@/assets/welfare/img_bluekettle_sel.png"
              alt=""
            />
            <img
              v-else
              class="reward-box"
              src="@/assets/welfare/img_bluekettle_nor.png"
              alt=""
            />

            <div class="finger" v-if="boxInfo1.status === 0"></div>
            <p class="reward-text">
              <span>{{ boxInfo1.reward }}g</span>水滴
            </p>
          </div>
          <div class="free-item">
            <p class="time" v-if="boxInfo2.status === -1">
              {{ startTime2 }}~{{ endTime2 }}
            </p>
            <div class="get" v-else-if="boxInfo2.status === 0">可领取</div>
            <div class="geted" v-else-if="boxInfo2.status === 1">已领取</div>
            <img
              @click="getBoxReward(boxInfo2.rid)"
              v-if="boxInfo2.status === 0"
              class="reward-box"
              src="@/assets/welfare/img_greenkettle_sel.png"
              alt=""
            />
            <img
              v-else
              class="reward-box"
              src="@/assets/welfare/img_greenkettle_nor.png"
              alt=""
            />
            <div class="finger" v-if="boxInfo2.status === 0"></div>
            <p class="reward-text">
              <span>{{ boxInfo2.reward }}g</span>水滴
            </p>
          </div>
        </div>
        <ul>
          <li v-for="(item, index) in taskInfo" :key="index">
            <!-- <div class="pic">
              <img
                :src="require(`@/assets/welfare/icon_welfare01.png`)"
                alt=""
              />
            </div> -->
            <div class="info">
              <p v-html="item.name"></p>
              <div class="step">
                <div class="left">
                  奖励<img src="@/assets/popup/img_water@2x.png" alt="" /><span
                    >{{ item.reward }}g</span
                  >
                </div>
                <!-- <div class="right">
                  <img src="@/assets/welfare/icon_lebi.png" alt="" /><span
                    >500万</span
                  >
                </div> -->
              </div>
            </div>
            <div class="btn">
              <p>{{ item.process }}/{{ item.target }}</p>
              <div class="box">
                <div
                  class="box-orange"
                  @click="getNewerTask(item)"
                  v-if="item.status === 1"
                >
                  领取
                </div>
                <div class="box-green" v-else-if="item.status === 0">
                  <a :href="item.url">前往</a>
                </div>
                <div class="box-gray" v-else-if="item.status === 2">完成</div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NewcomerWelfare",
  components: {},
  props: {},
  data() {
    return {
      startTime1: "",
      startTime2: "",
      endTime1: "",
      endTime2: "",
      boxInfo1: {},
      boxInfo2: {},
      taskInfo: [],
      boxInfo: [],
    };
  },
  computed: {},
  created() {
    this.getBoxList();
    this.getTaskList();
  },
  mounted() {},
  methods: {
    //领取新手任务
    getNewerTask(item) {
      this.$axios.post("Task/TaskReward", { utid: item.rid }).then((res) => {
        if (res.Result === 0) {
          this.$store.commit("addTotal", item.reward);
          this.$parent.waterResultType = 3;
          this.$parent.isShowWater = true;
          this.$parent.taskWaterNums = res.Data.reward;
        } else {
          this.$tips.showTips({
            title: "提示",
            content: res.Msg,
            type: 3,
          });
        }
        this.getTaskList()
      });
    },
    //获取宝箱奖励
    getBoxReward(rid) {
      this.$axios.post("/Box/BoxReward", { rid }).then((res) => {
        if (res.Result === 0) {
          this.$store.commit("addTotal", res.Data.reward);
          this.$parent.waterResultType = 2;
          this.$parent.isShowWater = true;
          this.$parent.getWaterNums = res.Data.reward;
        } else {
          this.$tips.showTips({
            title: "提示",
            content: res.Msg,
            type: 3,
          });
        }
        this.getBoxList()
      });
    },
    closeAll() {
      this.$parent.isShowNewcomerWelfare = false;
    },
    //请求任务列表
    getTaskList() {
      this.$axios
        .get("Task/GetTaskList", { params: { kind: 2 } })
        .then((res) => {
          this.taskInfo = res.Data.taskinfo;
          // console.log(res);
        });
    },
    //请求宝箱列表
    getBoxList() {
      this.$axios.get("Box/GetBoxList").then((res) => {
        this.boxInfo = res.Data.boxinfo;
        this.boxInfo1 = res.Data.boxinfo[0];
        this.boxInfo2 = res.Data.boxinfo[1];
        this.startTime1 = res.Data.boxinfo[0].starttime.substring(11, 16);
        this.endTime1 = res.Data.boxinfo[0].endtime.substring(11, 16);
        this.startTime2 = res.Data.boxinfo[1].starttime.substring(11, 16);
        this.endTime2 = res.Data.boxinfo[1].endtime.substring(11, 16);
      });
    },
  },
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
.newcomer-welfare-popup {
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
    background: url("~@/assets/welfare/bg_communal.png") no-repeat;
    background-size: 100% 100%;
    transition: all 0.4s;
    .head {
      line-height: 55px;
      text-align: center;
      font-size: 16px;
      color: #fcf9e8;
      text-shadow: 0px 1px 3px rgba(208, 108, 32, 0.64);
    }
    .content {
      position: relative;
      margin: 0 auto;
      padding-top: 50px;
      width: 88.8%;
      height: calc(100vh - 215px);
      background: url("~@/assets/welfare/bg_renwu.png") no-repeat;
      background-size: 100% 100%;
      .close {
        position: absolute;
        right: -15px;
        top: -15px;
        width: 32px;
        height: 32px;
        background: url("~@/assets/welfare/icon_cllose.png") no-repeat;
        background-size: 100% 100%;
      }
      .free-award {
        width: 300px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        height: 120px;
        margin: 0 auto;
        border-bottom: 1px solid rgba(200, 176, 150, 0.41);
        .free-item {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          .finger {
            position: absolute;
            left: 74px;
            top: 70px;
            width: 46px;
            height: 46px;
            background: url("~@/assets/welfare/guide_zy.png") no-repeat;
            background-size: 100% 100%;
            animation: fingerMoveing 1s ease infinite both;
          }
          .geted,
          .get,
          .time {
            width: 117px;
            height: 21px;
            background: linear-gradient(108deg, #fce8c3 0%, #fce8c3 100%);
            border-radius: 9px;
            text-align: center;
            line-height: 21px;
            font-size: 14px;
            color: #a3894c;
          }
          .geted {
            color: #666;
          }
          .get {
            color: #ff7938;
          }
          .reward-box {
            width: 100px;
            height: 80px;
          }
          .reward-text {
            margin-bottom: 10px;
            width: 100%;
            font-size: 14px;
            text-align: center;
            font-weight: 500;
            color: #a3894c;
            span {
              color: #ff7938;
            }
          }
        }
      }
      ul {
        width: 100%;
        height: 320px;
        overflow: scroll;
        li {
          width: 300px;
          margin: 0 auto;
          height: 80px;
          border-bottom: 1px solid rgba(200, 176, 150, 0.41);
          display: flex;
          align-items: center;
          justify-content: space-between;
          .pic {
            img {
              width: 52px;
              height: 52px;
              border: 50%;
            }
          }
          .info {
            p {
              font-size: 16px;
              font-weight: 600;
              font-size: 16px;
              color: #422921;
            }
            .step {
              display: flex;
              align-items: center;
              justify-content: space-between;
              font-size: 12px;
              color: #999999;
              .left {
                display: flex;
                align-items: center;
                img {
                  width: 14px;
                  height: 18px;
                }
              }
              .right {
                display: flex;
                align-items: center;
                img {
                  width: 13px;
                  height: 14px;
                }
              }
            }
          }
          .btn {
            p {
              text-align: center;
              font-size: 12px;
              color: #999999;
              line-height: 17px;
            }
            .box {
              width: 83px;
              height: 36px;
              &-orange {
                text-align: center;
                line-height: 30px;
                width: 83px;
                margin: 0 auto;
                height: 36px;
                background: url("~@/assets/welfare/bt_orange_small.png")
                  no-repeat;
                background-size: 100% 100%;
                font-size: 14px;
                color: #ffffff;
                text-shadow: 0px 2px 4px rgba(248, 150, 57, 0.7);
              }
              &-green {
                text-align: center;
                line-height: 30px;
                width: 83px;
                margin: 0 auto;
                height: 36px;
                background: url("~@/assets/welfare/bt_leave.png") no-repeat;
                background-size: 100% 100%;
                font-size: 14px;
                color: #ffffff;
                a {
                  display: block;
                  width: 83px;
                  height: 36px;
                  color: #ffffff;
                }
              }
              &-gray {
                text-align: center;
                line-height: 30px;
                width: 68px;
                margin: 0 auto;
                height: 30px;
                background: url("~@/assets/welfare/bt_finished.png") no-repeat;
                background-size: 100% 100%;
                font-size: 14px;
                color: #ffffff;
              }
            }
          }
        }
      }
    }
  }
}
</style>
