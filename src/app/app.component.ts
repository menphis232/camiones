import { Component, OnInit } from '@angular/core';
import { Device } from '@capacitor/device';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {
  ngOnInit() {
    // Obtén el IMEI y el serial utilizando los plugins Device y DeviceInfo de Capacitor
    const logDeviceInfo = async () => {
      const info = await Device.getInfo();
    
      console.log('dispositivo',info);
    };
    
  }
}


