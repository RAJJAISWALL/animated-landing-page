# Quick Setup Guide - TaskMan Landing Page


**Using phpMyAdmin:**
1. Open phpMyAdmin in your browser (http://localhost/phpmyadmin)
2. Click "New" to create a database
3. Name it: `landing_page_db`
4. Click on the database name
5. Go to "SQL" tab
6. Open `database/schema.sql` file
7. Copy all content and paste in SQL box
8. Click "Go"

✅ Database is ready!

### 2. Configure Settings (1 minute)

**Edit `includes/config.php`:**
```php
// Only change these 3 lines:
define('DB_USER', 'root');        // Your phpMyAdmin username
define('DB_PASS', '');            // Your phpMyAdmin password (usually empty for local)
define('DB_NAME', 'landing_page_db');
```

✅ Configuration complete!

### 3. Deploy Files (2 minutes)

**For XAMPP:**
1. Copy `landing-page` folder to: `C:/xampp/htdocs/`
2. Start Apache and MySQL in XAMPP Control Panel
3. Open browser: `http://localhost/landing-page/`


## ✅ Testing

1. Open: `http://localhost/landing-page/`
2. Scroll to signup section
3. Fill the form:
   - Name: Test User
   - Email: test@example.com
   - Phone: 1234567890
4. Click "Get My Coupon"
5. Check for success message with coupon code!















