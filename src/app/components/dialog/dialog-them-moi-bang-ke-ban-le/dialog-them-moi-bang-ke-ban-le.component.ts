import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Validators } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import * as dayjs from 'dayjs';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { BangKeBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/bang-ke-btt.service';
import { QuyetDinhNvXuatBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/quyet-dinh-nv-xuat-btt/quyet-dinh-nv-xuat-btt.service';
import { DialogTableSelectionComponent } from '../dialog-table-selection/dialog-table-selection.component';
import { HopDongBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/hop-dong-btt.service';

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
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private _modalRef: NzModalRef,
    private bangKeBttService: BangKeBttService,
    private quyetDinhNvXuatBttService: QuyetDinhNvXuatBttService,
    private hopDongBttService: HopDongBttService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bangKeBttService);
    this.formData = this.fb.group(
      {
        id: [],
        namKh: [dayjs().get('year'), [Validators.required]],
        soBangKe: ['', [Validators.required]],
        soQd: ['', [Validators.required]],
        maDvi: [''],
        tenDvi: ['', [Validators.required]],
        soLuong: [],
        soLuongConLai: [],
        nguoiPhuTrach: ['', [Validators.required]],
        diaChi: ['', [Validators.required]],
        ngayBanHang: [null, [Validators.required]],
        loaiVthh: [,],
        tenLoaiVthh: [, [Validators.required]],
        cloaiVthh: [,],
        tenCloaiVthh: [, [Validators.required]],
        soLuongBtt: [, [Validators.required]],
        donGia: [, [Validators.required]],
        thanhTien: [],
        tenNguoiMua: ['', [Validators.required]],
        diaChiNguoiMua: ['', [Validators.required]],
        cmt: ['', [Validators.required]],
        ghiChu: [],
      });
  }

  async ngOnInit() {
    if (this.idInput) {
      await this.loadChiTiet(this.idInput);
    } else {
      this.initForm();
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
      loaiVthh: this.loaiVthh,
      namKh: this.formData.value.namKh,
      maChiCuc: this.userInfo.MA_DVI
    };
    let res = await this.quyetDinhNvXuatBttService.search(body)
    if (res.data) {
      listNvXh = res.data?.content;
    }
    console.log(listNvXh, 555)
    this.spinner.hide();
    const modalQD = this.modal.create({
      nzTitle: 'Thông tin quyết định giao NV xuất hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataHeader: ['Số quyết định NV xuất hàng', 'Tên loại hàng hóa', 'Tên chủng loại vật tư hàng háo'],
        dataColumn: ['soQd', 'tenLoaiVthh', 'tenCloaiVthh'],
        dataTable: listNvXh
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.onChangeNvXh(data.id);
      }
    });
  }

  async onChangeNvXh(id) {
    if (id > 0) {
      await this.quyetDinhNvXuatBttService.getDetail(id)
        .then(async (resKq) => {
          const dataNvXh = resKq.data;
          let resTtin = await this.hopDongBttService.getDetail(dataNvXh.idHd);
          if (resKq.data) {
            const dataHopDong = resTtin.data;
            this.formData.patchValue({
              soQd: dataNvXh.soQd,
              soLuong: dataNvXh.soLuong,
              soLuongConLai: dataHopDong.soLuongQdChuaKy,
              loaiVthh: dataNvXh.loaiVthh,
              tenLoaiVthh: dataNvXh.tenLoaiVthh,
              cloaiVthh: dataNvXh.cloaiVthh,
              tenCloaiVthh: dataNvXh.tenCloaiVthh,
              donGia: dataHopDong.donGia,
              thanhTien: dataHopDong.donGia * dataNvXh.soLuong * 1000,
              tenNguoiMua: dataHopDong.tenNguoiDdienDviMua,
              diaChiNguoiMua: dataHopDong.diaChiDviMua,
            });
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

  nzDisabled() {
  }

  onCancel() {
    this._modalRef.destroy();
  }

}
