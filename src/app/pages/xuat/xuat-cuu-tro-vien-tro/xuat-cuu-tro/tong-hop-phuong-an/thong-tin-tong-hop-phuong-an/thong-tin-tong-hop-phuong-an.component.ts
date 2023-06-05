import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output,} from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import * as dayjs from 'dayjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {DialogTuChoiComponent} from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import {MESSAGE} from 'src/app/constants/message';
import {FileDinhKem} from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import {DiaDiemGiaoNhan, KeHoachBanDauGia, PhanLoTaiSan,} from 'src/app/models/KeHoachBanDauGia';
import {UserLogin} from 'src/app/models/userlogin';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {DanhMucTieuChuanService} from 'src/app/services/quantri-danhmuc/danhMucTieuChuan.service';
import {DeXuatKeHoachBanDauGiaService} from 'src/app/services/deXuatKeHoachBanDauGia.service';
import {DonviService} from 'src/app/services/donvi.service';
import {TinhTrangKhoHienThoiService} from 'src/app/services/tinhTrangKhoHienThoi.service';
import {thongTinTrangThaiNhap} from 'src/app/shared/commonFunction';
import {STATUS} from 'src/app/constants/status';
import {
  TongHopPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/TongHopPhuongAnCuuTro.service";
import {
  DialogDanhSachHangHoaComponent
} from "src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component";
import {DatePipe} from "@angular/common";
import {Base2Component} from "src/app/components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "src/app/services/storage.service";
import {
  DeXuatPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/DeXuatPhuongAnCuuTro.service";
import * as uuid from "uuid";
import {chain} from 'lodash';

@Component({
  selector: 'app-thong-tin-tong-hop-phuong-an',
  templateUrl: './thong-tin-tong-hop-phuong-an.component.html',
  styleUrls: ['./thong-tin-tong-hop-phuong-an.component.scss']
})
export class ThongTinTongHopPhuongAnComponent extends Base2Component implements OnInit {
  @Input() loaiVthhInput: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() isViewOnModal: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() id: number;
  STATUS = STATUS;
  maTongHop: string;
  formData: FormGroup;
  cacheData: any[] = [];
  fileDinhKem: Array<FileDinhKem> = [];
  userLogin: UserLogin;
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
  userInfo: UserLogin;
  listFileDinhKem: any[] = [];
  expandSetView = new Set<number>();
  expandSetEdit = new Set<number>();
  bangPhanBoList: Array<any> = [];
  khBanDauGia: KeHoachBanDauGia = new KeHoachBanDauGia();
  diaDiemGiaoNhan: DiaDiemGiaoNhan = new DiaDiemGiaoNhan();
  diaDiemGiaoNhanList: Array<DiaDiemGiaoNhan> = [];
  phanLoTaiSanList: Array<PhanLoTaiSan> = [];
  listChungLoaiHangHoa: any[] = [];
  maKeHoach: string;
  listLoaiHopDong: any[] = [];
  listLoaiHinhNhapXuat: any[] = [];
  thongTinChiTiet: any[];
  thongTinChiTietTh: any[];
  tongSoLuongDxuat = 0;
  tongSoLuongTongHop = 0;
  tongThanhTienDxuat = 0;
  tongThanhTienTongHop = 0;
  tongHopEdit: any = [];
  datePipe = new DatePipe('en-US');
  isVisible = false;

  isVisibleTuChoiDialog = false;
  isQuyetDinh: boolean = false;
  listThanhTien: number[];
  listSoLuong: number[];
  phuongAnView: any;
  expandSetString = new Set<string>();
  listKieuNhapXuat: any;
  listHangHoaAll: any;
  dsDonVi: any;
  tongThanhTien: any;
  tongSoLuong: any;
  tongSoLuongDeXuat: any;
  tongSoLuongXuatCap: any;


  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private deXuatKeHoachBanDauGiaService: DeXuatKeHoachBanDauGiaService,
    private donViService: DonviService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private dmTieuChuanService: DanhMucTieuChuanService,
    private deXuatPhuongAnCuuTroService: DeXuatPhuongAnCuuTroService,
    private tongHopPhuongAnCuuTroService: TongHopPhuongAnCuuTroService,
    private cdr: ChangeDetectorRef,
  ) {
    super(httpClient, storageService, notification, spinner, modal, tongHopPhuongAnCuuTroService);
    this.formData = this.fb.group(
      {
        id: [0],
        // nam: [dayjs().get("year")],
        nam: [''],
        maDvi: [''],
        maTongHop: [''],
        ngayThop: [''],
        noiDungThop: [''],
        loaiNhapXuat: ['',[Validators.required]],
        loaiVthh: ['',[Validators.required]],
        cloaiVthh: [''],
        trangThai: [''],
        idQdPd: [''],
        soQdPd: [''],
        ngayKyQd: [''],
        ngayGduyet: [''],
        nguoiGduyetId: [''],
        ngayPduyet: [''],
        nguoiPduyetId: [''],
        lyDoTuChoi: [''],
        tongSlCtVt: [0],
        tongSlXuatCap: [0],
        tenLoaiVthh: [''],
        tenCloaiVthh: [''],
        tenTrangThai: [''],
        tenDvi: [''],
        donViTinh: [''],
        deXuatCuuTro: [new Array()]
      }
    );
    this.userInfo = this.userService.getUserLogin();
    //this.maTongHop = '/' + this.userInfo.MA_TCKT;
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
  }

  async ngOnInit() {
    try {
      this.spinner.show();
      //this.loadDonVi();
      await Promise.all([
        this.loadDsLoaiHinhNhapXuat(),
        this.loadDsKieuNhapXuat(),
        this.loadDsVthh(),
        this.loadDsDonVi(),

      ])
      await this.loadDetail(this.idInput);
      console.log(this.formData.value);
      this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      this.spinner.hide();
    }
  }

  async loadDsLoaiHinhNhapXuat() {
    let res = await this.danhMucService.danhMucChungGetAll("LOAI_HINH_NHAP_XUAT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNhapXuat = res.data.filter(item => item.apDung?.includes('XUAT_CTVT'));
    }
  }

  async loadDsKieuNhapXuat() {
    let res = await this.danhMucService.danhMucChungGetAll("KIEU_NHAP_XUAT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listKieuNhapXuat = res.data.filter(item => item.apDung?.includes('XUAT_CTVT'));
    }
  }

  // async loadDsVthh() {
  //   let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
  //   if (res.msg == MESSAGE.SUCCESS) {
  //     this.listHangHoaAll = res.data;
  //     this.listLoaiHangHoa = res.data?.filter((x) => x.ma.length == 4);
  //     this.formData.patchValue({ loaiVthh: "0101" });
  //   }
  // }

  async loadDsVthh() {
    let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHangHoaAll = res.data;
      this.listLoaiHangHoa = res.data?.filter((x) => (x.ma.length == 2 && !x.ma.match("^01.*")) || (x.ma.length == 4 && x.ma.match("^01.*")));
      this.formData.patchValue({loaiVthh: "0101"});
    }
  }

  async loadDsDonVi() {
    let body = {
      trangThai: "01",
      maDviCha: this.userInfo.MA_DVI,
      type: "DV"
    };
    let res = await this.donViService.getDonViTheoMaCha(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsDonVi = res.data;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async luu() {
    if (this.save()) {
      this.quayLai();
    }
  }

  async save() {
    this.formData.disable();
    let result = await this.createUpdate(this.formData.value);
    this.formData.enable();
    if (result) {
      this.quayLai();
    }
  }

  /* async saveAndSend() {
     let currentData = await this.createUpdate(this.formData.value);
     await this.approve(currentData.id, STATUS.CHO_DUYET_LDV, 'Bạn có muốn gửi duyệt ?');
   }*/

  async guiDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Lưu thông tin',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        this.helperService.markFormGroupTouched(this.formData);
        if (this.formData.invalid) {
          let invalid = [];
          let controls = this.formData.controls;
          for (const name in controls) {
            if (controls[name].invalid) {
              invalid.push(name);
            }
          }
          console.log(invalid, 'invalid');
          this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đủ thông tin.');
          return;
        } else {
          try {
            this.spinner.show();
            //gui duyet
            let body = {
              id: this.idInput,
              trangThai: STATUS.CHO_DUYET_LDV
            };
            let res = await this.tongHopPhuongAnCuuTroService.approve(body);
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
          } catch (e) {
            console.log(e)
          } finally {
            this.spinner.hide();
            this.quayLai();
          }
        }
      }
    });
  }

  async luuVaGuiDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc muốn lưu và gửi duyệt ?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        this.helperService.markFormGroupTouched(this.formData);
        if (this.formData.invalid) {
          let invalid = [];
          let controls = this.formData.controls;
          for (const name in controls) {
            if (controls[name].invalid) {
              invalid.push(name);
            }
          }
          console.log(invalid, 'invalid');
          this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đủ thông tin.');
          return;
        } else {
          try {
            this.spinner.show();
            await this.save();
            //gui duyet
            let body = {
              id: this.idInput,
              trangThai: STATUS.CHO_DUYET_LDV
            };
            let res = await this.tongHopPhuongAnCuuTroService.approve(body);
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
          } catch (e) {
            console.log(e)
          } finally {
            this.spinner.hide();
            this.quayLai();
          }
        }
      }
    });
  }

  quayLai() {
    this.showListEvent.emit();
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
      case this.globals.prop.NHAP_DU_THAO: {
        this.titleStatus = 'Dự thảo';
        break;
      }
      case this.globals.prop.NHAP_TU_CHOI_TP: {
        this.iconButtonDuyet = 'htvbdh_tcdt_guiduyet';
        this.titleButtonDuyet = 'Lưu và gửi duyệt';
        this.titleStatus = 'Từ chối - TP';
        break;
      }
      case this.globals.prop.NHAP_CHO_DUYET_TP: {
        this.iconButtonDuyet = 'htvbdh_tcdt_pheduyet';
        this.titleButtonDuyet = 'Duyệt';
        this.titleStatus = 'Chờ duyệt - TP';
        break;
      }
      case this.globals.prop.NHAP_CHO_DUYET_LD_CUC: {
        this.iconButtonDuyet = 'htvbdh_tcdt_baocao2';
        this.titleButtonDuyet = 'Duyệt';
        this.titleStatus = 'Chờ duyệt - LĐ Cục';
        break;
      }
      case this.globals.prop.NHAP_TU_CHOI_LD_CUC: {
        this.iconButtonDuyet = 'htvbdh_tcdt_guiduyet';
        this.titleButtonDuyet = 'Lưu và gửi duyệt';
        this.titleStatus = 'Từ chối - LĐ Cục';
        break;
      }
      case this.globals.prop.NHAP_BAN_HANH: {
        this.titleStatus = 'Ban hành';
        this.styleStatus = 'da-ban-hanh';
        break;
      }
    }
  }

  async loadDetail(id: number) {
    if (id > 0) {
      await this.tongHopPhuongAnCuuTroService.getDetail(id)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.formData.patchValue(res.data);
            this.selectRow(this.formData.value.deXuatCuuTro[0])
            this.summaryData();
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      this.formData.patchValue({
        trangThai: STATUS.DU_THAO,
        tenTrangThai: 'Dự thảo',
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI
      })
      this.tongThanhTien = 0;
      this.tongSoLuong = 0;
      this.tongSoLuongDeXuat = 0;
      this.tongSoLuongXuatCap = 0;
    }
  }

  async synthetic() {
    // this.formData.controls['tenDvi'].setValidators([]);
    this.formData.controls['ngayThop'].setValidators([]);
    this.formData.controls['noiDungThop'].setValidators([]);
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đủ thông tin.');
      return;
    } else {
      try {
        await this.spinner.show();
        let body = {
          loaiNhapXuat: this.formData.value.loaiNhapXuat,
          trangThaiList: [STATUS.DA_TAO_CBV, STATUS.DA_DUYET_LDC],
          nam: this.formData.get('nam').value,
          loaiVthh: this.formData.get('loaiVthh').value,

        }
        await this.tongHopPhuongAnCuuTroService.tonghop(body).then(async res => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (!this.maTongHop) {
              this.maTongHop = res.data.id;
            }
            this.formData.patchValue({
              deXuatCuuTro: res.data.deXuatCuuTro,
              maTongHop: this.maTongHop
            });
            if (this.formData.value.deXuatCuuTro) {
              this.selectRow(this.formData.value.deXuatCuuTro[0])
            }
            this.summaryData()
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        });
      } catch (e) {
        console.log(e)
      } finally {
        await this.spinner.hide();
        this.formData.controls['loaiNhapXuat'].setValidators([Validators.required]);
        this.formData.controls['tenDvi'].setValidators([Validators.required]);
        this.formData.controls['ngayThop'].setValidators([Validators.required]);
        this.formData.controls['noiDungThop'].setValidators([Validators.required]);

      }
    }

  }

  async dsLoaiHinhNhapXuat() {
    let res = await this.danhMucService.danhMucChungGetAll("LOAI_HINH_NHAP_XUAT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNhapXuat = res.data.filter(item =>
        item.phanLoai == 'XUAT_CTVT'
      )
      ;
    }
  }

  thongTinTrangThai(trangThai: string): string {
    return thongTinTrangThaiNhap(trangThai);
  }

  openDialogHangHoa() {
    if (!this.isView) {
      let data = this.formData.value.loaiVthh;
      const modalTuChoi = this.modal.create({
        nzTitle: 'Danh sách hàng hóa',
        nzContent: DialogDanhSachHangHoaComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          onlyLuongThuc: true,
        },
      });
      modalTuChoi.afterClose.subscribe(async (data) => {
        if (data) {
          this.formData.patchValue({
            loaiVthh: data.parent.ma,
            tenLoaiVthh: data.parent.ten,
            cloaiVthh: data.ma,
            tenCloaiVthh: data.ten,
          });
        }
      });
    }
  }

  buildChiTietPhuongAn(data: any) {
    let dataResult = [];
    let dataGroup = data.reduce(function (acc, obj) {
      var key = obj['maDvi'];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});
    let thongTinChiTiet = []
    data.forEach(s => {
        //
        /*s.thongTinChiTiet.forEach(x => {
          x.maDvi = s.maDvi;
          thongTinChiTiet.push(x);
        })
        this.formData.patchValue({thongTinTongHop: thongTinChiTiet, thongTinDeXuat: thongTinChiTiet,})*/

        //
        if (!dataResult.some(r => r.maDvi == s.maDvi)) {
          let thongTinChiTietArr = [];
          dataGroup[s.maDvi].forEach(x => {
              if (x.thongTinChiTiet) {
                x.thongTinChiTiet?.forEach(y => {
                  y.idVirtual = new Date().getTime() + y.id;
                  y.ngayDxuat = x.ngayDxuat;
                  y.thoiGianThucHien = x.thoiGianThucHien;
                  thongTinChiTietArr = [...thongTinChiTietArr, y];
                })
              } else {
                //truong hop obj tong hop
                x.idVirtual = new Date().getTime() + x.id;
                thongTinChiTietArr = [...thongTinChiTietArr, x];
              }
            }
          )
          dataResult.push({
            idVirtual: new Date().getTime() + s.id,
            maDvi: s.maDvi,
            tenDvi: s.tenDvi,
            tongSoLuong: s.tongSoLuong,
            soLuong: s.soLuong,
            ngayDxuat: s.ngayDxuat,
            thoiGianThucHien: s.thoiGianThucHien,
            thongTinChiTiet: thongTinChiTietArr
          })
        }
      }
    )
    return dataResult;
  };

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.thongTinChiTietTh.forEach(s => {
      if (s.idVirtual == this.tongHopEdit.idVirtual) {
        s.thongTinChiTiet = this.tongHopEdit.thongTinChiTiet;
      }
    });
    this.summaryData();
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.isVisibleTuChoiDialog = false;
  }

  summaryData() {
    this.tongSoLuongDxuat = this.formData.value.deXuatCuuTro.reduce((prev, cur) => prev + cur.tongSoLuongDx, 0)
    this.tongThanhTienDxuat = this.formData.value.deXuatCuuTro.reduce((prev, cur) => prev + cur.thanhTienDx, 0)
  }

  checkAvailableByStatus(nextStatus: String) {
    let currentStatus = this.formData.get('trangThai').value;
    //gui duyet
    if (currentStatus == STATUS.DU_THAO && nextStatus == STATUS.CHO_DUYET_LDV) {
      return true;
    } else if (currentStatus == STATUS.TU_CHOI_LDV && nextStatus == STATUS.CHO_DUYET_LDV) {
      return true;
    }

    //duyet
    else if (currentStatus == STATUS.CHO_DUYET_LDV && nextStatus == STATUS.DA_DUYET_LDV) {
      return true;
    }
    //tu choi
    else if (currentStatus == STATUS.CHO_DUYET_LDV && nextStatus == STATUS.TU_CHOI_LDV) {
      return true;
    }

    //tao qd
    else if (currentStatus == STATUS.DA_DUYET_LDV && nextStatus == STATUS.CHUA_TAO_QD) {
      return true;
    }
    return false;
  }

  async updateStatus(status: string, title: string) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: title,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            trangThai: status,
            lyDo: this.formData.get('lyDoTuChoi').value
          };
          let res = await this.tongHopPhuongAnCuuTroService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
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

  showModalDialogTuChoi(): void {
    this.isVisibleTuChoiDialog = true;
  }

  taoQuyetDinh() {
    /*let elem = document.getElementById('mainTongCuc');
    let tabActive = elem.getElementsByClassName('ant-menu-item')[1];
    tabActive.classList.remove('ant-menu-item-selected')
    let setActive = elem.getElementsByClassName('ant-menu-item')[2];
    setActive.classList.add('ant-menu-item-selected');*/
    this.isQuyetDinh = true;
  }

  expandAll() {
    this.phuongAnView.forEach(s => {
      this.expandSetString.add(s.idVirtual);
    })
  }

  onExpandStringChange(id: string, checked: boolean) {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }

  buildTableView() {
    let dataView = chain(this.formData.value.deXuatPhuongAn)
      .groupBy("noiDung")
      .map((value, key) => {
        let rs = chain(value)
          .groupBy("tenCuc")
          .map((v, k) => {
              let soLuongXuatCucThucTe = v.reduce((prev, cur) => prev + cur.soLuongXuatChiCuc, 0);
              let thanhTienXuatCucThucTe = v.reduce((prev, cur) => prev + cur.thanhTien, 0);
              let rowCuc = v.find(s => s.tenCuc === k);
              if (this.userService.isCuc()) {
                rowCuc.tonKhoCuc = this.formData.value.tonKho;
              }
              return {
                idVirtual: uuid.v4(),
                tenCuc: k,
                soLuongXuatCuc: rowCuc.soLuongXuatCuc,
                soLuongXuatCucThucTe: soLuongXuatCucThucTe,
                thanhTienXuatCucThucTe: thanhTienXuatCucThucTe,
                tenCloaiVthh: rowCuc.tenCloaiVthh,
                tonKhoCuc: rowCuc.tonKhoCuc,
                childData: v
              }
            }
          ).value();
        let soLuongXuat = rs.reduce((prev, cur) => prev + cur.soLuongXuatCuc, 0);
        let soLuongXuatThucTe = rs.reduce((prev, cur) => prev + cur.soLuongXuatCucThucTe, 0);
        let thanhTienXuatThucTe = rs.reduce((prev, cur) => prev + cur.thanhTienXuatCucThucTe, 0);

        return {
          idVirtual: uuid.v4(),
          noiDung: key,
          soLuongXuat: soLuongXuat,
          soLuongXuatThucTe: soLuongXuatThucTe,
          thanhTienXuatThucTe: thanhTienXuatThucTe,
          childData: rs
        };
      }).value();
    this.phuongAnView = dataView
    console.log(this.formData.value.deXuatPhuongAn, 'this.formData.value.deXuatPhuongAn');
    console.log(this.phuongAnView, 'this.phuongAnView')
    this.expandAll()
    //
    if (this.formData.value.deXuatPhuongAn.length !== 0) {
      this.tongThanhTien = this.formData.value.deXuatPhuongAn.reduce((prev, cur) => prev + cur.thanhTien, 0);
      this.tongSoLuong = this.formData.value.deXuatPhuongAn.reduce((prev, cur) => prev + cur.soLuongXuatChiCuc, 0);
      this.tongSoLuongDeXuat = this.phuongAnView.reduce((prev, cur) => prev + cur.soLuongXuat, 0);
      let listXuatCap = this.phuongAnView.map(s => {
        let tongTonKhoCuc = s.childData.reduce((prev, cur) => prev + cur.tonKhoCuc, 0);
        let tongDeXuat = s.childData.reduce((prev, cur) => prev + cur.soLuongXuatCuc, 0);
        let tongThucXuat = s.childData.reduce((prev, cur) => prev + cur.soLuongXuatCucThucTe, 0);
        console.log(tongTonKhoCuc, tongDeXuat, tongThucXuat)
        if (tongDeXuat > tongThucXuat && tongThucXuat >= tongTonKhoCuc) {
          return tongDeXuat - tongTonKhoCuc;
        } else {
          return 0
        }
      });
      console.log(listXuatCap, 'listXuatCap')
      this.tongSoLuongXuatCap = listXuatCap.reduce((prev, cur) => prev + cur, 0);
    } else {
      this.tongThanhTien = 0;
      this.tongSoLuong = 0;
      this.tongSoLuongDeXuat = 0;
      this.tongSoLuongXuatCap = 0;
    }
    this.formData.patchValue({donViTinh: this.listLoaiHangHoa.find(s => s.ma == this.formData.value.loaiVthh)?.maDviTinh})
  }

  async selectRow(item: any) {
    if (!item.selected) {
      this.formData.value.deXuatCuuTro.forEach(i => i.selected = false);
      item.selected = true;
      await this.deXuatPhuongAnCuuTroService.getDetail(item.idDx)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            res.data.deXuatPhuongAn.forEach(s => s.idVirtual = uuid.v4());
            this.formData.value.deXuatPhuongAn = res.data.deXuatPhuongAn;
            this.buildTableView();
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
  }
}
