const CHAVE_STORAGE = 'controlanf.notas';

const notas = carregarNotas();

function carregarNotas() {
  const lista = [];

  try {
    const texto = localStorage.getItem(CHAVE_STORAGE);
    if (texto) {
      const dados = JSON.parse(texto);
      for (let i = 0; i < dados.length; i++) {
        const d = dados[i];
        lista.push(new NotaFiscal(d.id, d.numero, d.emitente, d.dataEmissao, d.valor, d.status));
      }
    }
  } catch (erro) {
    return [];
  }

  return lista;
}

function salvarNotas() {
  localStorage.setItem(CHAVE_STORAGE, JSON.stringify(notas));
}

function formatarData(dataISO) {
  const partes = dataISO.split('-');
  return partes[2] + '/' + partes[1] + '/' + partes[0];
}

function formatarValor(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function mostrarErros(mensagens) {
  const caixa = document.getElementById('erros');
  caixa.innerHTML = '';

  if (mensagens.length === 0) {
    caixa.hidden = true;
    return;
  }

  for (let i = 0; i < mensagens.length; i++) {
    const linha = document.createElement('p');
    linha.textContent = mensagens[i];
    caixa.appendChild(linha);
  }
  caixa.hidden = false;
}

function criarSeletorStatus(nota) {
  const seletor = document.createElement('select');

  for (let i = 0; i < STATUS_VALIDOS.length; i++) {
    const opcao = document.createElement('option');
    opcao.value = STATUS_VALIDOS[i];
    opcao.textContent = STATUS_VALIDOS[i];
    if (STATUS_VALIDOS[i] === nota.status) {
      opcao.selected = true;
    }
    seletor.appendChild(opcao);
  }

  seletor.addEventListener('change', function () {
    const resultado = alterarStatus(notas, nota.id, seletor.value);
    if (resultado.ok) {
      salvarNotas();
      mostrarErros([]);
    } else {
      mostrarErros([resultado.erro]);
    }
    desenharTabela();
  });

  return seletor;
}

function criarCelula(texto) {
  const celula = document.createElement('td');
  celula.textContent = texto;
  return celula;
}

function desenharTabela() {
  const corpo = document.getElementById('corpo-tabela');
  const tabela = document.getElementById('tabela');
  const vazio = document.getElementById('vazio');

  corpo.innerHTML = '';

  for (let i = 0; i < notas.length; i++) {
    const nota = notas[i];
    const linha = document.createElement('tr');

    linha.appendChild(criarCelula(nota.numero));
    linha.appendChild(criarCelula(nota.emitente));
    linha.appendChild(criarCelula(formatarData(nota.dataEmissao)));
    linha.appendChild(criarCelula(formatarValor(nota.valor)));

    const celulaStatus = document.createElement('td');
    celulaStatus.appendChild(criarSeletorStatus(nota));
    linha.appendChild(celulaStatus);

    corpo.appendChild(linha);
  }

  tabela.hidden = notas.length === 0;
  vazio.hidden = notas.length > 0;
}

function aoEnviarFormulario(evento) {
  evento.preventDefault();

  const dados = {
    numero: document.getElementById('numero').value,
    emitente: document.getElementById('emitente').value,
    dataEmissao: document.getElementById('dataEmissao').value,
    valor: document.getElementById('valor').value
  };

  const resultado = cadastrarNota(notas, dados);

  if (!resultado.ok) {
    mostrarErros(resultado.erros);
    return;
  }

  salvarNotas();
  mostrarErros([]);
  document.getElementById('formulario').reset();
  desenharTabela();
}

document.getElementById('formulario').addEventListener('submit', aoEnviarFormulario);
desenharTabela();
