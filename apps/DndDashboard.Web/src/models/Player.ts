import type { Item } from './Item';

export type Player = {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  ac: number;
  gold: number;
  image?: string;
  status: string[];
  items: Item[];
};