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
    "Ensure access to skilled workforce",
    "Workforce partnership plan",
    "TCO and onshoring analysis",
    "Implementation priorities",
    "How to verify",
    "Test infrastructure",
  ];

  for (const section of requiredSections) {
    assert.match(readme, new RegExp(`## ${section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
  }
});

test("README partnership section covers the required workforce partners", () => {
  const partnershipSection = getSectionContent("Workforce partnership plan");

  assert.ok(partnershipSection, "Expected a workforce partnership plan section");
  assert.match(partnershipSection, /workforce development boards?/i);
  assert.match(partnershipSection, /local agencies/i);
  assert.match(partnershipSection, /community colleges/i);
  assert.ok(
    getBulletCount(partnershipSection) >= 4,
    "Expected at least four concrete workforce partnership bullet points",
  );
});

test("README explains recruiting and training for domestic operations", () => {
  const overviewSection = getSectionContent("Ensure access to skilled workforce");

  assert.ok(overviewSection, "Expected a skilled workforce overview section");
  assert.match(overviewSection, /domestic operations/i);
  assert.match(overviewSection, /recruit/i);
  assert.match(overviewSection, /train/i);
});

test("README includes TCO analysis for long-term onshoring decisions", () => {
  const tcoSection = getSectionContent("TCO and onshoring analysis");

  assert.ok(tcoSection, "Expected a TCO and onshoring analysis section");
  assert.match(tcoSection, /total cost of ownership/i);
  assert.match(tcoSection, /onshor/i);
  assert.match(tcoSection, /long-term benefits?/i);
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
