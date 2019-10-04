import { Directive, ElementRef, AfterViewInit, Input, AfterContentInit } from '@angular/core';

@Directive({
  selector: '[appAutofocus]'
})
export class AutofocusDirective implements AfterContentInit{

  @Input() public autoFocus: boolean;
  public constructor(private el: ElementRef) { }

  public ngAfterContentInit(): void {
    setTimeout(() => {
      this.el.nativeElement.focus();
    }, 500)
  }

}
