import { Router } from "express";
const r = Router();

const cmds = [
    "/help",
    "/api",
];

r.post("/execute", (req, res) => {
    const { command } = req.body;

    // 1. Validar que enviaron algo (Bad Request)
    if (!command) {
        return res.status(400).json({
            status: "error",
            message: "Falta el parámetro 'command' en el cuerpo."
        });
    }

    // 2. Validar si el comando existe (Not Found)
    if (!cmds.includes(command)) {
        return res.status(404).json({
            status: "notFound",
            errCode: 404,
            message: `El comando '${command}' no existe.`
        });
    }

    // 3. Si todo está bien, ejecutar y responder (OK)
    // ¡IMPORTANTE! Si no pones esto, el cliente se queda cargando infinito
    return res.status(200).json({
        status: "success",
        message: `Ejecutando ${command}...`
    });
});

export default r;