
const express = require("express");
const crypto = require("crypto");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const app = express();

const PORT = process.env.PORT || 80;
const BUCKET = "mercadoandinouploads-jp-20261104";
const REGION = "us-east-1";

const s3 = new S3Client({
    region: REGION
});

app.get("/", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>MercadoAndino</title>
        </head>
        <body>
            <h1>MercadoAndino</h1>
            <h2>Plataforma web desplegada en AWS</h2>
            <p>Implementación automatizada con CodeDeploy.</p>
            <p>Versión: v1</p>
            <p>Estado: Aplicación funcionando correctamente.</p>
        </body>
        </html>
    `);
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "healthy",
        application: "MercadoAndino",
        version: "v1"
    });
});

// Generar URL prefirmada para subir archivos a S3
app.get("/presigned-url", async (req, res) => {
    try {
        const filename = req.query.filename;
        const contentType = req.query.contentType || "application/octet-stream";

        if (!filename || filename.includes("/") || filename.includes("\\")) {
            return res.status(400).json({
                error: "Nombre de archivo no válido"
            });
        }

        const key = `uploads/${crypto.randomUUID()}-${filename}`;

        const command = new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            ContentType: contentType
        });

        const uploadUrl = await getSignedUrl(s3, command, {
            expiresIn: 300
        });

        res.json({
            uploadUrl,
            bucket: BUCKET,
            key,
            expiresIn: 300
        });

    } catch (error) {
        console.error("Error generando URL:", error);

        res.status(500).json({
            error: "No se pudo generar la URL prefirmada"
        });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`MercadoAndino funcionando en el puerto ${PORT}`);
});
