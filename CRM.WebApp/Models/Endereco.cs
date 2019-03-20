using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRM.WebApp.Models
{
    public class Endereco
    {
        public Endereco() { }
        public Endereco(string cep) { Cep = cep; }
        public string Cep { get; set; }
        public string Logradouro { get; set; }
    }
}