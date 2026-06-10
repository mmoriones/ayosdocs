# AyosDocs Guide Authoring Standards

This document outlines the standard for creating and maintaining government guides on AyosDocs. We have transitioned from Markdown (`.md`) to a **Block-Based JSON** structure to support high-fidelity mobile styling, automated SEO, and future CMS integration.

---

## 1. File Location & Naming
- **Path:** `app/src/data/guides/[slug].json`
- **Filename:** Must be kebab-case (e.g., `nbi-clearance.json`).
- **Slug:** Must match the filename.

---

## 2. JSON Structure Overview

A guide is divided into four main areas:
1. **Metadata:** Core info (Title, Agency, Category).
2. **Requirements:** Structured list of what the user needs.
3. **Checklist:** The step-by-step progress tracker.
4. **Content Blocks:** The "About" section broken into semantic UI blocks.

---

## 3. Detailed Schema Guide

### Metadata
| Field | Type | Description |
|---|---|---|
| `id` | String | Unique identifier (matches slug). |
| `title` | String | Full SEO-friendly title. |
| `shortTitle` | String | Short name for UI cards and navigation. |
| `description` | String | 1-2 sentence meta description. |
| `agency` | String | The acronym of the government agency (e.g., "DFA"). |
| `category` | String | Grouping (e.g., "Government ID", "Civil Registry"). |
| `estimatedTime`| String | Human-readable duration (e.g., "1-3D", "1 Week"). |
| `costRange` | String | Price summary (e.g., "₱155 - ₱365"). |
| `relatedGuideSlugs` | Array | Slugs of related guides for intelligent cross-linking. |

### Requirements (`requirements`)
A list of objects displayed in the "What you need" section.
- `title`: Short name (e.g., "Valid ID").
- `description`: One-sentence detail.
- `icon`: Lucide icon name (`IdCard`, `Passport`, `FileText`, `MapPin`, etc.).

### Checklist (`checklist`)
A list of objects for the interactive "Tracker" tab.
- `title`: The action command (e.g., "Register Account").
- `description`: Briefly explain how to do this step.

---

## 4. Content Blocks (`content`)

The "About" section is an array of **Sections**, each containing **Blocks**. This is the key to our high-fidelity layout.

### Section Object
- `id`: Kebab-case version of the title.
- `title`: The section heading (Automatic numbering is handled by the UI).
- `blocks`: Array of content items.

### Available Block Types

#### 1. Paragraph
Standard text. Use for general descriptions. Supports mini-markdown (Bold, Links).
```json
{ "type": "paragraph", "content": "An **NBI Clearance** is an official document..." }
```

#### 2. Subheading
Use for Level 3 headings (H3) within a section.
```json
{ 
 "type": "subheading", 
 "title": "Online Appointment", 
 "content": "Description text for this sub-section." 
}
```

#### 3. List
Bulleted items. Optimized for mobile line-height.
```json
{ 
 "type": "list", 
 "items": ["Item 1", "Item 2 with [link](https://...)"] 
}
```

#### 4. Banner (The "Expert" Block)
Used for Pro-Tips, Notes, and Warnings.
- `variant`: `"info"` (blue/Pro-Tip), `"note"` (gray/Note badge), `"warning"` (amber/Important).
```json
{ 
 "type": "banner", 
 "variant": "info", 
 "content": "**Pro Tip:** DFA slots refresh at 12:00 PM." 
}
```

#### 5. Table
Use for fees or restriction codes. Structured as headers and rows for easy maintenance.
```json
{ 
 "type": "table", 
 "headers": ["Restriction", "Vehicle Type"],
 "rows": [
 ["Motorcycle", "Motorcycles and scooters"],
 ["Light Vehicles", "Cars and SUVs"]
 ]
}
```

---

## 5. Content Strategy (The "Expert" Standard)

To maintain our authority status, every guide MUST include:

1. **"The Secret Sauce"**: At least one `info` banner with a "Pro-Tip" that isn't on the official government site (e.g., best time to visit, free options for students).
2. **Troubleshooting**: A `warning` banner in the FAQ or Process section for common points of failure (e.g., "What if I get a HIT?").
3. **Smart Inter-linking**: Fill the `relatedGuideSlugs` with the next logical documents the user will need (e.g., a Birth Certificate guide should point to Passport and National ID).

---

## 6. Technical SEO Note
The system automatically parses your `checklist` and `content` to generate:
- **HowTo Schema**: Injected into the head for Google Search results.
- **FAQ Schema**: Automatically generated from sections with "FAQ" in the title.
- **Breadcrumbs**: Built from the `category` and `title`.

**No manual SEO work is required if the JSON structure is valid.**
