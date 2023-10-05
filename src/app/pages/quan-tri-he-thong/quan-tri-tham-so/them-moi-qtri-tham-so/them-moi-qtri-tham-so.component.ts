import {Component, Input, OnInit} from '@angular/core';
import {Base2Component} from "../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {DanhMucService} from "../../../../services/danhmuc.service";
import {
  QuyetDinhGiaoNvNhapHangService
} from "../../../../services/qlnv-hang/nhap-hang/mua-truc-tiep/qdinh-giao-nvu-nh/quyetDinhGiaoNvNhapHang.service";
import {
  BangKeThuMuaLeService
} from "../../../../services/qlnv-hang/nhap-hang/mua-truc-tiep/BangKeThuMuaLeService.service";
import {QuanTriThamSoService} from "../../../../services/quan-tri-tham-so.service";
import {Validators} from "@angular/forms";
import {MESSAGE} from "../../../../constants/message";
import {STATUS, TrangThaiHoatDong} from "../../../../constants/status";

@Component({
  selector: 'app-them-moi-qtri-tham-so',
  templateUrl: './them-moi-qtri-tham-so.component.html',
  styleUrls: ['./them-moi-qtri-tham-so.component.scss']
})
export class ThemMoiQtriThamSoComponent extends Base2Component implements OnInit {
  @Input()
  dataDetail : any;

  danhSachLoai: any[] = [];
  danhSachDmdc: any[] = [];
  danhSachDmDcCt: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private _modalRef: NzModalRef,
    private qtriService: QuanTriThamSoService,
    private dmDungChung: DanhMucService
  ) {
    super(httpClient, storageService, notification, spinner, modal, qtriService);
    this.formData = this.fb.group({
      id: [null],
      ma: [null, Validators.required],
      ten: [null, Validators.required],
      giaTri: [null, Validators.required],
      loai: [null, Validators.required],
      danhSach: [null],
      moTa: [null],
      tuNgay: [null],
      denNgay: [null],
      trangThai: ['00'],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      await this.loadDsLoai();
      this.patchValue()
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  patchValue() {
    if (this.dataDetail) {
      this.formData.patchValue({
        id: this.dataDetail.id,
        ma: this.dataDetail.ma,
        ten: this.dataDetail.ten,
        giaTri: this.dataDetail.giaTri,
        loai: this.dataDetail.loai,
        danhSach: this.dataDetail.danhSach,
        moTa: this.dataDetail.moTa,
        tuNgay: this.dataDetail.tuNgay,
        denNgay: this.dataDetail.denNgay,
        trangThai: this.dataDetail.trangThai,
      })
    }
  }

  async loadDsLoai() {
    let res = await this.dmDungChung.danhMucChungGetAll('KIEU_GIA_TRI');
    if (res.msg == MESSAGE.SUCCESS) {
      this.danhSachLoai = res.data
    }
  }

  async handleOk() {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.trangThai = this.formData.value.trangThai ? TrangThaiHoatDong.HOAT_DONG : TrangThaiHoatDong.KHONG_HOAT_DONG;
    let data = await this.createUpdate(body);
    if (data) {
      this._modalRef.close();
    }
  }

  onCancel() {
    this._modalRef.close();
  }

  async loadDanhSach(event) {
    if (event == '03') {
      let res = await this.dmDungChung.danhMucChungGetAll('DANH_MUC_DC');
      if (res.msg == MESSAGE.SUCCESS) {
        this.danhSachDmdc = res.data
      }
    }
  }

  async loadDanhSachCt(event) {
    let res = await this.dmDungChung.danhMucChungGetAll(event);
    if (res.msg == MESSAGE.SUCCESS) {
      this.danhSachDmDcCt = res.data
    }
  }
}
