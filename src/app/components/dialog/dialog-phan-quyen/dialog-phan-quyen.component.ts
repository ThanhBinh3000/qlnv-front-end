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
  pageSize: number = PAGE_SIZE_DEFAULT;

  listOfMapData: TreeNodeInterface[] = [
    {
      key: `1`,
      name: 'Kế hoạch, vốn và dự toán NSNN',
      children: [
        {
          key: `1-1`,
          name: 'Giao kế hoạch và dự toán',
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
    private router: Router,
    private fb: FormBuilder,
    private _modalRef: NzModalRef,
    private spinner: NgxSpinnerService,
    private dmService: DanhMucDungChungService,
    public globals: Globals,
    private helperService: HelperService,
    private notification: NzNotificationService
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
    await Promise.all([
      this.getDmList()
    ])
    this.bindingData(this.dataEdit)
    this.listOfMapData.forEach(item => {
      this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
    });
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


  async save() {
    this.submited = true;
    if (this.formData.valid) {
      this.spinner.show();
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        this.spinner.hide();
        return;
      }
      let body = this.formData.value;
      console.log(this.formData.value)
      let res
      if (this.dataEdit != null) {
        res = await this.dmService.update(body);
      } else {
        res = await this.dmService.create(body);
      }
      if (res.msg == MESSAGE.SUCCESS) {
        if (this.dataEdit != null) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.spinner.hide();
      this._modalRef.close(this.formData);
    }
  }

  async getDmList() {
    let data = await this.dmService.danhMucChungGetAll("DANH_MUC_DC");
    this.danhMucList = data.data;
  }



  handleCancel() {
    this._modalRef.destroy();
  }

  bindingData(dataEdit) {
    if (dataEdit) {
      this.formData.get('id').setValue(dataEdit.id);
      this.formData.get('loai').setValue(dataEdit.loai);
      this.formData.get('ma').setValue(dataEdit.ma);
      this.formData.get('maCha').setValue(dataEdit.maCha);
      this.formData.get('ghiChu').setValue(dataEdit.ghiChu);
      this.formData.get('trangThai').setValue(dataEdit.trangThai);
      this.formData.get('giaTri').setValue(dataEdit.giaTri);
    }
  }

  async changePageIndex(event) {
    this.spinner.show();
    try {
      this.page = event;
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
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }
}
