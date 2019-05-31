/*
 * 选项：可以框选的DOM元素，层级z-index值请小于999；
 * 盒子：包含所有选项的DOM元素；
 * 选框：框选过程中，表示框选范围的蓝色框，层级值为1000；
 * 遮罩层：（为了框选过程中，选框变化大小时不产生卡顿）请用户在盒子中添加一个绝对定位、和盒子一样大小的遮罩DIV，层级值小于所有选项，
           在框选过程中，我们会将遮罩DIV的层级值临时改变为大于所有选项，小于选框，框选结束后恢复原值；
 * @param {String} boxId 遮罩层的ID
 * @param {String} itemClassName 选项的CLASS
 * @param {String} selClassName 选项选中后添加的样式CLASS
 * @param {Function} overFunc 框选结束后的回调函数
 * @param {Number} maxIndex 框选过程中，遮罩层临时提高的层级值，默认为999
 */
let AjDivSelector = function (boxId, itemClassName, selClassName, overFunc, maxIndex) {
  let newObj = {
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
      this.box.addEventListener('mousedown', e => {
        // 阻止事件冒泡
        clearEventBubble(e)
        // 判断是否为鼠标左键被按下
        if (e.buttons !== 1 || e.which !== 1) return
        this.boxIndex = getComputedStyle(this.box, null).getPropertyValue('z-index')
        this.box.style.zIndex = maxIndex || 999
        this.mousedownFunc(e)
      })

      this.box.addEventListener('mousemove', e => {
        if (!this.isMouseDown) return
        clearEventBubble(e)
        this.mousemoveFunc(e)
      })

      document.addEventListener('mouseup', e => {
        // console.log('mouseup')
        if (!this.isMouseDown) return
        clearEventBubble(e)

        this.box.style.zIndex = this.boxIndex
        this.mouseupFunc(e)
      })
    },
    mousedownFunc (e) {
      this.isMouseDown = true
      this.selRect.x1 = e.x
      this.selRect.y1 = e.y
    },
    mousemoveFunc (e) {
      // 获取当前坐标
      let _x = e.clientX
      let _y = e.clientY
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
      let items = document.querySelectorAll('.' + itemClassName)
      let scrollTop = document.documentElement.scrollTop
      let scrollLeft = document.documentElement.scrollLeft
      items.forEach(box => {
        var target = {
          left: box.offsetLeft,
          top: box.offsetTop
        }
        this.getDocumentPosition(target, box)
        let obj = {
          id: box.id,
          x1: target.left - scrollLeft,
          y1: target.top - scrollTop,
          x2: target.left - scrollLeft + box.offsetWidth,
          y2: target.top - scrollTop + box.offsetHeight
        }
        this.rects.push(obj)
      })
      // console.log(this.rects)
    },
    getSelected () {
      this.selected = []
      this.rects.forEach(e => {
        let dom = document.querySelector('#' + e.id)
        dom.classList.remove(selClassName)
        let flag = this.isCross(e, this.selRect)
        if (flag) {
          this.selected.push(e.id)
          dom.classList.add(selClassName)
        }
      })
      if (this.selected.length) {
        overFunc(this.selected)
      }
    },
    isCross (rect1, rect2) {
      if (rect2.x1 > rect2.x2) {
        let x = rect2.x1
        rect2.x1 = rect2.x2
        rect2.x2 = x
      }
      if (rect2.y1 > rect2.y2) {
        let y = rect2.y1
        rect2.y1 = rect2.y2
        rect2.y2 = y
      }
      let xNotCross = true// x方向上不重合
      let yNotCross = true// y方向上不重合
      xNotCross = ((rect1.x1 > rect2.x2) || (rect2.x1 > rect1.x2))
      yNotCross = ((rect1.y1 > rect2.y2) || (rect2.y1 > rect1.y2))
      return !(xNotCross || yNotCross)
    },
    getDocumentPosition (target, box) {
      if (box !== document.body) {
        let parent = box.offsetParent
        target.left += parent.offsetLeft
        target.top += parent.offsetTop
        this.getDocumentPosition(target, parent)
      }
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
