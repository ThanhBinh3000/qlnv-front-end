import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalService } from "ng-zorro-antd/modal";
import { DanhMucService } from "../../../../../../../services/danhmuc.service";
import { DeXuatKeHoachBanDauGiaService } from "../../../../../../../services/deXuatKeHoachBanDauGia.service";
import { NgxSpinnerService } from "ngx-spinner";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Globals } from "../../../../../../../shared/globals";
import { UserService } from "../../../../../../../services/user.service";
import { DonviService } from "../../../../../../../services/donvi.service";
import { TinhTrangKhoHienThoiService } from "../../../../../../../services/tinhTrangKhoHienThoi.service";
import { DanhMucTieuChuanService } from "../../../../../../../services/quantri-danhmuc/danhMucTieuChuan.service";
import {
  DeXuatPhuongAnCuuTroService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/DeXuatPhuongAnCuuTro.service";
import { HelperService } from "../../../../../../../services/helper.service";
import { MESSAGE } from "../../../../../../../constants/message";
import { UserLogin } from "../../../../../../../models/userlogin";
import { STATUS } from 'src/app/constants/status';
import { DatePipe } from "@angular/common";
import * as dayjs from "dayjs";
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-chi-tiet-thong-tin-dau-gia',
  templateUrl: './chi-tiet-thong-tin-dau-gia.component.html',
  styleUrls: ['./chi-tiet-thong-tin-dau-gia.component.scss']
})
export class ChiTietThongTinDauGiaComponent extends Base2Component implements OnInit {
  //base init
  @Input() id: number;
  @Input() loaiVthhInput: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  formData: FormGroup;
  fileDinhKem: any[] = [];
  userLogin: UserLogin;
  STATUS = STATUS;
  datePipe = new DatePipe('en-US');
  listNam: any[] = [];

  //
  currentSelected: any = 1;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private deXuatKeHoachBanDauGiaService: DeXuatKeHoachBanDauGiaService,
    private dmTieuChuanService: DanhMucTieuChuanService,
    private deXuatPhuongAnCuuTroService: DeXuatPhuongAnCuuTroService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, dmTieuChuanService);

    this.formData = this.fb.group(
      {
        id: [],
        nam: [dayjs().get("year"), [Validators.required]],
        maDvi: [],
        loaiVthh: [],
        cloaiVthh: [],
        idQdPdKh: [],
        soQdPdKh: [],
        idQdDcKh: [],
        soQdDcKh: [],
        idQdPdKq: [],
        soQdPdKq: [],
        idKhDx: [],
        soKhDx: [],
        ngayQdPdKqBdg: [],
        thoiHanGiaoNhan: [],
        thoiHanThanhToan: [],
        phuongThucThanhToan: [],
        phuongThucGiaoNhan: [],
        trangThai: [],
        maDviThucHien: [],
        tongTienGiaKhoiDiem: [],
        tongTienDatTruoc: [],
        tongTienDatTruocDuocDuyet: [],
        tongSoLuong: [],
        phanTramDatTruoc: [],
        thoiGianToChucTu: [],
        thoiGianToChucDen: [],
        tenDvi: [],
        tenDviThucHien: [],
        tenLoaiVthh: [],
        tenCloaiVthh: [],
        soDviTsan: [],
        soDviTsanThanhCong: [],
        soDviTsanKhongThanh: [],
        detail:
          new FormArray([this.fb.group({
            id: [],
            idTtinHdr: [],
            maDvi: [],
            soBb: [],
            ngayKy: [],
            trichYeuKetQua: [],
            ketQua: [],
            soTb: [],
            trichYeuThongBao: [],
            toChucTen: [],
            toChucDiaChi: [],
            toChucSdt: [],
            toChucStk: [],
            soHopDong: [],
            ngayKyHopDong: [],
            hinhThucToChuc: [],
            thoiHanDkTu: [],
            thoiHanDkDen: [],
            thoiHanDk: [],
            ghiChuThoiGianDk: [],
            ghiChuThoiGianXem: [],
            diaDiemNopHoSo: [],
            diaDiemXemTaiSan: [],
            dieuKienDk: [],
            buocGia: [],
            thoiHanXemTaiSanTu: [],
            thoiHanXemTaiSanDen: [],
            thoiHanNopTienTu: [],
            thoiHanNopTienDen: [],
            phuongThucThanhToan: [],
            huongThuTen: [],
            huongThuStk: [],
            huongThuNganHang: [],
            huongThuChiNhanh: [],
            thoiGianToChucTu: [],
            thoiGianToChucDen: [],
            diaDiemToChuc: [],
            hinhThucDauGia: [],
            phuongThucDauGia: [],
            ghiChu: [],
            tenDvi: [],
            fileDinhKem: [],
            canCu: [],
            listNguoiLienQuan: [this.fb.group({
              id: [],
              idTtinHdr: [],
              idTtinDtl: [],
              maDvi: [],
              hoVaTen: [],
              chucVu: [],
              diaChi: [],
              giayTo: [],
              loai: [],
            })],
            listTaiSan: [this.fb.group({
              id: [],
              idTtinHdr: [],
              idTtinDtl: [],
              maDvi: [],
              maDiaDiem: [],
              soLuong: [],
              donGia: [],
              donGiaCaoNhat: [],
              cloaiVthh: [],
              maDvTaiSan: [],
              tonKho: [],
              donViTinh: [],
              giaKhoiDiem: [],
              soTienDatTruoc: [],
              soLanTraGia: [],
              nguoiTraGiaCaoNhat: [],
              tenDvi: [],
              tenChiCuc: [],
              tenDiemKho: [],
              tenNhaKho: [],
              tenNganKho: [],
              tenLoKho: [],
              tenLoaiVthh: [],
              tenCloaiVthh: [],
            })]
          })]),
        //listTaiSanQd: [Array<KeHoachVatTu>()]
      }
    );
    this.userLogin = this.userService.getUserLogin();
    // this.maDeXuat = '/' + this.userInfo.MA_TCKT;
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
    let tmpData =
    {
      "serialVersionUID": 0,
      "TABLE_NAME": "",
      "id": 0,
      "nam": 0,
      "maDvi": "aaa",
      "loaiVthh": "",
      "cloaiVthh": "",
      "idQdPdKh": 0,
      "soQdPdKh": "",
      "idQdDcKh": 0,
      "soQdDcKh": "",
      "idQdPdKq": 0,
      "soQdPdKq": "",
      "idKhDx": 0,
      "soKhDx": "",
      "ngayQdPdKqBdg": "2022-12-12",
      "thoiHanGiaoNhan": 0,
      "thoiHanThanhToan": 0,
      "phuongThucThanhToan": "",
      "phuongThucGiaoNhan": "",
      "trangThai": "",
      "maDviThucHien": "",
      "tongTienGiaKhoiDiem": 0,
      "tongTienDatTruoc": 0,
      "tongTienDatTruocDuocDuyet": 0,
      "tongSoLuong": 0,
      "phanTramDatTruoc": 0,
      "thoiGianToChucTu": "2022-12-12",
      "thoiGianToChucDen": "2022-12-12",
      "tenDvi": "",
      "tenDviThucHien": "",
      "tenLoaiVthh": "",
      "tenCloaiVthh": "",
      "soDviTsan": 0,
      "soDviTsanThanhCong": 0,
      "soDviTsanKhongThanh": 0,
      "detail": [
        {
          "serialVersionUID": 0,
          "TABLE_NAME": "",
          "id": 0,
          "idTtinHdr": 0,
          "maDvi": "aaa",
          "soBb": "",
          "ngayKy": "2022-12-12",
          "trichYeuKetQua": "",
          "ketQua": "",
          "soTb": "",
          "trichYeuThongBao": "",
          "toChucTen": "",
          "toChucDiaChi": "",
          "toChucSdt": "",
          "toChucStk": "",
          "soHopDong": "",
          "ngayKyHopDong": "2022-12-12",
          "hinhThucToChuc": "",
          "thoiHanDkTu": "2022-12-12",
          "thoiHanDkDen": "2022-12-12",
          "ghiChuThoiGianDk": "",
          "ghiChuThoiGianXem": "",
          "diaDiemNopHoSo": "",
          "diaDiemXemTaiSan": "",
          "dieuKienDk": 0,
          "buocGia": 0,
          "thoiHanXemTaiSanTu": "2022-12-12",
          "thoiHanXemTaiSanDen": "2022-12-12",
          "thoiHanNopTienTu": "2022-12-12",
          "thoiHanNopTienDen": "2022-12-12",
          "phuongThucThanhToan": "",
          "huongThuTen": "",
          "huongThuStk": "",
          "huongThuNganHang": "",
          "huongThuChiNhanh": "",
          "thoiGianToChucTu": "2022-12-12",
          "thoiGianToChucDen": "2022-12-12",
          "diaDiemToChuc": "",
          "hinhThucDauGia": "",
          "phuongThucDauGia": "",
          "ghiChu": "",
          "tenDvi": "",
          "fileDinhKem": {
            "id": 0,
            "fileName": "",
            "fileSize": "",
            "fileUrl": "",
            "fileType": "",
            "dataType": "",
            "createDate": "2022-12-12 08:44:18",
            "dataId": 0,
            "noiDung": ""
          },
          "canCu": [],
          "listNguoiLienQuan": [
            {
              "serialVersionUID": 0,
              "TABLE_NAME": "",
              "id": 0,
              "idTtinHdr": 0,
              "idTtinDtl": 0,
              "maDvi": "",
              "hoVaTen": "",
              "chucVu": "2022-12-12",
              "diaChi": "",
              "giayTo": "",
              "loai": "",
              "tenDvi": "",
              "ngayTao": "2022-12-12T08:44:18.614841500",
              "nguoiTaoId": 0,
              "ngaySua": "2022-12-12T08:44:18.614841500",
              "nguoiSuaId": 0
            }
          ],
          "listTaiSan": [
            {
              "serialVersionUID": 0,
              "TABLE_NAME": "",
              "id": 0,
              "idTtinHdr": 0,
              "idTtinDtl": 0,
              "maDvi": "",
              "maDiaDiem": "aaa",
              "soLuong": 0,
              "donGia": 0,
              "donGiaCaoNhat": 0,
              "cloaiVthh": "",
              "maDvTaiSan": "",
              "tonKho": 0,
              "donViTinh": "",
              "giaKhoiDiem": 0,
              "soTienDatTruoc": 0,
              "soLanTraGia": 0,
              "nguoiTraGiaCaoNhat": "",
              "tenDvi": "",
              "tenChiCuc": "",
              "tenDiemKho": "",
              "tenNhaKho": "",
              "tenNganKho": "",
              "tenLoKho": "",
              "tenLoaiVthh": "",
              "tenCloaiVthh": "",
              "ngayTao": "2022-12-12T08:44:18.614841500",
              "nguoiTaoId": 0,
              "ngaySua": "2022-12-12T08:44:18.614841500",
              "nguoiSuaId": 0
            }
          ],
          "ngayTao": "2022-12-12T08:44:18.614841500",
          "nguoiTaoId": 0,
          "ngaySua": "2022-12-12T08:44:18.614841500",
          "nguoiSuaId": 0
        },
        {
          "serialVersionUID": 0,
          "TABLE_NAME": "",
          "id": 0,
          "idTtinHdr": 0,
          "maDvi": "aaa",
          "soBb": "",
          "ngayKy": "2022-12-12",
          "trichYeuKetQua": "",
          "ketQua": "",
          "soTb": "",
          "trichYeuThongBao": "",
          "toChucTen": "",
          "toChucDiaChi": "",
          "toChucSdt": "",
          "toChucStk": "",
          "soHopDong": "",
          "ngayKyHopDong": "2022-12-12",
          "hinhThucToChuc": "",
          "thoiHanDkTu": "2022-12-12",
          "thoiHanDkDen": "2022-12-12",
          "ghiChuThoiGianDk": "",
          "ghiChuThoiGianXem": "",
          "diaDiemNopHoSo": "",
          "diaDiemXemTaiSan": "",
          "dieuKienDk": 0,
          "buocGia": 0,
          "thoiHanXemTaiSanTu": "2022-12-12",
          "thoiHanXemTaiSanDen": "2022-12-12",
          "thoiHanNopTienTu": "2022-12-12",
          "thoiHanNopTienDen": "2022-12-12",
          "phuongThucThanhToan": "",
          "huongThuTen": "",
          "huongThuStk": "",
          "huongThuNganHang": "",
          "huongThuChiNhanh": "",
          "thoiGianToChucTu": "2022-12-12",
          "thoiGianToChucDen": "2022-12-12",
          "diaDiemToChuc": "",
          "hinhThucDauGia": "",
          "phuongThucDauGia": "",
          "ghiChu": "",
          "tenDvi": "",
          "fileDinhKem": {
            "id": 0,
            "fileName": "",
            "fileSize": "",
            "fileUrl": "",
            "fileType": "",
            "dataType": "",
            "createDate": "2022-12-12 08:44:18",
            "dataId": 0,
            "noiDung": ""
          },
          "canCu": [],
          "listNguoiLienQuan": [
            {
              "serialVersionUID": 0,
              "TABLE_NAME": "",
              "id": 0,
              "idTtinHdr": 0,
              "idTtinDtl": 0,
              "maDvi": "",
              "hoVaTen": "",
              "chucVu": "2022-12-12",
              "diaChi": "",
              "giayTo": "",
              "loai": "",
              "tenDvi": "",
              "ngayTao": "2022-12-12T08:44:18.614841500",
              "nguoiTaoId": 0,
              "ngaySua": "2022-12-12T08:44:18.614841500",
              "nguoiSuaId": 0
            }
          ],
          "listTaiSan": [
            {
              "serialVersionUID": 0,
              "TABLE_NAME": "",
              "id": 0,
              "idTtinHdr": 0,
              "idTtinDtl": 0,
              "maDvi": "",
              "maDiaDiem": "aaa",
              "soLuong": 0,
              "donGia": 0,
              "donGiaCaoNhat": 0,
              "cloaiVthh": "",
              "maDvTaiSan": "",
              "tonKho": 0,
              "donViTinh": "",
              "giaKhoiDiem": 0,
              "soTienDatTruoc": 0,
              "soLanTraGia": 0,
              "nguoiTraGiaCaoNhat": "",
              "tenDvi": "",
              "tenChiCuc": "",
              "tenDiemKho": "",
              "tenNhaKho": "",
              "tenNganKho": "",
              "tenLoKho": "",
              "tenLoaiVthh": "",
              "tenCloaiVthh": "",
              "ngayTao": "2022-12-12T08:44:18.614841500",
              "nguoiTaoId": 0,
              "ngaySua": "2022-12-12T08:44:18.614841500",
              "nguoiSuaId": 0
            }
          ],
          "ngayTao": "2022-12-12T08:44:18.614841500",
          "nguoiTaoId": 0,
          "ngaySua": "2022-12-12T08:44:18.614841500",
          "nguoiSuaId": 0
        }
      ],
      "listTaiSanQd": [
        {
          "serialVersionUID": 0,
          "TABLE_NAME": "",
          "id": 0,
          "idTtinHdr": 0,
          "idTtinDtl": 0,
          "maDvi": "",
          "maDiaDiem": "",
          "soLuong": 0,
          "donGia": 0,
          "donGiaCaoNhat": 0,
          "cloaiVthh": "",
          "maDvTaiSan": "",
          "tonKho": 0,
          "donViTinh": "",
          "giaKhoiDiem": 0,
          "soTienDatTruoc": 0,
          "soLanTraGia": 0,
          "nguoiTraGiaCaoNhat": "",
          "tenDvi": "",
          "tenChiCuc": "",
          "tenDiemKho": "",
          "tenNhaKho": "",
          "tenNganKho": "",
          "tenLoKho": "",
          "tenLoaiVthh": "",
          "tenCloaiVthh": "",
          "ngayTao": "2022-12-12T08:44:18.614841500",
          "nguoiTaoId": 0,
          "ngaySua": "2022-12-12T08:44:18.614841500",
          "nguoiSuaId": 0
        }
      ],
      "ngayTao": "2022-12-12T08:44:18.614841500",
      "nguoiTaoId": 0,
      "ngaySua": "2022-12-12T08:44:18.614841500",
      "nguoiSuaId": 0
    }
    // tmpData.detail.map(s => {
    //   this.detail.push(this.fb.group(s));
    // });
    this.formData.patchValue(tmpData);

  }

  async ngOnInit() {
    try {
      this.spinner.show();
      //this.loadDonVi();
      await Promise.all([
        this.loadDanhMuc(),
        this.loadDetail(this.idInput),
      ])
      this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }

  async loadDanhMuc() {
    let res = await this.danhMucService.danhMucChungGetAll("LOAI_HINH_NHAP_XUAT");
    if (res.msg == MESSAGE.SUCCESS) {
      // this.listLoaiHinhNhapXuat = res.data.filter(item => item.phanLoai == 'VIEN_TRO_CUU_TRO');
    }
  }

  async loadDetail(id: number) {
    if (id > 0) {
      await this.deXuatPhuongAnCuuTroService.getDetail(id)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            res.data.soDxuat = res.data.soDxuat.split('/')[0];
            this.formData.patchValue(res.data);
            this.fileDinhKem = this.formData.get('fileDinhKem').value;
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      this.formData.patchValue({
        maDvi: this.userLogin.MA_DVI,
        tenDvi: this.userLogin.TEN_DVI
      })
    }
  }

  quayLai() {
    this.showListEvent.emit();
  }

  hoanThanhCapNhat() {

  }

  themMoiPhienDauGia(event: any) {
    event.stopPropagation()
    console.log("ok")
  }

  selectRow(i: number) {
    this.currentSelected = i;
  }

  // get detail(): FormArray {
  //   return this.formData.get('detail') as FormArray;
  // }
}
