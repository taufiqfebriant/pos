
# POS

Simple POS application
## Tech Stack

**Client:** Next.js, Chakra UI, React Query, React Hook Form

**Server:** Node.js, MySQL, Mercurius, Redis, Prisma

  
## Run Locally

Clone the project

```bash
git clone https://github.com/taufiqfebriant/pos.git
```

Go to the project directory

```bash
cd pos
```

Install server dependencies

```bash
cd server && npm install
```

Duplicate `.env.example` to `.env` and fill some options

```dosini
NODE_ENV=development

CLIENT_URL=http://localhost:3000
DATABASE_URL="mysql://USERNAME:PASSWORD@HOST:PORT/DATABASE"

# You can generate it using node, require('crypto').randomBytes(64).toString('hex')
SESSION_SECRET=
# The name of the session ID cookie
SESSION_NAME=
# The duration of the session
SESSION_MAX_AGE=
```

Generate and apply migrations

```bash
npx prisma migrate dev
```

Start the server

```bash
npm run dev
```

Install client dependencies

```bash
cd client && npm install
```

Duplicate `.env.example` to `.env.local`

```dosini
NEXT_PUBLIC_APP_NAME=empatdua
NEXT_PUBLIC_SERVER_URL=http://localhost:4000
```

Start the client

```bash
npm run dev
```

  