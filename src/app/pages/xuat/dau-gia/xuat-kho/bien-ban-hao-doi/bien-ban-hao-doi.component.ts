import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bien-ban-hao-doi',
  templateUrl: './bien-ban-hao-doi.component.html',
  styleUrls: ['./bien-ban-hao-doi.component.scss']
})
export class BienBanHaoDoiComponent implements OnInit {

isView :boolean =false;
isDetail: boolean = false;

dataTable:any=[
  {
id:1 ,
soBienBan: 'a1',
soQuyetDinh: 'a1',
ngayBienBan: 'a1',
tenDiemKho: 'a1',
tenNhaKho: 'a1',
tenNganKho: 'a1',
tenLoKho: 'a1',
tentrangThai: 'a1',
hanhDong: 'a1',
  },
    {
id:2 ,
soBienBan: 'a2',
soQuyetDinh: 'a2',
ngayBienBan: 'a2',
tenDiemKho: 'a2',
tenNhaKho: 'a2',
tenNganKho: 'a2',
tenLoKho: 'a2',
tentrangThai: 'a2',
hanhDong: 'a2',
  },
    {
id:3 ,
soBienBan: 'a3',
soQuyetDinh: 'a3',
ngayBienBan: 'a3',
tenDiemKho: 'a3',
tenNhaKho: 'a3',
tenNganKho: 'a3',
tenLoKho: 'a3',
tentrangThai: 'a3',
hanhDong: 'a3',
  },  {
id:4 ,
soBienBan: 'a4',
soQuyetDinh: 'a4',
ngayBienBan: 'a4',
tenDiemKho: 'a4',
tenNhaKho: 'a4',
tenNganKho: 'a4',
tenLoKho: 'a4',
tentrangThai: 'a4',
hanhDong: 'a4',
  },
]



  constructor() { }

  ngOnInit(): void {
  }


}
