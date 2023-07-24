import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DanhMucService} from "../../../../../../../../services/danhmuc.service";
import {
  QuyetDinhGiaoNvXuatHangService
} from "../../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/QuyetDinhGiaoNvXuatHang.service";
import {
  PhieuXuatNhapKhoService
} from "../../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/PhieuXuatNhapKho.service";
import dayjs from "dayjs";
import {Validators} from "@angular/forms";
import {STATUS} from "../../../../../../../../constants/status";
import {FileDinhKem} from "../../../../../../../../models/FileDinhKem";
import {MESSAGE} from "../../../../../../../../constants/message";
import {
  DialogTableSelectionComponent
} from "../../../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {convertTienTobangChu} from "../../../../../../../../shared/commonFunction";
import {
  BckqKiemDinhMauService
} from "../../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/BckqKiemDinhMau.service";

@Component({
  selector: 'app-thong-tin-phieu-nhap-kho',
  templateUrl: './thong-tin-phieu-nhap-kho.component.html',
  styleUrls: ['./thong-tin-phieu-nhap-kho.component.scss']
})
export class ThongTinPhieuNhapKhoComponent extends Base2Component implements OnInit {

  @Input() soBcKqkdMau: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  listSoBcKqkdMau: any[] = []
  listDiaDiemNhap: any[] = [];
  listPhieuKtraCl: any[] = [];
  fileDinhKems: any[] = [];
  listDiemKho: any[] = [];
  listBbLayMau: any[] = [];
  maPhieu: string;
  checked: boolean = false;
  listFileDinhKem: any = [];
  listNganLoKho: any = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quyetDinhGiaoNvXuatHangService: QuyetDinhGiaoNvXuatHangService,
    private bckqKiemDinhMauService: BckqKiemDinhMauService,
    private phieuXuatNhapKhoService: PhieuXuatNhapKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuXuatNhapKhoService);

    this.formData = this.fb.group(
      {
        id: [0],
        namKeHoach: [dayjs().get("year")],
        maDvi: [],
        loai: ['NHAP_MAU', [Validators.required]],
        maQhns: [],
        soPhieu: [],
        ngayXuatNhap: ['', [Validators.required]],
        taiKhoanNo: [],
        taiKhoanCo: [],
        idCanCu: [],
        soCanCu: [],
        maDiaDiem: [],
        ngayQdGiaoNvXh: [],
        maNhaKho: [],
        maNganKho: [],
        maLoKho: [],
        slTonKho: [],
        idPhieuKncl: [],
        soPhieuKncl: [''],
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
        tenNganKho: ['', [Validators.required]],
        tenLoKho: [],
        fileDinhKems: [new Array<FileDinhKem>()],
        loaiPhieu: ['NHAP', [Validators.required]],
      }
    );
    this.maPhieu = 'PNK-' + this.userInfo.DON_VI.tenVietTat;
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      await Promise.all([
        this.loadSoBaoCaoKqKdMau()
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
      await this.phieuXuatNhapKhoService.getDetail(idInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const data = res.data;
            this.fileDinhKems = data.fileDinhKems;
            //load thông tin ngăn lô kho
            let itemQD = this.listSoBcKqkdMau.find(item => item.soBaoCao == data.soCanCu && item.id == data.idCanCu);
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
      let id = await this.userService.getId('XH_XK_VT_PHIEU_XUAT_KHO_SEQ')
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
        let dataQdGiaoNvXh = this.listSoBcKqkdMau.find(item => item.soQuyetDinh == this.soBcKqkdMau);
        if (dataQdGiaoNvXh) {
          this.bindingDataQd(dataQdGiaoNvXh);
        }
      }
    }

  }

  quayLai() {
    this.showListEvent.emit();
  }

  async loadSoBaoCaoKqKdMau() {
    let body = {
      trangThai: STATUS.DA_DUYET_LDC,
      dvql: this.userInfo.MA_DVI.substring(0, this.userInfo.MA_DVI.length - 2),
      nam: this.formData.get("namKeHoach").value,
    }
    let res = await this.bckqKiemDinhMauService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      console.log(res.data, 'res.datares.datares.data');
      let data = res.data;
      this.listSoBcKqkdMau = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async openDialogSoQd() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định kế hoạch giao nhiệm vụ xuất hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoBcKqkdMau,
        dataHeader: ['Số báo cáo', 'Ngày báo cáo', 'Năm'],
        dataColumn: ['soBaoCao', 'ngayBaoCao', 'nam'],
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.bindingDataQd(data);
      }
    });
  };

  async bindingDataQd(data) {
    try {
      await this.spinner.show();
      if (data) {
        let res = await this.phieuXuatNhapKhoService.search({
          soBcKqkdMau: data.soBcKqkdMau,
          namKeHoach: this.formData.get("namKeHoach").value,
          loaiPhieu: 'XUAT',
          loai: 'XUAT_MAU',
        });
        if (res.msg == MESSAGE.SUCCESS) {
          this.listNganLoKho = res.data.content;
        }
        this.formData.patchValue({
          soCanCu: data.soBaoCao,
          idCanCu: data.id,
        });
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e.msg);
    } finally {
      await this.spinner.hide();
    }
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
          soPhieuKncl: item.soPhieuKncl,
          idPhieuKncl: item.idPhieuKncl,
          tenCloaiVthh: item.tenCloaiVthh,
          donViTinh: item.donViTinh,
          slLayMau: item.slThucTe
        })
      }
    }
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
      // this.bindingDataDdNhap(data);
    });
  }

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
      slLayMau: null,
      slThucTe: null,
    })
  }

  convertTien(tien: number): string {
    return convertTienTobangChu(tien);
  }

}
