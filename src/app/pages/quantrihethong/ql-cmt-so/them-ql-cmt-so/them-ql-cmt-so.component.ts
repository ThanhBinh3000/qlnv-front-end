import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STATUS_USER } from 'src/app/constants/config';
import { HelperService } from 'src/app/services/helper.service';
import { UserLogin } from 'src/app/models/userlogin';
import { NgxSpinnerService } from 'ngx-spinner';
import { DonviService } from 'src/app/services/donvi.service';
import { MESSAGE } from 'src/app/constants/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { QlNguoiSuDungService } from 'src/app/services/quantri-nguoidung/qlNguoiSuDung.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';

import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';

interface TreeNode {
  name: string;
  disabled?: boolean;
  children?: TreeNode[];
}

const TREE_DATA: TreeNode[] = [
  {
    name: 'Quản trị',
    disabled: false,
    children: [{ name: '0-0-0' }, { name: '0-0-1' }, { name: '0-0-2' }]
  },
  {
    name: 'Danh mục',
    children: [
      {
        name: '0-1-0',
        children: [{ name: '0-1-0-0' }, { name: '0-1-0-1' }]
      },
      {
        name: '0-1-1',
        children: [{ name: '0-1-1-0' }, { name: '0-1-1-1' }]
      }
    ]
  }
];

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
  disabled: boolean;
}

@Component({
  selector: 'app-them-ql-cmt-so',
  templateUrl: './them-ql-cmt-so.component.html',
  styleUrls: ['./them-ql-cmt-so.component.scss'],
})
export class ThemQlCMTSoComponent implements OnInit {
  public formGroup: FormGroup;
  statusValue = "A"
  data: any;
  comfirmPass: any;
  options: any[] = [];
  optionsDonVi: any[] = [];
  constructor(
    private fb: FormBuilder,
    private helperService: HelperService,
    private router: Router,
    // private userInfo: UserLogin,
    private qlNSDService: QlNguoiSuDungService,
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private notification: NzNotificationService,
    private modal: NzModalRef,

  ) {


    this.dataSource.setData(TREE_DATA);

  }



  ngOnInit(): void {
    // console.log(this.userInfo)

    this.initForm()
    this.laytatcadonvi()

  }


  async laytatcadonvi() {
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


  initForm() {
    this.formGroup = this.fb.group({
      "chucvuId": [this.data?.chucvuId ?? 0],
      "dvql": [this.data?.dvql ?? "", Validators.required],
      "email": [this.data?.email ?? ""],
      "fullName": [this.data?.fullName ?? ""],
      "groupId": [this.data?.groupId ?? 0, Validators.required],
      "groupsArr": [this.data?.groupsArr ?? ""],
      "password": [this.data?.password ?? "", Validators.required],
      "cfpassword": ["", Validators.required],
      "phoneNo": [this.data?.phoneNo ?? ""],
      "status": [this.data?.status ?? ""],
      "str": [this.data?.str ?? ""],
      "sysType": [this.data?.sysType ?? "AD", Validators.required],
      "token": [this.data?.token ?? ""],
      "trangThai": [this.data?.trangThai ?? STATUS_USER.HOAT_DONG],
      "username": [this.data?.username ?? "", Validators.required],
    });
  }


  async themmoi() {
    this.helperService.markFormGroupTouched(this.formGroup);
    if (this.formGroup.invalid) {
      return;
    }
    let body = this.formGroup.value
    body.paggingReq = {
      "limit": 20,
      "page": 1
    },
      delete body.cfpassword
    debugger
    let res = await this.qlNSDService.create(body);
    debugger
    if (res.msg == MESSAGE.SUCCESS) {
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }

  }

  huy() {
    this.modal.close();
  }



  private transformer = (node: TreeNode, level: number): FlatNode => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.name === node.name
        ? existingNode
        : {
          expandable: !!node.children && node.children.length > 0,
          name: node.name,
          level,
          disabled: !!node.disabled
        };
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };
  flatNodeMap = new Map<FlatNode, TreeNode>();
  nestedNodeMap = new Map<TreeNode, FlatNode>();
  checklistSelection = new SelectionModel<FlatNode>(true);

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable
  );

  treeFlattener = new NzTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener);



  hasChild = (_: number, node: FlatNode): boolean => node.expandable;

  descendantsAllSelected(node: FlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.length > 0 && descendants.every(child => this.checklistSelection.isSelected(child));
  }

  descendantsPartiallySelected(node: FlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  leafItemSelectionToggle(node: FlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  itemSelectionToggle(node: FlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  checkAllParentsSelection(node: FlatNode): void {
    let parent: FlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  checkRootNodeSelection(node: FlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 && descendants.every(child => this.checklistSelection.isSelected(child));
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  getParentNode(node: FlatNode): FlatNode | null {
    const currentLevel = node.level;

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (currentNode.level < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }



}
