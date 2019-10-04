import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldErrorDisplayComponent } from './field-error-display.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [FieldErrorDisplayComponent],
  exports: [
    FieldErrorDisplayComponent
  ]
})
export class FieldErrorDisplayModule { }
