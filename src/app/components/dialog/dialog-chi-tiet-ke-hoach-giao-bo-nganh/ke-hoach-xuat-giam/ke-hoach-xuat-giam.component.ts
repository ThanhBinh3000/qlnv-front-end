import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ThongTinQuyetDinh } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { Globals } from './../../../../shared/globals';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { PAGE_SIZE_DEFAULT } from '../../../../constants/config';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { AMOUNT, AMOUNT_ONE_DECIMAL, AMOUNT_TWO_DECIMAL } from '../../../../Utility/utils';
import { chain } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import {
  ThemSuaMuaTangComponent,
} from '../../../../pages/ke-hoach/giao-ke-hoach-va-du-toan/ke-hoach-von-dau-nam/quyet-dinh/btc-giao-tcdt/them-quyet-dinh-btc-giao-tcdt/ke-hoach-mua-tang/them-sua-mua-tang/them-sua-mua-tang.component';
import { DialogSuaXuatGiamComponent } from '../../dialog-sua-xuat-giam/dialog-sua-xuat-giam.component';

@Component({
  selector: 'app-ke-hoach-xuat-giam',
  templateUrl: './ke-hoach-xuat-giam.component.html',
  styleUrls: ['./ke-hoach-xuat-giam.component.scss'],
})
export class KeHoachXuatGiamComponent implements OnInit, OnChanges {
  @Input() maBoNganh: string;

  @Input() tab: string;
  @Input() tabRadio: string;
  @Input()
  dsHangHoa = [];
  @Input()
  dataTable = [];
  dataTableView = [];
  @Input()
  dataToanBn = [];
  @Input()
  tabName: String;
  @Input() namHienTai: number;
  @Output()
  dataTableChange = new EventEmitter<any[]>();
  @Input()
  tongGtri: number;
  @Output()
  tongGtriChange = new EventEmitter<number>();
  @Input()
  ghiChu: number;
  @Output()
  ghiChuChange = new EventEmitter<number>();
  @Input()
  isView: boolean = false;
  expandSet = new Set<number>();
  tongSoVT: number = 0;
  tongSoLT: number = 0;
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  rowItem: ThongTinQuyetDinh = new ThongTinQuyetDinh();
  dataEdit: { [key: string]: { edit: boolean; data: ThongTinQuyetDinh } } = {};
  dsChungLoaiHangHoa = [];
  listTongGiaTriBnKhac: { [key: string]: { tongSo: any } } = {};
  amount = AMOUNT_TWO_DECIMAL;

  constructor(
    private modal: NzModalService,
    public globals: Globals,
    private notification: NzNotificationService,
  ) {
  }

  ngOnInit(): void {
    this.convertListData();
    // this.updateEditCache()
    // this.emitDataTable();
    for (let item of this.dataToanBn) {
      if (item.maBn == '01' && !item.isSum && item.tenBn.indexOf('Lương thực') != -1) {
        this.tongSoLT = item.tongSo;
      }
      if (item.maBn == '01' && !item.isSum && item.tenBn.indexOf('Vật tư') != -1) {
        this.tongSoVT = item.tongSo;
      }
      if (!item.isSum) {
        this.listTongGiaTriBnKhac[item.maBn] = { tongSo: item.tongSo };
      }
    }
  }

  initData() {
  }

  onChangeTongGtri() {
    this.tongGtriChange.emit(this.tongGtri);
  }

  emitDataTable() {
    this.dataTableChange.emit(this.dataTable);
  }

  editItem(index: number): void {
    this.dataEdit[index].edit = true;
  }

  convertListData() {
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTableView = chain(this.dataTable).groupBy('tenVthh').map((value, key) => ({
          tenVthh: key,
          isLeaf: (!value || (value.length == 1 && !value[0].cloaiVthh)) ? true : false,
          dataChild: value,
          idVirtual: uuidv4(),
        }),
      ).value();
    } else {
      this.dataTableView = [];
    }
    this.expandAll();
  }

  expandAll() {
    if (this.dataTableView && this.dataTableView.length > 0) {
      this.dataTableView.forEach(s => {
        this.expandSet.add(s.idVirtual);
      });
    }
  }

  xoaItem(item: any, isParent?) {
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
          if (isParent) {
            this.dataTable = this.dataTable.filter(it => (it.tenVthh != item.tenVthh));
          } else {
            let indexRm = this.dataTable.findIndex(it => (it.loaiVthh == item.loaiVthh && it.cloaiVthh == item.cloaiVthh));
            if (indexRm >= 0 && this.dataTable.length == 1) {
              this.dataTable = [];
            }
            if (indexRm >= 0 && this.dataTable.length > 1) {
              this.dataTable.splice(indexRm, 1);
            }
          }
          this.convertListData();
          this.emitDataTable();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  themMoiItem() {
    if (this.rowItem.loaiVthh && this.rowItem.soLuong != null) {
      if (!this.dataTable) {
        this.dataTable = [];
      }
      if ((this.rowItem.loaiVthh && !this.rowItem.cloaiVthh && this.dataTable.filter(item => item.loaiVthh == this.rowItem.loaiVthh).length > 0) || (this.rowItem.loaiVthh && this.rowItem.cloaiVthh && this.dataTable.filter(item => item.loaiVthh == this.rowItem.loaiVthh && item.cloaiVthh == this.rowItem.cloaiVthh).length > 0)) {
        this.notification.warning(MESSAGE.WARNING, 'Hàng hóa đã được thêm, vui lòng chọn loại hàng hóa khác.');
        return;
      }
      this.dataTable = [...this.dataTable, this.rowItem];
      this.rowItem = new ThongTinQuyetDinh();
      this.convertListData();
      this.emitDataTable();
    } else {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đầy đủ thông tin');
    }
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

  luuEdit(index: number): void {
    Object.assign(this.dataTable[index], this.dataEdit[index].data);
    this.dataEdit[index].edit = false;
    this.emitDataTable();
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  async changePageIndex(event) {
    try {
      this.page = event;
      // await this.search();
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async changePageSize(event) {
    try {
      this.pageSize = event;
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
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
        this.rowItem.dviTinh = loaiVthh.maDviTinh;
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
        this.rowItem.dviTinh = cloaiVthh.maDviTinh;
      }
    }
  }

  suaIem(data: any, isParent?) {
    this.onChangeLoaiVthh(data.loaiVthh);
    let idx = -1;
    if (isParent) {
      idx = this.dataTable.findIndex(item => (item.loaiVthh == data.loaiVthh));
    } else {
      idx = this.dataTable.findIndex(item => (item.loaiVthh == data.loaiVthh && item.cloaiVthh == data.cloaiVthh));
    }
    if (idx >= 0) {
      const modalGT = this.modal.create({
        nzTitle: 'Sửa chi tiết ',
        nzContent: DialogSuaXuatGiamComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '600px',
        nzFooter: null,
        nzComponentParams: {
          itemInput: data,
          dsHangHoa: this.dsHangHoa,
          dsChungLoaiHangHoa: this.dsChungLoaiHangHoa,
        },
      });
      modalGT.afterClose.subscribe((detail) => {
        if (detail) {
          if ((detail.loaiVthh && !detail.cloaiVthh && this.dataTable.filter(item => item.loaiVthh == detail.loaiVthh).length > 0 && detail.loaiVthh != data.loaiVthh) || (detail.loaiVthh && detail.cloaiVthh && this.dataTable.filter(item => item.loaiVthh == detail.loaiVthh && item.cloaiVthh == detail.cloaiVthh).length > 0 && (detail.loaiVthh != data.loaiVthh || detail.cloaiVthh != data.cloaiVthh))) {
            this.notification.warning(MESSAGE.WARNING, 'Hàng hóa đã được thêm, vui lòng chọn loại hàng hóa khác.');
            return;
          }
          Object.assign(this.dataTable[idx], detail);
          this.convertListData();
          this.emitDataTable();
          this.expandAll();
          this.dsChungLoaiHangHoa = [];
        }
      });
    } else {
      this.notification.warning(MESSAGE.WARNING, 'Không tìm thấy bản ghi.');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.maBoNganh) {
      this.rowItem = new ThongTinQuyetDinh();
    }
  }

  onChangeGhiChu() {
    this.ghiChuChange.emit(this.ghiChu);
  }
}

