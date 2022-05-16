import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { MESSAGE } from 'src/app/constants/message';
import { OldResponseData } from 'src/app/interfaces/response';
import { HelperService } from 'src/app/services/helper.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { DonviService } from 'src/app/services/donvi.service';
import { TrangThaiHoatDong } from 'src/app/constants/status';


@Component({
  selector: 'app-new-don-vi',
  templateUrl: './new-don-vi.component.html',
  styleUrls: ['./new-don-vi.component.scss']
})
export class NewDonViComponent implements OnInit {
  @ViewChild('treeSelect', { static: false }) treeSelect!: NzTreeComponent;

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
    // if (this.data || this.dataDetail) {
    //   this.donviService.TimTheoId(this.data?.id == undefined ? this.dataDetail.id : this.data.id).then((res: ResponseData) => {
    //     if (res.success) {
    //       this.data = res.data
    //       // api chuyển sang int hoặc string để chùng nhau
    //       this.data.type = this.data.type.toString();
    //       this.initForm();
    //     } else {
    //       this.notification.error(MESSAGE.ERROR, res.error);
    //     }
    //   })
    // }

    // if (this.nodesTree) {
    //   this.searchDVi()
    // }
  }


  enumToSelectList() {
    // this.helperService.EnumToSelectList("kieuphongban").then((res: ResponseData) => {
    //   if (res.success) {
    //     this.nodesTreeTypeDonVi = res.data
    //   }
    // })
  }

  initForm() {
    this.formDonVi = this.fb.group({
      tenDvi: ['', Validators.required],
      maDvi: [],
      maQhns: [''],
      diaChi: [''],
      ghiChu : [''],
      maDviCha: [''],
      trangThai: true,
      maQd: [''],
      maTr: [''],
      maKhqlh: [''],
      maKtbq: [''],
      maTckt: [''],
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
    let body = this.formDonVi.value;
    body.trangThai = body.trangThai ? TrangThaiHoatDong.HOAT_DONG : TrangThaiHoatDong.KHONG_HOAT_DONG
    this.donviService.create(body).then((res: OldResponseData) => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        this.modal.close(true);
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    })
    .catch((e) => {
      console.error('error: ', e);
      this.notification.error(
        MESSAGE.ERROR,
        e.error.errors[0].defaultMessage,
      );
    })
  }
}
