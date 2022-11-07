import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-phu-luc-1',
  templateUrl: './phu-luc-1.component.html',
  styleUrls: ['./phu-luc-1.component.scss']
})
export class PhuLuc1Component implements OnInit {
  @Input() data;
  constructor() { }

  ngOnInit() {
  }

}
