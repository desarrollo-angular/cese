

export class ArchivoItem {

    public archivo: File;
    public nombreArchivo: string;
    public url: string| ArrayBuffer | null;
    public estaSubiendo: boolean;
    public progreso: number;

    constructor( archivo: File ) {

        this.archivo = archivo;
        this.nombreArchivo = archivo.name;
        this.estaSubiendo = false;
        this.progreso = 0;
        let urlArchivo: string | ArrayBuffer;
        let reader = new FileReader();
        reader.readAsDataURL(archivo);
        reader.onload= ()=>{
            urlArchivo=reader.result;  
            this.url=reader.result;              
        }
      
        this.url=urlArchivo;
    }

    

}
