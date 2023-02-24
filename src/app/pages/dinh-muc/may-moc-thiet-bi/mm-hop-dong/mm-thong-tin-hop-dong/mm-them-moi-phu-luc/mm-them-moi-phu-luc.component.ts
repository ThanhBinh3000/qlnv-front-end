import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {MmDxChiCucService} from "../../../../../../services/mm-dx-chi-cuc.service";
import {QuyetDinhMuaSamService} from "../../../../../../services/quyet-dinh-mua-sam.service";
import dayjs from "dayjs";
import {Validators} from "@angular/forms";

@Component({
  selector: 'app-mm-them-moi-phu-luc',
  templateUrl: './mm-them-moi-phu-luc.component.html',
  styleUrls: ['./mm-them-moi-phu-luc.component.scss']
})
export class MmThemMoiPhuLucComponent extends Base2Component implements OnInit {
  @Input() id :number
  @Input() isView : boolean
  @Output()
  goBackEvent = new EventEmitter<any>();

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private dxChiCucService: MmDxChiCucService,
    private qdMuaSamService: QuyetDinhMuaSamService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, dxChiCucService)
    super.ngOnInit()
    this.formData = this.fb.group({
      id : [null],
      maDvi : [null],
      soPl : [null, Validators.required],
      soHd : [null],
      tenHd : [null],
      ngayKy : [null, Validators.required],
      veViec : [null],
      trangThai : ['00'],
      tenTrangThai : ['Dự thảo'],
      fileDinhKems : [null],
    });
  }

  ngOnInit(): void {
  }

  goBack() {
    this.goBackEvent.emit();
  }


}
