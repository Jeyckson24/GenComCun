const express = require('express');
const cors = require('cors');
const { Document, Packer, Paragraph, TextRun, AlignmentType } = require('docx');
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Habilitar CORS
app.use(cors());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'wordcomision'
});

connection.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/buscar-datos', (req, res) => {
    const cedula = req.query.cedula;

    connection.query('SELECT * FROM datos WHERE identificacion = ?', [cedula], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al buscar en la base de datos' });
        }

        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.json(null);
        }
    });
});

app.post('/generate-doc', (req, res) => {
    const { cedula, nombres, apellidos, cargo, dia, mes, ano, destino, motivo, viaticos=null } = req.body;
    
    if (viaticos!=null){

    const doc = new Document({
        sections: [
            {
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({ text: `RESOLUCIÓN No. [CODE]`,font:'Arial', bold: true, size: 22 }),
                            new TextRun({ break: 1 }),
                            new TextRun({ text: `[DATE-L]`,font:'Arial', bold: true, size: 22 }),
                            new TextRun({ break: 1 }),
                            new TextRun({ break: 1 }),
                            new TextRun({ text: `Por la cual se confiere una comisión de servicios`,font:'Arial', bold: true, size: 22 }),
                            new TextRun({ break: 1 }),
                            new TextRun({ break: 1 }),
                            new TextRun({ text: `EL DIRECTOR SECCIONAL DE ADMINISTRACIÓN JUDICIAL DE CUNDINAMARCA - AMAZONAS`,font:'Arial', bold: true, size: 22 }),
                            new TextRun({ break: 1 }),
                            new TextRun({ break: 1 }),
                            new TextRun({ text: `En ejercicio de sus facultades legales estatutarias y en especial de las conferidas por el artículo 103 de la Ley 270 de 1.996,`, font:'Arial', bold: true, size: 22 }),
                            new TextRun({ break: 1 }),
                            new TextRun({ break: 1 }),
                            new TextRun({ text: `CONSIDERANDO:`,font:'Arial', bold: true, size: 22 }),
                            new TextRun({ break: 1 }),
                        ],
                        alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({
                        children: [

                            new TextRun({ text:`Que en mi calidad de DIRECTOR SECCIONAL DE ADMINISTRACIÓN JUDICIAL DE CUNDINAMARCA – AMAZONAS, autorizo comisión de servicios al señor ${nombres} ${apellidos}, identificado con cédula de ciudadanía No. ${cedula}, quien desempeña el cargo de ${cargo}, para que se traslade el día ${dia} de ${mes} de ${ano} al municipio de ${destino}, con el fin de realizar ${motivo}.`,font:'Arial', size: 22,}),
                        ],
                        alignment: AlignmentType.JUSTIFIED,
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ break: 1 }),
                            new TextRun({ text: `Que el suscrito encuentra viable conceder la comisión peticionada con base en lo dispuesto por el Art. 136 de la Ley 270 de 1996 y Art. 61 del Decreto 1042 de 1978.`,font:'Arial', size: 22 }),
                            new TextRun({ break: 1 }),
                            new TextRun({ break: 1 }),
                            new TextRun({ text: `En mérito a lo expuesto, este Despacho.`,font:'Arial', size: 22 }),
                            new TextRun({ break: 1 }),
                        ],
                    }),

                    new Paragraph({
                        children: [
                            new TextRun({ break: 1 }),
                            new TextRun({ text: `R E S U E L V E:`,font:'Arial',bold: true, size: 22 }),
                            new TextRun({ break: 1 }),
                        
                        
                        ],
                    alignment: AlignmentType.CENTER,
                    }),        
                    new Paragraph({
                            children: [

                            new TextRun({ text: `ARTICULO PRIMERO:`,font:'Arial', bold: true, size: 22 }),
                            new TextRun({ text: ` Comisionar al señor ${nombres} ${apellidos} identificado con cédula de ciudadanía No. ${cedula}, quien desempeña el cargo de ${cargo}, para que se traslade el día ${dia} de ${mes} de ${ano} al municipio de ${destino}, de conformidad con lo expuesto en la parte motiva de esta Resolución.`,font:'Arial', size: 22 }),
                            new TextRun({ break: 1 }),
                            
                        ],
                        alignment: AlignmentType.JUSTIFIED,
                    }),

                    new Paragraph({
                        children: [
                        new TextRun({ text: `ARTICULO SEGUNDO:`,font:'Arial', bold: true, size: 22 }),
                        new TextRun({ text: ` La presente comisión no genera pago de viáticos, pero si gastos de transporte intermunicipal con cargo al CDP No. 624 del 10 de enero de 2024.`,font:'Arial', size: 22 }),
                        new TextRun({ break: 1 }),
                        
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    }),

                    new Paragraph({
                        children: [
                        new TextRun({ text: `ARTICULO TERCERO:`,font:'Arial', bold: true, size: 22 }),
                        new TextRun({ text: ` La presente Resolución rige a partir de la fecha de su expedición.`,font:'Arial',  size: 22 }),
                        new TextRun({ break: 1 }),
                        
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    }),

                    new Paragraph({
                        children: [
                            new TextRun({ break: 1 }),
                            new TextRun({ text: `COMUNÍQUESE Y CÚMPLASE`,font:'Arial', bold: true, size: 22 }),
                            new TextRun({ break: 1 }),
                        
                        
                        ],
                    alignment: AlignmentType.CENTER,
                    }), 

                    new Paragraph({
                        children: [
                        new TextRun({ text: ` Dada en Bogotá, el [DATE-L]`,font:'Arial',  size: 22 }),
                        new TextRun({ break: 1 }),
                        new TextRun({ break: 1 }),
                        new TextRun({ break: 1 }),
                        new TextRun({ break: 1 }),
                        new TextRun({ break: 1 }),
                        
                    ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ break: 1 }),
                            new TextRun({ text: `CARLOS ALBERTO ROCHA MARTÍNEZ`,font:'Arial',bold: true, size: 22 }),
                            new TextRun({ break: 1 }),
                            new TextRun({ text: `Director Seccional de Administración Judicial de Cundinamarca – Amazonas`,font:'Arial', size: 22 }),
                            new TextRun({ break: 1 }),
                        
                        
                        ],
                    alignment: AlignmentType.CENTER,
                    }), 

                
                    viaticos ? new Paragraph({
                        text: `Se generarán viáticos para este traslado.`,
                        size: 22,
                        bold: true,
                        alignment: AlignmentType.CENTER,
                    }) : null,
                ],
            },
        ],
    });

    const fileName = `certificado_${cedula}.docx`;

    Packer.toBuffer(doc).then((buffer) => {
        const filePath = path.join(__dirname, fileName);
        fs.writeFileSync(filePath, buffer);
        res.download(filePath, fileName, (err) => {
            if (err) {
                console.log(err);
            }
            fs.unlinkSync(filePath);
        });
    }).catch(err => {
        console.error("Error al generar el documento:", err);
        res.status(500).send("Error al generar el documento.");
    });
}

else{
    const doc = new Document({
        sections: [
            {
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({ text: `RESOLUCIÓN No. [CODE]`,font:'Arial', bold: true, size: 22 }),
                            new TextRun({ break: 1 }),
                            new TextRun({ text: `[DATE-L]`,font:'Arial', bold: true, size: 22 }),
                            new TextRun({ break: 1 }),
                            new TextRun({ break: 1 }),
                            new TextRun({ text: `Por la cual se confiere una comisión de servicios`,font:'Arial', bold: true, size: 22 }),
                            new TextRun({ break: 1 }),
                            new TextRun({ break: 1 }),
                            new TextRun({ text: `EL DIRECTOR SECCIONAL DE ADMINISTRACIÓN JUDICIAL DE CUNDINAMARCA - AMAZONAS`,font:'Arial', bold: true, size: 22 }),
                            new TextRun({ break: 1 }),
                            new TextRun({ break: 1 }),
                            new TextRun({ text: `En ejercicio de sus facultades legales estatutarias y en especial de las conferidas por el artículo 103 de la Ley 270 de 1.996,`, font:'Arial', bold: true, size: 22 }),
                            new TextRun({ break: 1 }),
                            new TextRun({ break: 1 }),
                            new TextRun({ text: `CONSIDERANDO:`,font:'Arial', bold: true, size: 22 }),
                            new TextRun({ break: 1 }),
                        ],
                        alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({
                        children: [

                            new TextRun({ text:`Que en mi calidad de DIRECTOR SECCIONAL DE ADMINISTRACIÓN JUDICIAL DE CUNDINAMARCA – AMAZONAS, autorizo comisión de servicios al señor ${nombres} ${apellidos}, identificado con cédula de ciudadanía No. ${cedula}, quien desempeña el cargo de ${cargo}, para que se traslade el día ${dia} de ${mes} de ${ano} al municipio de ${destino}, con el fin de realizar ${motivo}.`,font:'Arial', size: 22,}),
                        ],
                        alignment: AlignmentType.JUSTIFIED,
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ break: 1 }),
                            new TextRun({ text: `Que el suscrito encuentra viable conceder la comisión peticionada con base en lo dispuesto por el Art. 136 de la Ley 270 de 1996 y Art. 61 del Decreto 1042 de 1978.`,font:'Arial', size: 22 }),
                            new TextRun({ break: 1 }),
                            new TextRun({ break: 1 }),
                            new TextRun({ text: `En mérito a lo expuesto, este Despacho.`,font:'Arial', size: 22 }),
                            new TextRun({ break: 1 }),
                        ],
                    }),

                    new Paragraph({
                        children: [
                            new TextRun({ break: 1 }),
                            new TextRun({ text: `R E S U E L V E:`,font:'Arial',bold: true, size: 22 }),
                            new TextRun({ break: 1 }),
                        
                        
                        ],
                    alignment: AlignmentType.CENTER,
                    }),        
                    new Paragraph({
                            children: [

                            new TextRun({ text: `ARTICULO PRIMERO:`,font:'Arial', bold: true, size: 22 }),
                            new TextRun({ text: ` Comisionar al señor ${nombres} ${apellidos} identificado con cédula de ciudadanía No. ${cedula}, quien desempeña el cargo de ${cargo}, para que se traslade el día ${dia} de ${mes} de ${ano} al municipio de ${destino}, de conformidad con lo expuesto en la parte motiva de esta Resolución.`,font:'Arial', size: 22 }),
                            new TextRun({ break: 1 }),
                            
                        ],
                        alignment: AlignmentType.JUSTIFIED,
                    }),

                    new Paragraph({
                        children: [
                        new TextRun({ text: `ARTICULO SEGUNDO:`,font:'Arial', bold: true, size: 22 }),
                        new TextRun({ text: ` La presente comisión no genera pago de viáticos, ni de desplazamiento.`,font:'Arial', size: 22 }),
                        new TextRun({ break: 1 }),
                        
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    }),

                    new Paragraph({
                        children: [
                        new TextRun({ text: `ARTICULO TERCERO:`,font:'Arial', bold: true, size: 22 }),
                        new TextRun({ text: ` La presente Resolución rige a partir de la fecha de su expedición.`,font:'Arial',  size: 22 }),
                        new TextRun({ break: 1 }),
                        
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    }),

                    new Paragraph({
                        children: [
                            new TextRun({ break: 1 }),
                            new TextRun({ text: `COMUNÍQUESE Y CÚMPLASE`,font:'Arial', bold: true, size: 22 }),
                            new TextRun({ break: 1 }),
                        
                        
                        ],
                    alignment: AlignmentType.CENTER,
                    }), 

                    new Paragraph({
                        children: [
                        new TextRun({ text: ` Dada en Bogotá, el [DATE-L]`,font:'Arial',  size: 22 }),
                        new TextRun({ break: 1 }),
                        new TextRun({ break: 1 }),
                        new TextRun({ break: 1 }),
                        new TextRun({ break: 1 }),
                        new TextRun({ break: 1 }),
                        
                    ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ break: 1 }),
                            new TextRun({ text: `CARLOS ALBERTO ROCHA MARTÍNEZ`,font:'Arial',bold: true, size: 22 }),
                            new TextRun({ break: 1 }),
                            new TextRun({ text: `Director Seccional de Administración Judicial de Cundinamarca – Amazonas`,font:'Arial', size: 22 }),
                            new TextRun({ break: 1 }),
                        
                        
                        ],
                    alignment: AlignmentType.CENTER,
                    }), 
                ],
            },
        ],
    });

    const fileName = `certificado_${cedula}.docx`;

    Packer.toBuffer(doc).then((buffer) => {
        const filePath = path.join(__dirname, fileName);
        fs.writeFileSync(filePath, buffer);
        res.download(filePath, fileName, (err) => {
            if (err) {
                console.log(err);
            }
            fs.unlinkSync(filePath);
        });
    }).catch(err => {
        console.error("Error al generar el documento:", err);
        res.status(500).send("Error al generar el documento.");
    });
}
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
