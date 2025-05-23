export type Item = {
  name: string;
  magic?: boolean;
  quantity?: number;
  type?: 'item' | 'item-qty' | 'ammo' | 'key';
};