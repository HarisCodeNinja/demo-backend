# Making the MCP Server Generic: Limitations & Considerations

The MCP server in this repo was customized for the HRM domain after a code generator produced the broader project. Turning this module into a reusable, schema-agnostic component for other products means untangling a host of HR assumptions. This document highlights the main obstacles observed while reviewing `src/modules/mcp-server`.

## 1. Architecture Is Entangled With HR Models
- `toolExecutor.ts` imports nearly every HR Sequelize model (employees, departments, leaves, salaries, etc.) and encodes domain-specific business logic inside each handler.  
- A generic MCP layer would need a pluggable registry where host projects provide their own tool handlers instead of hard-coded imports.

## 2. Tool Catalog Is Hard-Coded
- `tools.ts` ships a static list of HR-focused tools and input schemas. Claude/Gemini are configured with these exact definitions.  
- To go generic we need metadata-driven registration (possibly via configuration or runtime discovery) and versioning so AI clients learn available tools without editing source.

## 3. Tight Coupling To Express/Auth Stack
- Controllers assume Express `Request`/`Response`, JWT middleware and project-specific role slugs. Deploying to another framework or auth system would require rewriting controllers.  
- A reusable server should abstract transport (HTTP, queue, worker) and let consumers plug in their own auth strategy.

## 4. Dynamic SQL Executor Depends On Local Conventions
- `dynamicSqlExecutor.ts` hard-codes the `public` schema, Postgres-specific queries, token-friendly formatting and blocked keyword lists tailored to HR tables.  
- Different products may use other schemas, databases, or security policies. We would need configuration for schema allow-lists, row limits, timeout, formatting adapters, and driver selection.

## 5. Error Handling & Schema Hints Are Postgres-Only
- Recent enhancements fetch column hints from `information_schema`, assume Postgres casing, and block catalog tables. Porting to MySQL/SQL Server would require new adapters.  
- A generic server needs a database abstraction layer, driver detection and localized error messages.

## 6. Hyper Module Dependencies
- `get_hyper_insights` now calls functions from `src/modules/hyper/employee-lifecycle/service.ts` (missing documents, onboarding status, etc.). Those calculations exist only in this HRM code base.  
- To reuse elsewhere we need optional “insight plugins” so host apps can register their own analytics providers without editing the MCP core.

## 7. Prompting & Provider Config Locked In
- `claudeService.ts` and `genaiService.ts` bake in HR-specific system prompts, preferred models and temperature settings.  
- A generic module should externalize prompts, provider credentials and default parameters via configuration.

## 8. Validation & Testing Gaps
- Tool argument validation is minimal (basic `zod` checks) and no integration tests ensure that declared tools actually work.  
- Supporting arbitrary schemas would require stronger validation, schema introspection, and CI tests so breaking changes are caught early.

## 9. Deployment & Versioning Strategy
- The MCP server assumes it lives inside the HRM monolith with direct ORM access and shared env vars. Packaging it for other projects would require:  
  - clear build outputs (e.g., separate NPM package),  
  - migration/versioning strategy for tools,  
  - an extension API that explains how to register new handlers, prompts and models.

## Recommended Path To Genericity
1. **Abstract Tool Registry** – Allow host apps to register tool metadata and handlers declaratively.  
2. **Data/Service Adapters** – Replace direct ORM imports with interfaces so each project supplies its own data layer.  
3. **Configurable Prompting** – Load system prompts, provider IDs and temperatures from config/env.  
4. **Parameterize Dynamic SQL** – Honor custom schemas, DB drivers, limits and formatting through configuration.  
5. **Plugin System For Insights** – Expose hook points for analytics like onboarding or attendance rather than hard-coding Hyper services.  
6. **Documentation & Tests** – Ship templates plus contract tests to ensure projects register the required components before the server boots.

Without these refactors the MCP server will remain tightly coupled to this HR schema and business logic, making it difficult to repurpose for other domains.
