import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TablaRestApiService } from './tabla-rest-api.service';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FieldErrorDisplayModule } from '../app/shared/field-error-display/field-error-display.module';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { getDutchPaginatorIntl } from './traducciones/spanish-paginator';

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
  MAT_DATE_LOCALE,
  DateAdapter,
  MAT_DATE_FORMATS,
  MatFormFieldModule,
  MatPaginatorIntl

} from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { AppComponent } from './app.component';

import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule } from './shared/navbar/navbar.module';
import { FixedpluginModule } from './shared/fixedplugin/fixedplugin.module';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { QRCodeModule } from 'angular2-qrcode';

// Componentes
import { CancelacionComponent } from './Cancelacion/cancelacion/cancelacion.component';
import { EstablecimientoComponent } from './Cancelacion/establecimiento/establecimiento.component';
import { OpcionesComponent } from './Cancelacion/opciones/opciones.component';
import { CeseComponent } from './cese/cese.component';
import { CeseFuncionarioODiplomaticoComponent } from './cese-funcionario-o-diplomatico/cese-funcionario-o-diplomatico.component';

// Rutas
import { APP_ROUTING } from './app.routes';

// Servicios
import { Servicios } from './servicios/servicios.service';
import { ApiProxyService } from './servicios/api-proxy.service';
import { ValidacionesService } from './servicios/validaciones.service';

// recaptcha
import { RecaptchaModule } from 'ng-recaptcha';

// fileupload
import { BrowserModule } from '@angular/platform-browser';

// import { FileSelectDirective } from 'ng2-file-upload';
import { FormRecaptchaComponent } from './form-recaptcha/form-recaptcha.component';
import { AuthInterceptor } from './http-interceptors/auth-interceptor';
import { WebcamModule } from 'ngx-webcam';
import { DatosContadorComponent } from './datos-contador/datos-contador.component';
import { DatosRepresentanteComponent } from './datos-representante/datos-representante.component';
import { FormularioInscripcionComponent } from './formulario-inscripcion/formulario-inscripcion.component';
import { IdentificacionEmpresaComponent } from './identificacion-empresa/identificacion-empresa.component';
import { DialogoRequisitosComponent } from './formulario-inscripcion/dialogo-requisitos';
import { CeseFusionAbsorcionComponent } from './cese/cese-fusion-absorcion/cese-fusion-absorcion.component';
import { AutofocusDirective } from './cese/autofocus.directive';





@NgModule({
   exports: [
      MatAutocompleteModule,
      MatButtonModule,
      MatButtonToggleModule,
      MatCardModule,
      MatCheckboxModule,
      MatChipsModule,
      MatStepperModule,
      MatDatepickerModule,
      MatDialogModule,
      MatExpansionModule,
      MatGridListModule,
      MatIconModule,
      MatInputModule,
      MatListModule,
      MatMenuModule,
      MatNativeDateModule,
      MatPaginatorModule,
      MatProgressBarModule,
      MatProgressSpinnerModule,
      MatRadioModule,
      MatRippleModule,
      MatSelectModule,
      MatSidenavModule,
      MatSliderModule,
      MatSlideToggleModule,
      MatSnackBarModule,
      MatSortModule,
      MatTableModule,
      MatTabsModule,
      MatToolbarModule,
      MatTooltipModule,
      MatFormFieldModule
   ],
  providers: [TablaRestApiService,
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl() }
  ]

})
export class MaterialModule { }

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    APP_ROUTING,
    HttpModule,
    HttpClientModule,
    MaterialModule,
    MatNativeDateModule,
    NavbarModule,
    FooterModule,
    FixedpluginModule,
    ReactiveFormsModule,
    RecaptchaModule.forRoot(),
    FieldErrorDisplayModule,
    BrowserModule,
    WebcamModule,
    MatDialogModule,
    QRCodeModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    FormRecaptchaComponent,
    CancelacionComponent,
    EstablecimientoComponent,
    DatosContadorComponent,
    DatosRepresentanteComponent,
    FormularioInscripcionComponent,
    IdentificacionEmpresaComponent,
    DialogoRequisitosComponent,
    OpcionesComponent,
    CeseComponent,
    CeseFusionAbsorcionComponent,
    CeseFuncionarioODiplomaticoComponent,
    AutofocusDirective
  ],
  providers: [
    Servicios,
    ApiProxyService,
    ValidacionesService
   /*  {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    } */
  ],
  bootstrap: [AppComponent],
  entryComponents: []

})
export class AppModule { }
