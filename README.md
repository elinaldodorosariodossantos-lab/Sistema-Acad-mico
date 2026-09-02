# EDUKAR XP — Sistema Acadêmico

Sistema web para gerenciamento de alunos, turmas, horários, frequência, relatórios e mensalidades. A aplicação é desenvolvida em React com TypeScript e utiliza exclusivamente o Supabase como backend e banco de dados.

## Tecnologias

- React e TypeScript
- Vite
- Supabase Database e Supabase JS
- React Router e Zustand
- jsPDF e jsPDF AutoTable

## Instalação rápida

1. Instale as dependências com `npm install`.
2. Copie `.env.example` para `.env` e preencha:

```env
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANONIMA
```

3. No SQL Editor do Supabase, execute nesta ordem:

```text
supabase/schema.sql
supabase/alunos_dados.sql
supabase/financeiro.sql
```

4. Inicie com `npm run dev`.

## Scripts

- `npm run dev`: inicia o ambiente de desenvolvimento.
- `npm run build`: valida o TypeScript e gera a versão de produção.
- `npm run preview`: visualiza a versão de produção.

## Persistência

Todas as leituras e gravações são realizadas pelo cliente Supabase em `src/services/api.ts`. As tabelas, relacionamentos, índices, gatilhos e políticas de acesso estão nos arquivos da pasta `supabase`.

As credenciais reais devem permanecer somente no arquivo `.env`, que não é versionado.

## Módulos

- Dashboard
- Alunos
- Turmas
- Horário semanal
- Frequência
- Relatórios e exportações
- Financeiro

Consulte [INSTALLATION.md](INSTALLATION.md) para instruções detalhadas.
