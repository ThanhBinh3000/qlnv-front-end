import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import { Validators} from "@angular/forms";
import {Base2Component} from "../../../../../components/base2/base2.component";
import {chain} from 'lodash';
import {v4 as uuidv4} from 'uuid';
import { saveAs } from 'file-saver';
import {
  MmThongTinNcChiCuc
} from "../../de-xuat-nhu-cau-chi-cuc/thong-tin-de-xuat-nhu-cau-chi-cuc/thong-tin-de-xuat-nhu-cau-chi-cuc.component";
import {MmDxChiCucService} from "../../../../../services/mm-dx-chi-cuc.service";
import {MESSAGE} from "../../../../../constants/message";
import dayjs from "dayjs";
import {QuyetDinhMuaSamService} from "../../../../../services/quyet-dinh-mua-sam.service";
import {DialogMmMuaSamComponent} from "../../../../../components/dialog/dialog-mm-mua-sam/dialog-mm-mua-sam.component";
import {MmThongTinPhanBoCtComponent} from "./mm-thong-tin-phan-bo-ct/mm-thong-tin-phan-bo-ct.component";
import { STATUS } from '../../../../../constants/status';

  @Component({
    selector: 'app-mm-them-moi-tt-phan-bo',
    templateUrl: './mm-them-moi-tt-phan-bo.component.html',
    styleUrls: ['./mm-them-moi-tt-phan-bo.component.scss']
  })
  export class MmThemMoiTtPhanBoComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  listTongHop: any[] = [];
  maQd: string
  listDxChiCuc: any[];
  rowItem: MmThongTinNcChiCuc = new MmThongTinNcChiCuc();
  dataEdit: { [key: string]: { edit: boolean; data: MmThongTinNcChiCuc } } = {};
  expandSet = new Set<number>();

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private dxChiCucService: MmDxChiCucService,
    private qdMuaSamService: QuyetDinhMuaSamService
  ) {
    super(httpClient, storageService, notification, spinner, modal, qdMuaSamService)
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null],
      namKeHoach: [dayjs().get('year'), Validators.required],
      soVb: [null, Validators.required],
      soQdMs: [null, Validators.required],
      trichYeu: [null, Validators.required],
      ngayKy: [null, Validators.required],
      trangThai: [STATUS.DANG_NHAP_DU_LIEU],
      tenTrangThai: ['Đang nhập dữ liệu'],
      fileDinhKems: [null],
      lyDoTuChoi: [null],
      listQlDinhMucQdMuaSamDtlReq: [null],
      // listQlDinhMucQdMuaSamDtl: [null],
      loai : ['01'],
      noiDung : [null],
      ghiChu : [null]
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.maQd = '/' + this.userInfo.MA_QD
      await this.loadDsDxCc();
      if (this.id > 0) {
        await this.detail(this.id);
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }


  async loadDsDxCc() {
    this.spinner.show();
    try {
      let body = {
        "loai": "00",
        "paggingReq": {
          "limit": 10,
          "page": 0
        },
        "capDvi" : this.userInfo.CAP_DVI,
        "maDvi" : this.userInfo.MA_DVI,
      }
      let res = await this.qdMuaSamService.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.listTongHop = data.content;
        if (this.listTongHop) {
          this.listTongHop = this.listTongHop.filter(item => item.trangThai == this.STATUS.BAN_HANH )
        }
      } else {
        this.listTongHop = [];
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.spinner.hide();
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

    async loadListDxCuaChiCuc(qdMuaSam) {
      if (qdMuaSam) {
        this.listDxChiCuc = [];
        let rs = await this.dxChiCucService.getListDxChiCucTheoIdTongHopTC(qdMuaSam.maTh);
        if (rs.msg == MESSAGE.SUCCESS) {
          this.listDxChiCuc = rs.data;
        }
      }
    }

  async save() {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      this.spinner.hide();
      return;
    }
    if (this.checkTableHhSave(this.dataTable)) {
      this.notification.error(MESSAGE.ERROR, 'Chưa phân bổ hết hàng hóa!!!')
      this.spinner.hide();
      return;
    }
    this.conVertTreToList();
    if (this.fileDinhKem && this.fileDinhKem.length > 0) {
      this.formData.value.fileDinhKems = this.fileDinhKem;
    }
    this.formData.value.listQlDinhMucQdMuaSamDtlReq = this.dataTable;
    this.formData.value.maDvi = this.userInfo.MA_DVI;
    let body = this.formData.value;
    body.soVb = body.soVb + this.maQd
    let data = await this.createUpdate(body);
    if (data) {
        this.goBack()
    }
  }

  checkTableHhSave(dataTable : any[]) : boolean {
    let check = false
    if (dataTable && dataTable.length > 0) {
      dataTable.forEach(item => {
        if (!item.dataChild) {
          check = true
        }
      })
    } else {
      check = true;
    }
    return check;
  }

  async detail(id) {
    this.spinner.show();
    try {
      let res = await this.qdMuaSamService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.formData.patchValue({
            soVb : this.formData.value.soVb ? this.formData.value.soVb.split('/')[0] : null
          })
          this.fileDinhKem = data.listFileDinhKems;
          this.dataTable = data.listQlDinhMucQdMuaSamDtl;
          if(this.userService.isChiCuc()) {
            this.dataTable = this.dataTable.filter(item => item.maDvi = this.userInfo.MA_DVI)
          }
          this.convertListData()
          this.expandAll();
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        this.spinner.hide();
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e);
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }


  conVertTreToList() {
    let arr = [];
    this.dataTable.forEach(item => {
      if (item.dataChild && item.dataChild.length > 0) {
        item.dataChild.forEach(data => {
          data.thanhTienNc = data.donGiaTd * data.soLuong
          arr.push(data)
        })
      }
    })
    this.dataTable = arr
  }


  expandAll() {
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach(s => {
        this.expandSet.add(s.idVirtual);
      })
    }
  }


  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  async changSoTh(event) {
    if (this.listTongHop && this.listTongHop.length > 0) {
      let result = this.listTongHop.filter(item => item.id = event)
      if (result && result.length > 0) {
        let detailTh = result[0]
        let res = await this.qdMuaSamService.getDetail(detailTh.id);
        if (res.msg == MESSAGE.SUCCESS) {
          if (res.data) {
            const data = res.data;
            if (data && data.listQlDinhMucQdMuaSamDtl && data.listQlDinhMucQdMuaSamDtl.length > 0 ) {
              this.dataTable = data.listQlDinhMucQdMuaSamDtl.filter(it => it.maDvi == this.userInfo.MA_DVI);
            }
            if (this.dataTable && this.dataTable.length > 0) {
              this.dataTable.forEach(item => {
                item.id = null;
                item.ghiChu = null;
              })
              this.expandAll();
            }
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg)
        }
      }
    }
  }

  sumSlPb(item  :any) {
    let slPb = item.soLuongTc ? item.soLuongTc : 0;
    let slChild = 0
    let result = 0;
    if (item.dataChild && item.dataChild.length > 0 ) {
      item.dataChild.forEach(item => {
        slChild = slChild + item.soLuong ? item.soLuong : 0
      })
    }
    result = slPb - slChild
    return result;
  }

  chonMaTongHop() {
    if (!this.isView) {
      let modalQD = this.modal.create({
        nzTitle: 'DANH SÁCH QUYẾT ĐỊNH MUA SẮM',
        nzContent: DialogMmMuaSamComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '700px',
        nzFooter: null,
        nzComponentParams: {
          listTh: this.listTongHop,
          type : this.formData.value.loai
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          this.formData.patchValue({
            soQdMs : data.soQd
          })
          this.loadListDxCuaChiCuc(data);
          await this.changSoTh(data.id);
        }
      })
    }
  }

    convertListData() {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable = chain(this.dataTable).groupBy('tenTaiSan').map((value, key) => ({
            tenTaiSan: key,
            dataChild: value,
            idVirtual: uuidv4(),
          })
        ).value()
      }
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach(item => {
          if (item && item.dataChild && item.dataChild.length > 0) {
            item.dataChild.forEach(data => {
              item.donViTinh = data.donViTinh
              item.maTaiSan = data.maTaiSan
              item.soLuongTc = data.soLuongTc
            })
          }
        })
      }
      this.expandAll();
    }

    openModalCt(data : any, type :string, idx : number, list?:any) {
      if (!this.isView) {
        let modalQD = this.modal.create({
          nzTitle: type == 'them' ? 'Thêm mới chi tiết thông tin phân bổ' : 'Chỉnh sửa chi tiết thông tin phân bổ',
          nzContent: MmThongTinPhanBoCtComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: '1000px',
          nzStyle: { top: '200px' },
          nzFooter: null,
          nzComponentParams: {
            dataInput : data,
            type : type,
            listDxChiCuc: this.listDxChiCuc,
            sum : this.sumSlPb(list)
          },
        });
        modalQD.afterClose.subscribe(async (detail) => {
          if(detail) {
            if (!data.dataChild) {
              data.dataChild = []
            }
            if (!data.idVirtual) {
              data.idVirtual = uuidv4();
            }
            if(type == 'them') {
              data.dataChild.push(detail)
            } else {
              if (list) {
                Object.assign(list.dataChild[idx], detail);
              }
            }
            this.expandAll()
          }
        })
      }
    }
    deleteItem(index: any, y : any) {
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
            if (this.dataTable && this.dataTable.length >0 && this.dataTable[index]) {
              if ( this.dataTable[index] &&  this.dataTable[index].dataChild &&  this.dataTable[index].dataChild[y]) {
                this.dataTable[index].dataChild.splice(y, 1);
              }
            }
          } catch (e) {
            console.log('error', e);
          }
        },
      });
    }
    exportDataDetail() {
      if (this.dataTable.length > 0) {
        this.spinner.show();
        try {
          let body = this.formData.value;
          body.paggingReq = {
            limit: this.pageSize,
            page: this.page - 1
          }
          // let arrDtl = [];
          // this.dataTable.forEach(item => {
          //   if (item.dataChild && item.dataChild.length > 0) {
          //     item.dataChild.forEach(data => {
          //       data.thanhTienNc = data.donGiaTd * data.soLuong
          //       arrDtl.push(data)
          //     })
          //   }
          // })
          body.listQlDinhMucExportDetailTtpb = this.dataTable;
          // console.log(body,'bodybodybody');return;
          this.qdMuaSamService
            .exportDetailTtPhanBo(body)
            .subscribe((blob) =>
              saveAs(blob, 'danh-sach-chi-tiet-thong-tin-phan-bo-may-moc-thiet-bi-chuyen-dung.xlsx'),
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
  }

