import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LEVEL } from 'src/app/constants/config';
import { convertTenVthh, convertTrangThai } from 'src/app/shared/commonFunction';


@Component({
  selector: 'app-tong-cuc',
  templateUrl: './tong-cuc.component.html',
  styleUrls: ['./tong-cuc.component.scss']
})
export class TongCucComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
    router.events.subscribe((val)=>{
      this.getTitleVthh();
    })
   }
  lastBreadcrumb: string;
  loaiVthh : string;
  title : string;
  selectedTab: string ;
  async ngOnInit() {
    this.getTitleVthh();
    this.selectTabMenu('tong-hop','Tổng hợp kế hoạch lựa chọn nhà thầu');
  }

  getTitleVthh(){
    this.loaiVthh = convertTenVthh(this.route.snapshot.paramMap.get('type'));
  }

  selectTabMenu(tab,title) {
    this.selectedTab = tab;
    this.title = title
  }

}
