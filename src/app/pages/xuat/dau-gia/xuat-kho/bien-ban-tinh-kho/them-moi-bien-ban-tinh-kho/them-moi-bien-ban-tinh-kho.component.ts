import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as dayjs from 'dayjs';
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
import { ThongTinHopDongService } from 'src/app/services/thongTinHopDong.service';
import { UserService } from 'src/app/services/user.service';
import { convertTienTobangChu, convertTrangThai } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import VNnum2words from 'vn-num2words';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuanLyBienBanTinhKhoService } from "src/app/services/quanLyBienBanTinhKho.service";

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
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
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
    this.formData.patchValue({ donVi: this.detail.tenDonvi, maQHNS: this.detail.maDonVi })
  }


  async loadDiemKho() {
    let body = {
      maDviCha: this.detail.maDonVi,
      trangThai: '01',
    }
    const res = await this.donViService.getTreeAll(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.length > 0) {
        if (this.userService.isCuc()) {
          let diemkho: any[] = [];
          res.data.forEach((item: any) => {
            if (item.maDvi === this.detail.maDonVi) {
              item.children.forEach((child: any) => {
                if (child.tenDvi === this.tenDonViChiCuc) {
                  diemkho = [child];
                }
              })
            }
          })

          if (diemkho.length > 0) {
            diemkho.forEach(element => {
              if (element && element.capDvi == '3' && element.children) {
                this.listDiemKho = [
                  ...this.listDiemKho,
                  ...element.children
                ]
              }
            });

          }
        } else {
          res.data.forEach(element => {
            if (element && element.capDvi == '3' && element.children) {
              this.listDiemKho = [
                ...this.listDiemKho,
                ...element.children
              ]
            }
          });
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  changeDiemKho(fromChiTiet: boolean) {
    let diemKho = this.listDiemKho.filter(x => (this.id ? x.tenDvi : x.maDvi) == this.formData.value.maDiemKho);
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
    let nhaKho = this.listNhaKho.filter(x => (this.id ? x.tenDvi : x.maDvi) == this.formData.value.maNhaKho);
    if (nhaKho && nhaKho.length > 0) {
      this.listNganKho = nhaKho[0].children;
      if (fromChiTiet) {
        this.changeNganKho();
      }
    }
  }

  changeNganKho() {
    let nganKho = this.listNganKho.filter(x => (this.id ? x.tenDvi : x.maDvi) == this.formData.value.maNganKho);
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
      let chungLoaiHangHoa = this.listLoaiHangHoa.filter(item => (this.id ? item.ten : item.ma) === this.formData.value.maLoaiHangHoa);
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

          this.formData.patchValue({
            soQDId: idQD,
            soQuyetDinh: res.data.soQd,
            maLoaiHangHoa: res.data.loaiHH,
            maChungLoaiHangHoa: res.data.chungLoaiHH,
            maDiemKho: res.data.diemKho,
            maNhaKho: res.data.nhaKho,
            maNganKho: res.data.nganKho,
            maLoKho: res.data.loKho,
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

          this.listDaiDien = res.data.ds;

          if (this.listLoaiHangHoa.length > 0) {
            this.listLoaiHangHoa.forEach((loaihanghoa: any) => {
              if (loaihanghoa.ten === res.data.loaiHH) {
                this.detail.loaiHangHoa = loaihanghoa.ma;
                this.changeLoaiHangHoa();
                this.listChungLoaiHangHoa.forEach((chungloaihanghoa: any) => {
                  if (chungloaihanghoa.ten === res.data.chungLoaiHH) {
                    this.detail.chungLoaiHangHoa = chungloaihanghoa.ma;
                  }
                })

              }
            })
          }
          if (this.listDiemKho.length > 0) {
            this.listDiemKho.forEach((diemkho: any) => {
              if (diemkho.title === res.data.diemKho) {
                this.detail.maDiemKho = diemkho.maDvi;
                this.changeDiemKho(false);
                this.listNhaKho.forEach((nhakho: any) => {
                  if (nhakho.title === res.data.nhaKho) {
                    this.detail.maNhaKho = nhakho.maDvi;
                    this.changeNhaKho(false);
                    this.listNganKho.forEach((ngankho: any) => {
                      if (ngankho.title === res.data.nganKho) {
                        this.detail.maNganKho = ngankho.maDvi;
                        this.changeNganKho();
                        this.listNganLo.forEach((nganlo: any) => {
                          if (nganlo.title === res.data.loKho) {
                            this.detail.maNganLo = nganlo.maDvi;
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          }
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

          let trangThai = this.globals.prop.NHAP_CHO_DUYET_KTV_BAO_QUAN;

          if (this.detail.trangThai === this.globals.prop.NHAP_CHO_DUYET_KTV_BAO_QUAN) {
            trangThai = this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC;
          }
          let body = {
            id: this.id,
            lyDo: null,
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
            trangThai: this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC,
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
          let body = {
            id: this.id,
            lyDoTuChoi: text,
            trangThai: this.globals.prop.NHAP_TU_CHOI_LD_CHI_CUC,
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
        "chungLoaiHangHoa": this.id ? this.detail.chungLoaiHangHoa : this.formData.value.maChungLoaiHangHoa,
        "ds": this.listDaiDien,
        "kienNghi": this.formData.value.kienNghi,
        "loaiHangHoa": this.id ? this.detail.loaiHangHoa : this.formData.value.maLoaiHangHoa,
        "maDiemkho": this.id ? this.detail.maDiemKho : this.formData.value.maDiemKho,
        "maDvi": this.userInfo.MA_DVI,
        "maNgankho": this.id ? this.detail.maNganKho : this.formData.value.maNganKho,
        "maNganlo": this.id ? this.detail.maNganLo : this.formData.value.maLoKho,
        "maNhakho": this.id ? this.detail.maNhaKho : this.formData.value.maNhaKho,
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
        this.detail.tenTrangThai = 'CHỜ DUYỆT KTV';
        break;
      case this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC:
        this.detail.tenTrangThai = 'CHỜ DUYỆT LD CHI CỤC';
        break;
      case this.globals.prop.NHAP_TU_CHOI_LD_CHI_CUC:
        this.detail.tenTrangThai = 'TỪ CHỐI LD CHI CỤC';
        break;
      case this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC:
        this.detail.tenTrangThai = 'ĐÃ DUYỆT LD CHI CỤC';
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

