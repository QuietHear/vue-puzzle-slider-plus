/*
 * @Author: aFei
 * @Date: 2022-07-07 15:36:46
*/
/*
 * @LastEditors: aFei
 * @LastEditTime: 2023-01-11 17:55:25
*/
import vuePuzzleSliderPlus from "./index.vue";
const arr = [vuePuzzleSliderPlus];
const comment = {
  install(Vue) {
    arr.forEach(item => {
      Vue.component('vuePuzzleSliderPlus', item);
    })
  },
};
// 注入script方式vue中
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(comment);
}
// 导出为全量
export default comment;