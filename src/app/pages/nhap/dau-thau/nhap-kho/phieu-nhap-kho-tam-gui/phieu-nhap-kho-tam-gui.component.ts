import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-phieu-nhap-kho-tam-gui',
  templateUrl: './phieu-nhap-kho-tam-gui.component.html',
  styleUrls: ['./phieu-nhap-kho-tam-gui.component.scss']
})
export class PhieuNhapKhoTamGuiComponent implements OnInit {
  @Input() typeVthh: string;

  constructor() { }

  ngOnInit() {
  }

}
