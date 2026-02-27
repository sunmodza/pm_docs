# Auth BLoC

Authentication BLoC implementation details.

## State

```dart
abstract class AuthState extends Equatable {
  const AuthState();
}

class AuthUnknown extends AuthState {}
class AuthAuthenticated extends AuthState {
  final String token;
  const AuthAuthenticated(this.token);
}
class AuthUnauthenticated extends AuthState {}
```

## Events

```dart
abstract class AuthEvent extends Equatable {
  const AuthEvent();
}

class AuthStarted extends AuthEvent {}
class AuthLoggedIn extends AuthEvent {
  final String token;
  const AuthLoggedIn(this.token);
}
class AuthLogoutRequested extends AuthEvent {}
```

## BLoC

```dart
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final AuthRepository _repo;

  AuthBloc({required AuthRepository repo})
      : _repo = repo,
        super(const AuthUnknown()) {
    on<AuthStarted>(_onStarted);
    on<AuthLoggedIn>(_onLoggedIn);
    on<AuthLogoutRequested>(_onLogoutRequested);
}

Future<void> _onStarted(
  AuthStarted event,
  Emitter<AuthState> emit,
) async {
  final saved = await _repo.getSavedToken();
  if (saved != null) {
    emit(AuthAuthenticated(saved));
  } else {
    emit(const AuthUnauthenticated());
  }
}
```

---

**Previous**: [BLoC Pattern](../bloc-pattern) | **Next**: [Devices BLoC](./devices-bloc) →
