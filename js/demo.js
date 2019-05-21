// select_align
window.selected = []
var overFunc = function (arr) {
  window.selected = arr
  console.log(arr)
}
$('button').eq(0).click(function () {
  multiAlign(window.selected, 'left')
})
$('button').eq(1).click(function () {
  multiAlign(window.selected, 'right')
})
$('button').eq(2).click(function () {
  multiAlign(window.selected, 'top')
})
$('button').eq(3).click(function () {
  multiAlign(window.selected, 'bottom')
})
$('button').eq(4).click(function () {
  multiAlign(window.selected, 'center')
})
$('button').eq(5).click(function () {
  multiAlign(window.selected, 'middle')
})
$('button').eq(6).click(function () {
  multiAlign(window.selected, 'horizontal')
})
$('button').eq(7).click(function () {
  multiAlign(window.selected, 'vertical')
})

// table
