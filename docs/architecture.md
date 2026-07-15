# Arquitetura escalavel de automacao

## Camadas

1. Suites de negocio
- Local: cypress/e2e
- Responsabilidade: descrever comportamento esperado em linguagem de dominio.

2. Page Objects
- Local: cypress/support/pages
- Responsabilidade: encapsular seletores e interacoes de UI, reduzindo impacto de mudancas visuais.

3. API Abstraction
- Local: cypress/support/pages/ApiPage.js
- Responsabilidade: encapsular requests e contratos para reuso entre suites.

4. Test Data Layer
- Local: cypress/support/utils/dataFactory.js
- Responsabilidade: gerar massa unica e consistente para execucoes concorrentes.

5. Execution Governance
- Local: cypress/support/commands.js e cypress/support/e2e.js
- Responsabilidade: bootstrap de contexto, isolamento, rastreio e cleanup de dados.

6. Reporting Layer
- Local: scripts/generate-executive-report.js
- Responsabilidade: consolidar resultados tecnicos em indicadores executivos.

## Principios aplicados

- Single Responsibility: cada camada com papel unico e observavel.
- DRY: login, criacao de massa e cleanup centralizados em comandos.
- Escalabilidade horizontal: pipeline em matrix para suites independentes.
- Escalabilidade funcional: novas suites herdam os mesmos mecanismos de data factory e cleanup.

## Fluxo de execucao

1. Quality gate executa lint.
2. Suites API e Frontend executam em paralelo.
3. Relatorios JSON sao consolidados.
4. Relatorio HTML tecnico e executivo sao publicados como artefato.
