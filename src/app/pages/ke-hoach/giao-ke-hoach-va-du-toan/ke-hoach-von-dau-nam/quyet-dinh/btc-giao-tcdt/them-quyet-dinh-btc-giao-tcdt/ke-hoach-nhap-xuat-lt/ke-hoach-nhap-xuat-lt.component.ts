import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ke-hoach-nhap-xuat-lt',
  templateUrl: './ke-hoach-nhap-xuat-lt.component.html',
  styleUrls: ['./ke-hoach-nhap-xuat-lt.component.scss']
})
export class KeHoachNhapXuatLtComponent implements OnInit {

  isView: boolean = false;
  dataTable: any
  constructor() { }

  ngOnInit(): void {
  }

}
