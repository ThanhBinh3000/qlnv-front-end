import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { Base2Component } from "src/app/components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { NzCardModule, NzCardComponent } from "ng-zorro-antd/card";
import {
  DeXuatPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/DeXuatPhuongAnCuuTro.service";
import * as dayjs from "dayjs";
import { FileDinhKem } from "src/app/models/DeXuatKeHoachuaChonNhaThau";
import { MESSAGE } from "src/app/constants/message";
import { DanhMucService } from "src/app/services/danhmuc.service";
import {
  QuyetDinhPheDuyetPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhPheDuyetPhuongAnCuuTro.service";
import { DonviService } from "src/app/services/donvi.service";
import {
  TongHopPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/TongHopPhuongAnCuuTro.service";
import {
  DialogTableSelectionComponent
} from "src/app/components/dialog/dialog-table-selection/dialog-table-selection.component";
import * as uuidv4 from "uuid";
import { chain, cloneDeep } from 'lodash';
import { STATUS } from "src/app/constants/status";
import { QuyetDinhDieuChuyenCucService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service";
import { MaTongHopQuyetDinhDieuChuyenService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/ma-tong-hop-quyet-dinh-dieu-chinh.service";
import { SoDeXuatQuyetDinhDieuChuyenService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/so-de-xuat-quyet-dinh-dieu-chinh.service";
import { KeHoachDieuChuyenService } from "../../../../ke-hoach-dieu-chuyen/ke-hoach-dieu-chuyen.service";
import * as uuid from "uuid";
import { BienBanNghiemThuBaoQuanLanDauService } from "src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/bien-ban-nghiem-thu-bao-quan-lan-dau.service";
import { BienBanNhapDayKhoService } from "src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/bien-ban-nhap-day-kho";
import { PhieuNhapKhoService } from "src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/phieu-nhap-kho";
import { ThongTinKiemTraChatLuongComponent } from "../../phieu-kiem-tra-chat-luong/thong-tin-kiem-tra-chat-luong/thong-tin-kiem-tra-chat-luong.component";
import { ThongTinPhieuNhapKhoComponent } from "../../phieu-nhap-kho/thong-tin-phieu-nhap-kho/thong-tin-phieu-nhap-kho.component";
import { ThongTinBangKeCanHangComponent } from "../../bang-ke-can-hang/thong-tin-bang-ke-can-hang/thong-tin-bang-ke-can-hang.component";

@Component({
  selector: 'app-thong-tin-bien-ban-nhap-day-du',
  templateUrl: './thong-tin-bien-ban-nhap-day-du.component.html',
  styleUrls: ['./thong-tin-bien-ban-nhap-day-du.component.scss']
})
export class ThongTinBienBanNhapDayDuComponent extends Base2Component implements OnInit {
  @Input() loaiDc: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() data: any;
  @Output()
  showListEvent = new EventEmitter<any>();

  maBb: string;
  danhSach: any[] = []
  fileDinhKemReq: any[] = [];
  listDanhSachQuyetDinh: any[] = [];
  detailData: any
  dsKeHoach: any[] = []

  allCheckedTT = true;
  indeterminateTT = false;
  tongSL: string;
  previewName: string = "nhap_lt_bien_ban_nhap_day_kho";
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private cdr: ChangeDetectorRef,
    private danhMucService: DanhMucService,
    private phieuNhapKhoService: PhieuNhapKhoService,
    private quyetDinhDieuChuyenCucService: QuyetDinhDieuChuyenCucService,
    private bienBanNhapDayKhoService: BienBanNhapDayKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanNhapDayKhoService);
    this.formData = this.fb.group({
      id: [],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      nam: [dayjs().get("year"), [Validators.required]],
      tenDvi: [],
      maQhns: [],
      soBb: [],
      ngayLap: [dayjs().format('YYYY-MM-DD')],
      soQdDcCuc: [],
      ngayQdDcCuc: [],
      qdDcCucId: [],
      tenLoNganKho: [, [Validators.required]],
      tenLoKho: [],
      maLoKho: [],
      tenNganKho: [, [Validators.required]],
      maNganKho: [],
      tenNhaKho: [, [Validators.required]],
      maNhaKho: [],
      tenDiemKho: [, [Validators.required]],
      maDiemKho: [],
      idKeHoachDtl: [],
      loaiHinhKho: [],
      loaiVthh: [],
      tenLoaiVthh: [],
      cloaiVthh: [],
      tenCloaiVthh: [],
      dviTinh: [],
      isVatTu: false,
      ngayBdNhap: [],
      ngayKtNhap: [],
      soLuongQdDcCuc: [],
      lyDoTuChoi: [],
      ghiChu: [],
      tenKyThuatVien: [],
      idKyThuatVien: [],
      tenThuKho: [],
      idThuKho: [],
      tenKeToan: [],
      idKeToan: [],
      idLanhDao: [],
      tenLanhDao: [],
      children: [new Array<any>(),],
      type: ["01"],
      loaiDc: ["DCNB"],
      loaiQdinh: [],
      thayDoiThuKho: [],
      keHoachDcDtlId: [, [Validators.required]]
    }
    );
  }

  async ngOnInit() {
    this.maBb = 'BBNDK-' + this.userInfo.DON_VI.tenVietTat;
    let id = await this.userService.getId('DCNB_BB_NT_BQ_HDR_SEQ')
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      tenThuKho: this.userInfo.TEN_DAY_DU,
      soBb: `${id}/${this.formData.get('nam').value}/${this.maBb}`,
      loaiDc: this.loaiDc,
      loaiQdinh: this.loaiDc === "CUC" ? "NHAP" : null,
      thayDoiThuKho: this.loaiDc !== "DCNB" ? true : null
    })

    if (this.idInput) {
      await this.loadChiTiet(this.idInput)
    }

    if (this.data) {
      this.formData.patchValue({
        soQdDcCuc: this.data.soQdinh,
        ngayQdDcCuc: this.data.ngayKyQd,
        qdDcCucId: this.data.qdDcCucId,
        tenLoNganKho: `${this.data.tenLoKho || ""} ${this.data.tenNganKho || ""}`,
        tenLoKho: this.data.tenLoKho,
        maLoKho: this.data.maLoKho,
        tenNganKho: this.data.tenNganKho,
        maNganKho: this.data.maNganKho,
        tenNhaKho: this.data.tenNhaKho,
        maNhaKho: this.data.maNhaKho,
        tenDiemKho: this.data.tenDiemKho,
        maDiemKho: this.data.maDiemKho,
        loaiVthh: this.data.maHangHoa,
        tenLoaiVthh: this.data.tenHangHoa,
        cloaiVthh: this.data.maChLoaiHangHoa,
        tenCloaiVthh: this.data.tenChLoaiHangHoa,
        soLuongQdDcCuc: this.data.soLuongDc,
        dviTinh: this.data.donViTinh,
        keHoachDcDtlId: this.data.keHoachDcDtlId
      });
      await this.getDanhSachTT(this.data.soQdinh, this.data.maLoKho, this.data.maNganKho)
      await this.loadChiTietQdinh(this.data.qdDcCucId);
    }

  }

  isCuc() {
    return this.userService.isCuc()
  }

  isChiCuc() {
    return this.userService.isChiCuc()
  }

  async loadChiTiet(id: number) {
    await this.spinner.show()
    if (id) {
      let data = await this.detail(id);
      if (!data) return
      this.detailData = data
      this.formData.patchValue({
        ...data,
        tenLoNganKho: `${data.tenLoKho || ""} - ${data.tenNganKho || ""}`,
      });
      this.fileDinhKemReq = data.fileDinhKems
      this.danhSach = data.children
      await this.getDanhSachTT(data.soQdDcCuc, data.maLoKho, data.maNganKho)
      await this.loadChiTietQdinh(data.qdDcCucId);
    }
    await this.spinner.hide();
  }

  async getDanhSachTT(soQdDcCuc, maLoKho, maNganKho) {
    const body = {
      soQdDcCuc,
      maLoKho,
      maNganKho,
      trangThai: STATUS.DA_DUYET_LDCC,
      isVatTu: false
    }

    let res = await this.phieuNhapKhoService.getDanhSachTT(body);
    if (res.msg == MESSAGE.SUCCESS) {
      const children = this.idInput ? this.detailData?.children : res.data
      this.danhSach = res.data.map(element => {
        const check = children.find(item => item.soPhieuNhapKho === element.soPhieuNhapKho)
        return {
          ...element,
          checked: !!check || false
        }
      });
      const pnk = this.danhSach.filter(item => item.checked)[0]
      if (pnk) {
        this.formData.patchValue({
          ngayBdNhap: pnk.ngayNhapKho
        })
      } else {
        this.formData.patchValue({
          ngayBdNhap: ""
        })
      }
      this.tongSL = this.danhSach.filter(item => item.checked).reduce((pre, cur) => pre + Number(cur.soLuong), 0)
    }
  }

  updateAll(): void {
    this.indeterminateTT = false;
    if (this.allCheckedTT) {
      if (this.danhSach && this.danhSach.length > 0) {
        this.danhSach.forEach((item) => {
          item.checked = true;
        });
      }
    } else {
      if (this.danhSach && this.danhSach.length > 0) {
        this.danhSach.forEach((item) => {
          item.checked = false;
        });
      }
    }
    this.tongSL = this.danhSach.filter(item => item.checked).reduce((pre, cur) => pre + Number(cur.soLuong), 0)
    const pnk = this.danhSach.filter(item => item.checked)[0]
    if (pnk) {
      this.formData.patchValue({
        ngayBdNhap: pnk.ngayNhapKho
      })
    } else {
      this.formData.patchValue({
        ngayBdNhap: ""
      })
    }
    this.danhSach = cloneDeep(this.danhSach)
  }

  updateSingle(): void {
    if (this.danhSach.every((item) => !item.checked)) {
      this.allCheckedTT = false;
      this.indeterminateTT = false;
    } else if (this.danhSach.every((item) => item.checked)) {
      this.allCheckedTT = true;
      this.indeterminateTT = false;
    } else {
      this.indeterminateTT = true;
    }
    this.tongSL = this.danhSach.filter(item => item.checked).reduce((pre, cur) => pre + Number(cur.soLuong), 0)
    const pnk = this.danhSach.filter(item => item.checked)[0]
    if (pnk) {
      this.formData.patchValue({
        ngayBdNhap: pnk.ngayNhapKho
      })
    } else {
      this.formData.patchValue({
        ngayBdNhap: ""
      })
    }
    this.danhSach = cloneDeep(this.danhSach)
  }


  async openDialogQD() {
    await this.spinner.show();
    let body = {
      trangThai: STATUS.BAN_HANH,
      // loaiVthh: ['0101', '0102'],
      loaiDc: this.loaiDc,
      maDvi: this.userInfo.MA_DVI,
      type: this.formData.value.type
    }
    let resSoDX = this.isCuc() ? await this.quyetDinhDieuChuyenCucService.getDsSoQuyetDinhDieuChuyenCuc(body) : await this.quyetDinhDieuChuyenCucService.getDsSoQuyetDinhDieuChuyenChiCuc(body);
    if (resSoDX.msg == MESSAGE.SUCCESS) {
      this.listDanhSachQuyetDinh = resSoDX.data;
    }
    await this.spinner.hide();

    const modalQD = this.modal.create({
      nzTitle: 'Danh sách quyết định',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDanhSachQuyetDinh,
        dataHeader: ['Số quyết định'],
        dataColumn: ['soQdinh']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          soQdDcCuc: data.soQdinh,
          ngayQdDcCuc: data.ngayKyQdinh,
          qdDcCucId: data.id,
          tenLoKho: "",
          maLoKho: "",
          tenNganKho: "",
          maNganKho: "",
          tenNhaKho: "",
          maNhaKho: "",
          tenDiemKho: "",
          maDiemKho: "",
          loaiVthh: "",
          tenCloaiVthh: "",
          tichLuongKhaDung: "",
          dviTinh: "",
          keHoachDcDtlId: ""
        });

        await this.loadChiTietQdinh(data.id);
      }
    });
  }

  async openDialogKhoNhap() {
    await this.spinner.show();

    await this.spinner.hide();

    const modalQD = this.modal.create({
      nzTitle: 'Danh sách kho nhập',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '65%',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.dsKeHoach,
        dataHeader: ['Lô kho xuất', 'Ngăn kho xuất', 'Nhà kho xuất', 'Điểm kho xuất', 'Lô kho nhập', 'Ngăn kho nhập', 'Nhà kho nhập', 'Điểm kho nhập'],
        dataColumn: ['tenLoKho', 'tenNganKho', 'tenNhaKho', 'tenDiemKho', 'tenLoKhoNhan', 'tenNganKhoNhan', 'tenNhaKhoNhan', 'tenDiemKhoNhan']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          tenLoNganKho: `${data.tenLoKhoNhan || ""} ${data.tenNganKhoNhan || ""}`,
          tenLoKho: data.tenLoKhoNhan,
          maLoKho: data.maLoKhoNhan,
          tenNganKho: data.tenNganKhoNhan,
          maNganKho: data.maNganKhoNhan,
          tenNhaKho: data.tenNhaKhoNhan,
          maNhaKho: data.maNhaKhoNhan,
          tenDiemKho: data.tenDiemKhoNhan,
          maDiemKho: data.maDiemKhoNhan,
          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          cloaiVthh: data.cloaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          tichLuongKhaDung: data.tichLuongKd,
          dviTinh: data.donViTinh,
          soLuongQdDcCuc: data.soLuongPhanBo,
          keHoachDcDtlId: data.id
        });

        await this.getDanhSachTT(this.formData.value.soQdDcCuc, data.maLoKhoNhan, data.maNganKhoNhan)
      }
    });
  }

  async loadChiTietQdinh(id: number) {
    let res = await this.quyetDinhDieuChuyenCucService.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {

      const data = res.data
      if (!data) return
      this.dsKeHoach = []
      if (data.danhSachQuyetDinh.length == 0) return
      data.danhSachQuyetDinh.map(qdinh => {
        this.dsKeHoach = this.dsKeHoach.concat(qdinh.dcnbKeHoachDcHdr.danhSachHangHoa)
      })

    }
  }

  async openDialogKTCL(row) {
    this.modal.create({
      nzTitle: 'Thông tin phiếu kiểm tra chất lượng',
      nzContent: ThongTinKiemTraChatLuongComponent,
      nzMaskClosable: false,
      nzClosable: true,
      nzBodyStyle: { overflowY: 'auto' },//maxHeight: 'calc(100vh - 200px)'
      nzWidth: '95%',
      nzFooter: null,
      nzComponentParams: {
        isViewOnModal: true,
        isView: true,
        idInput: row.phieuKiemTraClId
      },
    });
  }

  async openDialogPNK(row) {
    this.modal.create({
      nzTitle: 'Thông tin phiếu nhập kho',
      nzContent: ThongTinPhieuNhapKhoComponent,
      nzMaskClosable: false,
      nzClosable: true,
      nzBodyStyle: { overflowY: 'auto' },//maxHeight: 'calc(100vh - 200px)'
      nzWidth: '95%',
      nzFooter: null,
      nzComponentParams: {
        isViewOnModal: true,
        isView: true,
        idInput: row.phieuNhapKhoId
      },
    });
  }

  async openDialogBKCH(row) {
    this.modal.create({
      nzTitle: 'Thông tin bảng kê cân hàng',
      nzContent: ThongTinBangKeCanHangComponent,
      nzMaskClosable: false,
      nzClosable: true,
      nzBodyStyle: { overflowY: 'auto' },//maxHeight: 'calc(100vh - 200px)'
      nzWidth: '95%',
      nzFooter: null,
      nzComponentParams: {
        isViewOnModal: true,
        isView: true,
        idInput: row.bangKeCanHangId
      },
    });
  }



  setExpand(parantExpand: boolean = false, children: any = []): void {
    if (parantExpand) {
      return children.map(f => ({ ...f, expand: false }))
    }
    return children
  }


  async save(isGuiDuyet?) {
    this.helperService.markFormGroupTouched(this.formData);
    if (!this.formData.valid) return
    await this.spinner.show();
    let body = this.formData.value;
    body.fileDinhKemReq = this.fileDinhKemReq;
    body.ngayKtNhap = body.ngayLap
    body.children = this.danhSach.filter(item => item.checked).map(pnk => {
      return {
        ...pnk,
        id: undefined
      }
    })
    if (this.idInput) {
      body.id = this.idInput
    }

    let data = await this.createUpdate(body, null, isGuiDuyet);
    if (data) {
      this.idInput = data.id;
      this.formData.patchValue({ id: data.id, trangThai: data.trangThai, tenTrangThai: data.tenTrangThai, soBb: data.soBb })
      if (isGuiDuyet) {
        this.guiDuyet();
      }
    }
    await this.spinner.hide();
  }

  isIn() {
    return this.isChiCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_NK_LT_BBNDK_IN') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_NK_LT_BBNDK_IN') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_NK_LT_BBNDK_IN'))
  }

  isThem() {
    return this.isChiCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_NK_LT_BBNDK_THEM') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_NK_LT_BBNDK_THEM') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_NK_LT_BBNDK_THEM'))
  }

  isDuyetKTVBQ() {
    return this.isChiCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_NK_LT_BBNDK_DUYET_KTVBQ') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_NK_LT_BBNDK_DUYET_KTVBQ') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_NK_LT_BBNDK_DUYET_KTVBQ'))
  }

  isDuyetKT() {
    return this.isChiCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_NK_LT_BBNDK_DUYET_KETOAN') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_NK_LT_BBNDK_DUYET_KETOAN') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_NK_LT_BBNDK_DUYET_KETOAN'))
  }

  isDuyetLD() {
    return this.isChiCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_NK_LT_BBNDK_DUYET_LDCCUC') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_NK_LT_BBNDK_DUYET_LDCCUC') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_NK_LT_BBNDK_DUYET_LDCCUC'))
  }

  async guiDuyet() {
    let trangThai = STATUS.CHO_DUYET_KTVBQ;
    let mesg = 'Bạn muốn gửi duyệt văn bản?'
    this.approve(this.idInput, trangThai, mesg);
  }

  isTuChoi() {
    return (this.formData.value.trangThai == STATUS.CHO_DUYET_KTVBQ && this.isDuyetKTVBQ()) || (this.formData.value.trangThai == STATUS.CHO_DUYET_KT && this.isDuyetKT()) || (this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC && this.isDuyetLD())
  }

  async tuChoi() {
    let trangThai = () => {
      if (this.formData.value.trangThai == STATUS.CHO_DUYET_KTVBQ)
        return STATUS.TU_CHOI_KTVBQ
      if (this.formData.value.trangThai == STATUS.CHO_DUYET_KT)
        return STATUS.TU_CHOI_KT
      if (this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC)
        return STATUS.TU_CHOI_LDCC
    };
    this.reject(this.idInput, trangThai());
  }

  isPheDuyet() {
    return (this.formData.value.trangThai == STATUS.CHO_DUYET_KTVBQ && this.isDuyetKTVBQ()) || (this.formData.value.trangThai == STATUS.CHO_DUYET_KT && this.isDuyetKT()) || (this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC && this.isDuyetLD())
  }

  async pheDuyet() {
    let trangThai = () => {
      if (this.formData.value.trangThai == STATUS.CHO_DUYET_KTVBQ)
        return STATUS.CHO_DUYET_KT
      if (this.formData.value.trangThai == STATUS.CHO_DUYET_KT)
        return STATUS.CHO_DUYET_LDCC
      return STATUS.DA_DUYET_LDCC;
    };
    let mesg = 'Bạn muốn phê duyệt văn bản?'
    this.approve(this.idInput, trangThai(), mesg);
  }

  isBanHanh() {
    return this.formData.value.trangThai == STATUS.CHO_DUYET_LDC
  }

  async banHanh() {
    let trangThai = STATUS.BAN_HANH;
    let mesg = 'Bạn muốn ban hành văn bản?'
    this.approve(this.idInput, trangThai, mesg);
  }

  quayLai() {
    this.showListEvent.emit();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

}

