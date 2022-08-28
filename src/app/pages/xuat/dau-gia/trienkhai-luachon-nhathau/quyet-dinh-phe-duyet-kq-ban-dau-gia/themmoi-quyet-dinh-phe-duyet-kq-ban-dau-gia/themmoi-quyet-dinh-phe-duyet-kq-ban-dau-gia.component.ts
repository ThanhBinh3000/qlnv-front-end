import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { ChiTietDiaDiemNhapKho, DiaDiemNhapKho } from 'src/app/components/dialog/dialog-them-dia-diem-nhap-kho/dialog-them-dia-diem-nhap-kho.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { UserLogin } from 'src/app/models/userlogin';
import { ChiTieuKeHoachNamCapTongCucService } from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import { QuanLyPhieuKiemTraChatLuongHangService } from 'src/app/services/quanLyPhieuKiemTraChatLuongHang.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/quyetDinhGiaoNhapHang.service';
import { QuyetDinhPheDuyetKHBDGService } from 'src/app/services/quyetDinhPheDuyetKHBDG.service';
import { QuyetDinhPheDuyetKQBanDauGiaService } from 'src/app/services/quyetDinhPheDuyetKQBanDauGia.service';
import { ThongBaoDauGiaTaiSanService } from 'src/app/services/thongBaoDauGiaTaiSan.service';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { UserService } from 'src/app/services/user.service';
import { convertTienTobangChu, thongTinTrangThaiNhap } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-themmoi-quyet-dinh-phe-duyet-kq-ban-dau-gia',
  templateUrl: './themmoi-quyet-dinh-phe-duyet-kq-ban-dau-gia.component.html',
  styleUrls: ['./themmoi-quyet-dinh-phe-duyet-kq-ban-dau-gia.component.scss']
})
export class ThemmoiQuyetDinhPheDuyetKQBanDauGiaComponent implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() typeVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();

  userInfo: UserLogin;
  detail: any = {};
  idBienBanBDG: number = 0;
  detailGiaoNhap: any = {};
  yearNow: number = 0;

  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];
  listPhieuKiemTraChatLuong: any[] = [];
  listDanhMucHang: any[] = [];
  listSoQuyetDinh: any[] = [];
  listVatTuHangHoa: any[] = [];
  listBienBanBDG: any[] = [];
  listThongBaoBDG: any[] = [];
  listNam: any[] = [];
  bangPhanBoList: Array<any> = [];
  cts: Array<any> = [];

  listFileDinhKem: any[] = [];
  maQd: string;

  create: any = {};
  editDataCache: { [key: string]: { edit: boolean; data: any } } = {};
  expandSet = new Set<number>();

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }
  listOfData = [];
  errorInputRequired: string = MESSAGE.ERROR_NOT_EMPTY;

  formData: FormGroup;

  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private danhMucService: DanhMucService,
    private notification: NzNotificationService,
    private router: Router,
    private routerActive: ActivatedRoute,
    private modal: NzModalService,
    private userService: UserService,
    public globals: Globals,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
    private uploadFileService: UploadFileService,
    private chiTieuKeHoachNamService: ChiTieuKeHoachNamCapTongCucService,
    private quyetDinhPheDuyetKQBanDauGiaService: QuyetDinhPheDuyetKQBanDauGiaService,
    private thongBanDauGiaTaiSanService: ThongBaoDauGiaTaiSanService,
    public qdPheDuyetKhBanDauGia: QuyetDinhPheDuyetKHBDGService,
    private fb: FormBuilder,
  ) {
    this.formData = this.fb.group({
      id: [null, []],
      nam: [null, []],
      soQuyetDinh: [null, []],
      trichYeu: [null, [Validators.required]],
      ngayHieuLuc: [null, []],
      ngayKy: [null, []],
      thongBaoBdgId: [null, [Validators.required]],
      idBienBanBDG: [null, []],
      ghiChu: [null, []],
    });
  }

  initForm() {
    this.formData.patchValue({
      id: this.detail ? this.detail.id : null,
      nam: this.detail ? this.detail.nam : null,
      soQuyetDinh: this.detail ? this.detail.soQuyetDinh : null,
      trichYeu: this.detail ? this.detail.trichYeu : null,
      ngayHieuLuc: this.detail ? this.detail.ngayHieuLuc : null,
      ngayKy: this.detail ? this.detail.ngayKy : null,
      thongBaoBdgId: this.detail ? this.detail.thongBaoBdgId : null,
      idBienBanBDG: this.detail ? this.detail.idBienBanBDG : null,
      ghiChu: this.detail ? this.detail.ghiChu : null,
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.create.dvt = "Tấn";
      this.detail.trangThai = this.globals.prop.NHAP_DU_THAO;
      this.detail.tenTrangThai = "Dự thảo";
      this.userInfo = this.userService.getUserLogin();
      this.detail.maDvi = this.userInfo.MA_DVI;
      this.yearNow = dayjs().get('year');
      this.detail.nam = this.yearNow;
      this.maQd = this.userInfo.MA_QD;
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      }
      await Promise.all([
        this.loaiHangDTQGGetAll(),
        this.loadThongBaoBanDauGia(),
      ]);
      await this.loadChiTiet(this.id);
      this.initForm();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  getPhanLoTaiSan(phanLoTaiSans: any) {
    this.bangPhanBoList = [];
    this.cts = [];
    if (phanLoTaiSans && phanLoTaiSans.length > 0) {
      for (let i = 0; i <= phanLoTaiSans.length - 1; i++) {
        let itemPush = {
          "donGiaTrungDauGia": 0,
          "id": phanLoTaiSans[i].id,
          "trungDauGia": null
        }
        this.cts.push(itemPush);
        for (let j = i + 1; j <= phanLoTaiSans.length; j++) {
          if (phanLoTaiSans.length == 1 || phanLoTaiSans[i].maChiCuc === phanLoTaiSans[j].maChiCuc) {
            const diaDiemNhapKho = new DiaDiemNhapKho();
            diaDiemNhapKho.maDvi = phanLoTaiSans[i].maChiCuc;
            diaDiemNhapKho.tenDonVi = phanLoTaiSans[i].tenChiCuc;
            diaDiemNhapKho.slDaLenKHBan = phanLoTaiSans[i].slDaLenKHBan;
            diaDiemNhapKho.soLuong = phanLoTaiSans[i].soLuong;
            const chiTietDiaDiem = new ChiTietDiaDiemNhapKho();
            chiTietDiaDiem.tonKho = phanLoTaiSans[i].tonKho;
            chiTietDiaDiem.giaKhoiDiem = phanLoTaiSans[i].giaKhoiDiem;
            chiTietDiaDiem.soTienDatTruoc = phanLoTaiSans[i].soTienDatTruoc;
            chiTietDiaDiem.maDiemKho = phanLoTaiSans[i].maDiemKho;
            chiTietDiaDiem.tenDiemKho = phanLoTaiSans[i].tenDiemKho;
            chiTietDiaDiem.maNhaKho = phanLoTaiSans[i].maNhaKho;
            chiTietDiaDiem.tenNhaKho = phanLoTaiSans[i].tenNhaKho;
            chiTietDiaDiem.maNganKho = phanLoTaiSans[i].maNganKho;
            chiTietDiaDiem.tenNganKho = phanLoTaiSans[i].tenNganKho;
            chiTietDiaDiem.maNganLo = phanLoTaiSans[i].maLoKho;
            chiTietDiaDiem.tenLoKho = phanLoTaiSans[i].tenLoKho;
            chiTietDiaDiem.chungLoaiHh = phanLoTaiSans[i].chungLoaiHh;
            chiTietDiaDiem.donViTinh = phanLoTaiSans[i].donViTinh;
            chiTietDiaDiem.tenChungLoaiHh = phanLoTaiSans[i].chungLoaiHh;
            chiTietDiaDiem.maDonViTaiSan = phanLoTaiSans[i].maDvTaiSan;
            chiTietDiaDiem.soLuong = phanLoTaiSans[i].soLuong;
            chiTietDiaDiem.donGiaChuaVAT = phanLoTaiSans[i].donGia;
            chiTietDiaDiem.idVirtual = phanLoTaiSans[i].id;
            diaDiemNhapKho.chiTietDiaDiems.push(chiTietDiaDiem);
            this.bangPhanBoList.push(diaDiemNhapKho);
          }
        }
      }
    }
  }

  isDisableField() {
    if (this.detail && (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP || this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC
      || this.detail.trangThai == this.globals.prop.NHAP_DA_DUYET || this.detail.trangThai == this.globals.prop.NHAP_BAN_HANH)) {
      return true;
    }
  }

  async loaiHangDTQGGetAll() {
    this.listVatTuHangHoa = [];
    let res = await this.danhMucService.danhMucChungGetAll('LOAI_HHOA');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listVatTuHangHoa = res.data;
    }
  }

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.detail.ngayKy) {
      return false;
    }
    return startValue.getTime() > this.detail.ngayKy.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.detail.ngayHieuLuc) {
      return false;
    }
    return endValue.getTime() <= this.detail.ngayHieuLuc.getTime();
  };

  async loadThongBaoBanDauGia() {
    let body = {
      "maVatTuCha": this.typeVthh,
      "maDvis": this.detail.maDvi,
      "paggingReq": {
        "limit": 1000,
        "orderBy": null,
        "orderType": null,
        "page": 0
      },
      "trangThai": null
    };
    let res = await this.thongBanDauGiaTaiSanService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listThongBaoBDG = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async onChangeThongBaoBanDauGia(id) {
    if (id) {
      let res = await this.thongBanDauGiaTaiSanService.loadChiTiet(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          let resQuyetDinh = await this.qdPheDuyetKhBanDauGia.chiTiet(res.data.qdPheDuyetKhBdgId);
          if (resQuyetDinh.msg == MESSAGE.SUCCESS) {
            this.typeVthh = resQuyetDinh.data.maVatTuCha;
            let phanLoTaiSans = resQuyetDinh.data.thongTinTaiSanCucs;
            this.getPhanLoTaiSan(phanLoTaiSans);
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        }
      }
    }
  }

  onChangeBienBan(id) {

  }

  async loadChiTiet(id) {
    if (id > 0) {
      let res = await this.quyetDinhPheDuyetKQBanDauGiaService.chiTiet(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.detail = res.data;
        }
      }
    }
  }

  guiDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn gửi duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          await this.save(true);
          let body = {
            id: this.id,
            lyDoTuChoi: null,
            trangThai: this.globals.prop.NHAP_CHO_DUYET_TP,
          };
          if (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP) {
            body.trangThai = this.globals.prop.NHAP_CHO_DUYET_LD_CUC;
          }
          let res =
            await this.quyetDinhPheDuyetKQBanDauGiaService.updateStatus(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
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

  pheDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn phê duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            lyDoTuChoi: null,
            trangThai: this.globals.prop.NHAP_CHO_DUYET_LD_CUC,
          };
          if (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CUC) {
            body.trangThai = this.globals.prop.NHAP_BAN_HANH;
          }
          let res =
            await this.quyetDinhPheDuyetKQBanDauGiaService.updateStatus(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
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
            id: this.id,
            lyDoTuChoi: text,
            trangThai: this.globals.prop.NHAP_TU_CHOI_TP,
          };
          if (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CUC) {
            body.trangThai = this.globals.prop.NHAP_TU_CHOI_LD_CUC;
          }
          let res =
            await this.quyetDinhPheDuyetKQBanDauGiaService.updateStatus(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
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

  huyBo() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn hủy bỏ các thao tác đang làm?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.back();
      },
    });
  }

  back() {
    this.showListEvent.emit();
  }

  async save(isOther: boolean) {
    this.spinner.show();
    try {
      let body = this.formData.value;
      body = {
        ...body,
        // "bienBanBdgId": 0,
        "cts": this.cts,
        "fileDinhKemReqs": this.listFileDinhKem,
        "id": this.id,
        "loaiVthh": this.typeVthh,
        "maVatTuCha": this.typeVthh,
      };
      if (this.id > 0) {
        let res = await this.quyetDinhPheDuyetKQBanDauGiaService.sua(
          body,
        );
        if (res.msg == MESSAGE.SUCCESS) {
          if (!isOther) {
            this.notification.success(
              MESSAGE.SUCCESS,
              MESSAGE.UPDATE_SUCCESS,
            );
            this.back();
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      } else {
        let res = await this.quyetDinhPheDuyetKQBanDauGiaService.them(
          body,
        );
        if (res.msg == MESSAGE.SUCCESS) {
          if (!isOther) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.back();
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  print() {

  }

  thongTinTrangThai(trangThai: string): string {
    return thongTinTrangThaiNhap(trangThai, this.globals.prop.NHAP_BAN_HANH);
  }
}
