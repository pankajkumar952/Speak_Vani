export type TopicType =
  | 'TECHNICAL'
  | 'DEBATE'
  | 'SCIENCE'
  | 'BUSINESS'
  | 'INTERVIEW'
  | 'STORY'
  | 'GENERAL'
  | 'KIDS';

export interface PrefilledSection {
  title: string;
  content: string;
}

export interface PrefilledGuide {
  id: string;
  topic: string;
  category: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  audience?: 'GENERAL' | 'KIDS_5_7' | 'KIDS_8_10' | 'KIDS_11_13';
  topicType?: TopicType;
  fullParagraph: string;
  sections?: PrefilledSection[];
}
