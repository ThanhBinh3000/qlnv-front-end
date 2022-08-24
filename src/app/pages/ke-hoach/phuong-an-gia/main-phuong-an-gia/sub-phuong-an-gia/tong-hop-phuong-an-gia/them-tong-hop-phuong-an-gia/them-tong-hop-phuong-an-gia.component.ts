import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { API_STATUS_CODE, PAGE_SIZE_DEFAULT, TYPE_PAG } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { Detail } from 'src/app/models/HopDong';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DanhMucTieuChuanService } from 'src/app/services/danhMucTieuChuan.service';
import { DonviService } from 'src/app/services/donvi.service';
import { HelperService } from 'src/app/services/helper.service';
import { TongHopPhuongAnGiaService } from 'src/app/services/tong-hop-phuong-an-gia.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
@Component({
  selector: 'app-them-tong-hop-phuong-an-gia',
  templateUrl: './them-tong-hop-phuong-an-gia.component.html',
  styleUrls: ['./them-tong-hop-phuong-an-gia.component.scss']
})
export class ThemTongHopPhuongAnGiaComponent implements OnInit {
  @Input('isView') isView: boolean;
  @Input()
  idInput: number;
  @Output('onClose') onClose = new EventEmitter<any>();
  formData: FormGroup;
  @Input() type: string;
  pagChiTiet: any[] = [];
  formTraCuu: FormGroup;
  listVthh: any[] = [];
  listCloaiVthh: any[] = [];
  pageSize: number = PAGE_SIZE_DEFAULT;
  page: number = 1;
  dsNam: any[] = [];
  userInfo: UserLogin;
  dsLoaiGia: any[] = [];
  giaKsTt: any[] = [];
  giaKsTtVat: any[] = [];
  kqTdVat: any[] = [];
  kqTd: any[] = [];
  giaDng: any[] = [];
  giaDngVat: any[] = [];
  dataTable: any[] = [];
  listCuc: any[] = [];
  isTongHop: boolean = false;
  listCucSelected: any[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly modal: NzModalService,
    private spinner: NgxSpinnerService,
    public userService: UserService,
    public globals: Globals,
    private helperService: HelperService,
    private tongHopPhuongAnGiaService: TongHopPhuongAnGiaService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,
    private danhMucTieuChuanService: DanhMucTieuChuanService,
    private donviService: DonviService
  ) {
    this.formData = this.fb.group(
      {
        id: [],
        namTongHop: [],
        loaiVthh: [],
        cloaiVthh: [],
        loaiGia: [],
        maDvis: [],
        ngayDxTu: [],
        ngayDxDen: [],
        ngayTongHop: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
        noiDung: [null, [Validators.required]],
        ghiChu: [],
        giaKsTt: [],
        giaKsTtVat: [],
        kqTdVat: [],
        kqTd: [],
        giaDng: [],
        giaDngVat: [],
      }
    );
    this.formTraCuu = this.fb.group(
      {
        id: [],
        namTongHop: [dayjs().get('year'), [Validators.required]],
        loaiVthh: [null, [Validators.required]],
        cloaiVthh: [null, [Validators.required]],
        loaiGia: [null, [Validators.required]],
        maDvis: [[], [Validators.required]],
        ngayDx: [null, [Validators.required]],
      }
    );
  }

  async ngOnInit() {
    this.spinner.show();
    await Promise.all([
      this.userInfo = this.userService.getUserLogin(),
      this.loadDsNam(),
      this.getListCuc(),
      this.loadDsVthh(),
      this.loadDsLoaiGia(),
      this.getDataDetail(this.idInput),
    ])
    this.spinner.hide();
  }

  async getListCuc() {
    const res = await this.donviService.layTatCaDonViByLevel(2);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listCuc = res.data;
    }
  }

  async getDataDetail(id) {
    if (id > 0) {
      this.isTongHop = true;
      let res = await this.tongHopPhuongAnGiaService.getDetail(id);
      const data = res.data;
      console.log(data);
      this.formTraCuu.patchValue({
        namTongHop: data.namTongHop,
        loaiVthh: data.loaiVthh,
        cloaiVthh: data.cloaiVthh,
        maDvis: data.maDvis,
        ngayDx: [data.ngayDxTu, data.ngayDxDen],
        loaiGia: data.loaiGia,
      });
      this.bindingDataTongHop(res.data, null)
    }
  }

  async loadDsLoaiGia() {
    this.dsLoaiGia = [];
    let res = await this.danhMucService.danhMucChungGetAll('LOAI_GIA');
    if (res.msg == MESSAGE.SUCCESS) {
      if (this.type == TYPE_PAG.GIA_MUA_TOI_DA) {
        this.dsLoaiGia = res.data.filter(item =>
          item.ma == 'LG01' || item.ma == 'LG02'
        );
      }
      if (this.type == TYPE_PAG.GIA_CU_THE) {
        this.dsLoaiGia = res.data.filter(item =>
          item.ma == 'LG03' || item.ma == 'LG04'
        );
      }
    }
  }

  loadDsNam() {
    for (let i = -3; i < 23; i++) {
      this.dsNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
  }

  downloadFileKeHoach(event) { }

  quayLai() {
    this.onClose.emit();
  }

  banHanh() {
  }

  async save() {
    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.type = this.type;
    let res = await this.tongHopPhuongAnGiaService.create(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (this.idInput > 0) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      } else {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
      }
      this.quayLai();
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }

    this.spinner.hide();
  }

  async loadDsVthh() {
    this.listVthh = [];
    let res = await this.danhMucService.danhMucChungGetAll('LOAI_HHOA');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listVthh = res.data.filter(item => item.ma != '02');
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

  async onChangeCloaiVthh(event) {
    let res = await this.danhMucTieuChuanService.getDetailByMaHh(event);
    if (res.statusCode == API_STATUS_CODE.SUCCESS) {
      this.formData.patchValue({
        tchuanCluong: res.data ? res.data.tenQchuan : null
      })
    }
  }

  async tongHop() {
    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formTraCuu);
    if (this.formTraCuu.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      this.spinner.hide();
      return;
    }
    let body = this.formTraCuu.value;
    if (body.ngayDx) {
      body.ngayDxTu = body.ngayDx[0];
      body.ngayDxDen = body.ngayDx[1];
    }
    body.type = this.type;
    delete body.ngayDx;
    let res = await this.tongHopPhuongAnGiaService.tongHop(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.isTongHop = true;
      this.bindingDataTongHop(res.data, body);
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.TONG_HOP_SUCCESS);
    } else {
      this.isTongHop = false;
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  bindingDataTongHop(data, reqBody) {
    console.log(data);
    let giaKsTt = data.giaKsTtTu && data.giaKsTtDen ? data.giaKsTtTu + " - " + data.giaKsTtDen : null;
    let giaKsTtVat = data.giaKsTtVatTu && data.giaKsTtVatDen ? data.giaKsTtVatTu + " - " + data.giaKsTtVatDen : null;
    let kqTd = data.giaTdTu && data.giaTdDen ? data.giaTdTu + " - " + data.giaTdDen : null;
    let kqTdVat = data.giaTdVatTu && data.giaTdVatDen ? data.giaTdVatTu + " - " + data.giaTdVatDen : null;
    let giaDng = data.giaDnTu && data.giaDnDen ? data.giaDnTu + " - " + data.giaDnDen : null;
    let giaDngVat = data.giaDnVatTu && data.giaDnVatDen ? data.giaDnVatTu + " - " + data.giaDnVatDen : null;
    this.formData.patchValue({
      id: data.id,
      namTongHop: data.namTongHop ?? reqBody.namTongHop,
      loaiVthh: data.loaiVthh ?? reqBody.loaiVthh,
      cloaiVthh: data.cloaiVthh ?? reqBody.cloaiVthh,
      loaiGia: data.loaiGia ?? reqBody.loaiGia,
      maDvis: data.maDvis ?? reqBody.maDvis,
      ngayDxTu: data.ngayDxTu ?? reqBody.ngayDxTu,
      ngayDxDen: data.ngayDxDen ?? reqBody.ngayDxDen,
      noiDung: data.noiDung,
      ghiChu: data.ghiChu,
      giaKsTt: giaKsTt,
      giaKsTtVat: giaKsTtVat,
      kqTd: kqTd,
      kqTdVat: kqTdVat,
      giaDng: giaDng,
      giaDngVat: giaDngVat,
    })
    this.dataTable = data.pagChiTiets;
  }

  taoTtrinh() {

  }
}


