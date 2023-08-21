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

@Component({
  selector: 'app-phu-luc-btt',
  templateUrl: './phu-luc-btt.component.html',
  styleUrls: ['./phu-luc-btt.component.scss']
})
export class PhuLucBttComponent extends Base2Component implements OnInit {
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
        tenDvi: [],
        namHd: [dayjs().get('year')],
        soHd: [''],
        tenHd: [''],
        ngayHluc: [null,],
        soPhuLuc: [''],
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
        kieuNx: [],
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
      this.dataTable.forEach(s => {
        s.donGia = this.objHopDongHdr.donGiaBanTrucTiep ?? null;
        s.thanhTien = this.objHopDongHdr.thanhTien ?? null;
      })
    }
    this.fileDinhKem = data.fileDinhKems;
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
        soHd: this.objHopDongHdr.soHd ?? null,
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

  async save(isOther?) {
    this.setValidator(isOther);
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
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
    body.soPhuLuc = this.formData.value.soPhuLuc + this.maHopDongSuffix;
    body.phuLucDtl = this.dataTable;
    body.fileDinhKems = this.fileDinhKem;
    let data = await this.createUpdate(body);
    if (data) {
      if (isOther) {
        this.formData.patchValue({
          id: data.id,
          trangThai: data.trangThai
        })
        this.pheDuyet();
      } else {
        if (this.idPhuLuc > 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        }
        this.goBack();
      }
    }
  }

  pheDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn Ký?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.formData.get('id').value,
            trangThai: STATUS.DA_KY
          };
          let res = await this.hopDongBttService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(
              MESSAGE.SUCCESS,
              MESSAGE.THAO_TAC_SUCCESS,
            );
            this.goBack();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  isDisabled() {
    if (this.formData.value.trangThai == STATUS.DU_THAO) {
      return false;
    } else {
      return true;
    }
  }

  convertTienTobangChu(tien: number): string {
    return convertTienTobangChu(tien);
  }

  setValidator(isOther) {
    if (isOther) {
      this.formData.controls["soHd"].setValidators([Validators.required]);
      this.formData.controls["tenHd"].setValidators([Validators.required]);
      this.formData.controls["ngayHluc"].setValidators([Validators.required]);
      this.formData.controls["soPhuLuc"].setValidators([Validators.required]);
      this.formData.controls["ngayHlucPhuLuc"].setValidators([Validators.required]);
      this.formData.controls["noiDungPhuLuc"].setValidators([Validators.required]);
      this.formData.controls["thoiGianDuKien"].setValidators([Validators.required]);
      this.formData.controls["thoiGianDuKienSauDc"].setValidators([Validators.required]);
      this.formData.controls["tgianThienHd"].setValidators([Validators.required]);
      this.formData.controls["tgianThienHdSauDc"].setValidators([Validators.required]);
    } else {
      this.formData.controls["soHd"].clearValidators();
      this.formData.controls["tenHd"].clearValidators();
      this.formData.controls["ngayHluc"].clearValidators();
      this.formData.controls["soPhuLuc"].clearValidators();
      this.formData.controls["ngayHlucPhuLuc"].clearValidators();
      this.formData.controls["noiDungPhuLuc"].clearValidators();
      this.formData.controls["thoiGianDuKien"].clearValidators();
      this.formData.controls["thoiGianDuKienSauDc"].clearValidators();
      this.formData.controls["tgianThienHd"].clearValidators();
      this.formData.controls["tgianThienHdSauDc"].clearValidators();
    }
  }
}

