# EduControl - Sistema de Controle de Aulas Escolar

## 📚 Sobre o Projeto

EduControl é um sistema web completo de gestão de aulas e frequência escolar, desenvolvido com React.js e integrado ao Google Sheets via Google Apps Script. O sistema foi projetado para professores e coordenadores escolares com foco em produtividade, organização e facilidade de uso.

## ✨ Funcionalidades Principais

### 1. **Dashboard Inteligente**
- Estatísticas em tempo real
- Total de alunos e turmas
- Aulas do dia
- Taxa de frequência
- Alunos faltosos
- Próximas aulas

### 2. **Cadastro de Alunos**
- Criar, editar e deletar alunos
- Busca e filtro por turma
- Registro de responsável e telefone
- Status ativo/inativo
- Dias das aulas semanais

### 3. **Cadastro de Turmas**
- Gerenciar turmas
- Definir professor e horários
- Estabelecer dias da semana
- Quantidade de alunos
- Integração com alunos

### 4. **Controle de Frequência**
- Interface otimizada para registro rápido
- Marcação de presença/falta
- Registro de conteúdo ministrado
- Observações por aula
- Salvar múltiplas frequências em tempo real

### 5. **Design Moderno e Responsivo**
- Interface intuitiva e profissional
- Modo escuro/claro
- Responsivo para dispositivos móveis
- Ícones intuitu- Paleta de cores educacional (azul, branco, tons suaves)
- Animações suaves

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - UI library
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **React Router** - Roteamento
- **Zustand** - Gerenciamento de estado
- **Axios** - HTTP client
- **React Icons** - Ícones SVG
- **Date-fns** - Manipulação de datas

### Backend
- **Google Apps Script** - Serverless backend
- **Google Sheets** - Banco de dados

### Estilos
- **CSS3** - Estilização moderna
- **CSS Variables** - Temas e customização

## 📋 Estrutura de Pastas

```
controle-aula-app/
├── src/
│   ├── components/
│   │   ├── common/           # Componentes reutilizáveis
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Notification.tsx
│   │   └── pages/            # Páginas principais
│   │       ├── Dashboard.tsx
│   │       ├── Alunos.tsx
│   │       ├── Turmas.tsx
│   │       └── Frequencia.tsx
│   ├── context/              # Context API/Zustand
│   │   └── AppContext.ts
│   ├── hooks/                # Custom hooks
│   │   ├── useAlunos.ts
│   │   ├── useTurmas.ts
│   │   └── useFrequencia.ts
│   ├── services/             # Serviços de API
│   │   └── api.ts
│   ├── styles/               # Estilos globais
│   │   └── globals.css
│   ├── types/                # TypeScript types
│   │   └── index.ts
│   ├── utils/                # Utilitários
│   ├── public/               # Arquivos públicos
│   │   └── google-apps-script/
│   │       └── Code.gs       # Google Apps Script
│   ├── App.tsx               # Componente raiz
│   └── main.tsx              # Entry point
├── index.html                # HTML principal
├── vite.config.ts            # Configuração Vite
├── tsconfig.json             # Configuração TypeScript
├── .env                       # Variáveis de ambiente
└── package.json              # Dependências do projeto
```

## 🚀 Como Configurar

### 1. Pré-requisitos
- Node.js 16+ instalado
- npm ou yarn
- Conta Google (para Google Sheets e Apps Script)

### 2. Instalar Dependências

```bash
cd controle-aula-app
npm install
```

### 3. Configurar Google Sheets e Apps Script

#### Passo 1: Criar uma Nova Planilha Google
1. Acesse [Google Sheets](https://sheets.google.com)
2. Clique em "Criar" → "Planilha em branco"
3. Nomeie como "EduControl"
4. Copie o ID da planilha da URL

#### Passo 2: Configurar o Google Apps Script
1. Na planilha, clique em "Extensões" → "Apps Script"
2. Exclua qualquer código existente
3. Copie todo o código de `src/public/google-apps-script/Code.gs`
4. Cole no editor do Apps Script
5. Clique em "Salvar" (ícone de disquete)
6. Clique em "Executar" → Selecione `initialize`
7. Autorize o script com sua conta Google

#### Passo 3: Implantar como Aplicação da Web
1. Clique em "Executar" → "Novo teste" ou "Implantar" → "Nova implantação"
2. Selecione "Tipo" → "Aplicação da Web"
3. Configure:
   - "Executar como": Sua conta
   - "Quem tem acesso": "Qualquer pessoa"
4. Clique em "Implantar"
5. Copie o URL fornecido (ex: `https://script.google.com/macros/d/ABC123.../usercodeapp`)

#### Passo 4: Configurar URL no Projeto
1. Abra o arquivo `.env`
2. Atualize `VITE_GOOGLE_APPS_SCRIPT_URL` com a URL copiada:
```
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/d/SEU_DEPLOYMENT_ID/usercodeapp
```

### 4. Executar o Projeto

```bash
npm run dev
```

O projeto abrirá automaticamente em `http://localhost:5173`

## 🎨 Tema e Cores

### Paleta de Cores Principal
- **Azul Primário**: `#2563eb` - Ações e destaques
- **Verde**: `#10b981` - Sucesso e presença
- **Vermelho**: `#ef4444` - Alertas e faltas
- **Amarelo**: `#f59e0b` - Avisos
- **Cinzas**: Escala para texto e fundos

### Modo Escuro
- Automático com alternância via botão na Header
- Salvo em localStorage
- Transições suaves

## 📊 Estrutura das Planilhas Google Sheets

### Planilha: ALUNOS
| ID | Nome Completo | Data de Nascimento | Responsável | Telefone | Turma | Dias da Aula | Status |
|----|---|---|---|---|---|---|---|

### Planilha: TURMAS
| ID | Nome da Turma | Professor | Horário | Dias da Semana | Quantidade de Alunos | Sala |
|----|---|---|---|---|---|---|

### Planilha: FREQUÊNCIA
| ID | Data | Turma | Aluno | Presença | Conteúdo Ministrado | Observações | Professor Responsável |
|----|---|---|---|---|---|---|---|

### Planilha: HORÁRIOS
| ID | Hora Inicial | Hora Final | Sala |
|----|---|---|---|

## 🔌 API Reference

Todas as requisições são feitas para o Google Apps Script.

### GET Requests

#### Get All Students
```
?action=getAlunos
```

#### Search Students
```
?action=searchAlunos&termo=Maria
```

#### Get All Classes
```
?action=getTurmas
```

#### Get All Attendance
```
?action=getFrequencias
```

#### Get Attendance by Date
```
?action=getFrequenciaByData&data=2026-05-21
```

#### Get Attendance by Class
```
?action=getFrequenciaByTurma&turmaId=classId123
```

#### Get Dashboard Stats
```
?action=getDashboardStats
```

### POST Requests

#### Create Student
```json
{
  "action": "createAluno",
  "body": {
    "nome": "João Silva",
    "dataNascimento": "2010-05-15",
    "responsavel": "Maria Silva",
    "telefone": "(11) 99999-9999",
    "turma": "5º A",
    "diasAula": ["Segunda", "Quarta"],
    "status": "Ativo"
  }
}
```

#### Update Student
```json
{
  "action": "updateAluno",
  "id": "student-id-123",
  "nome": "João Silva",
  "status": "Inativo"
}
```

#### Delete Student
```json
{
  "action": "deleteAluno",
  "id": "student-id-123"
}
```

(Similar para Turmas e Frequência)

## 📱 Responsividade

O projeto é totalmente responsivo e funciona em:
- Desktop (1920px+)
- Tablets (768px - 1024px)
- Smartphones (até 767px)

## ⌨️ Atalhos de Teclado

- `ESC` - Fechar modais
- `Ctrl+/` - Busca
- `Ctrl+D` - Abrir dashboard

## 🔒 Segurança

⚠️ **Importante**: Para um ambiente de produção, considere:

1. Implementar autenticação adequada
2. Usar variáveis de ambiente para sensibilidades
3. Validar entradas no Apps Script
4. Limitar permissões dos usuários
5. Implementar audit logs
6. Usar OAuth 2.0 para integração

## 🐛 Troubleshooting

### Erro: "Falha ao conectar com Google Sheets"
- Verifique se o URL do Apps Script está correto no `.env`
- Certifique-se de que o Apps Script foi implantado

### Erro: "Planilha não encontrada"
- Execute a função `initialize()` no Apps Script
- Verifique se o arquivo `Code.gs` está correto

### Dados não salvando
- Verifique permissões da planilha Google
- Confirme se o Apps Script tem permissão para editar

## 📚 Documentação Adicional

- [React Documentation](https://react.dev)
- [Google Apps Script Guide](https://developers.google.com/apps-script)
- [Vite Guide](https://vitejs.dev)

## 📝 Licença

Este projeto é fornecido como está para fins educacionais e de produção escolar.

## 🤝 Contribuições

Contribuições são bem-vindas! Abra uma issue ou envie um pull request.

## 📧 Contato

Para dúvidas ou sugestões sobre o EduControl, entre em contato através de issues do repositório.

---

**Desenvolvido com ❤️ para educadores e coordenadores escolares**
