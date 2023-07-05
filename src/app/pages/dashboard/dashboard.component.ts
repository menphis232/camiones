import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../../components/modal/modal.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
declare const mapboxgl: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit  {

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

  constructor(private dashboardService:DashboardService,private dialog: MatDialog,  private formBuilder: FormBuilder){

    this.initJournal = this.formBuilder.group({
      iddrive: ['', Validators.required],
      idtruck: ['', Validators.required],
      idpath: ['', Validators.required],
      dateStart: [''],
      lts: ['']
    });
    
  } 
  
  ngOnInit(): void {
    const objetoGuardadoStringUser = localStorage.getItem('user');
    const objetoGuardadoUser = objetoGuardadoStringUser ? JSON.parse(objetoGuardadoStringUser) : null;

    this.initJournal.controls['iddrive'].setValue(objetoGuardadoUser.id)
    this.getRoutes()
    this.getTrucks()

    const objetoGuardadoStringJornada = localStorage.getItem('initJournal');
    const objetoGuardadoJornada = objetoGuardadoStringJornada ? JSON.parse(objetoGuardadoStringJornada) : null;
    this.jornadaNueva=objetoGuardadoJornada;


    const objetoGuardadoStringTruck = localStorage.getItem('Truck');
    const objetoGuardadoTruck = objetoGuardadoStringTruck ? JSON.parse(objetoGuardadoStringTruck) : null;
    

    this.selectedTruck=objetoGuardadoTruck
   console.log('email',objetoGuardadoTruck)

    const objetoGuardadoString = localStorage.getItem('actualRoute');
    const objetoGuardado = objetoGuardadoString ? JSON.parse(objetoGuardadoString) : null;
    this.actualRoute=objetoGuardado;
      if(this.actualRoute){
        this.zonepath(this.actualRoute.id)
      }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude=position.coords.latitude
          this.longitude=position.coords.longitude
          console.log('esto es longitude',this.longitude)
          console.log('esto es latitude',this.latitude)
          mapboxgl.accessToken = 'pk.eyJ1IjoibWVucGhpc2oyMyIsImEiOiJjbGpvajZ6dHcxaHM4M2ttdXRtMzFhcjB4In0.k4mx5vdlhUrj0qPNjpl2-g';
        if(this.step==0){
          this.map =  new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [this.longitude,this.latitude],
            zoom: 9
          });
        }
  
        },
        (error) => {
          console.log('Error al obtener la geolocalización:', error);
        }
      );
    } else {
      console.log('Geolocalización no soportada por el navegador');
    }
   
  }

  getRoutes() {
    this.dashboardService.routes().subscribe(response => {
      // Manejar la respuesta del servidor aquí
      console.log('respuesta',response)

      this.routes=JSON.parse(JSON.stringify(response)).data.rows
  
    });
  
  
  }
  getTrucks() {
    this.dashboardService.trucks().subscribe(response => {
      // Manejar la respuesta del servidor aquí
      console.log('respuesta',response)

      this.trucks=JSON.parse(JSON.stringify(response)).data.rows

      console.log('camiones',this.trucks)
  
    });
  }
  zonepath(valor:any) {
      this.dashboardService.zonepath(valor).subscribe(response => {
        // Manejar la respuesta del servidor aquí
        // console.log('respuesta',JSON.parse(JSON.stringify(response)).data.rows.zone)
        this.zonas = JSON.parse(JSON.stringify(response)).data.Zones;

        this.zonas.forEach((res: any) => {
           res.checked = false;
        });

        console.log('esta es la zona',this.zonas)
  
    
      });
  
  
   }

  obtenerGeolocalizacion(): void {
    // console.log('entramos')
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude=position.coords.latitude
          this.longitude=position.coords.longitude
          console.log('Latitud:', position.coords.latitude);
          console.log('Longitud:', position.coords.longitude);
        },
        (error) => {
          console.log('Error al obtener la geolocalización:', error);
        }
      );
    } else {
      console.log('Geolocalización no soportada por el navegador');
    }
  }

  saveActualRoute(item:any){
    if(localStorage.getItem('actualRoute')){
      localStorage.removeItem('actualRoute')
      localStorage.setItem('actualRoute',JSON.stringify(item))
      this.openModal('Ruta agregada correctamente','success')
    }else{
      localStorage.setItem('actualRoute',JSON.stringify(item))
      this.openModal('Ruta agregada correctamente','success')
    }


    
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
  initDay(){

console.log(this.initJournal.value)

if(this.actualRoute){
  this.initJournal.controls['dateStart'].setValue(moment().format('YYYY-MM-DD'))
  this.initJournal.controls['idpath'].setValue(this.actualRoute.id)
}else{
  this.openModal('Seleccione la ruta y el camion para iniciar la jornada','error')
  return
}


    if(this.initJournal.invalid){
      this.openModal('Seleccione la ruta y el camion para iniciar la jornada','error')
      return
    }


    this.dashboardService.createDay(this.initJournal.value).subscribe(response => {
      // Manejar la respuesta del servidor aquí
      this.openModal('Ha iniciado la jornada correctamente','success')
      let responses=JSON.parse(JSON.stringify(response)).data
      localStorage.setItem('initJournal',JSON.stringify(responses))
      const objetoGuardadoStringJornada = localStorage.getItem('initJournal');
      const objetoGuardadoJornada = objetoGuardadoStringJornada ? JSON.parse(objetoGuardadoStringJornada) : null;
      this.jornadaNueva=objetoGuardadoJornada;
  
    });



  }

  cambiarPaso(valor:any){
    this.step=valor
    console.log('este [paso',this.step)

  

    if(this.actualRoute){
      this.zonepath(this.actualRoute.id)
    }
  }

  endDay(){
    this.alMenosUnCheckMarcado = this.zonas.some((item:any) => item.checked === true);
    if (!this.alMenosUnCheckMarcado) {
      this.openModal('Debe marcar las zonas visitadas para poder finalizar la jornada','error')
      return;
    }

    let finish={
      dateEnd:moment().format('YYYY-MM-DD')
    }

    this.dashboardService.endDay(this.jornadaNueva.id,finish).subscribe(response => {
      // Manejar la respuesta del servidor aquí
      this.openModal('Ha terminado la jornada correctamente','success')
   
      localStorage.removeItem('initJournal')
      localStorage.removeItem('actualRoute')
      localStorage.removeItem('Truck')

      this.step=0

      const objetoGuardadoStringJornada = localStorage.getItem('initJournal');
      const objetoGuardadoJornada = objetoGuardadoStringJornada ? JSON.parse(objetoGuardadoStringJornada) : null;
      this.jornadaNueva=objetoGuardadoJornada;
      

  
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



