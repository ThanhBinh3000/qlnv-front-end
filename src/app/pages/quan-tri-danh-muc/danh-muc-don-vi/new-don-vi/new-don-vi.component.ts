import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {MESSAGE} from 'src/app/constants/message';
import {OldResponseData} from 'src/app/interfaces/response';
import {HelperService} from 'src/app/services/helper.service';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NzTreeComponent} from 'ng-zorro-antd/tree';
import {DonviService} from 'src/app/services/donvi.service';
import {LOAI_DON_VI, TrangThaiHoatDong} from 'src/app/constants/status';


@Component({
  selector: 'app-new-don-vi',
  templateUrl: './new-don-vi.component.html',
  styleUrls: ['./new-don-vi.component.scss']
})
export class NewDonViComponent implements OnInit {
  @ViewChild('treeSelect', {static: false}) treeSelect!: NzTreeComponent;

  data: any;
  nodesTree: any = [];
  options = {
    useCheckbox: true
  };
  settings = {};
  formDonVi: FormGroup;
  isVisible = false;
  selectedNode: any;
  optionList: string[] = [];
  cureentNodeParent: any
  levelNode: number = 0;

  dataDetail: any;
  radioValue: any;

  constructor(
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private helperService: HelperService,
    private donviService: DonviService,
    private modal: NzModalRef
  ) {
    this.formDonVi = this.fb.group({
      maDviCha: [''],
      tenDvi: ['', Validators.required],
      maDvi: ['', Validators.required],
      diaChi: [''],
      tenVietTat: [''],
      sdt: [''],
      fax: [''],
      trangThai: [true],
      type: [null],
      ghiChu: [''],
      vungMien: [''],
    })
    this.formDonVi.controls['maDviCha'].valueChanges.subscribe(value => {
      let node = this.treeSelect.getTreeNodeByKey(value);
      this.levelNode = node.level
      if (this.levelNode == 3) {
        this.formDonVi.patchValue({
          type : true
        })
      }
    });
  }

  ngOnInit(): void {
  }


  enumToSelectList() {

  }

  handleCancel(): void {
    this.modal.destroy();
  }

  add() {
    this.helperService.markFormGroupTouched(this.formDonVi);
    if (this.formDonVi.invalid) {
      return;
    }
    let body = this.formDonVi.value;
    body.trangThai = this.formDonVi.get('trangThai').value ? TrangThaiHoatDong.HOAT_DONG : TrangThaiHoatDong.KHONG_HOAT_DONG;
    body.type = this.formDonVi.get('type').value == true ? LOAI_DON_VI.PB : LOAI_DON_VI.DV;
    body.maDvi = body.maDviCha + body.maDvi
    this.donviService.create(body).then((res: OldResponseData) => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        this.modal.close(true);
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }).catch((e) => {
      console.error('error: ', e);
      this.notification.error(
        MESSAGE.ERROR,
        e.error.errors[0].defaultMessage,
      );
    });
  }
}
