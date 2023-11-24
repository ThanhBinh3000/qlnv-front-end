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
import { PhieuNhapKhoService } from "src/app/services/qlnv-hang/nhap-hang/nhap-khac/phieuNhapKho";
import { QuyetDinhDieuChuyenCucService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service";
import { PhieuKtraCluongService } from "src/app/services/qlnv-hang/nhap-hang/nhap-khac/phieuKtraCluong.service";
import { QuyetDinhGiaoNhapHangKhacService } from "src/app/services/qlnv-hang/nhap-hang/nhap-khac/quyetDinhGiaoNhapHangKhac.service";
import { StorageService } from "src/app/services/storage.service";
import { convertTienTobangChu } from "src/app/shared/commonFunction";
import * as uuidv4 from "uuid";
import { DanhMucDungChungService } from "src/app/services/danh-muc-dung-chung.service";
import { KIEU_NHAP_XUAT } from "src/app/constants/config";
import { BbNghiemThuBaoQuanService } from "src/app/services/qlnv-hang/nhap-hang/nhap-khac/bbNghiemThuBaoQuan.service";
import moment from "moment";

@Component({
  selector: 'app-thong-tin-phieu-nhap-kho',
  templateUrl: './thong-tin-phieu-nhap-kho.component.html',
  styleUrls: ['./thong-tin-phieu-nhap-kho.component.scss']
})
export class ThongTinPhieuNhapKhoComponent extends Base2Component implements OnInit {
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

  dsTH = []
  dsKeHoach: any[] = []
  noiDung: string;
  dviTinh: string;
  donGia: any;
  thanhTien: number;
  previewName: string = 'nk_phieu_nhap_kho';

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private cdr: ChangeDetectorRef,
    private danhMucService: DanhMucService,
    private dmService: DanhMucDungChungService,
    private phieuKiemTraChatLuongService: PhieuKtraCluongService,
    private quyetDinhGiaoNhapHangKhacService: QuyetDinhGiaoNhapHangKhacService,
    private bbNghiemThuBaoQuanService: BbNghiemThuBaoQuanService,
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
      ngayLap: [dayjs().format('YYYY-MM-DD')],
      soNo: [],
      soCo: [],
      soQdGiaoNv: [, [Validators.required]],
      ngayQdGiaoNv: [],
      qdGiaoNvId: [],
      tenLoNganKho: [],
      tenLoKho: [, [Validators.required]],
      maLoKho: [, [Validators.required]],
      tenNganKho: [, [Validators.required]],
      maNganKho: [],
      tenNhaKho: [, [Validators.required]],
      maNhaKho: [],
      tenDiemKho: [, [Validators.required]],
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
      soBBNghiemThuBqld: [],
      soLuongQdDcCuc: [],
      donViTinh: [],
      tenDonViTinh: [],
      soBangKeCanHang: [],
      tongSoLuong: [],
      tongSoLuongBc: [],
      tongKinhPhi: [],
      tongKinhPhiBc: [],
      duToanKinhPhi: [],
      children: [new Array<any>(),],
      ghiChu: [],
      maSo: [],
      soLuongNhap: [],
      soLuongNhapTt: [],
    });
  }

  async ngOnInit() {
    this.maBb = 'PNK-CCDTVP';
    let id = await this.userService.getId('BB_LAY_MAU_SEQ')
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      thuKho: this.userInfo.TEN_DAY_DU,
      soPhieuNhapKho: `${id}/${this.formData.get('nam').value}/${this.maBb}`,
    })
    this.getDataNX()

    if (this.idInput) {
      await this.loadChiTiet(this.idInput)
    }
    console.log('formatttttttt', dayjs("31/07/2023 07:00:00").format("YYYY-MM-DD"))

    if (this.data) {
      console.log('data', this.data)
      this.formData.patchValue({
        soQdGiaoNv: this.data.soQdPdNk,
        ngayQdGiaoNv: moment(this.data.ngayKyQdinh, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD'),
        qdGiaoNvId: this.data.idQdPdNk,
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
      this.dviTinh = this.data.donViTinh
      // this.donGia = this.data.donGia

      let body = {
        maNganKho: this.data.maNganKho,
        maLoKho: this.data.maLoKho,
        idQdGiaoNvnh: this.data.idQdPdNk
      }
      this.getPhieuKTCL(body)
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
    const body = { loai: 'LOAI_HINH_NHAP_XUAT', ma: 141 }
    let res = await this.dmService.search(body);
    if (res.statusCode == 0) {
      const data = res.data.content
      if (data && data.length > 0) {
        const content = data[0]
        this.formData.patchValue({
          loaiHinhNx: content.giaTri,
          kieuNx: KIEU_NHAP_XUAT[content.ghiChu]
        });
      }
    }

    await this.spinner.hide();
  }

  async loadChiTiet(id: number) {
    await this.spinner.show()
    if (id) {
      let data = await this.detail(id);
      this.formData.patchValue({
        ...data,
        tenLoNganKho: `${data.tenLoKho} ${data.tenNganKho}`,
      });
      this.dsTH = data.children || []
      this.chungTuDinhKem = data.chungTuDinhKem
      this.fileDinhKemReq = data.fileDinhKems
    }
    await this.spinner.hide();
  }

  onChangeSoLuongNhapTt(soLuongNhapTt, index?) {
    if (index) {
      this.dsTH[index].thanhTien = Number(this.dsTH[index].donGia) * Number(soLuongNhapTt)
    } else
      this.thanhTien = Number(this.donGia) * Number(soLuongNhapTt)

  }

  async add(row?: any) {
    if (!this.formData.value.qdGiaoNvId || !this.formData.value.maSo || !this.formData.value.soLuongNhap || !this.formData.value.soLuongNhapTt) {
      this.notification.error(MESSAGE.ERROR, "Bạn chưa nhập đủ thông tin");
      return
    }

    this.dsTH.push({
      idVirtual: uuidv4.v4(),
      edit: false,
      noiDung: this.noiDung,
      maSo: this.formData.value.maSo,
      dviTinh: this.dviTinh,
      soLuongNhap: this.formData.value.soLuongNhap,
      soLuongNhapTt: this.formData.value.soLuongNhapTt,
      donGia: this.donGia,
      thanhTien: this.thanhTien
    })
    this.dsTH = cloneDeep(this.dsTH)
    const tongSoLuong = this.dsTH.reduce((previous, current) => previous + current.soLuongNhapTt, 0);
    const tongKinhPhi = this.dsTH.reduce((previous, current) => previous + current.thanhTien, 0);
    const tongSoLuongBc = this.convertTien(tongSoLuong)
    const tongKinhPhiBc = this.convertTien(tongKinhPhi)


    this.formData.patchValue({
      tongSoLuong,
      tongSoLuongBc,
      tongKinhPhi,
      tongKinhPhiBc,
      maSo: "",
      soLuongNhapTt: "",
      soLuongNhap: "",
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
    if (this.isView) return
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
        console.log('openDialogQD', data)
        this.formData.patchValue({
          soQdGiaoNv: data.soQd,
          ngayQdGiaoNv: data.ngayQd,
          qdGiaoNvId: data.id,
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
          donViTinh: "",
          tenDonViTinh: "",
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
      idQdGiaoNvnh: this.formData.value.qdGiaoNvId,
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
        dataColumn: ['tenLoKho', 'tenNganKho', 'tenNhaKho', 'tenDiemKho']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      console.log(data, "0000000")
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
          tichLuongKhaDung: data.tichLuongKd,
          soLuongQdDcCuc: data.soLuongPhanBo,
          donViTinh: data.dvt,
          tenDonViTinh: data.dvt,
        });
        this.noiDung = data.tenCloaiVthh
        this.dviTinh = data.dvt
        this.donGia = data.donGia

        let body = {
          maNganKho: this.formData.value.maNganKho,
          maLoKho: this.formData.value.maLoKho,
          idQdGiaoNvnh: this.formData.value.qdGiaoNvId,
        }
        await this.getPhieuKTCL(body)
        await this.loadDsBbnt()
      }
    });
  }

  async getPhieuKTCL(body) {
    let resSoDX = await this.phieuKiemTraChatLuongService.timKiemPhieuKTCL(body)
    if (resSoDX.msg == MESSAGE.SUCCESS) {
      const phieuKTCL = resSoDX.data;
      this.noiDung = phieuKTCL.tenCloaiVthh
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

  async loadDsBbnt() {
    let body = {
      idQdGiaoNvnh: this.formData.get('qdGiaoNvId').value,
      maLoKho: this.formData.get('maLoKho').value,
      maNganKho: this.formData.get('maNganKho').value,
    }
    let res = await this.bbNghiemThuBaoQuanService.timKiemBbtheoMaNganLo(body);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data;
      let bbNTBQ = ''
      data.forEach(element => {
        bbNTBQ = bbNTBQ.concat(`${element.soBbNtBq}, `)
      });
      this.formData.patchValue({
        bbNghiemThuBqld: bbNTBQ
      })
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }


  async loadChiTietQdinh(id: number) {
    let res = await this.quyetDinhGiaoNhapHangKhacService.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {

      const data = res.data
      let dtlList = data.dtlList.find(x => x.maLoKho.includes(this.formData.value.maLoKho))
      this.donGia = dtlList.donGia;
      console.log(this.donGia)
      this.dsKeHoach = []
      if (data.dtlList.length == 0) return
      this.dsKeHoach = this.dsKeHoach.concat(data.dtlList)
      console.log(this.dsKeHoach, "888888")

    }
  }

  setExpand(parantExpand: boolean = false, children: any = []): void {
    if (parantExpand) {
      return children.map(f => ({ ...f, expand: false }))
    }
    return children
  }


  async save(isGuiDuyet?) {
    if (this.dsTH.length == 0) {
      this.notification.error(MESSAGE.ERROR, "Bạn chưa thêm danh sách thông tin hàng");
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

    let data = await this.createUpdate(body);
    if (data) {
      this.idInput = data.id;
      if (isGuiDuyet) {
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

