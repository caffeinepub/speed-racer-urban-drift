import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface ScoreEntry {
    player: Principal;
    level: Level;
    score: bigint;
    timestamp: Time;
}
export interface PlayerProgress {
    unlockedUpgrades: Array<Upgrade>;
    coins: bigint;
    lastPlayedLevel?: Level;
    settings: {
        music: boolean;
        sound: boolean;
    };
    unlockedCars: Array<CarType>;
    unlockedLevels: Array<Level>;
}
export interface UserProfile {
    displayName?: string;
    name: string;
}
export enum CarType {
    muscle = "muscle",
    basic = "basic",
    sports = "sports",
    drift = "drift",
    supercar = "supercar"
}
export enum Level {
    neon_night = "neon_night",
    city_streets = "city_streets",
    underground_tunnel = "underground_tunnel",
    highway_drift = "highway_drift",
    bonus_challenge = "bonus_challenge",
    downtown_rush = "downtown_rush"
}
export enum Upgrade {
    nitro_boost = "nitro_boost",
    top_speed = "top_speed",
    acceleration = "acceleration",
    handling = "handling"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPlayerScores(player: Principal): Promise<Array<ScoreEntry>>;
    getProgress(): Promise<PlayerProgress | null>;
    getTopScores(limit: bigint): Promise<Array<ScoreEntry>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveProgress(progress: PlayerProgress): Promise<void>;
    submitScore(score: bigint, level: Level): Promise<void>;
}
