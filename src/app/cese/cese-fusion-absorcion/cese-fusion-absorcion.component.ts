import { Component, OnInit, Input, OnChanges, SimpleChanges, ElementRef, Directive, ViewChild, AfterViewInit } from '@angular/core';
import { CONTRIBUYENTE } from 'app/interfaces/interfaces-cese';
import { Servicios } from 'app/servicios/servicios.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ValidacionesService } from 'app/servicios/validaciones.service';

@Component({
  selector: 'app-cese-fusion-absorcion',
  templateUrl: './cese-fusion-absorcion.component.html',
  styleUrls: ['./cese-fusion-absorcion.component.scss']
})
export class CeseFusionAbsorcionComponent implements OnInit, OnChanges {

  @Input() contribuyente: CONTRIBUYENTE;
  formFusion: FormGroup;

  constructor(private servicio: Servicios, private validaciones: ValidacionesService) {
    this.formFusion = new FormGroup({
      nitFusion: new FormControl()
    });
  }

  ngOnInit() {
    console.log(this.contribuyente);
    // console.log('dfsf', this.validaciones.validarNit(this.servicio.NIT));
    // let objeto: any = this.validaciones.validarNit(this.servicio.NIT)
    this.validaciones.prueba(this.servicio.NIT);
  }


  ngOnChanges(change: SimpleChanges) {
    this.contribuyente = change.contribuyente.currentValue;
    console.log('Cambio', this.contribuyente);

    // Obtengo datos del contribuyente juridico
    this.servicio.getData(this.servicio.URL_CONTRIBUYENTE_JURIDICO, null, this.contribuyente.nit, false)
      .subscribe(res => {
        this.contribuyente.fechaConstitucion = res.fechaConstitucion;
        this.contribuyente.numeroDocumentoConstitucion = res.numeroDocumentoConstitucion;
        this.contribuyente.razonSocial = res.razonSocial;
      });
    // Obtengo su representante legal
    this.servicio.getData(this.servicio.URL_REPRESENTANTE_LEGAL, null, this.contribuyente.nit, false)
      .subscribe(res => {
        this.contribuyente.nitRepresentante = res[0].nitRepresentante;
        this.servicio.getData(`${this.servicio.URL_SAT_CONTRIBUYENTES}/nombres`, null, this.contribuyente.nitRepresentante, false)
          .subscribe(result => {
            // tslint:disable-next-line: max-line-length
            this.contribuyente.nombreRepresentante = `${this.cleanText(result.primerNombre)} ${this.cleanText(result.segundoNombre)} ${this.cleanText(result.tercerNombre)}`;
            // tslint:disable-next-line: max-line-length
            this.contribuyente.nombreRepresentante += `${this.cleanText(result.primerApellido)} ${this.cleanText(result.segundoApellido)} ${this.cleanText(result.apellidoCasada)}`;
          });
      });
    // Obtengo notario
    this.servicio.getData(this.servicio.URL_SAT_ABOGADOS, null, this.contribuyente.nit, false)
      .subscribe(res => {
        this.contribuyente.nitNotario = res[0].nitAbogado;
        this.servicio.getData(`${this.servicio.URL_SAT_CONTRIBUYENTES}/nombres`, null, this.contribuyente.nitNotario, false)
          .subscribe(result => {
            // tslint:disable-next-line: max-line-length
            this.contribuyente.nombreNotario = `${this.cleanText(result.primerNombre)} ${this.cleanText(result.segundoNombre)} ${this.cleanText(result.tercerNombre)}`;
            // tslint:disable-next-line: max-line-length
            this.contribuyente.nombreNotario += `${this.cleanText(result.primerApellido)} ${this.cleanText(result.segundoApellido)} ${this.cleanText(result.apellidoCasada)}`;
          });
      });
  }

  cleanText(campo: any): string {
    return (campo === null) ? '' : campo;
  }

  focus(): void {

  }

  getEstablecimientosActivos() {
    this.servicio.getData(this.servicio.URL_ESTABLECIMIENTO, 'estado/activo', this.formFusion.value.nitFusion, null);
  }

}
