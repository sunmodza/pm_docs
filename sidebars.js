// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // Getting Started Sidebar
  gettingStartedSidebar: [
    'getting-started/introduction',
    'getting-started/installation',
    'getting-started/configuration',
  ],

  // Architecture Sidebar
  architectureSidebar: [
    'architecture/overview',
    'architecture/data-flows',
    {
      type: 'category',
      label: 'Data Flows',
      items: [
        'architecture/auth-flow',
        'architecture/device-registration-flow',
        'architecture/sensor-data-flow',
        'architecture/command-flow',
        'architecture/widget-management-flow',
        'architecture/state-management',
      ],
    },
    {
      type: 'category',
      label: 'Architecture Patterns',
      items: [
        'architecture/clean-architecture',
        'architecture/repository-pattern',
        'architecture/dependency-injection',
      ],
    },
  ],

  // Frontend Sidebar
  frontendSidebar: [
    'frontend/intro',
    'frontend/project-structure',
    'frontend/bloc-pattern',
    {
      type: 'category',
      label: 'BLoC Implementation',
      items: [
        'frontend/auth-bloc',
        'frontend/devices-bloc',
        'frontend/rooms-bloc',
      ],
    },
    {
      type: 'category',
      label: 'Features',
      items: [
        'features/authentication',
        'features/home-screen',
        'features/device-management',
        'features/room-management',
        'features/sensor-visualization',
      ],
    },
  ],

  // Backend Sidebar
  backendSidebar: [
    'backend/intro',
    'backend/project-structure',
    {
      type: 'category',
      label: 'Architecture Layers',
      items: [
        'backend/clean-architecture',
        'backend/domain-layer',
        'backend/usecase-layer',
        'backend/infrastructure-layer',
      ],
    },
    'backend/database',
    'backend/mqtt',
    'backend/jwt-authentication',
  ],

  // API Reference Sidebar
  apiSidebar: [
    'api/overview',
    'api/authentication',
    'api/devices',
    'api/rooms',
    'api/widgets',
    'api/users',
    'api/errors',
  ],

  // MQTT Protocol Sidebar
  mqttSidebar: [
    'mqtt/overview',
    'mqtt/topics',
    'mqtt/registration',
    'mqtt/sensor-data',
    'mqtt/commands',
    'mqtt/pairing',
    'mqtt/heartbeat',
  ],

  // Deployment Sidebar
  deploymentSidebar: [
    'deployment/docker',
    'deployment/docker-compose',
    'deployment/production',
    {
      type: 'category',
      label: 'Development',
      items: [
        'development/contributing',
        'development/code-style',
        'development/testing',
        'development/device-mocking-overview',
        'development/device-mocking',
        'development/troubleshooting',
      ],
    },
  ],
};

export default sidebars;
