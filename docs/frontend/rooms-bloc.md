# Rooms BLoC

Room management BLoC implementation.

## State

```dart
class RoomsState extends Equatable {
  final RoomsStatus status;
  final List<Room> rooms;
  final Room? selectedRoom;

  const RoomsState({
    this.status = RoomsStatus.initial,
    this.rooms = const [],
    this.selectedRoom,
});
```

## Events

```dart
class RoomsStarted extends RoomsEvent
class RoomSelected extends RoomsEvent {
  final int roomId;
  const RoomSelected(this.roomId);
}
class CreateRoom extends RoomsEvent {
  final String name;
  const CreateRoom(this.name);
}
```

---

**Previous**: [Devices BLoC](./devices-bloc) | **[Complete Frontend Docs](../intro)**
