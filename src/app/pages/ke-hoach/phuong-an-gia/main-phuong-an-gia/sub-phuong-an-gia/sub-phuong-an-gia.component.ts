import { Component, Input, OnInit } from '@angular/core';
import { TYPE_PAG } from 'src/app/constants/config';
import { UserService } from 'src/app/services/user.service';
import {Router} from "@angular/router";
import {$e} from "@angular/compiler/src/chars";

@Component({
  selector: 'app-sub-phuong-an-gia',
  templateUrl: './sub-phuong-an-gia.component.html',
  styleUrls: ['./sub-phuong-an-gia.component.scss']
})
export class SubPhuongAnGiaComponent implements OnInit {
  @Input() type: string;
  @Input() loaiVthh: string;
  chuyenTrang:boolean = false;
  typeConst: any
  constructor(
    public userService: UserService,
    public router: Router,
  ) {
    this.typeConst = TYPE_PAG;
  }
  tabSelected: number = 0;
  ngOnInit(): void {
    if (( this.type == this.typeConst.GIA_MUA_TOI_DA && this.loaiVthh == 'LT' && !this.userService.isAccessPermisson('KHVDTNSNN_PAGIA_LT_MTDBTT'))
      || (this.type == this.typeConst.GIA_CU_THE && this.loaiVthh == 'LT' && !this.userService.isAccessPermisson('KHVDTNSNN_PAGIA_LT_GCT'))
      || (this.type == this.typeConst.GIA_CU_THE && this.loaiVthh == 'VT' && !this.userService.isAccessPermisson('KHVDTNSNN_PAGIA_VT_GCT'))
      || ( this.type == this.typeConst.GIA_MUA_TOI_DA && this.loaiVthh == 'VT' && !this.userService.isAccessPermisson('KHVDTNSNN_PAGIA_VT_MTDBTT'))
    ) {
      this.router.navigateByUrl('/error/401')
    }
  }
  selectTab(tab: number) {
    this.tabSelected = tab;
  }

  checkRoleDxpag() : boolean {
    let check = false;
    if (( this.type == this.typeConst.GIA_MUA_TOI_DA && this.loaiVthh == 'LT' && this.userService.isAccessPermisson('KHVDTNSNN_PAGIA_LT_MTDBTT_DEXUAT'))
    || (this.type == this.typeConst.GIA_CU_THE && this.loaiVthh == 'LT' && this.userService.isAccessPermisson('KHVDTNSNN_PAGIA_LT_GCT_DEXUAT'))
    || (this.userService.isTongCuc() && this.type == this.typeConst.GIA_CU_THE && this.loaiVthh == 'VT' && this.userService.isAccessPermisson('KHVDTNSNN_PAGIA_VT_GCT_DEXUAT'))
    || (this.userService.isTongCuc() && this.type == this.typeConst.GIA_MUA_TOI_DA && this.loaiVthh == 'VT' && this.userService.isAccessPermisson('KHVDTNSNN_PAGIA_VT_MTDBTT_DEXUAT'))
    ) {
      check = true
    }
    return check;
  }

  chuyenTrangTc() {
    this.tabSelected = 1;
    this.chuyenTrang = true;
  }

  backChuyenTrang() {
    this.chuyenTrang = false;
  }

  protected readonly $e = $e;
}
