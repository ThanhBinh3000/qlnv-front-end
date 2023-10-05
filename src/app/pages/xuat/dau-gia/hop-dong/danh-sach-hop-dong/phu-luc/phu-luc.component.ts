import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {MESSAGE} from 'src/app/constants/message';
import {NgxSpinnerService} from 'ngx-spinner';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from './../../../../../../services/storage.service';
import {
  HopDongXuatHangService
} from './../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/hop-dong/hopDongXuatHang.service';
import dayjs from 'dayjs';
import {STATUS} from 'src/app/constants/status';
import {convertTienTobangChu} from 'src/app/shared/commonFunction';
import {FileDinhKem} from "../../../../../../models/FileDinhKem";
import {cloneDeep} from 'lodash';

@Component({
  selector: 'app-phu-luc',
  templateUrl: './phu-luc.component.html',
  styleUrls: ['./phu-luc.component.scss'],
})
export class PhuLucComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: String;
  @Input() idPhuLuc: number;
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
    private hopDongXuatHangService: HopDongXuatHangService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, hopDongXuatHangService);
    this.formData = this.fb.group(
      {
        id: [],
        idHopDong: [],
        nam: [dayjs().get('year')],
        soHopDongClone: [''],
        tenHopDong: [''],
        ngayHieuLuc: [''],
        soPhuLuc: [''],
        ngayHlucPhuLuc: [''],
        veViecPhuLuc: [''],
        NgayHieuLucHopDong: [''],
        ngayHieuLucHdTu: [''],
        ngayHieuLucHdDen: [''],
        ngayHieuLucPhuLuc: [''],
        ngayHlucSauDcTu: [''],
        ngayHlucSauDcDen: [''],
        soNgayThuHienHd: [],
        soNgayThienSauDc: [],
        noiDungPhuLuc: [''],
        ghiChuPhuLuc: [''],
        trangThai: [STATUS.DU_THAO],
        tenTrangThai: ['Dự thảo'],
        filePhuLuc: [new Array<FileDinhKem>()],
      }
    );
  }

  async ngOnInit() {
    try {
      this.maHopDongSuffix = `/${this.formData.value.nam}/PLHĐ`;
      if (this.idPhuLuc) {
        await this.loadChiTiet(this.idPhuLuc);
      } else {
        await this.loadDsHopDong();
      }
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async loadChiTiet(id) {
    if (!id) return;
    const data = await this.detail(id);
    if (!data) return;
    const {soPhuLuc, ngayHlucSauDcTu, ngayHlucSauDcDen, children} = data;
    this.formData.patchValue({
      soPhuLuc: soPhuLuc?.split('/')[0] || null,
      ngayHieuLucPhuLuc: ngayHlucSauDcTu && ngayHlucSauDcDen ? [ngayHlucSauDcTu, ngayHlucSauDcDen] : null,
    })
    this.dataTable = cloneDeep(children);
    if (this.objHopDongHdr) {
      await this.loadDsHopDong();
    }
  }

  async loadDsHopDong() {
    if (this.objHopDongHdr) {
      this.formData.patchValue({
        idHopDong: this.objHopDongHdr.id,
        soHopDongClone: this.objHopDongHdr.soHopDong,
        tenHopDong: this.objHopDongHdr.tenHopDong,
        ngayHieuLuc: this.objHopDongHdr.ngayHieuLuc,
        NgayHieuLucHopDong: this.objHopDongHdr.ngayHieuLuc && this.objHopDongHdr.tgianThienHdong ? [this.objHopDongHdr.ngayHieuLuc, this.objHopDongHdr.tgianThienHdong] : null,
        soNgayThuHienHd: this.objHopDongHdr.tgianThienHdongNgay,
      });
      if (this.idPhuLuc === 0) {
        this.dataTable.push(...this.objHopDongHdr.children);
      }
    }
  }

  async save() {
    try {
      const formDataValue = this.formData.value;
      const ngayHieuLucPhuLuc = this.formData.get('ngayHieuLucPhuLuc').value;
      await this.helperService.ignoreRequiredForm(this.formData);
      const body = {
        ...formDataValue,
        soPhuLuc: formDataValue.soPhuLuc ? formDataValue.soPhuLuc + this.maHopDongSuffix : null,
        ngayHlucSauDcTu: ngayHieuLucPhuLuc ? dayjs(ngayHieuLucPhuLuc[0]).format('YYYY-MM-DD') : null,
        ngayHlucSauDcDen: ngayHieuLucPhuLuc ? dayjs(ngayHieuLucPhuLuc[1]).format('YYYY-MM-DD') : null,
        children: this.dataTable,
      };
      await this.createUpdate(body);
      await this.helperService.restoreRequiredForm(this.formData);
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
    }
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    try {
      const formDataValue = this.formData.value;
      const ngayHieuLucPhuLucValue = this.formData.get('ngayHieuLucPhuLuc').value;
      const body = {
        ...formDataValue,
        soPhuLuc: formDataValue.soPhuLuc ? formDataValue.soPhuLuc + this.maHopDongSuffix : null,
        ngayHlucSauDcTu: ngayHieuLucPhuLucValue ? dayjs(ngayHieuLucPhuLucValue[0]).format('YYYY-MM-DD') : null,
        ngayHlucSauDcDen: ngayHieuLucPhuLucValue ? dayjs(ngayHieuLucPhuLucValue[1]).format('YYYY-MM-DD') : null,
        children: this.dataTable,
      };
      await super.saveAndSend(body, trangThai, msg, msgSuccess);
    } catch (error) {
      console.error("Lỗi khi lưu và gửi dữ liệu:", error);
    }
  }

  convertTienTobangChu(tien: number): string {
    return convertTienTobangChu(tien);
  }
}

