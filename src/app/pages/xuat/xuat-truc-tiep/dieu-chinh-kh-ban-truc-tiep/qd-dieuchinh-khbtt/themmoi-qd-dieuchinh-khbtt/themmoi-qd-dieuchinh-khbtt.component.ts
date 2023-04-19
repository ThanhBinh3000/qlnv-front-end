import { Component, Input, OnInit, } from '@angular/core';
import { Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  DialogTableSelectionComponent
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { cloneDeep } from 'lodash';
import { MESSAGE } from 'src/app/constants/message';
import { FileDinhKem } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { STATUS } from 'src/app/constants/status';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { DeXuatKhBanTrucTiepService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/de-xuat-kh-ban-truc-tiep.service';
import { QuyetDinhPdKhBanTrucTiepService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/quyet-dinh-pd-kh-ban-truc-tiep.service';
import { QuyetDinhDcBanttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/dieuchinh-kehoach-bantt/quyet-dinh-dc-bantt.service';
import { TongHopKhBanTrucTiepService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/tong-hop-kh-ban-truc-tiep.service';
import { DanhMucService } from 'src/app/services/danhmuc.service';

@Component({
  selector: 'app-themmoi-qd-dieuchinh-khbtt',
  templateUrl: './themmoi-qd-dieuchinh-khbtt.component.html',
  styleUrls: ['./themmoi-qd-dieuchinh-khbtt.component.scss']
})
export class ThemmoiQdDieuchinhKhbttComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string
  @Input() idInput: number = 0;

  maQd: string = null;
  dataInput: any;
  dataInputCache: any;

  isTongHop: boolean
  dataTableCache: any;
  listLoaiHinhNx: any[] = [];
  listKieuNx: any[] = [];
  fileDinhKems: any[] = []

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private deXuatKhBanTrucTiepService: DeXuatKhBanTrucTiepService,
    private quyetDinhPdKhBanTrucTiepService: QuyetDinhPdKhBanTrucTiepService,
    private quyetDinhDcBanttService: QuyetDinhDcBanttService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhDcBanttService);
    this.formData = this.fb.group({
      id: [],
      namKh: [dayjs().get('year')],
      maDvi: [''],
      tenDvi: [''],
      soQdDc: [''],
      ngayKyDc: [''],
      ngayHluc: [''],
      trichYeu: [''],
      soQdGoc: ['', [Validators.required]],
      idQdGoc: [],
      ngayKyQdGoc: [''],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      lyDoTuChoi: [''],
      loaiHinhNx: [''],
      kieuNx: [''],
    })
  }

  setValidator(isGuiDuyet) {
    if (isGuiDuyet) {
      this.formData.controls["soQdDc"].setValidators([Validators.required]);
      this.formData.controls["ngayKyDc"].setValidators([Validators.required]);
      this.formData.controls["ngayHluc"].setValidators([Validators.required]);
      this.formData.controls["loaiHinhNx"].setValidators([Validators.required]);
      this.formData.controls["trichYeu"].setValidators([Validators.required]);
      this.formData.controls["soQdGoc"].setValidators([Validators.required]);
      this.formData.controls["ngayKyQdGoc"].setValidators([Validators.required]);
      this.formData.controls["loaiVthh"].setValidators([Validators.required]);
      this.formData.controls["tenLoaiVthh"].setValidators([Validators.required]);
    } else {
      this.formData.controls["soQdDc"].clearValidators();
      this.formData.controls["ngayKyDc"].clearValidators();
      this.formData.controls["ngayHluc"].clearValidators();
      this.formData.controls["loaiHinhNx"].clearValidators();
      this.formData.controls["trichYeu"].clearValidators();
      this.formData.controls["soQdGoc"].clearValidators();
      this.formData.controls["ngayKyQdGoc"].clearValidators();
      this.formData.controls["loaiVthh"].clearValidators();
      this.formData.controls["tenLoaiVthh"].clearValidators();
    }
  }

  deleteSelect() {
  }

  async ngOnInit() {
    this.spinner.show();
    this.maQd = this.userInfo.MA_QD;
    if (this.idInput) {
      await this.loadChiTiet(this.idInput);
    }
    await Promise.all([
      this.loadDataComboBox(),
    ]);
    await this.spinner.hide();
  }

  async loadDataComboBox() {
    // loại hình nhập xuất
    this.listLoaiHinhNx = [];
    let resNx = await this.danhMucService.danhMucChungGetAll('LOAI_HINH_NHAP_XUAT');
    if (resNx.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNx = resNx.data.filter(item => item.apDung == 'XUAT_TT');
    }
    // kiểu nhập xuất
    this.listKieuNx = [];
    let resKieuNx = await this.danhMucService.danhMucChungGetAll('KIEU_NHAP_XUAT');
    if (resKieuNx.msg == MESSAGE.SUCCESS) {
      this.listKieuNx = resKieuNx.data
    }
  }

  async openDialogSoQdGoc() {
    this.spinner.show();
    let dsQdPd = []
    await this.quyetDinhPdKhBanTrucTiepService.search({
      trangThai: STATUS.BAN_HANH,
      namKh: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
      lastest: 0,
      typeQdDc: 0,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: this.page - 1,
      },
    }).then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        if (data && data.content && data.content.length > 0) {
          dsQdPd = data.content;
        }
      }
    });
    this.spinner.hide();
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định gốc',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: dsQdPd,
        dataHeader: ['Số quyết định gốc', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soQdPd', 'tenLoaiVthh', 'tenCloaiVthh']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.quyetDinhPdKhBanTrucTiepService.getDetail(data.id).then(res => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (res.data) {
              const data = res.data;
              this.formData.patchValue({
                soQdGoc: data.soQdPd,
                idQdGoc: data.id,
                ngayKyQdGoc: data.ngayKyQd,
                loaiVthh: data.loaiVthh,
                tenLoaiVthh: data.tenLoaiVthh,
                cloaiVthh: data.cloaiVthh,
                tenCloaiVthh: data.tenCloaiVthh,
                moTaHangHoa: data.moTaHangHoa,
                loaiHinhNx: data.loaiHinhNx,
                kieuNx: data.kieuNx,
              })
              this.dataTable = data.children;
              this.dataTableCache = cloneDeep(this.dataTable);
            }
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        })
      }
    });
  }

  async save(isGuiDuyet?) {
    this.setValidator(isGuiDuyet);
    let body = this.formData.value;
    if (this.formData.value.soQdDc) {
      body.soQdDc = this.formData.value.soQdDc + "/" + this.maQd;
    }
    body.children = this.dataTable;
    body.fileDinhKems = this.fileDinhKems;
    body.fileDinhKem = this.fileDinhKem;
    let res = await this.createUpdate(body);
    if (res) {
      if (isGuiDuyet) {
        this.idInput = res.id;
        this.guiDuyet();
      } else {
        // this.goBack()
      }
    }
  }

  async guiDuyet() {
    let trangThai = '';
    let msg = '';
    switch (this.formData.get('trangThai').value) {
      case STATUS.TU_CHOI_LDV:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_LDV;
        msg = MESSAGE.GUI_DUYET_CONFIRM
        break;
      }
      case STATUS.CHO_DUYET_LDV: {
        trangThai = STATUS.DA_DUYET_LDV;
        msg = MESSAGE.PHE_DUYET_CONFIRM
        break;
      }
      case STATUS.DA_DUYET_LDV: {
        trangThai = STATUS.BAN_HANH;
        msg = MESSAGE.PHE_DUYET_CONFIRM
        break;
      }
    }
    this.approve(this.idInput, trangThai, msg);
  }

  tuChoi() {
    let trangThai = '';
    switch (this.formData.get('trangThai').value) {
      case STATUS.CHO_DUYET_LDV: {
        trangThai = STATUS.TU_CHOI_LDV;
        break;
      }
    };
    this.reject(this.idInput, trangThai);
  }


  async loadChiTiet(id: number) {
    if (id > 0) {
      let res = await this.quyetDinhDcBanttService.getDetail(id);
      const data = res.data;
      this.helperService.bidingDataInFormGroup(this.formData, data);
      this.formData.patchValue({
        soQdDc: data.soQdDc?.split("/")[0],
        soQdGoc: data.soQdGoc,
      });
      if (data.loaiVthh.startsWith("02")) {
        this.dataTable = data.children;
      } else {
        this.dataTable = data.children;
        this.dataTableCache = cloneDeep(this.dataTable);
        for (const item of this.dataTableCache) {
          await this.deXuatKhBanTrucTiepService.getDetail(item.idDxHdr).then((res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              item.children = res.data.children;
            }
          })
        }
      }
      this.fileDinhKem = data.fileDinhKem;
      this.fileDinhKems = data.fileDinhKems;
    }
    this.spinner.hide()
  }

  index = 0;
  async showDetail($event, index) {
    await this.spinner.show();
    $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
    $event.target.parentElement.classList.add('selectedRow');
    this.isTongHop = this.formData.value.phanLoai == 'TH';
    this.dataInput = this.dataTable[index];
    this.dataInputCache = this.dataTableCache[index];
    this.index = index;
    await this.spinner.hide();
  }

  isDisabled() {
    if (this.formData.value.trangThai == STATUS.DU_THAO || this.formData.value.trangThai == STATUS.TU_CHOI_LDV) {
      return false;
    } else {
      return true;
    }
  }


}



