import express from 'express';
import { APP_PORT } from './app-port.mjs';

const app = express();

app.use(express.static('test'));
app.use('/lib', express.static('lib'));

app.listen(APP_PORT, () => {
    console.log(`Server updated`);
});
