import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Platform, TrendingTopic } from '../backend';

export function useGetTrendingTopic(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<TrendingTopic | null>({
    queryKey: ['trendingTopic', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getTrendingTopic(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useFilterTrendingTopicsByPlatform(platform: Platform) {
  const { actor, isFetching } = useActor();

  return useQuery<TrendingTopic[]>({
    queryKey: ['trendingTopics', 'platform', platform],
    queryFn: async () => {
      if (!actor) return [];
      return actor.filterTrendingTopicsByPlatform(platform);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTrendingTopicsSortedByEngagement() {
  const { actor, isFetching } = useActor();

  return useQuery<TrendingTopic[]>({
    queryKey: ['trendingTopics', 'sorted'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTrendingTopicsSortedByEngagement();
    },
    enabled: !!actor && !isFetching,
  });
}
