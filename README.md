# Claude Code Skills Marketplace

A curated marketplace of Claude Code skills and plugins to extend Claude's capabilities.

## What is This?

This is a plugin marketplace for [Claude Code](https://claude.com/claude-code), allowing you to discover and install custom skills that enhance Claude's functionality. Skills can add new commands, agents, hooks, and integrations to your Claude Code workflow.

## Installation

To add this marketplace to your Claude Code installation:

```bash
# Add the marketplace using GitHub shorthand
/plugin marketplace add just-be-dev/skills

# Or using a local path
/plugin marketplace add /path/to/skills

# Or using a full Git URL
/plugin marketplace add https://github.com/just-be-dev/skills.git
```

## Installing Plugins

Once the marketplace is added, you can install plugins:

```bash
# Install a plugin from this marketplace
/plugin install example-skill@skills

# List available plugins
/plugin marketplace list skills
```

## Available Plugins

### Example Skill
An example skill plugin to demonstrate the marketplace structure.

**Install:** `/plugin install example-skill@skills`

## Contributing

Want to add your own skill to this marketplace? Here's how:

### 1. Create Your Plugin Structure

```
plugins/
└── your-skill/
    ├── .claude-plugin/
    │   └── plugin.json
    └── commands/
        └── your-command.md
```

### 2. Define Your Plugin

Create `.claude-plugin/plugin.json`:

```json
{
  "name": "your-skill",
  "description": "Brief description of what your skill does",
  "version": "1.0.0",
  "author": {
    "name": "Justin Bennett"
  }
}
```

### 3. Create Your Command

Create a markdown file in `commands/` with instructions for Claude:

```markdown
# Your Skill Command

When this command is invoked, you should:
1. Do something useful
2. Be helpful and concise
3. Follow user preferences

Add your specific instructions here.
```

### 4. Register in Marketplace

Add your plugin to `.claude-plugin/marketplace.json`:

```json
{
  "name": "your-skill",
  "source": "./plugins/your-skill",
  "description": "Brief description"
}
```

### 5. Submit a Pull Request

Submit your plugin as a PR to this repository. Please ensure:
- Your plugin follows the structure above
- Commands are clear and well-documented
- You've tested it locally
- You've updated the Available Plugins section in this README

## Plugin Development Guide

### Commands
Commands are markdown files that provide instructions to Claude. They can:
- Define new slash commands (e.g., `/review`, `/test`)
- Include templates and examples
- Reference other files or documentation

### Agents
Specialized AI agents for specific tasks:
- Code reviewers
- Test generators
- Documentation writers
- Custom workflows

### Hooks
Execute scripts or commands at specific events:
- After tool use (Write, Edit, Bash, etc.)
- Before/after plugin installation
- Custom triggers

### Advanced Features
- **MCP Servers**: Integrate Model Context Protocol servers
- **LSP Servers**: Add language server support
- **Multiple Commands**: Bundle related commands in directories
- **External Sources**: Reference plugins from GitHub or other Git repos

## Validation

Test your marketplace locally:

```bash
# Validate the marketplace structure
/plugin validate .

# Or using the CLI
claude plugin validate .
```

## Resources

- [Claude Code Plugin Marketplaces Documentation](https://code.claude.com/docs/en/plugin-marketplaces)
- [Plugin Development Guide](https://code.claude.com/docs/en/plugins)
- [Example Plugins](./plugins/)

## License

MIT License - see [LICENSE](LICENSE) for details. Individual plugins may have their own licenses as specified in their `plugin.json` files.

## Support

For issues or questions:
1. Check the [documentation](https://code.claude.com/docs)
2. Review existing plugins for examples
3. Open an issue in this repository
