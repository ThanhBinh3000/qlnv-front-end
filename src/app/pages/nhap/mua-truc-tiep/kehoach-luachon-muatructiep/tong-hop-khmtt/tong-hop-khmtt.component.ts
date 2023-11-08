import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import * as dayjs from 'dayjs';
import { MESSAGE } from 'src/app/constants/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TongHopDeXuatKHMTTService } from 'src/app/services/tong-hop-de-xuat-khmtt.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { cloneDeep } from 'lodash';
import { FormGroup, Validators } from '@angular/forms';
import { QuyetDinhPheDuyetKeHoachLCNTService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/quyetDinhPheDuyetKeHoachLCNT.service';
import { QuyetDinhPheDuyetKeHoachMTTService } from 'src/app/services/quyet-dinh-phe-duyet-ke-hoach-mtt.service';

@Component({
  selector: 'app-tong-hop-khmtt',
  templateUrl: './tong-hop-khmtt.component.html',
  styleUrls: ['./tong-hop-khmtt.component.scss']
})

export class TongHopKhmttComponent extends Base2Component implements OnInit {
  @Input() listVthh: any[] = [];
  @Input() loaiVthh: string;
  listCloaiVthh: any[] = [];
  isView: boolean = false;
  tuNgayKy: Date | null = null;
  denNgayKy: Date | null = null;
  tuNgayTh: Date | null = null;
  denNgayTh: Date | null = null;
  id: any;
  qdPdMttId: number = 0;
  isQuyetDinh: boolean = false;
  isTongHop: boolean = false;
  formTraCuu: FormGroup;
  formDataQd: FormGroup;
  idQdPd: number = 0;
  disableField: boolean = false;
  isViewQdPd: boolean = false;
  listTrangThai: any[] = [
    { ma: this.STATUS.CHUA_TAO_QD, giaTri: 'Chưa Tạo QĐ' },
    { ma: this.STATUS.DA_DU_THAO_QD, giaTri: 'Đã Dự Thảo QĐ' },
    { ma: this.STATUS.DA_BAN_HANH_QD, giaTri: 'Đã Ban Hành QĐ' },
  ];
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private tongHopDeXuatKHMTTService: TongHopDeXuatKHMTTService,
    private quyetDinhPheDuyetKeHoachMTTService: QuyetDinhPheDuyetKeHoachMTTService,
    private danhMucService: DanhMucService
  ) {
    super(httpClient, storageService, notification, spinner, modal, tongHopDeXuatKHMTTService);

    this.formData = this.fb.group({
      namKh: '',
      loaiVthh: '',
      tenLoaiVthh: '',
      cloaiVthh: '',
      tenCloaiVthh: '',
      noiDungThop: '',
      ngayThop: '',
      ngayQd: ''
    });
    this.formDataQd = this.fb.group({
      id: [null],
      namKh: [dayjs().get('year'), Validators.required],
      soQd: ['',],
      ngayQd: ['',],
      ngayHluc: ['',],
      idThHdr: [''],
      soTrHdr: [''],
      idTrHdr: [''],
      trichYeu: [''],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      tchuanCluong: [''],
      trangThai: [''],
      tenTrangThai: [''],
      phanLoai: [''],
      soQdCc: [''],
    })

    this.filterTable = {
      id: '',
      ngayTao: '',
      noiDungThop: '',
      namKh: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      tenTrangThai: '',
      soQdPduyet: '',
    }
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.formData.patchValue({
        loaiVthh: this.loaiVthh
      })
      await this.timKiem();
      this.getCloaiVthh();
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  goDetail(id: number, roles?: any) {
    if (!this.checkPermission(roles)) {
      return
    }
    if (roles != 'NHDTQG_PTMTT_KHMTT_TONGHOP_TONGHOP') {
      this.isView = true
    } else {
      this.isView = false
    }
    this.idSelected = id;
    this.isDetail = true;
  }

  async getCloaiVthh() {
    let body = {
      "str": this.loaiVthh
    };
    let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha(body);
    console.log(res, 999)
    if (res.msg == MESSAGE.SUCCESS) {
      this.listCloaiVthh = res.data;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }


  async timKiem() {
    if (this.tuNgayTh || this.denNgayTh) {
      this.formData.value.ngayThopTu = this.tuNgayTh != null ? dayjs(this.tuNgayTh).format('YYYY-MM-DD') + " 00:00:00" : null
      this.formData.value.ngayThopDen = this.denNgayTh != null ? dayjs(this.denNgayTh).format('YYYY-MM-DD') + " 23:59:59" : null
    }
    if (this.tuNgayKy || this.denNgayKy) {
      this.formData.value.ngayQdTu = this.tuNgayKy != null ? dayjs(this.tuNgayKy).format('YYYY-MM-DD') + " 00:00:00" : null
      this.formData.value.ngayQdDen = this.denNgayKy != null ? dayjs(this.denNgayKy).format('YYYY-MM-DD') + " 23:59:59" : null
    }
    await this.search();
  }

  filterInTable(key: string, value: string | Date) {
    if (value instanceof Date) {
      value = dayjs(value).format('YYYY-MM-DD');
    }
    console.log(key, value);

    if (value && value != '') {
      this.dataTable = this.dataTableAll.filter((item) =>
        item[key]
          ?.toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase()),
      );
    } else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  }

  clearFilter() {
    this.formData.get('namKh').setValue(null),
      this.formData.get('cloaiVthh').setValue(null),
      this.formData.get('noiDungThop').setValue(null),
      this.denNgayKy = null;
    this.tuNgayKy = null;
    this.tuNgayTh = null;
    this.denNgayTh = null;
    this.search();
  }


  disabledTuNgayKy = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayKy) {
      return false;
    }
    return startValue.getTime() > this.denNgayKy.getTime();
  };

  disabledDenNgayKy = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayKy) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayKy.getTime();
  };

  disabledTuNgayTh = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayTh) {
      return false;
    }
    return startValue.getTime() > this.denNgayTh.getTime();
  };

  disabledDenNgayTh = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayTh) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayTh.getTime();
  };
  async taoQdinh(data: any) {
    console.log(data, 12)
    this.id = data.id
    this.idSelected = data.id;
    this.qdPdMttId = data.qdPdMttId
    await this.loadChiTiet()
    let elem = document.getElementById('mainTongCuc');
    let tabActive = elem.getElementsByClassName('ant-menu-item')[0];
    tabActive.classList.remove('ant-menu-item-selected')
    let setActive = elem.getElementsByClassName('ant-menu-item')[2];
    setActive.classList.add('ant-menu-item-selected');
    this.isQuyetDinh = true;
    this.disableField = true;
  }

  async showQd(data: any) {
    console.log(data, 11)
    this.id = data.id
    this.idSelected = data.id;
    this.qdPdMttId = data.idQdPduyet
    await this.loadChiTiet()
    let elem = document.getElementById('mainTongCuc');
    let tabActive = elem.getElementsByClassName('ant-menu-item')[0];
    tabActive.classList.remove('ant-menu-item-selected')
    let setActive = elem.getElementsByClassName('ant-menu-item')[2];
    setActive.classList.add('ant-menu-item-selected');
    this.isQuyetDinh = true;
    this.disableField = true;
  }


  showTongHop() {
    this.search();
    let elem = document.getElementById('mainTongCuc');
    let tabActive = elem.getElementsByClassName('ant-menu-item')[2];
    tabActive.classList.remove('ant-menu-item-selected')
    let setActive = elem.getElementsByClassName('ant-menu-item')[1];
    setActive.classList.add('ant-menu-item-selected');
    // this.qdPdMttId = 0;
    this.isQuyetDinh = false;
  }
  //
  async loadChiTiet() {
    if (this.id > 0) {
      let res = await this.detail(this.id);
      console.log(res)
      if (res) {
        const dataDetail = res;
        // this.helperService.bidingDataInFormGroup(this.formData, dataDetail)
        this.helperService.bidingDataInFormGroup(this.formDataQd, dataDetail);
        this.clearFilter();
        this.isTongHop = true;
      }
      else {
        this.isTongHop = false;
      }
    }
  }

  openModalQdPd(id: number) {
    this.idQdPd = id;
    this.isViewQdPd = true;
  }

  closeModalQdPd() {
    this.idQdPd = null;
    this.isViewQdPd = false;
  }

}
