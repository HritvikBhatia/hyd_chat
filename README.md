# 💬 Hyderabad Group Chatbot (Featuring Saleem Pheku)

A fun, ultra-fast, dark-themed conversational chatbot built using **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**. It is powered by the official **@google/genai SDK** using the `gemini-2.5-flash` streaming engine.

Instead of a generic AI assistant, this project features **Saleem Pheku**—a legendary, raw, and aggressively sarcastic Hyderabadi tapori character who roasts the user with zero patience and loads of localized street slang (*Baigan*, *Haule*, *Nakko*, *Chindi Chor*).

---

## 🚀 Features

* 🧠 **Ronny Persona:** Programmed with dynamic system instructions to deliver pure comedic roasts. He logically shuts down generic automated questions (like asking for the weather) and calls out the user as *motu* or *patlu*.
* ⚡ **Ultra-Low Latency Streaming:** Uses the core text-generation engine (`generateContentStream`) to stream tokens word-by-word into the UI within milliseconds.
* 👁️ **Multi-Turn Chat Memory:** Structurally maps full conversation history (`role` and `parts`) so Saleem remembers what you said earlier and can use it against you.
* 🌑 **Sleek Dark Mode UI:** Modern minimalist interface styled entirely with Tailwind's Zinc-950 palettes.
* 🛡️ **Secure Server Architecture:** Uses Next.js Route Handlers as a secure backend bridge to hide your Google AI Studio API key completely from the client side.

---

## 🛠️ Tech Stack

* **Framework:** Next.js 15+ (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **AI Engine:** Official `@google/genai` SDK (`gemini-2.5-flash`)
* **Hosting:** Vercel

---

## 📦 Getting Started

### 1. Clone and Install

Clone this repository to your local machine and install the required dependencies:

```bash
git clone https://github.com/YOUR_USERNAME/hyd-chatbot.git
cd hyd-chatbot
npm install

```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory of your project:

```env
GEMINI_API_KEY=your_actual_google_ai_studio_api_key

```

> ⚠️ **Note:** Never commit this file or expose your key publicly. Next.js will automatically look for this key on the server route handler layer.

### 3. Run Locally

Fire up the local development network server:

```bash
npm run dev

```

Open [http://localhost:3000](http://localhost:3000) in your web browser to start chatting with Saleem.

---

## 📁 Project Structure

```text
hyd-chatbot/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts  # Backend streaming handler & system instructions
│   ├── layout.tsx        # App root layout
│   └── page.tsx          # Frontend Dark UI & client-side stream parser
├── .env.local            # API keys (Git ignored)
├── package.json
└── tailwind.config.ts

```

---

## 🚀 Deploying to Vercel

Since this project uses Next.js, it is pre-optimized for **Vercel**:

1. Push your local project code repository up to **GitHub**.
2. Log into the **Vercel Dashboard** and click **Add New > Project**.
3. Import your `hyd-chatbot` repository.
4. Expand the **Environment Variables** drop-down menu and add:
* **Key:** `GEMINI_API_KEY`
* **Value:** *[Your real Gemini API Key]*


5. Click **Deploy**. Vercel will bundle the repository structure and give you a live production URL in under a minute!