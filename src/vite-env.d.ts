/// <reference types="vite/client" />

type Variant = {
  ID: string;
  ItemID: string;
  Channel: string;
  Owned: string[];
  Active: string;
};

type Item = {
  ID: string;
  TemplateID: string;
  Quantity: number;
  Favorite: boolean;
  HasSeen: boolean;
  Variants: Variant[];
  ProfileType: string;
};

type Gift = {
  ID: string;
  ProfileID: string;
  TemplateID: string;
  Quantity: number;
  FromID: string;
  GiftedAt: number;
  Message: string;
  Loot: Item[];
};

type Quest = {
  ID: string;
  ProfileID: string;
  TemplateID: string;
  State: string;
  Objectives: string[];
  ObjectiveCounts: number[];
  BundleID: string;
  ScheduleID: string;
};

type Attribute = {
  ID: string;
  ProfileID: string;
  Key: string;
  ValueJSON: string;
  Type: string;
};

type Loadout = {
  ID: string;
  PersonID: string;
  ProfileID: string;
  TemplateID: string;
  LockerName: string;
  BannerID: string;
  BannerColorID: string;
  CharacterID: string;
  PickaxeID: string;
  BackpackID: string;
  GliderID: string;
  DanceID: string[];
  ItemWrapID: string[];
  ContrailID: string;
  LoadingScreenID: string;
  MusicPackID: string;
};

type Profile = {
  ID: string;
  Items: Record<string, Item>;
  Gifts: Record<string, Gift>;
  Quests: Record<string, Quest>;
  Attributes: Record<string, Attribute>;
  Loadouts: Record<string, Loadout>;
  Revision: number;
  Type: string;
};

type DiscordAccount = {
  ID: string;
  PersonID: string;
  Username: string;
  Avatar: string;
  Banner: string;
  AccessToken: string;
  RefreshToken: string;
};

type Ban = {
  ID: string;
  PersonID: string;
  IssuedBy: string;
  Expiry: string;
  Reason: string;
};

type Person = {
  ID: string;
  DisplayName: string;
  RefundTickets: number;
  Permissions: number;
  AthenaProfile: Profile;
  CommonCoreProfile: Profile;
  CommonPublicProfile: Profile;
  Profile0Profile: Profile;
  CollectionsProfile: Profile;
  CreativeProfile: Profile;
  BanHistory: Ban[];
  Discord: DiscordAccount;
  Relationships: Record<string, Relationship>;
  Parties: Record<string, Party>;
  Invites: Record<string, Invite>;
  Intentions: Record<string, Intention>;
};

type LibraryEntry = {
  releaseVersion: number;
  title: string;
  description: string;
  posterPath: string;
  binaryPath: string;
  binaryHash: string;
  path: string;
};
