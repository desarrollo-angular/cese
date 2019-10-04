export interface IVehiculo {
    idUso: Number;
    prefijoPlaca: string;
}

export interface IFormulario {
    codigoFormulario: Number;
    numeroVersion: string;
    numeroCasilla: Number[];
}

export const DVEHICULOS = [
    {
        'idUso': 2,
        'prefijoPlaca': 'C0'
     },
     {
        'idUso': 3,
        'prefijoPlaca': 'TC'
     },
     {
        'idUso': 9,
        'prefijoPlaca': 'A0'
     },
     {
        'idUso': 5,
        'prefijoPlaca': 'U0'
     },
     {
        'idUso': 6,
        'prefijoPlaca': 'TRC'
     },
     {
        'idUso': 15,
        'prefijoPlaca': 'TE'
     },
     {
        'idUso': 14,
        'prefijoPlaca': 'DIS'
     }
]

export const DFORMULARIOS = [
    {
        'codigoFormulario': 223,
        'numeroVersion': '1',
        'numeroCasilla': [5, 6, 7, 8, 9, 11, 13]
      },
      {
        'codigoFormulario': 223,
        'numeroVersion': '2',
        'numeroCasilla': [5, 6, 7, 8, 9, 11, 13]
      },
      {
        'codigoFormulario': 223,
        'numeroVersion': '9',
        'numeroCasilla': [6, 7, 8, 9, 10, 12, 14]
      },
       {
        'codigoFormulario': 223,
        'numeroVersion': '8',
        'numeroCasilla': [6, 7, 8, 9, 10, 12, 14]
      },
       {
        'codigoFormulario': 223,
        'numeroVersion': '7',
        'numeroCasilla': [7, 8, 9, 10, 11, 13, 15, 19, 20, 21, 22, 23]
      },
       {
        'codigoFormulario': 215,
        'numeroVersion': '1',
        'numeroCasilla': [5, 8, 10, 11, 13, 16, 18, 6, 7, 9, 12, 15]
      },
       {
        'codigoFormulario': 215,
        'numeroVersion': '9',
        'numeroCasilla': [6, 9, 11, 12, 14, 17, 19, 7, 8, 10, 13, 16]
      },
       {
        'codigoFormulario': 215,
        'numeroVersion': '7',
        'numeroCasilla': [6, 9, 11, 12, 14, 17, 19, 7, 8, 10, 15, 16]
      },
       {
        'codigoFormulario': 204,
        'numeroVersion': '3',
        'numeroCasilla': [5]
      },
       {
        'codigoFormulario': 204,
        'numeroVersion': '6',
        'numeroCasilla': [6]
      },
       {
        'codigoFormulario': 204,
        'numeroVersion': '7',
        'numeroCasilla': [6]
      }
];

export const DECLA_POSTERIORES = {
  'formulario': [
    {
      'codigoFormulario': 223,
      'numeroVersion': '1',
      'numeroCasilla': [5,6,7,8,9,11,13]
    },
    {
      'codigoFormulario': 223,
      'numeroVersion': '2',
      'numeroCasilla': [5,6,7,8,9,11,13]
    },
    {
      'codigoFormulario': 223,
      'numeroVersion': '9',
      'numeroCasilla': [6,7,8,9,10,12,14]
    },
     {
      'codigoFormulario': 223,
      'numeroVersion': '8',
      'numeroCasilla': [6,7,8,9,10,12,14]
    },
     {
      'codigoFormulario': 223,
      'numeroVersion': '7',
      'numeroCasilla': [7,8,9,10,11,13,15,19,20,21,22,23]
    },
     {
      'codigoFormulario': 215,
      'numeroVersion': '1',
      'numeroCasilla': [5,8,10,11,13,16,18,6,7,9,12,15]
    }
    ,
     {
      'codigoFormulario': 215,
      'numeroVersion': '9',
      'numeroCasilla': [6,9,11,12,14,17,19,7,8,10,13,16]
    }
    ,
     {
      'codigoFormulario': 215,
      'numeroVersion': '7',
      'numeroCasilla': [6,9,11,12,14,17,19,7,8,10,15,16]
    },
     {
      'codigoFormulario': 204,
      'numeroVersion': '3',
      'numeroCasilla': [5]
    }
    ,
     {
      'codigoFormulario': 204,
      'numeroVersion': '6',
      'numeroCasilla': [6]
    },
     {
      'codigoFormulario': 204,
      'numeroVersion': '7',
      'numeroCasilla': [6]
    }
  ]
};

export const RETENCIONES = {
  'nit': '29728983',
  'periodoDe': '01/01/2012',
  'periodoHasta': '17/07/2019'
};

export const VEHICULOS_ASOCIADOS = {
  'nit': '4219384',
  'vehiculosEvaluados': [
     {
        'idUso': 2,
        'prefijoPlaca': 'C0'
     },
     {
        'idUso': 3,
        'prefijoPlaca': 'TC'
     },
     {
        'idUso': 9,
        'prefijoPlaca': 'A0'
     },
     {
        'idUso': 5,
        'prefijoPlaca': 'U0'
     },
     {
        'idUso': 6,
        'prefijoPlaca': 'TRC'
     },
     {
        'idUso': 11,
        'prefijoPlaca': 'MC'
     },
     {
        'idUso': 15,
        'prefijoPlaca': 'TE'
     },
     {
        'idUso': 14,
        'prefijoPlaca': 'DIS'
     }
  ]
};
