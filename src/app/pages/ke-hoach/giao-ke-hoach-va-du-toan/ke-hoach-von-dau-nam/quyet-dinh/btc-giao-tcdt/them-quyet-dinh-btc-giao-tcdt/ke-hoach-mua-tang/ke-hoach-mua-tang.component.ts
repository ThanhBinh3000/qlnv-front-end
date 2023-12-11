import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  IterableDiffers,
  DoCheck,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { ThongTinQuyetDinh } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { Globals } from 'src/app/shared/globals';
import { chain } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { STATUS } from 'src/app/constants/status';
import { AMOUNT_NO_DECIMAL, AMOUNT_ONE_DECIMAL } from '../../../../../../../../Utility/utils';
import {
  DialogThemDiaDiemPhanLoComponent,
} from '../../../../../../../../components/dialog/dialog-them-dia-diem-phan-lo/dialog-them-dia-diem-phan-lo.component';
import { ThemSuaMuaTangComponent } from './them-sua-mua-tang/them-sua-mua-tang.component';

@Component({
  selector: 'app-ke-hoach-mua-tang',
  templateUrl: './ke-hoach-mua-tang.component.html',
  styleUrls: ['./ke-hoach-mua-tang.component.scss'],
})
export class KeHoachMuaTangComponent implements OnInit, OnChanges {
  @Input()
  dataTable = [];
  @Input()
  trangThai: any = [];
  STATUS = STATUS;
  @Output()
  dataTableChange = new EventEmitter<any[]>();
  @Input()
  dsHangHoa = [];
  @Input()
  isView: boolean = false;
  @Input()
  dataQdTtcpGiaoBn: number;
  @Input()
  tabName: string;
  rowItem: ThongTinQuyetDinh = new ThongTinQuyetDinh();
  dsChungLoaiHangHoa = [];
  dsChungLoaiHangHoaTable = [];
  amount = AMOUNT_ONE_DECIMAL;
  amount_no_decimal = AMOUNT_NO_DECIMAL;
  dataEdit: { [key: string]: { edit: boolean; data: ThongTinQuyetDinh } } = {};
  expandSet = new Set<number>();
  dataDuToanSumByDataTable: number = 0;

  constructor(
    private modal: NzModalService,
    public globals: Globals,
    private notification: NzNotificationService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.dataTable && this.dataTable.length > 0 && !this.dataTable[0].idVirtual) {
      this.convertListData();
    }
  }

  ngOnInit(): void {

  }

  editItem(index: number): void {
    this.dataEdit[index].edit = true;
    this.onChangeLoaiVthh(this.dataEdit[index].data.loaiVthh, 'edit', index);
  }

  xoaItem(index: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          this.dataTable.splice(index, 1);
          this.updateEditCache();
          this.emitDataTable();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  convertListData() {
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable = chain(this.dataTable).groupBy('tenVthh').map((value, key) => ({
          tenVthh: key,
          dataChild: value,
          idVirtual: uuidv4(),
        }),
      ).value();
    }
    //xử lý lại data thừa
    this.dataTable.forEach(item => {
      if (item && item.dataChild && item.dataChild.length > 0 && !item.dataChild[0].cloaiVthh) {
        item.loaiVthh = item.dataChild[0].loaiVthh;
        item.soLuong = item.dataChild[0].soLuong;
        item.dviTinh = item.dataChild[0].dviTinh;
        item.soLuongDuToan = item.dataChild[0].soLuong;
        item.cloaiVthh = null;
        item.tenCloaiVthh = null;
        item.tongTien = item.dataChild[0].tongTien ? item.dataChild[0].tongTien : null;
        item.donGia = item.dataChild[0].donGia ? item.dataChild[0].donGia : null;
        item.dataChild.shift();
      }
    });
    this.expandAll();
    this.sumAllDataTable();
  }

  sumSoLuong(data: any, row: string, type?: any) {
    let sl = 0;
    if (!type) {
      if (data && data.dataChild && data.dataChild.length > 0) {
        const sum = data.dataChild.reduce((prev, cur) => {
          prev += cur[row];
          return prev;
        }, 0);
        sl = sum;
      }
    } else {
      if (this.dataTable && this.dataTable.length > 0) {
        let sum = 0;
        this.dataTable.forEach(item => {
          sum += this.sumSoLuong(item, row);
        });
        sl = sum;
      }
    }
    return sl;
  }


  sumAllDataTable() {
    let tt = 0;
    this.dataTable.forEach(item => {
      if (item && item.dataChild && item.dataChild.length > 0) {
        item.dataChild.forEach(child => {
          tt += child.tongTien ? child.tongTien : 0;
        });
      } else {
        tt += item.tongTien ? item.tongTien : 0;
      }
    });
    this.dataDuToanSumByDataTable = tt;
  }


  expandAll() {
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach(s => {
        this.expandSet.add(s.idVirtual);
      });
    }
  }

  themMoiItem() {
    if (this.rowItem.loaiVthh && this.rowItem.soLuong && this.rowItem.donGia != null) {
      this.rowItem.tongTien = this.rowItem.soLuong * this.rowItem.donGia;
      this.dataTable = [...this.dataTable, this.rowItem];
      this.rowItem = new ThongTinQuyetDinh();
      this.updateEditCache();
      this.emitDataTable();
    } else {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đầy đủ thông tin');
    }
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  emitDataTable() {
    this.dataTableChange.emit(this.dataTable);
  }

  clearData() {
  }

  huyEdit(id: number): void {
    const index = this.dataTable.findIndex((item) => item.id == id);
    this.dataEdit[id] = {
      data: { ...this.dataTable[index] },
      edit: false,
    };
  }


  calcularTongTien(rowData) {
    rowData.tongTien = rowData.soLuong * rowData.donGia;
  }

  luuEdit(index: number): void {
    let dataSaved = this.dataEdit[index].data;
    Object.assign(this.dataTable[index], dataSaved);
    this.dataEdit[index].edit = false;
    this.emitDataTable();
  }

  updateEditCache(): void {
    if (this.dataTable) {
      let i = 0;
      this.dataTable.forEach((item) => {
        const dataNd = this.dsChungLoaiHangHoaTable.filter(d => d.ma == item.cloaiVthh);
        if (dataNd.length > 0) {
          item.tenCloaiVthh = dataNd[0].tenCloaiVthh;
        }
        this.dataEdit[i] = {
          edit: false,
          data: { ...item },
        };
        i++;
      });
    }
  }

  themMoiMuaTang(data: any, type: string, index: number, list?: any) {
    let sl = data.soLuong;
    if (data && data.dataChild && data.dataChild.length > 0) {
      sl = data.dataChild.reduce((accumulator, object) => {
        return accumulator + object.soLuong;
      }, 0);
    }
    const modalGT = this.modal.create({
      nzTitle: type == 'them' ? 'Thêm chi tiết' : 'Sửa chi tiết ',
      nzContent: ThemSuaMuaTangComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '600px',
      nzFooter: null,
      nzComponentParams: {
        itemInput: data,
        dataTable: list && list.dataChild ? list.dataChild : [],
        dsHangHoa: this.dsHangHoa,
        actionType: type,
        soLuong: sl,
        dsChungLoaiHangHoa: this.dsChungLoaiHangHoa,
      },
    });
    modalGT.afterClose.subscribe((detail) => {
      if (detail) {
        if (!data.dataChild) {
          data.dataChild = [];
        }
        if (!data.idVirtual) {
          data.idVirtual = uuidv4();
        }
        if (type == 'them') {
          if (index && this.dataTable[index] && this.dataTable[index].dataChild) {
            this.dataTable[index].dataChild.push(detail);
          }
        } else {
          if (list) {
            Object.assign(list.dataChild[index], detail);
          } else {
            Object.assign(this.dataTable[index], detail);
          }
        }
        this.emitDataTable();
        this.expandAll();
        this.sumAllDataTable();
      }
    });
  }

  deleteItem(index: any, y: any) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          if (this.dataTable && this.dataTable.length > 0 && this.dataTable[index]) {
            if (this.dataTable[index] && this.dataTable[index].dataChild && this.dataTable[index].dataChild[y]) {
              this.dataTable[index].dataChild.splice(y, 1);
            }
          }
          this.sumAllDataTable();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  // calcTong() {
  //   if (this.dataTable) {
  //     const sum = this.dataTable.reduce((prev, cur) => {
  //       prev += cur.tongTien;
  //       return prev;
  //     }, 0);
  //     return sum;
  //   }
  // }

  onChangeLoaiVthh(event, typeChange, index?) {
    if (typeChange === 'add') {
      this.dsChungLoaiHangHoa = [];
      this.rowItem.dviTinh = null;
      const loaiVthh = this.dsHangHoa.filter(item => item.ma == event);
      if (loaiVthh.length > 0) {
        this.rowItem.dviTinh = loaiVthh[0].maDviTinh;
        this.rowItem.tenVthh = loaiVthh[0].ten;
        this.dsChungLoaiHangHoa = loaiVthh[0].child;
      }
    }
    if (typeChange === 'edit') {
      this.dsChungLoaiHangHoaTable = [];
      this.rowItem.dviTinh = null;
      const loaiVthh = this.dsHangHoa.filter(item => item.ma == event);
      if (loaiVthh.length > 0) {
        this.dataEdit[index].data.dviTinh = loaiVthh[0].maDviTinh;
        this.dataEdit[index].data.tenVthh = loaiVthh[0].ten;
        this.dsChungLoaiHangHoaTable = loaiVthh[0].child;
      }
    }
  }

  onChangeCloaiVthh(event) {
    const cloaiVthh = this.dsChungLoaiHangHoa.filter(item => item.ma == event);
    if (cloaiVthh.length > 0) {
      this.rowItem.tenCloaiVthh = cloaiVthh[0].ten;
    }
  }

}
