import { saveAs } from 'file-saver';
import { PhieuXuatKhoDieuChuyenService } from './../../services/dcnb-xuat-kho.service';
import { BangKeCanHangDieuChuyenService } from './../../services/dcnb-bang-ke-can-hang.service';
import { QuyetDinhDieuChuyenCucService } from './../../../../../../services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from "@angular/forms";
import { UserLogin } from "src/app/models/userlogin";
import { DiaDiemGiaoNhan, KeHoachBanDauGia, PhanLoTaiSan } from "src/app/models/KeHoachBanDauGia";
import { DatePipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { DanhMucService } from "src/app/services/danhmuc.service";
import { DeXuatKeHoachBanDauGiaService } from "src/app/services/deXuatKeHoachBanDauGia.service";
import { DonviService } from "src/app/services/donvi.service";
import { TinhTrangKhoHienThoiService } from "src/app/services/tinhTrangKhoHienThoi.service";
import { DanhMucTieuChuanService } from "src/app/services/quantri-danhmuc/danhMucTieuChuan.service";
import { QuanLyHangTrongKhoService } from "src/app/services/quanLyHangTrongKho.service";
import * as dayjs from "dayjs";
import { MESSAGE } from "src/app/constants/message";
import { STATUS } from 'src/app/constants/status';
import { Base2Component } from "src/app/components/base2/base2.component";
import { v4 as uuidv4 } from 'uuid';
import { chain, cloneDeep } from 'lodash';
import {
  DialogTableSelectionComponent
} from "src/app/components/dialog/dialog-table-selection/dialog-table-selection.component";
import { convertTienTobangChu, convertTienTobangChuThapPhan } from 'src/app/shared/commonFunction';
import { PassDataXuatBangKeCanHang } from '../bang-ke-can.component';
import { PREVIEW } from 'src/app/constants/fileType';


@Component({
  selector: 'app-xdcnb-chi-tiet-bang-ke-can',
  templateUrl: './chi-tiet-bang-ke-can.component.html',
  styleUrls: ['./chi-tiet-bang-ke-can.component.scss']
})
export class ChiTietBangKeCanDieuChuyenComponent extends Base2Component implements OnInit {
  @Input() isVatTu: boolean;
  @Input() loaiDc: string;
  @Input() thayDoiThuKho: boolean;
  @Input() type: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() isViewOnModal: boolean;
  @Input() passData: PassDataXuatBangKeCanHang;
  @Output()
  showListEvent = new EventEmitter<any>();
  loaiVthh: string;
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
  listHangHoaAll: any[] = [];
  listLoaiHangHoa: any[] = [];
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  userInfo: UserLogin;
  expandSet = new Set<number>();
  bangPhanBoList: Array<any> = [];
  khBanDauGia: KeHoachBanDauGia = new KeHoachBanDauGia();
  diaDiemGiaoNhan: DiaDiemGiaoNhan = new DiaDiemGiaoNhan();
  listChungLoaiHangHoa: any[] = [];
  maDeXuat: string;
  listLoaiHopDong: any[] = [];
  STATUS = STATUS;
  listLoaiHinhNhapXuat: any[] = [];
  listKieuNhapXuat: any[] = [];
  datePipe = new DatePipe('en-US');
  tongSl = 0;
  tongTien = 0;
  diaDiemNhapKho: any[] = [];
  dcnbBangKeCanHangDtlCreate: any = {};
  dcnbBangKeCanHangDtlClone: any = {};
  dsDonVi: any = [];
  dsQuyetDinhDC: any = [];
  dsPhieuXuatKho: any = [];
  dsDiaDiem: any = [];
  expandSetString = new Set<string>();
  phuongAnView = [];
  phuongAnRow: any = {};
  isVisible = false;
  isVisibleSuaNoiDung = false;
  listNoiDung = []
  listThanhTien: any;
  listSoLuong: any;
  errorInputComponent: any[] = [];
  flagInit: Boolean = true;
  listDiaDiemKho: any[] = [];
  LIST_TRANG_THAI: { [key: string]: string } = {
    [this.STATUS.DU_THAO]: "Dự thảo",
    [this.STATUS.CHO_DUYET_LDCC]: "Chờ duyệt LĐ Chi Cục",
    [this.STATUS.TU_CHOI_LDCC]: "Từ chối LĐ Chi Cục",
    [this.STATUS.DA_DUYET_LDCC]: "Đã duyệt LĐ Chi Cục"
  }
  maBb: string;
  danhSachHangHoaQD: any[] = [];
  previewName: string = "nhap_xuat_lt_bang_ke_can_hang_nhap_lt";
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
    private quyetDinhDieuChuyenCucService: QuyetDinhDieuChuyenCucService,
    private bangKeCanHangDieuChuyenService: BangKeCanHangDieuChuyenService,
    private phieuXuatKhoDieuChuyenService: PhieuXuatKhoDieuChuyenService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bangKeCanHangDieuChuyenService);
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
        maQhns: ['', [Validators.required]],
        soBangKe: [''],
        qdinhDccId: ['', [Validators.required]],
        soQdinhDcc: ['', [Validators.required]],
        ngayKyQdDcc: ['', [Validators.required]],
        ngayNhap: ['', [Validators.required]],
        maDiemKho: ['', [Validators.required]],
        maNhaKho: ['', [Validators.required]],
        maNganKho: ['', [Validators.required]],
        maLoKho: [''],
        maKho: [''],
        phieuXuatKhoId: ['', [Validators.required]],
        soPhieuXuatKho: ['', [Validators.required]],
        ngayXuatKho: ['', [Validators.required]],
        diaDaDiemKho: ['', [Validators.required]],
        loaiVthh: ['', [Validators.required]],
        cloaiVthh: ['', [Validators.required]],
        donViTinh: ['', [Validators.required]],
        moTaHangHoa: [''],
        tenNguoiGiaoHang: ['', [Validators.required]],
        cccd: ['', [Validators.required]],
        donViNguoiGiaoHang: ['', [Validators.required]],
        diaChiDonViNguoiGiaoHang: ['', [Validators.required]],
        thoiGianGiaoNhan: ['', [Validators.required]],
        tongTrongLuongBaoBi: [0],
        tongTrongLuongCabaoBi: [0],
        tongTrongLuongTruBi: [0],
        tongTrongLuongTruBiText: [''],
        ngayGduyet: [''],
        nguoiGduyetId: [''],
        ngayPduyet: [''],
        nguoiPduyetId: [''],
        lyDoTuChoi: [''],
        trangThai: ['00', [Validators.required]],
        tenDvi: ['', [Validators.required]],
        diaChiDvi: [''],
        tenLoaiVthh: ['', [Validators.required]],
        tenCloaiVthh: ['', [Validators.required]],
        tenTrangThai: ['Dự thảo', [Validators.required]],
        tenDiemKho: ['', [Validators.required]],
        tenNhaKho: ['', [Validators.required]],
        tenNganKho: ['', [Validators.required]],
        tenLoKho: [''],
        tenNganLoKho: ['', [Validators.required]],
        nguoiPduyet: [''],
        nguoiGduyet: [''],
        thuKhoId: ['', [Validators.required]],
        tenThuKho: ['', [Validators.required]],
        dcnbBangKeCanHangDtl: [new Array(), [Validators.required, Validators.minLength(1)]],
        thoiHanDieuChuyen: [''],
        keHoachDcDtlId: [, [Validators.required]]
      }
    );
    this.userInfo = this.userService.getUserLogin();
    this.maBb = `BKCH-${this.userInfo.DON_VI?.tenVietTat}`;

    // this.setTitle();
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      if (this.isViewOnModal) {
        this.isView = true;
      }
      this.loadDsVthh();
      await this.loadDetail(this.idInput)
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
    } finally {
      this.flagInit = false;
      await this.spinner.hide();
    }
  }

  async loadDsVthh() {
    let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg === MESSAGE.SUCCESS) {
      this.listHangHoaAll = res.data;
      this.listLoaiHangHoa = res.data?.filter((x) => x.ma.length === 4);
    }
  }

  // async loadDsDonVi() {
  //   let body = {
  //     trangThai: "01",
  //     maDviCha: this.userInfo.MA_DVI.substring(0, 4),
  //     type: "DV"
  //   };
  //   let res = await this.donViService.getDonViTheoMaCha(body);
  //   if (res.msg === MESSAGE.SUCCESS) {
  //     this.dsDonVi = res.data;
  //   } else {
  //     this.notification.error(MESSAGE.ERROR, res.msg);
  //   }
  // }

  async loadDSQdDc() {
    try {
      this.spinner.show()
      let body = {
        trangThai: STATUS.BAN_HANH,
        isVatTu: this.isVatTu,
        loaiDc: this.loaiDc,
        thayDoiThuKho: this.thayDoiThuKho,
        type: "00"
      }
      let res = await this.quyetDinhDieuChuyenCucService.getDsSoQuyetDinhDieuChuyenChiCuc(body);
      if (res.msg === MESSAGE.SUCCESS) {
        this.dsQuyetDinhDC = res.data;
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } catch (error) {
      console.log("e", error);
      this.notification.error(MESSAGE.ERROR, error);
    }
    finally {
      this.spinner.hide()
    }
  }

  async loadDetail(idInput: number) {
    if (idInput > 0) {
      await this.bangKeCanHangDieuChuyenService.getDetail(idInput)
        .then((res) => {
          if (res.msg === MESSAGE.SUCCESS) {
            this.formData.patchValue({ ...res.data, soBangKe: res.data.soBangKe ? res.data.soBangKe : this.genSoBangKe(res.data.id), tenNganLoKho: res.data.tenLoKho ? `${res.data.tenLoKho} - ${res.data.tenNganKho}` : res.data.tenNganKho });
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
      this.tinhTong();
    } else {
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
        maQhns: this.userInfo.DON_VI.maQhns,
        thuKhoId: this.userInfo.ID,
        tenThuKho: this.userInfo.TEN_DAY_DU,
        ...this.passData,
        tenNganLoKho: this.passData.tenLoKho ? `${this.passData.tenLoKho} - ${this.passData.tenNganKho}` : this.passData.tenNganKho
      });
      await Promise.allSettled([this.chiTietQdDc(this.passData.qdinhDccId), this.chiTietDiemKho(this.passData.maDiemKho), this.loadDsPhieuXuatKho(this.passData.qdinhDccId)]);
      this.dsPhieuXuatKho = this.dsPhieuXuatKho.filter(f => ((f.maloKho && f.maloKho === this.passData.maDiemKho) || (f.maloKho && f.maNganKho && f.maNganKho === this.passData.maNganKho)));
    }
  }
  genSoBangKe(id: number) {
    if (id) {
      return `${id}/${this.formData.value.nam}/${this.maBb}`
    }
  }

  expandAll() {
    this.phuongAnView.forEach(s => {
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


  async selectHangHoa(event: any) {
    let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha({ str: event });
    if (res.msg === MESSAGE.SUCCESS) {
      if (res.data) {
        this.listChungLoaiHangHoa = res.data;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  selectRow(item) {
    this.phuongAnView.forEach(i => i.selected = false);
    item.selected = true;
  }
  async save(isGuiDuyet?: boolean) {
    try {

      // this.formData.disable()
      let body = this.formData.value;
      body.loaiDc = this.loaiDc;
      body.isVatTu = this.isVatTu;
      body.thayDoiThuKho = this.thayDoiThuKho;
      body.type = this.type;
      body.loaiQding = this.loaiDc === "CUC" ? "XUAT" : undefined;
      this.helperService.markFormGroupTouched(this.formData);
      if (!this.formData.valid) return;
      const data = await this.createUpdate(body, null, isGuiDuyet);
      if (data) {
        this.formData.patchValue({ id: data.id, trangThai: data.trangThai, soBangKe: data.soBangKe });
        if (isGuiDuyet) {
          this.pheDuyet();
        }
      }
    } catch (error) {
      console.log("e", error)
    }
    finally {
      // this.formData.enable();

    }
  }
  pheDuyet() {
    let trangThai = '';
    let msg = '';
    let MSG = '';
    switch (this.formData.value.trangThai) {
      case STATUS.TU_CHOI_LDCC:
      case STATUS.DU_THAO:
        trangThai = STATUS.CHO_DUYET_LDCC
        msg = 'Bạn có muốn gửi duyệt ?'
        MSG = MESSAGE.GUI_DUYET_SUCCESS
        break;
      case STATUS.CHO_DUYET_LDCC:
        trangThai = STATUS.DA_DUYET_LDCC
        msg = 'Bạn có muốn duyệt bản ghi ?'
        MSG = MESSAGE.PHE_DUYET_SUCCESS
        break;
    }
    this.approve(this.formData.value.id, trangThai, msg, null, MSG)
  }

  async flattenTree(tree) {
    return tree.flatMap((item) => {
      return item.childData ? this.flattenTree(item.childData) : item;
    });
  }
  async addRow() {
    if (Object.keys(this.dcnbBangKeCanHangDtlCreate).length !== 0) {
      this.formData.patchValue({ dcnbBangKeCanHangDtl: [...this.formData.value.dcnbBangKeCanHangDtl, this.dcnbBangKeCanHangDtlCreate] });
      this.clearRow();
      this.tinhTong();
      this.formData.patchValue({ tongTrongLuongBaoBi: 0, tongTrongLuongTruBi: this.formData.value.tongTrongLuongCabaoBi, tongTrongLuongTruBiText: this.convertTienTobangChu(this.formData.value.tongTrongLuongCabaoBi, this.formData.value.donViTinh === "kg" ? "kilôgam" : this.formData.value.donViTinh) })
    }
  }

  async clearRow() {
    this.dcnbBangKeCanHangDtlCreate = {}
  }

  async editRow(i: number) {
    this.formData.value.dcnbBangKeCanHangDtl.forEach(s => s.isEdit = false);
    this.formData.value.dcnbBangKeCanHangDtl[i].isEdit = true;
    Object.assign(this.dcnbBangKeCanHangDtlClone, this.formData.value.dcnbBangKeCanHangDtl[i]);
  }

  async deleteRow(i: number) {
    this.formData.value.dcnbBangKeCanHangDtl.splice(i, 1);
    this.tinhTong();
    this.formData.patchValue({ tongTrongLuongBaoBi: 0, tongTrongLuongTruBi: this.formData.value.tongTrongLuongCabaoBi, tongTrongLuongTruBiText: this.convertTienTobangChu(this.formData.value.tongTrongLuongCabaoBi, this.formData.value.donViTinh === "kg" ? "kilôgam" : this.formData.value.donViTinh) })
  }

  async saveRow(i: number) {
    this.formData.value.dcnbBangKeCanHangDtl[i].isEdit = false;
    this.tinhTong();
    this.formData.patchValue({ tongTrongLuongBaoBi: 0, tongTrongLuongTruBi: this.formData.value.tongTrongLuongCabaoBi, tongTrongLuongTruBiText: this.convertTienTobangChu(this.formData.value.tongTrongLuongCabaoBi, this.formData.value.donViTinh === "kg" ? "kilôgam" : this.formData.value.donViTinh) })
  }

  async cancelRow(i: number) {
    Object.assign(this.formData.value.dcnbBangKeCanHangDtl[i], this.dcnbBangKeCanHangDtlClone);
    this.formData.value.dcnbBangKeCanHangDtl[i].isEdit = false;
    this.tinhTong()
  }

  async openDialogSoQd() {
    await this.loadDSQdDc()
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định điều chuyển hàng hóa',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.dsQuyetDinhDC,
        dataHeader: ['Số quyết định', 'Ngày ký quyết định'],
        dataColumn: ['soQdinh', 'ngayKyQdinh'],
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        try {
          this.spinner.show();
          this.formData.patchValue({
            soQdinhDcc: data.soQdinh,
            qdinhDccId: data.id,
            ngayKyQdDcc: data.ngayKyQdinh,
            // dcnbBangKeCanHangDtl: this.formData.value.dcnbBangKeCanHangDtl
            maLoKho: '',
            tenLoKho: '',
            maNganKho: '',
            tenNganKho: '',
            maNhaKho: '',
            tenNhaKho: '',
            maDiemKho: '',
            tenDiemKho: '',
            loaiVthh: '',
            tenLoaiVthh: '',
            cloaiVthh: '',
            tenCloaiVthh: '',
            tenNguoiGiaoHang: '',
            donViTinh: '',
            soPhieuXuatKho: '',
            phieuXuatKhoId: '',
            cccd: '',
            donViNguoiGiaoHang: '',
            diaChiDonViNguoiGiaoHang: '',
            thoiGianGiaoNhan: '',
            tongTrongLuongCabaoBi: 0,
            tongTrongLuongBaoBi: 0,
            tongTrongLuongTruBi: 0,
            tongTrongLuongTruBiText: '',
            dcnbBangKeCanHangDtl: [],
            thoiHanDieuChuyen: '',
            keHoachDcDtlId: '',
          });
          this.danhSachHangHoaQD = [];
          if (data.id) {
            this.chiTietQdDc(data.id)
          }
        } catch (error) {
          console.log("e", error);
          this.notification.error(MESSAGE.ERROR, error)
        } finally {
          this.spinner.hide();

        }
      }
    });
  };
  async loadDsPhieuXuatKho(id: number) {
    try {

      const body = {
        // soQdinhDcc: data.soQdinh,
        // paggingReq: {
        //   limit: this.globals.prop.MAX_INTERGER,
        //   page: 0
        // }
        qdinhDccId: id,
        loaiDc: this.loaiDc,
        isVatTu: this.isVatTu,
        thayDoiThuKho: this.thayDoiThuKho,
        type: this.type

      }
      let dataRes = await this.phieuXuatKhoDieuChuyenService.danhSach(body);
      if (dataRes.msg === MESSAGE.SUCCESS) {
        this.dsPhieuXuatKho = [];
        if (Array.isArray(dataRes.data)) {
          this.dsPhieuXuatKho = dataRes.data.filter(f => f.id);
        }
      } else {
        this.notification.error(MESSAGE.ERROR, dataRes.msg)
      }
    } catch (error) {
      console.log("error", error)
    }
  }
  async chiTietQdDc(id: number) {
    if (!id) return;
    const res = await this.quyetDinhDieuChuyenCucService.getDetail(id);
    if (res.msg === MESSAGE.SUCCESS) {
      this.danhSachHangHoaQD = res.data.danhSachQuyetDinh.reduce((arr, cur) => {
        arr = arr.concat(cur.dcnbKeHoachDcHdr.danhSachHangHoa);
        return arr
      }, []);
      this.formData.patchValue({ ngayKyQdDcc: res?.data?.ngayKyQdinh })
    }
  };
  getThoiHanDieuChuyen() {
    const { maLoKho, maNganKho, maNhaKho, maDiemKho } = this.formData.value;
    const thoiHanDieuChuyen = this.danhSachHangHoaQD.find(f => ((!f.maLoKho && !maLoKho) || (f.maLoKho === maLoKho)) && f.maNganKho === maNganKho && f.maNhaKho === maNhaKho && f.maDiemKho === maDiemKho);
    this.formData.patchValue({ thoiHanDieuChuyen: thoiHanDieuChuyen.thoiGianDkDc ? thoiHanDieuChuyen.thoiGianDkDc : null })
  }

  async openDialogPhieuXuatKho() {
    if (this.formData.value.qdinhDccId) {
      await this.loadDsPhieuXuatKho(this.formData.value.qdinhDccId)
    }
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách phiếu xuất kho',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.dsPhieuXuatKho,
        dataHeader: ['Số phiếu xuất kho', 'Ngày xuất kho'],
        dataColumn: ['soPhieuXuatKho', 'ngayXuatKho']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.detailPhieuXuatKho(data.id)
      }
    });
  }
  async detailPhieuXuatKho(phieuXuatKhoId) {
    const dataRes = await this.phieuXuatKhoDieuChuyenService.getDetail(phieuXuatKhoId);
    if (dataRes.msg === MESSAGE.SUCCESS) {
      this.formData.patchValue({
        phieuXuatKhoId: dataRes.data.id,
        soPhieuXuatKho: dataRes.data.soPhieuXuatKho,
        ngayXuatKho: dataRes.data.ngayXuatKho,
        tenNguoiGiaoHang: dataRes.data.nguoiGiaoHang,
        cccd: dataRes.data.soCmt,
        donViNguoiGiaoHang: dataRes.data.ctyNguoiGh,
        diaChiDonViNguoiGiaoHang: dataRes.data.diaChi,
        loaiVthh: dataRes.data.loaiVthh,
        cloaiVthh: dataRes.data.cloaiVthh,
        tenLoaiVthh: dataRes.data.tenLoaiVthh,
        tenCloaiVthh: dataRes.data.tenCloaiVthh,
        donViTinh: dataRes.data.donViTinh,
        thoiGianGiaoNhan: dataRes.data.thoiGianGiaoNhan,
        keHoachDcDtlId: dataRes.data.keHoachDcDtlId,

        maLoKho: dataRes.data.maLoKho,
        tenLoKho: dataRes.data.tenLoKho,
        maNganKho: dataRes.data.maNganKho,
        tenNganKho: dataRes.data.tenNganKho,
        maNhaKho: dataRes.data.maNhaKho,
        tenNhaKho: dataRes.data.tenNhaKho,
        maDiemKho: dataRes.data.maDiemKho,
        tenDiemKho: dataRes.data.tenDiemKho,
        tenNganLoKho: dataRes.data.tenLoKho ? `${dataRes.data.tenLoKho} - ${dataRes.data.tenNganKho}` : dataRes.data.tenNganKho,

        tongTrongLuongCabaoBi: 0,
        tongTrongLuongBaoBi: 0,
        tongTrongLuongTruBi: 0,
        tongTrongLuongTruBiText: '',
        dcnbBangKeCanHangDtl: []
      });
      this.getThoiHanDieuChuyen();
      this.chiTietDiemKho(dataRes.data.maDiemKho);
    }
  }
  async chiTietDiemKho(maDiemKho: string) {
    if (!maDiemKho) {
      this.formData.patchValue({
        diaDaDiemKho: ''
      })
    }
    const res = await this.donViService.layDonViCon();
    if (res.msg === MESSAGE.SUCCESS) {
      const dataDiemKho = res.data.find(f => f.maDvi === maDiemKho);
      if (dataDiemKho) {
        this.formData.patchValue({
          diaDaDiemKho: dataDiemKho.diaChi
        })
      }
    }
  }

  async changeNam() {
    if (!this.flagInit) {
      this.formData.patchValue({
        soBangKe: this.formData.value.soBangKe.replace(/\/\d+/, `/${this.formData.value.nam}`),
        dcnbBangKeCanHangDtl: this.formData.value.dcnbBangKeCanHangDtl
      })
    }
  }

  async tinhTong() {
    let dtl = cloneDeep(this.formData.value.dcnbBangKeCanHangDtl);
    let tongTrongLuongCabaoBi = dtl.reduce((prev, cur) => prev + cur.trongLuongCaBaoBi, 0);

    this.formData.patchValue({
      tongTrongLuongCabaoBi,
      dcnbBangKeCanHangDtl: this.formData.value.dcnbBangKeCanHangDtl
    });
  }
  async trongLuongTruBi() {
    let data = cloneDeep(this.formData.value);
    if (!!!data.tongTrongLuongBaoBi) {
      data.tongTrongLuongBaoBi = 0;
    }
    let tongTrongLuongTruBi = data.tongTrongLuongCabaoBi - data.tongTrongLuongBaoBi;
    this.formData.patchValue({
      tongTrongLuongTruBi,
      tongTrongLuongTruBiText: this.convertTienTobangChu(tongTrongLuongTruBi, this.formData.value.donViTinh === "kg" ? "kilôgam" : this.formData.value.donViTinh),
      tongTrongLuongBaoBi: data.tongTrongLuongBaoBi,
    });
  }

  convertTienTobangChu(tien: number, donVi?: string) {
    if (tien > 0) {
      let rs = convertTienTobangChuThapPhan(tien);
      return rs.charAt(0).toUpperCase() + rs.slice(1) + (donVi ? " " + donVi : "");
    }
  }
}
