import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogQuyetDinhGiaoChiTieuComponent } from 'src/app/components/dialog/dialog-quyet-dinh-giao-chi-tieu/dialog-quyet-dinh-giao-chi-tieu.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { LEVEL } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-thong-tin-de-xuat-dieu-chinh',
  templateUrl: './thong-tin-de-xuat-dieu-chinh.component.html',
  styleUrls: ['./thong-tin-de-xuat-dieu-chinh.component.scss']
})
export class ThongTinDeXuatDieuChinhComponent implements OnInit {
  id: number = 0;
  deXuatDieuChinh: any = {};
  tabSelected: string = 'luongThuc';

  formData: FormGroup;

  lastBreadcrumb: string;
  trangThai: string = 'Dự thảo';

  qdTCDT: string = MESSAGE.QD_TCDT;
  userInfo: UserLogin;

  listNam: any[] = [];
  yearNow: number = 0;

  dataGiaoChiTieu: any[] = [];
  selectedCanCu: any = {};
  taiLieuDinhKemList: any[] = [];

  constructor(
    private router: Router,
    private routerActive: ActivatedRoute,
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private helperService: HelperService,
    public globals: Globals,
    private userService: UserService,
    private fb: FormBuilder,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      if (this.userInfo) {
        this.qdTCDT = this.userInfo.MA_QD;
      }
      if (this.router.url.includes(LEVEL.TONG_CUC)) {
        this.lastBreadcrumb = LEVEL.TONG_CUC_SHOW;
      } else if (this.router.url.includes(LEVEL.CHI_CUC)) {
        this.lastBreadcrumb = LEVEL.CHI_CUC_SHOW;
      } else if (this.router.url.includes(LEVEL.CUC)) {
        this.lastBreadcrumb = LEVEL.CUC_SHOW;
      }
      this.yearNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      }
      this.id = +this.routerActive.snapshot.paramMap.get('id');
      await this.loadDataChiTiet(this.id);
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadDataChiTiet(id: number) {
    this.formData = this.fb.group({
      canCu: [null, [Validators.required]],
      soQD: [null],
      ngayKy: [null],
      ngayHieuLuc: [null],
      namKeHoach: [this.yearNow],
      trichYeu: [null],
      nguyenNhan: [null],
      noiDung: [null],
    });
    if (id > 0) {

    }
  }

  openDialogQuyetDinhGiaoChiTieu() {
    if (this.id == 0) {
      const modalQD = this.modal.create({
        nzTitle: 'Thông tin QĐ giao chỉ tiêu kế hoạch',
        nzContent: DialogQuyetDinhGiaoChiTieuComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {},
      });
      modalQD.afterClose.subscribe((data) => {
        if (data) {
          this.spinner.show();
          this.formData.controls['canCu'].setValue(data.soQuyetDinh);
          this.selectedCanCu = data;
          this.dataGiaoChiTieu = [];
          let item = {
            id: data.id,
            text: data.soQuyetDinh,
          };
          this.dataGiaoChiTieu.push(item);

          this.spinner.hide();
        }
      });
    }
  }

  deleteDataMultipleTag(data: any) {
    this.dataGiaoChiTieu = this.dataGiaoChiTieu.filter((x) => x.id != data.id);
  }

  deleteTaiLieuDinhKemTag(data: any) {
    this.taiLieuDinhKemList = this.taiLieuDinhKemList.filter(
      (x) => x.id !== data.id,
    );
  }

  openFile(event) {
    let item = {
      id: new Date().getTime(),
      text: event,
    };
    if (!this.taiLieuDinhKemList.find((x) => x.text === item.text)) {
      this.taiLieuDinhKemList.push(item);
    }
  }

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.formData.controls['ngayHieuLuc'].value) {
      return false;
    }
    return (
      startValue.getTime() >
      this.formData.controls['ngayHieuLuc'].value.getTime()
    );
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.formData.controls['ngayKy'].value) {
      return false;
    }
    return (
      endValue.getTime() <= this.formData.controls['ngayKy'].value.getTime()
    );
  };

  selectNam() {
    this.yearNow = this.formData.get('namKeHoach').value;
  }

  back() {
    this.router.navigate(['/kehoach/de-xuat-dieu-chinh-cap-cuc',]);
  }

  save(isAdd: boolean) {

  }

  guiDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn gửi duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          await this.save(true);
          let body = {
            id: this.id,
            lyDoTuChoi: null,
            trangThai: '04',
          };

          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  pheDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn phê duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            lyDoTuChoi: null,
            trangThai: '01',
          };

          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  banHanh() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn ban hành?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            lyDoTuChoi: null,
            trangThai: '02',
          };

          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  tuChoi() {
    const modalTuChoi = this.modal.create({
      nzTitle: 'Từ chối',
      nzContent: DialogTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            lyDoTuChoi: text,
            trangThai: '03',
          };

          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }

  huyBo() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn hủy bỏ các thao tác đang làm?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.back();
      },
    });
  }

  thongTinTrangThai(trangThai: string): string {
    if (trangThai === '00' || trangThai === '01' || trangThai === '04' || trangThai === '03') {
      return 'du-thao-va-lanh-dao-duyet';
    } else if (trangThai === '02') {
      return 'da-ban-hanh';
    }
  }

  import() {

  }

  export() {

  }

  editRowLT(id) {

  }

  deleteRowLT(data) {

  }

  editRowMuoi(id) {

  }

  deleteRowMuoi(data) {

  }

  editRowVatTu(id) {

  }

  deleteRowVatTu(data) {

  }
}
