import { Injectable } from '@angular/core';
import { Servicios } from './servicios.service';
import { SatContribuyenteNombres } from 'app/interfaces/contribuyentes/SatContribuyentesNombres.interface';
import { SatContribuyenteDatos } from 'app/interfaces/contribuyentes/SatContribuyentes.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class ValidacionesService {

  validacionesNit: VALIDACIONESNIT;
  constructor(private servicio: Servicios) { }

  validarNit(nit: string): any {
    const validacionesNit: VALIDACIONESNIT = { inactiveNit : true};
    return this.servicio.getData(this.servicio.URL_NITS, 'validaciones/estructuras', nit, false)
    .subscribe(res => {
      if (res === false) {
        validacionesNit.inactiveNit = true;
      } else {
        validacionesNit.inactiveNit = false;
        // consulta si el nit existe en RTU
        this.servicio.getData(this.servicio.URL_NITS, 'validaciones/registrados', nit, false)
        .subscribe(result => {
          if (res === false) {
            validacionesNit.nonExistentNit = true;
          } else {
            validacionesNit.nonExistentNit = false;
            // verifica que el nit ingresado es 00 (GENERICO)
            if (nit === '00') {
              validacionesNit.nonGenericNit = true;
            } else {
              validacionesNit.nonGenericNit = false;
              this.servicio.getData(this.servicio.URL_SAT_CONTRIBUYENTES, 'datos', nit, false)
                .subscribe((data: SatContribuyenteDatos) => {
                  if (data !== null && data.fechaFallecimiento !== null) {
                    // existe registro del contribuyente con fecha de fallecimiento
                    validacionesNit.fallecimientoNit = true;
                    console.log(res);
                  } else {
                    validacionesNit.fallecimientoNit = false;
                    // obtiene los datos del contribuyente para validar si cuenta con estado activo
                    this.servicio.getData(this.servicio.URL_SAT_CONTRIBUYENTES, 'nombres', nit, false)
                    .subscribe((contriNombres: SatContribuyenteNombres) => {
                      let datosContribuyente: SatContribuyenteNombres;
                      datosContribuyente = contriNombres;
                      console.log(datosContribuyente);
                      if (datosContribuyente.estado === 1020 || datosContribuyente.estado === 1029) {
                        console.log('activo ');
                        validacionesNit.inactiveNit = false;
                        console.log(datosContribuyente);
                        if (datosContribuyente.razonSocial !== null) {
                          validacionesNit.nombreContribuyente = datosContribuyente.razonSocial;
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
                        validacionesNit.nombreContribuyente =
                              datosContribuyente.primerNombre + ' ' +
                              datosContribuyente.segundoNombre + ' ' +
                              datosContribuyente.tercerNombre + ' ' +
                              datosContribuyente.primerApellido + ' ' +
                              datosContribuyente.segundoApellido;
                      }
                      // this.nombreContribuyente=;
                    } else {
                    console.log('todo todo mal');
                    validacionesNit.inactiveNit = true;
                   }
                });
                }
              });
            }
          }
        });
      }
      return validacionesNit;
    });
    
    // return validacionesNit;
  }

  prueba(nit: string) {
    let objeto = new Promise((resolve, reject) => {
      this.servicio.getData(this.servicio.URL_NITS, 'validaciones/estructuras', nit, false)
      .subscribe(res => {
        objeto = res
      });
      resolve(objeto);
    });
    
    objeto.then(() => console.log('dfsf', objeto)).catch(() => console.error('error'));
  }
}



interface VALIDACIONESNIT {
  invalidNit?: boolean | null,
  nonExistentNit?: boolean | null,
  nonGenericNit?: boolean | null,
  fallecimientoNit?: boolean | null,
  inactiveNit?: boolean | null,
  nombreContribuyente?: string | null
}
