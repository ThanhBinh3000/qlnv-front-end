import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-xuat-hang',
  templateUrl: './xuat-hang.component.html',
  styleUrls: ['./xuat-hang.component.scss']
})
export class XuatHangComponent implements OnInit {
  defaultUrl: string = 'sua-chua/xuat-hang'
  constructor(
    private router: Router,
    public globals: Globals,
  ) {

  }

  ngOnInit(): void {
  }

  redirectUrl(url) {
    this.router.navigate([this.defaultUrl + url]);
  }

}
