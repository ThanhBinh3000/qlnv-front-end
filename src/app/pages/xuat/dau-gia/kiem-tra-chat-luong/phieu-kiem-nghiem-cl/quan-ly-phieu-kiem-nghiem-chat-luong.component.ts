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
import { v4 as uuidv4 } from 'uuid';
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
  dataView: any = [];
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
      this.timKiem(),
        await this.search();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  timKiem() {
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
      maDvi: this.userService.isCuc() ? this.userInfo.MA_DVI : null
    })
  }

  clearFilter() {
    this.formData.reset();
    this.timKiem();
    this.search();
  }

  redirectToChiTiet(lv2: any, isView: boolean, idBbLayMau?: number) {
    this.selectedId = lv2.id;
    this.isDetail = true;
    this.isView = isView;
    this.idBbLayMau = idBbLayMau;
  }

  async search(roles?): Promise<void> {
    await this.spinner.show()
    await super.search(roles);
    this.buildTableView();
    await this.spinner.hide()
  }

  buildTableView() {
    console.log(JSON.stringify(this.dataTable), 'raw')
    let dataView = chain(this.dataTable)
      .groupBy("soQdGiaoNvXh")
      .map((value, key) => {
        let rs = chain(value)
          .groupBy("maDiemKho")
          .map((v, k) => {
            let rowLv2 = v.find(s => s.maDiemKho === k);
            return {
              id: rowLv2.id,
              idVirtual: uuidv4(),
              maDiemKho: k,
              tenDiemKho: rowLv2.tenDiemKho,
              maNhaKho: rowLv2.maNhaKho,
              tenNhaKho: rowLv2.tenNhaKho,
              maNganKho: rowLv2.maNganKho,
              tenNganKho: rowLv2.tenNganKho,
              tenLoKho: rowLv2.tenLoKho,
              maLoKho: rowLv2.maLoKho,
              soPhieu: rowLv2.soPhieu,
              ngayKnghiem: rowLv2.ngayKnghiem,
              idBbLayMau: rowLv2.idBbLayMau,
              soBbLayMau: rowLv2.soBbLayMau,
              ngayLayMau: rowLv2.ngayLayMau,
              soBbXuatDocKho: rowLv2.soBbXuatDocKho,
              ngayXuatDocKho: rowLv2.ngayXuatDocKho,
              trangThai: rowLv2.trangThai,
              tenTrangThai: rowLv2.tenTrangThai,
              childData: v
            }
          }
          ).value();
        let rowLv1 = value.find(s => s.soQdGiaoNvXh === key);
        return {
          idVirtual: uuidv4(),
          soQdGiaoNvXh: key,
          nam: rowLv1.nam,
          ngayQdGiaoNvXh: rowLv1.ngayQdGiaoNvXh,
          idBbLayMau: rowLv1.idBbLayMau,
          idQdGiaoNvXh: rowLv1.idQdGiaoNvXh,
          childData: rs
        };
      }).value();
    this.dataView = dataView
    this.expandAll()
  }

  expandAll() {
    this.dataView.forEach(s => {
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
