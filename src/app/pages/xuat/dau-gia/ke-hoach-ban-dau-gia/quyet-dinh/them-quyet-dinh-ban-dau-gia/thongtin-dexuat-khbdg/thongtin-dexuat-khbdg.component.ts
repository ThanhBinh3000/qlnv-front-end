import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { Globals } from "../../../../../../../shared/globals";
import { MESSAGE } from "../../../../../../../constants/message";
import { DanhMucService } from "../../../../../../../services/danhmuc.service";
import { chain } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { HelperService } from 'src/app/services/helper.service';
import { NzModalService } from "ng-zorro-antd/modal";
import { DeXuatKhBanDauGiaService } from 'src/app/services/de-xuat-kh-ban-dau-gia.service';
import { DialogThemDiaDiemPhanLoComponent } from 'src/app/components/dialog/dialog-them-dia-diem-phan-lo/dialog-them-dia-diem-phan-lo.component';
import { DanhSachPhanLo } from 'src/app/models/KeHoachBanDauGia';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-thongtin-dexuat-khbdg',
  templateUrl: './thongtin-dexuat-khbdg.component.html',
  styleUrls: ['./thongtin-dexuat-khbdg.component.scss']
})

export class ThongtinDexuatKhbdgComponent implements OnInit {
  @Input() title;
  @Input() dataInput;
  @Output() soLuongChange = new EventEmitter<number>();
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
      tgianKyHdong: [null,],
      tgianKyHdongGhiChu: [null,],
      tgianTtoan: [null,],
      tgianTtoanGhiChu: [null,],
      pthucTtoan: [null,],
      tgianGnhan: [null,],
      tgianGnhanGhiChu: [null,],
      khoanTienDatTruoc: [null,],
      tongSoLuong: [null,],
      tongTienKdiem: [null,],
      tongTienDatTruoc: [null,],
      diaChi: [],
      pthucGnhan: [null,],
      thongBaoKh: [null,],
      namKh: [,],
      soDxuat: [null,],
      trichYeu: [null],
      ldoTuchoi: [],
      tgianDkienDen: [null,],
      tgianDkienTu: [null,],
      tgianBdauTchuc: [],
    });
  }

  async ngOnChanges(changes: SimpleChanges) {
    await this.spinner.show()
    if (changes) {
      if (this.dataInput) {
        let res = await this.deXuatKhBanDauGiaService.getDetail(this.dataInput.idDxHdr);
        this.formData.patchValue({
          tgianBdauTchuc: [res.data?.tgianDkienTu, res.data?.tgianDkienTu],
        });
        if (this.isTongHop) {
          this.listOfData = this.dataInput.dsGoiThau;
        } else {
          this.listOfData = this.dataInput.dsPhanLoList ? this.dataInput.dsPhanLoList : this.dataInput.dsGoiThau;
        }
        if (res.msg == MESSAGE.SUCCESS) {
          this.helperService.bidingDataInFormGroup(this.formData, res.data);
          // let soLuong = res.data.tongMucDt / res.data.donGiaVat / 1000;
          this.formData.patchValue({
            // soLuong: soLuong,
            // tongMucDt: soLuong * res.data.donGiaVat * 1000
          });
          // if (!this.isCache) {
          //   if (this.dataInput.soLuong) {
          //     this.formData.patchValue({
          //       soLuong: this.dataInput.soLuong,
          //       tongMucDt: this.dataInput.soLuong * this.dataInput.donGiaVat * 1000
          //     })
          //   }
          // }
        }
        this.helperService.setIndexArray(this.listOfData);

      } else {
        this.formData.reset();
        // this.formData.patchValue({
        //   vat: 5
        // });
      }
    }
    await this.spinner.hide()
  }



  async ngOnInit() {
    await this.spinner.show()
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

  themMoiBangPhanLoTaiSan(data?: DanhSachPhanLo, index?: number) {
    // if (!this.formData.get('loaiVthh').value) {
    //   this.notification.error(MESSAGE.ERROR, 'Vui lòng chọn loại hàng hóa');
    //   return;
    // }
    // if (!this.formData.get('khoanTienDatTruoc').value) {
    //   this.notification.error(MESSAGE.ERROR, 'Vui lòng chọn khoản tiền đặt trước');
    //   return;
    // }
    const modalGT = this.modal.create({
      nzTitle: 'Thêm địa điểm giao nhận hàng',
      nzContent: DialogThemDiaDiemPhanLoComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '2000px',
      nzFooter: null,
      nzComponentParams: {
        dataEdit: data,
        dataChiTieu: this.dataChiTieu,
        khoanTienDatTruoc: this.formData.get('khoanTienDatTruoc').value,
        namKh: this.formData.get('namKh').value,
        // donGiaVat: this.donGiaVat,
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
    });
  }
}
