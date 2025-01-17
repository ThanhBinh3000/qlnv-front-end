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
import { KIEU_NHAP_XUAT } from "src/app/constants/config";
import { MESSAGE } from "src/app/constants/message";
import { STATUS } from "src/app/constants/status";
import { DanhMucDungChungService } from "src/app/services/danh-muc-dung-chung.service";
import { DanhMucService } from "src/app/services/danhmuc.service";
import { BienBanChuanBiKhoService } from "src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/bien-ban-chuan-bi-kho";
import { BienBanNghiemThuBaoQuanLanDauService } from "src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/bien-ban-nghiem-thu-bao-quan-lan-dau.service";
import { PhieuKiemTraChatLuongService } from "src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/phieu-kiem-tra-chat-luong";
import { PhieuNhapKhoService } from "src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/phieu-nhap-kho";
import { QuyetDinhDieuChuyenCucService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service";
import { StorageService } from "src/app/services/storage.service";
import { convertTienTobangChu } from "src/app/shared/commonFunction";
import * as uuidv4 from "uuid";

@Component({
  selector: 'app-thong-tin-phieu-nhap-kho',
  templateUrl: './thong-tin-phieu-nhap-kho.component.html',
  styleUrls: ['./thong-tin-phieu-nhap-kho.component.scss']
})
export class ThongTinPhieuNhapKhoComponent extends Base2Component implements OnInit {
  @Input() isViewOnModal: boolean;
  @Input() loaiDc: string;
  @Input() isVatTu: boolean;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() data: any;
  @Output()
  showListEvent = new EventEmitter<any>();

  maBb: string;
  chungTuDinhKem: any[] = [];
  fileDinhKemReq: any[] = [];
  listDanhSachQuyetDinh: any[] = [];

  dsTH = []
  dsKeHoach: any[] = []
  noiDung: string;
  dviTinh: string;
  duToanKinhPhi: string;
  isKTCL: boolean = false
  previewName: string = "nhap_vt_phieu_nhap_kho";
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private cdr: ChangeDetectorRef,
    private danhMucService: DanhMucService,
    private dmService: DanhMucDungChungService,
    private phieuKiemTraChatLuongService: PhieuKiemTraChatLuongService,
    private quyetDinhDieuChuyenCucService: QuyetDinhDieuChuyenCucService,
    private bienBanChuanBiKhoService: BienBanChuanBiKhoService,
    private bienBanNghiemThuBaoQuanLanDauService: BienBanNghiemThuBaoQuanLanDauService,
    private phieuNhapKhoService: PhieuNhapKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuNhapKhoService);
    this.formData = this.fb.group({
      id: [],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      nam: [dayjs().get("year"), [Validators.required]],
      maDvi: [],
      tenDvi: [],
      maQhns: [],
      soPhieuNhapKho: [],
      ngayLap: [dayjs().format('YYYY-MM-DD')],
      ngayNhapKho: [dayjs().format('YYYY-MM-DD')],
      soNo: [],
      soCo: [],
      soQdDcCuc: [],
      ngayQdDcCuc: [],
      qdDcCucId: [],
      bbcbKhoId: [],
      soBbCbKho: [],
      ngayBbCbKho: [],
      tenLoNganKho: [, [Validators.required]],
      tenLoKho: [],
      maLoKho: [],
      tenNganKho: [, [Validators.required]],
      maNganKho: [],
      tenNhaKho: [, [Validators.required]],
      maNhaKho: [],
      tenDiemKho: [, [Validators.required]],
      maDiemKho: [],
      soPhieuKtraCluong: [, [Validators.required]],
      idPhieuKtraCluong: [, [Validators.required]],
      loaiVthh: [],
      tenLoaiVthh: [],
      cloaiVthh: [],
      tenCloaiVthh: [],
      thayDoiThuKho: [],
      tenThuKho: [],
      idThuKho: [],
      tenLanhDao: [],
      idLanhDao: [],
      tenKyThuatVien: [],
      keToanTruong: [],
      hoVaTenNguoiGiao: [],
      cmndNguoiGiao: [],
      donViNguoiGiao: [],
      diaChi: [],
      tgianGiaoNhanHang: [],
      tenLoaiHinhNhapXuat: [],
      tenKieuNhapXuat: [],
      soLuongQdDcCuc: [],
      donViTinh: [],
      bbNghiemThuBqld: [],
      bbNghiemThuBqldId: [],
      soBbKetThucNk: [],
      soBangKeCh: [, [Validators.required]],
      soBangKeVt: [, [Validators.required]],
      tongSoLuongBc: [],
      tongKinhPhiBc: [],
      duToanKinhPhi: [],
      children: [new Array<any>(),],
      ghiChu: [],
      type: ["01"],
      loaiDc: [this.loaiDc],
      isVatTu: [this.isVatTu],
      loaiQdinh: [],
      maSo: [],
      soLuongNhapDc: [],
      thucTeKinhPhi: [],
      lyDoTuChoi: [],
      keHoachDcDtlId: [, [Validators.required]]
    });
  }

  async ngOnInit() {
    this.maBb = 'PNK-CCDTVP';
    let id = await this.userService.getId('DCNB_BB_NT_BQ_HDR_SEQ')
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      tenThuKho: this.userInfo.TEN_DAY_DU,
      soPhieuNhapKho: `${id}/${this.formData.get('nam').value}/${this.maBb}`,
      loaiDc: this.loaiDc,
      isVatTu: this.isVatTu,
      loaiQdinh: this.loaiDc === "CUC" ? "NHAP" : null,
    })
    this.getDataNX()
    if (this.idInput) {
      await this.loadChiTiet(this.idInput)
    }

    if (this.data) {
      this.formData.patchValue({
        trangThai: STATUS.DU_THAO,
        tenTrangThai: 'Dự thảo',
        soQdDcCuc: this.data.soQdinh,
        ngayQdDcCuc: this.data.ngayKyQdinh,
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
        soLuongQdDcCuc: this.data.slDienChuyen,
        donViTinh: this.data.donViTinh,
        thayDoiThuKho: this.data.thayDoiThuKho,
        keHoachDcDtlId: this.data.keHoachDcDtlId
      });

      this.dviTinh = this.data.donViTinh
      this.noiDung = this.data.tenChLoaiHangHoa
      this.duToanKinhPhi = this.data.duToanKinhPhiDc

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

  async getDataNX() {
    await this.spinner.show()
    const body = { loai: 'LOAI_HINH_NHAP_XUAT', ma: 96 }
    let res = await this.dmService.search(body);
    if (res.statusCode == 0) {
      const data = res.data.content
      if (data && data.length > 0) {
        const content = data[0]
        this.formData.patchValue({
          tenLoaiHinhNhapXuat: content.giaTri,
          tenKieuNhapXuat: KIEU_NHAP_XUAT[content.ghiChu]
        });
      }
    }

    await this.spinner.hide();
  }

  async loadChiTiet(id: number) {
    await this.spinner.show()
    if (id) {
      let data = await this.detail(id);
      this.formData.patchValue({ ...data, tenLoNganKho: `${data.tenLoKho || ""} ${data.tenNganKho}`, donViTinh: data.donViTinh });
      this.dsTH = data.children
      this.dviTinh = data.donViTinh
      this.noiDung = data.tenCloaiVthh
      this.duToanKinhPhi = data.children[0].duToanKinhPhi
      this.chungTuDinhKem = data.chungTuDinhKem
      this.fileDinhKemReq = data.fileDinhKems
    }
    await this.spinner.hide();
  }

  // async loadDataBaoQuan(cloaiVthh) {
  //   if (cloaiVthh) {
  //     this.listPhuongThucBaoQuan = []
  //     this.listHinhThucBaoQuan = []
  //     let res = await this.danhMucService.getDetail(cloaiVthh);
  //     if (res.msg == MESSAGE.SUCCESS) {
  //       this.listPhuongThucBaoQuan = res.data?.phuongPhapBq
  //       this.listHinhThucBaoQuan = res.data?.hinhThucBq
  //     }
  //     console.log('loadDataBaoQuan', res)
  //   }
  // }

  // async addTH() {
  //   this.typeData = "TH"
  //   await this.add()
  // }

  // async addPD() {
  //   this.typeData = "PD"
  //   await this.add()
  // }

  async add(row?: any) {
    if (!this.formData.value.soQdDcCuc || !this.formData.value.maSo || !this.formData.value.soLuongNhapDc || !this.formData.value.thucTeKinhPhi) {
      this.notification.error(MESSAGE.ERROR, "Bạn chưa nhập đủ thông tin");
      return
    }
    this.dsTH.push({
      idVirtual: uuidv4.v4(),
      edit: false,
      noiDung: this.noiDung,
      dviTinh: this.dviTinh,
      duToanKinhPhi: this.duToanKinhPhi,
      maSo: this.formData.value.maSo,
      soLuongNhapDc: this.formData.value.soLuongNhapDc,
      thucTeKinhPhi: this.formData.value.thucTeKinhPhi,
    })
    this.dsTH = cloneDeep(this.dsTH)
    const tongsoLuongNhapDc = this.dsTH.reduce((previous, current) => previous + current.soLuongNhapDc, 0);
    const tongthucTeKinhPhi = this.dsTH.reduce((previous, current) => previous + current.thucTeKinhPhi, 0);
    const tongSoLuongBc = this.convertTien(tongsoLuongNhapDc) + " " + this.convertDVT(this.dviTinh)
    const tongKinhPhiBc = this.convertTien(tongthucTeKinhPhi) + " triệu đồng"


    this.formData.patchValue({
      tongSoLuongBc,
      tongKinhPhiBc,
      maSo: "",
      soLuongNhapDc: "",
      thucTeKinhPhi: "",
    })
  }

  convertDVT(dvt: string) {
    if (dvt === "kg" || dvt === "Kg" || dvt === "Kg") return "ki lô gam"
    else return dvt
  }

  them(row) {

  }

  sua(row) {

  }

  xoa(row) {
    // if (row.isParent)
    //   this.dsHangTH = this.dsHangTH.filter(item => item.idVirtual !== row.idVirtual || item.idParent !== row.idVirtual)
    // else
    //   this.dsHangTH = this.dsHangTH.filter(item => item.idVirtual !== row.idVirtual)
    // this.formData.patchValue({
    //   dcnbBBNTBQDtlList: this.dsHangTH
    // })
  }

  isDisableField() {
    // if (this.detail && (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP || this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.detail.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
    //   return true;
    // }
    return false;
  }

  cancelEdit(index: number): void {
    this.dsTH[index].edit = false;
  }

  saveEdit(index: number): void {
    this.dsTH[index].edit = false;
  }

  deleteRow(index: number) {
    this.dsTH = this.dsTH.filter((item, i) => i !== index)
  }

  editRow(index: number) {
    this.dsTH[index].edit = true;
  }




  async openDialogQD() {
    await this.spinner.show();
    // Get data tờ trình
    let body = {
      trangThai: STATUS.BAN_HANH,
      // loaiVthh: ['0101', '0102'],
      isVatTu: this.isVatTu,
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
          tenLoaiVthh: "",
          cloaiVthh: "",
          tenCloaiVthh: "",
          tichLuongKhaDung: "",
          soLuongQdDcCuc: "",
          donViTinh: "",
          keHoachDcDtlId: ""
        });
        await this.loadChiTietQdinh(data.id);
      }
    });
  }

  async openDialogPKTCL() {
    await this.spinner.show();

    let body = {
      trangThai: STATUS.DA_DUYET_LDCC,
      loaiDc: this.loaiDc,
      maDvi: this.userInfo.MA_DVI,
      soQdinhDcc: this.formData.value.soQdDcCuc,
      maLoKho: this.formData.value.maLoKho,
      maNganKho: this.formData.value.maNganKho,
    }
    let resSoDX = await this.phieuKiemTraChatLuongService.getDanhSach(body)
    if (resSoDX.msg == MESSAGE.SUCCESS) {
      this.listDanhSachQuyetDinh = resSoDX.data;
    }
    await this.spinner.hide();

    const modalQD = this.modal.create({
      nzTitle: 'Danh sách phiếu kiểm tra chất lượng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDanhSachQuyetDinh,
        dataHeader: ['Số phiếu kiểm tra chất lượng'],
        dataColumn: ['soPhieuKtChatLuong']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          soPhieuKtraCluong: data.soPhieuKtChatLuong,
          idPhieuKtraCluong: data.id
        });
        await this.loadChiTietKTCL(data.id);
      }
    });
  }

  async loadChiTietKTCL(id: number) {
    let res = await this.phieuKiemTraChatLuongService.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {

      const data = res.data
      this.formData.patchValue({
        tenLoNganKho: `${data.tenLoKho || ""} ${data.tenNganKho}`,
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
        tichLuongKhaDung: data.tichLuongKhaDung,
        soLuongQdDcCuc: data.slNhapTheoQd,
        donViTinh: data.donViTinh,
        thayDoiThuKho: data.thayDoiThuKho,
        keHoachDcDtlId: data.keHoachDcDtlId
      });
      this.dviTinh = data.donViTinh
      this.noiDung = data.tenCloaiVthh
      // this.duToanKinhPhi = data.duToanKphi

    }
  }

  async openDialogKhoNhap() {
    if (this.isVatTu && this.formData.value.thayDoiThuKho) return
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
          soLuongQdDcCuc: data.soLuongPhanBo,
          donViTinh: data.donViTinh,
          thayDoiThuKho: data.thayDoiThuKho,
          idKeHoachDtl: data.id,
          keHoachDcDtlId: data.id
        });
        this.dviTinh = data.donViTinh
        this.noiDung = data.tenCloaiVthh
        this.duToanKinhPhi = data.duToanKphi
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

  async openDialogBBCBK() {
    await this.spinner.show();

    let body = {
      trangThai: STATUS.DA_DUYET_LDCC,
      loaiDc: this.loaiDc,
      soQdinhDcc: this.formData.value.soQdDcCuc,
      qdDcCucId: this.formData.value.qdDcCucId,
      // maLoKho: this.formData.value.maLoKho,
      // maNganKho: this.formData.value.maNganKho,
    }
    let res = await this.bienBanChuanBiKhoService.getDanhSach(body)
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDanhSachQuyetDinh = res.data;
    }
    await this.spinner.hide();

    const modalQD = this.modal.create({
      nzTitle: 'Danh sách phiếu kiểm tra chất lượng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDanhSachQuyetDinh,
        dataHeader: ['Số biên bản chuẩn bị kho'],
        dataColumn: ['soBban']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          bbcbKhoId: data.id,
          soBbCbKho: data.soBban,
          ngayBbCbKho: data.ngayPDuyet
        });
        await this.loadChiTietBBCBK(data.id);
      }
    });
  }

  async loadChiTietBBCBK(id: number) {
    let res = await this.bienBanChuanBiKhoService.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {

      const data = res.data
      this.formData.patchValue({
        tenLoNganKho: `${data.tenLoKho || ""} ${data.tenNganKho}`,
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
        soLuongQdDcCuc: data.soLuongQdDcCuc,
        donViTinh: data.donViTinh,
      });
      this.dviTinh = data.donViTinh
      this.noiDung = data.tenCloaiVthh
      this.duToanKinhPhi = data.duToanKphi


    }
  }

  async openDialogBBNTBQLD() {
    await this.spinner.show();
    let dsBBNTBQLD = []
    let body = {
      trangThai: STATUS.DA_DUYET_LDCC,
      loaiDc: this.loaiDc,
      soQdinhDcc: this.formData.value.soQdDcCuc,
      qdDcCucId: this.formData.value.qdDcCucId,
      maLoKho: this.formData.value.maLoKho,
      maNganKho: this.formData.value.maNganKho,
    }
    let res = await this.bienBanNghiemThuBaoQuanLanDauService.getDanhSach(body)
    if (res.msg == MESSAGE.SUCCESS) {
      dsBBNTBQLD = res.data;
    }
    await this.spinner.hide();

    const modalQD = this.modal.create({
      nzTitle: 'Danh sách biên bản nghiệm thu bảo quản lần đầu',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: dsBBNTBQLD,
        dataHeader: ['Số biên bản nghiệm thu bảo quản lần đầu'],
        dataColumn: ['soBban']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          bbNghiemThuBqldId: data.id,
          bbNghiemThuBqld: data.soBban,
        });
        await this.loadChiTietBBCBK(data.id);
      }
    });
  }

  setExpand(parantExpand: boolean = false, children: any = []): void {
    if (parantExpand) {
      return children.map(f => ({ ...f, expand: false }))
    }
    return children
  }


  async save(isGuiDuyet?) {

    if (!this.formData.value.thayDoiThuKho || this.isVatTu) {
      this.formData.controls["soPhieuKtraCluong"].clearValidators();
      this.formData.controls["idPhieuKtraCluong"].clearValidators();
    }
    if (!isGuiDuyet) {
      this.formData.controls["soBangKeCh"].clearValidators();
      this.formData.controls["soBangKeVt"].clearValidators();
    } else {
      if (this.isVatTu) {
        this.formData.controls["soBangKeCh"].clearValidators();
        this.formData.controls["soBangKeVt"].setValidators([Validators.required]);
      } else {
        this.formData.controls["soBangKeVt"].clearValidators();
        this.formData.controls["soBangKeCh"].setValidators([Validators.required]);
      }
    }
    this.helperService.markFormGroupTouched(this.formData);
    if (!this.formData.valid) return
    if (this.dsTH.length == 0) {
      this.notification.error(MESSAGE.ERROR, "Bạn chưa thêm dữ liệu danh sách");
      return
    }
    await this.spinner.show();
    let body = this.formData.value;
    body.chungTuDinhKem = this.chungTuDinhKem;
    body.fileDinhKemReq = this.fileDinhKemReq;
    body.children = this.dsTH

    if (this.idInput) {
      body.id = this.idInput
    }

    let data = await this.createUpdate(body, null, isGuiDuyet);
    if (data) {
      this.idInput = data.id;
      this.formData.patchValue({ id: data.id, trangThai: data.trangThai, tenTrangThai: data.tenTrangThai, soPhieuNhapKho: data.soPhieuNhapKho })
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
    let trangThai = STATUS.TU_CHOI_LDCC
    this.reject(this.idInput, trangThai);
  }

  isPheDuyet() {
    return this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC
  }

  async pheDuyet() {
    let trangThai = STATUS.DA_DUYET_LDCC
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
