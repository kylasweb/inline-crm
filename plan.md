# AI Development Prompt: CRM System for IT System Integrator

## Project Overview

Develop a comprehensive CRM system tailored for an IT System Integrator to streamline sales, support, and operational workflows. The system should encompass the following core modules, each designed to address specific business needs and integrate seamlessly with one another.

## Core Modules and Functionality

### 1. Lead Management

  * **Purpose**: Capture, qualify, and assign leads from various channels to initiate the sales pipeline.
  * **Key Features**: Webform/email/chat integration for lead capture, auto-assignment engine, lead scoring and qualification system, source tracking, and aging alerts.

### 2. Opportunity & Deal Management

  * **Purpose**: Manage the sales pipeline and deal lifecycle to enhance revenue generation.
  * **Key Features**: Sales pipeline stages, forecasting tools, margin/pricing visibility dashboards.

### 3. Account & Contact Management

  * **Purpose**: Maintain detailed client information to support relationship management.
  * **Key Features**: 360° client view with contact hierarchy, industry/segment tagging, duplicate account checks.

### 4. Quotation Management

  * **Purpose**: Facilitate the creation and tracking of sales quotations to improve sales closing efficiency.
  * **Key Features**: CPQ engine, BOM builder, discount/margin approval workflows.

### 5. AMC & Licensing

  * **Purpose**: Track maintenance contracts and license renewals to ensure ongoing customer relationships and recurring revenue.
  * **Key Features**: Renewal tracker, license expiry alerts.

### 6. Ticketing System

  * **Purpose**: Log, resolve, and escalate customer issues to maintain service quality.
  * **Key Features**: SLA timers, escalation matrices, technician allocation, client portal for ticket visibility.

### 7. Dashboards & Reports

  * **Purpose**: Provide unified visibility into all operations and metrics for data - driven decision - making.
  * **Key Features**: KPI widgets, drill - down reports, role - based dashboards.

### 8. Presales Management

  * **Purpose**: Track RFPs, proposals, and presales efforts to support the early stages of sales.
  * **Key Features**: RFP repository, proposal builder, effort estimation logs.

### 9. Documentation Repository

  * **Purpose**: Store and manage important documents to ensure version control and compliance.
  * **Key Features**: Document tagging, version control, expiry reminders, digital sign - off tracking.

### 10. Asset Lifecycle

  * **Purpose**: Manage assets from procurement to retirement to optimize resource utilization.
  * **Key Features**: Asset tagging, warranty & AMC linking, movement tracking, location/assignment logs.

### 11. Vendor & Partner Management

  * **Purpose**: Manage third - party vendor profiles, contracts, and pricing to ensure stable supplier relationships.
  * **Key Features**: Vendor tiering, PO/quotation linking, partner performance analytics.

### 12. Feedback & Survey System

  * **Purpose**: Collect client feedback to enhance customer satisfaction and service quality.
  * **Key Features**: CSAT/NPS forms, survey scheduler, auto - escalation on low scores.

### 13. SLA & Escalation Tracker

  * **Purpose**: Monitor SLA adherence and automate escalation paths to ensure service quality.
  * **Key Features**: SLA matrix builder, real - time compliance tracking, multi - level escalation logic.

### 14. Revenue Forecasting

  * **Purpose**: Predict revenue based on the sales pipeline and account health to provide business insights.
  * **Key Features**: Weighted revenue calculator, risk rating tools.

### 15. ERP/HRMS/ITSM Integrations

  * **Purpose**: Ensure seamless syncing with external systems to enhance operational efficiency.
  * **Key Features**: REST API connector, scheduled sync jobs, data validation logic.

### 16. Competitor Intelligence

  * **Purpose**: Capture competitor information to maintain a competitive edge.
  * **Key Features**: Competitor DB, deal tagging, price benchmarking.

### 17. Certification & Training Tracker

  * **Purpose**: Track OEM certifications and training schedules to ensure team competency.
  * **Key Features**: Skill matrix, renewal alerts, OEM exam log.

## Integration and Interrelation of Modules

The system should be designed with a focus on the integration and interrelation of these modules. For example:

  * Leads from Lead Management should evolve into opportunities in Opportunity & Deal Management, with contacts and accounts tagged accordingly. Presales should get involved for solution design.
  * Opportunities should track sales progress, incorporating presales input and being forecasted into pipeline revenue.
  * Account & Contact Management should serve as a central hub for client information, used in AMC, tickets, feedback, and other modules.
  * Quotation Management should pull data from presales, product catalogs, and vendor purchase orders, also affecting SLA commitments.
  * AMC & Licensing should be tied to accounts, auto - creating support renewals and triggering satisfaction feedback.
  * Support tickets should originate from accounts, with AMC information defining priority and SLA. Post - ticket feedback should be sent.
  * Dashboards & Reports should provide unified visibility across all modules, offering insights into sales, support, delivery, compliance, and forecasting.
  * Presales & Solution Design should work closely with deal management, quotation, and vendor engagement.
  * Compliance & Documentation should link legal documents to quotes, AMCs, and vendor agreements.
  * Asset Lifecycle should reflect deployed assets affecting AMC and support tickets, with installation tracked by the delivery team.
  * Vendor & Partner Management should provide pricing during quoting and facilitate asset delivery, with contracts stored here.
  * Client Feedback should be collected after AMC renewal, asset deployment, or ticket closure.
  * SLA & Escalation should apply to ticketing and sold services, influencing escalation flow.
  * Revenue Forecasting should pull data from deals and quotes for predictive sales reports.
  * ERP, HRMS, ITSM Integrations should sync invoices, support tickets, and asset installations with backend systems.
  * Competitor Analysis should tag competitors in lost deals, analyze loss trends, and assess future pipeline impact.
  * Training/Certification Tracker should ensure the technical team has required OEM certifications for projects and ticket resolution.

## Expected Outcomes

  * A fully functional CRM system with all 17 modules integrated seamlessly.
  * A 95%+ user acceptance testing (UAT) pass rate.
  * Successful CRM deployment along with comprehensive training materials for all stakeholders.

## Success Criteria

The system should meet all specified functional requirements, provide a user - friendly interface, and deliver the expected business benefits in terms of improved sales efficiency, customer satisfaction, and operational effectiveness.

----------------------------------------------------

Advanced Lead Configurator for CRM

## Objective

Develop an advanced lead configurator integrated within the Lead Management module of a CRM system, specifically triggered via a "New Lead" button. This tool should enhance lead capture, qualification, assignment, and enrichment processes.

## Key Features to Implement

### 1. Dynamic Lead Capture Forms

  * Enable multi-channel lead capture (webforms, emails, chat, social media, offline events) with customizable forms for each channel.
  * Allow admin users to design forms with a mix of mandatory and optional fields (text, dropdowns, checkboxes, date pickers, file uploads).
  * Implement progressive profiling for step-by-step form completion.

### 2. Intelligent Lead Qualification Engine

  * Develop an automated scoring system based on demographic, company size, industry, budget, and engagement level.
  * Track lead behavior across digital channels and include it in qualification scores.
  * Integrate predictive analytics to assess conversion likelihood using historical lead data.

### 3. Smart Lead Assignment and Routing

  * Create rule-based assignment to route leads to appropriate sales representatives based on product interest, location, industry, or score.
  * Implement load balancing to distribute leads evenly among team members.
  * Define escalation paths for high-priority or unattended leads.

### 4. Lead Enrichment and Data Enhancement

  * Integrate with third-party data providers to enrich lead profiles with company financials, tech stack, news, and firmographics.
  * Implement data validation and cleaning rules to ensure accuracy.
  * Enable duplicate detection and merging of lead profiles.

### 5. Collaboration and Workflow Automation

  * Provide internal collaboration tools (comment sections, shared notes, file attachments) for sales, marketing, and presales teams.
  * Design automated workflows triggered by lead qualifications or status changes.
  * Integrate with marketing automation platforms for coordinated lead nurturing.

### 6. Advanced Reporting and Analytics

  * Develop a real-time lead analytics dashboard with customizable KPIs for different user roles.
  * Implement lead source attribution analysis.
  * Enable predictive forecasting of lead volumes and conversion rates.

## Implementation Guidelines

  * Ensure seamless integration within the existing Lead Management module.
  * Provide a user-friendly interface for non-technical users to configure forms and rules.
  * Ensure data privacy and security compliance.
  * Allow for easy customization and scalability.

## Success Criteria

  * Improved lead quality and conversion rates.
  * Faster lead engagement and sales cycle reduction.
  * Enhanced sales productivity through enriched lead data.
  * Data-driven decision-making supported by comprehensive analytics.
  * Improved cross-team collaboration on lead management.

Implement this advanced lead configurator within the Lead Management menu, triggered by the "New Lead" button, to streamline and enhance the lead creation process within the CRM system.

--------------------------------------