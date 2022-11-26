import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-thongtin-thuchien',
  templateUrl: './thongtin-thuchien.component.html',
})
export class ThongtinThuchienComponent implements OnInit {

  constructor() { }

  create: any = {};
  editDataCache: { [key: string]: { edit: boolean; data: any } } = {};

  isView
  listDonViTinh: any

  ngOnInit(): void {
  }

  cancelEdit() {

  }

  caculatorSoLuong(item: any) {
    if (item) {
      item.thanhTienTn = (item?.soLuongTn ?? 0) * (item?.donGiaTn ?? 0);
      item.tongGtri = (item?.thanhTienTn ?? 0) + (item?.thanhTienQt ?? 0);
    }
  }

  isDisableField() {
    return false;
  }


}
