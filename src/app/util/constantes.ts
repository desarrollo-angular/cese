/*
 * Superintendencia de Administracion Tributaria (SAT)
 * Gerencia de Informatica
 * Departamento de Desarrollo de Sistemas
 */


/**
* Clase de constantes del sistema las cuales se deben cambiar en base al ambiente 
* de despliegue de la aplicación
* 
* @author Ana Ruano (aalruanoe)
* @since 16/01/2019
* @version 1.0
*/
export class Constantes {

    /**
     * se debe colocar como comentario a la par el valor de la constante por ambiente si la misma 
     * cambia en cada ambiente 
     */

    //Constantes Catalogos

    CODIGO_CAT_REGIMEN_IVA = '29';
    CODIGO_CAT_TIPO_CONTRIBUYENTE_IMPUESTOS = '30';
    CODIGO_CAT_AFILIACION_ISO_FORMA_CALCULO = '37';
    CODIGO_CAT_TIPO_PERSONERIA = '13';
    CODIGO_CAT_TIPO_RENTA = '34';
    CODIGO_CAT_TIPO_RENTA_EMP = '35';
    CODIGO_CAT_SISTEMA_INVENTARIO = '38';
    CODIGO_CAT_SISTEMA_CONTABLE = '39';
    CODIGO_CAT_SECTOR_ISR = "40";
    CODIGO_CAT_RENTA_IMPONIBLE_ISR = "41";
    CODIGO_CAT_TIPO_DOC_CONSTITUCION = '19';//'18'
    CODIGO_CAT_SECTOR_ECONOMICO = '15';//'19'
    CODIGO_CAT_TIPO_REPRESENTANTE_LEGAL = '24';
    CODIGO_CAT_TIPO_PRESTACION_SERVICIO = '23';
    CODIGO_CAT_REGISTROS_EXTERNOS = '21';
    CODIGO_CAT_TIPO_ESTABLECIMIENTO = "26"; // Catálogo Padre Tipo Establecimiento amoecheve.
    CODIGO_CAT_DATO_TIPO_ESTABLECIMIENTO = "27"; // Catálogo Dato Hijo Tipo Establecimiento amoecheve.
    CODIGO_CAT_TIPO_ESTABLECIMIENTO_AFECTO = "885"; // Catálogo Tipo Establecimiento Afecto.
    CODIGO_CAT_TIPO_ESTABLECIMIENTO_EXENTO_CONSTITUCIONAL = "887"; // Catálogo Tipo Establecimiento Exento.
    CODIGO_CAT_CLASIFICACION_ESTABLECIMIENTO_AFECTO = "873"; // Catálogo clasificación establecimiento afecto.
    CODIGO_CAT_CLASIFICACION_ESTABLECIMIENTO_EXENTO = "874"; // Catálogo clasificación establecimiento exento.
    CODIGO_CAT_CLASIFICACION_ESTABLECIMIENTO = "22";
    // Catálogo Tipo Aviso
    CODIGO_CAT_TIPO_AVISO = "43";
    CODIGO_CAT_TIPO_DIRECCIONES = '16';
    CODIGO_CAT_OTROS_MEDIOS = '18';
    CODIGO_CAT_DEPARTAMENTOS = '2';
    CODIGO_CAT_ZONAS = '7';
    CODIGO_CAT_GRUPOS_HABITACIONALES = '8';
    CODIGO_CAT_VIALIDADES = '9';
    CODIGO_CAT_VALORES_EXCLUYENTES = '28';
    CODIGO_CAT_CODIGO_POSTAL = '46';
    CODIGO_CAT_BANCOS_ENTIDADES_FIDUCIARIAS = '47';
    CODIGO_CAT_PAISES = '10';
    

    CODIGO_CAT_TIPO_CONTRIBUYENTE = '31';
    CODIGO_CAT_REQUISITO_CONTRIBUYENTE = '48';
    CODIGO_CAT_CAMARAS_EMPRESARIALES = '49';
    CODIGO_CAT_GREMIALES = '50';

    //Constantes condiciones especiales     
    CODIGO_CONESPDATO_AFECTO_EXENTO = '2';
    CODIGO_CONESPDATO_FORMULARIOS = '3';
    CODIGO_CONESPDATO_INDICADOR_OBLIGACION_ISR = '10';//'103';
    CODIGO_CONESPDATO_FORMA_CALCULO_ISR = '9';//'101';
    CODIGO_CONESPDATO_FRECUENCIA_PAGO_ISR = '8';//'100';
    CODIGO_CONESPDATO_CODIGO_POSTAL_MUNICIPIO = '4';
    CODIGO_CONESPDATO_REGISTRO_EXTERNO = '5';

    //constantes variables     
    TIPO_REPRESENTANTE = '11';//'10';
    TIPO_PRESTACION_SERVICIO_ISR = '863';//'73';
    TIPO_PRESTACION_SERVICIO_IVA = '864';//'105';
    TIPO_CIIU_ISRA = '0004.40';
    TIPO_CIIU_ISRB = '0004.41';

    //Constantes para tipos de documentos de identificación
    CODIGO_DOCUMENTO_AGUA_LUZ_TELEFONO = '923';
    CODIGO_DOCUMENTO_REPRESENTACION_LEGAL = '881';
}