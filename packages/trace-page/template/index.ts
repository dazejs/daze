
import './less/index.less'
// @ts-ignore
import $ from 'zepto'
// @ts-ignore
import PR from 'code-prettify'

$(function () {
  PR.prettyPrint()
  // @ts-ignore
  $('.frame').on('click', function (e) {
    // @ts-ignore
    var index = $(this).data('index')
    $('.frame.active').removeClass('active')
    // @ts-ignore
    $(this).addClass('active')
    $('.frame-code.active').removeClass('active')
    $('.frame-code' + '-' + index).addClass('active')
  })
  // @ts-ignore
  $('.frame-code').each(function (e) {
    // @ts-ignore
    var ele = $(this)
    var li = ele.find('.prettyprint').find('li')
    var currentLineNumber = ele.data('current')
    var firstLineNumber = li.first().attr('value')
    var activeLineNumber = currentLineNumber - firstLineNumber - 1
    li.eq(activeLineNumber).addClass('active', 'current')
    li.eq(activeLineNumber - 1).addClass('current')
    li.eq(activeLineNumber + 1).addClass('current')
  })
})
