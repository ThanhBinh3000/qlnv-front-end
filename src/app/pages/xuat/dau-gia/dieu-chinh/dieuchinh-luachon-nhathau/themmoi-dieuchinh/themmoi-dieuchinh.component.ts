import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogCanCuQDPheDuyetKHLCNTComponent } from 'src/app/components/dialog/dialog-can-cu-qd-phe-duyet-khlcnt/dialog-can-cu-qd-phe-duyet-khlcnt.component';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { DialogTTPhuLucQDDCBanDauGiaComponent } from 'src/app/components/dialog/dialog-thong-tin-phu-luc-qddc-ban-dau-gia/dialog-thong-tin-phu-luc-qddc-ban-dau-gia.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { DATEPICKER_CONFIG, LIST_VAT_TU_HANG_HOA, LOAI_HANG_DTQG, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DanhMucTieuChuanService } from 'src/app/services/danhMucTieuChuan.service';
import { dauThauGoiThauService } from 'src/app/services/dauThauGoiThau.service';
import { QuyetDinhPheDuyetKeHoachLCNTService } from 'src/app/services/quyetDinhPheDuyetKeHoachLCNT.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import {STATUS} from "../../../../../../constants/status";

@Component({
  selector: 'app-themmoi-dieuchinh',
  templateUrl: './themmoi-dieuchinh.component.html',
  styleUrls: ['./themmoi-dieuchinh.component.scss']
})
export class ThemMoiDieuChinhComponent implements OnInit {
  @Input() isViewDetail: boolean;
  @Input() typeHangHoa: string;
  @Output()
  showListEvent = new EventEmitter<any>();
  detail: any = {};
  @Input() isView: boolean;
  @Input() typeVthh: string;
  @Input() id: number;
  // timeDefaultValue = setHours(new Date(), 0);
  tabSelected: string = 'phuong-an-tong-hop';
  searchValue = '';
  visibleTab: boolean = false;
  listNam: any[] = [];
  yearNow: number = 0;
  listNthauNopHs: any[] = [];
  listDiaDiemNhapHang: any[] = [];
  editCache: { [key: string]: { edit: boolean; data: any } } = {};
  editDiaDiemCache: { [key: string]: { edit: boolean; data: any } } = {};
  i = 0;
  listNguonVon: any[] = []
  listPhuongThucDauThau: any[] = []
  listHinhThucDauThau: any[] = []
  listLoaiHopDong: any[] = []
  listVthh: any[] = [];
  formGoiThau: FormGroup
  isDetail = false;
  dataTable: any[] = [];
  dataDetail: any;
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  errorInputRequired: string = 'Dữ liệu không được để trống.';

  thocIdDefault: string = LOAI_HANG_DTQG.THOC;
  gaoIdDefault: string = LOAI_HANG_DTQG.GAO;
  muoiIdDefault: string = LOAI_HANG_DTQG.MUOI;

  lastBreadcrumb: string;
  userInfo: UserLogin;
  datePickerConfig = DATEPICKER_CONFIG;
  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private userService: UserService,
    private quyetDinhPheDuyetKeHoachLCNTService: QuyetDinhPheDuyetKeHoachLCNTService,
    private routerActive: ActivatedRoute,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private fb: FormBuilder,
    private dauThauGoiThauService: dauThauGoiThauService,
    private modal: NzModalService,
    private dmTieuChuanService: DanhMucTieuChuanService
  ) {
    const yearNow = new Date().getUTCFullYear();

    this.formGoiThau = this.fb.group({
      namKhoach: [yearNow],
      soQdPD: [null],
      trichYeu: [null],
      ngayQd: [null],
      ngayHluc: [null],
      canCu: [null],
      tenVthh: [null],
      loaiVthh: [null],
      cLoaiVthh: [null],
      tenCloaiVthh: [null],
      loaiHdong: [null, [Validators.required]],
      hthucLcnt: [null, [Validators.required]],
      pthucLcnt: [null, [Validators.required]],
      nguonVon: [null],
      tgianPhanh: [null],
      tgianDthau: [null],
      tgianMthau: [null],
      tgianNhang: [null],
      ghiChu: [null]
      // tenGoiThau: [''],
      // maDvi: [''],
      // tenDvi: [''],
      // loaiVthh: [''],
      // hthucLcnt: ['', [Validators.required]],
      // pthucLcnt: ['', [Validators.required]],
      // loaiHdong: ['', [Validators.required]],
      // nguonVon: ['', [Validators.required]],
      // tgianPhanh: ['', [Validators.required]],
      // tgianTbao: ['', [Validators.required]],
      // tgianDthau: ['', [Validators.required]],
      // tgianMthau: ['', [Validators.required]],
      // tgianNhang: ['', [Validators.required]],
      // soLuong: [''],
      // dViTinh: ['Tấn'],
      // tgianDongThau: [''],
      // tgianMoThau: [''],
      // tgianThien: [''],
      // giaGoiThau: [''],
      // donGia: [''],
      // tongTien: [''],
      // tChuanCluong: [''],
      // ghiChu: [''],
      // dgiaHdong: [''],
      // VAT: [''],
      // dgianHdongSauThue: [''],
      // giaHdongSauThue: [''],
      // giaHdongTruocThue: [''],
      // ngayKy: [''],
      // nhaThauTthao: ['']
    });
    // this.formDauThau = this.fb.group({
    //   tenDvi: [''],
    //   soQdPD: [''],
    //   loaiVthh: ['']
    // })
  }
  async ngOnInit() {
    this.spinner.show();
    this.listVthh = LIST_VAT_TU_HANG_HOA;
    try {
      this.userInfo = this.userService.getUserLogin();
      this.id = +this.routerActive.snapshot.paramMap.get('id');
      this.yearNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      }
      await Promise.all([
        this.phuongThucDauThauGetAll(),
        this.nguonVonGetAll(),
        this.hinhThucDauThauGetAll(),
        this.loaiHopDongGetAll(),
        // this.getDetail(),
      ]);
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async hinhThucDauThauGetAll() {
    this.listHinhThucDauThau = [];
    let res = await this.danhMucService.hinhThucDauThauGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHinhThucDauThau = res.data;
    }
  }

  async getDetail() {
    let res = await this.quyetDinhPheDuyetKeHoachLCNTService.getDetail(this.id);
    if (res.msg == MESSAGE.SUCCESS) {
      this.dataDetail = res.data;
      this.dataTable = res.data.children1;
      // this.formDauThau.patchValue({
      //   loaiVthh: res.data.loaiVthh,
      //   soQdPD: res.data.soQd,
      //   tenDvi: res.data.maDvi
      // });
      this.formGoiThau.patchValue({
        loaiVthh: res.data.loaiVthh,
        soQdPD: res.data.soQd,
        pthucLcnt: res.data.pthucLcnt,
        hthucLcnt: res.data.hthucLcnt,
        nguonVon: res.data.nguonVon,
        loaiHdong: res.data.loaiHdong,
        ngayQd: res.data.ngayQd,
        tgianNhang: res.data.tgianNhang,
      });
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  openDialogQDPDKHLCNT() {
    // if (this.id == 0) {
    const modalQD = this.modal.create({
      nzTitle: 'Thông tin căn cứ quyết định phê duyệt KHLCNT',
      nzContent: DialogCanCuQDPheDuyetKHLCNTComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalQD.afterClose.subscribe((data) => {
      if (data) {
        this.formGoiThau.patchValue({
          canCu: data.soQd ?? null,
          loaiVthh: data.loaiVthh ?? null,
          tenVthh: data.tenVthh ?? null,
          cLoaiVthh: data.cloaiVthh ?? null,
          tenCloaiVthh: data.tenCloaiVthh ?? null,
          loaiHdong: data.loaiHdong ?? null,
          hthucLcnt: data.hthucLcnt ?? null,
          pthucLcnt: data.pthucLcnt ?? null,
          nguonVon: data.nguonVon ?? null,
          tgianDthau: data.tgianDthau ?? null,
          tgianMthau: data.tgianMthau ?? null,
          tgianNhang: data.tgianNhang ?? null,
        })
      }
    });
    // }
  }

  redirectToChiTiet(data) {
    console.log(data);
    this.isDetail = true;
    this.formGoiThau.patchValue({
      idGoiThau: data.id,
      tenGoiThau: data.tenDuAn,
      tenDvi: data.tenDvi,
      maDvi: data.maDvi,
      donGia: data.donGia,
      soLuong: data.soLuong,
      tongTien: data.tongTien,
    });
    this.listNthauNopHs = [{
      ten: '',
      soThue: '',
      diaChi: '',
      soDt: ''
    }]
    this.listDiaDiemNhapHang = [{
      maDvi: '',
      maDiemKho: '',
      maKho: '',
    }]
    this.updateEditCache();
  }

  quayLaiSearch() {
    let loatVthh = this.router.url.split('/')[4]
    this.router.navigate(['/mua-hang/dau-thau/trienkhai-luachon-nhathau/' + loatVthh + '/thongtin-dauthau']);
  }

  huy() {
    this.showListEvent.emit();
  }

  selectHangHoa() {
    let data = this.typeHangHoa;
    const modal = this.modal.create({
      nzTitle: 'Danh sách hàng hóa',
      nzContent: DialogDanhSachHangHoaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: { data },
    });
    modal.afterClose.subscribe(async (data) => {
      if (data) {
        this.bindingDataHangHoa(data);
      }
    });
  }

  async bindingDataHangHoa(data) {
    this.typeHangHoa = data.ma.slice(0, 2);
    let cloaiVthh = null;
    if (data.loaiHang == "M" || data.loaiHang == "LT") {
      cloaiVthh = data.ma;
      this.formGoiThau.patchValue({
        maVtu: null,
        tenVtu: null,
        cloaiVthh: data.ma,
        tenCloaiVthh: data.ten,
        loaiVthh: data.parent.ma,
        tenVthh: data.parent.ten
      })
    }
    if (data.loaiHang == "VT") {
      if (data.cap == "3") {
        cloaiVthh = data
        this.formGoiThau.patchValue({
          maVtu: data.ma,
          tenVtu: data.ten,
          cloaiVthh: data.parent.ma,
          tenCloaiVthh: data.parent.ten,
          loaiVthh: data.parent.parent.ma,
          tenVthh: data.parent.parent.ten
        })
      }
      if (data.cap == "2") {
        this.formGoiThau.patchValue({
          maVtu: null,
          tenVtu: null,
          cloaiVthh: data.ma,
          tenCloaiVthh: data.ten,
          loaiVthh: data.parent.ma,
          tenVthh: data.parent.ten
        })
      }
    }
  }

  async phuongThucDauThauGetAll() {
    this.listPhuongThucDauThau = [];
    let res = await this.danhMucService.phuongThucDauThauGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listPhuongThucDauThau = res.data;
    }
  }

  themMoiGoiThau() {
    this.listNthauNopHs.forEach((value, index) => {
      this.editCache[index] = {
        edit: false,
        data: { ...value }
      };
    })
  }

  async nguonVonGetAll() {
    this.listNguonVon = [];
    let res = await this.danhMucService.nguonVonGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listNguonVon = res.data;
    }
  }

  async loaiHopDongGetAll() {
    this.listLoaiHopDong = [];
    let res = await this.danhMucService.loaiHopDongGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = res.data;
    }
  }

  addRow(): void {
    this.listNthauNopHs = [
      ...this.listNthauNopHs,
      {}
    ];
    this.i++;
    this.listNthauNopHs.forEach((value, index) => {
      this.editCache[index] = {
        edit: false,
        data: { ...value }
      };
    })
    this.editCache[this.i].edit = true;
  }

  updateEditCache(): void {
    this.listNthauNopHs.forEach((item, index) => {
      this.editCache[index] = {
        edit: true,
        data: { ...item }
      };
    });
    this.listDiaDiemNhapHang.forEach((item, index) => {
      this.editDiaDiemCache[index] = {
        edit: true,
        data: { ...item }
      };
    });
  }

  startEdit(index: number): void {
    console.log(index);
    this.editCache[index].edit = true;
  }

  deleteRow(index: number) {
    this.listNthauNopHs = this.listNthauNopHs.filter((d, index) => index !== index);
  }

  cancelEdit(id: any): void {
    const index = this.listNthauNopHs.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.listNthauNopHs[index] },
      edit: false
    };
  }

  saveEdit(index: any): void {
    Object.assign(
      this.listNthauNopHs[index],
      this.editCache[index].data,
    );
    this.editCache[index].edit = false;
  }

  async saveDthauGthau() {
    let body = this.formGoiThau.value;
    console.log(body)
    body.children = this.listNthauNopHs;
    let res = await this.dauThauGoiThauService.create(body);
    console.log(res);
  }

  calendarGia() {
    let donGia = this.formGoiThau.get('donGia').value;
    let VAT = this.formGoiThau.get('VAT').value;
    let soLuong = this.formGoiThau.get('soLuong').value;
    if (donGia >= 0 && VAT >= 0) {
      this.formGoiThau.patchValue({
        dgianHdongSauThue: (donGia + (donGia * VAT / 100)),
        giaHdongTruocThue: donGia * soLuong,
        giaHdongSauThue: (donGia + (donGia * VAT / 100)) * soLuong,
      })
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
          // await this.save(true);
          let body = {
            id: this.id,
            lyDoTuChoi: null,
            trangThai: '01',
          };
          let res =
            await this.dauThauGoiThauService.updateStatus(
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
            trangThai: STATUS,
          };
          let res =
            await this.dauThauGoiThauService.updateStatus(
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
            trangThai: '04',
          };
          let res =
            await this.dauThauGoiThauService.updateStatus(
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
            trangThai: '03',
          };
          let res =
            await this.dauThauGoiThauService.updateStatus(
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
  }
  openPhuLuc() {
    const modal = this.modal.create({
      nzTitle: 'THÔNG TIN PHỤ LỤC QUYẾT ĐỊNH ĐIỀU CHỈNH KH BÁN ĐẤU GIÁ',
      nzContent: DialogTTPhuLucQDDCBanDauGiaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1500px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modal.afterClose.subscribe(async (text) => {
      if (text) {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            lyDoTuChoi: text,
            trangThai: '03',
          };
          // let res =
          //   await this.phieuNhapKhoTamGuiService.updateStatus(
          //     body,
          //   );
          // if (res.msg == MESSAGE.SUCCESS) {
          //   this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          //   this.back();
          // } else {
          //   this.notification.error(MESSAGE.ERROR, res.msg);
          // }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }
}
