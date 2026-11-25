# ControlaNF

Aplicação web simples para controle de notas fiscais, desenvolvida no projeto prático Operação Deploy da disciplina ES46B — Gerência de Configuração e Manutenção de Software (UTFPR).

Aplicação publicada: https://0l1mpus.github.io/controlanf/

## Integrantes

- Bruno Oliveira de Campos: Repositório e integração, aplicação, testes iniciais e script de build
- Joao Pedro Marques Domingos: Pipeline de CI e CD (GitHub Actions e GitHub Pages)
- Romulo Augusto Custodio Souza: Ampliação dos testes e simulação de falha e recuperação

## Objetivo

Problema: em pequenas operações, o controle de notas fiscais costuma ficar em planilhas soltas, e é difícil saber quais notas estão pendentes, pagas ou canceladas.

Aplicação simples para cadastro de notas fiscais, controle de status e armazenamento de informações.

O foco do projeto não é a complexidade do sistema, e sim o processo de versionamento, integração contínua, testes automatizados e entrega contínua.

## Tecnologias

- HTML, CSS e JavaScript: Interface e regras da aplicação
- localStorage do navegador: Armazenamento dos dados
- Node.js e node:test: Execução do build e dos testes automatizados
- Git e GitHub: Controle de versão, branches e pull requests
- GitHub Actions: Pipeline de CI e CD
- GitHub Pages: Publicação da aplicação

## Como executar

Pela internet: acesse https://0l1mpus.github.io/controlanf/

Localmente:

1. Clone o repositório: "git clone https://github.com/0l1mpus/controlanf.git"
2. Abra o arquivo "src/index.html" no navegador

Para rodar o build e os testes (requer Node.js):

```
npm run build
npm test
```

## Pipeline

- CI (ci.yml) roda quando é feito push na main e pull request para a main e tem as seguintes etapas:  Instala dependências, build (`npm run build`) e testes (`npm test`)
- CD (cd.yml) roda somente no Push na main e tem as seguintes etapas: Build, testes e, somente se passarem, gera o artefato (pasta `src`) e publica no GitHub Pages

O build verifica se os arquivos necessários existem e se o JavaScript não tem erros de sintaxe. Se o build ou qualquer teste falhar, o job é interrompido e as etapas de publicação não são executadas: a versão com falha não chega ao site.

## Funcionalidades

- Cadastrar nota fiscal (número, emitente, data de emissão e valor)
- Listar as notas cadastradas
- Alterar o status da nota (Pendente, Emitida, Paga, Cancelada)

Validações: número e emitente obrigatórios, data de emissão obrigatória e não futura, valor maior que zero, status somente entre os quatro válidos e nota cancelada não pode mudar de status.

## Testes

Os testes estão em "tests/notas.test.js" e são executados com "npm test". São 10 testes sobre as regras reais da aplicação:

1. Cadastra nota válida com status Pendente
2. Rejeita nota com valor zero ou negativo
3. Rejeita nota com data de emissão futura
4. Rejeita nota sem número
5. Não permite alterar o status de nota cancelada
6. Rejeita nota sem emitente
7. Rejeita nota sem data de emissão
8. Rejeita alteração para status inválido
9. Rejeita alteração de nota inexistente
10. Permite alterar nota pendente para paga

## Entrega e publicação

A cada alteração integrada à main, o workflow de CD valida a versão (build e testes), gera o artefato de entrega com a pasta "src" e publica no GitHub Pages. Uma versão reprovada nos testes não é publicada, e o site permanece na última versão aprovada.

## Limitações conhecidas

- Os dados ficam no localStorage do navegador: não são compartilhados entre usuários nem dispositivos.
- Não há edição completa nem exclusão de notas.
- Não há validação de CNPJ nem emissão de nota fiscal real.

