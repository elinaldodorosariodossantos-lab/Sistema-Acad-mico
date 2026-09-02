import { useState, useEffect, useCallback } from 'react';
import { turmasService } from '../services/api';
import type { Turma } from '../types';
import { useAppStore } from '../context/AppContext';

export const useTurmas = () => {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useAppStore();

  const fetchTurmas = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await turmasService.getAll();
      setTurmas(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar turmas';
      setError(errorMessage);
      setTurmas([]);

      const shouldIgnoreBackendError = /supabase|fetch failed|failed to fetch|network|not resolved|enotfound/i.test(errorMessage);
      if (!shouldIgnoreBackendError) {
        addNotification(errorMessage, 'error');
      }
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  const createTurma = useCallback(
    async (turma: Omit<Turma, 'id'>) => {
      try {
        const newTurma = await turmasService.create(turma);
        setTurmas((prev) => [...prev, newTurma]);
        addNotification('Turma criada com sucesso!', 'success');
        return newTurma;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao criar turma';
        addNotification(errorMessage, 'error');
        throw err;
      }
    },
    [addNotification]
  );

  const updateTurma = useCallback(
    async (id: string, turma: Partial<Turma>) => {
      try {
        const updated = await turmasService.update(id, turma);
        setTurmas((prev) => prev.map((t) => (t.id === id ? updated : t)));
        addNotification('Turma atualizada com sucesso!', 'success');
        return updated;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar turma';
        addNotification(errorMessage, 'error');
        throw err;
      }
    },
    [addNotification]
  );

  const deleteTurma = useCallback(
    async (id: string) => {
      try {
        await turmasService.delete(id);
        setTurmas((prev) => prev.filter((t) => t.id !== id));
        addNotification('Turma removida com sucesso!', 'success');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao remover turma';
        addNotification(errorMessage, 'error');
        throw err;
      }
    },
    [addNotification]
  );

  useEffect(() => {
    fetchTurmas();
  }, [fetchTurmas]);

  return {
    turmas,
    isLoading,
    error,
    fetchTurmas,
    createTurma,
    updateTurma,
    deleteTurma,
  };
};
