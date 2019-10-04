import { Component, Inject, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator } from "@angular/material";
import { CatDato } from "app/interfaces/ubicacion/catDato.interface";
import { SelectionModel } from "@angular/cdk/collections";

@Component({
    selector: 'app-dialogo-requisitos',
    templateUrl: 'dialogo-requisitos.html',
})
export class DialogoRequisitosComponent {
    listaRequisitos: Array<CatDato> = [];
    //tabla de requisitos
    initialSelection = [];
    allowMultiSelect = false
    displayedColumns: string[] = ["requisito", "nacionalidad"];
    //Array<CatDato>
    dataSource = new MatTableDataSource<CatDato>(this.listaRequisitos);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    //variable para la seccion de la tabla
    selectionRequisito = new SelectionModel<CatDato>(
        this.allowMultiSelect,
        this.initialSelection
    );
  

    constructor(
        public dialogRef: MatDialogRef<DialogoRequisitosComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Array<CatDato>) {
        console.log("lista de requisitos a mostrar " + JSON.stringify(data));
        this.listaRequisitos=data;
        this.dataSource = new MatTableDataSource<CatDato>(
            data
          );
          this.dataSource.paginator = this.paginator;
      
    
    }

    btnRegresar(): void {
    console.log("boton regresar")
        this.dialogRef.close();

    }
}