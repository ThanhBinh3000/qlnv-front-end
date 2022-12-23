import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DATEPICKER_CONFIG, LIST_VAT_TU_HANG_HOA } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DonviLienQuanService } from 'src/app/services/donviLienquan.service';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { STATUS } from "../../../../../../constants/status";
import { cloneDeep, chain } from 'lodash';
import { NzModalService } from "ng-zorro-antd/modal";
import { QuyetDinhPheDuyetKeHoachMTTService } from 'src/app/services/quyet-dinh-phe-duyet-ke-hoach-mtt.service';
import { ChaogiaUyquyenMualeService } from 'src/app/services/chaogia-uyquyen-muale.service';

@Component({
  selector: 'app-themmoi-chaogia-uyquyen-muale',
  templateUrl: './themmoi-chaogia-uyquyen-muale.component.html',
  styleUrls: ['./themmoi-chaogia-uyquyen-muale.component.scss']
})
export class ThemmoiChaogiaUyquyenMualeComponent implements OnInit, OnChanges {
  @Input() idInput: number;
  @Input() loaiVthh: String;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() isShowFromKq: boolean;

  constructor(
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public userService: UserService,
    private helperService: HelperService,
    private quyetDinhPheDuyetKeHoachMTTService: QuyetDinhPheDuyetKeHoachMTTService,
    public globals: Globals,
    private fb: FormBuilder,
    private chaogiaUyquyenMualeService: ChaogiaUyquyenMualeService,
  ) {
    this.formData = this.fb.group({
      namKh: [''],
      soQdPdKqMtt: [],
      tenDvi: [],
      diaDiemChaoGiaP: [],
      tgianMkho: [],
      tgianKthuc: [],
      moTaHangHoa: [],
      loaiVthh: [],
      tenLoaiVthh: [],
      cloaiVthh: [],
      tenCloaiVthh: [],
      ghiChu: [],
      diaDiemCgia: [],
      trangThaiTkhai: [''],
      tenTrangThaiTkhai: ['CHƯA CẬP NHẬT']
    });
  }

  idChaoGia: number = 0;
  STATUS = STATUS
  itemRow: any = {};
  itemRowUpdate: any = {};
  radioValue: string = 'CG';
  taiLieuDinhKemList: any[] = [];
  listNthauNopHs: any[] = [];
  i = 0;
  formData: FormGroup
  dataTable: any[] = [];
  dataDetail: any;
  danhsachDx: any[] = [];
  userInfo: UserLogin;
  datePickerConfig = DATEPICKER_CONFIG;

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (this.idInput) {
        this.getDetail()
      }
    }
  }

  async getDetail() {
    this.spinner.show();
    const res = await this.quyetDinhPheDuyetKeHoachMTTService.getDetailDtlCuc(this.idInput);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data;
      console.log(data, 99999)
      this.formData.patchValue({
        soQdPdKqMtt: data.hhQdPheduyetKhMttHdr.soQd,
        tenDvi: data.tenDvi,
        diaDiemCgia: data.diaChiDvi,
        ghiChu: data.ghiChu,
        tgianMkho: data.tgianMkho,
        tgianKthuc: data.tgianKthuc,
        loaiVthh: data.hhQdPheduyetKhMttHdr.loaiVthh,
        tenLoaiVthh: data.hhQdPheduyetKhMttHdr.tenLoaiVthh,
        cloaiVthh: data.hhQdPheduyetKhMttHdr.cloaiVthh,
        tenCloaiVthh: data.hhQdPheduyetKhMttHdr.tenCloaiVthh,
        moTaHangHoa: data.moTaHangHoa,
      });
      this.formData.patchValue({
        trangThaiTkhai: data.trangThaiTkhai,
        tenTrangThaiTkhai: data.tenTrangThaiTkhai
      })
      this.listNthauNopHs = data.hhChiTietTTinChaoGiaList;
      this.taiLieuDinhKemList = data.fileDinhkems;
      console.log(this.listNthauNopHs, 88888)

    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  quayLai() {
    this.showListEvent.emit();
  }

  pipe = new DatePipe('en-US');
  async save() {
    await this.spinner.show();
    let body = {
      id: this.idInput,
      trangThaiTkhai: STATUS.HOAN_THANH_CAP_NHAT,
    }
    let res = await this.chaogiaUyquyenMualeService.approve(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      await this.spinner.hide()
      this.quayLai();
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide()
  }

  async saveGoiThau() {
    await this.spinner.show()
    let body = {
      idChaoGia: this.idInput,
      hhChiTietTTinChaoGiaReqs: this.listNthauNopHs,
      ptMuaTrucTiep: this.radioValue,
      fileDinhkems: this.taiLieuDinhKemList
    }
    let res = await this.chaogiaUyquyenMualeService.create(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      await this.getDetail()
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide()
  }

  async showDetail($event, dataChaoGia: any) {
    await this.spinner.show();
    this.listNthauNopHs = [];
    $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
    $event.target.parentElement.classList.add('selectedRow')
    this.idChaoGia = dataChaoGia.id;
    let res = await this.chaogiaUyquyenMualeService.getDetail(this.idChaoGia);
    if (res.msg == MESSAGE.SUCCESS) {
      this.itemRow.soLuong = dataChaoGia.soLuong;
      this.listNthauNopHs = res.data;
      this.listNthauNopHs.forEach(item => {
        item.edit = false;
      })
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide();
  }

  addRow(): void {
    this.idChaoGia = this.idInput;
    if (this.itemRow) {
      this.listNthauNopHs = [
        ...this.listNthauNopHs,
        this.itemRow
      ];
      this.clearItemRow();
    }
  }

  clearItemRow() {
    let soLuong = this.itemRow.soLuong;
    this.itemRow = {};
    this.itemRow.soLuong = soLuong;
    this.itemRow.id = null;
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
        this.listNthauNopHs.splice(i, 1)
      },
    });
  }

  startEdit(index: number): void {
    this.listNthauNopHs[index].edit = true;
    this.itemRowUpdate = cloneDeep(this.listNthauNopHs[index]);
  }

  cancelEdit(index: number): void {
    this.listNthauNopHs[index].edit = false;
  }

  saveEdit(dataUpdate, index: any): void {
    if (this.itemRowUpdate, index) {
      this.listNthauNopHs[index] = this.itemRowUpdate;
      this.listNthauNopHs[index].edit = false;
    };
  }


  expandSet2 = new Set<number>();
  onExpandChange2(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet2.add(id);
    } else {
      this.expandSet2.delete(id);
    }
  }

  expandSet3 = new Set<number>();
  onExpandChange3(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet3.add(id);
    } else {
      this.expandSet3.delete(id);
    }
  }
}
