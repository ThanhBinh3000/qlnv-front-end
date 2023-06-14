import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import * as dayjs from 'dayjs';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { BangKeBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/bang-ke-btt.service';
import { DialogTableSelectionComponent } from '../dialog-table-selection/dialog-table-selection.component';
import { STATUS } from 'src/app/constants/status';
import { QuyetDinhNvXuatBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/quyet-dinh-nv-xuat-btt/quyet-dinh-nv-xuat-btt.service';
import { Validators } from '@angular/forms';
import { MESSAGE } from 'src/app/constants/message';

@Component({
  selector: 'app-dialog-them-moi-bang-ke-ban-le',
  templateUrl: './dialog-them-moi-bang-ke-ban-le.component.html',
  styleUrls: ['./dialog-them-moi-bang-ke-ban-le.component.scss']
})
export class DialogThemMoiBangKeBanLeComponent extends Base2Component implements OnInit {
  idInput: any;
  loaiVthh: String;
  maTrinh: string = '';
  @Input()
  id: number;

  loadBangKeBanLe: any[] = [];

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
        id: [null],
        namKh: [dayjs().get('year')],
        soBangKe: [''],
        maDvi: ['', [Validators.required]],
        tenDvi: ['', [Validators.required]],
        idQdNv: [],
        soQdNv: ['', [Validators.required]],
        soLuongBanTrucTiep: [],
        soLuongConLai: [],
        nguoiPhuTrach: ['', [Validators.required]],
        diaChi: ['', [Validators.required]],
        ngayBanHang: ['', [Validators.required]],
        loaiVthh: [''],
        tenLoaiVthh: [''],
        cloaiVthh: [''],
        tenCloaiVthh: [''],
        soLuongBanLe: [, [Validators.required]],
        donGia: [],
        thanhTien: [],
        tenNguoiMua: ['', [Validators.required]],
        diaChiNguoiMua: ['', [Validators.required]],
        cmt: ['', [Validators.required]],
        ghiChu: [''],
      });
  }

  async ngOnInit() {
    if (this.idInput) {
      await this.loadChiTiet(this.idInput);
    } else {
      this.initForm();
      await this.loadBangKeBanHang()
    }
  }

  async initForm() {
    let id = await this.userService.getId('XH_BANG_KE_BTT_SEQ')
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maDvi: this.userInfo.MA_DVI,
      soBangKe: `${id}/${dayjs().get('year')}/BK-CCDT KVVP`,
    });
  }

  async loadChiTiet(id) {
    let data = await this.detail(id);
    this.formData.patchValue({
      soBangKe: data.soBangKe,
    })
  }

  async openDialogNvXh() {
    this.spinner.show()
    let listNvXh: any[] = [];
    let body = {
      maChiCuc: this.userInfo.MA_DVI,
      loaiVthh: this.loaiVthh,
      trangThai: STATUS.BAN_HANH,
      pthucBanTrucTiep: '03',
      namKh: this.formData.value.namKh
    };
    let res = await this.quyetDinhNvXuatBttService.search(body)
    if (res.msg == MESSAGE.SUCCESS) {
      const data = [
        ...res.data.content.filter((item) => {
          return !this.loadBangKeBanLe.some((child) => {
            if (child.soQdNv != null && item.soQdNv != null) {
              return item.soQdNv === child.soQdNv;
            }
          })
        })
      ]
      listNvXh = data
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
    const modalQD = this.modal.create({
      nzTitle: 'THÔNG TIN QUYẾT ĐỊNH BÁN LẺ',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataHeader: ['Số quyết định phê duyệt kế hoạch BDG', 'Tên loại hàng hóa', 'Tên chủng loại vật tư hàng háo'],
        dataColumn: ['soQdNv', 'tenLoaiVthh', 'tenCloaiVthh'],
        dataTable: listNvXh
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.onChangeQdBanLe(data.id);
      }
    });
  }

  async loadBangKeBanHang() {
    let body = {
      maDvi: this.userInfo.MA_DVI,
      namKh: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
    }
    let res = await this.bangKeBttService.search(body);
    if (res.data) {
      this.loadBangKeBanLe = res.data.content;
    }
  }

  async onChangeQdBanLe(id) {
    if (id > 0) {
      await this.quyetDinhNvXuatBttService.getDetail(id)
        .then(async (resKq) => {
          const dataNvXh = resKq.data;
          if (resKq.data) {
            this.formData.patchValue({
              idQdNv: dataNvXh.id,
              soQdNv: dataNvXh.soQdNv,
              soLuongBanTrucTiep: dataNvXh.soLuongBanTrucTiep,
              loaiVthh: dataNvXh.loaiVthh,
              tenLoaiVthh: dataNvXh.tenLoaiVthh,
              cloaiVthh: dataNvXh.cloaiVthh,
              tenCloaiVthh: dataNvXh.tenCloaiVthh,
            });
            dataNvXh.children.forEach((item) => {
              this.formData.patchValue({
                donGia: item.children[0].donGiaDuocDuyet
              });
            })
          }
        })
    }
  }

  async save() {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    let data = await this.createUpdate(body);
    if (data) {
      this.onCancel()
    }
  }

  onCancel() {
    this._modalRef.destroy();
  }

  isDisable(): boolean {
    if (this.idInput > 0) {
      return true
    } else {
      return false;
    }
  }

}
