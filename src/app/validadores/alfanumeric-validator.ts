import { FormControl } from '@angular/forms';

/**
 * Valida que el texto del control sea alfanuemrico, tomando en cuenta algunos caracteres extra.
 * El texto debe tener al menos 1 caracter alfabetico.
 * Extras: (.), (&), (/), (-), (,), (_)
 */
export class alfanumericValidator{
    static validateFormat(control: FormControl){
        var texto = control.value;
        var datePattern1 = /^\S*[0-3]?[0-9]\/[0-3]?[0-9]\/(?:[0-9]{2})?[0-9]{2}\S*$/;
        var datePattern2 = /^\S*[0-3]?[0-9]-[0-3]?[0-9]-(?:[0-9]{2})?[0-9]{2}\S*$/;
        var alfanumeric = /^([\.&\/\-,_0-9a-z]*[a-z]+[\.&\/\-,_0-9]*)?$/i;
        var res = datePattern1.test(texto) || datePattern2.test(texto);
        var alfa = alfanumeric.test(texto);
        if(!alfa){
            return {Alfanumerico: true}
        }else{
            if(res){
                return {FormatoFecha: true}
            }else
                return null;
        }
    }
}