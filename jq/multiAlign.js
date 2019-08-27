/*
 * 参数配置
 * @param {Array} idList 目标DOM元素的ID
 * @param {String} direction 调整位置的方式，可选值：'top'，'middle'，'bottom'，'left'，'center'，'right'，'horizontal'，'vertical'
 * @param {Function} overFunc 调整位置后的回调函数
 */

var multiAlign = function (idList, direction, overFunc) {
  if (idList.length < 2) {
    return
  }
  if (idList.length === 2 && ['horizontal', 'vertical'].includes(direction)) {
    return
  }
  var rects = calculateInfo()
  var standard = getStandard()
  var spacing = calculateSpacing()
  if (['horizontal', 'vertical'].includes(direction)) {
    adjustSpacing()
  } else {
    doAlign()
  }
  if (overFunc) {
    overFunc(getPosition())
  }

  // 获取所有对象的位置信息，回调中返回
  function getPosition () {
    var items = []
    idList.forEach(e => {
      var dom = document.getElementById(e)
      var obj = {
        id: e,
        top: dom.offsetTop,
        left: dom.offsetLeft
      }
      items.push(obj)
    })
    return items
  }
  // 调整间距
  function adjustSpacing () {
    var top = rects[0].top
    var left = rects[0].left
    rects.forEach((e, i) => {
      if (i === 0) {
        return false
      }
      switch (direction) {
      case 'vertical':
        top += rects[(i - 1)].height + spacing
        e.dom.style.top = top + 'px'
        break
      case 'horizontal':
        left += rects[(i - 1)].width + spacing
        e.dom.style.left = left + 'px'
        break
      }
    })
  }
  // 计算等间距分散的间距值
  function calculateSpacing () {
    var sum = {
      horizontal: getStandard('right') - getStandard('left'),
      vertical: getStandard('bottom') - getStandard('top'),
      width: 0,
      height: 0
    }
    rects.forEach(e => {
      sum.width += e.width
      sum.height += e.height
    })
    var gap = {
      horizontal: (sum.horizontal - sum.width) / (rects.length - 1),
      vertical: (sum.vertical - sum.height) / (rects.length - 1)
    }
    return gap[direction]
  }
  // 对齐
  function doAlign () {
    rects.forEach(e => {
      switch (direction) {
      case 'top':
        e.dom.style.top = standard + 'px'
        break
      case 'left':
        e.dom.style.left = standard + 'px'
        break
      case 'bottom':
        e.dom.style.top = standard - e.height + 'px'
        break
      case 'right':
        e.dom.style.left = standard - e.width + 'px'
        break
      case 'center':
        e.dom.style.left = e.left + standard - e.center + 'px'
        break
      case 'middle':
        e.dom.style.top = e.top + standard - e.middle + 'px'
        break
      }
    })
  }
  // 获取对齐的标准值
  function getStandard (str) {
    var target = rects[0]
    var type = str || direction
    if (type === 'left' || type === 'top') {
      rects.forEach(e => {
        if (e[type] < target[type]) {
          target = e
        }
      })
    } else if (type === 'right' || type === 'bottom') {
      rects.forEach(e => {
        if (e[type] > target[type]) {
          target = e
        }
      })
    }
    return target[type]
  }
  // 计算所有对象的信息
  function calculateInfo () {
    var items = []
    idList.forEach(e => {
      var dom = document.getElementById(e)
      var obj = {
        id: e,
        dom: dom,
        width: dom.offsetWidth,
        height: dom.offsetHeight,
        top: dom.offsetTop,
        bottom: dom.offsetTop + dom.offsetHeight,
        left: dom.offsetLeft,
        right: dom.offsetLeft + dom.offsetWidth,
        center: dom.offsetLeft + 0.5 * dom.offsetWidth,
        middle: dom.offsetTop + 0.5 * dom.offsetHeight
      }
      items.push(obj)
    })
    return items
  }
}
export default multiAlign
