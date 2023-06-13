import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base3Component } from 'src/app/components/base3/base3.component';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { MmHienTrangMmService } from 'src/app/services/mm-hien-trang-mm.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-them-moi-qd',
  templateUrl: './them-moi-qd.component.html',
  styleUrls: ['./them-moi-qd.component.scss']
})
export class ThemMoiQdComponent extends Base3Component implements OnInit {

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private hienTrangSv: MmHienTrangMmService,
    private danhMucSv: DanhMucService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, hienTrangSv);
    this.defaultURL = 'sua-chua/quyet-dinh'
    this.getId();
    this.formData = this.fb.group({
      trangThai: '00',
      tenTrangThai: 'Dự thảo',
      soToTrinh: '',
      ngayTaoHs: '',
      ngayDuyetLdc: '',
      thoiHanXuat: '',
      thoiHanNhap: '',
      soQdSc: '',
      trichYeu: '',

    })
  }

  ngOnInit(): void {
    console.log(this.route);
  }

  openDialogDanhSach() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách sửa chữa',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        // dataTable: this.listDanhSachTongHop,
        dataHeader: ['Mã sửa chữa', 'Tên'],
        dataColumn: ['id', 'noiDungThop']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      // if (data) {
      //   await this.selectMaTongHop(data.id);
      // }
    });
  }

}
