import { useState, useEffect, useCallback } from 'react';
import { alunosService, turmasService } from '../services/api';
import { useTurmas } from './useTurmas';
import type { Aluno } from '../types';
import { useAppStore } from '../context/AppContext';

export const useAlunos = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useAppStore();
  const { fetchTurmas } = useTurmas();

  const fetchAlunos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await alunosService.getAll();
      setAlunos(data);
      await turmasService.syncQuantidadeAlunos(data);
      await fetchTurmas();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar alunos';
      setError(errorMessage);
      setAlunos([]);

      const shouldIgnoreBackendError = /supabase|fetch failed|failed to fetch|network|not resolved|enotfound/i.test(errorMessage);
      if (!shouldIgnoreBackendError) {
        addNotification(errorMessage, 'error');
      }
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  const createAluno = useCallback(
    async (aluno: Omit<Aluno, 'id'>) => {
      try {
        const newAluno = await alunosService.create(aluno);
        const nextAlunos = [...alunos, newAluno];
        setAlunos(nextAlunos);
        await turmasService.syncQuantidadeAlunos(nextAlunos);
        await fetchTurmas();
        addNotification('Aluno criado com sucesso!', 'success');
        return newAluno;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao criar aluno';
        addNotification(errorMessage, 'error');
        throw err;
      }
    },
    [addNotification]
  );

  const updateAluno = useCallback(
    async (id: string, aluno: Partial<Aluno>) => {
      try {
        const updated = await alunosService.update(id, aluno);
        const nextAlunos = alunos.map((a) => (a.id === id ? updated : a));
        setAlunos(nextAlunos);
        await turmasService.syncQuantidadeAlunos(nextAlunos);
        await fetchTurmas();
        addNotification('Aluno atualizado com sucesso!', 'success');
        return updated;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar aluno';
        addNotification(errorMessage, 'error');
        throw err;
      }
    },
    [addNotification]
  );

  const deleteAluno = useCallback(
    async (id: string) => {
      try {
        await alunosService.delete(id);
        const nextAlunos = alunos.filter((a) => a.id !== id);
        setAlunos(nextAlunos);
        await turmasService.syncQuantidadeAlunos(nextAlunos);
        await fetchTurmas();
        addNotification('Aluno removido com sucesso!', 'success');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao remover aluno';
        addNotification(errorMessage, 'error');
        throw err;
      }
    },
    [addNotification]
  );

  const searchAlunos = useCallback(
    async (termo: string) => {
      try {
        const results = await alunosService.search(termo);
        setAlunos(results);
        return results;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar alunos';
        addNotification(errorMessage, 'error');
        throw err;
      }
    },
    [addNotification]
  );

  useEffect(() => {
    fetchAlunos();
  }, [fetchAlunos]);

  return {
    alunos,
    isLoading,
    error,
    fetchAlunos,
    createAluno,
    updateAluno,
    deleteAluno,
    searchAlunos,
  };
};
