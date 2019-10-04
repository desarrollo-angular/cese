import { Component, OnInit } from '@angular/core';
import { Servicios } from 'app/servicios/servicios.service';
import { FormGroup, FormControl } from '@angular/forms';
import { OPCIONES, CONTRIBUYENTE } from 'app/interfaces/interfaces-cese';

declare var $;

@Component({
  selector: 'app-cese',
  templateUrl: './cese.component.html',
  styleUrls: ['./cese.component.scss']
})
export class CeseComponent implements OnInit {

  title = 'CESE';
  tipoPersona: Number;
  opciones: Array<OPCIONES> = [
    {'cod': 'fusionAbsorcion', 'value': 'Cese por fusión o absorción'},
    {'cod': 'cancTotal', 'value': 'Cese por cancelación total '}
  ];

  tiposCese: FormGroup;
  persona: string;
  cese = 'fusionAbsorcion';
  estatus: boolean;
  contribuyente: CONTRIBUYENTE;
  editable = true;

  constructor(private service: Servicios) {
    this.tiposCese = new FormGroup({
      opcion: new FormControl('')
    });
   }

  ngOnInit() {
    // this.service.obtenerNIT();
    this.getContribuyente(this.service.obtenerNIT());
  }

  getCese(valor: string) {
    this.cese = valor;
  }

  onSubmit() {
    console.log(this.tiposCese.value);
  }

  getContribuyente(nit: string) {
    this.service.getData(`${this.service.URL_CONTRIBUYENTE}/codtipo`, null, nit, false)
      .subscribe(res => {
        this.persona = (res === 0) ? 'Persona Individual' : 'Empresa/Organización';
        this.tipoPersona = res as Number;
        this.estatus = true;
        this.contribuyente = { nit, persona: this.persona };
        console.log(this.tipoPersona);
      }, error => {
        this.persona = '';
        this.estatus = false;
        console.error('No se pudo obtener el tipo de persona', error);
      });
  }

  obtenerNit() {
    this.getContribuyente(this.service.obtenerNIT());
  }

}
