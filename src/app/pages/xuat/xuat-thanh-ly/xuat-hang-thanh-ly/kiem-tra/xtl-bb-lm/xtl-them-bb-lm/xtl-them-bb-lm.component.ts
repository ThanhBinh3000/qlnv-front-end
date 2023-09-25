import { Component, OnInit } from '@angular/core';
import {Base3Component} from "../../../../../../../components/base3/base3.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {KiemTraChatLuongScService} from "../../../../../../../services/sua-chua/kiemTraChatLuongSc";
import {MESSAGE} from "../../../../../../../constants/message";
import {DanhMucService} from "../../../../../../../services/danhmuc.service";
import dayjs from "dayjs";
import {STATUS} from "../../../../../../../constants/status";

@Component({
  selector: 'app-xtl-them-bb-lm',
  templateUrl: './xtl-them-bb-lm.component.html',
  styleUrls: ['./xtl-them-bb-lm.component.scss']
})
export class XtlThemBbLmComponent extends Base3Component implements OnInit {

  listBienBan : any[]

  fileCanCu : any[]
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private _service: KiemTraChatLuongScService,
    private danhMucService : DanhMucService
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, _service);
    this.formData = this.fb.group({
      id: [],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự Thảo'],
      lyDoTuChoi: [''],
      loaiBienBan: [''],
      nam: [dayjs().get('year')],
      soBienBan: [''],
      tenDvi: [''],
      maDvi: [''],
      maQhns: [''],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      idDdiemGiaoNvNh: [''],
      maDiemKho: [''],
      tenDiemKho: [''],
      maNhaKho: [''],
      tenNhaKho: [''],
      maNganKho: [''],
      tenNganKho: [''],
      maLoKho: [''],
      tenLoKho: [''],
      soQdGiaoNvNh: [''],
      ngayQdGiaoNvNh: [''],
      idQdGiaoNvNh: [''],
      soHd: [''],
      ngayHd: [''],
      ngayLayMau: [dayjs().format('YYYY-MM-DD')],
      dviKiemNghiem: [''],
      soBbNhapDayKho: [''],
      idBbNhapDayKho: [''],
      diaDiemLayMau: [''],

      soLuongMau: [''],
      ppLayMau: [''],
      chiTieuKiemTra: [''],
      ketQuaNiemPhong: [''],
      tenNguoiTao: [''],
      soBbGuiHang: [''],
      idBbGuiHang: [''],
      dviCungCap: [''],
      ngayNhapDayKho: [''],
      tenNganLoKho: [''],
      tenNguoiPduyet: [''],
      truongBpKtbq: [''],
      dvt: [''],
    });
    router.events.subscribe((val) => {
      let routerUrl = this.router.url;
      const urlList = routerUrl.split("/");
      this.defaultURL  = 'xuat/xuat-thanh-ly/xuat-hang/' + urlList[4] + '/xtl-bb-lm';
    })
  }

  async OnInit() {
    this.spinner.show();
    await Promise.all([
      this.loadLoaiBienBan(),
      this.getId(),
      await this.initForm()
    ]);
    this.spinner.hide();
  }

  initForm(){
    if(this.id){

    }else{

    }
  }

  async loadLoaiBienBan() {
    await this.danhMucService.danhMucChungGetAll("LOAI_BIEN_BAN").then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.listBienBan = res.data.filter(item => item.ma == 'LBGM');
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }).catch(err => {
      this.notification.error(MESSAGE.ERROR, err.msg);
    })
  }

  openDialogSoQd(){

  }

  openDialogDdiemNhapHang(){

  }

}
