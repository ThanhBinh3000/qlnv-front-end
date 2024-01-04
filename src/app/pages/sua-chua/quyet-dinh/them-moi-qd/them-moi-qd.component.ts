import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base3Component } from 'src/app/components/base3/base3.component';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { StorageService } from 'src/app/services/storage.service';
import { TrinhThamDinhScService } from "../../../../services/sua-chua/trinhThamDinhSc.service";
import * as moment from "moment/moment";
import { cloneDeep, chain } from 'lodash';
import { STATUS } from "../../../../constants/status";
import { QuyetDinhScService } from "../../../../services/sua-chua/quyetDinhSc.service";
import { Validators } from "@angular/forms";

@Component({
  selector: 'app-them-moi-qd',
  templateUrl: './them-moi-qd.component.html',
  styleUrls: ['./them-moi-qd.component.scss']
})
export class ThemMoiQdComponent extends Base3Component implements OnInit {

  fileCanCu: any[] = []

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private quyetDinhScService: QuyetDinhScService,
    private trinhThamDinhScService: TrinhThamDinhScService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, quyetDinhScService);
    this.defaultURL = 'sua-chua/quyet-dinh'
    this.getId();
    this.formData = this.fb.group({
      id: [],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      soQd: [null, [Validators.required]],
      soTtr: [null, [Validators.required]],
      idTtr: [null, [Validators.required]],
      ngayKy: [''],
      ngayDuyetLdtc: [null, [Validators.required]],
      thoiHanXuat: [null, [Validators.required]],
      thoiHanNhap: [null, [Validators.required]],
      trichYeu: [null, [Validators.required]],
    })
  }

  async ngOnInit() {
    this.spinner.show();
    await Promise.all([
      await this.getId(),
      await this.initForm()
    ])
    this.spinner.hide();
  }

  async initForm() {
    if (this.id) {
      await this.detail(this.id).then((res) => {
        if (res) {
          this.fileCanCu = res.fileCanCu;
          let soQd = res.soQd.split('/')[0];
          this.formData.patchValue({
            soQd: soQd
          })
          this.dataTable = chain(res.scTrinhThamDinhHdr.children).groupBy('scDanhSachHdr.tenChiCuc').map((value, key) => ({
            expandSet: true,
            tenDonVi: key,
            children: value,
          })
          ).value()
        }
      })
    }
  }

  openDialogDanhSach() {
    if (this.disabled()) {
      return;
    }
    this.spinner.show();
    this.trinhThamDinhScService.getDanhSachQuyetDinh({}).then((res) => {
      this.spinner.hide();
      if (res.data) {
        res.data?.forEach(item => {
          item.ngayNhap = item.thoiHanNhap
          item.ngayXuat = item.thoiHanXuat
        })
        const modalQD = this.modal.create({
          nzTitle: 'Danh sách số tờ trình',
          nzContent: DialogTableSelectionComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: '900px',
          nzFooter: null,
          nzComponentParams: {
            dataTable: res.data,
            dataHeader: ['Mã tờ trình', 'Trích yếu', 'Ngày duyệt', 'Thời hạn xuất', 'Thời hạn nhập'],
            dataColumn: ['soTtrTcuc', 'trichYeu', 'ngayDuyetLdtc', 'ngayXuat', 'ngayNhap']
          },
        });
        modalQD.afterClose.subscribe(async (data) => {
          if (data) {
            this.spinner.show();
            console.log(data)
            this.trinhThamDinhScService.getDetail(data.id).then((res) => {
              this.spinner.hide();
              if (res.data) {
                const dataTh = res.data
                this.formData.patchValue({
                  soTtr: data.soTtrTcuc,
                  idTtr: data.id,
                  ngayDuyetLdtc: data.ngayDuyetLdtc,
                  thoiHanNhap: data.thoiHanNhap,
                  thoiHanXuat: data.thoiHanXuat,
                })
                this.dataTable = chain(dataTh.children).groupBy('scDanhSachHdr.tenChiCuc').map((value, key) => ({
                  expandSet: true,
                  tenDonVi: key,
                  children: value,
                })
                ).value()
              }
            });
          }
        });
      }
    })
  }

  showSave() {
    let trangThai = this.formData.value.trangThai;
    return trangThai == STATUS.DU_THAO;
  }

  save(isGuiDuyet?) {
    this.spinner.show();
    let body = this.formData.value;
    body.fileDinhKemReq = this.fileDinhKem;
    body.fileCanCuReq = this.fileCanCu;
    if (this.formData.value.soQd) {
      body.soQd = this.formData.value.soQd + '/QĐ-TCDT'
    }
    this.createUpdate(body).then((res) => {
      if (res) {
        if (isGuiDuyet) {
          this.id = res.id;
          this.pheDuyet();
        } else {
          this.redirectDefault();
        }
      }
    })
  }

  pheDuyet() {
    this.approve(this.id, STATUS.BAN_HANH, "Bạn có muốn ban hành quyết định");
  }

  disabled() {
    return this.formData.value.trangThai != STATUS.DU_THAO;
  }

}
