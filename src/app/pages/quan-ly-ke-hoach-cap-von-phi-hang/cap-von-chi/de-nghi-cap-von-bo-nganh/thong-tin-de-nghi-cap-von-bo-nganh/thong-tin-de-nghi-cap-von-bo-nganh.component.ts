import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { FileDinhKem } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import {
  DiaDiemGiaoNhan,
  KeHoachBanDauGia,
  PhanLoTaiSan,
} from 'src/app/models/KeHoachBanDauGia';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DeXuatKeHoachBanDauGiaService } from 'src/app/services/deXuatKeHoachBanDauGia.service';
import { DonviService } from 'src/app/services/donvi.service';
import { HelperService } from 'src/app/services/helper.service';
import { DeNghiCapVonBoNganhService } from 'src/app/services/ke-hoach/von-phi/deNghiCapVanBoNganh.service';
import { UserService } from 'src/app/services/user.service';
import { thongTinTrangThaiNhap } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import {STATUS} from "../../../../../constants/status";

@Component({
  selector: 'app-thong-tin-de-nghi-cap-von-bo-nganh',
  templateUrl: './thong-tin-de-nghi-cap-von-bo-nganh.component.html',
  styleUrls: ['./thong-tin-de-nghi-cap-von-bo-nganh.component.scss']
})
export class ThongTinDeNghiCapVonBoNganhComponent implements OnInit {
  @Input() loaiVthhInput: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() id: number;
  formData: FormGroup;
  cacheData: any[] = [];
  fileDinhKem: Array<FileDinhKem> = [];
  userLogin: UserLogin;
  STATUS = STATUS;
  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  titleStatus: string = '';
  titleButtonDuyet: string = '';
  iconButtonDuyet: string = '';
  styleStatus: string = 'du-thao-va-lanh-dao-duyet';
  tabSelected: string = 'thongTinChung';
  listNam: any[] = [];
  listLoaiHangHoa: any[] = [];
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  listPhuongThucThanhToan: any[] = [
    {
      ma: '1',
      giaTri: 'Tiền mặt',
    },
    {
      ma: '2',
      giaTri: 'Chuyển khoản',
    },
  ];
  userInfo: UserLogin;
  listFileDinhKem: any[] = [];
  expandSet = new Set<number>();
  bangPhanBoList: Array<any> = [];
  khBanDauGia: any = {};
  diaDiemGiaoNhan: DiaDiemGiaoNhan = new DiaDiemGiaoNhan();
  diaDiemGiaoNhanList: Array<DiaDiemGiaoNhan> = [];
  phanLoTaiSanList: Array<PhanLoTaiSan> = [];
  listChungLoaiHangHoa: any[] = [];
  maKeHoach: string;
  listLoaiHopDong: any[] = [];
  dsBoNganh: any[] = [];
  maxYeuCauCapThem: number = 2;
  chiTietList: any[] = [];
  titleSoDeNghi: string = "/BQP-KH";

  rowItem: IDeNghiCapVon = {
    donViTinh: null,
    dvCungCapHang: null,
    kinhPhiDaCap: null,
    maVatTu: null,
    tenVatTu: null,
    maVatTuCha: null,
    tenVatTuCha: null,
    nganHang: null,
    soLuong: null,
    soTaiKhoan: null,
    tenHangHoa: null,
    donGia: null,
    thanhTien: null,
    ycCapThem: null,
    edit: false
  }

  showEdit: boolean = false;

  tongCong: any = {
    tongThanhTien: 0,
    tongKinhPhiDaCap: 0,
    tongYeuCauCapThem: 0,
  }

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
    private helperService: HelperService,
    private deNghiCapVonBoNganhService: DeNghiCapVonBoNganhService,
  ) {
  }

  async ngOnInit() {
    this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    this.khBanDauGia.trangThai = this.globals.prop.NHAP_DU_THAO;
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
    await Promise.all([
      this.initForm(),
      this.getListBoNganh(),
      this.loaiVTHHGetAll(),
    ]);
    await this.loadChiTiet(this.idInput);
    this.spinner.hide();
  }

  async loadChiTiet(id) {
    if (id > 0) {
      let res = await this.deNghiCapVonBoNganhService.loadChiTiet(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.khBanDauGia = res.data;
          this.initForm();
          if (this.khBanDauGia.fileDinhKems) {
            this.listFileDinhKem = this.khBanDauGia.fileDinhKems;
          }
          if (this.khBanDauGia.chiTietList) {
            this.chiTietList = this.khBanDauGia.chiTietList;
          }
        }
      }
    }
  }

  async getListBoNganh() {
    this.dsBoNganh = [];
    let res = await this.danhMucService.danhMucChungGetAll('BO_NGANH');
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsBoNganh = res.data;
    }
  }

  initForm() {
    this.formData = this.fb.group({
      nam: [this.khBanDauGia ? this.khBanDauGia.nam : null, [Validators.required],],
      boNganh: [this.khBanDauGia ? this.khBanDauGia.maBoNganh : null, [Validators.required],],
      soDeNghi: [this.khBanDauGia ? this.khBanDauGia.soDeNghi : null, [Validators.required],],
      ngayDeNghi: [this.khBanDauGia ? this.khBanDauGia.ngayDeNghi : new Date(), [Validators.required],],
      ghiChu: [this.khBanDauGia ? this.khBanDauGia.ghiChu : null],

    });
    this.setTitle();
  }

  async loadDonVi() {
    const res = await this.donviService.layDonViCon();
    this.listChiCuc = [];
    if (res.msg == MESSAGE.SUCCESS) {
      for (let i = 0; i < res.data.length; i++) {
        const item = {
          value: res.data[i].maDvi,
          text: res.data[i].tenDvi,
        };
        this.listChiCuc.push(item);
      }
    }
  }

  back() {
    this.showListEvent.emit();
  }

  async loaiVTHHGetAll() {
    try {
      await this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
        if (hangHoa.msg == MESSAGE.SUCCESS) {
          hangHoa.data.forEach((item) => {
            if (item.cap === "1" && item.ma != '01') {
              this.listLoaiHangHoa = [
                ...this.listLoaiHangHoa,
                item
              ];
            }
            else {
              this.listLoaiHangHoa = [
                ...this.listLoaiHangHoa,
                ...item.child
              ];
            }
          })
        }
      })
    } catch (error) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async changeLoaiHangHoa() {
    let loaiHangHoa = this.listLoaiHangHoa.filter(x => {
      return x.ma === this.rowItem.maVatTuCha;
    });
    if (loaiHangHoa && loaiHangHoa.length > 0) {
      if (!this.idInput) {
        this.formData.patchValue({ idChungLoaiHangHoa: null })
      }
      this.rowItem.tenVatTuCha = loaiHangHoa[0].ten;
      this.listChungLoaiHangHoa = loaiHangHoa[0].child;
    }

  }

  changeChungLoaiHangHoa() {
    let chungLoaiHangHoa = this.listChungLoaiHangHoa.filter(x => {
      return x.ma === this.rowItem.maVatTu;
    });

    if (chungLoaiHangHoa && chungLoaiHangHoa.length > 0) {
      this.rowItem.tenVatTu = chungLoaiHangHoa[0].ten;
      this.rowItem.donViTinh = chungLoaiHangHoa[0].maDviTinh;
    }

  }

  changeThanhTien() {
    if (this.rowItem.soLuong && this.rowItem.donGia) {
      let thanhTien = this.rowItem.soLuong * this.rowItem.donGia;
      this.maxYeuCauCapThem = thanhTien;
      this.rowItem.thanhTien = thanhTien;
    }
    if (this.rowItem.kinhPhiDaCap && this.rowItem.thanhTien) {
      let yeuCauCapThem = this.rowItem.thanhTien - this.rowItem.kinhPhiDaCap;
      this.rowItem.ycCapThem = yeuCauCapThem;
    }
  }


  themDonViCungCap() {
    let isValid = true;
    for (let key in this.rowItem) {
      if (this.rowItem[key] === null) {
        isValid = false;
      }
    }
    if (isValid) {
      this.chiTietList.push(this.rowItem);
      this.tinhTong();
      this.clearDonviCungCap();
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.NULL_ERROR);
    }

  }

  clearDonviCungCap() {
    this.rowItem = {
      donViTinh: null,
      dvCungCapHang: null,
      kinhPhiDaCap: null,
      maVatTu: null,
      tenVatTu: null,
      maVatTuCha: null,
      tenVatTuCha: null,
      nganHang: null,
      soLuong: null,
      soTaiKhoan: null,
      tenHangHoa: null,
      donGia: null,
      thanhTien: null,
      ycCapThem: null,
      edit: false
    }
  }

  showEditItem(idx: number, type: string) {
    if (this.chiTietList.length > 0) {
      this.chiTietList.forEach((item, index) => {
        if (index === idx) {
          if (type === 'show') {
            item.edit = true;
          } else {
            item.edit = false;
          }
        }
      })
    }
  }

  xoaItem(idx: number) {
    if (this.chiTietList.length > 0) {
      this.chiTietList.splice(idx, 1);
    }
  }

  tinhTong() {
    this.tongCong = {
      tongThanhTien: 0,
      tongKinhPhiDaCap: 0,
      tongYeuCauCapThem: 0,
    }

    this.chiTietList.forEach((item) => {
      this.tongCong.tongThanhTien += item.thanhTien;
      this.tongCong.tongKinhPhiDaCap += item.kinhPhiDaCap;
      this.tongCong.tongYeuCauCapThem += item.ycCapThem;
    })

  }

  quayLai() {
    this.showListEvent.emit();
  }

  async save(isHoanThanh?: boolean) {
    // this.helperService.markFormGroupTouched(this.formData);
    // if (this.formData.invalid) {
    //   this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đủ thông tin');
    //   return;
    // }
    this.spinner.show();
    try {
      let body = {
        "chiTietList": this.chiTietList,
        "fileDinhKemReqs": this.listFileDinhKem,
        "ghiChu": this.formData.value.ghiChu,
        "maBoNganh": this.formData.value.boNganh,
        "nam": this.formData.value.nam,
        "ngayDeNghi": dayjs(this.formData.value.ngayDeNghi).format("YYYY-MM-DD"),
        "soDeNghi": this.formData.value.soDeNghi,
        "id": this.idInput,
      }
      if (this.idInput > 0) {
        let res = await this.deNghiCapVonBoNganhService.sua(body);
        if (res.msg == MESSAGE.SUCCESS) {
          if (isHoanThanh) {
           this.guiDuyet(this.idInput);
          }else{
            this.quayLai();
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      } else {
        let res = await this.deNghiCapVonBoNganhService.them(body);
        if (res.msg == MESSAGE.SUCCESS) {
          this.idInput =res.data.id;
          if (isHoanThanh) {
            this.guiDuyet(this.idInput);
          }else{
            this.quayLai();
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(
        MESSAGE.ERROR,
        e?.error?.message ?? MESSAGE.SYSTEM_ERROR,
      );
    }
  }


  async guiDuyet(id?) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn hoàn thành cập nhật?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: id ? id :this.idInput,
            trangThaiId: STATUS.HOAN_THANH_CAP_NHAT,
          };
          let res = await this.deNghiCapVonBoNganhService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(
              MESSAGE.SUCCESS,
              MESSAGE.GUI_DUYET_SUCCESS,
            );
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  tuChoi() {
    const modalTuChoi = this.modal.create({
      nzTitle: 'Từ chối',
      nzContent: DialogTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
        this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            lyDo: text,
            trangThaiId: this.globals.prop.NHAP_TU_CHOI_TP,
          };
          switch (this.khBanDauGia.trangThai) {
            case this.globals.prop.NHAP_CHO_DUYET_TP:
              body.trangThaiId = this.globals.prop.NHAP_TU_CHOI_TP;
              break;
            case this.globals.prop.NHAP_CHO_DUYET_LD_CUC:
              body.trangThaiId = this.globals.prop.NHAP_TU_CHOI_LD_CUC;
              break;
          }

          const res = await this.deXuatKeHoachBanDauGiaService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }

  setTitle() {
    let trangThai = this.khBanDauGia.trangThai;
    switch (trangThai) {
      case STATUS.DU_THAO: {
        this.titleStatus = 'Dự thảo';
        break;
      }
      case STATUS.TU_CHOI_TP: {
        this.iconButtonDuyet = 'htvbdh_tcdt_guiduyet';
        this.titleButtonDuyet = 'Lưu và gửi duyệt';
        this.titleStatus = 'Từ chối - TP';
        break;
      }
      case STATUS.CHO_DUYET_TP: {
        this.iconButtonDuyet = 'htvbdh_tcdt_pheduyet';
        this.titleButtonDuyet = 'Duyệt';
        this.titleStatus = 'Chờ duyệt - TP';
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        this.iconButtonDuyet = 'htvbdh_tcdt_baocao2';
        this.titleButtonDuyet = 'Duyệt';
        this.titleStatus = 'Chờ duyệt - LĐ Cục';
        break;
      }
      case STATUS.TU_CHOI_LDC: {
        this.iconButtonDuyet = 'htvbdh_tcdt_guiduyet';
        this.titleButtonDuyet = 'Lưu và gửi duyệt';
        this.titleStatus = 'Từ chối - LĐ Cục';
        break;
      }
      case STATUS.BAN_HANH: {
        this.titleStatus = 'Ban hành';
        this.styleStatus = 'da-ban-hanh';
        break;
      }
      case STATUS.HOAN_THANH_CAP_NHAT: {
        this.titleStatus = 'Hoàn thành';
        this.styleStatus = 'da-ban-hanh';
        break;
      }
    }
  }

  thongTinTrangThai(trangThai: string): string {
    return thongTinTrangThaiNhap(trangThai);
  }
}

interface IDeNghiCapVon {
  donViTinh: string,
  dvCungCapHang: string,
  kinhPhiDaCap: number,
  maVatTu: string,
  tenVatTu: string,
  maVatTuCha: string,
  tenVatTuCha: string,
  nganHang: string,
  soLuong: number,
  soTaiKhoan: number,
  tenHangHoa: string,
  donGia: number,
  thanhTien: number,
  ycCapThem: number,
  edit: boolean
}
