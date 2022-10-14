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
      tenTrangThai: ['']
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
      console.log(res);
      if(res.msg == MESSAGE.SUCCESS){
        const data = res.data;
        this.helperService.bidingDataInFormGroup(this.formData,data);
        let dataCurrent = data.qdKhlcnt.hhQdKhlcntDtlList.filter(item => item.maDvi == this.userInfo.MA_DVI)
        this.dataTable = dataCurrent[0].dsGoiThau;
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

  redirectHopDong(isShowHd:boolean,id : number){
    this.isEditHopDong = isShowHd;
    this.idHopDong = id;
  }

  back() {
    this.showListEvent.emit();
  }

}
