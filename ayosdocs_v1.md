# AyosDocs v1.0 — Finalized Features & Future Roadmap

> Internal product and development notes for AyosDocs
> Intended for maintainers, contributors, and future planning.

---

# Vision

AyosDocs is not just a collection of government guides.

The long-term direction is to become:

> A workflow platform that helps Filipinos successfully accomplish government processes and life-event requirements.

The platform should reduce confusion, simplify bureaucracy, and provide actionable guidance with real community insights.

---

# Core Product Direction

AyosDocs evolves in layers:

## Layer 1 — Government Guide Platform

* Step-by-step guides
* Requirements
* Fees
* Office information
* Processing tips

## Layer 2 — Personal Progress Tracker

* Checklist system
* Guide tracking
* Saved/favorite guides
* Completion history

## Layer 3 — Life Event Workflow System

* Bundled requirements
* Multi-step processes
* Progress across related documents

## Layer 4 — Community Intelligence Platform

* Office ratings
* Processing experiences
* Crowdsourced wait times
* Government office insights

---

# v1.0 Core Features

---

# 1. My Progress Page

## Goal

Transform the current "tracked guides list" into a personal government process dashboard.

The page should feel like:

> “My place for tracking important government tasks and life requirements.”

---

## Recommended Structure

### Dashboard Summary Cards

Top-level quick stats:

* Active Guides
* Completed Guides
* Favorites
* Upcoming Renewals (future-ready)

Example:

* 6 Active
* 12 Completed
* 8 Favorites

---

## Tabs / Filtering

### Required Tabs

* All
* In Progress
* Completed
* Favorites

---

## Logic Definitions

### In Progress

Guide is:

* partially completed
* OR checklist started but unfinished

### Completed

Guide is:

* fully checked
* OR manually marked completed

### Favorites

Guide is:

* bookmarked/saved
* not necessarily started

---

## Recently Updated Guides

Optional but highly recommended.

Purpose:

* Build trust
* Inform users about requirement changes

Example:

* “Passport Renewal updated 2 days ago”
* “LTO requirements changed”

---

# 2. Requirement Bundles / Life Event Bundles

## Goal

Shift the product from:

> “Find a document guide”

into:

> “Help me accomplish a real-life goal.”

---

## Naming Recommendation

Avoid generic terms like:

* Groups
* Collections

Recommended names:

* Requirement Bundles
* Life Event Bundles
* Goal Packs
* Process Bundles

---

## Example Bundles

### Wedding Requirements

* PSA Birth Certificate
* CENOMAR
* Marriage License
* Barangay Clearance
* Valid IDs

### First Job Bundle

* NBI Clearance
* TIN Registration
* SSS
* PhilHealth
* Pag-IBIG

### Other Potential Bundles

* Starting a Business
* Newborn Registration
* Driver Starter Pack
* Studying Abroad
* Passport + Visa Preparation

---

## Bundle Structure

Each bundle should contain:

### Required Guides

Core requirements needed to finish the process.

### Optional Guides

Helpful but non-essential related processes.

Example:

* Passport Update after Marriage
* SSS Record Update

---

## Bundle Progress Tracking

Example:

> Wedding Bundle Progress: 3/8 completed

Inside the bundle:

* PSA ✓
* CENOMAR ✓
* Marriage License ⏳
* Barangay Clearance ⏳

This creates:

* motivation
* engagement
* clearer workflow visibility

---

## Initial Execution Strategy

### v1.0 Recommendation

Provide:

* predefined official bundles only

Avoid:

* user-created bundles initially

Reason:
Most users do not know how to organize government requirements properly.

Custom bundles can be added later.

---

## Future Possibility — Timeline Workflows

Some processes have dependencies.

Example:

1. Get PSA Birth Certificate
2. Apply Marriage License
3. Schedule Ceremony

AyosDocs can eventually guide users across sequential processes.

This is a major long-term differentiator.

---

# 3. All Guides Page

## Goal

Turn the page into a searchable government knowledge base instead of a static guide list.

---

## Required Features

### Search Functionality

Search should support:

* guide names
* aliases
* abbreviations
* common misspellings

Examples:

* “cedula” → Community Tax Certificate
* “police clearance” → related NBI/Police guides

---

## Filtering System

### Categories

Examples:

* IDs
* Employment
* Travel
* Healthcare
* Business
* Education
* Civil Documents

---

### Government Agency

Examples:

* DFA
* PSA
* NBI
* LTO
* SSS
* PhilHealth
* Pag-IBIG

---

### Difficulty Level

Useful for user expectations.

Examples:

* Easy
* Moderate
* Complex

---

### Estimated Processing Time

Examples:

* Same Day
* 1–3 Days
* 1 Week+

---

### Cost Range

Very important for users.

Examples:

* Free
* Under ₱500
* ₱500–₱2000

---

## Recommended Sections

### Trending Guides

Most viewed recently.

### Frequently Needed Together

Encourage guide discovery.

### Beginner Essentials

Useful for first-time users.

### Recently Updated

Highlights updated requirements/processes.

---

# 4. Government Office Ratings & Experience Reports

## Goal

Provide real community insights about actual government office experiences.

Potential long-term positioning:

> “Community-powered intelligence for Philippine government services.”

---

# Important Product Direction

Avoid open freeform review systems initially.

Unstructured reviews lead to:

* spam
* trolling
* political arguments
* misinformation
* moderation problems

---

# Recommended Approach — Structured Experience Reports

Instead of:

> “Write anything you want.”

Use guided structured inputs.

---

## Example Rating Categories

For a DFA office:

### Ratings

* Processing Speed ★
* Staff Friendliness ★
* Queue Management ★
* Facility Cleanliness ★

---

## Structured Questions

### Appointment Availability

* Easy
* Moderate
* Difficult

### Actual Waiting Time

* Less than 1 hour
* 1–3 hours
* Whole day

### Were extra requirements requested?

* Yes
* No

### Was fixer/scalper activity noticeable?

* Yes
* No

---

## Optional Text Feedback

Recommended limit:

* 300–500 characters

Purpose:

* concise reports
* easier moderation
* higher quality submissions

---

# Office-Level Reviews

Reviews must be tied to specific branches.

Because:

* DFA Manila ≠ DFA provincial office
* PSA Quezon City ≠ PSA province branch

---

## Suggested Structure

* Agency
* Region
* Province
* Municipality/City
* Specific Branch

---

# Recommended Display Strategy

Instead of prioritizing raw comments:
focus on aggregate insights.

Examples:

* Average processing speed
* Average waiting time
* Most reported issues
* Queue trends
* Common complaints

This feels:

* safer
* more professional
* more actionable

---

# Access Control

## Recommendation

Experience reports should:

* require login to submit
* remain anonymous publicly

This helps reduce spam and abuse.

---

# Moderation Requirements

Essential systems:

* profanity filtering
* report button
* admin moderation queue
* auto-hide low-quality submissions

Without moderation:
platform quality degrades quickly.

---

# Potential Future Feature — Crowd Insights

Examples:

> “Most users report shorter lines on Tuesdays.”

> “Peak hours are usually 10AM–1PM.”

These insights can become extremely valuable.

---

# Suggested Database Structure

## GovernmentOffice

```txt
id
agency_id
region
province
city
office_name
```

## OfficeReview

```txt
id
user_id
office_id
ratings
waiting_time
comment
moderation_status
created_at
```

---

# Future Features Roadmap

---

# High Priority (Post-v1.0)

## UX & Discovery

* Better search relevance
* Advanced filtering
* Recently updated guides
* Related guides suggestions

---

## Progress System

* Bundle progress tracking
* Completion analytics
* Guide history

---

## Community Features

* Structured office reviews
* Anonymous experience reports
* Office rating summaries

---

# Medium Priority

## Smart Recommendations

Examples:

* Completed Passport → Suggest Apostille
* Completed First Job Bundle → Suggest TIN/SSS updates

---

## Personalized Dashboard

* Suggested next steps
* Recently viewed guides
* Frequently needed services

---

## Guide Relationships

Example:

* “Users applying for Passport also commonly need PSA Birth Certificate.”

---

# Long-Term Vision Features

## Renewal Reminders

Examples:

* Passport expiration
* Driver’s license renewal

---

## Timeline-Based Workflows

Step-by-step process ordering across multiple agencies.

---

## Community Analytics

Examples:

* best office branches
* shortest queues
* processing trends

---

## AI Assistance

Potential future features:

* requirement clarification
* eligibility checking
* personalized process recommendations

---

# Important Product Philosophy

Avoid becoming:

> “A static Wikipedia for government requirements.”

That is easy to replicate.

Instead, build:

> “An operating system for completing Philippine government processes.”

That direction creates:

* higher retention
* stronger differentiation
* long-term product defensibility

---

# General Development Notes

## Prioritize Features That:

* reduce confusion
* save time
* increase completion rates
* encourage repeat visits

---

## Avoid Overengineering Early

Focus first on:

* excellent guide quality
* clear workflows
* reliable tracking
* intuitive UX

Advanced AI/community systems can come later.

---

# Recommended Immediate Priorities

## Must Finish Before Public Scaling

1. Improved All Guides search/filtering
2. Progress page tabs
3. Official requirement bundles
4. Bundle progress tracking

---

## Next Major Milestone

5. Structured office ratings
6. Experience reports
7. Community insights system

---

# Final Product Goal

AyosDocs should eventually answer:

> “What government requirements do I need?”

AND

> “What is the best way to successfully finish them?”
