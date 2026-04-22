import express from "express";
import cors from 'cors';
import maintenance from '../backend/routes/maintenance.route'
import commandExecute from '../backend/routes/commands.route'

const app = express();

app.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Upgrade'],
    credentials: true
}))

app.use('/api/commands', commandExecute)
app.use('/api', maintenance)

app.listen(3001, () => {
    console.log('back en 3001')
})