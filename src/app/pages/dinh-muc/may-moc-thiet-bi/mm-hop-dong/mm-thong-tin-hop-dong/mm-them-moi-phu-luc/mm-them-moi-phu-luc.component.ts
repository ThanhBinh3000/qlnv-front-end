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
import {MESSAGE} from "../../../../../../constants/message";
import {HopDongMmTbcdService} from "../../../../../../services/hop-dong-mm-tbcd.service";

@Component({
  selector: 'app-mm-them-moi-phu-luc',
  templateUrl: './mm-them-moi-phu-luc.component.html',
  styleUrls: ['./mm-them-moi-phu-luc.component.scss']
})
export class MmThemMoiPhuLucComponent extends Base2Component implements OnInit {
  @Input() id :number
  @Input() isView : boolean
  @Input() dataHdr : any
  @Input() tablePl : any
  @Output()
  goBackEvent = new EventEmitter<any>();

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hopDongService: HopDongMmTbcdService,
    private qdMuaSamService: QuyetDinhMuaSamService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, hopDongService)
    super.ngOnInit()
    this.formData = this.fb.group({
      id : [null],
      maDvi : [null],
      capDvi : [null],
      soPhuLuc : [null, Validators.required],
      soHopDong : [null],
      tenHopDong : [null],
      ngayKy : [null, Validators.required],
      veViec : [null],
      noiDungDcKhac : [null],
      ghiChu : [null],
      ngayHlTruoc : [null],
      ngayHlSau : [null],
      soNgayHlTruoc : [null],
      soNgayHlSau : [null],
      listFileDinhKems : [null],
      trangThai : ['00'],
      tenTrangThai : ['Dự thảo'],
      fileDinhKems : [null],
      hdHdrId : [null],
      loai : ['01']
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      if (this.id > 0) {
        await this.detail(this.id);
      } else {
        this.initForm()
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  goBack() {
    this.goBackEvent.emit();
  }

  initForm() {
    if (this.dataHdr) {
      this.formData.patchValue({
        tenHopDong : this.dataHdr.tenHopDong,
        soHopDong : this.dataHdr.soHopDong,
        ngayHlTruoc : this.dataHdr.ngayKy,
        soNgayHlTruoc : this.dataHdr.thoiGianThucHien
      })
    }
  }

  async detail(id) {
    this.spinner.show();
    try {
      let res = await this.hopDongService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.fileDinhKem = data.listFileDinhKems;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        this.spinner.hide();
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e);
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }


  async save() {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      this.spinner.hide();
      return;
    }
    if (this.fileDinhKem && this.fileDinhKem.length > 0) {
      this.formData.value.fileDinhKems = this.fileDinhKem;
    }
    this.formData.value.maDvi = this.userInfo.MA_DVI
    this.formData.value.capDvi = this.userInfo.CAP_DVI
    this.formData.value.hdHdrId = this.dataHdr.id
    let body = this.formData.value
    let data = await this.createUpdate(body);
    if (data) {
      this.goBack()
    }
  }



}
