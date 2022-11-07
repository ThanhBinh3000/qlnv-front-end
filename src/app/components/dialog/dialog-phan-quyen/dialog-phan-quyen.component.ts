import { Observable, of } from 'rxjs';
import { PAGE_SIZE_DEFAULT } from './../../../constants/config';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { Globals } from 'src/app/shared/globals';
import { HelperService } from "../../../services/helper.service";
import { DanhMucDungChungService } from "../../../services/danh-muc-dung-chung.service";
import { Router } from "@angular/router";
import { NzFormatBeforeDropEvent } from 'ng-zorro-antd/tree';
import { delay } from 'rxjs/operators';
import { QlNhomQuyenService } from 'src/app/services/quantri-nguoidung/qlNhomQuyen.service';
import { QlQuyenNSDService } from 'src/app/services/quantri-nguoidung/qlQuyen.service';
import { QlNguoiSuDungService } from 'src/app/services/quantri-nguoidung/qlNguoiSuDung.service';

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
  selector: 'dialog-phan-quyen',
  templateUrl: './dialog-phan-quyen.component.html',
  styleUrls: ['./dialog-phan-quyen.component.scss'],
})
export class DialogPhanQuyenComponent implements OnInit {
  dataEdit: any;
  isView: boolean;
  formData: FormGroup;
  totalRecord: number = 10;
  danhMucList: any[] = [];
  submited: boolean = false;
  page: number = 1;
  pageSize: number = 500;
  dataTable: any[] = [];
  allChecked = false;
  indeterminate = false;

  listOfMapData: TreeNodeInterface[] = [];
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private _modalRef: NzModalRef,
    private spinner: NgxSpinnerService,
    private dmService: DanhMucDungChungService,
    public globals: Globals,
    private helperService: HelperService,
    private notification: NzNotificationService,
    private qlNhomQuyenService: QlNhomQuyenService,
    private qlQuyenNSDService: QlQuyenNSDService,
    private qlNSDService: QlNguoiSuDungService
  ) {
    this.formData = this.fb.group({
      id: [null],
      loai: [null, [Validators.required]],
      ma: [null, [Validators.required]],
      maCha: [null],
      trangThai: ['01'],
      giaTri: [null, [Validators.required]],
      ghiChu: [null]
    });
  }

  async ngOnInit() {
    this.spinner.show();
    await Promise.all([
      this.search(),
      this.getListDataTree(),
    ])
    this.bindingData(this.dataEdit)
    this.listOfMapData.forEach(item => {
      this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
    });
    this.spinner.hide();
  }

  async getListDataTree() {
    let body = {

    }
    let dataTree = await this.qlQuyenNSDService.getAll(body);
    if (dataTree.msg == MESSAGE.SUCCESS) {
      this.listOfMapData = dataTree.data;
      console.log(this.listOfMapData);
      this.listOfMapData.forEach(item => {
        this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
      })
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

  async bindingData(dataDt) {
    let res = await this.qlNSDService.getDetail(dataDt.id);
    const dataEdit = res.data;
    if (dataEdit) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          dataEdit.listRoles.includes(item.id) ? item.checked = true : item.checked = false;
        });
      }
    }
  }

  async save() {
    this.spinner.show();
    let dataRoles = [];
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach((item) => {
        if (item.checked) {
          dataRoles.push(item.id);
        }
      });
    }
    if (!this.dataEdit.id) {
      this.notification.error(MESSAGE.ERROR, "Vui lòng lựa chọn người sử dụng")
      this.spinner.hide();
      return
    }
    if (dataRoles.length == 0) {
      this.notification.error(MESSAGE.ERROR, "Vui lòng chọn quyền");
      this.spinner.hide();
      return;
    }
    let body = {
      id: this.dataEdit.id,
      listRoles: dataRoles,
      saveRoles: true
    }
    let res = await this.qlNSDService.update(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      this._modalRef.close(this.formData);
    } else {
      this.notification.error(MESSAGE.ERROR, res.error)
    }
    this.spinner.hide();
  }


  handleCancel() {
    this._modalRef.destroy();
  }

  async changePageIndex(event) {
    this.spinner.show();
    try {
      this.page = event;
      await this.search();
      this.bindingData(this.dataEdit)
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

  listDataSelected: any[] = [];
  isCheckedData(idSelected): boolean {
    let dataFilter = this.listDataSelected.filter(data => data == idSelected);
    if (dataFilter.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  async showDetail($event, id: number) {
    this.spinner.show();
    $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
    $event.target.parentElement.classList.add('selectedRow')
    let res = await this.qlNhomQuyenService.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDataSelected = res.data.listPermission;
    }
    this.spinner.hide();
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
    } else {
      this.dataTable = [];
      this.totalRecord = 0;
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
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
}
