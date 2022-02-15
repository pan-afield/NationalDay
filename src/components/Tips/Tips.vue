<template>
  <transition name="tips">
    <div class="tips-view" v-if="displayTips">
      <div class="mask" @click="hide()" id="mass"></div>
      <div class="content">
        <div v-if="type !== 2" class="close" @click="hide()"></div>
        <div class="tip">{{ title }}</div>
        <div class="content1" v-if="type === 0">
          <p class="failure">
            <span
              ><img src="@/assets/sign_img/icon_failure@2x.png" alt=""
            /></span>
            <span>补签失败</span>
          </p>
          <div class="explain">{{ content }}</div>
          <div class="content1_btn" @click="hide(1)">确定</div>
        </div>
        <div class="content1" v-if="type === 1">
          <img
            v-if="name === 1"
            src="@/assets/sign_img/icon_successful01@2x.png"
            alt=""
          />
          <img
            v-if="name === 2"
            src="@/assets/sign_img/icon_successful02@2x.png"
            alt=""
          />
          <p>{{ content }}</p>
          <div class="explain1" v-if="name === 1">恭喜您获得{{ gift }}！</div>
          <div class="content1_btn" @click="hide(1)">确定</div>
        </div>
        <div class="content1" v-if="type === 3">
          <p class="think">{{ content }}</p>
          <div class="content1_btn" @click="hide(1)">确定</div>
        </div>
        <div class="content1" v-if="type === 2">
          <p class="edit">
            <span>{{ content }}</span>
          </p>
          <div class="content1_btn" @click="hide(1)">
            {{ title === "更换奖品" ? "我知道了" : "确定" }}
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    gift: {
      type: String,
      default: "",
    },
    title: {
      // 标题
      type: String,
      default: "提示",
    },
    content: {
      type: String,
      default: "这是弹框内容",
    },
    type: {
      type: Number,
      default: 0,
    },
    name: {
      type: Number,
    },
  },

  data() {
    return {
      resolve: "",
      reject: "",
      promise: "", // 保存promise对象
      displayTips: false,
    };
  },

  methods: {
    // 关闭 true-catch抛出错误 false-then继续下一步
    hide(type) {
      this.displayTips = false;
      if (type) {
        this.reject(this.name); //catch抛出错误
      } else {
        this.resolve(this.name);  //then继续下一步
      }
      this.remove();
    },

    // 弹出提示框，并且创建一个promise对象
    show() {
      this.displayTips = true;
      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      })
        .then(() => {})
        .catch((e) => {});

      return this.promise;
    },

    // 销毁节点
    remove() {
      setTimeout(() => {
        this.destroy();
      }, 200);
    },

    destroy() {
      this.$destroy();
      document.body.removeChild(this.$el);
    },
  },

  created() {},
};
</script>

<style lang="scss" scoped>
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

.tips-view {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 500;
  top: 0;
  .content {
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
    .tip {
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
    .content1 {
      .think {
        height: 50px;
        width: 80%;
        line-height: 50px;
      }
      .edit {
        padding: 0 35px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 17px;
        height: 120px;
        box-sizing: border-box;
      }
      .explain {
        width: 200px;
        height: 61px;
        font-size: 14px;
        margin: 20px auto 0;
        line-height: 22px;
        color: #666666;
      }
      .explain1 {
        width: 200px;
        font-size: 14px;
        margin: 0 auto;
        line-height: 20px;
        color: #666666;
      }
      width: 280px;
      height: 188px;
      margin: 40px auto 0;
      position: relative;
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 30px;
      color: #333333;
      text-align: center;
      border-radius: 6px;
      img {
        margin: 0 auto;
        display: block;
        width: 60px;
        height: 60px;
      }
      p {
        width: 100%;
        margin: 10px auto 0;
        font-size: 16px;
        color: #333333;
        img {
          display: inline-block;
          width: 30px;
          height: 30px;
        }
      }
      .failure {
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translateY(20px);
        span {
          margin-right: 10px;
          font-size: 16px;
          color: #333333;
        }
      }
      .content1_btn {
        width: 180px;
        height: 40px;
        position: absolute;
        bottom: 0;
        left: 50%;
        margin-left: -90px;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 40px;
        color: #ffffff;
        background: #43ab5d;
        border-radius: 30px;
      }
    }
  }
}
.tips-view .content,
.tips-view .mask {
  transition: all 0.2s;
}
.tips-enter .mask,
.tips-leave-to .mask {
  opacity: 0;
}
.tips-enter-active,
.tips-leave-active {
  transition: all 0.2s;
}
.tips-enter .content,
.tips-leave-to .content {
  transform: translate(-50%, -50%) scale(0.8);
  opacity: 0;
}
.content1 {
  /deep/ a {
    color: #ff2c2c !important;
  }
}
</style>
