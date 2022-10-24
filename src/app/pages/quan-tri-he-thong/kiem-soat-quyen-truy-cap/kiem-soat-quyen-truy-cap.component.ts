import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogPhanQuyenComponent } from 'src/app/components/dialog/dialog-phan-quyen/dialog-phan-quyen.component';
import { DialogThemDanhMucDungChungComponent } from 'src/app/components/dialog/dialog-them-danh-muc-dung-chung/dialog-them-danh-muc-dung-chung.component';
import { DialogThongTinCanBoComponent } from 'src/app/components/dialog/dialog-thong-tin-can-bo/dialog-thong-tin-can-bo.component';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { convertTrangThai } from 'src/app/shared/commonFunction';
import { DanhMucDungChungService } from "../../../services/danh-muc-dung-chung.service";

export interface TreeNodeInterface {
  key: string;
  name: string;
  age?: number;
  level?: number;
  expand?: boolean;
  address?: string;
  children?: TreeNodeInterface[];
  parent?: TreeNodeInterface;
}
@Component({
  selector: 'app-kiem-soat-quyen-truy-cap',
  templateUrl: './kiem-soat-quyen-truy-cap.component.html',
  styleUrls: ['./kiem-soat-quyen-truy-cap.component.scss'],
})
export class KiemSoatQuyenTruyCapComponent implements OnInit {
  @Input() typeVthh: string;

  qdTCDT: string = MESSAGE.QD_TCDT;

  formData: FormGroup;

  danhMucList: any[];

  setOfCheckedId = new Set<number>();


  searchFilter = {
    ma: '',
    maCha: '',
    giaTri: '',
    ghiChu: '',
    loai: ''
  };

  optionsDonVi: any[] = [];
  options: any[] = [];
  inputDonVi: string = '';
  errorMessage: string = '';
  startValue: Date | null = null;
  endValue: Date | null = null;

  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  dataTableAll: any[] = [];

  userInfo: UserLogin;
  isDetail: boolean = false;
  selectedId: number = 0;
  isView: boolean = false;
  isTatCa: boolean = false;

  allChecked = false;
  indeterminate = false;

  filterTable: any = {
    loai: '',
    ma: '',
    giaTri: '',
    trangThai: '',
    nguoiTao: '',
    ngayTao: '',
    nguoiSua: '',
    ngaySua: '',
  };


  listOfMapData: TreeNodeInterface[] = [
    {
      key: `1`,
      name: 'Kế hoạch, vốn và dự toán NSNN',
      children: [
        {
          key: `1-1`,
          name: 'Giao kế hoạch và vốn',
          children: [
            {
              key: `1-2-1`,
              name: 'Giao kế hoạch và vốn đầu năm',
              children: [
                {
                  key: `1-2-1-1`,
                  name: 'Quyết định',
                  children: [
                    {
                      key: `1-2-1-1-1`,
                      name: 'Thêm mới TTCP',
                    },
                    {
                      key: `1-2-1-1-2`,
                      name: 'Xem TTCP',
                    },
                    {
                      key: `1-2-1-1-3`,
                      name: 'Xóa TTCP',
                    },
                    {
                      key: `1-2-1-1-4`,
                      name: 'Sửa TTCP',
                    },
                  ]
                }
              ]
            }
          ]
        },
      ]
    }
  ];
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};
  constructor(
    private readonly fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private dmDungCungService: DanhMucDungChungService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    public userService: UserService,
    private router: Router
  ) {
    this.formData = this.fb.group({
      ma: [null],
      maCha: [null],
      giaTri: [null],
      ghiChu: [null],
      loai: [null]
    });
  }

  async ngOnInit() {
    try {
      this.userInfo = this.userService.getUserLogin();
      this.listOfMapData.forEach(item => {
        this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
      });
      if (this.userInfo) {
        this.qdTCDT = this.userInfo.MA_QD;
      }
      await this.search();
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }
  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    if (!$event) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.key === d.key)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList(root: TreeNodeInterface): TreeNodeInterface[] {
    const stack: TreeNodeInterface[] = [];
    const array: TreeNodeInterface[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false });

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level! + 1, expand: false, parent: node });
        }
      }
    }

    return array;
  }

  visitNode(node: TreeNodeInterface, hashMap: { [key: string]: boolean }, array: TreeNodeInterface[]): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }
  onAllChecked(checked) {
    this.dataTable.forEach((item) => {
      this.updateCheckedSet(item.id, checked);
    })
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
    console.log(this.setOfCheckedId
    )
  }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = true;
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

  async search() {
    this.spinner.show();
    let body = this.formData.value;
    body.paggingReq = {
      limit: this.pageSize,
      page: this.page - 1,
    }
    let res = await this.dmDungCungService.search(body);
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

  clearFilter() {
    this.formData.reset()
    this.search();
  }

  convertTrangThai(status: string) {
    return convertTrangThai(status);
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
          this.dmDungCungService.xoa(item.id).then((res) => {
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

  redirectToChiTiet(isView: boolean, id: number) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = isView;
  }

  async showList() {
    this.isDetail = false;
    await this.search();
  }

  export() {
    if (this.totalRecord > 0) {
      this.spinner.show();
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
    }
  }

  deleteSelect() {
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
            let res = await this.dmDungCungService.deleteMuti({ ids: dataDelete });
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
              await this.search();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
            this.spinner.hide();
          } catch (e) {
            console.log('error: ', e);
            this.spinner.hide();
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          }
        },
      });
    } else {
      this.notification.error(MESSAGE.ERROR, "Không có dữ liệu phù hợp để xóa.");
    }
  }

  filterInTable(key: string, value: string) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          if (item[key].toString().toLowerCase().indexOf(value.toLowerCase()) != -1) {
            temp.push(item)
          }
        });
      }
      this.dataTable = [...this.dataTable, ...temp];
    } else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
    console.log(this.dataTableAll)
  }

  print() {

  }

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = this.formData.value;
        this.dmDungCungService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-danh-muc-dung-chung.xlsx'),
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

  them(data?: any, isView?: boolean) {
    let modalTuChoi;
    // if (data == null && isView == false) {
    modalTuChoi = this.modal.create({
      nzTitle: 'Sửa thông tin cán bộ',
      nzContent: DialogThongTinCanBoComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataEdit: data,
        isView: isView,
      },
    });
    // }
    // if (data != null && isView == true) {
    //   modalTuChoi = this.modal.create({
    //     nzTitle: 'Chi tiết danh mục dùng chung',
    //     nzContent: DialogThemDanhMucDungChungComponent,
    //     nzMaskClosable: false,
    //     nzClosable: false,
    //     nzWidth: '900px',
    //     nzFooter: null,
    //     nzComponentParams: {
    //       dataEdit: data,
    //       isView: isView,
    //     },
    //   });
    // }

    // if (data != null && isView == false) {
    //   modalTuChoi = this.modal.create({
    //     nzTitle: 'Chỉnh sửa danh mục dùng chung',
    //     nzContent: DialogThemDanhMucDungChungComponent,
    //     nzMaskClosable: false,
    //     nzClosable: false,
    //     nzWidth: '900px',
    //     nzFooter: null,
    //     nzComponentParams: {
    //       dataEdit: data,
    //       isView: isView,
    //     },
    //   });
    // }

    modalTuChoi.afterClose.subscribe((data) => {
      this.search();
    })
  }

  openPhanQuyen() {
    let modalPhanQuyen;
    // if (data == null && isView == false) {
    modalPhanQuyen = this.modal.create({
      nzTitle: 'Phân quyền',
      nzContent: DialogPhanQuyenComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1300px',
      nzFooter: null,
      nzComponentParams: {
      },
    });
  }

  xoaNhieu() {
    let dataDelete = [];
    if (this.dataTable && this.dataTable.length > 0) {
      this.setOfCheckedId.forEach((item) => {
        dataDelete.push(item);
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
            let res = await this.dmDungCungService.deleteMuti({ idList: dataDelete });
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
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
}



