"use strict";
var CRMUtil = window.CRMUtil || {};  
var urlApiLocal = "https://localhost:44340/";
var urlApiAzure = "https://crmweappsso.azurewebsites.net/";
//var tenant = "sadinformatica.onmicrosoft.com";
//var clientId = "397888ef-72cc-4d90-98b7-2fa4f2b6de95";
//var config = {
//    clientId: clientId,
//    tenant: tenant,
//    postLogoutRedirectUri: urlApiAzure,
//    redirectUri: urlApiAzure,
//    popUp: false,
//    cacheLocation: 'localStorage'
//};
//var authContext = undefined;

    CRMUtil.CepChange = function () {
        
        var cep = "api/endereco/123";//Xrm.Page.getAttribute("mrv_cep").getValue();
        if (cep !== null) {
            var cmd = new CRMUtil.ChamaServicoAssincrono(urlApiAzure, cep, CRMUtil.ProcessaRetorno, CRMUtil.ProcessaErro);
            cmd.Execute();
    }
};
    
    CRMUtil.ChamaServicoAssincrono = function (url, method, sucessCallback, erroCallBack) {
        var servico = this;
        var parameter = null;
        var obj = new Object();
        servico.SetParameter = function (name, value) {
            if (parameter === null)
                parameter = new Object();
            parameter[name] = value;
        };

        servico.Execute = function ()
        {
            authenticate();
            //if (authContext === undefined )
            //{
            //   authContext = new AuthenticationContext(config);
            //}

            //var user = authContext.getCachedUser();
            //if (!user)
            //{
            //    authContext.login();
            //}

            $.ajax({
                cache: false,
                timeout: 5000,
                type: "GET",
                url: url + method,
                data: parameter,
                contentType: "application/json; charset=utf-8",
                beforeSend: function (XMLHttpRequest) {
                    XMLHttpRequest.setRequestHeader("Accept", "application/json");
                    XMLHttpRequest.setRequestHeader("Access-Control-Allow-Origin", "*");
                    XMLHttpRequest.setRequestHeader("Access-Control-Allow-Credentials", "true");
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
};

CRMUtil.ProcessaErro = function (xhr, textStatus, errorThrown) {
        alert(textStatus + " = " + xhr.status + " (" + xhr.responseText + ")");
};

CRMUtil.ProcessaRetorno =  function (data)
    {
        if (data !== null) {
            alert(data.Logradouro);
        }
};