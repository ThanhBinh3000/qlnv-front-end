import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-test-pl1',
  templateUrl: './test-pl1.component.html',
  styleUrls: ['./test-pl1.component.scss']
})
export class TestPl1Component implements OnInit {
  @Input()
  uname: string
  @Output()
  notify:EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }
  passData(){
    this.notify.emit("alo 123456")
  }
}
