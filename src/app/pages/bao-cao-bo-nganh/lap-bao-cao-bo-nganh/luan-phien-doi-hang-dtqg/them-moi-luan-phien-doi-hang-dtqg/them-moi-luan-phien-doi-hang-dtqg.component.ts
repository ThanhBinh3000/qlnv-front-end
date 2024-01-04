import {Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import { Base2Component } from "../../../../../components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import * as dayjs from "dayjs";
import { Validators } from "@angular/forms";
import { BcBnTt145Service } from 'src/app/services/bao-cao/BcBnTt145.service';
import { MESSAGE } from 'src/app/constants/message';
import { UserService } from 'src/app/services/user.service';
import { cloneDeep, chain } from 'lodash';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { formatDate } from '@angular/common';
import { DonviService } from 'src/app/services/donvi.service';
import {CurrencyMaskInputMode} from "ngx-currency";

@Component({
  selector: 'app-them-moi-luan-phien-doi-hang-dtqg',
  templateUrl: './them-moi-luan-phien-doi-hang-dtqg.component.html',
  styleUrls: ['./them-moi-luan-phien-doi-hang-dtqg.component.scss']
})
export class ThemMoiLuanPhienDoiHangDtqgComponent extends Base2Component implements OnInit {
  @ViewChild('labelImport') labelImport: ElementRef;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  THONG_TU_SO = "145/2023/TT-BTC"
  TEN_BIEU_SO = "Phụ lục số 4"
  BIEU_SO = "PL04"
  itemRowUpdate: any = {};
  itemRow: any = {};
  itemRowUpdateXuat: any = {};
  itemRowXuat: any = {};
  listData: any;
  thoiGianSx: Date | null = null;
  thoiGianNk: Date | null = null;
  thoiGianSxXuat: Date | null = null;
  thoiGianNkXuat: Date | null = null;
  listDataDetail: any[] = [];
  listDataNhap: any[] = [];
  listDataXuat: any[] = [];
  listCloaiVthh: any[] = [];
  now: any;
  listDsDvi: any;
  optionsCloaiVthh: any[] = [];
  inputCloaiVthh: string = '';
  optionsDonViShow: any[] = [];
  selectedCloaiVthh: any = {};
  tenBoNganh: any;
  amount = {
    allowZero: true,
    allowNegative: false,
    precision: 3,
    prefix: '',
    thousands: '.',
    decimal: ',',
    align: "right",
    nullable: true,
    min: 0,
    max: 1000000000000,
    inputMode: CurrencyMaskInputMode.NATURAL,
  }
  constructor(httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    private bcBnTt145Service: BcBnTt145Service,
    private donViService: DonviService,
    private danhMucService: DanhMucService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    public userService: UserService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bcBnTt145Service);
    this.formData = this.fb.group(
      {
        nam: [dayjs().get("year"), [Validators.required]],
        id: [null],
        tgianTao: new Date(),
        thongTuSo: [null],
        bieuSo: [null],
        tenBieuSo: [null],
        dviGui: [null],
        tenDviGui: [null],
        boNganh: [null],
        dviNhan: [null],
        denNgayKyGui: [null],
        tenHang: [null],
        cloaiVthh: [null],
        trangThai: "00",
        tenTrangThai: "Dự thảo",
        detail: [],
        kySo: [null],
      }
    );
  }

  async ngOnInit() {
    this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    this.templateName = 'template_bcbn_kh_luan_phien_doi_hang_dtqg.xlsx'
    this.now = dayjs(); // Lấy ngày giờ hiện tại
    await Promise.all([
      this.getUserInfor(),
      // this.loadDsVthh(),
      this.loadDsDonVi(),
      this.layTatCaDonViByLevel()
    ]);
    if (this.idInput > 0) {
      await this.getDetail(this.idInput, null);
    } else {
      this.initForm();
    }
    await this.spinner.hide();
  }

  async getDetail(id?: number, soDx?: string) {
    await this.bcBnTt145Service
      .getDetail(id)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.listData = res.data;
          this.formData.patchValue({
            bieuSo: this.listData.bieuSo,
            thongTuSo: this.listData.thongTuSo,
            boNganh: this.listData.boNganh,
            nam: this.listData.nam,
            dviGui: this.userService.isTongCuc() ? this.listData.dviGui : this.userInfo.MA_DVI,
            tenDviGui: this.userService.isTongCuc() ? this.listData.tenDviGui : this.userInfo.TEN_DVI,
            tenTrangThai: this.listData.tenTrangThai,
            tGianTaoTuNgay: this.listData.tGianTaoTuNgay,
            tGianTaoDenNgay: this.listData.tGianTaoDenNgay,
            tGianBanHanhTuNgay: this.listData.tGianBanHanhTuNgay,
            tGianBanHanhDenNgay: this.listData.tGianBanHanhDenNgay,
            trangThai: this.listData.trangThai,
          });
          this.listDataDetail = this.listData.detail
          this.listDataNhap = this.listDataDetail.filter(item => item.type == "1");
          this.listDataXuat = this.listDataDetail.filter(item => item.type == "2");
        }
      })
      .catch((e) => {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
  }

  initForm() {
    this.formData.patchValue({
      thongTuSo: this.THONG_TU_SO,
      tenBieuSo: this.TEN_BIEU_SO,
      bieuSo: this.BIEU_SO,
      dviGui: this.userInfo.MA_DVI,
      tenDviGui: this.userInfo.TEN_DVI,
      trangThai: "00",
      tenTrangThai: "Dự thảo"
    })
    if(!this.userService.isTongCuc()){
      this.handleChoose(this.userInfo.MA_DVI).then();
    }
  }

  async getUserInfor() {
    this.formData.patchValue({
      dviGui: this.userService.isTongCuc() ? this.formData.value.dviGui : this.userInfo.MA_DVI,
      tenDviGui: this.userInfo.TEN_DVI,
      tenBieuSo: this.TEN_BIEU_SO,
    })
  }

  quayLai() {
    this.showListEvent.emit();
  }

  startEdit(index: number): void {
    this.listDataNhap[index].edit = true;
    this.itemRowUpdate = cloneDeep(this.listDataNhap[index]);
  }

  cancelEdit(index: number): void {
    this.listDataNhap[index].edit = false;
  }

  saveEdit(dataUpdate, index: any): void {
    this.itemRowUpdate.type = "1"
    this.listDataNhap[index] = this.itemRowUpdate;
    this.listDataNhap[index].edit = false;
  }

  clearItemRow() {
    let soLuong = this.itemRow.soLuong;
    this.itemRow = {};
    this.itemRow.soLuong = soLuong;
    this.itemRow.id = null;
    this.thoiGianSx = null;
    this.thoiGianNk = null;
  }

  startEditXuat(index: number): void {
    this.listDataXuat[index].edit = true;
    this.itemRowUpdateXuat = cloneDeep(this.listDataXuat[index]);
  }

  cancelEditXuat(index: number): void {
    this.listDataXuat[index].edit = false;
  }

  saveEditXuat(dataUpdate, index: any): void {
    this.itemRowUpdateXuat.type = "2"
    this.listDataXuat[index] = this.itemRowUpdateXuat;
    this.listDataXuat[index].edit = false;
  }

  clearItemRowXuat() {
    let soLuong = this.itemRow.soLuong;
    this.itemRowXuat = {};
    this.itemRowXuat.soLuong = soLuong;
    this.itemRowXuat.id = null;
    this.thoiGianSxXuat = null;
    this.thoiGianNkXuat = null;
  }

  deleteRow(i) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.listDataNhap.splice(i, 1)
      },
    });
  }
  deleteRowXuat(i) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.listDataXuat.splice(i, 1)
      },
    });
  }

  addRow(): void {
    this.itemRow.type = "1"
    this.listDataNhap = [
      ...this.listDataNhap,
      this.itemRow
    ];
    this.clearItemRow();
  }
  addRowXuat(): void {
    this.itemRowXuat.type = "2"
    this.listDataXuat = [
      ...this.listDataXuat,
      this.itemRowXuat
    ];
    this.clearItemRowXuat();
  }

  convertDateToString(event: any): string {
    let result = '';
    if (event) {
      result = dayjs(event).format('DD/MM/YYYY').toString()
    }
    return result;
  }

  async loadDsVthh() {
    let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.listCloaiVthh = res.data?.filter((x) => x.ma.length == 6);
    }
  }

  changeCloaiVthh($event) {
    let cloaiVthh = this.listCloaiVthh.filter(item => item.ma == $event);
    this.itemRow.tenHang = cloaiVthh[0].ten;
    this.itemRow.dvt = cloaiVthh[0].maDviTinh;
    this.itemRowUpdate.dvt = cloaiVthh[0].maDviTinh;
    this.itemRowUpdate.tenHang = cloaiVthh[0].ten;
    this.itemRowUpdate.type = "1";
    this.formData.patchValue({
      cloaiVthh: cloaiVthh[0].ma,
      tenHang: cloaiVthh[0].ten,
    })
  }

  changeCloaiVthhXuat($event) {
    let cloaiVthh = this.listCloaiVthh.filter(item => item.ma == $event);
    this.itemRowXuat.tenHang = cloaiVthh[0].ten;
    this.itemRowXuat.dvt = cloaiVthh[0].maDviTinh;
    this.itemRowUpdateXuat.dvt = cloaiVthh[0].maDviTinh;
    this.itemRowUpdateXuat.tenHang = cloaiVthh[0].ten;
    this.itemRowUpdateXuat.type = "2";
    this.formData.patchValue({
      cloaiVthh: cloaiVthh[0].ma,
      tenHang: cloaiVthh[0].ten,
    })
  }

  async save(isBanHanh?: boolean) {
    await this.spinner.show();
    console.log(this.listDataNhap)
    console.log(this.listDataXuat)
    if (this.listDataNhap != null || this.listDataXuat != null) {
      this.listDataDetail = this.listDataNhap.concat(this.listDataXuat)
      console.log(this.listDataDetail)
    }
    if (this.listDataDetail.length == 0) {
      this.notification.error(MESSAGE.ERROR, "Vui lòng cập nhật thông tin báo cáo");
      await this.spinner.hide();
      return
    }
    let body = this.formData.value
    body.id = this.idInput
    if(!this.userService.isTongCuc()){
      body.dviGui = this.userInfo.MA_DVI
      body.boNganh = this.userInfo.TEN_DVI
    }else{
      body.boNganh = this.tenBoNganh
    }
    body.detail = this.listDataDetail
    let res = null;
    if (this.idInput > 0) {
      res = await this.bcBnTt145Service.update(body);
    } else {
      // body.tgianTao = formatDate(this.now, "dd-MM-yyyy", 'en-US')
      res = await this.bcBnTt145Service.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      this.idInput = res.data.id
      if (isBanHanh) {
        this.pheDuyetBcBn(body);
      } else {
        if (this.formData.get('id').value) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        }
      }
      await this.spinner.hide()
      // this.quayLai();
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide()
  }

  async loadDsDonVi() {
    let body = {
      trangThai: "01", maDviCha: "01",
      type: "DV"
    };
    let res = await this.donViService.getDonViTheoMaCha(body); if (res.msg == MESSAGE.SUCCESS) {
      this.formData.get('dviNhan').setValue(res.data[0].tenDvi);
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  onDateChanged(value: any, type: any) {
    if (type == 'thoiGianSx') {
      this.itemRow.thoiGianSx = value
    } else if (type == 'tgianMthau') {
      this.formData.get('tgianMthau').setValue(value);
    } else if (type == 'tgianDthau') {
      this.formData.get('tgianDthau').setValue(value);
    } else if (type == 'tgianNhang') {
      this.formData.get('tgianNhang').setValue(value);
    }
  }
  sumslXuat(column?: string, tenDvi?: string, type?: string): number {
    let result = 0;
    let arr = [];
    if (this.listDataXuat.length > 0) {
      this.listDataXuat.forEach(item => {
        arr.push(item)
      })
    }
    if (arr && arr.length > 0) {
      if (type) {
        const sum = arr.reduce((prev, cur) => {
          if (cur[column]) {
            prev += Number.parseFloat(cur[column]);
          }
          return prev;
        }, 0);
        result = sum
      }
    }
    return result;
  }

  sumslNhap(column?: string, tenDvi?: string, type?: string): number {
    let result = 0;
    let arr = [];
    if (this.listDataNhap.length > 0) {
      this.listDataNhap.forEach(item => {
        arr.push(item)
      })
    }
    if (arr && arr.length > 0) {
      if (type) {
        const sum = arr.reduce((prev, cur) => {
          if (cur[column]) {
            prev += Number.parseFloat(cur[column]);
          }
          return prev;
        }, 0);
        result = sum
      }
    }
    return result;
  }
  async handleSelectFile(event: any){
    this.labelImport.nativeElement.innerText = event.target.files[0].name;
    await this.onFileSelected(event);
    if(this.dataImport.length > 0){
      this.listDataNhap = this.dataImport.filter(obj => obj.type == '1');
      this.listDataXuat = this.dataImport.filter(obj => obj.type == '2');
    }
  }

  async handleChoose(event) {
    let data = this.listDsDvi.find(x => x.maDvi == event)
    this.tenBoNganh = data.tenDvi
    let res = await this.danhMucService.getDanhMucHangHoaDvql({
      'maDvi': data.maDvi ? (data.maDvi == '01' ? '0101' : data.maDvi) : this.userInfo.MA_DVI,
    }).toPromise();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listCloaiVthh = res.data;
      this.optionsCloaiVthh = this.listCloaiVthh
    }
  }

  onInputDonVi(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.optionsCloaiVthh = this.listCloaiVthh;
    } else {
      this.optionsCloaiVthh = this.listCloaiVthh.filter(
        (x) => x.tenHangHoa.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }

  async selectDonVi(donVi) {
    this.itemRow.cloaiVthh = donVi.maHangHoa;
    this.itemRow.tenHang = donVi.tenHangHoa;
    this.itemRow.dvt = donVi.maDviTinh;
  }

  async selectDonViXuat(donVi) {
    console.log(1)
    this.itemRowXuat.cloaiVthh = donVi.maHangHoa;
    this.itemRowXuat.tenHang = donVi.tenHangHoa;
    this.itemRowXuat.dvt = donVi.maDviTinh;
  }

  async selectCloaiVthhUpdate(donVi) {
    this.itemRowUpdate.cloaiVthh = donVi.maHangHoa;
    this.itemRowUpdate.tenHang = donVi.tenHangHoa;
    this.itemRowUpdate.dvt = donVi.maDviTinh;
  }

  async selectCloaiVthhUpdateXuat(donVi) {
    this.itemRowUpdateXuat.cloaiVthh = donVi.maHangHoa;
    this.itemRowUpdateXuat.tenHang = donVi.tenHangHoa;
    this.itemRowUpdateXuat.dvt = donVi.maDviTinh;
  }

  async layTatCaDonViByLevel() {
    let res = await this.donViService.layTatCaDonViByLevel(0);
    if (res.msg == MESSAGE.SUCCESS) {
      console.log(res.data, 1234)
      this.listDsDvi = res.data
      // this.formData.get('dviNhan').setValue(res.data[0].tenDvi);
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }
}
