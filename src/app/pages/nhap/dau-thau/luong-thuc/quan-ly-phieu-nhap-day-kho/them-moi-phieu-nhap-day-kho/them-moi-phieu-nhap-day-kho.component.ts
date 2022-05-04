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

  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private notification: NzNotificationService,
    private router: Router,
    private modal: NzModalService,
    private fb: FormBuilder,
    private routerActive: ActivatedRoute,
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
}
