import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { MESSAGE } from 'src/app/constants/message';
import { OldResponseData } from 'src/app/interfaces/response';
import { HelperService } from 'src/app/services/helper.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { DonviService } from 'src/app/services/donvi.service';

@Component({
  selector: 'app-new-don-vi',
  templateUrl: './new-don-vi.component.html',
  styleUrls: ['./new-don-vi.component.scss']
})
export class NewDonViComponent implements OnInit {
  @ViewChild('treeSelect', { static: false }) treeSelect!: NzTreeComponent;
  @ViewChild('treeSelectTypeDonvi', { static: false }) treeSelectTypeDonvi!: NzTreeComponent;

  data: any;
  nodesTree: any = [];
  nodesTreeTypeDonVi: any = []
  options = {
    useCheckbox: true
  };
  settings = {};
  formDonVi: FormGroup;
  isVisible = false;
  selectedNode: any;
  optionList: string[] = [];
  cureentNodeParent: any

  dataDetail: any;
  constructor(
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private helperService: HelperService,
    private donviService: DonviService,
    private modal: NzModalRef
  ) {
    // lấy thêm loại đơn vị 
    this.enumToSelectList()

  }

  ngOnInit(): void {
    this.initForm();
    if (this.data || this.dataDetail) {
      this.donviService.TimTheoId(this.data?.id == undefined ? this.dataDetail.id : this.data.id).then((res: OldResponseData) => {
        if (res.success) {
          this.data = res.data
          // api chuyển sang int hoặc string để chùng nhau 
          this.data.type = this.data.type.toString();
          this.initForm();
        } else {
          this.notification.error(MESSAGE.ERROR, res.error);
        }
      })
    }

    if (this.nodesTree) {
      this.searchDVi()
    }
  }

  searchDVi() {
    const body = {
      "keyword": '',
      "type": 2
    }

    this.donviService.layTatCaTheoFilterTree(body).then(res => {
      if (res.success) {
        this.nodesTree = res.data;
        setTimeout(() => {
          this.nodesTree.forEach(element => {
            if (element.children) {
              element.expanded = true;
            }
          });
          this.nodesTree = [...this.nodesTree];
        }, 100);
      } else {
        this.notification.error(MESSAGE.ERROR, res.error);
      }
    })
  }

  enumToSelectList() {
    this.helperService.EnumToSelectList("kieuphongban").then((res: OldResponseData) => {
      if (res.success) {
        this.nodesTreeTypeDonVi = res.data
      }
    })
  }

  initForm() {
    this.formDonVi = this.fb.group({
      name: [this.data?.name ?? '', Validators.required],
      code: [this.data?.code ?? '', Validators.required],
      deptType: [this.data?.deptType ?? 0],
      parentId: [this.data?.parentId ?? '', Validators.required],
      // identifyCode: [this.data?.identifyCode ?? '', Validators.required],
      nameShort: [this.data?.nameShort ?? ''],
      nameEng: [this.data?.nameEng ?? ''],
      address: [this.data?.address ?? ''],
      taxCode: [this.data?.taxCode ?? '',Validators.required],
      phoneNumber: [this.data?.phoneNumber ?? ''],
      fax: [this.data?.fax ?? ''],
      email: [this.data?.email ?? ''],
      isActive: [this.data?.isActive ?? true],
      index: [this.data?.index ?? 0],
      type: [this.data?.type ?? "0"],
      path: [this.data?.path ?? '']
    })
  }

  handleCancel(): void {
    this.modal.destroy();
  }


  add() {
    this.helperService.markFormGroupTouched(this.formDonVi);
    if (this.formDonVi.invalid) {
      return;
    }
    //  lấy key parent
    this.formDonVi.patchValue({ 'parentId': this.treeSelect.getSelectedNodeList()[0].key })
    let body = this.formDonVi.value

    if (this.data) {
      body.id = this.data.id
      this.donviService.update(this.formDonVi.value).then((res: OldResponseData) => {
        if (res.success) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          this.modal.close(true);
        } else {
          this.notification.error(MESSAGE.ERROR, res.error);
        }
      })
    } else {
      this.donviService.create(this.formDonVi.value).then((res: OldResponseData) => {
        if (res.success) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          this.modal.close(true);
        } else {
          this.notification.error(MESSAGE.ERROR, res.error);
        }
      })
    }
  }




}
