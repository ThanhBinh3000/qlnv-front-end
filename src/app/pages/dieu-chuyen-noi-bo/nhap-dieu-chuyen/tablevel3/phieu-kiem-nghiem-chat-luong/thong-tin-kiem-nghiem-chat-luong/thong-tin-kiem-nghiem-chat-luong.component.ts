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
import { DanhMucService } from "src/app/services/danhmuc.service";
import { BienBanNghiemThuBaoQuanLanDauService } from "src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/bien-ban-nghiem-thu-bao-quan-lan-dau.service";
import { BienBanNhapDayKhoService } from "src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/bien-ban-nhap-day-kho";
import { PhieuKiemNghiemChatLuongService } from "src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/phieu-kiem-nghiem-chat-luong";
import { QuyetDinhDieuChuyenCucService } from "src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service";
import { DanhMucTieuChuanService } from "src/app/services/quantri-danhmuc/danhMucTieuChuan.service";
import { StorageService } from "src/app/services/storage.service";
import * as uuidv4 from "uuid";

@Component({
  selector: 'app-thong-tin-kiem-nghiem-chat-luong',
  templateUrl: './thong-tin-kiem-nghiem-chat-luong.component.html',
  styleUrls: ['./thong-tin-kiem-nghiem-chat-luong.component.scss']
})
export class ThongTinKiemNghiemChatLuongComponent extends Base2Component implements OnInit {
  @Input() loaiDc: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() data: any;
  @Output()
  showListEvent = new EventEmitter<any>();

  maBb: string;
  danhSach: any[] = []
  dataTableView: any[] = []
  dataTableChiTieu: any[] = []
  listDanhSachQuyetDinh: any[] = [];
  listDanhSachBBLM: any[] = [];

  dsKeHoach: any[] = []
  listHinhThucBaoQuan: any[] = []
  phieuKNCLDinhKem: any[] = [];

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
    private quyetDinhDieuChuyenCucService: QuyetDinhDieuChuyenCucService,
    private bienBanNhapDayKhoService: BienBanNhapDayKhoService,
    private phieuKiemNghiemChatLuongService: PhieuKiemNghiemChatLuongService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuKiemNghiemChatLuongService);
    this.formData = this.fb.group({
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      nam: [dayjs().get("year"), [Validators.required]],
      id: [],
      maDvi: [],
      tenDvi: [],
      maQhns: [],
      soPhieu: [],
      ngayLapPhieu: [dayjs().format('YYYY-MM-DD')],
      soQdinhDc: [],
      qdDcId: [],
      nguoiKN: [],
      tpNguoiKt: [],
      tpNguoiKtId: [],
      tenLoKho: [],
      maLoKho: [],
      tenNganKho: [],
      maNganKho: [],
      tenNhaKho: [],
      maNhaKho: [],
      tenDiemKho: [],
      maDiemKho: [],
      tenThuKho: [],
      thuKhoId: [],
      soBbLayMau: [],
      ngayLayMau: [],
      bbLayMauId: [],
      ngayKiem: [],
      soBbTinhKho: [],
      slHangBQ: [],
      ngayNhapDayKho: [],
      loaiVthh: [],
      tenLoaiVthh: [],
      cloaiVthh: [],
      tenCloaiVthh: [],
      tenDonViTinh: [],
      donViTinh: [],
      hinhThucBq: [],
      danhGiaCamQuan: [],
      dcnbPhieuKnChatLuongDtl: [new Array<any>(),],
      nhanXetKetLuan: [],
      type: ["01"],
      loaiDc: []
    }
    );
  }

  async ngOnInit() {
    this.maBb = 'KNCL-' + this.userInfo.DON_VI.tenVietTat;
    let id = await this.userService.getId("DCNB_PHIEU_KN_CHLUONG_HDR_SEQ");
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      ktvBaoQuan: this.userInfo.TEN_DAY_DU,
      soPhieu: `${id}/${this.formData.get('nam').value}/${this.maBb}`,
      id: id,
      loaiDc: this.loaiDc
    })

    if (this.idInput) {
      await this.loadChiTiet(this.idInput)
    }

    if (this.data) {
      console.log('this.data', this.data)
      this.formData.patchValue({
        trangThai: STATUS.DU_THAO,
        tenTrangThai: 'Dự thảo',
        soQdinhDc: this.data.soQdinh,
        ngayQdinhDc: this.data.ngayKyQdinh,
        qdDcId: this.data.qdinhDccId,
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
        tichLuongKhaDung: this.data.tichLuongKd,
        tenDonViTinh: this.data.tenDonViTinh,
      });
      await this.loadChiTietQdinh(this.data.qdinhDccId);
      let dmTieuChuan = await this.danhMucTieuChuanService.getDetailByMaHh(this.data.maChLoaiHangHoa);
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
      await this.dsHinhThucBaoQuan(this.data.maChLoaiHangHoa)
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
        this.dataTableChiTieu = data.dcnbPhieuKnChatLuongDtl
        this.formData.patchValue(data);
        await this.dsHinhThucBaoQuan(data.cloaiVthh)
        if (data.hinhThucBq) {
          const dshinhThucBq = data.hinhThucBq.split(",").map(f => ({ id: f.split("-")[0], giaTri: f.split("-")[1] }))
          this.listHinhThucBaoQuan = this.listHinhThucBaoQuan.map(pp => {
            return {
              ...pp,
              checked: !!dshinhThucBq.find(check => Number(check.id) == pp.id)
            }
          })

        }
      }

    }
    await this.spinner.hide();
  }

  async dsHinhThucBaoQuan(maChLoaiHangHoa) {
    let res = await this.danhMucService.loadDanhMucHangChiTiet(maChLoaiHangHoa)
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHinhThucBaoQuan = res.data.hinhThucBq
    }

  }


  async dsBienBanLayMau() {
    let res = await this.phieuKiemNghiemChatLuongService.dsBienBanLayMau({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDanhSachBBLM = res.data
    }

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
    // this.detail.ketQuaKiemTra = this.detail?.ketQuaKiemTra.filter(x => x.stt != data.stt);
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

  async openDialogBBLM() {
    await this.spinner.show();
    let body = {
      loaiDc: this.loaiDc,
      type: "01",
      maLoKho: this.formData.value.maLoKho,
      maNganKho: this.formData.value.maNganKho,
      soQdinhDcc: this.formData.value.soQdinhDc,
    }
    let res = await this.phieuKiemNghiemChatLuongService.dsBienBanLayMau(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDanhSachBBLM = res.data
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
        dataTable: this.listDanhSachBBLM,
        dataHeader: ['Số biên bản lấy mẫu'],
        dataColumn: ['soBbLayMau']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          soBbLayMau: data.soBbLayMau,
          ngayLayMau: data.ngayLayMau,
          bbLayMauId: data.id
        });
        await this.dsHinhThucBaoQuan(data.cloaiVthh)
      }
    });
  }

  async openDialogBBNDK() {
    await this.spinner.show();
    let body = {
      // trangThai: STATUS.BAN_HANH,
      loaiDc: this.loaiDc,
      // maDvi: this.userInfo.MA_DVI
      // maLoKho: this.formData.value.maLoKho,
      // maNganKho: this.formData.value.maNganKho,
    }
    let res = await this.bienBanNhapDayKhoService.getDanhSach(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDanhSachBBLM = res.data
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
        dataTable: this.listDanhSachBBLM,
        dataHeader: ['Số biên bản nhập đầy kho'],
        dataColumn: ['soBb']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          soBbTinhKho: data.soBb,
          bbTinhKhoId: data.id
        });
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
          console.log('dmTieuChuan')
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
    body.phieuKNCLDinhKem = this.phieuKNCLDinhKem;
    body.dcnbPhieuKnChatLuongDtl = this.dataTableChiTieu;
    body.hinhThucBq = this.listHinhThucBaoQuan.filter(item => item.checked).map(i => `${i.id}-${i.giaTri}`).join(",");
    if (this.idInput) {
      body.id = this.idInput
    } else {
      body.dcnbPhieuKnChatLuongDtl = this.dataTableChiTieu.map(item => {
        return {
          ...item,
          id: undefined
        }
      });
    }
    let res = this.idInput ? await this.phieuKiemNghiemChatLuongService.update(body) : await this.phieuKiemNghiemChatLuongService.create(body);
    // let data = await this.createUpdate(body);
    if (res.data) {
      this.idInput = res.data.id;
      if (isGuiDuyet) {
        this.guiDuyet();
      }
    }
    await this.spinner.hide();
  }

  async guiDuyet() {
    let trangThai = STATUS.CHO_DUYET_TP;
    let mesg = 'Bạn muốn gửi duyệt văn bản?'
    this.approve(this.idInput, trangThai, mesg);
  }

  isTuChoi() {
    return this.formData.value.trangThai == STATUS.CHO_DUYET_TP || this.formData.value.trangThai == STATUS.CHO_DUYET_LDC
  }

  async tuChoi() {
    let trangThai = () => {
      if (this.formData.value.trangThai == STATUS.CHO_DUYET_TP)
        return STATUS.TU_CHOI_TP
      if (this.formData.value.trangThai == STATUS.CHO_DUYET_LDC)
        return STATUS.TU_CHOI_LDC
    };
    this.reject(this.idInput, trangThai());
  }

  isPheDuyet() {
    return (this.formData.value.trangThai == STATUS.CHO_DUYET_TP || this.formData.value.trangThai == STATUS.CHO_DUYET_LDC)
  }

  async pheDuyet() {
    let trangThai = () => {
      if (this.formData.value.trangThai == STATUS.CHO_DUYET_TP)
        return STATUS.CHO_DUYET_LDC
      if (this.formData.value.trangThai == STATUS.CHO_DUYET_LDC)
        return STATUS.DA_DUYET_LDC
    };
    let mesg = 'Bạn muốn phê duyệt văn bản?'
    this.approve(this.idInput, trangThai(), mesg);

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
