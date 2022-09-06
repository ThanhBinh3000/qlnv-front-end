import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzFormatEmitEvent, NzTreeComponent } from 'ng-zorro-antd/tree';
import { DonviService } from 'src/app/services/donvi.service';
import { ResponseData, OldResponseData } from 'src/app/interfaces/response';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { HelperService } from 'src/app/services/helper.service';
import { NzTreeSelectComponent } from 'ng-zorro-antd/tree-select';
import { LOAI_DON_VI, TrangThaiHoatDong } from 'src/app/constants/status';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NewDonViComponent } from './new-don-vi/new-don-vi.component';
import { NgxSpinnerService } from 'ngx-spinner';



@Component({
  selector: 'app-danh-muc-don-vi',
  templateUrl: './danh-muc-don-vi.component.html',
  styleUrls: ['./danh-muc-don-vi.component.scss'],
})
export class DanhMucDonViComponent implements OnInit {
  @ViewChild('nzTreeSelectComponent', { static: false }) nzTreeSelectComponent!: NzTreeSelectComponent;
  searchValue = '';
  searchFilter = {
    soQD: '',
    maDonVi: ''
  };
  keySelected: any;
  res: any
  nodes: any = [];
  nodeDetail: any;
  defaultExpandedKeys: any = [];
  nodeSelected: any = []
  detailDonVi: FormGroup;
  levelNode: number = 0;
  isEditData: boolean = false;

  constructor(
    private router: Router,
    private donviService: DonviService,
    private notification: NzNotificationService,
    private formBuilder: FormBuilder,
    private helperService: HelperService,
    private _modalService: NzModalService,
    private spinner: NgxSpinnerService,
  ) {
    this.detailDonVi = this.formBuilder.group({
      id: [''],
      maDviCha: [''],
      tenDvi: ['', Validators.required],
      maDvi: [''],
      diaChi: [''],
      fax: [''],
      sdt: [''],
      trangThai: [''],
      type: [],
      ghiChu: [''],
    })
  }

  async ngOnInit() {
    this.spinner.show();
    await Promise.all([
      this.layTatCaDonViTheoTree()
    ]);
    this.spinner.hide();
  }

  /**
   * call api init
   */

  async layTatCaDonViTheoTree(id?) {
    await this.donviService.layTatCaDonViCha(LOAI_DON_VI.PB).then((res: OldResponseData) => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.nodes = res.data;
        this.nodes[0].expanded = true;
        //  lúc đầu mắc định lấy node gốc to nhất
        this.nodeSelected = res.data[0].id;
        // lấy detail đon vị hiện tại
        if (id) {
          this.showDetailDonVi(id)
        } else {
          this.showDetailDonVi(res.data[0].id)
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.error);
      }
    })
  }

  parentNodeSelected: any = [];

  nzClickNodeTree(event: any): void {
    if (event.keys.length > 0) {
      this.nodeSelected = event.node.origin.id;
      this.parentNodeSelected = event?.parentNode?.origin
      this.showDetailDonVi(event.node.origin.id)
    }
  }

  showDetailDonVi(id?: any) {
    if (id) {
      this.donviService.getDetail(id).then((res: OldResponseData) => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.nodeDetail = res.data;
          // gán giá trị vào form
          this.levelNode = +res.data.capDvi;
          this.detailDonVi.patchValue({
            id: res.data.id,
            maDviCha: res.data.maDviCha,
            tenDvi: res.data.tenDvi,
            maDvi: res.data.maDvi,
            diaChi: res.data.diaChi,
            sdt: res.data.sdt,
            fax: res.data.fax,
            trangThai: res.data.trangThai == TrangThaiHoatDong.HOAT_DONG,
            type: res.data.type == LOAI_DON_VI.PB,
            ghiChu: res.data.ghiChu,
          })
        } else {
          this.notification.error(MESSAGE.ERROR, res.error);
        }
      })
    }
  }

  showEdit(editData: boolean) {
    this.isEditData = editData
  }

  update() {
    this.helperService.markFormGroupTouched(this.detailDonVi);
    if (this.detailDonVi.invalid) {
      return;
    }
    let body = {
      ...this.detailDonVi.value,
      trangThai: this.detailDonVi.value.trangThai ? TrangThaiHoatDong.HOAT_DONG : TrangThaiHoatDong.KHONG_HOAT_DONG,
      type: this.detailDonVi.value.type ? LOAI_DON_VI.PB : null
    };
    this._modalService.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn sửa ?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.donviService.update(body).then((res: OldResponseData) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.isEditData = false;
            this.ngOnInit();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        })
      }
    });
  }

  delete() {
    this._modalService.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa ?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.donviService.delete(this.nodeSelected?.id == undefined ? this.nodeSelected : this.nodeSelected?.id).then((res: OldResponseData) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
            // xét node về không
            this.nodeSelected = []
            this.layTatCaDonViTheoTree()
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        })
      }
    });
  }

  create() {
    var nodesTree = this.nodes;
    let modal = this._modalService.create({
      nzTitle: 'Thêm mới đơn vị',
      nzContent: NewDonViComponent,
      nzClosable: true,
      nzFooter: null,
      nzStyle: { top: '50px' },
      nzWidth: 900,
      nzComponentParams: { nodesTree },
    });
    modal.afterClose.subscribe(res => {
      if (res) {
        this.ngOnInit()
      }
    });
  }
}
