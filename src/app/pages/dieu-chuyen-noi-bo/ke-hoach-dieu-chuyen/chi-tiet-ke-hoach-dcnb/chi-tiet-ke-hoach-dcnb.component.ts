import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup, Validators} from "@angular/forms";
import {UserLogin} from "../../../../models/userlogin";
import {DiaDiemGiaoNhan, KeHoachBanDauGia, PhanLoTaiSan} from "../../../../models/KeHoachBanDauGia";
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
import {FileDinhKem} from "../../../../models/DeXuatKeHoachuaChonNhaThau";
import {MESSAGE} from "../../../../constants/message";
import {STATUS} from "src/app/constants/status";
import {chain, cloneDeep} from 'lodash';
import * as uuid from "uuid";
import {KeHoachDieuChuyenService} from "../ke-hoach-dieu-chuyen.service";
import {DanhMucDungChungService} from "../../../../services/danh-muc-dung-chung.service";

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
  cacheData: any[] = [];
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
  dieuChuyenRow: any = {};

  isVisible = false;
  isAddDiemKho = false;
  isVisibleSuaChiCuc = false;
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
  listNhaKhoBq: any[] = [];
  listNganKhoBq: any[] = [];
  listLoKhoBq: any[] = [];

  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private danhMucService: DanhMucService,
              private donViService: DonviService,
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
        id: [0],
        nam: [dayjs().get("year"), [Validators.required]],
        maDvi: ['', [Validators.required]],
        maDviCuc: ['', [Validators.required]],
        soDxuat: [''],
        ngayLapKh: [''],
        maCucNhan: [''],
        trichYeu: ['',],
        trangThai: [STATUS.DU_THAO],
        idQdPd: [''],
        soQdPd: [''],
        ngayGduyet: [''],
        nguoiGduyetId: [''],
        ngayPduyet: [''],
        nguoiPduyetId: [''],
        lyDoTuChoi: [''],
        tenDvi: [''],
        tenTrangThai: ['Dự Thảo'],
        danhSachHangHoa: [],
        canCu: [],
        lyDoDc: ['', [Validators.required]],
        loaiDc: ['CHI_CUC', [Validators.required]]
      }
    );
    this.formDataChiTiet = this.fb.group(
      {
        id: [0],
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
        tonKho: [0, [Validators.required]]
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
        this.getListHinhThucDvCcDvVanChuyen(),
        this.getListPtGiaoHang(),
        this.getListNguonChi(),
        this.getListPtNhanHang(),
        this.dieuChuyenRow.tonKhoChiCuc = 0,
        this.dieuChuyenRow.tonKhoCloaiVthh = 0,
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
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadDsChiCuc(value?) {
    let body = {
      trangThai: "01",
      maDviCha: value ? value : this.userInfo.MA_DVI.substring(0, 6),
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
            res.data.soDx = res.data.soDx.split("/")[0];
            this.formData.patchValue(res.data);
            this.formData.value.danhSachHangHoa.forEach(s => s.idVirtual = uuid.v4());
            await this.changeHangHoa(res.data.loaiVthh)
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

  getListDiemKhoEdit(maDvi) {
    if (maDvi) {
      let body = {
        maDviCha: maDvi,
        trangThai: '01',
      }
      return this.donViService.getTreeAll(body);
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
    let temNganKho = (this.listNganKhoBq ? this.listNganKhoBq : []).find(item => item.maDvi === value);
    this.listLoKhoBq = []
    this.formDataChiTiet.patchValue({
      maLoKho: "",
      tenLoKho: "",
      temNganKho: temNganKho ? temNganKho.tenDvi : ""
    });
    this.getListLoKhoBq(value);
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
        maDviCuc: this.userInfo.MA_DVI?.slice(0, -2),
        maCucNhan: "",
        danhSachHangHoa: [],
        canCu: []
      });
      this.tableView = [];
      this.tableEdit = [];
      this.listChiCucNhan = [];
    } else {
      this.formData.patchValue({
        maDviCuc: "",
        maCucNhan: "",
        danhSachHangHoa: [],
        canCu: []
      });
      this.tableView = [];
      this.tableEdit = [];
      this.loadDsChiCuc();
    }
  }

  async changeHangHoa(event: any) {
    if (event) {
      this.formData.patchValue({donViTinh: this.listHangHoaAll.find(s => s.ma == event)?.maDviTinh})

      let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha({str: event});
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.listChungLoaiHangHoa = res.data;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      //lay ton kho
      if (this.userService.isCuc()) {
        let body = {
          'maDvi': this.userInfo.MA_DVI,
          'loaiVthh': this.formData.value.loaiVthh
        }
        await this.quanLyHangTrongKhoService.getTrangThaiHt(body).then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            let data = res.data;
            if (data.length > 0) {
              let val = data.reduce((prev, cur) => prev + cur.slHienThoi, 0);
              this.formData.patchValue({
                tonKho: cloneDeep(val),
              });
              console.log(this.formData.value)
            } else {
              this.formData.patchValue({tonKho: 0});
            }
          }
        });
      }
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
    if (!this.formDataChiTiet.value.cloaiVthh || !this.formDataChiTiet.value.loaiVthh) {
      this.notification.error(MESSAGE.ERROR, "Chưa có thông tin hàng hóa!");
      return;
    }
    if (!this.formDataChiTiet.value.idVirtual) {
      this.formDataChiTiet.controls['idVirtual'].setValue(uuid.v4());
      if (this.formData.value.danhSachHangHoa && this.formData.value.danhSachHangHoa.length > 0) {
        this.formData.patchValue({
          danhSachHangHoa: [...this.formData.value.danhSachHangHoa, this.formDataChiTiet.value]
        })
      } else {
        this.formData.patchValue({
          danhSachHangHoa: [this.formDataChiTiet.value]
        });
      }

    } else {
      let hangHoa = this.formData.value.danhSachHangHoa.find(item => item.idVirtual === this.formDataChiTiet.value.idVirtual);
      Object.assign(hangHoa, this.formDataChiTiet.value);
    }

    this.buildTableView();
    this.buildTableEdit();
    this.isVisible = false;
    this.isEditDetail = false;
    //clean
    this.formDataChiTiet.reset();
    this.formDataChiTiet.patchValue({tonKho: 0, duToanKphi: 0, soLuongDc: 0});
    this.errorInputComponent = [];
    this.dieuChuyenRow = {}
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
    this.dieuChuyenRow = {}
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
              let duToanKphi = v.reduce((prev, cur) => prev + cur.duToanKphi, 0);
              let rowDiemKho = v.find(s => s.maDiemKho === k);
              return {
                idVirtual: uuid.v4(),
                maDiemKho: k,
                tenDiemKho: rowDiemKho ? rowDiemKho.tenDiemKho : "",
                duToanKphi: duToanKphi,
                childData: v
              }
            }
          ).value();

        let duToanKphi = rs.reduce((prev, cur) => prev + cur.duToanKphi, 0);
        let rowChiCuc = value.find(s => s.maChiCucNhan === key);
        return {
          idVirtual: uuid.v4(),
          maChiCucNhan: rowChiCuc ? rowChiCuc.maChiCucNhan : "",
          tenChiCucNhan: rowChiCuc ? rowChiCuc.tenChiCucNhan : "",
          thoiGianDkDc: rowChiCuc ? rowChiCuc.thoiGianDkDc : "",
          duToanKphi: duToanKphi,
          childData: rs
        };
      }).value();
    this.tableView = dataView
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
        return {
          id: rowChiCuc.id,
          selected: false,
          maChiCucNhan: rowChiCuc.maChiCucNhan,
          tenChiCucNhan: rowChiCuc.tenChiCucNhan
        };
      }).value();
    this.tableEdit = dataView;
  }

  async changeCloaiVthh(event: any) {
    if (event) {
      let body = {
        maDvi: this.dieuChuyenRow.maDviChiCuc,
        loaiVthh: this.formData.value.loaiVthh,
        cloaiVthh: event
      }
      this.quanLyHangTrongKhoService.getTrangThaiHt(body).then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          let data = res.data;
          if (data.length > 0) {
            this.dieuChuyenRow.tonKhoCloaiVthh = data.reduce((prev, cur) => prev + cur.slHienThoi, 0);
          } else {
            this.dieuChuyenRow.tonKhoCloaiVthh = 0;
          }
        }
      });
    } else {
      this.dieuChuyenRow.tonKhoCloaiVthh = 0;
    }
  }

  async save() {
    //this.setValidForm();
    debugger
    let result = await this.createUpdate(this.formData.value);
    if (result) {
      this.quayLai();
    }
  }

  async saveAndSend(message: string) {
    this.setValidForm();
    let errorSlCuc = '';
    let errorSlChiCuc = '';
    this.phuongAnView.forEach(s => {
      s.childData.forEach(s1 => {
        if (s1.soLuongXuatCuc > s1.tonKhoCuc && s1.tonKhoCuc > s1.soLuongXuatCucThucTe) {
          errorSlCuc += s1.tenCuc + " ";
        }
        if (s1.tonKhoCuc < s1.soLuongXuatCucThucTe) {
          errorSlChiCuc += s1.tenCuc + " ";
        }
      })
    })
    if (errorSlCuc) {
      this.notification.error(MESSAGE.ERROR, 'SL tồn kho thực tế vẫn đáp ứng SL xuất cứu trợ, viện trợ. Bạn vui lòng nhập thêm để đảm bảo Tổng SL đề xuất cứu trợ, viện trợ = Tổng SL thực tế xuất cứu trợ, viện trợ! ' + errorSlCuc);
    } else if (errorSlChiCuc) {
      this.notification.error(MESSAGE.ERROR, 'SL hàng xuất thực tế vượt quá hàng trong kho hiện tại ' + errorSlChiCuc);
    } else {
      this.formData.value.soDx = this.formData.value.soDx;
      if (this.userService.isTongCuc()) {
        await this.approve(this.idInput, STATUS.CHO_DUYET_LDV, message);
      } else {
        let result = await this.createUpdate(this.formData.value);
        if (result) {
          this.idInput = result.id;
          await this.approve(this.idInput, STATUS.CHO_DUYET_TP, message);
        }
      }
    }
  }

  async saveAndChangeStatus(status: string, message: string, sucessMessage: string) {
    this.setValidForm();
    let errorSlCuc = '';
    let errorSlChiCuc = '';
    this.phuongAnView.forEach(s => {
      s.childData.forEach(s1 => {
        if (s1.soLuongXuatCuc > s1.tonKhoCuc && s1.tonKhoCuc > s1.soLuongXuatCucThucTe) {
          errorSlCuc += s1.tenCuc + " ";
        }
        if (s1.tonKhoCuc < s1.soLuongXuatCucThucTe) {
          errorSlChiCuc += s1.tenCuc + " ";
        }
      })
    })
    if (errorSlCuc) {
      this.notification.error(MESSAGE.ERROR, 'SL tồn kho thực tế vẫn đáp ứng SL xuất cứu trợ, viện trợ. Bạn vui lòng nhập thêm để đảm bảo Tổng SL đề xuất cứu trợ, viện trợ = Tổng SL thực tế xuất cứu trợ, viện trợ! ' + errorSlCuc);
    } else if (errorSlChiCuc) {
      this.notification.error(MESSAGE.ERROR, 'SL hàng xuất thực tế vượt quá hàng trong kho hiện tại ' + errorSlChiCuc);
    } else {
      this.formData.value.soDx = this.formData.value.soDx;
      let result = await this.createUpdate(this.formData.value);
      if (result) {
        this.idInput = result.id;
        await this.approve(this.idInput, status, message, null, sucessMessage);
      }
    }
  }

  flattenTree(tree) {
    return tree.flatMap((item) => {
      return item.childData ? this.flattenTree(item.childData) : item;
    });
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
    this.formDataChiTiet.setValue(data);
    this.getListNhaKhoBq(data.maDiemKho);
    this.getListNganKhoBq(data.maNhaKho);
    this.getListLoKhoBq(data.maNganKho);
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
    this.formData.controls["nam"].setValidators([Validators.required]);
    this.formData.controls["soDx"].setValidators([Validators.required]);
    this.formData.controls["trichYeu"].setValidators([Validators.required]);
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

  changeCucNhan(value: any) {
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

  changeHinhThucDvCcDvVanChuyen(value: any, item:any) {
    let hinhThucDvCcDvVanChuyen = (this.listHinhThucDvCcDvVanChuyen ? this.listHinhThucDvCcDvVanChuyen : []).find(item => item.ma === value);
    item.tenHinhThucDvCcDvVanChuyen = hinhThucDvCcDvVanChuyen.giaTri;
  }

  changePtGiaoHang(value: any, item:any) {
    let ptGiaoHang = (this.listPtGiaoHang ? this.listPtGiaoHang : []).find(item => item.ma === value);
    item.tenPtGiaoHang = ptGiaoHang.giaTri;
  }

  changePtNhanHang(value: any, item:any) {
    let ptNhanHang = (this.listPtNhanHang ? this.listPtNhanHang : []).find(item => item.ma === value);
    item.tenPtNhanHang = ptNhanHang.giaTri;
  }

  changeNguonChi(value: any, item:any) {
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
}
