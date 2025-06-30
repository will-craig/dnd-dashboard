# D&D Player Dashboard

A lightweight, interactive web app for managing Dungeons & Dragons player states. It allows DMs and players to view and update HP, AC, conditions, inventory, and other key stats in real-time, in a real time session, using web sockets.

---

## Tech

- **React + Redux**
- **Vite** — dev server
- **TailwindCSS** — styling
- **.NET backend**, asp.net, redis cache, signalr, rabbitmq


## Features

- Customizable spell slots
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

## Launching locally
- Have added a docker compose for containerizing everything, need to make some tweaks to default setup as not working out the box at the moment

## Things still todo:

- Testing. Havent written any tests yet, as this was rush to do a MVP before my next D&D session (2 week turnaround)
    - Unit tests
    - Create web driven acceptance tests (playwrite) integrate them into pipeline)
- Authentication & Authorization: Add identity layer, maybe sso or aad
- Ensure SignalR only allows users to join specific sessions they have access to? Cap number of players that can join sessions
- Fine tune and tweak things: Limit SignalR/Redis/Service Access/ CORS Lockdown
- App Service Firewalling: Use Azure Front Door or Application Gateway for WAF and threat detection.
- clean up view for mobile mode (some component boxes bleed over atm)
- Figure out a way to monitize (ads) so I can use higher than 'free' tier options in azure.

- Add some new features:
    - Add a read only mode, for the DM, so that other users joining session can't make changes
    - Add view/hide option to components within player card
    - Add 'custom' fields
    - Add a dice role feature (Maybe add a cool 3d dice on screen somehow)
