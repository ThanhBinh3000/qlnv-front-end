import { NzModalService } from 'ng-zorro-antd/modal';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DonviService } from 'src/app/services/donvi.service';
import { MESSAGE } from 'src/app/constants/message';
import * as dayjs from 'dayjs';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { PAGE_SIZE_DEFAULT, STATUS_USER } from 'src/app/constants/config';
import { DanhSachDauThauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/danhSachDauThau.service';
import { Subject } from 'rxjs';
import { convertTrangThai, convertTrangThaiUser } from 'src/app/shared/commonFunction';
import { ThemQlQuyenComponent } from './them-ql-quyen/them-ql-quyen.component';
import { QlQuyenNSDService } from 'src/app/services/quantri-nguoidung/qlQuyenNSD.service';
import { NzFormatEmitEvent, NzTreeComponent } from 'ng-zorro-antd/tree';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperService } from 'src/app/services/helper.service';


@Component({
  selector: 'app-ql-quyen',
  templateUrl: './ql-quyen.component.html',
  styleUrls: ['./ql-quyen.component.scss'],
})
export class QlQuyenComponent implements OnInit {
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  @ViewChild('nzTreeComponent', { static: false }) nzTreeComponent!: NzTreeComponent;
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
  datas: any;
  isVisibleChangeTab$ = new Subject();
  nodes: any;
  nodeSelected: any;
  selectedKeys: any;
  detailQuyen: FormGroup;
  nodeDetail: any;
  nodesNotExpand: any;
  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private danhSachDauThauService: DanhSachDauThauService,
    private notification: NzNotificationService,
    private router: Router,
    private modal: NzModalService,
    private _modalService: NzModalService,
    private _qlQuyenService: QlQuyenNSDService,
    private fb: FormBuilder,
    private helperService: HelperService
  ) {

  }
  // ngAfterViewInit(): void {
  //   throw new Error('Method not implemented.');
  // }


  initForm() {
    this.detailQuyen = this.fb.group({
      name: ['', Validators.required],
      parentId: [, Validators.required],
      url: ['0', Validators.required],
      trangThai: [true],
      thuTu: [''],
      icon: [null],
      menu: [null],
      code: [null],
    })
  }
  async ngOnInit() {
    this.initForm()
    this.spinner.show();
    try {
      let res = await this.donViService.layTatCaDonVi();
      this.optionsDonVi = [];
      if (res.msg == MESSAGE.SUCCESS) {
        for (let i = 0; i < res.data.length; i++) {
          var item = {
            ...res.data[i],
            labelDonVi: res.data[i].maDvi + ' - ' + res.data[i].tenDvi,
          };
          this.optionsDonVi.push(item);
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
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

  /**
    * Xử lý tree
    *
    */
  parentNodeSelected: any = [];
  nzClickNodeTree(event: any): void {
    debugger
    if (event.keys.length > 0) {
      this.nodeSelected = event.keys[0];
      this.selectedKeys = event?.node?.parentNode?.key ?? null;
      debugger
      this.parentNodeSelected = event?.parentNode?._title
      this.showDetailDonVi(event.keys[0])
    }

  }
  showDetailDonVi(id?: any) {
    if (id) {
      // this.danhSachNguoiDung(id)

      this._qlQuyenService.find({ id: id }).then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.nodeDetail = res.data;
          // if (res.data.parentId == "00000000-0000-0000-0000-000000000000") {
          //   this.nodeDetail.parentId = null;
          // }
          // gán giá trị vào form
          this.detailQuyen.patchValue({
            name: res.data?.name,
            parentId: this.selectedKeys,
            thuTu: res.data?.thuTu ?? "",
            url: res.data?.url ?? "",
            trangThai: res.data.trangThai == STATUS_USER.HOAT_DONG ? true : false,
          })

        } else {
          this.notification.error(MESSAGE.ERROR, res.error);
        }
      })

    }
  }

  nzCheck(event: NzFormatEmitEvent): void {
    // this.nodeSelected = event.keys[0];
    // this.selectedKeys = event.node.origin.data;
    // this.showDetailDonVi()
  }
  /**
     * end Xử lý tree
     *
     */

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

  async search() {
    let maDonVi = null;
    if (this.inputDonVi && this.inputDonVi.length > 0) {
      let getDonVi = this.optionsDonVi.filter(
        (x) => x.labelDonVi == this.inputDonVi,
      );
      if (getDonVi && getDonVi.length > 0) {
        maDonVi = getDonVi[0].maDvi;
      }
    }

    let res = await this._qlQuyenService.dsquyen();
    if (res.msg == MESSAGE.SUCCESS) {
      this.datas = res.data;
      this.nodes = this.addFiledTree(this.datas)
      // this.totalRecord = this.data.totalElements;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  datadequy: any
  addFiledTree(datas) {
    let data = [];
    datas.forEach(element => {
      element.expanded = true
      if (element.children.length > 0) {
        this.addFiledTree(element.children)
      } else {
        element.isLeaf = true

      }


    });
    console.log(this.datas)
    return this.datas
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
          this.danhSachDauThauService
            .deleteKeHoachLCNT({ id: item.id })
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
          ? 'Cập nhập quyền'
          : 'Thêm mới quyền',
        nzContent: ThemQlQuyenComponent,
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

  themoi(event) {
    event.preventDefault();
    event.stopPropagation();

    this.helperService.markFormGroupTouched(this.detailQuyen);
    if (this.detailQuyen.invalid) {
      return;
    }
    let body: any = this.detailQuyen.value;
    this.spinner.show();
    try {
      this._qlQuyenService
        .create(body)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(
              MESSAGE.SUCCESS,
              MESSAGE.ADD_SUCCESS,
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
  }

  xoa(event) {
    if (this.nodeDetail.name) {
      this._modalService.confirm({
        nzClosable: false,
        nzTitle: 'Xác nhận',
        nzContent: `Bạn có chắc chắn muốn xóa?`,
        nzOkText: 'Đồng ý',
        nzCancelText: 'Không',
        nzOkDanger: true,
        nzWidth: 360,
        nzOnOk: () => {
          // this.spinner.show()
          // this.toTrinhService.delete(data.id).then(res => {
          //   this.spinner.hide()
          //   if (res.success) {
          //     this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
          //     this.getDsToTrinh();
          //   } else {
          //     this.notification.error(MESSAGE.ERROR, res.error);
          //   }
          // })
        }
      });
    }



  }

  sua(event) {
    event.preventDefault();
    event.stopPropagation();
    this.helperService.markFormGroupTouched(this.detailQuyen);
    if (this.detailQuyen.invalid) {
      return;
    }
    let body: any = this.detailQuyen.value;
    body.id = this.nodeSelected
    this.spinner.show();
    try {
      this._qlQuyenService
        .create(body)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(
              MESSAGE.SUCCESS,
              MESSAGE.UPDATE_SUCCESS,
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

  }



}
