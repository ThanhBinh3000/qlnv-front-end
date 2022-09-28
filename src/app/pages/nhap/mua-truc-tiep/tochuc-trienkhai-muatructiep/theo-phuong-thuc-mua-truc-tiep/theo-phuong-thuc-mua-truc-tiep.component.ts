import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-theo-phuong-thuc-mua-truc-tiep',
  templateUrl: './theo-phuong-thuc-mua-truc-tiep.component.html',
  styleUrls: ['./theo-phuong-thuc-mua-truc-tiep.component.scss']
})
export class TheoPhuongThucMuaTrucTiepComponent implements OnInit {
  @Input() typeVthh: string;

  constructor() { }

  ngOnInit() {
  }
  tabSelected: number = 0;
  selectTab(tab: number) {
    this.tabSelected = tab;
  }

}