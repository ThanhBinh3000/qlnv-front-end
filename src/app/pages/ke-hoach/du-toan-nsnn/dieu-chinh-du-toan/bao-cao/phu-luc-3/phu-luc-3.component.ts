import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-phu-luc-3',
  templateUrl: './phu-luc-3.component.html',
  styleUrls: ['./phu-luc-3.component.scss']
})
export class PhuLuc3Component implements OnInit {
  @Input() data;
  constructor() { }

  ngOnInit() {
  }

}
