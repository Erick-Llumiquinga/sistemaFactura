import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import { HttpClient } from  '@angular/common/http';
import { environment } from '../../environments/environment';
import 'jspdf-autotable';
  

@Component({
  selector: 'pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss']
})
export class PdfComponent implements OnInit {

  idFactura = localStorage.getItem("id")
  docPDF: jsPDF;
  altoTotal: number;
  anchoTotal: number;
  y: number;
  margenInf: number;
  margenDer: number;
  x: number;
  altoParrafo: number;
  textSize: number;
  interlineado: number;
  anchoUso: number;
  altoUso: number;  
  textoArray: string[];     
  idFacturaVariable: any
  cliente: any;
  material: any;
  precioMaterial
  cantidad: any;
  tabla: autoTable;

  constructor(private http:HttpClient) { }

  ngOnInit() {
    this. traerDatos();
    this.altoTotal = 290;
    this.anchoTotal = 210;
    this.y = 25;
    this.margenInf = 25;
    this.margenDer = 25;
    this.x = 25;
    this.textSize = 18;
    this.interlineado = 1;
    this.anchoUso = this.anchoTotal - this.x - this.margenDer;
    this.altoUso = this.altoTotal - this.y - this.x;
  }

  traerDatos = () =>{
    let idCliente 
    let idMaterial
    this.http.get<any>(environment.API_URL + `?tabla=factura`)
    .subscribe(data => {
      idCliente = data.datos[0].idcliente

      let tabla = 'cliente'
      this.http.get<any>(environment.API_URL + `byid?tabla=${tabla}&&id=${idCliente}`)
      .subscribe( data => {
        this.cliente = data.datos[0]
      })
    })

    this.http.get<any>(environment.API_URL + `FacturasAPI?idfactura=${this.idFactura}`)
    .subscribe(data => {
      idMaterial = data.datos[0].idmaterial
      this.cantidad = data.datos[0].cantidad

      let tablaMa = 'material'
      this.http.get<any>(environment.API_URL + `byid?tabla=${tablaMa}&&id=${idMaterial}`)
      .subscribe( data => {
        this.material = data.datos[0]
      })
    })
  }

  plantilla = (doc:jsPDF,empresa:string,ruc:string,slogan:string,urlLogo: string, direccion: string,telefono: string, mail:string)=>{
    // Emcabezado
    //let imgMarca = new Image();
   // imgMarca.src = '../../../../assets/img/miniBack.jpg'
    
    let logo = new Image();
    logo.src = urlLogo;
    //doc.addImage(logo,15,10,40,20)
    doc.setFontSize(18);
    doc.setFontType('bold')
    this.y = 10
    let dim = doc.getTextDimensions(empresa)
    let xCenter = (220 - dim.w)/2;
    this.altoParrafo = Math.ceil(dim.h)+(this.textSize * 0.3515) * this.interlineado
    doc.text(empresa,xCenter, this.y)
    this.y += this.altoParrafo;
    xCenter = (240 - dim.w)/2;
    this.textSize = 10
    doc.setFontSize(this.textSize);
    doc.setFontType('normal');
    dim = doc.getTextDimensions(ruc)
    this.altoParrafo = Math.ceil(dim.h)+(this.textSize * 0.3515) * this.interlineado
    doc.text(ruc,xCenter,this.y)
    this.y += this.altoParrafo
    dim = doc.getTextDimensions(slogan)
    xCenter = (220 - dim.w)/2;
    this.altoParrafo = Math.ceil(dim.h)+(this.textSize * 0.3515) * this.interlineado
    doc.text(slogan,xCenter,this.y)
    this.y += this.altoParrafo

    // Marca de Agua
    //imgMarca.style.opacity = '0.5';
    //doc.addImage(imgMarca,30,95)

    //Pie de pagina
    this.y = 270
    xCenter = 160
    dim = doc.getTextDimensions(direccion)
    this.altoParrafo = Math.ceil(dim.h)+(this.textSize * 0.3515) * this.interlineado
    doc.text(direccion,xCenter,this.y)
    this.y += this.altoParrafo
    dim = doc.getTextDimensions(telefono)
    this.altoParrafo = Math.ceil(dim.h)+(this.textSize * 0.3515) * this.interlineado
    doc.text(telefono,xCenter,this.y)
    this.y += this.altoParrafo
    dim = doc.getTextDimensions(mail)
    this.altoParrafo = Math.ceil(dim.h)+(this.textSize * 0.3515) * this.interlineado
    doc.text(mail,xCenter,this.y)
    this.y += this.altoParrafo
    
  }

  factura = () => {
    this.docPDF = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      putOnlyUseFonts: true
    })

    this.plantilla(
      this.docPDF,
      'THC Corporation',
      '1750057729001',
      '¡Los limites existen en tu mente!',
      '../../assets/img/icon.png',
      'Av. Amazonas y Republica',
      '0979328888',
      'thcCorportaion@thc.com');


    var headers = this.crear(["Nº", "Producto", "precio", "cantidad","total"]);
    this.y = 50;
    this.docPDF.setFontSize(12);
    this.docPDF.setFontType('bold')
    this.docPDF.text('Nombre:',this.x,this.y)
    this.x += 25;
    this.docPDF.setFontType('normal'); 
    this.docPDF.text(`${this.cliente.nombre} ${this.cliente.apellido}`,this.x,this.y);
    this.x += 40;
    this.docPDF.setFontType('bold')
    this.docPDF.text('Cedula:',this.x,this.y)
    this.x += 20;
    this.docPDF.setFontType('normal'); 
    this.docPDF.text(`${this.cliente.identificacion}`,this.x,this.y);
    this.y += 10;
    this.x = 25;
    this.docPDF.setFontType('bold')
    this.docPDF.text('Direccion:',this.x,this.y)
    this.x += 25;
    this.docPDF.setFontType('normal'); 
    this.docPDF.text(`${this.cliente.direccion}`,this.x,this.y);
    this.x = 25;
    this.y += 10;
    this.docPDF.setFontType('bold')
    this.docPDF.text('Telefono:',this.x,this.y)
    this.x += 25;
    this.docPDF.setFontType('normal'); 
    this.docPDF.text(`0987654321`,this.x,this.y);
    this.x = 25;
    this.y += 10;
      /*this.docPDF.autoTable({
        this.x,
        this.y,
        head: headers,
        body: this.generardata(1)
      })*/


    this.docPDF.table(this.x,this.y,this.generardata(3), headers,{ autoSize: true});
    this.docPDF.save('Factura')
  }

  crear(llave){
    var result = [];
    for (var i = 0; i < llave.length; i += 1) {
        result.push({
        'id' : llave[i],
            'name': llave[i],
            'prompt': llave[i],
        });
    }
    return result;
  }


generardata(n){
  var result=[];
  var data={
    Nº: "1",
    Producto: this.material.nombre,
    precio: this.material.precio,
    cantidad: this.material.precio,
    total: "20485861asd",
  };
  for(var i=0;i<n;i++){
    result.push(Object.assign({}, data));
    data.Nº = (i + 1).toString();
  }
  return result;
}

}
