import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Globals} from "../../../../../../../shared/globals";
import {DanhMucService} from "../../../../../../../services/danhmuc.service";
import {NgxSpinnerService} from 'ngx-spinner';
import {HelperService} from 'src/app/services/helper.service';
import {NzModalService} from "ng-zorro-antd/modal";
import {
  DeXuatKhBanDauGiaService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/deXuatKhBanDauGia.service';
import {
  DialogThemDiaDiemPhanLoComponent
} from 'src/app/components/dialog/dialog-them-dia-diem-phan-lo/dialog-them-dia-diem-phan-lo.component';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import dayjs from 'dayjs';
import {STATUS} from "../../../../../../../constants/status";
import {MESSAGE} from "../../../../../../../constants/message";
import {
  QuyetDinhGiaTCDTNNService
} from "../../../../../../../services/ke-hoach/phuong-an-gia/quyetDinhGiaTCDTNN.service";
import {LOAI_HANG_DTQG} from "../../../../../../../constants/config";

@Component({
  selector: 'app-thongtin-dexuat-khbdg',
  templateUrl: './thongtin-dexuat-khbdg.component.html',
  styleUrls: ['./thongtin-dexuat-khbdg.component.scss']
})

export class ThongtinDexuatKhbdgComponent implements OnChanges {
  @Input() title;
  @Input() dataInput;
  @Input() isView;
  @Input() isCache: boolean = false;
  @Input() isTongHop;

  formData: FormGroup
  dataTable: any[] = [];
  listNguonVon: any[] = [];
  dataChiTieu: any;
  listPhuongThucThanhToan: any[] = [];

  constructor(
    private fb: FormBuilder,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private deXuatKhBanDauGiaService: DeXuatKhBanDauGiaService,
    private spinner: NgxSpinnerService,
    private helperService: HelperService,
    private modal: NzModalService,
    private notification: NzNotificationService,
    private quyetDinhGiaTCDTNNService: QuyetDinhGiaTCDTNNService,
  ) {
    this.formData = this.fb.group({
      id: [],
      maDvi: [''],
      tenDvi: [''],
      tgianBdauTchuc: [],
      tgianDkienTu: [null,],
      tgianDkienDen: [null,],
      tgianTtoan: [null,],
      tgianTtoanGhiChu: [null,],
      pthucTtoan: [null,],
      tenPthucTtoan: [null,],
      tgianGnhan: [null,],
      tgianGnhanGhiChu: [null,],
      pthucGnhan: [null,],
      thongBao: [null,],
      khoanTienDatTruoc: [null,],
      tongSoLuong: [null],
      donViTinh: [null,],
      tongTienGiaKdTheoDgiaDd: [null],
      tongKhoanTienDtTheoDgiaDd: [null],
      diaChi: [],
      namKh: [dayjs().get('year'),],
      soDxuat: [null,],
      thoiGianDuKien: [],
    });
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.dataInput) {
      await this.spinner.show();
      const dataInput = changes.dataInput.currentValue;
      if (dataInput) {
        this.helperService.bidingDataInFormGroup(this.formData, dataInput);
        const hasValidTime = dataInput.tgianDkienTu && dataInput.tgianDkienDen;
        this.formData.patchValue({
          thoiGianDuKien: hasValidTime ? [dataInput.tgianDkienTu, dataInput.tgianDkienDen] : null
        });
        this.dataTable = dataInput.children;
        await this.calculatorTable(dataInput);
      } else {
        this.formData.reset();
      }
      await this.spinner.hide();
    }
  }

  expandSet = new Set<number>();

  onExpandChange(id: number, checked: boolean): void {
    checked ? this.expandSet.add(id) : this.expandSet.delete(id);
  }

  async themMoiBangPhanLoTaiSan(data?: any, index?: number) {
    const modalGT = this.modal.create({
      nzTitle: 'Thêm địa điểm giao nhận hàng',
      nzContent: DialogThemDiaDiemPhanLoComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '2000px',
      nzFooter: null,
      nzComponentParams: {
        dataEdit: data,
        loaiVthh: this.dataInput.loaiVthh,
        cloaiVthh: this.dataInput.cloaiVthh,
      },
    });
    modalGT.afterClose.subscribe(async (updatedData) => {
      if (updatedData && index >= 0) {
        this.dataTable[index] = updatedData;
        await this.calculatorTable();
      }
    });
  }

  async calculatorTable(data?) {
    for (const item of this.dataTable) {
      item.tongGiaKdiemDd = 0;
      item.tongTienDtruocDd = 0;
      for (const child of item.children) {
        let bodyPag = {
          namKeHoach: data.namKh,
          loaiVthh: data.loaiVthh,
          cloaiVthh: data.cloaiVthh,
          trangThai: STATUS.BAN_HANH,
          maDvi: data.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU) ? '' : item.maDvi,
          loaiGia: 'LG04'
        }
        let pag = await this.quyetDinhGiaTCDTNNService.getPag(bodyPag)
        if (pag.msg == MESSAGE.SUCCESS) {
          if (pag.data) {
            pag.data.forEach(s => {
              child.donGiaDuocDuyet = s.giaQdTcdt;
            })
          } else {
            child.donGiaDuocDuyet = null;
          }
        }
        child.giaKhoiDiemDd = child.soLuongDeXuat * child.donGiaDuocDuyet;
        child.soTienDtruocDd = child.soLuongDeXuat * child.donGiaDuocDuyet * this.formData.value.khoanTienDatTruoc / 100;
        item.tongGiaKdiemDd += child.giaKhoiDiemDd;
        item.tongTienDtruocDd += child.soTienDtruocDd;
      }
    }
    this.formData.patchValue({
      tongTienGiaKdTheoDgiaDd: this.dataTable.reduce((prev, cur) => prev + cur.tongGiaKdiemDd, 0),
      tongKhoanTienDtTheoDgiaDd: this.dataTable.reduce((prev, cur) => prev + cur.tongTienDtruocDd, 0),
    });
  }

  isDisable() {
    return false;
  }
}
