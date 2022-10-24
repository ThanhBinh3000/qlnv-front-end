import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Globals } from 'src/app/shared/globals';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {STATUS} from "../../../../../../constants/status";
import {HelperService} from "../../../../../../services/helper.service";
import {
  ThongTinHopDongService
} from "../../../../../../services/qlnv-hang/nhap-hang/dau-thau/hop-dong/thongTinHopDong.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {BaseComponent} from "../../../../../../components/base/base.component";
import {
  QuyetDinhPheDuyetKetQuaLCNTService
} from "../../../../../../services/qlnv-hang/nhap-hang/dau-thau/tochuc-trienkhai/quyetDinhPheDuyetKetQuaLCNT.service";
import {MESSAGE} from "../../../../../../constants/message";
import {UserLogin} from "../../../../../../models/userlogin";
import {UserService} from "../../../../../../services/user.service";

@Component({
  selector: 'app-quanly-hopdong',
  templateUrl: './quanly-hopdong.component.html',
  styleUrls: ['./quanly-hopdong.component.scss']
})
export class QuanlyHopdongComponent implements OnInit {
  @Input() id : number;
  @Output()
  showListEvent = new EventEmitter<any>();

  STATUS = STATUS;
  formData: FormGroup;
  dataTable : any[] = [];
  idHopDong : number;
  isEditHopDong : boolean
  userInfo : UserLogin;

  constructor(
    public globals: Globals,
    private helperService: HelperService,
    private fb: FormBuilder,
    private thongTinHopDong : ThongTinHopDongService,
    private notification: NzNotificationService,
    private spinner: NgxSpinnerService,
    private kqLcnt : QuyetDinhPheDuyetKetQuaLCNTService,
    private userService : UserService
  ) {
    this.formData = this.fb.group({
      id : [null],
      namKhoach: [''],
      soQd: [],
      soQdCc: [],
      soQdPdKq: [],


      tenDuAn: [],
      tenDvi: [],
      maDvi: [],

      loaiVthh: [],
      tenLoaiVthh: [],
      cloaiVthh: [],
      tenCloaiVthh: [],

      tgianBdauTchuc: [null],

      tgianDthau: [null],
      tgianMthau: [null],

      idGoiThau: [''],
      tenGthau: [''],
      soQdPdKhlcnt: [''],
      ngayQdPdKhlcnt: [''],

      tenVthh: [''],
      dviTinh: [''],
      soLuong: [''],
      donGia: [''],
      tongTien: [''],
      tchuanCluong: [''],
      nguonVon: [''],
      hthucLcnt: [''],
      pthucLcnt: [''],
      loaiHdong: [''],
      tgianThienHd: [''],
      tgianNhang: [''],
      ngayKyBban: ['', [Validators.required]],
      idNhaThau: ['', [Validators.required]],
      donGiaTrcVat: ['', [Validators.required]],
      vat: ['', [Validators.required]],
      donGiaSauVat: [''],
      tongTienSauVat: [''],
      tongTienTrcVat: [''],
      ghiChu: ['',],
      diaDiemNhap: [],
      trangThai: [''],
      tenTrangThai: [''],
      trangThaiHd : [],
      tenTrangThaiHd : []
    });
  }

  async ngOnInit() {
    await this.spinner.show()
    this.userInfo = this.userService.getUserLogin();
    await Promise.all([
    ]);
    if(this.id){
      await this.getDetail(this.id)
    }
    await this.spinner.hide()
  }

  async getDetail(id){
    if(id){
      let res = await this.kqLcnt.getDetail(id);
      if(res.msg == MESSAGE.SUCCESS){
        const data = res.data;
        this.helperService.bidingDataInFormGroup(this.formData,data);
        let dataCurrent = data.qdKhlcnt.hhQdKhlcntDtlList.filter(item => item.maDvi == this.userInfo.MA_DVI)
        this.dataTable = dataCurrent[0].dsGoiThau.filter(item => item.trangThai == STATUS.THANH_CONG);
        if(data.listHopDong){
          this.dataTable.forEach(item => {
            let hopDong = data.listHopDong.filter( x  => x.idGoiThau == item.id)[0];
            item.hopDong = hopDong
          })
        };
      }else{
        this.notification.error(MESSAGE.ERROR,res.msg);
      }
    }
  }

  async getDetailHopDong($event, id: number) {
    this.spinner.show();
    $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
    $event.target.parentElement.classList.add('selectedRow')
    this.idHopDong = id;
    this.spinner.hide();
  }

  async redirectHopDong(isShowHd:boolean,id : number){
    this.isEditHopDong = isShowHd;
    this.idHopDong = id;
    if(!isShowHd){
      await this.ngOnInit()
    }
  }

  back() {
    this.showListEvent.emit();
  }

  async approve(){
    await this.spinner.show()
    let body = {
      id : this.id,
      trangThai : STATUS.HOAN_THANH_CAP_NHAT
    }
    let res = await this.kqLcnt.approve(body);
    if(res.msg == MESSAGE.SUCCESS){
      this.notification.success(MESSAGE.SUCCESS,MESSAGE.THAO_TAC_SUCCESS);
      this.back();
    }else{
      this.notification.error(MESSAGE.ERROR,res.msg);
    }
    await this.spinner.hide()
  }

}
