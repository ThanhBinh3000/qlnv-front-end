import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DanhSachDauThauService } from 'src/app/services/danhSachDauThau.service';
import { HelperService } from 'src/app/services/helper.service';
import { TongHopDeXuatKHLCNTService } from 'src/app/services/tongHopDeXuatKHLCNT.service';
import { UserService } from 'src/app/services/user.service';
import { convertTenVthh } from 'src/app/shared/commonFunction';

@Component({
  selector: 'app-trienkhai-luachon-nhathau',
  templateUrl: './trienkhai-luachon-nhathau.component.html',
  styleUrls: ['./trienkhai-luachon-nhathau.component.scss']
})
export class TrienkhaiLuachonNhathauComponent implements OnInit {

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private tongHopDeXuatKHLCNTService: TongHopDeXuatKHLCNTService,
    private danhSachDauThauService : DanhSachDauThauService,
    private modal: NzModalService,
    private userService: UserService,
    private route: ActivatedRoute,
    private helperService: HelperService
  ) {
    router.events.subscribe((val)=>{
      this.getTitleVthh();
    })
   }
  loaiVthh: string = ''
  selectedTab : string = ''
  title : string = ''
  ngOnInit(): void {
    this.selectTabMenu('thong-tin','Nhập thông tin đấu thầu');
    this.getTitleVthh();
  }

  getTitleVthh(){
    this.loaiVthh = convertTenVthh(this.route.snapshot.paramMap.get('type'));
  }

  selectTabMenu(tab,title) {
    this.selectedTab = tab;
    this.title = title
  }

}
