import Text "mo:core/Text";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Int "mo:core/Int";

module {
  type Platform = { #youtube; #instagram; #x; #googleTrends };

  type EngagementMetrics = {
    likes : Nat;
    shares : Nat;
    comments : Nat;
    views : Nat;
  };

  type TrendingTopic = {
    id : Text;
    platform : Platform;
    topic : Text;
    hashtags : [Text];
    keywords : [Text];
    timestamp : Int;
    metrics : EngagementMetrics;
  };

  type Script = {
    hookLine : Text;
    mainContent : Text;
    language : { #hindi; #english; #both };
    duration : Nat;
    style : { #emotional; #dramatic };
  };

  type VideoStatus = { #draft; #rendering; #completed };

  type VideoProject = {
    id : Text;
    owner : Principal.Principal;
    title : Text;
    topicId : Text;
    script : Script;
    stockVideoIds : [Text];
    musicId : Text;
    voiceover : { #male; #female };
    subtitles : Bool;
    format : { #youtubeShorts; #instagramReels; #tiktok };
    watermark : Bool;
    created : Int;
    status : VideoStatus;
  };

  type SubscriptionTier = { #free; #premium };

  type UserAccount = {
    username : Text;
    tier : SubscriptionTier;
    coins : Nat;
    created : Int;
    videoHistory : [Text];
  };

  type UserProfile = {
    name : Text;
    username : Text;
    tier : SubscriptionTier;
  };

  type OldActor = {
    trendingTopics : Map.Map<Text, TrendingTopic>;
    videoProjects : Map.Map<Text, VideoProject>;
    userAccounts : Map.Map<Principal.Principal, UserAccount>;
    userProfiles : Map.Map<Principal.Principal, UserProfile>;
  };

  type NewActor = OldActor;

  public func run(old : OldActor) : NewActor {
    old;
  };
};
