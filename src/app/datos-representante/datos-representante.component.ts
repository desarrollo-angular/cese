import { Component, ViewChild, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { Servicios } from 'app/servicios/servicios.service';
import { CargaArchivo } from 'app/formulario-inscripcion/interfaces/archivo/cargaArchivo.interface';

import { CatDato } from '../interfaces/ubicacion/catDato.interface';
import { Contribuyente } from '../interfaces/datos-representante/contribuyente.interface';
import { ContribuyenteIndividual } from '../interfaces/datos-representante/contribuyente-individual.interface';
import { CondicionEspecialDato } from '../interfaces/datos-representante/condicion-especial-dato.interface';
import { EstadoDato } from '../interfaces/datos-representante/estado-dato.interface';
import { Representante } from './representante';
import { Constantes } from 'app/util/constantes';

/* INICIO_CARGA_ARCHIVOS */
import swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DomSanitizer, SafeUrl, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
/* FIN_CARGA_ARCHIVOS */

/*
  jadamian 05.03.2019: 
  se hacen modificaciones en .ts y .html para que el componente pueda ser reutilizado 
  cuando el rol del usuario sea colaboradorDelegadoRTU, en base a las modificaciones que
  se deducen del CU Inscripción colaborador delegado RTU Empresa/Organización v.1.0.
  Se agrega la variable rolColaboradorDelegadoRTU de tipo boolean, la cual se inicializa
  en el método inicializarForma, en base al valor recibido por el componente que lo llama.
  Se agrega el campo correoElectronico.
*/

declare const $: any;

@Component({
  selector: "app-datos-representante",
  templateUrl: "./datos-representante.component.html"
})
export class DatosRepresentanteComponent implements OnInit {

  //jadamian 05.03.2019 se agrega la variable tipoRole para recibir el rol del usuario conectado.
  tipoRole: string;
  @Input()
  set _tipotipoRole(pRole: string) {
    this.tipoRole = pRole;
  }

  constantes: Constantes = new Constantes;
  /** Comunicación con el formulario de inscripción, amoecheve*/

  @Output() _datosRepresentanteSalida = new EventEmitter<string>();
  datosRepresentanteSalida: string;
  datosEntrada: string;
  @Output() _datosRepresentanteSalidaTabla = new EventEmitter<string>();
  datosRepresentanteSalidaTabla: string;


  @Input()
  set _datosRepresentanteEntrada(datos: string) {
    console.log("_datosRepresentanteEntrada " + datos);
    if (datos) {
      this._outDatosRepresentante = datos;
    }
  }

  /* Comunicación con el formulario de inscripción, amoecheve*/

  /* COMUNICACION CON COMPONENTE DATOS-REPRESENTANTE-TABLA */

  /* variable asociada a una variable en el otro componente */
  /* que tiene un listener que detecta cambios en ésta */
  _outDatosRepresentante: string;
  _outDatosRepresentanteCorrelativo: number = 0;

  /* Función que se ejecuta al momento de generarse un evento */
  /* en el otro componente asociado a ésta variable */
  @Input() set _inDatosRepresentante(datos: string) {
    console.log('_inDatosRepresentante ' + datos);
    if (datos) {
      this.RecibirDatos(datos);
    }
  }

  recibirDatosRepresentantes(datos: string) {
    console.log('recibirDatosRepresentantes ' + datos);
    if (datos) {
      this.listaRepresentantes = JSON.parse(datos);
      this.RecibirDatos(datos);
      this.enviarAInscripcion();
    }
  }

  recibirListaRepresentantes(datos: string) {
    console.log('recibirListaRepresentantes ' + datos);
    if (datos) {
      this.listaRepresentantes = JSON.parse(datos);
      this.enviarAInscripcion();
    }
  }
  listaRepresentantes: Representante[];
  @Input()
  set _inListaRepresentante(datos: string) {
    console.log('datos_represetante _inListaRepresentante ' + datos);
    if (datos) {
      this.listaRepresentantes = JSON.parse(datos);
      this.enviarAInscripcion();
    }
  }

  @Input()
  set _inListaRepresentanteInscripcion(datos: string) {
    console.log('datos_represetante _inListaRepresentanteInscripcion ' + datos);
    if (datos) {
      this.listaRepresentantes = JSON.parse(datos);
      this.enviarATabla();

    }
  }

  enviarAInscripcion() {
    console.log("enviarAInscripcion " + JSON.stringify(this.listaRepresentantes));
    this._datosRepresentanteSalida.emit(JSON.stringify(this.listaRepresentantes));
    this.datosRepresentanteSalida = JSON.stringify(this.listaRepresentantes);
  }

  enviarATabla() {

    this._datosRepresentanteSalidaTabla.emit(JSON.stringify(this.listaRepresentantes));
    this.datosRepresentanteSalidaTabla = JSON.stringify(this.listaRepresentantes);
    console.log("enviarATabla " + this.datosRepresentanteSalidaTabla);

  }


  /* COMUNICACION CON COMPONENTE DATOS-REPRESENTANTE-TABLA */


  /* COMUNICACION CON COMPONENTE CARGA-ARCHIVO */

  /**
  * aalruanoe archivo
  */
  listaArchivos: CargaArchivo;

  //16.11.18 aalruanoe se agrega para el envío de codigo gestion entre pantallas por carga de archivo
  codigoGestion: string;

  @Input()
  set _codigoGestion(codigo: string) {
    console.log("datos " + codigo);
    this.codigoGestion = codigo;
    console.log("this.codigoGestion " + this.codigoGestion);
  }

  datosSalidaArchivo: CargaArchivo;
  @Input()
  set _datosArchivo(datos: CargaArchivo) {
    console.log("datos-representante.datosArchivos " + JSON.stringify(datos));
    //aalruanoe 20.11.2018
    //se define el id del documento 01 de prueba para Documento de Dirección se debe obtener del catálogo
    //jadamian 24.02.2019 se asigna el id del documento indicado en caso de uso (v.1.0)
    this.datosSalidaArchivo = datos;
    this.datosSalidaArchivo.idDocumento = this.constantes.CODIGO_DOCUMENTO_REPRESENTACION_LEGAL;
  }

  datosSalida: string;

  //16.11.18 aalruanoe se agrega para el envío de codigo gestion entre pantallas por carga de archivo


  /* COMUNICACION CON COMPONENTE CARGA-ARCHIVO */

  inputForm: FormGroup;

  listaTiposRepresentante: Array<CatDato> = [];
  listaTiposEstado: Array<EstadoDato> = [];
  private listaAnios: Array<string> = [];
  private tipoEstadoSeleccionado: Array<EstadoDato>;

  private condicionEspecialDato: CondicionEspecialDato;

  msgAviso: string = null;
  msgExito: string = null;
  msgError: string = null;
  private txtError: string = null;

  mostrarListaAnios: boolean;
  private esInscripcion: boolean = true;

  fechaActual: Date = new Date();
  anioActual = this.fechaActual.getFullYear();
  fechaMinima = new Date(1900, 0, 1);
  fechaMaxima = new Date(this.anioActual, 11, 31);

  documentoAdjunto: CargaArchivo;

  rolColaboradorDelegadoRTU : boolean;

  /* URL DE LOS SERVICIOS */

  /* INICIO_CARGA_ARCHIVOS */
  archivoAdjunto: CargaArchivo;
  fileAdjunto: File = null;
  urlArchivoAdjunto: SafeResourceUrl;
  cargaExitosaAdjunto: boolean;
  isImageLoading: boolean;
  archivoValido: boolean;
  sanitization: DomSanitizer;
  urlPdf: string;
  filePreviewPath: SafeUrl;
  safehtml: SafeHtml;
  imagen: any;
  /* FIN_CARGA_ARCHIVOS */

  /* METODOS LLAMADOS DESDE LA FORMA */
  onChangeForm() {
    console.log("onChangeForm");
  }

  onChangeNitRepresentante(valorSeleccionado: any) {
    this.EstandarWebValidacion1_Formato("nitRepresentante");
    if (!this.txtError) this.EstandarWebValidacion1_NIT("nitRepresentante");
  }

  onSelectionChangeTipoRepresentante(valorSeleccionado: any) {
    this.TraerDatoEspecialRepresentante();
  }

  onChangeFechaNombramiento(valorSeleccionado: any) {
    this.inputForm.controls["fechaInscripcion"].setErrors(null);

    /*jadamian 04.03.2019 si es un Colaborador-Delegado se asigna la fecha actual como fecha de Inscripción,
                          ya que no se indica en el CU-Inscripción Colaborador-Delegado RTU Empresa-Organización v.1.0 */
    if (this.rolColaboradorDelegadoRTU) {
      this.inputForm.get("fechaInscripcion").setValue(this.fechaActual);
    }

    this.ValidarFechaMenorActual("fechaNombramiento");
    if (!this.txtError) this.ValidarInscripcionMayorNombramiento();
    this.CalcularFechaVigente();
  }

  onChangeFechaInscripcion(valorSeleccionado: any) {
    this.ValidarInscripcionMayorNombramiento();
  }

  onSelectionChangeAniosRepresentacion(valorSeleccionado: any) {
    this.ValidarFA03();
    this.CalcularFechaVigente();
  }

  onSelectionChangeEstadoRepresentante(valorSeleccionado: any) {
    this.tipoEstadoSeleccionado = this.listaTiposEstado.filter(function (el) {
      return el.codigo === valorSeleccionado;
    });
  }

  onAgregar() {
    this.inputForm.controls["fechaInscripcion"].setErrors(null);
    this.inputForm.controls["fechaInscripcion"].updateValueAndValidity();
    this.inputForm.controls["fechaNombramiento"].setErrors(null);
    this.inputForm.controls["fechaNombramiento"].updateValueAndValidity();
    this.inputForm.controls["nitRepresentante"].setErrors(null);
    this.inputForm.controls["nitRepresentante"].updateValueAndValidity();

    this.msgAviso = null;
    this.msgExito = null;
    this.msgError = null;
    this.txtError = null;

    if (this.StringVacio(this.inputForm.get("nombreRepresentante").value))
      this.inputForm.get("nitRepresentante").setValue(null);

    this.ValidateAllFormFields(this.inputForm);

    if (this.inputForm.valid) {

      this.ValidarFechaMenorActual("fechaNombramiento");
      this.ValidarInscripcionMayorNombramiento();

      if (this.txtError) {
        this.msgAviso =
          "Error: Por favor ingrese los valores de forma correcta";
      } else {
        if (
          this.StringVacio(this.inputForm.get("nombreRepresentante").value)
        ) {
          this.msgAviso =
            "Error: Por favor ingrese los Nombres y apellidos del representante";
        } else {
          this.msgExito = "Datos agregados a la tabla";
          this.ShowNotification("top", "center", "success", this.msgExito);
          this.EnviarDatos();
        }
      }
    } else {
      this.msgAviso = "Error: Debe llenar todos los campos obligatorios (*)";
    }

    if (this.msgAviso != null)
      this.ShowNotification("top", "center", "warning", this.msgAviso);
  }

  onLimpiar() {
    this.InicializarForma();
  }

  onInputNumber(campoIngresado: any) {
    campoIngresado.target.value
      ? this.inputForm.controls[campoIngresado.target.name].setErrors(null)
      : this.inputForm.controls[campoIngresado.target.name].setErrors({
        pattern: true
      });
  }

  onChangeNumber(campoIngresado: any) {
    campoIngresado.target.value
      ? this.inputForm.controls[campoIngresado.target.name].setErrors(null)
      : this.inputForm.get(campoIngresado.target.name).setValue(null);
  }

  /* METODOS LLAMADOS DESDE EL COMPONENTE */
  EnviarDatos() {
    if (this.inputForm) {
      let datosRepresentante: Representante = new Representante();
      datosRepresentante.nit = this.inputForm.get("nitRepresentante").value;
      datosRepresentante.nombre = this.inputForm.get("nombreRepresentante").value;
      datosRepresentante.tipo = this.inputForm.get("tipoRepresentante").value;
      datosRepresentante.fechaNombramiento = this.inputForm.get("fechaNombramiento").value;
      datosRepresentante.fechaInscripcion = this.inputForm.get("fechaInscripcion").value;
      datosRepresentante.aniosRepresentacion = this.inputForm.get("aniosRepresentacion").value;
      datosRepresentante.fechaVigenteHasta = this.inputForm.get("fechaVigenteHasta").value;
      datosRepresentante.estado = this.inputForm.get("estadoRepresentante").value;
      datosRepresentante.descEstado = this.tipoEstadoSeleccionado[0].descripcion;
      datosRepresentante.documentoAdjunto = this.documentoAdjunto;
      datosRepresentante.correoElectronico = this.inputForm.get("correoElectronico").value;

      this._outDatosRepresentanteCorrelativo++;
      datosRepresentante.correlativo = this._outDatosRepresentanteCorrelativo;
      console.log("datosRepresentante.correlativo " + datosRepresentante.correlativo);
      /* COMUNICACION CON OTRO COMPONENTE */
      /* Se asignan a la variable que que está asociada con el otro componente */
      /* los datos ingresados, en formato json. */
      console.log("this._outDatosRepresentante " + JSON.stringify(datosRepresentante));
      this._outDatosRepresentante = JSON.stringify(datosRepresentante);
      console.log(this._outDatosRepresentante);
      /* COMUNICACION CON OTRO COMPONENTE */

      this.InicializarForma();
    }
  }

  RecibirDatos(datos: string) {
    if (this.inputForm) {
      let datosRepresentante: Representante = JSON.parse(datos);
      this.inputForm.get("nitRepresentante").setValue(datosRepresentante.nit);
      this.inputForm.get("nombreRepresentante").setValue(datosRepresentante.nombre);
      this.inputForm.get("tipoRepresentante").setValue(datosRepresentante.tipo);
      this.inputForm.get("fechaNombramiento").setValue(new Date(datosRepresentante.fechaNombramiento));
      this.inputForm.get("fechaInscripcion").setValue(new Date(datosRepresentante.fechaInscripcion));
      this.inputForm.get("aniosRepresentacion").setValue(datosRepresentante.aniosRepresentacion);
      this.documentoAdjunto = datosRepresentante.documentoAdjunto;
      this.inputForm.get("correoElectronico").setValue(datosRepresentante.correoElectronico);

      this.inputForm.get("fechaVigenteHasta").setValue(new Date(datosRepresentante.fechaVigenteHasta));
      this.inputForm.get("estadoRepresentante").setValue(datosRepresentante.estado);

      if (datosRepresentante.fechaVigenteHasta)
        this.inputForm.get("fechaVigenteHasta").setValue(new Date(datosRepresentante.fechaVigenteHasta));
      else
        this.inputForm.get("fechaVigenteHasta").setValue(datosRepresentante.fechaVigenteHasta);

      if (datosRepresentante.aniosRepresentacion)
        this.inputForm.get("listaAniosRepresentacion").setValue(datosRepresentante.aniosRepresentacion);
      else
        this.inputForm.get("listaAniosRepresentacion").setValue("Indefinido");

      this.tipoEstadoSeleccionado = this.listaTiposEstado.filter(function (el) {
        return el.codigo === parseInt(datosRepresentante.estado);
      });

      this.inputForm.controls["listaAniosRepresentacion"].enable();
      this.mostrarListaAnios = true;
      this.servicios
        .getData(
          this.servicios.URL_DATO,
          'condiciones',
          this.inputForm.get("tipoRepresentante").value + "/" + this.constantes.TIPO_REPRESENTANTE,
          false
        )
        .subscribe(
          (data: CondicionEspecialDato) => {
            this.condicionEspecialDato = data;

            if (!this.StringVacio(this.condicionEspecialDato.valor)) {
              this.inputForm.controls["listaAniosRepresentacion"].disable();
              this.mostrarListaAnios = false;
            }
          },
          error => {
            let errorString = JSON.stringify(error);
            let errorJson = JSON.parse(errorString);

            if (errorJson.error.status != "404") {
              console.error(
                "Error al verificar dato especial del Representante: " +
                errorJson.error.userMessage
              );
              this.msgError =
                "Error grave: Error al verificar dato especial del Representante";
              this.ShowNotification("top", "center", "danger", this.msgError);
            }
          },
          () => { }
        );
    }
  }

  EstandarWebValidacion1_Formato(nombreCampo: any) {
    let valorCampo: string = this.inputForm.get(nombreCampo).value;

    valorCampo = valorCampo.replace(new RegExp(" ", "gi"), "").trim(); // 1. eliminar espacios en blanco
    valorCampo = valorCampo.replace(new RegExp("-", "gi"), "").trim(); // 2. eliminar guiones altos en cualquier posición
    valorCampo = valorCampo.replace(new RegExp("_", "gi"), "").trim(); // 2. eliminar guiones bajos en cualquier posición
    valorCampo =
      valorCampo.substr(0, valorCampo.length - 1) +
      valorCampo.substr(valorCampo.length - 1, 1).toUpperCase(); // 4. digito de la derecha a mayúscula
    this.inputForm.get(nombreCampo).setValue(valorCampo);

    if (valorCampo === "00") {
      // 7. Si el valor ingresado es “00” mostrar mensaje de error
      this.inputForm.controls[nombreCampo].setErrors({ incorrecto: true });
      this.txtError = "Error. El NIT es inválido";
    } else this.txtError = null;
  }

  EstandarWebValidacion1_NIT(nombreCampo: any) {
    let valorCampo: string = this.inputForm.get(nombreCampo).value;
    this.inputForm.get("nombreRepresentante").setValue(null);

    if (this.StringVacio(this.txtError) && !this.StringVacio(valorCampo)) {
      this.servicios
        .getData(this.servicios.URL_CONTRIBUYENTE, 'sat_contribuyente', valorCampo, false)
        .subscribe(
          (data: Contribuyente) => {
            let datosContribuyente: Contribuyente;
            console.log(data);
            datosContribuyente = data;

            if (datosContribuyente.status != "A") {
              // 9. Si el valor ingresado es diferente a “A” mostrar mensaje de error
              this.inputForm.controls[nombreCampo].setErrors({
                incorrecto: true
              });
              this.txtError = "Error. El NIT no está “Activo”";
            } else {
              if (datosContribuyente.tipoNit == 1) {
                // Contribuyente Individual

                this.servicios
                  .getData(
                    this.servicios.URL_CONTRIBUYENTE_INDIVIDUAL,
                    'rtu_contribuyente_individual',
                    valorCampo,
                    false
                  )
                  .subscribe(
                    (data: ContribuyenteIndividual) => {
                      let datosContribuyenteIndividual: ContribuyenteIndividual;
                      console.log(data);
                      datosContribuyenteIndividual = data;

                      if (datosContribuyenteIndividual.fechaFallecimiento) {
                        // 8. Si el valor ingresado tiene fecha de fallecimiento mostrar mensaje de error
                        this.inputForm.controls[nombreCampo].setErrors({
                          incorrecto: true
                        });
                        this.txtError =
                          "Error. El NIT se encuentra inactivo por fecha de fallecimiento";
                      } else {
                        this.inputForm
                          .get("nombreRepresentante")
                          .setValue(
                            this.FormatearNombreContribuyente(
                              datosContribuyenteIndividual
                            )
                          );
                      }
                    },
                    error => {
                      let errorString = JSON.stringify(error);
                      let errorJson = JSON.parse(errorString);
                      console.error(
                        "Error al verificar NIT Individual: " +
                        errorJson.error.userMessage
                      );
                      this.msgError =
                        "Error grave: Error al verificar NIT Individual";
                      this.ShowNotification(
                        "top",
                        "center",
                        "danger",
                        this.msgError
                      );
                    },
                    () => { }
                  );
              }
            }
          },
          error => {
            let errorString = JSON.stringify(error);
            let errorJson = JSON.parse(errorString);

            if (errorJson.error.status == "404") {
              // 6. Si el valor ingresado no existe mostrar el mensaje de error
              this.inputForm.controls[nombreCampo].setErrors({
                incorrecto: true
              });
              this.txtError = "Error. El NIT no existe en la SAT";
            } else {
              console.error(
                "Error al verificar NIT: " + errorJson.error.userMessage
              );
              this.msgError = "Error grave: Error al verificar NIT";
              this.ShowNotification("top", "center", "danger", this.msgError);
            }
          },
          () => { }
        );
    }
  }

  FormatearNombreContribuyente(contribuyente: ContribuyenteIndividual) {
    let nombre;
    nombre =
      contribuyente.primerNombre +
      " " +
      contribuyente.segundoNombre +
      " " +
      contribuyente.primerApellido +
      " " +
      contribuyente.segundoApellido;
    if (contribuyente.apellidoCasada)
      nombre += " DE " + contribuyente.apellidoCasada;
    return nombre;
  }

  ValidarFechaMenorActual(nombreCampo: any) {
    let valorCampo: any = this.inputForm.get(nombreCampo).value;
    if (valorCampo > this.fechaActual) {
      this.inputForm.controls[nombreCampo].setErrors({ incorrecto: true });
      this.txtError =
        "Error. La fecha seleccionada no puede ser mayor a fecha actual";
    } else {
      this.inputForm.controls[nombreCampo].setErrors(null);
      this.inputForm.controls[nombreCampo].updateValueAndValidity();
      this.txtError = null;
    }
  }

  ValidarInscripcionMayorNombramiento() {
    if (
      this.inputForm.get("fechaInscripcion").value <
      this.inputForm.get("fechaNombramiento").value
    ) {
      this.inputForm.controls["fechaInscripcion"].setErrors({
        incorrecto: true
      });
      this.txtError =
        "Error: Fecha de inscripción menor a fecha de nombramiento";
    } else {
      this.inputForm.controls["fechaInscripcion"].setErrors(null);
      this.inputForm.controls["fechaInscripcion"].updateValueAndValidity();
      this.txtError = null;
    }
  }

  ValidarFA03() {
    if (this.inputForm.get("listaAniosRepresentacion").value == "Indefinido")
      this.inputForm.get("aniosRepresentacion").setValue(null);
    else
      this.inputForm
        .get("aniosRepresentacion")
        .setValue(this.inputForm.get("listaAniosRepresentacion").value);
  }

  CalcularFechaVigente() {
    this.inputForm.get("fechaVigenteHasta").setValue(null);
    if (this.inputForm.get("aniosRepresentacion").value) {
      if (this.inputForm.get("fechaNombramiento").value) {
        let fecha: Date = new Date(
          this.inputForm.get("fechaNombramiento").value
        );
        fecha.setFullYear(
          fecha.getFullYear() +
          parseInt(this.inputForm.get("aniosRepresentacion").value)
        );
        fecha.setDate(fecha.getDate() - 1);
        this.inputForm.get("fechaVigenteHasta").setValue(fecha);
      }
    }
  }

  InicializarEstado() {
    const toSelect = this.listaTiposEstado.find(
      c => c.descripcion.toUpperCase() === "ACTIVO"
    );
    if (toSelect) {
      this.inputForm.get("estadoRepresentante").setValue(toSelect.codigo);
      this.tipoEstadoSeleccionado = this.listaTiposEstado.filter(function (el) {
        return el.codigo === toSelect.codigo;
      });
    }
  }

  /* METODOS GENERICOS LLAMADOS DESDE EL COMPONENTE */
  InicializarForma() {
    this.inputForm.reset();
    this.InicializarCamposDeLaForma(this.inputForm);
    this.InicializarEstado();
    this.documentoAdjunto = null;
    this.mostrarListaAnios = false;
    this.msgAviso = null;
    this.msgExito = null;
    this.msgError = null;
    this.txtError = null;

    //jadamian 05.03.2019 se verifica si el rol es de un colaborador/delegado segun el valor recibido
    this.rolColaboradorDelegadoRTU = (this.tipoRole && this.tipoRole == 'rolColaboradorDelegadoRTU') ? true : false;
    this.limpiarArchivos(1);
  }

  InicializarCamposDeLaForma(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      formGroup.get(field).setValue(null);
    });
  }

  ValidateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.ValidateAllFormFields(control);
      }
    });
  }

  StringVacio(cadena: String) {
    let resultado: boolean;
    if (typeof cadena === "string")
      resultado = cadena == "null" || cadena.length == 0;
    else resultado = cadena == null;
    return resultado;
  }

  /* DEFINICION DEL CONSTRUCTOR */
  constructor(private servicios: Servicios, private formBuilder: FormBuilder,
    /* INICIO_CARGA_ARCHIVOS */
    private sanitizer: DomSanitizer
    /* FIN_CARGA_ARCHIVOS */
    ) { }

  /* NOTIFICACIONES */
  ShowNotification(
    from: any,
    align: any,
    tipoNotificacion: string,
    textoNotificacion: string
  ) {
    $.notifyClose();
    $.notify(
      {
        icon: "notifications",
        message: textoNotificacion
      },
      {
        type: tipoNotificacion,
        timer: 1000,
        placement: {
          from: from,
          align: align
        },
        newest_on_top: true,
        template:
          '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0} alert-with-icon" role="alert">' +
          '<button mat-raised-button type="button" aria-hidden="true" class="close" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
          '<i class="material-icons" data-notify="icon">notifications</i> ' +
          '<span data-notify="title">{1}</span> ' +
          '<span data-notify="message">{2}</span>' +
          '<div class="progress" data-notify="progressbar">' +
          '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          "</div>" +
          '<a href="{3}" target="{4}" data-notify="url"></a>' +
          "</div>"
      }
    );
  }

  /* LLAMADAS A LOS SERVICIOS DE CATALOGOS */

  TraerTiposRepresentante() {
    this.servicios
      .getData(this.servicios.URL_DATO, 'cat_dato_by_catalogo', this.constantes.CODIGO_CAT_TIPO_REPRESENTANTE_LEGAL, false)
      .subscribe(
        (data: Array<CatDato>) => {
          this.listaTiposRepresentante = data;
          console.log(data);
        },
        error => {
          console.error("Error al buscar tipos de representante: " + error);
          this.msgError =
            "Error grave: no se encontraron datos de tipos de representante";
          this.ShowNotification("top", "center", "danger", this.msgError);
        }
      );
  }

  TraerDatoEspecialRepresentante() {
    this.inputForm.get("fechaVigenteHasta").setValue(null);
    this.inputForm.get("aniosRepresentacion").setValue(null);
    this.inputForm.controls["listaAniosRepresentacion"].enable();
    this.mostrarListaAnios = true;

    this.servicios
      .getData(
        this.servicios.URL_DATO,
        'condiciones',
        this.inputForm.get("tipoRepresentante").value + "/" + this.constantes.TIPO_REPRESENTANTE,
        false
      )
      .subscribe(
        (data: CondicionEspecialDato) => {
          this.condicionEspecialDato = data;
          console.log(data);

          if (!this.StringVacio(this.condicionEspecialDato.valor)) {
            this.inputForm
              .get("aniosRepresentacion")
              .setValue(this.condicionEspecialDato.valor);
            this.inputForm.get("listaAniosRepresentacion").setValue(null);
            this.inputForm.controls["listaAniosRepresentacion"].disable();
            this.mostrarListaAnios = false;
            this.CalcularFechaVigente();
          }
        },
        error => {
          let errorString = JSON.stringify(error);
          let errorJson = JSON.parse(errorString);

          if (errorJson.error.status != "404") {
            console.error(
              "Error al verificar dato especial del Representante: " +
              errorJson.error.userMessage
            );
            this.msgError =
              "Error grave: Error al verificar dato especial del Representante";
            this.ShowNotification("top", "center", "danger", this.msgError);
          }
          this.CalcularFechaVigente();
        },
        () => { }
      );
  }

  TraerTiposEstado() {
    this.servicios.getData(this.servicios.URL_DATO, 'estado_dato', null, false).subscribe(
      (data: Array<EstadoDato>) => {
        this.listaTiposEstado = data;
        console.log(data);
        this.InicializarEstado();
      },
      error => {
        console.error("Error al buscar tipos de estado: " + error);
        this.msgError =
          "Error grave: no se encontraron datos de tipos de estado";
        this.ShowNotification("top", "center", "danger", this.msgError);
      }
    );
  }

  TraerListaAnios() {
    let i: number;
    let numStr: string;
    for (i = 1; i <= 10; i++) {
      this.listaAnios.push(i.toString());
    }
    this.listaAnios.push("Indefinido");
  }


  ngOnInit() {
    /* LLENADO DE CATALOGOS */
    this.TraerTiposRepresentante();
    this.TraerTiposEstado();
    this.TraerListaAnios();

    /* SE DEFINEN LOS CAMPOS DE LA FORMA */
    this.inputForm = this.formBuilder.group({
      nitRepresentante: ["", Validators.required],
      nombreRepresentante: new FormControl({ value: null, disabled: true }),
      tipoRepresentante: [0, Validators.required],
      fechaNombramiento: ["", Validators.required],
      fechaInscripcion: ["", Validators.required],
      aniosRepresentacion: new FormControl({ value: "", disabled: true }),
      fechaVigenteHasta: new FormControl({ value: "", disabled: true }),
      estadoRepresentante: [null, Validators.required],
      listaAniosRepresentacion: new FormControl({ value: "", disabled: false }),
      correoElectronico: ['', [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
    });

    this.InicializarForma();
  }

  /* INICIO_CARGA_ARCHIVOS */
  /**Metodo de mostrar alertas */
  Alerta(type: any) {
    if (type == 'CargaExito') {
      swal({
        title: "¡Documento cargado satisfactoriamente!",
        buttonsStyling: false,
        confirmButtonClass: "btn btn-blue-sat"
      }).catch(swal.noop)

    }
    //[FA 02]
    if (type == 'CargaTamanioFallo') {
      swal({
        title: 'Error. Tamaño de archivo excede el máximo permitido de 10 Mb.',
        text: '',
        type: 'error',
        confirmButtonClass: "btn btn-blue-sat",
        buttonsStyling: false
      }).catch(swal.noop)
    }
    //[FA 02]
    if (type == 'CargaFormatoFallo') {
      swal({
        title: 'Error. El formato de archivo no es permitido.',
        text: '',
        type: 'error',
        confirmButtonClass: "btn btn-blue-sat",
        buttonsStyling: false
      }).catch(swal.noop)
    }
    //[FA 03]
    if (type == 'eliminarArchivoAdjunto') {
      swal({
        title: 'Eliminar',
        text: '¿Esta seguro de eliminar el documento?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
        confirmButtonClass: "btn btn-blue-sat",
        cancelButtonClass: "btn btn-danger",
        buttonsStyling: false
      }).then((result) => {
        if (result.value) {
          this.eliminarArchivo(this.archivoAdjunto, this.fileAdjunto);
          this.limpiarArchivos(1);
        } else {
          //[FA 04]
          swal({
            title: 'Eliminación cancelada',
            text: '',
            type: 'error',
            confirmButtonClass: "btn btn-blue-sat",
            buttonsStyling: false
          }).catch(swal.noop)

        }
      }
      )
    }
  }
  /**
     * Metodo que capta el error http
     * @param error error http
     */
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      if (error.status == 200) {
        console.log("carga-archivo: sin error HttpErrorResponse");
      } else {
        console.error('carga-archivo: Ocurrio un error:', error.error.message);
      }

    } else {
      if (error.status == 200) {
        console.log("carga-archivo: sin error HttpErrorResponse");
      } else {
        console.error(
          'carga-archivo::Codigo de respuesta ' + error.status +
          ', body was: ' + error.error);
      }
    }
    return throwError(
      'carga-archivo: Algo malo paso, por favor intente mas tarde.');
  };

  /**
    * Método que elimina del S3 la imagen
    */
  eliminarArchivo(archivo: CargaArchivo, archivoEliminar: File) {
    this.servicios.deleteArchivoS3(this.servicios.URL_DOCUMENTO_S3, archivo.carpetaArchivo, archivoEliminar.name)
      .subscribe(resultado => {
        console.log("resultado de eliminacion" + JSON.stringify(resultado));
      },
        error => {
          console.error("Ocurrió un Error al eliminar " + JSON.stringify(error));
        },
        () => {
          console.log("eliminación realizada correctamente");

        }),
      catchError(this.handleError);
  }

  /**
   * Metodo que se encarga de obtener del S3 el archivo
   */
  obtenerArchivo(tipo: number) {
    let archivo: CargaArchivo;
    let fileObtener: File;
    let cargaExitosa: boolean;
    switch (tipo) {
      case 1:
        archivo = this.archivoAdjunto;
        fileObtener = this.fileAdjunto;
        cargaExitosa = this.cargaExitosaAdjunto;
        break;
      case 2:
        break;
      default:
        cargaExitosa = false;
        break;
    }
    if (cargaExitosa === true) {
      this.isImageLoading = false;
      console.log(this.servicios.URL_DOCUMENTO_S3 + "/" + archivo.carpetaArchivo + "/" + fileObtener.name);
      this.servicios.getArchivoS3(this.servicios.URL_DOCUMENTO_S3, archivo.carpetaArchivo, fileObtener.name)
        .subscribe(resultado => {
          this.crearImagen(resultado, tipo);
          this.isImageLoading = false;
        },
          error => {
            console.error("Ocurrió un Error al descargar " + JSON.stringify(error));
          },
          () => {
            console.log("descarga realizada correctamente ");
          }),
        catchError(this.handleError);
    }

  }

  /**
 * Método que limpia el archivo
 */
  limpiarArchivos(tipo: number) {

    switch (tipo) {
      case 1:
        this.fileAdjunto = null;
        this.cargaExitosaAdjunto = false;
        this.urlArchivoAdjunto = null;
        break;
      case 2:
      default:
        this.archivoValido = false;
        break;
    }

    this.archivoValido = false;
    this.documentoAdjunto = null;
  }

  /**
   * Metodo que carga el archivo desde el cliente
   * @param files Lista de archivos
   */
  handleFileInput(files: FileList, tipo: number) {
    let tamanio: number;
    switch (tipo) {
      case 1:
        this.fileAdjunto = files.item(0);
        console.log(' fileAdjunto nombre ' + this.fileAdjunto.name);
        console.log('fileAdjunto tamaño byte ' + this.fileAdjunto.size);
        console.log((this.fileAdjunto.size / 1048576).toFixed(2) + " MB");
        tamanio = Number((this.fileAdjunto.size / 1048576).toFixed(2));
        if (tamanio > 10) {
          console.log('Excede el maximo del tamaño');
          this.limpiarArchivos(tipo);
          this.Alerta('CargaTamanioFallo');
        }
        this.archivoValido = this._esValido(this.fileAdjunto.type);
        if (!this.archivoValido) {
          this.limpiarArchivos(tipo);
          this.Alerta('CargaFormatoFallo');
        }
        break;
      case 2:
        break;
      default:
        console.log("handleFileInput tipo de archivo no definido")
        break;
    }
    console.log('archivoValido: ' + this.archivoValido)
  }

  /**
   * Método que valida el formato del archivo según Caso de uso
   * @param tipoArchivo formato del archivo
   */
  private _esValido(tipoArchivo: string): boolean {

    console.log('tipoArchivo ' + tipoArchivo);

    if (tipoArchivo === '' || tipoArchivo === undefined) {
      return false;
    }
    else {
      if (tipoArchivo === 'image/jpeg' || tipoArchivo === 'image/png' || tipoArchivo === 'application/pdf') {
        return true;
      }
    }
  }

  /**
 * Metodo para crear una imagen del resultado del S3
 * @param image imagen
 */
  crearImagen(image: Blob, tipo: number) {
    console.log("a crear imagen");
    let reader = new FileReader();
    let urlArchivo: SafeResourceUrl;

    reader.addEventListener("loadend", () => {
      this.imagen = reader.result;
      console.log("imageToShow " + JSON.stringify(this.imagen));
    }, false);
    if (image) {
      //se sanitiza la url del archivo
      console.log("URL " + window.URL.createObjectURL(image));
      this.filePreviewPath = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(image)));
      console.log("this.filePreviewPath " + this.filePreviewPath);
      if (!image.type.startsWith("image")) {

        urlArchivo = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(image));

        console.log("es pdf " + urlArchivo);

      } else {
        urlArchivo = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(image));

      }
      switch (tipo) {
        case 1:
          this.urlArchivoAdjunto = urlArchivo;
          break;
        case 2:
        default:
          break;
      }

    }
  }
  /**
    * Método que envía al S3 el archivo de consititucion
    */
  cargarArchivo(tipo: number) {
    let archivo: CargaArchivo;
    switch (tipo) {
      case 1:
        this.archivoAdjunto = {
          identificador: `${this.servicios.URL_DOCUMENTO_S3}/${this.codigoGestion}/${this.fileAdjunto.name}`,
          nombre: this.fileAdjunto.name,
          documento: this.fileAdjunto,
          tipoDocumento: this.fileAdjunto.type,
          idDocumento: this.constantes.CODIGO_DOCUMENTO_REPRESENTACION_LEGAL,
          carpetaArchivo: this.codigoGestion,
          cargado: true
        };
        archivo = this.archivoAdjunto;
        console.log(this.fileAdjunto);
        break;
      case 2:
        break;
      default:
        console.log("cargarArchivo tipo de archivo no definido");
        break;
    }

    //aalruanoe 01.11.18 se modifica para realizar la carga a un folder en el S3
    this.servicios.putArchivoS3(this.servicios.URL_DOCUMENTO_S3, archivo.carpetaArchivo, archivo)
      .subscribe((resultado) => {
        console.log("resultado de carga" + JSON.stringify(resultado));
        this.Alerta('CargaExito');
        if (tipo == 1) {
          this.cargaExitosaAdjunto = true;
          this.documentoAdjunto = archivo;
        } else if (tipo == 2) {
          null;
        }
      },
        (error) => {
          console.error("Ocurrió un Error" + error);
          console.error(error);
        },
        () => {
          console.log("carga realizada correctamente");
        });

  }
  /* FIN_CARGA_ARCHIVOS */
}
