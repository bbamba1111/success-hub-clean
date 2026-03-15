# Sunday Shift - Free Standalone App

This is the free standalone version of the Sunday Shift experience, completely separate from the main paid hub.

## Deployment Instructions

### Option 1: Deploy via Vercel CLI

1. Navigate to the `free-app` directory:
   ```bash
   cd free-app
   ```

2. Install Vercel CLI if you haven't:
   ```bash
   npm i -g vercel
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Follow the prompts to create a new project (e.g., "sunday-shift")

### Option 2: Deploy via Vercel Dashboard

1. Download/extract the `free-app` folder as a separate repository
2. Push to a new GitHub repository (e.g., `sunday-shift`)
3. Go to [vercel.com/new](https://vercel.com/new)
4. Import the new repository
5. Deploy

### Option 3: Deploy from monorepo

If keeping both apps in the same repo:

1. Go to Vercel Dashboard
2. Create a new project
3. Connect the same repo
4. Set the **Root Directory** to `free-app`
5. Deploy

## Pages Included

- `/` - Marketing landing page (Sunday Shift sign-up)
- `/garden` - Confirmation/thank you page after sign-up
- `/audit` - Work-Life Balance Audit (free lead magnet)
- `/my-results` - Audit results page
- `/focus-areas` - Focus areas selection after audit
- `/sunday-shift` - The actual Sunday Shift session page

## Upgrading Users to Paid Hub

When users complete the free experience and want to upgrade, they should be directed to your paid hub's purchase page (e.g., SamCart). After purchase, they'll receive access to the main hub at a completely separate URL.

## Environment Variables

No environment variables are required for the free app since it doesn't use authentication or database features.

## Custom Domain

After deployment, you can add a custom domain like:
- `sundayshift.com`
- `free.maketimeformore.com`
- `thesundayshift.com`

This keeps it completely separate from your main hub URL.
