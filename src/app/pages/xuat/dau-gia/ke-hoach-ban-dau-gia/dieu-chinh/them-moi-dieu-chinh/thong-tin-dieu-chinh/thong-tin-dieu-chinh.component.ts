import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Globals} from "../../../../../../../shared/globals";
import {DanhMucService} from "../../../../../../../services/danhmuc.service";
import {
  DeXuatKhBanDauGiaService
} from "../../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/deXuatKhBanDauGia.service";
import {NgxSpinnerService} from "ngx-spinner";
import {HelperService} from "../../../../../../../services/helper.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {
  DialogThemDiaDiemPhanLoComponent
} from "../../../../../../../components/dialog/dialog-them-dia-diem-phan-lo/dialog-them-dia-diem-phan-lo.component";

@Component({
  selector: 'app-thong-tin-dieu-chinh',
  templateUrl: './thong-tin-dieu-chinh.component.html',
  styleUrls: ['./thong-tin-dieu-chinh.component.scss']
})
export class ThongTinDieuChinhComponent implements OnInit {
  @Input() title;
  @Input() dataInput;
  @Output() soLuongChange = new EventEmitter<number>();
  @Input() isView;
  @Input() isCache: boolean = false;

  formData: FormGroup
  listNguonVon: any[] = [];
  listDataGroup: any[] = [];
  dataTable: any[] = [];
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
      diaChi: [''],
      soDxuat: [''],
      NgayTao: [''],
      ngaypduyet: [''],
      trichYeu: [''],
      slDviTsan: [''],
      tongSoLuong: [''],
      tgianBdauTchuc: [],
      tgianDkienTu: [''],
      tgianDkienDen: [''],
      tgianTtoan: [],
      tgianTtoanGhiChu: [''],
      pthucTtoan: [''],
      tgianGnhan: [],
      tgianGnhanGhiChu: [''],
      pthucGnhan: [''],
      thongBaoKh: [''],
      khoanTienDatTruoc: [],
    });
  }

  async ngOnChanges(changes: SimpleChanges) {
    await this.spinner.show()
    if (changes) {
      if (this.dataInput) {
        this.helperService.bidingDataInFormGroup(this.formData, this.dataInput);
        this.formData.patchValue({
          tgianBdauTchuc: (this.dataInput.tgianDkienTu && this.dataInput.tgianDkienDen) ? [this.dataInput.tgianDkienTu, this.dataInput.tgianDkienDen] : null
        })
        this.dataTable = this.dataInput.children
        await this.ptThanhToan(this.dataInput)
      } else {
        this.formData.reset();
      }
    }
    await this.spinner.hide()
  }


  async ngOnInit() {
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
  };

  calculatorTable() {
    let tongSoLuong: number = 0;
    this.dataTable.forEach((item) => {
      tongSoLuong += item.soLuongChiCuc;
    });
    this.formData.patchValue({
      tongSoLuong: tongSoLuong,
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
}
