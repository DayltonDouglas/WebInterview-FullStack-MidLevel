const beneficiarios = [];
const IDBen = 0;
$(document).ready(function () {
    
    
    const cpf = document.getElementById("CPF")
    const cpfBen = document.getElementById("CPFBen");
    const cep = document.getElementById("CEP");
    const telefone = document.getElementById("Telefone");
    cpf.addEventListener("keyup", formatCPF);
    cpfBen.addEventListener("keyup", formatCPF);
    cep.addEventListener("keyup", formatCEP);
    telefone.addEventListener("keyup", formatPhone);
    $('#formCadastro').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: 'Incluir',
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CPF": $(this).find("#CPF").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val()
            },
            error:
            function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                else if (r.status == 409)
                    ModalDialog("Registro não efetuado", r.responseJSON);
            },
            success:
            function (r) {
                ModalDialog("Sucesso!", "Cadastro realizado com sucesso!")
                if (beneficiarios.length != 0) {
                    incluirCadastro(r)
                }
                beneficiarios = [];
                $("#formCadastro")[0].reset();
            }
        });
        
    })
    function incluirCadastro(id) {
        $.ajax({
            url: '../../Beneficiario/IncluirCadastro',
            method: "POST",
            data: {
                beneficiarios: beneficiarios,
                IDCLiente: id  
            },
            error:
                function (r) {
                    if (r.status == 400)
                        ModalDialog("Ocorreu um erro", r.responseJSON);
                    else if (r.status == 500)
                        ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                    else if (r.status == 409)
                        ModalDialog("Registro não efetuado", r.responseJSON);
                },
            success:
                function (r) {
                    beneficiarios = [];
                }
        });
    }
    
    $("#formBenef").submit(function (e) {
        e.preventDefault();
        let beneficiario = {
            Nome: $(this).find("#NomeBen").val(),
            CPF: $(this).find("#CPFBen").val(),
            ID: parseInt($(this).find("#IDBen").val()) ,
            IDCliente:0
        };
        let flag = $(this).find("#Flag").val();
        let testarCPF = TestaCPF(beneficiario.CPF.toString().replace(/\D/g, ''));
        let verificarCPF = VerificarCPF(beneficiarios, beneficiario.CPF, beneficiario.ID)
        if (testarCPF) {
            if (beneficiario.ID == 0 && !verificarCPF) {
                beneficiarios.push(beneficiario);
            }
            else {
                if (flag == "N") {
                    ModalDialog("Operação não realizada!", "CPF já registrado para um beneficiário!")
                } else {
                    beneficiarios.forEach(function (valor,index) {
                        if (beneficiario.ID == index && flag == "S") {
                            
                            valor.Nome = beneficiario.Nome;
                            valor.CPF = beneficiario.CPF;
                            ModalDialog("Operação realizada!", "Registro alterado com sucesso!")
                        }
                    })
                }
            }
        } else {
            ModalDialog("Operação não realizada!", "CPF está num formato inválido!")
        }
       
        GetDadosBeneficiarios();
        limparCampos();
    })

    $('#botaoBenef').click(function (e) {
        e.preventDefault();
        $("#modalBenef").modal('show');
        limparCampos();
    })
    
})
async function deleteBeneficiario(index) {
    beneficiarios.splice(beneficiarios.indexOf(index), 1);
    GetDadosBeneficiarios();
}
function GetDadosBeneficiarios() {
    $("#gridBeneficiarios").find('tbody').remove()
    var tblBeneficiarios = $("#gridBeneficiarios");
    $.each(beneficiarios, async function (index, item) {
        var tr = $("<tbody style='border:none'></tbody>");
        tr.html(("<td>" + formatarCPF(item.CPF) + "</td>")
            + " " + ("<td>" + item.Nome + "</td>")
            + " " + (`<td class='text-center'> <button type='button' onclick="editBeneficiario('${item.CPF}','${item.Nome}',${index})" class= 'btn btn-primary btn-sm'> Alterar</button> <button type='button' style='margin-left:15px;' onclick="deleteBeneficiario(${index})" class= 'btn btn-primary btn-sm'> Excluir</button></td>`));
        tblBeneficiarios.append(tr);
    })
}
function TestaCPF(strCPF) {
    var Soma;
    var Resto;
    Soma = 0;
    if (strCPF == "00000000000") return false;

    for (i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(strCPF.substring(9, 10))) return false;

    Soma = 0;
    for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(strCPF.substring(10, 11))) return false;
    return true;
}
function VerificarCPF(array, valor) {
    return array.some((item) => item.CPF == valor);
}
function limparCampos() {
    $("#NomeBen").val("");
    $("#CPFBen").val("");
    $("#IDBen").val(0);
    $("#Flag").val("N")
}
function formatCEP(e) {

    var texto = e.target.value.replace(/\D/g, "")

    texto = texto.replace(/^(\d{5})(\d)/, "$1-$2")

    e.target.value = texto;

}
function formatPhone(e) {
    var texto = e.target.value.replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
    e.target.value = texto;
}
function formatCPF(e) {
    var texto = e.target.value.replace(/\D/g, "");
    texto = texto.replace(/(\d{3})(\d)/, "$1.$2");

    texto = texto.replace(/(\d{3})(\d)/, "$1.$2");

    texto = texto.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    e.target.value = texto;
}
function formatarCPF(cpf) {
    cpf = addZero(cpf.replace(/[^\d]/g, ""),11);
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}
function addZero(num, len) {
    var numberWithZeroes = String(num);
    var counter = numberWithZeroes.length;

    while (counter < len) {

        numberWithZeroes = "0" + numberWithZeroes;

        counter++;

    }

    return numberWithZeroes;
}
function editBeneficiario(CpfBen, NomeBen, index) {
    
    $("#NomeBen").val(NomeBen);
    $("#CPFBen").val(formatarCPF(CpfBen.toString()));
    $("#IDBen").val(index);
    $("#Flag").val("S")
}


function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}
