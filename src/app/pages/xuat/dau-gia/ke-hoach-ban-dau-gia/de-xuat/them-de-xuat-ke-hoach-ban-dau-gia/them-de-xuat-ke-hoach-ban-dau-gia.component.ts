import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserLogin} from "../../../../../../models/userlogin";
import {DiaDiemGiaoNhan, KeHoachBanDauGia, PhanLoTaiSan} from "../../../../../../models/KeHoachBanDauGia";
import {DatePipe} from "@angular/common";
import {DiaDiemNhapKho} from "../../../../../../models/CuuTro";
import {NzModalService} from "ng-zorro-antd/modal";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {DeXuatKeHoachBanDauGiaService} from "../../../../../../services/deXuatKeHoachBanDauGia.service";
import {NgxSpinnerService} from "ngx-spinner";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {Globals} from "../../../../../../shared/globals";
import {UserService} from "../../../../../../services/user.service";
import {DonviService} from "../../../../../../services/donvi.service";
import {TinhTrangKhoHienThoiService} from "../../../../../../services/tinhTrangKhoHienThoi.service";
import {DanhMucTieuChuanService} from "../../../../../../services/quantri-danhmuc/danhMucTieuChuan.service";
import {
  DeXuatPhuongAnCuuTroService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/DeXuatPhuongAnCuuTro.service";
import {HelperService} from "../../../../../../services/helper.service";
import {STATUS} from "../../../../../../constants/status";
import * as dayjs from "dayjs";
import {MESSAGE} from "../../../../../../constants/message";

@Component({
  selector: 'app-them-de-xuat-ke-hoach-ban-dau-gia',
  templateUrl: './them-de-xuat-ke-hoach-ban-dau-gia.component.html',
  styleUrls: ['./them-de-xuat-ke-hoach-ban-dau-gia.component.scss']
})
export class ThemDeXuatKeHoachBanDauGiaComponent implements OnInit {
  @Input() loaiVthhInput: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() id: number;
  STATUS = STATUS;
  formData: FormGroup;
  listNam: any[] = [];
  userInfo: UserLogin;
  fileDinhKem: any[] = [];
  maDxuat: string;
  listLoaiHinhNhapXuat: any;
  listKieuNhapXuat: any;

  constructor(
    private modal: NzModalService,
    private danhMucService: DanhMucService,
    private deXuatKeHoachBanDauGiaService: DeXuatKeHoachBanDauGiaService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    public globals: Globals,
    public userService: UserService,
    private donviService: DonviService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private dmTieuChuanService: DanhMucTieuChuanService,
    private deXuatPhuongAnCuuTroService: DeXuatPhuongAnCuuTroService,
    private cdr: ChangeDetectorRef,
    private helperService: HelperService,) {
    this.formData = this.fb.group(
      {
        id: [],
        soDxuat: [null, [Validators.required]],
        idDxuat: [null,],
        maDvi: [''],
        tenDvi: [],
        ngayDxuat: [null, [Validators.required]],
        loaiVthh: [null, [Validators.required]],
        cloaiVthh: [null, [Validators.required]],
        tenLoaiVthh: [null, [Validators.required]],
        tenCloaiVthh: [null, [Validators.required]],
        tenVthh: [],
        tongSoLuong: [],
        trichYeu: [null, [Validators.required]],
        trangThai: [STATUS.DU_THAO],
        trangThaiTh: [],
        tenTrangThai: ['Dự thảo'],
        tenTrangThaiTh: [],
        loaiHinhNhapXuat: [null, [Validators.required]],
        kieuNhapXuat: [null, [Validators.required]],
        thoiGianThucHien: [],
        noiDung: [],
        nam: [dayjs().get("year"), [Validators.required]],
        tongTien: [],
        fileDinhKem: [new Array()],
        thongTinChiTiet: [new Array()],
        // phuongAnXuat: [new Array()],
      }
    );
    this.userInfo = this.userService.getUserLogin();
    this.maDxuat = '/' + this.userInfo.MA_TCKT;
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
  }

  async ngOnInit() {
    try {
      this.spinner.show();
      //this.loadDonVi();
      await Promise.all([])
      // await Promise.all([this.loaiVTHHGetAll(), this.loaiHopDongGetAll()]);
      this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }

  quayLai() {
    this.showListEvent.emit();
  }

  isPermission(status: string) {
    return true;
  }

  tuChoi() {

  }

  duyet() {

  }

  luuGuiDuyet() {

  }

  save() {

  }

  changeLoaiHinhNhapXuat($event: any) {

  }

  selectCanCu() {

  }

  selectHangHoa() {

  }
}
