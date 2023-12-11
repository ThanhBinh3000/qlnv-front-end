import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "src/app/services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DonviService} from "src/app/services/donvi.service";
import {DanhMucService} from "src/app/services/danhmuc.service";
import {MESSAGE} from "src/app/constants/message";
import {CHUC_NANG} from 'src/app/constants/status';
import {chain, isEmpty} from "lodash";
import {v4 as uuidv4} from "uuid";
import {FormGroup} from "@angular/forms";
import {NumberToRoman} from 'src/app/shared/commonFunction';
import {XuatTieuHuyComponent} from "../xuat-tieu-huy.component";
import {DanhSachTieuHuyService} from "../../../../services/qlnv-hang/xuat-hang/xuat-tieu-huy/DanhSachTieuHuy.service";
import {TongHopTieuHuyService} from "../../../../services/qlnv-hang/xuat-hang/xuat-tieu-huy/TongHopTieuHuy.service";
import {Base3Component} from "../../../../components/base3/base3.component";
import {ActivatedRoute, Router} from "@angular/router";
import {TongHopThanhLyService} from "../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/TongHopThanhLy.service";
import {ThemmoiThComponent} from "../../xuat-thanh-ly/tong-hop-thanh-ly/themmoi-th/themmoi-th.component";
import {ChitietThComponent} from "../../xuat-thanh-ly/tong-hop-thanh-ly/chitiet-th/chitiet-th.component";
import {ThemmoiThThComponent} from "./themmoi-th-th/themmoi-th-th.component";
import {ChitietThThComponent} from "./chitiet-th-th/chitiet-th-th.component";

@Component({
  selector: 'app-tong-hop-tieu-huy',
  templateUrl: './tong-hop-tieu-huy.component.html',
  styleUrls: ['./tong-hop-tieu-huy.component.scss']
})
export class TongHopTieuHuyComponent extends Base3Component implements OnInit {
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private _service: TongHopTieuHuyService,
    private donviService : DonviService
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, _service);
    this.formData = this.fb.group({
      nam: null,
      maDanhSach: null,
      maDviSr: null,
      ngayTaoTu: null,
      ngayTaoDen: null,
    })
  }

  dsDonvi: any[] = [];
  async loadDsDonVi() {
    const dsTong = await this.donviService.layDonViCon();
    if (!isEmpty(dsTong)) {
      this.dsDonvi = dsTong.data.filter(s => s.type === 'DV');
    }
  }

  async ngOnInit() {
    await this.spinner.show();
    await Promise.all([
      this.getId(),
      this.loadDsDonVi(),
      this.search(),
    ])
    this.buildTableView()
    if(this.id){
      this.showDetail(this.id);
    }
    await this.spinner.hide();

  }

  async buildTableView() {
    await this.dataTable.forEach(item => {
      item.expandSet = true;
      item.groupChiCuc = chain(item.children).groupBy('xhThDanhSachHdr.tenChiCuc').map((value, key) => ({
          tenDonVi: key,
          children: value,
        })
      ).value()
    })
  }


  openDialogDs(roles?) {
    if (!this.checkPermission(roles)) {
      return
    }
    const modalGT = this.modal.create({
      nzTitle: 'TỔNG HỢP DANH SÁCH HÀNG CẦN TIÊU HỦY',
      nzContent: ThemmoiThThComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '700px',
      nzFooter: null,
      nzComponentParams: {
      },
    });
    modalGT.afterClose.subscribe((data) => {
      if (data) {
        this.searchData()
      }
    });
  }

  showDetail(idTh) {
    if (idTh) {
      const modalGT = this.modal.create({
        nzTitle: 'BẢNG TỔNG HỢP HÀNG CẦN TIÊU HỦY',
        nzContent: ChitietThThComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '1500px',
        nzFooter: null,
        nzComponentParams: {
          id: idTh
        },
      });
      modalGT.afterClose.subscribe((data) => {
        if (data) {
          this.searchData()
        }
      });
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.NULL_ERROR);
    }
  }

  async searchData() {
    await this.search();
    await this.buildTableView()
  }
}
