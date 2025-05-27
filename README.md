# D&D Player Dashboard

A lightweight, interactive web app for managing Dungeons & Dragons player states. It allows DMs and players to view and update HP, AC, conditions, inventory, and other key stats in real-time.

---

## Technologies

- **React + TypeScript** — component-based UI structure with type safety
- **Vite** — fast dev server and bundler
- **TailwindCSS** — utility-first styling
- **Modular Components** — broken into logical units like PlayerCard, InventoryManager, StatusManager, etc.


## Features

- Editable player name
- HP & Max HP inputs with damage/threat visual cues (pulse/red border)
- AC (Armor Class) input with shield icon
- Uploadable player portrait (optional)
- Status conditions manager with emoji indicators
- Inventory manager with:
  - Normal items
  - Magic items (highlighted)
  - Ammo with editable count
  - Keys (separately listed)
- Gold (currency) tracker

## Planned Features

- Real-time updates using SignalR or Firebase
- Undo recent changes
- Spell slot tracker
- Responsive/mobile optimization
- Settings panel for themes or light/dark mode

TODO:
- Finish granulating components 
- Implement Redux for state management before introducing signal r