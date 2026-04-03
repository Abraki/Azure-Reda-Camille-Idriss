const express = require('express');
const sql = require('mssql');
const app = express();
const path = require('path');

// Configuration via les variables d'environnement (ce qu'on a configuré sur Azure)
const config = {
    user: process.env.User,
    password: process.env.Password,
    server: process.env.host,
    database: process.env.Database,
    port: 1433,
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

// Route pour récupérer la donnée en BDD
app.get('/api/data', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('SELECT message FROM TestTable');
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Sert le fichier HTML (Front-end)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(process.env.PORT || 8080, () => console.log('Serveur prêt !'));

