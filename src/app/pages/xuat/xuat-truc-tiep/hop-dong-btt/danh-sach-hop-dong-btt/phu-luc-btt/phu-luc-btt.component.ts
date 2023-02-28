import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import dayjs from 'dayjs';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { convertTienTobangChu } from 'src/app/shared/commonFunction';
import { HopDongBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/hop-dong-btt.service';
import { STATUS } from 'src/app/constants/status';
import { DonviService } from 'src/app/services/donvi.service';
import { isEmpty } from 'lodash';
import { MESSAGE } from 'src/app/constants/message';


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

  fileDinhKem: Array<FileDinhKem> = [];
  maHopDongSuffix: string = '';
  dsDonvi: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hopDongBttService: HopDongBttService,
    private donviService: DonviService,
    private danhMucService: DanhMucService
  ) {
    super(httpClient, storageService, notification, spinner, modal, hopDongBttService);
    this.formData = this.fb.group(
      {
        id: [],
        idHd: [],
        namHd: [dayjs().get('year')],
        soHd: [null, [Validators.required]],
        tenHd: [null, [Validators.required]],
        ngayHluc: [null, [Validators.required]],
        soPhuLuc: [],
        ngayHlucPhuLuc: [],
        noiDungPhuLuc: [],
        thoiGianDuKien: [],
        tgianGnhanTu: [],
        tgianGnhanDen: [],
        thoiGianDuKienSauDc: [],
        ngayHlucSauDcTu: [],
        ngayHlucSauDcDen: [],
        tgianThienHd: [],
        tgianThienHdSauDc: [],
        noiDungDcKhac: [],
        ghiChuPhuLuc: [],
        trangThaiPhuLuc: STATUS.DU_THAO,
        tenTrangThaiPhuLuc: ['Dự thảo'],
        kieuNx: [],
      }
    );
  }

  async ngOnInit() {
    this.maHopDongSuffix = `/${this.formData.value.namHd}/HĐMB`;
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
    this.formData.patchValue({
      soPhuLuc: data.soPhuLuc.split('/')[0],
      thoiGianDuKienSauDc: (data.ngayHlucSauDcTu && data.ngayHlucSauDcDen) ? [data.ngayHlucSauDcTu, data.ngayHlucSauDcDen] : null,
      thoiGianDuKien: (data.tgianGnhanTu && data.tgianGnhanDen) ? [data.tgianGnhanTu, data.tgianGnhanDen] : null
    })
    this.dataTable = data.phuLucDtl;
  }

  async loadDsDonVi() {
    let body = {
      trangThai: "01",
      maDviCha: this.userInfo.MA_DVI.substring(0, 4),
      type: "DV"
    };
    let res = await this.donviService.getDonViTheoMaCha(body);
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
      this.formData.patchValue({
        idHd: this.objHopDongHdr.id ?? null,
        soHd: this.objHopDongHdr.soHd ?? null,
        tenHd: this.objHopDongHdr.tenHd ?? null,
        ngayHluc: this.objHopDongHdr.ngayHluc ?? null,
        thoiGianDuKien: (this.objHopDongHdr.tgianGnhanTu && this.objHopDongHdr.tgianGnhanDen) ? [this.objHopDongHdr.tgianGnhanTu, this.objHopDongHdr.tgianGnhanDen] : null,
        tgianThienHd: this.objHopDongHdr.tgianThienHd ?? null,
        // trangThaiPhuLuc: this.objHopDongHdr.trangThaiPhuLuc ?? null,
        // tenTrangThaiPhuLuc: this.objHopDongHdr.tenTrangThaiPhuLuc ?? null,
      });
      this.objHopDongHdr.children.forEach(s => {
        let row = {
          // tenDviHd: s.tenDvi,
          // diaChiHd: s.diaChi,
          // tongSoLuongHd: s.tongSoLuong,
          // donGiaVatHd: s.donGiaVat,
          idHdDtl: s.id,
          tenDviHd: s.tenDvi,
          diaChiHd: s.diaChi,
          tongSoLuong: s.tongSoLuong,
          donGiaVat: s.donGiaVat,
        }
        this.dataTable = [...this.dataTable, row]
      });

    }
  }

  async save(isOther: boolean) {
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
    let data = await this.createUpdate(body);
    if (data) {
      if (isOther) {
        this.formData.patchValue({
          id: data.id,
          trangThaiPhuLuc: data.trangThaiPhuLuc
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
            trangThaiPhuLuc: STATUS.DA_KY
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
    return false;
  }

  convertTienTobangChu(tien: number): string {
    return convertTienTobangChu(tien);
  }

}

