import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { VideoProject, VideoStatus } from '../backend';

export function useGetVideoProject(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<VideoProject | null>({
    queryKey: ['videoProject', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getVideoProject(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useGetCallerVideoProjects() {
  const { actor, isFetching } = useActor();

  return useQuery<VideoProject[]>({
    queryKey: ['videoProjects', 'caller'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCallerVideoProjects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateVideoProjectStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: string; status: VideoStatus }>({
    mutationFn: async ({ id, status }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateVideoProjectStatus(id, status);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['videoProject', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['videoProjects'] });
    },
  });
}
