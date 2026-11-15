const STATUS_VALIDOS = ['Pendente', 'Emitida', 'Paga', 'Cancelada'];

function hojeISO() {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  return ano + '-' + mes + '-' + dia;
}

class NotaFiscal {
  constructor(id, numero, emitente, dataEmissao, valor, status) {
    this.id = id;
    this.numero = String(numero).trim();
    this.emitente = String(emitente).trim();
    this.dataEmissao = dataEmissao;
    this.valor = Number(valor);
    this.status = status || 'Pendente';
  }

  alterarStatus(novoStatus) {
    if (STATUS_VALIDOS.indexOf(novoStatus) === -1) {
      return { ok: false, erro: 'Status inválido.' };
    }

    if (this.status === 'Cancelada') {
      return { ok: false, erro: 'Nota cancelada não pode mudar de status.' };
    }

    this.status = novoStatus;
    return { ok: true };
  }

  static validar(dados) {
    const erros = [];

    if (!dados.numero || String(dados.numero).trim() === '') {
      erros.push('Informe o número da nota.');
    }

    if (!dados.emitente || String(dados.emitente).trim() === '') {
      erros.push('Informe o emitente.');
    }

    if (!dados.dataEmissao) {
      erros.push('Informe a data de emissão.');
    } else if (dados.dataEmissao > hojeISO()) {
      erros.push('A data de emissão não pode ser futura.');
    }

    const valor = Number(dados.valor);
    if (!(valor > 0)) {
      erros.push('O valor deve ser maior que zero.');
    }

    return erros;
  }
}

function proximoId(lista) {
  let maior = 0;
  for (let i = 0; i < lista.length; i++) {
    if (lista[i].id > maior) {
      maior = lista[i].id;
    }
  }
  return maior + 1;
}

function buscarNota(lista, id) {
  for (let i = 0; i < lista.length; i++) {
    if (lista[i].id === id) {
      return lista[i];
    }
  }
  return null;
}

function cadastrarNota(lista, dados) {
  const erros = NotaFiscal.validar(dados);
  if (erros.length > 0) {
    return { ok: false, erros: erros };
  }

  const nota = new NotaFiscal(
    proximoId(lista),
    dados.numero,
    dados.emitente,
    dados.dataEmissao,
    dados.valor
  );

  lista.push(nota);
  return { ok: true, erros: [], nota: nota };
}

function alterarStatus(lista, id, novoStatus) {
  const nota = buscarNota(lista, id);

  if (nota === null) {
    return { ok: false, erro: 'Nota não encontrada.' };
  }

  return nota.alterarStatus(novoStatus);
}

if (typeof module !== 'undefined') {
  module.exports = {
    STATUS_VALIDOS,
    hojeISO,
    NotaFiscal,
    proximoId,
    buscarNota,
    cadastrarNota,
    alterarStatus
  };
}
