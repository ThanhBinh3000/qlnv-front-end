import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {LIST_VAT_TU_HANG_HOA, PAGE_SIZE_DEFAULT, TYPE_PAG} from 'src/app/constants/config';
import {MESSAGE} from 'src/app/constants/message';
import {DeXuatPAGService} from 'src/app/services/ke-hoach/phuong-an-gia/deXuatPAG.service';
import {UserService} from 'src/app/services/user.service';
import {cloneDeep} from 'lodash';
import dayjs from 'dayjs';
import {saveAs} from 'file-saver';
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {Globals} from "../../../../../../shared/globals";
import {UserLogin} from "../../../../../../models/userlogin";
import {STATUS} from "../../../../../../constants/status";
import {Router} from "@angular/router";

@Component({
  selector: 'app-de-xuat-phuong-an-gia',
  templateUrl: './de-xuat-phuong-an-gia.component.html',
  styleUrls: ['./de-xuat-phuong-an-gia.component.scss']
})
export class DeXuatPhuongAnGiaComponent implements OnInit {
  @Input() type: string;
  @Input() pagType: string;
  @Output() getCount = new EventEmitter<any>();
  @Output() redirectToTongHop = new EventEmitter<any>();
  isAddNew = false;
  isViewModal: boolean = false;
  formData: FormGroup;
  toDay = new Date();
  allChecked = false;
  listVthh: any[] = [];
  dsNam: string[] = [];
  dataTable: any[] = [];
  page: number = 1;
  dataTableAll: any[] = [];
  totalRecord: number = 10;
  setOfCheckedId = new Set<number>();
  pageSize: number = PAGE_SIZE_DEFAULT;
  indeterminate = false;
  typeConst = TYPE_PAG;
  userInfo: UserLogin
  STATUS = STATUS
  listTrangThai: any[] = [];
  last30Day = new Date(
    new Date().setTime(this.toDay.getTime() - 30 * 24 * 60 * 60 * 1000),
  );

  isViewDetail: boolean = false;
  idSelected: number = 0;

  constructor(private readonly fb: FormBuilder,
              private router: Router,
              private deXuatPAGService: DeXuatPAGService,
              private spinner: NgxSpinnerService,
              private notification: NzNotificationService,
              public userService: UserService,
              private modal: NzModalService,
              private danhMucService: DanhMucService,
              public globals: Globals
  ) {
    this.formData = this.fb.group({
      soDeXuat: [null],
      ngayKyTu: [],
      ngayKyDen: [],
      trichYeu: [null],
      namKeHoach: [null],
      loaiHangHoa: [null],
      loaiGia: [null],
      trangThai: [null],

    });
  }

  searchInTable = {
    namKeHoach: dayjs().get('year'),
    loaiHangHoa: '',
    soDx: '',
    trichYeu: '',
    ngayKy: '',

  };
  filterTable: any = {
    soDeXuat: '',
    soDeXuatDc: '',
    tenLanDeXuat: '',
    ngayKy: '',
    trichYeu: '',
    soCanCu: '',
    namKeHoach: '',
    tenLoaiVthh: '',
    tenCloaiVthh: '',
    tenLoaiGia: '',
    tenTrangThai: '',
  };

  async ngOnInit() {
    if ((this.type == this.typeConst.GIA_MUA_TOI_DA && this.pagType == 'LT' && !this.userService.isAccessPermisson('KHVDTNSNN_PAGIA_LT_MTDBTT_DEXUAT'))
      || (this.type == this.typeConst.GIA_CU_THE && this.pagType == 'LT' && !this.userService.isAccessPermisson('KHVDTNSNN_PAGIA_LT_GCT_DEXUAT'))
      || (this.type == this.typeConst.GIA_MUA_TOI_DA && this.pagType == 'VT' && !this.userService.isAccessPermisson('KHVDTNSNN_PAGIA_VT_MTDBTT_DEXUAT'))
      || (this.type == this.typeConst.GIA_CU_THE && this.pagType == 'VT' && !this.userService.isAccessPermisson('KHVDTNSNN_PAGIA_VT_GCT_DEXUAT'))
    ) {
      this.router.navigateByUrl('/error/401')
    }
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      this.loadListTrangThai();
      this.loadDsNam();
      this.search();
      if (this.pagType == 'LT') {
        this.listVthh = LIST_VAT_TU_HANG_HOA;
      }
      if (this.pagType == 'VT') {
        await this.loadDsVthh();
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  loadListTrangThai() {
    if (this.pagType == 'LT') {
      this.listTrangThai = [
        {ma: this.STATUS.DU_THAO, giaTri: "Dự thảo"},
        {ma: this.STATUS.CHO_DUYET_TP, giaTri: "Chờ duyệt - TP"},
        {ma: this.STATUS.TU_CHOI_TP, giaTri: "Từ chối - TP"},
        {ma: this.STATUS.CHO_DUYET_LDC, giaTri: "Chờ duyệt - LĐC"},
        {ma: this.STATUS.TU_CHOI_LDC, giaTri: "Từ chối - LĐC"},
        {ma: this.STATUS.DA_DUYET_LDC, giaTri: "Đã duyệt - LĐC"},
        {ma: this.STATUS.DA_DUYET_CBV, giaTri: "Đã duyệt - Cán bộ Vụ"},
        {ma: this.STATUS.TU_CHOI_CBV, giaTri: "Từ chối - Cán bộ Vụ"}
      ];
    } else {
      this.listTrangThai = [
        {ma: this.STATUS.DU_THAO, giaTri: "Dự thảo"},
        {ma: this.STATUS.CHO_DUYET_LDV, giaTri: "Đã duyệt - LĐ Vụ"},
        {ma: this.STATUS.TU_CHOI_LDV, giaTri: "Từ chối - LĐ Vụ"},
        {ma: this.STATUS.DA_DUYET_LDV, giaTri: "Đã duyệt - LĐ Vụ"}
      ];
    }
  }

  async loadDsVthh() {
    let body = {
      "str": "02"
    };
    let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha(body);
    this.listVthh = [];
    if (res.msg == MESSAGE.SUCCESS) {
      this.listVthh = res.data
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
    body.namKh = body.namKeHoach;
    body.soDx = body.soDeXuat;
    body.loaiHh = body.loaiHangHoa;
    body.type = this.type;
    body.pagType = this.pagType;
    body.paggingReq = {
      limit: this.pageSize,
      page: this.page - 1,
    }
    body.maDvi = this.userInfo.MA_DVI
    let res = await this.deXuatPAGService.search(body);
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
            let res = await this.deXuatPAGService.deleteMuti({ids: dataDelete});
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
    } else {
      this.notification.error(MESSAGE.ERROR, "Không có dữ liệu phù hợp để xóa.");
    }
  }

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = this.formData.value;
        body.pagType = this.pagType
        body.type = this.type
        this.deXuatPAGService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'de-xuat-phuong-an-gia.xlsx'),
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
  }

  async onClose() {
    this.isAddNew = false;
    await this.search()

  }

  onAllChecked(checked) {
    this.dataTable.forEach(({id}) => this.updateCheckedSet(id, checked));
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
    this.allChecked = this.dataTable.every(({id}) =>
      this.setOfCheckedId.has(id),
    );
    this.indeterminate =
      this.dataTable.some(({id}) => this.setOfCheckedId.has(id)) &&
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

  viewDetail(id: number, isViewDetail: boolean) {
    this.idSelected = id;
    this.isViewDetail = isViewDetail;
    this.isAddNew = true;
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
          this.deXuatPAGService.delete({id: item.id}).then((res) => {
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
          if (['ngayKy', 'ngayLapKh', 'ngayDuyetLdcc', 'ngayGiaoNhan', 'ngayHieuLuc', 'ngayHetHieuLuc', 'ngayDeXuat', 'ngayTongHop', 'ngayTao', 'ngayQd', 'tgianNhang', 'tgianThien', 'ngayDx', 'ngayPduyet', 'ngayThop', 'thoiGianGiaoNhan', 'ngayKyQd', 'ngayNhanCgia', 'ngayKyDc', 'tgianGnhan', 'ngayDuyet', 'ngayNhapKho', 'ngayKyQdinh', 'ngayMkho'].includes(key)) {
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
    this.formData.reset();
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


  async openModalDxChinhSua(data: any) {
    let body = this.formData.value;
    body.soDx = data.soDeXuatDc ? data.soDeXuatDc : null;
    body.loaiHh = body.loaiHangHoa;
    body.type = this.type;
    body.pagType = this.pagType;
    body.paggingReq = {
      limit: 999,
      page: 0,
    }
    let res = await this.deXuatPAGService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data?.content;
      if (data && data.length > 0) {
        let dxPag = data[0];
        if (dxPag && dxPag.id) {
          this.idSelected = dxPag.id
          this.isViewModal = true;
        }
      }
    }
  }

  closeDxPaModal() {
    this.idSelected = null;
    this.isViewModal = false;
  }

  redirectToTongHopEmit() {
    this.redirectToTongHop.emit();
  }
}


