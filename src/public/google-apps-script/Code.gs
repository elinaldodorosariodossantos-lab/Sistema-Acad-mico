/**
 * EduControl - Google Apps Script Backend
 * Sistema de Controle de Aulas Escolar
 * 
 * Este script deve ser implantado como uma Aplicação da Web
 * Executar como: Eu
 * Quem tem acesso: Qualquer pessoa
 */

// IDs das planilhas do Google Sheets
const SHEET_IDS = {
  ALUNOS: 'Alunos',
  TURMAS: 'Turmas',
  HORARIOS: 'Horários',
  FREQUENCIA: 'Frequência',
  USUARIOS: 'Usuários',
};

/**
 * Obtém a planilha ativa
 */
function getSheet(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    initializeSheet(sheetName, sheet);
  }
  
  return sheet;
}

/**
 * Inicializa uma nova planilha com headers
 */
function initializeSheet(sheetName, sheet) {
  const headers = {
    [SHEET_IDS.ALUNOS]: [
      'ID',
      'Nome Completo',
      'Data de Nascimento',
      'Responsável',
      'Telefone',
      'Turma',
      'Dias da Aula',
      'Status',
      'Data de Criação',
      'Data de Atualização',
    ],
    [SHEET_IDS.TURMAS]: [
      'ID',
      'Nome da Turma',
      'Professor',
      'Hora de Início',
      'Hora de Término',
      'Horário',
      'Dias da Semana',
      'Quantidade de Alunos',
      'Sala',
      'Data de Criação',
      'Data de Atualização',
    ],
    [SHEET_IDS.FREQUENCIA]: [
      'ID',
      'Data',
      'Turma',
      'Aluno',
      'Presença',
      'Conteúdo Ministrado',
      'Observações',
      'Professor Responsável',
      'Data de Criação',
    ],
    [SHEET_IDS.HORARIOS]: [
      'ID',
      'Hora Inicial',
      'Hora Final',
      'Sala',
      'Data de Criação',
    ],
  };

  if (headers[sheetName]) {
    sheet.getRange(1, 1, 1, headers[sheetName].length).setValues([headers[sheetName]]);
    sheet.getRange(1, 1, 1, headers[sheetName].length)
      .setBackground('#2563eb')
      .setFontColor('#ffffff')
      .setFontWeight('bold');
  }
}

function ensureInitialized() {
  Object.values(SHEET_IDS).forEach(sheetName => {
    getSheet(sheetName);
  });
}

/**
 * Gera um ID único
 */
function generateId() {
  return Utilities.getUuid();
}

/**
 * Converte um array em um objeto com headers como chaves
 */
const PROPERTY_MAP = {
  ID: 'id',
  'Nome Completo': 'nome',
  'Data de Nascimento': 'dataNascimento',
  'Responsável': 'responsavel',
  'Telefone': 'telefone',
  'Turma': 'turma',
  'Dias da Aula': 'diasAula',
  'Status': 'status',
  'Data de Criação': 'createdAt',
  'Data de Atualização': 'updatedAt',
  'Nome da Turma': 'nome',
  'Professor': 'professor',
  'Hora de Início': 'horaInicio',
  'Hora de Término': 'horaFim',
  'Horário': 'horario',
  'Dias da Semana': 'diasSemana',
  'Quantidade de Alunos': 'quantidadeAlunos',
  'Sala': 'sala',
  'Hora Inicial': 'horaInicial',
  'Hora Final': 'horaFinal',
};

function normalizeSheetValue(header, value) {
  if (header === 'Dias da Aula' || header === 'Dias da Semana') {
    if (Array.isArray(value)) return value.join(',');
    return value ? String(value) : '';
  }

  if (header === 'Quantidade de Alunos') {
    const numeric = Number(value);
    return Number.isNaN(numeric) ? 0 : numeric;
  }

  return value ?? '';
}

function rowToObject(row, headers) {
  const obj = {};
  headers.forEach((header, index) => {
    const rawValue = row[index] || '';
    obj[header] = rawValue;

    const mappedKey = PROPERTY_MAP[header] || header;
    obj[mappedKey] = rawValue;

    if (header === 'Dias da Aula' || header === 'Dias da Semana') {
      obj[mappedKey] = String(rawValue || '').split(',').map(item => item.trim()).filter(Boolean);
    }

    if (header === 'Quantidade de Alunos') {
      obj[mappedKey] = Number(rawValue || 0);
    }
  });
  return obj;
}

/**
 * Converte um objeto em um array usando headers como ordem
 */
function objectToRow(obj, headers) {
  return headers.map((header) => {
    const mappedKey = PROPERTY_MAP[header] || header;
    const rawValue = obj[header] ?? obj[mappedKey] ?? '';
    return normalizeSheetValue(header, rawValue);
  });
}

/**
 * ALUNOS - GET ALL
 */
function getAlunos() {
  const sheet = getSheet(SHEET_IDS.ALUNOS);
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    return [];
  }
  
  const headers = data[0];
  const alunos = data.slice(1).map(row => rowToObject(row, headers)).filter(a => a.ID);
  
  return alunos;
}

/**
 * ALUNOS - CREATE
 */
function createAluno(aluno) {
  const sheet = getSheet(SHEET_IDS.ALUNOS);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  aluno.ID = generateId();
  aluno['Data de Criação'] = new Date().toLocaleString();
  aluno['Data de Atualização'] = new Date().toLocaleString();
  
  const row = objectToRow(aluno, headers);
  sheet.appendRow(row);
  
  return aluno;
}

/**
 * ALUNOS - UPDATE
 */
function updateAluno(id, updates) {
  const sheet = getSheet(SHEET_IDS.ALUNOS);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      updates['Data de Atualização'] = new Date().toLocaleString();
      const newRow = objectToRow({ ...rowToObject(data[i], headers), ...updates }, headers);
      sheet.getRange(i + 1, 1, 1, newRow.length).setValues([newRow]);
      return rowToObject(newRow, headers);
    }
  }
  
  throw new Error(`Aluno com ID ${id} não encontrado`);
}

/**
 * ALUNOS - DELETE
 */
function deleteAluno(id) {
  const sheet = getSheet(SHEET_IDS.ALUNOS);
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }
  
  throw new Error(`Aluno com ID ${id} não encontrado`);
}

/**
 * ALUNOS - SEARCH
 */
function searchAlunos(termo) {
  const alunos = getAlunos();
  const searchTerm = termo.toLowerCase();
  
  return alunos.filter(
    aluno =>
      aluno['Nome Completo'].toLowerCase().includes(searchTerm) ||
      aluno['Turma'].toLowerCase().includes(searchTerm)
  );
}

/**
 * TURMAS - GET ALL
 */
function getTurmas() {
  const sheet = getSheet(SHEET_IDS.TURMAS);
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    return [];
  }
  
  const headers = data[0];
  const turmas = data.slice(1).map(row => rowToObject(row, headers)).filter(t => t.ID);
  
  return turmas;
}

/**
 * HORÁRIOS - GET ALL
 */
function getHorarios() {
  const sheet = getSheet(SHEET_IDS.HORARIOS);
  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) {
    return [];
  }

  const headers = data[0];
  const horarios = data.slice(1).map(row => rowToObject(row, headers)).filter(h => h.ID);

  return horarios;
}

/**
 * HORÁRIOS - CREATE
 */
function createHorario(horario) {
  const sheet = getSheet(SHEET_IDS.HORARIOS);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  horario.ID = generateId();
  horario['Data de Criação'] = new Date().toLocaleString();

  const row = objectToRow(horario, headers);
  sheet.appendRow(row);

  return horario;
}

/**
 * HORÁRIOS - UPDATE
 */
function updateHorario(id, updates) {
  const sheet = getSheet(SHEET_IDS.HORARIOS);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      const newRow = objectToRow({ ...rowToObject(data[i], headers), ...updates }, headers);
      sheet.getRange(i + 1, 1, 1, newRow.length).setValues([newRow]);
      return rowToObject(newRow, headers);
    }
  }

  throw new Error(`Horário com ID ${id} não encontrado`);
}

/**
 * HORÁRIOS - DELETE
 */
function deleteHorario(id) {
  const sheet = getSheet(SHEET_IDS.HORARIOS);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }

  throw new Error(`Horário com ID ${id} não encontrado`);
}

/**
 * TURMAS - CREATE
 */
function createTurma(turma) {
  const sheet = getSheet(SHEET_IDS.TURMAS);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  turma.ID = generateId();
  turma['Data de Criação'] = new Date().toLocaleString();
  turma['Data de Atualização'] = new Date().toLocaleString();
  
  const row = objectToRow(turma, headers);
  sheet.appendRow(row);
  
  return turma;
}

/**
 * TURMAS - UPDATE
 */
function updateTurma(id, updates) {
  const sheet = getSheet(SHEET_IDS.TURMAS);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      updates['Data de Atualização'] = new Date().toLocaleString();
      const newRow = objectToRow({ ...rowToObject(data[i], headers), ...updates }, headers);
      sheet.getRange(i + 1, 1, 1, newRow.length).setValues([newRow]);
      return rowToObject(newRow, headers);
    }
  }
  
  throw new Error(`Turma com ID ${id} não encontrada`);
}

/**
 * TURMAS - DELETE
 */
function deleteTurma(id) {
  const sheet = getSheet(SHEET_IDS.TURMAS);
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }
  
  throw new Error(`Turma com ID ${id} não encontrada`);
}

/**
 * FREQUÊNCIA - GET ALL
 */
function getFrequencias() {
  const sheet = getSheet(SHEET_IDS.FREQUENCIA);
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    return [];
  }
  
  const headers = data[0];
  const frequencias = data.slice(1).map(row => rowToObject(row, headers)).filter(f => f.ID);
  
  return frequencias;
}

/**
 * FREQUÊNCIA - GET BY DATA
 */
function getFrequenciaByData(data) {
  const frequencias = getFrequencias();
  return frequencias.filter(f => f.Data === data);
}

/**
 * FREQUÊNCIA - GET BY TURMA
 */
function getFrequenciaByTurma(turmaId) {
  const frequencias = getFrequencias();
  return frequencias.filter(f => f.Turma === turmaId);
}

/**
 * FREQUÊNCIA - CREATE
 */
function createFrequencia(frequencia) {
  const sheet = getSheet(SHEET_IDS.FREQUENCIA);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  frequencia.ID = generateId();
  frequencia['Data de Criação'] = new Date().toLocaleString();
  
  const row = objectToRow(frequencia, headers);
  sheet.appendRow(row);
  
  return frequencia;
}

/**
 * FREQUÊNCIA - REGISTRAR MÚLTIPLA
 */
function registrarMultiplaFrequencia(frequencias) {
  const sheet = getSheet(SHEET_IDS.FREQUENCIA);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  const rows = frequencias.map(freq => {
    freq.ID = generateId();
    freq['Data de Criação'] = new Date().toLocaleString();
    return objectToRow(freq, headers);
  });
  
  if (rows.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
  }
  
  return frequencias;
}

/**
 * DASHBOARD - STATS
 */
function getDashboardStats() {
  const alunos = getAlunos();
  const turmas = getTurmas();
  const frequencias = getFrequencias();
  
  const hoje = new Date().toLocaleDateString('pt-BR');
  const frequenciasHoje = frequencias.filter(f => f.Data === hoje);
  const alunosFaltosos = frequenciasHoje.filter(f => f.Presença === 'Falta').length;
  
  return {
    totalAlunos: alunos.length,
    totalTurmas: turmas.length,
    aulasHoje: frequenciasHoje.length,
    frequenciaHoje: frequenciasHoje.filter(f => f.Presença === 'Presente').length,
    alunosFaltosos: alunosFaltosos,
  };
}

/**
 * Handler principal para requisições GET
 */
function doGet(e) {
  ensureInitialized();
  const action = e.parameter.action;
  
  try {
    switch (action) {
      case 'getAlunos':
        return respondWithJSON(getAlunos());
      case 'searchAlunos':
        return respondWithJSON(searchAlunos(e.parameter.termo));
      case 'getTurmas':
        return respondWithJSON(getTurmas());
      case 'getHorarios':
        return respondWithJSON(getHorarios());
      case 'getFrequencias':
        return respondWithJSON(getFrequencias());
      case 'getFrequenciaByData':
        return respondWithJSON(getFrequenciaByData(e.parameter.data));
      case 'getFrequenciaByTurma':
        return respondWithJSON(getFrequenciaByTurma(e.parameter.turmaId));
      case 'getDashboardStats':
        return respondWithJSON(getDashboardStats());
      default:
        return respondWithError('Ação não reconhecida', 400);
    }
  } catch (error) {
    return respondWithError(error.message, 500);
  }
}

/**
 * Handler principal para requisições POST
 */
function doPost(e) {
  ensureInitialized();
  const action = e.parameter.action;
  const payload = JSON.parse(e.postData.contents);
  
  try {
    switch (action) {
      case 'createAluno':
        return respondWithJSON({ success: true, data: createAluno(payload) });
      case 'updateAluno':
        return respondWithJSON({ success: true, data: updateAluno(payload.id, payload) });
      case 'deleteAluno':
        return respondWithJSON({ success: true, data: deleteAluno(payload.id) });
      
      case 'createTurma':
        return respondWithJSON({ success: true, data: createTurma(payload) });
      case 'updateTurma':
        return respondWithJSON({ success: true, data: updateTurma(payload.id, payload) });
      case 'deleteTurma':
        return respondWithJSON({ success: true, data: deleteTurma(payload.id) });

      case 'createHorario':
        return respondWithJSON({ success: true, data: createHorario(payload) });
      case 'updateHorario':
        return respondWithJSON({ success: true, data: updateHorario(payload.id, payload) });
      case 'deleteHorario':
        return respondWithJSON({ success: true, data: deleteHorario(payload.id) });
      
      case 'createFrequencia':
        return respondWithJSON({ success: true, data: createFrequencia(payload) });
      case 'registrarMultiplaFrequencia':
        return respondWithJSON({
          success: true,
          data: registrarMultiplaFrequencia(payload.frequencias),
        });
      case 'updateFrequencia':
        return respondWithJSON({ success: true, data: updateFrequencia(payload.id, payload) });
      
      default:
        return respondWithError('Ação não reconhecida', 400);
    }
  } catch (error) {
    return respondWithError(error.message, 500);
  }
}

/**
 * Retorna resposta em JSON
 */
function respondWithJSON(data, statusCode = 200) {
  const output = ContentService.createTextOutput(JSON.stringify({
    success: true,
    data: data,
  }));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

/**
 * Retorna erro em JSON
 */
function respondWithError(message, statusCode = 400) {
  const output = ContentService.createTextOutput(JSON.stringify({
    success: false,
    error: message,
  }));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

/**
 * Inicializa as planilhas quando o script é executado pela primeira vez
 */
function initialize() {
  Object.values(SHEET_IDS).forEach(sheetName => {
    getSheet(sheetName);
  });
  Logger.log('Planilhas inicializadas com sucesso!');
}
