import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { MESSAGE } from 'src/app/constants/message';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './../../../../../../services/storage.service';
import { DonviService } from './../../../../../../services/donvi.service';
import { DanhMucService } from './../../../../../../services/danhmuc.service';
import { HopDongXuatHangService } from './../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/hop-dong/hopDongXuatHang.service';
import dayjs from 'dayjs';
import { Validators } from '@angular/forms';
import { STATUS } from 'src/app/constants/status';
import { isEmpty } from 'lodash';
import { convertTienTobangChu } from 'src/app/shared/commonFunction';

@Component({
  selector: 'app-phu-luc',
  templateUrl: './phu-luc.component.html',
  styleUrls: ['./phu-luc.component.scss'],
})
export class PhuLucComponent extends Base2Component implements OnInit {
  @Input() idPhuLuc: number;
  @Input() detailHopDong: any = {};
  @Input() isViewPhuLuc: boolean;
  @Input() loaiVthh: String;
  @Input() objHopDongHdr: any = {}
  @Output()
  showListEvent = new EventEmitter<any>();

  maHopDongSuffix: string = '';
  dsDonvi: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hopDongXuatHangService: HopDongXuatHangService,
    private donViService: DonviService,
    private danhMucService: DanhMucService
  ) {
    super(httpClient, storageService, notification, spinner, modal, hopDongXuatHangService);
    this.formData = this.fb.group(
      {
        id: [],
        idHd: [],
        nam: [dayjs().get('year')],
        soHd: [],
        tenHd: [],
        ngayHluc: [],
        soPhuLuc: [],
        ngayHlucPhuLuc: [],
        noiDungPhuLuc: [null, [Validators.required]],
        thoiGianDuKien: [],
        tgianGnhanTu: [],
        tgianGnhanDen: [],
        thoiGianDuKienSauDc: [],
        ngayHlucSauDcTu: [],
        ngayHlucSauDcDen: [],
        tgianThienHd: [],
        tgianThienHdSauDc: [],
        noiDungDcKhac: [],
        ghiChuPhuLuc: [null, [Validators.required]],
        trangThaiPhuLuc: STATUS.DU_THAO,
        tenTrangThaiPhuLuc: ['Dự thảo'],
        kieuNx: [],
      }
    );
  }

  async ngOnInit() {
    this.maHopDongSuffix = `/${this.formData.value.nam}/HĐMB`;
    if (this.idPhuLuc) {
      await this.loadChiTiet(this.idPhuLuc);
    } else {
      await Promise.all([
        this.loadDsHopDong(),
      ]);
    }
    await this.loadDsDonVi()
  }

  async loadChiTiet(id) {
    let data = await this.detail(id);
    var ngayHlucDen = new Date(this.objHopDongHdr.ngayHluc);
    this.formData.patchValue({
      soPhuLuc: data.soPhuLuc.split('/')[0],
      thoiGianDuKienSauDc: (data.ngayHlucSauDcTu && data.ngayHlucSauDcDen) ? [data.ngayHlucSauDcTu, data.ngayHlucSauDcDen] : null,
      thoiGianDuKien: (this.objHopDongHdr.ngayHluc && ngayHlucDen.setUTCDate(ngayHlucDen.getUTCDate() + this.objHopDongHdr.tgianThienHd))?
        [this.objHopDongHdr.ngayHluc,ngayHlucDen.setUTCDate(ngayHlucDen.getUTCDate() + this.objHopDongHdr.tgianThienHd)] : null,
    })
    this.dataTable = data.phuLucDtl;
    this.fileDinhKem = data.fileDinhKems;

  }

  async loadDsDonVi() {
    let body = {
      maDviCha: this.userInfo.MA_DVI,
      trangThai: '01',
    };
    let res = await this.donViService.getAll(body);
    if (!isEmpty(res)) {
      this.dsDonvi = res.data;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  onChangeDiaChi($event, index) {
    let diaChiChiCuc = this.dsDonvi.filter(item => item.maDvi == $event);
    if (diaChiChiCuc.length > 0) {
      this.dataTable[index].diaChi = diaChiChiCuc[0].diaChi
    }
  }

  async loadDsHopDong() {
    if (this.objHopDongHdr) {
      var ngayHlucDen = new Date(this.objHopDongHdr.ngayHluc);
      this.formData.patchValue({
        idHd: this.objHopDongHdr.id ?? null,
        soHd: this.objHopDongHdr.soHd ?? null,
        tenHd: this.objHopDongHdr.tenHd ?? null,
        ngayHluc: this.objHopDongHdr.ngayHluc ?? null,
        thoiGianDuKien: (this.objHopDongHdr.ngayHluc && ngayHlucDen.setUTCDate(ngayHlucDen.getUTCDate() + this.objHopDongHdr.tgianThienHd))?
          [this.objHopDongHdr.ngayHluc,ngayHlucDen.setUTCDate(ngayHlucDen.getUTCDate() + this.objHopDongHdr.tgianThienHd)] : null,
        tgianThienHd: this.objHopDongHdr.tgianThienHd ?? null,
      });
      this.dataTable = [...this.dataTable, ...this.objHopDongHdr.children]
    }
  }

  async save(isOther: boolean) {
    this.formData.disable();
    let body = this.formData.value;
    if (this.formData.get('thoiGianDuKien').value) {
      body.tgianGnhanTu = dayjs(this.formData.get('thoiGianDuKien').value[0]).format('YYYY-MM-DD');
      body.tgianGnhanDen = dayjs(this.formData.get('thoiGianDuKien').value[1]).format('YYYY-MM-DD')
    }
    if (this.formData.get('thoiGianDuKienSauDc').value) {
      body.ngayHlucSauDcTu = dayjs(this.formData.get('thoiGianDuKienSauDc').value[0]).format('YYYY-MM-DD');
      body.ngayHlucSauDcDen = dayjs(this.formData.get('thoiGianDuKienSauDc').value[1]).format('YYYY-MM-DD')
    }

    body.soPhuLuc = this.formData.value.soPhuLuc ? this.formData.value.soPhuLuc + this.maHopDongSuffix : null;
    body.phuLucDtl = this.dataTable;
    body.fileDinhKems = this.fileDinhKem;
    let data = await this.createUpdate(body);
    this.formData.enable();
    let id = data.id;
    this.loadChiTiet(id);
  }
  async saveAndSend(status: string, message: string, sucessMessage: string) {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      await this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    if (this.formData.get('thoiGianDuKien').value) {
      body.tgianGnhanTu = dayjs(this.formData.get('thoiGianDuKien').value[0]).format('YYYY-MM-DD');
      body.tgianGnhanDen = dayjs(this.formData.get('thoiGianDuKien').value[1]).format('YYYY-MM-DD')
    }
    if (this.formData.get('thoiGianDuKienSauDc').value) {
      body.ngayHlucSauDcTu = dayjs(this.formData.get('thoiGianDuKienSauDc').value[0]).format('YYYY-MM-DD');
      body.ngayHlucSauDcDen = dayjs(this.formData.get('thoiGianDuKienSauDc').value[1]).format('YYYY-MM-DD')
    }

    body.soPhuLuc = this.formData.value.soPhuLuc ? this.formData.value.soPhuLuc + this.maHopDongSuffix : null;
    body.phuLucDtl = this.dataTable;
    body.fileDinhKems = this.fileDinhKem;
    if (this.formData.value.id > 0) {
      if (body) {
        await this.approve(body.id, status, message, null, sucessMessage);
      } else {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    } else {
      let data = await this.createUpdate(this.formData.value);
      if (data) {
        await this.approve(data.id, status, message, null, sucessMessage);
      } else {
        this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      }
    }

  }

  isDisabled() {
    if (this.formData.value.trangThaiPhuLuc == STATUS.DU_THAO) {
      return false;
    } else {
      return true;
    }
  }

  convertTienTobangChu(tien: number): string {
    return convertTienTobangChu(tien);
  }

}

