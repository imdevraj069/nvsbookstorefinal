#!/bin/bash

# Migration Guide for Slug-based Navigation Update

echo "🚀 Starting slug migration for NVS Book Store..."
echo ""
echo "This script will:"
echo "  1. Generate unique slugs for all existing notifications"
echo "  2. Generate unique slugs for all existing products"
echo "  3. Ensure all slugs are unique by appending numbers if needed"
echo ""

# Make sure you're in the project root
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Run the migration script
echo "📝 Running slug generation script..."
node scripts/generate-slugs.js

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migration completed successfully!"
    echo ""
    echo "📋 Summary of changes:"
    echo "  - Notification model: Added unique slug field"
    echo "  - Product model: Added unique slug field"
    echo "  - API routes: /notification/[slug], /product/[slug]"
    echo "  - Navigation: All links now use slug instead of ID"
    echo "  - Package.json: framer-motion already installed (not motion)"
    echo ""
    echo "🎯 Next steps:"
    echo "  1. Verify database has all slugs generated"
    echo "  2. Test notification and product page navigation"
    echo "  3. Verify all links work correctly"
    echo ""
else
    echo "❌ Migration failed. Please check the error messages above."
    exit 1
fi
