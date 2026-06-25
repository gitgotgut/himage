# SubscriptionTracker

A subscription management app to track recurring payments, billing cycles, and spending insights.

Built using the [DevTeam agent-pack](https://github.com/gitgotgut/DevTeam) for AI-assisted development with Antigravity + Claude + Pencil.

## Getting Started

```powershell
# Clone with submodules
git clone --recurse-submodules https://github.com/gitgotgut/SubscriptionTracker.git

# Or if already cloned:
git submodule update --init --recursive

# Run the agent-pack orchestrator
$env:PYTHONPATH="tools\agent-pack"; python -m agentpack run --idea "your idea"
```

## Project Structure

```
docs/PROJECT_CONTEXT.md    Project-specific context
design/                    Pencil exports and design specs
tools/agent-pack/          DevTeam agent-pack (submodule)
runs/                      Orchestrator run artifacts
```
