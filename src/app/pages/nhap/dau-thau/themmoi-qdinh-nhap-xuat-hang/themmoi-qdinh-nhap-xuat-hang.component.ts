import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogQuyetDinhGiaoChiTieuComponent } from 'src/app/components/dialog/dialog-quyet-dinh-giao-chi-tieu/dialog-quyet-dinh-giao-chi-tieu.component';
import { DATEPICKER_CONFIG } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { QuyetDinhNhapXuat } from 'src/app/models/QuyetDinhNhapXuat';
import { DonviService } from 'src/app/services/donvi.service';
import { Globals } from 'src/app/shared/globals';
import { UserService } from 'src/app/services/user.service';
import { UserLogin } from 'src/app/models/userlogin';

@Component({
  selector: 'app-themmoi-qdinh-nhap-xuat-hang',
  templateUrl: './themmoi-qdinh-nhap-xuat-hang.component.html',
  styleUrls: ['./themmoi-qdinh-nhap-xuat-hang.component.scss']
})
export class ThemmoiQdinhNhapXuatHangComponent implements OnInit {
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  formData: FormGroup;
  chiTietQDGiaoNhapXuatHang: any = [];
  taiLieuDinhKemList: any[] = [];
  datePickerConfig = DATEPICKER_CONFIG;
  id: number;
  type: string = '';
  newQDNhapXuat: QuyetDinhNhapXuat;
  dataQDNhapXuat;
  options: any[] = [];
  optionsDonVi: any[] = [];
  userInfo: UserLogin
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private modal: NzModalService,
    private donViService: DonviService,
    private notification: NzNotificationService,
    private spinner: NgxSpinnerService,
    public globals: Globals,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userInfo = this.userService.getUserLogin();
    console.log("🚀 ~ file: themmoi-qdinh-nhap-xuat-hang.component.ts ~ line 45 ~ ThemmoiQdinhNhapXuatHangComponent ~ ngOnInit ~ this.userInfo", this.userInfo)

    this.id = +this.activatedRoute.snapshot.paramMap.get('id');
    this.type = this.activatedRoute.snapshot.paramMap.get('type');
    this.initForm();
    this.newObjectQDNhapXuat();
  }

  redirectToDanhSachDauThau() {
    this.router.navigate([`nhap/dau-thau/danh-sach-dau-thau/${this.type}`]);
  }

  initForm() {
    this.formData = this.fb.group({
      soQdinh: [null, [Validators.required]],
      ngayQdinh: ["", [Validators.required, this.dateValidator]],
      canCu: [null, [Validators.required]],
      veViec: [null],
      donvi: [null]
    });
  }

  dateValidator = (control: FormControl): { [s: string]: boolean } => {
    if (control.value && !moment(control.value, 'DD/MM/YYYY', true).isValid()) {
      return { invalid: true };
    }
    return {};
  };

  openDialogQuyetDinhGiaoChiTieu() {
    const modalQD = this.modal.create({
      nzTitle: 'Thông tin QĐ giao chỉ tiêu kế hoạch',
      nzContent: DialogQuyetDinhGiaoChiTieuComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalQD.afterClose.subscribe((data) => {
      if (data) {
        // this.chiTietThongTinDXKHLCNT.qdCanCu = data.soQuyetDinh;
        this.formData.patchValue({
          canCu: data.soQuyetDinh,
        });
      }
    });
  }

  deleteTaiLieuDinhKemTag(data: any) {
    this.taiLieuDinhKemList = this.taiLieuDinhKemList.filter(
      (x) => x.id !== data.id,
    );
  }

  openFile(event) {
    let item = {
      id: new Date().getTime(),
      text: event,
    };
    if (!this.taiLieuDinhKemList.find((x) => x.text === item.text)) {
      this.taiLieuDinhKemList.push(item);
    }
  }

  themmoi() {

  }

  clearNew() {

  }

  startEdit(index) {

  }

  deleteData(stt) {

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

  selectDonVi(option) {
    console.log("🚀 ~ file: themmoi-qdinh-nhap-xuat-hang.component.ts ~ line 151 ~ ThemmoiQdinhNhapXuatHangComponent ~ selectDonVi ~ option", option)
  }

  changeDonVi() {

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
    } catch (error) {
      this.spinner.hide();
    }
  }

  newObjectQDNhapXuat() {
    this.newQDNhapXuat = new QuyetDinhNhapXuat();
  }

  onInputHangHoa(e: Event): void {
    // const value = (e.target as HTMLInputElement).value;
    // if (!value || value.indexOf('@') >= 0) {
    //   this.options = [];
    // } else {
    //   this.options = this.optionsDonVi.filter(
    //     (x) => x.labelDonVi.toLowerCase().indexOf(value.toLowerCase()) != -1,
    //   );
    // }
  }

  selectHangHoa(option) {
    console.log("🚀 ~ file: themmoi-qdinh-nhap-xuat-hang.component.ts ~ line 151 ~ ThemmoiQdinhNhapXuatHangComponent ~ selectDonVi ~ option", option)
  }

  changeMaHangHoa() {

  }

  onInputDonViTinh(e: Event): void {
    // const value = (e.target as HTMLInputElement).value;
    // if (!value || value.indexOf('@') >= 0) {
    //   this.options = [];
    // } else {
    //   this.options = this.optionsDonVi.filter(
    //     (x) => x.labelDonVi.toLowerCase().indexOf(value.toLowerCase()) != -1,
    //   );
    // }
  }

  selectDonViTinh(option) {
    console.log("🚀 ~ file: themmoi-qdinh-nhap-xuat-hang.component.ts ~ line 151 ~ ThemmoiQdinhNhapXuatHangComponent ~ selectDonVi ~ option", option)
  }

  changeDonViTinh() {

  }

  tenHangHoa() {
    return 'Test 123'
  }

}
