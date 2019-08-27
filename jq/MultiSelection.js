/*
 * 选项：可以框选的DOM元素，层级z-index值请小于999；
 * 盒子：包含所有选项的DOM元素；
 * 选框：框选过程中，表示框选范围的蓝色框，层级值为1000；
 * 遮罩层：（为了框选过程中，选框变化大小时不产生卡顿）请用户在盒子中添加一个绝对定位、和盒子一样大小的遮罩DIV，层级值小于所有选项，
           在框选过程中，我们会将遮罩DIV的层级值临时改变为大于所有选项，小于选框，框选结束后恢复原值；
 * @param {String} boxId 遮罩层的ID
 * @param {String} itemClassName 选项的CLASS
 * @param {String} selClassName 选项选中后添加的样式CLASS
 * @param {Object,Function} callback 回调函数，包含mousedown执行的mousedownFunc，框选结束后执行的mousedownFunc
 * @param {Number} maxIndex 框选过程中，遮罩层临时提高的层级值，默认为999
 */

var MultiSelection = function (boxId, itemClassName, selClassName, callback, maxIndex) {
  var newObj = {
    box: null,
    boxIndex: 1,
    rects: [],
    selDiv: null,
    selected: [],
    isMouseDown: false,
    selRect: {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0
    },
    init () {
      this.box = document.getElementById(boxId)
      this.createSelDiv()
      this.addListener()
    },
    createSelDiv () {
      this.selDiv = document.createElement('div')
      this.selDiv.style.cssText = 'position:fixed;width:0;height:0;margin:0;padding:0;border:1px solid #66f;background:rgba(97, 160, 241, 0.5);z-index:1000;display:none;'
      document.body.appendChild(this.selDiv)
      this.selDiv.style.left = this.selRect.x1 + 'px'
      this.selDiv.style.top = this.selRect.y1 + 'px'
    },
    addListener () {
      var model = this
      this.box.addEventListener('mousedown', function (e) {
        // 阻止事件冒泡
        clearEventBubble(e)
        // 判断是否为鼠标左键被按下
        if (e.buttons !== 1 || e.which !== 1) return
        if (callback.mousedownFunc) {
          callback.mousedownFunc()
        }
        model.boxIndex = $('#' + boxId).css('z-index')
        model.box.style.zIndex = maxIndex || 999
        model.mousedownFunc(e)
      })

      this.box.addEventListener('mousemove', function (e) {
        if (!model.isMouseDown) return
        clearEventBubble(e)
        model.mousemoveFunc(e)
      })

      document.addEventListener('mouseup', function (e) {
        // console.log('mouseup')
        if (!model.isMouseDown) return
        clearEventBubble(e)

        model.box.style.zIndex = model.boxIndex
        model.mouseupFunc(e)
      })
    },
    mousedownFunc (e) {
      this.isMouseDown = true
      this.selRect.x1 = e.x
      this.selRect.y1 = e.y
    },
    mousemoveFunc (e) {
      // 获取当前坐标
      var _x = e.clientX
      var _y = e.clientY
      // console.log($(document).scrollTop())
      // 根据坐标给选框修改样式
      this.selDiv.style.display = 'block'
      this.selDiv.style.left = Math.min(_x, this.selRect.x1) + 'px'
      this.selDiv.style.top = Math.min(_y, this.selRect.y1) + 'px'
      this.selDiv.style.width = Math.abs(_x - this.selRect.x1) + 'px'
      this.selDiv.style.height = Math.abs(_y - this.selRect.y1) + 'px'
    },
    mouseupFunc (e) {
      // console.log(e)
      this.isMouseDown = false
      this.selRect.x2 = e.x
      this.selRect.y2 = e.y
      this.selDiv.style.display = 'none'
      this.getRects()
      this.getSelected()
    },
    getRects () {
      this.rects = []
      var items = $('.' + itemClassName)
      var scrollTop = $(document).scrollTop()
      var scrollLeft = $(document).scrollLeft()
      for (var i = 0; i < items.size(); i++) {
        var box = items.eq(i)
        var left = box.offset().left - scrollLeft
        var top = box.offset().top - scrollTop
        var obj = {
          id: box[0].id,
          x1: left,
          y1: top,
          x2: left + box[0].offsetWidth,
          y2: top + box[0].offsetHeight
        }
        this.rects.push(obj)
      }
      // console.log(this.rects)
    },
    getSelected () {
      this.selected = []
      this.rects.forEach(e => {
        var dom = $('#' + e.id)
        dom.removeClass(selClassName)
        var flag = this.isCross(e, this.selRect)
        if (flag) {
          this.selected.push(e.id)
          dom.addClass(selClassName)
        }
      })
      if (this.selected.length) {
        callback.overFunc(this.selected)
      }
    },
    isCross (rect1, rect2) {
      if (rect2.x1 > rect2.x2) {
        var x = rect2.x1
        rect2.x1 = rect2.x2
        rect2.x2 = x
      }
      if (rect2.y1 > rect2.y2) {
        var y = rect2.y1
        rect2.y1 = rect2.y2
        rect2.y2 = y
      }
      var xNotCross = true// x方向上不重合
      var yNotCross = true// y方向上不重合
      xNotCross = ((rect1.x1 > rect2.x2) || (rect2.x1 > rect1.x2))
      yNotCross = ((rect1.y1 > rect2.y2) || (rect2.y1 > rect1.y2))
      return !(xNotCross || yNotCross)
    }
  }
  return newObj
}

function clearEventBubble (e) {
  if (e.stopPropagation) e.stopPropagation()
  else e.cancelBubble = true

  if (e.preventDefault) e.preventDefault()
  else e.returnValue = false
}
export default MultiSelection
