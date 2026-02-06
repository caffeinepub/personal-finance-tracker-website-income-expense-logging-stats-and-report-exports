import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Transaction, TransactionType, Category, TransactionData } from '../backend';

export function useGetUserTransactions() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserTransactions();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddTransaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TransactionData) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addTransaction(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useUpdateTransaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      transactionId: bigint;
      data: TransactionData;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTransaction(params.transactionId, params.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useDeleteTransaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteTransaction(transactionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}
