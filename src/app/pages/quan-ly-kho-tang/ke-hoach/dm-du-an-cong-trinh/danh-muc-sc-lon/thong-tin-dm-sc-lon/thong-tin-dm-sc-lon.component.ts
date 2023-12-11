import {Component, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {MESSAGE} from "../../../../../../constants/message";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {DonviService} from "../../../../../../services/donvi.service";
import {Validators} from "@angular/forms";
import {
  DanhMucSuaChuaService
} from "../../../../../../services/qlnv-kho/quy-hoach-ke-hoach/danh-muc-kho/danh-muc-sua-chua.service";
import dayjs from "dayjs";
import { STATUS } from "../../../../../../constants/status";

@Component({
  selector: 'app-thong-tin-dm-sc-lon',
  templateUrl: './thong-tin-dm-sc-lon.component.html',
  styleUrls: ['./thong-tin-dm-sc-lon.component.scss']
})
export class ThongTinDmScLonComponent extends Base2Component implements OnInit {
  isViewDetail: boolean;
  dataDetail: any
  dsKho: any[] = [];
  dsChiCuc: any[] = [];
  listLoaiCongTrinh: any[] = [];
  listKhoi: any[] = [];
  listTrangThai: any[] = [
    {ma: this.STATUS.CHUA_THUC_HIEN, giaTri: 'Chưa thực hiện'},
    {ma: this.STATUS.DANG_THUC_HIEN, giaTri: 'Đang thực hiện'},
    {ma: this.STATUS.DA_HOAN_THANH, giaTri: 'Đã hoàn thành'},
  ];

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucSc: DanhMucSuaChuaService,
    private danhMucService: DanhMucService,
    private _modalRef: NzModalRef,
    private dviService: DonviService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, danhMucSc);
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null],
      namKh: [dayjs().get('year'), Validators.required],
      soQd: [null],
      maCongTrinh: [null, Validators.required],
      tenCongTrinh: [null, Validators.required],
      maDiemKho: [null, Validators.required],
      diaDiem : [],
      tgThucHien: [null, Validators.required],
      tgHoanThanh: [null, Validators.required],
      khoi: [null, Validators.required],
      tieuChuan: [null],
      loaiCongTrinh: [null],
      maChiCuc: [null],
      tmdt: [null],
      lyDo: [null],
      tgSuaChua: [null],
      soQdPheDuyet: [null],
      ngayQdPd: [null],
      giaTriPd: [null],
      trangThai: [STATUS.CHUA_THUC_HIEN],
      type: ["00"],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      await this.loadDsChiCuc()
      await this.loadDsLoaiCongTrinh()
      await this.loadDsKhoi()
      if (this.dataDetail) {
        await this.getDetail(this.dataDetail.id)
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadDsKhoi() {
    this.listKhoi = [];
    let res = await this.danhMucService.danhMucChungGetAll('KHOI_DU_AN_KT');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listKhoi = res.data;
    }
  }

  async loadDsLoaiCongTrinh() {
    this.listLoaiCongTrinh = [];
    let res = await this.danhMucService.danhMucChungGetAll('LOAI_CONG_TRINH_SCL_KT');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiCongTrinh = res.data;
    }
  }

  async getDetail(id) {
    this.spinner.show();
    try {
      let res = await this.danhMucSc.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.fileDinhKem = data.fileDinhKems;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        this.spinner.hide();
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e);
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }

  async changeChiCuc(event) {
    const dsTong = await this.dviService.layTatCaDonViByLevel(4);
    this.dsKho = dsTong.data
    this.dsKho = this.dsKho.filter(item => item.maDvi.startsWith(event) && item.type != 'PB')
  }

  async loadDsChiCuc() {
    const dsTong = await this.dviService.layTatCaDonViByLevel(3);
    this.dsChiCuc = dsTong.data
    this.dsChiCuc = this.dsChiCuc.filter(item => item.maDvi.startsWith(this.userInfo.MA_DVI) && item.type != 'PB')
  }

  async handleOk(data: string) {
    this.helperService.markFormGroupTouched(this.formData)
    if (this.formData.invalid) {
      return;
    }
    let body = this.formData.value
    body.maDvi = this.userInfo.MA_DVI
    body.fileDinhKems = this.fileDinhKem
    let res = await this.createUpdate(body);
    if (res) {
      this._modalRef.close(data);
    }
  }

  onCancel() {
    this._modalRef.close();
  }

  changeDiemKho($event: any) {
    let result = this.dsKho.filter(item => item.maDvi == $event)
    if (result && result.length > 0) {
      this.formData.patchValue({
        diaDiem : result[0].diaChi
      })
    }
  }
}
