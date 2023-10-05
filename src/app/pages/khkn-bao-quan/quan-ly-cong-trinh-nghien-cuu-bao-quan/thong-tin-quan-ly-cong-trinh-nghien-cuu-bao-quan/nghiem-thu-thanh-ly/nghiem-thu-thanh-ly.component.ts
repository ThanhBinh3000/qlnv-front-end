import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-nghiem-thu-thanh-ly',
  templateUrl: './nghiem-thu-thanh-ly.component.html',
  styleUrls: ['./nghiem-thu-thanh-ly.component.scss']
})
export class NghiemThuThanhLyComponent implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() typeVthh: string;
  @Input() idInput: number;
  @Output()
  showListEvent = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }
  selectTab() {

  }
}
