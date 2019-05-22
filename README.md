# AJ-select_align
基于js，jquey的框选和对齐插件

## 引用
```html
<script type="text/javascript" src="js/jquery.min.js"></script>
<script type="text/javascript" src="js/MultiSelection.js"></script> <!-- 框选 -->
<script type="text/javascript" src="js/multiAlign.js"></script> <!-- 对齐 -->
```


## 框选调用

```JavaScript
var sel = new MultiSelection(boxId, itemClassName, selClassName, overFunc, maxIndex)
```
```JavaScript
sel.init()
```
* boxId {String} 遮罩层的ID
* itemClassName {String} 选项的CLASS
* selClassName {String} 选项选中后添加的样式CLASS
* overFunc {Function} 框选结束后的回调函数
* maxIndex {Number} 框选过程中，遮罩层临时提高的层级值，默认为999


## 对齐调用
```JavaScript
multiAlign(idList, direction, overFunc)
```
* idList {Array} 目标DOM元素的ID
* direction {String} 调整位置的方式，可选值：'top'，'middle'，'bottom'，'left'，'center'，'right'，'horizontal'，'vertical'
* overFunc {Function} 调整位置后的回调函数
