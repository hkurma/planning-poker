# 🃏 SprintPokr

A real-time, peer-to-peer planning poker application for agile teams. Estimate stories together without the need for a central server — powered by WebRTC.

![Angular](https://img.shields.io/badge/Angular-21-DD0031?style=flat&logo=angular&logoColor=white)
![PeerJS](https://img.shields.io/badge/PeerJS-WebRTC-00C7B7?style=flat)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat&logo=tailwindcss&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat&logo=pwa&logoColor=white)

## ✨ Features

- **🔗 Peer-to-Peer** — No backend required. Direct browser-to-browser communication via WebRTC
- **🚀 Create & Join Rooms** — Generate a shareable room code instantly or join an existing session
- **🗳️ Real-time Voting** — See who has voted in real-time, votes stay hidden until reveal
- **👁️ Reveal & Reset** — Host controls when votes are revealed and when to start a new round
- **🎯 Consensus Detection** — Visual indicator when the team reaches unanimous agreement
- **🎉 Celebration Mode** — Confetti animation when consensus is achieved
- **🌓 Dark/Light Theme** — Toggle between themes for comfortable viewing
- **📋 Easy Sharing** — One-click copy room code to clipboard
- **📱 PWA Support** — Install on any device for a native app experience
- **🔄 Connection Resilience** — Auto-reconnect support and room recovery
- **✏️ Edit Name** — Change your display name anytime during a session
- **💾 Remember Me** — Your name is saved for quick re-joining

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Angular 21** | Frontend framework with signals & standalone components |
| **PeerJS** | WebRTC abstraction for P2P real-time communication |
| **TailwindCSS 4** | Utility-first CSS styling |
| **Angular Service Worker** | PWA with offline caching |
| **Canvas Confetti** | Celebration animations |
| **human-id** | Human-readable room code generation |
| **Vitest** | Unit testing framework |

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ 
- npm 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/sprintpokr.git
cd sprintpokr

# Install dependencies
npm install

# Start the development server
npm start
```

Open your browser and navigate to `http://localhost:4200/`

## 📖 How to Use

### Getting Started

1. Visit the landing page and click **Get Started**
2. Enter your name in the lobby

### Creating a Room

1. Enter your name in the lobby
2. Click **Create Room**
3. Share the room code with your team

### Joining a Room

1. Enter your name
2. Paste the room code shared with you
3. Click **Join Room**

Alternatively, you can join directly via a shared link (e.g., `https://yourapp.com/happy-blue-dog`).

### During Estimation

1. **Vote** — Select a card from the deck to cast your estimate
2. **Reveal** — Once everyone has voted, the host reveals all votes
3. **Discuss** — If there's no consensus, discuss and re-vote
4. **Reset** — Start a new round for the next story

### Editing Your Name

Click the pencil icon (✏️) next to your name in the players area to update your display name. Changes are instantly visible to all participants.

### Connection Handling

SprintPokr handles various connection scenarios gracefully:

| Scenario | Behavior |
|----------|----------|
| **Room Not Found** | Shows modal with retry option when joining an invalid room code |
| **Host Disconnects** | Guests see "Room Not Found" modal with option to retry |
| **Host Rejoins** | If you close the browser as host, returning to the same URL recreates your room |
| **Guest Disconnects** | Host and other guests are notified within seconds |
| **Network Issues** | Quick detection via WebRTC ICE state monitoring |

> **Note:** Since SprintPokr is fully peer-to-peer, the room exists only while the host is connected. If the host leaves, guests can wait and retry when the host returns.

## 📱 Install as PWA

SprintPokr can be installed as a Progressive Web App for a native-like experience:

### Desktop (Chrome/Edge)
1. Visit the app in your browser
2. Click the **install icon** (⊕) in the address bar
3. Click **Install**

### Mobile (iOS)
1. Open the app in Safari
2. Tap the **Share** button
3. Select **Add to Home Screen**

### Mobile (Android)
1. Open the app in Chrome
2. Tap the **three-dot menu**
3. Select **Install app** or **Add to Home Screen**

Once installed, SprintPokr runs in its own window with:
- ✅ Offline access to the app shell
- ✅ Home screen icon
- ✅ Full-screen experience (no browser UI)
- ✅ Faster load times with cached assets

## 🧪 Running Tests

```bash
npm test
```

## 📦 Building for Production

```bash
npm run build
```

Build artifacts will be stored in the `dist/` directory.

## 🏗️ Project Structure

```
src/
├── app/
│   ├── components/          # Shared UI components
│   │   ├── background/      # Animated background
│   │   ├── icons/           # SVG icon components
│   │   ├── logo/            # App logo
│   │   ├── theme-toggle/    # Dark/light mode toggle
│   │   └── ui/              # Button, Card, Input primitives
│   ├── landing/             # Landing page (/)
│   ├── lobby/               # Create/Join room page (/lobby)
│   ├── room/                # Main poker room (/:roomId)
│   │   ├── edit-name-modal/ # Modal for editing display name
│   │   ├── join-modal/      # Modal for joining via link
│   │   ├── not-found-modal/ # Room not found / connection error
│   │   ├── player-card/     # Individual player display
│   │   ├── players-area/    # Grid of all players
│   │   ├── room-actions/    # Reveal/Reset controls
│   │   ├── room-header/     # Room info & navigation
│   │   └── voting-cards/    # Card selection deck
│   ├── services/            # Angular services
│   │   ├── peer.service     # PeerJS WebRTC wrapper
│   │   ├── room.service     # Room state management
│   │   └── theme.service    # Theme persistence
│   └── utils/               # Utility functions
├── styles.css               # Global styles & Tailwind
└── index.html               # Entry point
```

## 🗺️ Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page with features overview |
| `/lobby` | Create or join a room |
| `/:roomId` | Active poker room |

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ for agile teams everywhere
</p>
