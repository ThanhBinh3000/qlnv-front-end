import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {cloneDeep} from 'lodash';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {DialogNhomQuyenComponent} from 'src/app/components/dialog/dialog-nhom-quyen/dialog-nhom-quyen.component';
import {MESSAGE} from 'src/app/constants/message';
import {UserLogin} from 'src/app/models/userlogin';
import {QlNhomQuyenService} from 'src/app/services/quantri-nguoidung/qlNhomQuyen.service';
import {QlQuyenNSDService} from 'src/app/services/quantri-nguoidung/qlQuyen.service';
import {UserService} from 'src/app/services/user.service';
import {convertTrangThai} from 'src/app/shared/commonFunction';
import {DanhMucDungChungService} from "../../../services/danh-muc-dung-chung.service";
import {saveAs} from 'file-saver';

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
  selector: 'app-quan-ly-quyen',
  templateUrl: './quan-ly-quyen.component.html',
  styleUrls: ['./quan-ly-quyen.component.scss'],
})
export class QuanLyQuyenComponent implements OnInit {

  formData: FormGroup;

  setOfCheckedId = new Set<number>();


  optionsDonVi: any[] = [];
  options: any[] = [];
  inputDonVi: string = '';
  errorMessage: string = '';
  startValue: Date | null = null;
  endValue: Date | null = null;

  page: number = 1;
  pageSize: number = 20;
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

  listOfMapData: any[] = [];
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};
  listDataSelected: any[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private dmDungCungService: DanhMucDungChungService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    public userService: UserService,
    private qlNhomQuyenService: QlNhomQuyenService,
    private qlQuyenNSDService: QlQuyenNSDService
  ) {
    this.formData = this.fb.group({});
  }

  async ngOnInit() {
    try {
      await Promise.all([
        this.userInfo = this.userService.getUserLogin(),
        this.getListDataTree(),
      ]);


      await this.search();
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async getListDataTree() {
    let body = {}
    let dataTree = await this.qlQuyenNSDService.getAll(body);
    if (dataTree.msg == MESSAGE.SUCCESS) {
      this.listOfMapData = dataTree.data;
      this.listOfMapData.forEach(item => {
        this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
      })
      this.dataTableAll = cloneDeep(this.listOfMapData);
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
    stack.push({...root, level: 0, expand: false});

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children.length > 0) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({...node.children[i], level: node.level! + 1, expand: false, parent: node});
        }
      } else {
        delete node.children
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

  async showDetail($event, id: number) {
    this.spinner.show();
    $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
    $event.target.parentElement.classList.add('selectedRow')
    let res = await this.qlNhomQuyenService.getDetail(id);
    this.selectedId = id;
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDataSelected = res.data.listPermission;
    }
    this.spinner.hide();
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

  async search() {
    this.spinner.show();
    let body = this.formData.value;
    body.paggingReq = {
      limit: this.pageSize,
      page: this.page - 1,
    }
    let res = await this.qlNhomQuyenService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.totalRecord = data.totalElements;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
        });
      }
      // this.dataTableAll = cloneDeep(this.dataTable);

    } else {
      this.dataTable = [];
      this.totalRecord = 0;
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
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
            let res = await this.dmDungCungService.deleteMuti({ids: dataDelete});
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

  searchFilter: string;

  filterInTable(value) {
    if (value && value != '') {
      this.listOfMapData = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          console.log(item);
          if (item['name'].toString().toLowerCase().indexOf(value.toLowerCase()) != -1) {
            temp.push(item)
          }
        });
      }
      this.listOfMapData = [...this.listOfMapData, ...temp];
    } else {
      this.listOfMapData = cloneDeep(this.dataTableAll);
    }
    console.log(this.listOfMapData);
    this.listOfMapData.forEach(item => {
      this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
    })
  }

  themNhomQuyen(data?: any, isView?: boolean) {
    const modalTuChoi = this.modal.create({
      nzTitle: 'Thêm mới nhóm quyền',
      nzContent: DialogNhomQuyenComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataEdit: data,
        isView: isView,
      },
    });
    modalTuChoi.afterClose.subscribe((data) => {
      this.search();
    })
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
            let res = await this.dmDungCungService.deleteMuti({idList: dataDelete});
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

  isCheckedData(idSelected): boolean {
    let dataFilter = this.listDataSelected.filter(data => data == idSelected);
    if (dataFilter.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  checkData(itemSelected) {
    let dataFilter = this.listDataSelected.filter(data => data == itemSelected.id);
    if (dataFilter.length > 0) {
      this.removeItem(itemSelected)
    } else {
      this.pushItem(itemSelected);
    }
  }

  pushItem(itemSelected) {
    // has parent
    if (!!itemSelected.parent) {
      // check exis data id parent
      let dataFilter = this.listDataSelected.filter(data => data == itemSelected.parent.id);
      if (dataFilter.length == 0) {
        this.listDataSelected.push(itemSelected.parent.id);
      }
    }
    // has children
    if (!!itemSelected.children) {
      this.listDataSelected.push(itemSelected.id);
      this.pushChildren(itemSelected.children)
    } else {
      this.listDataSelected.push(itemSelected.id);
    }
  }

  pushChildren(itemSelected: []) {
    itemSelected.forEach(element => {
      this.pushItem(element)
    });
  }

  removeItem(itemSelected) {
    // has children property
    if (!!itemSelected.children) {
      this.listDataSelected = this.listDataSelected.filter(data => data != itemSelected.id);
      this.removeChildren(itemSelected.children)
    } else {
      this.listDataSelected = this.listDataSelected.filter(data => data != itemSelected.id);
    }
    // has parent property
    if (!!itemSelected.parent) {
      let listChilren = []
      itemSelected.parent.children.forEach(item => listChilren.push(item.id));
      let intersection = this.listDataSelected.filter(x => listChilren.includes(x));
      if (intersection.length == 0) {
        this.listDataSelected = this.listDataSelected.filter(data => data != itemSelected.parent.id)
        this.removeItem(itemSelected.parent);
      }
    }
  }

  removeChildren(itemSelected: []) {
    itemSelected.forEach(element => {
      this.removeItem(element)
    });
  }

  async savePermission() {
    this.spinner.show();
    if (!this.selectedId) {
      this.notification.error(MESSAGE.ERROR, "Vui lòng lựa chọn nhóm quyền cần cập nhật")
      this.spinner.hide();
      return
    }
    if (this.listDataSelected.length == 0) {
      this.notification.error(MESSAGE.ERROR, "Vui lòng chọn quyền");
      this.spinner.hide();
      return;
    }
    let body = {
      id: this.selectedId,
      listPermission: this.listDataSelected,
      savePermission: true
    }
    let res = await this.qlNhomQuyenService.update(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS)
    } else {
      this.notification.error(MESSAGE.ERROR, res.error)
    }
    this.spinner.hide();
  }

  xoaNhomQuyen(data: any) {
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
          this.qlNhomQuyenService.deleteMuti({ids: [data.id]}).then((res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DELETE_SUCCESS,
              );
              this.search();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
          });
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  async export() {
    try {
      this.spinner.show();
      let body = this.formData.value;
      body.paggingReq = {
        limit: this.pageSize,
        page: this.page - 1,
      }
      let res = await this.qlNhomQuyenService.export(body)
        .subscribe((blob) =>
          saveAs(blob, "quan_ly_nhom_quyen.xlsx")
        );
      this.spinner.hide();
    } catch (e) {
      console.log("error: ", e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }
}



