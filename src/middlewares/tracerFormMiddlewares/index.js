// const axios = require("axios");
// const { google } = require("googleapis");

const FORM_ID = process.env.FORM_ID;
const WEB_APP_URL = process.env.WEB_APP_URL;
const SPREAD_SHEET_ID = process.env.SPREAD_SHEET_ID;
const SHEET_NAME = process.env.SHEET_NAME;

var auth = null;

// async function loadAuth() {
//     if (auth === null) {
//         const keyFileResp = await axios.get(process.env.GOOGLE_AUTH_KEYFILE);

//         auth = new google.auth.GoogleAuth({
//             credentials: keyFileResp.data,
//             scopes: [
//                 "https://www.googleapis.com/auth/forms",
//                 "https://www.googleapis.com/auth/spreadsheets",
//                 "https://www.googleapis.com/auth/drive",
//                 "https://www.googleapis.com/auth/drive.readonly",

//                 "https://www.googleapis.com/auth/script.projects.readonly",
//                 "https://www.googleapis.com/auth/script.projects",
//                 "https://www.googleapis.com/auth/script.processes",
//                 "https://www.googleapis.com/auth/script.metrics",
//                 "https://www.googleapis.com/auth/script.deployments.readonly",
//                 "https://www.googleapis.com/auth/script.deployments",
//                 "https://www.googleapis.com/auth/drive.file",
//             ],
//         });
//     }
// }

// const retrieve = async (req, res, next) => {
//     try {
//         await loadAuth();

//         const clientAuth = await auth.getClient();
//         const googleForms = await google.forms({
//             version: "v1",
//             auth: clientAuth,
//         });

//         const form = await googleForms.forms.get({
//             formId: FORM_ID,
//         });


//         return res.json(form.data);
//     } catch (error) {
//         return next(error);
//     }
// }

// const get_form_items = async (req, res, next) => {
//     try {
//         await loadAuth();

//         const clientAuth = await auth.getClient();
//         const reqHeaders = await clientAuth.getRequestHeaders();

//         let resp = await axios.get(WEB_APP_URL, {
//             params: {
//                 __function: "retrieveFormItems",
//                 formID: FORM_ID,
//             },
//             headers: {
//                 ...reqHeaders,
//             }
//         });

//         return res.json(resp.data);
//     } catch (error) {
//         return next(error);
//     }
// }

// const submit = async (req, res, next) => {
//     try {
//         await loadAuth();

//         const { body } = req;

//         const clientAuth = await auth.getClient();
//         const reqHeaders = await clientAuth.getRequestHeaders();
//         console.log(body);
//         let resp = await axios.get(WEB_APP_URL, {
//             params: {
//                 ...body,
//                 __function: "submitGForm",
//                 formID: FORM_ID,
//             },
//             headers: {
//                 ...reqHeaders,
//             }
//         });

//         return res.end();
//     } catch (error) {
//         return next(error);
//     }
// }

// const charts = async (req, res, next) => {
//     try {
//         await loadAuth();

//         const clientAuth = await auth.getClient();
//         const reqHeaders = await clientAuth.getRequestHeaders();
//         let resp = await axios.get(WEB_APP_URL, {
//             params: {
//                 __function: "retrieveSpreadSheetCharts",
//                 spreadSheetID: SPREAD_SHEET_ID,
//                 sheetName: SHEET_NAME,
//             },
//             headers: {
//                 ...reqHeaders,
//             }
//         });

//         return res.send(resp.data);
//     } catch (error) {
//         return next(error);
//     }
// }

// const chartBlob = async (req, res, next) => {
//     try {
//         await loadAuth();

//         const { chartID } = req.params;
//         const clientAuth = await auth.getClient();
//         const reqHeaders = await clientAuth.getRequestHeaders();
//         let resp = await axios.get(WEB_APP_URL, {
//             params: {
//                 __function: "retrieveChartBlob",
//                 spreadSheetID: SPREAD_SHEET_ID,
//                 sheetName: SHEET_NAME,
//                 chartID: chartID,
//             },
//             headers: {
//                 ...reqHeaders,
//             }
//         });

//         return res.send(resp.data);
//     } catch (error) {
//         return next(error);
//     }
// }

module.exports = {
    // retrieve,
    // get_form_items,
    // submit,
    // charts,
    // chartBlob,
}
