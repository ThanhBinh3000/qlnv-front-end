import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import { QuyetDinhGiaoNhiemVuXuatHangService } from 'src/app/services/quyetDinhGiaoNhiemVuXuatHang.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuanLyBienBanTinhKhoService } from "src/app/services/quanLyBienBanTinhKho.service";
import { DANH_MUC_LEVEL } from 'src/app/pages/luu-kho/luu-kho.constant';
import { isEmpty } from 'lodash';

@Component({
  selector: 'app-them-moi-bien-ban-tinh-kho',
  templateUrl: './them-moi-bien-ban-tinh-kho.component.html',
  styleUrls: ['./them-moi-bien-ban-tinh-kho.component.scss']
})
export class ThemMoiBienBanTinhKhoComponent implements OnInit {

  @Input() id: number;
  @Input() isView: boolean;
  @Input() typeVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();

  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;
  formData: FormGroup;
  userInfo: UserLogin;
  detail: any = {};
  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];
  listLoaiKho: any[] = [];
  listPTBaoQuan: any[] = [];
  listDonViTinh: any[] = [];
  listSoQuyetDinh: any[] = [];
  listLoaiHangHoa: any[] = [];
  listChungLoaiHangHoa: any[] = [];
  listDaiDien: DaiDienChiCuc[] = [];
  tenDonViChiCuc: string;
  dsTong: any;
  donVi: any;


  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private danhMucService: DanhMucService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private userService: UserService,
    private quyetDinhGiaoNhiemVuXuatHangService: QuyetDinhGiaoNhiemVuXuatHangService,
    private quanLyBienBanTinhKhoService: QuanLyBienBanTinhKhoService,
    public globals: Globals,
    private fb: FormBuilder,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      this.detail.trangThai = "00";
      this.detail.maDonVi = this.userInfo.MA_DVI;
      this.detail.tenDonvi = this.userInfo.TEN_DVI;
      this.convertTrangThai(this.detail.trangThai);
      this.initForm();
      await Promise.all([
        this.loadDiemKho(),
        this.loadSoQuyetDinh(),
        this.loaiVTHHGetAll()
      ]);
      await this.loadChiTiet(this.id);
      await this.loadDonVi();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadDonVi() {
    const body = {
      maDviCha: this.detail.maDonVi,
      trangThai: '01',
    };
    const dsTong = await this.donViService.layDonViTheoCapDo(body);

    if (!isEmpty(dsTong)) {
      this.dsTong = dsTong;
      this.donVi = dsTong[DANH_MUC_LEVEL.CHI_CUC];
      if (!isEmpty(this.donVi)) {
        const donVi = this.donVi.filter(item => item.tenDvi === this.formData.value.donVi);
        if (donVi.length > 0) {
          this.detail.maDonViById = donVi[0].maDvi;
          this.formData.patchValue({ maQHNS: donVi[0].maQhns })
        }
        const chiCuc = donVi[0];
        if (chiCuc) {
          const result = {
            ...this.donViService.layDsPhanTuCon(this.dsTong, chiCuc),
          };
          this.listDiemKho = result[DANH_MUC_LEVEL.DIEM_KHO];
        } else {
          this.listDiemKho = [];
        }
      }
    }
  }

  initForm(): void {
    this.formData = this.fb.group({
      "soQDId": [null],
      "soQuyetDinh": [null, [Validators.required]],
      "maLoaiHangHoa": [null, [Validators.required]],
      "maChungLoaiHangHoa": [null, [Validators.required]],
      "donVi": [null],
      "maQHNS": [null],
      "maDiemKho": [null, [Validators.required]],
      "maNhaKho": [null, [Validators.required]],
      "maNganKho": [null, [Validators.required]],
      "maLoKho": [null, [Validators.required]],
      "soBienBanTinhKho": [null],
      "soLuongNhap": [null],
      "soLuongXuat": [null, [Validators.required]],
      "soLuongConlai": [null],
      "soLuongThucTeConLai": [null],
      "soLuongThuaThucTeConLai": [null],
      "soLuongThieuThucTeConLai": [null],
      "nguyenNhan": [null],
      "kienNghi": [null],
      "ngayLapPhieu": [new Date(), [Validators.required]],
      "daiDienChiCucDTNN": [null],
      "chucVu": [null],
    })
    this.formData.patchValue({ donVi: this.detail.tenDonvi })
  }


  async loadDiemKho() {
    let body = {
      maDviCha: this.detail.maDonVi,
      trangThai: '01',
    }
    const res = await this.donViService.getTreeAll(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.length > 0) {
        res.data.forEach(element => {
          if (element && element.capDvi == '3' && element.children) {
            this.listDiemKho = [
              ...this.listDiemKho,
              ...element.children
            ]
          }
        });
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  changeDiemKho(fromChiTiet: boolean) {
    let diemKho = this.listDiemKho.filter(x => x.maDvi == this.formData.value.maDiemKho);
    if (!fromChiTiet) {
      this.detail.maNhaKho = null;
    }
    if (diemKho && diemKho.length > 0) {
      this.listNhaKho = diemKho[0].children;
      if (fromChiTiet) {
        this.changeNhaKho(fromChiTiet);
      }
    }
  }

  changeNhaKho(fromChiTiet: boolean) {
    let nhaKho = this.listNhaKho.filter(x => x.maDvi == this.formData.value.maNhaKho);
    if (nhaKho && nhaKho.length > 0) {
      this.listNganKho = nhaKho[0].children;
      if (fromChiTiet) {
        this.changeNganKho();
      }
    }
  }

  changeNganKho() {
    let nganKho = this.listNganKho.filter(x => x.maDvi == this.formData.value.maNganKho);
    if (nganKho && nganKho.length > 0) {
      this.listNganLo = nganKho[0].children;
    }
  }

  async loadSoQuyetDinh() {
    let body = {}
    let res = await this.quyetDinhGiaoNhiemVuXuatHangService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS && res.data.content.length > 0) {
      this.listSoQuyetDinh = res.data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async changeSoQuyetDinh() {
    if (this.listSoQuyetDinh.length > 0 && this.formData.value.soQDId) {
      this.listSoQuyetDinh.forEach(item => {
        if (item.id == this.formData.value.soQDId) {
          this.formData.patchValue({ soQuyetDinh: item.soQuyetDinh });
        }
      });
    }
  }

  async loaiVTHHGetAll() {
    try {
      await this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
        if (hangHoa.msg == MESSAGE.SUCCESS) {
          hangHoa.data.forEach((item) => {
            if (this.typeVthh && this.typeVthh !== item.ma) {
              return;
            }
            if (item.cap === "1" && item.ma != '01') {
              this.listLoaiHangHoa = [...this.listLoaiHangHoa, item];
            }
            else {
              this.listLoaiHangHoa = [...this.listLoaiHangHoa, ...item.child];
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
    if (this.listLoaiHangHoa && this.formData.value.maLoaiHangHoa) {
      let chungLoaiHangHoa = this.listLoaiHangHoa.filter(item => item.ma === this.formData.value.maLoaiHangHoa);
      this.listChungLoaiHangHoa = chungLoaiHangHoa[0].child;
    }

  }

  async loadChiTiet(id: number) {
    if (id > 0) {
      let res = await this.quanLyBienBanTinhKhoService.loadChiTiet(id);

      if (res.msg == MESSAGE.SUCCESS && res.data) {
        let idQD = this.listSoQuyetDinh.filter(item => item.soQuyetDinh === res.data.soQd);
        if (idQD.length > 0) {
          idQD = idQD[0].id;
        }
        if (res.data) {
          this.detail.trangThai = res.data.trangThai;
          this.convertTrangThai(res.data.trangThai);
          this.tenDonViChiCuc = res.data.tenDvi;
          this.detail.maDiemKho = res.data.maDiemKho;
          this.detail.maNhaKho = res.data.maNhaKho;
          this.detail.maNganKho = res.data.maNganKho;
          this.detail.maNganLo = res.data.maLoKho;
          this.listDaiDien = res.data.ds;

          if (this.listLoaiHangHoa.length > 0) {
            this.listLoaiHangHoa.forEach((loaihanghoa: any) => {
              if (loaihanghoa.ten === res.data.loaiHH) {
                this.detail.loaiHangHoa = loaihanghoa.ma;
                this.formData.patchValue({ maLoaiHangHoa: this.detail.loaiHangHoa, });
                this.changeLoaiHangHoa();
                this.listChungLoaiHangHoa.forEach((chungloaihanghoa: any) => {
                  if (chungloaihanghoa.ten === res.data.chungLoaiHH) {
                    this.detail.chungLoaiHangHoa = chungloaihanghoa.ma;
                    this.formData.patchValue({ maChungLoaiHangHoa: this.detail.chungLoaiHangHoa, });
                  }
                })
              }
            })
          }

          this.formData.patchValue({
            soQDId: idQD,
            soQuyetDinh: res.data.soQd,
            donVi: res.data.tenDvi,
            maQHNS: res.data.maDvi,
            maDiemKho: this.detail.maDiemKho,
            maNhaKho: this.detail.maNhaKho,
            maNganKho: this.detail.maNganKho,
            maLoKho: this.detail.maNganLo,
            soBienBanTinhKho: res.data.soBienBan,
            soLuongNhap: res.data.soLuongNhap,
            soLuongXuat: res.data.soLuongXuat,
            soLuongConlai: res.data.slConlaiSosach,
            soLuongThucTeConLai: res.data.slConlaiXuatcuoi,
            soLuongThuaThucTeConLai: res.data.slThuaConlai,
            soLuongThieuThucTeConLai: res.data.slThieuConlai,
            nguyenNhan: res.data.nguyenNhan,
            kienNghi: res.data.kienNghi,
            ngayLapPhieu: res.data.ngayLapPhieu,
          });
          await this.loadDonVi();

          this.changeDiemKho(true);
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
            lyDo: null,
            trangThai: this.globals.prop.NHAP_CHO_DUYET_KTV_BAO_QUAN,
          };
          let res =
            await this.quanLyBienBanTinhKhoService.updateStatus(
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
          let trangThai = this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC;
          if (this.detail.trangThai === this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC) {
            trangThai = this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC;
          }
          let body = {
            id: this.id,
            lyDoTuChoi: null,
            trangThai: trangThai,
          };
          let res =
            await this.quanLyBienBanTinhKhoService.updateStatus(
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
          let trangThai = this.globals.prop.NHAP_TU_CHOI_KTV_BAO_QUAN;
          if (this.detail.trangThai === this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC) {
            trangThai = this.globals.prop.NHAP_TU_CHOI_LD_CHI_CUC;
          }
          let body = {
            id: this.id,
            lyDoTuChoi: text,
            trangThai: trangThai,
          };
          let res =
            await this.quanLyBienBanTinhKhoService.updateStatus(
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

  back() {
    this.showListEvent.emit();
  }

  async save(isOther: boolean) {
    this.spinner.show();
    try {
      let body = {
        "maQhns": this.formData.value.maQHNS,
        "chungLoaiHangHoa": this.id ? this.detail.chungLoaiHangHoa : this.formData.value.maChungLoaiHangHoa,
        "ds": this.listDaiDien,
        "kienNghi": this.formData.value.kienNghi,
        "loaiHangHoa": this.formData.value.maLoaiHangHoa,
        "maDiemkho": this.formData.value.maDiemKho,
        "maDvi": this.userInfo.MA_DVI,
        "maNgankho": this.formData.value.maNganKho,
        "maNganlo": this.formData.value.maLoKho,
        "maNhakho": this.formData.value.maNhaKho,
        "nguyenNhan": this.formData.value.nguyenNhan,
        "qdId": this.formData.value.soQDId,
        "soLuongThucTeConLai": this.formData.value.soLuongThucTeConLai,
        "soLuongXuat": this.formData.value.soLuongXuat
      };
      if (this.id > 0) {
        let newBody = { ...body, "id": this.id }
        let res = await this.quanLyBienBanTinhKhoService.sua(newBody);
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
        let res = await this.quanLyBienBanTinhKhoService.them(body);
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

  thongTinTrangThai(trangThai: string): string {
    if (
      trangThai === this.globals.prop.DU_THAO ||
      trangThai === this.globals.prop.NHAP_CHO_DUYET_KTV_BAO_QUAN ||
      trangThai === this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC ||
      trangThai === this.globals.prop.NHAP_TU_CHOI_LD_CHI_CUC
    ) {
      return 'du-thao-va-lanh-dao-duyet';
    } else if (trangThai === this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC) {
      return 'da-ban-hanh';
    }
  }

  convertTrangThai(status: string) {
    switch (status) {
      case this.globals.prop.DU_THAO:
        this.detail.tenTrangThai = 'DỰ THẢO';
        break;
      case this.globals.prop.NHAP_CHO_DUYET_KTV_BAO_QUAN:
        this.detail.tenTrangThai = 'CHỜ DUYỆT - KTV';
        break;
      case this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC:
        this.detail.tenTrangThai = 'CHỜ DUYỆT - LĐ CHI CỤC';
        break;
      case this.globals.prop.NHAP_TU_CHOI_LD_CHI_CUC:
        this.detail.tenTrangThai = 'TỪ CHỐI';
        break;
      case this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC:
        this.detail.tenTrangThai = 'ĐÃ DUYỆT';
        break;

    }
  }

  themDaiDien() {
    if (this.formData.value.daiDienChiCucDTNN && this.formData.value.chucVu) {
      let item = {
        stt: this.listDaiDien.length + 1,
        daiDien: this.formData.value.daiDienChiCucDTNN,
        chucVu: this.formData.value.chucVu,
      }
      this.listDaiDien.push(item);
      this.formData.patchValue({ daiDienChiCucDTNN: null, chucVu: null })
    }
  }

  xoaDaiDien(idx: number) {
    if (idx && this.listDaiDien.length > 0) {
      let newListDaiDien = this.listDaiDien.filter((item, index) => {
        return idx !== item.stt;
      })
      newListDaiDien.forEach((item, index) => {
        item.stt = index + 1;
      })
      this.listDaiDien = newListDaiDien
    }
  }
}

interface DaiDienChiCuc {
  stt: number;
  daiDien: string;
  chucVu: string;
}

