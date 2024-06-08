# Check Email

## Description

This is a simple webapp that classifies emails into various categories like spam, promotions, social, etc. 

The webapp uses a OpenAI GPT-4o model to classify the emails.



## How to Setup

1. Clone the repository

2. Install the dependencies

    `npm install` or `pnpm install`

3. Rename the `.env.example` file to `.env` and add the required environment variables

4. Start the server

    `npm run dev`

5. Open the browser and go to `http://localhost:3000`

## How to use
1. Login with your Google account
2. Enter the OpenAI API key
3. Select the number of emails you want to fetch
4. Click on the `Fetch Emails` button
5. Now click on the `Classify Emails` button to classify the emails



## Tech Stack
- NextJS
- TailwindCSS
- OpenAI GPT-4o
- MongoDB

