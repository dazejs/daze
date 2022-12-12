
import './less/index.less';
// eslint-disable-next-line
// @ts-ignore
import $ from 'zepto';
// eslint-disable-next-line
// @ts-ignore
import PR from 'code-prettify';

$(function () {
  PR.prettyPrint();
  // eslint-disable-next-line
  // @ts-ignore
  $('.frame').on('click', function () {
    // eslint-disable-next-line
    // @ts-ignore
    const index = $(this).data('index');
    $('.frame.active').removeClass('active');
    // eslint-disable-next-line
    // @ts-ignore
    $(this).addClass('active');
    $('.frame-code.active').removeClass('active');
    $('.frame-code' + '-' + index).addClass('active');
  });
  // eslint-disable-next-line
  // @ts-ignore
  $('.frame-code').each(function () {
    // eslint-disable-next-line
    // @ts-ignore
    const ele = $(this);
    const li = ele.find('.prettyprint').find('li');
    const currentLineNumber = ele.data('current');
    const firstLineNumber = li.first().attr('value');
    const activeLineNumber = currentLineNumber - firstLineNumber - 1;
    li.eq(activeLineNumber).addClass('active', 'current');
    li.eq(activeLineNumber - 1).addClass('current');
    li.eq(activeLineNumber + 1).addClass('current');
  });
});
