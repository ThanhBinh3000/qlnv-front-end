import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ThongTinKhaoSatGia} from 'src/app/models/DeXuatPhuongAnGia';
import {FileDinhKem} from 'src/app/models/FileDinhKem';
import {UploadFileService} from 'src/app/services/uploaFile.service';
import {Globals} from 'src/app/shared/globals';
import {saveAs} from 'file-saver';
import {NzModalService} from "ng-zorro-antd/modal";
import {MESSAGE} from "../../../../../../../../constants/message";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {DonviService} from "../../../../../../../../services/donvi.service";
import {UserLogin} from "../../../../../../../../models/userlogin";
import {UserService} from "../../../../../../../../services/user.service";
import {chain} from "lodash";
import {v4 as uuidv4} from "uuid";

@Component({
  selector: 'app-thong-tin-ksg',
  templateUrl: './thong-tin-ksg.component.html',
  styleUrls: ['./thong-tin-ksg.component.scss']
})
export class ThongTinKsgComponent implements OnInit, OnChanges {
  @Input() isTableKetQua: boolean;
  @Input() isTabNdKhac: boolean;
  @Input() dataTable : any[] = [];
  @Output() dataTableChange = new EventEmitter<any>();
  @Input() isView: boolean;
  @Input() dataParent : any;
  @Input() type : string;
  dataTableView : any[] = [];
  isVat: boolean;
  vat: any;
  dsChiCuc : any[] = []
  listTenDvi : any[] = []
  userInfo  : UserLogin
  isApDung: boolean = false;
  rowItem: ThongTinKhaoSatGia = new ThongTinKhaoSatGia();
  dataEdit: { [key: string]: { edit: boolean; data: ThongTinKhaoSatGia }} = {};
  expandSet = new Set<number>();
  constructor(
    private uploadFileService: UploadFileService,
    private userService: UserService,
    public globals: Globals,
    public donViService: DonviService,
    public modal: NzModalService,
    public notification: NzNotificationService,
    public spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.isVat = this.dataParent && this.dataParent.loaiGia && (this.dataParent.loaiGia == 'LG01' || this.dataParent.loaiGia == 'LG03')
    this.vat = this.dataParent && this.dataParent.vat ? this.dataParent.vat  : 0
    this.isApDung = this.dataParent && this.dataParent.apDungTatCa ? this.dataParent.apDungTatCa  : false
    this.userInfo = this.userService.getUserLogin();
    if (!this.isApDung && !this.isTabNdKhac) {
      this.buildTree(this.isTableKetQua ? 'tenDviBaoGia' : 'tenDviThamDinh');
    }
    this.loadDsChiCuc();
    this.emitDataTable();
    this.updateEditCache();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.dataParent) {
      this.rowItem.cloaiVthh = (this.dataParent.tenCloaiVthh ? this.dataParent.tenCloaiVthh  + '; ' : '') + (this.dataParent.moTa ? this.dataParent.moTa + '; ' : '') + (this.dataParent.tchuanCluong ? this.dataParent.tchuanCluong : '' )
      this.isApDung = this.dataParent.apDungTatCa;
      this.isVat = this.dataParent && this.dataParent.loaiGia && (this.dataParent.loaiGia == 'LG01' || this.dataParent.loaiGia == 'LG03');
      this.vat = this.dataParent && this.dataParent.vat ? this.dataParent.vat  : 0
    }
    this.updateEditCache();
  }


  emitDataTable() {
    this.dataTableChange.emit(this.dataTable);
  }

  onChangeCloaiVthh() {

  }


  themDataTable() {
    if(!this.dataTable){
      this.dataTable=[];
    }
    let msgRequired = this.required(this.rowItem);
    if (msgRequired) {
      this.notification.warning(MESSAGE.WARNING, msgRequired);
      this.spinner.hide();
      return;
    }
    if (!this.isTabNdKhac && this.isTableKetQua && !this.isApDung) {
      let itemKq = this.dataTable.find(item =>item.tenDviBaoGia  == this.rowItem.tenDviBaoGia && item.maChiCuc == this.rowItem.maChiCuc);
      if (itemKq) {
        this.notification.error(MESSAGE.ERROR, "Không được chọn trùng chi cục cho 1 đơn vị");
        return;
      }
    }
    if (!this.isTabNdKhac && !this.isTableKetQua && !this.isApDung) {
      let itemKq = this.dataTable.find(item =>item.tenDviThamDinh  == this.rowItem.tenDviThamDinh && item.maChiCuc == this.rowItem.maChiCuc);
      if (itemKq) {
        this.notification.error(MESSAGE.ERROR, "Không được chọn trùng chi cục cho 1 đơn vị");
        return;
      }
    }
    this.rowItem.maDvi = this.userInfo.MA_DVI;
    if (this.dataParent && this.dataParent.loaiGia && (this.dataParent.loaiGia == 'LG01' || this.dataParent.loaiGia == 'LG03')) {
      this.rowItem.donGiaVat = this.rowItem.donGia * this.vat +  this.rowItem.donGia
    }
    this.dataTable = [...this.dataTable, this.rowItem];
    this.rowItem = new ThongTinKhaoSatGia();
    this.emitDataTable();
    this.updateEditCache();
    if (!this.isTabNdKhac) {
      this.buildTree(this.isTableKetQua ? 'tenDviBaoGia' : 'tenDviThamDinh');
      if (this.isTableKetQua) {
        const thingsWithDuplicates   = this.dataTable.filter(
          (thing, i, arr) => arr.findIndex(t => t.tenDviBaoGia === thing.tenDviBaoGia) === i
        );
        if (thingsWithDuplicates  && thingsWithDuplicates.length > 0) {
          this.listTenDvi = thingsWithDuplicates.map(item => item.tenDviBaoGia)
        }
      } else {
        const thingsWithDuplicates = this.dataTable.filter(
          (thing, i, arr) => arr.findIndex(t => t.tenDviThamDinh === thing.tenDviThamDinh) === i
        );
        if (thingsWithDuplicates  && thingsWithDuplicates.length > 0) {
          this.listTenDvi = thingsWithDuplicates.map(item => item.tenDviThamDinh)
        }
      }
    }
  }

  required(item: ThongTinKhaoSatGia) {
    let msgRequired = "";
    //validator
    if (!this.isTabNdKhac && ((this.isTableKetQua && (!item.tenDviBaoGia || !item.ngayBaoGia)) || (!this.isTableKetQua && !item.tenDviThamDinh)
      || !item.cloaiVthh || !item.soLuong || !item.donGia || !item.thoiHanBaoGia || (!this.isApDung && !item.maChiCuc ) || !item.fileDinhKem) ) {
      msgRequired = "Vui lòng nhập đủ thông tin";
    }
    return msgRequired;
  }



  getNameFile(event?: any, tableName?: string, item?: FileDinhKem, type? : any) {
    if (event) {
      const element = event.currentTarget as HTMLInputElement;
      const fileList: FileList | null = element.files;
      if (fileList) {
        const itemFile = {
          name: fileList[0].name,
          file: event.target.files[0] as File,
        };
        this.uploadFileService
          .uploadFile(itemFile.file, itemFile.name)
          .then((resUpload) => {
            if (item) {
              item.fileName = resUpload.filename;
              item.fileSize = resUpload.size;
              item.fileUrl = resUpload.url;
            }
            else {
              if (!type) {
                if (!this.rowItem.fileDinhKem ) {
                  this.rowItem.fileDinhKem = new FileDinhKem();
                }
                this.rowItem.fileDinhKem.fileName = resUpload.filename;
                this.rowItem.fileDinhKem.fileSize = resUpload.size;
                this.rowItem.fileDinhKem.fileUrl = resUpload.url;
                this.rowItem.fileDinhKem.idVirtual = new Date().getTime();
              } else {
                if (!type.fileDinhKem ) {
                  type.fileDinhKem  = new FileDinhKem();
                }
                type.fileDinhKem.fileName = resUpload.filename;
                type.fileDinhKem.fileSize = resUpload.size;
                type.fileDinhKem.fileUrl = resUpload.url;
                type.fileDinhKem.idVirtual = new Date().getTime();
              }
            }
          });
      }
    }

  }


  downloadFile(item: FileDinhKem) {
    if (item && item.fileName) {
      this.uploadFileService.downloadFile(item.fileUrl).subscribe((blob) => {
        saveAs(blob, item.fileName);
      });
    }
  }

  deleteItem(index: any, data?: any) {
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
            if (data) {
              if (this.isTableKetQua) {
                this.dataTable.forEach((item, idx) => {
                  if(item.maChiCuc == data.maChiCuc && item.tenDviBaoGia == data.tenDviBaoGia ) this.dataTable.splice(idx,1);
                });
              } else {
                this.dataTable.forEach( (item, idx) => {
                  if(item.maChiCuc == data.maChiCuc && item.tenDviThamDinh == data.tenDviThamDinh ) this.dataTable.splice(idx,1);
                });
              }
              this.buildTree(this.isTableKetQua ? 'tenDviBaoGia' : 'tenDviThamDinh');
            } else {
              this.dataTable.splice(index, 1);
              this.updateEditCache();
            }
          } catch (e) {
            console.log('error', e);
          }
        },
      });
  }

  updateEditCache(): void {
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }

  saveEdit(idx: number, item: ThongTinKhaoSatGia): void {
    let msgRequired = this.required(item);
    if (msgRequired) {
      this.notification.warning(MESSAGE.WARNING, msgRequired);
      this.spinner.hide();
      return;
    }
    this.dataEdit[idx].data.donGiaVat =this.dataEdit[idx].data.donGia * this.vat + this.dataEdit[idx].data.donGia
    Object.assign(this.dataTable[idx], this.dataEdit[idx].data);
    this.dataEdit[idx].edit = false;
  }
  editRow(stt: number) {
    this.dataEdit[stt].edit = true;
  }
  cancelEdit(stt: number): void {
    this.dataEdit[stt] = {
      data: { ...this.dataTable[stt] },
      edit: false
    };
  }

  async loadDsChiCuc() {
    let res = await this.donViService.layTatCaDonViByLevel(3);
    if (res && res.data) {
      this.dsChiCuc = res.data
      this.dsChiCuc = this.dsChiCuc.filter(item => item.type != "PB" && item.maDvi.startsWith(this.userInfo.MA_DVI))
    }
  }

  async changeChiCuc(event) {
    let list = this.dsChiCuc.filter(item => item.maDvi == event)
    if(list && list.length > 0) {
      this.rowItem.tenChiCuc = list[0]?.tenDvi
    }
  }

  buildTree(type : string) {
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTableView = chain(this.dataTable)
        .groupBy(type)
        .map((value, key) => {
          return {
            tenDviBaoGia : this.isTableKetQua ? key : null,
            tenDviThamDinh : !this.isTableKetQua ? key : null,
            cloaiVthh : this.dataTable && this.dataTable.length > 0 ? this.dataTable[0].cloaiVthh : null,
            idVirtual: uuidv4(),
            children: value
          };
        }).value();
    } else {
      this.dataTableView = [];
    }
    this.expandAll();
  }

  expandAll() {
    this.dataTableView.forEach(s => {
      this.expandSet.add(s.idVirtual);
    })
  }
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  nhapLai() {
    this.rowItem = new ThongTinKhaoSatGia();
  }
}
