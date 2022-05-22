import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-phu-luc1',
  templateUrl: './phu-luc1.component.html',
  styleUrls: ['./phu-luc1.component.scss']
})
export class PhuLuc1Component implements OnInit {
  @Input() data;
  constructor() { }

  ngOnInit() {
  }

}
