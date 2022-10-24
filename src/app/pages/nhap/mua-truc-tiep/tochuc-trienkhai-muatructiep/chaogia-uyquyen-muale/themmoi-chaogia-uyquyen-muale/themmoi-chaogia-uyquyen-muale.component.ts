import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, } from '@angular/core';
import { FormBuilder, FormGroup, } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DATEPICKER_CONFIG, LIST_VAT_TU_HANG_HOA, } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DonviLienQuanService } from 'src/app/services/donviLienquan.service';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { STATUS } from "../../../../../../constants/status";
import { chain } from 'lodash';
import { NzModalService } from "ng-zorro-antd/modal";
import { QuyetDinhPheDuyetKeHoachMTTService } from 'src/app/services/quyet-dinh-phe-duyet-ke-hoach-mtt.service';
import { ChaogiaUyquyenMualeService } from 'src/app/services/chaogia-uyquyen-muale.service';
import { ChiTietThongTinChaoGia } from 'src/app/models/DeXuatKeHoachMuaTrucTiep';
import { FileDinhKem } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-themmoi-chaogia-uyquyen-muale',
  templateUrl: './themmoi-chaogia-uyquyen-muale.component.html',
  styleUrls: ['./themmoi-chaogia-uyquyen-muale.component.scss']
})
export class ThemmoiChaogiaUyquyenMualeComponent implements OnInit, OnChanges {
  @Input() idInput: number;
  @Input() selectedData: any;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() isShowFromKq: boolean;
  @Input()
  loaiVthhInput: string;

  @Output()
  dataTableChange = new EventEmitter<any>();
  rowItem: ChiTietThongTinChaoGia = new ChiTietThongTinChaoGia();
  dataEdit: { [key: string]: { edit: boolean; data: ChiTietThongTinChaoGia } } = {};
  constructor(
    private uploadFileService: UploadFileService,
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public userService: UserService,
    private helperService: HelperService,
    private quyetDinhPheDuyetKeHoachMTTService: QuyetDinhPheDuyetKeHoachMTTService,
    public globals: Globals,
    private fb: FormBuilder,
    private chaogiaUyquyenMualeService: ChaogiaUyquyenMualeService,
    private donviLienQuanService: DonviLienQuanService,
  ) {
    this.formData = this.fb.group({
      id: [''],
      namKh: [''],
      soQdPduyet: [],
      idDxuat: [],
      soDxuat: [],
      idThop: [''],
      maThop: [],
      maDvi: [],
      tenDvi: [],
      ngayKy: [''],
      ngayHluc: [''],
      trichYeu: [''],
      trangThai: [''],
      tenTrangThai: [''],
      trangThaiTkhai: [''],
      tenTrangThaiTkhai: [''],
      pthucMuatt: [''],
      diaDiemCgia: [''],
      loaiVthh: [],
      tenLoaiVthh: [],
      cloaiVthh: [],
      tenCloaiVthh: [],
      moTaHangHoa: [],
      tgianMkho: [],
      tgianKthuc: [],
      ghiChu: [null]
    });
  }

  taiLieuDinhKemList: any[] = [];
  STATUS = STATUS
  itemRow: any = {};
  itemRowUpdate: any = {};
  radioValue: string = 'CG';
  id: number;
  i = 0;
  listNhaThau: any[] = []
  listStatusNhaThau: any[] = []
  listVthh: any[] = [];
  formData: FormGroup
  dataTable: any[] = [];
  dataDetail: any;
  listOfData: any[] = [];
  listDataGroup: any[] = [];
  userInfo: UserLogin;
  datePickerConfig = DATEPICKER_CONFIG;

  async ngOnInit() {
    this.spinner.show();
    this.listVthh = LIST_VAT_TU_HANG_HOA;
    try {
      this.userInfo = this.userService.getUserLogin();
      await Promise.all([
        this.getDetail(),
      ]);
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async getDetail() {
    if (this.selectedData.trangThaiTkhai == STATUS.CHUA_CAP_NHAT) {
      const res = await this.quyetDinhPheDuyetKeHoachMTTService.getDetail(this.idInput);
      if (res.msg == MESSAGE.SUCCESS) {
        const dataDetail = res.data;
        const dataFilterUser = dataDetail.hhQdPheduyetKhMttDxList.filter(item => item.maDvi == this.userInfo.MA_DVI);
        const dataCurrent = dataFilterUser[0];
        this.helperService.bidingDataInFormGroup(this.formData, dataDetail);
        this.formData.patchValue({
          trangThaiTkhai: dataCurrent.trangThaiTkhai,
          tenTrangThaiTkhai: dataCurrent.tenTrangThaiTkhai
        })
        this.convertListData()
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } else {
      const res = await this.chaogiaUyquyenMualeService.getDetail(this.idInput);
      if (res.msg == MESSAGE.SUCCESS) {
        const dataDetail = res.data;
        this.helperService.bidingDataInFormGroup(this.formData, dataDetail);
        this.listOfData = dataDetail.hhChiTietTTinChaoGiaList;
        this.formData.patchValue({
          trangThaiTkhai: dataDetail.trangThaiTkhai,
          tenTrangThaiTkhai: dataDetail.tenTrangThaiTkhai
        })
        this.convertListData()
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
    this.updateEditCache()
  }

  convertListData() {
    this.listDataGroup = chain(this.listOfData).groupBy('tenDvi').map((value, key) => ({ tenDvi: key, dataChild: value }))
      .value()
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

  async loaiDonviLienquanAll() {
    this.listNhaThau = [];
    const body = {
      "typeDvi": "NT"
    };
    let res = await this.donviLienQuanService.getAll(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listNhaThau = res.data;
    }
  }

  pipe = new DatePipe('en-US');
  async save() {
    await this.spinner.show();
    let filter = this.listOfData.filter(item => item.trangThaiTkhai == STATUS.CHUA_CAP_NHAT);
    if (filter.length > 0) {
      this.notification.error(MESSAGE.ERROR, "Vui lòng cập nhật thông tin các gói thầu");
      await this.spinner.hide();
      return
    }
    let body = this.formData.value;
    body.trangThaiTkhai = STATUS.HOAN_THANH_CAP_NHAT
    body.hhChiTietTTinChaoGiaReqList = this.listOfData
    body.pthucMuatt = this.radioValue
    let res = await this.chaogiaUyquyenMualeService.create(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (this.formData.get('id').value) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        await this.spinner.hide()
        this.quayLai();
      } else {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        await this.spinner.hide()
        this.quayLai();
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide()
  }

  async saveGoiThau() {
    await this.spinner.show()
    let body = this.formData.value;
    body.hhChiTietTTinChaoGiaReqList = this.listOfData
    body.pthucMuatt = this.radioValue
    let res = await this.chaogiaUyquyenMualeService.create(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      await this.getDetail()
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide()
  }

  changeTrangThai($event) {
    let trangThaiTkhai = this.listStatusNhaThau.filter(item => item.value == $event);
    this.itemRow.tenTrangThaiTkhai = trangThaiTkhai[0].text;
    this.itemRowUpdate.tenTrangThaiTkhai = trangThaiTkhai[0].text;
  }

  cancelEdit(stt: number): void {
    const index = this.listOfData.findIndex(item => item.stt === stt);
    this.dataEdit[stt] = {
      data: { ...this.listOfData[index] },
      edit: false
    };
  }

  editRow(stt: number) {
    this.dataEdit[stt].data = this.listOfData[stt];
    this.dataEdit[stt].edit = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (this.idInput) {
        this.getDetail()
      }
    }
  }

  emitDataTable() {
    this.dataTableChange.emit(this.listOfData);
  }

  themDataTable() {
    this.listOfData = [...this.listOfData, this.rowItem];
    this.rowItem = new ChiTietThongTinChaoGia();
    this.emitDataTable();
    this.updateEditCache()
  }

  deleteItem(index: any) {
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
      let i = 0;
      this.listOfData.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: { ...item },
        };
        i++
      });
    }
  }

  getNameFile(event?: any, tableName?: string, item?: FileDinhKem) {
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
            if (!this.rowItem.fileDinhKems) {
              this.rowItem.fileDinhKems = new FileDinhKem();
            }
            this.rowItem.fileDinhKems.fileName = resUpload.filename;
            this.rowItem.fileDinhKems.fileSize = resUpload.size;
            this.rowItem.fileDinhKems.fileUrl = resUpload.url;
            this.rowItem.fileDinhKems.idVirtual = new Date().getTime();
          }
        });
    }
  }

  saveEdit(idx: number): void {
    Object.assign(this.listOfData[idx], this.dataEdit[idx].data);
    this.dataEdit[idx].edit = false;
  }

  downloadFile(item: FileDinhKem) {
    this.uploadFileService.downloadFile(item.fileUrl).subscribe((blob) => {
      saveAs(blob, item.fileName);
    });
  }
}
