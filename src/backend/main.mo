import Array "mo:core/Array";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Types
  public type CarType = {
    #basic;
    #sports;
    #muscle;
    #drift;
    #supercar;
  };

  public type Upgrade = {
    #nitro_boost;
    #handling;
    #acceleration;
    #top_speed;
  };

  public type Level = {
    #city_streets; // Level 1
    #downtown_rush; // Level 2
    #neon_night; // Level 3
    #highway_drift; // Level 4
    #underground_tunnel; // Level 5
    #bonus_challenge; // Level 6
  };

  public type PlayerProgress = {
    coins : Nat;
    unlockedCars : [CarType];
    unlockedUpgrades : [Upgrade];
    unlockedLevels : [Level];
    lastPlayedLevel : ?Level;
    settings : { sound : Bool; music : Bool };
  };

  public type ScoreEntry = {
    player : Principal;
    score : Nat;
    timestamp : Time.Time;
    level : Level;
  };

  public type UserProfile = {
    name : Text;
    displayName : ?Text;
  };

  module ScoreEntry {
    public func compareByScore(a : ScoreEntry, b : ScoreEntry) : Order.Order {
      Nat.compare(b.score, a.score); // Higher scores first
    };
  };

  // State
  let playerProgressMap = Map.empty<Principal, PlayerProgress>();
  var scoreEntries = ([] : [ScoreEntry]);
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Functions (required by instructions)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
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

  // Player Progress Functions
  public shared ({ caller }) func saveProgress(progress : PlayerProgress) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save progress");
    };
    playerProgressMap.add(caller, progress);
  };

  public query ({ caller }) func getProgress() : async ?PlayerProgress {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get progress");
    };
    playerProgressMap.get(caller);
  };

  // Leaderboard Functions
  public shared ({ caller }) func submitScore(score : Nat, level : Level) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit scores");
    };

    let entry : ScoreEntry = {
      player = caller;
      score;
      timestamp = Time.now();
      level;
    };

    scoreEntries := scoreEntries.concat([entry]);
  };

  public query func getTopScores(limit : Nat) : async [ScoreEntry] {
    // Public access - no authorization check needed (guests can view leaderboards)
    let sortedScores = scoreEntries.sort(ScoreEntry.compareByScore);
    let takeLimit = if (sortedScores.size() < limit) { sortedScores.size() } else {
      limit;
    };
    Array.tabulate(takeLimit, func(i : Nat) : ScoreEntry { sortedScores[i] });
  };

  public query ({ caller }) func getPlayerScores(player : Principal) : async [ScoreEntry] {
    // Allow users to view their own scores, admins can view any
    if (caller != player and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own scores");
    };

    let playerScores = scoreEntries.filter(func(entry : ScoreEntry) : Bool { entry.player == player });
    playerScores.sort(ScoreEntry.compareByScore);
  };
};
