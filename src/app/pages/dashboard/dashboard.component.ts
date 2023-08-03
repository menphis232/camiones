import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../../components/modal/modal.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
declare const mapboxgl: any;
import { Device} from '@capacitor/device';
interface NavigatorWithGetDeviceId extends Navigator {
  getDeviceId?: () => Promise<{ imei: string }[]>;
}

import { Plugins } from '@capacitor/core';

// const { Device } = Plugins;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit  {
  locationEnabled: any = true;
  initJournal: FormGroup;
  step:number = 0;
  finish:boolean = false;
  latitude:number=0
  longitude:number=0;
  trucks:any
  routes:any
  actualRoute:any=''
  jornadaNueva:any
  selectedTruck:any
  map:any
  zonas:any[] = [];
  alMenosUnCheckMarcado: boolean = false; // Variable para indicar si se ha seleccionado al menos uno
  platform: any;
  imei:any
serial: any;
informacionChofer:any
totalRuta:any
  constructor(private dashboardService:DashboardService, private snackBar: MatSnackBar,private dialog: MatDialog,  private formBuilder: FormBuilder){

    this.initJournal = this.formBuilder.group({
      iddrive: ['', Validators.required],
      idtruck: ['', Validators.required],
      idpath: ['', Validators.required],
      dateStart: [''],
      lts: ['']
    });
    
  } 

   ngOnInit() {
    const logDeviceInfo = async () => {
      const info = await Device.getInfo();
    
      return info
    };

this.getSerial()

  }

    async getSerial() {
    const info = await Device.getId();
    this.serial = info;
    console.log('esto',this.serial.identifier)


    this.obtenerDatos(this.serial.identifier)
  }

 obtenerDatos(serial:any){

  this.dashboardService.getdata(serial).subscribe(response => {
      // Manejar la respuesta del servidor aquí
      console.log('respuesta',response)

      this.informacionChofer=JSON.parse(JSON.stringify(response)).data.name;
      const token = JSON.parse(JSON.stringify(response)).data.token;
      const user = JSON.parse(JSON.stringify(response)).data;
          // localStorage.setItem('token', token);
     localStorage.setItem('user', JSON.stringify(user));
     localStorage.setItem('token', token);

     this.getRoutes()

   
  
    });

 }
  




  

  getRoutes() {
    this.dashboardService.getDayBydrive().subscribe(response => {
      // Manejar la respuesta del servidor aquí
      console.log('respuesta',response)

      this.routes=JSON.parse(JSON.stringify(response)).data.rows
      this.totalRuta=JSON.parse(JSON.stringify(response)).data
  
    });
  
  
  }


  openModal(mensaje:any,type:any): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '250px',
      data:{value:mensaje,type:type}
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('Modal cerrado');

      const objetoGuardadoString = localStorage.getItem('actualRoute');
      const objetoGuardado = objetoGuardadoString ? JSON.parse(objetoGuardadoString) : null;
      this.actualRoute=objetoGuardado;
    });
  }

  selectTruck(evt:any){
    console.log(evt)
    this.initJournal.controls['idtruck'].setValue(evt.id)
    this.initJournal.controls['lts'].setValue(evt.lts)
    localStorage.removeItem('Truck')
    localStorage.setItem('Truck',JSON.stringify(evt))
  }


  cambiarPaso(valor:any){
    this.step=valor
    console.log('este [paso',this.step)

 
  }

  endDay(id:any){

    let finish={
      dateEnd:moment().format('YYYY-MM-DD')
    }

    this.dashboardService.endDay(id,finish).subscribe(response => {
      // Manejar la respuesta del servidor aquí
      this.openModal('Despachado correctamente','success')

      this.getRoutes()

  
    });

   
  }

  verificarSeleccion() {
    console.log('esta es la zona2',this.zonas)
    this.alMenosUnCheckMarcado = this.zonas.some((item:any) => item.checked === true);
    if (!this.alMenosUnCheckMarcado) {
      this.openModal('Debe marcar las zonas visitadas para poder finalizar la jornada','error')
      return;
    }
  }

}



