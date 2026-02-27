# Devices BLoC

Devices and widgets BLoC implementation.

## Key Features

- Widget state management
- Pending value tracking
- Polling strategy
- Command sending

## Events

```dart
class DevicesStarted extends DevicesEvent
class WidgetToggled extends DevicesEvent
class WidgetValueChanged extends DevicesEvent
class DevicesRequested extends DevicesEvent
class WidgetsPollingStarted extends DevicesEvent
```

## Polling

```dart
Timer? _fullPollTimer;

void _onWidgetsPollingStarted(
  WidgetsPollingStarted event,
  Emitter<DevicesState> emit,
) {
  _fullPollTimer?.cancel();
  _fullPollTimer = Timer.periodic(
    const Duration(seconds: 5),
    (timer) => add(DevicesRequested(roomId: event.roomId)),
  );
}
```

---

**Previous**: [Auth BLoC](./auth-bloc) | **Next**: [Rooms BLoC](./rooms-bloc) →
