import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TrendingTopic {
    id: string;
    topic: string;
    hashtags: Array<string>;
    metrics: EngagementMetrics;
    platform: Platform;
    keywords: Array<string>;
    timestamp: bigint;
}
export interface UserAccount {
    created: bigint;
    username: string;
    coins: bigint;
    tier: SubscriptionTier;
    videoHistory: Array<string>;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface EngagementMetrics {
    shares: bigint;
    views: bigint;
    likes: bigint;
    comments: bigint;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface Script {
    duration: bigint;
    hookLine: string;
    language: Variant_hindi_both_english;
    style: Variant_dramatic_emotional;
    mainContent: string;
}
export interface VideoProject {
    id: string;
    status: VideoStatus;
    title: string;
    created: bigint;
    voiceover: Variant_female_male;
    owner: Principal;
    stockVideoIds: Array<string>;
    script: Script;
    watermark: boolean;
    subtitles: boolean;
    musicId: string;
    topicId: string;
    format: Variant_tiktok_youtubeShorts_instagramReels;
}
export interface UserProfile {
    username: string;
    name: string;
    tier: SubscriptionTier;
}
export enum Platform {
    x = "x",
    instagram = "instagram",
    googleTrends = "googleTrends",
    youtube = "youtube"
}
export enum SubscriptionTier {
    premium = "premium",
    free = "free"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_dramatic_emotional {
    dramatic = "dramatic",
    emotional = "emotional"
}
export enum Variant_female_male {
    female = "female",
    male = "male"
}
export enum Variant_hindi_both_english {
    hindi = "hindi",
    both = "both",
    english = "english"
}
export enum Variant_tiktok_youtubeShorts_instagramReels {
    tiktok = "tiktok",
    youtubeShorts = "youtubeShorts",
    instagramReels = "instagramReels"
}
export enum VideoStatus {
    completed = "completed",
    rendering = "rendering",
    draft = "draft"
}
export interface backendInterface {
    addCoins(amount: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createTrendingTopic(platform: Platform, topic: string, hashtags: Array<string>, keywords: Array<string>): Promise<string>;
    createUserAccount(username: string): Promise<void>;
    createVideoProject(title: string, topicId: string, script: Script, stockVideoIds: Array<string>, musicId: string, voiceover: Variant_female_male, format: Variant_tiktok_youtubeShorts_instagramReels): Promise<string>;
    deductCoins(amount: bigint): Promise<void>;
    deleteTrendingTopic(id: string): Promise<void>;
    fetchTrendingTopicsFromGoogleTrendsApi(): Promise<string>;
    fetchTrendingTopicsFromYouTubeApi(): Promise<string>;
    filterTrendingTopicsByPlatform(platform: Platform): Promise<Array<TrendingTopic>>;
    generateScript(topic: string, language: Variant_hindi_both_english, duration: bigint, style: Variant_dramatic_emotional): Promise<Script>;
    getAccountByPrincipal(user: Principal): Promise<UserAccount | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCallerVideoProjects(): Promise<Array<VideoProject>>;
    getTrendingTopic(id: string): Promise<TrendingTopic | null>;
    getTrendingTopicsSortedByEngagement(): Promise<Array<TrendingTopic>>;
    getUserAccount(): Promise<UserAccount | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVideoProject(id: string): Promise<VideoProject | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateTrendingTopic(id: string, platform: Platform, topic: string, hashtags: Array<string>, keywords: Array<string>, metrics: EngagementMetrics): Promise<void>;
    updateVideoProject(id: string, title: string, stockVideoIds: Array<string>, musicId: string, voiceover: Variant_female_male, subtitles: boolean, format: Variant_tiktok_youtubeShorts_instagramReels, watermark: boolean): Promise<void>;
    updateVideoProjectStatus(id: string, status: VideoStatus): Promise<void>;
    upgradeToPremium(): Promise<void>;
}
