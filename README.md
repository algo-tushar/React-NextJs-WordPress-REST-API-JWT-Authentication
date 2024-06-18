# Next.js WordPress REST API JWT Authentication

This project demonstrates how to implement JWT (JSON Web Tokens) authentication in a Next.js application using WordPress as the backend. It includes features like dark/light mode, login using credentials and Google, and API-based profile updates.

## Features

- **Latest Next.js and TailwindCSS:** Utilizes the latest versions for improved performance and development experience.
- **Dark/Light Mode Support:** Provides a visually appealing experience with support for both dark and light themes.
- **Credential-Based and Google Login:** Allows users to login using their credentials or their Google account.
- **JWT Authentication:** Secures the application's communication with the server using JSON Web Tokens.
- **Cookies-Based Frontend Authentication:** Enables seamless and secure authentication on the frontend.
- **API-Based Profile Updates:** Allows users to update their profile information through API calls.

## Getting Started

### Prerequisites

- Node.js installed on your machine
- WordPress installation with the [JWT Authentication for WP-API](https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/) plugin activated
- Add the secret key in wp-config.php file
```php
// Define JWT secret key (use the same JWT_SECRET as in .env.local)
define('JWT_AUTH_SECRET_KEY', 'your-jwt-secret');
define('JWT_AUTH_CORS_ENABLE', true);
```

### Setting up Google OAuth

1. Go to the [Google Developers Console](https://console.developers.google.com/).
2. Create a new project for that project.
3. In the Credentials section, create a new OAuth 2.0 client ID.
4. Add `http://localhost:3000` as an authorized redirect URI for your client ID.

### Installation

1. Clone the repository: `git clone https://github.com/your-username/nextjs-wp-jwt-auth.git`
2. Install dependencies: `npm install`
3. Create a `.env.local` file in the root directory and add the following: (use the same JWT_SECRET as defined in wp-config.php)

   ```plaintext
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
   NEXT_PUBLIC_WP_REST_API_URL=http://your-wordpress-site/wp-json
   NEXT_PUBLIC_JWT_SECRET=your-jwt-secret
   ```

4. Configure WordPress themes functions.php with the following code:

```php
// Make Admin notice if JWT Authentication for WP-API plugin is not installed
add_action('admin_notices', 'plugin_missing_error_notice');
function plugin_missing_error_notice() {
	if (!class_exists('Tmeister\Firebase\JWT\JWT')): ?>
        <div class="error">
            <p>JWT Authentication requires the <strong>JWT Authentication for WP-API</strong> plugin activated to handle JWT-based authentication. You can install it from the <a href="https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/">WordPress plugin directory</a></p>
        </div>
    <?php
	endif;
}

// register custom REST API route for Google JWT auth
add_action('rest_api_init', function () {
    register_rest_route('google-jwt-auth/v1', '/token', array(
        'methods' => 'POST, GET',
        'callback' => 'handle_google_jwt_auth',
        'permission_callback' => '__return_true',
    ));
});

// Handle Google JWT auth
function handle_google_jwt_auth(WP_REST_Request $request) {
    $google_token = $request->get_param('google_token');

	// Check if JWT Authentication for WP-API plugin is installed
	if (!class_exists('Tmeister\Firebase\JWT\JWT')) {
		return new WP_Error('jwt_auth_plugin_missing', __('JWT Authentication for WP-API plugin is not installed'), ['status' => 500]);
	}

    // Validate Google token
	$response = wp_remote_get("https://www.googleapis.com/oauth2/v1/userinfo?access_token={$google_token}");
    if (is_wp_error($response)) {
        return new WP_Error('token_verification_failed', __('Token verification failed'), ['status' => 401]);
    }

	$user_data = json_decode(wp_remote_retrieve_body($response), true);
	if (isset($user_data['error'])) {
        return new WP_Error('token_verification_failed', __('Token verification failed'), ['status' => 401]);
    }

	if (!isset($user_data['email'])) {
        return new WP_Error('token_verification_failed', __('Invalid response from google API'), ['status' => 401]);
    }

	// Extract user info from the response
	$email = $user_data['email'];
	$first_name = isset($user_data['given_name']) ? $user_data['given_name'] : '';
	$last_name = isset($user_data['family_name']) ? $user_data['family_name'] : '';
	$display_name = isset($user_data['name']) ? $user_data['name'] : '';

	// Check if the user already exists
	$user = get_user_by('email', $email);
	if (!$user) {
		// Create a new user if not exists
		$user_id = wp_create_user($email, wp_generate_password(), $email);
		wp_update_user([
			'ID' => $user_id,
			'first_name' => $first_name,
			'last_name' => $last_name,
			'display_name' => $display_name,
		]);
		$user = get_user_by('id', $user_id);
	}

    // Generate JWT token and pass the data as response
	$data = [
		'token'             => generate_jwt($user),
		'user_email'        => $user->user_email,
		'user_nicename'     => $user->user_nicename,
		'user_display_name' => $user->display_name,
	];

	return new WP_REST_Response(
		apply_filters( 'jwt_auth_token_before_dispatch', $data, $user ),
		200
	);
}

// Generate JWT
function generate_jwt($user) {
	$issuedAt = time();
	$notBefore = apply_filters( 'jwt_auth_not_before', $issuedAt, $issuedAt );
	$expire = apply_filters( 'jwt_auth_expire', $issuedAt + ( DAY_IN_SECONDS * 7 ), $issuedAt );
	$token = [
		'iss'  => get_bloginfo( 'url' ),
		'iat'  => $issuedAt,
		'nbf'  => $notBefore,
		'exp'  => $expire,
		'data' => [
			'user' => [
				'id' => $user->ID,
			],
		],
	];

	$secret_key = defined( 'JWT_AUTH_SECRET_KEY' ) ? JWT_AUTH_SECRET_KEY : false;
	$jwt = "";

	// Use Firebase JWT library if available
	if (class_exists('Tmeister\Firebase\JWT\JWT')) {
		$jwt = Tmeister\Firebase\JWT\JWT::encode(
			apply_filters('jwt_auth_token_before_sign', $token, $user),
			$secret_key,
			apply_filters('jwt_auth_algorithm', 'HS256')
		);
	}

    return $jwt;
}

// Add custom fields to REST API response
add_action('rest_api_init', function() {
    register_rest_field('user', 'meta', [
        'get_callback' => function($user) {
			$user_info = get_userdata($user['id']);
            return [
                'first_name' => $user_info->first_name,
                'last_name' => $user_info->last_name,
				'nickname' => $user_info->nickname,
            ];
        },
        'update_callback' => null,
        'schema' => null,
    ]);
});


// Add CORS headers to the REST API responses
add_action('init', 'add_cors_headers');
function add_cors_headers() {
    // Allow request from NextJs app
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        $allowed_origins = ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost', 'https://localhost'];
        
        if (in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
            header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        }
    }

    header('Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Authorization, Content-Type');

    // Handle preflight requests
    if ('OPTIONS' == $_SERVER['REQUEST_METHOD']) {
        status_header(200);
        exit();
    }
}
```

### Running the Application

- Development: `npm run dev`
- Production: `npm run build` followed by `npm start`

## Usage

- Access the application at `http://localhost:3000`
- Register or login with your WordPress credentials or Google account
- Update your profile information through the API

## Screenshots

### Login Page
![Login Page](/screenshot1.png)

### Profile Page
![Profile Update Page](/screenshot2.png)

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Feel free to customize this README to fit your project's specific details and requirements.