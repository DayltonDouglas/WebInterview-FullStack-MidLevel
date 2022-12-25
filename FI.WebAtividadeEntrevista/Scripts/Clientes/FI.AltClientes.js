

$(document).ready(function () {
    GetDadosBeneficiarios();
    if (obj) {
        $('#formCadastro #Nome').val(obj.Nome);
        $('#formCadastro #CPF').val(formatarCPF(obj.CPF));
        $('#formCadastro #CEP').val(obj.CEP);
        $('#formCadastro #Email').val(obj.Email);
        $('#formCadastro #Sobrenome').val(obj.Sobrenome);
        $('#formCadastro #Nacionalidade').val(obj.Nacionalidade);
        $('#formCadastro #Estado').val(obj.Estado);
        $('#formCadastro #Cidade').val(obj.Cidade);
        $('#formCadastro #Logradouro').val(obj.Logradouro);
        $('#formCadastro #Telefone').val(obj.Telefone);
    }
    
    function formatCEP(e) {

        var texto = e.target.value.replace(/\D/g, "")

        texto = texto.replace(/^(\d{5})(\d)/, "$1-$2")

        e.target.value = texto;

    }
    function formatCPF(e) {
        var texto = e.target.value.replace(/\D/g, "");
        texto = texto.replace(/(\d{3})(\d)/, "$1.$2");

        texto = texto.replace(/(\d{3})(\d)/, "$1.$2");

        texto = texto.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

        e.target.value = texto;
    }
    function formatPhone(e) {
        var texto = e.target.value.replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1');
        e.target.value = texto;
    }
    
    const cpf = document.getElementById("CPF");
    const cpfBen = document.getElementById("CPFBen");
    const cep = document.getElementById("CEP"); 
    const telefone = document.getElementById("Telefone");
    cpf.addEventListener("keyup", formatCPF);
    cpfBen.addEventListener("keyup", formatCPF);
    cep.addEventListener("keyup", formatCEP);
    telefone.addEventListener("keyup", formatPhone);
    $('#botaoBenef').click(function (e) {
        e.preventDefault();
        $("#modalBenef").modal('show');
        limparCampos();
    })
    
    $("#formBenef").submit(function (e) {
        e.preventDefault();
        if ($(this).find("#IDBen").val() == 0) {
            $.ajax({
                url: '../../Beneficiario/Incluir',
                method: "POST",
                data: {
                    "IDCliente": obj.Id,
                    "Nome": $(this).find("#NomeBen").val(),
                    "CPF": $(this).find("#CPFBen").val(),
                    "Id": $(this).find("#IDBen").val(),
                },
                error:
                    function (r) {
                        if (r.status == 400)
                            ModalDialog("Ocorreu um erro", r.responseJSON);
                        else if (r.status == 500)
                            ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                        else if (r.status == 409)
                            ModalDialog("Inclusão não realizada!", r.responseJSON);
                    },
                success:
                    function (r) {
                        ModalDialog("Sucesso!", r)
                        $("#formBenef")[0].reset();
                        GetDadosBeneficiarios();
                        limparCampos();
                    }
            });
        } else {
            $.ajax({
                url: '../../Beneficiario/Alterar',
                method: "POST",
                data: {
                    "IDCliente": obj.Id,
                    "Nome": $(this).find("#NomeBen").val(),
                    "CPF": $(this).find("#CPFBen").val(),
                    "Id": $(this).find("#IDBen").val(),
                },
                error:
                    function (r) {
                        if (r.status == 400)
                            ModalDialog("Ocorreu um erro", r.responseJSON);
                        else if (r.status == 500)
                            ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                    },
                success:
                    function (r) {
                        ModalDialog("Sucesso!", r)
                        $("#formBenef")[0].reset();
                        GetDadosBeneficiarios();
                        limparCampos();
                    }
            });
        }
        
    })
    $('#formCadastro').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: 'Alterar',
            method: "POST",
            data: {
                "ID": obj.Id,
                "NOME": $(this).find("#Nome").val(),
                "Cpf": $(this).find("#CPF").val(),
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
                    ModalDialog("Alteração não realizada!", r.responseJSON);
            },
            success:
            function (r) {
                ModalDialog("Sucesso!", r)
                $("#formCadastro")[0].reset();
                setTimeout(function () {
                    window.location.href = urlRetorno;
                }, 2000);   
            }
        });
    })
    
})
function GetDadosBeneficiarios() {
    $("#gridBeneficiarios").find('tbody').remove();
    $.ajax({
        url: '../../Beneficiario/Listar',
        method: 'post',
        data: {
            "IDCliente": obj.Id,
        },
        error:
            function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                else if (r.status == 409)
                    ModalDialog("Alteração não realizada!", r.responseJSON);
            },
        success:
            function (r) {
                var tblBeneficiarios = $("#gridBeneficiarios");

                $.each(r, async function (index, item) {
                    var tr = $("<tbody style='border:none'></tbody>");
                    tr.html(("<td>" + formatarCPF(item.CPF) + "</td>")
                        + " " + ("<td>" + item.Nome + "</td>")
                        + " " + (`<td class='text-center'> <button type='button' onclick="editBeneficiario(${item.CPF},'${item.Nome}',${item.ID})" class= 'btn btn-primary btn-sm'> Alterar</button> <button type='button' style='margin-left:15px;' onclick="deleteBeneficiario(${item.ID})" class= 'btn btn-primary btn-sm'> Excluir</button></td>`));
                    tblBeneficiarios.append(tr);
                })
            }
    })
}
function formatarCPF(cpf) {
    cpf = addZero(cpf.replace(/[^\d]/g, ""),11);
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}
function editBeneficiario(CpfBen, NomeBen,IDBen) {


    $("#NomeBen").val(NomeBen);
    $("#CPFBen").val(formatarCPF(CpfBen.toString()));
    $("#IDBen").val(IDBen)
}
function limparCampos() {
    $("#NomeBen").val("");
    $("#CPFBen").val("");
    $("#IDBen").val(0);
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
async function deleteBeneficiario(id) {
    $.ajax({
        url: '../../Beneficiario/Deletar',
        method: 'delete',
        data: {
            "id": id,
        },
        error:
            function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                else if (r.status == 409)
                    ModalDialog("Alteração não realizada!", r.responseJSON);
            },
        success:
            function (r) {
                ModalDialog("Deletado com sucesso", r)
                GetDadosBeneficiarios();
            }
    })
}


function ModalDialog(titulo, texto) {
    var texto = '<div id="myModal" class="modal fade">                                                               ' +
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
    $('#myModal').modal('show');
}
