import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormGroup, Validators } from "@angular/forms";
import { UserLogin } from "../../../../models/userlogin";
import { DatePipe } from "@angular/common";
import { Base2Component } from "../../../../components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { DanhMucService } from "../../../../services/danhmuc.service";
import { DonviService } from "../../../../services/donvi.service";
import { TinhTrangKhoHienThoiService } from "../../../../services/tinhTrangKhoHienThoi.service";
import { DanhMucTieuChuanService } from "../../../../services/quantri-danhmuc/danhMucTieuChuan.service";
import { QuanLyHangTrongKhoService } from "../../../../services/quanLyHangTrongKho.service";
import * as dayjs from "dayjs";
import { MESSAGE } from "../../../../constants/message";
import { STATUS } from "src/app/constants/status";
import { chain, cloneDeep } from 'lodash';
import * as uuid from "uuid";
import { KeHoachDieuChuyenService } from "../ke-hoach-dieu-chuyen.service";
import { DanhMucDungChungService } from "../../../../services/danh-muc-dung-chung.service";
import { MangLuoiKhoService } from "../../../../services/qlnv-kho/mangLuoiKho.service";
import { OldResponseData } from "../../../../interfaces/response";
import { AMOUNT_THREE_DECIMAL, AMOUNT_TWO_DECIMAL } from "../../../../Utility/utils";
import { CurrencyMaskInputMode } from "ngx-currency";
import {HelperService} from "../../../../services/helper.service";

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
  formDataChiTiet: FormGroup;
  tableForm: FormGroup;
  fileDinhKem: any[] = [];
  userLogin: UserLogin;
  listChiCuc: any[] = [];
  styleStatus: string = 'du-thao-va-lanh-dao-duyet';
  tabSelected: string = 'thongTinChung';
  listNam: any[] = [];
  listHinhThucDvCcDvVanChuyen: any[];
  listPtGiaoHang: any[];
  listPtNhanHang: any[];
  listNguonChi: any[];
  listLoaiHangHoa: any[] = [];
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  userInfo: UserLogin;
  expandSet = new Set<number>();
  STATUS = STATUS;
  datePipe = new DatePipe('en-US');
  expandSetString = new Set<string>();
  tableView = [];
  isEditDetail: boolean = false;
  isVisible = false;
  isAddDiemKho = false;
  isVisibleSuaChiCuc = false;
  isNhanDieuChuyen = false;
  errorInputComponent: any[] = [];
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
  AMOUNT = {
    allowZero: true,
    allowNegative: false,
    precision: 2,
    prefix: '',
    thousands: '.',
    decimal: ',',
    align: "left",
    nullable: true,
    min: 0,
    max: 100000000000,
    inputMode: CurrencyMaskInputMode.NATURAL,
  }

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
        trachNhiemDviTh: ['', [Validators.required]],
        xdLaiDiemNhap: [''],
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
        slDcConLai: [0, [Validators.required]],
        thuKho: ['', []],
        thuKhoNhan: ['', []],
        thuKhoId: [undefined, []],
        thuKhoNhanId: [undefined, []],
        thayDoiThuKho: [false, []],
        namNhap: [undefined, [Validators.required]]
      }
    );
    this.tableForm = this.fb.group({
      rows: this.fb.array([])
    });
    this.userInfo = this.userService.getUserLogin();
    this.dataChiCuc = [{ maDvi: this.userInfo.MA_DVI, tenDvi: this.userInfo.TEN_DVI }]
  }

  createRow(id, maChiCucNhan, tenChiCucNhan, hinhThucDvCcDvVanChuyen, tenHinhThucDvCcDvVanChuyen, pthucGiaoHang, tenPthucGiaoHang, pthucNhanHang, tenPthucNhanHang, nguonChi, tenNguonChi): FormGroup {
    return this.fb.group({
      id: [id],
      maChiCucNhan: [maChiCucNhan, Validators.required],
      tenChiCucNhan: [tenChiCucNhan, Validators.required],
      hinhThucDvCcDvVanChuyen: [hinhThucDvCcDvVanChuyen, Validators.required],
      tenHinhThucDvCcDvVanChuyen: [tenHinhThucDvCcDvVanChuyen, Validators.required],
      pthucGiaoHang: [pthucGiaoHang, Validators.required],
      tenPthucGiaoHang: [tenPthucGiaoHang, Validators.required],
      pthucNhanHang: [pthucNhanHang, Validators.required],
      tenPthucNhanHang: [tenPthucNhanHang, Validators.required],
      nguonChi: [nguonChi, Validators.required],
      tenNguonChi: [tenNguonChi, Validators.required]
    });
  }

  get rows(): FormArray {
    return this.tableForm.get('rows') as FormArray;
  }

  rowControl(index: number): FormGroup {
    return <FormGroup>this.rows.controls[index];
  }

  valueRow(index: number): any {
    return this.tableForm.get('rows').value[index];
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
    if (!this.isView) {
      let resDonVi = await this.donViService.getDonVi({ str: this.userInfo.MA_DVI?.slice(0, -2) });
      if (resDonVi.msg == MESSAGE.SUCCESS) {
        this.dsDonVi = [resDonVi.data];
        if (this.dsDonVi) {
          let tenDviCuc = this.dsDonVi.find(item => item.maDvi === this.userInfo.MA_DVI?.slice(0, -2));
          if (tenDviCuc) {
            this.formData.controls['tenDviCuc'].setValue(tenDviCuc.tenDvi);
          }
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  async loadDsChiCuc(value?) {
    let body = {
      trangThai: "01",
      maDviCha: value ? value.maCucNhan ? value.maCucNhan : this.userInfo.MA_DVI.substring(0, 6) : this.userInfo.MA_DVI.substring(0, 6),
      type: "DV"
    };
    let res = await this.donViService.getDonViTheoMaCha(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (value && value.type == 'NDC') {
        this.listChiCucNhan = Array.isArray(res.data) ? res.data : [];
      } else {
        this.listChiCucNhan = Array.isArray(res.data) ? res.data.filter(f => {
          return f.maDvi !== this.userInfo.MA_DVI
        }) : [];
      }
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
            if (res.data.phuongAnDieuChuyen) {
              this.rows.clear();
              for (let pa of res.data.phuongAnDieuChuyen) {
                this.rows.push(this.createRow(pa.id, pa.maChiCucNhan,
                  pa.tenChiCucNhan, pa.hinhThucDvCcDvVanChuyen, pa.tenHinhThucDvCcDvVanChuyen,
                  pa.pthucGiaoHang, pa.tenPthucGiaoHang, pa.pthucNhanHang, pa.tenPthucNhanHang, pa.nguonChi, pa.tenNguonChi));
              }
            }
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
                this.listDiemKhoBq = [];
                this.listDiemKhoBq = [
                  ...this.listDiemKhoBq,
                  ...element.children.filter(item => item.type == 'MLK')
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
                this.listDiemKhoNhanBq = [];
                this.listDiemKhoNhanBq = [
                  ...this.listDiemKhoNhanBq,
                  ...element.children.filter(item => item.type == 'MLK')
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
      tenNganKho: "",
      maLoKho: "",
      tenLoKho: "",
      tenDiemKho: tenDiemKho ? tenDiemKho.tenDvi : "",
      coLoKho: true,
      thuKho: "",
      thuKhoId: undefined,
      loaiVthh: "",
      tenLoaiVthh: "",
      cloaiVthh: "",
      tenCloaiVthh: "",
      donViTinh: "",
      tonKho: 0,
      namNhap: undefined
    });
    this.getListNhaKhoBq(value)
  }
  changeNhaKho = (value) => {
    let tenNhaKho = (this.listNhaKhoBq ? this.listNhaKhoBq : []).find(item => item.maDvi === value);
    this.listNganKhoBq = [];
    this.listLoKhoBq = []
    this.formDataChiTiet.patchValue({
      maNganKho: "",
      tenNganKho: "",
      maLoKho: "",
      tenLoKho: "",
      tenNhaKho: tenNhaKho ? tenNhaKho.tenDvi : "",
      coLoKho: true,
      thuKho: "",
      thuKhoId: undefined,
      loaiVthh: "",
      tenLoaiVthh: "",
      cloaiVthh: "",
      tenCloaiVthh: "",
      donViTinh: "",
      tonKho: 0,
      namNhap: undefined
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
        let coLoKho = !!res.data.object.coLoKho;
        let thuKho = res.data.object.detailThuKho?.fullName;
        let thuKhoId = res.data.object.detailThuKho?.id;
        if (!coLoKho) {
          this.removeValidateFormChiTiet("maLoKho");
          this.removeValidateFormChiTiet("tenLoKho");
        } else {
          this.addValidateFormChiTiet("maLoKho");
          this.addValidateFormChiTiet("tenLoKho");
        }
        if (!coLoKho) {
          this.formDataChiTiet.patchValue({
            loaiVthh: res.data.object.loaiVthh,
            tenLoaiVthh: res.data.object.tenLoaiVthh,
            cloaiVthh: res.data.object.cloaiVthh,
            tenCloaiVthh: res.data.object.tenCloaiVthh,
            donViTinh: res.data.object.dviTinh,
            tonKho: res.data.object.slTon,
            namNhap: res.data.object.namNhap
          });
        }
        this.listLoKhoBq = [];

        this.formDataChiTiet.patchValue({
          coLoKho: coLoKho,
          maLoKho: "",
          tenLoKho: "",
          tenNganKho: tenNganKho ? tenNganKho.tenDvi : "",
          thuKho: thuKho,
          thuKhoId: thuKhoId,
        });
        this.getListLoKhoBq(value);
      } else {
        this.notification.error(MESSAGE.ERROR, res.error);
      }
    })
  }
  changeLoKho = (value) => {
    let tenLoKho = (this.listLoKhoBq ? this.listLoKhoBq : []).find(item => item.maDvi === value);
    this.formDataChiTiet.patchValue({ tenLoKho: tenLoKho ? tenLoKho.tenDvi : "" });
    if (value) {
      this.getDetailMlkByKey(tenLoKho.maDvi, tenLoKho.capDvi).then((res: OldResponseData) => {
        if (res.msg == MESSAGE.SUCCESS) {
          let thuKho = res.data.object.detailThuKho?.fullName;
          let thuKhoId = res.data.object.detailThuKho?.id;
          this.formDataChiTiet.patchValue({
            loaiVthh: res.data.object.loaiVthh,
            tenLoaiVthh: res.data.object.tenLoaiVthh,
            cloaiVthh: res.data.object.cloaiVthh,
            tenCloaiVthh: res.data.object.tenCloaiVthh,
            donViTinh: res.data.object.dviTinh,
            tonKho: res.data.object.slTon,
            namNhap: res.data.object.namNhap,
          });
          this.formDataChiTiet.patchValue({
            thuKho: thuKho,
            thuKhoId: thuKhoId,
          });
        } else {
          this.notification.error(MESSAGE.ERROR, res.error);
        }
      })
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
      tenNganKho: "",
      maLoKho: "",
      tenLoKho: "",
      tenChiCucNhan: tenChiCucNhan ? tenChiCucNhan.tenDvi : "",
      coLoKho: true,
      thuKho: "",
      thuKhoId: undefined,
      loaiVthh: "",
      tenLoaiVthh: "",
      cloaiVthh: "",
      tenCloaiVthh: "",
      donViTinh: "",
      tonKho: 0,
      namNhap: undefined
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
      this.rows.clear();
      this.listChiCucNhan = [];
      this.addValidateFormData("maCucNhan");
    } else {
      this.formData.patchValue({
        tenLoaiDc: "Giữa 2 chi cục trong cùng 1 cục",
        maCucNhan: "",
        danhSachHangHoa: [],
        canCu: []
      });
      this.tableView = [];
      this.rows.clear();
      this.listChiCucNhan = [];
      this.removeValidateFormData("maCucNhan");
      this.loadDsChiCuc();
    }
  }

  selectRow(item) {
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
    if (!this.isNhanDieuChuyen) {
      this.disableValidateFormChiTietHangHoaNDC();
    }
    if (!this.formDataChiTiet.value.coLoKho) {
      this.removeValidateFormChiTiet("maLoKho");
      this.removeValidateFormChiTiet("tenLoKho");
    }
    this.helperService.markFormGroupTouched(this.formDataChiTiet);
    if (this.formDataChiTiet.invalid) {
      return;
    }
    if (this.isNhanDieuChuyen) {
      if (this.formDataChiTiet.controls['slDcConLai'].value < 0) {
        this.notification.error(MESSAGE.ERROR, "Số lượng điều chuyển còn lại không thể nhỏ hơn 0!");
        return;
      }
    }

    if (!this.formDataChiTiet.value.idVirtual) {
      this.formDataChiTiet.controls['idVirtual'].setValue(uuid.v4());
      if (this.formData.value.danhSachHangHoa && this.formData.value.danhSachHangHoa.length > 0) {
        // check lô kho xuất
        if (!this.isNhanDieuChuyen) {
          this.handleOkDieuChuyen();
        } else {
          this.handleOkNhanDieuChuyen();
        }
      } else {
        this.formData.patchValue({
          danhSachHangHoa: [this.formDataChiTiet.value]
        });
      }
    } else { // lần đầu
      if (!this.isNhanDieuChuyen) {
        let maLoKho = this.formData.value.danhSachHangHoa.find(item => ((item.maLoKho == this.formDataChiTiet.value.maLoKho) && item.maChiCucNhan == this.formDataChiTiet.value.maChiCucNhan));
        if (maLoKho && !this.isEditDetail) {
          this.notification.error(MESSAGE.ERROR, "Vui lòng chọn lô kho khác!");
          return;
        }
      } else {
        let maLoKho = this.formData.value.danhSachHangHoa.find(item => ((item.maLoKhoNhan == this.formDataChiTiet.value.maLoKhoNhan) && item.maDiemKhoNhan == this.formDataChiTiet.value.maDiemKhoNhan));
        if (maLoKho && !this.isEditDetail) {
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
    this.isAddDiemKho = false;
    //clean
    this.formDataChiTiet.reset();
    this.formDataChiTiet.patchValue({ tonKho: 0, duToanKphi: 0, soLuongDc: 0 });
    this.errorInputComponent = [];
    this.listChiCuc = []
  }
  handleOkDieuChuyen() {
    if (this.formDataChiTiet.value.maLoKho) {
      let maLoKho = this.formData.value.danhSachHangHoa.find(item => ((item.maLoKho == this.formDataChiTiet.value.maLoKho) && item.maChiCucNhan == this.formDataChiTiet.value.maChiCucNhan));
      if (maLoKho && !this.isEditDetail) {
        this.notification.error(MESSAGE.ERROR, "Vui lòng chọn lô kho khác!");
        return;
      } else {
        this.formData.patchValue({
          danhSachHangHoa: [...this.formData.value.danhSachHangHoa, this.formDataChiTiet.value]
        })
      }
    } else {
      let maNganKho = this.formData.value.danhSachHangHoa.find(item => ((item.maNganKho == this.formDataChiTiet.value.maNganKho) && item.maChiCucNhan == this.formDataChiTiet.value.maChiCucNhan));
      if (maNganKho && !this.isEditDetail) {
        this.notification.error(MESSAGE.ERROR, "Vui lòng chọn ngăn kho khác!");
        return;
      } else {
        this.formData.patchValue({
          danhSachHangHoa: [...this.formData.value.danhSachHangHoa, this.formDataChiTiet.value]
        })
      }
    }
  }
  handleOkNhanDieuChuyen() {
    if (this.formDataChiTiet.value.maLoKhoNhan) {
      let maLoKho = this.formData.value.danhSachHangHoa.find(item => ((item.maLoKhoNhan == this.formDataChiTiet.value.maLoKhoNhan) && item.maDiemKhoNhan == this.formDataChiTiet.value.maDiemKhoNhan));
      if (maLoKho && !this.isEditDetail) {
        this.notification.error(MESSAGE.ERROR, "Vui lòng chọn lô kho khác!");
        return;
      } else {
        this.formData.patchValue({
          danhSachHangHoa: [...this.formData.value.danhSachHangHoa, this.formDataChiTiet.value]
        })
      }
    } else {
      let maNganKho = this.formData.value.danhSachHangHoa.find(item => ((item.maNganKhoNhan == this.formDataChiTiet.value.maNganKhoNhan) && item.maDiemKhoNhan == this.formDataChiTiet.value.maDiemKhoNhan));
      if (maNganKho && !this.isEditDetail) {
        this.notification.error(MESSAGE.ERROR, "Vui lòng chọn ngăn kho khác!");
        return;
      } else {
        this.formData.patchValue({
          danhSachHangHoa: [...this.formData.value.danhSachHangHoa, this.formDataChiTiet.value]
        })
      }
    }
  }
  handleCancel(): void {
    this.isVisible = false;
    this.isEditDetail = false;
    this.isAddDiemKho = false;
    //clean
    this.formDataChiTiet.reset();
    this.formDataChiTiet.patchValue({ coLoKho: true, tonKho: 0, duToanKphi: 0, soLuongDc: 0 });
    this.errorInputComponent = [];
    this.listChiCuc = []
  }

  buildTableView() {
    let danhSachView = this.formData.value.danhSachHangHoa.map(item => {
      // Ngăn kho C1/2-Nhà kho C1
      return {
        ...item,
        loKhoXuat: item.coLoKho ? item.tenLoKho + " - " + item.tenNhaKho : item.tenNganKho + " - " + item.tenNhaKho,
        loKhoNhan: item.coLoKhoNhan ? item.tenLoKhoNhan + " - " + item.tenNhaKhoNhan : item.tenNganKhoNhan + " - " + item.tenNhaKhoNhan,
      };
    });
    let dataView = chain(danhSachView)
      .groupBy("maChiCucNhan")
      .map((value, key) => {
        let rs = chain(value)
          .groupBy("maDiemKho")
          .map((v, k) => {
            let rss = chain(v)
              .groupBy("loKhoXuat")
              .map((vs, ks) => {
                let rsss = chain(vs)
                  .groupBy("maDiemKhoNhan")
                  .map((vss, kss) => {
                    let maLoKho = vss.find(s => (s.maDiemKhoNhan == kss));
                    let rssss = chain(vss)
                      .groupBy("loKhoNhan")
                      .map((vsss, ksss) => {
                        let maLoKhoNhan = vsss.find(s => (s.loKhoNhan == ksss));
                        return {
                          ...maLoKhoNhan,
                          idVirtual: maLoKhoNhan ? maLoKhoNhan.idVirtual ? maLoKhoNhan.idVirtual : uuid.v4() : uuid.v4(),
                        }
                      }).value();
                    return {
                      ...maLoKho,
                      idVirtual: maLoKho ? maLoKho.idVirtual ? maLoKho.idVirtual : uuid.v4() : uuid.v4(),
                      childData: (kss != "null" && kss != null && kss != undefined && kss != "undefined" && kss != "") ? rssss : []
                    }
                  }
                  ).value().filter(it => it.maDiemKhoNhan != undefined);
                let duToanKphi = vs.reduce((prev, cur) => prev + cur.duToanKphi, 0);
                let rowNganKho = vs.find(s => s.loKhoXuat === ks);

                return {
                  ...rowNganKho,
                  idVirtual: rowNganKho ? rowNganKho.idVirtual ? rowNganKho.idVirtual : uuid.v4() : uuid.v4(),
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
                  duToanKphi: duToanKphi,
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
  }

  buildTableEdit() {
    let dataView = chain(this.formData.value.danhSachHangHoa)
      .groupBy("maChiCucNhan")
      .map((value, key) => {
        let rowChiCuc = value.find(s => s.maChiCucNhan === key);
        let rowChiCucHt = this.rows.value.find(s => s.maChiCucNhan === key);

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
    if (dataView) {

      this.rows.clear();
      for (let pa of dataView) {
        this.rows.push(this.createRow(pa.id, pa.maChiCucNhan,
          pa.tenChiCucNhan, pa.hinhThucDvCcDvVanChuyen, pa.tenHinhThucDvCcDvVanChuyen,
          pa.pthucGiaoHang, pa.tenPthucGiaoHang, pa.pthucNhanHang, pa.tenPthucNhanHang, pa.nguonChi, pa.tenNguonChi));
      }
    }
  }

  async save(isBack?, isValid?, isShowMsg?) {
    const body = {
      ...this.formData.value,
      phuongAnDieuChuyen: this.rows.value
    }
    if (isValid) {
      for (let r of this.rows.controls) {
        this.helperService.markFormGroupTouched(r);
        if (r.invalid) {
          return;
        }
      }
    }

    let result = await this.createUpdate(body, undefined, isValid, !!isShowMsg ? isShowMsg : true);
    this.formData.controls['id'].setValue(result.id);
    if (isBack === false) {
      return result;
    }
    if (result) {
      this.quayLai();
    }
  }

  async createUpdate(body, roles?: any, isValid?, isShowMsg?) {
    if (!this.checkPermission(roles)) {
      return
    }
    this.spinner.show();
    try {
      if (isValid) {
        this.helperService.markFormGroupTouched(this.formData);
        if (this.formData.invalid) {
          return;
        }
      }
      let res = null;
      if (body.id && body.id > 0) {
        res = await this.keHoachDieuChuyenService.update(body);
      } else {
        res = await this.keHoachDieuChuyenService.create(body);
      }
      if (res.msg == MESSAGE.SUCCESS) {
        if (body.id && body.id > 0) {
          if (isShowMsg) {
            this.notification.success(MESSAGE.NOTIFICATION, MESSAGE.UPDATE_SUCCESS);
          }
          this.spinner.hide();
          return res.data;
        } else {
          if (isShowMsg) {
            this.notification.success(MESSAGE.NOTIFICATION, MESSAGE.ADD_SUCCESS);
          }
          this.spinner.hide();
          return res.data;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        this.spinner.hide();
        return null;
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e);
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }

  }

  async saveAndSend(message: string) {
    this.setValidForm();
    let isInvalid = false;
    if (!this.formData.value.danhSachHangHoa || (this.formData.value.danhSachHangHoa && this.formData.value.danhSachHangHoa.length === 0)) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng điền thông tin hàng DTQG cần điều chuyển! ');
      isInvalid = true;
    }
    for (let r of this.rows.controls) {
      this.helperService.markFormGroupTouched(r);
      if (r.invalid) {
        isInvalid = true;
      }
    }
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      isInvalid = true;
    }
    if (isInvalid) {
      return;
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: message,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        let result = await this.save(false, true, false);
        if (result) {
          this.idInput = result.id;
          if (this.formData.value.type == 'DC') {
            await this.approve(this.idInput, STATUS.CHODUYET_TBP_TVQT, message);
          } else if (this.formData.value.type == 'NDC') {
            await this.approve(this.idInput, STATUS.DA_PHANBO_DC_CHODUYET_TBP_TVQT, message);
          }
        }
      },
    });
  }

  async approve(id: number, trangThai: string, msg: string, roles?: any, msgSuccess?: string) {
    if (!this.checkPermission(roles)) {
      return
    }
    this.spinner.show();
    try {
      let body = {
        id: id,
        trangThai: trangThai,
      }
      let res = await this.keHoachDieuChuyenService.approve(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.notification.success(MESSAGE.NOTIFICATION, msgSuccess ? msgSuccess : MESSAGE.UPDATE_SUCCESS);
        this.spinner.hide();
        this.goBack();
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        this.spinner.hide();
      }
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async approveConfirm(id: number, trangThai: string, msg: string, roles?: any, msgSuccess?: string) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có muốn duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        let result = await this.save(false, true, false);
        if (result) {
          this.idInput = result.id;
          if (this.formData.value.type == 'DC') {
            await this.approve(this.idInput, trangThai, msgSuccess);
          } else if (this.formData.value.type == 'NDC') {
            await this.approve(this.idInput, trangThai, msgSuccess);
          }
        }
      },
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
    this.formDataChiTiet.patchValue({ tonKho: 0, duToanKphi: 0, soLuongDc: 0 });
  }

  handleCancelSuaChiCuc(): void {
    this.isVisibleSuaChiCuc = false;

    //clean
    this.formDataChiTiet.reset();
    this.formDataChiTiet.patchValue({ tonKho: 0, duToanKphi: 0, soLuongDc: 0 });
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
    if (value) {
      const tenCucNhan = this.dsDonViNhan.find(item => item.maDvi == value);
      this.formData.controls['tenCucNhan'].setValue(tenCucNhan.tenDvi);
      this.loadDsChiCuc(this.formData.value);
    }
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

  changeHinhThucDvCcDvVanChuyen(value: any, rowControl: any) {
    let tenHinhThucDvCcDvVanChuyen = (this.listHinhThucDvCcDvVanChuyen ? this.listHinhThucDvCcDvVanChuyen : []).find(item => item.ma === value);
    rowControl.controls['tenHinhThucDvCcDvVanChuyen'].setValue(tenHinhThucDvCcDvVanChuyen.giaTri);
  }

  changePtGiaoHang(value: any, rowControl: any) {
    let tenPthucGiaoHang = (this.listPtGiaoHang ? this.listPtGiaoHang : []).find(item => item.ma === value);
    rowControl.controls['tenPthucGiaoHang'].setValue(tenPthucGiaoHang.giaTri);
  }

  changePtNhanHang(value: any, rowControl: any) {
    let tenPthucNhanHang = (this.listPtNhanHang ? this.listPtNhanHang : []).find(item => item.ma === value);
    rowControl.controls['tenPthucNhanHang'].setValue(tenPthucNhanHang.giaTri);
  }

  changeNguonChi(value: any, rowControl: any) {
    let tenNguonChi = (this.listNguonChi ? this.listNguonChi : []).find(item => item.ma === value);
    rowControl.controls['tenNguonChi'].setValue(tenNguonChi.giaTri);
  }

  addDiemKho(item: any) {
    this.isAddDiemKho = true;
    let data = cloneDeep(item);
    data.idVirtual = undefined;
    data.id = undefined;
    data.maNhaKho = undefined;
    data.tenNhaKho = undefined;
    data.maNganKho = undefined;
    data.tenNganKho = undefined;
    data.coLoKho = true;
    data.maLoKho = undefined;
    data.tenLoKho = undefined;
    data.soLuongDc = 0;
    data.duToanKphi = 0;
    data.maDiemKhoNhan = undefined;
    data.tenDiemKhoNhan = undefined;
    data.maNhaKhoNhan = undefined;
    data.tenNhaKhoNhan = undefined;
    data.maNganKhoNhan = undefined;
    data.tenNganKhoNhan = undefined;
    data.coLoKhoNhan = undefined;
    data.maLoKhoNhan = undefined;
    data.tenLoKhoNhan = undefined;
    data.soLuongPhanBo = undefined;
    data.tichLuongKd = undefined;
    data.slDcConLai = undefined;
    data.namNhap = undefined;
    this.formDataChiTiet.patchValue(data);
    this.getListNhaKhoBq(data.maDiemKho);
    this.getListNganKhoBq(data.maNhaKho);
    this.getListLoKhoBq(data.maNganKho);
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
      tenNganKhoNhan: "",
      maLoKhoNhan: "",
      tenLoKhoNhan: "",
      tenDiemKhoNhan: tenDiemKhoNhan ? tenDiemKhoNhan.tenDvi : "",
      coLoKhoNhan: true,
      thuKhoNhan: "",
      thuKhoNhanId: undefined,
      soLuongPhanBo: 0,
      tichLuongKd: 0,
      slDcConLai: 0,
      thayDoiThuKho: false,
    });
    this.getListNhaKhoNhanBq(value);
  }

  changeNhaKhoNhan(value: any) {
    let tenNhaKhoNhan = (this.listNhaKhoNhanBq ? this.listNhaKhoNhanBq : []).find(item => item.maDvi === value);
    this.listNganKhoNhanBq = [];
    this.listLoKhoNhanBq = []
    this.formDataChiTiet.patchValue({
      maNganKhoNhan: "",
      tenNganKhoNhan: "",
      maLoKhoNhan: "",
      tenLoKhoNhan: "",
      tenNhaKhoNhan: tenNhaKhoNhan ? tenNhaKhoNhan.tenDvi : "",
      coLoKhoNhan: true,
      thuKhoNhan: "",
      thuKhoNhanId: undefined,
      soLuongPhanBo: 0,
      tichLuongKd: 0,
      slDcConLai: 0,
      thayDoiThuKho: false
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
        let coLoKhoNhan = !!res.data.object.coLoKho;
        let thuKhoNhan = res.data.object.detailThuKho?.fullName;
        let thuKhoNhanId = res.data.object.detailThuKho?.id;
        if (!coLoKhoNhan) {
          if ((this.formDataChiTiet.value.cloaiVthh.startsWith("01") || this.formDataChiTiet.value.cloaiVthh.startsWith("04"))) {
            this.formDataChiTiet.controls["tichLuongKd"].setValue(res.data.object.tichLuongKdLt);
          } else {
            this.formDataChiTiet.controls["tichLuongKd"].setValue(res.data.object.tichLuongKdVt);
          }
          this.removeValidateFormChiTiet("maLoKhoNhan");
          this.removeValidateFormChiTiet("tenLoKhoNhan");
        } else {
          this.addValidateFormChiTiet("maLoKhoNhan");
          this.addValidateFormChiTiet("tenLoKhoNhan");
        }
        this.listLoKhoNhanBq = [];

        this.formDataChiTiet.patchValue({
          coLoKhoNhan: coLoKhoNhan,
          tenNganKhoNhan: tenNganKhoNhan ? tenNganKhoNhan.tenDvi : "",
          thuKhoNhan: thuKhoNhan,
          thuKhoNhanId: thuKhoNhanId,
          thayDoiThuKho: (this.formDataChiTiet.value.thuKho !== thuKhoNhan)
        });
        this.getListLoKhoNhanBq(value);
      } else {
        this.notification.error(MESSAGE.ERROR, res.error);
      }
    })
  }

  changeLoKhoNhan(value: any) {
    let tenLoKhoNhan = (this.listLoKhoNhanBq ? this.listLoKhoNhanBq : []).find(item => item.maDvi === value);
    this.formDataChiTiet.patchValue({ tenLoKhoNhan: tenLoKhoNhan ? tenLoKhoNhan.tenDvi : "" });
    if (value) {
      this.getDetailMlkByKey(value, tenLoKhoNhan.capDvi).then((res: OldResponseData) => {
        if (res.msg == MESSAGE.SUCCESS) {
          if ((this.formDataChiTiet.value.cloaiVthh.startsWith("01") || this.formDataChiTiet.value.cloaiVthh.startsWith("04"))) {
            this.formDataChiTiet.controls["tichLuongKd"].setValue(res.data.object.tichLuongKdLt);
          } else {
            this.formDataChiTiet.controls["tichLuongKd"].setValue(res.data.object.tichLuongKdVt);
          }
          let thuKhoNhan = res.data.object.detailThuKho?.fullName;
          let thuKhoNhanId = res.data.object.detailThuKho?.id;
          this.formDataChiTiet.patchValue({
            thuKhoNhan: thuKhoNhan,
            thuKhoNhanId: thuKhoNhanId,
            thayDoiThuKho: (this.formDataChiTiet.value.thuKho !== thuKhoNhan)
          });
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

  private removeValidateFormChiTiet(value) {
    this.formDataChiTiet.controls[value].clearValidators();
  }

  private addValidateFormChiTiet(value) {
    this.formDataChiTiet.controls[value].setValidators(Validators.required);
  }

  private removeValidateFormData(value) {
    this.formData.controls[value].clearValidators();
  }

  private addValidateFormData(value) {
    this.formData.controls[value].setValidators(Validators.required);
  }

  changeSoLuongPhanBo(value: any) {
    this.formDataChiTiet.controls['slDcConLai'].setValue(this.tinhSlDcConLai() - value);
  }

  tinhSlDcConLai() {
    let items = this.formData.controls['danhSachHangHoa'].value.filter(item => (
      item.maLoKho == this.formDataChiTiet.controls['maLoKho'].value
      && item.maNganKho == this.formDataChiTiet.controls['maNganKho'].value
      && item.maChiCucNhan == this.formDataChiTiet.controls['maChiCucNhan'].value
      && item.idVirtual != this.formDataChiTiet.controls['idVirtual'].value));
    const tongSoLuongPhanBo = items.reduce((total, currentValue) => {
      return total + currentValue.soLuongPhanBo;
    }, 0);
    return this.formDataChiTiet.value.soLuongDc - tongSoLuongPhanBo;
  }

  async addDiemKhoNhan(data: any) {
    if (data.childData.length !== 0) {
      data.idVirtual = undefined;
      data.id = undefined;
    }
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

  private disableValidateFormChiTietHangHoaNDC() {
    this.removeValidateFormChiTiet("maDiemKhoNhan");
    this.removeValidateFormChiTiet("tenDiemKhoNhan");
    this.removeValidateFormChiTiet("maNhaKhoNhan");
    this.removeValidateFormChiTiet("tenNhaKhoNhan");
    this.removeValidateFormChiTiet("maLoKhoNhan");
    this.removeValidateFormChiTiet("tenLoKhoNhan");
    this.removeValidateFormChiTiet("maNganKhoNhan");
    this.removeValidateFormChiTiet("tenNganKhoNhan");
    this.removeValidateFormChiTiet("coLoKhoNhan");
    this.removeValidateFormChiTiet("soLuongPhanBo");
    this.removeValidateFormChiTiet("tichLuongKd");
    this.removeValidateFormChiTiet("slDcConLai");
  }

  signXml() {
    let data = this.formData.value;
    this.helperService.exc_sign_xml(this, data, (sender, rv)=>{
      var received_msg = JSON.parse(rv);
      if (received_msg.Status == 0) {
        alert("Ký số thành công!");
        console.log(received_msg.Signature);
        // luu lai received_msg.Signature
        this.helperService.exc_verify_xml(this.helperService.decodeStringToBase64(received_msg.Signature), (rv)=>{
          console.log(rv);
        });
      } else {
        alert("Ký số không thành công:" + received_msg.Status + ":" + received_msg.Error);
      }
    });
    this.helperService.exc_check_digital_signatures((data)=>{
      alert(data.Description);
    });
  }
}
