# WebInterview-FullStack-MidLevel

## Proposta

### Cadastro/Alteração de Cliente
Implementar o cadastro de um cliente no sistema, adicionando o campo para CPF do cliente para o formulário. Sendo necessário seguir com as seguintes regras:
- O campo CPF do cliente deverá possuir a formatação padrão (999.999.999-99)
- O CPF deve ser válido de acordo com o cálculo padrão de verificação de digito.
- Não deve ser permitido o cadastro de um CPF que já existe no sistema, ou seja, não pode haver duplicidade de dados.

### Cadastro/Alteração de Beneficiario
Implementar o cadastro de beneficiários no sistema, onde teremos o nome e o CPF deste beneficiário relacionado com o cliente que será criado no sistema. Para adicionar beneficiários a este cliente, deve seguir com as seguintes regras:
- O campo CPF do beneficiário deverá possuir a formatação padrão (999.999.999-99)
- O CPF do beneficiário deve ser válido de acordo com o cálculo padrão de verificação de digito.
- Não será permitido o cadastro de mais de um beneficiário com o mesmo CPF para um mesmo cliente.
- O beneficiário só será registrado no sistema após o registro do cliente no sistema.

### Linguages Utilizadas
- **C#**
- **.Net**
- **Javascript**
- **SQL**
- **HTML**

### Bibliotecas
- **JQuery**
- **Bootstrap**

## Como utilizar
É necessário ter instalado o [Visual Studio](https://visualstudio.microsoft.com/pt-br/) e o [Git](https://git-scm.com/downloads).
### Passo a Passo
Após instalar as ferramentas
1. Ir para o diretório desejado para o deploy da solução.
2. Executar o comando ```git clone https://github.com/DayltonDouglas/WebInterview-FullStack-MidLevel.git```
3. Abrir o visual studio e buscar pelo diretório em que foi posto.
4. Abrir o Gerenciador de soluções e definir a seguinte solução como projeto de inicialização: ![image](https://user-images.githubusercontent.com/70713498/209483219-5d4ec7b4-69d1-4783-9a71-04967699a2c2.png)
5. Pronto, basta executar o projeto.
