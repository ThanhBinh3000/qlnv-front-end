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
import { BangKeNhapVatTuService } from "src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/bang-ke-nhap-vt";
import { PhieuNhapKhoService } from "src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/phieu-nhap-kho";
import { QuyetDinhDieuChuyenCucService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service";
import { DonviService } from "src/app/services/donvi.service";
import { StorageService } from "src/app/services/storage.service";
import { convertTienTobangChu } from "src/app/shared/commonFunction";
import * as uuidv4 from "uuid";

@Component({
  selector: 'app-thong-tin-bang-ke-nhap-vat-tu',
  templateUrl: './thong-tin-bang-ke-nhap-vat-tu.component.html',
  styleUrls: ['./thong-tin-bang-ke-nhap-vat-tu.component.scss']
})
export class ThongTinBangKeNhapVatTuComponent extends Base2Component implements OnInit {
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
  tongSL: number
  previewName: string = "nhap_vt_bang_ke_nhap_vat_tu"
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private cdr: ChangeDetectorRef,
    private danhMucService: DanhMucService,
    private donViService: DonviService,
    private quyetDinhDieuChuyenCucService: QuyetDinhDieuChuyenCucService,
    private phieuNhapKhoService: PhieuNhapKhoService,
    private bangKeNhapVatTuService: BangKeNhapVatTuService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bangKeNhapVatTuService);
    this.formData = this.fb.group({
      id: [],
      type: ["01"],
      loaiDc: ["DCNB"],
      loaiQdinh: [],
      isVatTu: [true],
      thayDoiThuKho: [],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      nam: [dayjs().get("year"), [Validators.required]],
      maDvi: [],
      tenDvi: [],
      maQhns: [],
      soBangKe: [],
      ngayNhap: [dayjs().format('YYYY-MM-DD')],
      soQdinhDcc: [],
      ngayKyQdinhDcc: [],
      qdinhDccId: [],
      soHopDong: [],
      soPhieuNhapKho: [, [Validators.required]],
      phieuNhapKhoId: [],
      ngayNhapKho: [],
      tenLoNganKho: [, [Validators.required]],
      tenLoKho: [],
      maLoKho: [],
      tenNganKho: [, [Validators.required]],
      maNganKho: [],
      tenNhaKho: [, [Validators.required]],
      maNhaKho: [],
      tenDiemKho: [, [Validators.required]],
      maDiemKho: [],
      diaDaDiemKho: [],
      tenThuKho: [],
      thuKhoId: [],
      tenPhuTrach: [],
      tenLanhDaoChiCuc: [],
      tenNguoiGiaoHang: [],
      cccd: [],
      donViNguoiGiaoHang: [],
      diaChiDonViNguoiGiaoHang: [],
      thoiHanGiaoNhan: [],
      loaiVthh: [],
      tenLoaiVthh: [],
      cloaiVthh: [],
      tenCloaiVthh: [],
      donViTinh: [],
      dcnbbangkenhapvtdtl: [new Array<any>(),],
      lyDoTuChoi: [],
      soSerial: [],
      soBaoBi: [],
      keHoachDcDtlId: [, [Validators.required]]
    });
  }

  async ngOnInit() {
    this.maBb = 'BKNVT-' + this.userInfo.DON_VI.tenVietTat;
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
        soQdinhDcc: this.data.soQdinh,
        ngayKyQdinhDcc: this.data.ngayKyQd,
        qdinhDccId: this.data.qdinhDcId,
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
        donViTinh: this.data.donViTinh,
        keHoachDcDtlId: this.data.keHoachDcDtlId
      });
      await this.loadChiTietQdinh(this.data.qdinhDcId);
      await this.layDonViCon(this.data.maDiemKho)
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
      this.dsHangTH = data.dcnbBangKeNhapVTDtl
      this.formData.patchValue({ ...data, tenLoNganKho: `${data.tenLoKho || ""} ${data.tenNganKho || ""}`, });
      this.fileDinhKemReq = data.fileDinhKems
    }
    await this.spinner.hide();
  }





  them() {
    if (!this.formData.value.soBaoBi || !this.formData.value.soSerial) {
      this.notification.error(MESSAGE.ERROR, "Bạn chưa nhập đủ thông tin");
      return
    }
    this.dsHangTH.push({
      idVirtual: uuidv4.v4(),
      edit: false,
      soSerial: this.formData.value.soSerial,
      soBaoBi: this.formData.value.soBaoBi
    })
    this.dsHangTH = cloneDeep(this.dsHangTH)
    this.tongSL = this.dsHangTH.reduce((previous, current) => previous + current.soBaoBi, 0);
    this.formData.patchValue({
      soSerial: "",
      soBaoBi: "",
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
      return convertTienTobangChu(tien);
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
          soQdinhDcc: data.soQdinh,
          ngayKyQdinhDcc: data.ngayKyQdinh,
          qdinhDccId: data.id,
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
          donViTinh: "",
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
          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          cloaiVthh: data.cloaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          tichLuongKhaDung: data.tichLuongKd,
          donViTinh: data.donViTinh,
          keHoachDcDtlId: data.id
        });

        await this.layDonViCon(data.maDiemKho)
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
      trangThai: STATUS.DU_THAO,
      soQdinhDcc: this.formData.value.soQdinhDcc,
      maLoKho: this.formData.value.maLoKho,
      maNganKho: this.formData.value.maNganKho,
      maNhaKho: this.formData.value.maNhaKho,
      maDiemKho: this.formData.value.maDiemKho,
      loaiDc: this.loaiDc,
      isVatTu: true
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
          tenNguoiGiaoHang: data.hoVaTenNguoiGiao,
          cccd: data.cmndNguoiGiao,
          donViNguoiGiaoHang: data.donViNguoiGiao,
          diaChiDonViNguoiGiaoHang: data.diaChi,
          thoiHanGiaoNhan: data.tgianGiaoNhanHang,
        });
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
    this.helperService.markFormGroupTouched(this.formData);
    if (!this.formData.valid) return

    await this.spinner.show();
    let body = this.formData.value;

    body.dcnbbangkenhapvtdtl = this.dsHangTH;
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
    let trangThai = STATUS.CHODUYET_TBP_TVQT;
    let mesg = 'Bạn muốn gửi duyệt văn bản?'
    this.approve(this.idInput, trangThai, mesg);

  }

  isTuChoi() {
    return this.formData.value.trangThai == STATUS.CHODUYET_TBP_TVQT || this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC
  }

  async tuChoi() {
    let trangThai = () => {
      if (this.formData.value.trangThai == STATUS.CHODUYET_TBP_TVQT)
        return STATUS.TUCHOI_TBP_TVQT
      if (this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC)
        return STATUS.TU_CHOI_LDCC
    };
    this.reject(this.idInput, trangThai());
  }

  isPheDuyet() {
    return this.formData.value.trangThai == STATUS.CHODUYET_TBP_TVQT || this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC
  }

  async pheDuyet() {
    let trangThai = () => {
      if (this.formData.value.trangThai == STATUS.CHODUYET_TBP_TVQT)
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
