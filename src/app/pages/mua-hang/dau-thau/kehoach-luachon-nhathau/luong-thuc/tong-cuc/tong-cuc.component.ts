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
  lydotuchoi = false;
  dinhkem = false;

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
  index = 0;
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
  onIndexChange(event: number): void {
    this.index = event;
    if(this.index == 0){
      this.selectTabMenu('tong-hop','Tổng hợp kế hoạch lựa chọn nhà thầu');
    } else if(this.index == 1){
      this.selectTabMenu('phuong-an','Phương án kế hoạch lựa chọn nhà thầu');
    } else if(this.index == 2){
      this.selectTabMenu('phe-duyet','Quyết định phê duyệt kế hoạch lựa chọn nhà thầu');
    }
   
  }
  tuchoi(): void {
    this.lydotuchoi = true;
  }
  filedinhkem(): void {
    this.dinhkem = true;
  }
  handleOk(): void {
    console.log('Button ok clicked!');
    this.lydotuchoi = false;
    this.dinhkem = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.lydotuchoi = false;
    this.dinhkem = false;
  }
}
