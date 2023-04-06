import {Component, OnInit} from '@angular/core';
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Globals} from "../../../shared/globals";
import {MangLuoiKhoService} from "../../../services/quan-ly-kho-tang/mangLuoiKho.service";
import {NgxSpinnerService} from "ngx-spinner";
import {HelperService} from "../../../services/helper.service";
import {MESSAGE} from "../../../constants/message";
import {DanhMucService} from "../../../services/danhmuc.service";
import {API_STATUS_CODE} from "../../../constants/config";
import * as dayjs from "dayjs";
import {OldResponseData} from "../../../interfaces/response";
import {TrangThaiHoatDong} from "../../../constants/status";

@Component({
  selector: 'app-dialog-them-moi-so-du-dau-ky',
  templateUrl: './dialog-them-moi-so-du-dau-ky.component.html',
  styleUrls: ['./dialog-them-moi-so-du-dau-ky.component.scss']
})
export class DialogThemMoiSoDuDauKyComponent implements OnInit {
  m3: string = 'm3';
  formData: FormGroup;
  detail: any;
  levelNode: any;
  listVthh: any[] = [];
  listCloaiVthh: any[] = [];
  dsNam: any[] = [];
  dvi: string = 'Tấn kho';

  constructor(
    private _modalRef: NzModalRef,
    private notification: NzNotificationService,
    private khoService: MangLuoiKhoService,
    private danhMucService: DanhMucService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public globals: Globals,
    private helperService: HelperService,
    private modal: NzModalRef,
  ) {
    this.formData = this.fb.group({
      maDvi: [],
      tenDvi: [],
      tichLuongSdLt: ['', Validators.required],
      tichLuongSdVt: ['', Validators.required],
      theTichSdVt: ['', Validators.required],
      theTichSdLt: ['', Validators.required],
      namNhap: ['', Validators.required],
      ngayNhapDay: [''],
      loaiVthh: ['', Validators.required],
      cloaiVthh: ['', Validators.required],
      slTon: ['', Validators.required],
      dviTinh: [''],
      thanhTien: [0],
      isKhoiTao : [true]
    })
  }

  async ngOnInit() {
    console.log(this.detail)
    await Promise.all([
      this.getAllLoaiVthh(),
      this.loadDsNam(),
      this.getDetail()
    ])
  }

  async loadDsNam() {
      let thisYear = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.dsNam.push((thisYear + i).toString());
      }
  }

  async getDetail() {
    if (this.detail) {
      this.formData.patchValue({
        maDvi: this.levelNode == 6 ? this.detail.maNgankho : this.detail.maNganlo,
        tenDvi: this.levelNode == 6 ? this.detail.tenNgankho : this.detail.tenNganlo,
      })
    }
  }


  save(type) {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      return;
    }
    if (!this.checkValidateLoaiVthh()) {
      this.notification.error(MESSAGE.ERROR, 'Loại hàng hóa không hợp lệ!')
      return;
    }
    let body = this.detail
    body.tichLuongKdLt = (body.tichLuongTkLt - this.formData.value.tichLuongSdLt) >= 0 ? body.tichLuongTkLt - this.formData.value.tichLuongSdLt : 0
    body.tichLuongKdVt = (body.tichLuongKdVt - this.formData.value.tichLuongSdVt) >= 0 ? body.tichLuongKdVt - this.formData.value.tichLuongSdVt : 0
    body.theTichKdLt = (body.theTichTkLt - this.formData.value.theTichSdLt) >=0 ? body.theTichKdLt - this.formData.value.theTichSdLt : 0
    body.theTichKdVt = (body.theTichTkVt - this.formData.value.theTichSdVt) >= 0 ? body.theTichTkVt - this.formData.value.theTichSdVt : 0
    body.loaiVthh = this.formData.value.loaiVthh
    body.cloaiVthh = this.formData.value.cloaiVthh
    body.slTon = this.formData.value.slTon
    body.dviTinh = this.formData.value.dviTinh
    body.namNhap = this.formData.value.namNhap
    body.isKhoiTao = this.formData.value.isKhoiTao
    body.trangThai = body.trangThai == true ? TrangThaiHoatDong.HOAT_DONG : TrangThaiHoatDong.KHONG_HOAT_DONG
    this.khoService.updateKho(type, body).then((res: OldResponseData) => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        this.modal.close(true);
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }).catch((e) => {
      console.error('error: ', e);
      this.notification.error(
        MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR
      );
    });
  }

  handleCancel() {
    this._modalRef.close();
  }

  async getAllLoaiVthh() {
    let res = await this.danhMucService.danhMucChungGetAll('LOAI_HHOA');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listVthh = res.data;
    }
  }

  async onChangeLoaiVthh(event) {
    let body = {
      "str": event
    };
    let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha(body);
    this.listCloaiVthh = [];
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listCloaiVthh = res.data;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async onChangCloaiVthh(event) {
    let res = await this.danhMucService.getDetail(event);
    if (res.msg == MESSAGE.SUCCESS) {
      this.formData.patchValue({
        dviTinh: res.data ? res.data.maDviTinh : null
      })
    }
  }

  checkValidateLoaiVthh() : boolean {
    let check = false;
    if (this.detail.loaiHangHoa) {
      let arr = this.detail.loaiHangHoa.split(",");
      if (arr && arr.length > 0) {
        console.log(arr)
        arr.forEach(item => {
          if (this.formData.value.loaiVthh == item) {
            check =true
          }
        })
      }
    }
    return check;
  }
}
