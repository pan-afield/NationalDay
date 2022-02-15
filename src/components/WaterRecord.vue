<template>
  <div class="waterRecoed">
    <div class="mask"></div>
    <div class="panel">
      <div class="head">水滴记录</div>
      <div class="wood">
        <div class="wood-box">
          <div class="time">时间</div>
          <div class="from">来源</div>
          <div class="water">水滴</div>
          <div class="add">增减</div>
        </div>
      </div>
      <div class="content">
        <div class="close" @click="closeAll()"></div>
        <ul class="scroll" @scroll="scrollEvent">
          <li v-for="(item, index) in recordList" :key="index">
            <div class="time">{{ item.writetime }}</div>
            <div class="from">{{ item.remark }}</div>
            <div class="water">{{ item.curnums }}</div>
            <div :class="[item.nums >= 0 ? 'add' : 'reduce']">
              <span v-if="item.nums >= 0">+</span>{{ item.nums }}
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "waterRecoed",
  data() {
    return {
      page: 1,
      hourMiu: "",
      mouthDay: "",
      recordList: [],
      list: [],
    };
  },
  methods: {
    closeAll() {
      this.$parent.isShowWaterRecord = false;
    },
    //监听滚动
    scrollEvent(e) {
      if (
        e.srcElement.scrollTop + e.srcElement.offsetHeight ===
        e.srcElement.scrollHeight
      ) {
        if (this.list.length !== 0) {
          this.getWaterRecord(++this.page);
        }
      }
    },
    //获取记录
    getWaterRecord(page) {
      this.$axios
        .get("/Tree/GetWarterRecord", { params: { page, pagesize: 20 } })
        .then((res) => {
          this.list = res.Data.waterrecord;
          this.list.forEach((item) => {
            item.writetime = item.writetime.substring(5, 16);
          });
          this.recordList.push(...this.list);
        });
    },
  },
  created() {
    this.getWaterRecord(1);
  },
  mounted() {},
};
</script>

<style lang='scss' scoped>
.waterRecoed {
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
    .wood {
      margin: 0 auto;
      width: 88.8%;
      height: 30px;
      background: linear-gradient(180deg, #f3b15d 0%, #fa6328 100%);
      border-radius: 6px 6px 0px 0px;
      &-box {
        font-size: 14px;
        width: 100%;
        height: 100%;
        color: #fcf9e8;
        display: flex;
        align-items: center;
        justify-content: space-around;
      }
    }
    .content {
      position: relative;
      margin: 0 auto;
      padding-top: 5px;
      width: 88.8%;
      height: calc(100vh - 215px);
      background: url("~@/assets/welfare/bg_mission_bottom.png") no-repeat;
      background-size: 100% 100%;
      .close {
        position: absolute;
        right: -15px;
        top: -45px;
        width: 32px;
        height: 32px;
        background: url("~@/assets/welfare/icon_cllose.png") no-repeat;
        background-size: 100% 100%;
      }
      ul {
        width: 100%;
        height: calc(100vh - 224px);
        overflow-x: hidden;
        overflow-y: scroll;
        li {
          font-size: 14px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e6cfb7;
          width: 90%;
          height: 50px;
          .water,
          .add,
          .reduce,
          .from {
            width: 60px;
          }
          .water {
            text-align: center;
          }
          .time {
            font-size: 12px;
          }
          .reduce,
          .add {
            font-size: 14px;
            color: #ff4141;
            font-weight: 600;
            text-align: center;
          }
          .reduce {
            color: #2ebf6e;
          }
        }
      }
    }
  }
}
</style>
