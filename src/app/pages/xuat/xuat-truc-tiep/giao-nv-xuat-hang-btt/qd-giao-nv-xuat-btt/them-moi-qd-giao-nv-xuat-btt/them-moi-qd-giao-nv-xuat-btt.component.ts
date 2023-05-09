import { Component, Input, OnInit, } from '@angular/core';
import { Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  DialogTableSelectionComponent
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { MESSAGE } from 'src/app/constants/message';
import { FileDinhKem } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { STATUS } from 'src/app/constants/status';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { QuyetDinhNvXuatBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/quyet-dinh-nv-xuat-btt/quyet-dinh-nv-xuat-btt.service';
import { QuyetDinhPdKhBanTrucTiepService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/quyet-dinh-pd-kh-ban-truc-tiep.service';
import { HopDongBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/hop-dong-btt.service';
import { QdPdKetQuaBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/qd-pd-ket-qua-btt.service';

@Component({
  selector: 'app-them-moi-qd-giao-nv-xuat-btt',
  templateUrl: './them-moi-qd-giao-nv-xuat-btt.component.html',
  styleUrls: ['./them-moi-qd-giao-nv-xuat-btt.component.scss']
})
export class ThemMoiQdGiaoNvXuatBttComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string
  @Input() idInput: number = 0;
  @Input() isViewOnModal: boolean;
  maQd: string = null;

  radioValue: string = 'HD';

  fileDinhKems: any[] = []

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hopDongBttService: HopDongBttService,
    private quyetDinhPdKhBanTrucTiepService: QuyetDinhPdKhBanTrucTiepService,
    private qdPdKetQuaBttService: QdPdKetQuaBttService,
    private quyetDinhNvXuatBttService: QuyetDinhNvXuatBttService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhNvXuatBttService);
    this.formData = this.fb.group({
      id: [],
      maDvi: [''],
      tenDvi: [''],
      namKh: [dayjs().get('year')],
      soQdNv: ['',],
      ngayTao: [dayjs().format('YYYY-MM-DD')],
      idHd: [],
      soHd: [''],
      idQdPd: [],
      soQdPd: [''],
      maDviTsan: [''],
      tenTccn: ['',],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      loaiHinhNx: [''],
      kieuNx: [''],
      soLuongBanTrucTiep: [],
      donViTinh: [''],
      tgianGnhan: [''],
      trichYeu: [''],
      trangThaiXh: [''],
      tenTrangThaiXh: [''],
      phanLoai: ['HD', [Validators.required]],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      lyDoTuChoi: [''],
      // listMaDviTsan: [''],

    })
  }

  setValidator(isGuiDuyet?) {
    if (isGuiDuyet) {
      this.formData.controls["soQdNv"].setValidators([Validators.required]);
    } else {
      this.formData.controls["soQdNv"].clearValidators();
    }
    if (this.radioValue == 'HD' && isGuiDuyet) {
      this.formData.controls["idHd"].setValidators([Validators.required]);
      this.formData.controls["soHd"].setValidators([Validators.required]);
      this.formData.controls["idQdPd"].clearValidators();
      this.formData.controls["soQdPd"].clearValidators();
    }
    if (this.radioValue == 'QDDX' && isGuiDuyet) {
      this.formData.controls["idHd"].clearValidators();
      this.formData.controls["soHd"].clearValidators();
      this.formData.controls["idQdPd"].setValidators([Validators.required]);
      this.formData.controls["soQdPd"].setValidators([Validators.required]);
    }
  }

  deleteSelect() {
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.maQd = this.userInfo.MA_QD;
      await Promise.all([
      ]);
      if (this.idInput) {
        await this.loadChiTiet(this.idInput);
      } else {
        this.initForm();
      }
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  initForm() {
    this.formData.patchValue({
      namKh: dayjs().get('year'),
      tenDvi: this.userInfo.TEN_DVI,
      maDvi: this.userInfo.MA_DVI,
    })
  }

  async openDialogSoHopDong() {
    this.spinner.show();
    let dsHd = []
    await this.hopDongBttService.search({
      trangThai: STATUS.DA_KY,
      maDvi: this.formData.value.maDvi,
      namHd: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
    }
    ).then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        if (data && data.content && data.content.length > 0) {
          dsHd = data.content;
        }
      }
    });
    this.spinner.hide();
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách căn cứ trên hợp đồng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: dsHd,
        dataHeader: ['Số hợp đồng', 'Tên hợp đồng', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soHd', 'tenHd', 'tenLoaiVthh', 'tenCloaiVthh']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        // this.onChangeHd(data.id);
      }
    });
  }

  // async onChangeHd(id) {
  //   await this.hopDongBttService.getDetail(id).then(res => {
  //     if (res.msg == MESSAGE.SUCCESS) {
  //       if (res.data) {
  //         const data = res.data;
  //         let resQdKq = await this.qdPdKetQuaBttService.getDtlDetail(dataKq.idPdKhDtl);

  //         this.formData.patchValue({
  //           idHd: data.id,
  //           soHd: data.soHd,
  //           maDviTsan: data.maDviTsan,
  //           tenTccn: data.tenDviMua,
  //           loaiVthh: data.loaiVthh,
  //           tenLoaiVthh: data.tenLoaiVthh,
  //           cloaiVthh: data.cloaiVthh,
  //           tenCloaiVthh: data.tenCloaiVthh,
  //           moTaHangHoa: data.moTaHangHoa,
  //           soLuongBanTrucTiep: data.soLuongBanTrucTiep,
  //           donViTinh: data.donViTinh,
  //         })
  //         this.dataTable = data.children;
  //       }
  //     } else {
  //       this.notification.error(MESSAGE.ERROR, res.msg);
  //     }
  //     this.spinner.hide();
  //   })
  // }

  async save(isGuiDuyet?) {
    this.setValidator(isGuiDuyet);
    let body = this.formData.value;
    if (this.formData.value.soQd) {
      body.soQd = this.formData.value.soQd + "/" + this.maQd;
    }
    body.children = this.dataTable;
    body.phanLoai = this.radioValue
    body.fileDinhKems = this.fileDinhKems;
    body.fileDinhKem = this.fileDinhKem;
    let data = await this.createUpdate(body);
    if (data) {
      if (isGuiDuyet) {
        this.idInput = data.id;
        this.pheDuyet();
      } else {
        // this.goBack()
      }
    }
  }

  pheDuyet() {
    let trangThai = '';
    let msg = '';
    switch (this.formData.value.trangThai) {
      case STATUS.TU_CHOI_TP:
      case STATUS.TU_CHOI_LDC:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_TP;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.CHO_DUYET_LDC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        msg = MESSAGE.BAN_HANH_CONFIRM;
        trangThai = STATUS.BAN_HANH;
        break;
      }
    }
    this.approve(this.idInput, trangThai, msg);
  }

  tuChoi() {
    let trangThai = '';
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.TU_CHOI_TP;
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.TU_CHOI_LDC;
        break;
      }
    }
    this.reject(this.idInput, trangThai)
  }

  async loadChiTiet(id: number) {
    if (id > 0) {
      let data = await this.detail(id);
      this.formData.patchValue({
        soQd: data.soQd?.split('/')[0],
        thoiGianDuKien: (data.tgianGnhanTu && data.tgianGnhanDen) ? [data.tgianGnhanTu, data.tgianGnhanDen] : null
      })
      this.dataTable = data.children;
      this.fileDinhKem = data.fileDinhKem;
      this.fileDinhKems = data.fileDinhKems;
      if (data.phanLoai) {
        this.radioValue = data.phanLoai
      }
    };
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.BAN_HANH || trangThai == STATUS.CHO_DUYET_TP || trangThai == STATUS.CHO_DUYET_LDC) {
      return true
    }
    return false;
  }

  isDisabledQD() {
    if (this.formData.value.id == null) {
      return false
    } else {
      return true;
    }
  }

  calcTong(column) {
    if (this.dataTable) {
      const sum = this.dataTable.reduce((prev, cur) => {
        prev += cur[column];
        return prev;
      }, 0);
      return sum;
    }
  }
}
