# Deployment Instructions (Render)

This backend is designed to be deployed on [Render](https://render.com/).

## Prerequisites
- A GitHub repository containing this code.
- A MongoDB Atlas cluster.
- A Cloudinary account.
- An OpenAI API key.
- A SendGrid account (for emails).

## Steps

1.  **Create a New Web Service on Render:**
    - Connect your GitHub repository.
    - Select the repository containing this project.

2.  **Configure the Service:**
    - **Name:** `craft-heart-connect-backend`
    - **Region:** Choose the one closest to you/your users.
    - **Branch:** `main`
    - **Root Directory:** `backend`
    - **Runtime:** `Node`
    - **Build Command:** `npm install`
    - **Start Command:** `node server.js`

3.  **Environment Variables:**
    Add the following environment variables in the "Environment" tab:

    | Key | Value |
    | --- | --- |
    | `NODE_ENV` | `production` |
    | `MONGODB_URI` | Your MongoDB Atlas connection string |
    | `JWT_SECRET` | A strong random string for access tokens |
    | `JWT_REFRESH_SECRET` | A strong random string for refresh tokens |
    | `CLOUDINARY_CLOUD_NAME` | Your Cloudinary Cloud Name |
    | `CLOUDINARY_API_KEY` | Your Cloudinary API Key |
    | `CLOUDINARY_API_SECRET` | Your Cloudinary API Secret |
    | `OPENAI_API_KEY` | Your OpenAI API Key |
    | `SENDGRID_API_KEY` | Your SendGrid API Key |
    | `EMAIL_FROM` | Your verified SendGrid sender email |
    | `FRONTEND_URL` | The URL of your deployed Vercel frontend (e.g., `https://your-app.vercel.app`) |

4.  **Deploy:**
    - Click "Create Web Service".

5.  **Important Note on Cookies:**
    - Since we are using `httpOnly` cookies for refresh tokens, ensure your Frontend URL is correctly set in `FRONTEND_URL`.
    - The backend is configured with `sameSite: 'None'` and `secure: true` to allow cross-site cookies between Vercel and Render.
