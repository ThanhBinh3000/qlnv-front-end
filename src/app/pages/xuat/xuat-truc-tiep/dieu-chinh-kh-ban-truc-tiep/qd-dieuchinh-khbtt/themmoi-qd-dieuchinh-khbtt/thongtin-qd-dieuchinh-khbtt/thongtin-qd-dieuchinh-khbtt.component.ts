import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { Globals } from "../../../../../../../shared/globals";
import { MESSAGE } from "../../../../../../../constants/message";
import { DanhMucService } from "../../../../../../../services/danhmuc.service";
import { NgxSpinnerService } from 'ngx-spinner';
import { HelperService } from 'src/app/services/helper.service';
import { NzModalService } from "ng-zorro-antd/modal";
import {
  DialogThemDiaDiemPhanLoComponent
} from 'src/app/components/dialog/dialog-them-dia-diem-phan-lo/dialog-them-dia-diem-phan-lo.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import dayjs from 'dayjs';
import { DeXuatKhBanDauGiaService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/deXuatKhBanDauGia.service';
import { DeXuatKhBanTrucTiepService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/de-xuat-kh-ban-truc-tiep.service';
import { DialogThemMoiXuatBanTrucTiepComponent } from 'src/app/components/dialog/dialog-them-moi-xuat-ban-truc-tiep/dialog-them-moi-xuat-ban-truc-tiep.component';


@Component({
  selector: 'app-thongtin-qd-dieuchinh-khbtt',
  templateUrl: './thongtin-qd-dieuchinh-khbtt.component.html',
  styleUrls: ['./thongtin-qd-dieuchinh-khbtt.component.scss']
})
export class ThongtinQdDieuchinhKhbttComponent implements OnInit {
  @Input() title;
  @Input() dataInput;
  @Output() soLuongChange = new EventEmitter<number>();
  @Output() dataChange = new EventEmitter<any>();
  @Input() isView;
  @Input() isCache: boolean = false;
  @Input() isTongHop;

  formData: FormGroup
  listNguonVon: any[] = [];
  listDataGroup: any[] = [];
  dataTable: any[] = [];
  dataChiTieu: any;

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
      idDxHdr: [],
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
      tongTienKdienDonGia: [null,],
      tongTienDatTruocDonGia: [null,],
      diaChi: [],
      namKh: [dayjs().get('year'),],
      soDxuat: [null,],
      trichYeu: [null],
      ldoTuchoi: [],
      children: []
    });
  }

  async ngOnChanges(changes: SimpleChanges) {
    await this.spinner.show()
    if (changes) {
      console.log(this.dataInput, 111)
      if (this.dataInput) {
        if (this.isCache) {
          let res = await this.deXuatKhBanTrucTiepService.getDetail(this.dataInput.idDxHdr);
          if (res.msg == MESSAGE.SUCCESS) {
            this.formData.patchValue(res.data);
            this.formData.patchValue({
              tgianBdauTchuc: [res.data?.tgianDkienTu, res.data?.tgianDkienDen],

            });
          }
        } else {
          this.formData.patchValue(this.dataInput);
          this.formData.patchValue({
            children: this.dataInput.children,
            tgianBdauTchuc: [this.dataInput.tgianDkienTu, this.dataInput.tgianDkienDen]
          })
        }
        for (let i = 0; i < this.formData.value.children.length; i++) {
          this.expandSet.add(i);
        }
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
      nzContent: DialogThemMoiXuatBanTrucTiepComponent,
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

    this.dataTable.forEach((item) => {
      let soLuongChiCuc = 0;
      item.children.forEach(child => {
        soLuongChiCuc += child.soLuong;
        tongSoLuong += child.soLuong / 1000;
      })
      item.soLuong = soLuongChiCuc;
    });
    this.formData.patchValue({
      tongSoLuong: tongSoLuong,
    });
    this.dataInput.soLuong = tongSoLuong * 1000
  }

  changeFormData() {
    if (this.formData.value.id) {
      this.dataChange.emit(this.formData.value);
    }
  }
}
