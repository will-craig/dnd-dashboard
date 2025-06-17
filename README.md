# D&D Player Dashboard

A lightweight, interactive web app for managing Dungeons & Dragons player states. It allows DMs and players to view and update HP, AC, conditions, inventory, and other key stats in real-time, in a real time session, using web sockets.

---

## Tech

- **React + Redux**
- **Vite** — dev server
- **TailwindCSS** — styling
- **.NET backend**, asp.net, redis cache, signalr, rabbitmq


## Features

- Editable player name
- HP & Max HP inputs with damage/threat visual cues 
- AC (Armor Class) input with shield icon
- Uploadable player portrait
- Status conditions manager with emoji indicators
- Inventory manager with:
  - Normal items
  - Magic items (highlighted)
  - Ammo with editable count
  - Keys (separately listed)
- Gold tracker
- Customizable spell slots

## Launching locally
- Have added a docker compose for containerizing everything, need to make some tweaks to default setup as not working out the box at the moment
