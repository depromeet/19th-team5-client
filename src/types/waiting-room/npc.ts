/** 대기실에서 면접자의 연습을 돕는 NPC */
export type Npc = {
  name: string;
  greeting: string;
  profileImageUrl: string;
  category: string;
  tips: readonly string[];
};

export type NpcQuestion = { title: string; prompt: string; answer: string };
