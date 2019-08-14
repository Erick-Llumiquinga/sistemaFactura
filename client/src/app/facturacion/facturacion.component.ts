import { Component, OnInit, ɵSWITCH_TEMPLATE_REF_FACTORY__POST_R3__ } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.scss']
})
export class FacturacionComponent implements OnInit {

  detallefacturaForm: FormGroup
  facturaForm: FormGroup
  table_header: any
  respuestaClientes: any[]
  idcliente: any;
  idmaterial: number;
  precio: any;
  total: number;
  descuento: number;
  cantidad: number;
  carrito: any[] = [];

  constructor(private formBuilder: FormBuilder, private http: HttpClient) { }

  ngOnInit() {
    this.getDataFactura()
    this.getDataClientes()
    this.getDataMateriales()
    this.formularioFactura()
    this.formularioDetalleFactura()
    this.idcliente = 999;
    this.idmaterial = 999;
    this.precio = 0;
    this.table_header = [
      {
        id: 'N°',
        fecha: 'Fecha',
        total:'Total',
        idcliente:'Cliente'
      }
    ]    
  }

  formularioFactura(){
    this.facturaForm = this.formBuilder.group({
      id:[''],
      fecha:[''],
      total:['',[Validators.required]],
      idcliente:['',[Validators.required]]
    })
  }

  formularioDetalleFactura(){
    this.detallefacturaForm = this.formBuilder.group({
      id:[this.idmaterial],
      cantidad:['',[Validators.required]],
      precio:[this.precio,[Validators.required]],
      descuento:['',[Validators.required]],
      idmaterial:['',[Validators.required]],
      idfactura:['',[Validators.required]]
    })
  }

  datosFactura (){
    this.facturaForm.controls['idcliente'].setValue(this.idcliente)
    this.respuestaMateriales.forEach(element =>{
      if(element.id == this.idmaterial){
        this.precio = element.precio
        this.detallefacturaForm.controls['precio'].setValue(this.precio); 
        this.detallefacturaForm.controls['idmaterial'].setValue(this.idmaterial);
      }
     
    })
  }

//PAGINA PRINCIPAL
respuestaFacturas: any[]

getDataFactura = () => {
  let tabla = 'factura'
  this.http.get<any>(environment.API_URL + `?tabla=${tabla}`)
  .subscribe(data => {
    this.respuestaFacturas = data.datos
  })
}

idFacturaVariable: number

getDatabyID = (value) => {
  let tabla = 'factura'
  this.http.get<any>(environment.API_URL + `byid?tabla=${tabla}&&id=${value}`)
  .subscribe( data => {
    this.idFacturaVariable = data.datos[0].id
    localStorage.setItem("id", this.idFacturaVariable.toString() )
  })
}

deleteDataTable = (value) => {
  let tabla = 'factura'
    Swal.fire({
      type: 'warning',
      title: '¿Estas seguro de que deseas eliminar la factura?',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminalo!',
      cancelButtonText: 'No, cancela!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.http.delete(environment.API_URL + `?tabla=${tabla}&&id=${value}`)
        .subscribe( data => { 
          Swal.fire(
            'Eliminado!',
            'La factura se elimino correctamente',
            'success'
          )
          .then(result =>{
            window.location.reload()
          })
          .catch(result =>{
            console.log('no sirves loco mejor matate')
          })
        })
      } 
      else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
  })
}
//PAGINA PRINCIPAL








//MODAL NEW FACTURA
nuevafecha = new Date()
fecha_orden = this.nuevafecha.getDate() + "/" + (this.nuevafecha.getMonth() +1) + "/" + this.nuevafecha.getFullYear()


getDataClientes = () => {
  let tabla = 'cliente'
  this.http.get<any>(environment.API_URL + `?tabla=${tabla}`)
  .subscribe(data => {
    this.respuestaClientes = data.datos
  })
}

//MODAL NEW FACTURA


postDataFactura = () => {


  

  
  window.location.reload()
}








//MODAL DETALLE_FACTURA
respuestaMateriales: any[]

addProducto(){
  this.carrito.push(this.detallefacturaForm.controls)
  /*this.detallefacturaForm.controls['cantidad'].setValue('')
  this.detallefacturaForm.controls['precio'].setValue('')
  this.detallefacturaForm.controls['descuento'].setValue('')
  this.detallefacturaForm.controls['idmaterial'].setValue('')*/
  this.idmaterial = 999;
  console.log(this.carrito)
}

getDataMateriales = () => {
  let tabla = 'material'
  this.http.get<any>(environment.API_URL + `?tabla=${tabla}`)
  .subscribe(data => {
    this.respuestaMateriales = data.datos
  })
}

postDataDetalleFacturas = () => {

  let idcliente = this.facturaForm.get('idcliente').value
  let cantidad = this.detallefacturaForm.get('cantidad').value
  let precio = this.detallefacturaForm.get('precio').value
  let descuento = this.detallefacturaForm.get('descuento').value
  let idmaterial = this.detallefacturaForm.get('idmaterial').value
  let total = 0
  let tabla = 'factura'
  let register = {tabla: tabla, datos: [{fecha: this.fecha_orden, total: total, idcliente: idcliente}]}
  this.http.post<any>(environment.API_URL, register)
  .subscribe( data => {
    let idFactura = data.datos[0];
     console.log(idFactura)

    tabla = 'detalle_factura'
    let register = {tabla: tabla, datos: [{descuento: descuento, cantidad: cantidad, precio: precio, idfactura: idFactura, idmaterial: idmaterial}]}
    this.http.post(environment.API_URL, register)
    .subscribe( data => { 
    console.log(data);
    })
  })

  
 
console.log(JSON.stringify(register))
  //window.location.reload()
}
//MODAL DETALLE_FACTURA
}