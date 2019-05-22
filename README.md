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
* @param {String} boxId 遮罩层的ID
* @param {String} itemClassName 选项的CLASS
* @param {String} selClassName 选项选中后添加的样式CLASS
* @param {Function} overFunc 框选结束后的回调函数
* @param {Number} maxIndex 框选过程中，遮罩层临时提高的层级值，默认为999


## 对齐调用
```JavaScript
multiAlign(idList, direction, overFunc)
```
* @param {Array} idList 目标DOM元素的ID
* @param {String} direction 调整位置的方式，可选值：'top'，'middle'，'bottom'，'left'，'center'，'right'，'horizontal'，'vertical'
* @param {Function} overFunc 调整位置后的回调函数
