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
import {UserLogin} from "../../../../models/userlogin";
import {UserService} from "../../../../services/user.service";
import {NgxSpinnerService} from "ngx-spinner";


@Component({
  selector: 'app-them-moi-kho',
  templateUrl: './them-moi-kho.component.html',
  styleUrls: ['./them-moi-kho.component.scss']
})

export class ThemMoiKhoComponent implements OnInit {
  @ViewChild('treeSelect', {static: false}) treeSelect!: NzTreeComponent;

  data: any;
  nodesTree: any = [];
  options = {
    useCheckbox: true
  };
  settings = {};
  formKho: FormGroup;
  isVisible = false;
  levelNode: number = 0;
  userInfo: UserLogin

  dataDetail: any;
  nodeSelected: any;
  dataTable: any[] = [];
  dvi : string = 'Tấn kho';
  theTich : string = 'm3';

  constructor(
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private helperService: HelperService,
    private donviService: DonviService,
    private modal: NzModalRef,
    private userService: UserService,
    private spinner: NgxSpinnerService
  ) {
    this.formKho = this.fb.group({
      maDviCha: [null],
      tenDvi: ['', Validators.required],
      maDvi: ['', Validators.required],
      diaChi: [''],
      tenVietTat: [''],
      sdt: [''],
      fax: [''],
      trangThai: [true],
      type: [true],
      ghiChu: [''],
    })
    this.formKho.controls['maDviCha'].valueChanges.subscribe(value => {
      let node = this.treeSelect.getTreeNodeByKey(value);
      if (node) {
        this.levelNode = node.level + 1
      }
      if (this.levelNode == 5) {
        this.notification.error(MESSAGE.ERROR, 'Không được tạo đơn vị kho nhỏ hơn lô kho!')
        return;
      }
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      await Promise.all([
        this.userInfo = this.userService.getUserLogin(),
        this.loadDsDvi()
      ]);
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }


  enumToSelectList() {

  }

  nzClickNodeTree(event: any): void {
    if (event.keys.length > 0) {
      this.nodeSelected = event.node.origin;
    }
  }

  async loadDsDvi() {
    await this.donviService.layTatCaDviDmKho(LOAI_DON_VI.MLK, this.userInfo.MA_DVI).then((res: OldResponseData) => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.nodesTree = res.data;
      }
      this.nodesTree[0].expanded = false;

    })
  }

  handleCancel(): void {
    this.modal.destroy();
  }
}
