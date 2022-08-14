import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dialog-chi-tiet-giao-dich-hang-trong-kho',
  templateUrl: './dialog-chi-tiet-giao-dich-hang-trong-kho.component.html',
  styleUrls: ['./dialog-chi-tiet-giao-dich-hang-trong-kho.component.scss']
})
export class DialogChiTietGiaoDichHangTrongKhoComponent implements OnInit {


  dataEdit: any;
  isView: boolean
  constructor() { }

  ngOnInit(): void {
  }
  onCancel() { }
}
