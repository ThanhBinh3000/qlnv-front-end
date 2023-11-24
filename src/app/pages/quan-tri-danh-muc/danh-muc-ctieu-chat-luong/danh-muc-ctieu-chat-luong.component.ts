import {Component, OnInit,} from '@angular/core';
import {Base2Component} from "../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NzModalService} from "ng-zorro-antd/modal";
import {NgxSpinnerService} from "ngx-spinner";
import {MESSAGE} from "../../../constants/message";
import {DanhMucService} from "../../../services/danhmuc.service";
import {DanhMucDviLqService} from "../../../services/quantri-danhmuc/danh-muc-dvi-lq.service";
import {Router} from "@angular/router";
import {
  ThemMoiDanhMucCtieuChatLuongComponent
} from "./them-moi-danh-muc-ctieu-chat-luong/them-moi-danh-muc-ctieu-chat-luong.component";
import {DanhMucCtieuCluongService} from "../../../services/quantri-danhmuc/danh-muc-ctieu-cluong";

@Component({
  selector: 'app-danh-muc-ctieu-chat-luong',
  templateUrl: './danh-muc-ctieu-chat-luong.component.html',
  styleUrls: ['./danh-muc-ctieu-chat-luong.component.scss']
})
export class DanhMucCtieuChatLuongComponent extends Base2Component implements OnInit {

  listTrangThai = [{"ma": "01", "giaTri": "Hoạt động"}, {"ma": "00", "giaTri": "Không hoạt động"}];
  listLoaiVthh : any[] = [];

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucCtieuCluongService : DanhMucCtieuCluongService,
    private danhMucService : DanhMucService,
    private router : Router
  ) {
    super(httpClient, storageService, notification, spinner, modal, danhMucCtieuCluongService);
    super.ngOnInit()
    this.formData = this.fb.group({
      tenChiTieu : [null],
      maChiTieu : [null],
      loaiVthh : [null],
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
        this.loadDsLoaiVthh()
      ]);
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadDsLoaiVthh() {
    this.listLoaiVthh = [];
    let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiVthh = res.data;
      this.listLoaiVthh = res.data?.filter((x) => x.ma.length == 4);
    }
  }

  async themMoi(id: number, isView: boolean) {
    let modalTuChoi = this.modal.create({
      nzContent: ThemMoiDanhMucCtieuChatLuongComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzStyle: { top : '120px'},
      nzFooter: null,
      nzComponentParams: {
        idInput : id,
        isView : isView
      },
    });
    modalTuChoi.afterClose.subscribe((data) => {
      if (data) {
        this.search();
      }
    })
  }

  delete(id :number) {
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
          this.danhMucCtieuCluongService.delete({ids: id}).then(async () => {
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
