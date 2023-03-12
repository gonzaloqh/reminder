import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})


export class Tab3Page {

  data : Data = {
    miembros : []
  };

  constructor(private alertController: AlertController) {}

  restaurarCalculo(){
    this.data.miembros.forEach(miembro => {
      miembro.pendiente = 0;
    });
  }

  eliminar(miembro: string, nombre: string, tipo: string, monto : number){
    for (var i = 0; i < this.data.miembros.length; i++) {      
      if(miembro == this.data.miembros[i].nombre) {
        //ELiminamos gasto
        if (nombre.length > 0 || tipo.length > 0) {
          this.data.miembros[i].gastos = this.data.miembros[i].gastos.filter(item => !(item.nombre == nombre && item.tipo == tipo && item.monto == monto));
          return;
        }        
        //Eliminamos cobro
        this.data.miembros[i].pagos = this.data.miembros[i].pagos.filter(item => item.monto !== monto);
      }
    }  
    this.restaurarCalculo();  
  }

  agregarMontoComun(nombrestr: string, monto: number){
    let n : number = this.data.miembros.length;
    this.data.miembros.forEach(miembro => {
      miembro.gastos.push(
        {
          nombre: nombrestr,
          tipo: "C",
          monto: monto/n
        }
      );
    });
  }

  async addCommon(){
    const alertInput = await this.alertController.create({
      header: 'Complete los datos',
      buttons: [
        {
          text: 'Aceptar',
          role: 'confirm',
          handler: (dada) => {
            if(dada[0].trim().length > 0 && Number(dada[1]) > 0){
              this.agregarMontoComun(dada[0].trim(), Number(dada[1]));
            }            
          },
        },
        {
          text: 'Cancelar',
          role: 'cancel',
        }
      ],
      inputs: [
        {
          placeholder: 'Nombre',
          type: 'text'
        },
        {
          type: 'number',
          placeholder: 'Monto',
          min: 1,          
        },
      ],
    });  
    await alertInput.present();  
  }

  async addMember(){
    const alertInput = await this.alertController.create({
      header: 'Ingrese el nombre',
      buttons: [
        {
          text: 'Aceptar',
          role: 'confirm',
          handler: (dada) => {
            if(dada[0].trim().length > 0){
              this.data.miembros.push(
                {
                  nombre: dada[0],
                  pendiente: 0,
                  gastos: [],
                  pagos: []
                }
              );
            }
            this.restaurarCalculo();
          },
        },
        {
          text: 'Cancelar',
          role: 'cancel',
        }
      ],
      inputs: [
        {
          type: 'text'
        }
      ],
    });  
    await alertInput.present();
  }

  agregarGastoPersonal(miembro:string, nombrestr: string, monto: number){
    let n : number = this.data.miembros.length;
    for (var i = 0; i < n; i++) {
      if(this.data.miembros[i].nombre === miembro){
        this.data.miembros[i].gastos.push(
          {
            nombre: nombrestr,
            tipo: "P",
            monto: monto
          }
        );
      }
    }
    this.restaurarCalculo();
  }

  agregarCobroPersonal(miembro:string, monto: number){
    let n : number = this.data.miembros.length;
    for (var i = 0; i < n; i++) {
      if(this.data.miembros[i].nombre === miembro){
        this.data.miembros[i].pagos.push(
          {
            monto: monto
          }
        );
      }
    }
    this.restaurarCalculo();
  }

  async addGasto(miembro: string){
    const alertInput = await this.alertController.create({
      header: 'Complete los datos',
      buttons: [
        {
          text: 'Aceptar',
          role: 'confirm',
          handler: (dada) => {
            if(dada[0].trim().length > 0 && Number(dada[1]) > 0){
              this.agregarGastoPersonal(miembro,dada[0].trim(), Number(dada[1]));
            }            
          },
        },
        {
          text: 'Cancelar',
          role: 'cancel',
        }
      ],
      inputs: [
        {
          placeholder: 'Nombre',
          type: 'text'
        },
        {
          type: 'number',
          placeholder: 'Monto',
          min: 1,          
        },
      ],
    });  
    await alertInput.present();  
  }

  async addCobro(miembro: string){
    const alertInput = await this.alertController.create({
      header: 'Complete los datos',
      buttons: [
        {
          text: 'Aceptar',
          role: 'confirm',
          handler: (dada) => {
            if(Number(dada[0]) > 0){
              this.agregarCobroPersonal(miembro, Number(dada[0]) - Number(dada[1]));
            }            
          },
        },
        {
          text: 'Cancelar',
          role: 'cancel',
        }
      ],
      inputs: [
        {
          type: 'number',
          placeholder: 'Monto',
          min: 1,          
        },
        {
          type: 'number',
          placeholder: 'Vuelto',
          min: 0,          
        },
      ],
    });  
    await alertInput.present();  
  }

  calcular(){
    if (this.obtenerTotal() != this.obtenerPagos()) {
      alert("El monto Total S/." + this.obtenerTotal() + " no coincide con los pagos realizados S/." + 
      this.obtenerPagos());
    }
    let total : number = 0;
    let pagos : number = 0;
    this.data.miembros.forEach(miembro => {
      if(miembro.gastos.length > 0){
        total = miembro.gastos.map(gasto => gasto.monto).reduce((acc, amount) => acc + amount);
      }
      if(miembro.pagos.length > 0){        
        pagos = miembro.pagos.map(pago => pago.monto).reduce((acc, amount) => acc + amount);
      }
      miembro.pendiente = pagos-total;
    });
  }

  obtenerTotal() : Number {
    let total : number = 0.0;
    this.data.miembros.forEach(miembro => {
      miembro.gastos.forEach(gasto => {
        total = total + gasto.monto
      })
    });
    return total;
  }

  obtenerPagos() : Number {
    let pagos : number = 0.0;
    this.data.miembros.forEach(miembro => {
      miembro.pagos.forEach(pago => {
        pagos = pagos + pago.monto
      })
    });
    return pagos;
  }
}



export class Data  { 
  public miembros: Miembro[] = [];
}

export class Miembro  { 
  public nombre: string = "";
  public pendiente: number = 0;
  public gastos: Gasto[] = [];
  public pagos: Pago[] = [];  
} 

export class Gasto  { 
  public nombre: string = "";
  public tipo: string = "";
  public monto: number = 0;
} 

export class Pago  {
  public monto: number = 0;
} 
