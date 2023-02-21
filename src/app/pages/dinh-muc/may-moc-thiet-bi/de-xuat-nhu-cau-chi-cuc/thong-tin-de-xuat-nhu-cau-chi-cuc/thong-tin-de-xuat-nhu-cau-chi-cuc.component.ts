import {Component, Input, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {Validators} from "@angular/forms";
import {DanhMucTaiSanService} from "../../../../../services/danh-muc-tai-san.service";
import dayjs from "dayjs";
import {MmDxChiCucService} from "../../../../../services/mm-dx-chi-cuc.service";
import {STATUS} from "../../../../../constants/status";
import {DialogTuChoiComponent} from "../../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component";

@Component({
  selector: 'app-thong-tin-de-xuat-nhu-cau-chi-cuc',
  templateUrl: './thong-tin-de-xuat-nhu-cau-chi-cuc.component.html',
  styleUrls: ['./thong-tin-de-xuat-nhu-cau-chi-cuc.component.scss']
})
export class ThongTinDeXuatNhuCauChiCucComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  rowItem: MmThongTinNcChiCuc = new MmThongTinNcChiCuc();
  dataEdit: { [key: string]: { edit: boolean; data: MmThongTinNcChiCuc } } = {};
  listDmTaiSan: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private dxChiCucService: MmDxChiCucService
  ) {
    super(httpClient, storageService, notification, spinner, modal, dxChiCucService)
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null],
      capDvi: [null],
      soCv: [null, Validators.required],
      ngayKy: [null, Validators.required],
      namKeHoach: [dayjs().get('year'), Validators.required],
      soQdGiaoCt: [null],
      klLtBaoQuan: [null],
      klLtNhap: [null],
      klLtXuat: [null],
      trichYeu: [null, Validators.required],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      fileDinhKems: [null],
      lyDoTuChoi: [null],
      listQlDinhMucDxTbmmTbcdDtl: [null],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      await Promise.all([
        this.getAllDmTaiSan(),
      ]);
      if (this.id) {
        this.detail(this.id)
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async getAllDmTaiSan() {
    let body = {
      loai: '02',
      trangThai: STATUS.BAN_HANH
    };
    let res = await this.dxChiCucService.searchDsChuaSuDung(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.length > 0) {
        this.listDmTaiSan = res.data
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  changeDm(event, type?: any) {
    let result = this.listDmTaiSan.filter(item => item.maTaiSan == event)
    if (result && result.length > 0) {
      if (!type) {
        this.rowItem.tenTaiSan = result[0].tenTaiSan
        this.rowItem.donViTinh = result[0].dviTinh;
        this.rowItem.donGiaTd = result[0].donGiaTd
      } else {
        type.tenTaiSan = result[0].tenTaiSan
        type.donViTinh = result[0].dviTinh;
        type.donGiaTd = result[0].donGiaTd;
      }
    }
  }

  async pheDuyet() {
    let trangThai;
    switch (this.formData.value.trangThai) {
      case STATUS.DU_THAO :
      case STATUS.TUCHOI_CB_CUC : {
        trangThai = STATUS.DA_KY;
        break;
      }
      case STATUS.DA_KY : {
        trangThai = STATUS.DADUYET_CB_CUC
      }
    }
    await this.approve(this.id, trangThai, 'Bạn có chắc chắn muốn duyệt?')
  }

  async themMoiCtiet() {
    let msgRequired = this.required(this.rowItem);
    if (msgRequired) {
      this.notification.error(MESSAGE.ERROR, msgRequired);
      this.spinner.hide();
      return;
    }
    if (this.checkExitsData(this.rowItem, this.dataTable)) {
      this.notification.error(MESSAGE.ERROR, "Dữ liệu trùng lặp, đề nghị nhập lại.");
      this.spinner.hide();
      return;
    }
    this.rowItem.maDvi = this.userInfo.MA_DVI;
    this.rowItem.thanhTienNc = this.rowItem.soLuong * this.rowItem.donGiaTd
    this.dataTable = [...this.dataTable, this.rowItem];
    this.rowItem = new MmThongTinNcChiCuc();
    this.updateEditCache();
  }

  checkExitsData(item, dataItem): boolean {
    let rs = false;
    if (dataItem && dataItem.length > 0) {
      dataItem.forEach(it => {
        if (it.maTaiSan == item.maTaiSan) {
          rs = true;
          return;
        }
      })
    }
    return rs;
  }

  required(item: MmThongTinNcChiCuc) {
    let msgRequired = '';
    //validator
    if (!item.maTaiSan) {
      msgRequired = "Loại tài sản không được để trống";
    } else if (!item.soLuong) {
      msgRequired = "Số lượng không được để trống";
    }
    return msgRequired;
  }

  updateEditCache() {
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: {...item},
        };
      });
    }
  }

  refresh() {
    this.rowItem = new MmThongTinNcChiCuc();
  }

  editRow(stt: number) {
    this.dataEdit[stt].edit = true;
  }

  cancelEdit(stt: number): void {
    this.dataEdit[stt] = {
      data: {...this.dataTable[stt]},
      edit: false
    };
  }

  async saveDinhMuc(idx: number) {
    let msgRequired = this.required(this.dataEdit[idx].data)
    if (msgRequired) {
      this.notification.error(MESSAGE.ERROR, msgRequired);
      this.spinner.hide();
      return;
    }
    this.dataEdit[idx].data.thanhTienNc = this.dataEdit[idx].data.donGiaTd * this.dataEdit[idx].data.soLuong
    this.dataEdit[idx].edit = false;
    Object.assign(this.dataTable[idx], this.dataEdit[idx].data);
    this.updateEditCache();
  }

  deleteItem(index: any) {
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
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  async save() {
    if (this.dataTable.length <= 0) {
      this.notification.error(MESSAGE.ERROR, "Bạn chưa nhập chi tiết đề xuất");
      return;
    }
    this.helperService.markFormGroupTouched(this.formData)
    if (this.formData.invalid) {
      return;
    }
    if (this.fileDinhKem && this.fileDinhKem.length > 0) {
      this.formData.value.fileDinhKems = this.fileDinhKem;
    }
    this.formData.value.listQlDinhMucDxTbmmTbcdDtl = this.dataTable;
    this.formData.value.maDvi = this.userInfo.MA_DVI;
    this.formData.value.capDvi = this.userInfo.CAP_DVI;
    let res = await this.createUpdate(this.formData.value)
    if (res) {
      this.goBack();
    }
  }

  async detail(id) {
    this.spinner.show();
    try {
      let res = await this.dxChiCucService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.fileDinhKem = data.listFileDinhKems;
          this.dataTable = data.listQlDinhMucDxTbmmTbcdDtl;
          if (this.dataTable && this.dataTable.length > 0) {
            this.dataTable.forEach(item => {
              let result = this.listDmTaiSan.filter(p => p.maTaiSan == item.maTaiSan)
              if (result && result.length > 0) {
                item.tenTaiSan = result[0].tenTaiSan
              }
            })
          }
          this.updateEditCache();
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        this.spinner.hide();
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e);
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }
}

export class MmThongTinNcChiCuc {
  id: number;
  maDvi : string;
  tenTaiSan: string;
  maTaiSan: string;
  donViTinh: string;
  slHienCo: number;
  slNhapThem: number;
  tongCong: number;
  slTieuChuan: number;
  chenhLechThieu: number;
  chenhLechThua: number;
  soLuong: number = 0;
  soLuongTc: number = 0;
  donGiaTd: number = 0;
  thanhTienNc: number = 0;
  ghiChu: number;
}

