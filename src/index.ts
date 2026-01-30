#!/usr/bin/env node

import { readFileSync, existsSync, readdirSync } from "fs";
import { join } from "path";
import { homedir } from "os";

interface Like {
  tweetId: string;
  fullText: string;
  expandedUrl: string;
}

interface LikeEntry {
  like: Like;
}

function findArchivePath(): string | null {
  const downloadsDir = join(homedir(), "Downloads");
  const entries = readdirSync(downloadsDir);

  for (const entry of entries) {
    if (entry.startsWith("twitter-") && !entry.endsWith(".zip")) {
      const likePath = join(downloadsDir, entry, "data", "like.js");
      if (existsSync(likePath)) {
        return likePath;
      }
    }
  }
  return null;
}

function parseLikesFile(filePath: string): Like[] {
  const content = readFileSync(filePath, "utf-8");
  const jsonStart = content.indexOf("[");
  const jsonContent = content.slice(jsonStart);
  const entries: LikeEntry[] = JSON.parse(jsonContent);
  return entries.map((e) => e.like);
}

function searchLikes(likes: Like[], query: string): Like[] {
  const terms = query.toLowerCase().split(/\s+/);
  return likes.filter((like) => {
    const text = (like.fullText || "").toLowerCase();
    return terms.every((term) => text.includes(term));
  });
}

function formatResult(like: Like, index: number): string {
  const fullText = like.fullText || "[No text available]";
  const text = fullText.length > 200 ? fullText.slice(0, 200) + "..." : fullText;
  const url = `https://x.com/i/status/${like.tweetId}`;
  return `\n[${index + 1}] ${text}\n    → ${url}\n`;
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
    console.log(`
xarch - Search your X likes archive

Usage:
  xarch <keywords>       Search likes containing all keywords
  xarch --count          Show total number of likes
  xarch --help           Show this help

Examples:
  xarch claude code      Find likes mentioning "claude" AND "code"
  xarch polymarket       Find likes about polymarket
  xarch 技术              Find likes with Chinese keyword
`);
    return;
  }

  const archivePath = findArchivePath();
  if (!archivePath) {
    console.error(
      "Error: X archive not found in ~/Downloads/\nLooking for: twitter-*/data/like.js"
    );
    process.exit(1);
  }

  const likes = parseLikesFile(archivePath as string);

  if (args[0] === "--count") {
    console.log(`Total likes: ${likes.length}`);
    return;
  }

  const query = args.join(" ");
  const results = searchLikes(likes, query);

  if (results.length === 0) {
    console.log(`No likes found for: "${query}"`);
    return;
  }

  console.log(`Found ${results.length} likes for: "${query}"\n`);
  results.forEach((like, i) => console.log(formatResult(like, i)));
}

main();
