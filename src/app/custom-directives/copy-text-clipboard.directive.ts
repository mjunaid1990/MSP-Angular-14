import { Directive, ElementRef, Input, NgZone } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { fromEvent, switchMap } from 'rxjs';


@Directive({
  selector: '[appCopyTextClipboard]'
})
export class CopyTextClipboardDirective {

  @Input() copy: string;

  constructor(
    private host: ElementRef<HTMLElement>,
    private zone: NgZone,
    private toast: ToastController
  ) {
  }

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      fromEvent(this.host.nativeElement, 'click').pipe(
        switchMap(() => navigator.clipboard.writeText(this.copy)),
      ).subscribe(() => this.toast.create({
        message: 'Copied!',
        position: 'top',
        color: 'success'
      }).then((toastData) => {
        toastData.present();
        setTimeout(()=>{
          this.hideToast();
        },2000);
      })
      )
    })
  }

  hideToast() {
    this.toast.dismiss();
  }

}
