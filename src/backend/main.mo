import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Migration "migration";
import OutCall "http-outcalls/outcall";

(with migration = Migration.run)
actor {
  // User system
  include MixinStorage();
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Data Models
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
    owner : Principal;
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

  public type UserProfile = {
    name : Text;
    username : Text;
    tier : SubscriptionTier;
  };

  module TrendingTopic {
    public func compareByEngagementMetrics(a : TrendingTopic, b : TrendingTopic) : Order.Order {
      let aScore = a.metrics.likes + a.metrics.shares + a.metrics.comments + a.metrics.views;
      let bScore = b.metrics.likes + b.metrics.shares + b.metrics.comments + b.metrics.views;
      Int.compare(aScore, bScore);
    };
  };

  // Persistent State
  let trendingTopics = Map.empty<Text, TrendingTopic>();
  let videoProjects = Map.empty<Text, VideoProject>();
  let userAccounts = Map.empty<Principal, UserAccount>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Helper Functions
  func generateId(prefix : Text) : Text {
    prefix # Time.now().toText();
  };

  // User Profile Functions (Required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Trending Topic Functions (Admin-only)
  public shared ({ caller }) func createTrendingTopic(
    platform : Platform,
    topic : Text,
    hashtags : [Text],
    keywords : [Text]
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create trending topics");
    };
    let id = generateId("topic");
    let topicData : TrendingTopic = {
      id;
      platform;
      topic;
      hashtags;
      keywords;
      timestamp = Time.now();
      metrics = {
        likes = 0;
        shares = 0;
        comments = 0;
        views = 0;
      };
    };
    trendingTopics.add(id, topicData);
    id;
  };

  public shared ({ caller }) func updateTrendingTopic(
    id : Text,
    platform : Platform,
    topic : Text,
    hashtags : [Text],
    keywords : [Text],
    metrics : EngagementMetrics
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update trending topics");
    };
    switch (trendingTopics.get(id)) {
      case (?existing) {
        let updated : TrendingTopic = {
          id;
          platform;
          topic;
          hashtags;
          keywords;
          timestamp = existing.timestamp;
          metrics;
        };
        trendingTopics.add(id, updated);
      };
      case (null) { Runtime.trap("Trending topic not found") };
    };
  };

  public shared ({ caller }) func deleteTrendingTopic(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete trending topics");
    };
    trendingTopics.remove(id);
  };

  public query ({ caller }) func getTrendingTopic(id : Text) : async ?TrendingTopic {
    // Public read access - no auth required
    trendingTopics.get(id);
  };

  public query ({ caller }) func filterTrendingTopicsByPlatform(platform : Platform) : async [TrendingTopic] {
    // Public read access - no auth required
    trendingTopics.values().toArray().filter(
      func(t) {
        t.platform == platform;
      }
    );
  };

  public query ({ caller }) func getTrendingTopicsSortedByEngagement() : async [TrendingTopic] {
    // Public read access - no auth required
    trendingTopics.values().toArray().sort(TrendingTopic.compareByEngagementMetrics);
  };

  // Script Generation (User-level access required)
  public shared ({ caller }) func generateScript(
    topic : Text,
    language : { #hindi; #english; #both },
    duration : Nat,
    style : { #emotional; #dramatic }
  ) : async Script {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can generate scripts");
    };
    {
      hookLine = "Start your journey with " # topic # "!";
      mainContent = "This is the main content for " # topic # ".";
      language;
      duration;
      style;
    };
  };

  // Video Project Functions (User-level with ownership checks)
  public shared ({ caller }) func createVideoProject(
    title : Text,
    topicId : Text,
    script : Script,
    stockVideoIds : [Text],
    musicId : Text,
    voiceover : { #male; #female },
    format : { #youtubeShorts; #instagramReels; #tiktok }
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create video projects");
    };
    let id = generateId("video");
    let project : VideoProject = {
      id;
      owner = caller;
      title;
      topicId;
      script;
      stockVideoIds;
      musicId;
      voiceover;
      subtitles = true;
      format;
      watermark = true;
      created = Time.now();
      status = #draft;
    };
    videoProjects.add(id, project);

    // Add to user's video history
    switch (userAccounts.get(caller)) {
      case (?account) {
        let updatedHistory = account.videoHistory.concat([id]);
        let updatedAccount = {
          account with videoHistory = updatedHistory;
        };
        userAccounts.add(caller, updatedAccount);
      };
      case (null) {};
    };

    id;
  };

  public shared ({ caller }) func updateVideoProject(
    id : Text,
    title : Text,
    stockVideoIds : [Text],
    musicId : Text,
    voiceover : { #male; #female },
    subtitles : Bool,
    format : { #youtubeShorts; #instagramReels; #tiktok },
    watermark : Bool
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update video projects");
    };
    switch (videoProjects.get(id)) {
      case (?project) {
        if (project.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only update your own video projects");
        };
        let updated : VideoProject = {
          project with
          title;
          stockVideoIds;
          musicId;
          voiceover;
          subtitles;
          format;
          watermark;
        };
        videoProjects.add(id, updated);
      };
      case (null) { Runtime.trap("Video project not found") };
    };
  };

  public shared ({ caller }) func updateVideoProjectStatus(id : Text, status : VideoStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update video project status");
    };
    switch (videoProjects.get(id)) {
      case (?project) {
        if (project.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only update your own video projects");
        };
        let updated : VideoProject = {
          project with status;
        };
        videoProjects.add(id, updated);
      };
      case (null) { Runtime.trap("Video project not found") };
    };
  };

  public query ({ caller }) func getVideoProject(id : Text) : async ?VideoProject {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view video projects");
    };
    switch (videoProjects.get(id)) {
      case (?project) {
        if (project.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own video projects");
        };
        ?project;
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getCallerVideoProjects() : async [VideoProject] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view video projects");
    };
    videoProjects.values().toArray().filter(
      func(p) {
        p.owner == caller;
      }
    );
  };

  // User Account Functions (Self-service with ownership checks)
  public shared ({ caller }) func createUserAccount(username : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create accounts");
    };
    switch (userAccounts.get(caller)) {
      case (null) {
        let account : UserAccount = {
          username;
          tier = #free;
          coins = 100;
          created = Time.now();
          videoHistory = [];
        };
        userAccounts.add(caller, account);
      };
      case (?_) { Runtime.trap("Account already exists") };
    };
  };

  public shared ({ caller }) func upgradeToPremium() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upgrade accounts");
    };
    switch (userAccounts.get(caller)) {
      case (?account) {
        let updatedAccount = {
          account with tier = #premium;
        };
        userAccounts.add(caller, updatedAccount);
      };
      case (null) { Runtime.trap("Account not found") };
    };
  };

  public shared ({ caller }) func addCoins(amount : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add coins");
    };
    switch (userAccounts.get(caller)) {
      case (?account) {
        let updatedAccount = {
          account with coins = account.coins + amount;
        };
        userAccounts.add(caller, updatedAccount);
      };
      case (null) { Runtime.trap("Account not found") };
    };
  };

  public shared ({ caller }) func deductCoins(amount : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can deduct coins");
    };
    switch (userAccounts.get(caller)) {
      case (?account) {
        if (account.coins < amount) { Runtime.trap("Insufficient coins") };
        let updatedAccount = {
          account with coins = account.coins - amount;
        };
        userAccounts.add(caller, updatedAccount);
      };
      case (null) { Runtime.trap("Account not found") };
    };
  };

  public query ({ caller }) func getUserAccount() : async ?UserAccount {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view accounts");
    };
    userAccounts.get(caller);
  };

  public query ({ caller }) func getAccountByPrincipal(user : Principal) : async ?UserAccount {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own account");
    };
    userAccounts.get(user);
  };

  // Outcall Transform
  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func fetchTrendingTopicsFromYouTubeApi() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can fetch YouTube trending topics");
    };
    let result = await OutCall.httpGetRequest(
      "https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=IN&maxResults=10&key=", // Redacted API Key
      [],
      transform,
    );
    result;
  };

  public shared ({ caller }) func fetchTrendingTopicsFromGoogleTrendsApi() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can fetch Google Trends trending topics");
    };
    let result = await OutCall.httpGetRequest(
      "https://trends.google.com/trends/api/explore?hl=en-US&tz=-120&req=%7B%22comparisonItem%22:%5B%7B%22geo%22:%7B%22hl=en-US&tz=-120%22%7D,%22time%22:%22now%207-d%22%7D%5D,%22category%22:0%7D",
      [],
      transform,
    );
    result;
  };
};
