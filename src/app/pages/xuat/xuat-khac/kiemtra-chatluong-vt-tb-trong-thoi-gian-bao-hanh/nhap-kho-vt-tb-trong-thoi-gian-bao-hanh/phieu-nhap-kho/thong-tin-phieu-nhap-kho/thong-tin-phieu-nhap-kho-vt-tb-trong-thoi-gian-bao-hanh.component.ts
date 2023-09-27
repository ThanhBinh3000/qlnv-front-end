import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import dayjs from "dayjs";
import {Base2Component} from "../../../../../../../components/base2/base2.component";
import {StorageService} from "../../../../../../../services/storage.service";
import {DanhMucService} from "../../../../../../../services/danhmuc.service";
import {
  QuyetDinhGiaoNvXuatHangService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/QuyetDinhGiaoNvXuatHang.service";
import {Validators} from "@angular/forms";
import {STATUS} from "../../../../../../../constants/status";
import {FileDinhKem} from "../../../../../../../models/FileDinhKem";
import {MESSAGE} from "../../../../../../../constants/message";
import {
  DialogTableSelectionComponent
} from "../../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {convertTienTobangChu} from "../../../../../../../shared/commonFunction";
import {
  QdGiaoNvNhapHangTrongThoiGianBaoHanhService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/QdGiaoNvNhapHangTrongThoiGianBaoHanh.service";
import {
  PhieuKdclVtTbTrongThoiGianBaoHanhService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/PhieuKdclVtTbTrongThoiGianBaoHanh.service";
import {
  PhieuXuatNhapKhoVtTbTrongThoiGianBaoHanhService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/PhieuXuatNhapKhoVtTbTrongThoiGianBaoHanh.service";
import {
  PhieuKtclVtTbTrongThoiGianBaoHanhService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/PhieuKtclVtTbTrongThoiGianBaoHanh.service";


@Component({
  selector: 'app-thong-tin-phieu-nhap-kho-vt-tb-trong-thoi-gian-bao-hanh',
  templateUrl: './thong-tin-phieu-nhap-kho-vt-tb-trong-thoi-gian-bao-hanh.component.html',
  styleUrls: ['./thong-tin-phieu-nhap-kho-vt-tb-trong-thoi-gian-bao-hanh.component.scss']
})
export class ThongTinPhieuNhapKhoVtTbTrongThoiGianBaoHanhComponent extends Base2Component implements OnInit {

  @Input() soBcKqkdMau: string;
  @Input() nganLoKho: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  listSoQuyetDinh: any[] = []
  listDiaDiemNhap: any[] = [];
  listPhieuKdcl: any[] = [];
  listPhieuKtcl: any[] = [];
  fileDinhKems: any[] = [];
  listDiemKho: any[] = [];
  listBbLayMau: any[] = [];
  maPhieu: string;
  checked: boolean = false;
  listFileDinhKem: any = [];
  listNganLoKho: any = [];
  templateName = "Phiếu nhập kho";
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quyetDinhGiaoNvXuatHangService: QuyetDinhGiaoNvXuatHangService,
    private qdGiaoNvNhapHangTrongThoiGianBaoHanhService: QdGiaoNvNhapHangTrongThoiGianBaoHanhService,
    private phieuKdclVtTbTrongThoiGianBaoHanhService: PhieuKdclVtTbTrongThoiGianBaoHanhService,
    private phieuKtclVtTbTrongThoiGianBaoHanhService: PhieuKtclVtTbTrongThoiGianBaoHanhService,
    private phieuXuatNhapKhoVtTbTrongThoiGianBaoHanhService: PhieuXuatNhapKhoVtTbTrongThoiGianBaoHanhService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuXuatNhapKhoVtTbTrongThoiGianBaoHanhService);

    this.formData = this.fb.group(
      {
        id: [0],
        namKeHoach: [dayjs().get("year")],
        maDvi: [],
        loai: ['NHAP_MAU', [Validators.required]],
        maQhns: [],
        soPhieu: [],
        ngayXuatNhap: [dayjs().format("YYYY-MM-DD"), [Validators.required]],
        duNo: [],
        duCo: [],
        idCanCu: [],
        soCanCu: [],
        ngayKyCanCu: [],
        maDiaDiem: [null, [Validators.required]],
        ngayQdGiaoNvXh: [],
        maNhaKho: [],
        maNganKho: [],
        maLoKho: [],
        slTonKho: [],
        idPhieuKdcl: [],
        soPhieuKdcl: [''],
        ngayKdcl: [''],
        ngayKn: [],
        loaiVthh: [],
        cloaiVthh: [],
        canBoLapPhieu: [],
        ldChiCuc: [],
        thuKho: [],
        keToanTruong: [],
        hoTenNgh: [],
        cccdNgh: [],
        donViNgh: [],
        diaChiNgh: [],
        thoiGianGiaoHang: [],
        maSo: [],
        donViTinh: [],
        slLayMau: [],
        slThucTe: [],
        ghiChu: ['', [Validators.required]],
        trangThai: [STATUS.DU_THAO],
        tenDvi: [],
        lyDoTuChoi: [],
        type: [],
        soBbKetThucNk: [],
        idBbketThucNk: [],
        tenTrangThai: ['Dự Thảo'],
        tenLoaiVthh: [],
        tenCloaiVthh: [],
        tenDiemKho: ['', [Validators.required]],
        tenNhaKho: ['', [Validators.required]],
        tenNganKho: [''],
        tenLoKho: [],
        fileDinhKems: [new Array<FileDinhKem>()],
        loaiPhieu: ['NHAP', [Validators.required]],
        idBienBanKt: [],
        soBienBanKt: [],
        idBbLayMau: [],
        soBbLayMau: [],

      }
    );
    this.maPhieu = 'PNK-' + this.userInfo.DON_VI.tenVietTat;
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      await Promise.all([
        this.loadSoQuyetDinhGiaoNvXh()
      ])
      await this.loadDetail(this.idInput)
      await this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      await this.spinner.hide();
    } finally {
      await this.spinner.hide();
    }
  }


  async loadDetail(idInput: number) {
    if (idInput > 0) {
      await this.phieuXuatNhapKhoVtTbTrongThoiGianBaoHanhService.getDetail(idInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const data = res.data;
            this.fileDinhKems = data.fileDinhKems;
            //load thông tin ngăn lô kho
            let itemQD = this.listSoQuyetDinh.find(item => item.soBaoCao == data.soCanCu && item.id == data.idCanCu);
            if (itemQD) {
              this.bindingDataQd(itemQD);
              this.formData.patchValue({
                maDiaDiem: res.data.maDiaDiem
              })
            }
            this.formData.patchValue(data);
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      let id = await this.userService.getId('XH_XK_VT_BH_PHIEU_XN_KHO_SEQ')
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
        maQhns: this.userInfo.DON_VI.maQhns,
        canBoLapPhieu: this.userInfo.TEN_DAY_DU,
        soPhieu: `${id}/${this.formData.get('namKeHoach').value}/${this.maPhieu}`,
        ngayXuat: dayjs().format('YYYY-MM-DD'),
        ngayXuatKho: dayjs().format('YYYY-MM-DD'),
      });
      if (this.soBcKqkdMau) {
        let dataBcKqKdm = this.listSoQuyetDinh.find(item => item.soBaoCao == this.soBcKqkdMau);
        if (dataBcKqKdm) {
          this.bindingDataQd(dataBcKqKdm, this.nganLoKho);
        }
      }
    }

  }

  quayLai() {
    this.showListEvent.emit();
  }

  async loadSoQuyetDinhGiaoNvXh() {
    let body = {
      nam: this.formData.get("namKeHoach").value,
      dvql: this.userInfo.MA_DVI,
      trangThai: STATUS.DA_DUYET_LDC,
      listTrangThaiXh: [STATUS.CHUA_THUC_HIEN, STATUS.DANG_THUC_HIEN],
      loaiXn: "NHAP"
    }
    let res = await this.qdGiaoNvNhapHangTrongThoiGianBaoHanhService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async openDialogSoQd() {
    let title;
    let dataTable;

    if (this.formData.value.loai === "NHAP_MAU") {
      title = "Danh sách số quyết định giao nhiệm vụ nhập mẫu không bị hủy";
      dataTable = this.listSoQuyetDinh.filter(i=>i.loai=="NHAP_MAU");
    }  else {
      title = "Danh sách số quyết định giao nhiệm vụ nhập sau bảo hành";
      dataTable = this.listSoQuyetDinh.filter(i=>i.loai=="NHAP_SAU_BH");
    }

    const modalQD = this.modal.create({
      nzTitle: title,
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: dataTable,
        dataHeader: ['Năm', 'Số quyết định', 'Ngày quyết định',],
        dataColumn: ['nam', 'soQuyetDinh', 'ngayKy',],
      },
    });

    modalQD.afterClose.subscribe(async (data) => {
      this.formData.patchValue({
        tenDiemKho: null,
        tenNhaKho: null,
        tenNganKho: null,
        tenLoKho: null,
      });
      if (data) {
         this.bindingDataQd(data.id);
         this.phieuKdcl(data);
         this.phieuKtcl(data);
      }
    });
  };


  async bindingDataQd(item, maDiaDiem?) {
    await this.spinner.show();
    let dataRes = await this.qdGiaoNvNhapHangTrongThoiGianBaoHanhService.getDetail(item)
    const data = dataRes.data;
    this.formData.patchValue({
      soCanCu: data.soQuyetDinh,
      idCanCu: data.id,
      ngayKyCanCu:data.ngayKy,
    });
    let diaDiem = data.qdGiaonvXhDtl.filter(item =>
      item.maDiaDiem.substring(0, 8) == this.userInfo.MA_DVI
    );
    this.listDiaDiemNhap = diaDiem
    await this.spinner.hide();
  }

  openDialogDdiemNhapHang() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách địa điểm xuất hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDiaDiemNhap,
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      this.bindingDataDdNhap(data);
      this.bindingSoPhieuKdcl(data);
      this.bindingSoPhieuKtcl(data);
    });
  }

  async bindingDataDdNhap(data) {
    if (data) {
      this.formData.patchValue({
        maDiaDiem: data.maDiaDiem,
        maDiemKho: data.maDiemKho,
        tenDiemKho: data.tenDiemKho,
        maNhaKho: data.maNhaKho,
        tenNhaKho: data.tenNhaKho,
        maNganKho: data.maNganKho,
        tenNganKho: data.tenNganKho,
        maLoKho: data.maLoKho,
        tenLoKho: data.tenLoKho,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        donViTinh: data.donViTinh,
        slTonKho: data.slTonKho,
        slLayMau: data.slLayMau,
      })
    }
  }

  async phieuKdcl(item) {
    let body = {
      soQdGiaoNvNh: item.soQuyetDinh,
      paggingReq: {
        "limit": this.globals.prop.MAX_INTERGER,
        "page": 0
      },
    }
    let dataRes = await this.phieuKdclVtTbTrongThoiGianBaoHanhService.search(body);
    const data = dataRes.data.content;
    this.listPhieuKdcl = data;
    await this.spinner.hide();
  }
  async bindingSoPhieuKdcl(data) {
    if (data) {
      let soPhieu=this.listPhieuKdcl.find(
        item=>item.maDiaDiem==data.maDiaDiem
      )
      if (soPhieu) {
        this.formData.patchValue({
          soPhieuKdcl: soPhieu.soPhieu,
          idPhieuKdcl: soPhieu.id,
          ngayKdcl: soPhieu.ngayKiemDinh,
          idBbLayMau : soPhieu.idBbLayMau,
          soBbLayMau: soPhieu.soBbLayMau,
        })
      }
    }
  }


  async phieuKtcl(item) {
    let body = {
      soQdGiaoNvNh: item.soQuyetDinh,
      paggingReq: {
        "limit": this.globals.prop.MAX_INTERGER,
        "page": 0
      },
    }
    let dataRes = await this.phieuKtclVtTbTrongThoiGianBaoHanhService.search(body);
    const data = dataRes.data.content;
    this.listPhieuKtcl = data;
    await this.spinner.hide();
  }

  async bindingSoPhieuKtcl(data) {
    if (data) {
      let soPhieu=this.listPhieuKtcl.find(
        item=>item.maDiaDiem==data.maDiaDiem
      )
      if (soPhieu) {
        this.formData.patchValue({
          soPhieuKdcl: soPhieu.soPhieu,
          idPhieuKdcl: soPhieu.id,
          ngayKdcl: soPhieu.ngayKiemDinh,
          idBbLayMau : soPhieu.idBbLayMau,
          soBbLayMau: soPhieu.soBbLayMau,
        })
      }
    }
  }

  async save() {
    try {
      this.formData.disable()
      let body = this.formData.value;
      body.fileDinhKems = this.fileDinhKems;
      await this.createUpdate(body);
      this.formData.enable();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e.msg);
    } finally {
      await this.spinner.hide();
    }
  }

  pheDuyet() {
    let trangThai = '';
    let msg = '';
    switch (this.formData.value.trangThai) {
      case STATUS.TU_CHOI_LDCC:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_LDCC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.DA_DUYET_LDCC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
    }
    this.approve(this.idInput, trangThai, msg);
  }

  tuChoi() {
    let trangThai = '';
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.TU_CHOI_LDCC;
        break;
      }
    }
    this.reject(this.idInput, trangThai)
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_LDCC) {
      return true
    }
    return false;
  }

  clearItemRow() {
    this.formData.patchValue({
      maSo: null,
      slThucTe: null,
    })
  }

  convertTien(tien: number): string {
    return convertTienTobangChu(tien);
  }

}
