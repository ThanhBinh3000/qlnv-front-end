import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-nhap-hang',
  templateUrl: './nhap-hang.component.html',
  styleUrls: ['./nhap-hang.component.scss']
})
export class NhapHangComponent implements OnInit {

  defaultUrl: string = 'sua-chua/nhap-hang'
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
