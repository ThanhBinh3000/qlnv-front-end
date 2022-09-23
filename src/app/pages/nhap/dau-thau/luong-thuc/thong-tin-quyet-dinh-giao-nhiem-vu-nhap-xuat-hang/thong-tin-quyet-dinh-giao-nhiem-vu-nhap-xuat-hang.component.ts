import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogCanCuHopDongComponent } from 'src/app/components/dialog/dialog-can-cu-hop-dong/dialog-can-cu-hop-dong.component';
import { DialogThongTinDonViThucHienQuyetDinhComponent } from 'src/app/components/dialog/dialog-thong-tin-danh-sach-don-vi-thuc-hien-quyet-dinh/dialog-thong-tin-danh-sach-don-vi-thuc-hien-quyet-dinh.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { LOAI_HANG_DTQG, LOAI_QUYET_DINH } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { ChiTietGiaoNhiemVuNhapXuat } from 'src/app/models/ChiTietGiaoNhiemVuNhapXuat';
import { DonviService } from 'src/app/services/donvi.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';

@Component({
  selector: 'thong-tin-quyet-dinh-giao-nhiem-vu-nhap-xuat-hang',
  templateUrl:
    './thong-tin-quyet-dinh-giao-nhiem-vu-nhap-xuat-hang.component.html',
  styleUrls: [
    './thong-tin-quyet-dinh-giao-nhiem-vu-nhap-xuat-hang.component.scss',
  ],
})
export class ThongTinGiaoNhiemVuNhapXuatHangComponent implements OnInit {
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  id: number = 0;
  tabSelected: string = 'thong-tin-hang';

  startValue: Date | null = null;
  endValue: Date | null = null;

  ngayKy: Date | null = null;
  ngayHieuLuc: Date | null = null;

  inputDonVi: string = '';
  options: any[] = [];
  optionsDonVi: any[] = [];
  selectedDonVi: any = null;

  optionsDonViTinh: any[] = [];
  donViTinhModel: any = null;

  optionsLoaiNX: any[] = [];
  loaiNXModel: any = null;

  nhapIdDefault: string = LOAI_QUYET_DINH.NHAP;
  xuatIdDefault: string = LOAI_QUYET_DINH.XUAT;

  thocIdDefault: string = LOAI_HANG_DTQG.THOC;
  gaoIdDefault: string = LOAI_HANG_DTQG.GAO;
  muoiIdDefault: string = LOAI_HANG_DTQG.MUOI;

  loaiVTHH: string = null;
  donViTinh: string = null;
  soLuong: number = null;
  loaiNx: string = null;

  errorInputRequired: string = null;
  errorGhiChu: boolean = false;

  chiTiet: ChiTietGiaoNhiemVuNhapXuat = new ChiTietGiaoNhiemVuNhapXuat();

  constructor(
    private router: Router,
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private donViService: DonviService,
    private routerActive: ActivatedRoute,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.chiTiet.detail1 = [];
      this.id = +this.routerActive.snapshot.paramMap.get('id');
      await Promise.all([
        this.loadDonVi(),
        this.loadDonViTinh(),
        this.loadLoaiNhapXuat(),

      ]);
      await this.loadChiTiet(this.id);
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadChiTiet(id: number) {
    if (id > 0) {
      let res = await this.quyetDinhGiaoNhapHangService.chiTiet(id);
      if (res.msg == MESSAGE.SUCCESS) {
        this.chiTiet = res.data;

        this.inputDonVi = this.chiTiet.tenDvi;
        this.ngayKy = this.chiTiet.ngayKy ? dayjs(this.chiTiet.ngayKy).toDate() : null;
        this.ngayHieuLuc = this.chiTiet.ngayHluc ? dayjs(this.chiTiet.ngayHluc).toDate() : null;
        if (res.data.children) {
          this.chiTiet.detail = res.data.children;
          if (res.data.children.length > 0) {
            this.loaiNx = res.data.children[0].loaiNx;
            this.startValue = res.data.children[0].tuNgayThien ? dayjs(res.data.children[0].tuNgayThien).toDate() : null;
            this.endValue = res.data.children[0].denNgayThien ? dayjs(res.data.children[0].denNgayThien).toDate() : null;
            this.soLuong = res.data.children[0].soLuong;
            this.donViTinh = res.data.children[0].donViTinh;
            this.donViTinhModel = res.data.children[0].donViTinh;
            this.loaiVTHH = res.data.children[0].maVthh;
          }
        }
        if (res.data.children1) {
          this.chiTiet.detail1 = res.data.children1;
          for (let i = 0; i < this.chiTiet.detail1.length; i++) {
            this.chiTiet.detail1[i].detail = res.data.children1[i].children;
          }
        }
        if (res.data.children2) {
          this.chiTiet.fileDinhKems = res.data.children2;
        }
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.endValue) {
      return false;
    }
    return startValue.getTime() > this.endValue.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.startValue) {
      return false;
    }
    return endValue.getTime() <= this.startValue.getTime();
  };

  async loadDonVi() {
    const res = await this.donViService.layTatCaDonVi();
    this.optionsDonVi = [];
    if (res.msg == MESSAGE.SUCCESS) {
      for (let i = 0; i < res.data.length; i++) {
        const item = {
          ...res.data[i],
          labelDonVi: res.data[i].maDvi + ' - ' + res.data[i].tenDvi,
        };
        this.optionsDonVi.push(item);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  onInput(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.options = [];
    } else {
      this.options = this.optionsDonVi.filter(
        (x) => x.labelDonVi.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }

  async selectDonVi(donVi) {
    this.inputDonVi = donVi.tenDvi;
    this.selectedDonVi = donVi;
    this.chiTiet.maDvi = this.selectedDonVi.maDvi;
  }

  async loadDonViTinh() {
    try {
      const res = await this.donViService.loadDonViTinh();
      this.optionsDonViTinh = [];
      if (res.msg == MESSAGE.SUCCESS) {
        for (let i = 0; i < res.data.length; i++) {
          const item = {
            ...res.data[i],
            labelDonViTinh: res.data[i].tenDviTinh,
          };
          this.optionsDonViTinh.push(item);
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  selectDonViTinh(donViTinh) {
    this.donViTinhModel = donViTinh;
  }

  async loadLoaiNhapXuat() {
    try {
      const res = await this.quyetDinhGiaoNhapHangService.getLoaiNhapXuat();
      this.optionsLoaiNX = [];
      if (res.msg == MESSAGE.SUCCESS) {
        this.optionsLoaiNX = res.data;
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  selectLoaiNX(nxModel) {
    this.loaiNXModel = nxModel;
  }

  reactToDonViThuchienQuyetDinh(data?: any) {
    const modalPhuLuc = this.modal.create({
      nzTitle: 'Thông tin danh sách chi tiết đơn vị thực hiện quyết định',
      nzContent: DialogThongTinDonViThucHienQuyetDinhComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        data: data
      },
    });
    modalPhuLuc.afterClose.subscribe((res) => {
      if (res) {
        this.checkDataExistDanhSach(res);
      }
    });
  }

  checkDataExistDanhSach(data: any) {
    if (this.chiTiet.detail1) {
      let indexExist =
        this.chiTiet.detail1.findIndex(
          (x) => x.maDvi == data.maDvi,
        );
      if (indexExist != -1) {
        this.chiTiet.detail1.splice(
          indexExist,
          1,
        );
      }
    } else {
      this.chiTiet.detail1 = [];
    }
    this.chiTiet.detail1 = [
      ...this.chiTiet.detail1,
      data,
    ];
  }

  deleteItem(data: any) {
    if (this.chiTiet.detail1 && this.chiTiet.detail1.length > 0) {
      this.chiTiet.detail1 = this.chiTiet.detail1.filter(x => x.maDvi != data.maDvi);
    }
    else {
      this.chiTiet.detail1 = [];
    }
  }

  back() {
    this.router.navigate(['/nhap/dau-thau/quyet-dinh-giao-nhiem-vu-nhap-hang']);
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
          let res = await this.quyetDinhGiaoNhapHangService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
          }
          else {
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

  trinhDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn trình duyệt?',
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
            trangThai: '01',
          };
          let res = await this.quyetDinhGiaoNhapHangService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
          }
          else {
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

  duyet() {
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
            lyDoTuChoi: null,
            trangThai: '02',
          };
          let res = await this.quyetDinhGiaoNhapHangService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
          }
          else {
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

  async save(isOther: boolean) {
    if (this.chiTiet.ghiChu && this.chiTiet.ghiChu != '') {
      this.spinner.show();
      try {
        let body = {
          "detail": [
            {
              "denNgayThien": this.endValue ? dayjs(this.endValue).format("YYYY-MM-DD") : null,
              "dvt": this.donViTinhModel,
              "id": this.id,
              "idHdr": 0,
              "loaiNx": this.loaiNx,
              "maVthh": this.loaiVTHH,
              "soLuong": this.soLuong,
              "tenVthh": this.loaiVTHH,
              "tuNgayThien": this.startValue ? dayjs(this.startValue).format("YYYY-MM-DD") : null,
            }
          ],
          "detail1": this.chiTiet.detail1 ?? [],
          "fileDinhKems": [],
          "ghiChu": this.chiTiet.ghiChu,
          "id": this.id,
          "ldoTuchoi": null,
          "loaiQd": this.chiTiet.loaiQd,
          "maDvi": this.chiTiet.maDvi,
          "ngayHluc": this.ngayHieuLuc ? dayjs(this.ngayHieuLuc).format("YYYY-MM-DD") : null,
          "ngayKy": this.ngayKy ? dayjs(this.ngayKy).format("YYYY-MM-DD") : null,
          "soHd": this.chiTiet.soHd ?? "20/HD-TCDT",
          "soQd": this.chiTiet.soQd,
          "veViec": this.chiTiet.veViec
        }
        if (this.id == 0) {
          let res = await this.quyetDinhGiaoNhapHangService.them(body);
          if (res.msg == MESSAGE.SUCCESS) {
            if (!isOther) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
              this.back();
            }
          }
          else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        }
        else {
          let res = await this.quyetDinhGiaoNhapHangService.sua(body);
          if (res.msg == MESSAGE.SUCCESS) {
            if (!isOther) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
              this.back();
            }
          }
          else {
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
    else {
      this.errorGhiChu = true;
    }
  }

  validateGhiChu(e: Event) {
    if (this.chiTiet.ghiChu && this.chiTiet.ghiChu != '') {
      this.errorGhiChu = false;
    }
    else {
      this.errorGhiChu = true;
    }
  }

  inFile() {
    let WindowPrt = window.open(
      '',
      '',
      'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0',
    );
    let printContent = '';
    printContent = printContent + '<div>';
    printContent = printContent + document.getElementById('table-don-vi-quyet-dinh').innerHTML;
    printContent = printContent + '</div>';
    WindowPrt.document.write(printContent);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }

  openDialogHopDong() {
    if (this.id == 0) {
      const modalQD = this.modal.create({
        nzTitle: 'Thông tin căn cứ trên hợp đồng',
        nzContent: DialogCanCuHopDongComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {},
      });
      modalQD.afterClose.subscribe((data) => {
        if (data) {
          this.chiTiet.soHd = data.soHdong;
        }
      });
    }
  }
}
