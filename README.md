# 🎓 AcademiaMarket

### *Connecting Students through Collaborative Academic Support*

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/953db5b1-1e1a-4f98-807e-f2f9b46d653f" />

**AcademiaMarket** is a high-fidelity, peer-to-peer (P2P) marketplace designed specifically for the university ecosystem. It provides a secure environment where students can outsource time-intensive, manual academic tasks—such as record book handwriting, assignment formatting, and note transcription—to fellow students within their local campus community.

---

## 🌟 Core Philosophy: Peer-to-Peer Assistance

AcademiaMarket transforms academic assistance from a corporate transaction into a **community-driven "peer support" model**.

* **Helpers (@writ):** Students who monetize their manual skills (neat handwriting, fast typing) and academic labor.
* **Students (@assign):** Users who need assistance managing heavy workloads of formatting and transcription.
* **Local Trust:** By matching users within the same university and pincode, we ensure institutional familiarity and the possibility of safe, in-person handovers.

---

## 🚀 Key Features

### 1. Role-Based Identity

* **Helpers:** Build professional portfolios, set suggested "Support Contributions" per page, and manage availability.
* **Students:** Post specific help requests, browse verified local helpers, and track project status via a live dashboard.

### 2. Hyper-Local Trust System

Built-in university and pincode matching. Profiles feature **"College Mate"** or **"Nearby"** badges to ensure the helper understands specific faculty requirements.

### 3. Smart Support Estimation

An integrated pricing engine suggests fair rates based on:

* **Page Volume:** Total count of pages.
* **Format Type:** Differential pricing for handwritten vs. digital transcription.
* **Urgency Multipliers:** Automatic priority fee detection for 24–72 hour deadlines.

### 4. Structured Task Handshake

A robust state machine manages the lifecycle of every partnership:
`Pending` → `Requested` → `Partnered Up` → `In Progress` → `In Review` → `Finished`.

### 5. Secure Collaboration Hub

* **Real-time Chat:** Private rooms for every active partnership.
* **File Sharing Guide:** Integrated instructions for exchanging Google Drive/Dropbox links securely.

---

## 🛠 Technical Stack

| Layer | Technology |
| --- | --- |
| **Frontend** | React 19 (ES6 Modules) |
| **Styling** | Tailwind CSS (Neumorphic Design) |
| **Backend/Auth** | Firebase (Firestore & Authentication) |
| **Data Viz** | Recharts (Progress & Activity Tracking) |
| **Identity** | Dicebear API (Custom Student Avatars) |

---

## 📦 Installation & Setup

1. **Clone the repository:**
```bash
git clone https://github.com/aruchith08/AcademiaMarket.git
cd academiamarket

```


2. **Install dependencies:**
```bash
npm install

```


3. **Environment Configuration:**
Create a `.env` file or update `src/lib/firebase.ts` with your Firebase credentials:
```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  // ...
};

```


4. **Run the application:**
```bash
npm run dev

```



---

## ⚖️ Academic Integrity & Legal Disclaimer

AcademiaMarket is intended for **manual labor and formatting support only**.

* **Ethical Usage:** Users must adhere to their institution’s Academic Integrity Policies.
* **Prohibited Content:** The platform does not facilitate plagiarism, cheating, or the completion of graded assessments/exams on behalf of others.
* **Scope:** Helpers provide support in the **presentation and transcription** of the student's own original work.

---

## 🎨 UI/UX Design

The application features a sophisticated **Indigo & Slate** palette with a mobile-first philosophy. The **Neumorphic design language** provides a clean, tactile environment mirroring modern productivity tools like Notion or Obsidian.

---

## 📘 What I Learned

- Designing role-based access flows for two different user types
- Modeling real-world task lifecycles using state machines
- Structuring a scalable Firebase data model
- Building trust mechanisms for peer-to-peer platforms
- Translating a real student pain point into a functional product

---

## 🤖 AI Assistance Note

AI tools were used during development for ideation and code scaffolding.
All features were understood, customized, and integrated by me as part of my learning process.


Created with ❤️ for the student community.
