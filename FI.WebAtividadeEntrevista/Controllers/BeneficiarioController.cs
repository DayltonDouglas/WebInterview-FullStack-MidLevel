using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FI.AtividadeEntrevista.DML;
using FI.AtividadeEntrevista.BLL;
using WebAtividadeEntrevista.Models;

namespace WebAtividadeEntrevista.Controllers
{
    public class BeneficiarioController : Controller
    {
        
        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public JsonResult Incluir(BeneficiarioModel beneficiario)
        {
            BoBeneficiario bo = new BoBeneficiario();
            if (!this.ModelState.IsValid && beneficiario.Id != 0)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {
                if(bo.VerificarExistencia(beneficiario.CPF.Replace(".", "").Replace("-", ""),beneficiario.IDCliente))
                {
                    Response.StatusCode = 409;
                    return Json("CPF já está cadastrado no sistema!");
                }
                else
                {
                    beneficiario.Id = bo.Incluir(new Beneficiario()
                    {
                        IDCliente = beneficiario.IDCliente,
                        Nome = beneficiario.Nome,
                        CPF = beneficiario.CPF.Replace(".", "").Replace("-", ""),
                    });
                }
                return Json("Beneficiário cadastrado no sistema");
            }
        }
        [HttpPost]
        public JsonResult IncluirCadastro(List<BeneficiarioModel> beneficiarios, long IDCLiente)
        {
            BoBeneficiario bo = new BoBeneficiario();
            if (!this.ModelState.IsValid )
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {
                foreach(BeneficiarioModel beneficiario in beneficiarios)
                {
                    if (bo.VerificarExistencia(beneficiario.CPF.Replace(".", "").Replace("-", ""), IDCLiente))
                    {
                        Response.StatusCode = 409;
                        return Json("CPF já está cadastrado no sistema!");
                    }
                    else
                    {
                        beneficiario.Id = bo.Incluir(new Beneficiario()
                        {
                            IDCliente = IDCLiente,
                            Nome = beneficiario.Nome,
                            CPF = beneficiario.CPF.Replace(".", "").Replace("-", ""),
                        });
                    }
                }
               
                return Json("Beneficiário cadastrado no sistema");
            }
        }

        [HttpPost]
        public JsonResult Alterar(BeneficiarioModel beneficiario)
        {
            BoBeneficiario bo = new BoBeneficiario();
            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {
                if (bo.VerificarExistencia(beneficiario.CPF.Replace(".", "").Replace("-", ""),beneficiario.IDCliente))
                {
                    
                    bo.Alterar(new Beneficiario()
                    {
                        ID = beneficiario.Id,
                        Nome = beneficiario.Nome,
                        CPF = null,
                        IDCliente = beneficiario.IDCliente,
                    });
                    return Json("CPF já está cadastrado no sistema, alterado apenas o nome!");
                }
                else
                {
                    bo.Alterar(new Beneficiario()
                    {
                        ID = beneficiario.Id,
                        Nome = beneficiario.Nome,
                        CPF = beneficiario.CPF,
                        IDCliente = beneficiario.IDCliente,
                    });
                }

                return Json("Cadastro alterado com sucesso");
            }
        }
        [HttpPost]
        public JsonResult Listar(long IDCliente)
        {
            BoBeneficiario bo = new BoBeneficiario();
            List<Beneficiario> beneficiarios = new List<Beneficiario>();
            beneficiarios = bo.Listar(IDCliente);

            return Json(beneficiarios);

        }

        [HttpGet]
        public ActionResult Alterar(long id)
        {
            BoBeneficiario bo = new BoBeneficiario();
            Beneficiario beneficiario = bo.Consultar(id);
            Models.BeneficiarioModel model = null;

            if (beneficiario != null)
            {
                model = new BeneficiarioModel()
                {
                    Id = beneficiario.ID,
                    Nome = beneficiario.Nome,
                    CPF = beneficiario.CPF,
                    IDCliente = beneficiario.IDCliente
                };


            }

            return View(model);
        }
        [HttpDelete]
        public JsonResult Deletar(long id)
        {

            BoBeneficiario bo = new BoBeneficiario();
            try
            {
                bo.Excluir(id);
                return Json("Beneficiario excluido com sucesso");
            }
            catch(Exception ex)
            {
                return Json(ex.Message.ToString());
            }
            


        }

    }
}
