# Instalação do EDUKAR XP

## Pré-requisitos

- Node.js 20 ou superior
- npm
- Uma conta e um projeto no Supabase

## 1. Instalar dependências

Na raiz do projeto, execute `npm install`.

## 2. Configurar o Supabase

Abra o SQL Editor do projeto Supabase e execute, nesta ordem:

1. `supabase/schema.sql`
2. `supabase/alunos_dados.sql`
3. `supabase/financeiro.sql`

Esses scripts criam as tabelas, relacionamentos, índices, gatilhos e políticas necessárias.

## 3. Configurar o ambiente

Crie um arquivo `.env` com base no `.env.example`:

```env
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANONIMA
```

Encontre esses valores no painel do Supabase em **Project Settings > API**. Use somente a chave pública/anon no frontend. Nunca adicione uma chave `service_role` ao projeto React.

## 4. Executar e validar

- Desenvolvimento: `npm run dev`
- Build de produção: `npm run build`
- Pré-visualização: `npm run preview`

## Solução de problemas

### Supabase não configurado

Confira as duas variáveis do `.env` e reinicie o servidor após qualquer alteração.

### Tabela ou coluna não encontrada

Execute novamente os scripts da pasta `supabase` na ordem indicada.

### Operação bloqueada

Revise no Supabase as políticas de Row Level Security definidas pelos scripts SQL e confirme que o schema remoto está atualizado.

## Arquitetura de dados

O frontend inicializa o Supabase em `src/lib/supabase.ts`. As operações dos módulos acadêmicos e financeiros ficam centralizadas em `src/services/api.ts`.
