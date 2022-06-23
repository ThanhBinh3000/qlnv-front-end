import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bien-ban-ket-thuc-nhap-kho',
  templateUrl: './bien-ban-ket-thuc-nhap-kho.component.html',
  styleUrls: ['./bien-ban-ket-thuc-nhap-kho.component.scss']
})
export class BienBanKetThucNhapKhoComponent implements OnInit {
  @Input() typeVthh: string;

  constructor() { }

  ngOnInit() {
  }

}
