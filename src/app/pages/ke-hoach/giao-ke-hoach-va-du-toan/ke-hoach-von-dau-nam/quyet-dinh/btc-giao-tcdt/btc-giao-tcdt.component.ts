import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {PAGE_SIZE_DEFAULT} from 'src/app/constants/config';
import * as dayjs from 'dayjs';
import {QuyetDinhBtcTcdtService} from 'src/app/services/quyetDinhBtcTcdt.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {UserService} from 'src/app/services/user.service';
import {MESSAGE} from 'src/app/constants/message';
import {cloneDeep} from 'lodash';
import {saveAs} from 'file-saver';
import {NzModalService} from 'ng-zorro-antd/modal';
import {STATUS} from "../../../../../../constants/status";
import printJS from "print-js";

@Component({
  selector: 'app-btc-giao-tcdt',
  templateUrl: './btc-giao-tcdt.component.html',
  styleUrls: ['./btc-giao-tcdt.component.scss'],
})
export class BtcGiaoTcdtComponent implements OnInit {
  isAddNew = false;
  formData: FormGroup;
  toDay = new Date();
  last30Day = new Date(
    new Date().setTime(this.toDay.getTime() - 30 * 24 * 60 * 60 * 1000),
  );
  allChecked = false;
  indeterminate = false;
  getCount = new EventEmitter<any>();
  dsNam: string[] = [];
  searchInTable: any = {
    soQd: null,
    namQd: null,
    ngayQd: new Date(),
    trichYeu: null,
  };
  filterTable: any = {
    soQd: '',
    ngayQd: '',
    trichYeu: '',
    taiLieuDinhKem: '',
    trangThai: '',
  };
  idSelected: number = 0;
  isViewDetail: boolean = false;
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;
  setOfCheckedId = new Set<number>();
  dataTable: any[] = [];
  dataTableAll: any[] = [];

  muaTangList: any[] = [];
  xuatGiamList: any[] = [];
  xuatBanList: any[] = [];
  luanPhienList: any[] = [];
  dataDetailSelected: any = {
    muaLuongThuc: 0,
    nguonVonCo: 0,
    muaTang: 0,
    xuatGiam: 0,
    xuatBan: 0,
    xuatPlDh: 0,
    tongTien: 0,
  }
  rowSelected: number = 0;
  STATUS = STATUS;

  constructor(private readonly fb: FormBuilder,
              private quyetDinhBtcTcdtService: QuyetDinhBtcTcdtService,
              private spinner: NgxSpinnerService,
              private notification: NzNotificationService,
              public userService: UserService,
              private modal: NzModalService,
  ) {
    if (!userService.isAccessPermisson("KHVDTNSNN_GKHDT_VDNDT_QD_BTCTCDT")) {
      window.location.href = '/error/401'
    }
    this.formData = this.fb.group({
      namQd: [null],
      soQd: [null],
      ngayQd: [[]],
      trichYeu: [null],
    });
  }

  ngOnInit(): void {
    this.loadDsNam();
    this.search();
    // this.dataTable = [...this.dataExample];
  }

  initForm(): void {

  }

  initData() {

  }

  loadDsNam() {
    let thisYear = dayjs().get('year');
    for (let i = -3; i < 23; i++) {
      this.dsNam.push((thisYear + i).toString());
    }
  }

  clearFilter() {
    this.formData.reset();
    this.search();
  }

  async search() {
    this.spinner.show();
    let body = this.formData.value;
    if (body.ngayQd != null) {
      body.ngayQdTu = body.ngayQd[0];
      body.ngayQdDen = body.ngayQd[1];
    }
    body.paggingReq = {
      limit: this.pageSize,
      page: this.page - 1,

    }
    let res = await this.quyetDinhBtcTcdtService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.totalRecord = data.totalElements;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
          // item.statusConvert = this.convertTrangThai(item.trangThai);
        });
        this.getDetailRow(this.dataTable[0].id)
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
            let res = await this.quyetDinhBtcTcdtService.deleteMuti({idList: dataDelete});
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
        body.tuNgay = body.ngayQd[0];
        body.denNgay = body.ngayQd[1];
        this.quyetDinhBtcTcdtService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'quyet-dinh-bo-tai-chinh-tong-cuc-du-tru.xlsx'),
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
    this.isViewDetail = true;
    this.isAddNew = true;

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

  async onClose() {
    this.isAddNew = false;
    await this.search()
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
          this.quyetDinhBtcTcdtService.delete({id: item.id}).then((res) => {
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


  filterInTable(key: string, value: string) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
            temp.push(item)
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
      soQd: '',
      ngayQd: '',
      trichYeu: '',
      taiLieuDinhKem: '',
      trangThai: '',
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

  async getDetailRow(id) {
    if (id) {
      let res = await this.quyetDinhBtcTcdtService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        const data = res.data;
        let muaLuongThuc = 0;
        let nguonVonCo = 0;
        let muaTang = 0;
        let xuatGiam = 0;
        let xuatBan = 0;
        let xuatPlDh = 0;
        muaLuongThuc = (data.keHoachNhapXuat.soLuongMuaThoc * data.keHoachNhapXuat.donGiaMuaThoc) / 1000
          + (data.keHoachNhapXuat.soLuongMuaGaoLpdh * data.keHoachNhapXuat.donGiaMuaGaoLqdh) / 1000
          + (data.keHoachNhapXuat.soLuongMuaGaoXcht * data.keHoachNhapXuat.donGiaMuaGaoXcht) / 1000;
        nguonVonCo = (data.keHoachNhapXuat.soLuongBanThoc * data.keHoachNhapXuat.donGiaBanThoc) / 1000
          + (data.keHoachNhapXuat.soLuongBanGao * data.keHoachNhapXuat.donGiaBanGao) / 1000
          + (data.keHoachNhapXuat.soLuongGaoCtro * data.keHoachNhapXuat.donGiaGaoCtro) / 1000
          + data.keHoachNhapXuat.tongTienVonNsnn
          + data.keHoachNhapXuat.tongTienVonTx;
        data.muaTangList.forEach(item => {
          muaTang += item.tongTien;
        })
        data.xuatGiamList.forEach(item => {
          xuatGiam += item.tongTien;
        })
        data.xuatBanList.forEach(item => {
          xuatBan += item.tongTien;
        })
        data.luanPhienList.forEach(item => {
          xuatPlDh += item.tongTien;
        })
        this.dataDetailSelected.muaLuongThuc = muaLuongThuc;
        this.dataDetailSelected.nguonVonCo = nguonVonCo;
        this.dataDetailSelected.muaTang = muaTang;
        this.dataDetailSelected.xuatGiam = xuatGiam;
        this.dataDetailSelected.xuatBan = xuatBan;
        this.dataDetailSelected.xuatPlDh = xuatPlDh;
        this.dataDetailSelected.tongTien = muaLuongThuc + nguonVonCo + muaTang + xuatGiam + xuatBan + xuatPlDh;
      }
      this.rowSelected = id;
      // if (res.data?.muaTangList) {
      //   this.muaTangList = res.data.muaTangList;
      // } if (res.data?.xuatGiamList) {
      //   this.xuatGiamList = res.data.xuatGiamList;
      // } if (res.data?.xuatBanList) {
      //   this.xuatBanList = res.data.xuatBanList;
      // } if (res.data?.luanPhienList) {
      //   this.luanPhienList = res.data.luanPhienList;
      // } if (res.data?.keHoachNhapXuat) {
      //   let kh = res.data.keHoachNhapXuat;
      //   this.keHoachNhapXuat.muaLuongThuc = (kh.soLuongMuaThoc * kh.donGiaMuaThoc) +
      //     (kh.soLuongMuaGaoLpdh * kh.donGiaMuaGaoLqdh) +
      //     (kh.soLuongMuaGaoXcht * kh.donGiaMuaGaoXcht);
      //   this.keHoachNhapXuat.nguonVonCo = (kh.soLuongBanThoc * kh.donGiaBanThoc) +
      //     (kh.soLuongBanGao * kh.donGiaBanGao) +
      //     (kh.soLuongGaoCtro * kh.donGiaGaoCtro) +
      //     kh.tongTienVonNsnn + kh.tongTienVonTx;
      // }
    }
  }
  print() {
    let dataPrint = this.dataTable.map((item, index) => {
      return {
        ...item,
        'stt': index + 1
      };
    });
    printJS({
      printable: dataPrint,
      gridHeaderStyle: 'border: 2px solid #3971A5; ',
      gridStyle: 'border: 2px solid #3971A5;text-align:center;with:fit-content',
      properties: [
        {
          field: 'stt',
          displayName: 'STT',
          columnSize: '40px'
        },
        {
          field: 'soQd',
          displayName: 'Số quyết định',
          columnSize: '100px'
        },
        {
          field: 'ngayQd',
          displayName: 'Ngày ký quyết định',
          columnSize: '100px'
        },
        {
          field: 'trichYeu',
          displayName: 'Trích yếu',
          columnSize: 'calc(100% - calc( 40px + 300px)) px'
        }, {
          field: 'tenTrangThai',
          displayName: 'Trạng thái',
          columnSize: '100px'
        }
      ],
      type: 'json',
      header: 'Danh sách quyết định của bộ tài chính giao tổng cục dự trữ'
    })
  }

}

