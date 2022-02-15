<template>
  <div class="home">
    <div class="main">
      <!-- <p class="tst">暗红色的卡号是客户发卡怪卡巴卡巴卡巴看</p> -->
      <img
        v-if="wateringMove"
        class="energy_watering"
        src="@/assets/home_img/energy_watering.gif"
        alt=""
      />
      <div class="head">
        <div class="head-left" @click="back"></div>
        <div class="head-center"></div>
        <div class="head-right" @click="showRules">
          <img src="@/assets/home_img/icon_rule.png" alt="" />说明
        </div>
      </div>
      <div :class="{ broadcast: true, unfold: isUnfold }">
        <div :class="{ broadcast_scroll: true, unfoldtow: isUnfold }">
          <vue-seamless-scroll
            :data="dataList"
            :class-option="defaultOption"
            :class="{ 'seamless-warp2': true, unfoldtow: isUnfold }"
          >
            <ul class="item">
              <li v-for="(item, index) in dataList" :key="index">
                <!-- <img src="" alt="" /> -->
                <p v-html="item.content">杀杀杀<span>g</span></p>
              </li>
            </ul>
          </vue-seamless-scroll>
        </div>
        <div :class="{ broadcast_icon: true, unfoldthree: isUnfold }">
          <span @click="isUnfold = !isUnfold" v-if="!isUnfold"
            >点击查看更多</span
          >
          <span @click="isUnfold = !isUnfold" v-else>点击收起</span>
          <div class="icon" @click="isUnfold = !isUnfold"></div>
        </div>
      </div>
      <div class="options-right">
        <div class="rank" @click="isShowRankingList = true"></div>
        <div class="myBag" @click="isShowMyGoods = true"></div>
        <div class="changeGift" @click="isShowChangeAward = true"></div>
        <div class="energy" @click="watering">
          <div class="water" v-if="!wateringMove"></div>
          <div class="content">
            <p>{{ $store.state.totalNums }}g</p>
          </div>
        </div>
        <div class="getWater" @click="isShowReceiveWater = true"></div>
        <div class="luckyDraw" @click="isShowLottery = true"></div>
      </div>
      <div class="options-bottom">
        <div class="newGuy" v-if="newGuy">
          <div class="content" @click="isShowNewcomerWelfare = true">
            <div class="tips">
              <p>专属</p>
            </div>
          </div>
        </div>
        <div class="signIn" @click="isShowSignIn = true">
          <div class="tips">
            <p>可领取</p>
          </div>
        </div>
        <div class="friends" @click="isShowWaterRecord = true">
          <!-- <div class="tips">
            <p>差2人</p>
          </div> -->
        </div>
      </div>
      <div class="mid">
        <div class="mid-speak" v-if="isShowSpeak">
          <p v-if="speakType === 1">{{ offical.normal[randomNum] }}</p>
          <p v-if="speakType === 2">{{ offical.watering[randomNum] }}</p>
        </div>
        <div class="mid-sign">
          <p v-if="treeStatus === 0">树苗发芽了！</p>
          <p v-else-if="treeStatus === 1">变成幼苗啦！</p>
          <p v-else-if="treeStatus === 2">我快开花了！</p>
          <p v-else-if="treeStatus === 3">再努努力哦！</p>
          <p v-else-if="treeStatus === 4">快要成熟了！</p>
          <p v-else-if="treeStatus === 5">该摘取果实了</p>
          <p v-else>快选择奖品吧</p>
        </div>
        <div class="mid-land" v-if="!newNum" @click="toPlantTree">
          <div class="static" v-if="!treeMoveShow">
            <div @click="clickTree" class="seed" v-if="treeStatus === 0"></div>
            <div
              @click="clickTree"
              class="tree"
              v-else-if="treeStatus === 1"
            ></div>
            <div
              @click="clickTree"
              class="sapling"
              v-else-if="treeStatus === 2"
            ></div>
            <div
              @click="clickTree"
              class="bloom"
              v-else-if="treeStatus === 3"
            ></div>
            <div
              @click="clickTree"
              class="result"
              v-else-if="treeStatus === 4 || treeStatus === 5"
            ></div>
            <div class="" v-else></div>
          </div>
          <div class="move" v-else>
            <img
              v-show="treeStatus === 0"
              class="seedMoveing"
              src="@/assets/home_img/seed_moveing.gif"
              alt=""
            />
            <img
              v-show="treeStatus === 1"
              class="treeMoveing"
              src="@/assets/home_img/tree_moveing.gif"
              alt=""
            />
            <img
              v-show="treeStatus === 2"
              class="saplingMoveing"
              src="@/assets/home_img/spaling_moveing.gif"
              alt=""
            />
            <img
              v-show="treeStatus === 3"
              class="bloomMoveing"
              src="@/assets/home_img/bloom_moveing.gif"
              alt=""
            />
            <img
              v-show="treeStatus === 4 || treeStatus === 5"
              class="resultMoveing"
              src="@/assets/home_img/result_moveing.gif"
              alt=""
            />
          </div>
        </div>
        <div class="mid-step" v-if="treeStatus < 5">
          <div class="box">
            <div class="content">
              <div id="step" :style="{ width: stepLeft }"></div>
            </div>
          </div>
        </div>
        <div class="mid-btn" v-if="treeStatus === 5" @click="pickFriut">
          点击摘取
        </div>
        <div class="mid-tips" v-if="treeInfo">
          <span :class="{ result: treeStatus === 5 }">{{
            treeInfo.remark
          }}</span>
        </div>
      </div>
    </div>
    <!-- 领取水滴弹框 -->
    <transition name="harvest">
      <div class="waterTips" v-if="isShowWater">
        <div class="mask"></div>
        <div class="content">
          <div class="info">
            <div class="success" v-if="waterResultType === 1">
              <p>摘取成功!</p>
            </div>
            <div class="success" v-else-if="waterResultType === 2">
              <p>领取水滴成功!</p>
              <p>
                <span>{{ getWaterNums }}g</span>水滴已到账
              </p>
            </div>
            <div class="success" v-else>
              <p>恭喜您完成了任务!</p>
              <p>
                <span>{{ taskWaterNums }}g</span>水滴已到账
              </p>
            </div>
          </div>
          <div class="center">
            <div class="result" v-if="waterResultType === 1"></div>
            <div class="water" v-else></div>
          </div>
          <div class="some">
            <div class="success" v-if="waterResultType === 1">
              <p>前往我的物品兑换</p>
            </div>
            <div class="success" v-else-if="waterResultType === 2">
              <p>
                活动期间每日<span>12:00~14:00</span> <span>20:00~22:00</span>
              </p>
              <p>都可以来领水滴哦</p>
            </div>
            <div class="success" v-else>
              <p>
                您共计有<span>{{ $store.state.totalNums }}g</span>水滴
              </p>
            </div>
          </div>
          <div class="btn">
            <p
              v-if="waterResultType === 1"
              @click="(isShowMyGoods = true), (isShowWater = false)"
            >
              立即前往
            </p>
            <p v-else @click="isShowWater = false">我知道啦</p>
          </div>
          <div class="close" @click="isShowWater = false"></div>
        </div></div
    ></transition>
    <!-- 分享弹框 -->
    <div class="shareTips" v-if="isShowShare">
      <div class="mask"></div>
      <div class="box">
        <div class="close" @click="isShowShare = false"></div>
        <div class="title">分享成功</div>
        <img src="@/assets/welfare/img_share.png" alt="" />
        <p>分享成功！</p>
        <p>快通知好友们为你助力吧~</p>
        <div class="btn">继续分享</div>
      </div>
    </div>
    <!-- 助力说明 -->
    <div class="explainTips" v-if="isShowExplain">
      <div class="mask"></div>
      <div class="box">
        <div class="close" @click="isShowExplain = false"></div>
        <div class="title">助力说明</div>
        <p>11111</p>
        <p>11111</p>
      </div>
    </div>
    <!-- 温馨提示 -->
    <div class="warmTips" v-if="isShowWarm">
      <div class="mask"></div>
      <div class="box">
        <div class="close" @click="isShowWarm = false"></div>
        <div class="title">温馨提示</div>
        <p>切勿贪心</p>
        <p v-text="a === 3 ? '1' : '2'">该时段水滴您已经领取过啦~</p>
      </div>
    </div>
    <!-- 新手引导 -->
    <div class="newGuide" v-if="guide && newNum !== 0">
      <div class="mask" id="mask"></div>
      <div class="step" @click="newGuide(newNum)">
        <div class="done" v-if="newNum === 4">
          <img src="@/assets/new_img/icon_complete@2x.png" alt="" />
        </div>
        <div class="next" v-else>
          <img src="@/assets/new_img/icon_Nextstep@2x.png" alt="" />
        </div>
      </div>
      <div
        :class="{
          finger: true,
          finger1: newNum === 1,
          finger2: newNum === 2,
          finger3: newNum === 3,
          finger4: newNum === 4,
        }"
        @click="newGuide(newNum)"
      >
        <img src="@/assets/new_img/img_hand02@2x.png" alt="" />
      </div>
      <div class="one" v-if="newNum === 1" @click="newGuide(1)">
        <p>iPhone13</p>
        <img class="select" src="@/assets/new_img/img_guide_01@2x.png" alt="" />
        <img class="gift" src="@/assets/new_img/img_prize@2x.png" alt="" />
      </div>
      <div class="two" v-else-if="newNum === 2" @click="newGuide(2)">
        <img src="@/assets/new_img/img_guide_02@2x.png" alt="" />
      </div>
      <div class="three" v-else-if="newNum === 3" @click="newGuide(3)">
        <img class="guide" src="@/assets/new_img/img_guide_03@2x.png" alt="" />
        <img class="tree" src="@/assets/home_img/seed.png" alt="" />
        <img
          class="water"
          v-if="!wateringMove"
          src="@/assets/new_img/icon_mywater@2x.png"
          alt=""
        />
        <img class="land" src="@/assets/new_img/icon_myland.png" alt="" />
      </div>
      <div class="four" v-else-if="newNum === 4" @click="newGuide(4)">
        <img class="guide" src="@/assets/new_img/img_guide_04@2x.png" alt="" />
        <img class="tree" src="@/assets/new_img/img_sprout.png" alt="" />
        <img class="water" src="@/assets/new_img/icon_bringwater.png" alt="" />
        <img class="land" src="@/assets/new_img/icon_myland.png" alt="" />
      </div>
    </div>
    <!-- 新人福利 -->
    <transition name="popup">
      <newcomer-welfare v-if="isShowNewcomerWelfare" />
    </transition>
    <!-- 我的物品 -->
    <transition name="popup">
      <my-goods v-if="isShowMyGoods" @close="isShowMyGoods = false" />
    </transition>
    <!-- 水滴抽奖 -->
    <transition name="popup">
      <water-lottery
        v-if="isShowLottery"
        @close="isShowLottery = false"
        @to-mine="goToMyGoods"
      />
    </transition>
    <!-- 排行榜 -->
    <transition name="popup">
      <ranking-list
        v-if="isShowRankingList"
        @close="isShowRankingList = false"
      />
    </transition>
    <!-- 更换奖品 -->
    <transition name="popup">
      <change-award
        ref="changeAward"
        v-if="isShowChangeAward"
        :treeInfo="treeInfo"
        :newNum="newNum"
        @changeNum="changeNum"
        @close="isShowChangeAward = false"
        @refresh="getTreeInfo"
      />
    </transition>
    <!-- 签到 -->
    <transition name="popup">
      <sign-in v-if="isShowSignIn" />
    </transition>
    <!-- 好友互助 -->
    <transition name="popup">
      <friends v-if="isShowFriends" />
    </transition>
    <!-- 领水滴 -->
    <transition name="popup">
      <receive-water
        v-if="isShowReceiveWater"
        @close="isShowReceiveWater = false"
      />
    </transition>
    <!-- 水滴记录 -->
    <transition name="popup">
      <water-record v-if="isShowWaterRecord" />
    </transition>
  </div>
</template>

<script>
import utils from "@/utils/utils";
// 子组件
import waterRecord from "@/components/WaterRecord";
import MyGoods from "@/components/MyGoods";
import WaterLottery from "@/components/WaterLottery";
import RankingList from "@/components/RankingList";
import NewcomerWelfare from "@/components/NewcomerWelfare";
import ChangeAward from "@/components/ChangeAward";
import SignIn from "@/components/SignIn";
import Friends from "@/components/Friends";
import ReceiveWater from "@/components/ReceiveWater";

export default {
  components: {
    MyGoods,
    WaterLottery,
    RankingList,
    NewcomerWelfare,
    ChangeAward,
    SignIn,
    Friends,
    ReceiveWater,
    waterRecord,
  },
  computed: {
    defaultOption() {
      return {
        step: 0.3, // 数值越大速度滚动越快
        limitMoveNum: this.dataList.length, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: this.liHeight, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 3000, // 单步运动停止的时间(默认值1000ms)
      };
    },
  },
  data() {
    return {
      treeMoveShow: false,
      isUnfold: false, //是否展开
      getWaterNums: "", //领取水滴数
      taskWaterNums: "", //任务水滴数
      waterResultType: 3,
      guide: false,
      offical: {},
      randomNum: 0,
      speakType: 1,
      isShowSpeak: false,
      stepLeft: 0,
      treeStatus: "",
      treeInfo: {},
      wateringMove: false, //浇水动画
      newNum: 0, //新手步骤
      newGuy: false, //新人
      liHeight: "", //单个li高度
      dataList: [], //轮播
      // 控制弹出层显示隐藏
      isShowWaterRecord: false,
      isShowReceiveWater: false,
      isShowNewcomerWelfare: false,
      isShowMyGoods: false,
      isShowLottery: false,
      isShowRankingList: false,
      isShowChangeAward: false,
      isShowSignIn: false,
      isShowTips: false,
      isShowFriends: false,
      isShowShare: false,
      isShowExplain: false,
      isShowWarm: false,
      isShowWater: false,
    };
  },
  methods: {
    //点击土地去更换物品
    toPlantTree() {
      if (!this.treeInfo) {
        this.isShowChangeAward = true;
      }
    },
    //点击树苗
    clickTree() {
      this.speakType = 1;
      this.treeSpeak();
      this.treeMove();
    },
    //树抽搐动画
    treeMove() {
      this.treeMoveShow = true;
      setTimeout(() => {
        this.treeMoveShow = false;
        let imgUrl0 = document.querySelector(".seedMoveing");
        let imgUrl1 = document.querySelector(".treeMoveing");
        let imgUrl2 = document.querySelector(".saplingMoveing");
        let imgUrl3 = document.querySelector(".bloomMoveing");
        let imgUrl4 = document.querySelector(".resultMoveing");
        imgUrl0.src =
          "@/assets/home_img/seed_moveing.gif" +
          "?time=" +
          new Date().getTime();
        imgUrl1.src =
          "@/assets/home_img/tree_moveing.gif" +
          "?time=" +
          new Date().getTime();
        imgUrl2.src =
          "@/assets/home_img/sapling_moveing.gif" +
          "?time=" +
          new Date().getTime();
        imgUrl3.src =
          "@/assets/home_img/bloom_moveing.gif" +
          "?time=" +
          new Date().getTime();
        imgUrl4.src =
          "@/assets/home_img/result_moveing.gif" +
          "?time=" +
          new Date().getTime();
      }, 1000);
    },
    //树苗说话动画
    treeSpeak() {
      if (this.speakType === 1) {
        this.randomNum = Math.floor(Math.random() * 9) + 1;
      } else {
        this.randomNum = Math.floor(Math.random() * 3) + 1;
      }
      this.isShowSpeak = true;
      setTimeout(() => {
        this.isShowSpeak = false;
      }, 2000);
    },
    //摘取水果
    pickFriut() {
      let treeid = this.treeInfo.rid;
      this.$axios.post("/Tree/TreeReward", { treeid }).then((res) => {
        if (res.Result === 0) {
          this.waterResultType = 1;
          this.isShowWater = true;
          this.treeStatus = "";
          this.stepLeft = 0;
          this.getTreeInfo();
        } else {
          this.$tips.showTips({
            content: res.Msg,
            title: "提示",
            type: 3,
          });
        }
      });
    },
    goConvert() {
      this.isShowWater = false;
      this.isShowMyGoods = true;
    },
    //浇水
    watering() {
      return new Promise((resolve) => {
        if (this.treeStatus >= 5) return;
        this.$axios.post("Tree/Watering").then((res) => {
          if (res.Result === 0) {
            this.wateringMove = true;
            setTimeout(() => {
              let imgUrl = document.querySelector(".energy_watering");
              imgUrl.src =
                "@/assets/home_img/energy_watering.gif" +
                "?time=" +
                new Date().getTime();
              this.wateringMove = false;
              this.getTreeInfo();
              this.speakType = 2;
              this.treeSpeak();
              this.treeMove();
              resolve();
            }, 3500);
          } else if (res.Result === -2) {
            this.$tips.showTips({
              title: "提示",
              content: res.Msg,
              type: 3,
            });
            resolve();
          } else if (res.Result === -3) {
            this.$tips
              .showTips({
                title: "提示",
                content: res.Msg,
                type: 3,
              })
              .then(() => {
                this.isShowReceiveWater = true;
              });
            resolve();
          } else if (res.Result === -4) {
            this.$tips
              .showTips({
                title: "提示",
                content: res.Msg,
                type: 3,
              })
              .then(() => {
                this.isShowChangeAward = true;
              });
            resolve();
          }
        });
      });
    },
    changeNum() {
      this.newNum = 3;
    },
    async newGuide(num) {
      if (num === 1) {
        this.newNum = 2;
        //打开更换物品弹框
        //选择第一个物品
        this.$refs.changeAward.selectAward({
          name: "iphone13",
          rid: 24,
          imgurl: "http://gcdn.lexun.com/images/act/20211001/iphon12.jpg",
        });
        document.querySelector("#mask").style.zIndex = 1;
      } else if (num === 2) {
        //关闭更换物品弹框
        this.$refs.changeAward.confirm();
        // this.isShowChangeAward = false;
        // this.newNum = 3;
        //确认物品
      } else if (num === 3) {
        //浇水
        await this.watering(); //使用async修饰符定义的函数会默认返回一个Promise对象resolve的值。因此对async函数可以直接then，返回值就是then方法传入的函数。
        this.newNum = 4; //awiat能接受promise函数返回的resolve()和reject(),且取到值后才会执行后面的语句。await 也是一个修饰符，只能放在async定义的函数内。
      } else {
        //如果不是Promise对象：把这个非promise的东西当做await表达式的结果。
        this.newNum = 0;
        this.guide = false;
        this.isShowReceiveWater = true;
      }
    },
    back() {
      this.$router.go(-1);
    },
    showRules() {
      window.location.href =
        "http://f.lexun.net/touch/detailnew.aspx?id=293377097&";
    },
    // 监听抽奖弹窗我的奖品点击事件
    goToMyGoods() {
      this.isShowLottery = false;
      this.isShowMyGoods = true;
    },
    //获取用户，种子信息
    getTreeInfo() {
      this.$axios.get("Tree/GetHomePage").then((res) => {
        if (res.Data.userinfo.guide === 0 && this.newNum === 0) {
          this.guide = true;
          this.isShowChangeAward = true;
          this.newNum = 1;
        }
        if (res.Data.userinfo.isnewuser === 1) this.newGuy = true;
        this.dataList = res.Data.dynamic;
        this.$store.commit("setTotal", res.Data.warterinfo.nums);
        this.treeInfo = res.Data.treeinfo;
        if (res.Data.treeinfo) {
          this.treeStatus = res.Data.treeinfo.status;
          // this.stepLeft = "-" + (100 - res.Data.treeinfo.process) + "%";
          this.stepLeft = res.Data.treeinfo.process + "%";
        }
      });
    },
  },
  created() {
    this.getTreeInfo();
    this.offical = utils.offical;
    // console.log(process.env);
  },
  mounted() {
    gameChatRoom(10028, 1, 1);
    this.liHeight = document.querySelector(".broadcast_scroll");
    this.liHeight = this.liHeight.offsetHeight;
    // 点击遮罩关闭弹窗
    // document.addEventListener("click", (e) => {
    //   if (e.target.className.includes("mask")) {
    //     this.isShowReceiveWater = false;
    //     this.isShowNewcomerWelfare = false;
    //     this.isShowSignIn = false;
    //     this.isShowFriends = false;
    //   }
    // });
  },
};
</script>

<style lang='scss' scoped>
@keyframes treeSpeak {
  0% {
    transform: translateX(-50%);
  }
  60% {
    transform: translateX(-50%) scale3d(0.9, 0.9, 0.9);
  }
  100% {
    transform: translateX(-50%) scale3d(1, 1, 1);
  }
}
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
.home {
  position: relative;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  background: url("~@/assets/home_img/bg.png") no-repeat;
  background-size: 100% 100%;
  overflow-x: hidden;
  overflow-y: hidden;
  .waterTips {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    z-index: 10;
    .mask {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      transition: opacity 0.2s;
    }
    .content {
      width: 100%;
      height: 100vh;
      z-index: 101;
      position: absolute;
      left: 0;
      top: 0;
      .info {
        margin-top: 120px;
        .success {
          width: 100%;
          text-align: center;
          p {
            font-size: 20px;
            font-weight: 500;
            color: #fff1d0;
            span {
              color: #fff009;
            }
          }
        }
      }
      .center {
        position: relative;
        width: 293px;
        height: 311px;
        margin: 20px auto 0;
        background: url("~@/assets/welfare/bg_toast_light.png") no-repeat;
        background-size: 100% 100%;
        background-position-x: -10px;
        .water {
          position: absolute;
          left: 36%;
          top: 20%;
          width: 100px;
          height: 100px;
          background: url("~@/assets/welfare/img_waterdouble.png") no-repeat;
          background-size: 100% 100%;
        }
        .result {
          position: absolute;
          left: 34%;
          top: 25%;
          width: 118px;
          height: 77px;
          background: url("~@/assets/home_img/result_apple.png") no-repeat;
          background-size: 100% 100%;
        }
      }
      .some {
        width: 100%;
        position: relative;
        left: 0;
        top: -50px;
        .success {
          width: 100%;
          text-align: center;
          p {
            width: 100%;
            text-align: center;
            font-size: 16px;
            color: #fff1d0;
            span {
              color: #fff009;
            }
          }
        }
      }
      .btn {
        width: 150px;
        height: 47px;
        margin: -10px auto 0;
        font-size: 18px;
        color: #fff1d0;
        line-height: 47px;
        font-weight: 600;
        text-align: center;
        background: url("~@/assets/welfare/bt_orange_big.png") no-repeat;
        background-size: 100% 100%;
      }
      .close {
        margin: 20px auto;
        width: 30px;
        height: 30px;
        background: url("~@/assets/icon_close.png") no-repeat;
        background-size: 100% 100%;
      }
    }
  }
  .warmTips,
  .explainTips,
  .shareTips {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    z-index: 2;
    .mask {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      transition: opacity 0.2s;
    }
    .box {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 300px;
      height: 367px;
      background: url("~@/assets/popup/bg_toast.png") no-repeat;
      background-size: 100% 100%;
      z-index: 101;
      .close {
        position: absolute;
        left: 50%;
        bottom: -62px;
        transform: translate(-50%, 0);
        width: 37px;
        height: 63px;
        background: url("~@/assets/popup/icon_close_toast.png") no-repeat;
        background-size: 100% 100%;
      }
      .title {
        width: 100%;
        text-align: center;
        font-size: 20px;
        color: #fcf9e8;
        line-height: 40px;
        text-shadow: 0px 1px 3px rgba(208, 108, 32, 0.64);
      }
      img {
        display: block;
        margin: 20px auto;
        width: 240px;
        height: 127px;
        background: url("~@/assets/welfare/img_share.png") no-repeat;
        background-size: 100% 100%;
      }
      p {
        width: 100%;
        text-align: center;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #a3894c;
        word-wrap: break-word;
        line-height: 22px;
      }
      .btn {
        width: 150px;
        height: 47px;
        text-align: center;
        line-height: 47px;
        margin: 20px auto;
        background: url("~@/assets/welfare/bt_orange_big.png") no-repeat;
        background-size: 100% 100%;
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #fff1d0;
      }
    }
  }
  .explainTips {
    .box {
      width: 300px;
      height: 300px;
      background: url("~@/assets/welfare/bg_toast_rule.png") no-repeat;
      background-size: 100% 100%;
    }
    p {
      margin: 30px 0;
    }
  }
  .warmTips {
    .box {
      width: 300px;
      height: 222px;
      background: url("~@/assets/welfare/bg_toast_remind.png") no-repeat;
      background-size: 100% 100%;
    }
    p {
      margin-top: 30px;
    }
  }
  .newGuide {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    .finger {
      position: absolute;
      left: 140px;
      top: 72%;
      z-index: 102;
      animation: fingerMoveing 1s ease infinite both;
      img {
        width: 60px;
        height: 61px;
      }
    }
    .finger1 {
      left: 140px;
      top: 72%;
    }
    .finger2 {
      left: 218px;
      top: 71%;
    }
    .finger3 {
      left: 326px;
      top: 72%;
    }
    .finger4 {
      left: 330px;
      top: 82%;
    }
    .step {
      position: absolute;
      right: 10px;
      top: 20px;
      z-index: 101;
      img {
        width: 60px;
        height: 30px;
      }
    }
    .mask {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      transition: opacity 0.2s;
      z-index: 2;
    }
    .one {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 10px;
      top: 19%;
      z-index: 101;
      p {
        position: absolute;
        width: 148px;
        height: 20px;
        line-height: 20px;
        z-index: 1;
        left: 17px;
        top: 313px;
        font-size: 14px;
        font-weight: 600;
        background-color: #fff;
      }
      .select {
        position: absolute;
        left: 80px;
        width: 200px;
        height: 150px;
      }
      .gift {
        position: absolute;
        top: 150px;
        width: 175px;
        height: 250px;
      }
    }
    .two {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 50px;
      top: 73%;
      z-index: 101;
      img {
        width: 200px;
        height: 150px;
      }
    }
    .three {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 101;
      .guide {
        position: absolute;
        left: 14%;
        top: 31%;
        width: 200px;
        height: 150px;
      }
      .tree {
        position: absolute;
        left: 42%;
        top: 67%;
        width: 40px;
        height: 40px;
        z-index: 102;
      }
      .water {
        position: absolute;
        right: 0;
        top: 402px;
        width: 90px;
        height: 90px;
      }
      .land {
        position: absolute;
        left: 31%;
        top: 69%;
        width: 144px;
        height: 48px;
      }
    }
    .four {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 20%;
      top: 20%;
      z-index: 101;
      .guide {
        position: absolute;
        left: 20%;
        top: 15%;
        width: 200px;
        height: 150px;
      }
      .tree {
        position: absolute;
        left: 20%;
        top: 43%;
        width: 70px;
        height: 80px;
        z-index: 102;
      }
      .water {
        position: absolute;
        left: 60%;
        top: 56%;
        width: 60px;
        height: 70px;
      }
      .land {
        position: absolute;
        left: 11%;
        top: 49%;
        width: 144px;
        height: 48px;
      }
    }
  }
  .main {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    .tst {
      width: 100px;
      font-size: 16px;
      @include singleEllipsis();
    }
    .energy_watering {
      position: absolute;
      left: 7px;
      top: 4px;
      z-index: 102;
      width: 100%;
    }
    .head {
      width: 100%;
      height: 44px;
      line-height: 44px;
      position: absolute;
      top: 20px;
      left: 0;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &-left {
        width: 38px;
        height: 40px;
        background: url("~@/assets/home_img/icon_back.png") no-repeat;
        background-size: 100% 100%;
        transform: translate(30%);
      }
      &-center {
        width: 177px;
        height: 33px;
        background: url("~@/assets/home_img/text_top.png") no-repeat;
        background-size: 100% 100%;
        transform: translateX(5%);
      }
      &-right {
        color: #fff;
        width: 64px;
        height: 32px;
        line-height: 40px;
        background: rgba(0, 0, 0, 0.4);
        border-radius: 17px 0px 0px 17px;
        display: flex;
        align-items: center;
        img {
          width: 23px;
          height: 26px;
          margin-left: 10px;
          margin-right: 3px;
          margin-top: 1px;
        }
      }
    }
    .broadcast {
      position: absolute;
      left: 50%;
      width: 373px;
      height: 111px;
      margin: 64px auto 0;
      background: url("~@/assets/home_img/oneline-img.png") no-repeat;
      background-size: 100% 100%;
      z-index: 1;
      transform: translateX(-50%);
      transition: height 0.8s;
      overflow-x: hidden;
      overflow-y: hidden;
      &_scroll {
        width: 340px;
        height: 39px;
        margin: 0 auto;
        overflow-x: hidden;
        overflow-y: hidden;
        transform: translateY(38px);
        transition: height 0.5s ease;
        .item {
          overflow-x: hidden;
          overflow-y: hidden;
          li {
            height: 39px;
            line-height: 39px;
            color: #fff;
            overflow-x: hidden;
            overflow-y: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            // img {
            //   width: 24px;
            //   height: 24px;
            //   border-radius: 50%;
            //   border: 2px solid #8ecbf1;
            // }
            p {
              font-size: 13px;
              color: #fff;
              white-space: nowrap;
              span {
                font-size: 13px;
                color: #ff8564;
              }
            }
          }
        }
      }
      &_icon {
        position: fixed;
        left: 60%;
        top: 83%;
        transition: top 0.5s ease;
        span {
          display: inline-block;
          width: 80px;
          position: absolute;
          left: -75px;
          top: -5px;
          color: #fff;
          transition: transform 0.5s ease;
        }
        .icon {
          width: 10px;
          height: 6px;
          background: url("~@/assets/home_img/icon_more.png") no-repeat;
          background-size: 100% 100%;
          transition: transform 0.5s ease;
        }
      }
      .unfoldthree {
        top: 88%;
        span {
          left: -65px;
          width: 50px;
        }
        .icon {
          transform: rotate(180deg) translateX(10px);
        }
      }
    }
    .unfold {
      height: 185px;
      background: url("~@/assets/home_img/threeline-img.png") no-repeat;
      background-size: 100% 100%;
      .unfoldtow {
        height: 108px;
      }
    }
    .options-right {
      width: 90px;
      height: 530px;
      position: absolute;
      right: 0;
      bottom: 0;
      z-index: 1;
      div {
        margin: 12px auto;
        width: 59px;
        height: 70px;
      }
      .energy {
        position: relative;
        width: 92px;
        height: 93px;
        background: url("~@/assets/home_img/ibg_water.png") no-repeat;
        background-size: 100% 100%;
        .water {
          width: 61px;
          height: 71px;
          background: url("~@/assets/home_img/img_water.png") no-repeat;
          background-size: 100% 100%;
        }
        .content {
          margin: 0;
          position: absolute;
          left: 18px;
          bottom: 4px;
          width: 60px;
          height: 23px;
          line-height: 23px;
          text-align: center;
          background: url("~@/assets/home_img/bt_Flow.png") no-repeat;
          background-size: 100% 100%;
          p {
            color: #fff;
            font-size: 13px;
          }
        }
      }
      .myBag {
        background: url("~@/assets/home_img/icon_goods.png") no-repeat;
        background-size: 100% 100%;
      }
      .changeGift {
        background: url("~@/assets/home_img/icon_replace.png") no-repeat;
        background-size: 100% 100%;
        margin-bottom: 15px;
      }
      .getWater {
        background: url("~@/assets/home_img/icon_bringwater.png") no-repeat;
        background-size: 100% 100%;
      }
      .rank {
        background: url("~@/assets/home_img/icon_rankinglist.png") no-repeat;
        background-size: 100% 100%;
      }
      .luckyDraw {
        background: url("~@/assets/home_img/icon_water_draw.png") no-repeat;
        background-size: 100% 100%;
      }
    }
    .options-bottom {
      width: 210px;
      height: 80px;
      position: absolute;
      left: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: space-around;
      div {
        width: 59px;
        height: 70px;
        display: flex;
        align-items: center;
        p {
          width: 36px;
          font-size: 8px;
          transform: scale(0.8);
          font-family: Medium;
          color: #fff6e1;
          text-align: center;
          white-space: nowrap;
        }
      }
      .newGuy {
        .content {
          position: relative;
          background: url("~@/assets/home_img/icon_welfare.png") no-repeat;
          background-size: 100% 100%;
          .tips {
            position: absolute;
            right: -16px;
            top: 0;
            width: 34px;
            height: 18px;
            background: url("~@/assets/home_img/bg_tag.png") no-repeat;
            background-size: 100% 100%;
          }
        }
      }
      .signIn {
        position: relative;
        background: url("~@/assets/home_img/icon_signin.png") no-repeat;
        background-size: 100% 100%;
        .tips {
          position: absolute;
          right: -16px;
          top: 0;
          width: 34px;
          height: 18px;
          background: url("~@/assets/home_img/bg_tag.png") no-repeat;
          background-size: 100% 100%;
        }
      }
      .friends {
        position: relative;
        background: url("~@/assets/home_img/icon_record@2x.png") no-repeat;
        background-size: 100% 100%;
        .tips {
          position: absolute;
          right: -16px;
          top: 0;
          width: 34px;
          height: 18px;
          background: url("~@/assets/home_img/bg_people.png") no-repeat;
          background-size: 100% 100%;
        }
      }
    }
    .mid {
      position: relative;
      top: 191px;
      left: 0;
      width: 100%;
      height: 380px;
      &-land {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 60px;
        width: 144px;
        height: 48px;
        background: url("~@/assets/home_img/icon_myland.png") no-repeat;
        background-size: 100% 100%;
        .result,
        .bloom,
        .sapling,
        .seed,
        .tree {
          width: 72px;
          height: 81px;
          background: url("~@/assets/home_img/img_sprout.png") no-repeat;
          background-size: 100% 100%;
          position: absolute;
          left: 50%;
          top: 0;
          transform: translate(-50%, -50%);
        }
        .seed {
          width: 40px;
          height: 40px;
          left: 45%;
          top: 20%;
          background: url("~@/assets/home_img/seed.png") no-repeat;
          background-size: 100% 100%;
        }
        .sapling {
          width: 90px;
          height: 158px;
          background: url("~@/assets/home_img/sapling.png") no-repeat;
          background-size: 100% 100%;
          transform: translate(-55%, -80%);
        }
        .bloom {
          width: 172px;
          height: 226px;
          background: url("~@/assets/home_img/bloom.png") no-repeat;
          background-size: 100% 100%;
          transform: translate(-50%, -80%);
        }
        .result {
          width: 172px;
          height: 226px;
          background: url("~@/assets/home_img/result.png") no-repeat;
          background-size: 100% 100%;
          transform: translate(-50%, -80%);
        }
        .move {
          width: 100%;
          height: 100%;
          position: absolute;
          bottom: 0;
          .seedMoveing {
            width: 172px;
            height: 226px;
            position: absolute;
            left: -12px;
            bottom: 13px;
          }
          .treeMoveing {
            width: 172px;
            height: 226px;
            position: absolute;
            left: -13px;
            bottom: 8px;
          }
          .saplingMoveing {
            width: 172px;
            height: 226px;
            position: absolute;
            left: -14px;
            bottom: 15px;
          }
          .bloomMoveing {
            width: 172px;
            height: 226px;
            position: absolute;
            left: -14px;
            bottom: 3px;
          }
          .resultMoveing {
            width: 172px;
            height: 226px;
            position: absolute;
            left: -14px;
            bottom: 3px;
          }
        }
      }
      &-sign {
        position: absolute;
        left: 50px;
        bottom: 80px;
        width: 67px;
        height: 53px;
        background: url("~@/assets/home_img/img_time.png") no-repeat;
        background-size: 100% 100%;
        p {
          transform: scale(0.9) translate(-2px, 12px);
          width: 76px;
          height: 11px;
          font-size: 12px;
          font-family: SourceHanSansCN-Regular, SourceHanSansCN;
          font-weight: 400;
          color: #edcd98;
          line-height: 17px;
          text-shadow: 0px 1px 2px #492b09;
        }
      }
      &-step {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 20px;
        width: 172px;
        height: 31px;
        background: url("~@/assets/home_img/bg_bar.png") no-repeat;
        background-size: 100% 100%;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        .box {
          width: 155px;
          height: 16px;
          overflow-x: hidden;
          -webkit-overflow-x: hidden;
          overflow-y: hidden;
          .content {
            position: fixed;
            left: 50%;
            top: 5px;
            transform: translateX(-50%);
            width: 155px;
            height: 16px;
            border-radius: 8px;
            overflow-x: hidden;
            -webkit-overflow-x: hidden;
            // -webkit-backface-visibility: hidden;
            // -webkit-transform: translate3d(0, 0, 0);
            overflow-y: hidden;
            #step {
              position: absolute;
              top: 0;
              width: 155px;
              height: 16px;
              background: linear-gradient(
                180deg,
                #f87b40 0%,
                #f87737 71%,
                #f95132 100%
              );
              background-size: 100% 100%;
              border-radius: 8px;
              // transition: left 0.5s linear;
              transition: width 0.5s linear;
            }
          }
        }
      }
      &-tips {
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        // width: 152px;
        height: 14px;
        font-size: 14px;
        font-family: SourceHanSansCN-Medium, SourceHanSansCN;
        font-weight: 600;
        color: #446609;
        line-height: 21px;
        .result {
          display: block;
          transform: translateY(-30px);
        }
      }
      &-btn {
        text-align: center;
        font-size: 16px;
        font-weight: 600;
        color: #fff1d0;
        line-height: 40px;
        position: absolute;
        bottom: -13px;
        left: 50%;
        transform: translateX(-50%);
        width: 150px;
        height: 44px;
        background: url("~@/assets/welfare/bt_main_pick.png") no-repeat;
        background-size: 100% 100%;
        z-index: 1;
      }
      &-speak {
        position: absolute;
        bottom: 300px;
        left: 50%;
        transform: translateX(-50%);
        width: 226px;
        height: 80px;
        background: url("~@/assets/home_img/bg_massage.png") no-repeat;
        background-size: 100% 100%;
        text-align: center;
        line-height: 41px;
        animation: treeSpeak 1s ease infinite;
        p {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 160px;
          height: 80px;
          line-height: 30px;
          margin: 0 auto;
          text-align: center;
          font-size: 14px;
          color: #333333;
        }
      }
    }
  }
}
.seamless-warp2 {
  height: 39px;
  overflow-x: hidden;
  overflow-y: hidden;
}
.unfoldtow {
  height: 108px;
}
@media (min-width: 799px) {
  .home .main .options-bottom div p {
    transform: none;
  }
  .home .main .broadcast_icon {
    top: 84%;
    font-size: 12px;
  }
  .home .main .mid {
    top: 28%;
  }
  .home .main .energy_watering {
    left: 0.85rem;
    top: -3.52rem;
  }
  .home .newGuide .three .land {
    left: 37%;
    top: 62%;
  }
  .home .newGuide .three .tree {
    left: 45%;
    top: 60%;
  }
  .home .newGuide .three .water {
    top: 12.72rem;
  }
  .home .newGuide .four .land {
    left: 17%;
    top: 42%;
  }
  .home .newGuide .four .tree {
    left: 24%;
    top: 36%;
  }
  .home .newGuide .four .water {
    left: 66%;
    top: 58%;
  }
}
// 弹出层动画
.popup-enter {
  /deep/ .mask {
    opacity: 0;
  }
}
.popup-leave-to {
  /deep/ .mask {
    opacity: 0;
  }
}
.popup-enter {
  /deep/ .panel,
  /deep/ .panel2,
  /deep/ .panel3 {
    transform: translateY(800px);
  }
}
.popup-leave-to {
  /deep/ .panel,
  /deep/ .panel2,
  /deep/ .panel3 {
    transform: translateY(800px);
  }
}
.popup-enter-active,
.popup-leave-active {
  transition: all 0.3s;
}
.harvest-enter,
.harvest-leave-to {
  opacity: 0;
  transform: scale(0, 0);
}
.harvest-enter-active,
.harvest-leave-active {
  opacity: 1;
  transform: scale(1, 1);
  transition: all 0.3s;
}
</style>