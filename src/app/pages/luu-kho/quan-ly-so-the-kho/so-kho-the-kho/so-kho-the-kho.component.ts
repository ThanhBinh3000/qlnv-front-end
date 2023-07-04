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
import {chain, cloneDeep} from "lodash";
import {DANH_MUC_LEVEL} from "../../luu-kho.constant";

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
      idThuKho: [null]
    })
    this.filterTable = {};
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.searchPage();
      this.loadDsHangHoa();
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
        tenHH: null
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

  openModelCreate(id: number, isView: boolean) {
    const modalCreate = this.modal.create({
      nzTitle: !id && isView == false ? 'Tạo sổ kho/thẻ kho' : id > 0 && isView == true ? 'Thông tin sổ kho/thẻ kho' : 'Chỉnh sửa sổ kho/thẻ kho',
      nzContent: ThemSoKhoTheKhoComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1000px',
      nzStyle: {top: '100px'},
      nzFooter: null,
      nzComponentParams: {
        idInput: id,
        isView: isView
      },
    });
    modalCreate.afterClose.subscribe((data) => {
      if (data) {

      }
    });
  }

  async searchPage() {
    await this.spinner.show();
    try {
      let body = this.formData.value
      body.idThuKho = this.userInfo.POSITION == 'CBTHUKHO' ? this.userInfo.ID : null;
      body.maDvi = this.userInfo.POSITION == 'CBTHUKHO' ? null : this.userInfo.MA_DVI;
      let res = await this.quanLySoKhoTheKhoService.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.dataTable = data;
        this.buildDataToTree();
        console.log(this.dataTable,222)
      } else {
        this.dataTable = [];
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  buildDataToTree() {
    this.dataTable = chain(this.dataTable).groupBy("tenDiemKho").map((value, key) => (
      {
        tenDiemKho: key,
        children: value
      }))
      .value();
    this.dataTable.forEach(diemKho => {
      diemKho.children = chain(diemKho.children).groupBy("tenNhaKho").map((value, key) => (
        {
          tenNhaKho: key,
          children: value
        }))
        .value();
      diemKho.children.forEach(nhaKho => {
        if (nhaKho.children && nhaKho.children.length > 0) {
          let nganKho1 = nhaKho.children.forEach(item => item.maLoKho != null)
          let nganKho2 = nhaKho.children.forEach(item => item.maLoKho == null)
          if (nganKho1 && nganKho1.length > 0) {
            nganKho1 = chain(nganKho1).groupBy("tenNganKho").map((value, key) => (
            {
              tenNganKho: key,
              children: value
            }))
            .value();
          }
          nhaKho.children = [...nganKho1 && nganKho1.length > 0 ? nganKho1 : [], nganKho2 && nganKho2.length > 0 ? nganKho2 : []].flat();
        }
      });
    })
  }

  async clearForm() {
    this.formData.reset();
    await this.searchPage();
  }

}
