import { HttpClient } from "@angular/common/http";
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Validators } from "@angular/forms";
import * as dayjs from "dayjs";
import { cloneDeep } from 'lodash';
import { NzModalService } from "ng-zorro-antd/modal";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { CurrencyMaskInputMode } from "ngx-currency";
import { NgxSpinnerService } from "ngx-spinner";
import { Base2Component } from "src/app/components/base2/base2.component";
import {
  DialogTableSelectionComponent
} from "src/app/components/dialog/dialog-table-selection/dialog-table-selection.component";
import { MESSAGE } from "src/app/constants/message";
import { STATUS } from "src/app/constants/status";
import { DanhMucService } from "src/app/services/danhmuc.service";
import { BangKeCanHangService } from "src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/bang-ke-can-hang";
import { BienBanNghiemThuBaoQuanLanDauService } from "src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/bien-ban-nghiem-thu-bao-quan-lan-dau.service";
import { PhieuNhapKhoService } from "src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/phieu-nhap-kho";
import { QuyetDinhDieuChuyenCucService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service";
import { DonviService } from "src/app/services/donvi.service";
import { StorageService } from "src/app/services/storage.service";
import { convertTienTobangChu, convertTienTobangChuThapPhan } from "src/app/shared/commonFunction";
import * as uuidv4 from "uuid";

@Component({
  selector: 'app-thong-tin-bang-ke-can-hang',
  templateUrl: './thong-tin-bang-ke-can-hang.component.html',
  styleUrls: ['./thong-tin-bang-ke-can-hang.component.scss']
})
export class ThongTinBangKeCanHangComponent extends Base2Component implements OnInit {
  @Input() isViewOnModal: boolean;
  @Input() loaiDc: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() data: any;
  @Output()
  showListEvent = new EventEmitter<any>();

  maBb: string;
  chungTuDinhKem: any[] = [];
  fileDinhKemReq: any[] = [];
  listDanhSachQuyetDinh: any[] = [];
  dsKeHoach: any[] = []
  dsHangTH = []
  previewName: string = "nhap_xuat_lt_bang_ke_can_hang_nhap_lt";

  AMOUNT = {
    allowZero: true,
    allowNegative: false,
    precision: 3,
    prefix: '',
    thousands: '.',
    decimal: ',',
    align: "left",
    nullable: true,
    min: 0,
    max: 100000000000,
    inputMode: CurrencyMaskInputMode.NATURAL,
  }

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private cdr: ChangeDetectorRef,
    private danhMucService: DanhMucService,
    private donViService: DonviService,
    private phieuNhapKhoService: PhieuNhapKhoService,
    private quyetDinhDieuChuyenCucService: QuyetDinhDieuChuyenCucService,
    private bangKeCanHangService: BangKeCanHangService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bangKeCanHangService);
    this.formData = this.fb.group({
      id: [],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      nam: [dayjs().get("year"), [Validators.required]],
      maDvi: [],
      tenDvi: [],
      maQhns: [],
      soBangKe: [],
      ngayNhap: [dayjs().format('YYYY-MM-DD')],
      soQdinhDcc: [, [Validators.required]],
      ngayKyQdDcc: [],
      qdinhDccId: [],
      soPhieuNhapKho: [, [Validators.required]],
      phieuNhapKhoId: [],
      tenLoNganKho: [, [Validators.required]],
      tenLoKho: [,],
      maLoKho: [],
      tenNganKho: [],
      maNganKho: [],
      tenNhaKho: [, [Validators.required]],
      maNhaKho: [],
      tenDiemKho: [, [Validators.required]],
      maDiemKho: [],
      diaDaDiemKho: [],
      tenLanhDaoChiCuc: [],
      tenThuKho: [],
      thuKhoId: [],
      tenNguoiGiaoHang: [],
      cccd: [],
      donViNguoiGiaoHang: [],
      diaChiDonViNguoiGiaoHang: [],
      thoiGianGiaoNhan: [],
      loaiVthh: [],
      tenLoaiVthh: [],
      cloaiVthh: [],
      tenCloaiVthh: [],
      donViTinh: [],
      tlMotBaoCaBi: [],
      tongSlBaoBi: [],
      tlSoBaoKhongCan: [],
      tongTrongLuongBaoBi: [],
      tongTrongLuongCabaoBi: [],
      tongTrongLuongTruBi: [],
      tongTrongLuongTruBiText: [],
      dcnbBangKeCanHangDtl: [new Array<any>(),],
      type: ["01"],
      loaiDc: ["DCNB"],
      loaiQdinh: [],
      thayDoiThuKho: [],
      lyDoTuChoi: [],
      phuongPhapCan: ['CAN_GIAM_DINH'],
      maCan: [],
      soBaoBi: [],
      trongLuongCaBaoBi: [],
      keHoachDcDtlId: [, [Validators.required]]
    });
  }

  async ngOnInit() {
    this.maBb = 'BKCH-' + this.userInfo.DON_VI.tenVietTat;
    let id = await this.userService.getId('XH_PHIEU_XKHO_BTT_SEQ')
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      tenThuKho: this.userInfo.TEN_DAY_DU,
      soBangKe: `${id}/${this.formData.get('nam').value}/${this.maBb}`,
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
        trangThai: STATUS.DU_THAO,
        tenTrangThai: 'Dự thảo',
        soQdinhDcc: this.data.soQdinh,
        ngayKyQdDcc: this.data.ngayKyQd,
        qdinhDccId: this.data.qdinhDcId,
        // tenLoNganKho: `${this.data.tenLoKho} - ${this.data.tenNganKho}`,
        // tenLoKho: this.data.tenLoKho,
        // maLoKho: this.data.maLoKho,
        // tenNganKho: this.data.tenNganKho,
        // maNganKho: this.data.maNganKho,
        // tenNhaKho: this.data.tenNhaKho,
        // maNhaKho: this.data.maNhaKho,
        // tenDiemKho: this.data.tenDiemKho,
        // maDiemKho: this.data.maDiemKho,
        // loaiVthh: this.data.maHangHoa,
        // tenLoaiVthh: this.data.tenHangHoa,
        // cloaiVthh: this.data.maChLoaiHangHoa,
        // tenCloaiVthh: this.data.tenChLoaiHangHoa,
        // tichLuongKhaDung: this.data.tichLuongKd,
        // donViTinh: this.data.donViTinh,
      });
      // await this.loadChiTietQdinh(this.data.qdinhDcId);
      // await this.layDonViCon(this.data.maDiemKho)
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
      this.dsHangTH = data.dcnbBangKeCanHangDtl
      this.formData.patchValue({ ...data, tenLoNganKho: `${data.tenLoKho || ""} - ${data.tenNganKho}`, });
      this.fileDinhKemReq = data.fileDinhKems
      // await this.layDonViCon(data.maDiemKho)
    }
    await this.spinner.hide();
  }


  them() {
    if (!this.formData.value.maCan || !this.formData.value.soBaoBi || !this.formData.value.trongLuongCaBaoBi) {
      this.notification.error(MESSAGE.ERROR, "Bạn chưa nhập đủ thông tin");
      return
    }
    this.dsHangTH.push({
      idVirtual: uuidv4.v4(),
      edit: false,
      maCan: this.formData.value.maCan,
      soBaoBi: this.formData.value.soBaoBi,
      trongLuongCaBaoBi: this.formData.value.trongLuongCaBaoBi,
    })
    this.dsHangTH = cloneDeep(this.dsHangTH)
    const tongTrongLuongCabaoBi = this.dsHangTH.reduce((previous, current) => previous + current.trongLuongCaBaoBi, 0);

    if (this.formData.value.tongTrongLuongBaoBi) {
      const tongTrongLuongTruBi = tongTrongLuongCabaoBi - Number(this.formData.value.tongTrongLuongBaoBi)
      const tongTrongLuongTruBiText = this.convertTien(tongTrongLuongTruBi)
      this.formData.patchValue({
        tongTrongLuongTruBi,
        tongTrongLuongTruBiText
      })
    }
    this.formData.patchValue({
      tongTrongLuongCabaoBi,
      maCan: "",
      soBaoBi: "",
      trongLuongCaBaoBi: "",
    })
  }

  cancelEdit(index: number): void {
    this.dsHangTH[index].edit = false;
  }

  saveEdit(index: number): void {
    this.dsHangTH[index].edit = false;
  }
  sua(index: number) {
    this.dsHangTH[index].edit = true;
    this.dsHangTH = cloneDeep(this.dsHangTH)
    console.log('sua', this.dsHangTH)
  }

  xoa(row) {
    this.dsHangTH = this.dsHangTH.filter(item => item.idVirtual !== row.idVirtual)
  }


  onChangeTongTrongLuongBaoBi(tongTrongLuongBaoBi) {
    if (this.formData.value.tongTrongLuongCabaoBi) {
      const tongTrongLuongTruBi = Number(this.formData.value.tongTrongLuongCabaoBi) - Number(tongTrongLuongBaoBi)
      const tongTrongLuongTruBiText = this.convertTien(tongTrongLuongTruBi)
      this.formData.patchValue({
        tongTrongLuongTruBi,
        tongTrongLuongTruBiText
      })
    }

  }

  convertTien(tien: number): string {
    if (tien) {
      return convertTienTobangChuThapPhan(tien) + ' ki lô gam';
    }
  }

  async openDialogQD() {
    await this.spinner.show();

    let body = {
      trangThai: STATUS.BAN_HANH,
      // loaiVthh: ['0101', '0102'],
      isVatTu: false,
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
          ngayKyQdDcc: data.ngayKyQdinh,
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
        // await this.loadChiTietQdinh(data.id);
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
          donViTinh: data.donViTinh,
          keHoachDcDtlId: data.id
        });
        await this.layDonViCon(data.maDiemKhoNhan)
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

  async layDonViCon(maDiemKho) {
    await this.spinner.show()
    const res = await this.donViService.layDonViCon();
    if (res.msg === MESSAGE.SUCCESS) {
      const dataDiemKho = res.data.find(f => f.maDvi === maDiemKho);
      if (dataDiemKho) {
        this.formData.patchValue({
          diaDaDiemKho: dataDiemKho.diaChi
        })
      }
    }

    await this.spinner.hide();
  }

  async openDialogPNK() {
    await this.spinner.show();

    let body = {
      soQdinhDcc: this.formData.value.soQdinhDcc,
      loaiDc: this.loaiDc,
      trangThai: STATUS.DU_THAO
    }
    let resSoDX = await this.phieuNhapKhoService.getDanhSach(body)
    if (resSoDX.msg == MESSAGE.SUCCESS) {
      this.listDanhSachQuyetDinh = resSoDX.data;
    }
    await this.spinner.hide();

    const modalQD = this.modal.create({
      nzTitle: 'Danh sách phiếu nhập kho',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDanhSachQuyetDinh,
        dataHeader: ['Số Phiếu nhập kho'],
        dataColumn: ['soPhieuNhapKho']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          soPhieuNhapKho: data.soPhieuNhapKho,
          phieuNhapKhoId: data.id,
          ngayNhapKho: data.ngayNhapKho
        });
        await this.loadChiTietPNK(data.id);
      }
    });
  }

  async loadChiTietPNK(id: number) {
    let res = await this.phieuNhapKhoService.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {

      const data = res.data
      if (data) {
        this.formData.patchValue({
          tenLoNganKho: `${data.tenLoKho} - ${data.tenNganKho}`,
          tenLoKho: data.tenLoKho,
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
          tichLuongKhaDung: data.tichLuongKd,
          donViTinh: data.donViTinh,
          tenNguoiGiaoHang: data.hoVaTenNguoiGiao,
          cccd: data.cmndNguoiGiao,
          donViNguoiGiaoHang: data.donViNguoiGiao,
          diaChiDonViNguoiGiaoHang: data.diaChi,
          thoiGianGiaoNhan: data.tgianGiaoNhanHang,
          keHoachDcDtlId: data.keHoachDcDtlId
        });

        await this.layDonViCon(data.maDiemKho)
      }

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
    body.fileDinhKemReq = this.fileDinhKemReq;
    body.dcnbBangKeCanHangDtl = this.dsHangTH;
    if (this.idInput) {
      body.id = this.idInput
    }
    let data = await this.createUpdate(body, null, isGuiDuyet);
    if (data) {
      this.idInput = data.id;
      this.formData.patchValue({
        id: data.id, trangThai: data.trangThai, tenTrangThai: data.tenTrangThai, soBangKe: data.soBangKe
      })
      if (isGuiDuyet) {
        this.guiDuyet();
      }
    }
    await this.spinner.hide();
  }



  isGuiDuyet() {
    return this.isView && this.formData.value.trangThai !== STATUS.DU_THAO
  }

  async guiDuyet() {
    let trangThai = STATUS.CHO_DUYET_LDCC;
    let mesg = 'Bạn muốn gửi duyệt văn bản?'
    this.approve(this.idInput, trangThai, mesg);
  }

  isTuChoi() {
    return this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC
  }

  async tuChoi() {
    let trangThai = () => {
      if (this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC)
        return STATUS.TU_CHOI_LDCC
    };
    this.reject(this.idInput, trangThai());
  }

  isPheDuyet() {
    return this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC
  }

  async pheDuyet() {
    let trangThai = STATUS.DA_DUYET_LDCC;
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
