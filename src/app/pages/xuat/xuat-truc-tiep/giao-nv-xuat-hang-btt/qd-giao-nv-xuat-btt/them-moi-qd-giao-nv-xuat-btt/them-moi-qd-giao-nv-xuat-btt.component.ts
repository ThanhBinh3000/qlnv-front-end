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
  dataInput: any;
  dataInputCache: any;
  radioValue: string = 'HD';
  listDviTsan: any[] = [];
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
      id: [null],
      namKh: [dayjs().get('year')],
      soQd: ['',],
      ngayTao: [dayjs().format('YYYY-MM-DD')],
      maDvi: [''],
      tenDvi: [''],
      ngayKy: ['',],
      idHd: [],
      soHd: [''],
      ngayHd: [],
      idQdPdKh: [],
      soQdPd: [''],
      maDviTsan: [''],
      tenTtcn: ['',],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      soLuong: [],
      donGia: [],
      donViTinh: [''],
      tgianGnhan: [''],
      thoiGianDuKien: [''],
      trichYeu: [''],
      trangThaiXh: [''],
      tenTrangThaiXh: [''],
      phanLoai: ['HD', [Validators.required]],
      idQdKqCg: [],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      fileName: [],
      listMaDviTsan: [],
      lyDoTuChoi: []
    })
  }

  setValidator(isGuiDuyet?) {
    if (isGuiDuyet) {
      this.formData.controls["soQd"].setValidators([Validators.required]);
    } else {
      this.formData.controls["soQd"].clearValidators();
    }
    if (this.radioValue == 'HD' && isGuiDuyet) {
      this.formData.controls["idHd"].setValidators([Validators.required]);
      this.formData.controls["soHd"].setValidators([Validators.required]);
      this.formData.controls["idQdPdKh"].clearValidators();
      this.formData.controls["soQdPd"].clearValidators();
    }
    if (this.radioValue == 'QDDX' && isGuiDuyet) {
      this.formData.controls["idHd"].clearValidators();
      this.formData.controls["soHd"].clearValidators();
      this.formData.controls["idQdPdKh"].setValidators([Validators.required]);
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
      namKh: this.formData.value.namKh,
      loaiVthh: this.loaiVthh
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
        await this.hopDongBttService.getDetail(data.id).then(res => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (res.data) {
              const data = res.data;
              this.formData.patchValue({
                soHd: data.soHd,
                idHd: data.id,
                ngayHd: data.ngayPduyet,
                maDviTsan: data.maDviTsan,
                loaiVthh: data.loaiVthh,
                tenLoaiVthh: data.tenLoaiVthh,
                cloaiVthh: data.cloaiVthh,
                tenCloaiVthh: data.tenCloaiVthh,
                moTaHangHoa: data.moTaHangHoa,
                soLuong: data.soLuong,
                donGia: data.donGia == null ? data.donGiaKhongVat : data.donGia,
                donViTinh: data.dviTinh,
                trichYeu: data.trichYeu,
                tenTtcn: data.tenDviMua
              })
              this.dataTable = data.children;
            }
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        })
      }
    });
  }

  async openDialogSoQdPdKh() {
    this.spinner.show();
    let dsQdPd = []
    await this.qdPdKetQuaBttService.search({
      trangThai: STATUS.BAN_HANH,
      namKh: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
      maDvi: this.userInfo.MA_DVI,
    }
    ).then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        if (data && data.content && data.content.length > 0) {
          dsQdPd = data.content;
        }
      }
    });
    this.spinner.hide();
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách căn cứ số quyết định phê duyệt kế hoạch',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: dsQdPd,
        dataHeader: ['Số quyết định phê duyệt kế hoạch', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soQdPd', 'tenLoaiVthh', 'tenCloaiVthh']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.qdPdKetQuaBttService.getDetail(data.id).then(async (resKq) => {
          const dataKq = resKq.data;
          await this.quyetDinhPdKhBanTrucTiepService.getDtlDetail(dataKq.idPdKhDtl).then(res => {
            if (res.msg == MESSAGE.SUCCESS) {
              if (res.data) {
                const data = res.data;
                this.formData.patchValue({
                  idQdKqCg: dataKq.id,
                  soQdPd: data.xhQdPdKhBttHdr.soQdPd,
                  idQdPdKh: data.xhQdPdKhBttHdr.id,
                  maDviTsan: data.maDviTsan,
                  loaiVthh: data.xhQdPdKhBttHdr.loaiVthh,
                  tenLoaiVthh: data.xhQdPdKhBttHdr.tenLoaiVthh,
                  cloaiVthh: data.xhQdPdKhBttHdr.cloaiVthh,
                  tenCloaiVthh: data.xhQdPdKhBttHdr.tenCloaiVthh,
                  moTaHangHoa: data.xhQdPdKhBttHdr.moTaHangHoa,
                  soLuong: data.tongSoLuong,
                  donGia: data.tongDonGia,
                  donViTinh: 'Kg',
                  tgianGnhan: data.tgianGnhan,
                  trichYeu: dataKq.trichYeu,
                })
                this.dataTable = data.children;
                this.setListDviTsan(data.children);
              }
            }
          })
        })
      }
    });
  }

  setListDviTsan(inputTable) {
    this.listDviTsan = [];
    inputTable.forEach((item) => {
      item.children.forEach(s => {
        this.listDviTsan.push(s.maDviTsan)
        this.formData.patchValue({
          listMaDviTsan: this.listDviTsan,
        })
      })
    })
  }

  async save(isGuiDuyet?) {
    this.setValidator(isGuiDuyet);
    let body = this.formData.value;
    if (this.formData.value.soQd) {
      body.soQd = this.formData.value.soQd + "/" + this.maQd;
    }
    body.children = this.dataTable;
    body.phanLoai = this.radioValue
    body.fileDinhKems = this.fileDinhKem;
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
      this.fileDinhKem = data.fileDinhKems;
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
