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
import { NgxSpinnerService } from 'ngx-spinner';
import {DanhMucService} from "../../../services/danhmuc.service";
import {
  DialogDanhSachHangHoaComponent
} from "../../../components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component";



@Component({
  selector: 'app-danh-muc-dinh-muc-phi',
  templateUrl: './danh-muc-dinh-muc-phi-component.html',
  styleUrls: ['./danh-muc-dinh-muc-phi-component.scss'],
})
export class DanhMucDinhMucPhiComponent implements OnInit {
  formData: FormGroup;
  listVthh: any[] = [];
  constructor(
    private router: Router,
    private donviService: DonviService,
    private danhMucService: DanhMucService,
    private notification: NzNotificationService,
    private formBuilder: FormBuilder,
    private helperService: HelperService,
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
  ) {

  }

  async ngOnInit() {
    await  this.loadDsVthh();
  }
  async loadDsVthh() {
    this.listVthh = [];
    let res = await this.danhMucService.danhMucChungGetAll('LOAI_HHOA');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listVthh = res.data;
    }
  }
  selectHangHoa() {
    const modal = this.modal.create({
      nzTitle: 'Danh sách hàng hóa',
      nzContent: DialogDanhSachHangHoaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        isCaseSpecial: true
      },
    });
    modal.afterClose.subscribe(async (data) => {
      if (data) {
        this.bindingDataHangHoa(data);
      }
    });
  }

  async bindingDataHangHoa(data) {
    if (data.loaiHang == "M" || data.loaiHang == "LT") {
      this.formData.patchValue({
        cloaiVthh: data.ma,
        tenCloaiVthh: data.ten,
        loaiVthh: data.parent.ma,
        tenVthh: data.parent.ten
      })
    }
    if (data.loaiHang == "VT") {
      this.formData.patchValue({
        loaiVthh: data.ma,
        tenVthh: data.ten,
        cloaiVthh: null,
        tenCloaiVthh: null,
      })
    }
  }
}
