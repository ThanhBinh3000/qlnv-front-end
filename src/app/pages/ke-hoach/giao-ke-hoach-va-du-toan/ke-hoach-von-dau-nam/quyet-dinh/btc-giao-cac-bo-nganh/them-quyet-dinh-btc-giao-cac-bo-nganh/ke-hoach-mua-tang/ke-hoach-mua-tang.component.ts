import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  DoCheck,
  IterableDiffers,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { KeHoachMuaXuat } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { Globals } from './../../../../../../../../shared/globals';
import { STATUS } from 'src/app/constants/status';
import { AMOUNT_ONE_DECIMAL } from '../../../../../../../../Utility/utils';

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
  @Output()
  dataTableChange = new EventEmitter<any[]>();
  @Input('isView') isView: boolean;
  @Input() tongGiaTri: number;
  rowItem: KeHoachMuaXuat = new KeHoachMuaXuat();
  dsNoiDung = [];
  dsNguonVon = [];
  dataEdit: { [key: string]: { edit: boolean; data: KeHoachMuaXuat } } = {};
  @Output()
  hasError = new EventEmitter<boolean>();
  lastIndex = 0;
  STATUS = STATUS;
  amount = AMOUNT_ONE_DECIMAL;

  constructor(
    private modal: NzModalService,
    private danhMucService: DanhMucService,
    private notification: NzNotificationService,
    public globals: Globals,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateEditCache();
    this.emitDataTable();
  }

  async ngOnInit() {
    this.getListDmLoaiChi();
    this.getListNguonVon();
  }

  initData() {

  }

  async getListDmLoaiChi() {
    let res = await this.danhMucService.danhMucChungGetAll('DM_ND_DT');
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsNoiDung = res.data;
    }
  }

  async getListNguonVon() {
    let res = await this.danhMucService.danhMucChungGetAll('NGUON_VON');
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsNguonVon = res.data;
    }
  }

  emitDataTable() {
    this.dataTableChange.emit(this.dataTable);
  }


  editItem(index: number): void {
    this.dataEdit[index].edit = true;
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

  themMoiItem() {
    if (this.rowItem.loaiChi && this.rowItem.sluongDtoan != null) {
      this.rowItem.idDanhMuc = +this.rowItem.idDanhMuc;
      this.dataTable = [...this.dataTable, this.rowItem];

      this.updateEditCache();
      this.emitDataTable();
      // Validate tổng dự toán
      if (this.rowItem.loaiChi == 'DT01' && this.rowItem.sluongDtoan > this.tongGiaTri && this.calcTong()) {
        this.dataTable.splice(this.lastIndex - 1, 1);
        this.notification.error(MESSAGE.ERROR, 'Dự toán chi DTQG không được lớn hơn kế hoạch chỉ tiêu của Thủ tướng chính phủ (' + Intl.NumberFormat('vi-VN').format(this.tongGiaTri) + ') triệu đồng');
        return;
      }
      this.rowItem = new KeHoachMuaXuat();
    } else {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đầy đủ thông tin');
    }

  }

  clearData() {
  }

  huyEdit(id: number): void {
    const index = this.dataTable.findIndex((item) => item.idVirtual == id);
    this.dataEdit[id] = {
      data: { ...this.dataTable[index] },
      edit: false,
    };
  }

  luuEdit(index: number): void {
    this.hasError.emit(false);
    let beforeData = { ...this.dataTable[index] };
    Object.assign(this.dataTable[index], this.dataEdit[index].data);
    this.emitDataTable();
    // Validate tổng dự toán
    if (this.dataTable[index].loaiChi == 'DT01' && this.dataTable[index].sluongDtoan > this.tongGiaTri && this.calcTong()) {
      Object.assign(this.dataTable[index], beforeData);
      // this.dataTable.splice(this.lastIndex - 1, 1);
      this.hasError.emit(true);
      this.notification.warning(MESSAGE.WARNING, 'Tổng Dự toán không được lớn hơn Tổng kế hoạch chi DTQG theo QĐ của TTCP');
    } else {
      this.dataEdit[index].edit = false;
    }
  }

  updateEditCache(): void {
    if (this.dataTable) {
      let i = 0;
      this.dataTable.forEach((item) => {
        const dataNd = this.dsNoiDung.filter(d => d.id == item.idDanhMuc);
        if (dataNd.length > 0) {
          item.noiDung = dataNd[0].noiDung;
        }
        this.dataEdit[i] = {
          edit: false,
          data: { ...item },
        };
        i++;
        // Validate tổng dự toán
        this.lastIndex = i;
      });
    }
  }

  async onChangeNoiDung(loaiChi, typeData?) {
    const dataNd = this.dsNoiDung.find(d => d.ma == loaiChi);
    if (typeData) {
      typeData.tenLoaiChi = dataNd ? dataNd.giaTri : null;
    } else {
      this.rowItem.tenLoaiChi = dataNd ? dataNd.giaTri : null;
    }
    //Lấy nguồn chi
    let maNguonChi = dataNd ? dataNd.ghiChu : null;
    if (maNguonChi) {
      let nguonVon = this.dsNguonVon.find(item => item.ma == maNguonChi);
      if (nguonVon) {
        if (typeData) {
          typeData.nguonChi = maNguonChi;
          typeData.tenNguonChi = nguonVon ? nguonVon.giaTri : null;
        } else {
          this.rowItem.nguonChi = maNguonChi;
          this.rowItem.tenNguonChi = nguonVon ? nguonVon.giaTri : null;
        }
      }
    }
  }

  calcTong() {
    if (this.dataTable) {
      const sum = this.dataTable.reduce((prev, cur) => {
        prev += cur.sluongDtoan;
        return prev;
      }, 0);
      return sum;
    }
  }


}


