import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { Globals } from "../../../../../../../shared/globals";
import { MESSAGE } from "../../../../../../../constants/message";
import { DanhMucService } from "../../../../../../../services/danhmuc.service";
import { NgxSpinnerService } from 'ngx-spinner';
import { HelperService } from 'src/app/services/helper.service';
import { NzModalService } from "ng-zorro-antd/modal";
import { DeXuatKhBanDauGiaService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/deXuatKhBanDauGia.service';
import { DialogThemDiaDiemPhanLoComponent } from 'src/app/components/dialog/dialog-them-dia-diem-phan-lo/dialog-them-dia-diem-phan-lo.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import dayjs from 'dayjs';

@Component({
  selector: 'app-thongtin-dexuat-khbdg',
  templateUrl: './thongtin-dexuat-khbdg.component.html',
  styleUrls: ['./thongtin-dexuat-khbdg.component.scss']
})

export class ThongtinDexuatKhbdgComponent implements OnChanges {
  @Input() title;
  @Input() dataInput;
  @Output() soLuongChange = new EventEmitter<number>();
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
      tgianGnhan: [null,],
      tgianGnhanGhiChu: [null,],
      pthucGnhan: [null,],
      thongBaoKh: [null,],
      khoanTienDatTruoc: [null,],
      tongSoLuong: [null,],
      donViTinh: [null,],
      tongTienGiaKdTheoDgiaDd: [null,],
      tongKhoanTienDtTheoDgiaDd: [null],
      diaChi: [],
      namKh: [dayjs().get('year'),],
      soDxuat: [null,],
      thoiGianDuKien: [],
    });
  }

  async ngOnChanges(changes: SimpleChanges) {
    await this.spinner.show()
    if (changes) {
      if (this.dataInput) {
        this.helperService.bidingDataInFormGroup(this.formData, this.dataInput);
        this.formData.patchValue({
          thoiGianDuKien: (this.dataInput.tgianDkienTu && this.dataInput.tgianDkienDen) ? [this.dataInput.tgianDkienTu, this.dataInput.tgianDkienDen] : null
        })
        this.dataTable = this.dataInput.children
        await this.ptThanhToan(this.dataInput)
        this.calculatorTable();
      } else {
        this.formData.reset();
      }
    }
    await this.spinner.hide()
  }

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  themMoiBangPhanLoTaiSan(data?: any, index?: number) {
    const modalGT = this.modal.create({
      nzTitle: 'Thêm địa điểm giao nhận hàng',
      nzContent: DialogThemDiaDiemPhanLoComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '2000px',
      nzFooter: null,
      nzComponentParams: {
        dataEdit: data,
      },
    });
    modalGT.afterClose.subscribe((data) => {
      if (!data) {
        return;
      }
      if (index >= 0) {
        this.dataTable[index] = data;
      }
      this.calculatorTable();
    });
  }

  calculatorTable() {
    let tongSoLuong: number = 0;
    let tongTienGiaKdTheoDgiaDd: number = 0;
    let tongKhoanTienDtTheoDgiaDd: number = 0;
    this.dataTable.forEach((item) => {
      item.children.forEach((child) => {
        item.soTienDtruocDx += child.soLuongDeXuat * child.donGiaDeXuat * this.formData.value.khoanTienDatTruoc / 100;
        item.soTienDtruocDd += child.soLuongDeXuat * child.donGiaDuocDuyet * this.formData.value.khoanTienDatTruoc / 100;
        tongSoLuong += child.soLuongDeXuat;
        tongTienGiaKdTheoDgiaDd += child.soLuongDeXuat * child.donGiaDuocDuyet;
      })
      tongKhoanTienDtTheoDgiaDd += item.soTienDtruocDd
    });
    this.formData.patchValue({
      tongSoLuong: tongSoLuong,
      tongTienGiaKdTheoDgiaDd: tongTienGiaKdTheoDgiaDd,
      tongKhoanTienDtTheoDgiaDd: tongKhoanTienDtTheoDgiaDd,
    });
  }


  isDisable() {
    return false;
  }

  async ptThanhToan(data) {
    if (data.pthucTtoan == '1') {
      this.listPhuongThucThanhToan = [
        {
          ma: '1',
          giaTri: 'Tiền mặt',
        },
      ];
    } else {
      this.listPhuongThucThanhToan = [
        {
          ma: '2',
          giaTri: 'Chuyển khoản',
        },
      ];
    }
  }

}
