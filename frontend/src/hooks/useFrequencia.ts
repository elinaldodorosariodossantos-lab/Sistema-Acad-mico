import { useState, useCallback, useEffect } from 'react';
import { frequenciaService } from '../services/api';
import type { Frequencia } from '../types';
import { useAppStore } from '../context/AppContext';

export const useFrequencia = () => {
  const {
    frequencias,
    setFrequencias,
    addNotification,
  } = useAppStore();

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const fetchFrequencias =
    useCallback(async () => {

      setIsLoading(true);

      setError(null);

      try {

        const data =
          await frequenciaService.getAll();

        if (Array.isArray(data)) {

          setFrequencias(data);

        } else {

          setFrequencias([]);

        }

      } catch (err) {

        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Erro ao buscar frequências';

        setError(errorMessage);

        addNotification(
          errorMessage,
          'error'
        );

        setFrequencias([]);

      } finally {

        setIsLoading(false);

      }
    }, [addNotification]);

  useEffect(() => {
    fetchFrequencias();
  }, [fetchFrequencias]);

  const getFrequenciaByData =
    useCallback(
      async (data: string) => {

        try {

          const result =
            await frequenciaService.getByData(
              data
            );

          return Array.isArray(result)
            ? result
            : [];

        } catch (err) {

          const errorMessage =
            err instanceof Error
              ? err.message
              : 'Erro ao buscar frequências';

          addNotification(
            errorMessage,
            'error'
          );

          return [];

        }
      },
      [addNotification]
    );

  const getFrequenciaByTurma =
    useCallback(
      async (turmaId: string) => {

        try {

          const result =
            await frequenciaService.getByTurma(
              turmaId
            );

          return Array.isArray(result)
            ? result
            : [];

        } catch (err) {

          const errorMessage =
            err instanceof Error
              ? err.message
              : 'Erro ao buscar frequências';

          addNotification(
            errorMessage,
            'error'
          );

          return [];

        }
      },
      [addNotification]
    );

  const createFrequencia =
    useCallback(
      async (
        frequencia: Omit<
          Frequencia,
          'id'
        >
      ) => {

        try {

          const newFreq =
            await frequenciaService.create(
              frequencia
            );

          if (newFreq) {
            setFrequencias([
              ...frequencias,
              newFreq,
            ]);
          }

          addNotification(
            'Frequência registrada com sucesso!',
            'success'
          );

          return newFreq;

        } catch (err) {

          const errorMessage =
            err instanceof Error
              ? err.message
              : 'Erro ao registrar frequência';

          addNotification(
            errorMessage,
            'error'
          );

          throw err;
        }
      },
      [addNotification]
    );

  const registrarMultipla =
    useCallback(
      async (
        frequenciasInput: Omit<
          Frequencia,
          'id'
        >[]
      ) => {

        try {

          const registered =
            await frequenciaService.registrarMultipla(
              frequenciasInput
            );

          if (
            Array.isArray(
              registered
            )
          ) {
            setFrequencias([
              ...frequencias,
              ...registered,
            ]);

            addNotification(
              'Frequências registradas com sucesso!',
              'success'
            );

            return registered;

          } else {

            console.error(
              'Resposta inválida:',
              registered
            );

            addNotification(
              'Erro ao registrar frequências',
              'error'
            );

            return [];

          }

        } catch (err) {

          const errorMessage =
            err instanceof Error
              ? err.message
              : 'Erro ao registrar frequências';

          addNotification(
            errorMessage,
            'error'
          );

          console.error(
            'Erro registrarMultipla:',
            err
          );

          return [];

        }
      },
      [addNotification]
    );

  const updateFrequencia =
    useCallback(
      async (
        id: string,
        frequencia: Partial<Frequencia>
      ) => {

        try {

          const updated =
            await frequenciaService.update(
              id,
              frequencia
            );

          setFrequencias(
            frequencias.map((f) =>
              f.id === id ? updated : f
            )
          );

          addNotification(
            'Frequência atualizada com sucesso!',
            'success'
          );

          return updated;

        } catch (err) {

          const errorMessage =
            err instanceof Error
              ? err.message
              : 'Erro ao atualizar frequência';

          addNotification(
            errorMessage,
            'error'
          );

          throw err;
        }
      },
      [addNotification]
    );

  return {

    frequencias,

    isLoading,

    error,

    fetchFrequencias,

    getFrequenciaByData,

    getFrequenciaByTurma,

    createFrequencia,

    registrarMultipla,

    updateFrequencia,
  };
};