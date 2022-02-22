import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { OldResponseData } from 'src/app/interfaces/response';
import { DonviService } from 'src/app/services/donvi.service';
import { HelperService } from 'src/app/services/helper.service';
import { QuanLyChucVuService } from 'src/app/services/quanlychucvu.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-themchucvu',
  templateUrl: './themchucvu.component.html',
  styleUrls: ['./themchucvu.component.scss']
})
export class ThemchucvuComponent implements OnInit {
  
  data: any;
  dataDetail: any
  listLayTatCaDonViTheoTree: any = [];
  public formInput: FormGroup;
  listloaivanban: any = [];
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private helperService: HelperService,
    private modal: NzModalRef,
    private notification: NzNotificationService,
    private quanlychucvuService : QuanLyChucVuService,
    
  ) {


  }

  ngOnInit(): void {
    this.initForm()  
    if (this.data || this.dataDetail) {
      this.quanlychucvuService.getDetail(this.data?.id == undefined ? this.dataDetail.id : this.data.id).then((res: OldResponseData) => {
        if (res.success) {
          this.data = res.data
          this.initForm();
        } else {
          this.notification.error(MESSAGE.ERROR, res.error);
        }
      })
    }
  }




  initForm() {
    this.formInput = this.fb.group({
      name: [this.data?.name ?? "",Validators.required],
      code: [this.data?.code ?? "",Validators.required],
      description: [this.data?.description ?? ""],
    });
  }


  handleCancel(): void {
    this.modal.close();
  }

  add() {
    this.helperService.markFormGroupTouched(this.formInput);
    if (this.formInput.invalid) {
      return;
    }
    let body: any = this.formInput.value;
    if (this.data) {
        body.id = this.data.id;
        this.quanlychucvuService.update(body).then((res: OldResponseData) => {
          if (res.success) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.modal.close(true);
          } else {
            this.notification.error(MESSAGE.ERROR, res.error);
          }
        })
    } else {
      this.quanlychucvuService.create(body).then((res: OldResponseData) => {
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


