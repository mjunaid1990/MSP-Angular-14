import { Directive, HostListener, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appAddClassToHeader]'
})
export class AddClassToHeaderDirective {


  constructor(private el: ElementRef) { }

  @HostListener('ionScroll', ['$event']) onContentScroll($event: any) {
    let header = document.querySelector('.my-header');
    if ($event.detail.scrollTop >= 60) {
        header.classList.add('bg-white');
    } else {
      header.classList.remove('bg-white');
    }

  }

}
