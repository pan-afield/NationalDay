<template>
  <div class="ranking-list-popup">
    <div class="mask"></div>
    <div class="panel">
      <div class="head">
        排行榜
        <img
          class="close"
          src="../assets/popup/icon_close.png"
          @click="$emit('close')"
          alt=""
        />
      </div>
      <div class="top-three-box">
        <div class="second">
          <div class="avator-box">
            <img class="crown" src="../assets/popup/second.png" alt="" />
            <div class="avator">
              <img :src="secondRank.headimg" alt="" />
            </div>
            <p class="user-name">{{ secondRank.nickname }}</p>
          </div>
          <div class="water-num">
            <img
              class="water-icon"
              src="../assets/popup/img_water@2x.png"
              alt=""
            />
            <span>{{ secondRank.gamenums }}</span>
          </div>
        </div>
        <div class="first">
          <div class="avator-box">
            <img class="crown" src="../assets/popup/first.png" alt="" />
            <div class="avator">
              <img :src="firstRank.headimg" alt="" />
            </div>
            <p class="user-name">{{ firstRank.nickname }}</p>
          </div>
          <div class="water-num">
            <img
              class="water-icon"
              src="../assets/popup/img_water@2x.png"
              alt=""
            />
            <span>{{ firstRank.gamenums }}</span>
          </div>
        </div>
        <div class="third">
          <div class="avator-box">
            <img class="crown" src="../assets/popup/third.png" alt="" />
            <div class="avator">
              <img :src="thirdRank.headimg" alt="" />
            </div>
            <p class="user-name">{{ thirdRank.nickname }}</p>
          </div>
          <div class="water-num">
            <img
              class="water-icon"
              src="../assets/popup/img_water@2x.png"
              alt=""
            />
            <span>{{ thirdRank.gamenums }}</span>
          </div>
        </div>
      </div>
      <div class="rank-outer">
        <div class="top-bar">
          <div>排名</div>
          <div>昵称</div>
          <div class="bar">水滴</div>
          <div class="award">
            <img src="@/assets/mission/icon_lebi_welfare.png" alt="" /> 奖励
          </div>
        </div>
        <div class="my-rank">
          <div class="ranking">{{ myRank.rank }}</div>
          <!-- <div class="img">
            <img :src="myRank.headimg" alt="" />
          </div> -->
          <div class="name">{{ myRank.nickname }}</div>
          <div class="num">{{ myRank.gamenums }}</div>
          <div class="reward">{{ numToStone(myRank.reward) }}</div>
        </div>
        <div class="rank-list-box">
          <ul>
            <li class="rank-li" v-for="item in rankList" :key="item.rank">
              <div class="ranking">{{ item.rank }}</div>
              <!-- <div class="img">
                <img :src="item.headimg" alt="" />
              </div> -->
              <div class="name">{{ item.nickname }}</div>
              <div class="num">{{ item.gamenums }}</div>
              <div class="reward">{{ numToStone(item.reward) }}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import util from "../utils/utils";
export default {
  name: "RankingList",
  data() {
    return {
      rankList: [],
      myRank: {},
      firstRank: {},
      secondRank: {},
      thirdRank: {},
    };
  },
  created() {
    this.getRankList();
  },
  methods: {
    getRankList() {
      this.$axios
        .get("/Rank/GetWarterRank", { params: { page: 1, pagesize: 199 } })
        .then((data) => {
          if (data.Result === 0) {
            this.rankList = data.Data.rank;
            const res1 = data.Data.rank.find((item) => item.rank === 1);
            const res2 = data.Data.rank.find((item) => item.rank === 2);
            const res3 = data.Data.rank.find((item) => item.rank === 3);
            res1 && (this.firstRank = res1);
            res2 && (this.secondRank = res2);
            res3 && (this.thirdRank = res3);
            if (data.Data.myrank) {
              this.myRank = data.Data.myrank;
            }
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
.ranking-list-popup {
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
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    .head {
      position: relative;
      margin: 16px 0 8px 0;
      width: 100%;
      height: 25px;
      line-height: 25px;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      .close {
        position: absolute;
        top: 0;
        right: 16px;
        width: 24px;
        height: 24px;
      }
    }
    .top-three-box {
      display: flex;
      justify-content: space-around;
      align-items: baseline;
      padding-top: 10px;
      height: 220px;
      background: url("../assets/popup/img_banner_list@2x.png") no-repeat;
      background-size: 100% 100%;
      box-sizing: border-box;
      .second,
      .first,
      .third {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        .avator-box {
          .crown {
            display: block;
            position: relative;
            top: 5px;
            margin: auto;
            width: 28px;
            height: 25px;
          }
          .avator {
            overflow: hidden;
            width: 60px;
            height: 60px;
            border: 2px solid #dfe6eb;
            border-radius: 50%;
            z-index: 3;
            background: #fff;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .user-name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 70px;
            text-align: center;
            font-size: 14px;
            color: #fff;
          }
        }

        .water-num {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          margin-top: 18px;
          width: 80px;
          height: 18px;
          line-height: 15px;
          text-align: center;
          font-size: 13px;
          color: #fff;
          background-color: #118459;
          border-radius: 18px;
          .water-icon {
            margin-right: 4px;
            width: 10px;
            height: 13px;
          }
        }
      }
      .first {
        .avator-box {
          .crown {
            width: 36px !important;
            height: 26px !important;
          }
          .avator {
            width: 66px !important;
            height: 66px !important;
            border-color: #ffc000 !important;
          }
        }
      }
      .second {
        transform: translateY(-4px);
        align-self: center;
        .avator-box {
          .crown {
            left: 14px !important;
            top: 9px !important;
          }
        }
      }
      .third {
        align-self: center;
        .avator-box {
          .crown {
            left: 14px !important;
            top: 9px !important;
          }
          .avator {
            border-color: #ffe1b4 !important;
          }
        }
      }
    }
    .rank-outer {
      margin: 10px auto 0;
      width: 91.46%;
      .top-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: auto;
        padding: 0 10px 0 10px;
        width: 100%;
        height: 40px;
        font-size: 15px;
        color: #999;
        box-sizing: border-box;
        .award {
          position: relative;
          img {
            position: absolute;
            width: 18px;
            height: 18px;
            left: -20px;
            top: 2px;
          }
        }
        .bar {
          position: relative;
          &::before {
            content: "";
            position: absolute;
            left: -20px;
            top: 2px;
            width: 14px;
            height: 18px;
            background: url("../assets/popup/img_water@2x.png") no-repeat;
            background-size: 100% 100%;
          }
        }
      }
      .my-rank {
        display: flex;
        align-items: center;
        height: 52px;
        margin-top: 10px;
        background: #f8f6f7;
        border-radius: 6px;
        font-size: 14px;
        color: #43ab5d;
        .ranking {
          width: 44px;
          text-align: center;
          font-size: 18px;
        }
        .img {
  overflow-x: hidden;
  overflow-y: hidden;
          margin-left: 14px;
          width: 36px;
          height: 36px;
          border: 1px solid #43ab5d;
          box-sizing: border-box;
          border-radius: 50%;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .name {
  overflow-x: hidden;
  overflow-y: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          flex: 1;
          padding-left: 10px;
        }
        .reward {
          width: 80px;
          text-align: center;
        }
        .num {
          width: 80px;
          text-align: center;
        }
      }
      .rank-list-box {
        overflow-x: hidden;
        overflow-y: scroll;
        height: 28.5vh;
        ul {
          .rank-li {
            display: flex;
            align-items: center;
            height: 68px;
            font-size: 14px;
            border-bottom: 1px solid #dddee2;
            .ranking {
              width: 44px;
              text-align: center;
              font-size: 18px;
              color: #8d8d8d;
            }
            .img {
   overflow-x: hidden;
  overflow-y: hidden;
              margin-left: 14px;
              width: 36px;
              height: 36px;
              border: none !important;
              box-sizing: border-box;
              border-radius: 50%;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .name {
  overflow-x: hidden;
  overflow-y: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              flex: 1;
              padding-left: 10px;
            }
            .reward {
              width: 80px;
              text-align: center;
            }
            .num {
              width: 80px;
              text-align: center;
            }
          }
        }
      }
    }
  }
}
</style>
