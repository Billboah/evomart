# EvoMart - From Startup to Scale

EvoMart is the Phase 1 implementation of a deliberate AWS commerce platform evolution. The goal is to validate the market with a near-zero cost MVP before introducing any backend, database, or authentication.

## Project Story

A startup wants to launch an e-commerce platform but is cautious about cost. Instead of over-engineering from day one, they build only what is needed, when it is needed. Every architectural upgrade is triggered by real growth, real data, and real business decisions.

This repository represents EvoMart at **Phase 1 - The Near-Zero Cost MVP**.

## Application Features

EvoMart is a general products e-commerce platform built with Next.js and TypeScript, including:

- Product listing page (homepage)
- Product details page
- Cart page
- Saved products page
- Orders page
- Admin page (add, display, remove products)

## Phase 1 Architecture

Phase 1 is intentionally simple and cost-efficient:

- The application is exported as a fully static Next.js site
- Hosted on **S3 static website hosting**
- Distributed globally through **CloudFront**
- No backend service, no database, and no authentication
- Cart, saved products, and orders are managed in **browser local storage**
- Product detail pages are pre-rendered as static HTML at build time

This architecture minimizes cost and complexity while enabling fast global delivery for early user validation.

## CI/CD Pipeline

The repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml`.

Phase 1 CI/CD flow:

- checkout source code
- install dependencies
- build the static Next.js site
- configure AWS credentials with OIDC and a short-lived assumed role
- sync the generated build output to an S3 bucket
- invalidate the CloudFront cache

## Repo Structure

- `app/` — main Next.js application
  - `components/` — reusable UI components
  - `context/` — React state providers
  - `lib/` — helper utilities and loaders
  - `pages/` — application routes and rendered pages
  - `styles/` — global and Tailwind CSS
  - `util/` — commerce-specific utility helpers
- `.github/workflows/deploy.yml` — GitHub Actions deployment pipeline
- `documentation/phase1.md` — Phase 1 architecture and implementation notes

## Why This Approach?

EvoMart Phase 1 is designed to stay lean:

- Cost Optimization: deploy only what is required to validate the product
- Speed: launch quickly with static hosting and simple architecture
- Reliability: use AWS-managed S3 and CloudFront for resilient delivery
- Security: avoid secrets in CI/CD by using OIDC role assumption

## Next Steps

This project is phase one. As EvoMart grows, future documentation will describe later phases such as serverless backend, EC2 scaling, and microservices.
