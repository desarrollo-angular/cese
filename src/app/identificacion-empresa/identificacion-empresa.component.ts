import { Component, OnInit, Output, EventEmitter, Input, ɵConsole } from '@angular/core';

import { FormControl, Validators, FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

import { CatDato } from '../interfaces/ubicacion/catDato.interface';
import { Contribuyente } from '../interfaces/datos-representante/contribuyente.interface';
import { ContribuyenteIndividual } from '../interfaces/datos-representante/contribuyente-individual.interface';
import { Notario } from 'app/interfaces/identificacion-empresa/notario.interface';
import { IdentificacionEmpresa } from './identificacion-empresa';
import { CondicionEspecialDato } from '../interfaces/datos-representante/condicion-especial-dato.interface';

import { Servicios } from 'app/servicios/servicios.service';
import { CargaArchivo } from 'app/formulario-inscripcion/interfaces/archivo/cargaArchivo.interface';
import { Constantes } from 'app/util/constantes';
import swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DomSanitizer, SafeUrl, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';

/* jadamian 20.02.19 se realizan modificaciones/correcciones indicadas en CU Datos de Identificación empresa-organización v.1.5
  Se adicionan campos de forma:
    tipoFiduciaria,
    participacionEmpresarial, camaraEmpresarial, participacionGremial, gremial,
  Se adicionan variables:
    listaTiposFiduciaria, listaFA13, tipoFiduciariaSeleccionado, fiduciariaRequerido,
    listaCamarasEmpresariales, listaGremiales
  Se adicionan métodos:
    ValidarFA13, onSelectionChangeTipoFiduciaria, TraerTiposFiduciaria, LLenarListaFA13,
    ValidarFA14,
    TraerRegistroExternoPersoneria,
    TraerCatalogoCamarasEmpresariales, TraerCatalogoGremiales
  Se adicionan interfaces:
    CondicionEspecialDato
*/

declare const $: any;

@Component({
  selector: 'app-identificacion-empresa',
  templateUrl: './identificacion-empresa.component.html',
})

export class IdentificacionEmpresaComponent implements OnInit {

  constantes: Constantes = new Constantes;
  datosSalida: string;
  codigoGestion: string;

  /* agapineda 050319 */
  esDelegado: boolean;

  /* COMUNICACION CON OTROS COMPONENTES */
  @Input()
  set _codigoGestion(codigo: string) {
    this.codigoGestion = codigo;
  }

  @Output() _datosIdentificacionSalida = new EventEmitter<string>();

  @Input() set _datosEmpresaEntrada(datos: string) {
    if (datos) {
      this.recibirDatosIdentificacion(datos);
    }
  }

  /**
   * 06.12.18 aalruanoe
   * Metodo para recibir los datos de identificacion del componente de inscripcion
   */
  recibirDatosIdentificacion(datos: string) {
    this.ngOnInit();
    if (this.inputForm && datos) {
      this.msgExito = null;
      this.datosIdentificacionEmpresa = JSON.parse(datos);
      this.inputForm.get('razonSocial').setValue(this.datosIdentificacionEmpresa.razonSocial);
      this.inputForm.get('fechaConstitucion').setValue(this.datosIdentificacionEmpresa.fechaConstitucion);
      this.inputForm.get('tipoDoctoConstitucion').setValue(this.datosIdentificacionEmpresa.tipoDoctoConstitucion);
      this.inputForm.get('numeroDoctoConstitucion').setValue(this.datosIdentificacionEmpresa.numeroDoctoConstitucion);
      this.inputForm.get('anioDoctoConstitucion').setValue(this.datosIdentificacionEmpresa.anioDoctoConstitucion);
      this.inputForm.get('nitNotario').setValue(this.datosIdentificacionEmpresa.nitNotario);
      this.inputForm.get('nombreNotario').setValue(this.datosIdentificacionEmpresa.nombreNotario);
      this.inputForm.get('fechaInscripcion').setValue(this.datosIdentificacionEmpresa.fechaInscripcion);
      this.inputForm.get('registroExterno').setValue(this.datosIdentificacionEmpresa.registroExterno);
      this.inputForm.get('sectorEconomico').setValue(this.datosIdentificacionEmpresa.sectorEconomico);
      this.inputForm.get('participacionGremial').setValue(this.datosIdentificacionEmpresa.participacionGremial);
      this.inputForm.get('camaraEmpresarial').setValue(this.datosIdentificacionEmpresa.camaraEmpresarial);
      this.inputForm.get('participacionEmpresarial').setValue(this.datosIdentificacionEmpresa.participacionEmpresarial);
      this.inputForm.get('gremial').setValue(this.datosIdentificacionEmpresa.gremial);
      this.documentoConstitucion = this.datosIdentificacionEmpresa.documentoConstitucion;
      this.documentoPatente = this.datosIdentificacionEmpresa.documentoPatente;
      console.log('recibirDatosIdentificacion' + JSON.stringify(this.datosIdentificacionEmpresa));
    }
  }

  /* COMUNICACION CON OTROS COMPONENTES */


  inputForm: FormGroup;
  listaTiposPersoneria: Array<CatDato> = [];
  listaTiposDoctoConstitucion: Array<CatDato> = [];
  listaSectoresEconomicos: Array<CatDato> = [];
  listaRegistrosExternos: Array<CatDato> = [];
  private listaContribuyentes: Array<Contribuyente> = [];
  listaTiposFiduciaria: Array<CatDato> = [];
  listaCamarasEmpresariales: Array<CatDato> = [];
  listaGremiales: Array<CatDato> = [];

  private datosNotario: Notario;

  listaAnios: Array<number> = [];
  private listaAnexo1: Array<string> = [];
  private listaFA13: Array<string> = [];

  private tipoPersoneriaSeleccionado: Array<CatDato> = [{ codigo: 0, codigoCatalogo: 0, codigoDatoPadre: 0, codigoIngresado: "", descripcion: "", estado: 0, fechaAgrega: "", fechaModifica: "", nombre: "", usuarioAgrega: "", usuarioModifica: "" }];
  private tipoFiduciariaSeleccionado: Array<CatDato> = [{ codigo: 0, codigoCatalogo: 0, codigoDatoPadre: 0, codigoIngresado: "", descripcion: "", estado: 0, fechaAgrega: "", fechaModifica: "", nombre: "", usuarioAgrega: "", usuarioModifica: "" }];

  msgAviso: string = null;
  msgExito: string = null;
  msgError: string = null;
  private txtError: string = null;
  private txtErrorDocumento: string = null;

  private datosIdentificacionEmpresa: IdentificacionEmpresa = new (IdentificacionEmpresa);
  private documentoConstitucion: CargaArchivo;
  private documentoPatente: CargaArchivo;

  fechaActual: Date = new Date();
  anioActual = this.fechaActual.getFullYear();
  fechaMinima = new Date(1900, 0, 1);
  fechaMaxima = new Date(this.anioActual, 11, 31);
  requierePatente = true;
  existeRazonSocial = false;
  fiduciariaRequerido: boolean;
  //variables carga de archivos
  archivoConstitucion: CargaArchivo;
  fileConstitucion: File = null;
  urlArchivoConstitucion: SafeResourceUrl;
  urlArchivoPatente: SafeResourceUrl;
  cargaExitosaConstitucion: boolean;
  archivoPatente: CargaArchivo;
  filePatente: File = null;
  cargaExitosaPatente: boolean;
  isImageLoading: boolean;
  archivoValido: boolean;
  sanitization: DomSanitizer;
  urlPdf: string;
  filePreviewPath: SafeUrl;
  safehtml: SafeHtml;
  imagen: any;

  /* URL DE LOS SERVICIOS */


  /* METODOS LLAMADOS DESDE LA FORMA */

  /**
   * aalruanoe 23.02.19
   * Lógica de carga de archivos
   */

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
    if (type == 'eliminarArchivoConstitucion') {
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
          this.eliminarArchivo(this.archivoConstitucion, this.fileConstitucion);
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

    if (type == 'eliminarArchivoPatente') {
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
          this.eliminarArchivo(this.archivoPatente, this.filePatente);
          this.limpiarArchivos(2);
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
        archivo = this.archivoConstitucion;
        fileObtener = this.fileConstitucion;
        cargaExitosa = this.cargaExitosaConstitucion;
        break;
      case 2:
        archivo = this.archivoPatente;
        fileObtener = this.filePatente;
        cargaExitosa = this.cargaExitosaPatente;
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
        this.fileConstitucion = null;
        this.cargaExitosaConstitucion = false;
        this.urlArchivoConstitucion = null;
        this.documentoConstitucion = null;
        break;
      case 2:
        this.filePatente = null;
        this.cargaExitosaPatente = false;
        this.urlArchivoPatente = null;
        this.documentoPatente = null;
      default:

        this.archivoValido = false;
        break;
    }


    this.archivoValido = false;

  }

  /**
   * Metodo que carga el archivo desde el cliente
   * @param files Lista de archivos
   */
  handleFileInput(files: FileList, tipo: number) {
    let tamanio: number;
    switch (tipo) {
      case 1:
        this.fileConstitucion = files.item(0);
        console.log(' fileConstitucion nombre ' + this.fileConstitucion.name);
        console.log('fileConstitucion tamaño byte ' + this.fileConstitucion.size);
        console.log((this.fileConstitucion.size / 1048576).toFixed(2) + " MB");
        tamanio = Number((this.fileConstitucion.size / 1048576).toFixed(2));
        if (tamanio > 10) {
          console.log('Excede el maximo del tamaño');
          this.limpiarArchivos(tipo);
          this.Alerta('CargaTamanioFallo');
        }
        this.archivoValido = this._esValido(this.fileConstitucion.type);
        if (!this.archivoValido) {
          this.limpiarArchivos(tipo);
          this.Alerta('CargaFormatoFallo');
        }
        break;
      case 2:
        this.filePatente = files.item(0);
        console.log('filePatente nombre ' + this.filePatente.name);
        console.log('filePatente tamaño byte ' + this.filePatente.size);
        console.log((this.filePatente.size / 1048576).toFixed(2) + " MB");
        tamanio = Number((this.filePatente.size / 1048576).toFixed(2));
        if (tamanio > 10) {
          console.log('Excede el maximo del tamaño');
          this.limpiarArchivos(tipo);
          this.Alerta('CargaTamanioFallo');
        }
        this.archivoValido = this._esValido(this.filePatente.type);
        if (!this.archivoValido) {
          this.limpiarArchivos(tipo);
          this.Alerta('CargaFormatoFallo');
        }
        break;
      default:
        console.log("handleFileInput tipo de archivo no definido")
        break;
    }


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
          this.urlArchivoConstitucion = urlArchivo;
          break;
        case 2:
          this.urlArchivoPatente = urlArchivo;
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
        this.archivoConstitucion = {
          identificador: `${this.servicios.URL_DOCUMENTO_S3}/${this.codigoGestion}/${this.fileConstitucion.name}`,
          nombre: this.fileConstitucion.name,
          documento: this.fileConstitucion,
          tipoDocumento: this.fileConstitucion.type,
          idDocumento: '117',
          carpetaArchivo: this.codigoGestion,
          cargado: true
        };
        archivo = this.archivoConstitucion;
        console.log(this.fileConstitucion);
        break;
      case 2:
        this.archivoPatente = {
          identificador: `${this.servicios.URL_DOCUMENTO_S3}/${this.codigoGestion}/${this.filePatente.name}`,
          nombre: this.filePatente.name,
          documento: this.filePatente,
          tipoDocumento: this.filePatente.type,
          idDocumento: '118',
          carpetaArchivo: this.codigoGestion,
          cargado: true
        };
        archivo = this.archivoPatente;
        console.log(this.filePatente);
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
          this.cargaExitosaConstitucion = true;
          this.documentoConstitucion = archivo;
        } else if (tipo == 2) {
          this.cargaExitosaPatente = true;
          this.documentoPatente = archivo;
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

  /** Finalizan metodos de carga de Archivos **/

  onChangeForm() {
    this.ValidarFA09();
  }

  onSelectionChangeTipoPersoneria(valorSeleccionado: any) {
    this.tipoPersoneriaSeleccionado = this.listaTiposPersoneria.filter(
      function (el) { return (el.codigo === valorSeleccionado); });

    this.inputForm.get('tipoFiduciaria').setValue(null);
    this.tipoFiduciariaSeleccionado = [{ codigo: 0, codigoCatalogo: 0, codigoDatoPadre: 0, codigoIngresado: "", descripcion: "", estado: 0, fechaAgrega: "", fechaModifica: "", nombre: "", usuarioAgrega: "", usuarioModifica: "" }];

    /*
     jadamian 06.03.2019:
     si es un Colaborador-Delegado no se requiere verificación de flujos alternos
     ya que no se indica en el CU-Inscripción Colaborador-Delegado RTU Empresa-Organización v.1.0
    */

    if (!this.esDelegado) {
      this.ValidarFA04();
      this.ValidarFA12();
      this.ValidarFA13();
      this.TraerRegistroExternoPersoneria(); // FA07
    }
  }

  /* jadamian 19.02.19 Se agrega método para obtener el tipo seleccionado,, CU Datos de Identificación empresa-organización v.1.5 */
  onSelectionChangeTipoFiduciaria(valorSeleccionado: any) {
    this.tipoFiduciariaSeleccionado = this.listaTiposFiduciaria.filter(
      function (el) { return (el.codigo === valorSeleccionado); });
  }

  onChangeFechaConstitucion(valorSeleccionado: any) {
    this.inputForm.controls['fechaInscripcion'].setErrors(null);
    this.txtError = null;

    this.ValidarFA03('fechaConstitucion');

    if (!this.txtError) {
      this.ValidarFA08();
    }

    /*
     jadamian 06.03.2019:
     si es un Colaborador-Delegado no se requiere verificación de que no esté registrado el documento de constitución
     ya que no se indica en el CU-Inscripción Colaborador-Delegado RTU Empresa-Organización v.1.0
    */
    if (!this.esDelegado) {
      if (!this.txtError && !this.StringVacio(this.inputForm.get('nitNotario').value)) {
        this.ValidarFA05_Documento('nitNotario');
      }
    }
  }

  onChangeRazonSocial(valorSeleccionado: any) {
    this.ValidarFA02();
  }

  onSelectionChangeTipoDoctoConstitucion(valorSeleccionado: any) {
    null;
  }

  onSelectionChangeAnioDoctoConstitucion(valorSeleccionado: any) {
    if (!this.StringVacio(this.inputForm.get('nitNotario').value))
      this.ValidarNitNotario();
  }

  onChangeNitNotario(valorSeleccionado: any) {
    this.ValidarNitNotario();
  }

  onChangeFechaInscripcion(valorSeleccionado: any) {
    this.ValidarFA03('fechaInscripcion');
    this.ValidarFA08();
  }

  onSelectionChangeRegistroExterno(valorSeleccionado: any) {
    null;
  }

  onSelectionChangeSectorEconomico(valorSeleccionado: any) {
    null;
  }

  onSelectionChangeCamaraEmpresarial(valorSeleccionado: any) {
    null;
  }

  onSelectionChangeGremial(valorSeleccionado: any) {
    null;
  }

  onChangeNumber_DoctoConstitucion(campoIngresado: any) {
    (campoIngresado.target.value) ? this.inputForm.controls[campoIngresado.target.name].setErrors(null) : this.inputForm.get(campoIngresado.target.name).setValue(null);

    /*
     jadamian 06.03.2019:
     si es un Colaborador-Delegado no se requiere verificación de que no esté registrado el documento de constitución
     ya que no se indica en el CU-Inscripción Colaborador-Delegado RTU Empresa-Organización v.1.0
    */
    if (!this.esDelegado) {
      if (!this.StringVacio(this.inputForm.get('nitNotario').value)) {
        this.ValidarFA05_Documento('nitNotario');
      }
    }
  }

  onContinuar() {
    //if(!this.esDelegado) /* agapineda 050319 */ /* jadamian 06.03.2019 se quita el if ya que siempre deben validarse campos requeridos
    this.ValidarFA11(); // campos requeridos

    if (this.StringVacio(this.msgAviso)) {
      this.txtError = null;

      this.ValidarFA03('fechaConstitucion');
      this.ValidarFA03('fechaInscripcion');
      this.ValidarFA08(); // Fecha inscripción menor que la de constitución

      if (this.txtError) {
        this.msgAviso = "Error: Por favor ingrese los valores de forma correcta";
      }
      else {
        this.msgExito = "Datos verificados";
        this.ShowNotification('top', 'center', 'success', this.msgExito);
        this.EnviarDatosIdentificacion();
      }
    }

    if (this.msgAviso != null)
      this.ShowNotification('top', 'center', 'warning', this.msgAviso);

    if (this.msgExito != null)
      this.ShowNotification('top', 'center', 'success', this.msgExito);
  }

  onLimpiar() {
    this.ValidarFA10();
  }

  onInputNumber(campoIngresado) {
    (campoIngresado.target.value) ? this.inputForm.controls[campoIngresado.target.name].setErrors(null) : this.inputForm.controls[campoIngresado.target.name].setErrors({ 'pattern': true });
  }

  onChangeNumber(campoIngresado) {
    (campoIngresado.target.value) ? this.inputForm.controls[campoIngresado.target.name].setErrors(null) : this.inputForm.get(campoIngresado.target.name).setValue(null);
  }

  /* METODOS LLAMADOS DESDE EL COMPONENTE */

  ValidarFA02() {
    $.notifyClose();

    let valorCampo: string;
    this.existeRazonSocial = false;

    //Se eliminan espacios en blanco al principio y al final
    valorCampo = this.inputForm.get('razonSocial').value.trim();

    // FA02.2 - Se eliminan las comillas al principio y al final
    //valorCampo = valorCampo.replace(new RegExp('"', 'gi'), '').trim();

    if (valorCampo.substr(0, 1) === '"') {
      valorCampo = valorCampo.substr(1);
    }

    if (valorCampo.substr(valorCampo.length - 1, 1) === '"') {
      valorCampo = valorCampo.substr(0, valorCampo.length - 1);
    }


    this.inputForm.get('razonSocial').setValue(valorCampo.toUpperCase());

    // FA02.4 - Se verifica que se ingrese más de un caracter
    if (valorCampo.length === 1) {
      this.inputForm.controls['razonSocial'].setErrors({ 'incorrecto': true });
      this.txtError = "Error. Debe ingresar un nombre válido";
    }
    else {
      // FA02.1 - Se verifica que se ingresen caracteres alfabéticos y espacios
      /* jadamian 20.02.19 Se corrige pattern para que permita tildes y ñ y otros caracteres especiales, CU Datos de Identificación empresa-organización v.1.5 */
      let alfanumeric = /^([\.&\/\-,_0-9a-z ÁÉÍÓÚÑ.&/-_"]*[a-z ÁÉÍÓÚÑ.&/-_"]+[\.&\/\-,_0-9]*)?$/i;
      let esAlfabetico = alfanumeric.test(valorCampo);

      if (esAlfabetico) {
        // FA02.3 - Se verifica que no se ingrese una serie de un mismo caracter
        let valorStr = valorCampo;
        const strArr = valorCampo.toLowerCase().split("").sort().join("").match(/(.)\1+/g);

        if (strArr) {
          strArr.forEach((elem) => {
            /* jadamian 21.02.19 Se agrega corrección por manejo del . en replace, CU Datos de Identificación empresa-organización v.1.5 */
            valorStr = (elem[0] === '.') ? valorStr.replace(/\./g, '') : valorStr.replace(new RegExp(elem[0], 'gi'), '');
          });
        }

        if (valorStr.length === 0) {
          this.inputForm.controls['razonSocial'].setErrors({ 'incorrecto': true });
          this.txtError = "Error. Debe ingresar un nombre válido";
        }
        else {
          this.ValidarFA14(valorCampo);
          // FA02.5
          this.servicios.getData(this.servicios.URL_CONTRIBUYENTE_JURIDICO, 'contribuyenteJuridicoPorRazon', valorCampo.toUpperCase(), false).subscribe(
            (data: Array<Contribuyente>) => {

              this.listaContribuyentes = data;

              if (this.listaContribuyentes.length > 0) {
                this.inputForm.controls['razonSocial'].setErrors({ 'incorrecto': true });
                this.txtError = `Error. Se detectó que existe otra empresa / organización con 
                el mismo nombre, para verificar si ya está registrado ante la Administración 
                Tributaria, presentarse a una Oficina o Agencia Tributaria para verificar los datos`;
                this.existeRazonSocial = true;
              }
            },
            error => {
              let errorString = JSON.stringify(error);
              let errorJson = JSON.parse(errorString);

              if (errorJson.error.status == '404') { // Empresa No Existe
                this.txtError = null;
              }
              else {
                console.error("Error al verificar NIT del Notario: " + errorJson.error.userMessage);
                this.msgError = "Error grave: Error al verificar NIT del Notario";
                this.ShowNotification('top', 'center', 'danger', this.msgError);
              }
            },
            () => {
            }
          );
        }
      }
      else {
        this.inputForm.controls['razonSocial'].setErrors({ 'incorrecto': true });
        this.txtError = "Error. El campo debe contener letras";
      }
    }
  }


  ValidarFA03(nombreCampo: any) {
    let valorCampo: any = this.inputForm.get(nombreCampo).value;
    if (valorCampo > this.fechaActual) {
      this.inputForm.controls[nombreCampo].setErrors({ 'incorrecto': true });
      this.txtError = "Error. La fecha ingresada no puede ser mayor a la fecha actual";
    }
  }

  ValidarFA04() {
    let valorCampo: string = this.tipoPersoneriaSeleccionado[0].nombre;

    if (!this.StringVacio(valorCampo)) {
      if (this.listaAnexo1.includes(valorCampo))
        this.inputForm.controls['nitNotario'].disable();
      else
        this.inputForm.controls['nitNotario'].enable();
    }
  }

  ValidarFA05(nombreCampo: any) {
    let valorCampo: string = this.inputForm.get(nombreCampo).value;

    if (!this.StringVacio(valorCampo)) {
      this.servicios.getData(this.servicios.URL_CONTRIBUYENTE, 'rtu_abogado', valorCampo, true).subscribe(
        (data: Notario) => {

          this.datosNotario = data;

          if (this.datosNotario) {
            if (this.datosNotario.status == 'I') {
              this.inputForm.controls[nombreCampo].setErrors({ 'incorrecto': true });
              this.txtError = `Error. Contribuyente inactivo como Notario, 
                                 verifique que está consignando correctamente los datos.`;
              this.inputForm.get('nombreNotario').setValue(null);
            }
            else {
              this.ValidarFA05_Documento(nombreCampo);
            }
          }
          else {
            this.inputForm.controls[nombreCampo].setErrors({ 'incorrecto': true });
            this.txtError = `Error. Contribuyente no está registrado como Notario, 
                               verifique que está consignando correctamente los datos.`;
            this.inputForm.get('nombreNotario').setValue(null);

          }
        },
        error => {
          let errorString = JSON.stringify(error);
          let errorJson = JSON.parse(errorString);

          if (errorJson.error.status == '404') {
            this.inputForm.controls[nombreCampo].setErrors({ 'incorrecto': true });
            this.txtError = `Error. Contribuyente no está registrado como Notario, 
                               verifique que está consignando correctamente los datos.`;
          }
          else {
            console.error("Error al verificar NIT del Notario: " + errorJson.error.userMessage);
            this.msgError = "Error grave: Error al verificar NIT del Notario";
            this.ShowNotification('top', 'center', 'danger', this.msgError);
          }
        },
        () => { }
      );
    }
  }

  ValidarFA05_Documento(nombreCampo: any) {

    let valorCampo: string = this.inputForm.get(nombreCampo).value;
    let parametros: string;
    this.txtErrorDocumento = null;

    if (this.StringVacio(this.txtError) && this.StringVacio(this.inputForm.get('numeroDoctoConstitucion').value)) {
      this.inputForm.controls[nombreCampo].setErrors({ 'incorrecto': true });
      this.inputForm.controls['numeroDoctoConstitucion'].markAsTouched();
      this.txtError = 'Por favor ingrese el Número de documento de constitución.';
    }

    /* jadamian 20.02.19 se adiciona sección ya que no se captura el año sino se calcula en base a la fecha de constitución, CU Datos de Identificación empresa-organización v.1.5 */
    if (this.StringVacio(this.txtError) && this.StringVacio(this.inputForm.get('fechaConstitucion').value)) {
      this.inputForm.controls[nombreCampo].setErrors({ 'incorrecto': true });
      this.inputForm.controls['fechaConstitucion'].markAsTouched();
      this.txtError = 'Por favor ingrese la Fecha de constitución';
    }

    if (this.StringVacio(this.txtError)) {

      /* jadamian 20.02.19 se adiciona sección ya que no se captura el año sino se calcula en base a la fecha de constitución, CU Datos de Identificación empresa-organización v.1.5 */
      let fechaConstitucion: Date = new Date(this.inputForm.get('fechaConstitucion').value);
      let anioDoctoConstitucion = fechaConstitucion.getFullYear();
      this.inputForm.get('anioDoctoConstitucion').setValue(anioDoctoConstitucion);

      parametros = valorCampo + ',' + this.inputForm.get('numeroDoctoConstitucion').value + ',' + this.inputForm.get('anioDoctoConstitucion').value;
      console.log('validarFA05_Documento: parametros: ' + parametros)

      this.servicios.
        getData(
          this.servicios.URL_CONTRIBUYENTE_JURIDICO,
          'verificaExisteConstitucion',
          parametros,
          false)
        .subscribe(
          (data: boolean) => {

            if (data) {
              this.inputForm.controls[nombreCampo].setErrors({ 'incorrecto': true });
              this.txtErrorDocumento = 'Ya existe registrado el número de documento que está ingresando';
              this.txtError = this.txtErrorDocumento;
            }
          },
          error => {
            let errorString = JSON.stringify(error);
            let errorJson = JSON.parse(errorString);
            console.error("Error al verificar documento de constitución: " + errorJson.error.userMessage);
            this.msgError = "Error grave: Error al verificar documento de constitución";
            this.ShowNotification('top', 'center', 'danger', this.msgError);
          },
          () => { }
        );
    }
  }

  ValidarFA06() {
    // No es necesario
  }

  ValidarFA07() {
    /* jadamian 20.02.19, CU Datos de Identificación empresa-organización v.1.5 
       no es necesario este método, el mostrado se valida en el frontend.
    */
  }

  ValidarFA08() {
    if (!this.StringVacio(this.inputForm.get('fechaInscripcion').value) && !this.StringVacio(this.inputForm.get('fechaConstitucion').value)) {
      if (this.inputForm.get('fechaInscripcion').value < this.inputForm.get('fechaConstitucion').value) {
        this.inputForm.controls['fechaInscripcion'].setErrors({ 'incorrecto': true });
        this.txtError = "Error. La fecha de inscripción no puede ser anterior a la fecha del documento de constitución, verifique que está consignando correctamente los datos";
      }
    }
  }

  ValidarFA09() {
    if (this.inputForm.get('participacionEmpresarial').value === "SI")
      this.inputForm.controls['camaraEmpresarial'].enable();
    else {
      this.inputForm.get('camaraEmpresarial').setValue(null);
      this.inputForm.controls['camaraEmpresarial'].disable();
    }

    if (this.inputForm.get('participacionGremial').value === "SI")
      this.inputForm.controls['gremial'].enable();
    else {
      this.inputForm.get('gremial').setValue(null);
      this.inputForm.controls['gremial'].disable();
    }
  }

  ValidarFA10() {
    this.InicializarForma();
  }

  ValidarFA11() {
    this.inputForm.controls['fechaInscripcion'].setErrors(null);
    this.inputForm.controls['fechaInscripcion'].updateValueAndValidity();
    this.inputForm.controls['fechaConstitucion'].setErrors(null);
    this.inputForm.controls['fechaConstitucion'].updateValueAndValidity();
    this.inputForm.controls['razonSocial'].setErrors(null);
    this.inputForm.controls['razonSocial'].updateValueAndValidity();
    this.inputForm.controls['nitNotario'].setErrors(null);
    this.inputForm.controls['nitNotario'].updateValueAndValidity();
    this.inputForm.controls['tipoFiduciaria'].setErrors(null);
    this.inputForm.controls['tipoFiduciaria'].updateValueAndValidity();

    this.msgAviso = null;
    this.msgExito = null;
    this.msgError = null;

    if (this.existeRazonSocial)
      this.inputForm.get('razonSocial').setValue(null);

    if (this.StringVacio(this.inputForm.get('nombreNotario').value) || !this.StringVacio(this.txtErrorDocumento))
      this.inputForm.get('nitNotario').setValue(null);

    /* jadamian 19.02.19 Se valida que se seleccione el tipoFiduciaria, CU Datos de Identificación empresa-organización v.1.5 */
    if (this.StringVacio(this.inputForm.get('tipoFiduciaria').value) && this.fiduciariaRequerido)
      this.inputForm.controls['tipoFiduciaria'].setErrors({ 'requerido': true });

    this.ValidateAllFormFields(this.inputForm);

    if (this.inputForm.valid) {

      /*
        jadamian 06.03.2019:
        si es un Colaborador-Delegado no se requiere verificación de documentos requeridos
        ya que no se indica en el CU-Inscripción Colaborador-Delegado RTU Empresa-Organización v.1.0
      */
      if (!this.esDelegado) {
        if (!this.documentoConstitucion) {
          this.msgAviso = "Error: Debe adjuntar documento de constitución (*)";
        }

        if (this.requierePatente) {
          if (!this.documentoPatente) {
            this.msgAviso = "Error: Debe adjuntar patente de empresa (*)";
          }
        }
      }
    }
    else {
      this.msgAviso = "Error: Debe llenar todos los campos obligatorios (*)";
    }
  }

  ValidarFA12() {
    let valorCampo: string = this.tipoPersoneriaSeleccionado[0].nombre;

    if (!this.StringVacio(valorCampo)) {
      this.requierePatente = (valorCampo.toUpperCase() === "SOCIEDAD DE EMPRENDIMIENTO") ? true : false;
    }
  }

  /* jadamian 19.02.19 Se agrega validación definida en FA13, CU Datos de Identificación empresa-organización v.1.5 */
  ValidarFA13() {
    let valorCampo: string = this.tipoPersoneriaSeleccionado[0].nombre;

    if (!this.StringVacio(valorCampo)) {
      if (this.listaFA13.includes(valorCampo))
        this.fiduciariaRequerido = true;
      else
        this.fiduciariaRequerido = false;
    }
  }

  /* jadamian 20.02.19 Se agrega validación definida en FA14, CU Datos de Identificación empresa-organización v.1.5 */
  ValidarFA14(valorCampo: any) {

    let valorCampoNumeros = valorCampo.replace(/[^0-9]/g, "");
    let valorCampoCaracteres = valorCampo.replace(/[^.&/-_"]/g, "");

    if (valorCampoNumeros.length > 0 || valorCampoCaracteres.length > 0) {
      if (valorCampoNumeros.length > 0 && valorCampoCaracteres.length > 0) {
        this.msgAviso = "Ha ingresado números y caracteres";
      }
      else {
        if (valorCampoNumeros.length > 0) {
          this.msgAviso = "Ha ingresado números";
        }
        if (valorCampoCaracteres.length > 0) {
          this.msgAviso = "Ha ingresado caracteres";
        }
      }
      this.ShowNotification('top', 'center', 'warning', this.msgAviso);
    }
  }

  ValidarNitNotario() {
    this.EstandarWebValidacion1_Formato('nitNotario');
    if (!this.txtError)
      this.EstandarWebValidacion1_NIT('nitNotario');
  }

  EstandarWebValidacion1_Formato(nombreCampo) {
    let valorCampo: string = this.inputForm.get(nombreCampo).value;

    valorCampo = valorCampo.replace(new RegExp(' ', 'gi'), '').trim(); // 1. eliminar espacios en blanco
    valorCampo = valorCampo.replace(new RegExp('-', 'gi'), '').trim(); // 2. eliminar guiones altos en cualquier posición
    valorCampo = valorCampo.replace(new RegExp('_', 'gi'), '').trim(); // 2. eliminar guiones bajos en cualquier posición
    valorCampo = valorCampo.substr(0, valorCampo.length - 1) + valorCampo.substr(valorCampo.length - 1, 1).toUpperCase(); // 4. digito de la derecha a mayúscula
    this.inputForm.get(nombreCampo).setValue(valorCampo);

    if (valorCampo === '00') { // 7. Si el valor ingresado es “00” mostrar mensaje de error
      this.inputForm.controls[nombreCampo].setErrors({ 'incorrecto': true });
      this.txtError = "Error. El NIT es inválido";
    }
    else
      this.txtError = null;
  }

  EstandarWebValidacion1_NIT(nombreCampo) {
    let valorCampo: string = this.inputForm.get(nombreCampo).value;
    this.inputForm.get('nombreNotario').setValue(null);

    if (this.StringVacio(this.txtError) && !this.StringVacio(valorCampo)) {

      this.servicios.getData(this.servicios.URL_CONTRIBUYENTE, 'sat_contribuyente', valorCampo, false).subscribe(
        (data: Contribuyente) => {
          let datosContribuyente: Contribuyente;

          datosContribuyente = data;

          if (datosContribuyente.status != 'A') { // 9. Si el valor ingresado es diferente a “A” mostrar mensaje de error
            this.inputForm.controls[nombreCampo].setErrors({ 'incorrecto': true });
            this.txtError = 'Error. El NIT no está “Activo”';
          }
          else {
            if (datosContribuyente.tipoNit == 1) { // Contribuyente Individual

              this.servicios.getData(this.servicios.URL_CONTRIBUYENTE_INDIVIDUAL, 'rtu_contribuyente_individual', valorCampo, false).subscribe(
                (data: ContribuyenteIndividual) => {
                  let datosContribuyenteIndividual: ContribuyenteIndividual;

                  datosContribuyenteIndividual = data;

                  if (datosContribuyenteIndividual.fechaFallecimiento) { // 8. Si el valor ingresado tiene fecha de fallecimiento mostrar mensaje de error
                    this.inputForm.controls[nombreCampo].setErrors({ 'incorrecto': true });
                    this.txtError = 'Error. El NIT se encuentra inactivo por fecha de fallecimiento';
                  }
                  else {
                    this.inputForm.get('nombreNotario').setValue(this.FormatearNombreContribuyente(datosContribuyenteIndividual));
                    this.ValidarFA05(nombreCampo);
                  }
                },
                error => {
                  let errorString = JSON.stringify(error);
                  let errorJson = JSON.parse(errorString);
                  console.error("Error al verificar NIT Individual: " + errorJson.error.userMessage);
                  this.msgError = "Error grave: Error al verificar NIT Individual";
                  this.ShowNotification('top', 'center', 'danger', this.msgError);
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
            this.inputForm.controls[nombreCampo].setErrors({ 'incorrecto': true });
            this.txtError = 'Error. El NIT no existe en la SAT';
          }
          else {
            console.error("Error al verificar NIT: " + errorJson.error.userMessage);
            this.msgError = "Error grave: Error al verificar NIT";
            this.ShowNotification('top', 'center', 'danger', this.msgError);
          }
        },
        () => { }
      );
    }
  }

  FormatearNombreContribuyente(contribuyente: ContribuyenteIndividual) {
    let nombre;
    nombre = contribuyente.primerNombre + " " + contribuyente.segundoNombre + " " + contribuyente.primerApellido + " " + contribuyente.segundoApellido;
    if (contribuyente.apellidoCasada)
      nombre += " DE " + contribuyente.apellidoCasada;
    return nombre;
  }


  EnviarDatosIdentificacion() {
    if (this.inputForm) {
      this.datosIdentificacionEmpresa.tipoPersoneria = this.tipoPersoneriaSeleccionado[0].codigo;
      this.datosIdentificacionEmpresa.descPersoneria = this.tipoPersoneriaSeleccionado[0].nombre;
      this.datosIdentificacionEmpresa.razonSocial = this.inputForm.get('razonSocial').value;
      this.datosIdentificacionEmpresa.fechaConstitucion = this.inputForm.get('fechaConstitucion').value;
      this.datosIdentificacionEmpresa.tipoDoctoConstitucion = this.inputForm.get('tipoDoctoConstitucion').value;
      this.datosIdentificacionEmpresa.numeroDoctoConstitucion = this.inputForm.get('numeroDoctoConstitucion').value;
      this.datosIdentificacionEmpresa.anioDoctoConstitucion = this.inputForm.get('anioDoctoConstitucion').value;
      this.datosIdentificacionEmpresa.nitNotario = this.inputForm.get('nitNotario').value;
      this.datosIdentificacionEmpresa.nombreNotario = this.inputForm.get('nombreNotario').value;
      if (!this.esDelegado) { /* agapineda 050319 */
        this.datosIdentificacionEmpresa.fechaInscripcion = this.inputForm.get('fechaInscripcion').value;
        this.datosIdentificacionEmpresa.registroExterno = this.inputForm.get('registroExterno').value;
        this.datosIdentificacionEmpresa.sectorEconomico = this.inputForm.get('sectorEconomico').value;
        this.datosIdentificacionEmpresa.participacionGremial = this.inputForm.get('participacionGremial').value;
        this.datosIdentificacionEmpresa.camaraEmpresarial = this.inputForm.get('camaraEmpresarial').value;
        this.datosIdentificacionEmpresa.participacionEmpresarial = this.inputForm.get('participacionEmpresarial').value;
        this.datosIdentificacionEmpresa.gremial = this.inputForm.get('gremial').value;
        this.datosIdentificacionEmpresa.documentoPatente = this.documentoPatente;
        this.datosIdentificacionEmpresa.documentoConstitucion = this.documentoConstitucion;
      } else {
        this.datosIdentificacionEmpresa.fechaInscripcion = null;
        this.datosIdentificacionEmpresa.registroExterno = null;
        this.datosIdentificacionEmpresa.sectorEconomico = null;
        this.datosIdentificacionEmpresa.participacionGremial = null;
        this.datosIdentificacionEmpresa.camaraEmpresarial = null;
        this.datosIdentificacionEmpresa.participacionEmpresarial = null;
        this.datosIdentificacionEmpresa.gremial = null;
        this.datosIdentificacionEmpresa.documentoPatente = null;
        this.datosIdentificacionEmpresa.documentoConstitucion = null;
      }

      /* jadamian 19.02.19 Se llenan los campos nuevos a enviar a lambda, CU Datos de Identificación empresa-organización v.1.5 */
      if (this.fiduciariaRequerido) {
        this.datosIdentificacionEmpresa.tipoFiduciaria = this.tipoFiduciariaSeleccionado[0].codigo;
        this.datosIdentificacionEmpresa.descTipoFiduciaria = this.tipoFiduciariaSeleccionado[0].nombre;
      }
      else {
        this.datosIdentificacionEmpresa.tipoFiduciaria = null;
        this.datosIdentificacionEmpresa.descTipoFiduciaria = null;
      }

      console.log('enviarDatosIdentificacion: ' + JSON.stringify(this.datosIdentificacionEmpresa))
      /* COMUNICACION CON OTROS COMPONENTES */
      this._datosIdentificacionSalida.emit(JSON.stringify(this.datosIdentificacionEmpresa));
      /* COMUNICACION CON OTROS COMPONENTES */

      //this.inicializarForma();
    }
  }


  /* METODOS GENERICOS LLAMADOS DESDE EL COMPONENTE */
  InicializarForma() {
    this.inputForm.reset();
    this.InicializarCamposDeLaForma(this.inputForm);
    this.inputForm.get('participacionGremial').setValue('NO');
    this.inputForm.get('participacionEmpresarial').setValue('NO');
    this.tipoPersoneriaSeleccionado = [{ codigo: 0, codigoCatalogo: 0, codigoDatoPadre: 0, codigoIngresado: "", descripcion: "", estado: 0, fechaAgrega: "", fechaModifica: "", nombre: "", usuarioAgrega: "", usuarioModifica: "" }];
    this.tipoFiduciariaSeleccionado = [{ codigo: 0, codigoCatalogo: 0, codigoDatoPadre: 0, codigoIngresado: "", descripcion: "", estado: 0, fechaAgrega: "", fechaModifica: "", nombre: "", usuarioAgrega: "", usuarioModifica: "" }];
    this.documentoConstitucion = null;
    this.documentoPatente = null;
    this.msgAviso = null;
    this.msgExito = null;
    this.msgError = null;
    this.txtError = null;
    if (this.esDelegado) {
      this.inputForm.get("fechaInscripcion").disable();
      this.inputForm.get("fechaInscripcion").markAsUntouched();
      this.inputForm.get("sectorEconomico").disable();
      this.inputForm.get("sectorEconomico").markAsUntouched();
      this.inputForm.get("participacionGremial").disable();
      this.inputForm.get("participacionGremial").markAsUntouched();
      this.inputForm.get("participacionEmpresarial").disable();
      this.inputForm.get("participacionEmpresarial").markAsUntouched();
    }

    /*
     jadamian 06.03.2019:
     si es un Colaborador-Delegado se habilita el campo nitNotario, el cual está desabilitado por default
     ya que no se indica en el CU-Inscripción Colaborador-Delegado RTU Empresa-Organización v.1.0
    */
    if (this.esDelegado) {
      this.inputForm.controls['nitNotario'].enable();
    }
  };

  InicializarCamposDeLaForma(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      formGroup.get(field).setValue(null);
    });
  };

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
    if (typeof cadena === 'string')
      resultado = (cadena == 'null' || cadena.length == 0)
    else
      resultado = cadena == null;
    return resultado;
  };


  /* CONSTRUCTOR */
  constructor(private servicios: Servicios,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer
  ) { }


  ShowNotification(from: any, align: any, tipoNotificacion: string, textoNotificacion: string) {
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

  /* LLAMADAS A LOS SERVICIOS DE CATALOGOS */

  TraerTiposPersoneria() {
    this.servicios.getData(this.servicios.URL_DATO, 'cat_dato_by_catalogo', this.constantes.CODIGO_CAT_TIPO_PERSONERIA, false).subscribe(
      (data: Array<CatDato>) => {
        this.listaTiposPersoneria = data;
      },
      error => {
        console.error("Error al buscar tipos de personería: " + error);
        this.msgError = "Error grave: no se encontraron datos de tipos de personería";
        this.ShowNotification('top', 'center', 'danger', this.msgError);
      },
      //07.12.18 aalruanoe se trata de setear el valor a la lista de personerias
      () => {
        if (this.datosIdentificacionEmpresa.tipoPersoneria != undefined) {
          this.tipoPersoneriaSeleccionado =
            this.listaTiposPersoneria.filter(el => {
              return (el.codigo == this.datosIdentificacionEmpresa.tipoPersoneria);
            });
          this.inputForm.controls['tipoPersoneria'].setValue(this.datosIdentificacionEmpresa.tipoPersoneria);
        }
      }
    );
  }

  TraerTiposDoctoConstitucion() {
    this.servicios.getData(this.servicios.URL_DATO, 'cat_dato_by_catalogo', this.constantes.CODIGO_CAT_TIPO_DOC_CONSTITUCION, false).subscribe(
      (data: Array<CatDato>) => {
        this.listaTiposDoctoConstitucion = data;
      },
      error => {
        console.error("Error al buscar tipos de documento de constitución: " + error);
        this.msgError = "Error grave: no se encontraron datos de tipos de documento de constitución";
        this.ShowNotification('top', 'center', 'danger', this.msgError);
      }
    );
  }

  TraerSectoresEconomicos() {
    this.servicios.getData(this.servicios.URL_DATO, 'cat_dato_by_catalogo', this.constantes.CODIGO_CAT_SECTOR_ECONOMICO, false).subscribe(
      (data: Array<CatDato>) => {
        this.listaSectoresEconomicos = data;
      },
      error => {
        console.error("Error al buscar catálogo de sectores económicos: " + error);
        this.msgError = "Error grave: no se encontraron datos de sectores económicos";
        this.ShowNotification('top', 'center', 'danger', this.msgError);
      }
    );
  }

  TraerRegistrosExternos() {
    this.servicios.getData(this.servicios.URL_DATO, 'cat_dato_by_catalogo', this.constantes.CODIGO_CAT_REGISTROS_EXTERNOS, false).subscribe(
      (data: Array<CatDato>) => {
        this.listaRegistrosExternos = data;
      },
      error => {
        console.error("Error al buscar catálogo de registros externos: " + error);
        this.msgError = "Error grave: no se encontraron datos de registros externos";
        this.ShowNotification('top', 'center', 'danger', this.msgError);
      }
    );
  }

  /* jadamian 19.02.19 Se obtiene la condición especial para el tipo de personería, CU Datos de Identificación empresa-organización v.1.5 */
  TraerRegistroExternoPersoneria() {
    let valorCampo: number = this.tipoPersoneriaSeleccionado[0].codigo;

    this.inputForm.get('registroExterno').setValue(null);

    if (valorCampo) {
      this.servicios.
        getData(
          this.servicios.URL_DATO,
          'condiciones',
          valorCampo + '/' + this.constantes.CODIGO_CONESPDATO_REGISTRO_EXTERNO,
          false)
        .subscribe(
          (data: CondicionEspecialDato) => {
            let condicionEspecialDato: CondicionEspecialDato = data;

            if (condicionEspecialDato.valor) {
              this.inputForm.get('registroExterno').setValue(data.valor);
            }
          },
          error => { // error de condicion especial Afecto/Exento
            let errorString = JSON.stringify(error);
            let errorJson = JSON.parse(errorString);

            if (errorJson.error.status != '404') {
              console.error("Error al verificar dato especial del Representante: " + errorJson.error.userMessage);
              this.msgError = "Error grave: Error al verificar dato especial del Representante";
              this.ShowNotification('top', 'center', 'danger', this.msgError);
            }
          },
          () => { }
        );
    }
  }

  /* jadamian 19.02.19 Se obtiene catálogo de Bancos y entidades fiduciarias, CU Datos de Identificación empresa-organización v.1.5 */
  TraerTiposFiduciaria() {
    this.servicios.
      getData(
        this.servicios.URL_DATO,
        'cat_dato_by_catalogo',
        this.constantes.CODIGO_CAT_BANCOS_ENTIDADES_FIDUCIARIAS,
        false
      )
      .subscribe(
        (data: Array<CatDato>) => {
          this.listaTiposFiduciaria = data;
        },
        error => {
          console.error("Error al buscar tipos de Banco o financiera fiduciaria: " + error);
          this.msgError = "Error grave: no se encontraron datos de tipos de Banco o financiera fiduciaria";
          this.ShowNotification('top', 'center', 'danger', this.msgError);
        },
        () => {
        }
      );
  }


  /* jadamian 21.02.19 Se obtiene catálogo de Camaras Empresariales, CU Datos de Identificación empresa-organización v.1.5 */
  TraerCatalogoCamarasEmpresariales() {
    this.servicios.
      getData(
        this.servicios.URL_DATO,
        'cat_dato_by_catalogo',
        this.constantes.CODIGO_CAT_CAMARAS_EMPRESARIALES,
        false
      )
      .subscribe(
        (data: Array<CatDato>) => {
          this.listaCamarasEmpresariales = data;
        },
        error => {
          console.error("Error al buscar tipos de Cámaras Empresariales: " + error);
          this.msgError = "Error grave: no se encontraron datos de tipos de Cámaras Empresariales";
          this.ShowNotification('top', 'center', 'danger', this.msgError);
        },
        () => {
        }
      );
  }


  /* jadamian 21.02.19 Se obtiene catálogo de Camaras Empresariales, CU Datos de Identificación empresa-organización v.1.5 */
  TraerCatalogoGremiales() {
    this.servicios.
      getData(
        this.servicios.URL_DATO,
        'cat_dato_by_catalogo',
        this.constantes.CODIGO_CAT_GREMIALES,
        false
      )
      .subscribe(
        (data: Array<CatDato>) => {
          this.listaGremiales = data;
        },
        error => {
          console.error("Error al buscar tipos de Gremiales: " + error);
          this.msgError = "Error grave: no se encontraron datos de tipos de Gremiales";
          this.ShowNotification('top', 'center', 'danger', this.msgError);
        },
        () => {
        }
      );
  }


  TraerListaAnios() {
    let i: number;
    for (i = 2001; i <= this.anioActual; i++) {
      this.listaAnios.push(i);
    }
  }

  /* jadamian 19.02.19 Se llena lista indicada en Anexo1 */
  LLenarListaAnexo1() {
    this.listaAnexo1.push('Entidad del Estado');
    this.listaAnexo1.push('Municipalidad y sus empresas');
    this.listaAnexo1.push('Confederación o Federación deportiva');
    this.listaAnexo1.push('Diplomático, Organismo Internacional o Misión diplomática');
    this.listaAnexo1.push('Asociación de padres de familia');
    this.listaAnexo1.push('Consejo de padres de familia');
    this.listaAnexo1.push('Consejo comunitario de desarrollo');
    this.listaAnexo1.push('Consejo educativo y núcleo familiar educativo');
    this.listaAnexo1.push('Junta escolar');
  }

  /* jadamian 19.02.19 Se llena lista indicada en FA13, CU Datos de Identificación empresa-organización v.1.5 */
  LLenarListaFA13() {
    this.listaFA13.push('Bien Administrado Por Fideicomiso');
    this.listaFA13.push('Fideicomiso');
  }

  /* ON INIT */
  ngOnInit() {
    this.esDelegado = false; //hacer un metodo que consulte lambda
    this.fiduciariaRequerido = false;

    this.TraerTiposPersoneria();
    this.TraerTiposDoctoConstitucion();
    this.TraerSectoresEconomicos();
    this.TraerRegistrosExternos();
    this.TraerListaAnios();
    this.LLenarListaAnexo1();
    this.TraerTiposFiduciaria();
    this.TraerCatalogoCamarasEmpresariales();
    this.TraerCatalogoGremiales();
    this.LLenarListaFA13();

    // Se definen los campos de la forma
    this.inputForm = this.formBuilder.group({
      tipoPersoneria: [0, Validators.required],
      razonSocial: [null, [Validators.required, Validators.pattern('[A-z0-9 áéíóúñÁÉÍÓÚÑ.&/_",-]*')]],
      fechaConstitucion: ['', Validators.required],
      tipoDoctoConstitucion: [0, null],
      numeroDoctoConstitucion: [0, Validators.required],
      anioDoctoConstitucion: [0, null],
      nitNotario: new FormControl({ value: '', disabled: true }),
      nombreNotario: new FormControl({ value: '', disabled: true }),
      fechaInscripcion: ['', null],
      registroExterno: new FormControl({ value: null, disabled: true }),
      sectorEconomico: [0, null],
      participacionGremial: ['NO', null],
      camaraEmpresarial: new FormControl({ value: '', disabled: true }),
      participacionEmpresarial: ['NO', null],
      gremial: new FormControl({ value: '', disabled: true }),
      tipoFiduciaria: [0, null],
    });
    this.InicializarForma();
  }
}
