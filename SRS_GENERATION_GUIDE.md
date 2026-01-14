# SRS Document Generation Guide

## Overview

This directory contains a Python script (`generate_srs.py`) that automatically generates a comprehensive Software Requirements Specification (SRS) document following the IEEE 830-1998 standard for the Travel Planning & Recommendation System.

## Generated Document

The script creates a professional Microsoft Word (.docx) document with:

### Document Structure (IEEE 830-1998 Compliant)

#### Title Page
- Project title
- Document type
- Version and date
- Team information

#### Table of Contents
- Auto-generated section links for all major sections

#### List of Figures
- All diagrams and visual elements

#### 1.0 INTRODUCTION
- 1.1 Purpose
- 1.2 Scope of Project
- 1.3 Glossary
- 1.4 References
- 1.5 Overview of Document
- 1.6 Stakeholders

#### 2.0 OVERALL DESCRIPTION
- 2.1 System Environment (with PlantUML use case diagram)
- 2.2 Functional Requirements Specification (with use cases and user stories)
- 2.3 User Characteristics
- 2.4 Non-Functional Requirements
- 2.5 Budget (Estimated with GitHub Student benefits)
- 2.6 Feasibility Study (Technical, Economic, Operational, Legal & Risk)

#### 3.0 REQUIREMENTS SPECIFICATION
- 3.1 External Interface Requirements
- 3.2 Functional Requirements (7 detailed requirements)
- 3.3 Detailed Non-Functional Requirements
- 3.4 Data Model (with PlantUML class and state diagrams)

#### APPENDICES
- Appendix A: PlantUML Diagram Instructions

## Installation

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Install Dependencies

```bash
pip install python-docx
```

## Usage

### Generate SRS Document

```bash
python3 generate_srs.py
```

The script will:
1. Create a comprehensive SRS document
2. Include all IEEE 830-1998 required sections
3. Add PlantUML diagrams (as code blocks)
4. Save as: `Travel_Planning_System_SRS_v1.0_YYYYMMDD.docx`

### Output

```
✓ SRS document generated successfully: Travel_Planning_System_SRS_v1.0_20260114.docx
✓ Document size: 382 paragraphs
✓ Document includes:
  - Title page with project information
  - Complete table of contents
  - All IEEE 830-1998 required sections
  - PlantUML diagrams (use case, class, state)
  - Detailed functional and non-functional requirements
  - Comprehensive feasibility study
  - Budget breakdown with student benefits
  - Appendices with PlantUML instructions
```

## Features

### IEEE 830-1998 Compliance
- Follows the standard structure and format
- Includes all required sections
- Professional formatting with proper heading hierarchy

### PlantUML Diagrams
The document includes PlantUML code for:
1. **System Use Case Diagram** - Shows all actors and system interactions
2. **Entity Relationship Diagram** - Complete data model with relationships
3. **State Diagram** - Travel plan lifecycle

To render these diagrams:
- Online: Visit http://www.plantuml.com/plantuml/
- Local: Install Java + Graphviz + plantuml.jar

### User Stories and Acceptance Criteria
Every use case includes:
- User story format: "As a [role], I want to [action] so that [benefit]"
- Clear, testable acceptance criteria
- Detailed flow descriptions

### Budget Analysis
- Detailed line-item breakdown
- Considers GitHub Student Developer Pack benefits
- Identifies free resources and tools
- Total estimated budget: $0 (leveraging student resources)

### Feasibility Study
Comprehensive analysis across:
- Technical Feasibility
- Economic Feasibility
- Operational Feasibility
- Legal and Risk Feasibility
- Overall Go/No-Go recommendation

## Customization

To customize the SRS for different projects, edit the `generate_srs.py` script:

### Change Project Information
```python
# Update in add_title_page() function
title.add_run("Your Project Name Here")
```

### Modify Technology Stack
```python
# Update in add_overall_description() function, section 2.1
# Change the technology stack lists
```

### Add/Remove Use Cases
```python
# Update in add_overall_description() function, section 2.2
# Add new use case dictionaries with user stories and acceptance criteria
```

### Update Budget Items
```python
# Update in add_overall_description() function, section 2.5
# Modify the budget_items list
```

### Customize Requirements
```python
# Update in add_requirements_specification() function, section 3.2
# Modify the requirements list
```

## Document Quality Checklist

Before finalizing, verify:
- ✓ All sections are complete
- ✓ All diagrams are included
- ✓ All user stories are present
- ✓ All acceptance criteria are testable
- ✓ Budget is realistic and detailed
- ✓ Feasibility study is comprehensive
- ✓ Stakeholders are properly identified
- ✓ Requirements are clear and unambiguous
- ✓ Document formatting is consistent

## Benefits

1. **Consistency**: Ensures all SRS documents follow the same structure
2. **Completeness**: Includes all IEEE 830-1998 required sections
3. **Efficiency**: Automates document generation
4. **Quality**: Built-in best practices and standards compliance
5. **Maintainability**: Script-based generation allows easy updates
6. **Reusability**: Template works for various project types

## File Structure

```
.
├── generate_srs.py                           # SRS generation script
├── Travel_Planning_System_SRS_v1.0_*.docx   # Generated SRS document
└── SRS_GENERATION_GUIDE.md                   # This guide
```

## Troubleshooting

### Error: "no module named 'docx'"
**Solution**: Install python-docx
```bash
pip install python-docx
```

### Error: "Permission denied"
**Solution**: Make script executable
```bash
chmod +x generate_srs.py
```

### Document doesn't open in Word
**Solution**: Ensure you have:
- Microsoft Word 2007 or later
- LibreOffice 6.0 or later
- Google Docs (upload the file)

## Support

For issues or questions about the SRS generation script, please:
1. Check this guide first
2. Review the script comments
3. Create an issue in the repository

## Version History

- v1.0 (2026-01-14): Initial release with complete IEEE 830-1998 compliance

## License

MIT License - Feel free to modify and use for your projects
