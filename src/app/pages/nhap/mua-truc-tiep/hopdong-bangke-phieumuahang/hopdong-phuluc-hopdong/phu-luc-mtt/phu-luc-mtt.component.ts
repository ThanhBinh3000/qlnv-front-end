import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import dayjs from 'dayjs';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { convertTienTobangChu } from 'src/app/shared/commonFunction';
import { STATUS } from 'src/app/constants/status';
import { DonviService } from 'src/app/services/donvi.service';
import { isEmpty } from 'lodash';
import { MESSAGE } from 'src/app/constants/message';
import { MttHopDongPhuLucHdService } from 'src/app/services/qlnv-hang/nhap-hang/mua-truc-tiep/MttHopDongPhuLucHdService.service';
@Component({
  selector: 'app-phu-luc-mtt',
  templateUrl: './phu-luc-mtt.component.html',
  styleUrls: ['./phu-luc-mtt.component.scss']
})
export class PhuLucMttComponent extends Base2Component implements OnInit {
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
    private thongTinPhuLucHopDongService: MttHopDongPhuLucHdService,
    private donViService: DonviService,
    private danhMucService: DanhMucService
  ) {
    super(httpClient, storageService, notification, spinner, modal, thongTinPhuLucHopDongService);
    this.formData = this.fb.group(
      {
        id: [],
        idHd: [],
        namHd: [dayjs().get('year')],
        soHd: ['', [Validators.required]],
        tenHd: ['', [Validators.required]],
        ngayHluc: [null, [Validators.required]],
        soPhuLuc: ['', [Validators.required]],
        ngayHlucPhuLuc: [null, [Validators.required]],
        noiDungPl: ['', [Validators.required]],
        thoiGianDuKien: [null, [Validators.required]],
        tgianGnhanTu: [],
        tgianGnhanDen: [],
        thoiGianDuKienSauDc: [null, [Validators.required]],
        ngayHlucSauDcTu: [],
        ngayHlucSauDcDen: [],
        tgianThienHd: [],
        tgianThienHdSauDc: [null, [Validators.required]],
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
        console.log(this.objHopDongHdr, 1111)
        let row = {
          // tenDviHd: s.tenDvi,
          // diaChiHd: s.diaChi,
          // tongSoLuongHd: s.tongSoLuong,
          // donGiaVatHd: s.donGiaVat,
          idHdDtl: s.id,
          tenDviHd: s.tenDvi,
          diaChiHd: s.diaChi,
          soLuong: s.soLuong,
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
    body.fileDinhKems = this.fileDinhKem;
    let data = await this.thongTinPhuLucHopDongService.createPl(body);
    if (data.data) {
      if (isOther) {
        this.formData.patchValue({
          id: data.data.id,
          trangThaiPhuLuc: data.data.trangThaiPhuLuc
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
          let res = await this.thongTinPhuLucHopDongService.approve(body);
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


