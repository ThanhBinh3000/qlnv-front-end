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
import { ChiTietThongTinChaoGia, FileDinhKem } from 'src/app/models/DeXuatKeHoachMuaTrucTiep';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { saveAs } from 'file-saver';


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

  @Output()
  dataTableChange = new EventEmitter<any>();


  constructor(
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public userService: UserService,
    private helperService: HelperService,
    private quyetDinhPheDuyetKeHoachMTTService: QuyetDinhPheDuyetKeHoachMTTService,
    public globals: Globals,
    private uploadFileService: UploadFileService,
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
  rowItem: ChiTietThongTinChaoGia = new ChiTietThongTinChaoGia();
  dataEdit: { [key: string]: { edit: boolean; data: ChiTietThongTinChaoGia } } = {};
  radioValue: string = 'Chào giá';
  fileDinhKems: any[] = [];
  listOfData: any[] = [];
  i = 0;
  formData: FormGroup
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
    this.emitDataTable()
    this.updateEditCache()
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
      this.listOfData = data.hhChiTietTTinChaoGiaList;
      this.updateEditCache();
      this.emitDataTable();
      this.fileDinhKems = data.fileDinhKems;
      console.log(this.listOfData, 88888)

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
      hhChiTietTTinChaoGiaReqs: this.listOfData,
      ptMuaTrucTiep: this.radioValue,
      fileDinhKems: this.fileDinhKems,
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
    this.listOfData = [];
    $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
    $event.target.parentElement.classList.add('selectedRow')
    this.idChaoGia = dataChaoGia.id;
    let res = await this.chaogiaUyquyenMualeService.getDetail(this.idChaoGia);
    if (res.msg == MESSAGE.SUCCESS) {
      this.rowItem.soLuong = dataChaoGia.soLuong;
      this.listOfData = res.data;
      this.listOfData.forEach(item => {
        item.edit = false;
      })
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide();
  }

  addRow(): void {
    this.idChaoGia = this.idInput;
    if (!this.listOfData) {
      this.listOfData = [];
    }
    this.listOfData = [...this.listOfData, this.rowItem];
    this.rowItem = new ChiTietThongTinChaoGia();
    this.emitDataTable();
    this.updateEditCache()
  }

  clearItemRow() {
    let soLuong = this.rowItem.soLuong;
    this.rowItem = new ChiTietThongTinChaoGia();
    this.rowItem.soLuong = soLuong;
    this.rowItem.id = null;
  }

  emitDataTable() {
    this.dataTableChange.emit(this.listOfData);
  }

  deleteRow(index: any) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          this.listOfData.splice(index, 1);
          this.updateEditCache();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }


  updateEditCache(): void {
    if (this.listOfData) {
      this.listOfData.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }

  startEdit(stt: number) {
    this.dataEdit[stt].edit = true;
  }

  cancelEdit(stt: number): void {
    this.dataEdit[stt] = {
      data: { ...this.listOfData[stt] },
      edit: false
    };
  }

  saveEdit(idx: number): void {
    Object.assign(this.listOfData[idx], this.dataEdit[idx].data);
    this.dataEdit[idx].edit = false;
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


  getNameFile(event?: any, tableName?: string, item?: FileDinhKem, type?: any) {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList) {
      const itemFile = {
        name: fileList[0].name,
        file: event.target.files[0] as File,
      };
      this.uploadFileService
        .uploadFile(itemFile.file, itemFile.name)
        .then((resUpload) => {
          if (item) {
            item.fileName = resUpload.filename;
            item.fileSize = resUpload.size;
            item.fileUrl = resUpload.url;
          }
          else {
            if (!type) {
              if (!this.rowItem.fileDinhKems) {
                this.rowItem.fileDinhKems = new FileDinhKem();
              }
              this.rowItem.fileDinhKems.fileName = resUpload.filename;
              this.rowItem.fileDinhKems.fileSize = resUpload.size;
              this.rowItem.fileDinhKems.fileUrl = resUpload.url;
              this.rowItem.fileDinhKems.idVirtual = new Date().getTime();
            } else {
              if (!type.fileDinhKem) {
                type.fileDinhKem = new FileDinhKem();
              }
              type.fileDinhKem.fileName = resUpload.filename;
              type.fileDinhKem.fileSize = resUpload.size;
              type.fileDinhKem.fileUrl = resUpload.url;
              type.fileDinhKem.idVirtual = new Date().getTime();
            }

          }
        });
    }
  }

  downloadFile(item: FileDinhKem) {
    this.uploadFileService.downloadFile(item.fileUrl).subscribe((blob) => {
      saveAs(blob, item.fileName);
    });
  }

  isDisable(): boolean {
    if (this.formData.value.trangThai == STATUS.CHUA_CAP_NHAT || this.formData.value.trangThai == STATUS.DANG_CAP_NHAT) {
      return false
    } else {
      return true
    }
  }

}
