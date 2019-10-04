import { Component, OnInit, OnChanges, SimpleChanges, Input, Directive } from '@angular/core';
import { Servicios } from 'app/servicios/servicios.service';
import { MatStepper } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import * as moment from 'moment';
import { SafeResourceUrl, SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { CargaArchivo } from 'app/interfaces/cargaArchivo.interface';
import { RepresentanteLegal } from 'app/interfaces/representante/representante-legal.interface';
import { ApiProxyService } from 'app/servicios/api-proxy.service';
import { variable } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-cancelacion',
  templateUrl: './cancelacion.component.html',
  styleUrls: ['./cancelacion.component.scss']
})

export class CancelacionComponent implements OnInit, OnChanges {

  title: String = 'CANCELACION ESTABLECIMIENTO';
  editable = false;
  canValue: String = '';
  seleccion: any = {};
  estadoSeleccion = true;
  estado: any = 1;
  opciones: FormGroup;
  formCancelacion: FormGroup;
  formMercantil: FormGroup;
  res: any;
  mCancelacion: String = '';
  cargaExitosaDocMercantil = false;
  fileDocMercantil: File = null;
  archivoValido: boolean;
  archivoMercantil: CargaArchivo;
  urlArchivoMercantil: SafeResourceUrl;
  codigoGestion: string;
  isImageLoading: boolean;
  imagen: any;
  filePreviewPath: SafeUrl;
  validaciones: any = {
    docAutorizados: false,
    estatusJuridico: false,
    declaracionesCero: false,
    existenVehiculos: false,
    existenRepresentantes: false
  };
  representantesLegales: RepresentanteLegal[] = [];
  formDecJur: FormGroup;
  estatusVal: boolean;
  envioSolicitud = false;

  constructor(
              private servicio: Servicios,
              private apiProxy: ApiProxyService,
              private formBuilder: FormBuilder,
              private sanitizer: DomSanitizer
    ) {
    this.formCancelacion = new FormGroup({
      fechaCancelacion: new FormControl('', Validators.required)
    });
    this.formMercantil = new FormGroup({
      archivoMercantil: new FormControl('')
    });
    this.formDecJur = new FormGroup({
      aceptoDec: new FormControl('', Validators.required)
    });
  }


  ngOnInit() {
    this.opciones = this.formBuilder.group({
      opcion: ['', Validators.required]
    });

    this.obtenerNit();
    console.log('Representantes', this.representantesLegales);
  }

  ngOnChanges(change: SimpleChanges) {
    // console.table(change);
  }


  handleFileInput(files: FileList) {

    this.apiProxy.files = files;

    let tamanio: number;
    this.fileDocMercantil = files.item(0);

    console.log('fileDocMercantil nombre: ' + this.fileDocMercantil.name);
    console.log('fileDocMercantil tamaño byte ' + this.fileDocMercantil.size);
    console.log((this.fileDocMercantil.size / 1048576).toFixed(2) + 'MB');
    tamanio = Number((this.fileDocMercantil.size / 1048576).toFixed(2));
    if (tamanio > 10) {
      console.log('Excede el maximo del tamaño');
      this.limpiaArchivo();
      this.Alerta('CargaTamanioFallo');
    }
    this.archivoValido = this._esValido(this.fileDocMercantil.type);
    if (!this.archivoValido) {
      this.limpiaArchivo();
      this.Alerta('CargaFormatoFallo');
    }

  }

  cancelacion($event) {
    this.canValue = $event;
    this.estado++;
  }

  resultado($event: any) {
    this.res = $event;
    const fechaA = moment();
    const fechaAnt = moment().subtract(4, 'years');
    if (this.res.canValue === 'cancPrescrita') { this.mCancelacion = 'Prescrito'; }
    if (this.res.canValue === 'cancDefinitiva') { this.mCancelacion = 'Definitivo'; }
    if (this.res.canValue === 'cancTemporal') { this.mCancelacion = 'Temporal'; }

    // Verifico el tipo de contribuyente
    this.servicio.getTipoContribuyente(this.servicio.NIT)
      .subscribe(res => {
        if (res === 0) {
          this.validaciones.estatusIndividual = true;
        } else if (res > 0) {
          this.validaciones.estatusJuridico = true;
          // Obtengo la lista de represetantes legales
          this.servicio.getRepresentantesLegales(this.servicio.NIT)
            .subscribe(resultado => {
              console.log('Resultado', resultado);
              if (resultado !== null) {
                this.representantesLegales = resultado as RepresentanteLegal[];
                this.validaciones.estatusJuridico = false;
              } else {
                this.validaciones.existenRepresentantes = true;
              }
              console.log('Datos de los representantes ', this.representantesLegales);
            }, error => {
              console.log('Hubo un error al obtener los representantes legales: ', error);
              if (error.error.status === 404) {
                this.validaciones.existenRepresentantes = false;
              }

            });
        }
      }, error => console.log('Hubo un error al saber el tipo de representante: ', error));

    // Verifico que no existan declaraciones a cero
    this.servicio.getDeclaracionesCero(this.servicio.NIT)
      .subscribe(res => {
        console.log(res);
        this.validaciones.declaracionesCero = !res.declaracionesCero;
      }, error => {
        console.log(error);
        this.validaciones.declaracionesCero = null;
      });

    // Verifico que no existan retenciones
    this.servicio.getRetenciones(fechaAnt.format('DD/MM/YYYY'), fechaA.format('DD/MM/YYYY'), this.servicio.NIT)
      .subscribe(res => {
        this.validaciones.existenRetenciones = res.existenRetenciones;
      }, error => {
        console.error(error);
        this.validaciones.existenRetenciones = null;
      });

     // Verifico los vehiculos con los que cuenta
    this.servicio.getVehiculosAsociados(this.servicio.NIT)
      .subscribe(res => {
        this.validaciones.existenVehiculos = res.existenVehiculos;
      }, error => {
        console.error(error);
        this.validaciones.existenVehiculos = null;
      });

    this.estatusValidaciones(this.res);
    console.log($event);
  }

  formOpciones($event) {
    this.opciones = $event;
  }

  formFechaCanc($event) {
    this.formCancelacion = $event;
  }

  obtenerNit() {
    this.servicio.obtenerNIT();
  }

  nuevaSolicitud(stepper: MatStepper) {
    this.limpiarStepper(stepper);
  }

  limpiarStepper(stepper: MatStepper) {
    this.servicio.limpiarStepper(stepper);
  }

  completar() {
    console.log('Fecha de cancelacion', this.formCancelacion.value.fechaCancelacion.format('DD/MM/YYYY'));

    const variables = {
      nit: this.servicio.NIT,
      fechaCancelacion: this.formCancelacion.value.fechaCancelacion.utc().format(),
      numeroEstablecimiento: `${this.res.establecimiento.noEstablecimiento}`,
      otroEstablecimientoActivo: false,
      tipoContribuyente: '',
      tipoContribuyente_LABEL: '',
      verificarAfiliaciones: true,
      fechaActualCancelacion: moment.utc().format()
    }
    if (this.res.estabActivos > 1) { variables.otroEstablecimientoActivo = true; }
    if (this.validaciones.estatusIndividual) {
        variables.tipoContribuyente = 'persona';
        variables.tipoContribuyente_LABEL = 'Persona Individual'
    } else if (this.validaciones.estatusJuridico) {
        variables.tipoContribuyente = 'empresa';
        variables.tipoContribuyente_LABEL = 'Empresa/Organizacion'
    }

    console.log(variables);

    this.apiProxy.iniciarProceso(variables)
      .subscribe(res => {
        console.log(res);
        if (this.apiProxy.files !== undefined && this.apiProxy.files !== null) {
          if (this.apiProxy.files.length > 0) {
            this.apiProxy.subirDocAps(res.id).subscribe(resF => console.log(resF));
          }
        }
        console.log(res);
        this.apiProxy.siguienteTarea(variables, res.id)
          .subscribe(resST => {
            if (resST.taskId !== '') {
              this.envioSolicitud = true;
              console.log('Estado de la solicitud', this.envioSolicitud);
            }
            console.log('Resultado', resST);
            this.apiProxy.ejecutarTarea(resST.taskId, { outcome: 'default' })
              .subscribe(resT => {
                console.log('Ejecutar tarea', resT);
              }, error => {
                console.log(error)
              });
          })
      }, error => console.log('Error', error));
  }

  estatusValidaciones(res: any) {
    console.log(this.validaciones.declaracionesCero,
      this.validaciones.existenRetenciones,
      this.validaciones.existenVehiculos,
      this.validaciones.estatusIndividual,
      this.validaciones.estatusJuridico,
      this.representantesLegales.length);
   /*  if (
        this.validaciones.declaracionesCero === false || this.validaciones.existenRetenciones
        || (this.validaciones.existenVehiculos === true && res.estabActivos > 1)
        || (this.validaciones.estatusJuridico && this.representantesLegales.length === 0)
        ) {
          this.estatusVal = true;
    } else {
      this.estatusVal = false;
    } */
  }

  limpiaArchivo() {
    this.fileDocMercantil = null;
    this.cargaExitosaDocMercantil = false;
    this.urlArchivoMercantil = null;
    this.archivoValido = false;
  }

  private _esValido(tipoArchivo: string): boolean {

    console.log('tipoArchivo ' + tipoArchivo);

    if (tipoArchivo === '' || tipoArchivo === undefined) {
      return false;
    } else {
      if (tipoArchivo === 'image/jpeg' || tipoArchivo === 'image/png' || tipoArchivo === 'application/pdf') {
        return true;
      }
    }
  }
  // Cargar archivo
  cargarArchivo() {
    this.cargaExitosaDocMercantil = true;
    let archivo: CargaArchivo;
    this.archivoMercantil = {
      identificador: `${this.servicio.URL_DOCUMENTO_S3}/${this.codigoGestion}/${this.fileDocMercantil.name}`,
      nombre: this.fileDocMercantil.name,
      documento: this.fileDocMercantil,
      tipoDocumento: this.fileDocMercantil.type,
      idDocumento: '961',
      carpetaArchivo: this.codigoGestion,
      cargado: true
    };
    archivo = this.archivoMercantil;
    console.log(this.fileDocMercantil);

    // se  carga a un folder en el S3
    this.servicio.putArchivoS3(this.servicio.URL_DOCUMENTO_S3, archivo.carpetaArchivo, archivo)
    .subscribe((resultado) => {
      console.log(`resultado de carga ${JSON.stringify(resultado)}`);
      this.Alerta('CargaExito');

      this.archivoMercantil = archivo;
      // tslint:disable-next-line: max-line-length
      // console.log(`Control Archivo Resolución ME1: ${this.establecimiento.controls['archivoResolucion'].value} idFile ME2: ${this.fileDocMercantil}`);
    },
      (error) => {
        console.error(`Ocurrió un Error ${error}`);
        console.error(error);
      },
      () => {
        console.log('carga realizada correctamente');
      });

  }
  // Obtener Archivo
  obtenerArchivo() {
    let archivo: CargaArchivo;
    let fileObtener: File;
    archivo = this.archivoMercantil;
    fileObtener = this.fileDocMercantil;
    if (this.cargaExitosaDocMercantil) {
      this.isImageLoading = false;
      console.log(`${this.servicio.URL_DOCUMENTO_S3}/${archivo.carpetaArchivo}/${fileObtener.name}`);
      this.servicio.getArchivoS3(this.servicio.URL_DOCUMENTO_S3, archivo.carpetaArchivo, fileObtener.name)
        .subscribe(resultado => {
          this.crearImagen(resultado);
          this.isImageLoading = false;
        },
          error => {
            console.error(`Ocurrió un Error al descargar ${JSON.stringify(error)}`);
          },
          () => {
            console.log('descarga realizada correctamente');
          }),
        catchError(this.servicio.handleError);
    }

  }
  // Eliminar Archivo
  eliminarArchivo(archivo: CargaArchivo, archivoEliminar: File) {
    this.servicio.deleteArchivoS3(this.servicio.URL_DOCUMENTO_S3, archivo.carpetaArchivo, archivoEliminar.name)
      .subscribe(resultado => {
        console.log(`resultado de eliminacion ${JSON.stringify(resultado)}`);
      },
        error => {
          console.error(`Ocurrió un Error al eliminar ${JSON.stringify(error)}`);
        },
        () => {
          console.log('eliminación realizada correctamente');

        }),
      catchError(this.servicio.handleError);
  }

  /**
   * Método para crear una imagen del resultado del S3
   * @param image imagen
   */

  crearImagen(image: Blob) {
    console.log('a crear imagen');
    const reader = new FileReader();
    let urlArchivo: SafeResourceUrl;

    reader.addEventListener('loadend', () => {
      this.imagen = reader.result;
      console.log(`imageToShow ${JSON.stringify(this.imagen)}`);
    }, false);
    if (image) {
      // se sanitiza la url del archivo
      console.log(`URL ${window.URL.createObjectURL(image)}`);
      this.filePreviewPath = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(image)));
      console.log(`this.filePreviewPath ${this.filePreviewPath}`);
      if (!image.type.startsWith('image')) {

        urlArchivo = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(image));

        console.log(`es pdf ${urlArchivo}`);

      } else {
        urlArchivo = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(image));

      }

      this.urlArchivoMercantil = urlArchivo;

    }
  }
  // Notificaciones por alertas
  Alerta(type: any) {
    if (type === 'CargaExito') {

      swal({
        title: '¡Documento cargado satisfactoriamente!',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-blue-sat'
      }).catch(swal.noop)

    }

    if (type === 'CargaTamanioFallo') {

      swal({
        title: 'Error. Tamaño de archivo excede el máximo permitido de 10 Mb.',
        text: '',
        type: 'error',
        confirmButtonClass: 'btn btn-blue-sat',
        buttonsStyling: false
      }).catch(swal.noop)

    }

    if (type === 'CargaFormatoFallo') {

      swal({
        title: 'Error. El formato de archivo no es permitido.',
        text: '',
        type: 'error',
        confirmButtonClass: 'btn btn-blue-sat',
        buttonsStyling: false
      }).catch(swal.noop)

    }

    if (type === 'eliminarArchivoResolucion') {

      swal({
        title: 'Eliminar',
        text: '¿Esta seguro de eliminar el documento?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
        confirmButtonClass: 'btn btn-blue-sat',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false
      }).then((result) => {
        if (result.value) {
          this.eliminarArchivo(this.archivoMercantil, this.fileDocMercantil);
          this.limpiaArchivo();
        } else {
          swal({
            title: 'Eliminación cancelada',
            text: '',
            type: 'error',
            confirmButtonClass: 'btn btn-blue-sat',
            buttonsStyling: false
          }).catch(swal.noop)

        }
      }
      )
    }

  }
}
