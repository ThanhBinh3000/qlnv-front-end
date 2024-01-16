import {Component, OnInit} from '@angular/core';
import {Base3Component} from "../../../../components/base3/base3.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import {MESSAGE} from "../../../../constants/message";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {ChitietThComponent} from "../../../sua-chua/tong-hop/chitiet-th/chitiet-th.component";
import {TheoDoiBqDtlService} from "../../../../services/luu-kho/theoDoiBqDtl.service";
import { chain } from 'lodash';
import {DanhMucService} from "../../../../services/danhmuc.service";
import {DonviService} from "../../../../services/donvi.service";
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-table-danh-muc-bpxl',
  templateUrl: './table-danh-muc-bpxl.component.html',
  styleUrls: ['./table-danh-muc-bpxl.component.scss']
})
export class TableDanhMucBpxlComponent extends Base3Component implements OnInit {

  listLoaiHangHoa: any[] = [];
  listChungLoaiHangHoa: any[] = [];
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
    private theoDoiBqDtlService: TheoDoiBqDtlService,
    private danhMucService: DanhMucService,
    private donviService: DonviService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, theoDoiBqDtlService);
    this.formData = this.fb.group({
      nam: null,
      loaiVthh: null,
      cloaiVthh: null,
      ngayTu: null,
      ngayDen: null,
      maDiemKho: null,
      maNhaKho: null,
      maNganKho: null,
      maLoKho : null,
      bienPhapXl : null,
      vaiTro : 'CBTHUKHO',
      trangThai : this.STATUS.DA_HOAN_THANH
    });
  }

  title : string = ''
  column : string = ''
  column1 : string = ''
  columnTt : string = ''
  column3 : string = ''
  column4 : string = ''
  typeTable : number = 1;

  async ngOnInit() {
    await this.spinner.show();
    await Promise.all([
      this.bindingParam(),
    ])
    this.loadDsHangHoa();
    this.loadDsDiemKho();
    await this.buildTableView()
    await this.spinner.hide();
  }

  clearForm(){
    this.formData.reset();
    this.formData.patchValue({
      vaiTro : 'CBTHUKHO',
      trangThai : this.STATUS.DA_HOAN_THANH
    })
    this.bindingParam();
  }

  async bindingParam(){
    let trangThai = ''
    let typeBpxl = ''
    let vaiTro = 'CBTHUKHO'
    switch (this.router.url) {
      case '/luu-kho/hang-trong-kho/thanh-ly':
        typeBpxl = '1';
        this.typeTable = 1;
        this.title = 'Danh sách hàng thuộc diện thanh lý';
        this.column = 'cần thanh lý';
        this.column1 = 'đã thanh lý';
        this.columnTt = 'thanh lý';
        break;
      case '/luu-kho/hang-trong-kho/tieu-huy':
        typeBpxl = '2';
        this.typeTable = 1;
        this.title = 'Danh sách hàng thuộc diện tiêu hủy';
        this.column = 'cần tiêu hủy';
        this.column1 = 'đã tiêu hủy';
        this.columnTt = 'tiêu hủy';
        break;
      case '/luu-kho/hang-trong-kho/sap-het-han-bao-hanh':
        typeBpxl = '6';
        this.typeTable = 2;
        this.title = 'Danh sách hàng DTQG sắp hết hạn bảo hành (trước 3 tháng) theo hợp đồng đã ký';
        this.column = 'sắp hết hạn BH';
        this.column1 = null;
        this.columnTt = 'xử lý';
        this.column3 = 'Ngày hết hạn bảo hành theo HĐ';
        this.column4 = 'Thời gian BH còn lại theo HĐ (Ngày)';
        vaiTro = null;
        trangThai = null;
        break;
      case '/luu-kho/hang-trong-kho/het-han-luu-kho':
        typeBpxl = '7';
        this.typeTable = 2;
        this.title = 'Danh sách hàng sắp hết hạn lưu kho nhưng chưa có kế hoạch xuất kho'
        this.column = 'sắp hết hạn lưu kho';
        this.column1 = null;
        this.columnTt = 'KTCL';
        this.column3 = 'Ngày hết hạn lưu kho';
        this.column4 = 'Thời gian lưu kho còn lại theo HĐ (Ngày)';
        vaiTro = null;
        trangThai = null;
        break;
      case '/luu-kho/hang-trong-kho/hong-hoc-giam-cl':
        typeBpxl = '4';
        this.typeTable = 1;
        this.title = 'Danh sách hàng hỏng, giảm chất lượng do nguyên nhân bất khả kháng';
        this.column = 'hỏng hóc';
        this.column1 = null;
        this.columnTt = 'xử lý';
        break;
      case '/luu-kho/hang-trong-kho/hong-hoc-bao-hanh':
        typeBpxl = '3';
        this.typeTable = 1;
        this.title = 'Danh sách hàng thuộc diện hỏng cần bảo hành';
        this.column = 'hỏng cần BH';
        this.column1 = 'đã BH';
        this.columnTt = 'xử lý';
        break;
      case '/luu-kho/hang-trong-kho/hong-hoc-sua-chua':
        typeBpxl = '5';
        this.typeTable = 1;
        this.title = 'Danh sách hàng thuộc diện hỏng cần sửa chữa'
        this.column = 'hỏng cần sửa chữa';
        this.column1 = 'đã sửa chữa';
        this.columnTt = 'sửa chữa';
        break;
      case '/luu-kho/hang-trong-kho/da-het-han':
        typeBpxl = '8';
        this.typeTable = 1;
        this.title = 'Danh sách hàng đã hết hạn bảo hành, chưa hết hạn lưu kho'
        this.column = 'hết hạn BH, chưa hết hạn LK';
        this.column1 = null;
        this.columnTt = 'xử lý';
        vaiTro = null;
        trangThai = null;
        break;
      default :
        break;
    }
    this.formData.patchValue({
      bienPhapXl : typeBpxl,
      trangThai : trangThai,
      vaiTro : vaiTro
    })
    await this.searchList();
  }

  async buildTableView() {
    this.dataTableAll = chain(this.dataTable).groupBy('tenLoaiVthh').map((value, key) => {
        let rs =  chain(value).groupBy('tenCloaiVthh').map((v,k)=>{
          return {
            tenCloaiVthh: k,
            expandSet : true,
            children: v,
          };
        }).value();
        return {
          tenLoaiVthh: key,
          expandSet : true,
          chilren: rs
        };
    }).value();
  }

  exportData(fileName?: string, roles?: any) {
    if (!this.checkPermission(roles)) {
      return
    }
    if (this.dataTableAll.length > 0) {
      this.spinner.show();
      try {
        this.theoDoiBqDtlService
          .export(this.formData.value)
          .subscribe((blob) =>
            saveAs(blob, fileName ? fileName : 'data.xlsx'),
          );
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
    }
  }

  async searchList(){
    let body = this.formData.value
    body.paggingReq = {
      limit: this.pageSize,
      page: this.page - 1
    }
    let res = await this.theoDoiBqDtlService.search(body);
    this.spinner.show();
    if (res.msg == MESSAGE.SUCCESS) {
      this.spinner.hide();
      this.dataTable = res.data;
      this.buildTableView();
    } else {
      this.spinner.hide();
      this.dataTable = [];
      this.totalRecord = 0;
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  showDetail(data) {
    this.router.navigate(['luu-kho/theo-doi-bao-quan/chi-tiet', data.idHdr]);
  }

  async loadDsHangHoa() {
    let res = await this.danhMucService.getAllVthhByCap("2");
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listLoaiHangHoa = res.data
      }
    }
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

  async loadDsDiemKho() {
    let res = await this.donviService.layTatCaDonViByLevel(4);
    if (res && res.data) {
      this.dsDiemKho = res.data
      this.dsDiemKho = this.dsDiemKho.filter(item => item.type != "PB" && item.maDvi.startsWith(this.userInfo.MA_DVI))
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

}
