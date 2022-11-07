import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-phu-luc-4',
  templateUrl: './phu-luc-4.component.html',
  styleUrls: ['./phu-luc-4.component.scss']
})
export class PhuLuc4Component implements OnInit {
  @Input() data;
  constructor() { }

  ngOnInit() {
  }

}
