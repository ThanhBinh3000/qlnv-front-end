import { Component, OnInit } from '@angular/core';
import { Base2Component } from "../../../components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import { MmHienTrangMmService } from "../../../services/mm-hien-trang-mm.service";
import { DanhMucService } from "../../../services/danhmuc.service";
import { FileDinhKem } from "../../../models/FileDinhKem";
import { HienTrangMayMoc } from "../../../constants/status";
import { DonviService } from "../../../services/donvi.service";
import { saveAs } from "file-saver";
import { MESSAGE } from "../../../constants/message";
import { DANH_MUC_LEVEL } from "../../../pages/luu-kho/luu-kho.constant";
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dialog-kt-giao-kho',
  templateUrl: './dialog-kt-giao-kho.component.html',
  styleUrls: ['./dialog-kt-giao-kho.component.scss']
})
export class DialogKtGiaoKhoComponent extends Base2Component implements OnInit {

  data: any;
  dataTree: any[] = [];
  dsUser: any[];

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hienTrangSv: MmHienTrangMmService,
    private danhMucSv: DanhMucService,
    private _modalRef: NzModalRef,
    private dviService: DonviService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, hienTrangSv);
    this.formData = this.fb.group({
      maDvi: [null],
      tenDvi: [null],
      namKeHoach: [null],
      tenCcdc: [null],
      maCcdc: [null],
      donViTinh: [null],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.data = this.dataTree[0];
      this.dataTree = this.data.children;
      await this.loadUserThuKho()
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadUserThuKho() {
    let maDvi = this.data.maDvi;
    let body = {
      position: "CBTHUKHO",
      maDvi: maDvi.substr(0, 8),
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0
      }
    }
    await this.userService.search(body).then((res) => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.dsUser = res.data?.content
      }
    })
  }


  onCancel() {
    this._modalRef.close();
  }

  onExpandChange(item: any, checked: boolean): void {
    item.expandSet = checked
  }

  handleCancel() {
    this._modalRef.close();
  }

  handleOk() {
    console.log(this.dataTree);
    let body = {
      saveFromMlk: true,
      dsDonVi: this.dataTree
    }
    this.dviService.updateThuKho(body).then((res) => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS)
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      console.log(res);
    })
    this._modalRef.close();
  }

  onChangeThuKho(item, $event) {
    item.idThuKho = +$event;
    if (item.capDvi == "6") {
      item.children?.forEach((i) => {
        i.idThuKho = +$event
      });
    }
    if (item.capDvi == "7") {
      let dataParent = null;
      this.dataTree.forEach(nganKho => {
        nganKho.children?.includes(item) ? dataParent = nganKho : '';
      })

      if (dataParent) {
        // Check tất cả các con thuộc parent => Nếu có idThuKho con khác nhau thì set cha về null
        const hasDifferentIdThuKho = dataParent.children.some((item, index, array) => {
          return array.findIndex(obj => obj.idThuKho !== item.idThuKho) !== -1;
        });
        console.log(hasDifferentIdThuKho);
        if (hasDifferentIdThuKho) {
          dataParent.idThuKho = 0;
        }
      }
    }
  }

}
