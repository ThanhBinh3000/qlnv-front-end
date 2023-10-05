import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DialogQuyetDinhGiaoChiTieuComponent } from 'src/app/components/dialog/dialog-quyet-dinh-giao-chi-tieu/dialog-quyet-dinh-giao-chi-tieu.component';
import { DonviService } from 'src/app/services/donvi.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'hop-dong-mua',
  templateUrl: './hop-dong-mua.component.html',
  styleUrls: ['./hop-dong-mua.component.scss'],
})
export class HopDongMuaComponent implements OnInit {
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;
  selectedCanCu: any = {};
  inputDonVi: string = '';
  options: any[] = [];
  optionsDonVi: any[] = [];

  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private modal: NzModalService,
    private notification: NzNotificationService,
    private donViService: DonviService,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.isVisibleChangeTab$.subscribe((value: boolean) => {
        this.visibleTab = value;
      });
      let res = await this.donViService.layTatCaDonVi();
      this.optionsDonVi = [];
      if (res.msg == MESSAGE.SUCCESS) {
        for (let i = 0; i < res.data.length; i++) {
          var item = {
            ...res.data[i],
            labelDonVi: res.data[i].maDvi + ' - ' + res.data[i].tenDvi,
          };
          this.optionsDonVi.push(item);
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  onInput(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.options = [];
    } else {
      this.options = this.optionsDonVi.filter(
        (x) => x.labelDonVi.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }

  openDialogQuyetDinhGiaoChiTieu() {
    const modalQD = this.modal.create({
      nzTitle: 'Thông tin QĐ giao chỉ tiêu kế hoạch',
      nzContent: DialogQuyetDinhGiaoChiTieuComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
      },
    });
    modalQD.afterClose.subscribe((data) => {
      if (data) {
        this.selectedCanCu = data;
      }
    });
  }

  redirectToChiTiet(id: number) {
    this.router.navigate(['/nhap/dau-thau/hop-dong-mua/thong-tin-hop-dong-mua', id]);
  }
}
