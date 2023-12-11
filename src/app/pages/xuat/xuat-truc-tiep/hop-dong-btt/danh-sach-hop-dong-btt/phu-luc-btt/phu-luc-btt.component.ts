import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Validators} from '@angular/forms';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import dayjs from 'dayjs';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {convertTienTobangChu} from 'src/app/shared/commonFunction';
import {HopDongBttService} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/hop-dong-btt.service';
import {STATUS} from 'src/app/constants/status';
import {DonviService} from 'src/app/services/donvi.service';
import {MESSAGE} from 'src/app/constants/message';
import {FileDinhKem} from "../../../../../../models/FileDinhKem";

@Component({
  selector: 'app-phu-luc-btt',
  templateUrl: './phu-luc-btt.component.html',
  styleUrls: ['./phu-luc-btt.component.scss']
})
export class PhuLucBttComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: String;
  @Input() idPhuLuc: number;
  @Input() detailHopDong: any = {};
  @Input() isViewPhuLuc: boolean;
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
    private hopDongBttService: HopDongBttService,
    private donViService: DonviService,
    private danhMucService: DanhMucService
  ) {
    super(httpClient, storageService, notification, spinner, modal, hopDongBttService);
    this.formData = this.fb.group(
      {
        id: [],
        idHd: [],
        maDvi: [],
        namHd: [dayjs().get('year')],
        soHdong: [''],
        tenHd: [''],
        ngayHluc: [null,],
        soPhuLuc: ['', [Validators.required]],
        ngayHlucPhuLuc: [null,],
        noiDungPhuLuc: [''],
        thoiGianDuKien: [null],
        tgianGnhanTu: [],
        tgianGnhanDen: [],
        thoiGianDuKienSauDc: [null],
        ngayHlucSauDcTu: [],
        ngayHlucSauDcDen: [],
        tgianThienHd: [],
        tgianThienHdSauDc: [null],
        noiDungDcKhac: [],
        ghiChuPhuLuc: [],
        trangThai: [STATUS.DU_THAO],
        tenTrangThai: ['Dự thảo'],
        tenDvi: [],
        filePhuLuc: [new Array<FileDinhKem>()],
      }
    );
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.maHopDongSuffix = `/${this.formData.value.namHd}/HĐMB`;
      if (this.idPhuLuc) {
        await this.loadChiTiet(this.idPhuLuc);
      } else {
        await Promise.all([
          this.loadDsHopDong(),
          this.initForm(),
        ]);
      }
      await this.loadDsDonVi();
      await this.spinner.hide();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  initForm() {
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI ?? null,
      tenDvi: this.userInfo.TEN_DVI ?? null,
    })
  }

  async loadChiTiet(id) {
    let data = await this.detail(id);
    this.formData.patchValue({
      soPhuLuc: data.soPhuLuc.split('/')[0],
      thoiGianDuKienSauDc: (data.ngayHlucSauDcTu && data.ngayHlucSauDcDen) ? [data.ngayHlucSauDcTu, data.ngayHlucSauDcDen] : null,
      thoiGianDuKien: (data.tgianGnhanTu && data.tgianGnhanDen) ? [data.tgianGnhanTu, data.tgianGnhanDen] : null
    })
    this.dataTable = data.children;
    if (this.objHopDongHdr) {
      this.formData.patchValue({
        soHdong: this.objHopDongHdr.soHd ?? null,
        thoiGianDuKienSauDc: (data.ngayHlucSauDcTu && data.ngayHlucSauDcDen) ? [data.ngayHlucSauDcTu, data.ngayHlucSauDcDen] : null,
        thoiGianDuKien: (data.tgianGnhanTu && data.tgianGnhanDen) ? [data.tgianGnhanTu, data.tgianGnhanDen] : null
      })
      this.dataTable.forEach(s => {
        s.donGia = this.objHopDongHdr.donGiaBanTrucTiep ?? null;
        s.thanhTien = this.objHopDongHdr.thanhTien ?? null;
      })
    }
  }

  async loadDsDonVi() {
    let body = {
      maDviCha: this.userInfo.MA_DVI,
      trangThai: '01',
    };
    let res = await this.donViService.getAll(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsDonvi = res.data;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  onChangeDiaChi($event, index) {
    let diaChiChiCuc = this.dsDonvi.filter(item => item.maDvi == $event);
    if (diaChiChiCuc && diaChiChiCuc.length > 0) {
      this.dataTable[index].diaChi = diaChiChiCuc[0].diaChi
    }
  }

  async loadDsHopDong() {
    if (this.objHopDongHdr) {
      this.formData.patchValue({
        idHd: this.objHopDongHdr.id ?? null,
        soHdong: this.objHopDongHdr.soHd ?? null,
        tenHd: this.objHopDongHdr.tenHd ?? null,
        ngayHluc: this.objHopDongHdr.ngayHluc ?? null,
        thoiGianDuKien: (this.objHopDongHdr.tgianGnhanTu && this.objHopDongHdr.tgianGnhanDen) ? [this.objHopDongHdr.tgianGnhanTu, this.objHopDongHdr.tgianGnhanDen] : null,
        tgianThienHd: this.objHopDongHdr.tgianThienHd ?? null,
      });
      this.objHopDongHdr.children.forEach(s => {
        let row = {
          idHdDtl: s.id,
          tenDviHd: s.tenDvi,
          diaChiHd: s.diaChi,
          soLuongBanTrucTiepHd: s.soLuongBanTrucTiepHd,
          donGia: this.objHopDongHdr.donGiaBanTrucTiep ?? null,
          thanhTien: this.objHopDongHdr.thanhTien ?? null,
        }
        this.dataTable = [...this.dataTable, row]
      });
    }
  }

  async save() {
    await this.helperService.ignoreRequiredForm(this.formData);
    let body = {
      ...this.formData.value,
      soPhuLuc: this.formData.value.soPhuLuc ? this.formData.value.soPhuLuc + this.maHopDongSuffix : null
    }
    if (this.formData.get('thoiGianDuKien').value) {
      body.tgianGnhanTu = dayjs(this.formData.get('thoiGianDuKien').value[0]).format('YYYY-MM-DD');
      body.tgianGnhanDen = dayjs(this.formData.get('thoiGianDuKien').value[1]).format('YYYY-MM-DD')
    }
    if (this.formData.get('thoiGianDuKienSauDc').value) {
      body.ngayHlucSauDcTu = dayjs(this.formData.get('thoiGianDuKienSauDc').value[0]).format('YYYY-MM-DD');
      body.ngayHlucSauDcDen = dayjs(this.formData.get('thoiGianDuKienSauDc').value[1]).format('YYYY-MM-DD')
    }
    body.phuLucDtl = this.dataTable;
    await this.createUpdate(body);
    await this.helperService.restoreRequiredForm(this.formData);
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    this.setValidForm();
    let body = {
      ...this.formData.value,
      soPhuLuc: this.formData.value.soPhuLuc ? this.formData.value.soPhuLuc + this.maHopDongSuffix : null
    }
    if (this.formData.get('thoiGianDuKien').value) {
      body.tgianGnhanTu = dayjs(this.formData.get('thoiGianDuKien').value[0]).format('YYYY-MM-DD');
      body.tgianGnhanDen = dayjs(this.formData.get('thoiGianDuKien').value[1]).format('YYYY-MM-DD')
    }
    if (this.formData.get('thoiGianDuKienSauDc').value) {
      body.ngayHlucSauDcTu = dayjs(this.formData.get('thoiGianDuKienSauDc').value[0]).format('YYYY-MM-DD');
      body.ngayHlucSauDcDen = dayjs(this.formData.get('thoiGianDuKienSauDc').value[1]).format('YYYY-MM-DD')
    }
    body.phuLucDtl = this.dataTable;
    await super.saveAndSend(body, trangThai, msg, msgSuccess);
  }

  convertTienTobangChu(tien: number): string {
    return convertTienTobangChu(tien);
  }

  setValidForm() {
    this.formData.controls["tenHd"].setValidators([Validators.required]);
    this.formData.controls["ngayHluc"].setValidators([Validators.required]);
    this.formData.controls["ngayHlucPhuLuc"].setValidators([Validators.required]);
    this.formData.controls["noiDungPhuLuc"].setValidators([Validators.required]);
    this.formData.controls["thoiGianDuKien"].setValidators([Validators.required]);
    this.formData.controls["thoiGianDuKienSauDc"].setValidators([Validators.required]);
    this.formData.controls["tgianThienHd"].setValidators([Validators.required]);
    this.formData.controls["tgianThienHdSauDc"].setValidators([Validators.required]);
  }
}

