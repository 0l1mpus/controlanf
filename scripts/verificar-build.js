const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ARQUIVOS_OBRIGATORIOS = [
  'src/index.html',
  'src/css/style.css',
  'src/js/notas.js',
  'src/js/app.js'
];

let problemas = 0;

for (let i = 0; i < ARQUIVOS_OBRIGATORIOS.length; i++) {
  const nome = ARQUIVOS_OBRIGATORIOS[i];
  const caminho = path.join(__dirname, '..', nome);

  if (!fs.existsSync(caminho)) {
    console.log('FALTANDO  ' + nome);
    problemas++;
    continue;
  }

  if (nome.endsWith('.js')) {
    try {
      new vm.Script(fs.readFileSync(caminho, 'utf8'), { filename: nome });
    } catch (erro) {
      console.log('ERRO      ' + nome + ' -> ' + erro.message);
      problemas++;
      continue;
    }
  }

  console.log('OK        ' + nome);
}

if (problemas > 0) {
  console.log('Build falhou: ' + problemas + ' problemas encontrados');
  process.exit(1);
}

console.log('Build concluído: arquivos presentes e JavaScript sem erros de sintaxe.');
