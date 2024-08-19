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
    const { cedula, nombre, cargo, dia, mes, ano, destino, motivo, viaticos } = req.body;

    const doc = new Document({
        sections: [
            {
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({ text: `RESOLUCIÓN No. [CODE]`, bold: true, size: 22 }),
                            new TextRun({ break: 1 }),
                            new TextRun({ text: `[DATE-L]`, bold: true, size: 22 }),
                            new TextRun({ break: 1 }),
                            new TextRun({ break: 1 }),
                            new TextRun({ text: `Por la cual se confiere una comisión de servicios`, bold: true, size: 22 }),
                            new TextRun({ break: 1 }),
                            new TextRun({ break: 1 }),
                            new TextRun({ text: `EL DIRECTOR SECCIONAL DE ADMINISTRACIÓN JUDICIAL DE CUNDINAMARCA - AMAZONAS`, bold: true, size: 22 }),
                            new TextRun({ break: 1 }),
                            new TextRun({ break: 1 }),
                            new TextRun({ text: `En ejercicio de sus facultades legales estatutarias...`, bold: true, size: 22 }),
                            new TextRun({ break: 1 }),
                            new TextRun({ text: `CONSIDERANDO:`, bold: true, size: 22 }),
                            new TextRun({ break: 1 }),
                        ],
                        alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({
                        text: `Que en mi calidad de DIRECTOR SECCIONAL... ${nombre}, identificado con cédula de ciudadanía No. ${cedula}, quien desempeña el cargo de ${cargo}, para que se traslade el día ${dia} de ${mes} de ${ano} al municipio de ${destino}, con el fin de realizar ${motivo}.`,
                        size: 22,
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ break: 1 }),
                            new TextRun({ text: `Que el suscrito encuentra viable...`, bold: true, size: 22 }),
                            new TextRun({ break: 1 }),
                            new TextRun({ text: `En mérito a lo expuesto, este Despacho.`, bold: true, size: 22 }),
                            new TextRun({ break: 1 }),
                        ],
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
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
