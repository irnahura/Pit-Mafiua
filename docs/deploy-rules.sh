#!/bin/bash

# Firebase Rules Deployment Script
# This script deploys the updated Firestore security rules

echo "🔥 Firebase Rules Deployment Script"
echo "===================================="
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null
then
    echo "❌ Firebase CLI not found!"
    echo ""
    echo "Install it with:"
    echo "  npm install -g firebase-tools"
    echo ""
    echo "Or deploy manually:"
    echo "  1. Go to: https://console.firebase.google.com/project/polarisgp-fd2c3/firestore/rules"
    echo "  2. Copy content from firestore.rules"
    echo "  3. Paste and click 'Publish'"
    exit 1
fi

echo "✅ Firebase CLI found"
echo ""

# Check if logged in
echo "🔐 Checking Firebase authentication..."
firebase projects:list &> /dev/null

if [ $? -ne 0 ]; then
    echo "❌ Not logged in to Firebase"
    echo ""
    echo "Please login first:"
    echo "  firebase login"
    exit 1
fi

echo "✅ Authenticated"
echo ""

# Deploy rules
echo "🚀 Deploying Firestore security rules..."
echo ""

firebase deploy --only firestore:rules

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Rules deployed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "  1. Test the standings page: http://localhost:3000/standings"
    echo "  2. Add sample data (see STANDINGS_SETUP.md)"
    echo "  3. Deploy to production"
    echo ""
else
    echo ""
    echo "❌ Deployment failed!"
    echo ""
    echo "Try manual deployment:"
    echo "  1. Go to: https://console.firebase.google.com/project/polarisgp-fd2c3/firestore/rules"
    echo "  2. Copy content from firestore.rules"
    echo "  3. Paste and click 'Publish'"
    exit 1
fi
