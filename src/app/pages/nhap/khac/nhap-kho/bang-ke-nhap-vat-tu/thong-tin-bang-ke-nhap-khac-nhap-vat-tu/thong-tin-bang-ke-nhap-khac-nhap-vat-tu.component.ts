import { DonviService } from './../../../../../../services/donvi.service';
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
import { QuyetDinhGiaoNhapHangKhacService } from "src/app/services/qlnv-hang/nhap-hang/nhap-khac/quyetDinhGiaoNhapHangKhac.service";
import { StorageService } from "src/app/services/storage.service";
import { convertTienTobangChu } from "src/app/shared/commonFunction";
import * as uuidv4 from "uuid";
import { BangKeNhapKhacNhapVatTuService } from "../bang-ke-nhap-khac-nhap-vat-tu.service";
import { PhieuNhapKhoService } from "src/app/services/qlnv-hang/nhap-hang/nhap-khac/phieuNhapKho";

@Component({
  selector: 'app-thong-tin-bang-ke-nhap-khac-nhap-vat-tu',
  templateUrl: './thong-tin-bang-ke-nhap-khac-nhap-vat-tu.component.html',
  styleUrls: ['./thong-tin-bang-ke-nhap-khac-nhap-vat-tu.component.scss']
})
export class ThongTinBangKeNhapKhacNhapVatTuComponent extends Base2Component implements OnInit {
  @Input() loaiDc: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() data: any;
  @Output()
  showListEvent = new EventEmitter<any>();

  previewName: string = 'nk_bang_ke_nvt';

  maBb: string;
  chungTuDinhKem: any[] = [];
  fileDinhKemReq: any[] = [];
  listDanhSachQuyetDinh: any[] = [];

  dsKeHoach: any[] = []

  dsHangTH = []
  tongSL: number

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private cdr: ChangeDetectorRef,
    private danhMucService: DanhMucService,
    private quyetDinhGiaoNhapHangKhacService: QuyetDinhGiaoNhapHangKhacService,
    private phieuNhapKhoService: PhieuNhapKhoService,
    private bangKeNhapKhacNhapVatTuService: BangKeNhapKhacNhapVatTuService,
    private donViService: DonviService
  ) {
    super(httpClient, storageService, notification, spinner, modal, bangKeNhapKhacNhapVatTuService);
    this.formData = this.fb.group({
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      nam: [dayjs().get("year"), [Validators.required]],
      maDvi: [],
      tenDvi: [],
      maQhns: [],
      soBangKe: [],
      ngayNhap: [dayjs().format('YYYY-MM-DD')],
      soQdPdNk: [],
      // ngayKyQdinhDcc: [],
      qdPdNkId: [],
      soHopDong: [],
      soPhieuNhapKho: [],
      phieuNhapKhoId: [],
      ngayNhapKho: [],
      tenLoKho: [],
      maLoKho: [],
      tenNganKho: [],
      maNganKho: [],
      tenNhaKho: [],
      maNhaKho: [],
      tenDiemKho: [],
      maDiemKho: [],
      diaDiemKho: [],
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
      tenDonViTinh: [],
      hhNkBangKeNhapVTDtl: [new Array<any>(),],

      // tongTrongLuongBaoBi: [],
      // tongTrongLuongCabaoBi: [],
      // tongTrongLuongTruBi: [],
      // tongTrongLuongTruBiText: [],
      soSerial: [],
      soBaoBi: [],
      tenNganLoKho: []
    });
  }

  async ngOnInit() {
    // this.maBb = 'BKNVT-' + this.userInfo.DON_VI.tenVietTat;
    // let id = await this.userService.getId('XH_PHIEU_XKHO_BTT_SEQ')
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      tenThuKho: this.userInfo.TEN_DAY_DU,
      // soBangKe: `${id}/${this.formData.get('nam').value}/${this.maBb}`,

    })

    if (this.idInput) {
      await this.loadChiTiet(this.idInput)
    }

    // if (this.data) {
    //   this.formData.patchValue({
    //     soQdDcCuc: this.data.soQdinh,
    //     ngayQdDcCuc: this.data.thoiHanDieuChuyen,
    //     qdDcCucId: this.data.qdinhDccId,
    //     tenLoKho: this.data.tenLoKhoNhan,
    //     maLoKho: this.data.maLoKhoNhan,
    //     tenNganKho: this.data.tenNganKhoNhan,
    //     maNganKho: this.data.maNganKhoNhan,
    //     tenNhaKho: this.data.tenNhaKhoNhan,
    //     maNhaKho: this.data.maNhaKhoNhan,
    //     tenDiemKho: this.data.tenDiemKhoNhan,
    //     maDiemKho: this.data.maDiemKhoNhan,
    //     tenLoKhoXuat: this.data.tenLoKhoXuat,
    //     maLoKhoXuat: this.data.maLoKhoXuat,
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
      this.dsHangTH = data.hhNkBangKeNhapVTDtl
      this.formData.patchValue({ ...data, tenNgaLoKho: data.tenLoKho ? data.tenLoKho + " - " + data.tenNganKho : data.tenNganKho });
      this.fileDinhKemReq = data.fileDinhKems
    }
    await this.spinner.hide();
  }

  async add(row?: any) {
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
      // loaiVthh: '02',
      // maDvi: this.userInfo.MA_DVI
      // listTrangThaiXh: [STATUS.CHUA_THUC_HIEN, STATUS.DANG_THUC_HIEN],
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
        dataHeader: ['Số quyết định', 'Ngày quyết định'],
        dataColumn: ['soQd', 'ngayQd'],
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          soQdPdNk: data.soQd,
          ngayQdPdNk: data.ngayQd,
          qdPdNkId: data.id,
          tenLoKho: "",
          maLoKho: "",
          tenNganLoKho: "",
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
          tenDonViTinh: "",
        });
        this.dsHangTH = [];
        await this.loadChiTietQdinh(data.id);
      }
    });
  }

  async loadChiTietQdinh(id: number) {
    let res = await this.quyetDinhGiaoNhapHangKhacService.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {

      const data = res.data
      this.dsKeHoach = []
      this.dsKeHoach = cloneDeep(Array.isArray(data.dtlList) ? data.dtlList : [])
    }
  }

  async openDialogPNK() {
    await this.spinner.show();
    // Get data tờ trình
    let body = {
      // trangThai: STATUS.BAN_HANH,
      // loaiVthh: ['0101', '0102'],
      soQdinhDcc: this.formData.value.soQdinhDcc,
      loaiDc: this.loaiDc,
      // maDvi: this.userInfo.MA_DVI
      // listTrangThaiXh: [STATUS.CHUA_THUC_HIEN, STATUS.DANG_THUC_HIEN],
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
        console.log(data, "dataaaa")
        this.formData.patchValue({

          tenLoKho: data.tenLoKho,
          maLoKho: data.maLoKho,
          tenNganKho: data.tenNganKho,
          maNganKho: data.maNganKho,
          tenNhaKho: data.tenNhaKho,
          maNhaKho: data.maNhaKho,
          tenDiemKho: data.tenDiemKho,
          maDiemKho: data.maDiemKho,
          tenNganLoKho: data.tenLoKho ? data.tenLoKho + " - " + data.tenNganKho : data.tenNganKho,

          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          cloaiVthh: data.cloaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          tichLuongKhaDung: data.tichLuongKd,
          donViTinh: data.donViTinh,
          tenDonViTinh: data.tenDonViTinh,

          tenNguoiGiaoHang: data.hoVaTenNguoiGiao,
          cccd: data.cmndNguoiGiao,
          donViNguoiGiaoHang: data.donViNguoiGiao,
          diaChiDonViNguoiGiaoHang: data.diaChi,
          thoiHanGiaoNhan: data.tgianGiaoNhanHang,
        });
      }
      if (data.maDiemKho) {
        {
          this.layDonViCon(data.maDiemKho)
        }
      }
      // this.dsKeHoach = []
      // if (data.danhSachQuyetDinh.length == 0) return
      // data.danhSachQuyetDinh.map(qdinh => {
      //   this.dsKeHoach = this.dsKeHoach.concat(qdinh.danhSachKeHoach)
      // })

    }
  }
  async layDonViCon(maDiemKho) {
    await this.spinner.show()
    const res = await this.donViService.layDonViCon();
    if (res.msg === MESSAGE.SUCCESS) {
      const dataDiemKho = res.data.find(f => f.maDvi === maDiemKho);
      if (dataDiemKho) {
        this.formData.patchValue({
          diaDiemKho: dataDiemKho.diaChi
        })
      }
    }

    await this.spinner.hide();
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
    // body.fileDinhKemReq = this.fileDinhKemReq;
    body.hhNkBangKeNhapVTDtl = this.dsHangTH;
    if (this.idInput) {
      body.id = this.idInput
    }
    let data = await this.createUpdate(body);
    if (data) {
      this.formData.patchValue({ id: data.id, trangThai: data.trangThai, tenTrangThai: data.tenTrangThai, soBangKe: data.soBangKe });
      if (isGuiDuyet) {
        this.idInput = data.id;
        this.guiDuyet();
      }
      // else {
      //   this.quayLai();
      // }
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
    let trangThai = STATUS.CHODUYET_TBP_TVQT;
    let mesg = 'Bạn muốn gửi duyệt văn bản?'
    this.approve(this.idInput, trangThai, mesg);
    // }
  }
  isTuChoi() {
    return (this.formData.value.trangThai == STATUS.CHODUYET_TBP_TVQT && this.userService.isAccessPermisson('NHDTQG_PTDT_NK_VT_BKNVT_DUYET_TP'))
      || (this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC && this.userService.isAccessPermisson('NHDTQG_PTDT_NK_VT_BKNVT_DUYET_LDCCUC'));
  }

  isPheDuyet() {
    return (this.formData.value.trangThai == STATUS.CHODUYET_TBP_TVQT && this.userService.isAccessPermisson('NHDTQG_PTDT_NK_VT_BKNVT_DUYET_TP'))
      || (this.formData.value.trangThai == STATUS.CHO_DUYET_LDCC && this.userService.isAccessPermisson('NHDTQG_PTDT_NK_VT_BKNVT_DUYET_LDCCUC'));
  }

  async pheDuyet(isPheDuyet?: boolean) {
    let trangThai = "";
    let msg = "";
    if (isPheDuyet) {
      switch (this.formData.value.trangThai) {
        case STATUS.DU_THAO:
        case STATUS.TUCHOI_TBP_TVQT:
        case STATUS.TU_CHOI_LDCC:
          trangThai = STATUS.CHODUYET_TBP_TVQT;
          msg = "Bạn muốn gửi duyệt văn bản?";
          break;
        case STATUS.CHODUYET_TBP_TVQT:
          trangThai = STATUS.CHO_DUYET_LDCC;
          msg = "Bạn muốn phê duyệt văn bản?"
          break;
        case STATUS.CHO_DUYET_LDCC:
          trangThai = STATUS.DA_DUYET_LDCC;
          msg = "Bạn muốn phê duyệt văn bản?"
          break;
        default:
          trangThai = STATUS.CHODUYET_TBP_TVQT;
          msg = "Bạn muốn gửi duyệt văn bản?";
          break;
      }
      this.approve(this.formData.value.id, trangThai, msg);
    } else {
      switch (this.formData.value.trangThai) {
        case STATUS.CHODUYET_TBP_TVQT:
          trangThai = STATUS.TUCHOI_TBP_TVQT
          break;
        case STATUS.CHO_DUYET_LDCC:
          trangThai = STATUS.TU_CHOI_LDCC;
          break;
        default:
          trangThai = STATUS.TUCHOI_TBP_TVQT
          break;
      }
      this.reject(this.formData.value.id, trangThai)
    }
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
