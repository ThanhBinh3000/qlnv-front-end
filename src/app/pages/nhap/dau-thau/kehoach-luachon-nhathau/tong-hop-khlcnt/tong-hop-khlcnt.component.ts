import { Component, Input, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { TongHopDeXuatKHLCNTService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/tongHopDeXuatKHLCNT.service';
import * as dayjs from 'dayjs';
import { MESSAGE } from 'src/app/constants/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhSachDauThauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/danhSachDauThau.service';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { STATUS } from "../../../../../constants/status";
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-tong-hop-khlcnt',
  templateUrl: './tong-hop-khlcnt.component.html',
  styleUrls: ['./tong-hop-khlcnt.component.scss']
})

export class TongHopKhlcntComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;

  listTrangThai: any[] = [
    { ma: this.STATUS.CHUA_TAO_QD, giaTri: 'Chưa tạo QĐ' },
    { ma: this.STATUS.DA_DU_THAO_QD, giaTri: 'Đã Dự Thảo QĐ' },
    { ma: this.STATUS.DA_BAN_HANH_QD, giaTri: 'Đã Ban Hành QĐ' }
  ];
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private tongHopDeXuatKHLCNTService: TongHopDeXuatKHLCNTService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, tongHopDeXuatKHLCNTService);
    this.formData = this.fb.group({
      namKhoach: '',
      ngayTongHop: '',
      loaiVthh: '',
      tenVthh: '',
      cloaiVthh: '',
      tenCloaiVthh: '',
      noiDung: ''
    });
    this.filterTable = {
      id: '',
      ngayTao: '',
      noiDung: '',
      namKhoach: '',
      tenVthh: '',
      tenCloaiVthh: '',
      tenHthucLcnt: '',
      tenPthucLcnt: '',
      tenLoaiHdong: '',
      tenNguonVon: '',
      trangThai: '',
      soQdPdKhlcnt: ''
    }
  }


  async ngOnInit() {
    this.spinner.show();
    try {
      this.formData.patchValue({
        loaiVthh: this.loaiVthh
      })
      await this.search();
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async search() {
    this.spinner.show();
    this.formData.get('ngayTongHop').value
    let body = {
      tuNgayThop: this.formData.get('ngayTongHop').value && this.formData.get('ngayTongHop').value.length > 0
        ? dayjs(this.formData.get('ngayTongHop').value[0]).format('YYYY-MM-DD')
        : null,
      denNgayThop: this.formData.get('ngayTongHop').value && this.formData.get('ngayTongHop').value.length > 0
        ? dayjs(this.formData.get('ngayTongHop').value[1]).format('YYYY-MM-DD')
        : null,
      // tuNgayTao: this.searchFilter.ngayLap && this.searchFilter.ngayLap.length > 0
      //   ? dayjs(this.searchFilter.ngayLap[0]).format('YYYY-MM-DD')
      //   : null,
      // denNgayTao: this.searchFilter.ngayLap && this.searchFilter.ngayLap.length > 0
      //   ? dayjs(this.searchFilter.ngayLap[1]).format('YYYY-MM-DD')
      //   : null,
      loaiVthh: this.loaiVthh,
      cloaiVthh: this.formData.get('cloaiVthh').value,
      namKhoach: this.formData.get('namKhoach').value,
      tenVthh: this.formData.get('tenVthh').value,
      tenCloaiVthh: this.formData.get('tenCloaiVthh').value,
      noiDung: this.formData.get('noiDung').value,
      paggingReq: {
        limit: this.pageSize,
        page: this.page - 1,
      },
    };

    let res = await this.tongHopDeXuatKHLCNTService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
        });
      }
      this.dataTableAll = cloneDeep(this.dataTable);
      this.totalRecord = data.totalElements;
    } else {
      this.dataTable = [];
      this.totalRecord = 0;
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  selectHangHoa() {
    let data = this.loaiVthh;
    const modalTuChoi = this.modal.create({
      nzTitle: 'Danh sách hàng hóa',
      nzContent: DialogDanhSachHangHoaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        data: data
      },
    });
    modalTuChoi.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          cloaiVthh: data.ma,
          tenCloaiVthh: data.ten,
          loaiVthh: data.parent.ma,
          tenVthh: data.parent.ten,
        });
      }
    });
  }

  async bindingDataHangHoa(data) {
    if (data.loaiHang == "M" || data.loaiHang == "LT") {
      // this.searchFilter.cloaiVthh = data.ma
      // this.searchFilter.tenCloaiVthh = data.ten
      // this.searchFilter.loaiVthh = data.parent.ma
      // this.searchFilter.tenVthh = data.parent.ten
    }

  }

}
