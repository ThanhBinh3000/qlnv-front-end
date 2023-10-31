import {chain, cloneDeep} from "lodash";
import {Component, Input, OnInit} from "@angular/core";
import {Validators} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NzModalService} from "ng-zorro-antd/modal";
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {MESSAGE} from "../../../../../../constants/message";
import {
  KtKhSuaChuaBtcService
} from "../../../../../../services/qlnv-kho/quy-hoach-ke-hoach/kh-sc-lon-btc/kt-kh-sua-chua-btc.service";
import {STATUS} from "../../../../../../constants/status";
import {
  TongHopDxScLonService
} from "../../../../../../services/qlnv-kho/quy-hoach-ke-hoach/ke-hoach-sc-lon/tong-hop-dx-sc-lon.service";
import {v4 as uuidv4} from "uuid";
import {
  DialogDxScLonComponent
} from "../../de-xuat-kh-sc-lon/them-moi-sc-lon/dialog-dx-sc-lon/dialog-dx-sc-lon.component";
import {
  KhScQdGiaoNvService
} from "../../../../../../services/qlnv-kho/quy-hoach-ke-hoach/ke-hoach-sc-lon/khScQdGiaoNv.service";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import dayjs from "dayjs";

@Component({
  selector: "app-them-moi-qd-sc-btc",
  templateUrl: "./them-moi-qd-sc-btc.component.html",
  styleUrls: ["./them-moi-qd-sc-btc.component.scss"]
})
export class ThemMoiQdScBtcComponent extends Base2Component implements OnInit {

  @Input() isViewDetail: boolean;
  @Input() typeHangHoa: string;
  @Input() idInput: number;
  @Input() idTongHop: number;
  maQd: string;

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private _service: KtKhSuaChuaBtcService,
    private khScQdGiaoNvService: KhScQdGiaoNvService
  ) {
    super(httpClient, storageService, notification, spinner, modal, _service);
    super.ngOnInit();
    this.formData = this.fb.group({
      id: [null],
      soQuyetDinh: [null, Validators.required],
      namKeHoach: [dayjs().get('year'), Validators.required],
      trichYeu: [null, Validators.required],
      ngayKy: [null, Validators.required],
      soQdGiaoNv: [null, Validators.required],
      idQdGiaoNv: [null, Validators.required],
      trangThai: [STATUS.DANG_NHAP_DU_LIEU],
      tenTrangThai: ["Đang nhập dữ liệu"],
      type: ["00"]
    });
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.maQd = "/QĐ-BTC";
      await Promise.all([]);
      if (this.idInput > 0) {
        await this.getDataDetail(this.idInput);
      } else {
        // await this.loadDxCuc();
        // await this.loadListTh();
        // if (this.idTongHop && this.idTongHop > 0) {
        //   await this.changSoTh(this.idTongHop);
        // }
      }
    } catch (e) {
      console.log("error: ", e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  convertListData(table: any[]): any[] {
    let arr = [];
    if (table && table.length > 0) {
      arr = chain(table)
        .groupBy("tenCuc")
        .map((value, key) => {
          let rs = chain(value)
            .groupBy("tenChiCuc")
            .map((v, k) => {
              let rs1 = chain(v)
                .groupBy("tenKhoi")
                .map((v1, k1) => {
                    return {
                      idVirtual: uuidv4(),
                      tenKhoi: k1,
                      dataChild: v1
                    };
                  }
                ).value();
              return {
                idVirtual: uuidv4(),
                tenChiCuc: k,
                dataChild: rs1
              };
            }).value();
          return {
            idVirtual: uuidv4(),
            tenCuc: key,
            dataChild: rs
          };
        }).value();
    }
    return arr;
  }


  async getDataDetail(id) {
    if (id > 0) {
      await this.detail(id).then((res)=>{
        console.log(res);
        this.formData.patchValue({
          soQuyetDinh : res.soQuyetDinh.split('/')[0]
        })
        res.children.forEach((item)=>{
          let data = item.ktKhDxSuaChuaLonCtiet;
          data.keHoachVon = item.keHoachVon;
          data.idDxSc = item.idDxSc;
          data.phanLoai = item.phanLoai
          this.dataTable.push(data);
        })
      });
    }
  }


  async save(isOther: boolean) {
    let body = this.formData.value;
    body.soQuyetDinh = this.formData.value.soQuyetDinh + this.maQd;
    body.fileDinhKemReq = this.fileDinhKem;
    body.fileCanCuReq = this.fileCanCu;
    body.children = this.dataTable;
    let data = await this.createUpdate(body);
    if (data) {
      if (isOther) {
        this.approve(data.id, this.STATUS.BAN_HANH, "Bạn có muốn ban hành?");
      }
    }
  }


  chonMaTongHop() {
    this.khScQdGiaoNvService.getListTaoBtcTcdt({trangThai : STATUS.BAN_HANH}).then((res)=>{
      this.spinner.hide();
      if (res.msg == MESSAGE.SUCCESS) {
        let modalQD = this.modal.create({
          nzTitle: "Số QĐ giao nhiệm vụ của BTC",
          nzContent: DialogTableSelectionComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: "700px",
          nzFooter: null,
          nzComponentParams: {
            dataTable : res.data,
            dataColumn : ['soQdGiaoNv'],
            dataHeader : ['Số QĐ giao NV'],
          }
        });
        modalQD.afterClose.subscribe(async (res) => {
          if (res) {
            this.dataTable = [];
            console.log(res);
            this.spinner.show();
            if(res){
              this.khScQdGiaoNvService.getDetail(res.id).then((qdGiaoNv)=>{
                this.formData.patchValue({
                  soQdGiaoNv : res.soQdGiaoNv,
                  idQdGiaoNv : res.id
                })
                qdGiaoNv.data.children.forEach( item => {
                  console.log(item);
                  if(item.phanLoai == 'TREN15TY' && item.idQd == null){
                    let body = item.ktKhDxSuaChuaLonCtiet;
                    body.idDxSc = body.id;
                    body.ghiChu = item.ghiChu;
                    body.duToanBtcDuyet = item.duToanBtcDuyet;
                    body.keHoachVon = item.duToanBtcDuyet;
                    body.phanLoai = item.phanLoai;
                    this.dataTable.push(body);
                  }
                })
                console.log(this.dataTable);
                this.spinner.hide();
              })

            }
          }
        });
      }
    })
  }

}
