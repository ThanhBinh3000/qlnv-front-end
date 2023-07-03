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
import { v4 as uuidv4 } from 'uuid';

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
  allCheckedTT = false;
  indeterminateTT = false;

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
      type: ["01"],
      loaiDc: ["DCNB"],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      nam: [dayjs().get("year"), [Validators.required]],
      maDvi: [],
      tenDvi: [],
      maQhns: [],
      soBb: [],
      ngayLap: [dayjs().format('YYYY-MM-DD')],
      soQdinhDcc: [],
      ngayQdDcCuc: [],
      qdinhDccId: [],

      tenLoKho: [],
      maLoKho: [],
      tenNganKho: [],
      maNganKho: [],
      tenNhaKho: [],
      maNhaKho: [],
      tenDiemKho: [],
      maDiemKho: [],
      loaiVthh: [],
      tenLoaiVthh: [],
      cloaiVthh: [],
      tenCloaiVthh: [],
      donViTinh: [],
      bcnbBBKetThucNKDtl: [new Array<any>(),],
      ngayBatDauNhap: [],
      ngayKetThucNhap: [],
      tongSlTheoQd: [],
      tenThuKho: [],
      tenKtvBQuan: [],
      tenKeToanTruong: [],
      tenLanhDaoChiCuc: [],
      ghiChu: [],

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
      if (data) {
        this.danhSach = data.bcnbBBKetThucNKDtl
        this.formData.patchValue(data);
        this.fileDinhKemReq = data.fileDinhKems
      }

    }
    await this.spinner.hide();
  }

  async getDanhSachTT(qdinhDccId) {
    const body = {
      qdinhDccId
    }
    let res = await this.phieuNhapKhoService.getDanhSachTT(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.danhSach = res.data.map(element => {
        return {
          ...element,
          checked: false
        }
      });
      console.log('getDanhSachTT', res)
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
  }


  async openDialogQD() {
    await this.spinner.show();
    let body = {
      trangThai: STATUS.BAN_HANH,
      loaiVthh: ['0101', '0102'],
      loaiDc: "DCNB",
      maDvi: this.userInfo.MA_DVI
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
          ngayQdDcCuc: data.ngayKyQdinh,
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
        });
        await this.getDanhSachTT(data.id)
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
          donViTinh: data.tenDonViTinh,
          idKeHoachDtl: data.id
        });
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
        this.dsKeHoach = this.dsKeHoach.concat(qdinh.danhSachKeHoach)
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
    body.bcnbBBKetThucNKDtl = this.danhSach.filter(item => item.checked)
    body.fileDinhKemReq = this.fileDinhKemReq;

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
    let trangThai = STATUS.CHO_DUYET_KTVBQ;
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
    return this.formData.value.trangThai == STATUS.CHO_DUYET_KTVBQ || this.formData.value.trangThai == STATUS.CHO_DUYET_KT
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

