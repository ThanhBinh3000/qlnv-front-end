import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { Globals } from "../../../../../../../shared/globals";
import { DanhMucService } from "../../../../../../../services/danhmuc.service";
import { NgxSpinnerService } from 'ngx-spinner';
import { HelperService } from 'src/app/services/helper.service';
import { NzModalService } from "ng-zorro-antd/modal";
import { NzNotificationService } from 'ng-zorro-antd/notification';
import dayjs from 'dayjs';
import { DeXuatKhBanTrucTiepService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/de-xuat-kh-ban-truc-tiep.service';
import { DialogThemMoiXuatBanTrucTiepComponent } from 'src/app/components/dialog/dialog-them-moi-xuat-ban-truc-tiep/dialog-them-moi-xuat-ban-truc-tiep.component';

@Component({
  selector: 'app-thong-tin-kh-ban-truc-tiep',
  templateUrl: './thong-tin-kh-ban-truc-tiep.component.html',
  styleUrls: ['./thong-tin-kh-ban-truc-tiep.component.scss']
})
export class ThongTinKhBanTrucTiepComponent implements OnChanges {

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
    private deXuatKhBanTrucTiepService: DeXuatKhBanTrucTiepService,
    private spinner: NgxSpinnerService,
    private helperService: HelperService,
    private modal: NzModalService,
    private notification: NzNotificationService,
  ) {
    this.formData = this.fb.group({
      id: [],
      maDvi: [''],
      tenDvi: [''],
      tgianBdauTchuc: [''],
      tgianDkienTu: [''],
      tgianDkienDen: [''],
      tgianTtoan: [],
      tgianTtoanGhiChu: [''],
      pthucTtoan: [''],
      tgianGnhan: [],
      tgianGnhanGhiChu: [''],
      pthucGnhan: [''],
      thongBaoKh: [''],
      tongSoLuong: [''],
      diaChi: [''],
      soDxuat: [''],
      thoiGianDuKien: [''],
      donGiaVat: []
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
      nzTitle: 'THÊM ĐỊA ĐIỂM GIAO NHẬN HÀNG',
      nzContent: DialogThemMoiXuatBanTrucTiepComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '2500px',
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
  };

  calculatorTable() {
    let tongSoLuong: number = 0;
    let tongDonGia: number = 0;
    this.dataTable.forEach((item) => {
      tongSoLuong += item.soLuongChiCuc;
      item.children.forEach(child => {
        tongDonGia += child.donGiaDeXuat;
      })
    });
    this.formData.patchValue({
      tongSoLuong: tongSoLuong,
      tongDonGia: tongDonGia,
    });
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

  isDisable() {
    return false;
  }
}
