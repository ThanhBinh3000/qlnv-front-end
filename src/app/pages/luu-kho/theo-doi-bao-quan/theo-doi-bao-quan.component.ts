import {Component, OnInit} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NzModalService} from "ng-zorro-antd/modal";
import {Base3Component} from "../../../components/base3/base3.component";
import {ActivatedRoute, Router} from "@angular/router";
import {StorageService} from "../../../services/storage.service";
import {HttpClient} from "@angular/common/http";
import {TheoDoiBqService} from "../../../services/luu-kho/theo-doi-bq.service";
import {MESSAGE} from "../../../constants/message";
import {DanhMucService} from "../../../services/danhmuc.service";
import {STATUS} from "../../../constants/status";
import {DonviService} from "../../../services/donvi.service";


@Component({
  selector: 'app-theo-doi-bao-quan',
  templateUrl: './theo-doi-bao-quan.component.html',
  styleUrls: ['./theo-doi-bao-quan.component.scss']
})
export class TheoDoiBaoQuanComponent extends Base3Component implements OnInit {
  listLoaiHangHoa: any[] = [];
  listChungLoaiHangHoa: any[] = [];
  listTrangThai: any[] = [];
  dsChiCuc: any = [];
  dsDiemKho: any = [];
  dsNhaKho: any = [];
  dsNganKho: any = [];
  dsLoKho: any = [];
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private theoDoiBqService: TheoDoiBqService,
    private danhMucService: DanhMucService,
    private donviService: DonviService,

  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, theoDoiBqService);
    this.defaultURL = 'luu-kho/theo-doi-bao-quan'
    this.formData = this.fb.group({
      nam: null,
      soSoTdbq: null,
      maDviSr: null,
      maDiemKho: null,
      maNhaKho: null,
      maNganKho: null,
      maLoKho: null,
      loaiVthh: null,
      cloaiVthh: null,
      trangThai : null,
    })
    this.listTrangThai = [
      {
        key : STATUS.DU_THAO,
        value : 'Dự thảo'
      },
      {
        key : STATUS.CHO_DUYET_KT,
        value : 'Chờ duyệt - KT'
      },
      {
        key : STATUS.CHO_DUYET_LDCC,
        value : 'Chờ duyệt - LDCC'
      },
      {
        key : STATUS.DA_DUYET_LDCC,
        value : 'Đã duyệt - LDCC'
      },
      {
        key : STATUS.TU_CHOI_KT,
        value : 'Từ chối - KT'
      },
      {
        key : STATUS.TU_CHOI_LDCC,
        value : 'Từ chối - LDCC'
      },
    ];
    this.loadDsHangHoa();
    this.loadDsChiCuc();
  }

  async onChangeLoaiVthh(event) {
    if (event) {
      this.formData.patchValue({
        tenHH: null
      })
      let body = {
        "str": event
      };
      let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha(body);
      this.listChungLoaiHangHoa = [];
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.listChungLoaiHangHoa = res.data;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  async loadDsChiCuc() {
    let res = await this.donviService.layTatCaDonViByLevel(3);
    if (res && res.data) {
      this.dsChiCuc = res.data
      this.dsChiCuc = this.dsChiCuc.filter(item => item.type != "PB" && item.maDvi.startsWith(this.userInfo.MA_DVI))
    }
    if(this.userService.isChiCuc()){
      this.formData.patchValue({
        maDviSr : this.userInfo.MA_DVI
      })
    }
  }

  async changeDonVi(event: any,level) {
    if (event) {
      let res = await this.donviService.layTatCaDonViByLevel(level);
      if (res && res.data) {
        if(level == 4){
          this.dsDiemKho = res.data
          this.dsDiemKho = this.dsDiemKho.filter(item => item.type != "PB" && item.maDvi.startsWith(event))
        }
        if(level == 5){
          this.dsNhaKho = res.data
          this.dsNhaKho = this.dsNhaKho.filter(item => item.type != "PB" && item.maDvi.startsWith(event))
        }
        if(level == 6){
          this.dsNganKho = res.data
          this.dsNganKho = this.dsNganKho.filter(item => item.type != "PB" && item.maDvi.startsWith(event))
        }
        if(level == 7){
          this.dsLoKho = res.data
          this.dsLoKho = this.dsLoKho.filter(item => item.type != "PB" && item.maDvi.startsWith(event))
        }
      }
    }
  }

  async loadDsHangHoa() {
    let res = await this.danhMucService.getAllVthhByCap("2");
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listLoaiHangHoa = res.data
      }
    }
  }


  ngOnInit(): void {
    this.search();
  }
}
