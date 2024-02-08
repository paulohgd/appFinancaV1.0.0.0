// Modifique a função formatarData
const formatarData = (data) => {
  const dataObj = new Date(data);
  const dia = String(dataObj.getDate()).padStart(2, '0');
  const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
  const ano = dataObj.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

let dataAtual = new Date()

const atualizarCalendario = () => {
  const calendarioElement = document.getElementById("calendario");

  if (calendarioElement) {
    const flatpickrInstance = calendarioElement._flatpickr;
    const dataAtual = flatpickrInstance.selectedDates[0] || new Date();
    flatpickrInstance.setDate(dataAtual, true); // Define a data no calendário e atualiza
    flatpickrInstance.redraw(); // Redesenha o calendário
    mostrarDividas();
  } else {
    console.error("Instância do Flatpickr não encontrada.");
  }
};

document.addEventListener("DOMContentLoaded", function () {
  flatpickr("#calendario", {
    enableTime: false,
    dateFormat: 'd/m/Y',  // Defina o formato desejado
    locale: {
      months: {
        shorthand: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        longhand: [
          'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
          'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ]
      },
      weekdays: {
        shorthand: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
        longhand: [
          'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
          'Quinta-feira', 'Sexta-feira', 'Sábado'
        ]
      }
    },
  });

  atualizarCalendario();
  mostrarDividas()
});

function proximoMes() {
  const calendarioElement = document.getElementById("calendario");

  if (calendarioElement && calendarioElement._flatpickr) {
    const flatpickrInstance = calendarioElement._flatpickr;
    const dataAtual = flatpickrInstance.selectedDates[0] || new Date();
    const novaData = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1);

    flatpickrInstance.setDate(novaData);
    flatpickrInstance.redraw();
    atualizarCalendario();
    mostrarDividas()
  } else {
    console.error("Instância do Flatpickr não encontrada.");
  }
}

function mesAnterior() {
  const calendarioElement = document.getElementById("calendario");

  if (calendarioElement && calendarioElement._flatpickr) {
    const flatpickrInstance = calendarioElement._flatpickr;
    const dataAtual = flatpickrInstance.selectedDates[0] || new Date();
    const novaData = new Date(dataAtual.getFullYear(), dataAtual.getMonth() - 1);

    flatpickrInstance.setDate(novaData);
    flatpickrInstance.redraw();
    atualizarCalendario();
    mostrarDividas()
  } else {
    console.error("Instância do Flatpickr não encontrada.");
  }
}


const botaoAdiconarCompra = document.getElementById("button-add-compra");
const listaDividas = document.getElementById("lista-dividas")
const totalGasto = document.getElementById("totalGasto")
//VARIAVEL QUE VAI RECEBER AS CONTAS
let minhaListaDeContas = []
//VARIAVEL QUE VAI RECEBER AS CONTAS PAGAS
let minhaListaDeContasPagas = [];


function adicionarGastoFixoParaTodosOsMeses(conta, anoInicial, anosParaAdicionar) {
  for (let ano = anoInicial; ano < anoInicial + anosParaAdicionar; ano++) {
    for (let mes = 0; mes < 12; mes++) {
      const novaDataVencimento = new Date(ano, mes, conta.dataVencimento.getDate());

      const novaConta = {
        dataVencimento: novaDataVencimento,
        nomeConta: conta.nomeConta,
        total: conta.total,
        concluida: false,
        numeroParcela: conta.numeroParcela,
        numeroParcelas: conta.numeroParcelas,
        isGastoFixo: true,
      };

      // Verifica se a dívida já existe para evitar duplicatas
      const dividaExistente = minhaListaDeContas.find(
        (c) => c.nomeConta === novaConta.nomeConta && c.dataVencimento.getMonth() === mes && c.dataVencimento.getFullYear() === ano
      );

      if (!dividaExistente) {
        minhaListaDeContas.push(novaConta);
      }
    }
  }
}


const adicionarNovaDivida = () => {
  Swal.fire({
    title: 'Adicionar Nova Dívida',
    html: `
      <label for="input-nome-compra" class="label">Nome:</label>
      <input id="input-nome-compra" class="swal2-input input" placeholder="Nome da compra">
      
      <label for="input-valor-compra" class="label">Total:</label>
      <input id="input-valor-compra" class="swal2-input input" placeholder="Valor da compra">
      
      <label for="calendario" class="label">Data de Vencimento:</label>
      <input id="calendario" class="swal2-input input calendarioInput" placeholder="Data de vencimento">
      
      <label for="input-num-parcelas" id="divParcelasLabel" class="label">Numero de parcelas:</label>
      <input type="number" id="input-num-parcelas" class="swal2-input input" placeholder="Número de parcelas" />

      <label for="checkbox-gasto-fixo" class="label">Gasto Fixo:</label>
      <input type="checkbox" id="checkbox-gasto-fixo" class="swal2-checkbox input">
    `,
    showCancelButton: true,
    confirmButtonText: 'Adicionar',
    cancelButtonText: 'Cancelar',
    didOpen: () => {
      flatpickr("#calendario", {
        enableTime: false,
        dateFormat: 'd/m/Y',
        locale: {
          months: {
            shorthand: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            longhand: [
              'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
              'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
            ]
          },
          weekdays: {
            shorthand: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
            longhand: [
              'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
              'Quinta-feira', 'Sexta-feira', 'Sábado'
            ]
            
          }
        },
      });
      // Código para ocultar ou mostrar a opção de número de parcelas com base na seleção da opção de dívida fixa
      const checkboxGastoFixo = Swal.getPopup().querySelector('#checkbox-gasto-fixo');
      const divParcelasLabel = Swal.getPopup().querySelector('#divParcelasLabel');
      const inputNumeroParcelas = Swal.getPopup().querySelector('#input-num-parcelas');

      checkboxGastoFixo.addEventListener('change', function() {
        if (this.checked) {
          divParcelasLabel.style.display = 'none';
          inputNumeroParcelas.style.display = 'none';
          inputNumeroParcelas.value = '';
        } else {
          divParcelasLabel.style.display = 'block';
          inputNumeroParcelas.style.display = 'block';
        }
      });
    },
    preConfirm: () => {
      const inputNomeDaCompra = Swal.getPopup().querySelector('#input-nome-compra');
      const inputValorCompra = Swal.getPopup().querySelector('#input-valor-compra');
      const inputCalendario = Swal.getPopup().querySelector('#calendario');
      const inputNumeroParcelas = Swal.getPopup().querySelector('#input-num-parcelas');
      const checkboxGastoFixo = Swal.getPopup().querySelector('#checkbox-gasto-fixo');

      // Validar se os campos foram preenchidos
      if (!inputNomeDaCompra.value || !inputValorCompra.value || !inputCalendario.value) {
        Swal.showValidationMessage('Por favor, preencha todos os campos.');
        return false;
      }

      const dataVencimento = flatpickr.parseDate(inputCalendario.value, 'd/m/Y');
      const numeroParcelas = parseInt(inputNumeroParcelas.value) || 1;
      const valorTotal = parseFloat(inputValorCompra.value) || 0;
      const valorParcela = valorTotal / numeroParcelas;

      for (let i = 0; i < numeroParcelas; i++) {
        const novaDataVencimento = new Date(dataVencimento.getFullYear(), dataVencimento.getMonth() + i, dataVencimento.getDate());

        const conta = {
          dataVencimento: novaDataVencimento,
          nomeConta: inputNomeDaCompra.value,
          total: valorParcela,
          concluida: false,
          numeroParcela: i + 1,
          numeroParcelas: numeroParcelas,
          isGastoFixo: checkboxGastoFixo.checked, // Adiciona a flag de gasto fixo
        };

        minhaListaDeContas.push(conta);

        // Se for um gasto fixo, adiciona para todos os meses seguintes
        if (conta.isGastoFixo) {
          adicionarGastoFixoParaTodosOsMeses(conta, dataVencimento.getFullYear(), 5); // Adiciona para os próximos 5 anos
        }
      }

      mostrarDividas();
      totalDividas();
      atualizarCalendario();
      localStorage.setItem("listaDividas", JSON.stringify(minhaListaDeContas));
      Swal.fire('Dívida adicionada com sucesso!', '', 'success');
    },
  });
};



// Função para calcular o total de dívidas do mês atual
const totalDividas = () => {
  const dataSelecionadaInput = document.getElementById("calendario");
  const dataSelecionadaStr = dataSelecionadaInput.value;

  // Utilize o Flatpickr para obter a data no formato Date
  const dataSelecionada = flatpickr.parseDate(dataSelecionadaStr, 'd/m/Y') || new Date();

  const mesAtual = dataSelecionada.getMonth() + 1;
  const anoAtual = dataSelecionada.getFullYear();
  const hoje = new Date();

  // Filtra apenas as dívidas do mês atual
  const dividasDoMesAtual = minhaListaDeContas.filter((conta) => {
    if (conta && conta.dataVencimento) {
      const dataVencimento = flatpickr.parseDate(conta.dataVencimento, 'd/m/Y') || new Date();
      return (
        dataVencimento.getMonth() + 1 === mesAtual &&
        dataVencimento.getFullYear() === anoAtual
      );
    }
    return false;
  });

  // Calcula o total de dívidas não concluídas do mês atual
  const totalDividasCriadas = dividasDoMesAtual.reduce(
    (acc, valorAtual) => acc + (valorAtual.concluida ? 0 : valorAtual.total),
    0
  );

  // Atualiza o elemento HTML que exibe o total de dívidas
  totalGasto.innerHTML = formatarValorCompra(totalDividasCriadas);
};
// Função para atualizar as classes de uma dívida específica
function atualizarClassesDivida(posicaoItem) {
  const divida = minhaListaDeContas[posicaoItem];
  const elementoDivida = document.querySelector(`.contasAdicionadas[data-index="${posicaoItem}"]`);

  if (elementoDivida) {
    // Remove todas as classes relacionadas à situação da dívida
    elementoDivida.classList.remove('atrasada', 'vence-hoje');

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Zera as horas para comparar apenas datas

    const dataVencimento = new Date(divida.dataVencimento);

    // Adiciona as classes conforme a situação atual da dívida
    if (divida.concluida) {
      elementoDivida.classList.add('done');
    } else if (dataVencimento < hoje) {
      elementoDivida.classList.add('atrasada');
    } else if (dataVencimento.toISOString().split('T')[0] === hoje.toISOString().split('T')[0]) {
      elementoDivida.classList.add('vence-hoje');
    }
  }
}
const mostrarDividas = () => {
  let novaLi = "";
  const dataSelecionada = flatpickr.parseDate(document.getElementById("calendario").value, 'd/m/Y');
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const mostrarLista = (lista, titulo, permiteEditarRemover) => {
    novaLi += `<h2>${titulo}</h2>`
    lista.forEach((conta, index) => {
      if (conta && conta.dataVencimento) {
        const dataVencimento = new Date(conta.dataVencimento);
        if (
          dataVencimento instanceof Date &&
          dataSelecionada instanceof Date &&
          dataVencimento.getFullYear() === dataSelecionada.getFullYear() &&
          dataVencimento.getMonth() === dataSelecionada.getMonth()
        ) 
        // Verifique se dataVencimento é uma data válida antes de continuar
        if (dataVencimento instanceof Date && !isNaN(dataVencimento)) {
          const isVenceHoje =
            dataVencimento.getDate() === hoje.getDate() &&
            dataVencimento.getMonth() === hoje.getMonth() &&
            dataVencimento.getFullYear() === hoje.getFullYear();

          const isAtrasada = dataVencimento < hoje;

          if (
            (mostrarContasPagas || !conta.concluida) && // Adicione esta condição para exibir contas pagas se o botão mostrar contas pagas estiver ativado
            dataVencimento.getFullYear() === dataSelecionada.getFullYear() &&
            dataVencimento.getMonth() === dataSelecionada.getMonth()
          ) {
            const exibirConta = mostrarContasPagas ? true : !conta.concluida;

            if (exibirConta) {
              const dataVencimentoFormatada = formatarData(conta.dataVencimento);

              let classes = '';
              const elementoDivida = document.querySelector(`.contasAdicionadas[data-index="${index}"]`);
              if (elementoDivida) {
                elementoDivida.classList.remove('atrasada', 'vence-hoje', 'done');
              }

              if (conta.concluida) {
                classes += 'done';
              } else if (isAtrasada) {
                classes += 'atrasada';
              } else if (isVenceHoje) {
                classes += 'vence-hoje';
              }

              const descricaoParcelas = conta.numeroParcelas > 1 ? ` (${conta.numeroParcela}/${conta.numeroParcelas})` : '';

              novaLi += `
                <li class="contasAdicionadas ${classes}" data-index="${index}">
                  ${permiteEditarRemover ? `<img src="src/trash-icon.png" class="trash-icon" alt="removerDivida" onclick="${conta.concluida ? `removerDividaPaga(${index})` : `removerDivida(${index})`}">` : ''}
                  <p class="trasacoes">Nome: ${conta.nomeConta} </p>
                  <p class="trasacoes">Total: ${formatarValorCompra(conta.total)}${descricaoParcelas}</p>
                  <p class="trasacoes" id="dataVencimento">Data Vencimento: ${formatarData(conta.dataVencimento)}</p>
                  ${permiteEditarRemover && !conta.concluida ? `<button class="btnEditar" data-index="${index}">Editar</button>` : ''}
                  ${permiteEditarRemover && !conta.concluida ? `<button class="btnSalvar" data-index="${index}" style="display: none;">Salvar</button>` : ''}
                  ${!conta.concluida ? `<img src="src/checked-icon.png" class="checked-icon check-icon" alt="pagamentoFeito" onclick="confirmacaoTarefa(${index})">` : ''}
                </li>
              `;
            }
          }
        } else {
          console.error('dataVencimento não é uma data válida:', dataVencimento);
        }
      }
    });
  };

  mostrarLista(minhaListaDeContas, 'Contas Pendentes', true);
  if (mostrarContasPagas) { // Exibe as contas pagas somente se a variável mostrarContasPagas estiver definida como true
    mostrarLista(minhaListaDeContasPagas, 'Contas Pagas', true);
  }

  listaDividas.innerHTML = novaLi;

  const checkIcons = document.getElementsByClassName("check-icon");
  for (let i = 0; checkIcons && i < checkIcons.length; i++) {
    checkIcons[i].addEventListener("click", (event) => {
      const index = event.target.getAttribute("data-index");
      confirmacaoTarefa(index);
    });
  }

  const btnEditores = document.getElementsByClassName("btnEditar");
  for (let i = 0; btnEditores && i < btnEditores.length; i++) {
    btnEditores[i].addEventListener("click", (event) => {
      const index = event.target.getAttribute("data-index");
      editarDivida(index);
    });
  }

  const btnSalvar = document.getElementsByClassName("btnSalvar");
  for (let i = 0; btnSalvar && i < btnSalvar.length; i++) {
    btnSalvar[i].addEventListener("click", (event) => {
      const index = event.target.getAttribute("data-index");
      salvarEdicao(index);
    });
  }

  totalDividas();
};
// Função para editar a dívida
function editarDivida(index) {
  const divida = minhaListaDeContas[index];

  Swal.fire({
    title: 'Editar dívida',
    html: `
      <label for="input-nome-compra">Nome:</label>
      <input id="input-nome-compra" class="swal2-input" value="${divida.nomeConta}">

      <label for="input-valor-compra">Total:</label>
      <input id="input-valor-compra" class="swal2-input" value="${divida.total.toFixed(2)}">

      <label for="calendario">Data de Vencimento:</label>
      <input id="calendario" class="swal2-input" placeholder="Selecione a data">`,
    showCancelButton: true,
    confirmButtonText: 'Salvar',
    cancelButtonText: 'Cancelar',
    didOpen: () => {
      flatpickr("#calendario", {
        enableTime: false,
        dateFormat: 'd/m/Y',
        defaultDate: divida.dataVencimento ? divida.dataVencimento : 'today', // Define a data padrão como a data de vencimento ou 'today' se não houver data
        locale: {
          months: {
            shorthand: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            longhand: [
              'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
              'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
            ]
          },
          weekdays: {
            shorthand: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
            longhand: [
              'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
              'Quinta-feira', 'Sexta-feira', 'Sábado'
            ]
          }
        },
      });
    },
    preConfirm: () => {
      const inputNomeDaCompra = Swal.getPopup().querySelector('#input-nome-compra');
      const inputValorCompra = Swal.getPopup().querySelector('#input-valor-compra');
      const inputCalendario = Swal.getPopup().querySelector('#calendario');

      // Validar se os campos foram preenchidos
      if (!inputNomeDaCompra.value || !inputValorCompra.value) {
        Swal.showValidationMessage('Por favor, preencha todos os campos.');
        return false;
      }

      const dataVencimento = inputCalendario._flatpickr.selectedDates[0] || new Date(); // Se não houver data, usa a data atual
      const novoNomeConta = inputNomeDaCompra.value;
      const novoTotal = parseFloat(inputValorCompra.value.replace('R$', '').replace(',', '.')) || 0;

      minhaListaDeContas[index].nomeConta = novoNomeConta;
      minhaListaDeContas[index].total = novoTotal;
      minhaListaDeContas[index].dataVencimento = dataVencimento;

      mostrarDividas();
      totalDividas();
      atualizarCalendario();
      
      localStorage.setItem("listaDividas", JSON.stringify(minhaListaDeContas));
      Swal.fire('Dívida editada com sucesso!', '', 'success');
    },
  });
}

//FUNÇÃO PARA SALVAR A EDIÇÃO
function salvarEdicao(posicaoItem) {
  // Oculte o botão "Salvar" e exiba o botão "Editar" para o item selecionado
  document.querySelector(`.btnEditar[data-index="${posicaoItem}"]`).style.display = "inline";
  document.querySelector(`.btnSalvar[data-index="${posicaoItem}"]`).style.display = "none";

  // Atualize os valores da dívida com base nos campos de entrada
  const divida = minhaListaDeContas[posicaoItem];
  
  // Get the existing values
  const existingNomeConta = divida.nomeConta;
  const existingTotal = divida.total;
  
  // Get the new values from the input fields
  const novoNomeConta = document.getElementById("input-nome-compra").value.trim();
  const novoTotal = parseFloat(document.getElementById("input-valor-compra").value.replace('R$', '').replace(',', '.')) || 0;
  
  // Check if the new values are empty, if so, retain the existing values
  divida.nomeConta = novoNomeConta !== '' ? novoNomeConta : existingNomeConta;
  divida.total = novoTotal !== 0 ? novoTotal : existingTotal;

  const inputCalendario = document.getElementById("calendario");

  // Parse the input date value
  const novaDataVencimento = new Date(inputCalendario.value);
  
  // Update the date of the debt with the correct day
  novaDataVencimento.setDate(novaDataVencimento.getDate() + 1);

  // Format the date as "yyyy-mm-dd"
  const formattedDate = novaDataVencimento.toISOString().split('T')[0];

  // Atualize a data de vencimento da dívida
  divida.dataVencimento = formattedDate;

  // Adicione verificação para destacar as dívidas vencidas ou que vencem hoje após a edição
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0); // Zera as horas para comparar apenas datas

  // Verifica se a dívida está atrasada
  const isAtrasada = novaDataVencimento < hoje;
  const classeAtrasada = isAtrasada ? 'atrasada' : '';

  // Verifica se a dívida é do dia atual
  const isVenceHoje =
    novaDataVencimento.getDate() === hoje.getDate() &&
    novaDataVencimento.getMonth() === hoje.getMonth() &&
    novaDataVencimento.getFullYear() === hoje.getFullYear();

  const classeVenceHoje = isVenceHoje && !isAtrasada ? 'vence-hoje' : '';

  // Remove as classes anteriores
  const elementoDivida = document.querySelector(`.contasAdicionadas[data-index="${posicaoItem}"]`);
  if (elementoDivida) {
    elementoDivida.classList.remove('atrasada', 'vence-hoje');
  }

  // Adicione as novas classes, se não estiverem vazias
  if (classeAtrasada) {
    elementoDivida.classList.add(classeAtrasada);
  }

  if (classeVenceHoje) {
    elementoDivida.classList.add(classeVenceHoje);
  }

  totalDividas();
  atualizarCalendario();
  mostrarDividas()
}
// Função para ajustar as parcelas após a remoção
function ajustarParcelas() {
  for (let i = 0; i < minhaListaDeContas.length; i++) {
    const conta = minhaListaDeContas[i];

    if (conta && typeof conta.numeroParcelas === 'number' && conta.numeroParcelas > 0) {
      if (conta.numeroParcela > 1) {
        // Se não for a primeira parcela, ajusta para o mês anterior
        const dataVencimento = new Date(conta.dataVencimento);
        dataVencimento.setMonth(dataVencimento.getMonth() - 1);
        conta.dataVencimento = dataVencimento.toISOString().split('T')[0];

        // Reduz o número de parcelas
        conta.numeroParcelas -= 1;

        // Mantém o valor da parcela
        const valorParcela = conta.total / conta.numeroParcelas;
        conta.total = valorParcela;
      } else {
        // Se for a primeira parcela, remove a compra
        minhaListaDeContas.splice(i, 1);
        i--; // Para ajustar o índice após a remoção
      }
    }
  }
}


// Verificar se a dívida é fixa
function removerDivida(posicaoItem) {
  const divida = minhaListaDeContas[posicaoItem];
  if (divida && divida.isGastoFixo && typeof divida.numeroParcelas === 'number' && divida.numeroParcelas > 1) {
    // Se a dívida fixa tem mais de uma parcela, exibe a mensagem de opção
    Swal.fire({
      title: 'Deseja excluir apenas esta parcela ou todas as parcelas?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Apenas esta parcela',
      cancelButtonText: 'Todas as parcelas',
    }).then((result) => {
      if (result.isConfirmed) {
        // Remover apenas a parcela selecionada
        minhaListaDeContas.splice(posicaoItem, 1);
        Swal.fire('Parcela removida com sucesso!', '', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Remover todas as parcelas da dívida fixa
        const parcelasARemover = minhaListaDeContas.filter(
          (conta) => conta && conta.nomeConta === divida.nomeConta
        );

        parcelasARemover.forEach((parcela) => {
          const index = minhaListaDeContas.findIndex(
            (conta) => conta === parcela
          );

          if (index !== -1) {
            minhaListaDeContas.splice(index, 1);
          }
        });

        Swal.fire('Todas as parcelas removidas com sucesso!', '', 'success');
      }

      mostrarDividas();
      totalDividas();
      localStorage.setItem("listaDividas", JSON.stringify(minhaListaDeContas));
    });
  } else {
    // Se a dívida não for fixa ou tiver apenas uma parcela, pede confirmação antes de remover
    Swal.fire({
      title: 'Deseja realmente remover esta dívida?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Remover a dívida
        minhaListaDeContas.splice(posicaoItem, 1);
        Swal.fire('Dívida removida com sucesso!', '', 'success');
      }

      mostrarDividas();
      totalDividas();
      localStorage.setItem("listaDividas", JSON.stringify(minhaListaDeContas));
    });
  }
}


// Função para remover a dívida (com opção de remover todas as parcelas)
function removerDivida(posicaoItem) {
  const divida = minhaListaDeContas[posicaoItem];

  // Verificar se a dívida é fixa
  if (divida && divida.isGastoFixo) {
    Swal.fire({
      title: 'Remover Dívida Fixa',
      text: 'Deseja remover todas as ocorrências desta dívida ou apenas a atual?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Apenas a Atual',
      cancelButtonText: 'Todas',
    }).then((result) => {
      if (result.isConfirmed) {
        // Remover apenas a dívida atual
        minhaListaDeContas.splice(posicaoItem, 1);
      } else {
        // Remover todas as ocorrências da dívida
        minhaListaDeContas = minhaListaDeContas.filter((conta) => conta.nomeConta !== divida.nomeConta || !conta.isGastoFixo);
      }

      mostrarDividas();
      totalDividas();
      localStorage.setItem('listaDividas', JSON.stringify(minhaListaDeContas));
    });
  } else if (divida && typeof divida.numeroParcelas === 'number' && divida.numeroParcelas > 1) {
    // Se a dívida tem mais de uma parcela, exibe a mensagem de opção
    Swal.fire({
      title: 'Deseja excluir apenas esta parcela ou todas as parcelas?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Apenas esta parcela',
      cancelButtonText: 'Todas as parcelas',
    }).then((result) => {
      if (result.isConfirmed) {
        // Remover apenas a parcela selecionada
        minhaListaDeContas.splice(posicaoItem, 1);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Remover todas as parcelas da dívida
        const parcelasARemover = minhaListaDeContas.filter(
          (conta) => conta && conta.nomeConta === divida.nomeConta
        );

        parcelasARemover.forEach((parcela) => {
          const index = minhaListaDeContas.findIndex(
            (conta) => conta === parcela
          );

          if (index !== -1) {
            minhaListaDeContas.splice(index, 1);
          }
        });
      }

      mostrarDividas();
      totalDividas();
      localStorage.setItem('listaDividas', JSON.stringify(minhaListaDeContas));
    });
  } else {
    // Se a dívida tem apenas uma parcela, remove sem perguntar
    minhaListaDeContas.splice(posicaoItem, 1);
    mostrarDividas();
    totalDividas();
    localStorage.setItem('listaDividas', JSON.stringify(minhaListaDeContas));
  }
}


// Função para remover a dívida paga
function removerDividaPaga(posicaoItem) {
  const dividaPaga = minhaListaDeContasPagas[posicaoItem];

  if (dividaPaga) {
    Swal.fire({
      title: 'Tem certeza de que deseja excluir esta conta paga?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
     
        minhaListaDeContasPagas.splice(posicaoItem, 1);
        // Remover a conta paga
        mostrarDividas(); // Atualizar a exibição após a remoção
        totalDividas();
        localStorage.setItem("listaDividasPagas", JSON.stringify(minhaListaDeContasPagas));
      }
    });
  }
}

function confirmacaoTarefa(posicaoItem) {
  // O índice já é passado diretamente agora
  if (minhaListaDeContas[posicaoItem]) {
    // Inverte o estado de concluída
    minhaListaDeContas[posicaoItem].concluida = !minhaListaDeContas[posicaoItem].concluida;

    if (minhaListaDeContas[posicaoItem].concluida) {
      // Move a conta para a lista de contas pagas
      minhaListaDeContasPagas.push(minhaListaDeContas[posicaoItem]);
      minhaListaDeContas.splice(posicaoItem, 1);
    }
  } else if (minhaListaDeContasPagas[posicaoItem]) {
    // Se a posição estiver nos limites da lista de contas pagas
    // Inverte o estado de concluída
    minhaListaDeContasPagas[posicaoItem].concluida = !minhaListaDeContasPagas[posicaoItem].concluida;

    if (!minhaListaDeContasPagas[posicaoItem].concluida) {
      // Move a conta de volta para a lista de contas pendentes se não estiver mais concluída
      minhaListaDeContas.push(minhaListaDeContasPagas[posicaoItem]);
      minhaListaDeContasPagas.splice(posicaoItem, 1);
    }
  }

  mostrarDividas();
  totalDividas();
  atualizarCalendario();
  localStorage.setItem("listaDividas", JSON.stringify(minhaListaDeContas));
  localStorage.setItem("listaDividasPagas", JSON.stringify(minhaListaDeContasPagas));
}

let mostrarContasPagas = false;
const alternarVisibilidadeContasPagas = () => {
  mostrarContasPagas = !mostrarContasPagas;
  mostrarDividas();

  const btnMostrarContasPagas = document.getElementById("btnMostrarContasPagas");
  if (btnMostrarContasPagas) {
    if (mostrarContasPagas) {
      btnMostrarContasPagas.textContent = "Ocultar contas pagas";
    } else {
      btnMostrarContasPagas.textContent = "Mostrar contas pagas";
    }
  }
};
function recarregarDadosLocalStorage() {
  // Recupera os dados armazenados localmente ou inicializa as listas se não houver dados
  minhaListaDeContas = JSON.parse(localStorage.getItem("listaDividas")) || [];
  minhaListaDeContasPagas = JSON.parse(localStorage.getItem("listaDividasPagas")) || [];
}

//Função para formatar o valor para R$20,00
const formatarValorCompra = (valor => {
  return new Intl.NumberFormat('br-BR',
    { style: 'currency', currency: 'BRL' }
  ).format(valor)
})

recarregarDadosLocalStorage()
botaoAdiconarCompra.addEventListener("click", adicionarNovaDivida)