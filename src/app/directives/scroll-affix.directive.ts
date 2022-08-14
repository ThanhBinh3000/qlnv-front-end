import { Directive, ElementRef, HostListener } from '@angular/core';
declare var $;
@Directive({
  selector: '[appScrollAffix]',
})
export class ScrollAffixDirective {
  constructor() { }

  @HostListener('wheel', ['$event'])
  public onScroll(event: WheelEvent) {
    if ($('body').get(0).scrollHeight - $('body').height() <= 55) {
      $('nz-affix > div').addClass('fix');
    } else {
      $('nz-affix > div').removeClass('fix');
    }
    if (
      40 < $('body').get(0).scrollHeight - $('body').height() &&
      $('body').get(0).scrollHeight - $('body').height() < 100
    ) {
      $('body').addClass('affix-fix');
    } else if ($('body').get(0).scrollHeight == $('body').height()) {
      $('nz-affix,nz-affix > div').removeAttr('style').removeClass('ant-affix');
      $('body').removeClass('affix-fix');
      $('nz-affix > div').removeClass('fix');
    }
  }
  @HostListener('window:resize', ['$event'])
  public onResize(event) {
    $('nz-affix,nz-affix > div').removeAttr('style').removeClass('ant-affix');
    $('body').removeClass('affix-fix');
    $('nz-affix > div').removeClass('fix');
  }
}
