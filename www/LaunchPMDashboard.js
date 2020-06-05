const Codec     = require("../static/codec.js");

function launchPMDashboard(document, dashboardURL, fhirServiceUrl){
        let patientIdEntry = document.getElementById('patientIdEntry').value;
        const launchParams = {a:"1",b:patientIdEntry,e:"efb5d4ce-dffc-47df-aa6d-05d372fdb407",f:"1"}
        let url1 = dashboardURL + `?launch=${btoa(JSON.stringify(launchParams))}`;
        console.log(url1);
        window.open(url1, "_blank");
}