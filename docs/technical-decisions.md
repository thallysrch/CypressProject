# Justificativas tecnicas documentadas


## TD-001 - Data Factory centralizada

- Problema: Date.now espalhado nos testes e dados inconsistentes.
- Decisao: camada unica de fabrica de dados com sufixo de execucao e faker.
- Beneficio: padrao unico para usuarios/produtos, menos duplicidade e colisao.
- Risco: dependencia adicional de biblioteca.
- Mitigacao: dependencia leve e consolidada no escopo de testes.

## TD-002 - Cleanup avancado de massa de dados

- Problema: residuos entre cenarios geram flakiness e tornam diagnostico mais dificil.
- Decisao: registrar ids criados durante o teste e limpar no afterEach.
- Beneficio: independencia entre cenarios e repetibilidade da execucao.
- Risco: cleanup falhar quando token expira.
- Mitigacao: refresh de token via login API no momento do cleanup.

## TD-003 - Quality gate antes da execucao E2E

- Problema: falhas basicas de padrao chegam tardiamente no pipeline.
- Decisao: executar lint como job de bloqueio antes dos testes.
- Beneficio: feedback rapido e reducao de custo computacional do CI.
- Risco: falso positivo de regra muito restritiva.
- Mitigacao: regras calibradas para contexto Cypress.

## TD-005 - Relatorio executivo

- Problema: relatorio tecnico puro nem sempre e consumivel por lideranca.
- Decisao: gerar sumario executivo com KPI de qualidade e top falhas.
- Beneficio: comunicacao objetiva para decisao de release.
- Risco: perda de detalhe tecnico.
- Mitigacao: manter relatorio tecnico completo em paralelo.
