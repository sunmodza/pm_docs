# PM IoT Documentation

Documentation website for Project Management IoT System, built with [Docusaurus](https://docusaurus.io/).

## 🚀 Deployment

This documentation is automatically deployed to **GitHub Pages** using GitHub Actions.

### Setup Instructions

1. **Update Configuration**
   
   Edit `docusaurus.config.js` and replace:
   ```javascript
   url: 'https://your-username.github.io',
   organizationName: 'your-username',
   ```
   
   Replace `your-username` with your actual GitHub username.

2. **Enable GitHub Pages**
   
   - Go to your repository on GitHub
   - Navigate to **Settings → Pages**
   - Under **Source**, select **GitHub Actions**

3. **Push to Main Branch**
   
   ```bash
   git add .
   git commit -m "Setup GitHub Pages deployment"
   git push origin main
   ```

4. **Access Your Site**
   
   Your documentation will be available at:
   ```
   https://your-username.github.io/pm/
   ```

## 📝 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run start

# Build for production
npm run build

# Serve production build locally
npm run serve
```

## 📁 Project Structure

```
docs/
├── docs/                    # Documentation content
│   ├── api/                # API reference
│   ├── architecture/       # Architecture documentation
│   ├── backend/            # Backend docs
│   ├── deployment/         # Deployment guides
│   ├── development/        # Development guides
│   ├── features/           # Feature docs
│   ├── frontend/           # Frontend docs
│   ├── getting-started/    # Getting started guides
│   └── mqtt/               # MQTT protocol docs
├── src/                    # React components & pages
├── static/                 # Static assets
├── docusaurus.config.js    # Docusaurus configuration
└── sidebars.js             # Sidebar navigation
```

## 🔗 Important URLs

After deployment:
- **Production**: `https://your-username.github.io/pm/`
- **Repository**: `https://github.com/your-username/pm`

## 🛠️ Troubleshooting

### Build fails on GitHub Actions

1. Check that all dependencies are in `package.json`
2. Ensure no broken links in documentation
3. Check Actions logs for detailed error messages

### Site shows 404

1. Verify GitHub Pages is enabled in repository settings
2. Check that `baseUrl` in config matches your repository name
3. Ensure deployment completed successfully in Actions tab

### Images not loading

Make sure images are in `static/img/` folder and referenced with `/img/` path.

## 📚 Documentation Structure

| Section | Description |
|---------|-------------|
| Getting Started | Installation and setup guides |
| Architecture | System architecture and data flows |
| Frontend | Flutter app documentation |
| Backend | Go backend documentation |
| API Reference | REST API documentation |
| MQTT Protocol | MQTT communication protocol |
| Deployment | Docker and deployment guides |
| Development | Testing and development guides |

## 🤝 Contributing

1. Create a new branch for your changes
2. Make edits to documentation files in `/docs`
3. Test locally with `npm run start`
4. Submit a pull request

Your changes will be automatically deployed after merge to main branch.
