import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { IDatosEstablecimientoC } from 'app/interfaces/datos-establecimiento/datosEstablecimiento.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { Servicios } from 'app/servicios/servicios.service';
import { ActividadComerical } from 'app/interfaces/actividadComercial.interface';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import * as moment from 'moment';


// Constantes
declare const $: any;

@Component({
  selector: 'app-establecimiento',
  templateUrl: './establecimiento.component.html',
  styleUrls: ['./establecimiento.component.scss'],
})
export class EstablecimientoComponent implements OnInit, OnChanges {

  @Input() estado: Number;
  @Input() canValue: String = '';
  @Output() formFechaCanc: EventEmitter<any> = new EventEmitter();
  @Output() resultado: EventEmitter<any> = new EventEmitter();

  displayedColumns: string[] = [
    'select',
    'noEstablecimiento',
    'nombreComercialEstablecimiento',
    'actividadEconomica',
    'actividadComercial',
    'clasificacionEstablecimiento',
    'fechaInicioOperaciones',
    'direccion',
    'tipoEstablecimiento',
    'estado'
  ];

  establecimientos: IDatosEstablecimientoC[] = [];
  dataSource = new MatTableDataSource<IDatosEstablecimientoC>();
  selection = new SelectionModel<IDatosEstablecimientoC>(true, []);
  objeto: any = {};
  listaActividadEconomica: ActividadComerical[];
  msgErrorServicio: string;
  listaSeleccion: any[] = [];
  estadosEstablecimientos: any[] = [];
  clasificacion: any[] = [];
  tipoEstablecimiento: any[] = [];
  objR: any = {};

  maxDateFechaCan = new Date();
  minDateFechaCan = new Date();
  estadoFechaCan = false;
  formCancelacion: FormGroup;
  estadoFecha = true;
  fCanc: any = {};

  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private servicio: Servicios) {
    this.formCancelacion = new FormGroup({
      fechaCancelacion: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.servicio.getTipoEstablecimiento()
      .subscribe(res => this.tipoEstablecimiento = res);
    this.servicio.getActividadesCoE()
      .subscribe(res => {
        this.listaActividadEconomica = res;
        // console.log(this.listaActividadEconomica);
      });
    this.servicio.getClasificacion()
      .subscribe(res => this.clasificacion = res);
    // this.servicio.optenerNIT();
    this.servicio.getEstadosEstablecimientos()
      .subscribe(res => {
        this.estadosEstablecimientos = res
        res.forEach(e => {
          if (e.codigo === '1020') {
            this.estadosEstablecimientos.push(e);
          } else if (e.codigo === '1036') {
            this.estadosEstablecimientos.push(e);
          }
        });
        // console.log(this.establecimientos);
      });

    // Se establece el máximo para la fecha de inicio de operaciones.
    this.maxDateFechaCan.setFullYear(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    );
    // Se establece el mínimo para fecha de inicio de operaciones.
    // this.minDateFechaCan.setFullYear(moment().subtract(4, 'years').year());

    this.formFechaCanc.emit(this.formCancelacion);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.estado.isFirstChange && changes.estado.previousValue !== undefined) {
      this.getEstablecimientos();
      console.info('Estados: ', changes.estado);
    } else if (!changes.estado.isFirstChange) {
      console.log('ya no es el primer cambio', changes);
    }
    if (this.canValue === 'cancPrescrita') this.minDateFechaCan = null;
    else this.minDateFechaCan.setFullYear(moment().subtract(4, 'years').year());
  }

  getEstablecimientos() {

    this.servicio.getEstablecimientos(this.servicio.NIT)
      .subscribe(res => {
        // Limpio la lista de seleccion
        this.listaSeleccion = [];
        console.log('Datos extraidos', res);
        // console.log('Filtro', res.filter(r => r.estado === 1020));
        if (this.canValue === 'cancPrescrita') {
          res = res.filter(r => r.estado === 1020);
          this.objR.estabActivos = res.length;
        }

        res.forEach(e => {

          this.objeto.noEstablecimiento = e.numeroEstablecimiento;
          this.objeto.nombreComercialEstablecimiento = e.nombreComercial;
          this.objeto.direccion = null;
          this.listaActividadEconomica.forEach(element => {
            if (element.codigoActividadEconomica === e.actividadEconomica) {
              this.objeto.actividadEconomica = element.nombre;
            }
          });
          this.objeto.actividadComercial = e.actividadComercial;
          this.listaActividadEconomica.forEach(element => {
            if (element.codigoActividadEconomica === e.actividadEconomica) {
              this.objeto.actividadComercial = element.nombre;
            }
          });
          this.objeto.clasificacionEstablecimiento = e.clasificacionEstablecimiento;
          this.clasificacion.forEach(element => {
            if (element.codigo === e.clasificacionEstablecimiento) {
              this.objeto.clasificacionEstablecimiento = element.nombre;
            }
          });

          this.tipoEstablecimiento.forEach(element => {
            if (element.codigo === e.tipoEstablecimiento) {
              this.objeto.tipoEstablecimiento = element.nombre;
            }
          });
          this.objeto.fechaInicioOperaciones = e.fechaInicioBeneficioFiscal;
          // this.objeto.estado = e.estado;
          this.estadosEstablecimientos.forEach(element => {
            if (element.codigo === e.estado) {
              this.objeto.estado = element.nombre;
            }
          });
          this.establecimientos.push(this.objeto);
          this.objeto = {}
          // console.log(e);
        });
        this.dataSource.data = this.establecimientos;
        console.log(this.establecimientos);
        this.establecimientos = [];
      }, error => {
        console.log('Error: ', error);
        this.dataSource.data = [];
      });
  }

  filtro(obj: any) {
    if (obj.estado === 1020) {
      return true;
    } else {
      return false;
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  prueba(texto: String) {
    console.log('Prueba', texto);
  }

  seleccionar(row) {

    if (!this.selection.isSelected(row)) {
      this.listaSeleccion.push(row);
    } else {
      let i = this.listaSeleccion.indexOf(row);
      this.listaSeleccion.splice(i, 1);
    }
    console.log('Lista de establecimientos', this.listaSeleccion);
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;

    return numSelected === numRows;
  }

  /** Método que quita las selecciones de las filas de la tabla */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  cancelarEst(): void {

    this.getValidFechaC(this.formCancelacion.value.fechaCancelacion);
  }

  enviar() {
    this.objR.establecimiento = this.listaSeleccion[0];
    this.objR.canValue = this.canValue;
    this.resultado.emit(this.objR);
    // Limpio la lista de seleccion
    this.listaSeleccion = [];
    this.selection.clear();
  }

  limpiar() {
    this.formCancelacion.reset();
    this.estadoFecha = true;
  }
  // Valido la fecha de cancelacion
  ValFechaCancelacion(type: string, event: MatDatepickerInputEvent<Date>) {
    console.log(`Validaciones tipo: ${type} y valor ${event.value}`);
    const fechaA = moment();
    const fechaAnt = moment().subtract(4, 'years');
    const fechaC = moment(event.value);
    this.objeto.fechaCancelacion = fechaC;
    this.formCancelacion.controls[
      'fechaCancelacion'
    ].updateValueAndValidity();

    // valido la fecha de la cancelacion preescrita
    if (fechaA.diff(fechaC, 'year') < 4 && this.canValue === 'cancPrescrita' && fechaC.diff(fechaA, 'hours') < 0) {
      console.log(`Diferencia en años ${fechaA.diff(fechaC, 'year')}, diferencia en horas ${fechaC.diff(fechaA, 'hours')}`);
      this.formCancelacion.controls['fechaCancelacion'].setErrors({ 'errPre': true });
      this.estadoFecha = true;
    } else {
      this.formCancelacion.controls['fechaCancelacion'].setErrors(null);
      this.estadoFecha = false;
      console.log('Error de pre', this.formCancelacion.controls['fechaCancelacion'].hasError('errPre'));
    }

    // Validacion de fecha no mayor a fecha actual

    if (fechaC.diff(fechaA, 'hours') > 0) {
      this.formCancelacion.controls['fechaCancelacion'].setErrors({ 'matDatepickerMax': true });
      this.estadoFecha = true;
    }

    console.log('Errores en el formulario', this.formCancelacion.controls['fechaCancelacion']);
  }

  getValidFechaC(fechaC): void {
    const fechaA = moment();
    if (fechaC.diff(fechaA, 'days') > 0) {
      this.estadoFechaCan = true;
      console.log('Estdo de la fecha de cancelacion', this.estadoFechaCan);
    } else {
      this.estadoFechaCan = false;
      console.log('Estdo de la fecha de cancelacion', this.estadoFechaCan);
    }
  }

}
