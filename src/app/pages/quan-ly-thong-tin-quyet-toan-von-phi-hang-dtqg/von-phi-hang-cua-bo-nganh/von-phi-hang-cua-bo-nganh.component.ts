import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import {MESSAGE} from "../../../constants/message";
import {NgxSpinnerService} from "ngx-spinner";
import {PAGE_SIZE_DEFAULT} from "../../../constants/config";

@Component({
  selector: 'app-von-phi-hang-cua-bo-nganh',
  templateUrl: './von-phi-hang-cua-bo-nganh.component.html',
  styleUrls: ['./von-phi-hang-cua-bo-nganh.component.scss']
})
export class VonPhiHangCuaBoNganhComponent implements OnInit {
  formData: FormGroup;
  dataTable: any[] = [];
  page: number = 1;
  dataTableAll: any[] = [];
  totalRecord: number = 10;
  setOfCheckedId = new Set<number>();
  pageSize: number = PAGE_SIZE_DEFAULT;
  indeterminate = false;
  constructor(
    public globals: Globals,
    private spinner: NgxSpinnerService,
    public userService: UserService
  ) { }
  tabSelected: number = 0;
  ngOnInit() {

  }

  clearFilter() {
    this.formData.reset();
    this.search();
  }

  async search() {
    this.spinner.show();

    let body = this.formData.value;
    if (body.ngayKy != null) {
      body.ngayKyTu = body.ngayKy[0];
      body.ngayKyDen = body.ngayKy[1];
    }
    body.namKh = body.namKeHoach;
    body.soDx = body.soDeXuat;
    body.loaiHh = body.loaiHangHoa;
    body.paggingReq = {
      limit: this.pageSize,
      page: this.page - 1,

    }
    this.spinner.hide();
  }
}
