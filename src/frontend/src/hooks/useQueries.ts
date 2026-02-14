import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { PlayerProgress, ScoreEntry, Level, UserProfile } from '../backend';
import { Principal } from '@dfinity/principal';

export function useGetProgress() {
  const { actor, isFetching } = useActor();

  return useQuery<PlayerProgress | null>({
    queryKey: ['progress'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProgress();
    },
    enabled: !!actor && !isFetching
  });
}

export function useSaveProgress() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (progress: PlayerProgress) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveProgress(progress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    }
  });
}

export function useSubmitScore() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ score, level }: { score: bigint; level: Level }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitScore(score, level);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topScores'] });
      queryClient.invalidateQueries({ queryKey: ['playerScores'] });
    }
  });
}

export function useGetTopScores(limit: number = 10) {
  const { actor, isFetching } = useActor();

  return useQuery<ScoreEntry[]>({
    queryKey: ['topScores', limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTopScores(BigInt(limit));
    },
    enabled: !!actor && !isFetching
  });
}

export function useGetPlayerScores(player?: Principal) {
  const { actor, isFetching } = useActor();

  return useQuery<ScoreEntry[]>({
    queryKey: ['playerScores', player?.toString()],
    queryFn: async () => {
      if (!actor || !player) return [];
      return actor.getPlayerScores(player);
    },
    enabled: !!actor && !isFetching && !!player
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    }
  });
}
