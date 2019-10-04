import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Servicios } from 'app/servicios/servicios.service';
import { SatContribuyenteNombres } from '../interfaces/contribuyentes/SatContribuyentesNombres.interface';
import { SatContribuyenteDatos } from '../interfaces/contribuyentes/sat-contribuyentes-datos.interface';
import { SatContribuyenteIndividual } from 'app/interfaces/sat_contribuyente-individual.interface';
import { CatDatoByDatoPadre } from 'app/interfaces/catDatoByDatoPadre.interface';
import { CatDato } from 'app/interfaces/catDato.interface';
import { stringify } from 'querystring';

@Component({
  selector: 'app-cese-funcionario-o-diplomatico',
  templateUrl: './cese-funcionario-o-diplomatico.component.html',
  styleUrls: ['./cese-funcionario-o-diplomatico.component.scss']
})
export class CeseFuncionarioODiplomaticoComponent implements OnInit {
  formulario: FormGroup;
  datosContribuyente: SatContribuyenteNombres;
  ob: any = {nit: ''};
  nombreContribuyente: string;
  existeContribuyente: boolean = false;
  controlCarga: boolean = false;
  nit: string;
  tipoDocumento: string;
  tipoPersona: Number;
  persona: string;
  // objeto con información de contribuyente
   informacionContribuyente = {
    nombreContribuyente: '',
    cuiPassaporte: '',
    codigoNacionalidad: 0,
    nacionalidad: '',
    tipoPersoneria: ''
  };
  // objeto para tipo personeria

  constructor(private servicio: Servicios) {
    this.formulario = new FormGroup({
      nit: new FormControl('', Validators.required)
    });
   }

  ngOnInit() {
  }

  // caso de uso estandares web validacion 1
  // Valida el nit cuando el contribuyente presiona el boton cosultar
  enviar() {
    this.nit = this.formulario.value.nit;
    this.servicio.getData(this.servicio.URL_NITS, 'validaciones/estructuras', this.nit, false)
    .subscribe(res => {
      if (res === false){
        this.formulario.setErrors({'invalidNit': true});
      } else{
        this.formulario.setErrors({'invalidNit': false});
        // consulta si el nit existe en RTU
        this.servicio.getData(this.servicio.URL_NITS, 'validaciones/registrados', this.nit, false)
        .subscribe(resReg => {
          if (resReg === false) {
            this.formulario.setErrors({'non-existentNit': true});
          } else {
            this.formulario.setErrors({'non-existentNit':false});
            // verifica que el nit ingresado es 00 (GENERICO)
            if (this.formulario.value.nit === '00') {
              this.formulario.setErrors({'non-genericNit': true});
            } else {
              this.formulario.setErrors({'non-genericNit': false});
              this.servicio.getData(this.servicio.URL_SAT_CONTRIBUYENTES, 'datos', this.nit, false)
              .subscribe((resContribuyente: SatContribuyenteDatos) => {
                if (resContribuyente != null && resContribuyente.fechaFallecimiento != null) {
                  // existe registro del contribuyente con fecha de fallecimiento
                  this.formulario.setErrors({'fallecimientoNit': true});
                  console.log(res);
                } else{
                  this.formulario.setErrors({'fallecimientoNit': false});
                   // obtiene los datos del contribuyente para validar si cuenta con estado activo
                   this.servicio.getData(this.servicio.URL_SAT_CONTRIBUYENTES, 'nombres', this.nit, false)
                .subscribe((data: SatContribuyenteNombres) => {
                   let datosContribuyente: SatContribuyenteNombres;
                   datosContribuyente = data;
                   console.log(datosContribuyente);
                   if (datosContribuyente.estado === 1020 || datosContribuyente.estado === 1029) {
                    console.log('activo ');
                    this.formulario.setErrors({'inactiveNit': false});
                    console.log(datosContribuyente);
                    if (datosContribuyente.razonSocial != null) {
                      this.nombreContribuyente = datosContribuyente.razonSocial;
                      this.obtener_info_contribuyent();
                            this.existeContribuyente = true;
                            this.controlCarga = false;
                    } else {
                      if (datosContribuyente.primerNombre === null) {
                        datosContribuyente.primerNombre = ' ';
                      }
                      if (datosContribuyente.segundoNombre === null) {
                        datosContribuyente.segundoNombre = ' ';
                      }
                      if (datosContribuyente.tercerNombre === null) {
                        datosContribuyente.tercerNombre = ' ';
                      }
                      if (datosContribuyente.primerApellido === null) {
                        datosContribuyente.primerApellido = ' ';
                      }
                      if (datosContribuyente.segundoApellido === null) {
                        datosContribuyente.segundoApellido = ' ';
                      }
                      this.nombreContribuyente =
                            datosContribuyente.primerNombre + ' ' +
                            datosContribuyente.segundoNombre + ' ' +
                            datosContribuyente.tercerNombre + ' ' +
                            datosContribuyente.primerApellido + ' ' +
                            datosContribuyente.segundoApellido;
                            this.obtener_info_contribuyent();
                            this.existeContribuyente = true;
                            this.controlCarga = false;
                    }
                    // this.nombreContribuyente=;
                   } else {
                    console.log('todo todo mal');
                    this.formulario.setErrors({'inactiveNit': true});
                   }
                });
                }
              });
            }
          }
        });
      }

    });
  }
  // obtiene la información asociada al contribuyente mostrandose en los campos solo de lectura
  obtener_info_contribuyent() {
    this.nit = this.formulario.value.nit;
    // console.log( "ruta------->" + (this.servicio.URL_CONTRIBUYENTE_INDIVIDUAL + '/' + this.nit));
    this.servicio.getData(this.servicio.URL_CONTRIBUYENTE_INDIVIDUAL, null , this.nit, false)
      .subscribe((resContribIndividual: SatContribuyenteIndividual) => {
        if (resContribIndividual != null ) {
          if (resContribIndividual.cui != null) {
            this.tipoDocumento = 'CUI';
            this.informacionContribuyente.cuiPassaporte = resContribIndividual.cui;
            } else {
              this.tipoDocumento = 'Pasaporte';
              this.informacionContribuyente.cuiPassaporte = resContribIndividual.pasaporte;
            }
            this.informacionContribuyente.codigoNacionalidad = resContribIndividual.codigoNacionalidad;
            this.getContribuyente(this.nit);
            this.getNacionalidad(resContribIndividual.codigoNacionalidad.toString());
        } else {
          // verificar cuando el nit es juridico!
        }
        // verificar la nacionalidad
     console.log(resContribIndividual.cui);
     }, err => {
      console.log('No hay cui Contribuyente Individual', err);
      this.tipoDocumento = 'CUI o Pasaporte';
      this.informacionContribuyente.cuiPassaporte = '';
     });
  }
  // ---------EVENTOS HTML
  // limpia el campo de nombre
  clean_name() {
  this.nombreContribuyente = '';
  this.controlCarga = false;
  this.tipoDocumento = 'CUI o Passaporte';
  this.informacionContribuyente.cuiPassaporte= '';
  }

  // Verifica que no cuente con simbolos no permitidos
  omit_special_char(event) {
    let k;
    k = event.keyCode;
    // console.log(k);
    const e = <KeyboardEvent>event;
      if (e.key === 'Tab' || e.key === 'TAB') {
       return;
      }
      if ((k > 64 && k < 91) || (k > 96 && k < 123) || k === 189 || k === 32 || (k >= 48 && k <= 57)) {
        return;
      }
    e.preventDefault();
    }
    // Convierte a mayuscula el caracter
    validaUpper(event){
      this.ob.nit = this.ob.nit.toUpperCase() + '';
    }

    infoCarga() {
      this.controlCarga = true;
    }
    getContribuyente(nit: string) {
      this.servicio.getData(`${this.servicio.URL_CONTRIBUYENTE}/codtipo`, null, nit, false)
        .subscribe(res => {
          this.persona = (res === 0) ? 'Persona Individual' : 'Empresa/Organización';
          this.informacionContribuyente.tipoPersoneria = this.persona;
          console.log(this.persona);
        }, error => {
          this.persona = '';
          console.error('No se pudo obtener el tipo de persona', error);
        });
    }
    getNacionalidad(idCodigo: string){
     let descripcionNacionalidad = '';
      this.servicio.getData(`${this.servicio.URL_CATALOGOS}`, 'cat_dato_by_catalogo_padre', '236' , false)
        .subscribe((resNacionalidad) => {
          resNacionalidad.forEach( element => {
            if (element.codigoIngresado === idCodigo) {
              //console.log(element.codigoIngresado);
              console.log(idCodigo+"----"+ element.descripcion );
              this.informacionContribuyente.nacionalidad = element.descripcion;
            }
          });
        });
        return descripcionNacionalidad;
    }
}

