import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-thoc-gao-muoi',
  templateUrl: './thoc-gao-muoi.component.html',
  styleUrls: ['./thoc-gao-muoi.component.scss']
})
export class ThocGaoMuoiComponent implements OnInit {
  @Input() loaiVthh: string;
  constructor() { }
  tabSelected: number = 0;
  ngOnInit(): void {
  }
  selectTab(tab: number) {
    this.tabSelected = tab;
  }
}
