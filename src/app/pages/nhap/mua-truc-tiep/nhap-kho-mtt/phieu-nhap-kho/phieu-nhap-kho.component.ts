import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-phieu-nhap-kho',
  templateUrl: './phieu-nhap-kho.component.html',
  styleUrls: ['./phieu-nhap-kho.component.scss']
})
export class PhieuNhapKhoComponent implements OnInit {
  @Input() typeVthh: string;
  constructor() { }

  ngOnInit(): void {
  }

}
