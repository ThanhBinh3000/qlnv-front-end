import { Component, Input, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { Base2Component } from '../../../../../components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../../../../services/storage.service';
import { Validators } from '@angular/forms';
import dayjs from 'dayjs';
import { STATUS } from '../../../../../constants/status';
import { DanhMucCongCuDungCuService } from '../../../../../services/danh-muc-cong-cu-dung-cu.service';
import { DxChiCucPvcService } from '../../../../../services/dinh-muc-nhap-xuat-bao-quan/pvc/dx-chi-cuc-pvc.service';
import { AMOUNT, AMOUNT_ONE_DECIMAL, AMOUNT_TWO_DECIMAL } from '../../../../../Utility/utils';

@Component({
  selector: 'app-them-moi-dx-chi-cuc-pvc',
  templateUrl: './them-moi-dx-chi-cuc-pvc.component.html',
  styleUrls: ['./them-moi-dx-chi-cuc-pvc.component.scss'],
})
export class ThemMoiDxChiCucPvcComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  rowItem: PvcDxChiCucCtiet = new PvcDxChiCucCtiet();
  dataEdit: { [key: string]: { edit: boolean; data: PvcDxChiCucCtiet } } = {};
  listCcdc: any[] = [];
  listCtieuKh: any[] = [];
  maQd: string;
  amount = AMOUNT_ONE_DECIMAL;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private dxChiCucService: DxChiCucPvcService,
    private danhMucCongCuDungCuService: DanhMucCongCuDungCuService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, dxChiCucService);
    super.ngOnInit();
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null],
      capDvi: [null],
      soCv: [null, Validators.required],
      ngayKy: [null, Validators.required],
      namKeHoach: [dayjs().get('year'), Validators.required],
      soQdGiaoCt: [null],
      trichYeu: [null],
      ghiChu: [null],
      trangThai: ['00'],
      trangThaiTh: [],
      tenTrangThai: ['Dự thảo'],
      fileDinhKems: [null],
      lyDoTuChoi: [null],
      listQlDinhMucPvcDxCcdcDtl: [null],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.maQd = '/' + this.userInfo.DON_VI.tenVietTat + '-TCKT';
      await Promise.all([
        this.getAllDmCcdc(),
        this.changeNamKh(this.formData.value.namKeHoach),
      ]);
      if (this.id) {
        this.detail(this.id);
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async getAllDmCcdc() {
    this.spinner.show();
    try {
      let body = {
        'trangThai': '01',
        'paggingReq': {
          limit: 999999999,
          page: 0,
        },
      };
      let res = await this.danhMucCongCuDungCuService.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        if (data && data.content) {
          this.listCcdc = data.content;
          console.log(this.listCcdc, ' this.listCcdc this.listCcdc this.listCcdc');
        }
      }
      this.spinner.hide();
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }


  async changeDm(event, type?: any) {
    let result = this.listCcdc.filter(item => item.maCcdc == event);
    if (result && result.length > 0) {
      if (!type) {
        this.rowItem.tenCcdc = result[0].tenCcdc;
        this.rowItem.donViTinh = result[0].donViTinh;
        this.rowItem.moTaCcdc = result[0].moTa;
      } else {
        type.tenCcdc = result[0].tenCcdc;
        type.donViTinh = result[0].donViTinh;
        type.moTaCcdc = result[0].moTa;
      }
    }
  }

  async getDinhMuc(maHH) {

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
        trangThai = STATUS.DADUYET_CB_CUC;
      }
    }
    await this.approve(this.id, trangThai, 'Bạn có chắc chắn muốn duyệt?');
  }

  async themMoiCtiet() {
    let msgRequired = this.required(this.rowItem);
    if (msgRequired) {
      this.notification.error(MESSAGE.ERROR, msgRequired);
      this.spinner.hide();
      return;
    }
    if (this.checkExitsData(this.rowItem, this.dataTable)) {
      this.notification.error(MESSAGE.ERROR, 'Dữ liệu trùng lặp, đề nghị nhập lại.');
      this.spinner.hide();
      return;
    }
    this.rowItem.maDvi = this.userInfo.MA_DVI;
    this.dataTable = [...this.dataTable, this.rowItem];
    this.rowItem = new PvcDxChiCucCtiet();
    this.updateEditCache();
  }

  checkExitsData(item, dataItem): boolean {
    let rs = false;
    if (dataItem && dataItem.length > 0) {
      dataItem.forEach(it => {
        if (it.maCcdc == item.maCcdc) {
          rs = true;
          return;
        }
      });
    }
    return rs;
  }

  required(item: PvcDxChiCucCtiet) {
    let msgRequired = '';
    //validator
    if (!item.maCcdc) {
      msgRequired = 'Loại Ccdc không được để trống';
    } else if (!item.nhuCauTb || !item.slTieuChuan) {
      msgRequired = 'Số lượng không được để trống';
    }
    return msgRequired;
  }

  updateEditCache() {
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }

  refresh() {
    this.rowItem = new PvcDxChiCucCtiet();
  }

  editRow(stt: number) {
    this.dataEdit[stt].edit = true;
  }

  cancelEdit(stt: number): void {
    this.dataEdit[stt] = {
      data: { ...this.dataTable[stt] },
      edit: false,
    };
  }

  async saveDinhMuc(idx: number) {
    let msgRequired = this.required(this.dataEdit[idx].data);
    if (msgRequired) {
      this.notification.error(MESSAGE.ERROR, msgRequired);
      this.spinner.hide();
      return;
    }
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
      this.notification.error(MESSAGE.ERROR, 'Bạn chưa nhập chi tiết đề xuất');
      return;
    }
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      return;
    }
    if (this.fileDinhKem && this.fileDinhKem.length > 0) {
      this.formData.value.fileDinhKems = this.fileDinhKem;
    }
    this.formData.value.listQlDinhMucPvcDxCcdcDtl = this.dataTable;
    this.formData.value.maDvi = this.userInfo.MA_DVI;
    this.formData.value.capDvi = this.userInfo.CAP_DVI;
    this.formData.value.soCv = this.formData.value.soCv + this.maQd;
    let res = await this.createUpdate(this.formData.value);
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
          this.formData.patchValue({
            soCv: this.formData.value.soCv ? this.formData.value.soCv.split('/')[0] : null,
          });
          this.fileDinhKem = data.listFileDinhKems;
          this.dataTable = data.listQlDinhMucPvcDxCcdcDtl;
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

  async changeNamKh(event) {
    if (this.userService.isChiCuc()) {
      let res = await this.dxChiCucService.getCtieuKhoach(event);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.listCtieuKh = [];
          this.listCtieuKh.push(res.data);
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        return;
      }
    }
  }

  changeSoQdGiaoCt(event) {

  }

  protected readonly AMOUNT = AMOUNT;

  changeSlTieuChuan(event: number) {
    if (event) {
      this.rowItem.nhuCauTb = event - (this.rowItem.slHienCo + this.rowItem.slNhapThem);
    }
  }
}

export class PvcDxChiCucCtiet {
  id: number;
  donGia: number = 0;
  soLuong: number = 0;
  soLuongTc: number = 0;
  slTieuChuanTc: number = 0;
  maDvi: string;
  tenDvi: string;
  tenCcdc: string;
  maCcdc: string;
  moTaCcdc: string;
  donViTinh: string;
  slHienCo: number = 0;
  slNhapThem: number = 0;
  slTieuChuan: number = 0;
  nhuCauTb: number = 0;
  ghiChu: number;
}
