function calcular_idade_em_meses(data_do_plantio) {
  const [dia, mes, ano]= data_do_plantio.split("/").map(Number);
  const dataP= new Date(ano, mes - 1, dia);
  const hoje= new Date();

  const anos= hoje.getFullYear() - dataP.getFullYear();
  const meses= hoje.getMonth() - dataP.getMonth();

  return anos * 12 + meses - (hoje.getDate() < dataP.getDate() ? 1 : 0);
}

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

//Pesquisar Fruteiras que já estão cadastradas
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

// Cadastro de Fruteiras
document.getElementById("formularioDeCadastroDeFruteiras").addEventListener("submit", function(e) {
  e.preventDefault();
  
  const form_data= new FormData(e.target);
  const arquivo_imagem= form_data.get("imagem");

  const salvar_fruteira = (imagemBase64) => {
    const fruteiras= JSON.parse(localStorage.getItem("fruteiras")) || [];
    const nextId= fruteiras.length + 1;

    const fruteira = {
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

