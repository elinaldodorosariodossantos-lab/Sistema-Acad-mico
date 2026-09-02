import { useState, useEffect, useCallback } from 'react';
import { horariosService } from '../services/api';
import type { Horario } from '../types';
import { useAppStore } from '../context/AppContext';

export const useHorarios = () => {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useAppStore();

  const fetchHorarios = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await horariosService.getAll();
      setHorarios(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar horários';
      setError(errorMessage);
      addNotification(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  const createHorario = useCallback(
    async (horario: Omit<Horario, 'id'>) => {
      try {
        const newHorario = await horariosService.create(horario);
        setHorarios((prev) => [...prev, newHorario]);
        addNotification('Horário criado com sucesso!', 'success');
        return newHorario;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao criar horário';
        addNotification(errorMessage, 'error');
        throw err;
      }
    },
    [addNotification]
  );

  const updateHorario = useCallback(
    async (id: string, horario: Partial<Horario>) => {
      try {
        const updated = await horariosService.update(id, horario);
        setHorarios((prev) => prev.map((item) => (item.id === id ? updated : item)));
        addNotification('Horário atualizado com sucesso!', 'success');
        return updated;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar horário';
        addNotification(errorMessage, 'error');
        throw err;
      }
    },
    [addNotification]
  );

  const deleteHorario = useCallback(
    async (id: string) => {
      try {
        await horariosService.delete(id);
        setHorarios((prev) => prev.filter((item) => item.id !== id));
        addNotification('Horário removido com sucesso!', 'success');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao remover horário';
        addNotification(errorMessage, 'error');
        throw err;
      }
    },
    [addNotification]
  );

  useEffect(() => {
    fetchHorarios();
  }, [fetchHorarios]);

  return {
    horarios,
    isLoading,
    error,
    fetchHorarios,
    createHorario,
    updateHorario,
    deleteHorario,
  };
};
