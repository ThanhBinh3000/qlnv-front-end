import {
  Component , OnInit,
} from '@angular/core';
import {Base2Component} from "../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {KtKhXdHangNamService} from "../../../services/kt-kh-xd-hang-nam.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {NgxSpinnerService} from "ngx-spinner";
import {DonviService} from "../../../services/donvi.service";
import {DANH_MUC_LEVEL} from "../../luu-kho/luu-kho.constant";
import {MESSAGE} from "../../../constants/message";
import {DanhMucService} from "../../../services/danhmuc.service";
import {
  DialogThemDanhMucDungChungComponent
} from "../../../components/dialog/dialog-them-danh-muc-dung-chung/dialog-them-danh-muc-dung-chung.component";
import {ThemMoiDmDviLqComponent} from "./them-moi-dm-dvi-lq/them-moi-dm-dvi-lq.component";
@Component({
  selector: 'app-danh-muc-dvi-lq',
  templateUrl: './danh-muc-dvi-lq.component.html',
  styleUrls: ['./danh-muc-dvi-lq.component.scss']
})
export class DanhMucDviLqComponent extends Base2Component implements OnInit {

  listTrangThai = [{"ma": "01", "giaTri": "Hoạt động"}, {"ma": "00", "giaTri": "Không hoạt động"}];
  listLoaiDvi : any[] = [];

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private dexuatService : KtKhXdHangNamService,
    private dmService : DanhMucService
  ) {
    super(httpClient, storageService, notification, spinner, modal, dexuatService);
    super.ngOnInit()
    this.formData = this.fb.group({
      loaiDvi : [null],
      mst : [null],
      ten : [null],
      dienThoai : [null],
      diaChi : [null],
      trangThai : [null]
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      await Promise.all([
        this.search(),
        this.loadDsLoaiDvi()
      ]);
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadDsLoaiDvi() {
    let res = await this.dmService.danhMucChungGetAll("LOAI_DON_VI")
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiDvi = res.data;
    }
  }

  initForm() {
    this.formData.patchValue({
      role : this.userService.isCuc() ? 'CUC' : 'TC'
    })
  }

  async themMoi() {
    let modalTuChoi = this.modal.create({
      nzContent: ThemMoiDmDviLqComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1000px',
      nzStyle: { top : '100px'},
      nzFooter: null,
      nzClassName: 'themdmdungchung',
      nzComponentParams: {

      },
    });
    modalTuChoi.afterClose.subscribe((data) => {
      this.search();
    })
  }
}
