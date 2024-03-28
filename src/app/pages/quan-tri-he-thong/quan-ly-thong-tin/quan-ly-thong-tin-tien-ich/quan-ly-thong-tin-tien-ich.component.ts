import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { MESSAGE } from 'src/app/constants/message';
import { StorageService } from 'src/app/services/storage.service';
import { cloneDeep } from 'lodash';
import { ThemThongTinTienIchComponent } from './them-thong-tin-tien-ich/them-thong-tin-tien-ich.component';
import { QLThongTinTienIchService } from 'src/app/services/quantri-nguoidung/quan-ly-thong-tin/quan-ly-thong-tin-tien-ich';
import { FileDinhKem } from 'src/app/models/FileDinhKem';

@Component({
  selector: 'app-quan-ly-thong-tin-tien-ich',
  templateUrl: './quan-ly-thong-tin-tien-ich.component.html',
  styleUrls: ['./quan-ly-thong-tin-tien-ich.component.scss']
})
export class QuanLyThongTinTienIchComponent extends Base2Component implements OnInit {

  selectedId: number = 0;
  isView = false;
  listStatus: any[] = [
    { value: true, text: "Hoạt động" },
    { value: false, text: "Ngừng hoạt động" },
  ];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private qlThongTinTienIchService: QLThongTinTienIchService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, qlThongTinTienIchService);
    this.formData = this.fb.group({
      title: null,
      classify: null,
      status: null,
      dateCreated: null,
      startDate: null,
      endDate: null,
    })
    this.filterTable = {
      title: '',
      content: '',
      classify: '',
      dateCreated: '',
      link: '',
      status: '',
    };
  }


  async ngOnInit() {

    try {
      this.initData()
      await this.timKiem();
      await this.spinner.hide();

    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }


  }

  disabledStart = (startValue: Date): boolean => {
    if (startValue && this.formData.value.endDate) {
      return startValue.getTime() > this.formData.value.endDate.getTime();
    } else {
      return false;
    }
  };

  disabledEnd = (endValue: Date): boolean => {
    if (endValue && this.formData.value.startDate) {
      return endValue.getTime() < this.formData.value.startDate.getTime();
    } else {
      return false;
    }
  };


  async initData() {
    this.userInfo = this.userService.getUserLogin();
  }

  async timKiem() {
    if (this.formData.value.startDate) {
      this.formData.value.startDate = dayjs(this.formData.value.startDate).format('DD/MM/YYYY')
    }
    if (this.formData.value.endDate) {
      this.formData.value.endDate = dayjs(this.formData.value.endDate).format('DD/MM/YYYY')
    }
    this.search()
  }

  async search() {
    await this.spinner.show();
    try {
      let body = this.formData.value
      body.paggingReq = {
        limit: this.pageSize,
        page: this.page - 1
      }
      let res = await this.qlThongTinTienIchService.danhSach(body);
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
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  deleteMulti(roles?) {
    if (!this.checkPermission(roles)) {
      return
    }
    let dataDelete = [];
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach((item) => {
        if (item.checked) {
          dataDelete.push({ id: item.id });
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
            let res = await this.qlThongTinTienIchService.deleteMuti(dataDelete);
            if (res.statusCode == 0) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
              await this.search();
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

  exportDataTC() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {

        let body = this.formData.value;
        this.qlThongTinTienIchService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-thong-tin-va-phan-mem-tien-ich.xlsx'),
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

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          if (item.status) {
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

  async changePageIndex(event) {
    this.allChecked = false
    this.page = event;
    await this.timKiem();
  }

  async changePageSize(event) {
    this.allChecked = false
    this.pageSize = event;
    await this.timKiem();
  }

  async add(row?: any) {
    const modalQD = this.modal.create({
      nzTitle: !row ? 'THÊM MỚI THÔNG TIN VÀ PHẦN MỀM TIỆN ÍCH' : 'CẬP NHẬT THÔNG TIN VÀ PHẦN MỀM TIỆN ÍCH',
      nzContent: ThemThongTinTienIchComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzFooter: null,
      nzComponentParams: {
        data: row
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (!data) return
      if (data.dateCreated) data.dateCreated = dayjs(data.dateCreated).format('DD/MM/YYYY')

      let res = data.isUpdate ? await this.qlThongTinTienIchService.capNhat({ ...data, id: row.id }) : await this.qlThongTinTienIchService.themMoi(data)
      if (res.statusCode == 0) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
        this.timKiem()
      }
    });
  }

  delete(item: any, roles?) {
    if (!this.checkPermission(roles)) {
      return
    }
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
          this.qlThongTinTienIchService.delete(item.id).then(async (res) => {
            if (res.statusCode == 0) this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
            console.log(res)
            await this.timKiem();
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

  downloadFile(item: FileDinhKem) {
    this.uploadFileService.downloadFile(item.fileUrl).subscribe((blob) => {
      saveAs(blob, item.fileName);
    });
  }

  redirectDetail(id, b: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = b;
  }


  quayLai() {
    this.showListEvent.emit();
    this.isDetail = false;
    this.isView = false;
    this.timKiem();
  }


}

