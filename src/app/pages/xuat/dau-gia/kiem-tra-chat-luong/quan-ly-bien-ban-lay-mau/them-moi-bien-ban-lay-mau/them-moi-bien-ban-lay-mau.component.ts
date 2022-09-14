import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { DanhSachDauThauService } from 'src/app/services/danhSachDauThau.service';
import { DonviService } from 'src/app/services/donvi.service';
import { Globals } from 'src/app/shared/globals';
import { UserLogin } from 'src/app/models/userlogin';
import dayjs from 'dayjs';
import { QuanLyBienBanLayMauService } from 'src/app/services/quanLyBienBanLayMau.service';
import { ThongTinHopDongService } from 'src/app/services/thongTinHopDong.service';
import { QuyetDinhGiaoNhiemVuXuatHangService } from 'src/app/services/quyetDinhGiaoNhiemVuXuatHang.service';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { PhuongPhapLayMau } from 'src/app/models/PhuongPhapLayMau';
import { BienBanLayMau } from 'src/app/models/BienBanLayMau';
import { UserService } from 'src/app/services/user.service';
import { MESSAGE } from 'src/app/constants/message';
import { QuanLyPhieuNhapDayKhoService } from 'src/app/services/quanLyPhieuNhapDayKho.service';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DANH_MUC_LEVEL } from 'src/app/pages/luu-kho/luu-kho.constant';
import { isEmpty } from 'lodash';
import { QuanLyBienBanLayMauXuatService } from 'src/app/services/qlnv-hang/xuat-hang/kiem-tra-chat-luong/quanLyBienBanLayMauXuat';
import { X } from '@angular/cdk/keycodes';

@Component({
  selector: 'them-moi-bien-ban-lay-mau',
  templateUrl: './them-moi-bien-ban-lay-mau.component.html',
  styleUrls: ['./them-moi-bien-ban-lay-mau.component.scss'],
})
export class ThemMoiBienBanLayMauKhoComponent implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() isTatCa: boolean;
  @Input() typeVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();

  formData: FormGroup;

  detail: any = {};
  userInfo: UserLogin;

  donVi: any;

  maVthh: string;
  phuongPhapLayMaus: Array<PhuongPhapLayMau>;

  listSoQuyetDinh: any[] = [];
  listSoHopDong: any[] = [];
  listFileDinhKem: any[] = [];
  listTong: any;
  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];
  listLoKho: any[] = [];
  listLoaiHangHoa: any[] = [];
  listChungLoaiHangHoa: any[] = [];

  capCuc: string = '01';
  capChiCuc: string = '02';
  listDaiDienCuc: any[] = [];
  listDaiDienChiCuc: any[] = [];
  listDaiDien: any[] = [
    {
      bbLayMauId: '',
      daiDien: '',
      id: '',
      idTemp: 1,
      loaiDaiDien: '01',
    },
    {
      bbLayMauId: '',
      daiDien: '',
      id: '',
      idTemp: 1,
      loaiDaiDien: '02',
    },
  ];

  constructor(
    private spinner: NgxSpinnerService,
    private bienBanLayMauService: QuanLyBienBanLayMauService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    public globals: Globals,
    public userService: UserService,
    private thongTinHopDongService: ThongTinHopDongService,
    private quyetDinhGiaoNhiemVuXuatHangService: QuyetDinhGiaoNhiemVuXuatHangService,
    private danhMucService: DanhMucService,
    private quanLyPhieuNhapDayKhoService: QuanLyPhieuNhapDayKhoService,
    private donViService: DonviService,
    private fb: FormBuilder,
    private quanLyBienBanLayMauXuatService: QuanLyBienBanLayMauXuatService,
  ) { }

  async ngOnInit() {
    this.initForm();
    await Promise.all([
      this.initData(),
      this.loadPhuongPhapLayMau(),
      this.loadSoQuyetDinh(),
      this.loaiVTHHGetAll(),
    ]);
    if (this.id > 0) {
      await this.loadChitiet();
    } else {
      this.loadDaiDien();
    }
  }

  isDisableField() {
    if (this.detail && (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.detail.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
      return true;
    }
  }

  initForm(): void {
    this.formData = this.fb.group({
      tenDonVi: [null],
      soBienBan: [null],
      maQHNS: [null],
      soQDXuat: [null],
      soHopDong: [null],
      ngayKyHD: [null],
      ngayLayMau: [null, [Validators.required]],
      donViKN: [null],
      diaDiemLayMau: [null],
      loaiHang: [null, [Validators.required]],
      chungLoaiHang: [null, [Validators.required]],
      maDiemKho: [null, [Validators.required]],
      maNhaKho: [null, [Validators.required]],
      maNganKho: [null, [Validators.required]],
      maLoKho: [null, [Validators.required]],
      sLMauHangKiemTra: [null, [Validators.required]],
      ppLayMau: [null, [Validators.required]],
      chiTieuKT: [null, [Validators.required]],
      kQNiemPhongMau: [null, [Validators.required]],
    });
  }
  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.detail.maDvi = this.userInfo.MA_DVI;
    this.detail.tenDvi = this.userInfo.TEN_DVI;
    this.detail.capDvi = this.userInfo.CAP_DVI;
    await this.loadDonVi();
  }
  async loadDonVi() {
    const body = {
      maDviCha: this.detail.maDvi,
      trangThai: '01',
    };
    const dsTong = await this.donViService.layDonViTheoCapDo(body);
    if (!isEmpty(dsTong)) {
      this.listTong = dsTong;
      this.donVi = dsTong[DANH_MUC_LEVEL.CHI_CUC];
      if (!isEmpty(this.donVi)) {
        this.formData.patchValue({
          tenDonVi: this.donVi[0].tenDvi,
          maQHNS: this.donVi[0].maQhns
        })
        const chiCuc = this.donVi[0];
        if (chiCuc) {
          const result = {
            ...this.donViService.layDsPhanTuCon(this.listTong, chiCuc),
          };
          this.listDiemKho = result[DANH_MUC_LEVEL.DIEM_KHO];
        } else {
          this.listDiemKho = [];
        }
      }
    }
  }
  onChangeDiemKho(id) {
    const dsDiemKho = this.listDiemKho.find((item) => item.maDvi === id);
    this.formData.get('maNhaKho').setValue(null);
    this.formData.get('maNganKho').setValue(null);
    this.formData.get('maLoKho').setValue(null);
    if (dsDiemKho) {
      const result = {
        ...this.donViService.layDsPhanTuCon(this.listTong, dsDiemKho),
      };
      this.listNhaKho = result[DANH_MUC_LEVEL.NHA_KHO];
    } else {
      this.listNhaKho = [];
    }
  }
  onChangeNhaKho(id) {
    const nhaKho = this.listNhaKho.find((item) => item.maDvi === id);
    this.formData.get('maNganKho').setValue(null);
    this.formData.get('maLoKho').setValue(null);
    if (nhaKho) {
      const result = {
        ...this.donViService.layDsPhanTuCon(this.listTong, nhaKho),
      };
      this.listNganKho = result[DANH_MUC_LEVEL.NGAN_KHO];
    } else {
      this.listNganKho = [];
    }
  }
  onChangeNganKho(id) {
    const nganKho = this.listNganKho.find((item) => item.maDvi === id);
    this.formData.get('maLoKho').setValue(null);
    if (nganKho) {
      const result = {
        ...this.donViService.layDsPhanTuCon(this.listTong, nganKho),
      };
      this.listLoKho = result[DANH_MUC_LEVEL.NGAN_LO];
    } else {
      this.listLoKho = [];
    }
  }
  async loaiVTHHGetAll() {
    try {
      await this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
        if (hangHoa.msg == MESSAGE.SUCCESS) {
          hangHoa.data.forEach((item) => {
            if (item.cap === '1' && item.ma != '01') {
              this.listLoaiHangHoa = [...this.listLoaiHangHoa, item];
            } else {
              this.listLoaiHangHoa = [...this.listLoaiHangHoa, ...item.child];
            }
          });
        }
      });
    } catch (error) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }
  async changeLoaiHangHoa(id: any) {
    if (id && id > 0) {
      let loaiHangHoa = this.listLoaiHangHoa.filter((item) => item.ma === id);
      this.listChungLoaiHangHoa = loaiHangHoa[0].child;
    }
  }
  loadDaiDien() {
    if (this.listDaiDien && this.listDaiDien.length > 0) {
      this.listDaiDienCuc = this.listDaiDien.filter(
        (x) => x.loaiDaiDien == this.capCuc,
      );
      this.listDaiDienChiCuc = this.listDaiDien.filter(
        (x) => x.loaiDaiDien == this.capChiCuc,
      );
    }
  }
  addDaiDien(type) {
    if (!this.listDaiDien) {
      this.listDaiDien = [];
    }
    if (type) {
      let item = {
        bbLayMauId: null,
        daiDien: null,
        id: null,
        idTemp: new Date().getTime(),
        loaiDaiDien: type,
      };
      this.listDaiDien = [item, ...this.listDaiDien];
      this.loadDaiDien();
    }
  }
  xoaDaiDien(num) {
    this.listDaiDien = this.listDaiDien.filter((x) => x.idTemp != num);
    this.loadDaiDien();
  }
  async loadSoQuyetDinh() {
    let body = {};
    let res = await this.quyetDinhGiaoNhiemVuXuatHangService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }
  async changeSoQuyetDinh() {
    if (this.listSoQuyetDinh.length > 0 && this.formData.value.soQDXuat) {
      // trong data , list hợp đồng đang rỗng , chưa biết xử lý => để tạm
      this.listSoHopDong = this.listSoQuyetDinh

    }
  }
  isAction() {
    if (this.detail.trangThai === this.globals.prop.DU_THAO || !this.isView) {
      return true;
    }
  }
  save(isGuiDuyet?: boolean) {
    this.spinner.show();
    // console.log(this.listFileDinhKem)
    // this.listDaiDien = this.listDaiDien.filter((item) => item.idTemp != 1);
    // cần số hợp đồng
    let body = {
      id: this.id,
      maDvi: this.detail.maDvi,
      qdgnvxId: this.formData.value.soQDXuat,
      ngayLayMau: this.formData.value.ngayLayMau,
      donViKiemNghiem: this.formData.value.donViKN,
      diaDiemLayMau: this.formData.value.diaDiemLayMau,
      loaiVthh: this.typeVthh,
      maVatTu: this.formData.value.chungLoaiHang,
      maVatTuCha: this.formData.value.loaiHang,
      maDiemKho: this.formData.value.maDiemKho,
      maNganKho: this.formData.value.maNganKho,
      maNhaKho: this.formData.value.maNhaKho,
      maNganLo: this.formData.value.maLoKho,
      fileDinhKems: [...this.listFileDinhKem],
      chiTietList: [...this.listDaiDien],
      soLuongMau: 0,
      ppLayMau: this.formData.value.ppLayMau,
      chiTieuKiemTra: this.formData.value.chiTieuKT,
      ketQuaNiemPhong: this.formData.value.kQNiemPhongMau,
      nam: 2022,
      ngayGuiDuyet: null,
      ngayPduyet: null,
      nguoiGuiDuyetId: null,
      nguoiPduyetId: null,
      so: 0,
      lyDoTuChoi: null,
    };

    if (this.id > 0) {
      this.quanLyBienBanLayMauXuatService
        .edit(body)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (isGuiDuyet) {
              let body = {
                id: res.data.id,
                lyDo: null,
                trangThai: this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC,
              };
              this.quanLyBienBanLayMauXuatService.updateStatus(body);
              if (res.msg == MESSAGE.SUCCESS) {
                this.notification.success(
                  MESSAGE.SUCCESS,
                  MESSAGE.UPDATE_SUCCESS,
                );
                this.redirectBienBanLayMau();
              } else {
                this.notification.error(MESSAGE.ERROR, res.msg);
              }
            } else {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.UPDATE_SUCCESS,
              );
              this.redirectBienBanLayMau();
            }
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        })
        .catch((e) => {
          console.error('error: ', e);
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
        .finally(() => {
          this.spinner.hide();
        });
    } else {
      this.quanLyBienBanLayMauXuatService
        .addNew(body)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (isGuiDuyet) {
              let body = {
                id: res.data.id,
                lyDo: null,
                trangThai: this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC,
              };
              this.quanLyBienBanLayMauXuatService.updateStatus(body);
              if (res.msg == MESSAGE.SUCCESS) {
                this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                this.redirectBienBanLayMau();
              } else {
                this.notification.error(MESSAGE.ERROR, res.msg);
              }
            } else {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
              this.redirectBienBanLayMau();
            }
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        })
        .catch((e) => {
          console.error('error: ', e);
          this.notification.error(
            MESSAGE.ERROR,
            e.error.errors[0].defaultMessage,
          );
        })
        .finally(() => {
          this.spinner.hide();
        });
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
          let body = {
            id: this.id,
            trangThai: this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC,
          };
          const res = await this.quanLyBienBanLayMauXuatService.updateStatus(
            body,
          );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
            this.redirectBienBanLayMau();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.save(true);
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
      nzContent: 'Bạn có chắc chắn muốn duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            trangThai: this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC,
          };
          const res = await this.quanLyBienBanLayMauXuatService.updateStatus(
            body,
          );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
            this.redirectBienBanLayMau();
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
            lyDo: text,
            trangThai: this.globals.prop.NHAP_TU_CHOI_LD_CHI_CUC,
          };
          const res = await this.quanLyBienBanLayMauXuatService.updateStatus(
            body,
          );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.redirectBienBanLayMau();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
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
        this.redirectBienBanLayMau();
      },
    });
  }

  redirectBienBanLayMau() {
    this.showListEvent.emit();
  }

  async loadChitiet() {
    let res = await this.quanLyBienBanLayMauXuatService.searchDetail(this.id);
    // cần số hợp đồng
    if (res.msg == MESSAGE.SUCCESS) {
      this.detail = res.data;
      this.listDaiDien = res.data.chiTietList;
      this.listFileDinhKem = res.data.fileDinhKems;
      this.formData.patchValue({
        soQDXuat: res.data.qdgnvxId,
        soHopDong: res.data.qdgnvxId,
        soBienBan: res.data.soBienBan,
        donViKN: res.data.donViKiemNghiem,
        loaiHang: res.data.maVatTuCha,
        chungLoaiHang: res.data.maVatTu,
        maDiemKho: res.data.maDiemKho,
        maNhaKho: res.data.maNhaKho,
        maNganKho: res.data.maNganKho,
        maLoKho: res.data.maNganLo,
        ngayLayMau: res.data.ngayLayMau,
        diaDiemLayMau: res.data.diaDiemLayMau,
        sLMauHangKiemTra: res.data.soLuongMau,
        ppLayMau: Number(res.data.ppLayMau),
        chiTieuKT: res.data.chiTieuKiemTra,
        kQNiemPhongMau: res.data.ketQuaNiemPhong,
      });
      this.loadDaiDien();
    }
  }
  loadPhuongPhapLayMau() {
    this.danhMucService
      .danhMucChungGetAll('PP_LAY_MAU')
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.phuongPhapLayMaus = res.data;
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      })
      .catch((err) => {
        this.notification.error(MESSAGE.ERROR, err.msg);
      });
  }

  thongTinTrangThai(trangThai: string): string {
    if (
      trangThai === this.globals.prop.DU_THAO ||
      trangThai === this.globals.prop.LANH_DAO_DUYET ||
      trangThai === this.globals.prop.TU_CHOI ||
      trangThai === this.globals.prop.DU_THAO_TRINH_DUYET ||
      trangThai === this.globals.prop.NHAP_CHO_DUYET_KTV_BAO_QUAN ||
      trangThai === this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC ||
      trangThai === this.globals.prop.NHAP_TU_CHOI_LD_CHI_CUC ||
      !trangThai
    ) {
      return 'du-thao-va-lanh-dao-duyet';
    } else if (
      trangThai === this.globals.prop.BAN_HANH ||
      trangThai === this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC
    ) {
      return 'da-ban-hanh';
    }
  }
}
