export type Document = {
  userId: string;
  created: Date;
  updated: Date;
  characters: Character[];
};

export type Character = {
  id: string;
  name: string;
  race: string;
  gender?: string;
};
