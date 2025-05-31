# S3 Deployment Guide for React SPA

This guide explains how to deploy your React Single Page Application (SPA) to S3 with proper routing support.



## Deployment Steps

1. **Build and Deploy**:
   ```bash
   cd ui
   npm run deploy:s3
   ```
2. **Manual S3 Configuration** (if the CLI command fails):
   ```bash
   # Set up website configuration
   aws s3 website s3://www.engineeringpulse.com \
     --index-document index.html \
     --error-document error.html
   
   # Make bucket public (if needed)
   aws s3api put-bucket-policy \
     --bucket www.engineeringpulse.com \
     --policy '{
       "Version": "2012-10-17",
       "Statement": [
         {
           "Sid": "PublicReadGetObject",
           "Effect": "Allow",
           "Principal": "*",
           "Action": "s3:GetObject",
           "Resource": "arn:aws:s3:::www.engineeringpulse.com/*"
         }
       ]
     }'
   ```

## Testing

After deployment, test these URLs:

- ✅ `http://www.engineeringpulse.com/`
- ✅ `http://www.engineeringpulse.com/dashboard`
- ✅ `http://www.engineeringpulse.com/contributors`
- ✅ `http://www.engineeringpulse.com/pullrequests`

All should work without 404 errors.

## How It Works

1. User visits `/dashboard` directly
2. S3 can't find a file named "dashboard" → returns 404
3. S3 serves `error.html` instead of default 404 page
4. `error.html` redirects to `/index.html?redirect=/dashboard`
5. React app loads, processes the redirect parameter
6. App navigates to `/dashboard` using React Router
7. User sees the correct page with clean URL

## Troubleshooting

**If direct URLs still don't work:**

1. Verify S3 website configuration:
   ```bash
   aws s3api get-bucket-website --bucket www.engineeringpulse.com
   ```

2. Check that `error.html` is uploaded:
   ```bash
   aws s3 ls s3://www.engineeringpulse.com/
   ```

3. Test the error document directly:
   `http://www.engineeringpulse.com/nonexistent`
   (should redirect to index.html)

**Browser Caching Issues:**
- Clear browser cache or test in incognito mode
- S3 may take a few minutes to propagate changes

## Alternative Solutions

If this approach doesn't work for your use case:

1. **CloudFront Distribution**: More robust but complex setup
2. **Hash Router**: Change to `/#/dashboard` URLs (modify App.jsx to use HashRouter)
3. **Server-side Solution**: Use CloudFront with Lambda@Edge for custom routing
