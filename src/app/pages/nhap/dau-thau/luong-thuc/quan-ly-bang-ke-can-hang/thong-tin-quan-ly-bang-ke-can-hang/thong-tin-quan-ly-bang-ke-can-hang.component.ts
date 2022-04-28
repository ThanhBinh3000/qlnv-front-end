import { NzModalService } from 'ng-zorro-antd/modal';
import { DialogTuChoiComponent } from '../../../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DonviService } from 'src/app/services/donvi.service';
import { MESSAGE } from 'src/app/constants/message';
import * as dayjs from 'dayjs';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { LOAI_HANG_DTQG, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { DanhSachDauThauService } from 'src/app/services/danhSachDauThau.service';
import { Subject } from 'rxjs';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/quyetDinhGiaoNhapHang.service';
import { QuanLyBangKeCanHangService } from 'src/app/services/quanLyBangKeCanHang.service';

@Component({
  selector: 'thong-tin-quan-ly-bang-ke-can-hang',
  templateUrl: './thong-tin-quan-ly-bang-ke-can-hang.component.html',
  styleUrls: ['./thong-tin-quan-ly-bang-ke-can-hang.component.scss'],
})
export class ThongTinQuanLyBangKeCanHangComponent implements OnInit {
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;

  listNganLo: any[] = [];
  id: number = 0;

  formData: FormGroup;

  errorInputRequired: string = 'Dữ liệu không được để trống.';

  thocIdDefault: string = LOAI_HANG_DTQG.THOC;
  gaoIdDefault: string = LOAI_HANG_DTQG.GAO;
  muoiIdDefault: string = LOAI_HANG_DTQG.MUOI;

  listDonViTinh: any[] = [];
  donViTinhModel: string;

  options: any[] = [];
  optionsDonVi: any[] = [];

  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private quanLyBangKeCanHangService: QuanLyBangKeCanHangService,
    private notification: NzNotificationService,
    private router: Router,
    private modal: NzModalService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private fb: FormBuilder,
    private routerActive: ActivatedRoute,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.id = +this.routerActive.snapshot.paramMap.get('id');
      await Promise.all([
        this.loadChiTiet(this.id),
        this.loadDonViTinh(),
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
      soBangKe: [null, [Validators.required]],
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

  async loadDonViTinh() {
    try {
      const res = await this.donViService.loadDonViTinh();
      if (res.msg == MESSAGE.SUCCESS) {
        for (let i = 0; i < res.data.length; i++) {
          const item = {
            ...res.data[i],
            labelDonViTinh: res.data[i].tenDviTinh,
          };
          this.listDonViTinh.push(item);
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

  selectDonViTinh(donViTinh) {
    this.formData.controls['donViTinh'].setValue(donViTinh);
  }

  selectHangDTQG(hangDTQG) {
    this.formData.controls['hangDTQG'].setValue(hangDTQG);
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

  back() {
    this.router.navigate(['nhap/dau-thau/quan-ly-bang-ke-can-hang']);
  }

  trinhDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn trình duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          await this.save(true);
          let body = {
            id: this.id,
            lyDo: null,
            trangThai: '01',
          };
          let res = await this.quanLyBangKeCanHangService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
          }
          else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  async save(isOther: boolean) {
    if (this.formData.valid) {
      this.spinner.show();
      try {
        let body = {
          "chiTiets": [
            {
              "id": 0,
              "maCan": "string",
              "soBaoBi": 0,
              "stt": 0,
              "trongLuongCaBi": 0
            }
          ],
          "diaChi": "string",
          "donViTinh": "string",
          "id": 0,
          "maDonViLap": "string",
          "maHang": "string",
          "maKhoNganLo": "string",
          "ngayLap": "string",
          "qlPhieuNhapKhoLtId": 0,
          "soBangKe": "string",
          "soKho": "string",
          "tenHang": "string",
          "tenNguoiGiaoHang": "string",
          "thoiGianGiaoHang": "2022-04-28T09:06:42.415Z"
        }
        if (this.id == 0) {
          let res = await this.quanLyBangKeCanHangService.them(body);
          if (res.msg == MESSAGE.SUCCESS) {
            if (!isOther) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
              this.back();
            }
          }
          else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        }
        else {
          let res = await this.quanLyBangKeCanHangService.sua(body);
          if (res.msg == MESSAGE.SUCCESS) {
            if (!isOther) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
              this.back();
            }
          }
          else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        }
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    }
  }
}
