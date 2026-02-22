import { useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Script, Variant_hindi_both_english, Variant_dramatic_emotional } from '../backend';

interface GenerateScriptParams {
  topic: string;
  language: Variant_hindi_both_english;
  duration: bigint;
  style: Variant_dramatic_emotional;
}

export function useGenerateScript() {
  const { actor } = useActor();

  return useMutation<Script, Error, GenerateScriptParams>({
    mutationFn: async (params) => {
      if (!actor) throw new Error('Actor not available');
      return actor.generateScript(params.topic, params.language, params.duration, params.style);
    },
  });
}
