# Home Screen

Main home screen documentation.

## Components

- **Room Selector**: Switch between rooms
- **Widget Grid**: Display widgets
- **FAB**: Add devices/rooms
- **Bottom Sheets**: Quick actions

## Widget Grid

```dart
GridView.builder(
  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
    crossAxisCount: 2,
    childAspectRatio: 1.5,
  ),
  itemBuilder: (context, index) {
    return WidgetCard(widget: widgets[index]);
  },
)
```

---

**Previous**: [Authentication](./authentication) | **Next**: [Device Management](./device-management) →
