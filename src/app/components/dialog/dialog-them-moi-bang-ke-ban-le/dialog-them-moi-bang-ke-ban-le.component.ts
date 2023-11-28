import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import * as dayjs from 'dayjs';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {BangKeBttService} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/bang-ke-btt.service';
import {DialogTableSelectionComponent} from '../dialog-table-selection/dialog-table-selection.component';
import {STATUS} from 'src/app/constants/status';
import {
  QuyetDinhNvXuatBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/quyet-dinh-nv-xuat-btt/quyet-dinh-nv-xuat-btt.service';
import {Validators} from '@angular/forms';
import {MESSAGE} from 'src/app/constants/message';
import {LOAI_HANG_DTQG} from 'src/app/constants/config';
import {AMOUNT_ONE_DECIMAL} from "../../../Utility/utils";

@Component({
  selector: 'app-dialog-them-moi-bang-ke-ban-le',
  templateUrl: './dialog-them-moi-bang-ke-ban-le.component.html',
  styleUrls: ['./dialog-them-moi-bang-ke-ban-le.component.scss']
})
export class DialogThemMoiBangKeBanLeComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: String;
  @Input() idInput: number;
  @Input() isView: boolean;
  loadBangKeBanLe: any[] = [];
  listNhiemVuXh: any[] = [];
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  amount = {...AMOUNT_ONE_DECIMAL};
  sumSlDaLap: number = 0

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private _modalRef: NzModalRef,
    private bangKeBttService: BangKeBttService,
    private quyetDinhNvXuatBttService: QuyetDinhNvXuatBttService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bangKeBttService);
    this.formData = this.fb.group(
      {
        id: [],
        namKh: [dayjs().get('year')],
        maDvi: [''],
        soBangKe: [''],
        idQdNv: [],
        soQdNv: [''],
        ngayKyQdNv: [''],
        slXuatBanQdPd: [],
        soLuongConLai: [],
        nguoiPhuTrach: [''],
        diaChi: [''],
        ngayBanHang: [''],
        loaiVthh: [''],
        cloaiVthh: [''],
        soLuong: [],
        donGia: [],
        thanhTien: [],
        tenBenMua: [''],
        diaChiBenMua: [''],
        cmtBenMua: [''],
        ghiChu: [''],
        tenDvi: [''],
        tenLoaiVthh: [''],
        tenCloaiVthh: [''],
        tenNguoiTao: [''],
      });
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.amount.align = "left";
      if (this.idInput) {
        await this.detail(this.idInput);
      } else {
        await this.initForm();
      }
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async initForm() {
    try {
      const id = await this.userService.getId('XH_BANG_KE_BTT_SEQ');
      this.formData.patchValue({
        tenNguoiTao: this.userInfo.TEN_DAY_DU,
        tenDvi: this.userInfo.TEN_DVI,
        soBangKe: `${id}/${this.formData.value.namKh}/BK-CCDT KVVP`,
      });
    } catch (error) {
      console.error('Error in initForm:', error);
    }
  }

  async loadBangKeBanHang() {
    let body = {
      namKh: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
    }
    let res = await this.bangKeBttService.search(body);
    if (res.msg !== MESSAGE.SUCCESS) {
      this.notification.error(MESSAGE.ERROR, res.msg);
      return;
    }
    const data = res.data.content;
    if (!data || data.length === 0) {
      return;
    }
    this.loadBangKeBanLe = data
  }

  async openDialogNhiemVu() {
    try {
      await this.spinner.show();
      const body = {
        loaiVthh: this.loaiVthh,
        trangThai: STATUS.BAN_HANH,
        pthucBanTrucTiep: '03',
        namKh: this.formData.value.namKh
      };
      const res = await this.quyetDinhNvXuatBttService.search(body);
      if (res.msg === MESSAGE.SUCCESS) {
        this.listNhiemVuXh = res.data.content.filter(item => item.children.some(child => child.maDvi === this.userInfo.MA_DVI));
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      const modalQD = this.modal.create({
        nzTitle: 'THÔNG TIN QUYẾT ĐỊNH BÁN LẺ',
        nzContent: DialogTableSelectionComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          dataTable: this.listNhiemVuXh,
          dataHeader: ['Số quyết định nhiệm vụ', 'Ngày ký quyết định nhiệm vụ', 'Tên loại vật tư hàng hóa'],
          dataColumn: ['soQdNv', 'ngayKyQdNv', 'tenLoaiVthh'],
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          await this.onChangeQdBanLe(data.id);
        }
      });
    } catch (error) {
      console.error('error: ', error);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async onChangeQdBanLe(id) {
    if (id <= 0) return;
    try {
      await this.spinner.show();
      const res = await this.quyetDinhNvXuatBttService.getDetail(id);
      if (res.msg === MESSAGE.SUCCESS) {
        const data = res.data;
        this.formData.patchValue({
          idQdNv: data.id,
          soQdNv: data.soQdNv,
          ngayKyQdNv: data.ngayKyQdNv,
          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          cloaiVthh: data.cloaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          ngayBanHang: data.tgianGiaoNhan,
        });
        const childWithDonGia = data.children.find(item => item.children.length > 0 && item.maDvi === this.userInfo.MA_DVI);
        if (childWithDonGia) {
          this.formData.patchValue({
            donGia: childWithDonGia.children[0].donGia || null,
            slXuatBanQdPd: childWithDonGia.soLuong || null,
          });
        }
        await this.loadBangKeBanHang();
        const listBangKeBanLe = this.loadBangKeBanLe.filter(item => item.idQdNv === data.id);
        this.sumSlDaLap = listBangKeBanLe.reduce((prev, cur) => prev + cur.soLuong, 0);
        this.formData.patchValue({
          soLuongConLai: this.sumSlDaLap,
        });
      }
    } catch (error) {
      console.error('error: ', error);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async changeSoLuong(event) {
    if (event) {
      this.formData.patchValue({
        soLuongConLai: this.formData.value.slXuatBanQdPd - (event + this.sumSlDaLap),
        thanhTien: this.formData.value.donGia * event
      });
    }
  }

  async save() {
    try {
      await this.helperService.ignoreRequiredForm(this.formData);
      const body = this.formData.value;
      await this.createUpdate(body);
    } catch (error) {
      console.error('Error in save:', error);
      this.notification.error(MESSAGE.ERROR, error.message || MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.helperService.restoreRequiredForm(this.formData);
    }
  }

  onCancel() {
    this._modalRef.destroy();
  }
}
