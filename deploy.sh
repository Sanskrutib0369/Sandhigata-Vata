#!/bin/bash

# Build the app
npm run build

# Deploy to GitHub Pages
gh-pages -d dist --dotfiles --message "Deploy Sandhigata Vata Diagnosis App"

echo "✅ App deployed successfully!"
echo "🌐 Your app is available at: https://sanskrutib0369.github.io/ABHUBAKKAR-DUBAI/"
