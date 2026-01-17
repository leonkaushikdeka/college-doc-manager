# Contributing to College DocManager

Thank you for your interest in contributing to College DocManager! This document provides guidelines and instructions for contributing.

## 🤝 How to Contribute

### 1. Fork the Repository

1. Go to [College DocManager on GitHub](https://github.com/your-username/college-doc-manager)
2. Click the **Fork** button (top right)
3. Clone your fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/college-doc-manager.git
   cd college-doc-manager
   ```

### 2. Set Up Development Environment

```bash
# Install dependencies
bun install

# Set up environment variables
cp .env.example .env

# Initialize database
bun run db:push

# Start development server
bun run dev
 ```

### 3. Make Your Changes

1. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/amazing-new-feature
   ```

2. Make your changes following our [Code Guidelines](#-code-guidelines)

3. Test your changes:
   ```bash
   bun run lint
   ```

### 4. Submit a Pull Request

1. Push your changes to your fork:
   ```bash
   git add .
   git commit -m "Add amazing new feature"
   git push origin feature/amazing-new-feature
   ```

2. Go to the original repository and click **New Pull Request**

3. Fill in the PR template and submit

---

## 📋 Code Guidelines

### Style & Formatting

- Use **TypeScript** for all new code
- Follow the existing code style
- Run **ESLint** before committing:
  ```bash
  bun run lint
  ```

### Component Structure

- Use **shadcn/ui** components when possible
- Keep components small and focused
- Use proper TypeScript types
- Add comments for complex logic

### Git Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance

**Examples:**
```
feat(scanner): add OCR text extraction
fix(documents): resolve upload timeout issue
docs(readme): update installation instructions
```

---

## 🐛 Reporting Bugs

When reporting bugs, please include:

1. **Clear title** describing the issue
2. **Steps to reproduce** the bug
3. **Expected behavior** vs actual behavior
4. **Screenshots** if applicable
5. **Browser/Device** information
6. **Error messages** in console

Use the [Bug Report Template](https://github.com/your-username/college-doc-manager/issues/new?template=bug_report.md)

---

## 💡 Suggesting Features

We welcome feature suggestions! When suggesting:

1. **Describe the problem** you're trying to solve
2. **Propose a solution** (even rough ideas help)
3. **Consider alternatives** you may have thought of
4. **Explain the use case** for Indian college students

Use the [Feature Request Template](https://github.com/your-username/college-doc-manager/issues/new?template=feature_request.md)

---

## 📖 Documentation

Improvements to documentation are always welcome:

- Fix typos or grammatical errors
- Add code examples
- Improve explanations
- Translate to other languages
- Add screenshots or diagrams

---

## 🧪 Testing

Help us maintain code quality by:

- Writing tests for new features
- Updating existing tests
- Reporting test failures
- Suggesting test cases

---

## 💬 Community

- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-username/college-doc-manager/discussions)
- 🐦 **Twitter**: [@CollegeDocManager](https://twitter.com/CollegeDocManager)
- 📧 **Email**: support@college-doc-manager.example.com

---

## 📜 Code of Conduct

This project follows our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

---

<div align="center">

**Thank you for contributing! 🎉**

Made with ❤️ for Indian college students

</div>
