import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-chuc-nang-nhap-kho',
  templateUrl: './chuc-nang-nhap-kho.component.html',
  styleUrls: ['./chuc-nang-nhap-kho.component.scss']
})
export class ChucNangNhapKhoComponent implements OnInit {
  @Input() typeVthh: string;

  constructor() { }

  ngOnInit() {
  }

}
