<?php
error_reporting(E_ALL);
ini_set('display_errors', 0); // IMPORTANT for JSON APIs
// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'admin');  // Change this to your phpMyAdmin username
define('DB_PASS', 'landingpage');      // Change this to your phpMyAdmin password
define('DB_NAME', 'landing_page_db');

// Email configuration
define('SMTP_HOST', 'smtp.gmail.com');  // Change to your SMTP host
define('SMTP_PORT', 587);
define('SMTP_USER', 'your-email@gmail.com');  // Change to your email
define('SMTP_PASS', 'xxx xxx xxx');     // Change to your app password
define('FROM_EMAIL', 'from_email@gmail.com');
define('FROM_NAME', 'TaskMan');

// Create database connection
function getDatabaseConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    return $conn;
}
?>
