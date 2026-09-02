import React, { useMemo, useState } from 'react';
import { FiDownload, FiFileText, FiGrid } from 'react-icons/fi';
import { Card } from '../common';
import { useAlunos } from '../../hooks/useAlunos';
import { useTurmas } from '../../hooks/useTurmas';
import { useFrequencia } from '../../hooks/useFrequencia';
import './Relatorios.css';

const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const anos = Array.from({ length: 7 }, (_, index) => new Date().getFullYear() - 3 + index);
const presente = (valor: unknown) => String(valor ?? '').trim().toLowerCase() === 'presente';
const falta = (valor: unknown) => ['falta', 'ausente'].includes(String(valor ?? '').trim().toLowerCase());
const percentual = (presencas: number, faltas: number) => {
  const total = presencas + faltas;
  return total ? (presencas / total) * 100 : 0;
};
const formatarPercentual = (valor: number) => `${valor.toFixed(2).replace('.', ',')}%`;
const formatarData = (valor?: string) => valor
  ? new Date(`${valor}T00:00:00`).toLocaleDateString('pt-BR')
  : 'Não informada';

export const Relatorios: React.FC = () => {
  const { alunos } = useAlunos();
  const { turmas } = useTurmas();
  const { frequencias } = useFrequencia();
  const hoje = new Date();
  const [mes, setMes] = useState(hoje.getMonth() + 1);
  const [ano, setAno] = useState(hoje.getFullYear());
  const [tipoRelatorio, setTipoRelatorio] = useState<'geral' | 'aluno' | 'turma'>('geral');
  const [alunoSelecionado, setAlunoSelecionado] = useState('Todos');
  const [pesquisaAluno, setPesquisaAluno] = useState('');
  const [turmaSelecionada, setTurmaSelecionada] = useState('Todas');
  const [resumoAberto, setResumoAberto] = useState(false);

  const alunosOrdenados = useMemo(() => [...alunos].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')), [alunos]);
  const alunosPesquisados = useMemo(() => {
    const termo = pesquisaAluno.trim().toLocaleLowerCase('pt-BR');
    if (!termo) return alunosOrdenados;
    return alunosOrdenados.filter((aluno) => aluno.nome.toLocaleLowerCase('pt-BR').includes(termo));
  }, [alunosOrdenados, pesquisaAluno]);
  const turmasOrdenadas = useMemo(() => [...turmas].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')), [turmas]);
  const nomeTurma = (valor?: string) => turmas.find((turma) => turma.id === valor || turma.nome === valor)?.nome ?? valor ?? 'Não definida';

  const frequenciasDoPeriodo = useMemo(() => frequencias.filter((registro) => {
    if (!registro.data) return false;
    const [registroAno, registroMes] = registro.data.split('-').map(Number);
    return registroAno === ano && registroMes === mes;
  }), [ano, frequencias, mes]);

  const frequenciasFiltradas = useMemo(() => frequenciasDoPeriodo.filter((registro) => {
    const alunoOk = tipoRelatorio !== 'aluno' || alunoSelecionado === 'Todos' || registro.aluno === alunoSelecionado;
    const turmaOk = tipoRelatorio !== 'turma' || turmaSelecionada === 'Todas' || registro.turma === turmaSelecionada || nomeTurma(registro.turma) === turmaSelecionada;
    return alunoOk && turmaOk;
  }), [alunoSelecionado, frequenciasDoPeriodo, tipoRelatorio, turmaSelecionada, turmas]);

  const totalPresencas = frequenciasFiltradas.filter((registro) => presente(registro.presenca)).length;
  const totalFaltas = frequenciasFiltradas.filter((registro) => falta(registro.presenca)).length;
  const frequenciaMedia = percentual(totalPresencas, totalFaltas);

  const resumoAlunos = useMemo(() => {
    const nomes = alunoSelecionado === 'Todos'
      ? alunosOrdenados.filter((aluno) => turmaSelecionada === 'Todas' || aluno.turma === turmaSelecionada).map((aluno) => aluno.nome)
      : [alunoSelecionado];
    return nomes.map((nome) => {
      const aluno = alunos.find((item) => item.nome === nome);
      const registros = frequenciasFiltradas.filter((item) => item.aluno === nome);
      const presencas = registros.filter((item) => presente(item.presenca)).length;
      const faltas = registros.filter((item) => falta(item.presenca)).length;
      return { nome, turma: aluno?.turma || nomeTurma(registros[0]?.turma), presencas, faltas, percentual: percentual(presencas, faltas) };
    });
  }, [alunoSelecionado, alunos, alunosOrdenados, frequenciasFiltradas, turmaSelecionada]);

  const turmaAtiva = useMemo(() => turmas.find((turma) => turma.id === turmaSelecionada || turma.nome === turmaSelecionada), [turmaSelecionada, turmas]);
  const resumoTurma = turmaAtiva ? {
    nome: turmaAtiva.nome,
    professor: turmaAtiva.professor || 'Não informado',
    horario: turmaAtiva.horaInicio && turmaAtiva.horaFim ? `${turmaAtiva.horaInicio} - ${turmaAtiva.horaFim}` : turmaAtiva.horario || 'Não informado',
    alunos: alunos.filter((aluno) => aluno.turma === turmaAtiva.nome || aluno.turma === turmaAtiva.id).length,
    presencas: totalPresencas,
    faltas: totalFaltas,
    percentual: frequenciaMedia,
  } : null;

  const periodo = `${meses[mes - 1]}/${ano}`;
  const escopo = tipoRelatorio === 'aluno' && alunoSelecionado !== 'Todos'
    ? alunoSelecionado
    : tipoRelatorio === 'turma' && turmaSelecionada !== 'Todas' ? turmaSelecionada : 'GERAL';
  const podeGerar = tipoRelatorio === 'geral'
    || (tipoRelatorio === 'aluno' && alunoSelecionado !== 'Todos')
    || (tipoRelatorio === 'turma' && turmaSelecionada !== 'Todas');
  const linhasExportacao = frequenciasFiltradas.map((registro) => [
    formatarData(registro.data), nomeTurma(registro.turma), registro.aluno || 'Não informado',
    registro.presenca || 'Não informado', registro.professorResponsavel || 'Não informado', registro.conteudoMinistrado || '',
  ]);

  const exportarPdf = async () => {
    const [{ jsPDF }, { default: autoTable }] = await Promise.all([
      import('jspdf'),
      import('jspdf-autotable'),
    ]);
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    doc.setFillColor(37, 99, 235); doc.rect(0, 0, doc.internal.pageSize.getWidth(), 72, 'F');
    doc.setTextColor(255, 255, 255); doc.setFontSize(20); doc.text('EDUKAR XP', 40, 31);
    doc.setFontSize(11); doc.text(`Relatório de Frequência — ${periodo}`, 40, 53);
    doc.setTextColor(15, 23, 42); doc.setFontSize(10);
    doc.text(`Escopo: ${escopo} | Presenças: ${totalPresencas} | Faltas: ${totalFaltas} | Frequência: ${formatarPercentual(frequenciaMedia)}`, 40, 94);
    autoTable(doc, { startY: 110, head: [['Data', 'Turma', 'Aluno', 'Presença', 'Professor', 'Conteúdo']], body: linhasExportacao, theme: 'grid', styles: { fontSize: 8 }, headStyles: { fillColor: [30, 41, 59] } });
    doc.save(`FREQUENCIA_${escopo}_${mes}-${ano}.pdf`);
  };

  const exportarWord = () => {
    const linhas = linhasExportacao.map((linha) => `<tr>${linha.map((celula) => `<td>${celula}</td>`).join('')}</tr>`).join('');
    const html = `<html><head><meta charset="utf-8"></head><body><h1>Relatório de Frequência</h1><p>Período: ${periodo}</p><p>Escopo: ${escopo}</p><p>Frequência: ${formatarPercentual(frequenciaMedia)}</p><table border="1" cellpadding="6"><tr><th>Data</th><th>Turma</th><th>Aluno</th><th>Presença</th><th>Professor</th><th>Conteúdo</th></tr>${linhas}</table></body></html>`;
    baixarArquivo(new Blob([html], { type: 'application/msword' }), `FREQUENCIA_${escopo}_${mes}-${ano}.doc`);
  };

  const exportarExcel = () => {
    const linhas = [['Data', 'Turma', 'Aluno', 'Presença', 'Professor', 'Conteúdo'], ...linhasExportacao];
    const csv = '\ufeff' + linhas.map((linha) => linha.map((celula) => `"${String(celula).replace(/"/g, '""')}"`).join(';')).join('\n');
    baixarArquivo(new Blob([csv], { type: 'application/vnd.ms-excel;charset=utf-8' }), `FREQUENCIA_${escopo}_${mes}-${ano}.xls`);
  };

  const baixarArquivo = (blob: Blob, nome: string) => {
    const url = URL.createObjectURL(blob); const link = document.createElement('a');
    link.href = url; link.download = nome; link.click(); URL.revokeObjectURL(url);
  };

  const botoesExportacao = (compacto = false) => <div className={`report-export-actions ${compacto ? 'compact' : ''}`}>
    <button type="button" className="report-export pdf" onClick={exportarPdf} title="Baixar relatório em PDF">
      <span className="report-export-icon"><FiFileText aria-hidden="true" /></span>
      <span className="report-export-copy"><strong>PDF</strong><small>Documento portátil</small></span>
      <FiDownload className="report-export-download" aria-hidden="true" />
    </button>
    <button type="button" className="report-export word" onClick={exportarWord} title="Baixar relatório em Word">
      <span className="report-export-icon"><FiFileText aria-hidden="true" /></span>
      <span className="report-export-copy"><strong>Word</strong><small>Documento editável</small></span>
      <FiDownload className="report-export-download" aria-hidden="true" />
    </button>
    <button type="button" className="report-export excel" onClick={exportarExcel} title="Baixar relatório em Excel">
      <span className="report-export-icon"><FiGrid aria-hidden="true" /></span>
      <span className="report-export-copy"><strong>Excel</strong><small>Planilha de dados</small></span>
      <FiDownload className="report-export-download" aria-hidden="true" />
    </button>
  </div>;

  return <div className="relatorios-container">
    <section className="relatorios-grid" aria-label="Resumo geral">
      <Card padding="lg" className="relatorio-card blue"><span>Total de Alunos</span><strong>{alunos.length}</strong></Card>
      <Card padding="lg" className="relatorio-card purple"><span>Total de Turmas</span><strong>{turmas.length}</strong></Card>
      <Card padding="lg" className="relatorio-card green"><span>Total de Presenças</span><strong>{totalPresencas}</strong><small>{formatarPercentual(frequenciaMedia)} de frequência</small></Card>
      <Card padding="lg" className="relatorio-card red"><span>Total de Faltas</span><strong>{totalFaltas}</strong></Card>
    </section>

    <Card padding="lg" className="report-filter-card">
      <div className="report-section-title"><div><span>FILTROS</span><h2>Período e escopo</h2></div><p>Os resultados e exportações são atualizados automaticamente.</p></div>
      <div className="report-type-selector" role="radiogroup" aria-label="Tipo de relatório">
        <label className={tipoRelatorio === 'geral' ? 'active' : ''}><input type="radio" name="tipo-relatorio" checked={tipoRelatorio === 'geral'} onChange={() => { setTipoRelatorio('geral'); setAlunoSelecionado('Todos'); setPesquisaAluno(''); setTurmaSelecionada('Todas'); setResumoAberto(false); }} /><span><b>Relatório Geral</b><small>Todos os alunos e turmas</small></span></label>
        <label className={tipoRelatorio === 'aluno' ? 'active' : ''}><input type="radio" name="tipo-relatorio" checked={tipoRelatorio === 'aluno'} onChange={() => { setTipoRelatorio('aluno'); setTurmaSelecionada('Todas'); setResumoAberto(false); }} /><span><b>Por Aluno</b><small>Frequência individual</small></span></label>
        <label className={tipoRelatorio === 'turma' ? 'active' : ''}><input type="radio" name="tipo-relatorio" checked={tipoRelatorio === 'turma'} onChange={() => { setTipoRelatorio('turma'); setAlunoSelecionado('Todos'); setPesquisaAluno(''); setResumoAberto(false); }} /><span><b>Por Turma</b><small>Presenças e faltas da turma</small></span></label>
      </div>
      <div className="report-filters">
        <label>Mês<select value={mes} onChange={(e) => setMes(Number(e.target.value))}>{meses.map((nome, i) => <option key={nome} value={i + 1}>{nome}</option>)}</select></label>
        <label>Ano<select value={ano} onChange={(e) => setAno(Number(e.target.value))}>{anos.map((item) => <option key={item}>{item}</option>)}</select></label>
        {tipoRelatorio === 'aluno' && <div className="report-student-picker">
          <label>Pesquisar Aluno
            <div className="report-search-combobox">
              <div className="report-search-field"><span aria-hidden="true">⌕</span><input type="search" role="combobox" aria-expanded={Boolean(pesquisaAluno && alunoSelecionado === 'Todos')} value={pesquisaAluno} placeholder="Digite o nome do aluno" onChange={(e) => { setPesquisaAluno(e.target.value); setAlunoSelecionado('Todos'); setResumoAberto(false); }} /></div>
              {pesquisaAluno && alunoSelecionado === 'Todos' && <div className="report-search-results" role="listbox">
                {alunosPesquisados.length ? alunosPesquisados.slice(0, 8).map((aluno) => <button key={aluno.id} type="button" role="option" onClick={() => { setAlunoSelecionado(aluno.nome); setPesquisaAluno(aluno.nome); setResumoAberto(false); }}><span className="report-student-avatar">{aluno.nome.charAt(0).toUpperCase()}</span><span><strong>{aluno.nome}</strong><small>{aluno.turma || 'Sem turma'}</small></span></button>) : <p>Nenhum aluno encontrado.</p>}
              </div>}
            </div>
          </label>
        </div>}
        {tipoRelatorio === 'turma' && <label>Selecionar Turma<select value={turmaSelecionada} onChange={(e) => { setTurmaSelecionada(e.target.value); setResumoAberto(false); }}><option value="Todas">Selecione uma turma</option>{turmasOrdenadas.map((turma) => <option key={turma.id} value={turma.nome}>{turma.nome}</option>)}</select></label>}
      </div>
    </Card>

    <Card padding="lg" className="report-card-block">
      <div className="report-section-title"><div><span>TURMAS</span><h2>Informações das Turmas</h2></div></div>
      <div className="report-table-wrap"><table className="report-table"><thead><tr><th>Turma</th><th>Professor</th><th>Horário</th><th>Alunos</th></tr></thead><tbody>
        {turmasOrdenadas.map((turma) => <tr key={turma.id}><td><strong>{turma.nome}</strong></td><td>{turma.professor || 'Não informado'}</td><td>{turma.horaInicio && turma.horaFim ? `${turma.horaInicio} - ${turma.horaFim}` : turma.horario || 'Não informado'}</td><td>{alunos.filter((aluno) => aluno.turma === turma.nome || aluno.turma === turma.id).length}</td></tr>)}
      </tbody></table></div>
    </Card>

    <Card padding="lg" className="report-generator-card">
      <div>
        <span>RELATÓRIO DE FREQUÊNCIA</span>
        <h2>Gerar relatório filtrado</h2>
        <p>Confira um resumo antes de baixar o arquivo.</p>
      </div>
      <button type="button" className="report-generate-button" disabled={!podeGerar} onClick={() => setResumoAberto(true)}>Visualizar relatório</button>
    </Card>

    {resumoAberto && <Card padding="lg" className="report-preview-card">
      <div className="report-preview-header">
        <div><span>RESUMO DO ARQUIVO</span><h2>Relatório pronto para baixar</h2></div>
        <button type="button" className="report-preview-close" onClick={() => setResumoAberto(false)} aria-label="Fechar resumo">×</button>
      </div>
      <div className="report-preview-scope">
        <div><small>Período</small><strong>{periodo}</strong></div>
        <div><small>Tipo</small><strong>{tipoRelatorio === 'aluno' ? 'Relatório por aluno' : tipoRelatorio === 'turma' ? 'Relatório por turma' : 'Relatório geral'}</strong></div>
        <div><small>Selecionado</small><strong>{escopo === 'GERAL' ? 'Todos' : escopo}</strong></div>
        <div><small>Registros</small><strong>{frequenciasFiltradas.length}</strong></div>
      </div>
      <div className="report-preview-numbers">
        <div className="success"><span>✓</span><strong>{totalPresencas}</strong><small>Presenças</small></div>
        <div className="danger"><span>×</span><strong>{totalFaltas}</strong><small>Faltas</small></div>
        <div className="primary"><span>%</span><strong>{formatarPercentual(frequenciaMedia)}</strong><small>Frequência</small></div>
      </div>
      {resumoTurma && <p className="report-preview-detail"><strong>{resumoTurma.nome}</strong> · {resumoTurma.professor} · {resumoTurma.horario} · {resumoTurma.alunos} alunos</p>}
      <div className="report-preview-download"><div><strong>Escolha o formato</strong><small>O arquivo respeitará todos os filtros acima.</small></div>{botoesExportacao()}</div>
    </Card>}

    <Card padding="lg" className="report-card-block">
      <div className="report-section-title"><div><span>DETALHAMENTO</span><h2>Frequência por Aluno</h2></div><strong>{periodo}</strong></div>
      <div className="report-table-wrap"><table className="report-table"><thead><tr><th>Aluno</th><th>Turma</th><th>Presenças</th><th>Faltas</th><th>Frequência</th></tr></thead><tbody>
        {resumoAlunos.length ? resumoAlunos.map((aluno) => <tr key={aluno.nome}><td><strong>{aluno.nome}</strong></td><td>{aluno.turma}</td><td><span className="report-count success">{aluno.presencas}</span></td><td><span className="report-count danger">{aluno.faltas}</span></td><td><strong>{formatarPercentual(aluno.percentual)}</strong></td></tr>) : <tr><td colSpan={5} className="report-empty">Nenhum dado encontrado.</td></tr>}
      </tbody></table></div>
    </Card>

  </div>;
};
