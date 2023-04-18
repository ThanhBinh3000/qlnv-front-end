import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup, Validators} from "@angular/forms";
import {UserLogin} from "../../../../models/userlogin";
import {DiaDiemGiaoNhan, KeHoachBanDauGia, PhanLoTaiSan} from "../../../../models/KeHoachBanDauGia";
import {DatePipe} from "@angular/common";
import {DiaDiemNhapKho} from "../../../../models/CuuTro";
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
import {DeXuatKeHoachBanDauGiaService} from "../../../../services/deXuatKeHoachBanDauGia.service";
import {DonviService} from "../../../../services/donvi.service";
import {TinhTrangKhoHienThoiService} from "../../../../services/tinhTrangKhoHienThoi.service";
import {DanhMucTieuChuanService} from "../../../../services/quantri-danhmuc/danhMucTieuChuan.service";
import {
  DeXuatPhuongAnCuuTroService
} from "../../../../services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/DeXuatPhuongAnCuuTro.service";
import {QuanLyHangTrongKhoService} from "../../../../services/quanLyHangTrongKho.service";
import * as dayjs from "dayjs";
import {FileDinhKem} from "../../../../models/DeXuatKeHoachuaChonNhaThau";
import {MESSAGE} from "../../../../constants/message";
import {STATUS} from "src/app/constants/status";
import {chain, cloneDeep} from 'lodash';
import * as uuid from "uuid";

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
  listHinhThucDvCcDvVanChuyen:any[];
  listPtGiaoHang:any[];
  listPtNhanHang:any[];
  listNguonChi:any[];
  listHangHoaAll: any[] = [];
  listLoaiHangHoa: any[] = [];
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  userInfo: UserLogin;
  expandSet = new Set<number>();
  bangPhanBoList: Array<any> = [];
  khBanDauGia: KeHoachBanDauGia = new KeHoachBanDauGia();
  diaDiemGiaoNhan: DiaDiemGiaoNhan = new DiaDiemGiaoNhan();
  diaDiemGiaoNhanList: Array<DiaDiemGiaoNhan> = [];
  phanLoTaiSanList: Array<PhanLoTaiSan> = [];
  listChungLoaiHangHoa: any[] = [];
  maHauTo: string;
  listLoaiHopDong: any[] = [];
  STATUS = STATUS;
  listLoaiHinhNhapXuat: any[] = [];
  listKieuNhapXuat: any[] = [];
  datePipe = new DatePipe('en-US');
  tongTien = 0;
  diaDiemNhapKho: any[] = [];
  expandSetString = new Set<string>();
  tableView = [];
  tableEdit = [];
  editId: string | null = null;
  phuongAnView = [];
  dieuChuyenRow: any = {};

  isVisible = false;
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

  khoChiCucNhan: any = {};
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
              private deXuatKeHoachBanDauGiaService: DeXuatKeHoachBanDauGiaService,
              private donViService: DonviService,
              private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
              private dmTieuChuanService: DanhMucTieuChuanService,
              private deXuatPhuongAnCuuTroService: DeXuatPhuongAnCuuTroService,
              private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
              private cdr: ChangeDetectorRef,) {
    super(httpClient, storageService, notification, spinner, modal, deXuatPhuongAnCuuTroService);
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
        loaiNhapXuat: [''],
        trichYeu: ['',],
        loaiVthh: ['', [Validators.required]],
        cloaiVthh: [''],
        tenVthh: [''],
        ngayDx: [''],
        ngayKetThuc: [''],
        noiDungDx: [''],
        trangThai: [STATUS.DU_THAO],
        maTongHop: [''],
        idQdPd: [''],
        soQdPd: [''],
        tongSoLuong: [0],
        thanhTien: [0],
        ngayGduyet: [''],
        nguoiGduyetId: [''],
        ngayPduyet: [''],
        nguoiPduyetId: [''],
        lyDoTuChoi: [''],
        tenDvi: [''],
        tenLoaiVthh: [''],
        tenCloaiVthh: [''],
        donViTinh: [''],
        soLuongXuatCap: [''],
        tenTrangThai: ['Dự Thảo'],
        danhSachHangHoa: [new Array()],
        canCu: [new Array<FileDinhKem>()],
        lyDoDc: ['', [Validators.required]],
        type: ['CHI_CUC', [Validators.required]]
      }
    );
    this.formDataChiTiet = this.fb.group(
      {
        id: [0],
        idVirtual: [''],
        maDviChiCucNhan: ['', [Validators.required]],
        tenDviChiCucNhan: ['', [Validators.required]],
        ngayDieuChuyen: ['', [Validators.required]],
        diemKhoBq: ['', [Validators.required]],
        tenDiemKhoBq: ['', [Validators.required]],
        nhaKhoBq: ['', [Validators.required]],
        tenNhaKhoBq: ['', [Validators.required]],
        nganKhoBq: ['', [Validators.required]],
        tenNganKhoBq: ['', [Validators.required]],
        loKhoBq: ['', [Validators.required]],
        tenLoKhoBq: ['', [Validators.required]],
        slDieuChuyen: [0, [Validators.required]],
        duToanChiPhi: [0, [Validators.required]],
        loaiHh: ['', [Validators.required]],
        tenLoaiHh: ['', [Validators.required]],
        cLoaiHh: ['', [Validators.required]],
        tenCLoaiHh: ['', [Validators.required]],
        dvt: ['', [Validators.required]],
        tenDvt: ['', [Validators.required]],
        tonKho: [0, [Validators.required]]
      }
    );
    this.userInfo = this.userService.getUserLogin();
    console.log("userInfo");
    console.log(this.userInfo);
    this.maHauTo = '/' + this.userInfo.MA_TCKT;
    this.dataChiCuc = [{maDvi: this.userInfo.MA_DVI, tenDvi: this.userInfo.TEN_DVI}]
  }

  async ngOnInit() {
    try {
      this.spinner.show();
      //this.loadDonVi();
      await Promise.all([
        this.loadDsLoaiHinhNhapXuat(),
        this.loadDsKieuNhapXuat(),
        this.loadDsVthh(),
        this.loadDsCuc(),
        this.loadDsChiCuc(),
        this.dieuChuyenRow.tonKhoChiCuc = 0,
        this.dieuChuyenRow.tonKhoCloaiVthh = 0,
      ])

      await this.loadDetail(this.idInput)
      // await Promise.all([this.loaiVTHHGetAll(), this.loaiHopDongGetAll()]);
      this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }

  startEdit(id: string): void {
    this.editId = id;
  }

  stopEdit(): void {
    this.editId = null;
  }

  async loadDsLoaiHinhNhapXuat() {
    let res = await this.danhMucService.danhMucChungGetAll("LOAI_HINH_NHAP_XUAT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNhapXuat = res.data.filter(item => item.apDung == 'XUAT_CTVT');
    }
  }

  async loadDsKieuNhapXuat() {
    let res = await this.danhMucService.danhMucChungGetAll("KIEU_NHAP_XUAT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listKieuNhapXuat = res.data.filter(item => item.apDung == 'XUAT_CTVT');
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

  async loadDsChiCuc() {
    let body = {
      trangThai: "01",
      maDviCha: this.userInfo.MA_DVI.substring(0, 6),
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
      await this.deXuatPhuongAnCuuTroService.getDetail(idInput)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.maHauTo = '/' + res.data.soDx.split("/")[1];
            res.data.soDx = res.data.soDx.split("/")[0];
            this.formData.patchValue(res.data);
            this.formData.value.danhSachHangHoa.forEach(s => s.idVirtual = uuid.v4());
            await this.changeHangHoa(res.data.loaiVthh)
            this.buildTableView();
          }
        })
        .catch((e) => {
          console.log('error: ', e);
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
        console.log("res", res)

      } catch (error) {
        console.log('error: ', error);
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      } finally {
        this.spinner.hide();
      }
    }
  }

  getListDiemKhoEdit(maDvi){
    if (maDvi) {
      let body = {
        maDviCha: maDvi,
        trangThai: '01',
      }
      return  this.donViService.getTreeAll(body);
    }
  }

  changeDiemKho = (value) => {
    let tenDiemKhoBq = (this.listDiemKhoBq ? this.listDiemKhoBq : []).find(item => item.maDvi === value);
    this.listNhaKhoBq = []
    this.listNganKhoBq = [];
    this.listLoKhoBq = []
    this.formDataChiTiet.patchValue({
      nhaKhoBq: "",
      tenNhaKhoBq: "",
      nganKhoBq: "",
      tenNganKhoBq: "",
      loKhoBq: "",
      tenLoKhoBq: "",
      tenDiemKhoBq: tenDiemKhoBq ? tenDiemKhoBq.tenDvi : ""
    });
    this.getListNhaKhoBq(value)
  }
  changeNhaKho = (value) => {
    let tenNhaKhoBq = (this.listNhaKhoBq ? this.listNhaKhoBq : []).find(item => item.maDvi === value);
    this.listNganKhoBq = [];
    this.listLoKhoBq = []
    this.formDataChiTiet.patchValue({
      nganKhoBq: "",
      tenNganKhoBq: "",
      loKhoBq: "",
      tenLoKhoBq: "",
      tenNhaKhoBq: tenNhaKhoBq ? tenNhaKhoBq.tenDvi : ""
    });
    this.getListNganKhoBq(value);
  }
  changeNganKho = (value) => {
    let tenNganKhoBq = (this.listNganKhoBq ? this.listNganKhoBq : []).find(item => item.maDvi === value);
    this.listLoKhoBq = []
    this.formDataChiTiet.patchValue({
      loKhoBq: "",
      tenLoKhoBq: "",
      tenNganKhoBq: tenNganKhoBq ? tenNganKhoBq.tenDvi : ""
    });
    this.getListLoKhoBq(value);
  }
  changeLoKho = (value) => {
    let tenLoKhoBq = (this.listLoKhoBq ? this.listLoKhoBq : []).find(item => item.maDvi === value);
    this.formDataChiTiet.patchValue({tenLoKhoBq: tenLoKhoBq ? tenLoKhoBq.tenDvi : ""});
    this.getChiTietTonKho(value)
  }

  async getChiTietTonKho(maDvi) {
    if (!maDvi) return;
    try {
      const body = {
        maDvi
      }
      // lấy thông tin hiện tại của lô
      const res = await this.quanLyHangTrongKhoService.getTrangThaiHienThoiKho(body);
      // xử lý thông tin chọn lô
    } catch (error) {

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
    let tenDviChiCucNhan = this.listChiCucNhan.find(item => item.maDvi === value);
    this.listDiemKhoBq = [];
    this.listNhaKhoBq = [];
    this.listNganKhoBq = [];
    this.listLoKhoBq = [];
    this.formDataChiTiet.patchValue({
      diemKhoBq: "",
      tenDiemKhoBq: "",
      nhaKhoBq: "",
      tenNhaKhoBq: "",
      nganKhoBq: "",
      tenNganKhoBq: "",
      loKhoBq: "",
      tenLoKhoBq: "",
      tenDviChiCucNhan: tenDviChiCucNhan ? tenDviChiCucNhan.tenDvi : ""
    });
    this.getListDiemKho(value)
  }

  handleChangeLoaiDC(event: any) {
    if ("CUC" === event) {
      this.formData.patchValue({maDviCuc: this.userInfo.MA_DVI?.slice(0, -2), maCucNhan: "", danhSachHangHoa: [new Array()], canCu: [new Array<FileDinhKem>()]});
      this.tableView = [];
      this.tableEdit = [];
    } else {
      this.formData.patchValue({maDviCuc: "", maCucNhan: "", danhSachHangHoa: [new Array()], canCu: [new Array<FileDinhKem>()]});
      this.tableView = [];
      this.tableEdit = [];
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
    if (!this.formDataChiTiet.value.idVirtual) {
      this.formDataChiTiet.controls['idVirtual'].setValue(uuid.v4());
      this.formData.patchValue({
        danhSachHangHoa: [...this.formData.value.danhSachHangHoa, this.formDataChiTiet.value]
      })
    }else {
      let hangHoa = this.formData.value.danhSachHangHoa.find(item => item.idVirtual === this.formDataChiTiet.value.idVirtual);
      Object.assign(hangHoa, this.formDataChiTiet.value);
    }

    this.buildTableView();
    this.buildTableEdit();
    this.isVisible = false;
    //clean
    this.formDataChiTiet.reset();
    this.formDataChiTiet.patchValue({tonKho: 0, duToanChiPhi: 0, slDieuChuyen: 0});
    this.errorInputComponent = [];
    this.dieuChuyenRow = {}
    this.listChiCuc = []
    this.disableInputComponent = new ModalInput();
  }

  handleCancel(): void {
    this.isVisible = false;
    //clean
    this.formDataChiTiet.reset();
    this.formDataChiTiet.patchValue({tonKho: 0, duToanChiPhi: 0, slDieuChuyen: 0});
    this.errorInputComponent = [];
    this.dieuChuyenRow = {}
    this.listChiCuc = []
    this.disableInputComponent = new ModalInput();
  }

  buildTableView() {
    let dataView = chain(this.formData.value.danhSachHangHoa)
      .groupBy("maDviChiCucNhan")
      .map((value, key) => {
        let rs = chain(value)
          .groupBy("diemKhoBq")
          .map((v, k) => {
              let duToanChiPhi = v.reduce((prev, cur) => prev + cur.duToanChiPhi, 0);
              let rowDiemKho = v.find(s => s.diemKhoBq === k);
              return {
                idVirtual: uuid.v4(),
                diemKhoBq: k,
                tenDiemKhoBq: rowDiemKho ? rowDiemKho.tenDiemKhoBq : "",
                duToanChiPhi: duToanChiPhi,
                childData: v
              }
            }
          ).value();

        let duToanChiPhi = rs.reduce((prev, cur) => prev + cur.duToanChiPhi, 0);
        let rowChiCuc = value.find(s => s.maDviChiCucNhan === key);
        return {
          idVirtual: uuid.v4(),
          maDviChiCucNhan: rowChiCuc? rowChiCuc.maDviChiCucNhan: "",
          tenDviChiCucNhan: rowChiCuc?rowChiCuc.tenDviChiCucNhan:"",
          ngayDieuChuyen: rowChiCuc?rowChiCuc.ngayDieuChuyen:"",
          duToanChiPhi: duToanChiPhi,
          childData: rs
        };
      }).value();
    this.tableView = dataView
    this.expandAll()

    if (this.formData.value.danhSachHangHoa.length !== 0) {
      this.tongDuToanChiPhi = this.formData.value.danhSachHangHoa.reduce((prev, cur) => prev + cur.duToanChiPhi, 0);
    }
  }

  buildTableEdit() {
    let dataView = chain(this.formData.value.danhSachHangHoa)
      .groupBy("maDviChiCucNhan")
      .map((value, key) => {
        let rowChiCuc = value.find(s => s.maDviChiCucNhan === key);
        return {
          id: rowChiCuc.id,
          selected: false,
          maDviChiCucNhan: rowChiCuc.maDviChiCucNhan,
          tenDviChiCucNhan: rowChiCuc.tenDviChiCucNhan
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
    this.formData.value.soDx = this.formData.value.soDx + this.maHauTo;
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
      this.formData.value.soDx = this.formData.value.soDx + this.maHauTo;
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
      this.formData.value.soDx = this.formData.value.soDx + this.maHauTo;
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
    this.formDataChiTiet.setValue(data);
    this.getListDiemKhoEdit(data.maDviChiCucNhan).then((res)=>{
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
          this.getListNhaKhoBq(data.diemKhoBq);
          this.getListNganKhoBq(data.nhaKhoBq);
          this.getListLoKhoBq(data.nganKhoBq);
        }
      }
    });

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
      s.ngayDieuChuyen = this.formDataChiTiet.value.ngayDieuChuyen;
    });
    this.buildTableView();
    this.isVisibleSuaChiCuc = false;
    //clean
    this.formDataChiTiet.reset();
    this.formDataChiTiet.patchValue({tonKho: 0, duToanChiPhi: 0, slDieuChuyen: 0});
  }

  handleCancelSuaChiCuc(): void {
    this.isVisibleSuaChiCuc = false;

    //clean
    this.formDataChiTiet.reset();
    this.formDataChiTiet.patchValue({tonKho: 0, duToanChiPhi: 0, slDieuChuyen: 0});
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
    this.formData.controls["loaiNhapXuat"].setValidators([Validators.required]);
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
}
