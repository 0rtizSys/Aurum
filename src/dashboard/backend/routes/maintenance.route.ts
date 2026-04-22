import { Router, Request, Response } from 'express';

const router = Router();

// Definimos el "camino" (endpoint)
router.get('/status', (req: Request, res: Response) => {
    // Aquí es donde "sirves" la respuesta. 
    // En el backend, casi siempre servimos JSON (datos).
    res.json({
        inMaintenance: false,
        message: "El sistema Aurum está en mantenimiento técnico.",
        version: "1.1.0-alpha"
    });
});

export default router;