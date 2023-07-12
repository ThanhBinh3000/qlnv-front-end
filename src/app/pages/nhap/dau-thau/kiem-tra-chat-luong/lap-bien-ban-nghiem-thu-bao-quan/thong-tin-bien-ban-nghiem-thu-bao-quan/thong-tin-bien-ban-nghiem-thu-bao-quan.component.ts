import { cloneDeep } from 'lodash';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { DialogThemBienbanNghiemThuKeLotComponent } from 'src/app/components/dialog/dialog-them-bien-ban-nghiem-thu-ke-lot/dialog-them-bien-ban-nghiem-thu-ke-lot.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DanhSachDauThauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/danhSachDauThau.service';
import { DonviService } from 'src/app/services/donvi.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import VNnum2words from 'vn-num2words';
import { convertTienTobangChu, thongTinTrangThaiNhap } from 'src/app/shared/commonFunction';
import { QuanLyNghiemThuKeLotService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/quanLyNghiemThuKeLot.service';
import * as dayjs from 'dayjs';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import { ThongTinHopDongService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/hop-dong/thongTinHopDong.service';
import { STATUS } from "../../../../../../constants/status";
import { BaseComponent } from 'src/app/components/base/base.component';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { FormBuilder, Validators } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { HelperService } from 'src/app/services/helper.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { convertDviTinh } from 'src/app/shared/commonFunction';
import { DanhMucCongCuDungCuService } from 'src/app/services/danh-muc-cong-cu-dung-cu.service';
import { convertMaCcdc } from 'src/app/shared/commonFunction';
import { FileDinhKem } from 'src/app/models/FileDinhKem';

@Component({
  selector: 'app-thong-tin-bien-ban-nghiem-thu-bao-quan',
  templateUrl: './thong-tin-bien-ban-nghiem-thu-bao-quan.component.html',
  styleUrls: ['./thong-tin-bien-ban-nghiem-thu-bao-quan.component.scss']
})
export class ThongTinBienBanNghiemThuBaoQuanComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() typeVthh: string;
  @Input() idQdGiaoNvNh: number;
  @Output()
  showListEvent = new EventEmitter<any>();

  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;

  userInfo: UserLogin;
  detailGiaoNhap: any = {};
  detailHopDong: any = {};

  listLoaiKho: any[] = [];
  listPhuongThucBaoQuan: any[] = [];
  listHinhThucBaoQuan: any[] = [];
  listDonViTinh: any[] = [];
  listSoQuyetDinh: any[] = [];
  listHopDong: any[] = [];
  listDiaDiemNhap: any[] = [];
  listSoPhieuNhapKho: any[] = [];
  listDviChuDongTh: any[] = [];
  createRowUpdate: any = {};
  tongKphi: any;
  listCcdc: any = [];
  danhSachFileDinhKem: FileDinhKem[] = [];
  listFile: any[] = []

  create: any = {};
  editDataCache: { [key: string]: { edit: boolean; data: any } } = {};

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donViService: DonviService,
    private danhMucService: DanhMucService,
    private quanLyNghiemThuKeLotService: QuanLyNghiemThuKeLotService,
    private danhMucDinhMucCcdcService: DanhMucCongCuDungCuService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quanLyNghiemThuKeLotService);
    this.formData = this.fb.group(
      {
        id: [],
        nam: [dayjs().get('year')],
        maDvi: ['', [Validators.required]],
        maQhns: ['',],
        tenDvi: ['', [Validators.required]],
        idQdGiaoNvNh: ['', [Validators.required]],
        soQdGiaoNvNh: [, [Validators.required]],
        tgianNkho: [''],
        soLuongQdGiaoNvNh: [''],
        soBbNtBq: ['', [Validators.required]],
        ngayTao: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
        ngayNghiemThu: ['', [Validators.required]],

        tenNguoiTao: [''],
        tenThuKho: [''],
        tenKeToan: [''],
        tenNguoiPduyet: [''],

        loaiVthh: ['',],
        tenLoaiVthh: ['',],
        cloaiVthh: [''],
        tenCloaiVthh: [''],
        moTaHangHoa: [''],

        idDdiemGiaoNvNh: [, [Validators.required]],
        maDiemKho: ['', [Validators.required]],
        tenDiemKho: ['', [Validators.required]],
        maNhaKho: ['', [Validators.required]],
        tenNhaKho: ['', [Validators.required]],
        maNganKho: ['', [Validators.required]],
        tenNganKho: ['', [Validators.required]],
        maLoKho: [''],
        tenLoKho: [''],

        loaiHinhKho: [''],
        tichLuong: [''],

        idPhieuNhapKho: [],
        soPhieuNhapKho: [],
        soLuongPhieuNhapKho: [],
        hthucBquan: [''],
        pthucBquan: [''],
        dinhMucGiao: [''],
        dinhMucThucTe: [''],
        ketLuan: [''],

        lyDoTuChoi: [''],
        trangThai: [],
        tenTrangThai: [],
      }
    );

    // this.formData.controls["cloaiVthh"].valueChanges.subscribe(async (value) => {
    //   this.loadDataComboBox();
    // });

  }

  async ngOnInit() {
    this.spinner.show();
    super.ngOnInit();
    try {
      this.userInfo = this.userService.getUserLogin();
      await Promise.all([
        this.loadDataComboBox(),
        this.loadSoQuyetDinh(),
        this.loadDonViTinh(),
        this.loadListCcdc(),
      ]);
      if (this.id) {
        await this.loadChiTiet(this.id);
      } else {
        await this.initForm();
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async initForm() {
    let res = await this.userService.getId("BB_NGHIEM_THU_SEQ");
    this.formData.patchValue({
      soBbNtBq: `${res}/${this.formData.get('nam').value}/BBNTBQ-CCDTKVVP`,
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhmaQhnsns: this.userInfo.DON_VI.maQhns,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
      tenNguoiTao: this.userInfo.sub
    });
    if (this.idQdGiaoNvNh) {
      await this.bindingDataQd(this.idQdGiaoNvNh, true);
    }
  }

  async loadDataComboBox() {
    if (this.formData.value.cloaiVthh) {
      let res = await this.danhMucService.getDetail(this.formData.value.cloaiVthh);
      if (res.msg == MESSAGE.SUCCESS) {
        this.listPhuongThucBaoQuan = res.data?.phuongPhapBq
        this.listHinhThucBaoQuan = res.data?.hinhThucBq
      }
    }
    // // List phương thức bảo quản
    // this.listPhuongThucBaoQuan = [];
    // let resPtBq = await this.danhMucService.danhMucChungGetAll('PT_BAO_QUAN');
    // if (resPtBq.msg == MESSAGE.SUCCESS) {
    //   this.listPhuongThucBaoQuan = resPtBq.data;
    // }
  }

  isDisableField() {
    // if (this.detail && (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_THU_KHO || this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_KE_TOAN
    //   || this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.detail.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
    //   return true;
    // }
    return false;
  }

  async openDialogSoQd() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định kế hoạch giao nhiệm vụ nhập hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoQuyetDinh,
        dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng hóa'],
        dataColumn: ['soQd', 'ngayQdinh', 'tenLoaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        await this.bindingDataQd(dataChose.id, true);
      }
    });
  };

  async bindingDataQd(id, isSetTc?) {
    await this.spinner.show();
    let dataRes = await this.quyetDinhGiaoNhapHangService.getDetail(id)
    const data = dataRes.data;
    this.formData.patchValue({
      soQdGiaoNvNh: data.soQd,
      idQdGiaoNvNh: data.id,
      tgianNkho: data.tgianNkho,
      soLuongQdGiaoNvNh: data.soLuong * 1000,
      loaiVthh: data.loaiVthh,
      cloaiVthh: data.cloaiVthh,
      tenLoaiVthh: data.tenLoaiVthh,
      tenCloaiVthh: data.tenCloaiVthh,
      moTaHangHoa: data.moTaHangHoa,
    });
    let dataChiCuc = data.dtlList.filter(item => item.maDvi == this.userInfo.MA_DVI);
    if (dataChiCuc.length > 0) {
      this.listDiaDiemNhap = dataChiCuc[0].children;
    }
    this.loadDataComboBox();
    await this.spinner.hide();
  }

  openDialogDdiemNhapHang() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách địa điểm nhập hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDiaDiemNhap,
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho', 'SL theo QĐ giao NV NH'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho', 'soLuong']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      this.bindingDataDdNhap(data);
    });
  }

  async bindingDataDdNhap(data) {
    if (data) {
      this.listSoPhieuNhapKho = data.listPhieuNhapKho.filter(item => item.trangThai == STATUS.DA_DUYET_LDCC);
      this.listSoPhieuNhapKho.forEach(item => {
        let phieuKtraCL = data.listPhieuKtraCl.filter(x => x.soPhieu == item.soPhieuKtraCl)[0];
        item.soLuongThucNhap = phieuKtraCL ? phieuKtraCL.soLuongNhapKho : 0
      })
      await this.getNganKho(data.maLoKho ? data.maLoKho : data.maNganKho);
      this.formData.patchValue({
        idDdiemGiaoNvNh: data.id,
        maDiemKho: data.maDiemKho,
        tenDiemKho: data.tenDiemKho,
        maNhaKho: data.maNhaKho,
        tenNhaKho: data.tenNhaKho,
        maNganKho: data.maNganKho,
        tenNganKho: data.tenNganKho,
        maLoKho: data.maLoKho,
        tenLoKho: data.tenLoKho,
      })
    }
  }

  openSoPhieuNhapKho() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số phiếu nhập kho ',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoPhieuNhapKho,
        dataHeader: ['Số Phiếu nhập kho', 'Số phiếu kiểm tra CL', 'Số lượng thực nhập'],
        dataColumn: ['soPhieuNhapKho', 'soPhieuKtraCl', 'soLuongThucNhap']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      this.bindingDataSoPhieuNk(data);
    });
  }

  async bindingDataSoPhieuNk(data) {
    this.formData.patchValue({
      soPhieuNhapKho: data.soPhieuNhapKho,
      soLuongPhieuNhapKho: data.soLuongThucNhap
    })
  }


  async loadSoQuyetDinh() {
    let body = {
      "denNgayQd": null,
      "loaiQd": "",
      "maDvi": this.userInfo.MA_DVI,
      "loaiVthh": this.typeVthh,
      "namNhap": null,
      "ngayQd": "",
      "orderBy": "",
      "orderDirection": "",
      "paggingReq": {
        "limit": 1000,
        "orderBy": "",
        "orderType": "",
        "page": 0
      },
      "soHd": "",
      "soQd": null,
      "str": "",
      "trangThai": this.globals.prop.NHAP_BAN_HANH,
      "tuNgayQd": null,
      "veViec": null
    }
    let res = await this.quyetDinhGiaoNhapHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadChiTiet(id) {
    if (id > 0) {
      let res = await this.quanLyNghiemThuKeLotService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.listDviChuDongTh = res.data.children;
          if (this.listDviChuDongTh) {
            if (this.listDviChuDongTh && this.listDviChuDongTh.length > 0) {
              for (let i = 0; i < this.listDviChuDongTh.length; i++) {
                this.listDviChuDongTh[i].stt = i + 1;
              }
            }
          }
          else {
            this.listDviChuDongTh[0] = { id: null, stt: 0 };
          }
          this.helperService.bidingDataInFormGroup(this.formData, res.data);
          await this.bindingDataQd(res.data?.idQdGiaoNvNh);
          let dataDdNhap = this.listDiaDiemNhap.filter(item => item.id == res.data.idDdiemGiaoNvNh)[0];

          if (res.data.children1.length > 0) {
            res.data.children1.forEach(item => {
              this.danhSachFileDinhKem.push(item)
            })
          }

          this.bindingDataDdNhap(dataDdNhap);
        }
      }
    }
    this.updateEditCache();
  }

  // caculatorThanhTienTN() {
  //   if (this.detail && this.detail?.detail && this.detail?.detail.length > 0) {
  //     let sum = this.detail?.detail.map(item => item.thanhTienTn).reduce((prev, next) => prev + next);
  //     return sum ?? 0;
  //   }
  //   return 0;
  // }


  // caculatorThanhTienQT() {
  //   if (this.detail && this.detail?.detail && this.detail?.detail.length > 0) {
  //     let sum = this.detail?.detail.map(item => item.thanhTienQt).reduce((prev, next) => prev + next);
  //     return sum ?? 0;
  //   }
  //   return 0;
  // }

  convertTien(tien: number): string {
    return convertTienTobangChu(tien);
  }

  deleteRow(data: any) {
    this.create = this.listDviChuDongTh.filter(x => x.stt != data.stt);
    this.updateEditCache();
  }


  addRow() {
    this.listDviChuDongTh = [
      ...this.listDviChuDongTh,
      this.create
    ];
    this.clearItemRow();
  }

  startEdit(index: number): void {
    this.listDviChuDongTh[index].edit = true;
    this.createRowUpdate = cloneDeep(this.listDviChuDongTh[index]);
  }

  saveEdit(dataUpdate, index: any): void {
    this.listDviChuDongTh[index] = this.createRowUpdate;
    this.listDviChuDongTh[index].edit = false;
  }

  clearItemRow() {
    this.create = {};
  }

  convertDviTinh(maDviTinh: any) {
    return convertDviTinh(maDviTinh);
  }
  cancelEdit(stt: number): void {
    const index = this.listDviChuDongTh.findIndex(item => item.stt === stt);
    this.listDviChuDongTh[index].edit = false;
    // this.editDataCache[stt] = {
    //   data: { ...this.detail?.detail[index] },
    //   edit: false
    // };
  }


  updateEditCache(): void {
    if (this.create && this.create.length > 0) {
      this.listDviChuDongTh = [];
      this.create.forEach((item) => {
        this.listDviChuDongTh.push(item)
      });
    }
  }

  caculatorSoLuong(item: any) {
    if (item) {
      item.thanhTienTn = (item?.soLuongTn ?? 0) * (item?.donGiaTn ?? 0);
      item.tongGtri = parseInt(item?.thanhTienTn) + parseInt(item?.thanhTienQt);
    }
  }

  sumslKho(column?: string, tenDvi?: string, type?: string): number {
    let result = 0;
    let arr = [];
    this.listDviChuDongTh.forEach(item => {
      if (item) {
        arr.push(item)
      }
    })
    if (arr) {
      if (type) {
        const sum = arr.reduce((prev, cur) => {
          prev += parseInt(cur[column]);
          return prev;
        }, 0);
        result = sum
      }
    }
    this.tongKphi = result;
    return result;
  }

  sumslTn(column?: string, tenDvi?: string, type?: string): number {
    let result = 0;
    this.listDviChuDongTh.forEach(item => {
      if (item) {
        result += parseInt(item.soLuongTn)
      }
    })
    return result;
  }

  convertSoToChu(tien: number) {
    return convertTienTobangChu(tien);
  }


  async loadHinhThucBaoQuan() {
    let body = {
      "maHthuc": null,
      "paggingReq": {
        "limit": 1000,
        "page": 1
      },
      "str": null,
      "tenHthuc": null,
      "trangThai": null
    }
    let res = await this.danhMucService.loadDanhMucHinhThucBaoQuan(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content) {
        this.listHinhThucBaoQuan = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
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
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  // guiDuyet() {
  //   this.modal.confirm({
  //     nzClosable: false,
  //     nzTitle: 'Xác nhận',
  //     nzContent: 'Bạn có chắc chắn muốn gửi duyệt?',
  //     nzOkText: 'Đồng ý',
  //     nzCancelText: 'Không',
  //     nzOkDanger: true,
  //     nzWidth: 310,
  //     nzOnOk: async () => {
  //       this.spinner.show();
  //       try {
  //         await this.save(true);
  //         this.pheDuyet()
  //       } catch (e) {
  //         console.log('error: ', e);
  //         this.spinner.hide();
  //         this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
  //       }
  //     },
  //   });
  // }

  getNameFile(event?: any) {
    // const element = event.currentTarget as HTMLInputElement;
    // const fileList: FileList | null = element.files;
    // if (fileList) {
    //   this.nameFile = fileList[0].name;
    // }
    // this.formData.patchValue({
    //   file: event.target.files[0] as File,
    // });
    // if (this.dataCanCuXacDinh) {
    //   this.formTaiLieuClone.file = this.nameFile;
    //   this.isSave = !isEqual(this.formTaiLieuClone, this.formTaiLieu);
    // }
  }

  pheDuyet() {
    let trangThai = ''
    switch (this.formData.value.trangThai) {
      case STATUS.TU_CHOI_LDCC:
      case STATUS.TU_CHOI_KT:
      case STATUS.TU_CHOI_TK:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_TK;
        break;
      }
      case STATUS.CHO_DUYET_TK: {
        trangThai = STATUS.CHO_DUYET_KT;
        break;
      }
      case STATUS.CHO_DUYET_KT: {
        trangThai = STATUS.CHO_DUYET_LDCC;
        break;
      }
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.DA_DUYET_LDCC;
        break;
      }
    }
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
            trangThai: trangThai,
          };
          let res =
            await this.quanLyNghiemThuKeLotService.approve(
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
    let trangThai = ''
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_TK: {
        trangThai = STATUS.TU_CHOI_TK;
        break;
      }
      case STATUS.CHO_DUYET_KT: {
        trangThai = STATUS.TU_CHOI_KT;
        break;
      }
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.TU_CHOI_LDCC;
        break;
      }
    }
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
            trangThai: trangThai,
          };
          let res =
            await this.quanLyNghiemThuKeLotService.approve(
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

  async save(isGuiDuyet: boolean) {
    if (this.validateSave()) {
      try {
        this.spinner.show();
        this.helperService.markFormGroupTouched(this.formData);
        if (this.formData.invalid) {
          await this.spinner.hide();
          return;
        }
        let body = this.formData.value;
        body.detail = this.listDviChuDongTh;
        // body.detailDm = this.detail;
        if (this.danhSachFileDinhKem.length > 0) {
          this.danhSachFileDinhKem.forEach(item => {
            this.listFile.push(item)
          })
        }
        body.fileDinhKems = this.listFile;
        let res;
        if (this.formData.get('id').value > 0) {
          res = await this.quanLyNghiemThuKeLotService.update(body);
        } else {
          res = await this.quanLyNghiemThuKeLotService.create(body);
        }
        if (res.msg == MESSAGE.SUCCESS) {
          if (isGuiDuyet) {
            await this.spinner.hide();
            this.id = res.data.id;
            this.pheDuyet();
          } else {
            if (this.formData.get('id').value) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
              this.back();
            } else {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
              this.back();
            }
            await this.spinner.hide();
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
          await this.spinner.hide();
        }
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      } finally {
        this.spinner.hide();
      }
    }

  }

  validateSave() {
    return true;
  }

  thongTinTrangThai(trangThai: string): string {
    return thongTinTrangThaiNhap(trangThai);
  }

  print() {

  }

  changeCcdc(): void {
    let item;
    item = this.listCcdc.filter(item => item.maCcdc == this.create.noiDung)[0];
    if (item) {
      this.create.dvt = item.donViTinh;
    }
  }

  async loadListCcdc() {
    this.listCcdc = [];
    let body = {
      trangThai: '01',
      paggingReq: {
        limit: 10000,
        page: 0,
      }
    };
    let res = await this.danhMucDinhMucCcdcService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content && res.data.content.length > 0) {
        for (let item of res.data.content) {
          this.listCcdc.push(item);
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  };

  convertMaCcdc(maCcdc: string) {
    return convertMaCcdc(maCcdc);
  }

  async getNganKho(maDvi: any) {
    if (maDvi) {
      let res = await this.quanLyNghiemThuKeLotService.getDataKho(maDvi);

      this.formData.patchValue({
        tichLuong: (res.data.tichLuongTkLt - res.data.tichLuongKdLt) > 0 ? res.data.tichLuongTkLt - res.data.tichLuongKdLt : 0,
        loaiHinhKho: res.data.lhKho
      });
    }
  }
}
