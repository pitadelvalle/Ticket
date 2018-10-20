var pdf= require('pdfkit');
var fs=require('fs');

var myDoc = new pdf;
//crecion de ticket
myDoc.pipe(fs.createWriteStream('evento.pdf'));


myDoc.image('public/logo.png', 0, 15,width=300)
     .text('Consultorio Best Health', 150, 150)
myDoc.font('Times-Roman')
     .fontSize(24)
     .text('Atencion de calidad porque usted la merece',100,100);
     myDoc.end();