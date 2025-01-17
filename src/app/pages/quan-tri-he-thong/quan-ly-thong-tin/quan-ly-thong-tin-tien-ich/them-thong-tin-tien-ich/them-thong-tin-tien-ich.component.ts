import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import { NzCardModule, NzCardComponent } from "ng-zorro-antd/card";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MangLuoiKhoService } from "src/app/services/qlnv-kho/mangLuoiKho.service";
import { QuanLyHangTrongKhoService } from "src/app/services/quanLyHangTrongKho.service";
import { DonviService } from "src/app/services/donvi.service";
import { MESSAGE } from "src/app/constants/message";
import { NgxSpinnerService } from "ngx-spinner";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { Base2Component } from "src/app/components/base2/base2.component";
import moment from "moment";
import dayjs from "dayjs";
import { DanhMucService } from "src/app/services/danhmuc.service";
// import "froala-editor/js/plugins.pkgd.min.js";

@Component({
  selector: 'app-them-thong-tin-tien-ich',
  templateUrl: './them-thong-tin-tien-ich.component.html',
  styleUrls: ['./them-thong-tin-tien-ich.component.scss']
})
export class ThemThongTinTienIchComponent extends Base2Component implements OnInit {

  formData: FormGroup
  fb: FormBuilder = new FormBuilder();
  isView = false
  fileDinhKems: any[] = [];
  dsPLTT: any[] = [];
  data?: any
  apiKeyEditor : string = "v8ofvpe4z5ygsgab6nw0c1yz9ouvusfayup7d79zllehjavj";
  configEditor :{
    height: 400,
    menubar: 'file edit view insert format tools table help',
    menu: {
      insert: {title: 'Insert', items: 'link media table | charmap emoticons hr | pagebreak nonbreaking anchor'}
    },
    plugins: [
      'advlist autolink lists link image charmap print preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table paste code help wordcount'
    ],
    toolbar: 'undo redo | formatselect | bold italic backcolor | \
                 alignleft aligncenter alignright alignjustify | \
                 bullist numlist outdent indent | removeformat | help',
    image_advtab: true,
    image_caption: true,
  }

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private _modalRef: NzModalRef,
    private danhMucService: DanhMucService,
    private donViService: DonviService,
    private mangLuoiKhoService: MangLuoiKhoService,
    private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,

  ) {
    super(httpClient, storageService, notification, spinner, modal, quanLyHangTrongKhoService);
    this.formData = this.fb.group({
      createBy: [],
      dateCreated: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
      classify: [, [Validators.required]],
      title: [, [Validators.required]],
      link: [, [Validators.required]],
      linkName: [, [Validators.required]],
      content: [],
      status: [true],
    }
    );
  }

  ngOnInit(): void {

    this.formData.patchValue({ createBy: this.userInfo.TEN_DAY_DU })
    if (this.data) {
      this.fileDinhKems = this.data.fileDinhKems
      this.formData.patchValue({ ...this.data, dateCreated: moment(this.data.dateCreated, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD') })
    }
    this.loadDsPLTT();

  }

  async loadDsPLTT() {
    let res = await this.danhMucService.danhMucChungGetAll("PHAN_LOAI_THONG_TIN");
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsPLTT = res.data
    }
  }

  handleOk(item: any) {
    this.helperService.markFormGroupTouched(this.formData);
    if (!this.formData.valid) return
    this._modalRef.close({
      ...item,
      fileDinhKems: this.fileDinhKems,
      isUpdate: !!this.data
    });
  }

  onCancel() {
    this._modalRef.close();
  }

}
