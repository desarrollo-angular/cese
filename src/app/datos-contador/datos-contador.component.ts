import { Component, OnInit, ViewChild, Output, EventEmitter, Input, LOCALE_ID } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';
import { FormBuilder, AbstractControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Servicios } from 'app/servicios/servicios.service';
import { CatDato } from '../interfaces/ubicacion/catDato.interface';
import { SatContribuyente } from 'app/interfaces/sat-contribuyente.interface';
import { DatosAfiliaciones } from 'app/interfaces/datos-contador/afiliaciones.interface';
import { SatContribuyenteIndividual } from 'app/interfaces/sat_contribuyente-individual.interface';
import { Digito } from 'app/interfaces/datos-contador/contribuyente-digito.interface';
import { Establecimiento } from 'app/interfaces/establecimiento.interface';
import { ContadorAuditor } from 'app/interfaces/datos-contador/contadorAuditor.interface';
import { Contador } from 'app/interfaces/contador.interface';
import { ConsultaDocumentos } from 'app/interfaces/datos-contador/consultaDocumentos.interface';
import { ConsultaOmisoImpuesto } from 'app/interfaces/datos-contador/consultaOmisosImpuesto.interface';


import { Constantes } from 'app/util/constantes';


declare const $: any;


@Component({
  selector: 'app-datos-contador',
  templateUrl: './datos-contador.component.html',
  styleUrls: ['./datos-contador.component.css']
})
export class DatosContadorComponent implements OnInit {

  //variable para manejo de constantes
  constantes: Constantes = new Constantes;
  /** COMUNICACION CON OTROS COMPONENTES */
  @Output() _datosContadorSalida = new EventEmitter<string>();
  datosContadorSalida: string;
  datosEntrada: string;

  // Cargar Json Establecimientos
  @Input()
  set _datosContadorEntrada(datos: string) {
    console.log("_datosContadorEntrada " + datos);
    if (datos) {
      this.contadorAuditor = JSON.parse(datos);
      this.ConstruirFormulario();
      this.getTipoPrestacionServ();

      console.log('nitContador ' + this.contadorAuditor.nitContador);
      this.contadorForm.get('nitContador').setValue(this.contadorAuditor.nitContador);
      this.contadorForm.get('nombresApellidosCont').setValue(this.contadorAuditor.nombresApellidos);
      this.contadorForm.get('estado').setValue(this.contadorAuditor.estado);
      console.log('_datosContadorEntrada fechaNombramiento ' + this.contadorAuditor.fechaNombramiento);

      this.contadorForm.get('fechaNombramiento').setValue(this.contadorAuditor.fechaNombramiento);
      console.log('tipoPrestacionServicio ' + this.contadorAuditor.tipoPrestacionServicio);

      this.contadorForm.get('tipoPrestServicio').setValue(this.contadorAuditor.tipoPrestacionServicio);
      this.contadorForm.get('nombresApellidosCont').disable();
      this.contadorForm.get('estado').disable();
      this.validarNIT();

    } else {
      this.ConstruirFormulario();
    }
  }



  codigoGestion: string;

  @Input()
  set _codigoGestion(codigo: string) {
    console.log("datos " + codigo);
    this.codigoGestion = codigo;
    console.log("this.codigoGestion " + this.codigoGestion);
  }

  //se envia al componente que se esta consumiendo
  enviarDatosAInscripcion() {
    console.log("enviarDatosAInscripcion ");
    this.cargarContadorAuditor();
    this._datosContadorSalida.emit(
      JSON.stringify(this.contadorAuditor)
    );

  }

  /* COMUNICACION CON OTROS COMPONENTES */




  /*Formularios*/
  contadorForm: FormGroup;

  /*Campos*/
  valorCampoNit: string = "";
  valorCiiu: string = ""; // Empleado en relación de dependencia (sector público)  o (sector privado), si esta vacio o es nullo es invalida
  TxtFechaInscripcion: string;
  TxtFechaActual: string;
  TxtFechaNombramiento: string;

  fechaActual: Date = new Date();
  anioActual = this.fechaActual.getFullYear();
  fechaMinima = new Date(1900, 0, 1);
  fechaMaxima = new Date(this.anioActual, 11, 31);


  /*Validaciones*/
  validNIT: boolean = false; //Es true si el NIT cumple con todas las validaciones
  validFecha: boolean = false;  //Es true si fecha inscripcion cumple con todas las validaciones
  validPrestacion: boolean = false; //Es true si prestancion servicio cumple con todas las validaciones 

  validNitType: boolean = false;
  nitGenerico: boolean = false;
  validExiste: boolean = false;
  validFechaFallecimiento: boolean = false;
  validEstadoNit: boolean = false;
  validRegistroContadores: boolean = false;
  validEstadoContador: boolean = false;
  validFechaMenor: boolean = false;
  validFechaNombramiento: boolean = false;

  validActividadEconomica: boolean = false;
  validISR: boolean = false;
  validEstablecimientos: boolean = false;
  validIVA: boolean = false;
  validFacturas: boolean = false;
  validOmiso: boolean = false;


  //Campos necesarios por Servicios
  digitoVerificador: boolean = false;
  fechaFallecimiento: boolean = false;  /*SI fecha_de_Fallecimiento tiene datos asignar a la variable fechaFallecimiento = TRUE*/
  estadoNit: boolean = false;           /*SI Estado_Nit es diferente a "A"  asignar a la variable  estadoNit = TRUE*/
  newDate: Date; //Fecha inscripcion registro contadores y auditores

  isrAfiliacion: string = ""; //Impuesto Sobre la Renta, tipo de régimen Asalariado 

  cantEstablecimientos: number = 0;
  ivaAfiliacion: string = ""; //IVA
  factAutVigentes: boolean = false;
  esOmiso: boolean = false;
  validTextType: boolean = false;
  txtError: string = null;

  /*Listas*/
  listaTiposPrestaServ: Array<CatDato> = [];
  listaEstablecimientos: Array<Establecimiento> = [];
  listaAfiliaciones: Array<DatosAfiliaciones> = [];

  /*Dto*/
  insContadorAuditor: Contador;


  /* Estructura usada para almacenar los datos ingresados por el usuario*/
  contadorAuditor: ContadorAuditor;
  digito: Digito;



  //DEFAULT
  constructor(private formBuilder: FormBuilder, private servicios: Servicios) { }

  ngOnInit() {
    this.ConstruirFormulario();
    this.getTipoPrestacionServ();
    this.contadorForm.get('nombresApellidosCont').disable();
    this.contadorForm.get('estado').disable();
    this.contadorForm.get('fechaNombramiento').disable();
    this.contadorForm.get('tipoPrestServicio').disable();

    if (this.contadorAuditor) {
      this.contadorForm.controls["nitContador"].setValue(this.contadorAuditor.nitContador);
      this.contadorForm.controls["nombresApellidosCont"].setValue(this.contadorAuditor.nombresApellidos);
      this.contadorForm.controls["estado"].setValue(this.contadorAuditor.estado);
      this.contadorForm.controls["fechaNombramiento"].setValue(this.contadorAuditor.fechaNombramiento);
      this.contadorForm.controls["tipoPrestServicio"].setValue(this.contadorAuditor.tipoPrestacionServicio);
      this.contadorForm.controls["validNegocio"].setValue('OK');
    
    }
  }

  ConstruirFormulario() {
    this.contadorForm = this.formBuilder.group({
      nitContador: ["", Validators.compose(
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30),
          Validators.pattern("[A-z0-9]*")
        ]
      )],
      nombresApellidosCont: [""],
      estado: [""],
      fechaNombramiento: ["", Validators.required],
      tipoPrestServicio: ["", Validators.required],
      validNegocio: ["", Validators.required]
    });
  }

  /*COMBOS*/
  public getTipoPrestacionServ() {
    this.servicios.getData(this.servicios.URL_DATO, 'cat_dato_by_catalogo', this.constantes.CODIGO_CAT_TIPO_PRESTACION_SERVICIO, false).subscribe((data: Array<CatDato>) => {
      this.listaTiposPrestaServ = data;
      //console.log(data2);
    });
  }





  /*Estándares sistemas Web, Validación 1*/
  filtrarNIT() {
    var valorCampo: string = this.contadorForm.get('nitContador').value;
    console.log('filtrarNIT valorCampo ' + valorCampo);
    if (this.contadorForm.get('nitContador').value != "" && this.contadorForm.get('nitContador').value != null) {
      valorCampo = valorCampo.replace(/ /g, "");
      valorCampo = valorCampo.replace(/-/g, "");
      valorCampo = valorCampo.replace(/_/g, "");
      valorCampo = valorCampo.toUpperCase();
      this.valorCampoNit = valorCampo;
    } else {
      this.valorCampoNit = "";
    }
  }

  validarNIT() {
    this.filtrarNIT();

    if (this.valorCampoNit.length > 1) {
      this.servicios.getData(this.servicios.URL_CONTRIBUYENTE, 'sat_contribuyente/verificaNIT', this.valorCampoNit, false).subscribe(
        (data: Digito) => {
          this.digito = data;

          /*Estándares sistemas Web, Validación 1*/
          if ((this.valorCampoNit == "00") || (this.valorCampoNit == "0")) {
            this.nitGenerico = true;
          } else {
            this.nitGenerico = false;
          }

          if (this.digito) {
            this.digitoVerificador = false;
          }
          else {
            this.digitoVerificador = true;
          }

          /*Estándares sistemas Web, Validación 1*/
          if ((this.digitoVerificador) || (this.nitGenerico)) {
            this.validNitType = true;
            this.contadorForm.controls["validNegocio"].setValue('');
          }
          else {
            this.validNitType = false;

            /*************************************************************/

            if (this.valorCampoNit.length > 1) {
              this.servicios.getData(this.servicios.URL_CONTRIBUYENTE, 'sat_contribuyente', this.valorCampoNit, false).subscribe(
                (data: SatContribuyente) => {
                  var datosContribuyente: SatContribuyente;
                  console.log(data);
                  datosContribuyente = data;

                  this.valorCiiu = datosContribuyente.ciiu;

                  if (datosContribuyente.status != 'A') { // 9. Si el valor ingresado es diferente a “A” mostrar mensaje de error
                    this.validEstadoNit = true;
                    this.contadorForm.controls["validNegocio"].setValue('');
                  }
                  else {
                    this.validEstadoNit = false;

                    if (datosContribuyente.tipoNit == 1) { // Contribuyente Individual

                      this.servicios.getData(this.servicios.URL_CONTRIBUYENTE_INDIVIDUAL, 'rtu_contribuyente_individual', this.valorCampoNit, false).subscribe(
                        (data: SatContribuyenteIndividual) => {
                          var datosContribuyenteIndividual: SatContribuyenteIndividual;
                          console.log(data);
                          datosContribuyenteIndividual = data;

                          if (datosContribuyenteIndividual.fechaFallecimiento) { // 8. Si el valor ingresado tiene fecha de fallecimiento mostrar mensaje de error
                            this.validFechaFallecimiento = true;
                            this.contadorForm.controls["validNegocio"].setValue('');
                          }
                          else {
                            this.validFechaFallecimiento = false;
                            this.contadorForm.get('nombresApellidosCont').setValue(this.formatearNombreContribuyente(datosContribuyenteIndividual));
                          }
                        },
                        error => {
                          let errorString = JSON.stringify(error);
                          let errorJson = JSON.parse(errorString);
                          this.validFechaFallecimiento = false;
                          this.contadorForm.get('nombresApellidosCont').setValue('');
                          this.contadorForm.controls["estado"].setValue('');
                          this.contadorForm.controls["validNegocio"].setValue('');
                          console.error("Error al verificar NIT Individual: " + errorJson.error.userMessage);

                        },
                        () => { }
                      );
                    }
                  }
                },
                error => {
                  let errorString = JSON.stringify(error);
                  let errorJson = JSON.parse(errorString);

                  if (errorJson.error.status == '404') { // 6. Si el valor ingresado no existe mostrar el mensaje de error
                    this.validExiste = true;
                    this.validEstadoNit = false;
                    this.contadorForm.get('nombresApellidosCont').setValue('');
                    this.contadorForm.controls["estado"].setValue('');
                    this.contadorForm.controls["validNegocio"].setValue('');
                    console.error("Error al verificar NIT Individual: ");
                  }
                  else {
                    this.validExiste = true;
                    this.validEstadoNit = false;
                    this.contadorForm.get('nombresApellidosCont').setValue('');
                    this.contadorForm.controls["estado"].setValue('');
                    this.contadorForm.controls["validNegocio"].setValue('');
                    console.error("Error al verificar NIT: " + errorJson.error.userMessage);
                  }
                },
                () => { }
              );

            }


            /*************************************************************/

            /*[FA01]*/
            if (this.valorCampoNit.length > 1) {
              this.servicios.getData(this.servicios.URL_CONTADOR, null, this.valorCampoNit, false).subscribe(
                (data: Contador) => {
                  this.insContadorAuditor = data;

                  console.log('this.insContadorAuditor: ' + JSON.stringify(this.insContadorAuditor));


                  if (!this.insContadorAuditor) {
                    this.validRegistroContadores = true; //console.log('Error: El NIT no se encuentra inscrito en el registro de Contadores o Auditores');
                    this.contadorForm.controls["validNegocio"].setValue('');
                  } else {
                    this.validRegistroContadores = false;

                    if (this.insContadorAuditor.status != 'A') {
                      this.validEstadoContador = true;//console.log('Error. El NIT ingresado se encuentra inactivo en el registro de Contadores o Auditores');
                      this.contadorForm.controls["estado"].setValue('Inactivo');
                      this.contadorForm.controls["validNegocio"].setValue('');

                    } else {
                      this.validEstadoContador = false;
                      this.contadorForm.controls["estado"].setValue('Activo');

                    }

                    if ((!this.digitoVerificador && !this.nitGenerico && !this.fechaFallecimiento && !this.estadoNit && !this.validRegistroContadores && !this.validEstadoContador) && (this.contadorForm.get('nitContador').value != "")) {
                      this.validNIT = true;
                      this.contadorForm.get('fechaNombramiento').enable();
                      this.contadorForm.get('tipoPrestServicio').enable();
                    } else {
                      this.validNIT = false;
                      this.contadorForm.controls["nombresApellidosCont"].setValue('');
                      this.contadorForm.controls["estado"].setValue('');
                      this.contadorForm.controls["validNegocio"].setValue('');
                      this.contadorForm.get('fechaNombramiento').disable();
                      this.contadorForm.get('tipoPrestServicio').disable();
                    }
                  }
                },
                error => {
                  let errorString = JSON.stringify(error);
                  let errorJson = JSON.parse(errorString);

                  if (errorJson.error.status == '404') {
                    this.validRegistroContadores = true;
                    this.validNIT = false;
                    this.contadorForm.controls["nombresApellidosCont"].setValue('');
                    this.contadorForm.controls["estado"].setValue('');
                    this.contadorForm.controls["validNegocio"].setValue('');
                    console.error("Error 404... ");
                  }
                  else {
                    this.validRegistroContadores = true;
                    this.validNIT = false;
                    this.contadorForm.controls["nombresApellidosCont"].setValue('');
                    this.contadorForm.controls["estado"].setValue('');
                    this.contadorForm.controls["validNegocio"].setValue('');
                    console.error("Error al verificar NIT del Contador-Auditor: " + errorJson.error.userMessage);

                  }
                },
                () => { }
              );
            }

          }




        },
        error => {
          let errorString = JSON.stringify(error);
          let errorJson = JSON.parse(errorString);

          if (errorJson.error.status == '404') { // 6. Si el valor ingresado no existe mostrar el mensaje de error
            this.digitoVerificador = true;
            this.validExiste = false;
            this.contadorForm.controls["nombresApellidosCont"].setValue('');
            this.contadorForm.controls["estado"].setValue('');
            this.contadorForm.controls["validNegocio"].setValue('');
            console.error("Error Digito verificador.");
          }
          else {
            this.digitoVerificador = true;
            this.validExiste = false;
            this.contadorForm.controls["nombresApellidosCont"].setValue('');
            this.contadorForm.controls["estado"].setValue('');
            this.contadorForm.controls["validNegocio"].setValue('');
            console.error("Error Digito verificador." + errorJson.error.userMessage);
          }
        },
        () => { }
      );
    } else {
      this.validNitType = false;
      this.nitGenerico = false;
      this.validFechaFallecimiento = false;
      this.validEstadoNit = false;
      this.validExiste = false;
      this.digitoVerificador = false;
      this.validRegistroContadores = false;
      this.validEstadoContador = false;
      this.validNIT = false;
      this.validFecha = false;
      this.validPrestacion = false;
      this.contadorForm.controls["estado"].setValue('');
      this.contadorForm.controls["nombresApellidosCont"].setValue('');
      this.contadorForm.controls["fechaNombramiento"].setValue('');
      this.contadorForm.controls["tipoPrestServicio"].setValue('');
      this.contadorForm.controls["validNegocio"].setValue('');
      this.contadorForm.get('fechaNombramiento').disable();
      this.contadorForm.get('tipoPrestServicio').disable();
    }


  }

  formatearNombreContribuyente(contribuyente: SatContribuyenteIndividual) {
    var nombre;
    nombre = contribuyente.primerNombre + " " + contribuyente.segundoNombre + " " + contribuyente.primerApellido + " " + contribuyente.segundoApellido;
    if (contribuyente.apellidoCasada)
      nombre += " DE " + contribuyente.apellidoCasada;
    return nombre;
  }


  


  validarTipoPrestacionServ() {

    /*Afiliaciones*************************************/
    this.servicios.getData(this.servicios.URL_AFILIACION, 'afiliacion', this.valorCampoNit, false).subscribe(
      (data: Array<DatosAfiliaciones>) => {
        this.listaAfiliaciones = data;
        console.log("this.listaAfiliaciones " + JSON.stringify(this.listaAfiliaciones));

        for (var _i = 0; _i < this.listaAfiliaciones.length; _i++) {
          console.log('AfiliacionesIDX:' + _i + 'CodigoImpuesto:' + this.listaAfiliaciones[_i].codigoImpuesto
            + 'estado ' + this.listaAfiliaciones[_i].estado + " regimen " + this.listaAfiliaciones[_i].regimen);

          /*Pendiente colocar codigo Regimen oficial en produccion*/
          if (this.listaAfiliaciones[_i].codigoImpuesto == 10 && this.listaAfiliaciones[_i].regimen == 1 && this.listaAfiliaciones[_i].estado == 1) {
            this.isrAfiliacion = "10";
          }

          if (this.listaAfiliaciones[_i].codigoImpuesto == 11 && this.listaAfiliaciones[_i].estado == 1) {
            this.ivaAfiliacion = "11";
          }
        }

        /*[FA03]*/
        //el codigo en desa es 73 y en aws 863
        if (this.contadorForm.get('tipoPrestServicio').value == this.constantes.TIPO_PRESTACION_SERVICIO_ISR) {
          this.validEstablecimientos = false;
          this.validIVA = false;
          this.validFacturas = false;
          this.validOmiso = false;


          /*Pendiente colocar valores oficiales en Producción*/
          if ((this.valorCiiu == this.constantes.TIPO_CIIU_ISRA) || (this.valorCiiu == this.constantes.TIPO_CIIU_ISRB)) {
            this.validActividadEconomica = false;
          } else {
            this.validActividadEconomica = true;
            this.contadorForm.controls["validNegocio"].setValue('');
            //console.log('Error: La actividad económica del contador no corresponde al servicio seleccionado');
          }

          if (this.isrAfiliacion == "10") {
            this.validISR = false;
            //console.log('Error: La afiliación del contador no corresponde al servicio seleccionado');
          } else {
            this.validISR = true;
            this.contadorForm.controls["validNegocio"].setValue('');
          }


          if (!this.validActividadEconomica && !this.validISR) {
            this.validPrestacion = true;
          } else {
            this.validPrestacion = false;
          }

          if ((this.validNIT && this.validFecha && this.validPrestacion)) {
            this.contadorForm.controls["validNegocio"].setValue('OK');
            console.log("cargarContadorAuditor ");
            this.cargarContadorAuditor();
            console.log('Interfaz Llena:' + JSON.stringify(this.contadorAuditor));
            this.enviarDatosAInscripcion();
            this.showNotification('top', 'center', 'success', "Datos verificados correctamente");
          } else {
            this.contadorForm.controls["validNegocio"].setValue('');
          }

          /*[FA04]*/
        } //en desa es 105 y aws es 864
        else if (this.contadorForm.get('tipoPrestServicio').value == this.constantes.TIPO_PRESTACION_SERVICIO_IVA) {
          this.validActividadEconomica = false;
          this.validISR = false;
          this.validPrestacion = false;

          /*Establecimientos*************************************/
          this.servicios.getData(this.servicios.URL_ESTABLECIMIENTO, 'establecimiento', this.valorCampoNit, false).subscribe(
            (data: Array<Establecimiento>) => {
              //console.log('Establecimientos: ' + data);
              this.listaEstablecimientos = data;

              for (var _i = 0; _i < this.listaEstablecimientos.length; _i++) {
                console.log('IDX:' + _i + 'Numero_establecimiento:' + this.listaEstablecimientos[_i].numeroEstablecimiento + ' ' + this.listaEstablecimientos[_i].actividadEconomica + this.listaEstablecimientos[_i].estado);

                if (this.listaEstablecimientos[_i].estado == 'A') {
                  this.cantEstablecimientos = 1;
                }
              }
              if (this.cantEstablecimientos <= 0) {
                this.validEstablecimientos = true;
                this.contadorForm.controls["validNegocio"].setValue('');
                //console.log('Error: El contador ingresado no cuenta con establecimientos activos');
              } else {
                this.validEstablecimientos = false;
              }
            },
            error => {
              let errorString = JSON.stringify(error);
              let errorJson = JSON.parse(errorString);

              if (errorJson.error.status == '404') { // 6. Si el valor ingresado no existe mostrar el mensaje de error
                this.cantEstablecimientos = 0;
                this.validEstablecimientos = true;
                this.contadorForm.controls["validNegocio"].setValue('');
                console.error("No existen establecimientos");
              }
              else {
                this.cantEstablecimientos = 0;
                this.validEstablecimientos = true;
                this.contadorForm.controls["validNegocio"].setValue('');
                console.error("Error al verificar establecimientos: " + errorJson.error.userMessage);
              }
            },
            () => { }
          );

          /**************************************/


          if (this.ivaAfiliacion == "11") {
            this.validIVA = false;
            //console.log('Error: El contador no se encuentra afiliado al IVA');
          } else {
            this.validIVA = true;
            this.contadorForm.controls["validNegocio"].setValue('');
          }


          /*Facturas Vigentes*************************************/
          this.servicios.getData(this.servicios.URL_FACTURAS, 'consultas_documentos_ws/consultaDocumentos', this.valorCampoNit, false).subscribe(
            (data: ConsultaDocumentos) => {
              //console.log('Establecimientos: ' + data);

              var datosConsultaDocs: ConsultaDocumentos;
              console.log(data);
              datosConsultaDocs = data;



              if (datosConsultaDocs.operacion.poseeFacturas) {
                this.validFacturas = false;
              } else {
                this.validFacturas = true;
                this.contadorForm.controls["validNegocio"].setValue('');
              }

            },
            error => {
              let errorString = JSON.stringify(error);
              let errorJson = JSON.parse(errorString);

              if (errorJson.error.status == '404') { // 6. Si el valor ingresado no existe mostrar el mensaje de error
                this.validFacturas = true;
                this.contadorForm.controls["validNegocio"].setValue('');
                console.error("No posee facturas");
              }
              else {
                this.validFacturas = true;
                this.contadorForm.controls["validNegocio"].setValue('');
                console.error("Error al verificar facturas: " + errorJson.error.userMessage);
              }
            },
            () => { }
          );



          /*Omisos IVA*************************************/
          var omisoIVA: string;
          omisoIVA = this.valorCampoNit;

          console.log('omisoIVA:' + omisoIVA);

          this.servicios.getData(this.servicios.URL_FACTURAS, 'consultas_omisos_ws/consultaOmisiones', omisoIVA.concat("/11"), false).subscribe(
            (data: ConsultaOmisoImpuesto) => {
              //console.log('Establecimientos: ' + data);

              var datosConsultaOmisoImpuesto: ConsultaOmisoImpuesto;
              console.log(data);
              datosConsultaOmisoImpuesto = data;

              if (datosConsultaOmisoImpuesto.operacion.esOmiso) {
                this.validOmiso = true;
                this.contadorForm.controls["validNegocio"].setValue('');
              } else {
                this.validOmiso = false;
              }

            },
            error => {
              let errorString = JSON.stringify(error);
              let errorJson = JSON.parse(errorString);

              if (errorJson.error.status == '404') { // 6. Si el valor ingresado no existe mostrar el mensaje de error
                this.validOmiso = true;
                this.contadorForm.controls["validNegocio"].setValue('');
                console.error("Error en Consulta omisiones IVA");
              }
              else {
                this.validOmiso = true;
                this.contadorForm.controls["validNegocio"].setValue('');
                console.error("Error en Consulta omisiones IVA: " + errorJson.error.userMessage);
              }
            },
            () => { }
          );



          if (!this.validEstablecimientos && !this.validIVA && !this.validFacturas && !this.validOmiso) {
            this.validPrestacion = true;
          } else {
            this.validPrestacion = false;
            this.contadorForm.controls["validNegocio"].setValue('');
          }

          if ((this.validNIT && this.validFecha && this.validPrestacion)) {
            this.contadorForm.controls["validNegocio"].setValue('OK');
            console.log("cargarContadorAuditor ");
            this.cargarContadorAuditor();
            console.log('Interfaz Llena:' + JSON.stringify(this.contadorAuditor));
            this.enviarDatosAInscripcion();
            this.showNotification('top', 'center', 'success', "Datos verificados correctamente");
          } else {
            this.contadorForm.controls["validNegocio"].setValue('');
          }

        }

      },
      error => {
        let errorString = JSON.stringify(error);
        let errorJson = JSON.parse(errorString);

        if (errorJson.error.status == '404') { // 6. Si el valor ingresado no existe mostrar el mensaje de error

          this.validPrestacion = false;
          //if (this.contadorForm.get('tipoPrestServicio').value == "73") {

          if (this.contadorForm.get('tipoPrestServicio').value == this.constantes.TIPO_PRESTACION_SERVICIO_ISR) {
            /*Pendiente colocar valores oficiales en Producción*/
            if ((this.valorCiiu == this.constantes.TIPO_CIIU_ISRA) || (this.valorCiiu == this.constantes.TIPO_CIIU_ISRB)) {
              this.validActividadEconomica = false;
            } else {
              this.validActividadEconomica = true;
              //console.log('Error: La actividad económica del contador no corresponde al servicio seleccionado');
            }
            this.validISR = true;
            this.isrAfiliacion = "";


            this.validIVA = false;
            this.ivaAfiliacion = "";

          }
          //864
          //else if (this.contadorForm.get('tipoPrestServicio').value == "105") {
          else if (this.contadorForm.get('tipoPrestServicio').value == this.constantes.TIPO_PRESTACION_SERVICIO_IVA) {
            this.validIVA = true;
            this.ivaAfiliacion = "";

            this.validISR = false;
            this.isrAfiliacion = "";

          }
          this.contadorForm.controls["validNegocio"].setValue('');
          console.error("No existen afiliaciones");
        } else {
          this.validPrestacion = false;
          this.contadorForm.controls["validNegocio"].setValue('');
          console.error("No existen afiliaciones");

        }
      },
      () => { }
    );
    /**************************************/
  }

  /*[FA05]*/
  validacionesGenerales() {
    this.onType();
    this.validarNIT();
    this.onChangeFechaNombramiento(null);
    this.validarTipoPrestacionServ();

    if ((this.validNIT && this.validFecha && this.validPrestacion)) {
      this.contadorForm.controls["validNegocio"].setValue('OK');
      console.log("cargarContadorAuditor ");
      this.cargarContadorAuditor();
      console.log('Interfaz Llena:' + JSON.stringify(this.contadorAuditor));
      this.enviarDatosAInscripcion();
      this.showNotification('top', 'center', 'success', "Datos verificados correctamente");

    } else {
      this.contadorForm.controls["validNegocio"].setValue('');
    }
  }
  /*[FA06]*/
  inicializarForma() {
    this.contadorForm.reset();
    this.inicializarCamposDeLaForma(this.contadorForm);
    this.limpiarContador();
    this.valorCampoNit = "";
    this.valorCiiu = "";

    this.validNIT = false;
    this.validFecha = false;
    this.validPrestacion = false;
    this.validNitType = false;
    this.validExiste = false;
    this.validFechaFallecimiento = false;
    this.validEstadoNit = false;
    this.validRegistroContadores = false;
    this.validEstadoContador = false;
    this.validFechaMenor = false;
    this.validFechaNombramiento = false;
    this.validActividadEconomica = false;
    this.validISR = false;
    this.validEstablecimientos = false;
    this.validIVA = false;
    this.validFacturas = false;
    this.validOmiso = false;

    this.digitoVerificador = false;
    this.nitGenerico = false;
    this.fechaFallecimiento = false;
    this.estadoNit = false;


    this.isrAfiliacion = "";
    this.cantEstablecimientos = 0;
    this.ivaAfiliacion = "";
    this.factAutVigentes = false;;
    this.esOmiso = false;
  }


  /*Limpia o inicializa los controles de pantalla*/

  limpiarContador() {
    this.contadorAuditor = {
      nitContador: "",
      nombresApellidos: "",
      estado: "",
      fechaNombramiento: null,
      tipoPrestacionServicio: "",
      fechaInscripcionRegistro: null,
      codigoActEconomica: "",
      codigoImpuestoAfiliacion: "",
      establecimientosActivos: false,
      facturasAutVigentes: false,
      omisoIVA: false,
      fechaFallecimiento: false,
      estadoNIT: false
    }
    this.digito = { valido: false }
  }

  /*Mapea la informacion del contador-auditor de los controles en pantalla.*/

  cargarContadorAuditor() {
    if (this.contadorForm.valid) {
      var codigoImpto: string = "";
      var fechaIns = new Date(this.insContadorAuditor.fechaAdiciono);

      //if (this.contadorForm.get('tipoPrestServicio').value == "73") {
      if (this.contadorForm.get('tipoPrestServicio').value == this.constantes.TIPO_PRESTACION_SERVICIO_ISR) {
        codigoImpto = this.isrAfiliacion;
      }
      //else if (this.contadorForm.get('tipoPrestServicio').value == "105") {
      else if (this.contadorForm.get('tipoPrestServicio').value == this.constantes.TIPO_PRESTACION_SERVICIO_IVA) {
        codigoImpto = this.ivaAfiliacion;
      }

      var valorCampoFnombramiento: string = this.contadorForm.get('fechaNombramiento').value;
      var valorCampoDateNombramiento: Date = new Date(new Date(valorCampoFnombramiento).getUTCFullYear(), new Date(valorCampoFnombramiento).getUTCMonth(), new Date(valorCampoFnombramiento).getUTCDate());

      this.contadorAuditor = {
        nitContador: this.contadorForm.get('nitContador').value,
        nombresApellidos: this.contadorForm.get('nombresApellidosCont').value,
        estado: this.contadorForm.get('estado').value,
        fechaNombramiento: valorCampoDateNombramiento,
        tipoPrestacionServicio: this.contadorForm.get('tipoPrestServicio').value,
        fechaInscripcionRegistro: fechaIns,
        codigoActEconomica: this.valorCiiu,
        codigoImpuestoAfiliacion: codigoImpto,
        establecimientosActivos: this.validEstablecimientos,
        facturasAutVigentes: this.factAutVigentes,
        omisoIVA: this.esOmiso,
        fechaFallecimiento: this.fechaFallecimiento,
        estadoNIT: this.estadoNit
      };
    }
  }

  inicializarCamposDeLaForma(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      formGroup.get(field).setValue(null);
    });
  }


  nitValidation(e) {
    var nitvalor: string = e;

    if ((nitvalor != "") || (nitvalor != null)) {
      this.validarNIT();
    } else {
      this.validNitType = false;
      this.nitGenerico = false;
      this.validFechaFallecimiento = false;
      this.validEstadoNit = false;
      this.validExiste = false;
      this.digitoVerificador = false;
      this.validRegistroContadores = false;
      this.validEstadoContador = false;
      this.validNIT = false;
      this.validFecha = false;
      this.validPrestacion = false;
      this.contadorForm.controls["estado"].setValue('');
      this.contadorForm.controls["nombresApellidosCont"].setValue('');
      this.contadorForm.controls["fechaNombramiento"].setValue('');
      this.contadorForm.controls["tipoPrestServicio"].setValue('');
      this.contadorForm.controls["validNegocio"].setValue('');
      //this.onType();
    }
  }

 

  tipoPresentaValidation(e) {
    this.validarTipoPrestacionServ();
    this.onType();
  }

  onChangeFechaNombramiento(valorSeleccionado) {
    //this.contadorForm.controls["fechaInscripcion"].setErrors(null);
    this.validarFechaMenorActual("fechaNombramiento");
    if (!this.txtError) {
      this.validarInscripcionMayorNombramiento();
    }
  }

  validarFechaMenorActual(nombreCampo) {
    var valorCampoFnombramiento: string = this.contadorForm.get('fechaNombramiento').value;
    var valorCampoDateNombramiento: Date = new Date(new Date(valorCampoFnombramiento).getUTCFullYear(), new Date(valorCampoFnombramiento).getUTCMonth(), new Date(valorCampoFnombramiento).getUTCDate());
      
    if (this.fechaActual.getHours() > 17 && this.fechaActual.getHours() < 24) {
      var valorCampoDateHoy: Date = new Date(this.fechaActual.getUTCFullYear(), this.fechaActual.getUTCMonth(), this.fechaActual.getUTCDate()-1);
    } else {
      var valorCampoDateHoy: Date = new Date(this.fechaActual.getUTCFullYear(), this.fechaActual.getUTCMonth(), this.fechaActual.getUTCDate());
    }

    console.log('validarFechamenorActual valorCampoDateNombramiento:' + valorCampoDateNombramiento);
    console.log('validarFechamenorActual valorCampoDateHoy:' + valorCampoDateHoy);

    if (valorCampoDateNombramiento < valorCampoDateHoy) {
      this.contadorForm.controls[nombreCampo].setErrors({ incorrecto: true });
      this.txtError = "Error: La fecha ingresada no puede ser menor a fecha actual.";
      this.validFecha = false;
      this.contadorForm.controls["validNegocio"].setValue('');
    } else {
      //this.contadorForm.controls[nombreCampo].setErrors(null);
      //this.contadorForm.controls[nombreCampo].updateValueAndValidity();
      this.txtError = null;
    }
  }

  validarInscripcionMayorNombramiento() {

    var valorCampoFinscrip: Date = this.insContadorAuditor.fechaAdiciono;
    var valorCampoDateFincrip: Date = new Date(new Date(valorCampoFinscrip).getUTCFullYear(), new Date(valorCampoFinscrip).getUTCMonth(), new Date(valorCampoFinscrip).getUTCDate());

    var valorCampoFnombramiento: string = this.contadorForm.get('fechaNombramiento').value;
    var valorCampoDateNombramiento: Date = new Date(new Date(valorCampoFnombramiento).getUTCFullYear(), new Date(valorCampoFnombramiento).getUTCMonth(), new Date(valorCampoFnombramiento).getUTCDate());
    
    if (valorCampoDateNombramiento >= valorCampoDateFincrip) {
      this.validFecha = true;
      this.txtError = null;

      if ((this.validNIT && this.validFecha && this.validPrestacion)) {
        this.contadorForm.controls["validNegocio"].setValue('OK');
        console.log("cargarContadorAuditor ");
        this.cargarContadorAuditor();
        console.log('Interfaz Llena:' + JSON.stringify(this.contadorAuditor));
        this.enviarDatosAInscripcion();
        this.showNotification('top', 'center', 'success', "Datos verificados correctamente");
      } else {
        this.contadorForm.controls["validNegocio"].setValue('');
      }

    } else {
      this.validFecha = false;
      this.contadorForm.controls["fechaInscripcion"].setErrors({incorrecto: true});
      this.txtError = " Error: Fecha ingresada es menor a fecha de inscripción del contador o auditor.";
    }
  }




  showNotification(from: any, align: any, tipoNotificacion: string, textoNotificacion: string) {
    $.notifyClose();
    $.notify({
      icon: 'notifications',
      message: textoNotificacion
    }, {
        type: tipoNotificacion,
        timer: 1000,
        placement: {
          from: from,
          align: align
        },
        newest_on_top: true,
        template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0} alert-with-icon" role="alert">' +
          '<button mat-raised-button type="button" aria-hidden="true" class="close" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
          '<i class="material-icons" data-notify="icon">notifications</i> ' +
          '<span data-notify="title">{1}</span> ' +
          '<span data-notify="message">{2}</span>' +
          '<div class="progress" data-notify="progressbar">' +
          '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          '</div>' +
          '<a href="{3}" target="{4}" data-notify="url"></a>' +
          '</div>'
      });
  }


  isFieldValid(form: FormGroup, field: string) {
    return !form.get(field).valid && form.get(field).touched;
  }

  displayFieldCss(form: FormGroup, field: string) {
    return {
      'has-error': this.isFieldValid(form, field),
      'has-feedback': this.isFieldValid(form, field)
    };
  }

  onType() {
    if (this.contadorForm.valid) {
    } else {
      this.validateAllFormFields(this.contadorForm);
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  textValidationType(e) {
    if (e != "") {
      this.validTextType = true;

    } else {
      this.validTextType = false;
    }
  }

}


/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}