import { NzModalService } from 'ng-zorro-antd/modal';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DonviService } from 'src/app/services/donvi.service';
import { MESSAGE } from 'src/app/constants/message';
import * as dayjs from 'dayjs';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { DanhSachDauThauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/danhSachDauThau.service';
import { Subject } from 'rxjs';
import { convertTrangThai, convertTrangThaiUser } from 'src/app/shared/commonFunction';
import { ThemQlNhomQuyenComponent } from './them-ql-nhom-quyen/them-ql-nhom-quyen.component';
import { QlNhomNguoiSuDungService } from 'src/app/services/quantri-nguoidung/qlNhomNguoiSuDung.service';
import { ActionItem } from 'src/app/constants/form-schema';


@Component({
  selector: 'app-ql-nhomquyen',
  templateUrl: './ql-nhomquyen.component.html',
  styleUrls: ['./ql-nhomquyen.component.scss'],
})
export class QlNhomQuyenComponent implements OnInit {
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  [x: string]: any;
  searchValue = '';
  searchFilter = {
    soDxuat: '',
    trichYeu: '',
  };
  inputDonVi: string = '';
  options: any[] = [];
  optionsDonVi: any[] = [];
  errorMessage: string = '';
  startValue: Date | null = null;
  endValue: Date | null = null;
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  isVisibleChangeTab$ = new Subject();
  datas: any;
  listAction: ActionItem[];
  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private danhSachDauThauService: DanhSachDauThauService,
    private notification: NzNotificationService,
    private router: Router,
    private modal: NzModalService,
    private _modalService: NzModalService,
    private qlNhomQuyen: QlNhomNguoiSuDungService
  ) { this.initAction(); }
  // ngAfterViewInit(): void {
  //   throw new Error('Method not implemented.');
  // }

  async ngOnInit() {
    this.spinner.show();
    await this.search();
    this.spinner.hide();

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

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.endValue) {
      return false;
    }
    return startValue.getTime() > this.endValue.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.startValue) {
      return false;
    }
    return endValue.getTime() <= this.startValue.getTime();
  };

  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endDatePicker.open();
    }
  }

  handleEndOpenChange(open: boolean): void {
    console.log('handleEndOpenChange', open);
  }



  clearFilter() {
    this.searchFilter = {
      soDxuat: '',
      trichYeu: '',
    };
    this.startValue = null;
    this.endValue = null;
    this.inputDonVi = '';
    this.search();
  }
  initAction() {
    this.listAction = [

      new ActionItem({
        class: 'fa fa-pencil-square-o sua',
        name: 'Sửa',
        code: 'sua',
        onClick: (e, data) => {
          e.preventDefault();
          e.stopPropagation();
        },
        visible: false,
        onVisible: (data) => {
          return true
        },
        allowRouter: []
      }),

      new ActionItem({
        class: 'icon htvbdh_xoa xoa',
        name: 'Xóa',
        onClick: (e, data) => {
          e.preventDefault();
          e.stopPropagation();
          this.xoaItem(data.username)
        },
        visible: false,
        onVisible: (data) => {
          return true
        },
        allowRouter: []
      }),
    ]

    // this.route.url.subscribe(() => {
    //   this.checkActiveRouter(this.route.snapshot.routeConfig.path);
    // });
  }
  async search() {

    let body = {
      "code": null,
      "limit": 10,
      "name": null,
      "page": 1
    };
    let res = await this.qlNhomQuyen.findList(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.datas = res.data;
      this.dataTable = res.data.content;
      this.totalRecord = res.data.totalElements;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
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
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  convertTrangThai(status: string) {
    return convertTrangThaiUser(status);
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
          this.qlNhomQuyen
            .delete({ id: item.id })
            .then((res) => {
              if (res.msg == MESSAGE.SUCCESS) {
                this.notification.success(
                  MESSAGE.SUCCESS,
                  MESSAGE.DELETE_SUCCESS,
                );
                this.search();
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


  redirectToChiTiet(data?: number) {
    if (!data) {
      let modal = this._modalService.create({
        nzTitle: data
          ? 'Cập nhập nhóm quyền'
          : 'Thêm mới nhóm quyền',
        nzContent: ThemQlNhomQuyenComponent,
        nzClosable: true,
        nzFooter: null,
        nzStyle: { top: '50px' },
        nzWidth: 600,
        nzComponentParams: { data },
      });
      modal.afterClose.subscribe((b) => {
        debugger

        if (b) {
        }
      });
    } else {
      this.router.navigate([
        '/nhap/dau-thau/danh-sach-dau-thau/them-moi-de-xuat-ke-hoach-lua-chon-nha-thau',
        data,
      ]);
    }

  }

}
