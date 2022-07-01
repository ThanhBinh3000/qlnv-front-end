import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzFormatEmitEvent, NzTreeComponent } from 'ng-zorro-antd/tree';
import { DonviService } from 'src/app/services/donvi.service';
import { ResponseData,OldResponseData } from 'src/app/interfaces/response';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { HelperService } from 'src/app/services/helper.service';
import { NzTreeSelectComponent } from 'ng-zorro-antd/tree-select';
import { TrangThaiHoatDong } from 'src/app/constants/status';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NewDonViComponent } from './new-don-vi/new-don-vi.component';



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
    maDonVi : ''
  };
  keySelected : any;
  res: any
  nodes: any = [];
  nodeDetail: any;
  defaultExpandedKeys : any = [];
  nodeSelected: any = []
  detailDonVi: FormGroup;
  constructor(
    private router: Router,
    private donviService: DonviService,
    private notification: NzNotificationService,
    private formBuilder: FormBuilder,
    private helperService: HelperService,
    private _modalService: NzModalService,

  ) { }

  ngOnInit(): void {
    this.initForm();
    this.layTatCaDonViTheoTree();
  }

  async search() {
    console.log("avb");
  }

  clearFilter(){
    
  }

  initForm() {
    this.detailDonVi = this.formBuilder.group({
      tenDvi: ['', Validators.required],
      maDvi: [''],
      maQhns: [''],
      diaChi: [''],
      ghiChu : [''],
      maDviCha: [''],
      trangThai: [''],
      maQd: [''],
      maTr: [''],
      maKhqlh: [''],
      maKtbq: [''],
      maTckt: [''],
    })
  }

  nzCheck(event: NzFormatEmitEvent): void {
    console.log("🚀 ~ file: danh-muc-don-vi.component.ts ~ line 72 ~ DanhMucDonViComponent ~ nzCheck ~ event", event)
    
    // this.nodeSelected = event.keys[0];
    // this.selectedKeys = event.node.origin.data;
    // this.showDetailDonVi()
  }

  /**
   * call api init
   */

  layTatCaDonViTheoTree(id?) {
    this.donviService.layTatCaDonViCha().then((res: OldResponseData) => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.nodes = res.data;
        this.nodes[0].expanded = true;
        //  lúc đầu mắc định lấy node gốc to nhất
        this.nodeSelected = res.data[0].id;
        // lấy detail đon vị hiện tại
        if(id){
          this.showDetailDonVi(id)
        }else{
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
      console.log("🚀 ~ file: danh-muc-don-vi.component.ts ~ line 99 ~ DanhMucDonViComponent ~ nzClickNodeTree ~ event", event)
      
      this.nodeSelected = event.node.origin.id;
      // this.selectedKeys = event.node.origin.data;
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
          this.detailDonVi.patchValue({
            tenDvi: res.data.tenDvi,
            maDvi: res.data.maDvi,
            maQhns: res.data.maQhns,
            diaChi: res.data.diaChi,
            ghiChu : res.data.ghiChu,
            maDviCha: res.data.maDviCha,
            trangThai: res.data.trangThai === TrangThaiHoatDong.HOAT_DONG,
            maQd: res.data.maQd,
            maTr: res.data.maTr,
            maKhqlh: res.data.maKhqlh,
            maKtbq: res.data.maKtbq,
            maTckt: res.data.maTckt
          })
        } else {
          this.notification.error(MESSAGE.ERROR, res.error);
        }
      })
    }
  }

  update(){
    this.helperService.markFormGroupTouched(this.detailDonVi);
    if (this.detailDonVi.invalid) {
      return;
    }
    let body = {
      ...this.detailDonVi.value,
      id: this.nodeSelected,
      trangThai : this.detailDonVi.value.trangThai ? TrangThaiHoatDong.HOAT_DONG : TrangThaiHoatDong.KHONG_HOAT_DONG, 
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
            this.layTatCaDonViTheoTree(this.nodeSelected);
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        })
      }
    });
  }

  delete(){
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

  create(){
    var nodesTree = this.nodes;
    let modal = this._modalService.create({
      nzTitle: 'Thêm mới đơn vị',
      nzContent: NewDonViComponent,
      nzClosable: true,
      nzFooter: null,
      nzStyle: { top: '50px' },
      nzWidth: 600,
      nzComponentParams: {nodesTree},
    });
    modal.afterClose.subscribe(res => {
      if (res) {
        this.layTatCaDonViTheoTree()
      }
    });
  }
}
