# Testes automatizados e validação da pipeline CI

## Testes automatizados

Inicialmente, o projeto possuía cinco testes automatizados
para verificar as principais regras de negócio do sistema
de controle de notas fiscais.

Minha contribuição foi ampliar a quantidade de testes de
cinco para dez, buscando verificar outros cenários que
ainda não estavam sendo testados.

Os cinco novos testes implementados foram:

- Rejeitar o cadastro de uma nota sem emitente;
- Rejeitar o cadastro de uma nota sem data de emissão;
- Rejeitar a alteração para um status inválido;
- Rejeitar a alteração de uma nota inexistente;
- Permitir a alteração de uma nota pendente para paga.

Os testes foram implementados no arquivo
`tests/notas.test.js` e executados através do comando
`npm test`.

Após a implementação, todos os dez testes passaram,
tanto no ambiente local quanto no GitHub Actions.

## Simulação de falha na pipeline CI

Para verificar se a pipeline conseguia identificar
problemas no código, criei uma branch separada chamada
`feature/simular-falha-ci`.

Nessa branch, alterei propositalmente o status inicial
das notas fiscais de Pendente para Emitida, no arquivo
`src/js/notas.js`.

Ao executar novamente os testes, oito passaram e dois
falharam. Em seguida, realizei um commit e abri o
Pull Request #7, permitindo que o GitHub Actions
executasse os testes automaticamente.

A pipeline identificou a falha e apresentou um
resultado de erro.

## Correção da falha

Após registrar as evidências da falha, corrigi o código,
retornando o status inicial para Pendente.

Executei novamente os testes no ambiente local e enviei
a correção para o GitHub. A pipeline foi executada
novamente e todos os dez testes passaram.

A simulação foi realizada em uma branch separada,
sem integrar o código com falha à branch main.

## Resultados

| Etapa | Testes | Aprovados | Falhas |
|---|---|---|---|
| Testes iniciais | 5 | 5 | 0 |
| Ampliação dos testes | 10 | 10 | 0 |
| Simulação de falha | 10 | 8 | 2 |
| Após a correção | 10 | 10 | 0 |

Com essa atividade, foi possível verificar na prática
como os testes automatizados e a integração contínua
auxiliam na identificação de problemas no código.

## Bloqueio da publicação no CD

Para verificar o funcionamento do CD, foi realizada uma alteração
proposital no código, modificando o status inicial das notas
fiscais de Pendente para Emitida.

A alteração foi enviada para a branch main, fazendo com que
dois dos dez testes automatizados falhassem. Com isso, a
pipeline CD apresentou falha e a etapa de publicação no
GitHub Pages não foi executada.

Em seguida, foi utilizado o comando git revert para desfazer
a alteração. Após o envio da correção, os testes passaram
novamente e a publicação foi realizada com sucesso.

Dessa forma, foi possível comprovar que a pipeline impede
a publicação de uma versão que apresenta falhas nos testes.

## Evidências

- [Testes iniciais](testes/04-testes-iniciais.png)
- [Testes ampliados](testes/05-testes-ampliados.png)
- [Execução da CI](testes/06-ci-testes-ampliados.png)
- [Falha local](testes/07-falha-testes-locais.png)
- [Pull Request com falha](testes/08-pull-request-falha.png)
- [Falha na CI](testes/09-ci-falha.png)
- [Testes corrigidos](testes/10-testes-corrigidos.png)
- [Pull Request corrigido](testes/11-pull-request-corrigido.png)
- [Recuperação da CI](testes/12-ci-recuperada.png)
- [Histórico das pipelines](testes/13-historico-pipelines.png)
- [Publicação bloqueada no CD](testes/14-cd-publicacao-bloqueada.png)
- [Publicação restaurada no CD](testes/15-cd-publicacao-restaurada.png)