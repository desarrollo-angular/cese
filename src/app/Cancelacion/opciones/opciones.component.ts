import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { Servicios } from 'app/servicios/servicios.service';
import { MatStepper } from '@angular/material';

@Component({
  selector: 'app-opciones',
  templateUrl: './opciones.component.html',
  styleUrls: ['./opciones.component.scss', '../../../styles.css']
})
export class OpcionesComponent implements OnInit {

  @Output() salida: EventEmitter<any> = new EventEmitter();
  @Output() formOpciones: EventEmitter<any> = new EventEmitter();

  opciones: FormGroup;
  cancelacion: FormGroup;
  title: String = 'Tipo de Cancelación';
  titleSelection: String = 'Selecciona la cancelación';

  cancelaciones: Cancelacion[] = [

    { value : 'cancDefinitiva', viewValue : 'Cancelación Definitiva' },
    { value : 'cancPrescrita', viewValue : 'Cancelación Prescrita' },
    { value : 'cancTemporal', viewValue : 'Cancelación Temporal' }

  ];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.opciones = this.formBuilder.group({
      opcion: ['', Validators.required]
    });

    this.formOpciones.emit(this.opciones);
  }

  mostrar(valor: String) {

    this.salida.emit(valor);
    this.formOpciones.emit(this.opciones);

  }
}

export interface Cancelacion {

  value: String;
  viewValue: String;

}
