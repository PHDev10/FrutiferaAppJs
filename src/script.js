/*
Sintaticamente: a função declaration "calcular_idade_em_meses", através da chamada feita mais adiante, na função declaration
"exibir_fruteiras", recebe os dados do campo de preenchimento "data_plantio" como uma string, que é dividida e convertida para number,
sendo guardados, separadamente como "dia", "mês" e ano.
Depois, são criados dois objetos "Date"; um com a data do plantio e o outro, com a data em que essa informação foi guardada.
É feito o calculo com as informações da data do plantio e da data do salvamento dos dados - hoje.getFullYear() - dataP.getFullYear() e
hoje.getMonth() - dataP.getMonth().
É retornado a quantidade de meses que o plantio foi feito, garantindo que, caso o dia do mês em que um novo mês seria incrementado no 
cálculo ainda não tenha chegado, o resultado seja devidamente ajustado - (hoje.getDate() < dataP.getDate() ? 1 : 0).

Semanticamente: O objetivo é mostrar a quantidade de meses desde que o plantio foi feito, evitando a necessidade de outros meios para
a obtenção dessa informação.
*/

function calcular_idade_em_meses(data_do_plantio) {
  const [dia, mes, ano]= data_do_plantio.split("/").map(Number);
  const dataP= new Date(ano, mes - 1, dia);
  const hoje= new Date();

  const anos= hoje.getFullYear() - dataP.getFullYear();
  const meses= hoje.getMonth() - dataP.getMonth();

  return anos * 12 + meses - (hoje.getDate() < dataP.getDate() ? 1 : 0);
}

/*
Sintaticamente: a função declaration "exibir_fruteiras", através da chamada feita mais adiante, na função arrow "salvar_fruteira",
limpa a área da página onde os cards das Fruteiras serão exibidos, trazendo todas as Fruteiras cadastradas no
LocalStorage do navegador da página principal do projeto - listaDeFruteiras -, e se não houver, concede uma lista vazia - [].
Como todas fruteiras são carregadas juntas, a função carrega os conjuntos de dados de cada Fruteira - fruteiras.forEach(fruteira => {...
-, realizando o chamado da função declaration "calcular_idade_em_meses" para calcular a quantidade de meses do plantio de cada Fruteira.
Após adquirir o último dado necessário para o preenchimento do card, uma estrutura de condição identifica se, no conjunto de dados da
Fruteira, alguma imagem foi carregada; se sim, a imagem é exibida no espaço correspondente do card, se não, um espaço "placeholder" é
gerado, exibindo a mensagem "Sem Imagem", com fundo cinza.
Utilizando um modelo de card do Bootstrap, a função "implementa" os cards de cada Fruteira no espaço correspondente na página principal.
E no fim, a lista com os cards adicionados à pagina principal é atualizada.

Semanticamente: Atualiza o campo/espaço de preenchimento com os cards de cada Fruteira, montando-os utilizando o mesmo "corpo" de card,
combinando com a organização da página. Cada card ganha uma separação e campo próprio, tornando a leitura de fácil compreenssão e campos
de dados bem definidos.
*/
function exibir_fruteiras() {
  const lista= document.getElementById("listaDeFruteiras");
  lista.innerHTML= "";

  const fruteiras= JSON.parse(localStorage.getItem("fruteiras")) || [];

  fruteiras.forEach(fruteira => {
    const idade= calcular_idade_em_meses(fruteira.data_plantio);

    const imagemCol= fruteira.imagem
      ? `<div class="col-md-4">
           <img src="${fruteira.imagem}" class="img-fluid rounded-start" alt="${fruteira.nome_popular}">
         </div>`
      : `<div class="col-md-4 d-flex align-items-center justify-content-center bg-light" style="min-height:160px">
           <span class="text-muted">Sem imagem</span>
         </div>`;

    const card= `
      <div class="col-md-6 mb-4" id="fruteira-${fruteira.id}">
        <div class="card mb-3 shadow-sm" style="max-width: 540px; border-radius: 10px; border: 6px inset rgb(179, 103, 49);">
          <div class="row g-0">
            ${imagemCol}
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">#${fruteira.id} - ${fruteira.nome_popular}</h5>
                <h6 class="card-subtitle mb-2 text-muted"><em>${fruteira.nome_cientifico}</em></h6>
                <p class="card-text">
                  Produção: ${fruteira.producao} Kg por safra <br>
                  Plantio: ${fruteira.data_plantio} <br>
                  Idade: ${idade} meses
                </p>
                <p class="card-text">
                  <small class="text-body-secondary">Última atualização: ${fruteira.ultima_info_atualizada}</small>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>`;

    lista.innerHTML= lista.innerHTML + card;
  });
}

document.addEventListener("DOMContentLoaded", exibir_fruteiras);

/*
Sintaticamente: A partir da ação de clicar no botão da aba de pesquina - botaoDeProcurarDaBarraDeNavegacao - na barra de navegação, a 
informção digitada no campo de busca - caixaDePesquisa - é armazenada, removendo espaçamentos em branco e convertendo o que foi digitado
para caixa baixa - minúsculo.
Com a informação armazenada, é feita a busca pelos conjuntos de dados de cada Fruteira, tentando ver se o que foi digitado corresponde a
algum nome popular - nome_popular -, nome científico - nome_cientifico - ou id - id. Caso algum dado corresponda a informação digitada,
a página rola suavemente até a posição do card da Fruteira onde o dado está; caso não encontre nenhum dado correspondente, é avisado
que o a busca não teve resultado - alert("Fruteira não encontrada").

Semanticamente: Utiliza-se da ação imediata do clique do botão de pesquisa - botaoDeProcurarDaBarraDeNavegacao - para inicar a busca
rápida pela informação correspondente, agilizando o processo de obtenção de resposta e diminuindo o tempo de espera do usuário. Se a
busca for bem-sucedida, rola suavemente até o card, evitando mais ações do usuário e garantido uma exibição breve e rápida, ao rolar,
da busca realizada por toda página.
*/
document.getElementById("botaoDeProcurarDaBarraDeNavegacao").addEventListener("click", function() {
  const termo= document.getElementById("caixaDePesquisa").value.trim().toLowerCase();
  if (!termo) return;

  const fruteiras= JSON.parse(localStorage.getItem("fruteiras")) || [];

  const encontrada= fruteiras.find(f =>
    f.nome_popular.toLowerCase().includes(termo) ||
    f.nome_cientifico.toLowerCase().includes(termo) ||
    f.id.toString() === termo
  );

  if (encontrada) {
    const card= document.getElementById("fruteira-" + encontrada.id);
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      card.classList.add("border", "border-success", "rounded-3"); // destaque temporário
      setTimeout(() => card.classList.remove("border", "border-success", "rounded-3"), 3000);
    }
  } else {
    alert("Fruteira não encontrada.");
  }
});

/*
Sintaticamente: Primeiramente, para evitar erros, o carregamento da página, quando as informações do formulário -
formularioDeCadastroDeFruteiras - são preenchidas e enviadas, é impedido.
Os dados do formulário são armazenados em uma variável; caso alguma imagem tenha sido carregada, a mesma é salva em uma variável à
parte.
Com o conjunto de informações da Fruteira, cria um objeto - const fruteira= {... -, para armazenar os dados da Fruteira; o id é definido
utilizando o Date.now(), garantindo, assim, que seja quase impossível que o mesmo id seja armazenado em objetos de duas Fruteiras
distintas, já que são devolvidos em milissegundos contados.
Quando os dados são armazenados no formato correto e correspondente de sua Fruteira, é adicionado nesse formato ao LocalStorage. Assim,
os cards são gerados e exibidos na página principal, o modal é fechado, com os campos de entradas de dados - input
- sendo limpos.
Por fim, é conferido se alguma imagem foi inserida; se sim, a imagem é convertida - imagemBase64 -, para que possa ser exibida a partir
da "fonte" direta através do LocalStorage, caso nenhuma imagem seja carregada, é devolvido um valor vazio - null.

Semanticamente: Realiza a principal conversão no formato das informações da Fruteira, para que sejam devidamente utilizadas para a
atualização de dados na página e implementação de informações no HTML da página principal, garantindo que as informações sejam
corretamente utilizadas através dos índices e tipos corretos.
*/
document.getElementById("formularioDeCadastroDeFruteiras").addEventListener("submit", function(e) {
  e.preventDefault();
  
  const form_data= new FormData(e.target);
  const arquivo_imagem= form_data.get("imagem");

  const salvar_fruteira = (imagemBase64) => {
    const fruteiras= JSON.parse(localStorage.getItem("fruteiras")) || [];
    const nextId= fruteiras.length + 1;

    const fruteira= {
      id: Date.now(),
      nome_popular: form_data.get("nome_popular"),
      nome_cientifico: form_data.get("nome_cientifico"),
      producao: Number(form_data.get("producao")),
      data_plantio: form_data.get("data_plantio"),
      imagem: imagemBase64,
      ultima_info_atualizada: new Date().toLocaleDateString("pt-BR")
    };

    fruteiras.push(fruteira);
    localStorage.setItem("fruteiras", JSON.stringify(fruteiras));

    exibir_fruteiras();
    const modal_element = document.getElementById("modalDeCadastrarFruteiras");
    const modal= bootstrap.Modal.getInstance(modal_element);
    modal.hide();

    e.target.reset();
  };

  if (arquivo_imagem && arquivo_imagem.size > 0) {
    const reader= new FileReader();
    reader.onload= () => salvar_fruteira(reader.result);
    reader.readAsDataURL(arquivo_imagem);
  } else {
    salvar_fruteira(null);
  }
});
