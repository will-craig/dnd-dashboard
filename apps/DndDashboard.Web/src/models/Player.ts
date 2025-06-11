import type { Item } from './Item';
import type {SpellSlot} from "./SpellSlots.ts";

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
  spellSlots: SpellSlot[];
};