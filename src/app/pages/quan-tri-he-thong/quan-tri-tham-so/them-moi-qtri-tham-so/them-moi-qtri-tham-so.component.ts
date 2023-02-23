import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-them-moi-qtri-tham-so',
  templateUrl: './them-moi-qtri-tham-so.component.html',
  styleUrls: ['./them-moi-qtri-tham-so.component.scss']
})
export class ThemMoiQtriThamSoComponent extends Base2Component implements OnInit {
  danhSachLoai : any[] = [];
  danhSachDmdc  :any[] = [];
  danhSachDmDcCt  :any[] =[];
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private _modalRef: NzModalRef,
    private qtriService: QuanTriThamSoService,
    private dmDungChung : DanhMucService

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
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadDsLoai() {
    let res = await this.dmDungChung.danhMucChungGetAll('KIEU_GIA_TRI');
    if (res.msg == MESSAGE.SUCCESS) {
      this.danhSachLoai = res.data
    }
  }

  handleOk() {
    this._modalRef.close();
  }

  onCancel() {
    this._modalRef.close();
  }

}
