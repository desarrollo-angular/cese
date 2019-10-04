import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

/**
 * Valida que el valor de cada control "select" de un FormGroup
 * sea valido (value mayor o igual a 0), tomando en cuenta que el "value"
 * del control contiene la estructura {value: number, viewValue: string}
 */
export class ValidadorSelect{
    static ValidarSelect(control: AbstractControl) {
        Object.keys(control.value).forEach(
            field => {
                const miControl = control.get(field);
                if (miControl.enabled && miControl.value != null && miControl.value.value < 0) {
                    miControl.setErrors( {seleccionValida: true} );
                }else{
                    return null;
                }
            }
        );
    }
 }