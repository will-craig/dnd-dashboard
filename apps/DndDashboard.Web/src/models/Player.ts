import type { Item } from './Item';
import type {SpellSlots} from "./SpellSlots.ts";

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
  spellSlots: SpellSlots;
};