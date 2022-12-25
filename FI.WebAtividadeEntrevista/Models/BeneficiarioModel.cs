using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebAtividadeEntrevista.Models
{
    public class BeneficiarioModel
    {
        /// <summary>
        /// ID
        /// </summary>
        public long Id { get; set; }

        /// <summary>
        /// CPF
        /// </summary>
        [RegularExpression(@"^\d{3}\.\d{3}\.\d{3}-\d{2}$", ErrorMessage = "Digite um CPF Válido")]
        public string CPF { get; set; }
        /// <summary>
        /// ID do Cliente
        /// </summary>
        [Required]
        public string Nome { get; set; }

        /// <summary>
        /// ID do Cliente
        /// </summary>
        public long IDCliente { get; set; }
    }
}