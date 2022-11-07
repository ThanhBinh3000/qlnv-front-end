import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-phu-luc-2',
  templateUrl: './phu-luc-2.component.html',
  styleUrls: ['./phu-luc-2.component.scss']
})
export class PhuLuc2Component implements OnInit {
  @Input() data;
  constructor() { }

  ngOnInit() {
  }

}
