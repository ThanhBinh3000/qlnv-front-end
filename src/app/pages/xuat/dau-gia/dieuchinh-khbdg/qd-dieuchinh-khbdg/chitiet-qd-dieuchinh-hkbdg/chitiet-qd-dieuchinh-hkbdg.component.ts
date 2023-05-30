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
import {
  QuyetDinhPdKhBdgService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/quyetDinhPdKhBdg.service';
import { TongHopDeXuatKeHoachBanDauGiaService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/tongHopDeXuatKeHoachBanDauGia.service';
import { STATUS } from 'src/app/constants/status';
import {
  QuyetDinhDchinhKhBdgService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/dieuchinh-kehoach/quyetDinhDchinhKhBdg.service";
import { DeXuatKhBanDauGiaService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/deXuatKhBanDauGia.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { DanhMucService } from 'src/app/services/danhmuc.service';

@Component({
  selector: 'app-chitiet-qd-dieuchinh-hkbdg',
  templateUrl: './chitiet-qd-dieuchinh-hkbdg.component.html',
  styleUrls: ['./chitiet-qd-dieuchinh-hkbdg.component.scss']
})
export class ChitietQdDieuchinhHkbdgComponent extends Base2Component implements OnInit {

  @Input() loaiVthh: string
  @Input() idInput: number = 0;
  maQd: string = null;
  dataInput: any;
  dataInputCache: any;
  listLoaiHinhNx: any[] = [];
  listKieuNx: any[] = [];
  fileDinhKems: any[] = [];
  selected: boolean = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private deXuatKhBanDauGiaService: DeXuatKhBanDauGiaService,
    private quyetDinhPdKhBdgService: QuyetDinhPdKhBdgService,
    private quyetDinhDchinhKhBdgService: QuyetDinhDchinhKhBdgService,
    private tongHopDeXuatKeHoachBanDauGiaService: TongHopDeXuatKeHoachBanDauGiaService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhDchinhKhBdgService);
    this.formData = this.fb.group({
      id: [null],
      nam: [dayjs().get('year'), Validators.required],
      maDvi: [''],
      tenDvi: [''],
      soQdDc: ['', [Validators.required]],
      ngayKyDc: ['',],
      ngayHlucDc: ['',],
      idQdGoc: [],
      soQdGoc: ['',],
      ngayKyQdGoc: ['',],
      trichYeu: [''],
      soQdCc: [''],
      loaiVthh: [''],
      tenLoaiVthh: [],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      loaiHinhNx: [''],
      kieuNx: [''],
      tchuanCluong: [''],
      slDviTsan: [''],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
    })
  }

  setValidator(isGuiDuyet?) {
    // if (isGuiDuyet) {
    //   this.formData.controls["soQdPd"].setValidators([Validators.required]);
    //   this.formData.controls["ngayKyQd"].setValidators([Validators.required]);
    //   this.formData.controls["ngayHluc"].setValidators([Validators.required]);
    // } else {
    //   this.formData.controls["soQdPd"].clearValidators();
    //   this.formData.controls["ngayKyQd"].clearValidators();
    //   this.formData.controls["ngayHluc"].clearValidators();
    // }
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
      }
      await Promise.all([
        this.loadDataComboBox(),
      ]);
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  async showFirstRow($event, dataDxBDG: any) {
    await this.showDetail($event, dataDxBDG);
  }

  async loadDataComboBox() {
    // loại hình nhập xuất
    this.listLoaiHinhNx = [];
    let resNx = await this.danhMucService.danhMucChungGetAll('LOAI_HINH_NHAP_XUAT');
    if (resNx.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNx = resNx.data.filter(item => item.apDung == 'XUAT_DG');
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
    await this.quyetDinhPdKhBdgService.search({
      trangThai: STATUS.BAN_HANH,
      namKh: this.formData.value.nam,
      lastest: 0,
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
      nzTitle: 'DANH SÁCH SỐ QUYẾT ĐỊNH GỐC',
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
        await this.quyetDinhPdKhBdgService.getDetail(data.id).then(res => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (res.data) {
              const data = res.data;
              this.formData.patchValue({
                soQdGoc: data.soQdPd,
                idQdGoc: data.id,
                ngayKyQdGoc: data.ngayKyQd,
                soQdCc: data.soQdCc,
                loaiVthh: data.loaiVthh,
                tenLoaiVthh: data.tenLoaiVthh,
                cloaiVthh: data.cloaiVthh,
                tenCloaiVthh: data.tenCloaiVthh,
                moTaHangHoa: data.moTaHangHoa,
                loaiHinhNx: data.loaiHinhNx,
                kieuNx: data.kieuNx,

              })
              this.dataTable = data.children;
              if (this.dataTable && this.dataTable.length > 0) {
                this.showFirstRow(event, this.dataTable[0]);
              }
            }
            this.dataInput = null;
            this.dataInputCache = null;
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
      let res = await this.quyetDinhDchinhKhBdgService.getDetail(id);
      const data = res.data;
      this.helperService.bidingDataInFormGroup(this.formData, data);
      this.formData.patchValue({
        soQdDc: data.soQdDc?.split("/")[0],
        soQdGoc: data.soQdGoc,
      });
      this.dataTable = data.children;
      if (this.dataTable && this.dataTable.length > 0) {
        this.showFirstRow(event, this.dataTable[0]);
      }
      this.fileDinhKem = data.fileDinhKem;
      this.fileDinhKems = data.fileDinhKems;
    }
    this.spinner.hide()
  }

  index = 0;
  async showDetail($event, index) {
    await this.spinner.show();
    if ($event.type == 'click') {
      this.selected = false
      $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
      $event.target.parentElement.classList.add('selectedRow');
      this.dataInput = this.dataTable[index];
      if (this.dataInput) {
        let res = await this.quyetDinhPdKhBdgService.getDetail(this.dataInput.idQdHdr == null ? this.dataInput.idQdGoc : this.dataInput.idQdHdr);
        this.dataInputCache = res.data.children[index];
      }
      this.index = index;
      await this.spinner.hide();
    } else {
      this.selected = true
      this.dataInput = this.dataTable[0];
      if (this.dataInput) {
        console.log(this.dataInput, 999)
        let res = await this.quyetDinhPdKhBdgService.getDetail(this.dataInput.idQdHdr == null ? this.dataInput.idQdGoc : this.dataInput.idQdHdr);
        this.dataInputCache = res.data.children[0];
      }
      this.index = 0;
      await this.spinner.hide();
    }

  }

  isDisabled() {
    if (this.formData.value.trangThai == STATUS.DU_THAO || this.formData.value.trangThai == STATUS.TU_CHOI_LDV) {
      return false;
    } else {
      return true;
    }
  }

  isDisabledQD() {
    if (this.formData.value.id == null) {
      return false
    } else {
      return true;
    }
  }

}
