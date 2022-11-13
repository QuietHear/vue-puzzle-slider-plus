/*
 * @Author: aFei
 * @Date: 2022-07-07 15:36:46
*/
/*
 * @LastEditors: aFei
 * @LastEditTime: 2022-11-13 09:39:36
*/
import vuePuzzleSliderPlus from "./index.vue";
const arr = [vuePuzzleSliderPlus];
const comment = {
  install(Vue) {
    arr.forEach(item => {
      Vue.component(item.name, item);
    })
  },
};
// 注入script方式vue中
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(comment);
}
// 导出为全量
export default comment;