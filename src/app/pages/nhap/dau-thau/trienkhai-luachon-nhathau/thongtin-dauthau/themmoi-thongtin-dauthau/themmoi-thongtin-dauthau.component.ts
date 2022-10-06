import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import dayjs from 'dayjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DATEPICKER_CONFIG, LIST_VAT_TU_HANG_HOA, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { dauThauGoiThauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/tochuc-trienkhai/dauThauGoiThau.service';
import { DonviLienQuanService } from 'src/app/services/donviLienquan.service';
import { HelperService } from 'src/app/services/helper.service';
import { QuyetDinhPheDuyetKeHoachLCNTService } from 'src/app/services/quyetDinhPheDuyetKeHoachLCNT.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { STATUS } from "../../../../../../constants/status";
import { cloneDeep, chain } from 'lodash';
import {
  ThongTinDauThauService
} from "../../../../../../services/qlnv-hang/nhap-hang/dau-thau/tochuc-trienkhai/thongTinDauThau.service";
import {NzModalService} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-themmoi-thongtin-dauthau',
  templateUrl: './themmoi-thongtin-dauthau.component.html',
  styleUrls: ['./themmoi-thongtin-dauthau.component.scss']
})
export class ThemmoiThongtinDauthauComponent implements OnInit {
  @Input() idInput: number;
  @Output()
  showListEvent = new EventEmitter<any>();

  constructor(
    private modal : NzModalService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public userService: UserService,
    private helperService: HelperService,
    private quyetDinhPheDuyetKeHoachLCNTService: QuyetDinhPheDuyetKeHoachLCNTService,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private fb: FormBuilder,
    // private dauThauGoiThauService: dauThauGoiThauService,
    private thongTinDauThauService : ThongTinDauThauService,
    private donviLienQuanService: DonviLienQuanService,
  ) {
    this.formData = this.fb.group({
      id: [''],
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
      tenTrangThai : ['']
    });
  }
  idGoiThau : number = 0;
  idDtl : number = 0;
  STATUS = STATUS
  itemRow: any = {};
  itemRowUpdate: any = {};
  // timeDefaultValue = setHours(new Date(), 0);
  tabSelected: string = 'phuong-an-tong-hop';
  searchValue = '';
  visibleTab: boolean = false;
  listNam: any[] = [];
  yearNow: number = 0;
  id: number;
  listNthauNopHs: any[] = [];
  i = 0;
  listNguonVon: any[] = []
  listPhuongThucDauThau: any[] = []
  listHinhThucDauThau: any[] = []
  listLoaiHopDong: any[] = []
  listNhaThau: any[] = []
  listStatusNhaThau : any [] = []
  listVthh: any[] = [];
  formData: FormGroup
  isDetail = false;
  dataTable: any[] = [];
  dataDetail: any;
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;

  listOfData: any[] = [];
  listDataGroup: any[] = [];


  userInfo: UserLogin;
  datePickerConfig = DATEPICKER_CONFIG;

  async ngOnInit() {
    this.spinner.show();
    this.listVthh = LIST_VAT_TU_HANG_HOA;
    try {
      this.userInfo = this.userService.getUserLogin();
      this.yearNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      }
      await Promise.all([
        this.loadDataComboBox(),
        this.getDetail(),
      ]);
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadDataComboBox(){
    // List nguồn vốn
    this.listNguonVon = [];
    let resNv = await this.danhMucService.danhMucChungGetAll('NGUON_VON');
    if (resNv.msg == MESSAGE.SUCCESS) {
      this.listNguonVon = resNv.data;
    }
    // phương thức đấu thầu
    this.listPhuongThucDauThau = [];
    let resPt = await this.danhMucService.danhMucChungGetAll('PT_DTHAU');
    if (resPt.msg == MESSAGE.SUCCESS) {
      this.listPhuongThucDauThau = resPt.data;
    }
    // hình thức đấu thầu
    this.listHinhThucDauThau = [];
    let resPtdt = await this.danhMucService.danhMucChungGetAll('HT_LCNT');
    if (resPtdt.msg == MESSAGE.SUCCESS) {
      this.listHinhThucDauThau = resPtdt.data;
    }
    // hợp đồng
    this.listLoaiHopDong = [];
    let resHd = await this.danhMucService.danhMucChungGetAll('LOAI_HDONG');
    if (resHd.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = resHd.data;
    }
    this.listNhaThau = [];
    let resNt = await this.donviLienQuanService.getAll({"typeDvi": "NT"});
    if (resNt.msg == MESSAGE.SUCCESS) {
      this.listNhaThau = resNt.data;
    }
    this.listStatusNhaThau = [
      {
        value : STATUS.TRUNG_THAU,
        text : 'Trúng thầu'
      },{
        value : STATUS.HUY_THAU,
        text : 'Hủy thầu'
      },{
        value : STATUS.TRUOT_THAU,
        text : 'Trượt thầu'
      }
    ];
  }

  async getDetail() {
    const res = await this.quyetDinhPheDuyetKeHoachLCNTService.getDetail(this.idInput);
    if (res.msg == MESSAGE.SUCCESS) {
      const dataDetail = res.data;
      const dataFilterUser = dataDetail.hhQdKhlcntDtlList.filter(item => item.maDvi == this.userInfo.MA_DVI);
      const dataCurrent = dataFilterUser[0];
      this.helperService.bidingDataInFormGroup(this.formData, dataDetail);
      this.idDtl = dataCurrent.id;
      this.formData.patchValue({
        trangThai : dataCurrent.trangThai,
        tenTrangThai : dataCurrent.tenTrangThai
      })
      this.listOfData = dataCurrent.dsGoiThau;
      this.convertListData()
      // const isVatTu = !!dataDetail.loaiVthh;
      // // Trang thái đã cập nhập thông tin gói thầu hoặc hoàn thành cập nhập tt gt
      // if (dataDetail.trangThai == STATUS.CHUA_CAP_NHAT) {
      //   this.formData.patchValue({
      //     idGoiThau: dataDetail.id,
      //     tenGthau: dataDetail.goiThau,
      //     loaiVthh: isVatTu ? dataDetail.loaiVthh : dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.loaiVthh,
      //     tenVthh: isVatTu ? dataDetail.tenLoaiVthh : dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.tenLoaiVthh,
      //     cloaiVthh: isVatTu ? dataDetail.cloaiVthh : dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.cloaiVthh,
      //     tenCloaiVthh: isVatTu ? dataDetail.tenCloaiVthh : dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.tenCloaiVthh,
      //     soQdPdKhlcnt: dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.soQd,
      //     ngayQdPdKhlcnt: dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.ngayQd,
      //     maDvi: dataDetail.hhQdKhlcntDtl.maDvi,
      //     tenDvi: dataDetail.hhQdKhlcntDtl.tenDvi,
      //     dviTinh: dataDetail.dviTinh,
      //     tchuanCluong: dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.tchuanCluong,
      //     pthucLcnt: isVatTu ? dataDetail.pthucLcnt : dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.pthucLcnt,
      //     hthucLcnt: isVatTu ? dataDetail.hthucLcnt : dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.hthucLcnt,
      //     nguonVon: isVatTu ? dataDetail.nguonVon : dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.nguonVon,
      //     donGia: dataDetail.donGia,
      //     soLuong: dataDetail.soLuong,
      //     tongTien: dataDetail.thanhTien,
      //     tgianThienHd: isVatTu ? dataDetail.tgianThienHd : dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.tgianThienHd,
      //     loaiHdong: isVatTu ? dataDetail.loaiHdong : dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.loaiHdong,
      //     tgianNhang: dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.tgianNhang,
      //     tgianDthau: dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.tgianDthau,
      //     tgianMthau: dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.tgianMthau,
      //     diaDiemNhap: dataDetail.children,
      //     trangThai: dataDetail.trangThai,
      //     ghiChu: dataDetail.ghiChu
      //   });
      // } else {
      //   const res = await this.dauThauGoiThauService.chiTietByGoiThauId(this.idInput);
      //   const dataThongTinGt = res.data;
      //   this.listNthauNopHs = dataThongTinGt.nthauDuThauList;
      //   this.formData.patchValue({
      //     id: dataThongTinGt.id,
      //     idGoiThau: dataThongTinGt.idGoiThau,
      //     tenGthau: dataThongTinGt.tenGthau,
      //     loaiVthh: dataThongTinGt.loaiVthh,
      //     tenVthh: dataThongTinGt.tenVthh,
      //     cloaiVthh: dataThongTinGt.cloaiVthh,
      //     tenCloaiVthh: dataThongTinGt.tenCloaiVthh,
      //     soQdPdKhlcnt: dataThongTinGt.soQdPdKhlcnt,
      //     ngayQdPdKhlcnt: dataThongTinGt.ngayQdPdKhlcnt,
      //     maDvi: dataDetail.hhQdKhlcntDtl.maDvi,
      //     tenDvi: dataDetail.hhQdKhlcntDtl.tenDvi,
      //     dviTinh: dataThongTinGt.dviTinh,
      //     tchuanCluong: dataThongTinGt.tchuanCluong,
      //     pthucLcnt: dataThongTinGt.pthucLcnt,
      //     hthucLcnt: dataThongTinGt.hthucLcnt,
      //     nguonVon: dataThongTinGt.nguonVon,
      //     donGia: dataThongTinGt.donGia,
      //     soLuong: dataThongTinGt.soLuong,
      //     tongTien: dataThongTinGt.tongTien,
      //     tgianThienHd: dataThongTinGt.tgianThienHd,
      //     loaiHdong: dataThongTinGt.loaiHdong,
      //     tgianNhang: dataThongTinGt.tgianNhang,
      //     tgianDthau: dataThongTinGt.tgianDthau,
      //     tgianMthau: dataThongTinGt.tgianMthau,
      //     trangThai: dataDetail.trangThai,
      //     ngayKyBban: dataThongTinGt.ngayKyBban,
      //     vat: dataThongTinGt.vat,
      //     donGiaTrcVat: dataThongTinGt.donGiaTrcVat,
      //     idNhaThau: dataThongTinGt.idNhaThau,
      //     diaDiemNhap: dataThongTinGt.diaDiemNhapList,
      //     ghiChu: dataThongTinGt.ghiChu
      //   });
      // }
      // if (isVatTu) {
      //   dataDetail.children.forEach(item => {
      //     this.listDiaDiemNhapHang = [...this.listDiaDiemNhapHang, {
      //       tenDvi: item.tenDvi,
      //       noiDung: item.soLuong
      //     }]
      //   });
      // } else {
      //   let stringConcat = ''
      //   dataDetail.children.forEach(item => {
      //     stringConcat = stringConcat + item.tenDiemKho + "(" + item.soLuong + "), "
      //   });
      //   this.listDiaDiemNhapHang = [...this.listDiaDiemNhapHang, {
      //     tenDvi: dataDetail.tenDvi,
      //     noiDung: stringConcat.substring(0, stringConcat.length - 2)
      //   }]
      // }
      // this.calendarGia();
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  convertListData() {
    this.listDataGroup = chain(this.listOfData).groupBy('tenDvi').map((value, key) => ({ tenDvi: key, dataChild: value }))
      .value()
  }


  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  async phuongThucDauThauGetAll() {
    this.listPhuongThucDauThau = [];
    let res = await this.danhMucService.phuongThucDauThauGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listPhuongThucDauThau = res.data;
    }
  }


  quayLai() {
    this.showListEvent.emit();
  }

  async nguonVonGetAll() {
    this.listNguonVon = [];
    let res = await this.danhMucService.nguonVonGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listNguonVon = res.data;
    }
  }

  async hinhThucDauThauGetAll() {
    this.listHinhThucDauThau = [];
    let res = await this.danhMucService.hinhThucDauThauGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHinhThucDauThau = res.data;
    }
  }

  async loaiHopDongGetAll() {
    this.listLoaiHopDong = [];
    let res = await this.danhMucService.loaiHopDongGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = res.data;
    }
  }

  async loaiDonviLienquanAll() {
    this.listNhaThau = [];
    const body = {
      "typeDvi": "NT"
    };
    let res = await this.donviLienQuanService.getAll(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listNhaThau = res.data;
    }
  }


  pipe = new DatePipe('en-US');
  async save() {
    await this.spinner.show();
    let filter = this.listOfData.filter(item => item.trangThai == STATUS.CHUA_CAP_NHAT);
    if(filter.length > 0){
      this.notification.error(MESSAGE.ERROR,"Vui lòng cập nhật thông tin các gói thầu");
      await this.spinner.hide();
      return
    }
    let body = {
      id : this.idDtl,
      trangThai : STATUS.HOAN_THANH_CAP_NHAT
    }
    let res = await this.thongTinDauThauService.approve(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (this.formData.get('id').value) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        await this.spinner.hide()
        this.quayLai();
      } else {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        await this.spinner.hide()
        this.quayLai();
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide()
  }

  async saveGoiThau() {
    await this.spinner.show()
    let body = {
      idGoiThau : this.idGoiThau,
      nthauDuThauList : this.listNthauNopHs
    }
    console.log(body);
    let res = await this.thongTinDauThauService.create(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      await this.getDetail()
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide()
  }

  async showDetail($event, dataGoiThau : any) {
    await this.spinner.show();
    this.listNthauNopHs = [];
    this.idGoiThau = dataGoiThau.id;
    $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
    $event.target.parentElement.classList.add('selectedRow')

    let res = await this.thongTinDauThauService.getDetail(this.idGoiThau);
    if(res.msg == MESSAGE.SUCCESS){
      this.itemRow.soLuong = dataGoiThau.soLuong;
      this.listNthauNopHs = res.data;
      this.listNthauNopHs.forEach( item => {
        item.edit = false;
      })
    }else{
      this.notification.error(MESSAGE.ERROR,res.msg);
    }
    await this.spinner.hide();
  }

  changeTrangThai($event){
    let trangThai = this.listStatusNhaThau.filter( item => item.value == $event);
    this.itemRow.tenTrangThai = trangThai[0].text;
    this.itemRowUpdate.tenTrangThai = trangThai[0].text;
  }

  addRow(): void {
    if(this.validateItemSave(this.itemRow)){
      this.listNthauNopHs = [
        ...this.listNthauNopHs,
        this.itemRow
      ];
      this.clearItemRow();
    }
  }

  clearItemRow() {
    let soLuong = this.itemRow.soLuong;
    this.itemRow = {};
    this.itemRow.soLuong = soLuong;
    this.itemRow.id = null;
  }

  deleteRow(i) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.listNthauNopHs.splice(i,1)
      },
    });
  }

  startEdit(index: number): void {
    this.listNthauNopHs[index].edit = true;
    this.itemRowUpdate = cloneDeep(this.listNthauNopHs[index]);
  }

  cancelEdit(index: number): void {
    this.listNthauNopHs[index].edit = false;
  }

  saveEdit(dataUpdate,index: any): void {
    if(this.validateItemSave(this.itemRowUpdate,index)){
      this.listNthauNopHs[index] = this.itemRowUpdate;
      this.listNthauNopHs[index].edit = false;
    };

  }

  validateItemSave(dataSave,index?):boolean{
    if(dataSave.trangThai == STATUS.TRUNG_THAU){
        let filter = this.listNthauNopHs.filter(item => item.trangThai == STATUS.TRUNG_THAU);
        if(filter.length > 0){
          if(index){
            let indexFilter = this.listNthauNopHs.indexOf(filter[0]);
            if(index != indexFilter){
              this.notification.error(MESSAGE.ERROR,"Trạng thái trúng thầu đã tồn tại, xin vui lòng thay đổi trạng thái bản ghi")
              return false
            }
            return true
          }else{
            this.notification.error(MESSAGE.ERROR,"Trạng thái trúng thầu đã tồn tại, xin vui lòng thay đổi trạng thái bản ghi")
            return false
          }

        }
        return true;
    }
    return true;
  }

}
