import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { Globals } from "../../../../../../../shared/globals";
import { MESSAGE } from "../../../../../../../constants/message";
import { DanhMucService } from "../../../../../../../services/danhmuc.service";
import { chain } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { HelperService } from 'src/app/services/helper.service';
import { NzModalService } from "ng-zorro-antd/modal";
import {
  DialogThemDiaDiemPhanLoComponent
} from 'src/app/components/dialog/dialog-them-dia-diem-phan-lo/dialog-them-dia-diem-phan-lo.component';
import { DanhSachPhanLo } from 'src/app/models/KeHoachBanDauGia';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import dayjs from 'dayjs';
import { DeXuatKhBanDauGiaService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/DeXuatKhBanDauGia.service';

@Component({
  selector: 'app-thongtin-qd-dieuchinh-khbdg',
  templateUrl: './thongtin-qd-dieuchinh-khbdg.component.html',
  styleUrls: ['./thongtin-qd-dieuchinh-khbdg.component.scss']
})
export class ThongtinQdDieuchinhKhbdgComponent implements OnInit {
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
  listOfData: any[] = [];
  dataChiTieu: any;

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
      tongTienKdienDonGia: [null,],
      tongTienDatTruocDonGia: [null,],
      diaChi: [],
      namKh: [dayjs().get('year'),],
      soDxuat: [null,],
      trichYeu: [null],
      ldoTuchoi: [],
      dsPhanLoList: []
    });
  }

  async ngOnChanges(changes: SimpleChanges) {
    await this.spinner.show()
    if (changes) {
      if (this.dataInput) {
        if (this.isCache) {
          let res = await this.deXuatKhBanDauGiaService.getDetail(this.dataInput.idDxHdr);
          if (res.msg == MESSAGE.SUCCESS) {
            this.formData.patchValue(res.data);
            this.formData.patchValue({
              tgianBdauTchuc: [res.data?.tgianDkienTu, res.data?.tgianDkienDen],
            });
          }
        } else {
          this.formData.patchValue(this.dataInput);
          this.formData.patchValue({
            dsPhanLoList: this.dataInput.children,
            tgianBdauTchuc: [this.dataInput.tgianDkienTu, this.dataInput.tgianDkienDen]
          })
        }
        for (let i = 0; i < this.formData.value.dsPhanLoList.length; i++) {
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
      nzContent: DialogThemDiaDiemPhanLoComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '2000px',
      nzFooter: null,
      nzComponentParams: {
        dataEdit: data,
      },
    });
    modalGT.afterClose.subscribe((res) => {
      if (!res) {
        return;
      }
      if (index >= 0) {
        this.listOfData[index] = res.value;
      } else {
        this.listOfData = [...this.listOfData, res.value];
      }
      let tongSoLuong: number = 0;
      let tongTienKdiem: number = 0;
      let tongTienKdienDonGia: number = 0;
      let tongTienDatTruoc: number = 0;
      let tongTienDatTruocDonGia: number = 0;
      let soLuong: number = 0;
      this.listOfData.forEach((item) => {
        tongSoLuong = tongSoLuong + item.soLuong;
        tongTienKdiem = tongTienKdiem + item.giaKhoiDiem;
        tongTienKdienDonGia = tongTienKdienDonGia + item.giaKhoiDiemDduyet;
        tongTienDatTruoc = tongTienDatTruoc + item.tienDatTruoc;
        tongTienDatTruocDonGia = tongTienDatTruocDonGia + item.tienDatTruocDduyet;
      });
      this.formData.patchValue({
        tongSoLuong: tongSoLuong,
        tongTienKdiem: tongTienKdiem,
        tongTienKdienDonGia: tongTienKdienDonGia,
        tongTienDatTruoc: tongTienDatTruoc,
        tongTienDatTruocDonGia: tongTienDatTruocDonGia,
      });
      this.soLuongChange.emit(soLuong);
      this.helperService.setIndexArray(this.listOfData);
    });
  }

  changeFormData() {
    if (this.formData.value.id) {
      this.dataChange.emit(this.formData.value);
    }
  }
}
