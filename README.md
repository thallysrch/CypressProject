# Cypress Automation

Projeto de automacao E2E/API com foco em execucao confiavel em pipeline, arquitetura evolutiva e qualidade tecnica verificavel.

## Objetivos tecnicos

- Estrategia de execucao em pipeline com quality gate e paralelismo por dominio (API e Frontend).
- Arquitetura escalavel com Page Objects, Data Factory e comandos de governanca.
- Controle avancado de massa de dados com criacao dinamica, rastreio e cleanup automatico.
- Testes independentes com isolamento explicito e credenciais administrativas explicitamente configuradas.
- Relatorios executivos com consolidacao de indicadores e publicacao em artefatos de CI.
- Integracao com ferramentas de qualidade (ESLint + Cypress plugin).
- Justificativas tecnicas documentadas para manutencao de longo prazo.

## Estrutura tecnica

- cypress/e2e: suites por contexto funcional.
- cypress/support/pages: camada Page Object.
- cypress/support/utils/dataFactory.js: fabrica de dados unicos e reusaveis.
- cypress/support/commands.js: comandos de login e cleanup de massa.
- scripts/generate-executive-report.js: converte relatorio bruto em visao executiva.
- .github/workflows/ci.yml: pipeline de qualidade + execucao paralela + consolidacao de relatorios.

## Prerequisitos

- Node.js 18+
- npm 9+

## Setup local

1. Instale dependencias:

```bash
npm ci
```

2. Obrigatorio: antes de rodar os testes, crie um novo usuario admin na aplicacao e use uma nova senha.

Importante: essas credenciais possuem validade limitada e precisam ser atualizadas com frequencia (local e CI).

3. Crie um cypress.env.json na raiz com as credenciais atuais:

```json
{
	"API_URL": "https://serverest.dev",
	"BASE_URL": "https://front.serverest.dev",
	"ADMIN_EMAIL": "admin@example.com",
	"ADMIN_PASSWORD": "Senha123!",
	"ADMIN_NAME": "QA Admin"
}
```

4. Sempre que o usuario/senha expirarem, atualize os valores em:

- cypress.env.json (execucao local)
- secrets ADMIN_EMAIL, ADMIN_PASSWORD e ADMIN_NAME no GitHub (execucao em pipeline)

## Execucao

Todos os comandos abaixo geram automaticamente os relatorios HTML ao final da execucao (inclusive quando houver testes falhando):

- cypress/reports/report.html
- cypress/reports/executive-report.html
- cypress/reports/executive-summary.md

```bash
npm run cypress:open
```

```bash
npm run cypress:run
```

```bash
npm run cypress:run:api
```

```bash
npm run cypress:run:frontend
```

## Qualidade e relatorios

```bash
npm run quality:check
```

```bash
npm run report:full
```

Observacao: report:full usa o mesmo fluxo do cypress:run e tambem gera os HTMLs automaticamente.

Artefatos gerados:

- cypress/reports/report.html
- cypress/reports/executive-report.html
- cypress/reports/executive-summary.md

## Pipeline

Workflow em .github/workflows/ci.yml:

- Job 1: quality-gate (lint estatico).
- Job 2: cypress-run em matrix por suite (api e frontend).
- Job 3: merge-reports para consolidar e publicar relatorios.

## Decisoes tecnicas (resumo)

- Credencial explicita e rotativa: melhora rastreabilidade e governanca em ambientes com validade limitada.
- Data Factory centralizada: padroniza payloads e evita conflitos de unicidade.
- Cleanup automatico de massa: diminui acoplamento entre cenarios e mantem ambiente limpo.
- Test isolation explicito: reduz risco de falso positivo por estado residual.
- Executive reporting: traduz resultado tecnico em KPI acionavel para lideranca.

Detalhamento completo em docs/architecture.md e docs/technical-decisions.md.
