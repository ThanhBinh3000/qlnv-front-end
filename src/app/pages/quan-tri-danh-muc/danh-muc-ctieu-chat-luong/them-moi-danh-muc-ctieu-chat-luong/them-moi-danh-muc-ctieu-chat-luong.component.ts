import {Component, Input, OnInit} from '@angular/core';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {Base2Component} from "../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import {DanhMucService} from "../../../../services/danhmuc.service";
import {Validators} from "@angular/forms";
import {MESSAGE} from "../../../../constants/message";
import {DanhMucDviLqService} from "../../../../services/quantri-danhmuc/danh-muc-dvi-lq.service";
import {DanhMucCtieuCluongService} from "../../../../services/quantri-danhmuc/danh-muc-ctieu-cluong";

@Component({
  selector: 'app-them-moi-danh-muc-ctieu-chat-luong',
  templateUrl: './them-moi-danh-muc-ctieu-chat-luong.component.html',
  styleUrls: ['./them-moi-danh-muc-ctieu-chat-luong.component.scss']
})
export class ThemMoiDanhMucCtieuChatLuongComponent extends Base2Component implements OnInit {
  @Input() idInput : number;
  listLoaiVthh : any[] = [];
  listCloaiVthh : any[] = [];
  listCloaiSelected : any[] = [];
  isView: boolean
  listTrangThai = [{"ma": "01", "giaTri": "Hoạt động"}, {"ma": "00", "giaTri": "Không hoạt động"}];
  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucCtieuCluongService : DanhMucCtieuCluongService,
    private danhMucService : DanhMucService,
    private _modalRef : NzModalRef
  ) {
    super(httpClient, storageService, notification, spinner, modal, danhMucCtieuCluongService);
    super.ngOnInit()
    this.formData = this.fb.group({
      id   : [null],
      maChiTieu : [null, Validators.required],
      tenChiTieu : [null, Validators.required],
      loaiVthh : [null , Validators.required],
      cloaiVthh : [null],
      thuTu : [null ,Validators.required],
      moTa : [null ,Validators.required],
      trangThai : [null ,Validators.required]
    });
  }

  async loadDsLoaiVthh() {
    this.listLoaiVthh = [];
    let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiVthh = res.data;
      this.listLoaiVthh = res.data?.filter((x) => x.ma.length == 4);
    }
  }

  async selectLoaiHangHoa(event: any) {
    if (event) {
      this.listCloaiSelected = [];
      this.listCloaiVthh = [];
      let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha({ str: event });
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.listCloaiVthh = res.data;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  async ngOnInit() {
    this.loadDsLoaiVthh();
    if (this.idInput > 0) {
      this.getDetail(this.idInput)
    }
  }

  async save() {
    this.helperService.markFormGroupTouched(this.formData)
    if (this.formData.invalid) {
      return;
    }
    let body = this.formData.value;
    body.maDvi = this.userInfo.MA_DVI;
    if (this.listCloaiSelected.length > 0) {
      body.cloaiVthh = this.listCloaiSelected.toString();
    } else {
      body.cloaiVthh = this.listCloaiVthh.map(item => item.ma).toString();
    }
    let res = await this.createUpdate(this.formData.value)
    if (res) {
      this._modalRef.close(res);
    }
  }

  handleCancel() {
    this._modalRef.destroy();
  }

  async getDetail(id) {
    this.spinner.show();
    try {
      let res = await this.danhMucCtieuCluongService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          if (data.cloaiVthh) {
            this.listCloaiSelected = data.cloaiVthh.split(',')
          }
        }
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e);
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }
}
