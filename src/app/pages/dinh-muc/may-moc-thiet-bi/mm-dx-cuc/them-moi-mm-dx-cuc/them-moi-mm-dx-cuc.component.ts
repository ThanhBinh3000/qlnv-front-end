import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {QlDinhMucPhiService} from "../../../../../services/qlnv-kho/QlDinhMucPhi.service";
import {Validators} from "@angular/forms";
import {Base2Component} from "../../../../../components/base2/base2.component";

@Component({
  selector: 'app-them-moi-mm-dx-cuc',
  templateUrl: './them-moi-mm-dx-cuc.component.html',
  styleUrls: ['./them-moi-mm-dx-cuc.component.scss']
})
export class ThemMoiMmDxCucComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  isTongHop: boolean = false;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    qlDinhMucPhiService: QlDinhMucPhiService
  ) {
    super(httpClient, storageService, notification, spinner, modal, qlDinhMucPhiService)
    super.ngOnInit()
    this.formData = this.fb.group({
      id : [null],
      maDvi : [null],
      namKeHoach : [null, Validators.required],
      soCongVan : [null, Validators.required],
      soCongVanCc : [null, Validators.required],
      ngayDx : [null, Validators.required],
      trichYeu : [null, Validators.required],
      ngayKy : [null, Validators.required],
      trangThai : ['00'],
      tenTrangThai : ['Dự thảo'],
      fileDinhKems : [null],
    });
  }

  ngOnInit(): void {
  }

  async tongHop() {
    this.isTongHop = true
  }
}
