<template>
  <div class="change-award-popup">
    <div class="mask"></div>
    <div class="panel">
      <div class="top-img">
        <img
          class="close"
          src="../assets/popup/icon_close.png"
          @click="$emit('close')"
          alt=""
        />
        <div class="choose">请先选择您想要的奖品</div>
      </div>
      <div class="tab-bar" ref="tabBar">
        <div
          :class="{ active: currentBar === 1, first: true }"
          @click="changeBar(1)"
        >
          热门兑换
        </div>
        <div :class="{ active: currentBar === 2 }" @click="changeBar(2)">
          实物一
        </div>
        <div :class="{ active: currentBar === 3 }" @click="changeBar(3)">
          实物二
        </div>
        <div :class="{ active: currentBar === 4 }" @click="changeBar(4)">
          虚拟物品
        </div>
      </div>
      <div class="award-container">
        <ul>
          <li
            class="award-item"
            v-for="(item, index) in awardSort"
            :key="index"
          >
            <div class="top">
              <img :src="item.imgurl" alt="" />
            </div>
            <p class="award-text">{{ item.name }}</p>
            <div class="price-box">
              <div class="price">
                <span v-if="item.kind === 0" class="lb"
                  >{{ numToStone(item.nums) }}乐币</span
                >
                <span v-else>{{ item.price }}元</span>
              </div>
              <div
                v-if="item.status === 0"
                class="select-btn"
                @click="selectAward(item)"
              >
                可更换
              </div>
              <div v-else-if="item.status === -2" class="select-btn select">
                已兑完
              </div>
              <div v-else-if="item.status === -1" class="select-btn select">
                已下架
              </div>
              <div v-else class="select-btn select">已选择</div>
            </div>
            <p class="need">需要{{ numToStone(item.warters) }}水滴即可兑换</p>
          </li>
        </ul>
      </div>
      <!-- 选择奖品的弹窗 -->
      <div v-if="isShowSelect" class="select-award-container">
        <div class="mask-in"></div>
        <div v-if="isChangeSuccess" class="select-main">
          <div class="header">{{ true ? "选择奖品" : "更换奖品" }}</div>
          <p class="select-text">您选择了{{ currentSelAward.name }}</p>
          <img class="award-show" :src="currentSelAward.imgurl" alt="" />
          <p v-if="newNum !== 2" class="tip-message">
            活动每日只有1次重新选择奖品的次数请慎重选择
          </p>
          <p v-else class="tip-message">
            若当前选择奖品[iphone 13]库存不足时，系统会自动为您替换其它奖品
          </p>
          <div class="bot-btn">
            <div class="left" @click="noExchange" v-if="newNum !== 2">
              不更换
            </div>
            <div class="right" @click="confirm">确定</div>
          </div>
        </div>
        <div v-else class="select-main">
          <div class="header">更换奖品</div>
          <div class="fail-tips">很抱歉，您今日更换奖品的次数已使用完毕</div>
          <div class="know-btn" @click="isShowSelect = false">我知道了</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import util from "../utils/utils";

export default {
  name: "ChangeAward",
  props: {
    newNum: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      currentBar: 1,
      // 当前点击的奖品
      currentSelAward: { rid: 1 },
      // 热门兑换
      awardList1: [],
      // 分类1
      awardList2: [],
      // 分类2
      awardList3: [],
      // 分类3
      awardList4: [],
      // 控制选择奖品弹窗显示隐藏
      isShowSelect: false,
      // 是否有更换奖品次数，切换不同弹窗
      isChangeSuccess: true,
    };
  },
  computed: {
    treeFindResult() {
      let arr = [
        ...this.awardList1,
        ...this.awardList2,
        ...this.awardList3,
        ...this.awardList4,
      ];
      let result = arr.find((item) => item.status === 1);
      return result;
    },
    // 当前选中的分类
    awardSort() {
      const obj = {
        1: this.awardList1,
        2: this.awardList2,
        3: this.awardList3,
        4: this.awardList4,
      };
      return obj[this.currentBar];
    },
  },
  created() {
    // 请求奖品列表
    this.getAwardList();
  },
  methods: {
    // 切换奖品分类
    changeBar(id) {
      this.currentBar = id;
    },
    // 请求奖品列表
    getAwardList() {
      this.$axios.get("Gift/GetGiftList").then((data) => {
        if (data.Result === 0) {
          // 赋值奖品分类
          const resList = data.Data.giftlist;
          this.awardList1 = resList.filter(
            (item) => item.kind === 3 || item.kind === 4
          );
          this.awardList2 = resList.filter((item) => item.kind === 2);
          this.awardList3 = resList.filter((item) => item.kind === 1);
          this.awardList4 = resList.filter((item) => item.kind === 0);
        }
      });
    },
    // 点击选择奖品
    selectAward(item) {
      this.currentSelAward = item;
      this.isShowSelect = true;
    },
    // 不更换
    noExchange() {
      // if (this.newNum === 2) return;
      this.isShowSelect = false;
    },
    // 确认更换奖励
    confirm() {
      const id = this.currentSelAward.rid;
      // 判断是否已经选择种树奖品, 发起不同请求
      if (this.treeFindResult) {
        // console.log(this.currentSelAward);
        // 发起更换奖品请求
        this.$axios
          .post("Gift/ChangeGift", {
            giftid: id,
          })
          .then((data) => {
            this.isShowSelect = false;
            // 弹窗提示结果
            this.$tips.showTips({
              type: 2,
              title: "更换奖品",
              content: data.Msg,
            });
            if (data.Result === 0) {
              // 成功后更新奖品列表
              this.getAwardList();
              this.$emit("refresh");
            }
          });
      } else {
        // 发起选择奖品请求
        this.$axios
          .post("Tree/PlantTrees", {
            giftid: id,
          })
          .then((data) => {
            if (this.newNum === 2) {
              this.$emit("changeNum");
              this.$parent.isShowChangeAward = false;
            }
            this.isShowSelect = false;
            // 弹窗提示结果
            this.$tips.showTips({
              type: 2,
              title: "选择奖品",
              content: data.Msg,
            });
            if (data.Result === 0) {
              // 成功后更新奖品列表
              this.getAwardList();
              this.$emit("refresh");
            }
          });
      }
    },
    // 处理金额显示
    numToStone(num) {
      return util.toStone(num);
    },
  },
};
</script>

<style lang='scss' scoped>
.change-award-popup {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
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
    background-color: #fff;
    transition: all 0.4s;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    .top-img {
  overflow-x: hidden;
  overflow-y: hidden;
      position: relative;
      width: 100%;
      height: 140px;
      background: url("../assets/popup/img_banner_Plant trees01@2x.png")
        no-repeat;
      background-size: 100% 100%;
      .close {
        position: absolute;
        top: 16px;
        right: 16px;
        width: 24px;
        height: 24px;
      }
      .choose {
        margin: 100px auto 0;
        width: 200px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        font-size: 14px;
        color: #f9f7e2;
        background: url("../assets/popup/img_banner_Select box@2x.png")
          no-repeat;
        background-size: 100% 100%;
      }
    }
    .tab-bar {
      width: 100%;
      height: 30px;
      background: #43ab5d;
      white-space: nowrap;
      div {
        display: inline-block;
        position: relative;
        width: 25%;
        text-align: center;
        line-height: 30px;
        font-size: 14px;
        color: #fff;
        text-shadow: 0px 1px 3px rgba(0, 58, 15, 0.6);
        &.active {
          font-size: 18px;
          &::after {
            content: "";
            position: absolute;
            top: 25px;
            left: 50%;
            width: 42%;
            height: 4px;
            background-color: #e7f9e2;
            border-radius: 4px;
            transform: translateX(-50%);
            box-shadow: 0px 1px 3px rgba(0, 58, 15, 0.6);
          }
        }
      }
    }
    .award-container {
      overflow-y: scroll;
      width: 100%;
      height: 61vh;
      padding-bottom: 15px;
      background: linear-gradient(180deg, #76c362 0%, #2ebf6e 100%);
      box-sizing: border-box;
      ul {
        display: flex;
        justify-content: space-evenly;
        flex-wrap: wrap;
        margin: auto;
        .award-item {
  overflow-x: hidden;
  overflow-y: hidden;
          position: relative;
          margin-top: 15px;
          width: 166px;
          height: 238px;
          border-radius: 6px;
          background-color: #fff;
          .top {
            width: 100%;
            height: 152px;
            padding: 4px;
            box-sizing: border-box;
            background-color: #a9ecb0;
            img {
              width: 100%;
              height: 100%;
              background-color: #fff;
            }
          }
          .award-text {
            margin-top: 6px;
            text-align: left;
            font-weight: bold;
            font-size: 14px;
            white-space: nowrap;
            padding-left: 8px;
          }
          .price-box {
            display: flex;
            justify-content: space-around;
            align-items: center;
            height: 36px;
            .price {
              color: #f87a39;
              font-size: 12px;
              span {
                margin-right: 3px;
                font-size: 18px;
                &.lb {
                  font-size: 15px;
                }
              }
            }
            .select-btn {
              width: 80px;
              height: 24px;
              text-align: center;
              line-height: 26px;
              font-size: 13px;
              color: #fff;
              background: #43ab5d;
              border-radius: 30px;
              &.select {
                background: #cfd1d4 !important;
              }
            }
          }
          .need {
            position: absolute;
            left: 50%;
            bottom: 0;
            transform: translateX(-50%);
            width: 100%;
            height: 24px;
            text-align: center;
            line-height: 24px;
            background: #e7f9e2;
            font-size: 12px;
            color: #43ab5d;
          }
        }
      }
    }
    .select-award-container {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      .mask-in {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(13, 12, 12, 0.6);
        transition: all 0.2s;
        z-index: 3;
      }
      .select-main {
        position: absolute;
        top: 150px;
        left: 50%;
        transform: translateX(-50%);
        width: 300px;
        height: 270px;
        background-color: #fff;
        border-radius: 10px;
        z-index: 4;
        .header {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 190px;
          height: 36px;
          text-align: center;
          line-height: 36px;
          font-size: 18px;
          color: #fff;
          text-shadow: -1.2246468525851679e-16px 1px 2px rgba(0, 58, 15, 0.6);
          background: url("../assets/popup/head_bg.png") no-repeat;
          background-size: 100% 100%;
        }
        .select-text {
          margin-top: 35px;
          text-align: center;
          font-size: 16px;
        }
        .award-show {
          display: block;
          margin: 12px auto;
          width: 80px;
          height: 80px;
        }
        .tip-message {
          margin: auto;
          width: 245px;
          text-align: center;
          font-size: 14px;
          line-height: 22px;
          color: #666666;
        }
        .bot-btn {
          display: flex;
          justify-content: space-around;
          position: absolute;
          bottom: 16px;
          left: 0;
          width: 100%;
          div {
            width: 110px;
            height: 36px;
            font-size: 14px;
            line-height: 36px;
            text-align: center;
            border-radius: 36px;
          }
          .left {
            color: #43ab5d;
            border: 1px solid #43ab5d;
          }
          .right {
            color: #fff;
            background: #43ab5d;
          }
        }
        .fail-tips {
          margin: 70px auto;
          width: 192px;
          height: 50px;
          text-align: center;
          line-height: 30px;
          font-size: 16px;
          color: #333333;
        }
        .know-btn {
          margin: auto;
          width: 160px;
          height: 36px;
          line-height: 36px;
          font-size: 14px;
          text-align: center;
          color: #fff;
          background: #43ab5d;
          border-radius: 36px;
        }
      }
    }
  }
}
</style>
