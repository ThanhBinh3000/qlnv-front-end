import { cloneDeep } from 'lodash';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { LOAI_HANG_DTQG } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { DonviService } from 'src/app/services/donvi.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { DialogTuChoiComponent } from '../../../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'them-moi-phieu-nhap-day-kho',
  templateUrl: './them-moi-phieu-nhap-day-kho.component.html',
  styleUrls: ['./them-moi-phieu-nhap-day-kho.component.scss'],
})
export class ThemMoiPhieuNhapDayKhoComponent implements OnInit {
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;

  listNganLo: any[] = [];
  id: number = 0;

  formData: FormGroup;

  errorInputRequired: string = 'Dữ liệu không được để trống.';

  options: any[] = [];
  optionsDonVi: any[] = [];

  thocIdDefault: string = LOAI_HANG_DTQG.THOC;
  gaoIdDefault: string = LOAI_HANG_DTQG.GAO;
  muoiIdDefault: string = LOAI_HANG_DTQG.MUOI;

  dataTable: any[] = [];
  editCache: { [key: string]: { edit: boolean; data: any } } = {};
  itemRow: any = {};
  tableExist: boolean = false;

  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private notification: NzNotificationService,
    private router: Router,
    private modal: NzModalService,
    private fb: FormBuilder,
    private routerActive: ActivatedRoute,
    private helperService: HelperService,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.id = +this.routerActive.snapshot.paramMap.get('id');
      await Promise.all([
        this.loadChiTiet(this.id),
        // this.loadDonViTinh(),
        this.loadNganLo(),
        this.loadDonVi(),
      ])
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  ngAfterViewChecked(): void {
    const table = document.getElementsByTagName('table');
    this.tableExist = table && table.length > 0 ? true : false;
  }

  updateEditCache(): void {
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach(item => {
        this.editCache[item.stt] = {
          edit: false,
          data: { ...item }
        };
      });
    }
  }

  cancelEdit(stt: number): void {
    const index = this.dataTable.findIndex(item => item.stt === stt);
    this.editCache[stt] = {
      data: { ...this.dataTable[index] },
      edit: false
    };
  }

  saveEdit(stt: number): void {
    const index = this.dataTable.findIndex(item => item.stt === stt);
    this.editCache[stt].data.thanhTien = (this.editCache[stt].data.soLuong ?? 0) * (this.editCache[stt].data.donGia ?? 0);
    Object.assign(this.dataTable[index], this.editCache[stt].data);
    this.editCache[stt].edit = false;
  }

  addRow() {
    if (!this.dataTable) {
      this.dataTable = [];
    }
    this.sortTableId();
    let item = cloneDeep(this.itemRow);
    item.stt = this.dataTable.length + 1;
    item.thanhTien = (item.soLuong ?? 0) * (item.donGia ?? 0);
    this.dataTable = [
      ...this.dataTable,
      item,
    ]
    this.updateEditCache();
    this.clearItemRow();
  }

  clearItemRow() {
    this.itemRow = {};
  }

  deleteRow(data: any) {
    this.dataTable = this.dataTable.filter(x => x.stt != data.stt);
    this.sortTableId();
    this.updateEditCache();
  }

  editRow(stt: number) {
    this.editCache[stt].edit = true;
  }

  sortTableId() {
    this.dataTable.forEach((lt, i) => {
      lt.stt = i + 1;
    });
  }

  async loadChiTiet(id) {
    this.formData = this.fb.group({
      soBienBan: [null, [Validators.required]],
      phieuNhapKho: [null, [Validators.required]],
      maDonVi: [null],
      tenDonVi: [null, [Validators.required]],
      donViId: [null],
      ngayLap: [null, [Validators.required]],
      maKho: [null, [Validators.required]],
      soKho: [null, [Validators.required]],
      hangDTQG: [null, [Validators.required]],
      donViTinh: [null, [Validators.required]],
      tenNguoiGiaoHang: [null, [Validators.required]],
      thoiGianGiaoHang: [null, [Validators.required]],
      diaChi: [null, [Validators.required]],
    });
  }

  selectHangDTQG(hangDTQG) {
    this.formData.controls['hangDTQG'].setValue(hangDTQG);
  }

  async loadDonVi() {
    try {
      const res = await this.donViService.layTatCaDonVi();
      this.optionsDonVi = [];
      if (res.msg == MESSAGE.SUCCESS) {
        for (let i = 0; i < res.data.length; i++) {
          const item = {
            ...res.data[i],
            labelDonVi: res.data[i].maDvi + ' - ' + res.data[i].tenDvi,
          };
          this.optionsDonVi.push(item);
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  onInput(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.options = [];
    } else {
      this.options = this.optionsDonVi.filter(
        (x) => x.labelDonVi.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }

  selectDonVi(donVi) {
    this.formData.patchValue({
      maDonVi: donVi.maDvi,
      tenDonVi: donVi.tenDvi,
      donViId: donVi.id,
    });
  }

  async loadNganLo() {
    let body = {
      "maNganLo": "",
      "nganKhoId": null,
      "paggingReq": {
        "limit": 1000,
        "page": 1
      },
      "str": "",
      "tenNganLo": "",
      "trangThai": ""
    }
    const res = await this.tinhTrangKhoHienThoiService.timKiemNganLo(body);
    this.listNganLo = [];
    if (res.msg == MESSAGE.SUCCESS) {
      this.listNganLo = res.data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  selectNganLo(maKho) {
    this.formData.controls['maKho'].setValue(maKho);
  }

  tuChoi() {
    const modalTuChoi = this.modal.create({
      nzTitle: 'Từ chối',
      nzContent: DialogTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
      }
    });
  }

  back() {
    this.router.navigate(['nhap/dau-thau/quan-ly-phieu-nhap-day-kho']);
  }

  themBienBanDayKho() {

  }



  deleteBienBanNhapDayKho(data?: any) {

  }

  reduceRowData(
    indexTable: number,
    indexCell: number,
    indexRow: number,
    stringReplace: string,
    idTable: string,
  ): number {
    let sumVal = 0;
    const listTable = document
      .getElementById(idTable)
      ?.getElementsByTagName('table');
    if (listTable && listTable.length >= indexTable) {
      const table = listTable[indexTable];
      for (let i = indexRow; i < table.rows.length - 1; i++) {
        if (
          table.rows[i]?.cells[indexCell]?.innerHTML &&
          table.rows[i]?.cells[indexCell]?.innerHTML != ''
        ) {
          sumVal =
            sumVal +
            parseFloat(this.helperService.replaceAll(table.rows[i].cells[indexCell].innerHTML, stringReplace, ''));
        }
      }
    }
    return sumVal;
  }
}
