<template>
  <div class="receive-water-popup">
    <div class="mask"></div>
    <div class="panel">
      <img
        class="icon-close"
        src="../assets/mission/icon_cllose.png"
        @click="$emit('close')"
        alt=""
      />
      <div class="head">做任务领水滴</div>
      <div class="tab">
        <div :class="{ active: currentTab === 1 }" @click="switchBar(1)">
          休闲娱乐
        </div>
        <div :class="{ active: currentTab === 2 }" @click="switchBar(2)">
          轻松获得
        </div>
      </div>
      <div class="mission-list">
        <ul v-if="currentTab === 1" class="ul1">
          <li
            class="mission-li"
            v-for="item in gameMissionList"
            :key="item.rid"
          >
            <div class="info">
              <p v-html="item.name"></p>
              <div class="step">
                <div class="left">
                  进度 {{ numToStone(item.process) }}/{{
                    numToStone(item.target)
                  }}
                </div>
                <div class="right">
                  <span>奖励：{{ item.reward }}g</span
                  ><img src="../assets/popup/img_water_alone.png" alt="" />
                </div>
              </div>
            </div>
            <div class="btn-box2">
              <span @click="jump(item)">进行中</span>
            </div>
          </li>
        </ul>
        <ul v-if="currentTab === 2" class="ul2">
          <li
            class="mission-li"
            v-for="item in commonMissionList"
            :key="item.rid"
          >
            <div class="info">
              <p v-html="item.name"></p>
              <div class="step">
                <div class="left">
                  进度 {{ item.process }}/{{ numToStone(item.target) }}
                </div>
                <div class="right">
                  <span>奖励：{{ item.reward }}g</span
                  ><img src="../assets/popup/img_water_alone.png" alt="" />
                </div>
              </div>
            </div>
            <div v-if="item.status === 0" class="btn-box1">
              <span @click="jump(item)">进行中</span>
            </div>
            <div
              v-else-if="item.status === 1"
              class="btn-box2"
              @click="receiveAward(item)"
            >
              <span>领取</span>
            </div>
            <div v-else class="btn-box3">
              <span>已完成</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import util from "../utils/utils";
export default {
  name: "ReceiveWater",
  data() {
    return {
      currentTab: 1,
      // 游戏任务
      gameMissionList: [],
      // 公共任务
      commonMissionList: [],
    };
  },
  created() {
    // 请求任务列表
    this.getGameMissionList();
    this.getCommonMissionList();
  },
  mounted() {},
  methods: {
    //跳转
    jump(item){
      window.location.href = item.url + '?lxt=' + util.getLxt()
    },
    // 切换任务类别
    switchBar(id) {
      this.currentTab = id;
    },
    // 获取游戏任务
    getGameMissionList() {
      this.$axios
        .get("Task/GetTaskList", { params: { kind: 0 } })
        .then((data) => {
          if (data.Result === 0) {
            this.gameMissionList = data.Data.taskinfo;
          }
        });
    },
    // 获取公共任务
    getCommonMissionList() {
      this.$axios
        .get("Task/GetTaskList", { params: { kind: 1 } })
        .then((data) => {
          if (data.Result === 0) {
            this.commonMissionList = data.Data.taskinfo;
          }
        });
    },
    // 领取任务奖励
    receiveAward(item) {
      this.$axios.post("Task/TaskReward", { utid: item.rid }).then((data) => {
        this.$tips.showTips({
          type: 2,
          title: "任务奖励",
          content: data.Msg,
        });
        if (data.Result === 0) {
          this.$store.commit("addTotal", item.reward);
          this.$parent.waterResultType = 3;
          this.$parent.isShowWater = true;
          this.$parent.taskWaterNums = item.reward;
          // 更新任务列表
          this.getCommonMissionList();
        }
      });
    },
    // 处理金额显示
    numToStone(num) {
      return util.toStone(num);
    },
  },
};
</script>

<style lang='scss' scoped>
.receive-water-popup {
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
    padding: 0 22px 0;
    width: 100%;
    height: 94%;
    background: url("../assets/mission/bg_communal.png") no-repeat;
    background-size: 100% 100%;
    transition: all 0.4s;
    box-sizing: border-box;
    .icon-close {
      position: absolute;
      top: 38px;
      right: 0;
      width: 32px;
      height: 32px;
    }
    .head {
      line-height: 40px;
      text-align: center;
      font-size: 20px;
      line-height: 8.24vh;
      color: #fcf9e8;
      text-shadow: 0px 1px 3px rgba(208, 108, 32, 0.64);
    }
    .tab {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1.5vh;
      div {
        width: 160px;
        height: 37px;
        line-height: 36px;
        text-align: center;
        font-size: 15px;
        color: #683104;
        transition: all 0.2s;
        background: url("../assets/mission/bg_mission_nor.png") no-repeat;
        background-size: 100% 100%;
        &.active {
          color: #fff;
          background: url("../assets/mission/bg_mission_sel.png") no-repeat !important;
          background-size: 100% 100% !important;
        }
      }
    }
    .mission-list {
      overflow: hidden;
      padding-top: 4px;
      height: 73vh;
      background: url("../assets/mission/bg_mission_bottom.png") no-repeat;
      background-size: 100% 100%;
      .ul1 {
        overflow-x: hidden;
        overflow-y: scroll;
        padding: 0 15px;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        .mission-li {
          display: flex;
          justify-content: space-around;
          align-items: center;
          margin: 16px 0;
          width: 100%;
          height: 74px;
          border-bottom: 1px solid #c8b096;
          .info {
            & > p {
              overflow: hidden;
              width: 187px;
              font-size: 16px;
              font-weight: 600;
              color: #422921;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .step {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: 4px;
              font-size: 12px;
              color: #999;
              .right {
                display: flex;
                align-items: center;
                img {
                  margin-left: 4px;
                  width: 22px;
                  height: 26px;
                  transform: translateY(2px);
                }
              }
            }
          }
          .btn-box2 {
            width: 65px;
            height: 30px;
            line-height: 28px;
            text-align: center;
            font-size: 14px;
            color: #fff1d0;
            background: url("../assets/mission/bt_orangelight_smaller.png")
              no-repeat;
            background-size: 100% 100%;
            background-position-y: 1px;
            border-radius: 10px;
            box-shadow: 0 4px 5px 1px rgba(248, 118, 57, 0.6);
          }
        }
      }
      .ul2 {
        overflow-x: hidden;
        overflow-y: scroll;
        padding: 0 15px;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        .mission-li {
          display: flex;
          justify-content: space-around;
          align-items: center;
          margin: 16px 0;
          width: 100%;
          height: 74px;
          border-bottom: 1px solid #c8b096;
          .info {
            & > p {
              overflow: hidden;
              width: 187px;
              font-size: 16px;
              font-weight: 600;
              color: #422921;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .step {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: 4px;
              font-size: 12px;
              color: #999;
              .right {
                display: flex;
                align-items: center;
                img {
                  margin-left: 4px;
                  width: 22px;
                  height: 26px;
                  transform: translateY(2px);
                }
              }
            }
          }
          .btn-box1,
          .btn-box2,
          .btn-box3 {
            width: 65px;
            height: 30px;
            line-height: 28px;
            text-align: center;
            font-size: 14px;
            color: #fff1d0;
            background: url("../assets/mission/bt_orangelight_smaller.png")
              no-repeat;
            background-size: 100% 100%;
            background-position-y: 1px;
            border-radius: 10px;
            box-shadow: 0 4px 5px 1px rgba(248, 118, 57, 0.6);
          }
          .btn-box2 {
            color: #b2330d;
            background: url("../assets/mission/lingqu.png") no-repeat;
            background-size: 100% 100%;
            box-shadow: 0 2px 4px 1px rgba(255, 200, 69, 0.6);
          }
          .btn-box3 {
            background: url("../assets/mission/bt_finished.png") no-repeat;
            background-size: 100% 100%;
            box-shadow: none;
          }
        }
      }
    }
  }
}
</style>
