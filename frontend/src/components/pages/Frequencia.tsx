import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from '../common';
import { FiPlus, FiSave } from 'react-icons/fi';
import { useFrequencia } from '../../hooks/useFrequencia';
import { useTurmas } from '../../hooks/useTurmas';
import { useAlunos } from '../../hooks/useAlunos';
import type { Frequencia as FrequenciaType } from '../../types';
import './Frequencia.css';

const formatTime = (time?: string) => (time ? `${time}h` : '');

const formatHorario = (
  horaInicio?: string,
  horaFim?: string
) => {
  if (horaInicio && horaFim) {
    return `${formatTime(
      horaInicio
    )} - ${formatTime(horaFim)}`;
  }

  if (horaInicio) {
    return formatTime(horaInicio);
  }

  if (horaFim) {
    return formatTime(horaFim);
  }

  return '';
};

const parseHorario = (horario?: string) => {
  if (!horario) {
    return {
      horaInicio: '',
      horaFim: '',
    };
  }

  const cleaned = horario
    .replace(/h/g, '')
    .trim();

  const parts = cleaned.split(
    /\s*[-–]\s*/
  );

  return {
    horaInicio: parts[0] || '',
    horaFim: parts[1] || '',
  };
};

const getHorarioDisplay = (
  horario?: string,
  horaInicio?: string,
  horaFim?: string
) => {
  const display = formatHorario(
    horaInicio,
    horaFim
  );

  if (display) return display;

  const parsed = parseHorario(horario);

  return formatHorario(
    parsed.horaInicio,
    parsed.horaFim
  );
};

export const Frequencia: React.FC = () => {
  const { registrarMultipla } =
    useFrequencia();

  const { turmas } = useTurmas();

  const { alunos } = useAlunos();

  const [selectedData, setSelectedData] =
    useState(
      new Date()
        .toISOString()
        .split('T')[0]
    );

  const [
    selectedTurma,
    setSelectedTurma,
  ] = useState('');

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [
    frequenciaData,
    setFrequenciaData,
  ] = useState<
    Record<
      string,
      {
        presenca:
          | 'Presente'
          | 'Falta';
        conteudo: string;
        observacoes: string;
      }
    >
  >({});

  const [
    conteudoGeral,
    setConteudoGeral,
  ] = useState('');

  const [
    observacoesGeral,
    setObservacoesGeral,
  ] = useState('');

  const turmaAtual = React.useMemo(
    () =>
      turmas.find(
        (t) => t.id === selectedTurma
      ),
    [turmas, selectedTurma]
  );

  const alunosDaTurma =
    React.useMemo(() => {
      if (!turmaAtual?.nome)
        return [];

      return alunos.filter(
        (aluno) =>
          aluno.turma ===
          turmaAtual.nome
      );
    }, [alunos, turmaAtual]);

  useEffect(() => {
    const newData: typeof frequenciaData =
      {};

    alunosDaTurma.forEach((aluno) => {
      newData[aluno.id] =
        frequenciaData[aluno.id] || {
          presenca: 'Presente',
          conteudo: conteudoGeral,
          observacoes:
            observacoesGeral,
        };
    });

    setFrequenciaData(newData);
  }, [selectedTurma, alunosDaTurma]);

  const handleTogglePresenca = (
    alunoId: string
  ) => {
    const alunoAtual =
      frequenciaData[alunoId] || {
        presenca: 'Presente',
        conteudo: '',
        observacoes: '',
      };

    setFrequenciaData({
      ...frequenciaData,

      [alunoId]: {
        ...alunoAtual,

        presenca:
          alunoAtual.presenca ===
          'Presente'
            ? 'Falta'
            : 'Presente',
      },
    });
  };

  const handleSalvarFrequencia =
    async () => {
      if (!selectedTurma) {
        alert(
          'Selecione uma turma'
        );

        return;
      }

      try {
        const frequencias: Omit<
          FrequenciaType,
          'id'
        >[] = alunosDaTurma.map(
          (aluno) => ({
            data: selectedData,

            turma:
              turmaAtual?.nome ||
              selectedTurma,

            aluno: aluno.nome,

            presenca:
              frequenciaData[
                aluno.id
              ]?.presenca ||
              'Presente',

            conteudoMinistrado:
              frequenciaData[
                aluno.id
              ]?.conteudo ||
              conteudoGeral,

            observacoes:
              frequenciaData[
                aluno.id
              ]?.observacoes ||
              observacoesGeral,

            professorResponsavel:
              turmaAtual?.professor ||
              'Professor',
          })
        );

        await registrarMultipla(
          frequencias
        );

        alert(
          'Frequência registrada com sucesso!'
        );

        const resetData: typeof frequenciaData =
          {};

        alunosDaTurma.forEach(
          (aluno) => {
            resetData[aluno.id] = {
              presenca:
                'Presente',

              conteudo: '',

              observacoes: '',
            };
          }
        );

        setFrequenciaData(
          resetData
        );
      } catch (error) {
        console.error(
          'Erro ao salvar frequência:',
          error
        );
      }
    };

  return (
    <div className="frequencia-container">
      <div className="frequencia-header">
        <div>
          <h1>
            Controle de Frequência
          </h1>

          <p>
            Registrar presença e
            conteúdo das aulas
          </p>
        </div>
      </div>

      <div className="frequencia-filters">
        <Card padding="lg">
          <div className="filter-group">
            <label>Data</label>

            <input
              type="date"
              value={
                selectedData
              }
              onChange={(e) =>
                setSelectedData(
                  e.target.value
                )
              }
            />
          </div>

          <div className="filter-group">
            <label>Turma</label>

            <select
              value={
                selectedTurma
              }
              onChange={(e) =>
                setSelectedTurma(
                  e.target.value
                )
              }
            >
              <option value="">
                Selecione uma
                turma
              </option>

              {turmas.map(
                (turma) => (
                  <option
                    key={turma.id}
                    value={
                      turma.id
                    }
                  >
                    {turma.nome}
                  </option>
                )
              )}
            </select>
          </div>
        </Card>
      </div>

      {selectedTurma &&
        turmaAtual && (
          <div className="frequencia-content">
            <Card padding="lg">
              <div className="turma-info-header">
                <div>
                  <h2>
                    {
                      turmaAtual.nome
                    }
                  </h2>

                  <p>
                    Professor:{' '}
                    {
                      turmaAtual.professor
                    }
                  </p>

                  <p>
                    Horário:{' '}
                    {getHorarioDisplay(
                      turmaAtual.horario,
                      turmaAtual.horaInicio,
                      turmaAtual.horaFim
                    ) ||
                      'Não definido'}
                  </p>
                </div>

                <div className="alunos-count">
                  <span className="count-badge">
                    {
                      alunosDaTurma.length
                    }
                  </span>

                  <p>Alunos</p>
                </div>
              </div>
            </Card>

            <Card padding="lg">
              <h3>
                Frequência dos
                Alunos
              </h3>

              <div className="alunos-lista">
                <div className="alunos-header">
                  <div className="aluno-col">
                    Aluno
                  </div>

                  <div className="presenca-col">
                    Presença
                  </div>
                </div>

                {alunosDaTurma.length ===
                0 ? (
                  <p className="text-muted">
                    Nenhum aluno
                    vinculado a esta
                    turma.
                  </p>
                ) : (
                  alunosDaTurma.map(
                    (aluno) => (
                      <div
                        key={
                          aluno.id
                        }
                        className="aluno-row"
                      >
                        <div className="aluno-col">
                          <span className="aluno-nome">
                            {
                              aluno.nome
                            }
                          </span>
                        </div>

                        <div className="presenca-col">
                          <button
                            className={`presenca-btn ${
                              (
                                frequenciaData[
                                  aluno
                                    .id
                                ]
                                  ?.presenca ||
                                'Presente'
                              ) ===
                              'Presente'
                                ? 'presente'
                                : 'falta'
                            }`}
                            onClick={() =>
                              handleTogglePresenca(
                                aluno.id
                              )
                            }
                          >
                            {(
                              frequenciaData[
                                aluno
                                  .id
                              ]
                                ?.presenca ||
                              'Presente'
                            ) ===
                            'Presente'
                              ? '✓ Presente'
                              : '✗ Falta'}
                          </button>
                        </div>
                      </div>
                    )
                  )
                )}
              </div>
            </Card>

            <Card padding="lg">
              <h3>
                Conteúdo da Aula
              </h3>

              <div className="form-group">
                <label>
                  Tema da Aula
                </label>

                <input
                  type="text"
                  placeholder="Digite o tema da aula..."
                  value={
                    conteudoGeral
                  }
                  onChange={(e) =>
                    setConteudoGeral(
                      e.target
                        .value
                    )
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  Observações
                  Gerais
                </label>

                <textarea
                  placeholder="Digite observações gerais da aula..."
                  value={
                    observacoesGeral
                  }
                  onChange={(e) =>
                    setObservacoesGeral(
                      e.target
                        .value
                    )
                  }
                  rows={3}
                />
              </div>
            </Card>

            <div className="frequencia-actions">
              <Button
                variant="success"
                size="lg"
                icon={
                  <FiSave
                    size={20}
                  />
                }
                onClick={
                  handleSalvarFrequencia
                }
              >
                Salvar
                Frequência
              </Button>
            </div>
          </div>
        )}

      {!selectedTurma && (
        <Card padding="lg">
          <p className="text-muted text-center">
            Selecione uma turma
            para registrar
            frequência
          </p>
        </Card>
      )}
    </div>
  );
};