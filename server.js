const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('test'));
app.use('/lib', express.static('lib'));

app.listen(port, () => {
    console.log(`Bonjour.js listening on port ${port}\nhttp://localhost:${port}/`);
})