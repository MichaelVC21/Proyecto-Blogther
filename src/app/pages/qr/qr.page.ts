import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
    standalone: false,

})
export class QrPage implements OnInit {
  cuenta = '71234567';
  monto = 89.99;
  qrCodeDataURL: SafeUrl = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    const data = `Cuenta: ${this.cuenta}, Monto: ${this.monto} Bs`;
    QRCode.toDataURL(data).then((url: string) => {
      this.qrCodeDataURL = this.sanitizer.bypassSecurityTrustUrl(url);
    });
  }
}
