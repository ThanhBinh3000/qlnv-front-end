import { Component, OnInit, Input } from '@angular/core';
import { sortBy } from 'lodash';

@Component({
  selector: 'app-ke-hoach-luong-thuc',
  templateUrl: './ke-hoach-luong-thuc.component.html',
  styleUrls: ['./ke-hoach-luong-thuc.component.scss'],
})
export class KeHoachLuongThucComponent implements OnInit {
  @Input('keHoach') keHoach: any;
  dataTable = [];
  namHienTai: number = 2022;

  constructor() {}

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    const keHoachLuongThuc = this.keHoach.khLuongThuc;
    const dataTemp = [];
    for (const key in keHoachLuongThuc) {
      let order;
      if (key === 'tonDauKy') {
        order = 1;
        dataTemp.push({
          stt: 'I',
          textTitle: 'Lương thực tồn kho đầu kỳ (quy thóc)',
          value: keHoachLuongThuc[key]?.gao + keHoachLuongThuc[key]?.thoc,
          isEditable: false,
          order,
        });
      } else if (key === 'xuatRa') {
        order = 4;
        dataTemp.push({
          stt: 'II',
          textTitle: 'Lương thực xuất ra (quy thóc)',
          value: keHoachLuongThuc[key]?.gao + keHoachLuongThuc[key]?.thoc,
          isEditable: false,
          order,
        });
      } else if (key === 'muaVao') {
        order = 7;
        dataTemp.push({
          stt: 'III',
          textTitle: 'Lương thực mua vào (quy thóc)',
          value: keHoachLuongThuc[key]?.gao + keHoachLuongThuc[key]?.thoc,
          isEditable: false,
          order,
        });
      } else if (key === 'duTruCuoiNam') {
        order = 10;
        dataTemp.push({
          stt: 'IV',
          textTitle: 'Lương thực dự trữ cuối năm (quy thóc)',
          value: keHoachLuongThuc[key]?.gao + keHoachLuongThuc[key]?.thoc,
          isEditable: false,
          order,
        });
      }

      for (const childKey in keHoachLuongThuc[key]) {
        if (childKey === 'thoc') {
          dataTemp.push({
            stt: '-',
            textTitle: 'Thóc',
            value: keHoachLuongThuc[key][childKey],
            isEditable: key === 'xuatRa' || key === 'muaVao',
            order: order + 1,
          });
        } else if (childKey === 'gao') {
          dataTemp.push({
            stt: '-',
            textTitle: 'Gạo',
            value: keHoachLuongThuc[key][childKey],
            isEditable: key === 'xuatRa' || key === 'muaVao',
            order: order + 2,
          });
        }
      }
    }

    this.dataTable = sortBy(dataTemp, ['order']);
  }
}
