# Sensor Visualization

Sensor data visualization and charts.

## Sensor Detail Page

- Real-time sensor values
- Historical data chart
- Min/Max/Average statistics

## Charts

```dart
LineChart(
  ChartData(
    data: sensorHistory.map((e) => FlSpot(e.timestamp, e.value)).toList(),
  ),
)
```

---

**Previous**: [Room Management](./room-management) | **[Complete Feature Docs](../intro)**
