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
import { BienBanNghiemThuBaoQuanLanDauService } from "src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/bien-ban-nghiem-thu-bao-quan-lan-dau.service";
import { PhieuKiemTraChatLuongService } from "src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/phieu-kiem-tra-chat-luong";
import { PhieuNhapKhoService } from "src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/phieu-nhap-kho";
import { QuyetDinhDieuChuyenCucService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service";
import { PhieuKtraCluongService } from "src/app/services/qlnv-hang/nhap-hang/nhap-khac/phieuKtraCluong.service";
import { QuyetDinhGiaoNhapHangKhacService } from "src/app/services/qlnv-hang/nhap-hang/nhap-khac/quyetDinhGiaoNhapHangKhac.service";
import { StorageService } from "src/app/services/storage.service";
import { convertTienTobangChu } from "src/app/shared/commonFunction";
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-thong-tin-phieu-nhap-kho',
  templateUrl: './thong-tin-phieu-nhap-kho.component.html',
  styleUrls: ['./thong-tin-phieu-nhap-kho.component.scss']
})
export class ThongTinPhieuNhapKhoComponent extends Base2Component implements OnInit {
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

  dsTH = []
  dsKeHoach: any[] = []
  noiDung: string;
  dviTinh: string;
  donGia: string;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private cdr: ChangeDetectorRef,
    private danhMucService: DanhMucService,
    private phieuKiemTraChatLuongService: PhieuKtraCluongService,
    private quyetDinhGiaoNhapHangKhacService: QuyetDinhGiaoNhapHangKhacService,
    private phieuNhapKhoService: PhieuNhapKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuNhapKhoService);
    this.formData = this.fb.group({
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      nam: [dayjs().get("year"), [Validators.required]],
      maDvi: [],
      tenDvi: [],
      maQhns: [],
      soPhieuNhapKho: [],
      ngayNhapKho: [dayjs().format('YYYY-MM-DD')],
      soNo: [],
      soCo: [],
      soQdDcCuc: [],
      ngayQdDcCuc: [],
      qdDcCucId: [],
      tenLoNganKho: [],
      tenLoKho: [],
      maLoKho: [],
      tenNganKho: [],
      maNganKho: [],
      tenNhaKho: [],
      maNhaKho: [],
      tenDiemKho: [],
      maDiemKho: [],
      soPhieuKtraCluong: [],
      idPhieuKtraCluong: [],
      tenHang: [],
      loaiVthh: [],
      tenLoaiVthh: [],
      cloaiVthh: [],
      tenCloaiVthh: [],
      thuKho: [],
      idThuKho: [],
      lanhDao: [],
      idLanhDao: [],
      ktvBaoQuan: [],
      keToanTruong: [],
      hoVaTenNguoiGiao: [],
      cmndNguoiGiao: [],
      donViNguoiGiao: [],
      diaChi: [],
      tgianGiaoNhanHang: [],
      loaiHinhNx: [],
      kieuNx: [],
      bbNghiemThuBqld: [],
      soLuongQdDcCuc: [],
      dviTinh: [],
      soBangKeCanHang: [],
      tongSLNhapTT: [],
      tongKPDCTT: [],
      duToanKinhPhi: [],
      children: [new Array<any>(),],
      ghiChu: [],
      type: ["01"],
      loaiDc: ["DCNB"],
      maSo: [],
      soLuongNhapDc: [],
      thucTeKinhPhi: [],
    });
  }

  async ngOnInit() {
    this.maBb = 'PNK-CCDTVP';
    let id = await this.userService.getId('XH_PHIEU_NKHO_BTT_SEQ')
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      thuKho: this.userInfo.TEN_DAY_DU,
      soPhieuNhapKho: `${id}/${this.formData.get('nam').value}/${this.maBb}`,
      loaiDc: this.loaiDc
    })

    if (this.idInput) {
      await this.loadChiTiet(this.idInput)
    }

    // if (this.data) {
    //   this.formData.patchValue({
    //     soQdDcCuc: this.data.soQdinh,
    //     ngayQdDcCuc: this.data.thoiHanDieuChuyen,
    //     qdDcCucId: this.data.qdinhDccId,
    //     tenLoKho: this.data.tenloKhoNhan,
    //     maLoKho: this.data.maloKhoNhan,
    //     tenNganKho: this.data.tenNganKhoNhan,
    //     maNganKho: this.data.maNganKhoNhan,
    //     tenNhaKho: this.data.tenNhaKhoNhan,
    //     maNhaKho: this.data.maNhaKhoNhan,
    //     tenDiemKho: this.data.tenDiemKhoNhan,
    //     maDiemKho: this.data.maDiemKhoNhan,
    //     tenLoKhoXuat: this.data.tenloKhoXuat,
    //     maLoKhoXuat: this.data.maloKhoXuat,
    //     tenNganKhoXuat: this.data.tenNganKhoXuat,
    //     maNganKhoXuat: this.data.maNganKhoXuat,
    //     tenNhaKhoXuat: this.data.tenNhaKhoXuat,
    //     maNhaKhoXuat: this.data.maNhaKhoXuat,
    //     tenDiemKhoXuat: this.data.tenDiemKhoXuat,
    //     maDiemKhoXuat: this.data.maDiemKhoXuat,
    //     loaiVthh: this.data.loaiVthh,
    //     tenLoaiVthh: this.data.tenLoaiVthh,
    //     cloaiVthh: this.data.cloaiVthh,
    //     tenCloaiVthh: this.data.tenCloaiVthh,
    //     tichLuongKhaDung: this.data.tichLuongKd,
    //     tenDonViTinh: this.data.tenDonViTinh,
    //     idKeHoachDtl: this.data.qdinhDccId
    //   });
    //   await this.loadChiTietQdinh(this.data.qdinhDccId);
    //   await this.loadDataBaoQuan(this.data.cloaiVthh || "010101")
    // }

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
      this.formData.patchValue(data);
      this.dsTH = data.children
      this.chungTuDinhKem = data.chungTuDinhKem
      this.fileDinhKemReq = data.fileDinhKems
    }
    await this.spinner.hide();
  }

  async add(row?: any) {
    if (!this.formData.value.soQdDcCuc || !this.formData.value.soPhieuKtraCluong || !this.formData.value.maSo || !this.formData.value.soLuongNhapDc || !this.formData.value.thucTeKinhPhi) {
      this.notification.error(MESSAGE.ERROR, "Bạn chưa nhập đủ thông tin");
      return
    }
    this.dsTH.push({
      idVirtual: uuidv4.v4(),
      edit: false,
      noiDung: this.noiDung,
      dviTinh: this.dviTinh,
      donGia: this.donGia,
      maSo: this.formData.value.maSo,
      soLuongNhapDc: this.formData.value.soLuongNhapDc,
      thucTeKinhPhi: this.formData.value.thucTeKinhPhi,
    })
    this.dsTH = cloneDeep(this.dsTH)
    const tongsoLuongNhapDc = this.dsTH.reduce((previous, current) => previous + current.soLuongNhapDc, 0);
    const tongthucTeKinhPhi = this.dsTH.reduce((previous, current) => previous + current.thucTeKinhPhi, 0);
    const tongSLNhapTT = this.convertTien(tongsoLuongNhapDc)
    const tongKPDCTT = this.convertTien(tongthucTeKinhPhi)


    this.formData.patchValue({
      tongSLNhapTT,
      tongKPDCTT,
      maSo: "",
      soLuongNhapDc: "",
      thucTeKinhPhi: "",
    })
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

  deleteRow(data: any) {
    // this.dataTableChiTieu = this.dataTableChiTieu.filter(x => x.id != data.id);
    // this.sortTableId();
    // this.updateEditCache();
  }

  editRow(index: number) {
    this.dsTH[index].edit = true;
  }




  async openDialogQD() {
    await this.spinner.show();
    let body = {
      denNgayQd: null,
      maDvi: this.userInfo.MA_DVI,
      loaiVthh: this.loaiDc,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0,
      },
      trangThai: this.globals.prop.NHAP_BAN_HANH,
    }
    let res = await this.quyetDinhGiaoNhapHangKhacService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDanhSachQuyetDinh = res.data.content;
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
        dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng hóa'],
        dataColumn: ['soQd', 'ngayQdinh', 'tenLoaiVthh'],
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          soQdDcCuc: data.soQd,
          ngayQdDcCuc: data.ngayGuiDuyet,
          qdDcCucId: data.id,
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
          soLuongQdDcCuc: "",
          dviTinh: "",
        });
        await this.loadChiTietQdinh(data.id);
      }
    });
  }

  async openDialogPKTCL() {
    await this.spinner.show();
    let body = {
      maNganKho: this.formData.value.maNganKho,
      maLoKho: this.formData.value.maLoKho,
      idQdGiaoNvnh: this.formData.value.qdDcCucId,
    }
    let resSoDX = await this.phieuKiemTraChatLuongService.timKiemPhieuKTCL(body)
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
        });
        await this.loadChiTietKTCL(data.id);
      }
    });
  }

  async loadChiTietKTCL(id: number) {
    let res = await this.phieuKiemTraChatLuongService.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {

      const data = res.data
      this.noiDung = data.tenCloaiVthh

    }
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
        dataColumn: ['tenLoKho', 'tenNganKho', 'tenNhaKho', 'tenDiemKho']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          tenLoNganKho: `${data.tenLoKho} ${data.tenNganKho}`,
          tenLoKho: data.tenLoKho,
          maLoKho: data.maLoKho,
          tenNganKho: data.tenNganKho,
          maNganKho: data.maNganKho,
          tenNhaKho: data.tenNhaKho,
          maNhaKho: data.maNhaKho,
          tenDiemKho: data.tenDiemKho,
          maDiemKho: data.maDiemKho,
          // tenLoKhoXuat: data.tenLoKho,
          // maLoKhoXuat: data.maLoKho,
          // tenNganKhoXuat: data.tenNganKho,
          // maNganKhoXuat: data.maNganKho,
          // tenNhaKhoXuat: data.tenNhaKho,
          // maNhaKhoXuat: data.maNhaKho,
          // tenDiemKhoXuat: data.tenDiemKho,
          // maDiemKhoXuat: data.maDiemKho,
          // loaiVthh: data.loaiVthh,
          // tenLoaiVthh: data.tenLoaiVthh,
          // cloaiVthh: data.cloaiVthh,
          // tenCloaiVthh: data.tenCloaiVthh,
          tichLuongKhaDung: data.tichLuongKd,
          soLuongQdDcCuc: data.soLuongPhanBo,
          dviTinh: data.tenDonViTinh,
          // idKeHoachDtl: data.id
        });
        this.dviTinh = data.tenDonViTinh
        this.donGia = data.donGia

        let body = {
          maNganKho: this.formData.value.maNganKho,
          maLoKho: this.formData.value.maLoKho,
          idQdGiaoNvnh: this.formData.value.qdDcCucId,
        }
        let resSoDX = await this.phieuKiemTraChatLuongService.timKiemPhieuKTCL(body)
        if (resSoDX.msg == MESSAGE.SUCCESS) {
          const phieuKTCL = resSoDX.data;
          this.noiDung = phieuKTCL.tenCloaiVthh || "nọidunnnn"
          this.formData.patchValue({
            soPhieuKtraCluong: phieuKTCL.soPhieu,
            idPhieuKtraCluong: phieuKTCL.id,
            loaiVthh: phieuKTCL.loaiVthh,
            tenLoaiVthh: phieuKTCL.tenLoaiVthh,
            cloaiVthh: phieuKTCL.cloaiVthh,
            tenCloaiVthh: phieuKTCL.tenCloaiVthh,
          })
        }
      }
    });
  }

  async loadChiTietQdinh(id: number) {
    let res = await this.quyetDinhGiaoNhapHangKhacService.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {

      const data = res.data
      // this.duToanKinhPhi = data.tongDuToanKp
      this.dsKeHoach = []
      if (data.dtlList.length == 0) return
      this.dsKeHoach = this.dsKeHoach.concat(data.dtlList)

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
    body.chungTuDinhKem = this.chungTuDinhKem;
    body.fileDinhKemReq = this.fileDinhKemReq;
    body.children = this.dsTH

    if (this.idInput) {
      body.id = this.idInput
    }

    let data = await this.createUpdate(body);
    if (data) {
      if (isGuiDuyet) {
        this.idInput = data.id;
        this.guiDuyet();
      } else {
        this.quayLai();
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
    return this.formData.value.trangThai == STATUS.CHO_DUYET_TP || this.formData.value.trangThai == STATUS.TU_CHOI_TP || this.formData.value.trangThai == STATUS.CHO_DUYET_LDC || this.formData.value.trangThai == STATUS.TU_CHOI_LDC
  }

  async tuChoi() {
    // if (this.isCuc()) {
    //   let trangThai = () => {
    //     if (this.formData.value.trangThai == STATUS.CHO_DUYET_TP)
    //       return STATUS.TU_CHOI_TP
    //     if (this.formData.value.trangThai == STATUS.CHO_DUYET_LDC)
    //       return STATUS.TU_CHOI_LDC
    //     return STATUS.CHO_DUYET_TP;
    //   };
    //   this.reject(this.idInput, trangThai());
    // }
    // if (this.isChiCuc()) {
    //   let trangThai = () => {
    //     if (this.formData.value.trangThai == STATUS.CHODUYET_TBP_TVQT)
    //       return STATUS.TUCHOI_TBP_TVQT
    //     if (this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC)
    //       return STATUS.TU_CHOI_LDCC
    //     return STATUS.CHODUYET_TBP_TVQT;
    //   };
    //   this.reject(this.idInput, trangThai());
    // }
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

