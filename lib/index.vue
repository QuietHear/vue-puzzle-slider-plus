/*
 * @Author: aFei
 * @Date: 2022-07-07 15:36:46
*/
/*
 * @LastEditors: aFei
 * @LastEditTime: 2022-11-13 09:39:50
*/
<template>
  <div class="vue-puzzle-slider-plus">
    <div class="load-btn" v-if="loadBtn && showBtn">
      <div class="ding">
        <div></div>
        <div></div>
        <div></div>
      </div>
      加载中
    </div>
    <div
      class="test-btn"
      @click="initPop"
      v-if="testBtn && !showPop && showBtn"
    >
      <div class="ding">
        <div class="out"></div>
        <div class="in"></div>
      </div>
      点击按钮进行验证
    </div>
    <div class="testing-btn" v-if="showPop && showBtn">验证中</div>
    <div class="success-btn" v-if="successBtn && showBtn">
      <span class="source"></span>验证成功
    </div>
    <div
      v-if="showPop"
      @mousemove="dragMove"
      @mouseup="dragUp"
      :class="[
        'reg-pop',
        popAnimate,
        testContent === true ? 'test-pop' : '',
        ending === true ? 'ending' : '',
        timesContent === true ? 'times-pop' : '',
        successContent === true ? 'success-pop' : '',
      ]"
    >
      <div class="load-content" v-if="loadContent">
        <div></div>
        <p>智能验证检测中</p>
      </div>
      <div class="test-content" v-if="testContent">
        <div class="img-top">
          <div class="bg">
            <div class="source nothing"></div>
            <p>加载中...</p>
          </div>
          <div
            class="test"
            :class="[
              refresh === true ? 'hide' : '',
              popAnimate === 'success' ? 'none' : '',
            ]"
          >
            <canvas ref="testLost" width="260" height="156"></canvas>
            <canvas ref="testOne" width="260" height="156"></canvas>
          </div>
          <div
            class="right"
            :class="[
              refresh === true ? 'hide' : '',
              popAnimate === 'success' ? 'bright' : 'none',
            ]"
          >
            <canvas ref="right" width="260" height="156"></canvas>
          </div>
          <div
            class="result-msg"
            :class="[
              testStatus !== 0 ? 'show' : '',
              testSuccess === true ? 'success' : '',
            ]"
          >
            <span v-if="testSuccess === true"
              >{{ time }} 秒的速度超过 {{ percentage }}% 的用户</span
            >
            <span v-else-if="testSuccess === false && percentage < 0"
              >动作太慢，方块被怪兽吃掉了</span
            >
            <span v-else>拖动滑块将悬浮图像正确拼合</span>
          </div>
        </div>
        <div class="btn-middle source">
          <div
            class="source drag-btn"
            ref="dragBtn"
            :class="
              moveBtnStatus === 1
                ? 'drag'
                : moveBtnStatus === 2
                ? 'drag-end'
                : ''
            "
            @mousedown="dragDown"
          ></div>
          <span
            :class="
              moveTxtStatus === 1 ? 'hide' : moveTxtStatus === 2 ? 'none' : ''
            "
            >拖动左边滑块完成上方拼图</span
          >
        </div>
        <div class="operate-bottom">
          <div class="source close" @click="closePop">
            <div class="msg">关闭验证</div>
          </div>
          <div class="source refresh" @click="drawImg">
            <div class="msg">刷新验证</div>
          </div>
        </div>
      </div>
      <div class="success-content" v-if="successContent">
        <div class="container">
          <div class="out">
            <div class="pie"></div>
            <div class="filter"></div>
            <div class="mask"></div>
          </div>
          <div class="in">
            <div class="source"></div>
          </div>
        </div>
        <p>通过验证</p>
      </div>
      <div class="times-content" v-if="timesContent">
        <div class="source"></div>
        <p>{{ errMsg }}</p>
        <div class="error-msg">
          <span @click="doAgain">请点击此处重试</span>
          <em v-if="errMsg !== '尝试过多'"> or </em>
          <span @click="elseClose" v-if="errMsg !== '尝试过多'">关闭验证</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, onMounted, nextTick } from "vue";
export default {
  name: "vuePuzzleSliderPlus",
  emits: ["change"],
  props: {
    // 展示按钮控件
    showBtn: {
      type: Boolean,
      default: true,
    },
    // 抠图到图形边沿的距离
    space: {
      type: Number,
      default: 10,
    },
    // 资源图片路径集合
    imgList: {
      type: Array,
      default: () => {
        return [
          new URL("source/img1.png", import.meta.url).href,
          new URL("source/img2.png", import.meta.url).href,
          new URL("source/img3.png", import.meta.url).href,
          new URL("source/img4.png", import.meta.url).href,
          new URL("source/img5.png", import.meta.url).href,
          new URL("source/img6.png", import.meta.url).href,
          new URL("source/img7.png", import.meta.url).href,
          new URL("source/img8.png", import.meta.url).href,
          new URL("source/img9.png", import.meta.url).href,
          new URL("source/img10.png", import.meta.url).href,
        ];
      },
    },
    // 通过接口获取初始化图片相关信息
    getFunction: {
      type: Function,
      required: true,
    },
    // 通过接口提交校验结果
    setFunction: {
      type: Function,
      required: true,
    },
  },
  setup(props, { attrs, slots, emit, expose }) {
    // 初始化按钮
    let loadBtn = ref(true);
    onMounted(() => {
      setTimeout(() => {
        loadBtn.value = false;
        testBtn.value = true;
      }, 1500);
    });
    // 开始验证按钮
    let testBtn = ref(false);
    // 成功按钮
    let successBtn = ref(false);
    // 验证弹窗
    let showPop = ref(false);
    // 已关闭弹窗
    let ending = ref(false);
    // 验证结果
    let popAnimate = ref("");
    // 弹窗加载时展示内容
    let loadContent = ref(false);
    // 弹窗运行时展示内容
    let testContent = ref(false);
    // 超过次数后展示内容
    let timesContent = ref(false);
    // 成功后展示内容
    let successContent = ref(false);
    // 验证次数
    let times = ref(0);
    // 拼图时间
    let time = ref(0);
    // 最大尝试次数
    const timesMax = ref(6);
    // 拼图时间计时器
    let timeInit = ref(null);
    // 验证错误信息
    let errMsg = ref("");
    // 刷新中
    let refresh = ref(false);
    // 测试结果状态:0 未进行，1 已进行
    let testStatus = ref(0);
    // 测试结果
    let testSuccess = ref(false);
    // 碎片儿移动--按钮状态
    let moveBtnStatus = ref(0);
    // 碎片儿移动--文字状态
    let moveTxtStatus = ref(0);
    // 页面偏移量
    let beginPageX = ref(0);
    // 父元素偏移量
    let beginOffsetX = ref(0);
    // 拼图效率百分比
    let percentage = ref(0);
    // 开始校验
    const initPop = () => {
      window.addEventListener("click", popListener, false);
    };
    // jq的$closest方法
    const closest = (el, selector) => {
      // 实现closest()方法
      let matchesSelector =
        el.matches ||
        el.webkitMatchesSelector ||
        el.mozMatchesSelector ||
        el.msMatchesSelector;
      while (el) {
        if (matchesSelector.call(el, selector)) {
          break;
        }
        el = el.parentElement;
      }
      return el;
    };
    // 检测弹窗事件
    const popListener = (e) => {
      if (
        closest(e.target, ".reg-pop") === null &&
        popAnimate.value !== "success"
      ) {
        if (!showPop.value) {
          showPop.value = true;
          loadContent.value = true;
          testContent.value = false;
          times.value = 0;
          setTimeout(() => {
            loadContent.value = false;
            testContent.value = true;
            nextTick(() => {
              drawImg();
            });
          }, 1000);
        } else {
          closePop();
        }
      }
    };
    // 碎片儿宽
    const testWidth = ref(50);
    // 碎片儿高
    const testHeight = ref(50);
    // 碎片儿缺口方向
    let testPath = ref([]);
    // 碎片儿移动最小偏移
    let moveMin = ref(0);
    // 碎片儿移动最大偏移
    let moveMax = ref(0);
    // 碎片儿距离左边距离
    let testX = ref(0);
    // 碎片儿距离左边距离最小值
    const testXMin = ref(0);
    // 碎片儿距离左边距离最大值
    const testXMax = ref(0);
    // 碎片儿距离右边距离
    const testY = ref(0);
    // 碎片儿距离右边距离最小值
    const testYMin = ref(0);
    // 碎片儿距离右边距离最大值
    const testYMax = ref(0);
    // 碎片儿圆圈实际半径
    let testr = ref(0);
    // 碎片儿圆圈最小半径
    const testrMin = ref(7);
    // 碎片儿圆圈最大半径
    const testrMax = ref(12);
    // 带缺口的画布
    const testLost = ref(null);
    // 小方块儿画布
    const testOne = ref(null);
    // 拖拽按钮
    const dragBtn = ref(null);
    // 正确的画布
    const right = ref(null);
    // 绘制图形
    const drawImg = () => {
      times.value += 1;
      if (times.value > timesMax.value) {
        testContent.value = false;
        errMsg.value = "尝试过多";
        timesContent.value = true;
      } else {
        refresh.value = true;
        testPath.value = [...randomPath()];
        // 左开右闭区间，+1
        testr.value = Math.floor(
          Math.random() * (testrMax.value - testrMin.value + 1) + testrMin.value
        );
        testXMin.value = props.space + testWidth.value / 2;
        testXMax.value = right.value.width - props.space - testWidth.value;
        testYMin.value = props.space;
        testYMax.value = right.value.height - props.space - testHeight.value;
        // 计算最大距离
        for (let i = 0; i < testPath.value.length; i++) {
          if (
            testPath.value[i].direction === "left" &&
            testPath.value[i].much === "outside"
          ) {
            testXMin.value = props.space + testr.value + testWidth.value / 2;
          } else if (
            testPath.value[i].direction === "right" &&
            testPath.value[i].much === "outside"
          ) {
            testXMax.value =
              right.value.width - testr.value - props.space - testWidth.value;
          } else if (
            testPath.value[i].direction === "top" &&
            testPath.value[i].much === "outside"
          ) {
            testYMin.value = props.space + testr.value;
          } else if (
            testPath.value[i].direction === "bottom" &&
            testPath.value[i].much === "outside"
          ) {
            testYMax.value =
              right.value.height - testr.value - props.space - testHeight.value;
          }
        }
        props
          .getFunction({
            r: testrMax.value,
            width1: right.value.width,
            width2: testXMax.value,
            width3: testXMin.value,
            width4: right.value.width - 20,
            height1: testYMax.value,
            height2: right.value.height,
            height3: right.value.height - 10,
            height4: testYMin.value,
          })
          .then((res) => {
            if (res.code === 200) {
              setTimeout(() => {
                refresh.value = false;
                let c = right.value,
                  c_lost = testLost.value,
                  c_one = testOne.value,
                  ctx = c.getContext("2d"),
                  ctx_lost = c_lost.getContext("2d"),
                  ctx_one = c_one.getContext("2d");
                testX.value = decResult(res.data.width);
                testY.value = res.data.y;
                moveMin.value =
                  -testX.value + testXMin.value - testWidth.value / 2;
                moveMax.value = testXMax.value - testX.value;
                c_one.style.left = moveMin.value + "px";
                ctx.clearRect(0, 0, c.width, c.height);
                ctx_lost.clearRect(0, 0, c_lost.width, c_lost.height);
                ctx_one.clearRect(0, 0, c_one.width, c_one.height);
                let img = newImg();
                // 图片加载成功
                img.onload = () => {
                  // 画正确的图片
                  ctx.drawImage(
                    img,
                    0,
                    0,
                    img.width,
                    img.height,
                    0,
                    0,
                    c.width,
                    c.height
                  );
                  // 画带缺口图片
                  ctx_lost.save();
                  ctx_lost.drawImage(
                    img,
                    0,
                    0,
                    img.width,
                    img.height,
                    0,
                    0,
                    c_lost.width,
                    c_lost.height
                  );
                  ctx_lost.strokeStyle = "rgba(255,255,255,.4)";
                  ctx_lost.lineWidth = 1;
                  ctx_lost.beginPath();
                  ctx_lost.moveTo(testX.value, testY.value);
                  testPath.value.forEach((item) => {
                    item.direction === "top" ? drawCircle(ctx_lost, item) : "";
                  });
                  ctx_lost.lineTo(testX.value + testWidth.value, testY.value);
                  testPath.value.forEach((item) => {
                    item.direction === "right"
                      ? drawCircle(ctx_lost, item)
                      : "";
                  });
                  ctx_lost.lineTo(
                    testX.value + testWidth.value,
                    testY.value + testHeight.value
                  );
                  testPath.value.forEach((item) => {
                    item.direction === "bottom"
                      ? drawCircle(ctx_lost, item)
                      : "";
                  });
                  ctx_lost.lineTo(testX.value, testY.value + testHeight.value);
                  testPath.value.forEach((item) => {
                    item.direction === "left" ? drawCircle(ctx_lost, item) : "";
                  });
                  ctx_lost.lineTo(testX.value, testY.value);
                  ctx_lost.closePath();
                  ctx_lost.stroke();
                  ctx_lost.restore();
                  ctx_lost.save();
                  ctx_lost.fillStyle = "rgba(0,0,0,.65)";
                  ctx_lost.fill();
                  ctx_lost.restore();
                  // 画碎片
                  ctx_one.strokeStyle = "#F6F152";
                  ctx_one.lineWidth = 3.5;
                  ctx_one.shadowBlur = 5;
                  ctx_one.shadowOffsetX = 0;
                  ctx_one.shadowOffsetY = 0;
                  ctx_one.shadowColor = "black";
                  ctx_one.save();
                  ctx_one.beginPath();
                  ctx_one.moveTo(testX.value, testY.value);
                  testPath.value.forEach((item) => {
                    item.direction === "top" ? drawCircle(ctx_one, item) : "";
                  });
                  ctx_one.lineTo(testX.value + testWidth.value, testY.value);
                  testPath.value.forEach((item) => {
                    item.direction === "right" ? drawCircle(ctx_one, item) : "";
                  });
                  ctx_one.lineTo(
                    testX.value + testWidth.value,
                    testY.value + testHeight.value
                  );
                  testPath.value.forEach((item) => {
                    item.direction === "bottom"
                      ? drawCircle(ctx_one, item)
                      : "";
                  });
                  ctx_one.lineTo(testX.value, testY.value + testHeight.value);
                  testPath.value.forEach((item) => {
                    item.direction === "left" ? drawCircle(ctx_one, item) : "";
                  });
                  ctx_one.lineTo(testX.value, testY.value);
                  ctx_one.closePath();
                  ctx_one.stroke();
                  ctx_one.stroke();
                  ctx_one.stroke();
                  ctx_one.clip();
                  ctx_one.drawImage(
                    img,
                    0,
                    0,
                    img.width,
                    img.height,
                    0,
                    0,
                    c_one.width,
                    c_one.height
                  );
                  ctx_one.restore();
                };
              }, 500);
            } else {
              try {
                console.error(`服务端错误:${res.message || res.msg}`, res);
              } finally {
                testContent.value = false;
                errMsg.value = "网络超时";
                timesContent.value = true;
              }
            }
          });
      }
    };
    // 发送数据加密
    const encResult = (x) => {
      let result = (x + 4) * (x - 4);
      result = result.toString(4);
      result = window.btoa(result);
      return result;
    };
    // 解密后台返回数据
    const decResult = (x) => {
      let result = window.atob(x);
      result = parseInt(result, 8);
      result = Math.sqrt(result + 64);
      return result;
    };
    // 画缺角
    const drawCircle = (ctx, path) => {
      let changeX = testr.value,
        changeY = testr.value;
      switch (path.direction) {
        case "top":
          changeY = path.much === "inside" ? changeY : -changeY;
          ctx.lineTo(testX.value + testWidth.value / 2 - changeX, testY.value);
          ctx.arcTo(
            testX.value + testWidth.value / 2 - changeX,
            testY.value + changeY,
            testX.value + testWidth.value / 2,
            testY.value + changeY,
            testr.value
          );
          ctx.arcTo(
            testX.value + testWidth.value / 2 + changeX,
            testY.value + changeY,
            testX.value + testWidth.value / 2 + changeX,
            testY.value,
            testr.value
          );
          break;
        case "right":
          changeX = path.much === "inside" ? -changeX : changeX;
          ctx.lineTo(
            testX.value + testWidth.value,
            testY.value + testHeight.value / 2 - changeY
          );
          ctx.arcTo(
            testX.value + testWidth.value + changeX,
            testY.value + testHeight.value / 2 - changeY,
            testX.value + testWidth.value + changeX,
            testY.value + testHeight.value / 2,
            testr.value
          );
          ctx.arcTo(
            testX.value + testWidth.value + changeX,
            testY.value + testHeight.value / 2 + changeY,
            testX.value + testWidth.value,
            testY.value + testHeight.value / 2 + changeY,
            testr.value
          );
          break;
        case "bottom":
          changeY = path.much === "inside" ? -changeY : changeY;
          ctx.lineTo(
            testX.value + testWidth.value / 2 + changeX,
            testY.value + testHeight.value
          );
          ctx.arcTo(
            testX.value + testWidth.value / 2 + changeX,
            testY.value + testHeight.value + changeY,
            testX.value + testWidth.value / 2,
            testY.value + testHeight.value + changeY,
            testr.value
          );
          ctx.arcTo(
            testX.value + testWidth.value / 2 - changeX,
            testY.value + testHeight.value + changeY,
            testX.value + testWidth.value / 2 - changeX,
            testY.value + testHeight.value,
            testr.value
          );
          break;
        case "left":
          changeX = path.much === "inside" ? changeX : -changeX;
          ctx.lineTo(testX.value, testY.value + testHeight.value / 2 + changeY);
          ctx.arcTo(
            testX.value + changeX,
            testY.value + testHeight.value / 2 + changeY,
            testX.value + changeX,
            testY.value + testHeight.value / 2,
            testr.value
          );
          ctx.arcTo(
            testX.value + changeX,
            testY.value + testHeight.value / 2 - changeY,
            testX.value,
            testY.value + testHeight.value / 2 - changeY,
            testr.value
          );
          break;
      }
    };
    // 输出一张图片
    const newImg = () => {
      let img = new Image();
      img.src = props.imgList[Math.floor(Math.random() * props.imgList.length)];
      return img;
    };
    // 输出不重复的方向组合
    const randomPath = () => {
      const direction = ["top", "right", "bottom", "left"],
        much = ["outside", "inside"];
      let lin = [...direction],
        result = [];
      for (let i = 0; i < 2; i++) {
        let x = Math.floor(Math.random() * lin.length);
        result[i] = {
          direction: lin[x],
          much: much[Math.floor(Math.random() * much.length)],
        };
        lin.splice(x, 1);
      }
      return result;
    };
    // 重试
    const doAgain = () => {
      times.value = 0;
      timesContent.value = false;
      testContent.value = true;
      nextTick(() => {
        drawImg();
      });
    };
    // 开始拖拽
    const dragDown = (e) => {
      if (moveTxtStatus.value === 0 && refresh.value === false) {
        moveBtnStatus.value = 1;
        moveTxtStatus.value = 1;
        time.value = 0;
        timeInit.value = setInterval(() => {
          time.value = Math.round((time.value + 0.1) * 10) / 10;
        }, 100);
        setTimeout(() => {
          moveTxtStatus.value = 2;
        }, 50);
        beginPageX.value = e.pageX;
        beginOffsetX.value = e.offsetX;
      }
    };
    // 拖拽进行中
    const dragMove = (e) => {
      if (moveBtnStatus.value === 1) {
        if (e.pageX - beginPageX.value < 0) {
          dragBtn.value.style.left = "0px";
          testOne.value.style.left = moveMin.value + "px";
        } else if (e.pageX - beginPageX.value > 260 - 56) {
          // 根据实际CSS调整
          dragBtn.value.style.left = "204px";
          testOne.value.style.left = moveMax.value + "px";
        } else {
          testOne.value.style.left =
            moveMin.value +
            ((moveMax.value - moveMin.value) * (e.pageX - beginPageX.value)) /
              (260 - 56) +
            "px";
          dragBtn.value.style.left = e.pageX - beginPageX.value + "px";
        }
      }
    };
    // 拖拽结束
    const dragUp = () => {
      if (moveBtnStatus.value === 1) {
        clearInterval(timeInit.value);
        timeInit.value = null;
        moveBtnStatus.value = 2;
        testStatus.value = 1;
        moveTxtStatus.value = 1;
        checkResult();
      }
    };
    // 拖拽结果校验
    const checkResult = () => {
      props
        .setFunction({
          x: encResult(
            parseInt(testOne.value.style.left) - moveMin.value + testr.value
          ),
          time: time.value,
        })
        .then((res) => {
          percentage.value = res.data.percentage;
          if (res.code === 200) {
            if (percentage.value > 0) {
              testSuccess.value = true;
              popAnimate.value = "success";
              setTimeout(() => {
                testStatus.value = 0;
                testContent.value = false;
                successContent.value = true;
                setTimeout(() => {
                  window.removeEventListener("click", popListener, false);
                  testBtn.value = false;
                  ending.value = true;
                  setTimeout(() => {
                    ending.value = false;
                    showPop.value = false;
                    successBtn.value = true;
                    emit("change", true);
                  }, 1000);
                }, 1100);
              }, 1000);
            }
            // 拼接超时
            else {
              testSuccess.value = false;
              popAnimate.value = "wrong";
              setTimeout(() => {
                testOne.value.style.opacity = 0;
                setTimeout(() => {
                  popAnimate.value = "";
                  testStatus.value = 0;
                  dragBtn.value.style.left = "0px";
                  testOne.value.style.left = moveMin.value + "px";
                  testOne.value.style.opacity = 1;
                  setTimeout(() => {
                    moveTxtStatus.value = 0;
                    moveBtnStatus.value = 0;
                  }, 500);
                }, 500);
              }, 1000);
            }
          }
          // 拼接错误
          else if (res.code === 123) {
            times.value += 1;
            if (times.value > timesMax.value) {
              testContent.value = false;
              errMsg.value = "尝试过多";
              timesContent.value = true;
            } else {
              percentage.value = 1; // 临时修改数据，区别超时的情况
              testSuccess.value = false;
              popAnimate.value = "wrong";
              setTimeout(() => {
                testOne.value.style.opacity = 0;
                setTimeout(() => {
                  popAnimate.value = "";
                  testStatus.value = 0;
                  dragBtn.value.style.left = "0px";
                  testOne.value.style.left = moveMin.value + "px";
                  testOne.value.style.opacity = 1;
                  setTimeout(() => {
                    moveTxtStatus.value = 0;
                    moveBtnStatus.value = 0;
                  }, 500);
                }, 500);
              }, 1000);
            }
          } else {
            try {
              console.error(`服务端错误:${res.message || res.msg}`, res);
            } finally {
              testContent.value = false;
              errMsg.value = "网络超时";
              timesContent.value = true;
            }
          }
        });
    };
    // 关闭正常弹窗
    const closePop = () => {
      // 关闭弹窗
      if (testContent.value === true && popAnimate.value !== "success") {
        window.removeEventListener("click", popListener, false);
        ending.value = true;
        clearInterval(timeInit.value);
        timeInit.value = null;
        setTimeout(() => {
          testStatus.value = 0;
          moveTxtStatus.value = 0;
          moveBtnStatus.value = 0;
          ending.value = false;
          showPop.value = false;
          emit("change", false);
        }, 1000);
      }
    };
    // 关闭错误弹窗
    const elseClose = () => {
      window.removeEventListener("click", popListener, false);
      showPop.value = false;
      timesContent.value = false;
      emit("change", false, "");
    };
    return {
      loadBtn,
      testBtn,
      successBtn,
      showPop,
      ending,
      popAnimate,
      loadContent,
      testContent,
      timesContent,
      successContent,
      time,
      errMsg,
      refresh,
      testStatus,
      testSuccess,
      moveBtnStatus,
      moveTxtStatus,
      percentage,
      initPop,
      testLost,
      testOne,
      dragBtn,
      right,
      drawImg,
      doAgain,
      dragDown,
      dragMove,
      dragUp,
      closePop,
      elseClose,
    };
  },
};
</script>
<style lang="scss">
@use "style/index.scss" as *;
</style>