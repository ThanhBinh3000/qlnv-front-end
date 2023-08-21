import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";

import dayjs from "dayjs";
import {Validators} from "@angular/forms";
import {Base2Component} from "../../../../../../../components/base2/base2.component";
import {StorageService} from "../../../../../../../services/storage.service";
import {DanhMucService} from "../../../../../../../services/danhmuc.service";
import {
  BckqKiemDinhMauService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/BckqKiemDinhMau.service";
import {STATUS} from "../../../../../../../constants/status";
import {FileDinhKem} from "../../../../../../../models/FileDinhKem";
import {MESSAGE} from "../../../../../../../constants/message";
import {
  DialogTableSelectionComponent
} from "../../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {convertTienTobangChu} from "../../../../../../../shared/commonFunction";
import {
  BienBanKetThucNhapKhoBaoHanhService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/BienBanKetThucNhapKhoBaoHanh.service";
import {
  QdGiaoNvNhapHangTrongThoiGianBaoHanhService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/QdGiaoNvNhapHangTrongThoiGianBaoHanh.service";
import {
  PhieuXuatNhapKhoVtTbTrongThoiGianBaoHanhService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/PhieuXuatNhapKhoVtTbTrongThoiGianBaoHanh.service";


@Component({
  selector: 'app-thong-tin-bien-ban-ket-thuc-nhap-kho-bao-hanh',
  templateUrl: './thong-tin-bien-ban-ket-thuc-nhap-kho-bao-hanh.component.html',
  styleUrls: ['./thong-tin-bien-ban-ket-thuc-nhap-kho-bao-hanh.component.scss']
})
export class ThongTinBienBanKetThucNhapKhoBaoHanhComponent extends Base2Component implements OnInit {

  @Input() soBcKqkdMau: string;
  @Input() nganLoKho: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  listSoQuyetDinh: any[] = []
  listDiaDiemNhap: any[] = [];
  listPhieuKtraCl: any[] = [];
  fileDinhKems: any[] = [];
  listDiemKho: any[] = [];
  listBbLayMau: any[] = [];
  maPhieu: string;
  checked: boolean = false;
  listFileDinhKem: any = [];
  listNganLoKho: any = [];
  dataPhieuNhapKho: any = [];
  listPhieuNhapKho: any = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private qdGiaoNvNhapHangTrongThoiGianBaoHanhService: QdGiaoNvNhapHangTrongThoiGianBaoHanhService,
    private bckqKiemDinhMauService: BckqKiemDinhMauService,
    private phieuXuatNhapKhoVtTbTrongThoiGianBaoHanhService: PhieuXuatNhapKhoVtTbTrongThoiGianBaoHanhService,
    private bienBanKetThucNhapKhoBaoHanhService: BienBanKetThucNhapKhoBaoHanhService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanKetThucNhapKhoBaoHanhService);

    this.formData = this.fb.group(
      {
        id: [0],
        namKeHoach: [dayjs().get("year")],
        maDvi: [],
        maQhns: [],
        soBienBan: [],
        ngayLapBienBan: [dayjs().format("YYYY-MM-DD"), [Validators.required]],
        idCanCu: [null, [Validators.required]],
        soCanCu: [null, [Validators.required]],
        maDiaDiem: [null, [Validators.required]],
        maNhaKho: [],
        maNganKho: [],
        maLoKho: [],
        loaiVthh: [],
        cloaiVthh: [],
        canBoLapBb: [],
        ldChiCuc: [],
        keToanTruong: [],
        ktvBaoQuan: [],
        ngayKetThucNhap: [dayjs().format("YYYY-MM-DD"), [Validators.required]],
        ngayBatDauNhap: [],
        ngayHetHanLuuKho: [],
        ghiChu: ['', [Validators.required]],
        trangThai: [STATUS.DU_THAO],
        tenDvi: [],
        lyDoTuChoi: [],
        type: [],
        tenTrangThai: ['Dự Thảo'],
        tenLoaiVthh: [],
        tenCloaiVthh: [],
        tenDiemKho: [],
        tenNhaKho: [],
        tenNganKho: [],
        tenLoKho: [],
        soBbLayMau: [],
        idBbLayMau: [],
        fileDinhKems: [new Array<FileDinhKem>()],
        listPhieuNhapKho: [new Array()],
      }
    );
    this.maPhieu = 'BBKTNK-' + this.userInfo.DON_VI.tenVietTat;
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
      await this.bienBanKetThucNhapKhoBaoHanhService.getDetail(idInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const data = res.data;
            this.fileDinhKems = data.fileDinhKems;
            //load thông tin ngăn lô kho
            // let itemBcKqKdMau = this.listSoQuyetDinh.find(item => item.soBaoCao == data.soCanCu && item.id == data.idCanCu);
            // if (itemBcKqKdMau) {
            //   this.bindingDataQd(itemBcKqKdMau, data.maDiaDiem);
            // }
            this.listPhieuNhapKho = data.listPhieuNhapKho;
            this.formData.patchValue(data);
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      let id = await this.userService.getId('XH_XK_VT_BH_BB_KT_NHAP_KHO_SEQ')
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
        maQhns: this.userInfo.DON_VI.maQhns,
        canBoLapBb: this.userInfo.TEN_DAY_DU,
        soBienBan: `${id}/${this.formData.get('namKeHoach').value}/${this.maPhieu}`,
      });
      // if (this.soBcKqkdMau) {
      //   let dataBcKqKdm = this.listSoQuyetDinh.find(item => item.soBaoCao == this.soBcKqkdMau);
      //   if (dataBcKqKdm) {
      //     this.bindingDataQd(dataBcKqKdm);
      //     this.bindingDataPhieuNhapKho(dataBcKqKdm);
      //   }
      // }
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
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định giao nhiệm vụ nhập hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoQuyetDinh,
        dataHeader: ['Năm', 'Số quyết định', 'Ngày quyết định',],
        dataColumn: ['nam', 'soQuyetDinh', 'ngayKy',],
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.bindingDataQd(data);
        await this.loadPhieuNhapKho(data);
      }
    });
  };

  async bindingDataQd(item, maDiaDiem?) {
    await this.spinner.show();
    let dataRes = await this.qdGiaoNvNhapHangTrongThoiGianBaoHanhService.getDetail(item.id)
    const data = dataRes.data;
    this.formData.patchValue({
      soCanCu: data.soQuyetDinh,
      idCanCu: data.id,
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
    });
  }

  async bindingDataDdNhap(data) {
    if (data) {
      console.log(1)
      this.listPhieuNhapKho = this.dataPhieuNhapKho.filter(f=>f.maDiaDiem==data.maDiaDiem);
      this.formData.patchValue({
        maDiaDiem: data.maDiaDiem,
        tenDiemKho: data.tenDiemKho,
        tenNhaKho: data.tenNhaKho,
        tenNganKho: data.tenNganKho,
        tenLoKho: data.tenLoKho,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        donViTinh: data.donViTinh,
        slTonKho: data.slTonKho,
        slLayMau: data.slLayMau,

        listPhieuNhapKho: this.listPhieuNhapKho,
        ngayBatDauNhap: this.listPhieuNhapKho[0].ngayXuatNhap,
        ngayKetThucNhap: this.formData.get("ngayLapBienBan").value
      })
    }
  }


  async loadPhieuNhapKho(data, maDiaDiem?) {
    try {
      await this.spinner.show();
      if (data) {
        let res = await this.phieuXuatNhapKhoVtTbTrongThoiGianBaoHanhService.search({
          idCanCu: data.id,
          soCanCu: data.soQuyetDinh,
          namKeHoach: this.formData.get("namKeHoach").value,
          loaiPhieu: 'NHAP',
        });
        if (res.msg == MESSAGE.SUCCESS) {
          this.dataPhieuNhapKho = res.data.content;
        }
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e.msg);
    } finally {
      await this.spinner.hide();
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
      case STATUS.DU_THAO:
      case STATUS.TU_CHOI_KT:
      case STATUS.TU_CHOI_KTVBQ:
      case STATUS.TU_CHOI_LDCC: {
        trangThai = STATUS.CHO_DUYET_KTVBQ;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
      case STATUS.CHO_DUYET_KTVBQ: {
        trangThai = STATUS.CHO_DUYET_KT;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
      case STATUS.CHO_DUYET_KT: {
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
      case STATUS.CHO_DUYET_KT: {
        trangThai = STATUS.TU_CHOI_KT;
        break;
      }
      case STATUS.CHO_DUYET_KTVBQ: {
        trangThai = STATUS.TU_CHOI_KTVBQ;
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
      slLayMau: null,
      slThucTe: null,
    })
  }

  convertTien(tien: number): string {
    return convertTienTobangChu(tien);
  }

}
