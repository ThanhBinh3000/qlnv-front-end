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
import { BangKeCanHangService } from 'src/app/services/qlnv-hang/nhap-hang/nhap-khac/bangKeCanHang';
import { BienBanNghiemThuBaoQuanLanDauService } from "src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/bien-ban-nghiem-thu-bao-quan-lan-dau.service";
import { QuyetDinhDieuChuyenCucService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service";
import { StorageService } from "src/app/services/storage.service";
import { convertTienTobangChu } from "src/app/shared/commonFunction";
import * as uuidv4 from "uuid";
import { QuyetDinhGiaoNhapHangKhacService } from "src/app/services/qlnv-hang/nhap-hang/nhap-khac/quyetDinhGiaoNhapHangKhac.service";
import { DonviService } from "src/app/services/donvi.service";
import { PhieuNhapKhoService } from "src/app/services/qlnv-hang/nhap-hang/nhap-khac/phieuNhapKho";

@Component({
  selector: 'app-thong-tin-bang-ke-can-hang',
  templateUrl: './thong-tin-bang-ke-can-hang.component.html',
  styleUrls: ['./thong-tin-bang-ke-can-hang.component.scss']
})
export class ThongTinBangKeCanHangComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() data: any;
  @Output()
  showListEvent = new EventEmitter<any>();

  maBb: string;
  chungTuDinhKem: any[] = [];
  fileDinhKemReq: any[] = [];
  listDanhSachQuyetDinh: any[] = [];
  previewName: string = 'nk_bang_ke_can_hang';

  dsKeHoach: any[] = []

  dsHangTH: any[] = []

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
    private quyetDinhGiaoNhapHangKhacService: QuyetDinhGiaoNhapHangKhacService,
    private phieuNhapKhoService: PhieuNhapKhoService,
    private bangKeCanHangService: BangKeCanHangService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bangKeCanHangService);
    this.formData = this.fb.group({
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      nam: [dayjs().get("year"), [Validators.required]],
      maDvi: [],
      tenDvi: [],
      id: [],
      maQhns: [],
      soBangKe: [],
      ngayNhap: [dayjs().format('YYYY-MM-DD')],
      soQdPdNk: [],
      ngayKyQdinh: [],
      idQdPdNk: [],
      soPhieuNhapKho: [],
      phieuNhapKhoId: [],
      ngayNhapKho: [],
      tenLoNganKho: [],
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
      thoiGianGiaoNhan: [],
      loaiVthh: [],
      tenLoaiVthh: [],
      cloaiVthh: [],
      tenCloaiVthh: [],
      donViTinh: [],
      tongTrongLuongBaoBi: [],
      tongTrongLuongCabaoBi: [],
      tongTrongLuongTruBi: [],
      tongTrongLuongTruBiText: [],
      hhNkBangKeCanHangDtl: [new Array<any>(),],
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

    if (this.data) {
      console.log('data', this.data)
      this.formData.patchValue({
        soQdPdNk: this.data.soQdPdNk,
        ngayKyQdinh: this.data.ngayKyQdinh,
        idQdPdNk: this.data.idQdPdNk,
        tenLoNganKho: `${this.data.tenLoKho} ${this.data.tenNganKho}`,
        tenLoKho: this.data.tenLoKho,
        maLoKho: this.data.maLoKho,
        tenNganKho: this.data.tenNganKho,
        maNganKho: this.data.maNganKho,
        tenNhaKho: this.data.tenNhaKho,
        maNhaKho: this.data.maNhaKho,
        tenDiemKho: this.data.tenDiemKho,
        maDiemKho: this.data.maDiemKho,
        loaiVthh: this.data.loaiVthh,
        tenLoaiVthh: this.data.tenLoaiVthh,
        cloaiVthh: this.data.cloaiVthh,
        tenCloaiVthh: this.data.tenCloaiVthh,
        tenDonViTinh: this.data.donViTinh,
        soPhieuKtraCluong: this.data.soPhieuKiemTraCl,
        idPhieuKtraCluong: this.data.phieuKiemTraClId,
      });
      await this.loadChiTietQdinh(this.data.idQdPdNk);
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
      if (!data) return
      this.dsHangTH = data.hhNkBangKeCanHangDtl || []
      this.formData.patchValue({
        ...data,
        tenLoNganKho: `${data.tenLoKho} ${data.tenNganKho}`,
      });
      console.log(this.formData.value, "formData")
      console.log(data, "data")
      this.fileDinhKemReq = data.fileDinhKems
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
    this.dsHangTH = this.dsHangTH.filter(item => item.id !== row.id)
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
      denNgayQd: null,
      // maDvi: this.userInfo.MA_DVI,
      loaiVthh: this.loaiVthh,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0,
      },
      trangThai: this.globals.prop.NHAP_BAN_HANH,
    }
    this.listDanhSachQuyetDinh = []
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
        dataColumn: ['soQd', 'ngayQd', 'tenLoaiVthh'],
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          soQdPdNk: data.soQd,
          ngayKyQdinh: data.ngayQd,
          idQdPdNk: data.id,
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
          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          cloaiVthh: data.cloaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          // tichLuongKhaDung: data.tichLuongKd,
          donViTinh: data.tenDonViTinh,
        });
        await this.layDonViCon(data.maDiemKho)
      }
    });
  }

  async loadChiTietQdinh(id: number) {
    let res = await this.quyetDinhGiaoNhapHangKhacService.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {

      const data = res.data
      this.dsKeHoach = []
      if (data.dtlList.length == 0) return
      this.dsKeHoach = this.dsKeHoach.concat(data.dtlList)

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

  async openDialogPNK() {
    await this.spinner.show();
    let body = {
      idQdPdNk: this.formData.value.idQdPdNk,
      loaiVthh: this.loaiVthh,
    }
    this.listDanhSachQuyetDinh = []
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
        dataHeader: ['Số phiếu nhập kho'],
        dataColumn: ['soPhieuNhapKho'],
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          soPhieuNhapKho: data.soPhieuNhapKho,
          phieuNhapKhoId: data.id,
          ngayNhapKho: data.ngayNhapKho
        });
        await this.loadChiTietPKNK(data.id);
      }
    });
  }

  async loadChiTietPKNK(id: number) {
    let res = await this.phieuNhapKhoService.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {

      const data = res.data
      this.formData.patchValue({
        tenNguoiGiaoHang: data.hoVaTenNguoiGiao,
        cccd: data.cmndNguoiGiao,
        donViNguoiGiaoHang: data.donViNguoiGiao,
        diaChiDonViNguoiGiaoHang: data.diaChi,
        thoiGianGiaoNhan: data.tgianGiaoNhanHang,
      });

    }
  }


  async save(isGuiDuyet?) {
    await this.spinner.show();
    let body = this.formData.value;
    body.fileDinhKemReq = this.fileDinhKemReq;
    body.hhNkBangKeCanHangDtl = this.dsHangTH;
    if (this.idInput) {
      body.id = this.idInput
    }
    let data = await this.createUpdate(body);
    if (data) {
      if (isGuiDuyet) {
        this.idInput = data.id;
        this.guiDuyet();
      } else {
        // this.quayLai();
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
    let trangThai = STATUS.TU_CHOI_LDCC;
    this.reject(this.idInput, trangThai);

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
