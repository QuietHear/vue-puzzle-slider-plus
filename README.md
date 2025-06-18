# 滑动拼图（vue3版）
***vue3版本*** | [**vue2版本**](https://github.com/QuietHear/vue-puzzle-slider '右键新窗口浏览')


## 预览
	clone项目后npm run preview即可


## 安装
	npm i vue-puzzle-slider-plus


## 使用
	import vuePuzzleSliderPlus from "vue-puzzle-slider-plus";
	import "vue-puzzle-slider-plus/index.css";
	
	app.use(vuePuzzleSliderPlus);


## 1. 参数
* `showBtn`：是否显示点击按钮-->Boolean;非必传;默认*true*

* `space`：抠图到图形边沿的距离-->Number;非必传;默认*10*

* `imgList`：资源图片路径集合-->Array;非必传;默认使用组件内置的10张图片
>
	// 例子
	:imgList="[url,url,url...]"
>

* `getFunction`：通过接口获取初始化图片相关信息，必须是返回Promise且包含正确格式数据-->Function;必传
>
	// 例子
    const test = (obj) => {
		// 这个地方的obj是组件内部抛出
		//
		// 圆弧最大半径，无用参数
		// obj.r: 1;
		// 
		// 假数据，无用参数
		// obj.width1: 1;
		// 
		// x方向最小值
		// obj.width2: 1;
		// 
		// x方向最大值
		// obj.width3: 1;
		// 
		// 假数据，无用参数
		// obj.width4: 1;
		// 
		// y方向最小值
		// obj.height1: 1;
		// 
		// 假数据，无用参数
		// obj.height2: 1;
		// 
		// 假数据，无用参数
		// obj.height3: 1;
		// 
		// y方向最大值
		// obj.height4: 1;
		// 
    	return new Promise(async (resolve) => {
			// 前端自己处理/请求后端
        	const res = await APIUrl(obj);
			// 接口返回的数据中请包含以下信息
			// 
			// 是否请求成功，只有为200才算成功
			// res.code: '';
			// 
			// 返回的必要值
			// res.data: {
				//
				// 抠图x方向最终的值，需要后端或者前端存起来后面做校验，这个地方需进行加密(先平方再减64，等到的结果转换为8进制，然后使用btoa加密)
				// let result = x * x - 64;result = result.toString(8);result = window.btoa(result);
				// width: 1;
				//
				// 假数据，建议使用obj.height2，无用参数
				// height: 1;
				//
				// 假数据，建议使用obj.width4，需要与width相同的方法加密，无用参数
				// x: 1;
				//
				// 抠图y方向最终的值
				// y: 1;
			//};
			// 
			// 错误提示消息
			// res.msg/message: '';
			// 
    		resolve(res);
    	});
    };
>

* `setFunction`：通过接口提交校验结果，必须是返回Promise且包含正确格式数据-->Function;必传
>
	// 例子
    const test = (obj) => {
		// 这个地方的obj是组件内部抛出
		//
		// 加密后的移动距离，需要解密（atob先解密，再将4进制转换为10进制，然后加16再开方）
		// obj.x: '';
		//
		// 移动花费的时间
		// obj.time: 1;
		//
    	return new Promise(async (resolve) => {
			// 前端自己处理/请求后端
        	const res = await APIUrl(obj);
			// 接口返回的数据中请包含以下信息
			// 
			// 是否请求成功，200为成功，123为拼接错误，其他为服务器错误
			// res.code: '';
			// 
			// 返回的必要值
			// res.data: {
				//
				// 超越人数百分比，可以使用100 - Math.round((obj.time / 5) * 100)计算，允许为负数，负数代表超时，不建议把超时标准弄得太小
				// percentage: 1;
			//};
			// 
			// 错误提示消息
			// res.msg/message: '';
			// 
    		resolve(res);
    	});
    };
>

* `@change`：验证结果改变时触发返回事件-->第一个参数返回true/false


## 2. 方法
* `initPop`：手动开始触发验证-->建议showBtn为false时使用


## 更多vue3组件
[**自定义右键菜单**](https://github.com/QuietHear/vue-diy-rightmenu-plus '右键新窗口浏览') | [**拖拽卡片布局组件**](https://github.com/QuietHear/vue-drag-component-plus '右键新窗口浏览') | [**可拖拽菜单**](https://github.com/QuietHear/vue-drag-menu-plus '右键新窗口浏览') | [**echarts组件**](https://github.com/QuietHear/vue-echarts-block-plus '右键新窗口浏览') | [**基于el-menu的菜单组件**](https://github.com/QuietHear/vue-ele-nav-plus '右键新窗口浏览') | [**面包屑组件**](https://github.com/QuietHear/vue-permission-breads-plus '右键新窗口浏览') | ***滑动拼图*** | [**工作日历**](https://github.com/QuietHear/vue-shop-calendar-plus '右键新窗口浏览') | [**多页签组件**](https://github.com/QuietHear/vue-tabs-plus '右键新窗口浏览') | [**uEditor**](https://github.com/QuietHear/vue-ueditor-block-plus '右键新窗口浏览') | [**wangEditor**](https://github.com/QuietHear/vue-wangEditor-block-plus '右键新窗口浏览') | [**年密度组件**](https://github.com/QuietHear/vue-year-density-plus '右键新窗口浏览')