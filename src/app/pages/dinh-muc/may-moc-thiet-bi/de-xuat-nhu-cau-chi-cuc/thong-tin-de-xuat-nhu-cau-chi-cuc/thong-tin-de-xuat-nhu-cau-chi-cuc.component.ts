import { Component, Input, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {QlDinhMucPhiService} from "../../../../../services/qlnv-kho/QlDinhMucPhi.service";
import {Validators} from "@angular/forms";
import {DinhMucTrangBiMm} from "../../mm-dinh-muc-trang-bi/mm-them-moi-dm-trang-bi/mm-them-moi-dm-trang-bi.component";

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

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    qlDinhMucPhiService: QlDinhMucPhiService
  ) {
    super(httpClient, storageService, notification, spinner, modal, qlDinhMucPhiService)
    super.ngOnInit()
    this.formData = this.fb.group({
      id : [null],
      namKeHoach : [null, Validators.required],
      soQdCtieu : [null, Validators.required],
      soCongVan : [null, Validators.required],
      trichYeu : [null, Validators.required],
      ngayKy : [null, Validators.required],
      trangThai : ['00'],
      tenTrangThai : ['Dự thảo'],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      await Promise.all([
      ]);
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
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
    if (!item.tenTaiSan) {
      msgRequired = "Loại tài sản không được để trống";
    } else if (!item.maTaiSan) {
      msgRequired = "Loại tài sản không được để trống";
    }
    return msgRequired;
  }

  updateEditCache(): void {
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
    this.dataEdit[idx].edit = false;
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
}

export class MmThongTinNcChiCuc {
  id : number;
  tenTaiSan : string;
  maTaiSan : string;
  donViTinh : string;
  slHienCo : number;
  slSeNhap : number;
  tongCong : number;
  slTieuChuan : number;
  chenhLechThieu : number;
  chenhLechThua : number;
  soLuongNc  : number;
  donGiaNc : number;
  thanhTienNc : number;
  ghiChu : number;
}

