import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import dayjs from 'dayjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {PAGE_SIZE_DEFAULT, TYPE_PAG} from 'src/app/constants/config';
import {MESSAGE} from 'src/app/constants/message';
import {UserService} from 'src/app/services/user.service';
import {cloneDeep} from 'lodash';
import {saveAs} from 'file-saver';
import {TongHopPhuongAnGiaService} from 'src/app/services/ke-hoach/phuong-an-gia/tong-hop-phuong-an-gia.service';
import {STATUS} from 'src/app/constants/status';
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-tong-hop-phuong-an-gia',
  templateUrl: './tong-hop-phuong-an-gia.component.html',
  styleUrls: ['./tong-hop-phuong-an-gia.component.scss']
})
export class TongHopPhuongAnGiaComponent implements OnInit {
  @Input() type: string;
  @Input() pagType: string;
  @Input() isChuyenTrang: boolean = false;
  @Output() getCount = new EventEmitter<any>();
  @Output() chuyenTrangEmit = new EventEmitter<any>();
  isAddNew = false;
  isTongHop = false;
  formData: FormGroup;
  formThongTin: FormGroup;
  toDay = new Date();
  allChecked = false;
  listVthh: any[] = [];
  STATUS = STATUS;

  dsNam: string[] = [];

  dataTable: any[] = [];
  page: number = 1;
  dataTableAll: any[] = [];
  totalRecord: number = 10;
  setOfCheckedId = new Set<number>();
  pageSize: number = PAGE_SIZE_DEFAULT;
  indeterminate = false;

  last30Day = new Date(
    new Date().setTime(this.toDay.getTime() - 30 * 24 * 60 * 60 * 1000),
  );

  isViewDetail: boolean = false;
  idSelected: number = 0;
  typeConst = TYPE_PAG


  listTrangThaiTt = [
    {ma: this.STATUS.DU_THAO, giaTri: "Dự thảo"},
    {ma: this.STATUS.CHO_DUYET_LDV, giaTri: "Chờ duyệt - LĐ Vụ"},
    {ma: this.STATUS.TU_CHOI_LDV, giaTri: "Từ chối - LĐ Vụ"},
    {ma: this.STATUS.DA_DUYET_LDV, giaTri: "Đã duyệt - LĐ Vụ"},
    {ma: this.STATUS.DA_BAN_HANH_QD, giaTri: "Đã ban hành QĐ"},
  ];
  listTrangThaiTh = [
    {ma: this.STATUS.DA_TAO_TT, giaTri: "Đã tạo tờ trình"},
    {ma: this.STATUS.CHUA_TAO_TT, giaTri: "Chưa tạo tờ trình"}
  ];
  listKieuTongHop = [
    {ma: "00", giaTri: "Đề xuất PAG lần đầu "},
    {ma: "01", giaTri: "Đề xuất PAG điều chỉnh"}
  ];
  constructor(private readonly fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private danhMucService: DanhMucService,
    private notification: NzNotificationService,
    public userService: UserService,
    private modal: NzModalService,
    private router: Router,
    private tongHopPhuongAnGiaService: TongHopPhuongAnGiaService,
  ) {
    this.formData = this.fb.group({
      ngayKy: [[]],
      noiDung: [null],
      namKeHoach: [null],
      loaiVthh: [null],
      kieuTongHop: [null],
    });
  }
  searchInTable = {
    namKeHoach: dayjs().get('year'),
    loaiHangHoa: '',
    soTT: '',
    noiDung: '',
    ngayTongHop: '',
    ngayKy: ''

  };
  filterTable: any = {
    soDx: '',
    ngayTongHop: '',
    noiDung: '',
    namKeHoach: '',
    loaiHangHoa: '',
    chungLoaiHh: '',
    loaiGia: '',
    trangThaiTH: '',
    soToTrinh: '',
    trangThai: '',
    ngayKy: '',
    kieuTongHop: ''
  };

  async ngOnInit() {
    if (( this.type == this.typeConst.GIA_MUA_TOI_DA && !this.userService.isAccessPermisson('KHVDTNSNN_PAGIA_LT_MTDBTT_TONGHOP'))
      || ( this.type == this.typeConst.GIA_CU_THE  && !this.userService.isAccessPermisson('KHVDTNSNN_PAGIA_LT_GCT_TONGHOP'))
    ) {
      this.router.navigateByUrl('/error/401')
    }
    if (this.isChuyenTrang == true) {
      this.themMoi();
    }
    this.loadDsNam();
    this.loadDsVthh();
    this.search();
  }

  async loadDsVthh() {
    this.listVthh = [];
    let res = await this.danhMucService.danhMucChungGetAll("LOAI_HHOA");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listVthh = res.data.filter(item => item.ma != "02");
    }
  }

  initForm(): void {
  }

  initData() {
  }

  loadDsNam() {
    let thisYear = dayjs().get('year');
    for (let i = -3; i < 23; i++) {
      this.dsNam.push((thisYear - i).toString());
    }
  }

  clearFilter() {
    this.formData.reset();
    this.search();
  }

  async search() {
    this.spinner.show();
    let body = this.formData.value;
    if (body.ngayKy != null) {
      body.ngayKyTu = body.ngayKy[0];
      body.ngayKyDen = body.ngayKy[1];
    }
    body.namKh = body.namKeHoach
    body.type = this.type
    body.paggingReq = {
      limit: this.pageSize,
      page: this.page - 1,
    }
    let res = await this.tongHopPhuongAnGiaService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.totalRecord = data.totalElements;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
        });
      }
      this.dataTableAll = cloneDeep(this.dataTable);

    } else {
      this.dataTable = [];
      this.totalRecord = 0;
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  xoa() {
    let dataDelete = [];
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach((item) => {
        if (item.checked) {
          dataDelete.push(item.id);
        }
      });
    }
    if (dataDelete && dataDelete.length > 0) {
      this.modal.confirm({
        nzClosable: false,
        nzTitle: 'Xác nhận',
        nzContent: 'Bạn có chắc chắn muốn xóa các bản ghi đã chọn?',
        nzOkText: 'Đồng ý',
        nzCancelText: 'Không',
        nzOkDanger: true,
        nzWidth: 310,
        nzOnOk: async () => {
          this.spinner.show();
          try {
            let res = await this.tongHopPhuongAnGiaService.deleteMuti({ ids: dataDelete });
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
              await this.search();
              this.getCount.emit();
              this.allChecked = false;
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
          } catch (e) {
            console.log('error: ', e);
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          } finally {
            this.spinner.hide();
          }
        },
      });
    }
    else {
      this.notification.error(MESSAGE.ERROR, "Không có dữ liệu phù hợp để xóa.");
    }
  }

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = this.formData.value;
        body.tuNgay = body.ngayTongHop[0];
        body.denNgay = body.ngayTongHop[1];
        this.tongHopPhuongAnGiaService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'quyet-dinh-bo-tai-chinh-giao-bo-nganh.xlsx'),
          );
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
    }
  }

  themMoi() {
    this.idSelected = 0;
    this.isViewDetail = false;
    this.isAddNew = true;
    this.isTongHop = true;
  }

  async onClose() {
    this.isAddNew = false;
    this.isChuyenTrang = false;
    this.chuyenTrangEmit.emit();
    await this.search()
  }

  onAllChecked(checked) {
    this.dataTable.forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  refreshCheckedStatus(): void {
    this.allChecked = this.dataTable.every(({ id }) =>
      this.setOfCheckedId.has(id),
    );
    this.indeterminate =
      this.dataTable.some(({ id }) => this.setOfCheckedId.has(id)) &&
      !this.allChecked;
  }

  onItemChecked(id: number, checked) {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }


  async changePageIndex(event) {
    this.spinner.show();
    try {
      this.page = event;
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async changePageSize(event) {
    this.spinner.show();
    try {
      this.pageSize = event;
      if (this.page === 1) {
        await this.search();
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  viewDetail(id: number, isViewDetail: boolean, isTongHop: boolean) {
    this.idSelected = id;
    this.isViewDetail = isViewDetail;
    this.isAddNew = true;
    this.isTongHop = isTongHop;
  }


  xoaItem(item: any) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.spinner.show();
        try {
          this.tongHopPhuongAnGiaService.delete({ id: item.id }).then((res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DELETE_SUCCESS,
              );
              this.search();
              this.getCount.emit();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
            this.spinner.hide();
          });
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  filterInTable(key: string, value: string, type?: string) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          if ([ 'ngayTongHop'].includes(key)) {
            if (item[key] && dayjs(item[key]).format('DD/MM/YYYY').indexOf(value.toString()) != -1) {
              temp.push(item)
            }
          } else {
            if (type) {
              if ('eq' == type) {
                if (item[key] && item[key].toString().toLowerCase() == value.toString().toLowerCase()) {
                  temp.push(item)
                }
              } else {
                if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
                  temp.push(item)
                }
              }
            } else {
              if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
                temp.push(item)
              }
            }
          }
        });
      }
      this.dataTable = [...this.dataTable, ...temp];
    } else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  }
  clearFilterTable() {
    this.filterTable = {
      soDeXuat: '',
      ngayTongHop: '',
      noiDung: '',
      namKeHoach: '',
      loaiHangHoa: '',
      chungLoaiHh: '',
      loaiGia: '',
      trangThaiTH: '',
      soToTrinh: '',
      trangThai: ''
    }
  }


  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          if (item.trangThai == '00') {
            item.checked = true;
          }
        });
      }
    } else {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
        });
      }
    }
  }

  updateSingleChecked(): void {
    if (this.dataTable.every(item => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.dataTable.every(item => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }

  convertDateToString(event: any): string {
    let result = '';
    if (event) {
      result = dayjs(event).format('DD/MM/YYYY').toString()
    }
    return result;
  }

}


