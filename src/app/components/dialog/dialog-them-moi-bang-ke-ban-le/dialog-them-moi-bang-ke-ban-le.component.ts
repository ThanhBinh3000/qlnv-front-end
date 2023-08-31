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
        soLuongBanTrucTiep: [],
        soLuongConLai: [],
        nguoiPhuTrach: [''],
        diaChi: [''],
        ngayBanHang: [''],
        loaiVthh: [''],
        cloaiVthh: [''],
        soLuongBanLe: [],
        donGia: [],
        thanhTien: [],
        tenNguoiMua: [''],
        diaChiNguoiMua: [''],
        cmt: [''],
        ghiChu: [''],
        tenDvi: [''],
        tenLoaiVthh: [''],
        tenCloaiVthh: [''],
      });
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      if (this.idInput) {
        await this.loadChiTiet(this.idInput);
      } else {
        await this.initForm();
      }
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  async initForm() {
    let id = await this.userService.getId('XH_BANG_KE_BTT_SEQ')
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      soBangKe: `${id}/${this.formData.value.namKh}/BK-CCDT KVVP`,
    });
    await this.loadBangKeBanHang()
  }

  async loadBangKeBanHang() {
    let body = {
      namKh: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
    }
    let res = await this.bangKeBttService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data
      if (data && data.content && data.content.length > 0) {
        this.loadBangKeBanLe = data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadChiTiet(id) {
    await this.detail(id);
  }

  async openDialogNhiemVu() {
    await this.spinner.show();
    let body = {
      loaiVthh: this.loaiVthh,
      trangThai: STATUS.BAN_HANH,
      pthucBanTrucTiep: '03',
      namKh: this.formData.value.namKh
    };
    let res = await this.quyetDinhNvXuatBttService.search(body)
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data.content
      if (data && data.length > 0) {
        let set = new Set(this.loadBangKeBanLe.map((item => JSON.stringify({soQdNv: item.soQdNv}))));
        this.listNhiemVuXh = data.filter(item => {
          const key = JSON.stringify({soQdNv: item.soQdNv});
          return !set.has(key);
        });
        this.listNhiemVuXh = this.listNhiemVuXh.filter(item => item.children.some(child => child.maDvi === this.userInfo.MA_DVI));
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
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
        dataHeader: ['Số quyết định phê duyệt kế hoạch BDG', 'Tên loại hàng hóa', 'Tên chủng loại vật tư hàng háo'],
        dataColumn: ['soQdNv', 'tenLoaiVthh', 'tenCloaiVthh'],
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.onChangeQdBanLe(data.id);
      }
    });
    await this.spinner.hide();
  }

  async onChangeQdBanLe(id) {
    await this.spinner.show();
    if (id > 0) {
      await this.quyetDinhNvXuatBttService.getDetail(id)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const data = res.data
            this.formData.patchValue({
              idQdNv: data.id,
              soQdNv: data.soQdNv,
              soLuongBanTrucTiep: data.soLuongBanTrucTiep,
              loaiVthh: data.loaiVthh,
              tenLoaiVthh: data.tenLoaiVthh,
              cloaiVthh: data.cloaiVthh,
              tenCloaiVthh: data.tenCloaiVthh,
            });
            data.children.forEach((item) => {
              item.children.find((child) => {
                this.formData.patchValue({
                  donGia: child?.donGiaDuocDuyet
                });
              })
            })
          }
        }).catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
    await this.spinner.hide();
  }

  async changeSoLuong(event) {
    this.formData.patchValue({
      soLuongConLai: this.formData.value.soLuongBanTrucTiep - event,
      thanhTien: this.formData.value.donGia * event
    });
  }

  async save() {
    await this.helperService.ignoreRequiredForm(this.formData);
    this.setValidator();
    let body = this.formData.value;
    await this.createUpdate(body);
    await this.helperService.restoreRequiredForm(this.formData);
  }

  onCancel() {
    this._modalRef.destroy();
  }

  setValidator() {
    this.formData.controls["soBangKe"].setValidators([Validators.required]);
    this.formData.controls["tenDvi"].setValidators([Validators.required]);
    this.formData.controls["soQdNv"].setValidators([Validators.required]);
    this.formData.controls["namKh"].setValidators([Validators.required]);
    this.formData.controls["nguoiPhuTrach"].setValidators([Validators.required]);
    this.formData.controls["diaChi"].setValidators([Validators.required]);
    this.formData.controls["ngayBanHang"].setValidators([Validators.required]);
    this.formData.controls["tenLoaiVthh"].setValidators([Validators.required]);
    this.formData.controls["tenCloaiVthh"].setValidators([Validators.required]);
    this.formData.controls["soLuongBanLe"].setValidators([Validators.required]);
    this.formData.controls["tenNguoiMua"].setValidators([Validators.required]);
    this.formData.controls["diaChiNguoiMua"].setValidators([Validators.required]);
    this.formData.controls["cmt"].setValidators([Validators.required]);
  }
}
