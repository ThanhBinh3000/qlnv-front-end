import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base3Component } from 'src/app/components/base3/base3.component';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { StorageService } from 'src/app/services/storage.service';
import {TrinhThamDinhScService} from "../../../../services/sua-chua/trinhThamDinhSc.service";
import * as moment from "moment/moment";
import { cloneDeep, chain } from 'lodash';
import {STATUS} from "../../../../constants/status";
import {QuyetDinhScService} from "../../../../services/sua-chua/quyetDinhSc.service";

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
      id : [],
      trangThai: ['00'] ,
      tenTrangThai: ['Dự thảo'],
      soQd : [''],
      soTtr: [],
      idTtr : [],
      ngayKy: [''],
      ngayDuyetLdtc: [''],
      thoiHanXuat: [''],
      thoiHanNhap: [''],
      trichYeu: [''],
    })
  }

  ngOnInit(): void {
    console.log(this.route);
  }

  openDialogDanhSach() {
    if(this.disabled()){
      return;
    }
    this.spinner.show();
    this.trinhThamDinhScService.getDanhSachQuyetDinh({}).then((res)=>{
      this.spinner.hide();
      if(res.data){
        res.data?.forEach(item => {
          item.ngayDuyetLdtcFr = moment(item.ngayDuyetLdtc).format('DD/MM/yyyy');
          item.thoiHanNhapFr = moment(item.thoiHanNhap).format('DD/MM/yyyy');;
          item.thoiHanXuatFr = moment(item.thoiHanXuat).format('DD/MM/yyyy');
        })
        const modalQD = this.modal.create({
          nzTitle: 'Danh sách sửa chữa',
          nzContent: DialogTableSelectionComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: '900px',
          nzFooter: null,
          nzComponentParams: {
            dataTable: res.data,
            dataHeader: ['Mã tờ trình','Trích yếu','Ngày duyệt','Thời hạn xuất','Thời hạn nhập'],
            dataColumn: ['soTtr', 'trichYeu','ngayDuyetLdtcFr','thoiHanXuatFr','thoiHanNhapFr']
          },
        });
        modalQD.afterClose.subscribe(async (data) => {
          if (data) {
            this.spinner.show();
            console.log(data)
            this.trinhThamDinhScService.getDetail(data.id).then((res)=>{
              this.spinner.hide();
              if(res.data){
                const dataTh = res.data
                this.formData.patchValue({
                  soTtr : data.soTtr,
                  idTtr : data.id,
                  ngayDuyetLdtc : data.ngayDuyetLdtc,
                  thoiHanNhap : data.thoiHanNhap,
                  thoiHanXuat : data.thoiHanXuat,
                })
                this.dataTable = chain(dataTh.children).groupBy('scDanhSachHdr.tenChiCuc').map((value, key) => ({
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

  disabled(){
    return this.formData.value.trangThai != STATUS.DU_THAO;
  }

}
