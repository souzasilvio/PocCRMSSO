"use strict";

// Function that manages authentication  
function authenticate() {

    //Set these variables to match your environment  
    var organizationURI = "https://sadinformatica.crm2.dynamics.com"; //The URL to connect to CRM (online)  
    var tenant = "sadinformatica.onmicrosoft.com"; //The name of the Azure AD organization you use  
    var clientId = "4d234d64-425c-40dc-b0a2-900eefd2b5a2"; //The ClientId you got when you registered the application  
    var pageUrl = "https://sadinformatica.crm2.dynamics.com"; //The URL of this page in your development environment when debugging.  

    var user, authContext, message, errorMessage, loginButton, logoutButton, getAccountsButton, accountsTable, accountsTableBody;

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

    var dummyAuthPage = '/WebResources/sad_auth.html';

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

            //This code is added to handle the ClientApiWrapper added by Dynamics so that the request is redirected to correct page  
            authContext.config.redirectUri = window.location.href.replace('form/ClientApiWrapper.aspx', dummyAuthPage); 
            authContext.login();
        });
    };
    getUser();
}