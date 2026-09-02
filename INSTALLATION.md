# GUIA DE INSTALAÇÃO E DEPLOYMENT - EduControl

## 🚀 Início Rápido

### Requisitos Mínimos
- Node.js 16 ou superior
- npm 7 ou superior
- Conta Google (para Google Sheets)
- Navegador moderno (Chrome, Firefox, Safari, Edge)

### Instalação em 5 Minutos

1. **Clone ou extraia o projeto**
```bash
cd controle-aula-app
```

2. **Instale as dependências**
```bash
npm install
```

3. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

4. **Abra no navegador**
- URL: `http://localhost:5173`
- O navegador abrirá automaticamente

## 📊 Configuração do Google Sheets

### Passo 1: Criar a Planilha Google

1. Acesse [Google Sheets](https://sheets.google.com)
2. Clique em "Criar" → "Planilha em branco"
3. Nomeie como **"EduControl"**
4. Compartilhe com sua conta de desenvolvimento (se necessário)

### Passo 2: Configurar o Google Apps Script

1. **Abra o Editor de Scripts**
   - Na planilha, vá em "Extensões" → "Apps Script"
   
2. **Copie o Código do Backend**
   - Abra o arquivo `src/public/google-apps-script/Code.gs`
   - Copie todo o conteúdo
   
3. **Cole no Editor do Apps Script**
   - Delete qualquer código existente no editor
   - Cole o código do `Code.gs`
   - Clique em "Salvar" (Ctrl+S)
   
4. **Execute a Função de Inicialização**
   - Na lista de funções, selecione `initialize`
   - Clique no botão "Executar" (ícone play)
   - Autorize o script com sua conta Google
   - Aguarde a conclusão

### Passo 3: Implantar como Aplicação da Web

1. **Crie uma Nova Implantação**
   - Clique em "Executar" → "Nova teste"  
   - OU clique em "Implantar" → "Nova implantação"
   
2. **Configure a Implantação**
   - **Tipo de implantação**: Selecione "Aplicação da Web"
   - **Executar como**: Selecione sua conta Google
   - **Quem tem acesso**: Selecione "Qualquer pessoa"
   
3. **Complete a Implantação**
   - Clique em "Implantar"
   - Copie a URL fornecida (exemplo):
   ```
   https://script.google.com/macros/d/1xxx...yyy.../usercodeapp
   ```

### Passo 4: Configurar o Projeto

1. **Edite o arquivo `.env`**
   ```bash
   VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/d/SEU_DEPLOYMENT_ID/usercodeapp
   ```

2. **Substitua `SEU_DEPLOYMENT_ID`** com o ID da sua implantação

3. **Reinicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

## 🧪 Testando a Integração

### Verificar Conexão

1. **Abra o Dashboard**
   - Navegue para `http://localhost:5173`
   - Você deve ver "Carregando dados..."

2. **Criar um Aluno de Teste**
   - Vá para "Alunos"
   - Clique em "Novo Aluno"
   - Preencha os dados:
     - Nome: "João Silva"
     - Data: "2010-01-15"
     - Responsável: "Maria Silva"
     - Telefone: "(11) 99999-9999"
     - Turma: "5º A"
     - Status: "Ativo"
   - Clique em "Criar"

3. **Verifique o Google Sheets**
   - Volte para a planilha Google
   - Abra a aba "Alunos"
   - O aluno deve aparecer na primeira linha (após headers)

## 📦 Build para Produção

### Compilar o Projeto

```bash
npm run build
```

Isso criará uma pasta `dist/` com os arquivos otimizados.

### Estrutura do Build

```
dist/
├── index.html          # Arquivo HTML principal
├── assets/
│   ├── *.js           # Arquivos JavaScript
│   ├── *.css          # Arquivos CSS
│   └── *.svg          # Ícones e assets
```

### Deploy em Servidor

#### Opção 1: GitHub Pages
```bash
npm run build
# Faça upload da pasta `dist/` para o GitHub Pages
```

#### Opção 2: Vercel
```bash
# Instale o CLI do Vercel
npm i -g vercel

# Deploy automático
vercel
```

#### Opção 3: Netlify
```bash
# Instale o CLI do Netlify
npm i -g netlify-cli

# Deploy automático
netlify deploy --prod --dir=dist
```

#### Opção 4: Servidor Próprio
```bash
# Copie a pasta dist/ para seu servidor web
# Configure o servidor para servir index.html em todas as rotas (SPA)
```

## 🔐 Segurança em Produção

### Checklist de Segurança

- [ ] Configurar autenticação OAuth 2.0
- [ ] Adicionar validação de entradas no Apps Script
- [ ] Implementar rate limiting
- [ ] Usar HTTPS em produção
- [ ] Adicionar CORS adequadamente
- [ ] Implementar logging e auditoria
- [ ] Configurar backup automático do Sheets
- [ ] Adicionar permissões granulares de usuários

### Exemplo de Autenticação

Para adicionar autenticação, você pode usar:
- Google Sign-In
- Firebase Authentication
- Auth0
- Microsoft Entra ID

## 🐛 Troubleshooting

### Erro: "Script não está autorizado"
**Solução:**
1. Vá para o Apps Script
2. Clique em "Executar" → `initialize`
3. Autorize quando a janela aparecer
4. Implante novamente

### Erro: "CORS error"
**Solução:**
1. Verifique se a URL do Apps Script está correta no `.env`
2. Certifique-se de que o Apps Script foi implantado como "Aplicação da Web"
3. Verifique se "Quem tem acesso" está configurado para "Qualquer pessoa"

### Dados não aparecem no Sheets
**Solução:**
1. Verifique a função `initialize()` nos logs do Apps Script
2. Confirme que a planilha "Alunos" existe
3. Limpe o cache do navegador (Ctrl+Shift+Delete)
4. Verifique permissões de escrita na planilha

### Aplicação não carrega
**Solução:**
1. Abra o Console do Navegador (F12)
2. Procure por erros em vermelho
3. Verifique se o servidor está rodando (`npm run dev`)
4. Verifique a URL de conexão no `.env`

## 📚 Estrutura de Dados do Google Sheets

### Planilha: ALUNOS

| ID | Nome Completo | Data Nascimento | Responsável | Telefone | Turma | Dias Aula | Status |
|----|---|---|---|---|---|---|---|
| UUID | Text | Date | Text | Text | Text | Text | "Ativo"/"Inativo" |

### Planilha: TURMAS

| ID | Nome Turma | Professor | Horário | Dias Semana | Quantidade | Sala |
|----|---|---|---|---|---|---|

### Planilha: FREQUÊNCIA

| ID | Data | Turma | Aluno | Presença | Conteúdo | Observações | Professor |
|----|---|---|---|---|---|---|---|

## 🎓 Exemplos de Uso

### Registrar Frequência
1. Vá para "Frequência"
2. Selecione a data e turma
3. Marque presença/falta dos alunos
4. Digite o conteúdo da aula
5. Clique "Salvar Frequência"

### Gerar Relatórios
1. (Em desenvolvimento) Acesse "Relatórios"
2. Selecione filtros desejados
3. Clique "Gerar Relatório"
4. Exporte em PDF ou Excel

## 📞 Suporte e Contato

Para problemas ou sugestões:
- Abra uma issue no repositório
- Consulte a documentação do README.md
- Verifique o log do console (F12)

## 🔄 Atualizações Futuras

Planejado para próximas versões:
- Sistema de autenticação completo
- Relatórios avançados
- Integração com WhatsApp
- App mobile nativo
- Sincronização offline
- Importação de dados (CSV/Excel)
- Webhooks e notificações

---

**Versão**: 1.0.0  
**Última Atualização**: Maio 2026  
**Desenvolvido com ❤️ para educadores**
