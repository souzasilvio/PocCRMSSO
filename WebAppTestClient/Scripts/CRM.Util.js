"use strict";
var CRMUtil = window.CRMUtil || {};  
//API publicada no Azure com autenticação Azure AD
//Projeto CRM.WeAppSSO
var urlApi = "https://crmweappsso.azurewebsites.net/";

    CRMUtil.CepChange = function () {
        
        var cep = "api/endereco/123";//Xrm.Page.getAttribute("mrv_cep").getValue();
        if (cep !== null) {
            var cmd = new CRMUtil.ChamaServicoAssincrono(urlApi, cep, CRMUtil.ProcessaRetorno, CRMUtil.ProcessaErro);
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
                //xhrFields: {
                //    withCredentials: true
                //},

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