import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appNumberOnly]'
})
export class NumberOnlyDirective {

  constructor(
    private el: ElementRef,
    private ngControl: NgControl

  ) { }
  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this.el.nativeElement.value;
    let replaceValue = initalValue.replace(/[^0-9]*/g, '');
    replaceValue = replaceValue.substr(0, 10);
    this.ngControl.control.setValue(replaceValue);
    event.stopPropagation();
  }
}