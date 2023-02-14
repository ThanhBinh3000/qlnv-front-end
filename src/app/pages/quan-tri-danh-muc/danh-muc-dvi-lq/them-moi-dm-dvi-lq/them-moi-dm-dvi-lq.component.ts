import {Component, OnInit} from '@angular/core';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {Base2Component} from "../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import {KtKhXdHangNamService} from "../../../../services/kt-kh-xd-hang-nam.service";
import {DanhMucService} from "../../../../services/danhmuc.service";

@Component({
  selector: 'app-them-moi-dm-dvi-lq',
  templateUrl: './them-moi-dm-dvi-lq.component.html',
  styleUrls: ['./them-moi-dm-dvi-lq.component.scss']
})
export class ThemMoiDmDviLqComponent extends Base2Component implements OnInit {

  listTrangThai = [{"ma": "00", "giaTri": "Cá nhân"}, {"ma": "01", "giaTri": "Công ty"}];

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private dexuatService : KtKhXdHangNamService,
    private dmService : DanhMucService,
    private _modalRef : NzModalRef
  ) {
    super(httpClient, storageService, notification, spinner, modal, dexuatService);
    super.ngOnInit()
    this.formData = this.fb.group({
      id   : [null],
      mst : [null],
      ten : [null],
      dienThoai : [null],
      fax : [null],
      diaChi : [null],
      stk : [null],
      nganHang : [null],
      nguoiDaiDien : [null],
      chucVu : [null],
      ghiChu : [null],
      phanLoai : [null],
      trangThai : ['00'],
      loaiDvi : ['00']
    });
  }

  async ngOnInit() {
    await Promise.all([

    ])
  }

  async save() {

  }

  handleCancel() {
    this._modalRef.destroy();
  }

  changeLoaiDvi(event) {
    // this.formData.reset();
    // console.log(this.formData.value)
    // // this.formData.patchValue({
    // //   loaiDvi : event,
    // //   trangThai : '00'
    // // })
  }
}
