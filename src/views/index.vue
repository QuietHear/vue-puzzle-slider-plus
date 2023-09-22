/*
 * @Author: aFei
 * @Date: 2023-09-20 13:38:58
*/
/*
 * @LastEditors: aFei
 * @LastEditTime: 2023-09-22 15:34:50
*/
<template>
  <div class="demo">
    <el-scrollbar>
      <div style="margin-bottom: 300px;">&nbsp;</div>
      <div style="width: 200px;height: 42px;">
        <vue-puzzle-slider-plus :getFunction="getObj" :setFunction="setObj" @change="change" />
      </div>
      <div style="width: 220px;margin-top: 20px;">
        <vue-puzzle-slider-plus ref="asd" :getFunction="getObj" :setFunction="setObj" @change="change" :showBtn="false" />
      </div>
      <el-button @click="upTest">拉起隐藏的组件</el-button>
    </el-scrollbar>
  </div>
</template>
<script setup>
import vuePuzzleSliderPlus from "~/lib/index.vue";
let checkNum = null;
const asd = ref(null);
const getObj = (obj) => {
  console.log(obj, 'obj1');
  return new Promise((resolve) => {
    let lin = (x) => {
      let result = x * x - 64;
      result = result.toString(8);
      result = window.btoa(result);
      return result;
    };
    checkNum = Math.floor(Math.random() * (obj.width2 - obj.width3 + 1) + obj.width3);
    console.log(checkNum, '发 传出');
    let res = {
      width: lin(checkNum),
      height: obj.height2,
      x: lin(obj.width4),
      y: Math.floor(
        Math.random() * (obj.height1 - obj.height4 + 1) + obj.height4
      ),
    };
    resolve({ code: 200, data: { ...res }, msg: "111" });
  });
};
const setObj = (obj) => {
  console.log(obj, 'obj2');
  return new Promise(async (resolve) => {
    let lin = (x) => {
      let result = window.atob(x);
      result = parseInt(result, 4);
      result = Math.sqrt(result + 16);
      return result;
    };
    console.log(lin(obj.x), '解 传入');
    let res = {
      percentage: 100 - Math.round((obj.time / 5) * 100),
    };
    resolve({ code: Math.abs(checkNum - lin(obj.x)) < 10 ? 200 : 123, data: { ...res }, msg: "111" });
  });
};
const change = (val) => {
  console.log(val, '结果');
};
const upTest = () => {
  asd.value.initPop();
};
</script>