import { HttpClient } from "@angular/common/http";
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Validators } from "@angular/forms";
import * as dayjs from "dayjs";
import { cloneDeep } from 'lodash';
import { NzModalService } from "ng-zorro-antd/modal";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { Base2Component } from "src/app/components/base2/base2.component";
import {
  DialogTableSelectionComponent
} from "src/app/components/dialog/dialog-table-selection/dialog-table-selection.component";
import { MESSAGE } from "src/app/constants/message";
import { STATUS } from "src/app/constants/status";
import { DanhMucService } from "src/app/services/danhmuc.service";
import { BienBanKetThucNhapKhoService } from "src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/bien-ban-ket-thuc-nhap-kho";
import { BienBanNghiemThuBaoQuanLanDauService } from "src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/bien-ban-nghiem-thu-bao-quan-lan-dau.service";
import { PhieuNhapKhoService } from "src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/phieu-nhap-kho";
import { QuyetDinhDieuChuyenCucService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service";
import { StorageService } from "src/app/services/storage.service";
import { convertTienTobangChu } from "src/app/shared/commonFunction";
import * as uuidv4 from "uuid";

@Component({
  selector: 'app-thong-tin-bien-ban-ket-thuc-nhap-kho',
  templateUrl: './thong-tin-bien-ban-ket-thuc-nhap-kho.component.html',
  styleUrls: ['./thong-tin-bien-ban-ket-thuc-nhap-kho.component.scss']
})
export class ThongTinBienBanKetThucNhapKhoComponent extends Base2Component implements OnInit {
  @Input() loaiDc: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() data: any;
  @Output()
  showListEvent = new EventEmitter<any>();

  maBb: string;
  fileDinhKemReq: any[] = [];
  listDanhSachQuyetDinh: any[] = [];

  dsKeHoach: any[] = []

  danhSach: any[] = []
  allCheckedTT = true;
  indeterminateTT = false;
  previewName: string = "nhap_vt_bien_ban_ket_thuc_nhap_kho";
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private cdr: ChangeDetectorRef,
    private danhMucService: DanhMucService,
    private quyetDinhDieuChuyenCucService: QuyetDinhDieuChuyenCucService,
    private phieuNhapKhoService: PhieuNhapKhoService,
    private bienBanKetThucNhapKhoService: BienBanKetThucNhapKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanKetThucNhapKhoService);
    this.formData = this.fb.group({
      id: [],
      type: ["01"],
      loaiDc: ["DCNB"],
      isVatTu: [true],
      loaiQdinh: [],
      thayDoiThuKho: [],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      nam: [dayjs().get("year"), [Validators.required]],
      maDvi: [],
      tenDvi: [],
      maQhns: [],
      soBb: [],
      ngayLap: [dayjs().format('YYYY-MM-DD')],
      soQdinhDcc: [],
      ngayQdinhDcc: [],
      qdinhDccId: [],
      tenLoNganKho: [],
      tenLoKho: [],
      maLoKho: [],
      tenNganKho: [, [Validators.required]],
      maNganKho: [, [Validators.required]],
      tenNhaKho: [, [Validators.required]],
      maNhaKho: [, [Validators.required]],
      tenDiemKho: [, [Validators.required]],
      maDiemKho: [, [Validators.required]],
      loaiVthh: [],
      tenLoaiVthh: [],
      cloaiVthh: [],
      tenCloaiVthh: [],
      donViTinh: [],
      dcnbBBKetThucNKDtl: [new Array<any>(),],
      ngayBatDauNhap: [],
      ngayKetThucNhap: [],
      tongSlTheoQd: [],
      tenThuKho: [],
      tenKtvBQuan: [],
      tenKeToanTruong: [],
      tenLanhDaoChiCuc: [],
      ghiChu: [],
      lyDoTuChoi: [],
      keHoachDcDtlId: [, [Validators.required]]
    });
  }

  async ngOnInit() {
    this.maBb = 'BBKTK-' + this.userInfo.DON_VI.tenVietTat;
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
      // console.log('this.data', this.data)
      this.formData.patchValue({
        soQdinhDcc: this.data.soQdinh,
        ngayQdinhDcc: this.data.ngayKyQd,
        qdinhDccId: this.data.qdDcCucId,
        tenLoNganKho: `${this.data.tenLoKho || ""} ${this.data.tenNganKho}`,
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
        tongSlTheoQd: this.data.soLuongDc,
        donViTinh: this.data.donViTinh,
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

  convertTien(tien: number): string {
    if (tien) {
      return convertTienTobangChu(tien);
    }
  }

  async loadChiTiet(id: number) {
    await this.spinner.show()
    if (id) {
      let data = await this.detail(id);
      if (data) {
        this.danhSach = data.dcnbBBKetThucNKDtl
        this.formData.patchValue({ ...data, tenLoNganKho: `${data.tenLoKho || ""} ${data.tenNganKho || ""}`, });
        this.fileDinhKemReq = data.fileDinhKems
        await this.getDanhSachTT(data.soQdinhDcc, data.maLoKho, data.maNganKho)
      }

    }
    await this.spinner.hide();
  }

  // async getDanhSachTT(qdinhDccId) {
  //   const body = {
  //     qdinhDccId
  //   }
  //   let res = await this.phieuNhapKhoService.getDanhSachTT(body);
  //   if (res.msg == MESSAGE.SUCCESS) {
  //     this.danhSach = res.data.map(element => {
  //       return {
  //         ...element,
  //         checked: false
  //       }
  //     });
  //   }
  // }

  async getDanhSachTT(soQdDcCuc, maLoKho, maNganKho) {
    const body = {
      soQdDcCuc,
      maLoKho,
      maNganKho,
      trangThai: STATUS.DA_DUYET_LDCC,
      isVatTu: true
    }
    let children = this.danhSach
    let res = await this.phieuNhapKhoService.getDanhSachTT(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (children.length == 0) children = res.data
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
          ngayBatDauNhap: pnk.ngayNhapKho
        })
      } else {
        this.formData.patchValue({
          ngayBatDauNhap: ""
        })
      }
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
    const pnk = this.danhSach.filter(item => item.checked)[0]
    if (pnk) {
      this.formData.patchValue({
        ngayBatDauNhap: pnk.ngayNhapKho
      })
    } else {
      this.formData.patchValue({
        ngayBatDauNhap: ""
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
    const pnk = this.danhSach.filter(item => item.checked)[0]
    if (pnk) {
      this.formData.patchValue({
        ngayBatDauNhap: pnk.ngayNhapKho
      })
    } else {
      this.formData.patchValue({
        ngayBatDauNhap: ""
      })
    }
    this.danhSach = cloneDeep(this.danhSach)
  }


  async openDialogQD() {
    await this.spinner.show();
    let body = {
      trangThai: STATUS.BAN_HANH,
      // loaiVthh: ['0101', '0102'],
      isVatTu: true,
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
          soQdinhDcc: data.soQdinh,
          ngayQdinhDcc: data.ngayKyQdinh,
          qdinhDccId: data.id,
          tenLoKho: "",
          maLoKho: "",
          tenNganKho: "",
          maNganKho: "",
          tenNhaKho: "",
          maNhaKho: "",
          tenDiemKho: "",
          maDiemKho: "",
          tenLoKhoXuat: "",
          maLoKhoXuat: "",
          tenNganKhoXuat: "",
          maNganKhoXuat: "",
          tenNhaKhoXuat: "",
          maNhaKhoXuat: "",
          tenDiemKhoXuat: "",
          maDiemKhoXuat: "",
          loaiVthh: "",
          tenLoaiVthh: "",
          cloaiVthh: "",
          tenCloaiVthh: "",
          tichLuongKhaDung: "",
          donViTinh: "",
          keHoachDcDtlId: ""
        });

        await this.loadChiTietQdinh(data.id);
      }
    });
  }

  async openDialogKhoNhap() {
    if (this.isView) return
    await this.spinner.show();

    await this.spinner.hide();

    const modalQD = this.modal.create({
      nzTitle: 'Danh sách kho nhập',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.dsKeHoach,
        dataHeader: ['Lô kho nhập', 'Ngăn kho nhập', 'Nhà kho nhập', 'Điểm kho nhập'],
        dataColumn: ['tenLoKhoNhan', 'tenNganKhoNhan', 'tenNhaKhoNhan', 'tenDiemKhoNhan']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          tenLoNganKho: `${data.tenLoKhoNhan || ""} ${data.tenNganKhoNhan}`,
          tenLoKho: data.tenLoKhoNhan,
          maLoKho: data.maLoKhoNhan,
          tenNganKho: data.tenNganKhoNhan,
          maNganKho: data.maNganKhoNhan,
          tenNhaKho: data.tenNhaKhoNhan,
          maNhaKho: data.maNhaKhoNhan,
          tenDiemKho: data.tenDiemKhoNhan,
          maDiemKho: data.maDiemKhoNhan,
          tenLoKhoXuat: data.tenLoKho,
          maLoKhoXuat: data.maLoKho,
          tenNganKhoXuat: data.tenNganKho,
          maNganKhoXuat: data.maNganKho,
          tenNhaKhoXuat: data.tenNhaKho,
          maNhaKhoXuat: data.maNhaKho,
          tenDiemKhoXuat: data.tenDiemKho,
          maDiemKhoXuat: data.maDiemKho,
          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          cloaiVthh: data.cloaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          tichLuongKhaDung: data.tichLuongKd,
          donViTinh: data.donViTinh,
          idKeHoachDtl: data.id,
          tongSlTheoQd: data.soLuongDc,
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
      this.dsKeHoach = []
      if (data.danhSachQuyetDinh.length == 0) return
      data.danhSachQuyetDinh.map(qdinh => {
        this.dsKeHoach = this.dsKeHoach.concat(qdinh.dcnbKeHoachDcHdr.danhSachHangHoa)
      })

    }
  }

  setExpand(parantExpand: boolean = false, children: any = []): void {
    if (parantExpand) {
      return children.map(f => ({ ...f, expand: false }))
    }
    return children
  }


  async save(isGuiDuyet?) {
    await this.spinner.show();
    let body = this.formData.value;
    body.dcnbBBKetThucNKDtl = this.danhSach.filter(item => item.checked).map(pnk => {
      return {
        ...pnk,
        id: undefined
      }
    })
    body.ngayKetThucNhap = body.ngayLap
    body.fileDinhKemReq = this.fileDinhKemReq;

    if (this.idInput) {
      body.id = this.idInput
    }
    let data = await this.createUpdate(body, null, isGuiDuyet);
    if (data) {
      this.idInput = data.id;
      this.formData.patchValue({
        id: data.id, trangThai: data.trangThai, tenTrangThai: data.tenTrangThai, soBb: data.soBb
      })
      if (isGuiDuyet) {
        this.guiDuyet();
      }
    }
    await this.spinner.hide();
  }

  isIn() {
    return this.isChiCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_NK_VT_BBKTNK_IN') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_NK_VT_BBKTNK_IN') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_NK_VT_BBKTNK_IN'))
  }

  isThem() {
    return this.isChiCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_NK_VT_BBKTNK_THEM') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_NK_VT_BBKTNK_THEM') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_NK_VT_BBKTNK_THEM'))
  }

  isDuyetKTV() {
    return this.isChiCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_NK_VT_BBKTNK_DUYET_KTVBQ') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_NK_VT_BBKTNK_DUYET_KTVBQ') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_NK_VT_BBKTNK_DUYET_KTVBQ'))
  }

  isDuyetKT() {
    return this.isChiCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_NK_VT_BBKTNK_DUYET_KETOAN') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_NK_VT_BBKTNK_DUYET_KETOAN') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_NK_VT_BBKTNK_DUYET_KETOAN'))
  }

  isDuyetLD() {
    return this.isChiCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_NK_VT_BBKTNK_DUYET_LDCCUC') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_NK_VT_BBKTNK_DUYET_LDCCUC') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_NK_VT_BBKTNK_DUYET_LDCCUC'))
  }

  isGuiDuyet() {
    return this.isView && this.formData.value.trangThai !== STATUS.DU_THAO
  }

  async guiDuyet() {
    let trangThai = STATUS.CHO_DUYET_KTVBQ;
    let mesg = 'Bạn muốn gửi duyệt văn bản?'
    this.approve(this.idInput, trangThai, mesg);
  }

  isTuChoi() {
    return (this.formData.value.trangThai == STATUS.CHO_DUYET_KTVBQ && this.isDuyetKTV()) || (this.formData.value.trangThai == STATUS.CHO_DUYET_KT && this.isDuyetKT()) || (this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC && this.isDuyetLD())
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
    return (this.formData.value.trangThai == STATUS.CHO_DUYET_KTVBQ && this.isDuyetKTV()) || (this.formData.value.trangThai == STATUS.CHO_DUYET_KT && this.isDuyetKT()) || (this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC && this.isDuyetLD())
  }

  async pheDuyet() {
    let trangThai = () => {
      if (this.formData.value.trangThai == STATUS.CHO_DUYET_KTVBQ)
        return STATUS.CHO_DUYET_KT
      if (this.formData.value.trangThai == STATUS.CHO_DUYET_KT)
        return STATUS.CHO_DUYET_LDCC
      if (this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC)
        return STATUS.DA_DUYET_LDCC
    };
    let mesg = 'Bạn muốn phê duyệt văn bản?'
    this.approve(this.idInput, trangThai(), mesg);

  }

  isBanHanh() {
    return this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC
  }

  async banHanh() {
    let trangThai = STATUS.DA_DUYET_LDCC;
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

