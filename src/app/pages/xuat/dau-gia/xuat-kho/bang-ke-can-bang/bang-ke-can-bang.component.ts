import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-bang-ke-can-bang',
  templateUrl: './bang-ke-can-bang.component.html',
  styleUrls: ['./bang-ke-can-bang.component.scss']
})
export class BangKeCanBangComponent implements OnInit {
  @Input() typeVthh: string;

  isDetail: boolean = false;

  status= [
    {id:'00',name:'Chờ duyệt - LĐ Chi Cục'},
    {id:'01',name:'Từ chối - LĐ Chi Cục'},
    {id:'02',name:'Đã duyệt'},
    {id:'03',name:'Dự thảo'}
    ];

  statusId:string = '00';

  async showList() {
    this.isDetail = false;
  }

  constructor() { }

  ngOnInit(): void {
  }


  redirectToChiTiet(statusName: string){
    this.isDetail = true;
    this.statusId = statusName;

  }

}
