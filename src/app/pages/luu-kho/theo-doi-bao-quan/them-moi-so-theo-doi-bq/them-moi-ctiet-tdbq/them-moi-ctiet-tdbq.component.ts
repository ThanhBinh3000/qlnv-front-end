import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import dayjs from "dayjs";
import {Validators} from "@angular/forms";
import {Base3Component} from "../../../../../components/base3/base3.component";
import {TongHopScService} from "../../../../../services/sua-chua/tongHopSc.service";
import {LOAI_HANG_DTQG} from "../../../../../constants/config";
import {TheoDoiBqService} from "../../../../../services/luu-kho/theo-doi-bq.service";
import {TheoDoiBqDtlService} from "../../../../../services/luu-kho/theoDoiBqDtl.service";
import {DanhMucService} from "../../../../../services/danhmuc.service";
import {MESSAGE} from "../../../../../constants/message";

@Component({
  selector: 'app-them-moi-ctiet-tdbq',
  templateUrl: './them-moi-ctiet-tdbq.component.html',
  styleUrls: ['./them-moi-ctiet-tdbq.component.scss']
})
export class ThemMoiCtietTdbqComponent extends Base3Component implements OnInit {

  rowItem : ChiSoChatLuong = new ChiSoChatLuong();
  listBpxl : any[] = [];
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  dataHdr : any;
  isXacNhan : boolean = false;
  dataTk : any;
  dataKtv : any;
  dataLdcc : any;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private theoDoiBqDtlService: TheoDoiBqDtlService,
    private danhMucService : DanhMucService,
    private _modalRef: NzModalRef,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, theoDoiBqDtlService);
    this.formData = this.fb.group({
      id : [null,],
      idHdr : [null,[Validators.required]],
      tenNguoiKtra : [null,[Validators.required]],
      ngayKtra : [null,[Validators.required]],
      loaiVthh : [null,[Validators.required]],
      tenLoaiVthh : [null,[Validators.required]],
      cloaiVthh : [null,[Validators.required]],
      tenCloaiVthh : [null,[Validators.required]],
      dviTinh : [null,[Validators.required]],
      vaiTro : [null,[Validators.required]],
      tenVaiTro : [null,[Validators.required]],
      nguyenNhan : [null],
      dienBien : [null],
      bienPhapXl : [null],
      soLuongXl : [null],
      moTa : [null],
      idDataTk : [],
      idDataKtv : [],
      idDataLdcc : []
    })
  }


  ngOnInit(): void {
    this.loadDataCombobox();
    console.log(this.dataTk,this.dataKtv,this.dataLdcc);
    if(this.id){
      this.detail(this.id).then((res)=>{
        this.rowItem = res
      });
    }else{
      this.formData.patchValue({
        tenNguoiKtra : this.userInfo.TEN_DAY_DU,
        ngayKtra : dayjs().format('YYYY-MM-DD'),
        loaiVthh : this.dataHdr.loaiVthh,
        tenLoaiVthh : this.dataHdr.tenLoaiVthh,
        cloaiVthh : this.dataHdr.cloaiVthh,
        tenCloaiVthh : this.dataHdr.tenCloaiVthh,
        dviTinh : this.dataHdr.dviTinh,
        idHdr : this.dataHdr.id,
        vaiTro : this.userInfo.POSITION,
        tenVaiTro : this.userInfo.POSITION_NAME,
        idDataTk : this.dataTk?.id,
        idDataKtv : this.dataKtv?.id,
        idDataLdcc : this.dataLdcc?.id,
      })
    }
  }

  async loadDataCombobox(){
    this.listBpxl = [];
    await this.danhMucService.danhMucChungGetAll('BIEN_PHAP_XU_LY').then((res)=>{
      if (res.msg == MESSAGE.SUCCESS) {
        this.listBpxl = res.data;
      }
    });
  }

  handleOk(){
    let body = {
      ...this.formData.value,
      ...this.rowItem
    };
    this.createUpdate(body).then((res)=>{
      if(res){
        this._modalRef.close();
      }
    })
  }

  onCancel() {
    this._modalRef.close();
  }

  disabled():boolean{
    return false;
  }

}

export class ChiSoChatLuong {
  // LT
  tongSoLuong: number = 0;
  anToan: number = 0;
  khongAnToan: number = 0;
  nongDo: number = 0;
  nhietDo: number = 0;
  doAm: number = 0;
  hatVang: number = 0;
  camQuan:string;
  tinhTrangNamMoc: string;
  conTrungSong: number = 0;
  // Muoi them
  muiVi: string;
  benNgoaiCoHat: string;
  //VT
  baoQuanLanDau: number = 0;
  anToanBqtx: number = 0;
  coBienDongBqtx: number = 0;
  tongCongBqtx: number = 0;
  anToanBqdk: number = 0;
  coBienDongBqdk: number = 0;
  tongCongBqdk: number = 0;
  anToanPktb: number = 0;
  coBienDongPktb: number = 0;
  daKhacPhucHh: number = 0;
  vuotQuyenHanHh: number = 0;
  daKhacPhucTb: number = 0;
  vuotQuyenHanTb: number = 0;
}
