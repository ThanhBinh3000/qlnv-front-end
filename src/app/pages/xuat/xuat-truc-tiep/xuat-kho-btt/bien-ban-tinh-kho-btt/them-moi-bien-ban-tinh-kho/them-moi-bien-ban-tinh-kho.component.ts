import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { convertTienTobangChu } from 'src/app/shared/commonFunction';
import { Validators } from "@angular/forms";
import { STATUS } from "../../../../../../constants/status";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { QuyetDinhNvXuatBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/quyet-dinh-nv-xuat-btt/quyet-dinh-nv-xuat-btt.service';
import { BienBanTinhKhoBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/xuat-kho-btt/bien-ban-tinh-kho-btt.service';
import { FileDinhKem } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';

@Component({
  selector: 'app-them-moi-bien-ban-tinh-kho',
  templateUrl: './them-moi-bien-ban-tinh-kho.component.html',
  styleUrls: ['./them-moi-bien-ban-tinh-kho.component.scss']
})
export class ThemMoiBienBanTinhKhoComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() loaiVthh: string;
  @Input() isView: boolean;
  @Input() idQdGiaoNvXh: number;

  @Output()
  showListEvent = new EventEmitter<any>();

  listSoQuyetDinh: any[] = []
  listDiaDiemNhap: any[] = [];
  listPhieuKtraCl: any[] = [];
  listDiemNhap: any[] = [];

  taiLieuDinhKemList: any[] = [];
  dataTable: any[] = [];
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bienBanTinhKhoBttService: BienBanTinhKhoBttService,
    private quyetDinhNvXuatBttService: QuyetDinhNvXuatBttService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanTinhKhoBttService);
    this.formData = this.fb.group({
      id: [],
      namKh: [dayjs().get('year')],
      maDvi: ['', [Validators.required]],
      tenDvi: ['', [Validators.required]],
      maQhns: ['',],

      soBbTinhKho: [],
      ngayTao: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
      idQd: [],
      soQd: [],

      idHd: [],
      soHd: [''],

      ngayKyHd: ['', [Validators.required]],
      maDiemKho: ['', [Validators.required]],
      tenDiemKho: ['', [Validators.required]],
      maNhaKho: ['', [Validators.required]],
      tenNhaKho: ['', [Validators.required]],
      maNganKho: ['', [Validators.required]],
      tenNganKho: ['', [Validators.required]],
      maLoKho: [''],
      tenLoKho: [''],
      ngayBdauXuat: [],
      ngayKthucXuat: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
      tongSlNhap: [],
      tongSlXuat: [],
      slConLai: [],
      slThucTe: [],
      slChenhLech: [],
      nguyenNhan: [''],
      kienNghi: [''],
      ghiChu: [''],
      idThuKho: [],
      tenThuKho: [''],
      idKtv: [],
      tenKtv: [''],
      idKeToan: [],
      tenKeToan: [''],
      tenNguoiPduyet: [''],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự Thảo'],
      lyDoTuChoi: [],
      fileName: [],
    })
  }

  async ngOnInit() {
    try {
      this.userInfo = this.userService.getUserLogin();
      if (this.id) {
        await this.loadChiTiet();
      } else {
        await this.initForm();
      }
      await this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async initForm() {
    let id = await this.userService.getId('XH_BB_TINHK_BTT_HDR_SEQ')
    this.formData.patchValue({
      soBbTinhKho: `${id}/${this.formData.get('namKh').value}/PNK-CCDTVP`,
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
      tenThuKho: this.userInfo.TEN_DAY_DU
    });
    if (this.idQdGiaoNvXh) {
      await this.bindingDataQd(this.idQdGiaoNvXh);
    }
  }

  async openDialogSoQdNvXh() {
    let dataQdNvXh = [];
    let body = {
      namKh: dayjs().get('year'),
      loaiVthh: this.loaiVthh,
      trangThai: this.STATUS.BAN_HANH,
      maChiCuc: this.userInfo.MA_DVI
    }
    let res = await this.quyetDinhNvXuatBttService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      dataQdNvXh = res.data?.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định kế hoạch giao nhiệm vụ nhập hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: dataQdNvXh,
        dataHeader: ['Số quyết định', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soQd', 'tenLoaiVthh', 'tenCloaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        await this.bindingDataQd(dataChose.id);
      }
    });
  };

  async bindingDataQd(id) {
    await this.spinner.show();
    let dataRes = await this.quyetDinhNvXuatBttService.getDetail(id)
    const data = dataRes.data;
    this.formData.patchValue({
      idQd: data.id,
      soQd: data.soQd,
      idHd: data.idHd,
      soHd: data.soHd,
      ngayKyHd: data.ngayHd,
    });
    let dataChiCuc = data.children.filter(item => item.maDvi == this.userInfo.MA_DVI);
    if (dataChiCuc) {
      dataChiCuc.forEach(e => {
        this.listDiaDiemNhap = [...this.listDiaDiemNhap, e.children];
      });
      this.listDiaDiemNhap = this.listDiaDiemNhap.flat();
    }
    await this.spinner.hide();
  }


  openDialogDdiemNhapHang() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách địa điểm nhập hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDiaDiemNhap,
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho', 'So Lượng'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho', 'soLuong']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      console.log(data, 999);

      if (data) {
        this.formData.patchValue({
          maDiemKho: data.maDiemKho,
          tenDiemKho: data.tenDiemKho,
          maNhaKho: data.maNhaKho,
          tenNhaKho: data.tenNhaKho,
          maNganKho: data.maNganKho,
          tenNganKho: data.tenNganKho,
          maLoKho: data.maLoKho,
          tenLoKho: data.tenLoKho,
          ngayBdauXuat: data.xkhoBttList[0].ngayXuatKho,
        });
        this.dataTable = data.xkhoBttList;
        this.formData.patchValue({
          tongSlXuat: this.calcTong('soLuongThucXuat')
        })
      }
    });
  }

  calcTong(columnName) {
    if (this.dataTable) {
      const sum = this.dataTable.reduce((prev, cur) => {
        prev += cur[columnName];
        return prev;
      }, 0);
      return sum;
    }
  }

  async save(isGuiDuyet?: boolean) {
    if (this.dataTable.length == 0) {
      this.notification.error(
        MESSAGE.ERROR,
        'Hiện chưa có thông tin bảng kê cân hàng và phiếu nhập kho',
      );
      return;
    }
    let body = this.formData.value;
    body.fileDinhKems = this.fileDinhKem;
    body.children = this.dataTable;
    let data = await this.createUpdate(body);
    if (data) {
      if (isGuiDuyet) {
        this.id = data.id
        this.pheDuyet(true);
      } else {
        this.goBack();
      }
    }
  }

  async loadChiTiet() {
    let data = await this.detail(this.id);
    if (data) {
      this.dataTable = data.children
      this.fileDinhKem = data.fileDinhKems;
    }
  }

  convertTien(tien: number): string {
    return convertTienTobangChu(tien);
  }

  pheDuyet(isPheDuyet) {
    let trangThai = '';
    let msg = '';
    if (isPheDuyet) {
      switch (this.formData.value.trangThai) {
        case STATUS.TU_CHOI_LDCC:
        case STATUS.TU_CHOI_KT:
        case STATUS.TU_CHOI_KTVBQ:
        case STATUS.DU_THAO: {
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
      this.approve(this.id, trangThai, msg)
    } else {
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
      this.reject(this.id, trangThai)
    }
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_KTVBQ || trangThai == STATUS.CHO_DUYET_KT || trangThai == STATUS.CHO_DUYET_LDCC || trangThai == STATUS.DA_DUYET_LDCC) {
      return true;
    } else {
      return false;
    }
  }

  getNameFileQD($event: any) {
    if ($event.target.files) {
      const itemFile = {
        name: $event.target.files[0].name,
        file: $event.target.files[0] as File,
      };
      this.uploadFileService
        .uploadFile(itemFile.file, itemFile.name)
        .then((resUpload) => {
          let fileDinhKemQd = new FileDinhKem();
          fileDinhKemQd.fileName = resUpload.filename;
          fileDinhKemQd.fileSize = resUpload.size;
          fileDinhKemQd.fileUrl = resUpload.url;
          fileDinhKemQd.idVirtual = new Date().getTime();
          this.formData.patchValue({ fileDinhKem: fileDinhKemQd, fileName: itemFile.name })
        });
    }
  }
}
