import { Component, OnInit, Input } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import { MESSAGE } from 'src/app/constants/message';
import { chain } from 'lodash';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { XhPhieuKnghiemCluongService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/kiem-tra-chat-luong/xhPhieuKnghiemCluong.service';
import * as uuid from "uuid";

@Component({
  selector: 'app-quan-ly-phieu-kiem-nghiem-chat-luong',
  templateUrl: './quan-ly-phieu-kiem-nghiem-chat-luong.component.html',
  styleUrls: ['./quan-ly-phieu-kiem-nghiem-chat-luong.component.scss'],
})
export class QuanLyPhieuKiemNghiemChatLuongComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  selectedId: number = 0;
  isView: boolean = false;
  idBbLayMau: number = 0;
  children: any = [];
  expandSetString = new Set<string>();
  idQdNv: number = 0;
  isViewQdNv: boolean = false;
  idQdBb: number = 0;
  isViewQdBb: boolean = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private xhPhieuKnghiemCluongService: XhPhieuKnghiemCluongService
  ) {
    super(httpClient, storageService, notification, spinner, modal, xhPhieuKnghiemCluongService);
    this.formData = this.fb.group({
      nam: null,
      soQd: null,
      soPhieu: null,
      loaiVthh: null,
      ngayKnghiemTu: null,
      ngayKnghiemDen: null,
      soBbLayMau: null,
      soBbXuatDocKho: null,
      maChiCuc: null,
      maDvi: null
    })

    this.filterTable = {
      soQdGiaoNvXh: '',
      nam: '',
      ngayQdGiaoNvXh: '',
      maDiemKho: '',
      tenDiemKho: '',
      maNhaKho: '',
      tenNhaKho: '',
      maNganKho: '',
      tenNganKho: '',
      maLoKho: '',
      tenLoKho: '',
      soPhieu: '',
      ngayKnghiem: '',
      soBbLayMau: '',
      ngayLayMau: '',
      soBbXuatDocKho: '',
      ngayXuatDocKho: '',
      trangThai: '',
      tenTrangThai: '',
    };
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      await this.search();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async search(roles?): Promise<void> {
    await this.spinner.show()
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
      maDvi: this.userService.isCuc() ? this.userInfo.MA_DVI : null,
      maChiCuc: this.userService.isChiCuc() ? this.userInfo.MA_DVI : null
    })
    await super.search(roles);
    this.buildTableView();
    await this.spinner.hide()
  }


  buildTableView() {
    let dataView = chain(this.dataTable).groupBy("soQdGiaoNvXh").map((value, key) => {
      let quyetDinh = value.find(f => f.soQdGiaoNvXh === key)
      let rs = chain(value).groupBy("maDiemKho").map((v, k) => {
        let diaDiem = v.find(s => s.maDiemKho === k)
        return {
          idVirtual: uuid.v4(),
          maDiemKho: k != null ? k : '',
          tenDiemKho: diaDiem ? diaDiem.tenDiemKho : null,
          idQdGiaoNvXh: diaDiem ? diaDiem.idQdGiaoNvXh : null,
          childData: v
        }
      }).value();
      let nam = quyetDinh ? quyetDinh.nam : null;
      let ngayQdGiaoNvXh = quyetDinh ? quyetDinh.ngayQdGiaoNvXh : null;
      let idQdGiaoNvXh = quyetDinh ? quyetDinh.idQdGiaoNvXh : null;
      return {
        idVirtual: uuid.v4(),
        soQdGiaoNvXh: key != null ? key : '',
        nam: nam,
        ngayQdGiaoNvXh: ngayQdGiaoNvXh,
        idQdGiaoNvXh : idQdGiaoNvXh,
        childData: rs
      };
    }).value();
    this.children = dataView
    this.expandAll()
  }

  expandAll() {
    this.children.forEach(s => {
      this.expandSetString.add(s.idVirtual);
    })
  }

  onExpandStringChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }

  disabledStartngayKnghiem = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayKnghiemTu) {
      return false;
    }
    return startValue.getTime() > this.formData.value.ngayKnghiemDen.getTime();
  };

  disabledEndngayKnghiem = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKnghiemTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayKnghiemDen.getTime();
  };

  openModalQdNv(id: number) {
    this.idQdNv = id;
    this.isViewQdNv = true;
  }

  closeModalQdNv() {
    this.idQdNv = null;
    this.isViewQdNv = false;
  }

  openModalBienBan(id: number) {
    this.idQdBb = id;
    this.isViewQdBb = true;
  }

  closeModalBienBan() {
    this.idQdBb = null;
    this.isViewQdBb = false;
  }
}
