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
  daiDienChiCuc: any = ""
  chucVu: any = ""
  kienNghi: any = ""
  nguyenNhan: any = ""
  listVthh: any[] = []
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
  detailGiaoNhap: any = {};
  create: any = {};
  editDataCache: { [key: string]: { edit: boolean; data: any } } = {};
  listFileDinhKem: any[] = [];

  listDaiDien: DaiDienChiCuc[] = [];

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
      console.log("1");
      this.create.dvt = "Tấn";
      this.userInfo = this.userService.getUserLogin();
      this.detail.trangThai = "00";
      this.detail.maDonVi = this.userInfo.MA_DVI;
      this.detail.tenDonvi = this.userInfo.TEN_DVI;
      this.detail.ngayTaoPhieu = dayjs().format('YYYY-MM-DD');
      this.detail.chiTiets = [];
      console.log("2");


      this.initForm();
      console.log("3");

      await Promise.all([
        this.loadDiemKho(),
        this.loadSoQuyetDinh(),
        this.loaiVTHHGetAll()
      ]);
      console.log("4");

      await this.loadChiTiet(this.id)
      console.log("5");

      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      // this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      this.notification.error(MESSAGE.ERROR, 'Lỗi tổng ');
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
    this.formData.controls['donVi'].disable();
    this.formData.controls['maQHNS'].disable();
  }

  // Hiện đang xét theo cục
  async loadDiemKho() {
    let body = {
      maDviCha: this.detail.maDonVi,
      trangThai: '01',
    }
    const res = await this.donViService.getTreeAll(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.length > 0) {
        res.data[0].children.forEach(element => {
          if (element && element.capDvi == '3' && element.children && element.id === 28) {
            this.listDiemKho = [
              ...this.listDiemKho,
              ...element.children
            ]
          }
        });
      }
    } else {
      // this.notification.error(MESSAGE.ERROR, res.msg);
      this.notification.error(MESSAGE.ERROR, 'Lỗi điểm kho');

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

  // Số quyết định
  async loadSoQuyetDinh() {
    let body = {}
    let res = await this.quyetDinhGiaoNhiemVuXuatHangService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listSoQuyetDinh = res.data.content;
    } else {
      console.log('lỗi');
      this.notification.error(MESSAGE.ERROR, res.msg);
      // this.notification.error(MESSAGE.ERROR, 'Lỗi số quyết định');

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

  // Loại Hàng hóa
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
      this.notification.error(MESSAGE.ERROR, 'Lỗi loại hàng hóa');
      // this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }
  async changeLoaiHangHoa() {
    if (this.listLoaiHangHoa && this.formData.value.maLoaiHangHoa) {
      let chungLoaiHangHoa = this.listLoaiHangHoa.filter(item => item.ma === this.formData.value.maLoaiHangHoa);
      this.listChungLoaiHangHoa = chungLoaiHangHoa[0].child;
    }

  }
  // async changeChungLoaiHangHoa() {
  //   const loaihanghoaDVT = this.listChungLoaiHangHoa.filter(chungloaihanghoa => chungloaihanghoa.ma === this.formData.value.idChungLoaiHangHoa);
  //   this.formData.patchValue({ donViTinh: loaihanghoaDVT[0]?.maDviTinh });

  //   if (this.formData.value.tuNgay && this.formData.value.denNgay && this.formData.value.idNganLo) {
  //     await this.loadTonDauKy();
  //   }
  // }



  async loadChiTiet(id: number) {
    if (id > 0) {
      let res = await this.quanLyBienBanTinhKhoService.loadChiTiet(id);

      if (res.msg == MESSAGE.SUCCESS && res.data) {
        let idQD = this.listSoQuyetDinh.filter(item => item.soQuyetDinh === res.data.soQd);

        if (idQD.length > 0) {
          idQD = idQD[0].id;
        }
        if (res.data) {
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
        }
      }
    }
    this.updateEditCache();
  }
  updateEditCache(): void {
    if (this.detail?.chiTiets && this.detail?.chiTiets.length > 0) {
      this.detail?.chiTiets.forEach((item) => {
        this.editDataCache[item.stt] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }
  changeNganLo() {
    let nganLo = this.listNganLo.filter(x => x.maNganlo == this.detail.maNganlo);
    if (nganLo && nganLo.length > 0) {
      this.detail.tichLuong = nganLo[0].tichLuongChua ?? 0;
    }
  }



  async loadLoaiKho() {
    let body = {
      "maLhKho": null,
      "paggingReq": {
        "limit": 1000,
        "page": 1
      },
      "str": null,
      "tenLhKho": null,
      "trangThai": null
    };
    let res = await this.danhMucService.danhMucLoaiKhoGetList(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content) {
        this.listLoaiKho = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadDonViTinh() {
    try {
      const res = await this.donViService.loadDonViTinh();
      this.listDonViTinh = [];
      if (res.msg == MESSAGE.SUCCESS) {
        for (let i = 0; i < res.data.length; i++) {
          const item = {
            ...res.data[i],
            labelDonViTinh: res.data[i].tenDviTinh,
          };
          this.listDonViTinh.push(item);
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, 'Lỗi đơn vị tính ');

      // this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
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
            trangThai: '04',
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
          // this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          this.notification.error(MESSAGE.ERROR, "Lỗi gửi duyệt");
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
            trangThai: '01',
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
          // this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          this.notification.error(MESSAGE.ERROR, "Lỗi phe duyệt");
        }
      },
    });
  }

  hoanThanh() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn hoàn thành biên bản?',
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
            trangThai: '01',
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
          // this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          this.notification.error(MESSAGE.ERROR, "Lỗi hoàn thành");
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
            trangThai: '03',
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
          // this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          this.notification.error(MESSAGE.ERROR, "lỗi từ chối");
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
    // this.spinner.show();
    try {
      let body = {
        "chungLoaiHangHoa": this.formData.value.maChungLoaiHangHoa,
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
      // this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      this.notification.error(MESSAGE.ERROR, "Lỗi lưu");
    }
  }

  thongTinTrangThai(trangThai: string): string {
    if (
      trangThai === '00' ||
      trangThai === '01' ||
      trangThai === '04' ||
      trangThai === '03'
    ) {
      return 'du-thao-va-lanh-dao-duyet';
    } else if (trangThai === '02') {
      return 'da-ban-hanh';
    }
  }
  convertTrangThai(status: string) {
    return convertTrangThai(status);
  }
  print() {

  }

  selectFile(event) {
    this.detail.fileDinhKems = event;
  }

  // Thêm đại diện
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
  // Xóa đại diện
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

