export type ContentType = 
  | "Blog Post" 
  | "Instagram Caption" 
  | "LinkedIn Post" 
  | "Twitter/X Thread" 
  | "YouTube Script" 
  | "Product Description" 
  | "Email";

export type Tone = 
  | "Professional" 
  | "Casual" 
  | "Persuasive" 
  | "Witty" 
  | "Storytelling";

export type Length = 
  | "Short" 
  | "Medium" 
  | "Long";

export interface AppUser {
  id: string;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
}

export interface ContentHistoryEntry {
  id: string;
  userId: string;
  contentType: ContentType;
  topic: string;
  outputText: string;
  createdAt: string; // ISO date string
}
