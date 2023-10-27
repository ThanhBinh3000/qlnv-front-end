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
    private qdScBtcService: KtKhSuaChuaBtcService,
    private tongHopDxScLon: TongHopDxScLonService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, qdScBtcService);
    this.formData = this.fb.group({
      id : [],
      nam : [],
      soQdGiaoNv : [null,[Validators.required]],
      ngayKy : [null,[Validators.required]],
      ngayHluc : [null,[Validators.required]],
      idTtr : [null,[Validators.required]],
      soTtr : [null,[Validators.required]],
      trichYeu : [null,[Validators.required]],
      trangThai : [STATUS.DANG_NHAP_DU_LIEU],
      tenTrangThai : ['Đang nhập dữ liệu'],
    })
  }

  ngOnInit(): void {
  }

  async save(isOther: boolean) {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.maDvi = this.userInfo.MA_DVI;
    // body.soQuyetDinh = body.soQuyetDinh + this.maQd;
    body.fileDinhKems = this.fileDinhKem;
    body.canCuPhapLys = this.canCuPhapLy;
    // body.chiTiets = this.dataTableReq;
    let data = await this.createUpdate(body);
    if (data) {
      if (isOther) {
        this.approve(data.id, this.STATUS.BAN_HANH, "Bạn có muốn ban hành?");
      }
    }
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
              await dataCheck.forEach(async item => {
                await this.tongHopDxScLon.getDetail(item.id).then((dtlTh)=>{
                  console.log(dtlTh.data);
                    if(dtlTh.data){
                      if(dtlTh.data.chiTiets){
                        dtlTh.data.chiTiets.forEach( dtl => {
                          this.dataTable.push(dtl);
                        })
                      }
                    }
                })
              });
              console.log(this.dataTable);
              this.spinner.hide();
            }
          }
        });
      }
    })
  }



}
