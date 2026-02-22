import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { UserAccount } from '../backend';

export function useGetUserAccount() {
  const { actor, isFetching } = useActor();

  return useQuery<UserAccount | null>({
    queryKey: ['userAccount'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserAccount();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateUserAccount() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (username) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createUserAccount(username);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userAccount'] });
    },
  });
}

export function useUpgradeToPremium() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error>({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.upgradeToPremium();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userAccount'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useAddCoins() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (amount) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addCoins(BigInt(amount));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userAccount'] });
    },
  });
}
