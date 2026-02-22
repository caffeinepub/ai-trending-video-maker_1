import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Script, Variant_female_male, Variant_tiktok_youtubeShorts_instagramReels } from '../backend';

interface CreateVideoProjectParams {
  title: string;
  topicId: string;
  script: Script;
  stockVideoIds: string[];
  musicId: string;
  voiceover: Variant_female_male;
  format: Variant_tiktok_youtubeShorts_instagramReels;
}

export function useCreateVideoProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<string, Error, CreateVideoProjectParams>({
    mutationFn: async (params) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createVideoProject(
        params.title,
        params.topicId,
        params.script,
        params.stockVideoIds,
        params.musicId,
        params.voiceover,
        params.format
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videoProjects'] });
    },
  });
}
