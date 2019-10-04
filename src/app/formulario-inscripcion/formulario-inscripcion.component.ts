import { Component, OnInit, OnChanges, AfterViewInit, SimpleChanges, TemplateRef, ViewChild, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ICheck, } from './interfaces/sessionRtu/iCheck.interface';
import { TipoPersona } from './interfaces/sessionRtu/tipoPersona.interface';
import { Atributo } from './interfaces/sessionRtu/atributo.interface';
import { Datos } from './interfaces/sessionRtu/datos.interface';
import { SessionRtu } from './interfaces/sessionRtu/sessionRtu.interface';
import { TipoContribuyente } from "./interfaces/sessionRtu/tipoContribuyente.interface";
import { Data } from './interfaces/sessionRtu/data.interface';
import { Respuesta } from './interfaces/sessionRtu/respuesta.interface'
import { MatPaginator, MatTableDataSource, MatGridTileHeaderCssMatStyler, MatDialog, MatStepper } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ActividadEconomica } from './interfaces/seccion/actvidadEconomica.interface';
import { ValidadorSelect } from '../validadores/validator-select.component';
import { LovContribuyente } from './interfaces/sessionRtu/lov-contribuyente.interface';
import { Contribuyente } from './interfaces/sessionRtu/contribuyente.interface';
import { Persona } from './interfaces/sessionRtu/persona.interface';
import { Organizacion } from './interfaces/sessionRtu/organizacion.interface';
import { RespuestaGestion } from './interfaces/sessionRtu/respuestaGestion.interface';
import { CargaArchivo } from './interfaces/archivo/cargaArchivo.interface';
import { Compania } from './interfaces/sessionRtu/compania.interface';
//import { Direccion } from '../admin-ubicaciones/interfaces/seccion/direccion.interface';
import { ubicacion } from '../interfaces/ubicacion/ubicacion';
import { UbicacionDetallada } from '../interfaces/ubicacion/ubicacionDetallada.interface';
import { alfanumericValidator } from '../validadores/alfanumeric-validator';
import { Servicios } from '../servicios/servicios.service';
import { servicioBody } from '../interfaces/servicioBody.interface';
import * as moment from 'moment';
import { IDatosTablaEstablecimiento } from '../interfaces/datos-establecimiento/datosEstablecimiento.interface';
import { IdentificacionEmpresa } from '../identificacion-empresa/identificacion-empresa';
import { Representante } from '../datos-representante/representante';
import { CatDato } from 'app/interfaces/ubicacion/catDato.interface';
import { ContadorAuditor } from 'app/interfaces/datos-contador/contadorAuditor.interface';
import { RegistroSocioAccionista } from 'app/interfaces/registro-socio-accionista.interface';
import { AfiliacionImpuesto } from 'app/interfaces/afiliaciones/afiliacionImpuesto.interface';
import { CatDatoByCatalogo } from '../interfaces/cat-dato-by-catalogo.interface';
import { Constantes } from 'app/util/constantes';
import { SatContribuyente } from '../interfaces/sat-contribuyente.interface';
import { SatContribuyenteJuridico } from '../interfaces/sat-contribuyente-juridico.interface';
import { SatContribuyenteIndividual } from '../interfaces/sat_contribuyente-individual.interface';
import swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';
import { DialogoRequisitosComponent } from './dialogo-requisitos';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import { EnvioCorreo } from 'app/interfaces/envioCorreo.interface';
import { t } from '@angular/core/src/render3';
import { Observable } from 'rxjs';

declare const $: any;

const contribuyentePersona = "1";
const contribuyenteOrganizacion = "2";
const URL = 'http://localhost:3000/api/upload';


@Component({
  selector: "app-formulario-inscripcion",
  templateUrl: "formulario-inscripcion.component.html"
})
export class FormularioInscripcionComponent implements OnInit {


  constantes: Constantes = new Constantes;
  //constantes para consumir el servicio
  VALIDA_EMAIL_URL = this.servicios.URL_VALIDA_EMAIL;
  SESSION_RTU_URL = this.servicios.URL_SESSION_RTU;
  EMAIL_AV_URL = this.servicios.URL_EMAIL_AV;
  COMPANIA_TEL_URL = this.servicios.URL_COMPANIA_TEL;

  //constantes para definir tipo de persona
  contribuyentePersona = "1";
  contribuyenteOrganizacion = "2";

  //bloques
  myThenBlock: TemplateRef<any> = null;
  myElseBlock: TemplateRef<any> = null;
  @ViewChild("firstThenBlock")
  firstThenBlock: TemplateRef<any> = null;
  @ViewChild("secondThenBlock")
  secondThenBlock: TemplateRef<any> = null;
  @ViewChild("firstElseBlock")
  firstElseBlock: TemplateRef<any> = null;
  @ViewChild("secondElseBlock")
  secondElseBlock: TemplateRef<any> = null;

  //formgroup
  isncripcion: FormGroup;
  solicitud: FormGroup;
  recuperaCodigo: FormGroup;
  //formGroup estepper
  tipoPersonaFormGroup: FormGroup;
  personaOrganizacionFG: FormGroup;
  actividadFormGroup: FormGroup;
  ubicacionFormGroup: FormGroup;
  tercerosFormGroup: FormGroup;
  obligacionesFormGroup: FormGroup;

  // formGroup vertical
  establecimientoFormGroup: FormGroup;
  afiliacionesFormGroup: FormGroup;
  datosContadorFormGroup: FormGroup;
  datosRepresentanteLegalFormGroup: FormGroup;
  registroSocioAccionistaFormGroup: FormGroup;

  // formGroup pantalla identificacion persona
  formGroupIdentificacionPersona: FormGroup;

  //FormControl
  emailFormControl = new FormControl("", [
    Validators.required,
    Validators.email
  ]);

  telefonoFormControl = new FormControl("", [
    Validators.required,
    Validators.min(10000000),
    Validators.max(99999999)
  ]);

  //subir archivos identificacion persona
  fileInputSource; url_archivo=[]; fileToUpload=[]; cargaExitosa=[];
  

  codigoFormControl = new FormControl("", [Validators.required]);
  //FormControl identificacion persona
  selGenero = new FormControl("", [Validators.required]);
  selEstadoCivil = new FormControl("", [Validators.required]);
  selNacionalidad = new FormControl("", [Validators.required]);
  txtDPI = new FormControl("", [
    Validators.required,
    Validators.min(1000000000000),
    Validators.max(9999999999999)
  ]);
  selMunNac = new FormControl("", [Validators.required]);
  txtPasaporte = new FormControl("", [
    Validators.required,
    Validators.pattern(/^([\.&\/\-,_0-9a-zA-Z]*[0-9]+[\.&\/\-,_a-zA-Z]*)?$/)
  ]);
  selPoblacion = new FormControl("", [Validators.required]);
  selComLing = new FormControl("", [Validators.required]);
  selDeptoNac = new FormControl("", [Validators.required]);
  selMunCedula = new FormControl("", [Validators.required]);
  selNoOrden = new FormControl("", [Validators.required]);
  txtNoCedula = new FormControl("", [Validators.required]);
  selPaisOrigen = new FormControl("", [Validators.required]);
  txtPrimerNombre = new FormControl("", [
    Validators.required,
    alfanumericValidator.validateFormat
  ]);
  txtSegundoNombre = new FormControl("", [alfanumericValidator.validateFormat]);
  txtOtrosNombres = new FormControl("", [alfanumericValidator.validateFormat]);
  txtPrimerApellido = new FormControl("", [
    Validators.required,
    alfanumericValidator.validateFormat
  ]);
  txtSegundoApellido = new FormControl("", [
    alfanumericValidator.validateFormat
  ]);
  txtApellidoCasada = new FormControl("", [
    alfanumericValidator.validateFormat
  ]);
  txtNITConyuge = new FormControl("");
  txtNombresConyuge = new FormControl("");
  selTipoDocumento = new FormControl({ value: "", disabled: true });
  txtFechaNac = new FormControl("", [Validators.required]);
  txtFechaVencimientoDPI = new FormControl("", [Validators.required]);
  txtfechaEmisionDPI = new FormControl({ value: "", disabled: false });
  txtDPIPadre = new FormControl("", [
    Validators.min(1000000000000),
    Validators.max(9999999999999)
  ]);
  txtNitPadre = new FormControl("");
  txtNombresPadre = new FormControl({ value: "", disabled: false });
  txtDPIMadre = new FormControl("", [
    Validators.min(1000000000000),
    Validators.max(9999999999999)
  ]);
  txtNitMadre = new FormControl("");
  txtNombresMadre = new FormControl({ value: "", disabled: false });
  check_representacionLegal = new FormControl("");

  check_actividadEconomica = new FormControl("");
  hayActividadEconomica = new FormControl("", [Validators.required]);
  

  //listas de valores
  public listaCheck: ICheck[];
  public listaTipoPersona: TipoPersona[];
  listaTiposContribuyentePersona: Array<CatDato> = [];
  listaRequisitos: Array<CatDato> = [];
  //LOV identificacion persona
  listaGenero: LovContribuyente[]; /**LOV para genero*/
  listaEstadoCivil: LovContribuyente[]; /**LOV para estado civil*/
  listaNacionalidad: LovContribuyente[]; /**LOV para nacionalidad*/
  listaPaisOrigen: LovContribuyente[]; /**LOV para listado de paises de origen*/
  listaNoOrden: LovContribuyente[]; /**LOV para No de orden para cedulas*/
  listaMunicipio$: Observable<Object>; /**Observable para municipios*/
  listaDepartamento$: Observable<Object>; /**Observable para departamentos*/
  listaActividadEc: LovContribuyente[]; /**LOV para actividad economica*/
  listaPoblacion: LovContribuyente[]; /**LOV para poblacion*/
  listaComunidadLing: LovContribuyente[]; /**LOV para comunidad linguistica*/

  //validaciones
  validEmailType: boolean = false;
  validNumberType: boolean = false;
  validAll: boolean = false;
  tieneGestion: boolean = false;
  tieneGestionEmail:boolean;
  mostrarSeleccion: boolean = true;
  existeCorreo: boolean = false;
  continuar: boolean = false;
  isOptional = false;
  matcher = new MyErrorStateMatcher();
  isValid: boolean = true;
  isValidTmp: boolean = false;
  tieneCompania: boolean = false;
  codigoValido: boolean = false;
  panelCodigo: boolean = false;
  validTextType: boolean = false;
  actvidadIndividual: boolean = false;
  requeridaActividad: boolean= true;

  hayHomonimos: boolean = true;
  formularioListo: boolean = false; //Cuando es true indica que el formulario con sus datos ya fue cargado
  esDelegado: boolean = false; //Para deferenciar las secciones de Obligaciones y Relacionamientos a mostrar cuando el Rol sea Delegado.
  telefonoNoValido: boolean = false;
  //variables inscripcion
  $valorCaptcha: String;
  codigoGestion: string;
  tipoPersona: String;
  panel: number;
  paso: number;
  tipoSeleccion: String;
  companiaTelefonica: String;
  codigoTemp: string;
  telefono: string;
  correoElectronico: string;

  /**
   * Estructura usada para almacenar los datos ingresados por el usuario
   */
  contribuyente: Contribuyente;
  persona: Persona;
  organizacion: Organizacion;
  //Variables temporales para bindear los controles en pantalla
  Genero: LovContribuyente;
  Estado_Civil: LovContribuyente;
  Nacionalidad: LovContribuyente;
  tipoDocumento: number;
  DPI: string;
  DPIPadre: string;
  Nit_Padre: string;
  Nombres_Padre: string;
  DPIMadre: string;
  Nit_Madre: string;
  Nombres_Madre: string;
  Municipio_Nacimiento: LovContribuyente;
  Municipio_Emision_Cedula: LovContribuyente;
  Departamento_Nacimiento: LovContribuyente;
  Numero_Orden_Cedula: LovContribuyente;
  Comunidad_Linguistica: LovContribuyente;
  Numero_Registro_Cedula: string;
  Poblacion: LovContribuyente;
  Pasaporte: string;
  Pais_Origen: LovContribuyente;
  Primer_Nombre: string;
  Segundo_Nombre: string;
  Otros_Nombres: string;
  Primer_Apellido: string;
  Segundo_Apellido: string;
  Apellido_Casada: string;
  Fecha_Nacimiento: string;
  Fecha_Vencimiento_DPI: string;
  Fecha_Emision_DPI: string;
  selectedRowCiiu: String;
  nombresRepetidos: boolean;

  //variables para filtrar el campo de fecha
  maxDateMayorEdad = new Date(); //Fecha maxima para mostrar en calendario para personas mayores de edad
  minDate = new Date(); //Fecha minima para mostrar en calendario
  maxDate = new Date(); //Fecha maxima para mostrar en calendario

  //variables para mapear los JSON
  compania: object[];
  resCodigo: object[];
  resDataCodigo: object[];
  resData: object[];

  //variables para envio de datos json
  session: SessionRtu;
  atributo: Atributo;
  datos: Datos;
  tipoContribuyente: TipoContribuyente;
  data: Data;
  respuestaRtu: Respuesta;
  respuestaGestion: RespuestaGestion;

  // Variables habilitación de secciones - actividad economica amoecheve
  actividadEconomica: ActividadEconomica;
  
  listaActvidadRes: Array<ActividadEconomica> = [];
  listaActvidad: ActividadEconomica[];
  seccionObligaciones: boolean = false;
  seccionEstablecimiento: boolean = false;
  seccionAfiliaciones: boolean = false;
  seccionRelacionamientos: boolean = false;
  seccionContador: boolean = false;
  seccionRepresentante: boolean = false;
  seccionSocioAccionista: boolean = false;

  // Variables habilitación de secciones - tipo de personería amoecheve
  codigoTipoPersoneria: string;

  //variables habilitacion de secciones - otros
  edadPersona: number;

  //manejo de tabla
  displayedColumns: string[] = ["select", "codigo", "nombre"];
  dataSource = new MatTableDataSource<ActividadEconomica>(this.listaActvidad);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  initialSelection = [];
  allowMultiSelect = false;
  //variable para la seccion de la tabla
  selection = new SelectionModel<ActividadEconomica>(
    this.allowMultiSelect,
    this.initialSelection
  );



  //variables para enviar a componente ubicacion
  listaDirecciones: UbicacionDetallada;
  datosUbicacionSalida: string;
  datosSalidaArchivo: CargaArchivo = {
    identificador: null,
    nombre: "",
    documento: null,
    tipoDocumento: "",
    idDocumento: "Direccion",
    carpetaArchivo: this.codigoGestion,
    cargado: false
  };

  // Variables Establecimiento /amoecheve
  datosEstablecimiento: IDatosTablaEstablecimiento[];
  datosEstablecimientoSalida: string;

  // Variables Datos del Contador /amoecheve
  datosContador: ContadorAuditor;
  datosContadorSalida: string;

  //variables para enviar a componente Accionista
  datosRegistroAccionista: RegistroSocioAccionista[];
  datosAccionistaSalida: string;

  // Variables para el componente de Datos Del Representante.
  datosRepresentante: Representante[];
  datosRepresentanteSalida: string;

  //variable envio de correo 
  datosCorreo: EnvioCorreo;

  /* COMUNICACION CON OTROS COMPONENTES */
  @Output() _datosUbicacionSalida = new EventEmitter<string>();
  @Output() _datosEstablecimientoSalida = new EventEmitter<string>();
  @Output() _datosAccionistaSalida = new EventEmitter<string>();
  @Output() _datosRepresentanteSalida = new EventEmitter<string>();
  @Output() _datosContadorSalida = new EventEmitter<string>();
  @Output() _datosAfiliacionImpuestoSalida = new EventEmitter<string>();

  @Input()
  set _datosAccionistaEntrada(datos: string) { }

  @Input()
  set _datosEstablecimientoEntrada(datos: string) { }

  @Input()
  set _datosContadorEntrada(datos: string) { }

  @Input()
  set _datosUbicacionEntrada(datos: string) { }

  @Input()
  set _datosRepresentanteEntrada(datos: string) { }

  /* COMUNICACION CON OTROS COMPONENTES */

  /** COMUNICACION CON COMPONENTE DE UBICACION */
  recibirDatosaUbicacion(datosEntrada: string) {
    console.log("recibirDatosaUbicacion " + datosEntrada);
    this._datosUbicacionEntrada = datosEntrada;
    console.log("datosEntrada " + datosEntrada);
    if (datosEntrada != null) {
      this.listaDirecciones = JSON.parse(datosEntrada);
      console.log(JSON.stringify(this.listaDirecciones));
    }
  }

  // Se envía al componente que se esta consumiendo
  enviarDatosAUbicacion() {
    this._datosUbicacionSalida.emit(JSON.stringify(this.listaDirecciones));
    this.datosUbicacionSalida = JSON.stringify(this.listaDirecciones);
  }
  /* COMUNICACION CON COMPONENTE DE UBICACION */

  /**   COMUNICACION CON COMPONENTE DE DATOS ESTABLECIMIENTOS / amoecheve */

  recibirDatosEstablecimiento(datosEntrada: string) {
    console.log("recibirDatosEstablecimiento datosEntrada " + datosEntrada);
    if (datosEntrada != null) {
      this.datosEstablecimiento = JSON.parse(datosEntrada);
      console.log(JSON.stringify(this.datosEstablecimiento));
    }
  }
  enviarDatosEstablecimiento() {
    console.log("this.datosEstablecimiento " + this.datosEstablecimiento);
    this._datosEstablecimientoSalida.emit(
      JSON.stringify(this.datosEstablecimiento)
    );
    this.datosEstablecimientoSalida = JSON.stringify(this.datosEstablecimiento);

    if (this.datosEstablecimiento) {
      console.log("Si tiene estatablecimiento");
    } else {
      console.log("No tiene estatablecimiento");
    }
  }

  /*   COMUNICACION CON COMPONENTE DE DATOS ESTABLECIMIENTOS / amoecheve */

  /**   COMUNICACION CON COMPONENTE DE DATOS DEL CONTADOR / amoecheve */

  RecibirDatosContador(datosEntrada: string) {
    console.log("recibirDatosContador datosEntrada " + datosEntrada);
    if (datosEntrada != null) {
      this.datosContador = JSON.parse(datosEntrada);
      console.log(JSON.stringify(this.datosContador));
    }
  }

  EnviarDatosContador() {
    console.log("this.datosContador " + this.datosContador);
    this._datosContadorSalida.emit(JSON.stringify(this.datosContador));
    this.datosContadorSalida = JSON.stringify(this.datosContador);
  }

  /*   COMUNICACION CON COMPONENTE DE DATOS DEL CONTADOR / amoecheve */

  /* COMUNICACION CON COMPONENTE DE ACCIONISTA */
  recibirDatosaAccionista(datosEntrada: string) {
    console.log("recibirDatosaAccionista " + datosEntrada);
    this._datosAccionistaEntrada = datosEntrada;
    if (datosEntrada != null) {
      this.datosRegistroAccionista = JSON.parse(datosEntrada);
    }
  }

  //se envia al componente que se esta consumiendo
  enviarDatosAAccionista() {
    this._datosAccionistaSalida.emit(
      JSON.stringify(this.datosRegistroAccionista)
    );
    this.datosAccionistaSalida = JSON.stringify(this.datosRegistroAccionista);
  }
  /* COMUNICACION CON COMPONENTE DE ACCIONISTA */

  /**   COMUNICACION CON COMPONENTE DE DATOS REPRESENTANTE / amoecheve */

  RecibirDatosRepresentante(datosEntrada: string) {
    console.log("RecibirDatosRepresentante: " + datosEntrada);
    if (datosEntrada != null) {
      this.datosRepresentante = JSON.parse(datosEntrada);
      console.log(JSON.stringify(this.datosRepresentante));
    }
  }

  enviarDatosRepresentante() {
    console.log("enviarDatosRepresentante() " + this.datosRepresentante);
    this._datosRepresentanteSalida.emit(
      JSON.stringify(this.datosRepresentante)
    );
    this.datosRepresentanteSalida = JSON.stringify(this.datosRepresentante);
  }

  /*   COMUNICACION CON COMPONENTE DE DATOS REPRESENTANTE / amoecheve */

  /**aalruanoe 06.12.18   COMUNICACION CON COMPONENTE DE IDENTIFICACION EMPRESA */

  @Output() _datosEmpresaSalida = new EventEmitter<string>();
  @Input() set _datosEmpresaEntrada(datos: string) { }
  datosSalidaEmpresa: string;
  private datosIdentificacionEmpresa: IdentificacionEmpresa = new IdentificacionEmpresa();

  recibirDatosEmpresa(datosEntrada: string) {
    console.log("recibirDatosEmpresa " + datosEntrada);
    this._datosEmpresaEntrada = datosEntrada;
    console.log("datosEntrada " + datosEntrada);
    if (datosEntrada != null) {
      this.datosIdentificacionEmpresa = JSON.parse(datosEntrada);
      if (this.datosIdentificacionEmpresa.tipoPersoneria) {
        this.codigoTipoPersoneria = this.datosIdentificacionEmpresa.tipoPersoneria.toString();
      }
      console.log(
        "datosIdentificacionEmpresa " +
        JSON.stringify(this.datosIdentificacionEmpresa)
      );
      console.log("Tipo de Personería ME: " + this.codigoTipoPersoneria);
    }
  }

  //se envia al componente que se esta consumiendo
  enviarDatosAEmpresa() {
    console.log("enviarDatosAEmpresa ");
    this._datosEmpresaSalida.emit(
      JSON.stringify(this.datosIdentificacionEmpresa)
    );
    this.datosSalidaEmpresa = JSON.stringify(this.datosIdentificacionEmpresa);
    console.log(
      "datosSalidaEmpresa " + JSON.stringify(this.datosIdentificacionEmpresa)
    );
  }

  /**aalruanoe 06.12.18   COMUNICACION CON COMPONENTE DE IDENTIFICACION EMPRESA */
  /**aalruanoe 17.12.18   COMUNICACION CON COMPONENTE DE AFILIACIONES */
  @Output() _datosAfiliacionSalida = new EventEmitter<string>();
  @Input() set _datosAfiliacionEntrada(datos: string) { }
  afiliacionImpuesto: AfiliacionImpuesto;  
  recibirDatosAfiliacion(datosEntrada: string) {
    console.log("recibirDatosAfiliacion " + datosEntrada);
    if (datosEntrada) {
      this.afiliacionImpuesto = JSON.parse(datosEntrada);
      console.log(
        " this.afiliacionImpuesto " + JSON.stringify(this.afiliacionImpuesto)
      );
    }
  }

  //se envia al componente que se esta consumiendo
  enviarDatosAAfiliacion() {
    console.log("enviarDatosAAfiliacion ");
    this._datosAfiliacionSalida.emit(JSON.stringify(this.tipoPersona));
    
  }

  enviarDatosAAfiliaciones() {
    console.log(
      "enviarDatosAAfiliaciones " + JSON.stringify(this.afiliacionImpuesto)
    );
    this._datosAfiliacionImpuestoSalida.emit(
      JSON.stringify(this.afiliacionImpuesto)      
    );
    
  }

  /**aalruanoe 17.12.18   COMUNICACION CON COMPONENTE DE AFILIACIONES */

  /**
   * constructor de la clase
   * @param inscripcionService
   * @param formBuilder
   */
  constructor(private servicios: Servicios
              ,private formBuilder: FormBuilder
              ,private sanitizer: DomSanitizer
              ,private dialogRequisitos: MatDialog) { }

  /**
   * Metodo que valida que se ingrese el captcha
   * @param captchaResponse resultado del captcha
   */
  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response ${captchaResponse}:`);

    this.$valorCaptcha = captchaResponse;
    if (captchaResponse) {
      this.isValid = true;
      this.isValidTmp = true;
    } else {
      this.isValid = false;
    }
    console.log(`isValid ${this.isValid}:`);
  }

  /**
   * Método que valida el Email
   * @param e
   */
  emailValidationType(e: any) {
    this.continuar=false;
    this.existeCorreo==false;
    this.mostrarSeleccion=true; 
    this.tieneGestion=false;
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //var re = /^[A-z0-9@_.-]*$/;
    if (re.test(String(e).toLowerCase())) {
      this.validEmailType = true;
      console.log(`Email valido ${this.validEmailType}:`);
      this.buscarEmail();
    } else {
      this.validEmailType = false;
      this.continuar = false;
    }
  }


   /**
   * Método que valida el Email para recuperar codigo
   * @param e
   */
  emailRecuperaCodigo(e: any) {
    console.log("emailRecuperaCodigo")
    this.continuar=false;
    this.existeCorreo==false;
    this.mostrarSeleccion=true; 
    this.tieneGestion=false;
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //var re = /^[A-z0-9@_.-]*$/;
    if (re.test(String(e).toLowerCase())) {
      this.validEmailType = true;
      console.log(`Email valido ${this.validEmailType}:`);
      this.buscarEmailRecuperaCodigo();
    } else {
      this.validEmailType = false;
      this.continuar = false;
    }
  }

   /**
   * Método que realiza las validaciones de negocio
   * del Email
   */
  public buscarEmailRecuperaCodigo() {

    console.log("buscarEmailRecuperaCodigo "+this.isncripcion.get("email").value);
    this.validAll = true;
    this.validateAllFormFields(this.isncripcion);    
    let codigoObtenido:string;
    console.log(this.validAll);
    if (this.validAll) {
      //se valida que si el correo tiene una gestión iniciada
      //se valida el codigo de seguridad
      this.servicios
        .getDataParametro(
          this.SESSION_RTU_URL,
          "correoElectronico",
          this.isncripcion.get("email").value
        )
        .subscribe((respuesta: RespuestaGestion) => {
          this.respuestaGestion = respuesta;
          console.log("respuesta.meta.count" + JSON.stringify(respuesta));
          if (respuesta.meta.count == "0") {
            console.log("Error. El correo electrónico no cuenta con una solicitud iniciada");
            this.tieneGestion = false;
            this.mostrarSeleccion = true;
            this.tieneGestionEmail=false;
            
          } else {
            console.log("existe una gestión iniciada");
            this.mostrarSeleccion = true;
            this.tieneGestionEmail=true;
            this.tieneGestion = true;
            console.log("respuesta.data.id " + respuesta.data[0].id);
            let contenido:string;
            let bodyCorreo: servicioBody;
            this.correoElectronico= this.isncripcion.get("email").value;
           
            codigoObtenido=respuesta.data[0].id;
            if(this.correoElectronico){
              contenido="<blockquote>Para ingresar a la solicitud de inscripción iniciada deberá ingresar el código de seguridad "+codigoObtenido+
              " (el código de seguridad deberá ser el mismo que se generó al inicio de la solicitud) <br /><br />";
              this.datosCorreo={
                archivosAdjuntos:null, 
                asunto:"Recuperación de código de solicitud", 
                contenido:contenido,
                destinatarios:this.correoElectronico,
                html:true,
                remitente:"string",
                separadorDestinatarios:","           
  
            }
            bodyCorreo = {body:this.datosCorreo};
            this.enviarCorreo(bodyCorreo);
          }
          
          console.log("this.codigoValido " + this.codigoValido);
        }
      }
        );

      if (this.tieneGestion) {
        this.continuar = false;
      } else {
        this.continuar = true;
      }


    }
  }

  /**
   * Metodo que valida que el tipo es texto
   * @param e
   */
  textValidationType(e: any) {
    if (e) {
      this.validTextType = true;
      if (this.tipoSeleccion == "02" || this.tipoSeleccion == "03" || (this.tipoSeleccion == "00" && this.tieneGestion && this.mostrarSeleccion == false)) {
        this.validaCodigo();
      }
    } else {
      this.validTextType = false;
    }
  }
  /**
   *
   * @param e Metodo que valida el tipo numerico
   */
  numberValidationType(e: any) {
    if (e) {
      this.validNumberType = true;
      if (this.tipoSeleccion == "01") {
        this.validaCompaniaTelefonica();
      }
    } else {
      this.validNumberType = false;
    }
  }

  /**
   * Método que realiza las validaciones de negocio
   * del Email
   */
  public buscarEmail() {
    console.log(this.isncripcion.get("email").value);
    this.validAll = true;
    this.validateAllFormFields(this.isncripcion);    
    console.log(this.validAll);
    if (this.validAll) {
      //se valida que si el correo tiene una gestión iniciada
      //se valida el codigo de seguridad
      this.servicios
        .getDataParametro(
          this.SESSION_RTU_URL,
          "correoElectronico",
          this.isncripcion.get("email").value
        )
        .subscribe((respuesta: RespuestaGestion) => {
          this.respuestaGestion = respuesta;
          console.log("respuesta.meta.count" + respuesta.meta.count);
          if (respuesta.meta.count == "0") {
            console.log("no tiene una gestión iniciada");
            this.tieneGestion = false;
            this.mostrarSeleccion = true;
          } else {
            console.log("existe una gestión iniciada");
            this.mostrarSeleccion = false;
            this.tieneGestion = true;
            
          }
          
          console.log("this.codigoValido " + this.codigoValido);
        });

      //se valida si existe el correo en SAT
      //19.02.2019 se comenta el código ya que solo se va a validar el correo para empresa según cambio en caso de uso version 1.3
      /*
       this.servicios
         .getDataParametro(
           this.EMAIL_AV_URL,
           "pEmail",
           this.isncripcion.get("email").value
         )
         .subscribe((data: Array<Object>) => {
           console.log(`getValidaExisteEmail ${data}`);
           if (String(data) == "false") {
             console.log("existe correo en SAT");
             this.existeCorreo = true;
           } else {
             console.log("no existe correo en SAT");
             this.existeCorreo = false;
           }
         });
 
         */
      //19.02.2019 se comenta la validación de existe correo derivado al cambio en el CU versión 1.3
      //if (this.existeCorreo && this.tieneGestion) {
      if (this.tieneGestion) {
        this.continuar = false;
      } else {
        this.continuar = true;
      }


    }
  }

  /**
   * Listener para verificar el formato de telefono
   */
  KeyDown_txtTelefono(e) {
    if (
      isNaN(e.key) &&
      e.key != "Enter" &&
      e.key != "Backspace" &&
      e.key != "Tab"
    ) {
      e.preventDefault();
    } else {
      if (
        e.key != "Enter" &&
        e.key != "Backspace" &&
        e.key != "Tab" &&
        this.telefono != null &&
        this.telefono.toString().length > 7
      ) {
        e.preventDefault();
      }
    }
  }

  /**
   * Metodo que valida la compania telefónica del teléfono
   */
  public validaCompaniaTelefonica() {
    if (this.telefono != null && this.telefono.toString().length == 8) {
      this.servicios
        .getDataParametroJson(this.COMPANIA_TEL_URL, "pNumero", this.telefono)
        .subscribe((data: Compania) => {
          console.log(`getValidaCompaniaTelefonica ${data.nombre}`);
          if(data.nombre=="Compañía Telefónica no configurada"){
            this.telefonoNoValido=true;
            this.tieneCompania = false;
            this.continuar = false;
          }else{
              this.companiaTelefonica = data.nombre;
              this.tieneCompania = true;
              this.continuar = true;
          }
          
          
        });

     
    }
  }

  /**
   * Metodo que valida que el código de seguridad sea válido
   */
  public validaCodigo() {
    this.continuar = false;
    this.codigoTemp = this.recuperaCodigo.get("codigoSeguridad").value;
    console.log(this.codigoTemp);
    //se valida el codigo de seguridad
    this.servicios
      .getData(this.SESSION_RTU_URL, null, this.codigoTemp, false)
      .subscribe((respuesta: Respuesta) => {
        this.respuestaRtu = JSON.parse(JSON.stringify(respuesta));
        console.log(
          "respuesta.data.id" + JSON.stringify(this.respuestaRtu.data.id)
        );
        if (this.respuestaRtu.data.id == this.codigoTemp) {
          this.codigoValido = true;
          this.continuar = true;
          console.log(
            "respuesta.data.attributes.datos " +
            JSON.stringify(
              this.respuestaRtu.data.attributes.datos.tipoContribuyente
            )
          );
          if(this.respuestaRtu.data.attributes.datos.tipoContribuyente)//se agrega la condicion para casos que se cargue una sesion sin tipoContribuyente. Gerardo Pineda (agapineda) 01/03/19
            this.tipoPersona = this.respuestaRtu.data.attributes.datos.tipoContribuyente.value;
          this.persona = this.respuestaRtu.data.attributes.datos.contribuyente.persona;
          this.datosIdentificacionEmpresa = this.respuestaRtu.data.attributes.datos.empresa; //aalruanoe 06.12.18
          //11.01.19 se agrega if para solventar bug de null en variable
          /* if( this.datosIdentificacionEmpresa.tipoPersoneria)
           {
             this.codigoTipoPersoneria = this.datosIdentificacionEmpresa.tipoPersoneria.toString(); // amoecheve 10.01.19
           }*/
          console.log("this.respuestaRtu.data.attributes.datos.actividadEconomica " + JSON.stringify(this.respuestaRtu.data.attributes.datos.actividadEconomica));
          this.actividadEconomica = this.respuestaRtu.data.attributes.datos.actividadEconomica;
          this.listaDirecciones = this.respuestaRtu.data.attributes.datos.ubicacion;
          this.datosEstablecimiento = this.respuestaRtu.data.attributes.datos.establecimiento;
          this.datosRepresentante = this.respuestaRtu.data.attributes.datos.representante;
          console.log(" this.respuestaRtu.data.attributes.datos.representante " + JSON.stringify(this.datosRepresentante));
          this.datosRegistroAccionista = this.respuestaRtu.data.attributes.datos.accionista;
          this.datosContador = this.respuestaRtu.data.attributes.datos.contador;
          this.afiliacionImpuesto = this.respuestaRtu.data.attributes.datos.afiliacionImpuesto; //aalruanoe 26.12.18
          console.log(
            "afiliacion de impuesto traida del lambda " +
            JSON.stringify(this.afiliacionImpuesto)
          );
        } else {
          this.codigoValido = false;
        }
        console.log("this.codigoValido " + this.codigoValido);
      });
  }

  /**
   * Metodo para enviar el correo
   */
  public enviarCorreo(datos:servicioBody){
    console.log("a enviar correo electronico "+ JSON.stringify(datos));
    this.servicios
        .postData(this.servicios.URL_ENVIO_EMAIL, null, datos, true)
        .subscribe((resultado) => {
          console.log("resultado: " + JSON.stringify(resultado));          
          
        });
  }

  /**
   * Metodo que graba la session
   */
  public grabarSession() {
    console.log("a grabarSession");
    let pBody: servicioBody;
    if (this.panel == 0) {
      this.datos = {
        tipoContribuyente: this.tipoContribuyente,
        contribuyente: this.contribuyente,
        empresa: this.datosIdentificacionEmpresa,
        actividadEconomica: this.actividadEconomica,
        ubicacion: this.listaDirecciones,
        establecimiento: this.datosEstablecimiento,
        representante: this.datosRepresentante,
        accionista: this.datosRegistroAccionista,
        contador: this.datosContador,
        afiliacionImpuesto: this.afiliacionImpuesto
      };
      this.atributo = {
        correoElectronico: this.isncripcion.get("email").value,
        id: null,
        telefono: this.isncripcion.get("telefono").value,
        datos: this.datos
      };
      this.session = { type: "sesionrtu", attributes: this.atributo };
      this.data = { data: this.session };
      pBody = { body: this.data };
      console.log("body this.SESSION_RTU_URL" + JSON.stringify(pBody));
      this.servicios
        .postData(this.SESSION_RTU_URL, null, pBody, false)
        .subscribe((resultado: Respuesta) => {
          console.log("id: " + resultado.data.id);
          this.codigoGestion = resultado.data.id;
          this.correoElectronico = this.isncripcion.get("email").value;
          let contenido:string;
          let bodyCorreo: servicioBody;
          if(this.correoElectronico){
            contenido="<blockquote>Señor contribuyente: Se ha iniciado una solicitud de inscripción, a partir de este momento cuenta con 10 días hábiles para completarla, sino la finaliza en dicho período se descartará. El código de segurdad es el "+this.codigoGestion+", con el podrá ingresar a su solicitud <br /><br />";
            this.datosCorreo={
              archivosAdjuntos:null, 
              asunto:"Inicio de Solicitud", 
              contenido:contenido,
              destinatarios:this.correoElectronico,
              html:true,
              remitente:"string",
              separadorDestinatarios:","           

          }
          bodyCorreo = {body:this.datosCorreo};
          this.enviarCorreo(bodyCorreo);
      
          }
          this.panel = 1;
          this.paso = 1;
         
        });

    } else {
      //se valida el codigo de segurida
      console.log("this.codigoValido " + this.codigoValido);
      console.log("paso " + this.paso);
      if (this.codigoValido) {
        this.servicios
          .getData(this.SESSION_RTU_URL, null, this.codigoGestion, false)
          .subscribe((respuesta: Respuesta) => {
            this.respuestaRtu = respuesta;
          });

        this.correoElectronico = this.respuestaRtu.data.attributes.correoElectronico;
        this.telefono = this.respuestaRtu.data.attributes.telefono;
      } else {
        this.correoElectronico = this.isncripcion.get("email").value;
        this.telefono = this.isncripcion.get("telefono").value;
      }
      this.tipoContribuyente = { value: this.tipoPersona };
      this.datos = {
        tipoContribuyente: this.tipoContribuyente,
        contribuyente: this.contribuyente,
        empresa: this.datosIdentificacionEmpresa, //aalruanoe 06.12.18 se agrega la empresa
        actividadEconomica: this.actividadEconomica,
        ubicacion: this.listaDirecciones,
        establecimiento: this.datosEstablecimiento,
        representante: this.datosRepresentante,
        accionista: this.datosRegistroAccionista,
        contador: this.datosContador,
        afiliacionImpuesto: this.afiliacionImpuesto
      };
      this.atributo = {
        correoElectronico: this.correoElectronico,
        telefono: this.telefono,
        id: this.codigoGestion,
        datos: this.datos
      };
      this.session = { type: "sesionrtu", attributes: this.atributo };
      this.data = { data: this.session };
      console.log("datos a actualizar " + JSON.stringify(this.data));
      pBody = { body: this.data };
      this.servicios
        .patchData(this.SESSION_RTU_URL, this.codigoGestion, pBody)
        .subscribe(
          (resultado: Respuesta) => {
            this.panel = 1;
          },
          resError => {
            console.error("Error al ejecutar la actualizacion ", resError);
          },
          () => {
            console.log("La actualizacion esta completa.");
          }
        );
    }
  }

  /**
   * Método que filtra la tabla
   * @param filterValue palabra a filtrar
   */
  applyFilter(filterValue: String) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  highlight(row: { ciiu: String }) {
    this.selectedRowCiiu = row.ciiu;
  }
  /**
   * Metodo que valida que un campo sea válido
   * @param form formgroup al que pertenece el campo a validar
   * @param field campo a validar
   */
  isFieldValid(form: FormGroup, field: string) {
    return !form.get(field).valid && form.get(field).touched;
  }

  /**
   * Método que se encarga de colocar un css especifico en un campo
   * @param form formgroup al que pertence el campo
   * @param field  campo al que se le agregará el css
   */
  displayFieldCss(form: FormGroup, field: string) {
    return {
      "has-error": this.isFieldValid(form, field),
      "has-feedback": this.isFieldValid(form, field)
    };
  }

  /**
   * Metodo que valida si es válido el tipo del fromgroup de inscripcion
   */
  onType() {
    if (this.isncripcion.valid) {
    } else {
      this.validateAllFormFields(this.isncripcion);
    }
  }

  /**
   * Metodo que valida todos los campos de un formgroup
   * @param formGroup formgroup a validar
   */
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

  // Método para cargar y grabar los datos del wizard vertical
  btnContinuarVertical() {
    console.log(
      "a enviar datos Establecimientos " +
      JSON.stringify(this.datosEstablecimiento)
    );
    //se valida que si el correo tiene una gestión iniciada
    // se graban los datos al JSON principal del formulario
    console.log(
      "datos de afiliaciones " + JSON.stringify(this.afiliacionImpuesto)
    );

    // Se envían los datos del establecimiento hacia la siguiente pantalla.
    this.enviarDatosEstablecimiento();

    // Se graban los datos en la función lambda.
    this.grabarSession();
  }

  /**
   * Metodo que hace el llamado a la pantalla de los pasos
   * @param $event
   */
  btnContinuar($event: any) {
    /* COMUNICACION CON OTROS COMPONENTES */
    console.log("a enviar datos " + JSON.stringify(this.listaDirecciones));
    this.enviarDatosAUbicacion();
    this.enviarDatosEstablecimiento();
    this.enviarDatosAAfiliacion();
    this.enviarDatosAAccionista();
    this.enviarDatosAAfiliaciones(); //27.12.18 aalruanoe se envian los datos cargados de afiliaciones
    // this.enviarDatosAEmpresa(); //06.12.18 aalruanoe se envian los datos cargados del json a la pantalla empresa
    this.EnviarDatosContador();//aalruanoe 10.01.19 se agrega la logica de enviar datos contador
    //   this.enviarDatosRepresentante();//11.01.19 aalruanoe se agrega la logica para enviar datos representantes


    /* COMUNICACION CON OTROS COMPONENTES */
    this.contribuyente = {
      persona: this.persona,
      organizacion: this.organizacion
    };

    console.log("this.codigoValido  " + this.codigoValido);
    if (!this.codigoValido) {
      console.log("limpiarContribuyente: !this.codigoValido");
      this.limpiarContribuyente();
    } else {
      if (this.respuestaRtu.data.attributes.datos.tipoContribuyente === undefined) {
        console.log("limpiarContribuyente: tipoContribuyente === undefined");
        this.limpiarContribuyente();
      } else {
        if (this.persona.Genero === -1 || this.persona.Genero === undefined) {
          console.log("limpiarContribuyente: Genero === undefined");
          this.limpiarContribuyente();
        } else {
          console.log("cargarContribuyente");
          this.cargarContribuyente();
        }
      }
    }

    //19.02.2019 se comenta la validación de existe correo derivado al cambio en el CU versión 1.3
    if (
      (this.continuar && this.tipoSeleccion == "00" && /*!this.existeCorreo &&*/ this.tieneGestion == false) ||
      (this.continuar && this.tipoSeleccion == "01" && this.tieneCompania)
    ) {
      //se valida que si el correo tiene una gestión iniciada
      console.log("a obtener el codigo");
      this.grabarSession();
    }

    if (
      (this.continuar && this.tipoSeleccion == "02") ||
      (this.tieneGestion && this.tipoSeleccion == "00") ||
      this.tipoSeleccion == "03"
    ) {
      if (this.codigoValido) {
        this.codigoGestion = this.codigoTemp;
        this.panel = 1;
      } else {
        console.log("a recuperar codigo");
        this.panel = 0;
        this.panelCodigo = true;
        console.log(`panel ${this.panel}`);
        console.log(`tipoSeleccion ${this.tipoSeleccion}`);
      }
    }
  }



  /**
   * Método que descarga los requisitos
   * @param $event
   */
  btnRequisitos($event: any) {
    console.log(`a descargar requisitos tipo de persona ${this.tipoPersona}`);
    var tipo = this.tipoPersona;
    var tipoPersonaSeleccionado: Array<CatDato> = this.listaTiposContribuyentePersona.filter(function (el) { return (el.codigoIngresado === tipo); });
    console.log("dato padre seleccionado " + tipoPersonaSeleccionado[0].codigo.toString());
    this.servicios.getData(this.servicios.URL_DATO, 'cat_dato', this.constantes.CODIGO_CAT_REQUISITO_CONTRIBUYENTE + "/" + tipoPersonaSeleccionado[0].codigo.toString(), false).subscribe(
      (data: Array<CatDato>) => {
        console.log(data);
        this.listaRequisitos = data;
        const dialogRef = this.dialogRequisitos.open(DialogoRequisitosComponent, {

          width: '900px',
          maxWidth: '999px',
          height:'720px',
          data: this.listaRequisitos
          
    
        }
        );
    
        dialogRef.afterClosed().subscribe(result => {
          console.log('Se cerró el dialogo de requisitos');
    
        });
      },
      error => {
        console.error("Error al buscar los requisitos según el tipo  contribuyente: " + error);
      }
    )

   

  }

  /**
   * Método que descarga el instructivo
   * @param $event
   */
  btnDescargarInstructivo(seccion: string) {
    console.log("a descargar instructivo");
    this.generarPdf(seccion);
  }

  btnSeleccionarActividad($event: any, actividad: ActividadEconomica) {
    console.log("actividad seleccionado " + JSON.stringify(actividad));

    this.actividadEconomica = actividad;
    this.actividadFormGroup.get("hayActividadEconomica").patchValue(false);
  }

  /**
   * Metodo para limpiar las tablas
   */
  limpiarTabla(codigo: number) {
    switch (codigo) {
      case 1:
        this.listaActvidad = [];
        this.generarTabla(this.listaActvidad);
        this.requeridaActividad=false;
        // this.actividadFormGroup.controls['check_actividadEconomica'].setValidators([Validators.required]);
        break;
      case 2:
        this.listaRequisitos = [];
      default:
        this.listaActvidad = [];
        this.listaRequisitos = [];
        break;
    }
  }


  /**
   * Metodo para generar tabla
   * @param source lista actividades economicas
   */
  generarTabla(source: ActividadEconomica[]) {
    this.dataSource = new MatTableDataSource<ActividadEconomica>(
      source
    );
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Metodo para cargar un panel especifico
   * @param paso numero del pane/paso
   * @param pStepper id del stepper
   */
  btnCargarPanel(paso: number, pStepper: MatStepper) {
    console.log(`a cargar panel número ${paso}`);
    this.paso = paso;
    switch (paso) {
      case 2:
        //se dirige al paso de persona/organizacion
        this.grabarSession();
        //se obtiene la actividad económica
        let pTipoPersona: string;
        if (this.tipoPersona == "1") {
          pTipoPersona = "1";
        } else {
          pTipoPersona = "2";
        }
        this.enviarDatosAEmpresa(); //06.12.18 aalruanoe se envian los datos cargados del json a la pantalla empresa
        console.log("a obtener actividad Economica");
        this.servicios
          .getDataParametro(
            this.servicios.URL_ACTIVIDAD_ECONOMICA,
            "pTipoPersona",
            pTipoPersona
          )
          .subscribe(
            (respuesta /*:[]*/) => {
              let resultado: string;
              //listaActvidadRes
              this.listaActvidad = respuesta as ActividadEconomica[];
              this.listaActvidadRes = respuesta as Array<
                ActividadEconomica
              >;
            },
            resError => {
              console.error(
                "Error al obtener la actividad economica ",
                resError
              );
            },
            () => {
              this.generarTabla(this.listaActvidadRes);

            }
          );
        console.log("sale de obtener actvidad economica");
        break;
      case 3:
        // Se dirige al paso de actividad economica
        
        //aalruanoe 11.01.19 se modificó la grabación antes de las validaciones 
        this.grabarSession();
        this.generarTabla(this.listaActvidad);
        
        
        //inicio logica de carga de actividad economica seleccionada
        let dataActividad = Object.assign(this.listaActvidad);
        let preseleccionado = dataActividad;
        this.dataSource.data.forEach(item => {
          let index: number = dataActividad.findIndex(
            (d: ActividadEconomica) => d === item
          );
          //          console.log(dataActividad.findIndex(d => d === item));
          if (item.id.ciiu != null) {
            console.log("this.actividadEconomica " + JSON.stringify(this.actividadEconomica))
            if (this.actividadEconomica) {
              if (item.id.ciiu == this.actividadEconomica.id.ciiu) {
                //      console.log("index " + index);
                preseleccionado = this.dataSource.data.slice(index);
                this.selection = new SelectionModel<ActividadEconomica>(this.allowMultiSelect, preseleccionado);
                                this.requeridaActividad=false;


                console.log("requeridaActividad "+this.requeridaActividad);
              }
            }                 
           
          }
        });

        // Habilita secciones de Obligaciones o Relacionamientos Empresa CU amoecheve
        if (this.tipoPersona === "2") {
          if(this.esDelegado){

            this.HideSecciones();
            this.seccionObligaciones = true;
            this.seccionEstablecimiento = true;
            this.seccionAfiliaciones = true;
            this.seccionRelacionamientos = true;
            this.seccionRepresentante = true;

          } else {
          
            console.log("this.codigoTipoPersoneria: " + this.codigoTipoPersoneria);
            switch (this.codigoTipoPersoneria) {
              case "709":
                // [FA01] CU Habilitación de Secciones amoecheve.
                this.HideSecciones();
                this.seccionObligaciones = true;
                this.seccionAfiliaciones = true;
                this.seccionRelacionamientos = true;
                this.seccionRepresentante = true;
                this.seccionSocioAccionista = true;
  
                break;
              case "715":
                // [FA02] CU Habilitación de Secciones amoecheve.
                this.HideSecciones();
                this.HabilitacionFA02();
  
                break;
              case "716":
                // [FA02] CU Habilitación de Secciones amoecheve.
                this.HideSecciones();
                this.HabilitacionFA02();
  
                break;
              case "722":
                // [FA03] CU Habilitación de Secciones amoecheve.
                this.HideSecciones();
                this.HabilitacionFA03();
  
                break;
              case "742":
                // [FA03] CU Habilitación de Secciones amoecheve.
                this.HideSecciones();
                this.HabilitacionFA03();
  
                break;
              case "743":
                // [FA03] CU Habilitación de Secciones amoecheve.
                this.HideSecciones();
                this.HabilitacionFA03();
  
                break;
              case "744":
                // [FA03] CU Habilitación de Secciones amoecheve.
                this.HideSecciones();
                this.HabilitacionFA03();
  
                break;
              case "745":
                // [FA03] CU Habilitación de Secciones amoecheve.
                this.HideSecciones();
                this.HabilitacionFA03();
  
                break;
              case "746":
                // [FA03] CU Habilitación de Secciones amoecheve.
                this.HideSecciones();
                this.HabilitacionFA03();
                break;
              case "717":
                // [FA04] CU Habilitación de Secciones amoecheve.
                this.HideSecciones();
                this.HabilitacionFA04();
  
                break;
              case "718":
                // [FA04] CU Habilitación de Secciones amoecheve.
                this.HideSecciones();
                this.HabilitacionFA04();
  
                break;
              case "719":
                // [FA04] CU Habilitación de Secciones amoecheve.
                this.HideSecciones();
                this.HabilitacionFA04();
  
                break;
              case "720":
                // [FA04] CU Habilitación de Secciones amoecheve.
                this.HideSecciones();
                this.HabilitacionFA04();
  
                break;
              case "721":
                // [FA04] CU Habilitación de Secciones amoecheve.
                this.HideSecciones();
                this.HabilitacionFA04();
  
                break;
              case "723":
                // [FA04] CU Habilitación de Secciones amoecheve.
                this.HideSecciones();
                this.HabilitacionFA04();
  
                break;
              case "724":
                // [FA04] CU Habilitación de Secciones amoecheve.
                this.HideSecciones();
                this.HabilitacionFA04();
  
                break;
              case "725":
                // [FA04] CU Habilitación de Secciones amoecheve.
                this.HideSecciones();
                this.HabilitacionFA04();
  
                break;
              case "726":
                // [FA04] CU Habilitación de Secciones amoecheve.
                this.HideSecciones();
                this.HabilitacionFA04();
  
                break;
              case "727":
                // [FA04] CU Habilitación de Secciones amoecheve.
                this.HideSecciones();
                this.HabilitacionFA04();
  
                break;
              case "728":
                // [FA04] CU Habilitación de Secciones amoecheve.
                this.HideSecciones();
                this.HabilitacionFA04();
  
                break;
              case "729":
                // [FA04] CU Habilitación de Secciones amoecheve.
                this.HideSecciones();
                this.HabilitacionFA04();
  
                break;
              case "730":
                // [FA04] CU Habilitación de Secciones amoecheve.
                this.HideSecciones();
                this.HabilitacionFA04();
  
                break;
              case "731":
                // [FA04] CU Habilitación de Secciones amoecheve.
                this.HideSecciones();
                this.HabilitacionFA04();
  
                break;
              case "732":
                // [FA04] CU Habilitación de Secciones amoecheve.
                this.HideSecciones();
                this.HabilitacionFA04();
  
                break;
              case "733":
                // [FA04] CU Habilitación de Secciones amoecheve.
                this.HideSecciones();
                this.HabilitacionFA04();
  
                break;
              case "734":
                // [FA04] CU Habilitación de Secciones amoecheve.
                this.HideSecciones();
                this.HabilitacionFA04();
  
                break;
              case "735":
                // [FA04] CU Habilitación de Secciones amoecheve.
                this.HideSecciones();
                this.HabilitacionFA04();
  
                break;
              case "736":
                // [FA04] CU Habilitación de Secciones amoecheve.
                this.HideSecciones();
                this.HabilitacionFA04();
  
                break;
              case "737":
                // [FA04] CU Habilitación de Secciones amoecheve.
                this.HideSecciones();
                this.HabilitacionFA04();
  
                break;
              case "738":
                // [FA04] CU Habilitación de Secciones amoecheve.
                this.HideSecciones();
                this.HabilitacionFA04();
  
                break;
              case "739":
                // [FA04] CU Habilitación de Secciones amoecheve.
                this.HideSecciones();
                this.HabilitacionFA04();
  
                break;
              case "740":
                // [FA04] CU Habilitación de Secciones amoecheve.
                this.HideSecciones();
                this.HabilitacionFA04();
  
                break;
              case "741":
                // [FA04] CU Habilitación de Secciones amoecheve.
                this.HideSecciones();
                this.HabilitacionFA04();
  
                break;
              default:
                // [FA05] CU Habilitación de Secciones amoecheve.
                this.HideSecciones();
                this.seccionObligaciones = true;
                this.seccionEstablecimiento = true;
                this.seccionAfiliaciones = true;
                this.seccionRelacionamientos = true;
                this.seccionContador = true;
                this.seccionRepresentante = true;
                this.seccionSocioAccionista = true;
                console.log("[FA05]");
  
                break;
            }
          }
        }
        break;

      // Fin logica de carga de actividad economica seleccionada

      case 4:
        if(this.selection.hasValue()){ //si hay al menos una actividad economica seleccionada
          console.log("requeridaActividad "+this.requeridaActividad);
      
          // Se dirige al paso de ubicación

          // Habilita secciones de Obligaciones o Relacionamientos Persona CU amoecheve
          if (this.tipoPersona === "1") {
            console.log(
              "this.actividadEconomica.nombre ME " +
              this.actividadEconomica.nombre
            );

            // Flujo básico del CU Habilitación de Secciones amoecheve.
            if (
              this.actividadEconomica.id.ciiu === "0001.40" ||
              this.actividadEconomica.id.ciiu === "0002.40"
            ) {
              this.seccionObligaciones = false;
              this.seccionRelacionamientos = false;
            }

            // Flujo alterno [FA06] del CU Habilitación de Secciones amoecheve.
            if (this.actividadEconomica.id.ciiu === "8421.40") {
              this.seccionObligaciones = true;
              this.seccionEstablecimiento = true;
              this.seccionAfiliaciones = true;
            }

            // Flujo alterno [FA07] del CU Habilitación de Secciones amoecheve.
            if (
              this.actividadEconomica.id.ciiu != "0001.40" &&
              this.actividadEconomica.id.ciiu != "0002.40" &&
              this.actividadEconomica.id.ciiu != "8421.40"
            ) {
              this.seccionObligaciones = true;
              this.seccionEstablecimiento = true;
              this.seccionAfiliaciones = true;
              this.seccionRelacionamientos = true;
              this.seccionContador = true;
              this.seccionRepresentante = true;
            }
          }
          this.enviarDatosRepresentante();//11.01.19 aalruanoe se agrega la logica para enviar datos representantes        
          this.grabarSession();
          this.actividadFormGroup.get("hayActividadEconomica").patchValue(true);
          pStepper.next(); //pasar a la siguiente pantalla del stepper
        }
        break;

      case 5:
        if(this.listaDirecciones && this.listaDirecciones.ubicacion.length>0){
          //se dirige al paso de obligaciones
          console.log(
            "afiliacionImpuesto " + JSON.stringify(this.afiliacionImpuesto)
          );
          this.enviarDatosAAfiliacion();
          this.enviarDatosAAfiliaciones();
          this.grabarSession();
          this.ubicacionFormGroup.get('esValidoUbicacion').patchValue(1);
          pStepper.next();
        }
        break;

      case 6:
        //se dirige al paso de relacionamientos              
        this.grabarSession();
        break;
      case 7:
        //se dirige al paso final
        let sumAcciones = 0;
        if(this.datosRegistroAccionista && this.datosRegistroAccionista.length>0){
          if(this.datosRegistroAccionista[0].col_7==0){
            this.datosRegistroAccionista.forEach(row => {
              sumAcciones += Number(row.col_3.val);
            });
          }else{
            if(this.datosRegistroAccionista[0].col_7==1){
              this.datosRegistroAccionista.forEach(row => {
                sumAcciones += Number(row.col_4.val);
              });
            }
          }
        }
        if(sumAcciones <= 100){
          console.log("se graba session del paso 7 de relacionamientos");
          this.grabarSession();
          this.tercerosFormGroup.get("esValidoSocioAccionista").patchValue(1);
          pStepper.next();
        }
        break;
      default:
        console.log("Ultimo panel");
        break;
    }
  }

  /**
   * Metodo para refrescar la pagina
   */
  refresh(): void {
    window.location.reload();
  }

  /** Método que oculta todas las secciones de Obligaciones y Relacionamientos */
  HideSecciones() {
    this.seccionObligaciones = false;
    this.seccionRelacionamientos = false;
  }

  /** Método que cumple con el flujo alterno [FA02] del CU de Habilitación de Secciones */
  HabilitacionFA02() {
    this.seccionObligaciones = true;
    this.seccionAfiliaciones = true;
    this.seccionRelacionamientos = true;
    this.seccionContador = true;
    this.seccionRepresentante = true;
    console.log("[FA02]");
  }

  /** Método que cumple con el flujo alterno [FA03] del CU de Habilitación de Secciones */
  HabilitacionFA03() {
    this.seccionRelacionamientos = true;
    this.seccionRepresentante = true;
    console.log("[FA03]");
  }

  /** Método que cumple con el flujo alterno [FA04] del CU de Habilitación de Secciones */
  HabilitacionFA04() {
    this.seccionObligaciones = true;
    this.seccionEstablecimiento = true;
    this.seccionAfiliaciones = true;
    this.seccionRelacionamientos = true;
    this.seccionContador = true;
    this.seccionRepresentante = true;
    console.log("[FA04]");
  }


  /**
   * Limpia o inicializa los controles de pantalla
   */
  limpiarContribuyente() {
    this.selGenero.reset();
    this.selEstadoCivil.reset();
    this.selNacionalidad.reset();
    this.selTipoDocumento.reset();
    this.txtDPI.reset();
    this.txtPasaporte.reset();
    this.selMunNac.reset();
    this.selMunCedula.reset();
    this.selDeptoNac.reset();
    this.selNoOrden.reset();
    this.txtNoCedula.reset();
    this.selPaisOrigen.reset();
    this.txtPrimerNombre.reset();
    this.txtSegundoNombre.reset();
    this.txtOtrosNombres.reset();
    this.txtPrimerApellido.reset();
    this.txtSegundoApellido.reset();
    this.txtApellidoCasada.reset();
    this.txtNITConyuge.reset();
    this.txtNombresConyuge.reset();
    this.txtFechaNac.reset();
    this.txtFechaVencimientoDPI.reset();
    this.txtfechaEmisionDPI.reset();
    this.selPoblacion.reset();
    this.selComLing.reset();
    this.txtDPIPadre.reset();
    this.txtNitPadre.reset();
    this.txtNombresPadre.reset();
    this.txtDPIMadre.reset();
    this.txtNitMadre.reset();
    this.txtNombresMadre.reset();
    this.nombresRepetidos = false;
    this.persona = {
      Genero: -1,
      Estado_Civil: -1,
      Nacionalidad: -1,
      TipoDocumento: 0,
      DPI: "",
      Pasaporte: "",
      Municipio_Nacimiento: -1,
      Municipio_Emision_Cedula: -1,
      Departamento_Nacimiento: -1,
      Numero_Orden_Cedula: -1,
      Numero_Registro_Cedula: "",
      Pais_Origen: -1,
      Primer_Nombre: "",
      Segundo_Nombre: "",
      Otros_Nombres: "",
      Primer_Apellido: "",
      Segundo_Apellido: "",
      Apellido_Casada: "",
      NITConyuge: "",
      NombresConyuge: "",
      Fecha_Nacimiento: "",
      Fecha_Vencimiento_DPI: "",
      Fecha_Emision_DPI: "",
      Poblacion: -1,
      Comunidad_Linguistica: -1,
      DPIPadre: "",
      Nit_Padre: "",
      Nombres_Padre: "",
      DPIMadre: "",
      Nit_Madre: "",
      Nombres_Madre: ""
    };
    this.contribuyente.persona = this.persona;
    this.formGroupIdentificacionPersona.controls["txtPasaporte"].enable();
    this.onChange_radioTipoDoc();
    if(this.isncripcion.get("email").value || this.isncripcion.get("telefono").value){
      this.formularioListo = true;
    }
    // this.txtNoCedula.enable();
    // this.txtDPI.enable();
    //limpiar organizacion
  }

  /**
   * Mapea la informacion del contribuyente a los controles en pantalla. Debido a que algunos controles utilizan
   * un tipo de dato mas complejo es necesario este procedimiento.
   */
  cargarContribuyente() {
    if (this.tipoPersona == this.contribuyentePersona) {
      //persona
      console.log(
        "cargar contribuyente this.persona.Genero " +
        this.persona.Genero
      );
      this.formGroupIdentificacionPersona.get("selGenero").setValue(this.persona.Genero);
      this.onChange_selGenero(null);//Actualizar genero
      this.formGroupIdentificacionPersona.get("selEstadoCivil").setValue(this.persona.Estado_Civil);
      this.formGroupIdentificacionPersona.get("txtPrimerNombre").setValue(this.persona.Primer_Nombre);
      this.formGroupIdentificacionPersona.get("txtSegundoNombre").setValue(this.persona.Segundo_Nombre);
      this.formGroupIdentificacionPersona.get("txtOtrosNombres").setValue(this.persona.Otros_Nombres);
      this.formGroupIdentificacionPersona.get("txtPrimerApellido").setValue(this.persona.Primer_Apellido);
      this.formGroupIdentificacionPersona.get("txtSegundoApellido").setValue(this.persona.Segundo_Apellido);
      if(this.persona.Genero == 1 && this.persona.Estado_Civil == 1){
        this.formGroupIdentificacionPersona.get("txtApellidoCasada").setValue(this.persona.Apellido_Casada);
        this.formGroupIdentificacionPersona.get("txtNITConyuge").setValue(this.persona.NITConyuge);
        this.formGroupIdentificacionPersona.get("txtNombresConyuge").setValue(this.persona.NombresConyuge);
      }
      this.formGroupIdentificacionPersona.get("txtFechaNac").setValue(this.persona.Fecha_Nacimiento);
      this.onChangeLoad_txtFechaNac(moment(this.persona.Fecha_Nacimiento).format('L'));
      this.formGroupIdentificacionPersona.get("selNacionalidad").setValue(this.persona.Nacionalidad);
      this.onChange_selNacionalidad();
      if(this.persona.Nacionalidad == 0){
        this.formGroupIdentificacionPersona.get("selTipoDocumento").setValue(this.persona.TipoDocumento);
        this.formGroupIdentificacionPersona.get("selDeptoNac").setValue(this.persona.Departamento_Nacimiento);
        this.onChange_selDeptoNac(this.persona.Departamento_Nacimiento);
        this.formGroupIdentificacionPersona.get("selMunNac").setValue(this.persona.Municipio_Nacimiento);
        this.formGroupIdentificacionPersona.get("selPoblacion").setValue(this.persona.Poblacion);
        this.formGroupIdentificacionPersona.get("selComLing").setValue(this.persona.Comunidad_Linguistica);
        if (this.persona.TipoDocumento == 1) {
          this.formGroupIdentificacionPersona.get("selNoOrden").setValue(this.persona.Numero_Orden_Cedula);
          this.formGroupIdentificacionPersona.get("txtNoCedula").setValue(this.persona.Numero_Registro_Cedula);
        }else
          if(this.persona.TipoDocumento == 0){
            this.formGroupIdentificacionPersona.get("txtDPI").setValue(this.persona.DPI);
          }
      }
      if(this.persona.Fecha_Vencimiento_DPI){
        this.formGroupIdentificacionPersona.get("txtFechaVencimientoDPI").setValue(this.persona.Fecha_Vencimiento_DPI);
      }
      if(this.persona.Fecha_Emision_DPI){
        this.formGroupIdentificacionPersona.get("txtfechaEmisionDPI").setValue(this.persona.Fecha_Emision_DPI);
      }
      if (this.persona.Pais_Origen > -1) {
        this.formGroupIdentificacionPersona.get("selPaisOrigen").setValue(this.persona.Pais_Origen);
      }
      if (this.persona.TipoDocumento == 1) {
        this.formGroupIdentificacionPersona.get("selMunCedula").setValue(this.persona.Municipio_Emision_Cedula);
      }
      this.formGroupIdentificacionPersona.get("txtDPIPadre").setValue(this.persona.DPIPadre);
      this.formGroupIdentificacionPersona.get("txtNitPadre").setValue(this.persona.Nit_Padre);
      this.formGroupIdentificacionPersona.get("txtNombresPadre").setValue(this.persona.Nombres_Padre);
      this.formGroupIdentificacionPersona.get("txtDPIMadre").setValue(this.persona.DPIMadre);
      this.formGroupIdentificacionPersona.get("txtNitMadre").setValue(this.persona.Nit_Madre);
      this.formGroupIdentificacionPersona.get("txtNombresMadre").setValue(this.persona.Nombres_Madre);
      this.formGroupIdentificacionPersona.get("txtPasaporte").setValue(this.persona.Pasaporte);
      this.formularioListo = true;
    } else {
      //cargar organizacion
    }
  }

  limpiarActividadEconomica() {
    this.actividadEconomica = null;
    //this.dataSource.data.forEach(row => this.selection.select(row));
    this.selection.clear();
    this.actividadFormGroup.get("hayActividadEconomica").patchValue(false);
  }

  /**Obtener pdf instructivo */
  generarPdf(seccion: string) {    
   
    var data = document.getElementById(seccion);  
    html2canvas(data).then(canvas => {  
      // Few necessary setting options  
      var imgWidth = 208;   
      var pageHeight = 295;    
      var imgHeight = canvas.height * imgWidth / canvas.width;  
      var heightLeft = imgHeight;    
      const contentDataURL = canvas.toDataURL('image/png')  
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 0;  
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
      pdf.save('instructivo_'+seccion+'.pdf'); // Generated PDF   
    });  

  }
  /**
   * Listener para verificar el formato de DPI
   */
  KeyDown_txtDPI(e) {
    if (
      (isNaN(e.key) &&
        e.key != "Enter" &&
        e.key != "Backspace" &&
        e.key != "Tab") ||
      e.keyCode == 32
    ) {
      e.preventDefault();
    } else {
      if (e.target.name.slice(0, 6) == "txtNit") {
        return; //si se esta validando el Nit solo ejecutar la validacion numerica
      }
      if (
        e.key != "Enter" &&
        e.key != "Backspace" &&
        e.key != "Tab" &&
        e.target.value != null &&
        e.target.value.toString().length > 12
      ) {
        e.preventDefault();
      }
    }
  }

  /**
   * Carga la lista de municipios en base al valor seleccionado.
   * @param pCodigoDepto Codigo del departamento seleccionado
   */
  onChange_selDeptoNac(pCodigoDepto){
    this.formGroupIdentificacionPersona.get("selMunNac").reset();
    this.listaMunicipio$ = this.servicios.getData(this.servicios.URL_DATO, 'cat_dato_by_dato_padre', pCodigoDepto, false);
  }

  onBlur_txtPasaporte(e) {
    if (e.target.value.length <= 4) {
      this.formGroupIdentificacionPersona.controls[e.target.name].setErrors({
        PasaporteCorto: true
      });
    } else {
      this.formGroupIdentificacionPersona.controls[e.target.name].setErrors({
        PasaporteCorto: null
      });
      this.formGroupIdentificacionPersona.controls[
        e.target.name
      ].updateValueAndValidity();
      var pattern1 = /((0){5,}|(1){5,}|(2){5,}|(3){5,}|(4){5,}|(5){5,}|(6){5,}|(7){5,}|(8){5,}|(9){5,})/;
      if (pattern1.test(e.target.value)) {
        this.formGroupIdentificacionPersona.controls[e.target.name].setErrors({
          PasaporteInvalido: true
        });
      } else {
        this.formGroupIdentificacionPersona.controls[e.target.name].setErrors({
          PasaporteInvalido: null
        });
        this.formGroupIdentificacionPersona.controls[
          e.target.name
        ].updateValueAndValidity();
        //verificar microservicio si existe en la BD
        if(!this.formGroupIdentificacionPersona.controls[e.target.name].errors){
          this.servicios.getData(this.servicios.URL_CONTRIBUYENTE_INDIVIDUAL,"rtu_contribuyente_individual/passport",e.target.value, false).subscribe(res =>{
            if(Object.keys(res).length){
                //this.contribuyente.persona.Pais_Origen
                this.formGroupIdentificacionPersona.controls[e.target.name].setErrors({PasaporteRepetido: true});
            }else{
                this.formGroupIdentificacionPersona.controls[e.target.name].setErrors({PasaporteRepetido: null});
                this.formGroupIdentificacionPersona.controls[e.target.name].updateValueAndValidity();
            }
          });
        }
      }
    }
  }

  /**
   * Listener para verificar que el CUI no esta conformado por series de numeros o repetido
   */
  onBlur_txtDPI(e) {
    var pattern1 = /((0\d){6}|(1\d){6}|(2\d){6}|(3\d){6}|(4\d){6}|(5\d){6}|(6\d){6}|(7\d){6}|(8\d){6}|(9\d){6})/;
    if (pattern1.test(e.target.value)) {
      this.formGroupIdentificacionPersona.controls[e.target.name].setErrors({
        CUINoValido: true
      });
    } else {
      this.formGroupIdentificacionPersona.controls[e.target.name].setErrors({
        CUINoValido: null
      });
      this.formGroupIdentificacionPersona.controls[e.target.name].updateValueAndValidity();
      //verificar microservicio si existe en la BD
      if(e.target.name=='txtDPI' && e.target.value.length>0 && !this.formGroupIdentificacionPersona.controls[e.target.name].errors){
        this.servicios.getData(this.servicios.URL_CONTRIBUYENTE_INDIVIDUAL,"rtu_contribuyente_individual/cui",e.target.value, false).subscribe(res => {
          if(Object.keys(res).length > 0){
              this.formGroupIdentificacionPersona.controls[e.target.name].setErrors({DPIRepetido: true});
          }else{
              this.formGroupIdentificacionPersona.controls[e.target.name].setErrors({DPIRepetido: null});
              this.formGroupIdentificacionPersona.controls[e.target.name].updateValueAndValidity();
          }
        });
      }
    }
  }

  /**
   * Listener para verificar el formato de cedula
   */
  KeyDown_txtNoCedula(e) {
    if (
      isNaN(e.key) &&
      e.key != "Enter" &&
      e.key != "Backspace" &&
      e.key != "Tab"
    ) {
      e.preventDefault();
    }
  }

  /**
   * Listener para verificar la validez de la cedula
   */
  onBlur_txtNoCedula(e: any) {
    //verificar microservicio si existe en la BD
    if(!e || !e.target.value) return;
    console.log(e.target.name);
    console.log(e);
    let params = "A-1/" + this.persona.Numero_Registro_Cedula;
    this.servicios.getData(this.servicios.URL_CONTRIBUYENTE_INDIVIDUAL, "rtu_contribuyente_individual/registro/numero", params, false).subscribe(res => {
      if(Object.keys(res).length > 0){ //Municipio_Emision_Cedula
          this.formGroupIdentificacionPersona.controls[e.target.name].setErrors({cedulaRepetida: true});
      }else{
          this.formGroupIdentificacionPersona.controls[e.target.name].setErrors({cedulaRepetida: null});
          this.formGroupIdentificacionPersona.controls[e.target.name].updateValueAndValidity();
      }
    }, err => console.log("mensaje: "+JSON.stringify(err)));
  }

  /**
   * Listener para verificar alfanumericos para nombres y apellidos
   */
  keyDown_verificarAlfanumerico(e) {
    var code = e.key.charCodeAt(0);
    if (
      !(code > 47 && code < 58) && // numeric (0-9)
      !(code > 64 && code < 91) && // upper alpha (A-Z)
      !(code > 96 && code < 123) && // lower alpha (a-z)
      code != 46 && // .
      code != 38 && // &
      code != 47 && // /
      code != 45 && // -
      code != 44 && // ,
      code != 95 // _
    ) {
      e.preventDefault();
    }
  }

  /**
   * Listener para verificar alfanumericos de NIT
   */
  keyDown_verificarAlfanumericoNIT(e) {
    if (e.key == undefined) return;
    var code = e.key.charCodeAt(0);
    if (!(code > 47 && code < 58) && // numeric (0-9)
      !(code > 64 && code < 91) && // upper alpha (A-Z)
      !(code > 96 && code < 123)) { // lower alpha (a-z)
      e.preventDefault();
    }
  }

  /**
   * Listener para validar NIT
   */
  onBlur_txtNITConyuge(e) {
    var tmpValor = e.target.value;
    var tmpName = e.target.name;
    if (!tmpValor) {
      // console.log("Campo NIT sin valor");
      return;
    }

    while (tmpValor.search(/(\s|\-|_)/) != -1) tmpValor = tmpValor.replace(/(\s|\-|_)+/, "");
    tmpValor = tmpValor.toUpperCase();
    this.formGroupIdentificacionPersona.controls[tmpName].setValue(tmpValor);

    if (tmpValor == "00") {
      this.formGroupIdentificacionPersona.controls[tmpName].setValue("");
      this.formGroupIdentificacionPersona.controls["txtNombresConyuge"].setValue("");
      console.log("Error del control nit: valor es 00. " + tmpName);
    } else {
      this.formGroupIdentificacionPersona.controls[tmpName].setErrors({ pattern: null });
      this.servicios.getData(this.servicios.URL_SAT_CONTRIBUYENTES, 'verificaNIT', tmpValor, false).subscribe(esValido => {
        if (esValido) {
          this.formGroupIdentificacionPersona.controls[tmpName].setErrors({ pattern: null });
          this.servicios.getData(this.servicios.URL_SAT_CONTRIBUYENTES, 'existeContribuyente', tmpValor, false).subscribe(existe => {
            if (existe) {
              this.formGroupIdentificacionPersona.controls[tmpName].setErrors({ existe: null });
              this.servicios.getData(this.servicios.URL_SAT_CONTRIBUYENTES, null, tmpValor, false).subscribe((data: SatContribuyente) => {
                if (data.status.toUpperCase() != 'A') {
                  this.formGroupIdentificacionPersona.controls[tmpName].setErrors({ inactive: true });
                  this.formGroupIdentificacionPersona.controls["txtNombresConyuge"].setValue("");
                  console.log("Error del control nit: nit esta inactivo");
                } else {
                  this.formGroupIdentificacionPersona.controls[tmpName].setErrors({ inactive: null });
                  this.formGroupIdentificacionPersona.controls[tmpName].updateValueAndValidity();
                  this.servicios.getData(this.servicios.URL_CONTRIBUYENTE, "rtu_contribuyente_individual", tmpValor, false).subscribe((data: SatContribuyenteIndividual) => {
                    let nombresConyuge = data.primerNombre ? data.primerNombre : "";
                    nombresConyuge += data.segundoNombre ? " " + data.segundoNombre : "";
                    nombresConyuge += data.primerApellido ? " " + data.primerApellido : "";
                    nombresConyuge += data.segundoApellido ? " " + data.segundoApellido : "";
                    nombresConyuge += data.apellidoCasada ? " " + data.apellidoCasada : "";
                    this.formGroupIdentificacionPersona.controls["txtNombresConyuge"].setValue(nombresConyuge);
                  }, error => console.log("Nombres conyuge: " + error.status + ", " + error.statusText));
                }
              });
            } else {
                this.formGroupIdentificacionPersona.controls[tmpName].setErrors({existe: true});
                this.formGroupIdentificacionPersona.controls["txtNombresConyuge"].setValue("");
                this.formGroupIdentificacionPersona.controls[tmpName].markAsTouched();
              }
          }, error => {
            this.formGroupIdentificacionPersona.controls[tmpName].setErrors({ existe: true });
            this.formGroupIdentificacionPersona.controls["txtNombresConyuge"].setValue("");
            this.formGroupIdentificacionPersona.controls[tmpName].markAsTouched();
          });
        } else {
            this.formGroupIdentificacionPersona.controls[tmpName].setErrors({pattern: true});
            this.formGroupIdentificacionPersona.controls["txtNombresConyuge"].setValue("");
            this.formGroupIdentificacionPersona.controls[tmpName].markAsTouched();
          }
      }, error => {
        this.formGroupIdentificacionPersona.controls[tmpName].setErrors({ pattern: true });
        this.formGroupIdentificacionPersona.controls["txtNombresConyuge"].setValue("");
        this.formGroupIdentificacionPersona.controls[tmpName].markAsTouched();
        console.log("Nit no es valido");
      });
    }

    this.formGroupIdentificacionPersona.controls[tmpName].updateValueAndValidity();
  }

  /**
   * Listener para calcular fecha de emision del dpi y validar la fecha de vencimiento juntamente con el filtro [Min]
   */
  onChange_txtFechaVencimientoDPI(e: {
    target: { value: any };
    targetElement: { name: any };
  }) {
    var tmpVal = e.target.value;
    var tmpName = e.targetElement.name;
    if (!tmpVal) {
      return;
    }
    var tmpFechaEmision = moment(tmpVal.toDate());
    tmpFechaEmision.subtract(10, "years");
    tmpFechaEmision.add(1, "days");
    var tmpToday = new Date();
    if (tmpVal.toDate() <= tmpToday) {
      this.formGroupIdentificacionPersona.controls[tmpName].setErrors({
        matDatepickerMin: true
      });
      this.formGroupIdentificacionPersona.controls[
        "txtfechaEmisionDPI"
      ].setValue("");
    } else {
      this.formGroupIdentificacionPersona.controls[tmpName].setErrors({
        matDatepickerMin: null
      });
      this.formGroupIdentificacionPersona.controls[
        tmpName
      ].updateValueAndValidity();
      this.formGroupIdentificacionPersona.controls[
        "txtfechaEmisionDPI"
      ].setValue(tmpFechaEmision.format("DD/MM/YYYY"));
    }
  }

  /**
   * Retorna la fecha y hora actual en formato "YYYY-MM-DD HH:MI"
   */
  getCurrentDate() {
    var d = new Date();
    return (
      d.getFullYear() +
      "-" +
      ("0" + (d.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + d.getDate()).slice(-2) +
      " " +
      ("0" + d.getHours()).slice(-2) +
      ":" +
      ("0" + d.getMinutes()).slice(-2)
    );
  }

  /**
   * Realiza las validaciones a los controles
   * @param formGroup Form a validar
   */
  validacionFormGroup(formGroup: FormGroup): boolean {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
        if (control.errors) {
          console.log("---------------- control: " + field + ". Enabled: " + control.enabled);
          console.log("error: " + JSON.stringify(control.errors));
        }
      } else if (control instanceof FormGroup) {
        this.validacionFormGroup(control); //Este return false|true no importa
      }
    });
    return formGroup.valid;
  }

  /**
   * Valida si la informacion esta completa antes de pasar al siguiente paso
   */
  validarIdentificacionPersona(): boolean {
    if (!this.formGroupIdentificacionPersona.valid) {
      if (!this.validacionFormGroup(this.formGroupIdentificacionPersona)) {
        return false;
      }
    }

    this.validarHomonimos();
    return true;
  }

  /**
   * Verifica que no se repitan los nombres del contribuyente (solo alerta)
   */
  verificarNombresRepetidos(){
    if(!(this.txtPrimerNombre.value && this.txtPrimerApellido.value)) return;
    let tmpParams = this.txtPrimerNombre.value.toUpperCase()
    + (this.txtSegundoNombre.value ? "/" + this.txtSegundoNombre.value.toUpperCase() : "/null")
    + "/" + this.txtPrimerApellido.value.toUpperCase()
    + (this.txtSegundoApellido.value ? "/" + this.txtSegundoApellido.value.toUpperCase() : "/null");
    this.servicios.getData(this.servicios.URL_CONTRIBUYENTE,"contribuyentesIndividuales",tmpParams,false).subscribe( res => {
      if(Object.keys(res).length > 0){
        this.nombresRepetidos = true;
      }else{
        this.nombresRepetidos = false;
      }
    });
  }

  /**
   * Verificar si ya existe un registro con los mismos datos.
   */
  validarHomonimos() {
    this.validacionFormGroup(this.formGroupIdentificacionPersona);
    // this.contribuyente.persona.Primer_Apellido;
    // this.contribuyente.persona.Segundo_Apellido;
    // this.contribuyente.persona.Primer_Nombre;
    // this.contribuyente.persona.Segundo_Nombre;
    // this.contribuyente.persona.DPI;
    // this.contribuyente.persona.Numero_Orden_Cedula;
    // this.contribuyente.persona.Numero_Registro_Cedula;
    // this.contribuyente.persona.Pasaporte;
    // this.contribuyente.persona.Fecha_Nacimiento;
    // this.contribuyente.persona.DPIMadre;
    // this.contribuyente.persona.Nit_Madre;
    // this.contribuyente.persona.DPIPadre;
    // this.contribuyente.persona.Nit_Padre;
    this.hayHomonimos = false; //True: Verifique los nombres y apellidos ingresados ya que existe otra persona con los mismos datos
  }

  /**
   * Habilita y deshabilita los campos de identificacion cedula y dpi segun la eleccion del usuario
   */
  onChange_radioTipoDoc() {
    if (this.persona.TipoDocumento == 0) {
      this.formGroupIdentificacionPersona.controls["txtNoCedula"].disable();
      this.formGroupIdentificacionPersona.controls["txtNoCedula"].markAsUntouched();
      this.formGroupIdentificacionPersona.controls["selNoOrden"].disable();
      this.formGroupIdentificacionPersona.controls["selNoOrden"].markAsUntouched();
      this.formGroupIdentificacionPersona.controls["selMunCedula"].disable();
      this.formGroupIdentificacionPersona.controls["selMunCedula"].markAsUntouched();
      this.formGroupIdentificacionPersona.controls["txtDPI"].enable();
      this.formGroupIdentificacionPersona.controls["txtDPI"].markAsUntouched();
      this.formGroupIdentificacionPersona.controls["txtFechaVencimientoDPI"].enable();
      this.formGroupIdentificacionPersona.controls["txtFechaVencimientoDPI"].markAsUntouched();
    } else {
      this.formGroupIdentificacionPersona.controls["txtNoCedula"].enable();
      this.formGroupIdentificacionPersona.controls["txtNoCedula"].markAsUntouched();
      this.formGroupIdentificacionPersona.controls["selNoOrden"].enable();
      this.formGroupIdentificacionPersona.controls["selNoOrden"].markAsUntouched();
      this.formGroupIdentificacionPersona.controls["txtDPI"].disable();
      this.formGroupIdentificacionPersona.controls["txtDPI"].markAsUntouched();
      this.formGroupIdentificacionPersona.controls["selMunCedula"].enable();
      this.formGroupIdentificacionPersona.controls["selMunCedula"].markAsUntouched();
    }
  }

  /**
   * Habilita y deshabilita los campos de numero de documento para las correctas validaciones
   */
  onChange_selNacionalidad() {
    if (this.persona.Nacionalidad == 0) {
      this.formGroupIdentificacionPersona.controls["txtPasaporte"].disable();
      this.formGroupIdentificacionPersona.controls["txtPasaporte"].markAsUntouched();
      this.formGroupIdentificacionPersona.controls["selPaisOrigen"].disable();
      this.formGroupIdentificacionPersona.controls["selPaisOrigen"].markAsUntouched();
      this.formGroupIdentificacionPersona.controls["selMunNac"].enable();
      this.formGroupIdentificacionPersona.controls["selMunNac"].markAsUntouched();
      this.formGroupIdentificacionPersona.controls["selDeptoNac"].enable();
      this.formGroupIdentificacionPersona.controls["selDeptoNac"].markAsUntouched();
      this.formGroupIdentificacionPersona.controls["selPoblacion"].enable();
      this.formGroupIdentificacionPersona.controls["selPoblacion"].markAsUntouched();
      this.formGroupIdentificacionPersona.controls["selComLing"].enable();
      this.formGroupIdentificacionPersona.controls["selComLing"].markAsUntouched();
      // this.formGroupIdentificacionPersona.get('selTipoDocumento').setValue(0);
      this.onChange_radioTipoDoc();
    } else {
      this.formGroupIdentificacionPersona.controls["selMunNac"].disable();
      this.formGroupIdentificacionPersona.controls["selMunNac"].markAsUntouched();
      this.formGroupIdentificacionPersona.controls["selDeptoNac"].disable();
      this.formGroupIdentificacionPersona.controls["selDeptoNac"].markAsUntouched();
      this.formGroupIdentificacionPersona.controls["selPoblacion"].disable();
      this.formGroupIdentificacionPersona.controls["selPoblacion"].markAsUntouched();
      this.formGroupIdentificacionPersona.controls["selComLing"].disable();
      this.formGroupIdentificacionPersona.controls["selComLing"].markAsUntouched();
      if (this.persona.Nacionalidad == 1) {
        this.formGroupIdentificacionPersona.controls["txtPasaporte"].disable();
        this.formGroupIdentificacionPersona.controls["txtPasaporte"].markAsUntouched();
        this.formGroupIdentificacionPersona.controls["selPaisOrigen"].enable();
        this.formGroupIdentificacionPersona.controls["selPaisOrigen"].markAsUntouched();
        this.formGroupIdentificacionPersona.get('selTipoDocumento').setValue(0);
        this.persona.TipoDocumento = 0; //Activando CUI
        this.onChange_radioTipoDoc();
      } else {
        if (this.persona.Nacionalidad == 2) {
          this.formGroupIdentificacionPersona.controls["txtDPI"].disable();
          this.formGroupIdentificacionPersona.controls["txtDPI"].markAsUntouched();
          this.formGroupIdentificacionPersona.controls["txtFechaVencimientoDPI"].disable();
          this.formGroupIdentificacionPersona.controls["txtFechaVencimientoDPI"].markAsUntouched();
          this.formGroupIdentificacionPersona.controls["txtNoCedula"].disable();
          this.formGroupIdentificacionPersona.controls["txtNoCedula"].markAsUntouched();
          this.formGroupIdentificacionPersona.controls["selNoOrden"].disable();
          this.formGroupIdentificacionPersona.controls["selNoOrden"].markAsUntouched();
          this.formGroupIdentificacionPersona.controls["selMunCedula"].disable();
          this.formGroupIdentificacionPersona.controls["selMunCedula"].markAsUntouched();
          this.formGroupIdentificacionPersona.controls["txtPasaporte"].enable();
          this.formGroupIdentificacionPersona.controls["txtPasaporte"].markAsUntouched();
          this.formGroupIdentificacionPersona.controls["selPaisOrigen"].enable();
          this.formGroupIdentificacionPersona.controls["selPaisOrigen"].markAsUntouched();
        }
      }
    }
  }

  /**
   * Evento ejecutado al cambiar el valor del control de seleccion de genero. Establece un genero para el control de
   * seleccion de estado civil segun el genero elegido.
   */
  onChange_selGenero(e) {
    if (this.formGroupIdentificacionPersona.get("selGenero").value == 0) {
      this.listaEstadoCivil[0].viewValue = "Soltero";
      this.listaEstadoCivil[1].viewValue = "Casado";
    } else {
      this.listaEstadoCivil[0].viewValue = "Soltera";
      this.listaEstadoCivil[1].viewValue = "Casada";
    }
  }

  /**
   * Evento ejecutado cuando se carga la informacion de una persona. Su objetivo es actualizar la edad de la persona.
   */
  onChangeLoad_txtFechaNac(e: any) {
    if (this.edadPersona == null) this.onChange_txtFechaNac(e);
  }

  /**
   * Evento para el control de fecha de nacimiento. Habilita el control para seleccion de tipo de documento segun la fecha elegida.
   */
  onChange_txtFechaNac(e) {
    var tmpDate = e.slice(-4);
    this.edadPersona = new Date().getFullYear() - tmpDate;
    if (tmpDate <= 1990) {
      this.formGroupIdentificacionPersona.controls["selTipoDocumento"].enable();
    } else {
      this.formGroupIdentificacionPersona.controls["selTipoDocumento"].setValue(0);
      this.persona.TipoDocumento = 0; //Activando CUI
      console.log("this.persona.TipoDocumento "+this.persona.TipoDocumento);
      this.onChange_radioTipoDoc();
      this.formGroupIdentificacionPersona.controls["selTipoDocumento"].disable();
    }
  }
  
  /**
   * Metodo que carga el archivo
   * @param files Lista de archivos
   */
  handleFileInput(e) {
    if(!e.target.files) return;
    let files: FileList = e.target.files;
    if(e.target.name == "fileRepresentante")
      this.fileInputSource = 1;
    else
      this.fileInputSource = 0;
    
    this.fileToUpload[this.fileInputSource] = files.item(0);
    console.log('nombre ' + this.fileToUpload[this.fileInputSource].name);
    console.log('tamaño byte ' + this.fileToUpload[this.fileInputSource].size);
    
    console.log((this.fileToUpload[this.fileInputSource].size / 1048576).toFixed(2) + " MB");
    let tamanio: number;
    tamanio = Number((this.fileToUpload[this.fileInputSource].size / 1048576).toFixed(2));
    if (tamanio > 10) {
      console.log('Excede el maximo del tamaño');
      this.limpiarArchivos();
      this.Alerta('CargaTamanioFallo');
    }
    
    if(this.fileToUpload[this.fileInputSource].type === 'image/jpeg' || this.fileToUpload[this.fileInputSource].type === 'image/png' || this.fileToUpload[this.fileInputSource].type === 'application/pdf'){
      this.cargarArchivos();
    }else{
      this.limpiarArchivos();
      this.Alerta('CargaFormatoFallo');
    }

    console.log('finaliza el handleFileInput');
  }

  /**
   * Metodo que se encarga de obtener del S3 el archivo
   */
  obtenerArchivo(index: number) {
    this.fileInputSource = index;
    if (this.cargaExitosa[this.fileInputSource]) {
      console.log(this.servicios.URL_DOCUMENTO_S3+"/"+this.codigoGestion+"/"+this.fileToUpload[this.fileInputSource].name);
      this.servicios.getArchivoS3(this.servicios.URL_DOCUMENTO_S3, this.codigoGestion, this.fileToUpload[this.fileInputSource].name)
        .subscribe(resultado => {
          
          this.crearImagen(resultado);
        },
          error => {
            console.error("Ocurrió un Error al descargar " + JSON.stringify(error));
          },
          () => {
            console.log("descarga realizada correctamente ");
          });
    }

  }

  /**
   * 
   * @param image 
   */
  crearImagen(image: Blob) {
    console.log("a crear imagen");
    let reader = new FileReader();
    reader.addEventListener("loadend", () => {
      let imagen = reader.result;
      console.log("imageToShow " + JSON.stringify(imagen));
    }, false);
    if (image) {
      //se sanitiza la url del archivo
      console.log("URL " + window.URL.createObjectURL(image));
      let filePreviewPath = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(image)));
      console.log("this.filePreviewPath " + filePreviewPath);
      if (!image.type.startsWith("image")) {

        this.url_archivo[this.fileInputSource] = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(image));

        console.log("es pdf " + this.url_archivo[this.fileInputSource]);

      } else {
        this.url_archivo[this.fileInputSource] = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(image));

      }

    }
  }

  eliminarArchivoIndex(index: number){
    this.fileInputSource = index;
    this.Alerta('eliminarArchivo');
  }

  /**
   * Método que se encarga de cargar el archivo a la ubicación en el S3
   */
  cargarArchivos() {
    console.log("this.fileToUpload.name " + this.fileToUpload[this.fileInputSource].name);
    let carga = { 
      identificador: `${this.servicios.URL_DOCUMENTO_S3}/${this.codigoGestion}/${this.fileToUpload[this.fileInputSource].name}`, 
      nombre: this.fileToUpload[this.fileInputSource].name,
      documento: this.fileToUpload[this.fileInputSource], 
      tipoDocumento: this.fileToUpload[this.fileInputSource].type, 
      idDocumento: this.fileInputSource==0 ? '878' : '881', 
      carpetaArchivo: this.codigoGestion, 
      cargado: true 
    };

     console.log(this.fileToUpload[this.fileInputSource]);
     this.servicios.putArchivoS3(this.servicios.URL_DOCUMENTO_S3, carga.carpetaArchivo, carga)
       .subscribe((resultado) => {
          console.log("resultado de carga" + JSON.stringify(resultado));
          this.Alerta('CargaExito');
          this.cargaExitosa[this.fileInputSource] = true;
      
       
      },
        (error) => {
          console.error("Ocurrió un Error"+ error);
          console.error(error);
        },
        () => {
          console.log("carga realizada correctamente");
        });
  }

  /**
   * Método que elimina del S3 la imagen
   */
  eliminarArchivo() {
    this.servicios.deleteArchivoS3(this.servicios.URL_DOCUMENTO_S3, this.codigoGestion, this.fileToUpload[this.fileInputSource].name)
      .subscribe(resultado => {
        console.log("resultado de eliminacion" + JSON.stringify(resultado));
      },
        error => {
          console.error("Ocurrió un Error al eliminar " + JSON.stringify(error));
        },
        () => {
          console.log("eliminacion realizada correctamente");
          this.limpiarArchivos();
          switch(this.fileInputSource){
            case 0:
              (<HTMLInputElement>document.getElementById("fileDocID")).value = "";
            break;
            case 1:
              (<HTMLInputElement>document.getElementById("fileRepresentante")).value = "";
            break;
          }
        });
  }

  /**Metodo de mostrar alertas */
  Alerta(type) {
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
    if (type == 'eliminarArchivo') {
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
          this.eliminarArchivo();
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
      })

    }

  }

  /**
   * Método que limpia el archivo
   */
  limpiarArchivos() {
    this.url_archivo[this.fileInputSource] = null;
    this.cargaExitosa[this.fileInputSource] = false;
    this.fileToUpload[this.fileInputSource] = null;
  }

  /**
   * Metodo que inicia el formulario
   */
  ngOnInit() {
    this.actividadEconomica = null;
    this.requeridaActividad=true;
    this.dataSource.paginator = this.paginator;
    this.panel = 0;
    this.paso = 0;
    this.codigoTemp = null;
    this.tipoSeleccion = "00";
    this.tipoPersona = null;
    this.nombresRepetidos = true;
    this.maxDateMayorEdad.setFullYear(this.maxDateMayorEdad.getFullYear() - 18); //Configurando una fecha de inicio para personas mayores de 18
    this.minDate.setFullYear(1900);
    this.maxDate.setFullYear(new Date().getFullYear());
    this.isncripcion = this.formBuilder.group({
      seleccionCtrl: [""],
      email: [
        null,
        [
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$")
        ]
      ],
      telefono: [null, Validators.required],
      urlCtrl: [""]
    });
    this.recuperaCodigo = this.formBuilder.group({
      codigoSeguridad: [null, Validators.required]
    });

    this.solicitud = this.formBuilder.group({});

    this.tipoPersonaFormGroup = this.formBuilder.group({
      tipoPersonaCtrl: ["", [Validators.required]]
    });

    this.personaOrganizacionFG = this.formBuilder.group({     
    });

    this.actividadFormGroup = this.formBuilder.group({
      check_actividadEconomica: this.check_actividadEconomica,
      hayActividadEconomica: this.hayActividadEconomica
      

    });

    this.obligacionesFormGroup = this.formBuilder.group({});

    //this.ubicacionFormGroup = this.formBuilder.group({});
    this.ubicacionFormGroup = this.formBuilder.group({
      esValidoUbicacion: ['', [Validators.required]]
    });

    this.tercerosFormGroup = this.formBuilder.group({
      esValidoSocioAccionista: ["", Validators.required]
    });

    // FormGroup Vertical
    this.establecimientoFormGroup = this.formBuilder.group({});

    this.afiliacionesFormGroup = this.formBuilder.group({});

    this.datosContadorFormGroup = this.formBuilder.group({});

    this.datosRepresentanteLegalFormGroup = this.formBuilder.group({});

    this.registroSocioAccionistaFormGroup = this.formBuilder.group({});

    // formGroup identificacion personas
    this.formGroupIdentificacionPersona = this.formBuilder.group(
      {
        selGenero: this.selGenero,
        selEstadoCivil: this.selEstadoCivil,
        selNacionalidad: this.selNacionalidad,
        txtDPI: this.txtDPI,
        selMunNac: this.selMunNac,
        selDeptoNac: this.selDeptoNac,
        selPoblacion: this.selPoblacion,
        selComLing: this.selComLing,
        selMunCedula: this.selMunCedula,
        selNoOrden: this.selNoOrden,
        txtNoCedula: this.txtNoCedula,
        txtPasaporte: this.txtPasaporte,
        selPaisOrigen: this.selPaisOrigen,
        txtPrimerNombre: this.txtPrimerNombre,
        txtSegundoNombre: this.txtSegundoNombre,
        txtOtrosNombres: this.txtOtrosNombres,
        txtPrimerApellido: this.txtPrimerApellido,
        txtSegundoApellido: this.txtSegundoApellido,
        txtApellidoCasada: this.txtApellidoCasada,
        txtNITConyuge: this.txtNITConyuge,
        txtNombresConyuge: this.txtNombresConyuge,
        txtFechaNac: this.txtFechaNac,
        txtFechaVencimientoDPI: this.txtFechaVencimientoDPI,
        txtfechaEmisionDPI: this.txtfechaEmisionDPI,
        selTipoDocumento: this.selTipoDocumento,
        txtDPIPadre: this.txtDPIPadre,
        txtNitPadre: this.txtNitPadre,
        txtNombresPadre: this.txtNombresPadre,
        txtDPIMadre: this.txtDPIMadre,
        txtNitMadre: this.txtNitMadre,
        txtNombresMadre: this.txtNombresMadre,
        check_representacionLegal: null
      },
      {
        validator: ValidadorSelect.ValidarSelect
      }
    );

    this.isValid = false;
    this.myThenBlock = this.firstThenBlock;
    this.myElseBlock = this.firstElseBlock;

    this.listaCheck = [
      { value: "03", title: "Ingresar código  ", checked: false },
      { value: "02", title: "Recuperar código  ", checked: false },
      {
        value: "01",
        title: "No cuento con correo electrónico   ",
        checked: false
      }
      
      
    ];
    //a obtener los tipos de personas

    
    this.servicios
      .getData(
        this.servicios.URL_DATO,
        "cat_dato_by_catalogo",
        this.constantes.CODIGO_CAT_TIPO_CONTRIBUYENTE_IMPUESTOS,
        false
      )
      .subscribe((data: Array<CatDato>) => {
        console.log(data);
        this.listaTiposContribuyentePersona = data;
        console.log(this.listaTiposContribuyentePersona[0].nombre);
        this.listaTipoPersona = [];
        this.listaTiposContribuyentePersona.forEach(row => {
          let tipoP: TipoPersona;
          let codigo: string;
          codigo = row.codigoIngresado;

          this.listaTipoPersona.push({
            value: codigo,
            title: row.nombre,
            descripcion: row.descripcion,
            checked: false
          });
        });
      });

    //Inicializacion LOVs identificacion persona
    this.listaGenero = [
      { value: 0, viewValue: "Masculino" },
      { value: 1, viewValue: "Femenino" }
    ];
    this.listaEstadoCivil = [
      { value: 0, viewValue: "Soltero" },
      { value: 1, viewValue: "Casado" }
    ];
    this.listaNacionalidad = [
      { value: 0, viewValue: "Guatemalteco" },
      { value: 1, viewValue: "Extranjero Domiciliado" },
      { value: 2, viewValue: "Extranjero" }
    ];

    this.listaPaisOrigen = [];
    this.servicios.getData(this.servicios.URL_DATO, "cat_dato_by_catalogo", "10", false).subscribe((data: CatDatoByCatalogo[]) => {
      data.forEach(elemento => {
        if (elemento.nombre.toLowerCase() != 'guatemala')
          this.listaPaisOrigen[elemento.codigo] = { value: elemento.codigo, viewValue: elemento.nombre }
      }
      );
    });

    // this.listaNoOrden = [];
    // this.servicios.getData(this.servicios.URL_DATO, "cat_dato_by_catalogo", "10", false).subscribe((data: CatDatoByCatalogo[]) => {
    //   data.forEach(elemento => 
    //     this.listaNoOrden[elemento.codigo] = { value: elemento.codigo, viewValue: elemento.nombre }
    //   );
    // });

    this.listaNoOrden = [
      { value: 0, viewValue: "A-1" }
    ];

    this.listaMunicipio$ = null;

    this.listaDepartamento$ = this.servicios.getData(this.servicios.URL_DATO, "cat_dato_by_catalogo", "2", false);

    this.listaPoblacion = [];
    this.servicios.getData(this.servicios.URL_DATO, "cat_dato_by_catalogo", "12", false).subscribe((data: CatDatoByCatalogo[]) => {
      data.forEach(elemento =>
        this.listaPoblacion[elemento.codigo] = { value: elemento.codigo, viewValue: elemento.nombre }
      );
    });

    this.listaComunidadLing = [];
    this.servicios.getData(this.servicios.URL_DATO, "cat_dato_by_catalogo", "11", false).subscribe((data: CatDatoByCatalogo[]) => {
      data.forEach(elemento =>
        this.listaComunidadLing[elemento.codigo] = { value: elemento.codigo, viewValue: elemento.nombre }
      );
    });
    this.onChanges();
  }

  toggleThenBlock() {
    this.myThenBlock =
      this.myThenBlock === this.firstThenBlock
        ? this.secondThenBlock
        : this.firstThenBlock;
  }
  toggleElseBlock() {
    this.myElseBlock =
      this.myElseBlock === this.firstElseBlock
        ? this.secondElseBlock
        : this.firstElseBlock;
  }
  ngOnChanges(changes: SimpleChanges) { }

  onChanges(){
    this.formGroupIdentificacionPersona.valueChanges.subscribe(val => {
      if(this.formularioListo){
        this.persona.Genero = val.selGenero;
        this.persona.Estado_Civil = val.selEstadoCivil;
        this.persona.Primer_Nombre = val.txtPrimerNombre;
        this.persona.Segundo_Nombre = val.txtSegundoNombre;
        this.persona.Otros_Nombres = val.txtOtrosNombres;
        this.persona.Primer_Apellido = val.txtPrimerApellido;
        this.persona.Segundo_Apellido = val.txtSegundoApellido;
        if(this.formGroupIdentificacionPersona.get("selGenero").value == 1 && this.formGroupIdentificacionPersona.get("selEstadoCivil").value == 1){
          this.persona.Apellido_Casada = val.txtApellidoCasada;
          this.persona.NITConyuge = val.txtNITConyuge;
          this.persona.NombresConyuge = val.txtNombresConyuge;
        }
        this.persona.Fecha_Nacimiento = val.txtFechaNac;
        if(val.selNacionalidad > -1)
          this.persona.Nacionalidad = val.selNacionalidad;
        if(this.formGroupIdentificacionPersona.get("selNacionalidad").value == 0){
          if(val.selTipoDocumento || val.selTipoDocumento == 0)
            this.persona.TipoDocumento = val.selTipoDocumento;
          this.persona.Municipio_Nacimiento = val.selMunNac;
          this.persona.Departamento_Nacimiento = val.selDeptoNac;
          this.persona.Poblacion = val.selPoblacion;
          this.persona.Comunidad_Linguistica = val.selComLing;
          if(this.formGroupIdentificacionPersona.get("selTipoDocumento").value == 1){
            this.persona.Numero_Orden_Cedula = val.selNoOrden;
            this.persona.Numero_Registro_Cedula = val.txtNoCedula;
          }else
            if(this.formGroupIdentificacionPersona.get("selTipoDocumento").value == 0){
              this.persona.DPI = val.txtDPI;
            }
        }
        if(this.formGroupIdentificacionPersona.get("txtFechaVencimientoDPI").value){
          this.persona.Fecha_Vencimiento_DPI = val.txtFechaVencimientoDPI;
        }
        if(this.formGroupIdentificacionPersona.get("txtfechaEmisionDPI").value){
          this.persona.Fecha_Emision_DPI = val.txtfechaEmisionDPI;
        }
        if (this.formGroupIdentificacionPersona.get("selPaisOrigen").value > -1) {
          this.persona.Pais_Origen = val.selPaisOrigen;
        }
        if (this.formGroupIdentificacionPersona.get("selTipoDocumento").value == 1) {
          this.persona.Municipio_Emision_Cedula = val.selMunCedula;
        }
        this.persona.DPIPadre = val.txtDPIPadre;
        this.persona.Nit_Padre = val.txtNitPadre;
        this.persona.Nombres_Padre = val.txtNombresPadre;
        this.persona.DPIMadre = val.txtDPIMadre;
        this.persona.Nit_Madre = val.txtNitMadre;
        this.persona.Nombres_Madre = val.txtNombresMadre;
        this.persona.Pasaporte = val.txtPasaporte;
      }
    });

    this.tipoPersonaFormGroup.valueChanges.subscribe(val => {
      // console.log(val);
    });
  }

  ngAfterViewInit() { }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}









