import { Directive, ElementRef, HostListener, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appDatepicker]'
})
export class DatepickerDirective {

  constructor(
    private el: ElementRef,
    private ngControl: NgControl

  ) { }
  @HostListener('input', ['$event']) onInputChange(event) {
    let value = this.el.nativeElement.value;
    let newValue = this.formatDate(value);
    this.ngControl.control.setValue(newValue);
    event.stopPropagation();
  }
  @HostListener('ngModelChange', ['$event']) onInputNumberChange(event) {
    let value = this.el.nativeElement.value;
    let newValue = this.formatDate(value);
    this.ngControl.control.setValue(newValue);
    console.log("value: ", value);

    event.stopPropagation();
  }

  formatDate(input) {
    let result;
    if (input.indexOf("/") > -1) {
      result = input.substr(0, 10);
    } else {
      if (input.length >= 8) {
        const day = input.substring(0, 2);
        const month = input.substring(2, 4);
        const year = input.substring(4, 8);
        result = `${day}/${month}/${year}`
      } else {
        result = input
      }
    }
    return result
  }
}
