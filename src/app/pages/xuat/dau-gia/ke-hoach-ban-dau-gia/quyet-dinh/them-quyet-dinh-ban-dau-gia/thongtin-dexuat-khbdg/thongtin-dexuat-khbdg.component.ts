import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Globals } from "../../../../../../../shared/globals";
import { MESSAGE } from "../../../../../../../constants/message";
import { DanhMucService } from "../../../../../../../services/danhmuc.service";
import { cloneDeep, chain } from 'lodash';
import { DanhSachDauThauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/danhSachDauThau.service';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { NgxSpinnerService } from 'ngx-spinner';
import { HelperService } from 'src/app/services/helper.service';
import { DanhSachGoiThau } from "../../../../../../../models/DeXuatKeHoachuaChonNhaThau";
import {
  DialogThemMoiVatTuComponent
} from "../../../../../../../components/dialog/dialog-them-moi-vat-tu/dialog-them-moi-vat-tu.component";
import { NzModalService } from "ng-zorro-antd/modal";
import { DeXuatKhBanDauGiaService } from 'src/app/services/de-xuat-kh-ban-dau-gia.service';

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


  constructor(
    private fb: FormBuilder,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private deXuatKhBanDauGiaService: DeXuatKhBanDauGiaService,
    private spinner: NgxSpinnerService,
    private helperService: HelperService,
    private modal: NzModalService,
  ) {
    this.formData = this.fb.group({
      id: [],
      maDvi: [''],
      tenDvi: [''],

      loaiHdong: [null,],
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
        console.log(res, 9999)
        if (this.isTongHop) {
          this.listOfData = this.dataInput.dsGoiThau;
        } else {
          this.listOfData = this.dataInput.dsPhanLoList ? this.dataInput.dsPhanLoList : this.dataInput.dsGoiThau;
        }
        if (res.msg == MESSAGE.SUCCESS) {
          this.helperService.bidingDataInFormGroup(this.formData, res.data);
          let soLuong = res.data.tongMucDt / res.data.donGiaVat / 1000;
          this.formData.patchValue({
            soLuong: soLuong,
            tongMucDt: soLuong * res.data.donGiaVat * 1000
          });
          if (!this.isCache) {
            if (this.dataInput.soLuong) {
              this.formData.patchValue({
                soLuong: this.dataInput.soLuong,
                tongMucDt: this.dataInput.soLuong * this.dataInput.donGiaVat * 1000
              })
            }
          }
        }
        this.helperService.setIndexArray(this.listOfData);
        this.convertListData();
      } else {
        this.formData.reset();
        this.formData.patchValue({
          vat: 5
        });
      }
    }
    await this.spinner.hide()
  }

  convertListData() {
    this.listDataGroup = chain(this.listOfData).groupBy('tenDvi').map((value, key) => ({ tenDvi: key, dataChild: value }))
      .value()
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

  themMoiGoiThau(data?: any, index?: number) {
    const modalGT = this.modal.create({
      nzTitle: 'Thêm địa điểm nhập kho',
      nzContent: DialogThemMoiVatTuComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzFooter: null,
      nzComponentParams: {
        dataEdit: data,
        loaiVthh: this.formData.get('loaiVthh').value,
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
      let tongMucDt: number = 0;
      let soLuong: number = 0;
      this.listOfData.forEach((item) => {
        tongMucDt = tongMucDt + item.soLuong * item.donGia;
        soLuong = soLuong + item.soLuong;
      });
      this.formData.patchValue({
        tongMucDt: tongMucDt,
        soLuong: soLuong
      });
      this.soLuongChange.emit(soLuong);
      this.helperService.setIndexArray(this.listOfData);
      this.convertListData();
    });
  };



}
