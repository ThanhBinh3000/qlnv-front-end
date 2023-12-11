import {
  Component , OnInit,
} from '@angular/core';
import {Base2Component} from "../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NzModalService} from "ng-zorro-antd/modal";
import {NgxSpinnerService} from "ngx-spinner";
import {MESSAGE} from "../../../constants/message";
import {DanhMucService} from "../../../services/danhmuc.service";
import {ThemMoiDmDviLqComponent} from "./them-moi-dm-dvi-lq/them-moi-dm-dvi-lq.component";
import {DanhMucDviLqService} from "../../../services/quantri-danhmuc/danh-muc-dvi-lq.service";
import {Router} from "@angular/router";
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
    private dmDviLqService : DanhMucDviLqService,
    private dmService : DanhMucService,
    private router : Router
  ) {
    super(httpClient, storageService, notification, spinner, modal, dmDviLqService);
    super.ngOnInit()
    this.formData = this.fb.group({
      type : [null],
      mstCccd : [null],
      ten : [null],
      sdt : [null],
      diaChi : [null],
      trangThai : [null]
    });
  }

  async ngOnInit() {
    if (!this.userService.isAccessPermisson('QTDM_DM_DVI_LIENQUAN')) {
      this.router.navigateByUrl('/error/401')
    }
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

  async themMoi(id) {
    let modalTuChoi = this.modal.create({
      nzContent: ThemMoiDmDviLqComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1000px',
      nzStyle: { top : '100px'},
      nzFooter: null,
      nzClassName: 'themdmdungchung',
      nzComponentParams: {
        idInput : id
      },
    });
    modalTuChoi.afterClose.subscribe((data) => {
      if (data) {
        this.search();
      }
    })
  }

  delete( type, item?: any) {
    let dataDelete = [];
    if (type == 'single') {
      dataDelete.push(item.id)
    } else {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          if (item.checked) {
            dataDelete.push(item.id);
          }
        });
      }
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.spinner.show();
        try {
          this.dmDviLqService.delete({idList: dataDelete}).then(async () => {
            await this.search();
            this.spinner.hide();
          });
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }
}
