import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { Globals } from 'src/app/shared/globals';
import { HelperService } from '../../../services/helper.service';
import { DanhMucDungChungService } from '../../../services/danh-muc-dung-chung.service';
import { Router } from '@angular/router';
import { QlNguoiSuDungService } from 'src/app/services/quantri-nguoidung/qlNguoiSuDung.service';
import { DonviService } from 'src/app/services/donvi.service';
import { DialogDoiMatKhauComponent } from '../dialog-doi-mat-khau/dialog-doi-mat-khau.component';
import { CauHinhDangNhapService } from 'src/app/services/quantri-nguoidung/cau-hinh-dang-nhap';

@Component({
  selector: 'dialog-thong-tin-can-bo',
  templateUrl: './dialog-thong-tin-can-bo.component.html',
  styleUrls: ['./dialog-thong-tin-can-bo.component.scss'],
})
export class DialogThongTinCanBoComponent implements OnInit {
  dataEdit: any;
  isView: boolean;
  isOld: boolean;
  formData: FormGroup;
  totalRecord: number = 10;
  danhMucList: any[] = [];
  sysTypeList: any[] = [];
  optionsDonVi: any[] = [];
  optionsChucVu: any[] = [];
  options: any[] = [];
  optionsBoNganh: any[] = [];
  optionsPhongBan: any[] = [];
  optionsPhongBanFilter: any[] = [];
  suggestPhongBan: any[] = [];


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private _modalRef: NzModalRef,
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    private dmService: DanhMucDungChungService,
    public globals: Globals,
    private helperService: HelperService,
    private notification: NzNotificationService,
    private qlNSDService: QlNguoiSuDungService,
    private donViService: DonviService,
    private cauHinhDangNhapService: CauHinhDangNhapService,
  ) {
    this.formData = this.fb.group({
      id: [null],
      fullName: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
      email: [null, [Validators.required, Validators.email]],
      username: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(16)]],
      password: [null],
      userType: ['DT', [Validators.required]],
      position: [null, [Validators.required]],
      phoneNo: [null, [Validators.required]],
      status: ['01', [Validators.required]],
      sysType: ['APP', [Validators.required]],
      dvql: [null, [Validators.required]],
      department: [null],
      ghiChu: [null],
    });
  }

  dsTrangThai: any = [
    {
      ma: '00',
      ten: 'Không hoạt động',
    },
    {
      ma: '01',
      ten: 'Hoạt động',
    },
  ];

  async ngOnInit() {
    await Promise.all([
      this.getDmList(),
      this.getSysType(),
      this.laytatcadonvi(),
      this.getListChucVu(),
      this.listAllBoNganh(),
    ]);
    await this.bindingData(this.dataEdit);
  }

  async laytatcadonvi() {
    this.spinner.show();
    try {
      let res = await this.donViService.layTatCaDonVi();
      this.optionsDonVi = [];
      this.optionsPhongBan = [];
      if (res.msg == MESSAGE.SUCCESS) {
        for (let i = 0; i < res.data.length; i++) {
          var item = {
            ...res.data[i],
            labelDonVi: res.data[i].maDvi + ' - ' + res.data[i].tenDvi,
          };
          this.optionsDonVi.push(item);
          this.optionsPhongBan.push(item);
        }
        this.optionsDonVi = this.optionsDonVi.filter(s => s.type != 'MLK');
        this.optionsPhongBan = this.optionsPhongBan.filter(s => s.type == 'PB');
        // nếu dữ liệu detail có
        // if (this.dataEdit?.dvql && this.dataEdit?.department) {
        //   let dv = res.data.find(s => s.maDvi == this.formData.get('dvql').value);
        //   console.log(dv,'this.dataEditthis.dataEdit');
        //   let pb = res.data.find(s => s.maDvi == this.formData.get('department').value);
        //   this.formData.patchValue({
        //     dvql: dv ? dv.maDvi + " - " + dv.tenDvi : '',
        //     department: pb ? pb.maDvi + " - " + pb.tenDvi : ''
        //   });
        // }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      // this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async listAllBoNganh() {
    this.spinner.show();
    try {
      let res = await this.donViService.layTatCaDonViByLevel(0);
      this.optionsBoNganh = [];
      if (res.msg == MESSAGE.SUCCESS) {
        this.optionsBoNganh = res.data.map((obj) => {
          return {
            ...obj,
            labelDonVi: obj.key + ' - ' + obj.title,
          };
        });
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
      if (this.formData.get('userType').value == 'BN') {
        this.options = this.optionsDonVi.filter(
          (x) => x.capDvi == '0' && x.labelDonVi.toLowerCase().indexOf(value.toLowerCase()) != -1,
        );
      } else {
        this.options = this.optionsDonVi.filter(
          (x) => x.labelDonVi.toLowerCase().indexOf(value.toLowerCase()) != -1,
        );
      }
    }
  }

  changeUserType(type) {
    if (type) {
      this.formData.patchValue({
        dvql: null,
        department: null,
      });
      if (type == 'BN') {
        this.options = this.optionsBoNganh;
      } else {
        this.options = this.optionsDonVi;
      }
    }
  }

  onInputPhongBan(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.suggestPhongBan = [];
    } else {
      this.suggestPhongBan = this.optionsPhongBanFilter.filter(
        (x) => x.labelDonVi.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }

  async getListChucVu() {
    let res = await this.dmService.danhMucChungGetAll('VAI_TRO_CHUC_VU');
    this.optionsChucVu = res.data;
  }

  async getSysType() {
    let res = await this.dmService.danhMucChungGetAll('KIEU_XT');
    this.sysTypeList = res.data;
  }

  async save() {
    this.spinner.show();
    if (!this.dataEdit) {
      if (!this.formData.value.password) {
        this.notification.error(MESSAGE.ERROR, 'Mật khẩu không được để trống');
        this.spinner.hide();
        return;
      }
      if (this.formData.value.password.length < 8 || this.formData.value.password.length > 20) {
        this.notification.error(MESSAGE.ERROR, 'Mật khẩu phải từ 8 đến 20 ký tự');
        this.spinner.hide();
        return;
      }
    }
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.dvql = this.formData.get('dvql').value.split('-')[0].trim();
    body.department = this.formData.get('department').value ? this.formData.get('department').value.split('-')[0].trim() : '';
    let res;
    if (this.dataEdit != null) {
      res = await this.qlNSDService.update(body);
    } else {
      res = await this.qlNSDService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (this.dataEdit != null) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      } else {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
      }
      this._modalRef.close(this.formData);
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  async getDmList() {
    let data = await this.dmService.danhMucChungGetAll('DANH_MUC_DC');
    this.danhMucList = data.data;
  }


  handleCancel() {
    this._modalRef.destroy();
  }

  async bindingData(dataDt) {
    if (dataDt) {
      let dv = this.optionsDonVi.find(s => s.maDvi == dataDt.dvql);
      let pb = this.optionsPhongBan.find(s => s.maDvi == dataDt.department);
      this.formData.patchValue({
        id: dataDt.id,
        fullName: dataDt.fullName,
        email: dataDt.email,
        username: dataDt.username,
        password: dataDt.password,
        position: dataDt.position,
        phoneNo: dataDt.phoneNo,
        status: dataDt.status,
        sysType: dataDt.sysType,
        userType: dataDt.userType,
        dvql: dv ? dv.maDvi + ' - ' + dv.tenDvi : '',
        department: pb ? pb.maDvi + ' - ' + pb.tenDvi : '',
        ghiChu: dataDt.ghiChu,
      });
    }
  }

  changeDvql() {
    this.formData.patchValue({
      department: '',
    });
    this.suggestPhongBan = [];
    if (this.formData.get('dvql').value) {
      this.optionsPhongBanFilter = this.optionsPhongBan.filter(s => s.maDviCha == (this.formData.get('dvql').value.includes('-') ? this.formData.get('dvql').value.split('-')[0].trim() : this.formData.get('dvql').value));
    }
    this.suggestPhongBan = this.optionsPhongBanFilter;
  }

  async doiMK() {
    let res = await this.cauHinhDangNhapService.chiTiet();
    let data = {}
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data.length > 0) {
        data = res.data[0]
      }
    }
    let modal = this.modal.create({
      nzTitle: 'ĐỔI MẬT KHẨU',
      nzContent: DialogDoiMatKhauComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '500px',
      nzFooter: null,
      nzComponentParams: {
        isOld: this.isOld,
        username: this.formData.value.username,
        pattern: data
      },
    });
    modal.afterClose.subscribe(async (data) => {
      if (data) {
        console.log('doiMK', data)
        let res = await this.qlNSDService.changePassword(data);
        if (res.msg == MESSAGE.SUCCESS) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      }

    })
  }
}
