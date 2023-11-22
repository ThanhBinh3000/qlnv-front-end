import {Component, Input, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  KtKhSuaChuaBtcService
} from "../../../../../../services/qlnv-kho/quy-hoach-ke-hoach/kh-sc-lon-btc/kt-kh-sua-chua-btc.service";
import {
  TongHopDxScLonService
} from "../../../../../../services/qlnv-kho/quy-hoach-ke-hoach/ke-hoach-sc-lon/tong-hop-dx-sc-lon.service";
import {Validators} from "@angular/forms";
import {STATUS} from "../../../../../../constants/status";
import {
  DialogQdScBtcComponent
} from "../../quyet-dinh-sc-lon-btc/them-moi-qd-sc-btc/dialog-qd-sc-btc/dialog-qd-sc-btc.component";
import {
  DialogTableCheckBoxComponent
} from "../../../../../../components/dialog/dialog-table-check-box/dialog-table-check-box.component";
import {MESSAGE} from "../../../../../../constants/message";
import dayjs from "dayjs";
import {
  KhScQdGiaoNvService
} from "../../../../../../services/qlnv-kho/quy-hoach-ke-hoach/ke-hoach-sc-lon/khScQdGiaoNv.service";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";

@Component({
  selector: 'app-them-moi-qd-giao-nv',
  templateUrl: './them-moi-qd-giao-nv.component.html',
  styleUrls: ['./them-moi-qd-giao-nv.component.scss']
})
export class ThemMoiQdGiaoNvComponent extends Base2Component implements OnInit {

  @Input() isViewDetail: boolean;
  @Input() idInput: number;

  symbol = '/QĐ-BTC'

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private _service : KhScQdGiaoNvService,
    private tongHopDxScLon: TongHopDxScLonService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, _service);
    this.formData = this.fb.group({
      id : [],
      namKeHoach : [dayjs().get('year')],
      soQdGiaoNv : [null,[Validators.required]],
      ngayKy : [null,[Validators.required]],
      ngayHluc : [null,[Validators.required]],
      soTtr : [null,[Validators.required]],
      trichYeu : [null,[Validators.required]],
      trangThai : [STATUS.DANG_NHAP_DU_LIEU],
      tenTrangThai : ['Đang nhập dữ liệu'],
      soQdGoc : [],
      idQdGoc : [],
      lanDc : [],
      kieu : ['LD']
    })
  }

  ngOnInit(): void {
    if(this.idInput){
      this.detail(this.idInput).then((res)=>{
        this.formData.patchValue({
          soQdGiaoNv : res.soQdGiaoNv.split("/")[0]
        })
        this.dataTable = res.children;
        this.dataTable.forEach(item => {
          item.tenCongTrinh = item.ktKhDxSuaChuaLonCtiet.tenCongTrinh;
          item.soQd = item.ktKhDxSuaChuaLonCtiet.soQd;
          item.tieuChuan = item.ktKhDxSuaChuaLonCtiet.tieuChuan;
          item.tgThucHien = item.ktKhDxSuaChuaLonCtiet.tgThucHien;
          item.tgHoanThanh = item.ktKhDxSuaChuaLonCtiet.tgHoanThanh;
          item.lyDo = item.ktKhDxSuaChuaLonCtiet.lyDo;
          item.giaTriPd = item.ktKhDxSuaChuaLonCtiet.giaTriPd;
          item.namKh = item.ktKhDxSuaChuaLonCtiet.namKh;
        })
      })
    }else{
      this.changeKieu(this.formData.value.kieu)
    }
  }

  async save(isOther: boolean) {
    if(this.dataTable && this.dataTable.length == 0){
      this.notification.error(MESSAGE.ERROR, 'Danh mục sửa chữa không được để trống');
      return;
    }
    if(this.validateTable()){
      let body = this.formData.value;
      body.soQdGiaoNv = this.formData.value.soQdGiaoNv + this.symbol;
      body.fileDinhKems = this.fileDinhKem;
      body.canCuPhapLys = this.canCuPhapLy;
      body.children = this.dataTable;
      let data = await this.createUpdate(body);
      if (data) {
        if (isOther) {
          this.approve(data.id, this.STATUS.BAN_HANH, "Bạn có muốn ban hành?");
        }
      }
    }
  }

  validateTable(){
    let rs = true;
    this.dataTable.forEach( item => {
      console.log(item);
      if(item.duToanBtcDuyet <= 0){
        rs = false;
        this.notification.info(MESSAGE.ERROR,"Dự toán BTC duyệt của " + item.tenCongTrinh +" phải lớn hơn 0 ")
        return
      }
    });
    return rs
  }

  chonMaTongHop(){
    this.spinner.show();
    this.tongHopDxScLon.getListThTaoQdGiaoNv({trangThai : STATUS.DA_DUYET_LDTC}).then((res)=>{
      this.spinner.hide();
      if (res.msg == MESSAGE.SUCCESS) {
        let modalQD = this.modal.create({
          nzTitle: "SỐ TỜ TRÌNH TCDT GỬI BTC",
          nzContent: DialogTableCheckBoxComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: "700px",
          nzFooter: null,
          nzComponentParams: {
            dataTable : res.data,
            dataColumn : ['soQuyetDinh'],
            dataHeader : ['Số tờ trình TCDT gửi BTC'],
          }
        });
        modalQD.afterClose.subscribe(async (res) => {
          if (res) {
            this.dataTable = [];
            const dataCheck = res.data.filter( item => item.checked == true);
            if(dataCheck){
              this.spinner.show();
              let listToTrinh = [];
              for (const item of dataCheck) {
                 await this.tongHopDxScLon.getDetail(item.id).then((dtlTh)=>{
                   listToTrinh.push(dtlTh.data.maToTrinh);
                   if(dtlTh.data){
                     if(dtlTh.data.children){
                       dtlTh.data.children.forEach( dtl => {
                         dtl.idDxSc = dtl.id
                         dtl.idThSc = dtl.idTh
                         dtl.duToanBtcDuyet = 0;
                         this.dataTable.push(dtl);
                        })
                      }
                    }
                })
              }
              this.formData.patchValue({
                soTtr : listToTrinh.join(',')
              })
              this.spinner.hide();
            }
          }
        });
      }
    })
  }

  chonSoQdGiaoNv(){
    this.spinner.show();
    this._service.getListTaoDc({trangThai : STATUS.BAN_HANH}).then((res)=>{
      this.spinner.hide();
      if (res.msg == MESSAGE.SUCCESS) {
        let modalQD = this.modal.create({
          nzTitle: "SỐ TỜ TRÌNH TCDT GỬI BTC",
          nzContent: DialogTableSelectionComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: "700px",
          nzFooter: null,
          nzComponentParams: {
            dataTable : res.data,
            dataColumn : ['soQdGiaoNv'],
            dataHeader : ['Số quyết định giao nhiệm vụ gốc'],
          }
        });
        modalQD.afterClose.subscribe(async (res) => {
          if (res) {
              await this._service.getDetail(res.id).then((dtlTh)=>{
                console.log(dtlTh.data);
                if(dtlTh.data){
                  if(dtlTh.data){
                    this.formData.patchValue({
                      soQdGoc : res.soQdGiaoNv,
                      idQdGoc : dtlTh.data.id,
                      lanDc : dtlTh.data.listDieuChinh.length + 1
                    });
                    if(dtlTh.data.listDieuChinh != null && dtlTh.data.listDieuChinh.length == 0){
                      this.dataTable = dtlTh.data.children;
                      this.dataTable.forEach(item => {
                        item.tenCongTrinh = item.ktKhDxSuaChuaLonCtiet.tenCongTrinh;
                        item.soQd = item.ktKhDxSuaChuaLonCtiet.soQd;
                        item.tieuChuan = item.ktKhDxSuaChuaLonCtiet.tieuChuan;
                        item.tgThucHien = item.ktKhDxSuaChuaLonCtiet.tgThucHien;
                        item.tgHoanThanh = item.ktKhDxSuaChuaLonCtiet.tgHoanThanh;
                        item.lyDo = item.ktKhDxSuaChuaLonCtiet.lyDo;
                        item.giaTriPd = item.ktKhDxSuaChuaLonCtiet.giaTriPd;
                        item.namKh = item.ktKhDxSuaChuaLonCtiet.namKh;
                      })
                    }else{
                      // Gét lastest DC đã ordet trên BE
                      const dataLastestDC = dtlTh.data.listDieuChinh[0];
                      console.log(dataLastestDC)
                      this._service.getDetail(dataLastestDC.id).then((dataLastestDc)=>{
                        const data = dataLastestDc.data
                        this.dataTable = data.children;
                        this.dataTable.forEach(item => {
                          item.tenCongTrinh = item.ktKhDxSuaChuaLonCtiet.tenCongTrinh;
                          item.soQd = item.ktKhDxSuaChuaLonCtiet.soQd;
                          item.tieuChuan = item.ktKhDxSuaChuaLonCtiet.tieuChuan;
                          item.tgThucHien = item.ktKhDxSuaChuaLonCtiet.tgThucHien;
                          item.tgHoanThanh = item.ktKhDxSuaChuaLonCtiet.tgHoanThanh;
                          item.lyDo = item.ktKhDxSuaChuaLonCtiet.lyDo;
                          item.giaTriPd = item.ktKhDxSuaChuaLonCtiet.giaTriPd;
                          item.namKh = item.ktKhDxSuaChuaLonCtiet.namKh;
                          item.vonDauTuTcdt = item.ktKhDxSuaChuaLonCtiet.vonDauTuTcdt;
                        })
                      });
                    }
                  }
                }
              })
              this.spinner.hide();
            }
        });
      }
    })
  }

  changeKieu(event: any) {
    if (event) {
      this.formData.patchValue({
        soQdGiaoNv: null,
        idQdGiaoNv: null,
        soQdBtc: null,
        idQdBtc: null,
      })
      if (event == 'LD') {
        this.formData.controls['soTtr'].setValidators([Validators.required]);
        this.formData.controls['soQdGoc'].clearValidators();
        this.formData.controls['idQdGoc'].clearValidators();
        this.formData.controls['lanDc'].clearValidators();
      } else {
        this.formData.controls['soTtr'].clearValidators();
        this.formData.controls['soQdGoc'].setValidators([Validators.required]);
        this.formData.controls['idQdGoc'].setValidators([Validators.required]);
        this.formData.controls['lanDc'].setValidators([Validators.required]);
      }
      this.dataTable = [];
    }
  }

  deleteRow(data){
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          let indexData = this.dataTable.indexOf(data);
          this.dataTable = this.dataTable.filter((item, index) => index != indexData);
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

}
