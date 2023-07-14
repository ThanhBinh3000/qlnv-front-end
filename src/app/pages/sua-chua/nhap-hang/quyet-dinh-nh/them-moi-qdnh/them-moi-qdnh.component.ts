import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {QuyetDinhXhService} from "../../../../../services/sua-chua/quyetDinhXh.service";
import dayjs from "dayjs";
import {Validators} from "@angular/forms";
import {
  DialogTableSelectionComponent
} from "../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {STATUS} from "../../../../../constants/status";
import {Base3Component} from "../../../../../components/base3/base3.component";
import {chain} from 'lodash';
import {KiemTraChatLuongScService} from "../../../../../services/sua-chua/kiemTraChatLuongSc";
import {QuyetDinhNhService} from "../../../../../services/sua-chua/quyetDinhNh.service";
import {
  DialogTableCheckBoxComponent
} from "../../../../../components/dialog/dialog-table-check-box/dialog-table-check-box.component";


@Component({
  selector: 'app-them-moi-qdnh',
  templateUrl: './them-moi-qdnh.component.html',
  styleUrls: ['./them-moi-qdnh.component.scss']
})
export class ThemMoiQdnhComponent extends Base3Component implements OnInit {

  fileCanCu: any[] = [];
  dataTableSave : any[] = [];

   map = new Map();


  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private quyetDinhNhService : QuyetDinhNhService,
    private kiemTraChatLuongScService : KiemTraChatLuongScService,
    private quyetDinhXhService: QuyetDinhXhService
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, quyetDinhNhService);
    this.defaultURL = 'sua-chua/nhap-hang/giao-nv-nh'
    this.getId();
    this.formData = this.fb.group({
      id : [],
      trangThai: ['00'] ,
      tenTrangThai: ['Dự thảo'],
      nam : [dayjs().year(), [Validators.required]],
      soQd : [null, [Validators.required]],
      ngayKy: [''],
      soPhieuKtcl: [null, [Validators.required]],
      idPhieuKtcl : [null, [Validators.required]],
      ngayKiemDinh : [null,],
      idQdXh: [null, [Validators.required]],
      soQdXh : [null, [Validators.required]],
      thoiHanXuat: [null],
      thoiHanNhap: [null],
      duToanKinhPhi : [null],
      loaiHinhNhapXuat : ['Xuất sửa chữa'],
      kieuNhapXuat : ['Xuất không thu tiền'],
      trichYeu: [null],
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

  async initForm(){
    if(this.id){
      await this.detail(this.id).then((res)=>{
        if(res){
          let soQd = res.soQd.split('/')[0];
          this.formData.patchValue({
            soQd : soQd
          })
          this.bindingQdXh(res.idQdXh);
          let dataTable = [];
          res.children.forEach((item)=>{
            console.log(item)
            item.scDanhSachHdr.soLuongNhap = item.soLuongNhap;
            dataTable.push(item.scDanhSachHdr);
          })
          this.dataTableView =  chain(dataTable).groupBy('tenChiCuc').map((value, key) => ({
              tenDonVi: key,
              children: value,
            })
          ).value();
        }
      })
    }
  }

  openDialogDanhSach() {
    if (this.disabled()) {
      return;
    }
    this.spinner.show();
    this.quyetDinhXhService.getDanhSachTaoQuyetDinhNhapHang({}).then((res) => {
      this.spinner.hide();
      if (res.data) {
        res.data?.forEach(item => {
          item.ngayXuat = item.thoiHanXuat
          item.ngayNhap = item.thoiHanNhap
        })
        const modalQD = this.modal.create({
          nzTitle: 'Danh sách kết quả kiểm định sau sửa chữa',
          nzContent: DialogTableSelectionComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: '900px',
          nzFooter: null,
          nzComponentParams: {
            dataTable: res.data,
            dataHeader: ['Số quyết định xuất hàng', 'Trích yếu','Thời hạn nhập','Thời hạn xuất'],
            dataColumn: ['soQd', 'trichYeu','ngayXuat','ngayNhap']
          },
        });
        modalQD.afterClose.subscribe(async (data) => {
          if (data) {
            this.spinner.show();
            this.bindingQdXh(data.id)
          }
        });
      }
    })
  }

  bindingQdXh(idQdXh){
    this.quyetDinhXhService.getDetail(idQdXh).then((resQdXh)=>{
      this.spinner.hide();
      this.formData.patchValue({
        idQdXh: resQdXh.data.id,
        soQdXh : resQdXh.data.soQd,
        thoiHanXuat: resQdXh.data.thoiHanXuat,
        thoiHanNhap: resQdXh.data.thoiHanNhap,
      })
      this.dataTableAll = resQdXh.data.scKiemTraChatLuongHdrList;
    });
  }

  openDialogCanCu() {
    if (this.disabled()) {
      return;
    }
    this.dataTableAll.forEach( item => {
      item.checked = this.formData.value.idPhieuKtcl.includes(item.id);
      item.maDiaDiem = item.scPhieuXuatKhoHdr.maDiaDiem;
      item.tenDiaDiem = item.scPhieuXuatKhoHdr.tenDiemKho + ' / ' + item.scPhieuXuatKhoHdr.tenNhaKho + ' / '
        + item.scPhieuXuatKhoHdr.tenNganKho + ' / ' + item.scPhieuXuatKhoHdr.tenLoKho;
      item.tongSoLuong = item.scPhieuXuatKhoHdr.tongSoLuong;
      item.numberSoLuong = item.scPhieuXuatKhoHdr.tongSoLuong;
    })
    console.log(this.dataTableAll);
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách kết quả kiểm định sau sửa chữa',
      nzContent: DialogTableCheckBoxComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        isView : false,
        dataTable: this.dataTableAll,
        dataHeader: ['Số phiếu KĐCL', 'Đểm kho / Nhà kho / Ngăn kho / Lô kho','Ngày kiểm định','Tổng số lượng'],
        dataColumn: ['soPhieuKtcl', 'tenDiaDiem','ngayKiemDinh','numberSoLuong']
      },
    });
    modalQD.afterClose.subscribe(async (res) => {
      if (res) {
        this.spinner.show();
        this.dataTableAll = res.data;
        const dataTableChecked = res.data.filter(item => item.checked == true);
        this.dataTableView = [];
        this.map = new Map();
        if(res.data){
          let ketQuaKtra = [];
          let ketQuaId = [];
          dataTableChecked.forEach( item => {
            ketQuaKtra.push(item.soPhieuKtcl);
            ketQuaId.push(item.id);
            let data = item.scPhieuXuatKhoHdr;
            if(this.map.has(data.idScDanhSachHdr)){
              let body = this.map.get(data.idScDanhSachHdr);
              body.tongSoLuong = body.tongSoLuong + data.tongSoLuong
              body.dataPhieuKtraCl.push(item);
              this.map.set(data.idScDanhSachHdr,body)
            } else {
              let body = {
                tongSoLuong : data.tongSoLuong,
                dataRow : data.scDanhSachHdr,
                dataPhieuKtraCl : [item]
              }
              this.map.set(data.idScDanhSachHdr,body);
            }
          });
          let dataTableView = [];
          this.map?.forEach(item =>{
              item.dataRow.soLuongNhap = item.tongSoLuong;
              dataTableView.push(item.dataRow)
          })
          this.dataTableView =  chain(dataTableView).groupBy('tenChiCuc').map((value, key) => ({
              tenDonVi: key,
              children: value,
            })
          ).value();
          this.formData.patchValue({
            soPhieuKtcl : ketQuaKtra.join(' , '),
            idPhieuKtcl : ketQuaId.join(',')
          })
        }
        this.spinner.hide();
      }
    });
  }

  showSave(){
    let trangThai = this.formData.value.trangThai;
    return trangThai == STATUS.DU_THAO ;
  }

  save(isGuiDuyet?){
    this.spinner.show();
    let body = this.formData.value;
    body.fileDinhKemReq = this.fileDinhKem;
    body.fileCanCuReq = this.fileCanCu;
    let children = []
    this.map.forEach(item => {
      let body = {
        idDsHdr : item.dataRow.id,
        soLuongNhap : item.tongSoLuong,
      }
      children.push(body);
    })
    body.children = children;
    if(this.formData.value.soQd){
      body.soQd = this.formData.value.soQd + '/QĐ-CDTVT'
    }
    console.log(body);
    this.createUpdate(body).then((res)=>{
      if(res){
        if(isGuiDuyet){
          this.id = res.id;
          this.pheDuyet();
        }else{
          this.redirectDefault();
        }
      }
    })
    this.spinner.hide();
  }

  pheDuyet(){
    let trangThai
    switch (this.formData.value.trangThai) {
      case STATUS.DU_THAO :
        trangThai = STATUS.CHO_DUYET_TP;
        break;
      case STATUS.CHO_DUYET_TP :
        trangThai = STATUS.CHO_DUYET_LDC;
        break;
      case STATUS.CHO_DUYET_LDC :
        trangThai = STATUS.BAN_HANH;
        break;
    }
    this.approve(this.id,trangThai,'Bạn có muốn gửi duyệt',null,'Phê duyệt thành công');
  }

  tuChoi(){
    let trangThai
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_TP :
        trangThai = STATUS.TU_CHOI_TP;
        break;
      case STATUS.CHO_DUYET_LDC :
        trangThai = STATUS.TU_CHOI_LDC;
        break;
    }
    this.reject(this.id,trangThai);
  }

  disabled(){
    return this.formData.value.trangThai != STATUS.DU_THAO;
  }

  showPheDuyetTuChoi(){
    let trangThai = this.formData.value.trangThai;
    if(this.userService.isCuc()){
      return trangThai == STATUS.CHO_DUYET_TP || trangThai == STATUS.CHO_DUYET_LDC ;
    }
    return false
  }


}
