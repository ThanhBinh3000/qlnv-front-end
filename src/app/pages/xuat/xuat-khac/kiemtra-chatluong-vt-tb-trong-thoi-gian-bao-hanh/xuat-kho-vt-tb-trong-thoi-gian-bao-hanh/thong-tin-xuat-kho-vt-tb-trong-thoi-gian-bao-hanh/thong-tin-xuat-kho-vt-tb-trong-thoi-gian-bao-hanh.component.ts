import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import dayjs from "dayjs";
import {Validators} from "@angular/forms";
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {StorageService} from "../../../../../../services/storage.service";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {STATUS} from "../../../../../../constants/status";
import {FileDinhKem} from "../../../../../../models/CuuTro";
import {MESSAGE} from "../../../../../../constants/message";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {convertTienTobangChu} from "../../../../../../shared/commonFunction";
import {
  QdGiaoNvXuatHangTrongThoiGianBaoHanhService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/QdGiaoNvXuatHangTrongThoiGianBaoHanh.service";
import {
  PhieuXuatNhapKhoVtTbTrongThoiGianBaoHanhService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/PhieuXuatNhapKhoVtTbTrongThoiGianBaoHanh.service";
import {MangLuoiKhoService} from "../../../../../../services/qlnv-kho/mangLuoiKho.service";

@Component({
  selector: 'app-thong-tin-xuat-kho-vt-tb-trong-thoi-gian-bao-hanh',
  templateUrl: './thong-tin-xuat-kho-vt-tb-trong-thoi-gian-bao-hanh.component.html',
  styleUrls: ['./thong-tin-xuat-kho-vt-tb-trong-thoi-gian-bao-hanh.component.scss']
})
export class ThongTinXuatKhoVtTbTrongThoiGianBaoHanhComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  listSoQuyetDinh: any[] = [];
  listSoQuyetDinhXh: any[] = [];
  listSoQuyetDinhXm: any[] = [];
  listSoQuyetDinhBh: any[] = [];
  listDiaDiemNhap: any[] = [];
  listPhieuKtraCl: any[] = [];
  fileDinhKems: any[] = [];
  listDiemKho: any[] = [];
  listBbLayMau: any[] = [];
  maPhieu: string;
  checked: boolean = false;
  listFileDinhKem: any = [];
  listNganLoKho: any = [];
  phieuXk: any;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private qdGiaoNvXuatHangTrongThoiGianBaoHanhService: QdGiaoNvXuatHangTrongThoiGianBaoHanhService,
    private phieuXuatKhoVtTbTrongThoiGianBaoHanhService: PhieuXuatNhapKhoVtTbTrongThoiGianBaoHanhService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuXuatKhoVtTbTrongThoiGianBaoHanhService);

    this.formData = this.fb.group(
      {
        id: [],
        namKeHoach: [dayjs().get("year")],
        maDvi: [],
        loai: ['XUAT_MAU', [Validators.required]],
        maQhns: [],
        soPhieu: [],
        ngayXuatNhap: ['', [Validators.required]],
        duNo: [],
        duCo: [],
        idCanCu: [],
        soCanCu: [],
        soLanLm: ['', [Validators.required]],
        maDiaDiem: ['', [Validators.required]],
        ngayKyCanCu: [],
        maNhaKho: [],
        maNganKho: [],
        maLoKho: [],
        slTonKho: ['', [Validators.required]],
        idPhieuKncl: [],
        soPhieuKncl: [''],
        ngayKn: [],
        loaiVthh: [],
        cloaiVthh: [],
        donViTinh: [],
        maDviTsan: [],
        namNhap: [],
        canBoLapPhieu: [],
        ldChiCuc: [],
        ktvBaoQuan: [],
        keToanTruong: [],
        hoTenNgh: [],
        cccdNgh: [],
        donViNgh: [],
        diaChiNgh: [],
        thoiGianGiaoHang: [],
        maSo: [],
        slLayMau: [],
        slThucTe: [],
        ghiChu: [],
        trangThai: [STATUS.DU_THAO],
        tenDvi: [],
        lyDoTuChoi: [],
        type: [],
        tenTrangThai: ['Dự Thảo'],
        tenLoaiVthh: [],
        tenCloaiVthh: [],
        tenDiemKho: ['', [Validators.required]],
        tenNhaKho: ['', [Validators.required]],
        tenNganKho: [''],
        tenLoKho: [''],
        fileDinhKems: [new Array<FileDinhKem>()],
        mauBiHuy: [],
        loaiPhieu: ['XUAT'],
      }
    );
    this.maPhieu = 'PXK-' + this.userInfo.DON_VI.tenVietTat;
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      await Promise.all([
        this.loadSoQuyetDinhGiaoNvXuatHang()
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
      await this.phieuXuatKhoVtTbTrongThoiGianBaoHanhService.getDetail(idInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const data = res.data;
            this.fileDinhKems = data.fileDinhKems;
            //load thông tin ngăn lô kho
            let itemQD = this.listSoQuyetDinh.find(item => item.soQuyetDinh == data.soCanCu && item.id == data.idCanCu);
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
      let id = await this.userService.getId('XH_XK_VT_BH_PHIEU_XUAT_KHO_SEQ')
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
        maQhns: this.userInfo.DON_VI.maQhns,
        canBoLapPhieu: this.userInfo.TEN_DAY_DU,
        soPhieu: `${id}/${this.formData.get('namKeHoach').value}/${this.maPhieu}`,
        ngayXuatNhap: dayjs().format('YYYY-MM-DD'),
        ngayKyCanCu: dayjs().format('YYYY-MM-DD'),
        loaiVthh: this.loaiVthh
      });
    }

  }

  quayLai() {
    this.showListEvent.emit();
  }

  async loadSoQuyetDinhGiaoNvXuatHang() {
    let body = {
      trangThai: STATUS.DA_DUYET_LDC,
      dvql: this.userInfo.MA_DVI.substring(0, this.userInfo.MA_DVI.length - 2),
      nam: this.formData.get("namKeHoach").value,
      loaiXn: "XUAT",
      listTrangThaiXh: [STATUS.CHUA_THUC_HIEN, STATUS.DANG_THUC_HIEN],
    }
    let res = await this.qdGiaoNvXuatHangTrongThoiGianBaoHanhService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
      this.listSoQuyetDinhXh = this.listSoQuyetDinh.filter(i => i.loai == "XUAT_HUY");
      this.listSoQuyetDinhXm = this.listSoQuyetDinh.filter(i => i.loai == "XUAT_MAU");
      this.listSoQuyetDinhBh = this.listSoQuyetDinh.filter(i => i.loai == "XUAT_BH");
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async openDialogSoQd() {
    let title;
    let dataTable;

    if (this.formData.value.loai === "XUAT_MAU") {
      title = "Danh sách số quyết định giao nhiệm vụ xuất hàng lấy mẫu";
      dataTable = this.listSoQuyetDinhXm;
    } else if (this.formData.value.loai === "XUAT_HUY") {
      title = "Danh sách số quyết định giao nhiệm vụ xuất hàng bị hủy";
      dataTable = this.listSoQuyetDinhXh;
    } else {
      title = "Danh sách số quyết định giao nhiệm vụ xuất để bảo hành";
      dataTable = this.listSoQuyetDinhBh;
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
        maDiaDiem: null,
        slTonKho: null,
        tenNhaKho: null,
        tenDiemKho: null,
        tenLoaiVthh: null,
        loaiVthh: null,
        cloaiVthh: null,
        tenCloaiVthh: null,
        donViTinh: null,
        slLayMau: null,
      })
      if (data) {
        await this.bindingDataQd(data);
      }
    });
  }


  async bindingDataQd(data) {
    try {
      await this.spinner.show();
      this.listNganLoKho = data.qdGiaonvXhDtl.filter(i => i.maDiaDiem.substring(0, 8) == this.formData.value.maDvi);
      this.formData.patchValue({
        soCanCu: data.soQuyetDinh,
        idCanCu: data.id,
        ngayKyCanCu: data.thoiHanXuatHang,
        soLanLm: this.formData.value.loai == "XUAT_MAU" ? data.soLanLm : null,
      });
      await this.listPheuXk(data)
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e.msg);
    } finally {
      await this.spinner.hide();
    }
  }

  async listPheuXk(item) {
    await this.spinner.show();
    let body = {
      soCanCu: item.soQuyetDinh,
      soLanLm: this.formData.value.loai == "XUAT_MAU" ? item.soLanLm : null
    }
    let res = await this.phieuXuatKhoVtTbTrongThoiGianBaoHanhService.search(body)
    const data = res.data;
    this.phieuXk = data.content;
    let diemKho = [
      ...this.listNganLoKho.filter((e) => {
        return !this.phieuXk.some((bb) => {
          return e.maDiaDiem === bb.maDiaDiem;
        });
      }),
    ];
    this.listNganLoKho = diemKho;
  }

  async changeValueNganLoKho($event) {
    if ($event) {
      let item = this.listNganLoKho.find(it => it.maDiaDiem == $event);
      if (item) {
        this.formData.patchValue({
          slTonKho: item.slTonKho,
          tenNhaKho: item.tenNhaKho,
          tenDiemKho: item.tenDiemKho,
          tenLoaiVthh: item.tenLoaiVthh,
          loaiVthh: item.loaiVthh,
          cloaiVthh: item.cloaiVthh,
          namNhap: item.namNhap,
          tenCloaiVthh: item.tenCloaiVthh,
          donViTinh: item.donViTinh,
          maDviTsan: item.maDviTsan,
          slLayMau: item.slLayMau,
        })
      }
    }
  }


  // openDialogDdiemNhapHang() {
  //   const modalQD = this.modal.create({
  //     nzTitle: 'Danh sách địa điểm xuất hàng',
  //     nzContent: DialogTableSelectionComponent,
  //     nzMaskClosable: false,
  //     nzClosable: false,
  //     nzWidth: '900px',
  //     nzFooter: null,
  //     nzComponentParams: {
  //       dataTable: this.listDiaDiemNhap,
  //       dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho'],
  //       dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho']
  //     },
  //   });
  //   modalQD.afterClose.subscribe(async (data) => {
  //     this.bindingDataDdNhap(data);
  //   });
  // }

  // async bindingDataDdNhap(data) {
  //   if (data) {
  //     this.formData.patchValue({
  //       maDiemKho: data.maDiemKho,
  //       tenDiemKho: data.tenDiemKho,
  //       maNhaKho: data.maNhaKho,
  //       tenNhaKho: data.tenNhaKho,
  //       maNganKho: data.maNganKho,
  //       tenNganKho: data.tenNganKho,
  //       maLoKho: data.maLoKho,
  //       tenLoKho: data.tenLoKho,
  //     })
  //     let body = {
  //       trangThai: STATUS.DA_DUYET_LDC,
  //       loaiVthh: this.loaiVthh
  //     }
  //     let res = await this.phieuKiemNghiemChatLuongService.search(body)
  //     const list = res.data.content;
  //     this.listPhieuKtraCl = list.filter(item => (item.maDiemKho == data.maDiemKho));
  //   }
  // }

  openDialogPhieuKnCl() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách phiếu kiểm nghiệm chất lượng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listPhieuKtraCl,
        dataHeader: ['Số phiếu', 'Ngày giám định'],
        dataColumn: ['soPhieu', 'ngayKnMau']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          idPhieuKnCl: data.id,
          soPhieuKnCl: data.soPhieu,
          ktvBaoQuan: data.nguoiKn,
          ngayKn: data.ngayKnMau,
          loaiVthh: data.loaiVthh,
          cloaiVthh: data.cloaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          moTaHangHoa: data.moTaHangHoa,
        });
      }
    });
  }

  async save() {
    this.spinner.show();
    this.formData.disable({emitEvent: false});
    try {
      let body = this.formData.value;
      body.fileDinhKems = this.fileDinhKems;
      console.log(body, 'bodybody');
      await this.createUpdate(body);
      this.formData.enable({emitEvent: false});
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
