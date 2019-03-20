"use strict";

// Function that manages authentication  
function authenticate() {

    //Set these variables to match your environment  
    var organizationURI = "https://crmweappsso.azurewebsites.net/"; //URL da web api
    var tenant = "sadinformatica.onmicrosoft.com"; //The name of the Azure AD organization you use  
    var clientId = "397888ef-72cc-4d90-98b7-2fa4f2b6de95"; //The ClientId you got when you registered the application  
    var pageUrl = "https://crmweappsso.azurewebsites.net/"; //The URL of this page in your development environment when debugging.  


    var user, authContext, message, errorMessage, loginButton, logoutButton, getAccountsButton, accountsTable, accountsTableBody, tokenResult;

    //Configuration data for AuthenticationContext  
    var endpoints = {
        orgUri: organizationURI
    };

    var config = {
        tenant: tenant,
        clientId: clientId,
        postLogoutRedirectUri: pageUrl,
        endpoints: endpoints,
        popup: true,
        cacheLocation: 'localStorage' // enable this for IE, as sessionStorage does not work for localhost.  
    };

    //OAuth context  
    authContext = new AuthenticationContext(config);

    var dummyAuthPage = 'Scripts/LoginAzure.html';

    var getUser = function () {
        return new Promise(function (resolve, reject) {
            // If the user is cached, resolve the promise immediately.
            var user = authContext.getCachedUser();
            if (user) {
                resolve(user);
                return;
            }

            // The user was not cached. Open a popup window which
            // performs the OAuth login process, then signals
            // the result.
            authContext.config.displayCall = function (url) {
                authContext.config.displayCall = null;
                var popup = window.open(url, 'auth-popup', 'width=800,height=500');
                var intervalId = window.setInterval(function () {
                    try {
                        if (popup.location.pathname.indexOf('/' + dummyAuthPage) >= 0) {
                            window.clearInterval(intervalId);
                            authContext.handleWindowCallback(popup.location.hash);
                            popup.close();
                            var user = authContext.getCachedUser();
                            if (user) {
                                resolve(user);
                            } else {
                                reject(authContext.getLoginError());
                            }
                        }
                    } catch (whatever) {
                        if (popup.closed) {
                            reject();
                        }
                    }
                }, 100);
            };

            //authContext.config.redirectUri = window.location.href.replace('form/ClientApiWrapper.aspx', dummyAuthPage); //This code is added to handle the ClientApiWrapper added by Dynamics so that the request is redirected to correct page  
            authContext.config.redirectUri = pageUrl + dummyAuthPage;
            //alert('pagina de SSO: ' + authContext.config.redirectUri);
            authContext.login();
        });
    };
    getUser();
}