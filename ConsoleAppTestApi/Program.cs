using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleAppTestApi
{
    class Program
    {
        /// <summary>
        /// The variables below are standard Azure AD terms from our various samples
        /// We set these in the Azure Portal for this app for security and to make it easy to change (you can reuse this code in other apps this way)
        /// You can name each of these what you want as long as you keep all of this straight
        /// </summary>
        static string authority = ConfigurationManager.AppSettings["ida:Authority"];  // the AD Authority used for login.  For example: https://login.microsoftonline.com/myadnamehere.onmicrosoft.com 
        static string clientId = ConfigurationManager.AppSettings["ida:ClientId"]; // the Application ID of this app.  This is a guid you can get from the Advanced Settings of your Auth setup in the portal
        static string clientSecret = ConfigurationManager.AppSettings["ida:ClientSecret"]; // the key you generate in Azure Active Directory for this application
        static string resource = ConfigurationManager.AppSettings["ida:Audience"]; // the Application ID of the app you are going to call.  This is a guid you can get from the Advanced Settings of your Auth setup for the targetapp in the portal


        static void Main(string[] args)
        {

            // Normally you would use a single Global HttpClient per MS guidance
            // but for demo purposes... Just create one inline
            var client = new HttpClient();
            

            //string tokenEndPoint = "https://login.microsoftonline.com/sadinformatica.onmicrosoft.com/oauth2/token";
            //client.BaseAddress = new Uri(tokenEndPoint);
            //client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/x-www-form-urlencoded"));

            //var content = new FormUrlEncodedContent(new[]
            //{
            //    new KeyValuePair<string, string>("resource", "https://sadinformatica.onmicrosoft.com/CRM.WebApiApp"),
            //    new KeyValuePair<string, string>("client_id", "94854211-4055-47e9-b896-291967920a57"),
            //    new KeyValuePair<string, string>("client_secret", "/rNw1pcpuDZ3IWfXKzSlvY0leSZaZV+nOu8Yx4b8HkI="),
            //    new KeyValuePair<string, string>("client_info", "1"),
            //    new KeyValuePair<string, string>("grant_type", "client_credentials")
            //});

            //var result = client.PostAsync("", content).GetAwaiter().GetResult();
            //string resultContent = result.Content.ReadAsStringAsync().GetAwaiter().GetResult();
            //var tokenParse = new Token(resultContent);
            //Console.WriteLine(tokenParse.access_token);
            //Console.WriteLine(tokenParse.expires_in);


            try
            {
                // get the token
                var token = GetS2SAccessTokenForProdMSAAsync().GetAwaiter().GetResult();

                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(
                    new MediaTypeWithQualityHeaderValue("application/json"));

                // set the auth header with the aquired Bearer token
                client.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue("Bearer", token.AccessToken);

                // make the call to the resource requiring auth!
                var response =  client.GetAsync("https://crmwebapiapp.azurewebsites.net/api/endereco/123").GetAwaiter().GetResult();
                if (response.IsSuccessStatusCode)
                {
                    Console.WriteLine(response.Content);
                }


            }
            catch (Exception ex)
            {
                // important to log the exception if any because it will tell you what went wrong
                Console.WriteLine(ex.Message);
            }


            Console.WriteLine("Hello World!");
            Console.ReadKey();

            // Go to http://aka.ms/dotnet-get-started-console to continue learning how to build a console app! 
        }

        static public async Task<AuthenticationResult> GetS2SAccessTokenForProdMSAAsync()
        {
            return await GetS2SAccessToken(authority, resource, clientId, clientSecret);
        }

        static async Task<AuthenticationResult> GetS2SAccessToken(string authority, string resource, string clientId, string clientSecret)
        {
            var clientCredential = new ClientCredential(clientId, clientSecret);
            AuthenticationContext context = new AuthenticationContext(authority, false);
            AuthenticationResult authenticationResult = await context.AcquireTokenAsync(
                resource,  // the resource (app) we are going to access with the token
                clientCredential);  // the client credentials
            return authenticationResult;
        }

    }
}
