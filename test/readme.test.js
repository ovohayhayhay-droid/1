const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const readmePath = path.join(__dirname, "..", "README.md");
const readme = fs.readFileSync(readmePath, "utf8");

function getSectionContent(title) {
  const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`## ${escapedTitle}\\n\\n([\\s\\S]*?)(?=\\n## |$)`);
  const match = readme.match(pattern);

  return match ? match[1].trim() : "";
}

function getBulletCount(sectionContent) {
  return sectionContent
    .split("\n")
    .filter((line) => line.trim().startsWith("- ")).length;
}

test("README includes the expected issue-specific sections", () => {
  const requiredSections = [
    "Assess business costs",
    "Cost assessment priorities",
    "Supply chain plan",
    "Implementation priorities",
    "How to verify",
    "Test infrastructure",
  ];

  for (const section of requiredSections) {
    assert.match(readme, new RegExp(`## ${section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
  }
});

test("README cost assessment section covers multiple concrete cost categories", () => {
  const costSection = getSectionContent("Cost assessment priorities");

  assert.ok(costSection, "Expected a cost assessment priorities section");
  assert.ok(
    getBulletCount(costSection) >= 5,
    "Expected at least five concrete cost assessment bullet points",
  );
});

test("README supply chain section covers sourcing and inventory planning", () => {
  const supplyChainSection = getSectionContent("Supply chain plan");

  assert.ok(supplyChainSection, "Expected a supply chain plan section");
  assert.match(supplyChainSection, /supplier/i);
  assert.match(supplyChainSection, /inventory/i);
  assert.ok(
    getBulletCount(supplyChainSection) >= 5,
    "Expected at least five supply chain planning bullet points",
  );
});

test("README verification section provides a checklist of follow-up checks", () => {
  const verificationSection = getSectionContent("How to verify");

  assert.ok(verificationSection, "Expected a How to verify section");
  assert.ok(
    getBulletCount(verificationSection) >= 3,
    "Expected at least three verification checklist items",
  );
});

test("README documents how to run the automated tests", () => {
  const testSection = getSectionContent("Test infrastructure");

  assert.ok(testSection, "Expected a Test infrastructure section");
  assert.match(testSection, /npm test/);
});
