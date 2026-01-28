# CodeTribe LMS - Learning Management System

## Project Info

A modern Learning Management System built for CodeTribe Academy. This platform provides an interactive learning experience with courses, tutorials, progress tracking, and an AI-powered chatbot assistant.

## Features

- **Dashboard**: Overview of your learning progress
- **Courses**: Access to React, TypeScript, and other programming tutorials
- **Tasks**: Assignment tracking and submission
- **Progress**: Visual representation of your learning journey
- **Announcements**: Stay updated with the latest news
- **AI Chatbot**: Real-time AI assistant powered by OpenAI to help with your learning

## Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- OpenAI API key - [Get one here](https://platform.openai.com/api-keys)

## How to Run

Follow these steps:

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd lms-chatbot-main

# Step 3: Install the necessary dependencies
npm install

# Step 4: Set up environment variables
# Create a .env.local file and add your OpenAI API key:
# VITE_OPENAI_API_KEY=your_api_key_here

# Step 5: Start the development server
npm run dev
```

## Getting Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Click "Create new secret key"
5. Copy the key and add it to your `.env.local` file
6. **Important**: Add billing information to your OpenAI account to use the API

**Note**: The API is not free, but OpenAI provides $5 in free credits for new users. Monitor your usage at [OpenAI Usage Dashboard](https://platform.openai.com/usage).

## Technologies Used

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- OpenAI API (GPT-3.5-turbo)

## Deployment

Build the project for production:

```sh
npm run build
```

The output will be in the `dist` folder, ready to be deployed to any static hosting service.
