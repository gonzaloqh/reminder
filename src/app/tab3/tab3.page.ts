import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  data = {
    miembros : [
      {
        nombre: "Gonzalo",
        pendiente: 0,
        gastos: [
          {
            nombre: "Comida1",
            tipo: "P",
            monto: 5
          },
          {
            nombre: "Comida22",
            tipo: "P",
            monto: 10
          },
          {
            nombre: "taxi",
            tipo: "C",
            monto: 3
          },
          {
            nombre: "taxi",
            tipo: "C",
            monto: 2
          },
        ],
        pagos: []
      },
      {
        nombre: "Delia",
        pendiente: 0,
        gastos: [
          {
            nombre: "Comida1",
            tipo: "P",
            monto: 40
          },
          {
            nombre: "Comida22",
            tipo: "P",
            monto: 30
          },
          {
            nombre: "taxi",
            tipo: "C",
            monto: 3
          },
          {
            nombre: "taxi",
            tipo: "C",
            monto: 2
          },
        ],
        pagos: [
          {
            monto: 150
          },
        ]
      },
      {
        nombre: "Eleana",
        pendiente: 0,
        gastos: [
          {
            nombre: "Comida1",
            tipo: "P",
            monto: 25
          },
          {
            nombre: "Comida22",
            tipo: "P",
            monto: 45
          },
          {
            nombre: "taxi",
            tipo: "C",
            monto: 3
          },
          {
            nombre: "taxi",
            tipo: "C",
            monto: 2
          },
        ],
        pagos: [
          {
            monto: 20
          },
        ]
      }
    ]
  };

  constructor(private alertController: AlertController) {}

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

  addCobro(miembro: string){
    alert(miembro);
  }

  calcular(){
    if (this.obtenerTotal() != this.obtenerPagos()) {
      alert("El monto Total S/." + this.obtenerTotal() + " no coincide con los pagos realizados S/." + 
      this.obtenerPagos());
      return;
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
