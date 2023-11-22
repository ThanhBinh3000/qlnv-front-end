import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ThongTinQuyetDinh } from '../../../../models/DeXuatKeHoachuaChonNhaThau';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { AMOUNT_NO_DECIMAL, AMOUNT_ONE_DECIMAL, AMOUNT_THREE_DECIMAL } from '../../../../Utility/utils';
import { MESSAGE } from '../../../../constants/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-mua-bu',
  templateUrl: './mua-bu.component.html',
  styleUrls: ['./mua-bu.component.scss'],
})
export class MuaBuComponent implements OnInit {

  @Input()
  dsHangHoa = [];
  @Input()
  dataTable = [];
  @Input()
  tabName: String;
  @Input()
  isView: boolean = false;
  @Output()
  dataTableChange = new EventEmitter<any[]>();
  @Input()
  tongGtri: number;
  amount = AMOUNT_THREE_DECIMAL;
  amountSL = AMOUNT_ONE_DECIMAL;
  @Output()
  tongGtriChange = new EventEmitter<number>();

  rowItem: ThongTinQuyetDinh = new ThongTinQuyetDinh();
  dataEdit: { [key: string]: { edit: boolean; data: ThongTinQuyetDinh } } = {};
  dsChungLoaiHangHoa: any[] = [];

  constructor(
    private readonly modal: NzModalService,
    private notification: NzNotificationService,
  ) {
  }

  ngOnInit(): void {
    this.updateEditCache();
    this.emitDataTable();
  }

  initData() {

  }

  onChangeTongGtri() {
    this.tongGtriChange.emit(this.tongGtri);
  }

  emitDataTable() {
    this.dataTableChange.emit(this.dataTable);
  }

  editItem(idx: number): void {
    this.dataEdit[idx].edit = true;
  }

  xoaItem(index: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.dataTable.splice(index, 1);
      },
    });
  }

  themMoiItem() {
    if (!this.dataTable) {
      this.dataTable = [];
    }
    if (!this.rowItem.loaiVthh || !this.rowItem.soLuong) {
      this.notification.error(MESSAGE.ERROR, 'Bạn phải nhập hàng DTQG và số lượng.');
      return;
    }
    // Check hàng hóa đã có trong list chưa
    let indexItem = this.dataTable.findIndex(item => item.loaiVthh == this.rowItem.loaiVthh && item.cloaiVthh == this.rowItem.cloaiVthh);
    if (indexItem != -1) {
      let itemOld = this.dataTable[indexItem];
      itemOld.soLuong = +itemOld.soLuong + +this.rowItem.soLuong;
      this.dataTable[indexItem] = itemOld;
    } else {
      this.dataTable = [...this.dataTable, this.rowItem];
    }
    this.rowItem = new ThongTinQuyetDinh();
    this.updateEditCache();
    this.emitDataTable();
  }

  clearData() {
      this.rowItem = new ThongTinQuyetDinh();
  }

  huyEdit(idx: number): void {
    this.dataEdit[idx] = {
      data: { ...this.dataTable[idx] },
      edit: false,
    };
  }

  luuEdit(idx: number): void {
    Object.assign(this.dataTable[idx], this.dataEdit[idx].data);
    this.dataEdit[idx].edit = false;
  }

  updateEditCache(): void {
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }

  onChangeLoaiVthh(event, typeData?: any) {
    if (typeData) {
      this.dsChungLoaiHangHoa = [];
      typeData.cloaiVthh = null;
      typeData.dviTinh = null;
      const loaiVthh = this.dsHangHoa.find(item => item.ma == event);
      if (loaiVthh) {
        typeData.dviTinh = loaiVthh.maDviTinh;
        typeData.tenVthh = loaiVthh.ten;
        this.dsChungLoaiHangHoa = loaiVthh.child;
      }
    } else {
      this.dsChungLoaiHangHoa = [];
      this.rowItem.cloaiVthh = null;
      this.rowItem.dviTinh = null;
      const loaiVthh = this.dsHangHoa.find(item => item.ma == event);
      if (loaiVthh) {
        this.rowItem.tenVthh = loaiVthh.ten;
        this.rowItem.dviTinh = loaiVthh.loaiHang == 'LT' ? 'Tấn' : loaiVthh.maDviTinh;
        this.dsChungLoaiHangHoa = loaiVthh.child;
      }
    }
  }

  onChangeCloaiVthh(event, typeData?: any) {
    if (typeData) {
      const cloaiVthh = this.dsChungLoaiHangHoa.find(item => item.ma == event);
      if (cloaiVthh) {
        typeData.tenCloaiVthh = cloaiVthh.ten;
        typeData.dviTinh = cloaiVthh.maDviTinh;
      }
    } else {
      const cloaiVthh = this.dsChungLoaiHangHoa.find(item => item.ma == event);
      if (cloaiVthh) {
        this.rowItem.tenCloaiVthh = cloaiVthh.ten;
        this.rowItem.dviTinh = cloaiVthh.loaiHang == 'LT' ? 'Tấn' :  cloaiVthh.maDviTinh;
      }
    }
  }
}
