<template>
  <div class="my-goods-popup">
    <div class="mask"></div>
    <div v-if="currentPanel === 1" class="panel">
      <div class="header">
        我的物品
        <img
          src="../assets/popup/icon_close.png"
          @click="$emit('close')"
          alt=""
        />
      </div>
      <div class="btn-box">
        <div class="area" @click="currentPanel = 2">地址管理</div>
        <div class="select-btn" @click="isShowDropdown = !isShowDropdown">
          <span>{{ currentText }}</span>
          <img
            src="../assets/popup/icon_triangle01@2x.png"
            :class="{ active: isShowDropdown }"
            alt=""
          />
          <div v-if="isShowDropdown" class="select-dropdown">
            <div @click="screenClick(1, '筛选商品')">筛选商品</div>
            <div @click="screenClick(2, '未兑换')">未兑换</div>
            <div @click="screenClick(3, '已兑换')">已兑换</div>
          </div>
        </div>
      </div>
      <div class="award-list">
        <ul class="award-ul">
          <li class="award-li" v-for="item in goodsRes" :key="item.rid">
            <div class="left-img">
              <img :src="item.imgurl" alt="" />
            </div>
            <div class="detail">
              <p class="award-name">{{ item.name }}</p>
              <p class="award-time">获得时间{{ item.writetime }}</p>
            </div>
            <div v-if="item.status === 2" class="exchange-btn end">已兑换</div>
            <div
              v-else-if="item.status === 0"
              class="exchange-btn"
              @click="exchange(item)"
            >
              兑换
            </div>
            <div v-else class="exchange-btn">兑换中</div>
          </li>
        </ul>
      </div>
      <p class="tips-text">兑换实物后将于10月3日后开始发货</p>
      <!-- 话费卡弹窗 -->
      <div v-if="isShowCard" class="card-box">
        <div class="mask-in2"></div>
        <div class="card-main">
          <div class="head-img">
            {{ currentExchange.type === 3 ? "话费卡兑换" : "京东卡兑换" }}
          </div>
          <div class="top-detail">
            <div class="left-img">
              <img :src="currentExchange.imgurl" alt="" />
            </div>
            <div class="right-box">
              <p class="title-name">{{ currentExchange.name }}</p>
            </div>
          </div>
          <div class="phone-item">
            <p>输入手机号码</p>
            <input v-model="firsePhone" type="number" maxlength="11" />
          </div>
          <div class="phone-item">
            <p>二次确认手机号码</p>
            <input v-model="secondPhone" type="number" maxlength="11" />
            <span v-show="!validate">*两次输入的手机号不一致，请重新输入!</span>
          </div>
          <div class="confirm-btn" @click="sureCard">确定</div>
          <p class="exchange-tips">
            说明：话费兑换为输入号码直充，京东卡以短信的形式发放卡密到您填写的手机号码上~
          </p>
          <img
            class="bot-close"
            src="../assets/popup/icon_close_2.png"
            @click="hideCard"
            alt=""
          />
        </div>
      </div>
      <!-- 游戏券弹窗 -->
      <div v-if="isShowTicket" class="ticket-box">
        <div class="mask-in3"></div>
        <div class="ticket-main">
          <div class="head-img">游戏券兑换</div>
          <div class="middle-content">
            <p class="title-text">兑换选项如下</p>
            <ul class="ul-content">
              <li
                :class="{
                  'li-item': true,
                  actgame: item.gameId === currentGame.gameId,
                }"
                v-for="item in gameList"
                :key="item.gameId"
                @click="gameSel(item)"
              >
                {{ item.text }}
              </li>
            </ul>
          </div>
          <div class="confirm-btn" @click="sureTicket">确定</div>
          <p class="exchange-tips">
            小贴士：是否确定兑换<span class="inner-num">{{
              numToStone(currentExchange.nums)
            }}</span
            >{{ currentGame.text }}游戏券
          </p>
          <img
            class="bot-close"
            src="../assets/popup/icon_close_2.png"
            @click="hideTicket"
            alt=""
          />
        </div>
      </div>
    </div>
    <div v-else-if="currentPanel === 2" class="panel2">
      <div class="header">
        编辑地址
        <img src="../assets/popup/icon_close.png" @click="closePanel2" alt="" />
      </div>
      <div class="ipt-item">
        <div>收件人</div>
        <input
          v-model="userName"
          type="text"
          maxlength="8"
          placeholder="请填写收货人姓名"
          key="99"
        />
      </div>
      <div class="ipt-item">
        <div>联系电话</div>
        <input
          v-model="userNumber"
          type="number"
          maxlength="11"
          placeholder="请填写收货人电话"
          key="98"
        />
      </div>
      <div class="ipt-item">
        <div>所在地址</div>
        <p
          :class="{ province: true, blur: currentArea === '' }"
          @click="isShowPicker = !isShowPicker"
        >
          {{ currentArea ? currentArea : "点击选择所在地址" }}
        </p>
      </div>
      <div class="detail-area">
        <div>详细地址</div>
        <textarea
          v-model="detailArea"
          placeholder="请填写详细地址"
          maxlength="50"
        ></textarea>
      </div>
      <div class="area-btn">
        <div @click="closePanel2">取消</div>
        <div class="sure" @click="sureArea">确定</div>
      </div>
      <!-- 地址选择器 -->
      <transition name="moving">
        <div v-show="isShowPicker" class="dist-picker">
          <div class="mask-in"></div>
          <van-area
            title="选择地址"
            :area-list="areaList"
            @confirm="confirm"
            @cancel="isShowPicker = false"
          />
        </div>
      </transition>
    </div>
    <div v-else-if="currentPanel === 3" class="panel3">
      <div class="header">
        我的收货地址
        <img src="../assets/popup/icon_close.png" @click="closePanel3" alt="" />
      </div>
      <div class="info-item">
        <div class="info-left">收件人</div>
        <div class="content" style="font-weight: 600">{{ this.userName }}</div>
      </div>
      <div class="info-item">
        <div class="info-left">联系电话</div>
        <div class="content" style="color: #50a8ff">{{ this.userNumber }}</div>
      </div>
      <div class="info-item three">
        <div class="info-left">收货地址</div>
        <div class="content change">{{ currentArea }}{{ detailArea }}</div>
      </div>
      <div class="exchange-item">
        <div class="title">兑换商品</div>
        <div class="exchange-award">
          <img :src="currentExchange.imgurl" alt="" />
          <div class="right-box">
            <p class="exchange-name">{{ currentExchange.name }}</p>
          </div>
        </div>
      </div>
      <div class="bot-btn-box">
        <div class="edit" @click="editArea">编辑地址</div>
        <div @click="confirmExchange">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
import { areaList } from "@vant/area-data";
import util from "../utils/utils";

export default {
  name: "MyGoods",
  components: {},
  props: {},
  data() {
    return {
      // 地址信息
      areaList,
      // 当前显示panel, 1: 奖品页面 2: 编辑地址页面
      currentPanel: 1,
      // 用户物品数据
      goodsList: [],
      // 控制地区选择器显示隐藏
      isShowPicker: false,
      // 绑定用户输入数据
      userName: "",
      userNumber: "",
      province: {},
      city: {},
      county: {},
      currentArea: "",
      detailArea: "",
      // 控制筛选下拉框显示隐藏
      isShowDropdown: false,
      // 控制话费卡弹窗显示隐藏
      isShowCard: false,
      firsePhone: "",
      secondPhone: "",
      // 控制游戏券弹窗显示隐藏
      isShowTicket: false,
      // 当前选择项 1: 全部奖品 2：未兑换 3：已兑换
      currentSelect: 1,
      // 当前选择项的文本内容
      currentText: "筛选商品",
      // 当前点击兑换的奖品
      currentExchange: {},
      // 游戏列表
      gameList: [
        {
          gameId: 1,
          text: "水果商城",
        },
        {
          gameId: 2,
          text: "投资大亨",
        },
        {
          gameId: 3,
          text: "富翁工厂",
        },
        {
          gameId: 4,
          text: "全球世界杯",
        },
        {
          gameId: 5,
          text: "金牌设计师",
        },
        {
          gameId: 6,
          text: "躲猫猫",
        },
        {
          gameId: 7,
          text: "大胃鸡",
        },
        {
          gameId: 8,
          text: "抓娃娃",
        },
      ],
      // 当前选中的游戏
      currentGame: {},
    };
  },
  computed: {
    goodsRes() {
      if (this.currentSelect === 1) {
        return this.goodsList;
      } else if (this.currentSelect === 2) {
        return this.goodsList2;
      } else if (this.currentSelect === 3) {
        return this.goodsList3;
      }
    },
    // 未兑换
    goodsList2() {
      return this.goodsList.filter((item) => item.status === 0);
    },
    // 已兑换
    goodsList3() {
      return this.goodsList.filter((item) => item.status === 2);
    },
    // 校验两次输入的手机号是否一致
    validate() {
      return this.firsePhone === this.secondPhone;
    },
  },
  created() {
    this.getMyGoodsList();
    this.getMyAddress();
  },
  mounted() {},
  methods: {
    // 获取我的物品数据
    getMyGoodsList() {
      this.$axios
        .get("/Goods/GetMyGoods", { params: { page: 1, pagesize: 300 } })
        .then((data) => {
          if (data.Result === 0) {
            this.goodsList = data.Data.goodslist;
          }
        });
    },
    // 获取我的收货地址数据
    getMyAddress() {
      this.$axios.get("Goods/GetAddress").then((data) => {
        if (data.Result === 0) {
          const result = data.Data.addressinfo;
          this.userName = result.name;
          this.userNumber = result.phone;
          this.province.name = result.province;
          this.city.name = result.city;
          this.county.name = result.county;
          this.detailArea = result.addr;
          this.currentArea = `${result.province}${result.city}${result.county}`;
        }
      });
    },
    // 点击筛选奖品
    screenClick(id, text) {
      this.currentSelect = id;
      this.currentText = text;
    },
    // 点击兑换按钮
    exchange(data) {
      this.currentExchange = data;

      // 是否是游戏券
      if (data.type === 1 && data.rlid === 0) {
        this.isShowTicket = true;
      } else if (data.type === 2) {
        // 判断是否是实物
        this.currentPanel = 3;
      } else if (data.type === 3 || data.type === 4) {
        // 是否是京东卡或者话费卡弹窗
        this.isShowCard = true;
      } else if (data.rlid === 99) {
        this.sureTicket();
      }
    },
    // 编辑地址完成
    sureArea() {
      const _this = this;
      // 请求接口更新用户地址信息, 弹窗提示
      const queryObj = {
        name: this.userName,
        phone: this.userNumber,
        province: this.province.name,
        city: this.city.name,
        county: this.county.name,
        addr: this.detailArea,
      };
      this.$axios.post("Goods/EditAddress", queryObj).then((data) => {
        if (data.Result === 0) {
          _this.$tips
            .showTips({
              type: 2,
              title: "编辑地址",
              content: "编辑地址成功",
            })
            .then((data) => {
              // 回到我的物品页
              this.currentPanel = 1;
              // 更新页面地址信息
              _this.getMyAddress();
            });
        } else {
          _this.$tips.showTips({
            type: 2,
            title: "编辑地址",
            content: data.Msg,
          });
        }
      });
    },
    // 地址选择器的确定事件
    confirm(data) {
      this.isShowPicker = false;
      this.province = data[0];
      this.city = data[1];
      this.county = data[2];
      let str = "";
      data.forEach((ele) => {
        str += ele.name;
      });

      this.currentArea = str;
    },
    // 点击编辑地址
    editArea() {
      this.currentPanel = 2;
    },
    // 确定兑换话费卡
    sureCard() {
      if (!this.validate) return;
      const obj = {
        ugiftid: this.currentExchange.rid,
        phone: this.secondPhone,
      };
      // 请求兑换接口
      this.$axios.post("/Goods/ExchangeGoods", obj).then((data) => {
        // 关闭兑换弹窗
        this.hideCard();
        // 结果提示
        this.$tips.showTips({
          title: "兑换奖品",
          type: 2,
          content: data.Msg,
        });
        if (data.Result === 0) {
          // 更新列表数据
          this.getMyGoodsList();
        }
      });
    },
    // 关闭兑换话费卡/京东卡弹窗
    hideCard() {
      this.isShowCard = false;
      this.firsePhone = "";
      this.secondPhone = "";
    },
    // 点击兑换游戏券
    gameSel(data) {
      this.currentGame = data;
    },
    // 确定兑换游戏券
    sureTicket() {
      const obj = {
        ugiftid: this.currentExchange.rid,
        gameid: this.currentGame.gameId,
      };
      // 请求兑换接口
      this.$axios.post("/Goods/ExchangeGoods", obj).then((data) => {
        // 关闭兑换弹窗
        this.hideTicket();
        // 结果提示
        this.$tips.showTips({
          title: "兑换奖品",
          type: 2,
          content: data.Msg,
        });
        if (data.Result === 0) {
          // 更新列表数据
          this.getMyGoodsList();
        }
      });
    },
    // 关闭兑换游戏券弹窗
    hideTicket() {
      this.isShowTicket = false;
      this.currentGame = {};
    },
    // 确定兑换实物
    confirmExchange() {
      const _this = this;
      // 判断是否输入地址
      const flag =
        this.userName === "" ||
        this.userNumber === "" ||
        this.currentArea === "" ||
        this.detailArea === "";
      if (flag) {
        _this.tips.showTips({
          title: "温馨提示",
          content: "您的地址相关信息还没有填写完整~",
          type: 2,
        });
        return false;
      }
      // 请求兑换接口
      const obj = {
        ugiftid: this.currentExchange.rid,
      };
      _this.$axios.post("/Goods/ExchangeGoods", obj).then((data) => {
        if (data.Result === 0) {
          // 更新列表数据
          _this.getMyGoodsList();
          // 成功后回到物品页
          _this.currentPanel = 1;
        }
        // 结果提示
        _this.$tips.showTips({
          title: "兑换奖品",
          type: 2,
          content: data.Msg,
        });
      });
    },
    // 处理金额显示
    numToStone(num) {
      return util.toStone(num);
    },
    closePanel2() {
      this.currentPanel = 1;
      this.isShowDropdown = false;
      this.getMyAddress();
    },
    closePanel3() {
      this.currentPanel = 1;
      this.isShowDropdown = false;
    },
  },
};
</script>

<style lang='scss' scoped>
.my-goods-popup {
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
    background-color: #fff;
    transition: all 0.4s;
    border-radius: 16px 16px 0px 0px;
    .header {
      position: relative;
      width: 100%;
      height: 55px;
      line-height: 55px;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      img {
        position: absolute;
        top: 16px;
        right: 16px;
        width: 24px;
        height: 24px;
      }
    }
    .btn-box {
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 50px;
      .area,
      .select-btn {
        width: 120px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        font-size: 14px;
        background: #f8f6f7;
        border: 1px solid #dddee2;
        box-sizing: border-box;
      }
      .select-btn {
        position: relative;
        img {
          margin-left: 20px;
          width: 16px;
          height: 10px;
          transition: all 0.3s;
          &.active {
            transform: rotate(180deg);
          }
        }
        .select-dropdown {
          position: absolute;
          top: 100%;
          left: -1px;
          padding-left: 12px;
          width: 120px;
          height: 136px;
          background-color: #f8f6f7;
          border: 1px solid #d8d8d8;
          box-sizing: border-box;
          div {
            height: 33%;
            text-align: left;
            line-height: 44px;
          }
        }
      }
    }
    .award-list {
      overflow-y: scroll;
      padding-bottom: 35px;
      height: 65vh;
      .award-ul {
        padding: 0 16px;
        .award-li {
          display: flex;
          align-items: center;
          height: 76px;
          border-bottom: 1px solid #dddee2;
          .left-img {
            width: 44px;
            height: 44px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .detail {
            flex: 1;
            padding-left: 10px;
            .award-name {
              font-size: 14px;
            }
            .award-time {
              margin-top: 8px;
              font-size: 12px;
              color: #999;
            }
          }
          .exchange-btn {
            margin: 0 20px 0 15px;
            width: 70px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            font-size: 13px;
            color: #fff;
            background: #43ab5d;
            border-radius: 30px;
            &.end {
              background: #f8f6f7 !important;
              color: #666 !important;
            }
          }
        }
      }
    }
    .tips-text {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 35px;
      line-height: 35px;
      text-align: center;
      font-size: 13px;
      color: #43ab5d;
      background: #e7f9e2;
    }
    .card-box {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      .mask-in2 {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(13, 12, 12, 0.6);
      }
      .card-main {
        position: absolute;
        top: 50px;
        left: 50%;
        transform: translateX(-50%);
        padding: 30px 20px 0;
        width: 300px;
        height: 362px;
        background-color: #fff;
        border-radius: 10px;
        box-sizing: border-box;
        .head-img {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 190px;
          height: 36px;
          text-align: center;
          line-height: 36px;
          color: #ffffff;
          font-size: 18px;
          text-shadow: -1.2246468525851679e-16px 1px 2px rgba(0, 58, 15, 0.6);
          background: url("../assets/popup/head_bg.png") no-repeat;
          background-size: 100% 100%;
        }
        .top-detail {
          display: flex;
          .left-img {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 60px;
            height: 60px;
            background: url("../assets/popup/card_bg.png") no-repeat;
            background-size: 100% 100%;
            img {
              width: 52px;
              height: 32px;
            }
          }
          .right-box {
            display: flex;
            align-items: center;
            padding-left: 10px;
            .title-name {
              margin-top: 4px;
              font-size: 16px;
              font-weight: 600;
            }
          }
        }
        .phone-item {
          position: relative;
          margin-top: 10px;
          & > P {
            font-size: 13px;
            color: #666;
          }
          & > input {
            margin-top: 5px;
            width: 260px;
            height: 40px;
            font-size: 15px;
            background: #f8f6f7;
            border: 1px solid #dddee2;
            border-radius: 2px;
          }
          & > span {
            position: absolute;
            top: 100%;
            font-size: 12px;
            color: red;
          }
        }
        .confirm-btn {
          margin: 18px auto 12px;
          width: 160px;
          height: 36px;
          line-height: 36px;
          text-align: center;
          font-size: 14px;
          color: #fff;
          background: #43ab5d;
          border-radius: 18px;
        }
        .exchange-tips {
          font-size: 12px;
          color: #999;
        }
        .bot-close {
          position: absolute;
          bottom: -80px;
          left: 50%;
          transform: translateX(-50%);
          width: 35px;
          height: 86px;
        }
      }
    }
    .ticket-box {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      .mask-in3 {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(13, 12, 12, 0.6);
      }
      .ticket-main {
        position: absolute;
        top: 50px;
        left: 50%;
        transform: translateX(-50%);
        padding: 36px 20px 0;
        width: 300px;
        height: 332px;
        background-color: #fff;
        border-radius: 10px;
        box-sizing: border-box;
        .head-img {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 190px;
          height: 36px;
          text-align: center;
          line-height: 36px;
          color: #ffffff;
          font-size: 18px;
          text-shadow: -1.2246468525851679e-16px 1px 2px rgba(0, 58, 15, 0.6);
          background: url("../assets/popup/head_bg.png") no-repeat;
          background-size: 100% 100%;
        }
        .middle-content {
          .title-text {
            text-align: center;
            font-size: 16px;
            font-weight: bold;
            color: #333;
          }
          .ul-content {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            .li-item {
              margin-top: 15px;
              width: 120px;
              height: 30px;
              text-align: center;
              line-height: 30px;
              font-size: 14px;
              color: #fff;
              background-color: #c7dccd;
              border-radius: 6px;
              &.actgame {
                background: url("../assets/popup/btn_Game ticket.png") no-repeat;
                background-size: 100% 100%;
              }
            }
          }
        }
        .confirm-btn {
          margin: 20px auto 12px;
          width: 160px;
          height: 36px;
          line-height: 36px;
          text-align: center;
          font-size: 14px;
          color: #fff;
          background: #43ab5d;
          border-radius: 18px;
        }
        .exchange-tips {
          text-align: center;
          font-size: 12px;
          color: #999;
          .inner-num {
            color: #f87a39;
            font-size: 14px;
          }
        }
        .bot-close {
          position: absolute;
          bottom: -80px;
          left: 50%;
          transform: translateX(-50%);
          width: 35px;
          height: 86px;
        }
      }
    }
  }
  .panel2 {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 74%;
    background-color: #fff;
    transition: all 0.4s;
    border-radius: 16px 16px 0px 0px;
    .header {
      position: relative;
      width: 100%;
      height: 55px;
      line-height: 55px;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      img {
        position: absolute;
        top: 16px;
        right: 16px;
        width: 24px;
        height: 24px;
      }
    }
    .ipt-item {
      display: flex;
      align-items: center;
      padding-left: 16px;
      height: 56px;
      font-size: 15px;
      border-bottom: 1px solid #dddee2;
      & > div {
        width: 76px;
      }
      input {
        overflow-x: hidden;
        overflow-y: hidden;
        width: 200px;
        height: 24px;
        border: none;
        &::-webkit-input-placeholder {
          color: #ccc;
        }
      }
      .province {
        overflow-x: hidden;
        overflow-y: hidden;
        width: 260px;
        height: 24px;
        border: none;
        &.blur {
          color: #ccc;
        }
      }
    }
    .detail-area {
      display: flex;
      padding: 16px 0 0 16px;
      font-size: 15px;
      & > div {
        width: 76px;
      }
      textarea {
        padding: 6px;
        width: 72%;
        height: 100px;
        border-color: #dddee2;
        box-sizing: border-box;
        resize: none;
        &::-webkit-input-placeholder {
          color: #ccc;
        }
      }
    }
    .area-btn {
      display: flex;
      justify-content: space-around;
      margin-top: 80px;
      & > div {
        width: 140px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 14px;
        color: #666;
        background: #f5f5f5;
        border-radius: 20px;
        background-color: #f5f5f5;
      }
      .sure {
        color: #fff;
        background-color: #43ab5d;
      }
    }
    .dist-picker {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      .mask-in {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(13, 12, 12, 0.6);
        transition: all 0.2s;
      }
      .van-area {
        padding-bottom: 6.29685vh;
        bottom: -21.73913vh;
        transition: all 0.2s;
      }
    }
  }
  .panel3 {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 74%;
    background-color: #fff;
    transition: all 0.4s;
    border-radius: 16px 16px 0px 0px;
    .header {
      position: relative;
      width: 100%;
      height: 55px;
      line-height: 55px;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      img {
        position: absolute;
        top: 16px;
        right: 16px;
        width: 24px;
        height: 24px;
      }
    }
    .info-item {
      display: flex;
      align-items: center;
      padding-left: 16px;
      height: 56px;
      font-size: 15px;
      border-bottom: 1px solid #dddee2;
      &.three {
        height: 76px;
        .change {
          width: 230px;
        }
      }
      & > .info-left {
        width: 75px;
      }
    }
    .exchange-item {
      padding-left: 16px;
      .title {
        margin: 15px 0;
        font-size: 15px;
      }
      .exchange-award {
        display: flex;
        align-items: center;
        width: 91%;
        height: 80px;
        background: #f8f6f7;
        & > img {
          margin-left: 14px;
          width: 60px;
          height: 60px;
        }
        .right-box {
          flex: 1;
          padding-left: 12px;
          .exchange-name {
            font-size: 15px;
          }
        }
      }
    }
    .bot-btn-box {
      display: flex;
      justify-content: space-around;
      margin-top: 50px;
      & > div {
        width: 140px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 14px;
        border-radius: 20px;
        color: #fff;
        background: #43ab5d;
        box-sizing: border-box;
      }
      .edit {
        background: #fff;
        border: 1px solid #43ab5d;
        color: #43ab5d;
      }
    }
  }
}
.moving-enter .mask-in,
.moving-leave-to .mask-in {
  opacity: 0;
}
.moving-enter .van-area,
.moving-leave-to .van-area {
  opacity: 0;
  transform: translateY(100px);
}
.moving-enter-active,
.moving-leave-active {
  transition: all 0.2s;
}
@media screen and (min-width: 799px) {
  .van-area {
    bottom: -227px !important;
  }
}
</style>
