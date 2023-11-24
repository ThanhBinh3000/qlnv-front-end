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
      soQdGiaoNv: [null],
      idQdGiaoNv: [null],
      trangThai: [STATUS.DANG_NHAP_DU_LIEU],
      tenTrangThai: ["Đang nhập dữ liệu"],
      type: ["00"],
      kieu : ["LD"],
      soQdGoc : [],
      idQdGoc : [],
      lanDc : []
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
        this.changeKieu(this.formData.value.kieu)
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
          soQuyetDinh : res.soQuyetDinh.split('/')[0],
          soQdGiaoNv: res.soQdGiaoNv,
          idQdGiaoNv: res.idQdGiaoNv,
          soQdBtc : res.soQdBtc,
          idQdBtc : res.idQdBtc,
          lanDc : res.lanDc
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


  chonSoQdGiaoNv() {
    let body = {
      trangThai : STATUS.BAN_HANH,
      type : "00",
      phanLoai : "TREN"
    }
    this.khScQdGiaoNvService.getListTaoBtcTcdt(body).then((res)=>{
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

  conSoQdDc(){
    this.spinner.show();
    let body = {
      trangThai : STATUS.BAN_HANH,
      type : '00'
    }
    this._service.getListTaoDc(body).then((res)=>{
      this.spinner.hide();
      if (res.msg == MESSAGE.SUCCESS) {
        let modalQD = this.modal.create({
          nzTitle: "SỐ QUYẾT ĐỊNH PHÊ DUYỆT BTC",
          nzContent: DialogTableSelectionComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: "700px",
          nzFooter: null,
          nzComponentParams: {
            dataTable : res.data,
            dataColumn : ['soQuyetDinh'],
            dataHeader : ['Số quyết định của BTC'],
          }
        });
        modalQD.afterClose.subscribe(async (res) => {
          if (res) {
            await this._service.getDetail(res.id).then((dtlTh)=>{
              if(dtlTh.data){
                if(dtlTh.data){
                  this.formData.patchValue({
                    soQdGoc : res.soQuyetDinh,
                    idQdGoc : dtlTh.data.id,
                    lanDc : dtlTh.data.listDieuChinh.length + 1
                  });
                  if(dtlTh.data.listDieuChinh != null && dtlTh.data.listDieuChinh.length == 0){
                    this.dataTable = dtlTh.data.children;
                    this.dataTable.forEach(item => {
                      item.tenCuc = item.ktKhDxSuaChuaLonCtiet.tenCuc;
                      item.tenChiCuc = item.ktKhDxSuaChuaLonCtiet.tenChiCuc;
                      item.tenKhoi = item.ktKhDxSuaChuaLonCtiet.tenKhoi;
                      item.tenDiemKho = item.ktKhDxSuaChuaLonCtiet.tenDiemKho;
                      item.tenCongTrinh = item.ktKhDxSuaChuaLonCtiet.tenCongTrinh;
                      item.soQd = item.ktKhDxSuaChuaLonCtiet.soQd;
                      item.tieuChuan = item.ktKhDxSuaChuaLonCtiet.tieuChuan;
                      item.tgThucHien = item.ktKhDxSuaChuaLonCtiet.tgThucHien;
                      item.tgHoanThanh = item.ktKhDxSuaChuaLonCtiet.tgHoanThanh;
                      item.lyDo = item.ktKhDxSuaChuaLonCtiet.lyDo;
                      item.giaTriPd = item.ktKhDxSuaChuaLonCtiet.giaTriPd;
                      item.namKh = item.ktKhDxSuaChuaLonCtiet.namKh;
                      item.ncKhTongSo = item.ktKhDxSuaChuaLonCtiet.ncKhTongSo;
                      item.vonDauTuTcdt = item.ktKhDxSuaChuaLonCtiet.vonDauTuTcdt;
                    })
                  }else{
                    // Gét lastest DC đã ordet trên BE
                    const dataLastestDC = dtlTh.data.listDieuChinh[0];
                    console.log(dataLastestDC)
                    this._service.getDetail(dataLastestDC.id).then((dataLastestDc)=>{
                      const data = dataLastestDc.data
                      this.dataTable = data.children;
                      this.dataTable.forEach(item => {
                        item.tenCuc = item.ktKhDxSuaChuaLonCtiet.tenCuc;
                        item.tenChiCuc = item.ktKhDxSuaChuaLonCtiet.tenChiCuc;
                        item.tenKhoi = item.ktKhDxSuaChuaLonCtiet.tenKhoi;
                        item.tenDiemKho = item.ktKhDxSuaChuaLonCtiet.tenDiemKho;
                        item.tenCongTrinh = item.ktKhDxSuaChuaLonCtiet.tenCongTrinh;
                        item.soQd = item.ktKhDxSuaChuaLonCtiet.soQd;
                        item.tieuChuan = item.ktKhDxSuaChuaLonCtiet.tieuChuan;
                        item.tgThucHien = item.ktKhDxSuaChuaLonCtiet.tgThucHien;
                        item.tgHoanThanh = item.ktKhDxSuaChuaLonCtiet.tgHoanThanh;
                        item.lyDo = item.ktKhDxSuaChuaLonCtiet.lyDo;
                        item.giaTriPd = item.ktKhDxSuaChuaLonCtiet.giaTriPd;
                        item.namKh = item.ktKhDxSuaChuaLonCtiet.namKh;
                        item.ncKhTongSo = item.ktKhDxSuaChuaLonCtiet.ncKhTongSo;
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
        lanDc : null,
      })
      if (event == 'LD') {
        this.formData.controls['soQdGiaoNv'].setValidators([Validators.required]);
        this.formData.controls['idQdGiaoNv'].setValidators([Validators.required]);
        this.formData.controls['soQdGoc'].clearValidators();
        this.formData.controls['idQdGoc'].clearValidators();
        this.formData.controls['lanDc'].clearValidators();
      } else {
        this.formData.controls['soQdGiaoNv'].clearValidators();;
        this.formData.controls['idQdGiaoNv'].clearValidators();;
        this.formData.controls['soQdGoc'].setValidators([Validators.required]);
        this.formData.controls['idQdGoc'].setValidators([Validators.required]);
        this.formData.controls['lanDc'].setValidators([Validators.required]);
      }
    }
    this.dataTable = [];
  }


  deleteRow(rowIndex){
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
          this.dataTable = this.dataTable.filter((item, index) => index != rowIndex);
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

}
