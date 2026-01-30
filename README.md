# xarch

CLI tool to search your X (Twitter) likes archive.

## Installation

```bash
git clone https://github.com/realwaynesun/xarch.git
cd xarch
npm install
npm run build
npm link
```

## Prerequisites

1. Request your X archive: Settings → Your Account → Download an archive
2. Extract the archive to `~/Downloads/`

The tool looks for `~/Downloads/twitter-*/data/like.js`

## Usage

```bash
xarch <keywords>       # Search likes containing all keywords
xarch --count          # Show total number of likes
xarch --help           # Show help
```

## Examples

```bash
xarch claude code      # Find likes mentioning "claude" AND "code"
xarch polymarket       # Find likes about polymarket
xarch 技术              # Works with Chinese/Japanese/Korean
```

## Output

```
Found 3 likes for: "claude code"

[1] Introducing CallMe, a minimal plugin that lets Claude Code call you...
    → https://x.com/i/status/2009035664860565525

[2] 回不去了，AI对生产力的极大释放...
    → https://x.com/i/status/2009153013357961572
```

## License

MIT
