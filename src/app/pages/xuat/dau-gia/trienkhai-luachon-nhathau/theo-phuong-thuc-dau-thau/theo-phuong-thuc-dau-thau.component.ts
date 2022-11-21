import { Component, Input, OnInit } from '@angular/core';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-theo-phuong-thuc-dau-thau',
  templateUrl: './theo-phuong-thuc-dau-thau.component.html',
  styleUrls: ['./theo-phuong-thuc-dau-thau.component.scss']
})
export class TheoPhuongThucDauThauComponent implements OnInit {
  @Input() typeVthh: string;

  constructor(
    public globals: Globals
  ) { }

  ngOnInit() {

  }
  tabSelected: number;
  selectTab(tab: number) {
    this.tabSelected = tab;
  }

}
