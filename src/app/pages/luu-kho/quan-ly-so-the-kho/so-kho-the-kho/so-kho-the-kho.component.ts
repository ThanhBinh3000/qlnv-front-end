import {Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {MESSAGE} from 'src/app/constants/message';
import {QuanLySoKhoTheKhoService} from 'src/app/services/quan-ly-so-kho-the-kho.service';
import {NzModalService} from 'ng-zorro-antd/modal';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {STATUS} from "../../../../constants/status";
import {Base2Component} from "../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import {Router} from "@angular/router";
import {ThemSoKhoTheKhoComponent} from "./them-so-kho-the-kho/them-so-kho-the-kho.component";

@Component({
  selector: 'app-so-kho-the-kho',
  templateUrl: './so-kho-the-kho.component.html',
  styleUrls: ['./so-kho-the-kho.component.scss'],
})
export class SoKhoTheKhoComponent extends Base2Component implements OnInit {
  isView: boolean;
  formData: FormGroup;
  STATUS = STATUS;
  listLoaiHangHoa: any[] = [];
  listChungLoaiHangHoa: any[] = [];
  dsDonVi: any = [];

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    private router: Router,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quanLySoKhoTheKhoService: QuanLySoKhoTheKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quanLySoKhoTheKhoService);
    super.ngOnInit()
    this.formData = this.fb.group({
      nam: [null],
      maDvi: [null],
      tenDvi: [null],
      loaiHang: [null],
      maChungLoaiHang: [null],
      ngayTaoTu: [null],
      ngayTaoDen: [null],
    })
    this.filterTable = {};
  }
  async ngOnInit() {
    this.spinner.show();
    try {
      this.loadDsHangHoa();
      // await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadDsHangHoa() {
    let res = await this.danhMucService.getAllVthhByCap("2");
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listLoaiHangHoa = res.data
      }
    }
  }

  async onChangeLoaiVthh(event) {
    if (event) {
      this.formData.patchValue({
        tenHH : null
      })
      let body = {
        "str": event
      };
      let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha(body);
      this.listChungLoaiHangHoa = [];
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.listChungLoaiHangHoa = res.data;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  openModelCreate(id : number, isView : boolean) {
    const modalCreate = this.modal.create({
      nzTitle: !id && isView == false ? 'Tạo sổ kho/thẻ kho' : id > 0 && isView == true ? 'Thông tin sổ kho/thẻ kho' : 'Chỉnh sửa sổ kho/thẻ kho',
      nzContent: ThemSoKhoTheKhoComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1000px',
      nzStyle: { top: '100px' },
      nzFooter: null,
      nzComponentParams: {
        idInput : id,
        isView : isView
      },
    });
    modalCreate.afterClose.subscribe((data) => {
      if (data) {

      }
    });
  }
}
