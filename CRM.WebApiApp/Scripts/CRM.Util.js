if ( typeof(CRMUtil) === "undefined") { CRMUtil = {}; }
var urlApiLocal = "https://localhost:44336/api";
var urlApiAzure = "https://crmwebapiapp.azurewebsites.net/api";
// Enter Global Config Values & Instantiate ADAL AuthenticationContext
window.config = {
    instance: 'https://login.microsoftonline.com/',
    tenant: 'sadinformatica.onmicrosoft.com',
    clientId: '4d234d64-425c-40dc-b0a2-900eefd2b5a2',
    postLogoutRedirectUri: window.location.origin,
    cacheLocation: 'localStorage' // enable this for IE, as sessionStorage does not work for localhost.
};
var authContext = new AuthenticationContext(config);

CRMUtil.Funcoes = {

    CepChange: function () {
        
        var cep = "endereco/123";//Xrm.Page.getAttribute("mrv_cep").getValue();
        if (cep !== null) {
            var cmd = new CRMUtil.Funcoes.ChamaServicoAssincrono(urlApiAzure, cep, CRMUtil.Funcoes.ProcessaRetorno, CRMUtil.Funcoes.ProcessaErro);
            cmd.Execute();
        }
    },
    
    ChamaServicoAssincrono: function (url, method, sucessCallback, erroCallBack) {
        var servico = this;
        var parameter = null;
        var obj = new Object();
        servico.SetParameter = function (name, value) {
            if (parameter === null)
                parameter = new Object();
            parameter[name] = value;
        };

        // Acquire Token for Backend
        authContext.acquireToken(authContext.config.clientId, function (error, token) {

            // Handle ADAL Error
            if (error || !token) {
                printErrorMessage('ADAL Error Occurred: ' + error);
                return;
            };


        servico.Execute = function ()
        {
            $.ajax({
                cache: false,
                timeout: 5000,
                type: "GET",
                url: url + "/" + method,
                data: parameter,
                contentType: "application/json;charset=utf-8",
                beforeSend: function (XMLHttpRequest) {
                    XMLHttpRequest.setRequestHeader("Accept", "application/json");
                    XMLHttpRequest.setRequestHeader("Access-Control-Allow-Origin", "*");
                    XMLHttpRequest.setRequestHeader("Access-Control-Allow-Credentials", "true");
                    XMLHttpRequest.setRequestHeader("Authorization", 'Bearer ' + token);
                     
                },
                xhrFields: {
                    withCredentials: true
                },

                crossDomain: true,
                dataType: "json",
                success: sucessCallback,
                error: erroCallBack
            });
        };
    },

    ProcessaErro: function (xhr, textStatus, errorThrown) {
        alert(textStatus + " = " + xhr.status + " (" + xhr.responseText + ")");
    },

    ProcessaRetorno: function (data)
    {
        if (data !== null) {
            alert(data.Logradouro);
        }
    }
};