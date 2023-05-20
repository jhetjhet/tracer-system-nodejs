// const { default: axios } = require("axios");
// const { google } = require("googleapis");

// const SCRIPT_ID = "AKfycby9Fo7oVzJVBsHF9VqvOLDn0YkNmP_HwVEryAyeJ9StTcHZHiiJZm1__923YhfNvbPC";
// const SHEET_ID = '14eKo-Am5MmpWo1Ib084na9qYoEVHWALMbzzfpxCF4io';
// const auth = new google.auth.GoogleAuth({
//     keyFilename: "keyFile.json",
//     scopes: [
//         "https://www.googleapis.com/auth/forms",
//         "https://www.googleapis.com/auth/spreadsheets",
//         "https://www.googleapis.com/auth/drive",
//         "https://www.googleapis.com/auth/script.projects.readonly",
//         "https://www.googleapis.com/auth/script.projects",
//         "https://www.googleapis.com/auth/script.processes",
//         "https://www.googleapis.com/auth/script.metrics",
//         "https://www.googleapis.com/auth/script.deployments.readonly",
//         "https://www.googleapis.com/auth/script.deployments",
//         "https://www.googleapis.com/auth/drive.file",
//     ],
// });

// const retrieve = async () => {
//     try {
//         const clientAuth = await auth.getClient();
        
//         axios.get('https://script.google.com/macros/s/AKfycby9Fo7oVzJVBsHF9VqvOLDn0YkNmP_HwVEryAyeJ9StTcHZHiiJZm1__923YhfNvbPC/exec').then((resp) => {
//             console.log("ASDASDASD");
//         }).catch((error) => {
//             console.log(error);
//         });

//     } catch (error) {
//         console.log(error);
//     }
// }

// const sheetTest = async () => {
//     try {
//         const clientAuth = await auth.getClient();

//         const sheet = await google.sheets({
//             version: "v4",
//             auth: clientAuth,
//         })

//         const resp = await sheet.spreadsheets.values.get({
//             spreadsheetId: SHEET_ID,
//             range: 'Form Responses 1',        
//         })

//         const r2 = await sheet.spreadsheets.get({
//             spreadsheetId: SHEET_ID,
//             ranges: 'Form Responses 1',
//             includeGridData: false,

//         })

//     } catch (error) {
//         console.log(error);
//     }
// }

// sheetTest();


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
var morgan = require('morgan');

const {
    errorHandler,
} = require('./middlewares');
const {
    tracerFormRoutes,
    authenticationRoutes,
    jobsRoutes,
} = require('./routes');
const {
    authenticateTokenMiddleware,
} = require('./middlewares/authenticationMiddlewares');

const app = express();
const MONGO_DB_CONN = process.env.MONGO_DB_CONN;
const PORT = process.env.PORT;

// app.use(morgan('combined'));
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({
//     extended: true,
// }));

app.get('/', (req, res) => {
    return res.send('HELLO SHIT');
});

// app.use('/', authenticationRoutes);

// app.use('/api/', authenticateTokenMiddleware, tracerFormRoutes, jobsRoutes);
// app.use(errorHandler);

mongoose.connection.on('open', () => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running at port ${PORT} !!!`);
    });
});

async function initDB() {
    try {
        await mongoose.connect(MONGO_DB_CONN);
        console.log(`Mongo db connected....`);
    } catch (error) {
        console.log(error);
    }
}

initDB();
