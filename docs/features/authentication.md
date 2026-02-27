# Authentication Feature

Authentication feature documentation.

## Username/Password Login Flow

1. User enters username and password
2. Send credentials to backend
3. Receive JWT token
4. Store securely
5. Navigate to home screen

## Files

- `lib/features/auth/bloc/auth_bloc.dart` - State management
- `lib/features/auth/bloc/sign_in_bloc.dart` - Sign-in form handling
- `lib/features/auth/ui/pages/sign_in_page.dart` - Sign-in UI
- `lib/features/auth/data/auth_repository.dart` - Data access
- `lib/features/auth/data/token_storage.dart` - Secure token storage

## Auth Repository

```dart
// lib/features/auth/data/auth_repository.dart
class AuthRepository {
  final String baseUrl;
  final http.Client httpClient;

  Future<String> login(String username, String password) async {
    final response = await httpClient.post(
      Uri.parse('$baseUrl/api/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'username': username,
        'password': password,
      }),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final token = data['token'];
      await saveToken(token);
      return token;
    }
    throw Exception('Login failed');
  }

  Future<void> register(String username, String password) async {
    final response = await httpClient.post(
      Uri.parse('$baseUrl/api/auth/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'username': username,
        'password': password,
      }),
    );

    if (response.statusCode != 201) {
      throw Exception('Registration failed');
    }
  }
}
```

## Sign In Page

```dart
// lib/features/auth/ui/pages/sign_in_page.dart
class SignInPage extends StatelessWidget {
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextField(
              controller: _usernameController,
              decoration: InputDecoration(labelText: 'Username'),
            ),
            TextField(
              controller: _passwordController,
              decoration: InputDecoration(labelText: 'Password'),
              obscureText: true,
            ),
            ElevatedButton(
              onPressed: () {
                context.read<SignInBloc>().add(
                  SignInSubmitted(
                    username: _usernameController.text,
                    password: _passwordController.text,
                  ),
                );
              },
              child: Text('Login'),
            ),
          ],
        ),
      ),
    );
  }
}
```

---

**Previous**: [Frontend Docs](../intro) | **Next**: [Home Screen](./home-screen) →
