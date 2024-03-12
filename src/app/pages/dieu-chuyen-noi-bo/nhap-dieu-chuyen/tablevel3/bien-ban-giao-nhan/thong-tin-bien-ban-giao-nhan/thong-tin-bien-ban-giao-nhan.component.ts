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
import { BienBanGiaoNhanService } from "src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/bien-ban-giao-nhan";
import { BienBanKetThucNhapKhoService } from "src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/bien-ban-ket-thuc-nhap-kho";
import { PhieuNhapKhoService } from "src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/phieu-nhap-kho";
import { QuyetDinhDieuChuyenCucService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service";
import { StorageService } from "src/app/services/storage.service";
import { convertTienTobangChu } from "src/app/shared/commonFunction";
import * as uuidv4 from "uuid";

@Component({
  selector: 'app-thong-tin-bien-ban-giao-nhan',
  templateUrl: './thong-tin-bien-ban-giao-nhan.component.html',
  styleUrls: ['./thong-tin-bien-ban-giao-nhan.component.scss']
})
export class ThongTinBienBanGiaoNhanComponent extends Base2Component implements OnInit {
  @Input() loaiDc: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() data: any;
  @Output()
  showListEvent = new EventEmitter<any>();

  maBb: string;
  fileCanCuReq: any[] = [];
  fileDinhKemReq: any[] = [];

  listDanhSachQuyetDinh: any[] = [];
  dsKeHoach: any[] = []

  danhSach: any[] = []
  tongSLN: number;
  allCheckedTT = true;
  indeterminateTT = false;

  danhSachDDNhan: any[] = []
  danhSachDDGiao: any[] = []
  listDonViDaiDien = [
    {
      type: 'CUC',
      title: 'Đại diện cục DTNN KV'
    },
    {
      type: 'CHI_CUC',
      title: 'Đại diện chi cục DTNN KV'
    },
    {
      type: 'GIAO_HANG',
      title: 'Đại diện bên giao hàng'
    }
  ]

  detail: any
  previewName = "nhap_vt_bien_ban_giao_nhan";
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private cdr: ChangeDetectorRef,
    private danhMucService: DanhMucService,
    private quyetDinhDieuChuyenCucService: QuyetDinhDieuChuyenCucService,
    private bienBanKetThucNhapKhoService: BienBanKetThucNhapKhoService,
    private phieuNhapKhoService: PhieuNhapKhoService,
    private bienBanGiaoNhanPvcService: BienBanGiaoNhanService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanGiaoNhanPvcService);
    this.formData = this.fb.group({
      id: [],
      type: ["01"],
      loaiDc: [this.loaiDc],
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
      soQdDcCuc: [],
      ngayQdDcCuc: [],
      qdDcCucId: [],
      soBbKtNhapKho: [],
      idBbKtNhapKho: [],
      tenLoNganKho: [, [Validators.required]],
      tenLoKho: [],
      maLoKho: [],
      tenNganKho: [, [Validators.required]],
      maNganKho: [],
      tenNhaKho: [, [Validators.required]],
      maNhaKho: [],
      tenDiemKho: [, [Validators.required]],
      maDiemKho: [],
      soHoSoKyThuat: [],
      loaiVthh: [],
      tenLoaiVthh: [],
      cloaiVthh: [],
      tenCloaiVthh: [],
      dviTinh: [],
      danhSachBangKe: [new Array<any>(),],
      danhSachDaiDien: [new Array<any>(),],
      ngayBdNhap: [],
      ngayKtNhap: [],
      soLuongQdDcCuc: [],
      canBo: [],
      lanhDao: [],
      ghiChu: [],
      ghiChuNhan: [],
      lyDoTuChoi: [],
      hoVaTen: [],
      chucVu: [],
      dvi: [],
      keHoachDcDtlId: [, [Validators.required]]
    });
  }

  async ngOnInit() {
    this.maBb = 'BBGN-' + this.userInfo.DON_VI.tenVietTat;
    let id = await this.userService.getId('DCNB_BB_NT_BQ_HDR_SEQ')
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      canBo: this.userInfo.TEN_DAY_DU,
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
        soQdDcCuc: this.data.soQdinh,
        ngayQdDcCuc: this.data.ngayKyQd,
        qdDcCucId: this.data.qdDcCucId,
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
        this.detail = data
        this.danhSachDDNhan = data.danhSachDaiDien.filter(item => item.type === "NHAN")
        this.danhSachDDGiao = data.danhSachDaiDien.filter(item => item.type === "GIAO")
        this.formData.patchValue({ ...data, tenLoNganKho: `${data.tenLoKho || ""} ${data.tenNganKho || ""}`, });
        this.fileCanCuReq = data.fileCanCu
        this.fileDinhKemReq = data.fileDinhKems
        this.loadChiTietQdinh(data.qdDcCucId)
        this.getDanhSachTT(data.soQdDcCuc, data.maLoKho, data.maNganKho)
      }

    }
    await this.spinner.hide();
  }

  async getDanhSachTT(soQdDcCuc, maLoKho, maNganKho) {
    const body = {
      soQdDcCuc,
      maLoKho,
      maNganKho,
      trangThai: STATUS.DA_DUYET_LDCC,
      isVatTu: true
    }

    let res = await this.phieuNhapKhoService.getDanhSachTT(body);
    if (res.msg == MESSAGE.SUCCESS) {
      const danhSachBangKe = this.detail?.danhSachBangKe || res.data
      this.danhSach = res.data.map(element => {
        const check = danhSachBangKe.find(item => item.soPhieuNhapKho === element.soPhieuNhapKho)
        return {
          ...element,
          checked: !!check || false
        }
      });
      this.tongSLN = this.danhSach.reduce((pre, cur) => pre + Number(cur.soLuong), 0)
      if (this.danhSach.length > 0) {
        const ngayBdNhap = this.danhSach[0].ngayNhapKho
        this.formData.patchValue({
          ngayBdNhap
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

    this.danhSach = cloneDeep(this.danhSach)
    this.tongSLN = this.danhSach.reduce((pre, cur) => pre + Number(cur.soLuong), 0)
    if (this.danhSach.length > 0) {
      const ngayBdNhap = this.danhSach[0].ngayNhapKho
      this.formData.patchValue({
        ngayBdNhap
      })
    }
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
    this.danhSach = cloneDeep(this.danhSach)
    this.tongSLN = this.danhSach.reduce((pre, cur) => pre + Number(cur.soLuong), 0)
    if (this.danhSach.length > 0) {
      const ngayBdNhap = this.danhSach[0].ngayNhapKho
      this.formData.patchValue({
        ngayBdNhap
      })
    }
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
          soQdDcCuc: data.soQdinh,
          ngayQdDcCuc: data.ngayKyQdinh,
          qdDcCucId: data.id,
          tenLoNganKho: "",
          tenLoKho: "",
          maLoKho: "",
          tenNganKho: "",
          maNganKho: "",
          tenNhaKho: "",
          maNhaKho: "",
          tenDiemKho: "",
          maDiemKho: "",
          loaiVthh: "",
          tenLoaiVthh: "",
          cloaiVthh: "",
          tenCloaiVthh: "",
          tichLuongKhaDung: "",
          soLuongQdDcCuc: "",
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
          soLuongQdDcCuc: data.soLuongPhanBo,
          dviTinh: data.donViTinh,
          keHoachDcDtlId: data.id
        });
      }
      await this.getDanhSachTT(this.formData.value.soQdDcCuc, data.maLoKhoNhan, data.maNganKhoNhan)
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

  async openDialogBBKTNK() {
    await this.spinner.show();
    let body = {
      loaiDc: this.loaiDc,
      type: "01",
      trangThai: STATUS.DA_DUYET_LDCC,
      maLoKho: this.formData.value.maLoKho,
      maNganKho: this.formData.value.maNganKho,
      soQdinhDcc: this.formData.value.soQdDcCuc,
    }
    let resSoDX = await this.bienBanKetThucNhapKhoService.getDanhSach(body);
    if (resSoDX.msg == MESSAGE.SUCCESS) {
      this.listDanhSachQuyetDinh = resSoDX.data;
    }
    await this.spinner.hide();

    const modalQD = this.modal.create({
      nzTitle: 'Danh sách biên bản kết thúc nhập kho',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDanhSachQuyetDinh,
        dataHeader: ['Số biên bản kết thúc nhập kho'],
        dataColumn: ['soBBKtNH']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          soBbKtNhapKho: data.soBBKtNH,
          idBbKtNhapKho: data.id
        });
        await this.loadCTBBKTNK(data.id);

      }
    });
  }

  async loadCTBBKTNK(id: number) {
    let res = await this.bienBanKetThucNhapKhoService.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {

      const data = res.data
      // console.log('loadCTBBKTNK', data)
      this.formData.patchValue({
        tenLoNganKho: `${data.tenLoKho || ""} ${data.tenNganKho}`,
        tenLoKho: data.tenNhaKho,
        maLoKho: data.maLoKho,
        tenNganKho: data.tenNganKho,
        maNganKho: data.maNganKho,
        tenNhaKho: data.tenNhaKho,
        maNhaKho: data.maNhaKho,
        tenDiemKho: data.tenDiemKho,
        maDiemKho: data.maDiemKho,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        // tichLuongKhaDung: data.tichLuongKd,
        soLuongQdDcCuc: data.tongSlTheoQd,
        dviTinh: data.donViTinh,
        keHoachDcDtlId: data.keHoachDcDtlId
      });
      await this.getDanhSachTT(this.formData.value.soQdDcCuc, data.maLoKho, data.maNganKho)
    }
  }

  setExpand(parantExpand: boolean = false, children: any = []): void {
    if (parantExpand) {
      return children.map(f => ({ ...f, expand: false }))
    }
    return children
  }

  themNhan() {
    if (!this.formData.value.hoVaTen || !this.formData.value.chucVu || !this.formData.value.dvi) {
      this.notification.error(MESSAGE.ERROR, "Bạn chưa nhập đủ thông tin");
      return
    }
    this.danhSachDDNhan.push({
      idVirtual: uuidv4.v4(),
      edit: false,
      hoVaTen: this.formData.value.hoVaTen,
      chucVu: this.formData.value.chucVu,
      donVi: this.formData.value.dvi,
      type: "NHAN"
    })
    this.danhSachDDNhan = cloneDeep(this.danhSachDDNhan)

    this.formData.patchValue({
      hoVaTen: "",
      chucVu: "",
      dvi: "",
    })
  }

  cancelEditNhan(index: number): void {
    this.danhSachDDNhan[index].edit = false;
  }

  saveEditNhan(index: number): void {
    this.danhSachDDNhan[index].edit = false;
  }
  suaNhan(index: number) {
    this.danhSachDDNhan[index].edit = true;
    this.danhSachDDNhan = cloneDeep(this.danhSachDDNhan)
  }

  xoaNhan(row) {
    this.danhSachDDNhan = this.danhSachDDNhan.filter(item => item.idVirtual !== row.idVirtual)
  }

  themGiao() {
    if (!this.formData.value.hoVaTen || !this.formData.value.chucVu || !this.formData.value.dvi) {
      this.notification.error(MESSAGE.ERROR, "Bạn chưa nhập đủ thông tin");
      return
    }
    this.danhSachDDGiao.push({
      idVirtual: uuidv4.v4(),
      edit: false,
      hoVaTen: this.formData.value.hoVaTen,
      chucVu: this.formData.value.chucVu,
      donVi: this.formData.value.dvi,
      type: "GIAO"
    })
    this.danhSachDDGiao = cloneDeep(this.danhSachDDGiao)

    this.formData.patchValue({
      hoVaTen: "",
      chucVu: "",
      dvi: "",
    })
  }

  cancelEditGiao(index: number): void {
    this.danhSachDDGiao[index].edit = false;
  }

  saveEditGiao(index: number): void {
    this.danhSachDDGiao[index].edit = false;
  }
  suaGiao(index: number) {
    this.danhSachDDGiao[index].edit = true;
    this.danhSachDDGiao = cloneDeep(this.danhSachDDGiao)
  }

  xoaGiao(row) {
    this.danhSachDDGiao = this.danhSachDDGiao.filter(item => item.idVirtual !== row.idVirtual)
  }

  getType(type): string {
    console.log('getType', type)
    const row = this.listDonViDaiDien.find(item => item.type === type)
    return row.title
  }


  async save(isGuiDuyet?) {
    this.helperService.markFormGroupTouched(this.formData);
    if (!this.formData.valid) return
    await this.spinner.show();
    let body = this.formData.value;
    body.ngayKtNhap = body.ngayLap
    body.danhSachBangKe = this.danhSach.filter(item => item.checked).map(bangke => {
      return {
        ...bangke,
        id: undefined
      }
    })
    body.danhSachDaiDien = [...this.danhSachDDNhan, ...this.danhSachDDGiao]
    body.fileCanCuReq = this.fileCanCuReq;
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

  isIN() {
    return this.isCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_NK_VT_BBGN_IN') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_NK_VT_BBGN_IN') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_NK_VT_BBGN_IN'))
  }

  isThem() {
    return this.isCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_NK_VT_BBGN_THEM') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_NK_VT_BBGN_THEM') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_NK_VT_BBGN_THEM'))
  }

  isDuyet() {
    return this.isCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_NK_VT_BBGN_DUYET') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_NK_VT_BBGN_DUYET') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_NK_VT_BBGN_DUYET'))
  }

  isGuiDuyet() {
    return this.isView && this.formData.value.trangThai !== STATUS.DU_THAO
  }

  async guiDuyet() {
    let trangThai = STATUS.CHO_DUYET_LDC;
    let mesg = 'Bạn muốn gửi duyệt văn bản?'
    this.approve(this.idInput, trangThai, mesg);
  }

  isTuChoi() {
    return this.formData.value.trangThai == STATUS.CHO_DUYET_LDC && this.isDuyet()
  }

  async tuChoi() {
    let trangThai = () => {
      if (this.formData.value.trangThai == STATUS.CHO_DUYET_LDC)
        return STATUS.TU_CHOI_LDC
    };
    this.reject(this.idInput, trangThai());
  }

  isPheDuyet() {
    return this.formData.value.trangThai == STATUS.CHO_DUYET_LDC && this.isDuyet()
  }

  async pheDuyet() {
    let trangThai = STATUS.DA_DUYET_LDC;
    let mesg = 'Bạn muốn phê duyệt văn bản?'
    this.approve(this.idInput, trangThai, mesg);

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
