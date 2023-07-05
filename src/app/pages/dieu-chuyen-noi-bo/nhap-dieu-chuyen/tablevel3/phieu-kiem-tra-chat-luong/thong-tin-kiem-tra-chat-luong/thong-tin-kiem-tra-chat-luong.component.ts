import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Validators } from "@angular/forms";
import * as dayjs from "dayjs";
import { NzModalService } from "ng-zorro-antd/modal";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { Base2Component } from "src/app/components/base2/base2.component";
import {
  DialogTableSelectionComponent
} from "src/app/components/dialog/dialog-table-selection/dialog-table-selection.component";
import { MESSAGE } from "src/app/constants/message";
import { STATUS } from "src/app/constants/status";
import { DanhMucDungChungService } from "src/app/services/danh-muc-dung-chung.service";
import { DanhMucService } from "src/app/services/danhmuc.service";
import { BienBanNghiemThuBaoQuanLanDauService } from "src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/bien-ban-nghiem-thu-bao-quan-lan-dau.service";
import { PhieuKiemTraChatLuongService } from "src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/phieu-kiem-tra-chat-luong";
import { QuyetDinhDieuChuyenCucService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service";
import { BbNghiemThuBaoQuanService } from "src/app/services/qlnv-hang/nhap-hang/nhap-khac/bbNghiemThuBaoQuan.service";
import { DanhMucTieuChuanService } from "src/app/services/quantri-danhmuc/danhMucTieuChuan.service";
import { StorageService } from "src/app/services/storage.service";


@Component({
  selector: 'app-thong-tin-kiem-tra-chat-luong',
  templateUrl: './thong-tin-kiem-tra-chat-luong.component.html',
  styleUrls: ['./thong-tin-kiem-tra-chat-luong.component.scss']
})

export class ThongTinKiemTraChatLuongComponent extends Base2Component implements OnInit {
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() data: any;
  @Input() loaiDc: string;
  @Output()
  showListEvent = new EventEmitter<any>();

  maBb: string;
  danhSach: any[] = []
  dataTableView: any[] = []
  dataTableChiTieu: any[] = []
  listDanhSachQuyetDinh: any[] = [];

  dsKeHoach: any[] = []
  ppKtrCL: any[] = [];
  phieuKTCLDinhKem: any[] = [];
  bienBanLayMauDinhKem: any[] = [];

  LIST_DANH_GIA: any[] = [
    "Không đạt",
    "Đạt"
  ]

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private danhMucTieuChuanService: DanhMucTieuChuanService,
    private dmService: DanhMucDungChungService,
    private bbNghiemThuBaoQuanService: BbNghiemThuBaoQuanService,
    private quyetDinhDieuChuyenCucService: QuyetDinhDieuChuyenCucService,
    private phieuKiemTraChatLuongService: PhieuKiemTraChatLuongService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuKiemTraChatLuongService);
    this.formData = this.fb.group({
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      nam: [dayjs().get("year"), [Validators.required]],
      maDvi: [],
      tenDvi: [],
      maQhns: [],
      soPhieu: [],
      ngayLapPhieu: [dayjs().format('YYYY-MM-DD')],
      soQdinhDc: [],
      ngayQdinhDc: [],
      qdDcId: [],
      ktvBaoQuan: [],
      thuTruong: [],
      tenLoKho: [],
      maLoKho: [],
      tenNganKho: [],
      maNganKho: [],
      tenNhaKho: [],
      maNhaKho: [],
      tenDiemKho: [],
      maDiemKho: [],
      loaiHinhKho: [],
      loaiVthh: [],
      tenLoaiVthh: [],
      cloaiVthh: [],
      tenCloaiVthh: [],
      tichLuongKhaDung: [],
      tenDonViTinh: [],
      dsBienBan: [],
      tenLoKhoXuat: [],
      maLoKhoXuat: [],
      tenNganKhoXuat: [],
      maNganKhoXuat: [],
      tenNhaKhoXuat: [],
      maNhaKhoXuat: [],
      tenDiemKhoXuat: [],
      maDiemKhoXuat: [],
      dsBBNTBQ: [],
      tongKinhPhiDaTh: [],

      nguoiGH: [],
      cccd: [],
      dvNguoiGH: [],
      dcNguoiGH: [],
      biensoxe: [],
      slNhapLoKho: [],
      slKhaiBao: [],
      slThucTe: [],
      lanhDao: [],

      soGiamDinh: [],
      ngayGiamDinh: [],
      tcGiamDinh: [],

      danhGiaCamQuan: [],
      dcnbPhieuKtChatLuongDtl: [new Array<any>(),],
      nhanXetKetLuan: [],
      type: ["01"],
      loaiDc: []
    }
    );
  }

  async ngOnInit() {
    this.maBb = 'KTCL-' + this.userInfo.DON_VI.tenVietTat;
    let id = await this.userService.getId("DCNB_PHIEU_KT_CHLUONG_HDR_SEQ");
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      ktvBaoQuan: this.userInfo.TEN_DAY_DU,
      soPhieu: `${id}/${this.formData.get('nam').value}/${this.maBb}`,
      loaiDc: this.loaiDc
    })
    this.getPPKTCL()

    if (this.idInput) {
      await this.loadChiTiet(this.idInput)
    }

    if (this.data) {
      this.formData.patchValue({
        soQdinhDc: this.data.soQdinh,
        ngayQdinhDc: this.data.ngayKyQdinh,
        qdDcId: this.data.qdinhDccId,
        tenLoKho: this.data.tenloKhoNhan,
        maLoKho: this.data.maloKhoNhan,
        tenNganKho: this.data.tenNganKhoNhan,
        maNganKho: this.data.maNganKhoNhan,
        tenNhaKho: this.data.tenNhaKhoNhan,
        maNhaKho: this.data.maNhaKhoNhan,
        tenDiemKho: this.data.tenDiemKhoNhan,
        maDiemKho: this.data.maDiemKhoNhan,
        tenLoKhoXuat: this.data.tenloKhoXuat,
        maLoKhoXuat: this.data.maloKhoXuat,
        tenNganKhoXuat: this.data.tenNganKhoXuat,
        maNganKhoXuat: this.data.maNganKhoXuat,
        tenNhaKhoXuat: this.data.tenNhaKhoXuat,
        maNhaKhoXuat: this.data.maNhaKhoXuat,
        tenDiemKhoXuat: this.data.tenDiemKhoXuat,
        maDiemKhoXuat: this.data.maDiemKhoXuat,
        loaiVthh: this.data.loaiVthh,
        tenLoaiVthh: this.data.tenLoaiVthh,
        cloaiVthh: this.data.cloaiVthh,
        tenCloaiVthh: this.data.tenCloaiVthh,
        tichLuongKhaDung: this.data.tichLuongKd,
        tenDonViTinh: this.data.tenDonViTinh,
      });
      await this.loadChiTietQdinh(this.data.qdinhDccId);
      await this.getDataKho(this.data.maLoKhoNhan || this.data.maNganKhoNhan)
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
      if (data) {
        this.dataTableChiTieu = data.dcnbPhieuKtChatLuongDtl
        this.formData.patchValue(data);
      }

    }
    await this.spinner.hide();
  }

  async getPPKTCL() {
    let data = await this.dmService.danhMucChungGetAll("PP_KIEM_TRA_CL");
    this.ppKtrCL = data.data;
  }



  async add(row?: any) {

  }

  isDisableField() {
    // if (this.detail && (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP || this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.detail.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
    //   return true;
    // }
    return false;
  }

  cancelEdit(index: number): void {
    this.dataTableChiTieu[index].edit = false;
  }

  saveEdit(index: number): void {
    this.dataTableChiTieu[index].edit = false;
  }

  deleteRow(data: any) {
    this.dataTableChiTieu = this.dataTableChiTieu.filter(x => x.id != data.id);
    // this.sortTableId();
    // this.updateEditCache();
  }

  editRow(index: number) {
    this.dataTableChiTieu[index].edit = true;
  }

  them(row) {

  }

  sua(row) {

  }

  xoa(row) {
    this.dataTableView = this.dataTableView.filter(item => item.idVirtual !== row.idVirtual)
    this.formData.patchValue({
      dcnbBBNTBQDtlList: this.dataTableView
    })
  }




  async openDialogQD() {
    await this.spinner.show();
    // Get data tờ trình
    let body = {
      trangThai: STATUS.BAN_HANH,
      loaiVthh: ['0101', '0102'],
      loaiDc: this.loaiDc,
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
          soQdinhDc: data.soQdinh,
          ngayQdinhDc: data.ngayKyQdinh,
          qdDcId: data.id,
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
          tenDonViTinh: data.tenDonViTinh,
          slNhapLoKho: data.soLuongPhanBo
        });

        let dmTieuChuan = await this.danhMucTieuChuanService.getDetailByMaHh(data.cloaiVthh);
        if (dmTieuChuan.data) {
          this.dataTableChiTieu = dmTieuChuan.data.children;
          this.dataTableChiTieu = this.dataTableChiTieu.map(element => {
            return {
              ...element,
              edit: false,
              chiSoCl: element.tenTchuan,
              chiTieuCl: element.chiSoNhap,
              ketQuaPt: element.ketQuaPt,
              danhGia: element.danhGia
            }
          });
        }

        await this.getDataKho(this.data.maLoKhoNhan || this.data.maNganKhoNhan)

      }
    });
  }

  async getDataKho(maDvi: any) {
    if (maDvi) {
      let res = await this.bbNghiemThuBaoQuanService.getDataKho(maDvi);
      this.formData.patchValue({
        // tichLuong: (res.data.tichLuongTkLt - res.data.tichLuongKdLt) > 0 ? res.data.tichLuongTkLt - res.data.tichLuongKdLt : 0,
        loaiHinhKho: res.data.lhKho
      });
    }
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
    body.phieuKTCLDinhKem = this.phieuKTCLDinhKem;
    body.bienBanLayMauDinhKem = this.bienBanLayMauDinhKem;
    body.dcnbPhieuKtChatLuongDtl = this.dataTableChiTieu;
    if (this.idInput) {
      body.id = this.idInput
    } else {
      body.dcnbPhieuKtChatLuongDtl = this.dataTableChiTieu.map(item => {
        return {
          ...item,
          id: undefined
        }
      });
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

  async guiDuyet() {
    let trangThai = STATUS.CHO_DUYET_LDC;
    let mesg = 'Bạn muốn gửi duyệt văn bản?'
    this.approve(this.idInput, trangThai, mesg);
  }

  isTuChoi() {
    return this.formData.value.trangThai == STATUS.CHO_DUYET_LDC
  }

  async tuChoi() {
    let trangThai = STATUS.TU_CHOI_LDC;
    this.reject(this.idInput, trangThai);
  }

  isPheDuyet() {
    return this.formData.value.trangThai == STATUS.CHO_DUYET_LDC
  }

  async pheDuyet() {
    let trangThai = STATUS.DA_DUYET_LDC;
    let mesg = 'Bạn muốn phê duyệt văn bản?'
    this.approve(this.idInput, trangThai, mesg);

  }

  isBanHanh() {
    return false
  }

  async banHanh() {
    let trangThai = STATUS.BAN_HANH;
    let mesg = 'Bạn muốn ban hành văn bản?'
    this.approve(this.idInput, trangThai, mesg);
  }

  quayLai() {
    this.showListEvent.emit();
  }

}
