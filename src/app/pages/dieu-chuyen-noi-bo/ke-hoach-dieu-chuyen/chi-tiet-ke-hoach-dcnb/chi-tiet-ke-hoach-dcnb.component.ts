import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup, Validators} from "@angular/forms";
import {UserLogin} from "../../../../models/userlogin";
import {DiaDiemGiaoNhan, KeHoachBanDauGia} from "../../../../models/KeHoachBanDauGia";
import {DatePipe} from "@angular/common";
import {
  ModalInput
} from "../../../xuat/xuat-cuu-tro-vien-tro/xuat-cuu-tro/xay-dung-phuong-an/thong-tin-xay-dung-phuong-an/thong-tin-xay-dung-phuong-an.component";
import {Base2Component} from "../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DanhMucService} from "../../../../services/danhmuc.service";
import {DonviService} from "../../../../services/donvi.service";
import {TinhTrangKhoHienThoiService} from "../../../../services/tinhTrangKhoHienThoi.service";
import {DanhMucTieuChuanService} from "../../../../services/quantri-danhmuc/danhMucTieuChuan.service";
import {QuanLyHangTrongKhoService} from "../../../../services/quanLyHangTrongKho.service";
import * as dayjs from "dayjs";
import {MESSAGE} from "../../../../constants/message";
import {STATUS} from "src/app/constants/status";
import {chain, cloneDeep} from 'lodash';
import * as uuid from "uuid";
import {KeHoachDieuChuyenService} from "../ke-hoach-dieu-chuyen.service";
import {DanhMucDungChungService} from "../../../../services/danh-muc-dung-chung.service";
import {MangLuoiKhoService} from "../../../../services/qlnv-kho/mangLuoiKho.service";
import {OldResponseData} from "../../../../interfaces/response";

@Component({
  selector: 'app-chi-tiet-ke-hoach-dcnb',
  templateUrl: './chi-tiet-ke-hoach-dcnb.component.html',
  styleUrls: ['./chi-tiet-ke-hoach-dcnb.component.scss']
})
export class ChiTietKeHoachDcnbComponent extends Base2Component implements OnInit {
  @Input() loaiVthhInput: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() isViewOnModal: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

  formData: FormGroup;
  tongDuToanChiPhi: number = 0;
  formDataChiTiet: FormGroup;
  fileDinhKem: any[] = [];
  userLogin: UserLogin;
  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  titleStatus: string = '';
  titleButtonDuyet: string = '';
  iconButtonDuyet: string = '';
  styleStatus: string = 'du-thao-va-lanh-dao-duyet';
  tabSelected: string = 'thongTinChung';
  listNam: any[] = [];
  listHinhThucDvCcDvVanChuyen: any[];
  listPtGiaoHang: any[];
  listPtNhanHang: any[];
  listNguonChi: any[];
  listHangHoaAll: any[] = [];
  listLoaiHangHoa: any[] = [];
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  userInfo: UserLogin;
  expandSet = new Set<number>();
  bangPhanBoList: Array<any> = [];
  khBanDauGia: KeHoachBanDauGia = new KeHoachBanDauGia();
  diaDiemGiaoNhan: DiaDiemGiaoNhan = new DiaDiemGiaoNhan();
  listChungLoaiHangHoa: any[] = [];
  listLoaiHopDong: any[] = [];
  STATUS = STATUS;
  datePipe = new DatePipe('en-US');
  tongTien = 0;
  diaDiemNhapKho: any[] = [];
  expandSetString = new Set<string>();
  tableView = [];
  tableEdit = [];
  isEditDetail: boolean = false;
  phuongAnView = [];
  isVisible = false;
  isAddDiemKho = false;
  isVisibleSuaChiCuc = false;
  isNhanDieuChuyen = false;
  listNoiDung = []
  tongThanhTien: any;
  tongSoLuong: any;
  tongSoLuongDeXuat: any;
  tongSoLuongXuatCap: any;
  errorInputComponent: any[] = [];
  disableInputComponent: ModalInput = new ModalInput();
  dsDonVi: any;
  dsDonViNhan: any[] = [];
  dataChiCuc: any = [];
  listChiCucNhan: any[] = [];
  listDiemKhoBq: any[] = [];
  listDiemKhoNhanBq: any[] = [];
  listNhaKhoBq: any[] = [];
  listNhaKhoNhanBq: any[] = [];
  listNganKhoBq: any[] = [];
  listNganKhoNhanBq: any[] = [];
  listLoKhoBq: any[] = [];
  listLoKhoNhanBq: any[] = [];

  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private danhMucService: DanhMucService,
              private donViService: DonviService,
              private mangLuoiKhoService: MangLuoiKhoService,
              private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
              private dmTieuChuanService: DanhMucTieuChuanService,
              private keHoachDieuChuyenService: KeHoachDieuChuyenService,
              private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
              private dmService: DanhMucDungChungService,
              private cdr: ChangeDetectorRef,) {
    super(httpClient, storageService, notification, spinner, modal, keHoachDieuChuyenService);
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
    this.formData = this.fb.group(
      {
        id: [undefined],
        parentId: [undefined],
        nam: [dayjs().get("year"), [Validators.required]],
        maDvi: ['', [Validators.required]],
        maDviCuc: ['', [Validators.required]],
        tenDviCuc: ['', [Validators.required]],
        MaDviPq: [''],
        soDxuat: [''],
        ngayLapKh: [''],
        maCucNhan: [''],
        tenCucNhan: [''],
        trichYeu: ['',],
        trangThai: [STATUS.DU_THAO],
        idQdPd: [''],
        soQdPd: [''],
        ngayGduyet: [''],
        nguoiGduyetId: [''],
        ngayPduyet: [''],
        nguoiPduyetId: [''],
        ngayDuyetLdcc: [''],
        nguoiDuyetLdccId: [''],
        lyDoTuChoi: [''],
        tenDvi: [''],
        tenTrangThai: ['Dự Thảo'],
        danhSachHangHoa: [],
        canCu: [],
        lyDoDc: ['', [Validators.required]],
        loaiDc: ['CHI_CUC', [Validators.required]],
        tenLoaiDc: ['Giữa 2 chi cục trong cùng 1 cục', [Validators.required]],
        type: ['DC', [Validators.required]],
        trachNhiemDviTh: ['', [Validators.required]]
      }
    );
    this.formDataChiTiet = this.fb.group(
      {
        id: [undefined],
        parentId: [undefined],
        idVirtual: [''],
        maChiCucNhan: ['', [Validators.required]],
        tenChiCucNhan: ['', [Validators.required]],
        thoiGianDkDc: ['', [Validators.required]],
        maDiemKho: ['', [Validators.required]],
        tenDiemKho: ['', [Validators.required]],
        maNhaKho: ['', [Validators.required]],
        tenNhaKho: ['', [Validators.required]],
        maNganKho: ['', [Validators.required]],
        tenNganKho: ['', [Validators.required]],
        coLoKho: [true, [Validators.required]],
        maLoKho: ['', [Validators.required]],
        tenLoKho: ['', [Validators.required]],
        soLuongDc: [0, [Validators.required]],
        duToanKphi: [0, [Validators.required]],
        loaiVthh: ['', [Validators.required]],
        cloaiVthh: [''],
        tenLoaiVthh: ['', [Validators.required]],
        tenCloaiVthh: ['', [Validators.required]],
        donViTinh: ['', [Validators.required]],
        tenDonViTinh: ['', [Validators.required]],
        tonKho: [0, [Validators.required]],
        hdrId: [undefined],
        maDiemKhoNhan: ['', [Validators.required]],
        tenDiemKhoNhan: ['', [Validators.required]],
        maNhaKhoNhan: ['', [Validators.required]],
        tenNhaKhoNhan: ['', [Validators.required]],
        maNganKhoNhan: ['', [Validators.required]],
        tenNganKhoNhan: ['', [Validators.required]],
        coLoKhoNhan: [true, [Validators.required]],
        maLoKhoNhan: ['', [Validators.required]],
        tenLoKhoNhan: ['', [Validators.required]],
        soLuongPhanBo: [0, [Validators.required]],
        tichLuongKd: [0, [Validators.required]],
        slDcConLai: [0, [Validators.required]]
      }
    );
    this.userInfo = this.userService.getUserLogin();
    this.dataChiCuc = [{maDvi: this.userInfo.MA_DVI, tenDvi: this.userInfo.TEN_DVI}]
  }

  async ngOnInit() {
    try {
      this.spinner.show();
      //this.loadDonVi();
      await Promise.all([
        this.loadDsVthh(),
        this.loadDsCuc(),
        this.loadDsChiCuc(),
        this.getListDiemKho(this.userInfo.MA_DVI),
        this.getListDiemKhoNhanBq(this.userInfo.MA_DVI),
        this.getListHinhThucDvCcDvVanChuyen(),
        this.getListPtGiaoHang(),
        this.getListNguonChi(),
        this.getListPtNhanHang()
      ])

      await this.loadDetail(this.idInput)
      this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }

  async loadDsVthh() {
    let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHangHoaAll = res.data;
      this.listLoaiHangHoa = res.data?.filter((x) => (x.ma.length == 2 && !x.ma.match("^01.*")) || (x.ma.length == 4 && x.ma.match("^01.*")));
    }
  }

  async loadDsCuc() {
    let body = {
      trangThai: "01",
      maDviCha: this.userInfo.MA_DVI.substring(0, 4),
      type: "DV"
    };
    let res = await this.donViService.getDonViTheoMaCha(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsDonViNhan = Array.isArray(res.data) ? res.data.filter(f => {
        return f.maDvi !== this.userInfo.MA_DVI.substring(0, 6)
      }) : [];
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    let resDonVi = await this.donViService.getDonVi({str: this.userInfo.MA_DVI?.slice(0, -2)});
    if (resDonVi.msg == MESSAGE.SUCCESS) {
      this.dsDonVi = [resDonVi.data];
      if (this.dsDonVi) {

        let tenDviCuc = this.dsDonVi.find(item => item.maDvi === this.formData.value.maDviCuc);
        if (tenDviCuc) {
          this.formData.controls['tenDviCuc'].patchValue({tenDviCuc: tenDviCuc.tenDvi});
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadDsChiCuc(value?) {
    let body = {
      trangThai: "01",
      maDviCha: value ? value.maCucNhan ? value.maCucNhan : value.maDvi : this.userInfo.MA_DVI.substring(0, 6),
      type: "DV"
    };
    let res = await this.donViService.getDonViTheoMaCha(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listChiCucNhan = Array.isArray(res.data) ? res.data.filter(f => {
        return f.maDvi !== this.userInfo.MA_DVI
      }) : [];
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadDetail(idInput: number) {
    if (idInput > 0) {
      await this.keHoachDieuChuyenService.getDetail(idInput)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {

            this.formData.patchValue(res.data);
            this.formData.value.danhSachHangHoa.forEach(s => s.idVirtual = uuid.v4());
            this.tableEdit = res.data.phuongAnDieuChuyen;
            if (this.formData.value.type == 'NDC') {
              this.isNhanDieuChuyen = true;
            } else {
              this.isNhanDieuChuyen = false;
            }
            this.loadDsChiCuc(this.formData.value);
            this.getListDiemKho(this.formData.value.maDvi);
            this.buildTableView();
          }
        })
        .catch((e) => {
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
        maDviCuc: this.userInfo.MA_DVI?.slice(0, -2)
      });
      this.tongThanhTien = 0;
      this.tongSoLuong = 0;
      this.tongSoLuongDeXuat = 0;
      this.tongSoLuongXuatCap = 0;
    }

  }

  async getListDiemKho(maDvi) {
    if (maDvi) {
      try {
        let body = {
          maDviCha: maDvi,
          trangThai: '01',
        }
        const res = await this.donViService.getTreeAll(body);
        if (res.msg == MESSAGE.SUCCESS) {

          if (res.data && res.data.length > 0) {
            res.data.forEach(element => {
              if (element && element.capDvi == '3' && element.children) {
                this.listDiemKhoBq = [
                  ...this.listDiemKhoBq,
                  ...element.children
                ]
              }
            });
          }
        }

      } catch (error) {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      } finally {
        this.spinner.hide();
      }
    }
  }

  async getListDiemKhoNhanBq(maDvi) {
    if (maDvi) {
      try {
        let body = {
          maDviCha: maDvi,
          trangThai: '01',
        }
        const res = await this.donViService.getTreeAll(body);
        if (res.msg == MESSAGE.SUCCESS) {
          if (res.data && res.data.length > 0) {
            res.data.forEach(element => {
              if (element && element.capDvi == '3' && element.children) {
                this.listDiemKhoNhanBq = [
                  ...this.listDiemKhoNhanBq,
                  ...element.children
                ]
              }
            });
          }
        }

      } catch (error) {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      } finally {
        this.spinner.hide();
      }
    }
  }

  changeDiemKho = (value) => {
    let tenDiemKho = (this.listDiemKhoBq ? this.listDiemKhoBq : []).find(item => item.maDvi === value);
    this.listNhaKhoBq = []
    this.listNganKhoBq = [];
    this.listLoKhoBq = []
    this.formDataChiTiet.patchValue({
      maNhaKho: "",
      tenNhaKho: "",
      maNganKho: "",
      temNganKho: "",
      maLoKho: "",
      tenLoKho: "",
      tenDiemKho: tenDiemKho ? tenDiemKho.tenDvi : ""
    });
    this.getListNhaKhoBq(value)
  }
  changeNhaKho = (value) => {
    let tenNhaKho = (this.listNhaKhoBq ? this.listNhaKhoBq : []).find(item => item.maDvi === value);
    this.listNganKhoBq = [];
    this.listLoKhoBq = []
    this.formDataChiTiet.patchValue({
      maNganKho: "",
      temNganKho: "",
      maLoKho: "",
      tenLoKho: "",
      tenNhaKho: tenNhaKho ? tenNhaKho.tenDvi : ""
    });
    this.getListNganKhoBq(value);
  }
  changeNganKho = (value) => {
    let tenNganKho = (this.listNganKhoBq ? this.listNganKhoBq : []).find(item => item.maDvi === value);
    if (!!!tenNganKho) {
      return;
    }
    this.getDetailMlkByKey(tenNganKho.maDvi, tenNganKho.capDvi).then((res: OldResponseData) => {
      if (res.msg == MESSAGE.SUCCESS) {
        let coLoKho = true;
        if (res.data.object.coLoKho) {
          if ("00" == res.data.object.coLoKho) {
            coLoKho = false;
          } else if ("01" == res.data.object.coLoKho) {
            coLoKho = true;
          }
        }
        if (!coLoKho) {
          this.removeValidateLoKho("maLoKho");
          this.removeValidateLoKho("tenLoKho");
        } else {
          this.addValidateLoKho("maLoKho");
          this.addValidateLoKho("tenLoKho");
        }
        this.listLoKhoBq = []
        this.formDataChiTiet.patchValue({
          coLoKho: coLoKho,
          maLoKho: "",
          tenLoKho: "",
          tenNganKho: tenNganKho ? tenNganKho.tenDvi : ""
        });
        this.getListLoKhoBq(value);
      } else {
        this.notification.error(MESSAGE.ERROR, res.error);
      }
    })
  }
  changeLoKho = (value) => {
    let tenLoKho = (this.listLoKhoBq ? this.listLoKhoBq : []).find(item => item.maDvi === value);
    this.formDataChiTiet.patchValue({tenLoKho: tenLoKho ? tenLoKho.tenDvi : ""});
    if (value) {
      const body = {
        maDvi: value,
        tenLoKho: this.formDataChiTiet.value.tenLoKho
      }
      this.getChiTietTonKho(body);
    }
  }

  async getChiTietTonKho(body) {
    if (!body && !body.maDvi && body.maDvi != "") return;
    try {
      // lấy thông tin hiện tại của lô
      const res = await this.quanLyHangTrongKhoService.getTrangThaiHt(body);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data && res.data.length > 0) {
          if (res.data.length === 1) {
            this.formDataChiTiet.patchValue({
              loaiVthh: res.data[0].loaiVthh,
              tenLoaiVthh: res.data[0].tenLoaiVthh,
              cloaiVthh: res.data[0].cloaiVthh,
              tenCloaiVthh: res.data[0].tenCloaiVthh,
              donViTinh: res.data[0].donViTinhId,
              tenDonViTinh: res.data[0].tenDonViTinh,
              tonKho: res.data[0].slHienThoi
            });
          } else {
            this.notification.error(MESSAGE.ERROR, "Tìm thấy nhiều hơn 1 lô kho!" + body.tenLoKho);
          }
        } else {
          this.notification.error(MESSAGE.ERROR, "Vui lòng khởi tạo dữ liệu đầu kỳ của " + body.tenLoKho);
        }
      } else {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
      // xử lý thông tin chọn lô
    } catch (error) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  expandAll() {
    this.tableView.forEach(s => {
      this.expandSetString.add(s.idVirtual);
    })
  }

  onExpandStringChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }

  quayLai() {
    this.showListEvent.emit();
  }

  changeDonViNhan(value) {
    let tenChiCucNhan = this.listChiCucNhan.find(item => item.maDvi === value);
    this.listNhaKhoBq = [];
    this.listNganKhoBq = [];
    this.listLoKhoBq = [];
    this.formDataChiTiet.patchValue({
      maDiemKho: "",
      tenDiemKho: "",
      maNhaKho: "",
      tenNhaKho: "",
      maNganKho: "",
      temNganKho: "",
      maLoKho: "",
      tenLoKho: "",
      tenChiCucNhan: tenChiCucNhan ? tenChiCucNhan.tenDvi : ""
    });
  }

  handleChangeLoaiDC(event: any) {
    if ("CUC" === event) {
      this.formData.patchValue({
        tenLoaiDc: "Giữa 2 cục DTNN KV",
        maCucNhan: "",
        danhSachHangHoa: [],
        canCu: []
      });
      this.tableView = [];
      this.tableEdit = [];
      this.listChiCucNhan = [];
    } else {
      this.formData.patchValue({
        tenLoaiDc: "Giữa 2 chi cục trong cùng 1 cục",
        maCucNhan: "",
        danhSachHangHoa: [],
        canCu: []
      });
      this.tableView = [];
      this.tableEdit = [];
      this.listChiCucNhan = [];
      this.loadDsChiCuc();
    }
  }

  selectRow(item) {
    this.phuongAnView.forEach(i => i.selected = false);
    item.selected = true;
  }

  async showModal(data?: any): Promise<void> {
    this.isVisible = true;
  }

  handleOk(): void {

    if ((!this.formDataChiTiet.value.cloaiVthh || !this.formDataChiTiet.value.loaiVthh) && !this.isNhanDieuChuyen) {
      this.notification.error(MESSAGE.ERROR, "Chưa có thông tin hàng hóa!");
      return;
    }
    if (!this.formDataChiTiet.value.idVirtual) {
      this.formDataChiTiet.controls['idVirtual'].setValue(uuid.v4());
      if (this.formData.value.danhSachHangHoa && this.formData.value.danhSachHangHoa.length > 0) {
        // check lô kho xuất
        if (!this.isNhanDieuChuyen) {
          let maLoKho = this.formData.value.danhSachHangHoa.find(item => ((item.maLoKho == this.formDataChiTiet.value.maLoKho) && item.maChiCucNhan == this.formDataChiTiet.value.maChiCucNhan));
          if (maLoKho) {
            this.notification.error(MESSAGE.ERROR, "Vui lòng chọn lô kho khác!");
            return;
          } else {
            this.formData.patchValue({
              danhSachHangHoa: [...this.formData.value.danhSachHangHoa, this.formDataChiTiet.value]
            })
          }
        } else {
          let maLoKho = this.formData.value.danhSachHangHoa.find(item => ((item.maLoKhoNhan == this.formDataChiTiet.value.maLoKhoNhan) && item.maDiemKhoNhan == this.formDataChiTiet.value.maDiemKhoNhan));
          if (maLoKho) {
            this.notification.error(MESSAGE.ERROR, "Vui lòng chọn lô kho khác!");
            return;
          } else {
            this.formData.patchValue({
              danhSachHangHoa: [...this.formData.value.danhSachHangHoa, this.formDataChiTiet.value]
            })
          }
        }

      } else {
        this.formData.patchValue({
          danhSachHangHoa: [this.formDataChiTiet.value]
        });
      }

    } else {
      if (!this.isNhanDieuChuyen) {
        let maLoKho = this.formData.value.danhSachHangHoa.find(item => ((item.maLoKho == this.formDataChiTiet.value.maLoKho) && item.maChiCucNhan == this.formDataChiTiet.value.maChiCucNhan));
        if (maLoKho) {
          this.notification.error(MESSAGE.ERROR, "Vui lòng chọn lô kho khác!");
          return;
        }
      } else {
        let maLoKho = this.formData.value.danhSachHangHoa.find(item => ((item.maLoKhoNhan == this.formDataChiTiet.value.maLoKhoNhan) && item.maDiemKhoNhan == this.formDataChiTiet.value.maDiemKhoNhan));
        if (maLoKho) {
          this.notification.error(MESSAGE.ERROR, "Vui lòng chọn lô kho khác!");
          return;
        }
      }
      let hangHoa = this.formData.value.danhSachHangHoa.find(item => item.idVirtual === this.formDataChiTiet.value.idVirtual);
      if (hangHoa) {
        Object.assign(hangHoa, this.formDataChiTiet.value);
      } else {
        this.formData.controls['danhSachHangHoa'].setValue([...this.formData.value.danhSachHangHoa, this.formDataChiTiet.value]);
      }
    }

    this.buildTableView();
    this.buildTableEdit();
    this.isVisible = false;
    this.isEditDetail = false;
    //clean
    this.formDataChiTiet.reset();
    this.formDataChiTiet.patchValue({tonKho: 0, duToanKphi: 0, soLuongDc: 0});
    this.errorInputComponent = [];
    this.listChiCuc = []
    this.disableInputComponent = new ModalInput();
  }

  handleCancel(): void {
    this.isVisible = false;
    this.isEditDetail = false;
    //clean
    this.formDataChiTiet.reset();
    this.formDataChiTiet.patchValue({tonKho: 0, duToanKphi: 0, soLuongDc: 0});
    this.errorInputComponent = [];
    this.listChiCuc = []
    this.disableInputComponent = new ModalInput();
  }

  buildTableView() {
    let dataView = chain(this.formData.value.danhSachHangHoa)
      .groupBy("maChiCucNhan")
      .map((value, key) => {
        let rs = chain(value)
          .groupBy("maDiemKho")
          .map((v, k) => {
              let rss = chain(v)
                .groupBy("maLoKho")
                .map((vs, ks) => {
                    let maLoKho = vs.find(s => s.maLoKho === ks);
                    let khoNhan = vs.filter(item => item.maDiemKhoNhan != undefined);
                    let rsss = chain(khoNhan)
                      .groupBy("maNhaKhoNhan")
                      .map((vss, kss) => {
                          let maNhaKhoNhan = vss.find(s => s.maNhaKhoNhan === kss);
                          return {
                            ...maNhaKhoNhan,
                            idVirtual: maNhaKhoNhan ? maNhaKhoNhan.idVirtual ? maNhaKhoNhan.idVirtual : uuid.v4() : uuid.v4(),
                            childData: vss
                          }
                        }
                      ).value();
                    return {
                      ...maLoKho,
                      idVirtual: maLoKho ? maLoKho.idVirtual ? maLoKho.idVirtual : uuid.v4() : uuid.v4(),
                      maDiemKhoNhan: "",
                      tenDiemKhoNhan: "",
                      maNhaKhoNhan: "",
                      tenNhaKhoNhan: "",
                      maNganKhoNhan: "",
                      tenNganKhoNhan: "",
                      coLoKhoNhan: true,
                      maLoKhoNhan: "",
                      tenLoKhoNhan: "",
                      soLuongPhanBo: 0,
                      tichLuongKd: 0,
                      slDcConLai: 0,
                      childData: rsss
                    }
                  }
                ).value();
              let duToanKphi = v.reduce((prev, cur) => prev + cur.duToanKphi, 0);
              let rowDiemKho = v.find(s => s.maDiemKho === k);

              return {
                ...rowDiemKho,
                idVirtual: rowDiemKho ? rowDiemKho.idVirtual ? rowDiemKho.idVirtual : uuid.v4() : uuid.v4(),
                duToanKphi: duToanKphi,
                childData: rss
              }
            }
          ).value();

        let duToanKphi = rs.reduce((prev, cur) => prev + cur.duToanKphi, 0);
        let rowChiCuc = value.find(s => s.maChiCucNhan === key);
        return {
          ...rowChiCuc,
          idVirtual: rowChiCuc ? rowChiCuc.idVirtual ? rowChiCuc.idVirtual : uuid.v4() : uuid.v4(),
          duToanKphi: duToanKphi,
          childData: rs
        };
      }).value();
    this.tableView = dataView;
    this.expandAll()

    if (this.formData.value.danhSachHangHoa.length !== 0) {
      this.tongDuToanChiPhi = this.formData.value.danhSachHangHoa.reduce((prev, cur) => prev + cur.duToanKphi, 0);
    }
  }

  buildTableEdit() {
    let dataView = chain(this.formData.value.danhSachHangHoa)
      .groupBy("maChiCucNhan")
      .map((value, key) => {
        let rowChiCuc = value.find(s => s.maChiCucNhan === key);
        let rowChiCucHt = this.tableEdit.find(s => s.maChiCucNhan === key);
        if (rowChiCucHt) {
          return rowChiCucHt;
        }
        return {
          id: rowChiCuc.id,
          selected: false,
          maChiCucNhan: rowChiCuc.maChiCucNhan,
          tenChiCucNhan: rowChiCuc.tenChiCucNhan
        };
      }).value();
    this.tableEdit = dataView;
  }

  async save(isBack?) {

    const body = {
      ...this.formData.value,
      phuongAnDieuChuyen: this.tableEdit
    }
    let result = await this.createUpdate(body);
    if (isBack === false) {
      return result;
    }
    if (result) {
      this.quayLai();
    }
  }

  async saveAndSend(message: string) {
    this.setValidForm();
    if (!this.formData.value.danhSachHangHoa || (this.formData.value.danhSachHangHoa && this.formData.value.danhSachHangHoa.length === 0)) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng điền thông tin hàng DTQG cần điều chuyển! ');
      return;
    } else {
      let result = await this.save(false);
      if (result) {
        this.idInput = result.id;
        if (this.formData.value.type == 'DC') {
          await this.approve(this.idInput, STATUS.CHODUYET_TBP_TVQT, message);
        } else if (this.formData.value.type == 'NDC') {
          await this.approve(this.idInput, STATUS.DA_PHANBO_DC_CHODUYET_TBP_TVQT, message);
        }

      }
    }
  }

  xoaHangHoa(data: any, dataParent?: any) {

    let danhSachHangHoa = [];
    if (!dataParent && data && data.idVirtual) {
      danhSachHangHoa = cloneDeep(this.formData.value.danhSachHangHoa.filter(s => s.idVirtual != data.idVirtual));
    } else if (dataParent && data && data.idVirtual) {
      let idsToRemove = this.getC3List(dataParent, data.idVirtual);
      danhSachHangHoa = cloneDeep(this.formData.value.danhSachHangHoa.filter(item => !idsToRemove.includes(item.idVirtual)));
    }
    this.formData.patchValue({
      danhSachHangHoa: danhSachHangHoa
    })
    this.buildTableView();
    this.buildTableEdit();
  }

  getC3List(data, idVirtual) {
    let result = [];

    function traverse(node, level) {
      if (level === 3) {
        result.push(node.idVirtual);
      } else if (node.childData) {
        node.childData.forEach(child => {
          traverse(child, level + 1);
        });
      }
    }

    data.forEach(node => {
      if (node.idVirtual === idVirtual) {
        if (node.childData) {
          node.childData.forEach(child => {
            traverse(child, 2);
          });
        }
      } else {
        if (node.childData) {
          node.childData.forEach(child => {
            traverse(child, 2);
          });
        }
      }
    });

    return result;
  }


  async suaHangHoa(data: any) {

    this.showModal();
    this.isEditDetail = true;
    if (!data.slDcConLai) {
      data.slDcConLai = data.soLuongDc;
    }
    this.formDataChiTiet.patchValue(data);
    this.getListNhaKhoBq(data.maDiemKho);
    this.getListNganKhoBq(data.maNhaKho);
    this.getListLoKhoBq(data.maNganKho);

    await Promise.all([
      this.getListDiemKhoNhanBq(data.maChiCucNhan),
      this.getListNhaKhoNhanBq(data.maDiemKhoNhan),
      this.getListNganKhoNhanBq(data.maNhaKhoNhan),
      this.getListLoKhoNhanBq(data.maNganKhoNhan)
    ])
  }

  suaChiCuc(data: any) {
    this.formDataChiTiet.patchValue(data);
    this.showModalSuaChiCuc();
  }

  showModalSuaChiCuc(): void {
    this.isVisibleSuaChiCuc = true;
  }

  handleOkSuaChiCuc(): void {
    let ids = this.getC3List(this.tableView, this.formDataChiTiet.value.idVirtual);
    let danhSachHangHoaSua = this.formData.value.danhSachHangHoa.filter(item => ids.includes(item.idVirtual));

    danhSachHangHoaSua.forEach(s => {
      s.thoiGianDkDc = this.formDataChiTiet.value.thoiGianDkDc;
    });
    this.buildTableView();
    this.isVisibleSuaChiCuc = false;
    //clean
    this.formDataChiTiet.reset();
    this.formDataChiTiet.patchValue({tonKho: 0, duToanKphi: 0, soLuongDc: 0});
  }

  handleCancelSuaChiCuc(): void {
    this.isVisibleSuaChiCuc = false;

    //clean
    this.formDataChiTiet.reset();
    this.formDataChiTiet.patchValue({tonKho: 0, duToanKphi: 0, soLuongDc: 0});
  }

  checkVld(inputName: string) {
    if (this.errorInputComponent.find(s => s === inputName)) {
      return 'error'
    } else {
      return '';
    }
  }


  setValidForm() {
    this.formData.controls["soDxuat"].setValidators([Validators.required]);
    this.formData.controls["ngayLapKh"].setValidators([Validators.required]);
  };

  private getListNhaKhoBq(value) {
    if (value) {
      this.listNhaKhoBq = Array.isArray(this.listDiemKhoBq) ? this.listDiemKhoBq.find(f => f.maDvi === value)?.children : [];
    }
  }

  private getListNganKhoBq(value) {
    if (value) {
      this.listNganKhoBq = Array.isArray(this.listNhaKhoBq) ? this.listNhaKhoBq.find(f => f.maDvi === value)?.children : [];
    }
  }

  private getListLoKhoBq(value) {
    if (value) {
      this.listLoKhoBq = Array.isArray(this.listNganKhoBq) ? this.listNganKhoBq.find(f => f.maDvi === value)?.children : [];
    }
  }

  private getListNhaKhoNhanBq(value) {
    if (value) {
      this.listNhaKhoNhanBq = Array.isArray(this.listDiemKhoNhanBq) ? this.listDiemKhoNhanBq.find(f => f.maDvi === value)?.children : [];
    }
  }

  private getListNganKhoNhanBq(value) {
    if (value) {
      this.listNganKhoNhanBq = Array.isArray(this.listNhaKhoNhanBq) ? this.listNhaKhoNhanBq.find(f => f.maDvi === value)?.children : [];
    }
  }

  private getListLoKhoNhanBq(value) {
    if (value) {
      this.listLoKhoNhanBq = Array.isArray(this.listNganKhoNhanBq) ? this.listNganKhoNhanBq.find(f => f.maDvi === value)?.children : [];
    }
  }

  changeCucNhan(value: any) {
    const tenCucNhan = this.dsDonViNhan.find(item => item.maDvi == value);
    this.formData.controls['tenCucNhan'].patchValue({"tenCucNhan": tenCucNhan.tenDvi});
    this.loadDsChiCuc(this.formData.value.maCucNhan);
  }

  async getListHinhThucDvCcDvVanChuyen() {
    try {
      const res = await this.dmService.danhMucChungGetAll("DM_HTLC_DV_CCDVVC");
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data && res.data.length > 0) {
          this.listHinhThucDvCcDvVanChuyen = res.data;
        }
      }
    } catch (error) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async getListPtGiaoHang() {
    try {
      const res = await this.dmService.danhMucChungGetAll("PT_GIAO_HANG");
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data && res.data.length > 0) {
          this.listPtGiaoHang = res.data;
        }
      }
    } catch (error) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async getListNguonChi() {
    try {
      const res = await this.dmService.danhMucChungGetAll("NGUON_VON");
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data && res.data.length > 0) {
          this.listNguonChi = res.data;
        }
      }
    } catch (error) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async getListPtNhanHang() {
    try {
      const res = await this.dmService.danhMucChungGetAll("PT_NHAN_HANG");
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data && res.data.length > 0) {
          this.listPtNhanHang = res.data;
        }
      }
    } catch (error) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  changeHinhThucDvCcDvVanChuyen(value: any, item: any) {
    let tenHinhThucDvCcDvVanChuyen = (this.listHinhThucDvCcDvVanChuyen ? this.listHinhThucDvCcDvVanChuyen : []).find(item => item.ma === value);
    item.tenHinhThucDvCcDvVanChuyen = tenHinhThucDvCcDvVanChuyen.giaTri;
  }

  changePtGiaoHang(value: any, item: any) {
    let tenPthucGiaoHang = (this.listPtGiaoHang ? this.listPtGiaoHang : []).find(item => item.ma === value);
    item.tenPthucGiaoHang = tenPthucGiaoHang.giaTri;
  }

  changePtNhanHang(value: any, item: any) {
    let tenPthucNhanHang = (this.listPtNhanHang ? this.listPtNhanHang : []).find(item => item.ma === value);
    item.tenPthucNhanHang = tenPthucNhanHang.giaTri;
  }

  changeNguonChi(value: any, item: any) {
    let nguonChi = (this.listNguonChi ? this.listNguonChi : []).find(item => item.ma === value);
    item.tenNguonChi = nguonChi.giaTri;
  }

  addDiemKho(item: any) {
    this.isAddDiemKho = true;
    let data = cloneDeep(item);
    data.idVirtual = undefined;
    data.soLuongDc = 0;
    data.duToanKphi = 0;
    this.formDataChiTiet.patchValue(data);
    this.showModal();
  }

  changeDiemKhoNhan(value: any) {
    let tenDiemKhoNhan = (this.listDiemKhoNhanBq ? this.listDiemKhoNhanBq : []).find(item => item.maDvi === value);
    this.listNhaKhoNhanBq = []
    this.listNganKhoNhanBq = [];
    this.listLoKhoNhanBq = []
    this.formDataChiTiet.patchValue({
      maNhaKhoNhan: "",
      tenNhaKhoNhan: "",
      maNganKhoNhan: "",
      temNganKhoNhan: "",
      maLoKhoNhan: "",
      tenLoKhoNhan: "",
      tenDiemKhoNhan: tenDiemKhoNhan ? tenDiemKhoNhan.tenDvi : ""
    });
    this.getListNhaKhoNhanBq(value);
  }

  changeNhaKhoNhan(value: any) {
    let tenNhaKhoNhan = (this.listNhaKhoNhanBq ? this.listNhaKhoNhanBq : []).find(item => item.maDvi === value);
    this.listNganKhoNhanBq = [];
    this.listLoKhoNhanBq = []
    this.formDataChiTiet.patchValue({
      maNganKhoNhan: "",
      temNganKhoNhan: "",
      maLoKhoNhan: "",
      tenLoKhoNhan: "",
      tenNhaKhoNhan: tenNhaKhoNhan ? tenNhaKhoNhan.tenDvi : ""
    });
    this.getListNganKhoNhanBq(value);
  }

  changeNganKhoNhan(value: any) {

    let tenNganKhoNhan = (this.listNganKhoNhanBq ? this.listNganKhoNhanBq : []).find(item => item.maDvi === value);
    if (!!!tenNganKhoNhan) {
      return;
    }
    this.getDetailMlkByKey(tenNganKhoNhan.maDvi, tenNganKhoNhan.capDvi).then((res: OldResponseData) => {

      if (res.msg == MESSAGE.SUCCESS) {
        let coLoKhoNhan = true;
        if (res.data.object.coLoKho) {
          if ("00" == res.data.object.coLoKho) {
            coLoKhoNhan = false;
          } else if ("01" == res.data.object.coLoKho) {
            coLoKhoNhan = true;
          }
        }
        if (!coLoKhoNhan) {
          this.removeValidateLoKho("maLoKhoNhan");
          this.removeValidateLoKho("tenLoKhoNhan");
        } else {
          this.addValidateLoKho("maLoKhoNhan");
          this.addValidateLoKho("tenLoKhoNhan");
        }
        this.listLoKhoNhanBq = []
        this.formDataChiTiet.patchValue({
          coLoKhoNhan: coLoKhoNhan,
          maLoKhoNhan: "",
          tenLoKhoNhan: "",
          tenNganKhoNhan: tenNganKhoNhan ? tenNganKhoNhan.tenDvi : ""
        });
        this.getListLoKhoNhanBq(value);
      } else {
        this.notification.error(MESSAGE.ERROR, res.error);
      }
    })
  }

  changeLoKhoNhan(value: any) {
    let tenLoKhoNhan = (this.listLoKhoNhanBq ? this.listLoKhoNhanBq : []).find(item => item.maDvi === value);
    this.formDataChiTiet.patchValue({tenLoKhoNhan: tenLoKhoNhan ? tenLoKhoNhan.tenDvi : ""});
    if (value) {
      this.getDetailMlkByKey(value, tenLoKhoNhan.capDvi).then((res: OldResponseData) => {
        if (res.msg == MESSAGE.SUCCESS) {

          if (!this.formDataChiTiet.value.cloaiVthh.startsWith("02")) {
            this.formDataChiTiet.controls["tichLuongKd"].setValue(res.data.object.tichLuongKdLt);
          } else {
            this.formDataChiTiet.controls["tichLuongKd"].setValue(res.data.object.tichLuongKdVt);
          }

        } else {
          this.notification.error(MESSAGE.ERROR, res.error);
        }
      });
    }
  }

  getDetailMlkByKey(maDvi, capDvi) {
    if (maDvi && capDvi) {
      let body = {
        maDvi,
        capDvi
      }
      return this.mangLuoiKhoService.getDetailByMa(body);
    }
  }

  private removeValidateLoKho(value) {
    this.formDataChiTiet.controls[value].clearValidators();
  }

  private addValidateLoKho(value) {
    this.formDataChiTiet.controls[value].setValidators(Validators.required);
  }

  changeSoLuongPhanBo(value: any) {
    this.formDataChiTiet.controls['slDcConLai'].setValue(this.formDataChiTiet.value.soLuongDc - value);
  }
  async addDiemKhoNham(data: any) {
    data.idVirtual = undefined;
    data.id = undefined;
    this.showModal();
    this.isEditDetail = true;
    if (!data.slDcConLai) {
      data.slDcConLai = data.soLuongDc;
    }
    this.formDataChiTiet.patchValue(data);
    this.getListNhaKhoBq(data.maDiemKho);
    this.getListNganKhoBq(data.maNhaKho);
    this.getListLoKhoBq(data.maNganKho);

    await Promise.all([
      this.getListDiemKhoNhanBq(data.maChiCucNhan),
      this.getListNhaKhoNhanBq(data.maDiemKhoNhan),
      this.getListNganKhoNhanBq(data.maNhaKhoNhan),
      this.getListLoKhoNhanBq(data.maNganKhoNhan)
    ])
  }
}
