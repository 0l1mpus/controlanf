const test = require('node:test');
const assert = require('node:assert');
const regras = require('../src/js/notas.js');

function dadosValidos() {
  return {
    numero: '123',
    emitente: 'Fornecedor Exemplo',
    dataEmissao: '2026-11-01',
    valor: '150.50'
  };
}

test('cadastra nota válida com status Pendente', function () {
  const lista = [];

  const resultado = regras.cadastrarNota(lista, dadosValidos());

  assert.strictEqual(resultado.ok, true);
  assert.strictEqual(lista.length, 1);
  assert.strictEqual(lista[0].status, 'Pendente');
  assert.strictEqual(lista[0].valor, 150.5);
});

test('rejeita nota com valor zero ou negativo', function () {
  const lista = [];

  const dadosZero = dadosValidos();
  dadosZero.valor = '0';
  const resultadoZero = regras.cadastrarNota(lista, dadosZero);

  const dadosNegativo = dadosValidos();
  dadosNegativo.valor = '-10';
  const resultadoNegativo = regras.cadastrarNota(lista, dadosNegativo);

  assert.strictEqual(resultadoZero.ok, false);
  assert.strictEqual(resultadoNegativo.ok, false);
  assert.ok(resultadoZero.erros.includes('O valor deve ser maior que zero.'));
  assert.strictEqual(lista.length, 0);
});

test('rejeita nota com data de emissão futura', function () {
  const lista = [];
  const dados = dadosValidos();
  dados.dataEmissao = '2999-01-01';

  const resultado = regras.cadastrarNota(lista, dados);

  assert.strictEqual(resultado.ok, false);
  assert.ok(resultado.erros.includes('A data de emissão não pode ser futura.'));
  assert.strictEqual(lista.length, 0);
});

test('rejeita nota sem número', function () {
  const lista = [];
  const dados = dadosValidos();
  dados.numero = '   ';

  const resultado = regras.cadastrarNota(lista, dados);

  assert.strictEqual(resultado.ok, false);
  assert.ok(resultado.erros.includes('Informe o número da nota.'));
  assert.strictEqual(lista.length, 0);
});

test('não permite alterar o status de nota cancelada', function () {
  const lista = [];
  const cadastro = regras.cadastrarNota(lista, dadosValidos());
  const id = cadastro.nota.id;
  regras.alterarStatus(lista, id, 'Cancelada');

  const resultado = regras.alterarStatus(lista, id, 'Paga');

  assert.strictEqual(resultado.ok, false);
  assert.strictEqual(resultado.erro, 'Nota cancelada não pode mudar de status.');
  assert.strictEqual(lista[0].status, 'Cancelada');
});

test('rejeita nota sem emitente', function () {
  const lista = [];
  const dados = dadosValidos();
  dados.emitente = '';

  const resultado = regras.cadastrarNota(lista, dados);

  assert.strictEqual(resultado.ok, false);
  assert.ok(resultado.erros.includes('Informe o emitente.'));
  assert.strictEqual(lista.length, 0);
});

test('rejeita nota sem data de emissão', function () {
  const lista = [];
  const dados = dadosValidos();
  dados.dataEmissao = '';

  const resultado = regras.cadastrarNota(lista, dados);

  assert.strictEqual(resultado.ok, false);
  assert.ok(resultado.erros.includes('Informe a data de emissão.'));
  assert.strictEqual(lista.length, 0);
});

test('rejeita alteração para status inválido', function () {
  const lista = [];
  const cadastro = regras.cadastrarNota(lista, dadosValidos());

  const resultado = regras.alterarStatus(lista, cadastro.nota.id, 'Invalido');

  assert.strictEqual(resultado.ok, false);
  assert.strictEqual(resultado.erro, 'Status inválido.');
  assert.strictEqual(lista[0].status, 'Pendente');
});

test('rejeita alteração de nota inexistente', function () {
  const lista = [];

  const resultado = regras.alterarStatus(lista, 999, 'Paga');

  assert.strictEqual(resultado.ok, false);
  assert.strictEqual(resultado.erro, 'Nota não encontrada.');
});

test('permite alterar nota pendente para paga', function () {
  const lista = [];
  const cadastro = regras.cadastrarNota(lista, dadosValidos());

  const resultado = regras.alterarStatus(lista, cadastro.nota.id, 'Paga');

  assert.strictEqual(resultado.ok, true);
  assert.strictEqual(lista[0].status, 'Paga');
});