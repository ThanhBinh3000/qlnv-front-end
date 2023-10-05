import {
  Component,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { DialogCanCuHopDongComponent } from 'src/app/components/dialog/dialog-can-cu-hop-dong/dialog-can-cu-hop-dong.component';
import { DialogQuyetDinhGiaoChiTieuComponent } from 'src/app/components/dialog/dialog-quyet-dinh-giao-chi-tieu/dialog-quyet-dinh-giao-chi-tieu.component';
import { DialogThongTinPhuLucHopDongMuaVatTuComponent } from 'src/app/components/dialog/dialog-thong-tin-phu-luc-hop-dong-mua-vat-tu/dialog-thong-tin-phu-luc-hop-dong-mua-vat-tu.component';
import { DialogThongTinPhuLucHopDongMuaComponent } from 'src/app/components/dialog/dialog-thong-tin-phu-luc-hop-dong-mua/dialog-thong-tin-phu-luc-hop-dong-mua.component';

interface ItemData {
  id: string;
  stt: string;
  cuc: string;
  soGoiThau: string;
  soDeXuat: string;
  ngayDeXuat: string;
  tenDuAn: string;
  soLuong: string;
  tongTien: string;
}
@Component({
  selector: 'thong-tin-ho-so-ky-thuat',
  templateUrl: './thong-tin-ho-so-ky-thuat.component.html',
  styleUrls: ['./thong-tin-ho-so-ky-thuat.component.scss'],
})
export class ThongTinHoSoKyThuatComponent implements OnInit {
  searchValue = '';
  searchFilter = {
    soDeXuat: '',
  };
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;
  formData: FormGroup;
  id: number;
  editId: string | null = null;
  listOfData: any[] = [{
    tenGoiThau: 'aaa'
  }];
  selectedCanCu: any = {};

  constructor(
    private router: Router,
    private routerActive: ActivatedRoute,
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.isVisibleChangeTab$.subscribe((value: boolean) => {
      this.visibleTab = value;
    });
    this.id = +this.routerActive.snapshot.paramMap.get('id');
  }

  openDialogHopDong() {
    const modalQD = this.modal.create({
      nzTitle: 'Thông tin hợp đồng',
      nzContent: DialogCanCuHopDongComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalQD.afterClose.subscribe((data) => {
      if (data) {

      }
    });
  }

  back() {
    this.router.navigate([`/nhap/dau-thau/vat-tu/ho-so-ky-thuat`])
  }
}
