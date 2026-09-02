alter table public.alunos
  add column if not exists cpf text,
  add column if not exists cpf_responsavel text,
  add column if not exists endereco text,
  add column if not exists bairro text,
  add column if not exists cidade text,
  add column if not exists estado text,
  add column if not exists email text;

create unique index if not exists alunos_cpf_unique_idx
  on public.alunos (regexp_replace(cpf, '[^0-9]', '', 'g'))
  where cpf is not null and cpf <> '';

create index if not exists alunos_email_idx
  on public.alunos (lower(email));
