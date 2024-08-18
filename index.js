const express = require('express');
const { Document, Packer, Paragraph, TextRun, AlignmentType } = require('docx');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/generate-doc', (req, res) => {
    const { cedula, nombre, cargo, dia, mes, ano, destino, motivo } = req.body;

    // Crear un nuevo documento
    const doc = new Document({
        sections: [
            {
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `RESOLUCIÓN No. [CODE]`,
                                bold: true,
                                size: 22,                               
                            }),
                            new TextRun({
                                break: 1, // Añade un salto de línea    
                            }),
                            new TextRun({
                                text: `[DATE-L]`,
                                bold: true,
                                size: 22,                               
                            }),
                            new TextRun({
                                break: 1, // Añade un salto de línea  
                                
                            }),
                            new TextRun({
                                break: 1, // Añade un salto de línea    
                            }),
                            new TextRun({
                                text: `Por la cual se confiere una comisión de servicios `,
                                bold: true,
                                size: 22,
                            }),new TextRun({
                                break: 1, // Añade un salto de línea  
                               
                            }),
                            new TextRun({
                                break: 1, // Añade un salto de línea    
                            }),
                            new TextRun({
                                text: `EL DIRECTOR SECCIONAL DE ADMINISTRACIÓN JUDICIAL DE CUNDINAMARCA - AMAZONAS `,
                                bold: true,
                                size: 22,
                            }),
                            
                            new TextRun({
                                break: 1, // Añade un salto de línea    
                            }),
                            new TextRun({
                                break: 1, // Añade un salto de línea    
                            }),
                            new TextRun({
                                text: `En ejercicio de sus facultades legales estatutarias y en especial de las conferidas por el artículo 103 de la Ley 270 de 1.996, `,
                                bold: true,
                                size: 22,
                            }),
                            
                            new TextRun({
                                break: 1, // Añade un salto de línea    
                            }),
                            new TextRun({
                                break: 1, // Añade un salto de línea    
                            }),
                            new TextRun({
                                text: `CONSIDERANDO: `,
                                bold: true,
                                size: 22,
                            }),
                            
                            new TextRun({
                                break: 1, // Añade un salto de línea    
                            }),
                        ],
                        alignment: AlignmentType.CENTER, // Alinear el texto al centro
             
                    }),



                    new Paragraph({
                        text: `Que en mi calidad de DIRECTOR SECCIONAL DE ADMINISTRACIÓN JUDICIAL DE CUNDINAMARCA – AMAZONAS, autorizo comisión de servicios al señor ${nombre} identificado con cédula de ciudadanía No. ${cedula}, quien desempeña el cargo de ${cargo}, para que se traslade el día ${dia} de ${mes} de ${ano} al municipio de ${destino}, con el fin de realizar ${motivo}.`,
                        size: 22,
                    }),
                   

            new Paragraph({
                children: [

                    new TextRun({
                        break: 1, // Añade un salto de línea    
                    }),
                    new TextRun({
                        text: `Que el suscrito encuentra viable conceder la comisión peticionada con base en lo dispuesto por el Art. 136 de la Ley 270 de 1996 y Art. 61 del Decreto 1042 de 1978.`,
                        bold: true,
                        size: 22,                               
                    }),
                    new TextRun({
                        break: 1, // Añade un salto de línea    
                    }),
                    new TextRun({
                        break: 1, // Añade un salto de línea    
                    }),

                    new TextRun({
                        text: `En merito a lo expuesto, este Despacho.`,
                        bold: true,
                        size: 22,                               
                    }),
                    new TextRun({
                        break: 1, // Añade un salto de línea    
                    }),
                    new TextRun({
                        break: 1, // Añade un salto de línea    
                    }),

                ],
            })

                 
                                     
                ],
            },
        ],
    });

    // Crear un nombre de archivo único
    const fileName = `certificado_${cedula}.docx`;

    // Guardar el documento
    Packer.toBuffer(doc).then((buffer) => {
        const filePath = path.join(__dirname, fileName);
        fs.writeFileSync(filePath, buffer);
        res.download(filePath, fileName, (err) => {
            if (err) {
                console.log(err);
            }
            fs.unlinkSync(filePath); // Eliminar el archivo después de la descarga
        });
    }).catch(err => {
        console.error("Error al generar el documento:", err);
        res.status(500).send("Error al generar el documento.");
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
