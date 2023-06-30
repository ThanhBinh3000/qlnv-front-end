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
import { BangKeCanHangService } from "src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/bang-ke-can-hang";
import { BienBanNghiemThuBaoQuanLanDauService } from "src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/bien-ban-nghiem-thu-bao-quan-lan-dau.service";
import { QuyetDinhDieuChuyenCucService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service";
import { StorageService } from "src/app/services/storage.service";
import { convertTienTobangChu } from "src/app/shared/commonFunction";
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-thong-tin-bang-ke-can-hang',
  templateUrl: './thong-tin-bang-ke-can-hang.component.html',
  styleUrls: ['./thong-tin-bang-ke-can-hang.component.scss']
})
export class ThongTinBangKeCanHangComponent extends Base2Component implements OnInit {
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
  // listPhuongThucBaoQuan: any[] = [];
  // listHinhThucBaoQuan: any[] = [];

  dsKeHoach: any[] = []

  // danhSach: any[] = []
  dsHangTH = []
  // dsHangPD = []
  // typeData: string;
  // typeAction: string;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private cdr: ChangeDetectorRef,
    private danhMucService: DanhMucService,
    private quyetDinhDieuChuyenCucService: QuyetDinhDieuChuyenCucService,
    private bangKeCanHangService: BangKeCanHangService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bangKeCanHangService);
    this.formData = this.fb.group({
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      nam: [dayjs().get("year"), [Validators.required]],
      maDvi: [],
      tenDvi: [],
      maQhns: [],
      soBangKe: [],
      ngayNhap: [dayjs().format('YYYY-MM-DD')],
      soQdinhDcc: [],
      ngayKyQdDcc: [],
      qdinhDccId: [],//qdinhDccId
      soPhieuNhapKho: [],
      phieuNhapKhoId: [],
      tenLoKho: [],
      maLoKho: [],
      tenNganKho: [],
      maNganKho: [],
      tenNhaKho: [],
      maNhaKho: [],
      tenDiemKho: [],
      maDiemKho: [],
      diaDiemKho: [],
      tenLanhDaoChiCuc: [],
      tenThuKho: [],
      thuKhoId: [],
      tenNguoiGiaoHang: [],
      cccd: [],
      donViNguoiGiaoHang: [],
      diaChiDonViNguoiGiaoHang: [],
      tgianGiaoNhanHang: [],
      loaiVthh: [],
      tenLoaiVthh: [],
      cloaiVthh: [],
      tenCloaiVthh: [],
      donViTinh: [],
      tongTrongLuongBaoBi: [],
      tongTrongLuongCabaoBi: [],
      tongTrongLuongTruBi: [],
      tongTrongLuongTruBiText: [],
      dcnbBangKeCanHangDtl: [new Array<any>(),],
      type: ["01"],
      loaiDc: ["DCNB"],
      maCan: [],
      soBaoBi: [],
      trongLuongCaBaoBi: [],
    });
  }

  async ngOnInit() {
    this.maBb = 'BKCH-' + this.userInfo.DON_VI.tenVietTat;
    let id = await this.userService.getId('XH_PHIEU_XKHO_BTT_SEQ')
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      ktvBaoQuan: this.userInfo.TEN_DAY_DU,
      soBangKe: `${id}/${this.formData.get('nam').value}/${this.maBb}`,

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



  async loadChiTiet(id: number) {
    await this.spinner.show()
    if (id) {
      let data = await this.detail(id);
      this.dsHangTH = data.dcnbBangKeCanHangDtl
      this.formData.patchValue(data);
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
    // await this.spinner.show();

    // await this.spinner.hide();

    // if (!row) this.typeAction = "ADD"

    // const modalQD = this.modal.create({
    //   nzTitle: 'THÔNG TIN HÀNG DTQG CẦN ĐIỀU CHUYỂN',
    //   nzContent: ThongTinHangDtqgComponent,
    //   nzMaskClosable: false,
    //   nzClosable: false,
    //   nzWidth: '1200px',
    //   nzFooter: null,
    //   nzComponentParams: {
    //     // danhSachKeHoach: this.danhSachKeHoach,
    //     // dsChiCuc: this.listChiCucNhan,
    //     // data: row ? row : undefined,
    //   },
    // });
    // modalQD.afterClose.subscribe(async (data) => {
    //   if (data) {
    //     if (this.typeData === "TH") {
    //       if (data.isMatHang) {
    //         const parent = {
    //           ...data,
    //           idVirtual: uuidv4.v4(),
    //           type: this.typeData
    //         }
    //         this.dsHangTH.push({
    //           danhMuc: parent.danhMuc,
    //           nhomHang: parent.nhomHang,
    //           donViTinh: parent.donViTinh,
    //           tongGiaTri: parent.tongGiaTri,
    //           idVirtual: parent.idVirtual,
    //           isParent: true,
    //           type: this.typeData
    //         })
    //         this.dsHangTH.push({
    //           ...data,
    //           danhMuc: "",
    //           nhomHang: "",
    //           donViTinh: "",
    //           idParent: parent.idVirtual,
    //           idVirtual: uuidv4.v4(),
    //           type: this.typeData
    //         })
    //       } else {
    //         this.dsHangTH.push({
    //           ...data,
    //           tongGiaTri: data.thanhTienTrongNam,
    //           isParent: true,
    //           idVirtual: uuidv4.v4(),
    //           type: this.typeData
    //         })
    //       }

    //       let tongKinhPhiDaTh = this.dsHangTH.reduce((prev, cur) => prev + cur.tongGiaTri, 0);
    //       let tongKinhPhiDaThBc = this.convertTien(tongKinhPhiDaTh) + ' đồng'
    //       this.formData.patchValue({
    //         tongKinhPhiDaTh,
    //         tongKinhPhiDaThBc
    //       })

    //       this.dsHangTH = cloneDeep(this.dsHangTH)
    //     }

    //     if (this.typeData === "PD") {
    //       if (data.isMatHang) {
    //         const parent = {
    //           ...data,
    //           idVirtual: uuidv4.v4(),
    //           type: this.typeData
    //         }
    //         this.dsHangPD.push({
    //           danhMuc: parent.danhMuc,
    //           nhomHang: parent.nhomHang,
    //           donViTinh: parent.donViTinh,
    //           tongGiaTri: parent.tongGiaTri,
    //           idVirtual: parent.idVirtual,
    //           isParent: true,
    //           type: this.typeData
    //         })
    //         this.dsHangPD.push({
    //           ...data,
    //           danhMuc: "",
    //           nhomHang: "",
    //           donViTinh: "",
    //           idParent: parent.idVirtual,
    //           idVirtual: uuidv4.v4(),
    //           type: this.typeData
    //         })
    //       } else {
    //         this.dsHangPD.push({
    //           ...data,
    //           tongGiaTri: data.thanhTienTrongNam,
    //           isParent: true,
    //           idVirtual: uuidv4.v4(),
    //           type: this.typeData
    //         })
    //       }
    //       this.dsHangPD = cloneDeep(this.dsHangPD)

    //     }
    //     this.danhSach = []
    //     this.danhSach = this.danhSach.concat(this.dsHangTH)
    //     this.danhSach = this.danhSach.concat(this.dsHangPD)
    //     this.formData.patchValue({
    //       dcnbBBNTBQDtl: this.danhSach
    //     })


    //   }
    // });
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
      const tongTrongLuongTruBi = Number(tongTrongLuongCabaoBi) - Number(this.formData.value.tongTrongLuongBaoBi)
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
      return convertTienTobangChu(tien);
    }
  }

  async openDialogQD() {
    await this.spinner.show();
    // Get data tờ trình
    let body = {
      trangThai: STATUS.BAN_HANH,
      loaiVthh: ['0101', '0102'],
      loaiDc: "DCNB",
      maDvi: this.userInfo.MA_DVI
      // listTrangThaiXh: [STATUS.CHUA_THUC_HIEN, STATUS.DANG_THUC_HIEN],
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
          tenDonViTinh: "",
        });
        // this.listPhuongThucBaoQuan = []
        // this.listHinhThucBaoQuan = []
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
          // tenLoKhoXuat: data.tenLoKho,
          // maLoKhoXuat: data.maLoKho,
          // tenNganKhoXuat: data.tenNganKho,
          // maNganKhoXuat: data.maNganKho,
          // tenNhaKhoXuat: data.tenNhaKho,
          // maNhaKhoXuat: data.maNhaKho,
          // tenDiemKhoXuat: data.tenDiemKho,
          // maDiemKhoXuat: data.maDiemKho,
          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          cloaiVthh: data.cloaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          tichLuongKhaDung: data.tichLuongKd,
          donViTinh: data.tenDonViTinh,
          // idKeHoachDtl: data.id
        });
        // await this.loadDataBaoQuan(data.cloaiVthh)
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
    body.fileDinhKemReq = this.fileDinhKemReq;
    body.dcnbBangKeCanHangDtl = this.dsHangTH;
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
    // if (this.isCuc()) {
    //   let trangThai = STATUS.CHO_DUYET_TP;
    //   let mesg = 'Bạn muốn gửi duyệt văn bản?'
    //   this.approve(this.idInput, trangThai, mesg);
    // }
    // if (this.isChiCuc()) {
    let trangThai = STATUS.CHO_DUYET_LDCC;
    let mesg = 'Bạn muốn gửi duyệt văn bản?'
    this.approve(this.idInput, trangThai, mesg);
    // }
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
