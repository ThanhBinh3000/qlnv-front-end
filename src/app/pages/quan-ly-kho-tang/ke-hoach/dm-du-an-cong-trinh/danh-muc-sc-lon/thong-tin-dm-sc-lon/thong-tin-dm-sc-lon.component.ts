import {Component, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {MESSAGE} from "../../../../../../constants/message";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {DonviService} from "../../../../../../services/donvi.service";
import {Validators} from "@angular/forms";
import {
  DanhMucSuaChuaService
} from "../../../../../../services/qlnv-kho/quy-hoach-ke-hoach/danh-muc-kho/danh-muc-sua-chua.service";
import dayjs from "dayjs";

@Component({
  selector: 'app-thong-tin-dm-sc-lon',
  templateUrl: './thong-tin-dm-sc-lon.component.html',
  styleUrls: ['./thong-tin-dm-sc-lon.component.scss']
})
export class ThongTinDmScLonComponent extends Base2Component implements OnInit {
  isViewDetail: boolean;
  dataDetail: any
  dsKho: any[] = [];
  listTrangThai: any[] = [
    {ma: this.STATUS.CHUA_THUC_HIEN, giaTri: 'Chưa thực hiện'},
    {ma: this.STATUS.DANG_THUC_HIEN, giaTri: 'Đang thực hiện'},
    {ma: this.STATUS.DA_HOAN_THANH, giaTri: 'Đã hoàn thành'},
  ];

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucSuaChuaService,
    private danhMucSv: DanhMucService,
    private _modalRef: NzModalRef,
    private dviService: DonviService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, danhMucService);
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null],
      maCongTrinh: [null, Validators.required],
      tenCongTrinh: [null, Validators.required],
      maDiemKho: [null, Validators.required],
      tgThucHien: [null, Validators.required],
      tgHoanThanh: [null, Validators.required],
      tieuChuan: [null],
      lyDo: [null],
      tgSuaChua: [null],
      duToan: [null, Validators.required],
      soQdPheDuyet: [null],
      ngayQdPd: [null],
      giaTriPd: [null],
      trangThai: [null, Validators.required],
      type: ["00"],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      await this.loadDsDiemKho()
      if (this.dataDetail) {
        await this.getDetail(this.dataDetail.id)
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async getDetail(id) {
    this.spinner.show();
    try {
      let res = await this.danhMucService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.fileDinhKem = data.listFileDinhKems;
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

  async loadDsDiemKho() {
    const dsTong = await this.dviService.layTatCaDonViByLevel(4);
    this.dsKho = dsTong.data
    this.dsKho = this.dsKho.filter(item => item.maDvi.startsWith(this.userInfo.MA_DVI) && item.type != 'PB')
  }

  async handleOk(data: string) {
    this.helperService.markFormGroupTouched(this.formData)
    if (this.formData.invalid) {
      return;
    }
    let body = this.formData.value
    body.maDvi = this.userInfo.MA_DVI
    body.tgThucHien = body.tgThucHien ? dayjs(body.tgThucHien).get('year') : null
    body.tgHoanThanh = body.tgHoanThanh ? dayjs(body.tgHoanThanh).get('year') : null
    let res = await this.createUpdate(body);
    if (res) {
      this._modalRef.close(data);
    }
  }

  onCancel() {
    this._modalRef.close();
  }
}
