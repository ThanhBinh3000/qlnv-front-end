import {Component, EventEmitter, Input, OnInit, Output,} from '@angular/core';
import {Validators} from '@angular/forms';
import * as dayjs from 'dayjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {
  DialogTableSelectionComponent
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import {MESSAGE} from 'src/app/constants/message';
import {STATUS} from 'src/app/constants/status';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {
  QuyetDinhGiaoNvXuatHangService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/quyetdinh-nhiemvu-xuathang/quyet-dinh-giao-nv-xuat-hang.service';
import {
  HopDongXuatHangService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/hop-dong/hopDongXuatHang.service';
import {FileDinhKem} from "../../../../../models/CuuTro";
import {LOAI_HANG_DTQG} from 'src/app/constants/config';

@Component({
  selector: 'app-create-giao-xh',
  templateUrl: './create-giao-xh.component.html',
  styleUrls: ['./create-giao-xh.component.scss'],
})
export class CreateGiaoXh extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() isView: boolean;
  @Input() idInput: number;
  @Input() isViewOnModal: boolean;
  @Output() showListEvent = new EventEmitter<any>();
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  templateNameVt = "Quyết định giao nhiệm vụ bán đấu giá vật tư";
  templateNameLt = "Quyết định giao nhiệm vụ bán đấu giá lương thực";
  maHauTo: any;
  loadDanhSachQdGiaoNv: any[] = [];
  dataHopDong: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hopDongXuatHangService: HopDongXuatHangService,
    private quyetDinhGiaoNvXuatHangService: QuyetDinhGiaoNvXuatHangService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhGiaoNvXuatHangService);
    this.formData = this.fb.group({
      id: [],
      nam: [],
      maDvi: [''],
      soQdNv: [''],
      ngayKy: [''],
      idHopDong: [],
      soHopDong: [''],
      ngayKyHopDong: [''],
      toChucCaNhan: [''],
      loaiHinhNx: [''],
      kieuNhapXuat: [''],
      loaiVthh: [''],
      cloaiVthh: [''],
      tenHangHoa: [''],
      soLuong: [],
      donViTinh: [''],
      tgianGiaoHang: [],
      idCanBoPhong: [],
      idTruongPhong: [],
      idLanhDaoCuc: [],
      trichYeu: [''],
      trangThai: [''],
      lyDoTuChoi: [''],
      tenDvi: [''],
      tenLoaiHinhNx: [''],
      tenKieuNhapXuat: [''],
      tenLoaiVthh: [''],
      tenCloaiVthh: [''],
      tenCanBoPhong: [''],
      tenTruongPhong: [''],
      tenLanhDaoCuc: [''],
      tenTrangThai: [''],
      fileCanCu: [new Array<FileDinhKem>()],
      fileDinhKem: [new Array<FileDinhKem>()],
    });
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.maHauTo = '/' + this.userInfo.MA_QD;
      if (this.idInput > 0) {
        await this.getDetail(this.idInput);
      } else {
        await this.initForm();
      }
    } catch (error) {
      console.error('error: ', error);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  initForm() {
    this.formData.patchValue({
      nam: dayjs().get('year'),
      tenDvi: this.userInfo.TEN_DVI,
      maDvi: this.userInfo.MA_DVI,
      tenCanBoPhong: this.userInfo.TEN_DAY_DU,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự Thảo',
    })
  }

  async getDetail(id: number) {
    if (!id) return;
    const data = await this.detail(id);
    this.formData.patchValue({
      soQdNv: data.soQdNv?.split('/')[0]
    });
    this.dataTable = this.userService.isChiCuc() ? data.children.filter(item => item.maDvi === this.userInfo.MA_DVI) : data.children;
  }

  async openDialog() {
    try {
      await this.spinner.show();
      let body = {
        loaiVthh: this.loaiVthh,
        nam: this.formData.value.nam,
        trangThai: STATUS.DA_KY
      }
      await this.loadDanhDachNhiemVu();
      const res = await this.hopDongXuatHangService.search(body)
      if (res && res.msg === MESSAGE.SUCCESS) {
        const soHopDongSet = new Set(this.loadDanhSachQdGiaoNv.map(item => item.soHopDong));
        this.dataHopDong = res.data.content.filter(item => !soHopDongSet.has(item.soHopDong));
      }
      const modalQD = this.modal.create({
        nzTitle: 'DANH SÁCH HỢP ĐỒNG BÁN ĐẤU GIÁ',
        nzContent: DialogTableSelectionComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          dataTable: this.dataHopDong.filter(item => item.maDvi === this.userInfo.MA_DVI),
          dataHeader: ['Số hợp đồng', 'Tên hợp đồng', 'Loại hàng hóa'],
          dataColumn: ['soHopDong', 'tenHopDong', 'tenLoaiVthh']
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          await this.onChange(data.id);
        }
      });
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.spinner.hide();
    }
  }

  async onChange(id) {
    if (id <= 0) {
      return;
    }
    try {
      await this.spinner.show();
      const res = await this.hopDongXuatHangService.getDetail(id);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data;
      this.formData.patchValue({
        idHopDong: data.id,
        soHopDong: data.soHopDong,
        ngayKyHopDong: data.ngayKyHopDong,
        toChucCaNhan: data.toChucCaNhan,
        loaiHinhNx: data.loaiHinhNx,
        tenLoaiHinhNx: data.tenLoaiHinhNx,
        kieuNhapXuat: data.kieuNhapXuat,
        tenKieuNhapXuat: data.tenKieuNhapXuat,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        tenHangHoa: data.tenHangHoa,
        soLuong: data.soLuong,
        donViTinh: data.donViTinh,
        tgianGiaoHang: data.tgianGiaoHang,
      });
      this.dataTable = data.children;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.map(item => {
          item.tonKho = item.children.reduce((total, child) => total + child.tonKho, 0);
          item.tenTrangThai = data.tenTrangThaiXh
          item.trangThai = data.trangThaiXh
        })
      }
    } catch (e) {
      console.error('Error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async loadDanhDachNhiemVu() {
    let body = {
      nam: this.formData.value.nam,
      loaiVthh: this.loaiVthh,
      maDvi: this.userInfo.MA_DVI,
    }
    let res = await this.quyetDinhGiaoNvXuatHangService.search(body)
    if (res.msg !== MESSAGE.SUCCESS) {
      this.notification.error(MESSAGE.ERROR, res.msg);
      return;
    }
    const data = res.data.content;
    if (!data || data.length === 0) {
      return;
    }
    this.loadDanhSachQdGiaoNv = data
  }

  async save() {
    try {
      await this.helperService.ignoreRequiredForm(this.formData);
      this.formData.controls["soHopDong"].setValidators([Validators.required]);
      const soQdNv = this.formData.value.soQdNv;
      const body = {
        ...this.formData.value,
        soQdNv: soQdNv ? soQdNv + this.maHauTo : null,
        children: this.dataTable,
      };
      await this.createUpdate(body);
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.helperService.restoreRequiredForm(this.formData);
    }
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    try {
      this.setValidForm();
      const soQdNv = this.formData.value.soQdNv;
      const body = {
        ...this.formData.value,
        soQdNv: soQdNv ? soQdNv + this.maHauTo : null,
        children: this.dataTable,
      };
      await super.saveAndSend(body, trangThai, msg, msgSuccess);
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.helperService.restoreRequiredForm(this.formData);
    }
  }

  calcTong(columnName) {
    if (!this.dataTable) return 0;
    return this.dataTable.reduce((sum, cur) => sum + (cur[columnName] || 0), 0);
  }

  setValidForm() {
    const fieldsToValidate = [
      "soQdNv",
      "soHopDong",
    ];
    fieldsToValidate.forEach(field => {
      this.formData.controls[field].setValidators([Validators.required]);
    });
  }
}
