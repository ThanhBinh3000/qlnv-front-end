import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { DialogChiTietKeHoachGiaoBoNganhComponent } from 'src/app/components/dialog/dialog-chi-tiet-ke-hoach-giao-bo-nganh/dialog-chi-tiet-ke-hoach-giao-bo-nganh.component';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Globals } from 'src/app/shared/globals';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { MESSAGE } from 'src/app/constants/message';

@Component({
  selector: 'app-them-quyet-dinh-ttcp',
  templateUrl: './them-quyet-dinh-ttcp.component.html',
  styleUrls: ['./them-quyet-dinh-ttcp.component.scss'],
})
export class ThemQuyetDinhTtcpComponent implements OnInit {
  @Input('isView') isView: boolean;
  @Output('close') onClose = new EventEmitter<any>();

  formData: FormGroup;
  quyetDinh: IQuyetDinhTTCP = {
    id: null,
    soQd: null,
    namQd: null,
    ngayQd: new Date(),
    trichYeu: null,
    taiLieuDinhKem: null,
    keHoach: [],
  };
  namHienTai: number;
  taiLieuDinhKemList = [];
  dsNam: string[] = [];

  allChecked = false;
  indeterminate = false;

  searchInTable: any = {
    tenBo: null,
    keHoach: null,
  };
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;
  setOfCheckedId = new Set<number>();
  dataTable: any[] = [];
  constructor(
    private readonly fb: FormBuilder,
    private readonly modal: NzModalService,
    public globals: Globals,
    private danhMucService: DanhMucService
  ) {
    this.formData = this.fb.group(
      {
        id: [],
        soQd: [, [Validators.required]],
        ngayQd: [null, [Validators.required]],
        namKhoach: [dayjs().get('year'), [Validators.required]],
        trichYeu: [null, [Validators.required]],
      }
    );
  }

  ngOnInit(): void {
    this.loadDsNam();
  }


  loadDsNam() {
    this.namHienTai = dayjs().get('year');
    for (let i = -3; i < 23; i++) {
      this.dsNam.push((this.namHienTai - i).toString());
    }
  }

  openFile(event) {
    // if (!this.isView) {
    //   let item = {
    //     id: new Date().getTime(),
    //     text: event.name,
    //   };
    //   if (!this.taiLieuDinhKemList.find((x) => x.text === item.text)) {
    //     this.uploadFileService
    //       .uploadFile(event.file, event.name)
    //       .then((resUpload) => {
    //         if (!this.deXuatDieuChinh.fileDinhKemReqs) {
    //           this.deXuatDieuChinh.fileDinhKemReqs = [];
    //         }
    //         const fileDinhKem = new FileDinhKem();
    //         fileDinhKem.fileName = resUpload.filename;
    //         fileDinhKem.fileSize = resUpload.size;
    //         fileDinhKem.fileUrl = resUpload.url;
    //         fileDinhKem.idVirtual = item.id;
    //         this.deXuatDieuChinh.fileDinhKemReqs.push(fileDinhKem);
    //         this.taiLieuDinhKemList.push(item);
    //       });
    //   }
    // }
  }

  deleteTaiLieuDinhKemTag(data: any) {
    if (!this.isView) {
      this.taiLieuDinhKemList = this.taiLieuDinhKemList.filter(
        (x) => x.id !== data.id,
      );
    }
  }

  downloadFileKeHoach(event) { }

  viewDetail(id: number, isViewDetail: boolean) { }

  xoaItem(id: number) { }

  huy() {
    this.onClose.emit();
  }

  banHanh() { }

  luu() { }

  exportData() { }

  themKeHoach() {
    const modalQD = this.modal.create({
      nzTitle: 'Thông tin điều chỉnh của cục',
      nzContent: DialogChiTietKeHoachGiaoBoNganhComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalQD.afterClose.subscribe((data) => { });
  }


  xoaKeHoach() { }
}

interface IQuyetDinhTTCP {
  id: number;
  soQd: string;
  namQd: string;
  ngayQd: Date;
  trichYeu: string;
  taiLieuDinhKem: any;
  keHoach: any;
}
