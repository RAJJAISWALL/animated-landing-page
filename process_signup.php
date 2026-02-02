
<?php
require_once 'includes/config.php';

// Import PHPMailer classes
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Load PHPMailer
require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

// header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $response = ['success' => false, 'message' => ''];
    
    // Get and sanitize input
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    
    // Validation
    if (empty($name)) {
        $response['message'] = 'Name is required';
        echo json_encode($response);
        exit;
    }
    
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = 'Valid email is required';
        echo json_encode($response);
        exit;
    }
    
    if (!empty($phone) && !preg_match('/^[0-9+\-\s()]{10,20}$/', $phone)) {
        $response['message'] = 'Valid phone number is required';
        echo json_encode($response);
        exit;
    }
    
    try {
        $conn = getDatabaseConnection();
        
        // Check if email already exists
        $stmt = $conn->prepare("SELECT id FROM signups WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $response['message'] = 'This email is already registered';
            echo json_encode($response);
            exit;
        }
        
        // Get a random active coupon
        $couponQuery = "SELECT coupon_code, discount_percentage, description FROM coupons WHERE is_active = TRUE ORDER BY RAND() LIMIT 1";
        $couponResult = $conn->query($couponQuery);
        
        if ($couponResult->num_rows === 0) {
            $response['message'] = 'No coupons available at the moment';
            echo json_encode($response);
            exit;
        }
        
        $coupon = $couponResult->fetch_assoc();
        $couponCode = $coupon['coupon_code'];
        $discount = $coupon['discount_percentage'];
        $couponDesc = $coupon['description'];
        
        // Insert signup
        $ip_address = $_SERVER['REMOTE_ADDR'];
        $stmt = $conn->prepare("INSERT INTO signups (name, email, phone, coupon_sent, ip_address) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $name, $email, $phone, $couponCode, $ip_address);
        
        if ($stmt->execute()) {
            // Send email with coupon using PHPMailer
            $emailResult = sendCouponEmail($name, $email, $couponCode, $discount, $couponDesc);
            
            if ($emailResult === true) {
                $response['success'] = true;
                $response['message'] = 'Thank you for signing up! Check your email for your exclusive coupon code.';
                $response['coupon'] = $couponCode;
            } else {
                $response['success'] = true;
                $response['message'] = 'Signup successful! Your coupon code is: ' . $couponCode;
                $response['coupon'] = $couponCode;
                $response['emailWarning'] = $emailResult; // Show error details
            }
        } else {
            $response['message'] = 'An error occurred. Please try again.';
        }
        
        $stmt->close();
        $conn->close();
        
    } catch (Exception $e) {
        $response['message'] = 'An error occurred: ' . $e->getMessage();
    }
    
    echo json_encode($response);
    exit;
}

function sendCouponEmail($name, $email, $couponCode, $discount, $description) {
    $mail = new PHPMailer(true);
    
    try {
        // Server settings
        $mail->isSMTP();
        

        $mail->Host       = SMTP_HOST;
        $mail->SMTPAuth   = true;
        $mail->Username   = SMTP_USER;
        $mail->Password   = SMTP_PASS;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = SMTP_PORT;
        
       
        // Recipients
        $mail->setFrom(FROM_EMAIL, FROM_NAME);
        $mail->addAddress($email, $name);
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = "Your Exclusive TaskMan Coupon Code - {$discount}% OFF!";
        
        $mail->Body = "
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .coupon-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
                .coupon-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 2px; }
                .discount { font-size: 24px; color: #764ba2; margin: 10px 0; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>Welcome to TaskMan!</h1>
                    <p>Thank you for signing up, {$name}!</p>
                </div>
                <div class='content'>
                    <p>We're excited to have you on board! As a special welcome gift, here's your exclusive discount coupon:</p>
                    
                    <div class='coupon-box'>
                        <div class='discount'>{$discount}% OFF</div>
                        <div class='coupon-code'>{$couponCode}</div>
                        <p style='margin-top: 15px; color: #666;'>{$description}</p>
                    </div>
                    
                    <p>Use this code at checkout to enjoy your discount. This offer is exclusively for you!</p>
                    
                    <p style='margin-top: 30px;'>Best regards,<br><strong>The TaskMan Team</strong></p>
                </div>
                <div class='footer'>
                    <p>© 2026 TaskMan. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        ";
        
        $mail->AltBody = "Welcome to TaskMan, {$name}! Your exclusive coupon code is: {$couponCode} for {$discount}% OFF. {$description}";
        
        $mail->send();
        return true;
    } catch (Exception $e) {
        return "Email could not be sent. Mailer Error: {$mail->ErrorInfo}";
        // throw new Exception($mail->ErrorInfo);

    }
}
?>
