export const CATEGORY_META = {
  admission: {
    title: "Admission",
    description:
      "Stay updated on college, university, and school admissions, including entrance exams, application dates, and seat allocation processes.",
    // Admission posts live in the shared `admissionPosts` array below.
    fallbacks: [],
    seo: {
      title: "Admission 2026 – Latest College & University Admission Updates | JobCareer",
      description:
        "Stay updated on college, university, school and entrance exam admissions, application dates, eligibility and admission updates on JobCareer.",
    },
  },
  "admit-card": {
    title: "Admit Card",
    description:
      "Download the latest admit cards for government and competitive exams. Get direct links, release dates, and step-by-step instructions to access your hall tickets easily.",
    seo: {
      title: "Admit Card 2026 – Latest Hall Tickets & Exam Updates | JobCareer",
      description:
        "Download the latest government and competitive exam admit cards, hall tickets, exam dates and direct download links on JobCareer.",
    },
    fallbacks: [
      { _id: "ac-iaf-vayu", slug: "air-force-agniveervayu-admit-card-2026", badge: "AGNIVEERVAYU", title: "Indian Air Force Admit Card 2026 – Agniveervayu Intake 02/2027", org: "Indian Air Force", company: "Indian Air Force", category: "Admit Card", status: "ADMIT CARD RELEASED", date: "16 September 2026", createdAt: "2026-09-16T10:00:00.000Z", tagColor: "sky" },
      { _id: "ac-ibps-so", slug: "ibps-so-admit-card-2026", badge: "IBPS SO PRELIMS", title: "IBPS SO Admit Card 2026 – Download Prelims Call Letter, Exam Date", org: "IBPS", company: "IBPS", category: "Admit Card", createdAt: "2026-08-21T10:00:00.000Z", tagColor: "amber" },
      { _id: "ac-rrb-gd", slug: "rrb-group-d-admit-card-2026", badge: "RRB GROUP D", title: "RRB Group D Admit Card 2026 – City Intimation Slip and Admit Card", org: "Railway Recruitment Board", company: "Railway Recruitment Board", category: "Admit Card", createdAt: "2026-07-31T10:00:00.000Z", tagColor: "blue" },
      { _id: "ac-ibps-po", slug: "ibps-po-admit-card-2026", badge: "IBPS PO PRELIMS", title: "IBPS PO Admit Card 2026 – Prelims Call Letter, Exam on 22 August", org: "IBPS", company: "IBPS", category: "Admit Card", createdAt: "2026-08-01T10:00:00.000Z", tagColor: "amber" },
      { _id: "ac-sbi-po", slug: "sbi-po-admit-card-2026", badge: "SBI PO PRELIMS", title: "SBI PO Admit Card 2026 – Prelims Exam Call Letter Download", org: "State Bank of India", company: "State Bank of India", category: "Admit Card", createdAt: "2026-07-22T10:00:00.000Z", tagColor: "teal" },
      { _id: "ac-deled", slug: "assam-deled-admit-card-2026", badge: "D.EL.ED PET", title: "Assam D.El.Ed Admit Card 2026 – SCERT PET Admit Card Download", org: "SCERT Assam", company: "SCERT Assam", category: "Admit Card", createdAt: "2026-07-05T10:00:00.000Z", tagColor: "emerald" },
      { _id: "ac-apex-bank", slug: "apex-bank-admit-card-2026", badge: "APEX BANK ASSISTANT", title: "Apex Bank Admit Card 2026 – Assistant Written Exam Hall Ticket", org: "Assam Co-operative Apex Bank", company: "Assam Co-operative Apex Bank", category: "Admit Card", createdAt: "2026-06-16T10:00:00.000Z", tagColor: "sky" },
      { _id: "ac-ssuhs-gnm", slug: "ssuhs-gnm-admit-card-2026", badge: "SSUHS GNMEE", title: "SSUHS GNM Admit Card 2026 – Download GNMEE Admit Card", org: "SSUHS", company: "SSUHS", category: "Admit Card", createdAt: "2026-07-02T10:00:00.000Z", tagColor: "indigo" },
      { _id: "ac-apsc-cce", slug: "apsc-cce-admit-card-2026", badge: "APSC CCE 2026", title: "APSC CCE Admit Card 2026 – Combined Competitive Examination", org: "APSC", company: "APSC", category: "Admit Card", createdAt: "2026-07-05T10:00:00.000Z", tagColor: "blue" },
      { _id: "ac-neet", slug: "neet-admit-card-2026", badge: "NEET UG 2026", title: "NEET Admit Card 2026 – Download NTA NEET UG Hall Ticket", org: "NTA", company: "NTA", category: "Admit Card", createdAt: "2026-06-14T10:00:00.000Z", tagColor: "indigo" },
      { _id: "ac-tet", slug: "tet-admit-card-2026", badge: "ASSAM TET 2026", title: "TET Admit Card 2026 – Download Assam TET Admit Card", org: "Assam TET", company: "Assam TET", category: "Admit Card", createdAt: "2026-06-12T10:00:00.000Z", tagColor: "emerald" },
      { _id: "ac-cee", slug: "assam-cee-admit-card-2026", badge: "ASSAM CEE 2026", title: "Assam CEE Admit Card 2026 – Download ASTU CEE Hall Ticket", org: "ASTU", company: "ASTU", category: "Admit Card", createdAt: "2026-05-26T10:00:00.000Z", tagColor: "sky" },
      { _id: "ac-ghc", slug: "ghc-admit-card-2026", badge: "JUDICIAL ASSISTANT", title: "Gauhati High Court Admit Card 2026 – Judicial Assistant Exam", org: "Gauhati High Court", company: "Gauhati High Court", category: "Admit Card", createdAt: "2026-06-14T10:00:00.000Z", tagColor: "teal" },
      { _id: "ac-navy", slug: "indian-navy-agniveer-admit-card-2026", badge: "INDIAN NAVY", title: "Indian Navy Admit Card 2026 – Agniveer MR & SSR INET Hall Ticket", org: "Indian Navy", company: "Indian Navy", category: "Admit Card", status: "HALL TICKET AVAILABLE", date: "2 May 2026", createdAt: "2026-05-02T10:00:00.000Z", tagColor: "sky" },
      { _id: "ac-upsc-nda", slug: "upsc-nda-admit-card-2026", badge: "NDA/NA 2026", title: "UPSC NDA Admit Card 2026 – Download NDA/NA Exam Hall Ticket", org: "UPSC", company: "UPSC", category: "Admit Card", status: "ADMIT CARD RELEASED", date: "13 June 2026", createdAt: "2026-06-13T10:00:00.000Z", tagColor: "indigo" },
      { _id: "ac-ssc-gd", slug: "ssc-gd-admit-card-2026", badge: "SSC GD 2026", title: "SSC GD Admit Card 2026 – Constable CBT Exam City Details Out", org: "SSC", company: "SSC", category: "Admit Card", status: "CITY INTIMATION OUT", date: "19 April 2026", createdAt: "2026-04-19T10:00:00.000Z", tagColor: "emerald" },
      { _id: "ac-rbi", slug: "rbi-assistant-admit-card-2026", badge: "RBI ASSISTANT", title: "RBI Admit Card 2026 – Download Call Letter for Assistant Posts", org: "Reserve Bank of India", company: "Reserve Bank of India", category: "Admit Card", status: "CALL LETTER AVAILABLE", date: "2 April 2026", createdAt: "2026-04-02T10:00:00.000Z", tagColor: "teal" },
      { _id: "ac-sbi-cbo", slug: "sbi-cbo-admit-card-2026", badge: "SBI CBO", title: "SBI CBO Admit Card 2026 – Download CBO Exam Hall Ticket", org: "State Bank of India", company: "State Bank of India", category: "Admit Card", status: "ADMIT CARD RELEASED", date: "7 March 2026", createdAt: "2026-03-07T10:00:00.000Z", tagColor: "amber" },
      { _id: "ac-ctet", slug: "ctet-admit-card-2026", badge: "CTET 2026", title: "CTET Admit Card 2026 – Download Hall Ticket for 21st Edition Exam", org: "CTET / CBSE", company: "CTET / CBSE", category: "Admit Card", status: "HALL TICKET AVAILABLE", date: "5 June 2026", createdAt: "2026-06-05T10:00:00.000Z", tagColor: "blue" },
      { _id: "ac-ssc-mts", slug: "ssc-mts-admit-card-2026", badge: "SSC MTS 2026", title: "SSC MTS Admit Card 2026 – MTS and Havaldar Exam Call Letters", org: "SSC", company: "SSC", category: "Admit Card", status: "ADMIT CARD RELEASED", date: "1 February 2026", createdAt: "2026-02-01T10:00:00.000Z", tagColor: "sky" },
      { _id: "ac-ib-mts", slug: "ib-mts-admit-card-2026", badge: "IB MTS", title: "IB Admit Card 2026 – Multi-Tasking Staff General Online Exam", org: "Intelligence Bureau", company: "Intelligence Bureau", category: "Admit Card", status: "ADMIT CARD RELEASED", date: "9 January 2026", createdAt: "2026-01-09T10:00:00.000Z", tagColor: "indigo" },
      { _id: "ac-apsc-grade4", slug: "apsc-grade-iv-admit-card-2026", badge: "APSC GRADE IV", title: "APSC Admit Card 2026 – Grade IV Posts OMR Based Screening Test", org: "APSC", company: "APSC", category: "Admit Card", status: "ADMIT CARD RELEASED", date: "18 April 2026", createdAt: "2026-04-18T10:00:00.000Z", tagColor: "teal" },
      { _id: "ac-nmms", slug: "nmms-admit-card-2025", badge: "NMMS 2025", title: "NMMS Admit Card 2025 – National Means Merit Scholarship Examination", org: "SCERT Assam", company: "SCERT Assam", category: "Admit Card", status: "ADMIT CARD RELEASED", date: "27 January 2026", createdAt: "2026-01-27T10:00:00.000Z", tagColor: "emerald" },
      { _id: "ac-navodaya", slug: "navodaya-jnvst-admit-card-2026", badge: "JNVST CLASS 6", title: "Navodaya Admit Card 2026 – Download JNVST Class 6 Hall Ticket", org: "Jawahar Navodaya Vidyalaya", company: "Jawahar Navodaya Vidyalaya", category: "Admit Card", status: "HALL TICKET AVAILABLE", date: "17 November 2025", createdAt: "2025-11-17T10:00:00.000Z", tagColor: "amber" },
      { _id: "ac-ibps-rrb", slug: "ibps-rrb-officer-admit-card-2025", badge: "IBPS RRB 2025", title: "IBPS RRB Admit Card 2025 – Prelims Call Letter for Officer & OA Posts", org: "IBPS", company: "IBPS", category: "Admit Card", status: "CALL LETTER AVAILABLE", date: "16 November 2025", createdAt: "2025-11-16T10:00:00.000Z", tagColor: "blue" },
      { _id: "ac-ssc-cgl", slug: "ssc-cgl-admit-card-2026", badge: "SSC CGL 2026", title: "SSC CGL Admit Card 2026 – Tier 1 Exam Call Letter Download", org: "SSC", company: "SSC", category: "Admit Card", status: "ADMIT CARD RELEASED", date: "10 August 2026", createdAt: "2026-08-10T10:00:00.000Z", tagColor: "sky" },
      { _id: "ac-ssc-chsl", slug: "ssc-chsl-admit-card-2026", badge: "SSC CHSL 2026", title: "SSC CHSL Admit Card 2026 – Download Tier 1 Hall Ticket", org: "SSC", company: "SSC", category: "Admit Card", status: "ADMIT CARD RELEASED", date: "5 August 2026", createdAt: "2026-08-05T10:00:00.000Z", tagColor: "blue" },
      { _id: "ac-ssc-steno", slug: "ssc-stenographer-admit-card-2026", badge: "SSC STENO", title: "SSC Stenographer Admit Card 2026 – Grade C & D CBT Call Letter", org: "SSC", company: "SSC", category: "Admit Card", status: "ADMIT CARD RELEASED", date: "28 July 2026", createdAt: "2026-07-28T10:00:00.000Z", tagColor: "emerald" },
      { _id: "ac-assam-police", slug: "assam-police-admit-card-2026", badge: "ASSAM POLICE", title: "Assam Police Admit Card 2026 – Constable Written Exam Hall Ticket", org: "Assam Police", company: "Assam Police", category: "Admit Card", status: "ADMIT CARD RELEASED", date: "24 July 2026", createdAt: "2026-07-24T10:00:00.000Z", tagColor: "indigo" },
      { _id: "ac-apsc-je", slug: "apsc-je-admit-card-2026", badge: "APSC JE 2026", title: "APSC Junior Engineer Admit Card 2026 – EE/CE Exam Hall Ticket", org: "APSC", company: "APSC", category: "Admit Card", status: "ADMIT CARD RELEASED", date: "18 July 2026", createdAt: "2026-07-18T10:00:00.000Z", tagColor: "teal" },
      { _id: "ac-adre", slug: "adre-admit-card-2026", badge: "ADRE 2026", title: "ADRE & ADREC Admit Card 2026 – Grade III & IV CBRT Call Letter", org: "Government of Assam", company: "Government of Assam", category: "Admit Card", status: "ADMIT CARD RELEASED", date: "12 July 2026", createdAt: "2026-07-12T10:00:00.000Z", tagColor: "amber" },
      { _id: "ac-ibps-clerk", slug: "ibps-clerk-admit-card-2026", badge: "IBPS CLERK", title: "IBPS Clerk Admit Card 2026 – CRP Clerk Prelims Call Letter", org: "IBPS", company: "IBPS", category: "Admit Card", status: "CALL LETTER AVAILABLE", date: "6 July 2026", createdAt: "2026-07-06T10:00:00.000Z", tagColor: "amber" },
      { _id: "ac-sbi-clerk", slug: "sbi-clerk-admit-card-2026", badge: "SBI CLERK", title: "SBI Clerk Admit Card 2026 – Junior Associate Prelims Hall Ticket", org: "State Bank of India", company: "State Bank of India", category: "Admit Card", status: "CALL LETTER AVAILABLE", date: "29 June 2026", createdAt: "2026-06-29T10:00:00.000Z", tagColor: "teal" },
      { _id: "ac-rrb-ntpc", slug: "rrb-ntpc-admit-card-2026", badge: "RRB NTPC", title: "RRB NTPC Admit Card 2026 – CBT 1 Exam City & Call Letter", org: "Railway Recruitment Board", company: "Railway Recruitment Board", category: "Admit Card", status: "ADMIT CARD RELEASED", date: "22 June 2026", createdAt: "2026-06-22T10:00:00.000Z", tagColor: "blue" },
      { _id: "ac-assam-police-si", slug: "assam-police-si-admit-card-2026", badge: "ASSAM POLICE SI", title: "Assam Police SI Admit Card 2026 – SI & UB Unarmed Branch Exam", org: "Assam Police", company: "Assam Police", category: "Admit Card", status: "ADMIT CARD RELEASED", date: "15 June 2026", createdAt: "2026-06-15T10:00:00.000Z", tagColor: "emerald" },
      { _id: "ac-dee-assam", slug: "dee-assam-admit-card-2026", badge: "DEE ASSAM", title: "DEE Assam Admit Card 2026 – Directorate of Elementary Education Exam", org: "DEE Assam", company: "DEE Assam", category: "Admit Card", status: "HALL TICKET AVAILABLE", date: "8 June 2026", createdAt: "2026-06-08T10:00:00.000Z", tagColor: "sky" },
      { _id: "ac-upsc-capf", slug: "upsc-capf-admit-card-2026", badge: "UPSC CAPF", title: "UPSC CAPF Admit Card 2026 – Assistant Commandant Written Exam", org: "UPSC", company: "UPSC", category: "Admit Card", status: "ADMIT CARD RELEASED", date: "30 May 2026", createdAt: "2026-05-30T10:00:00.000Z", tagColor: "indigo" },
      { _id: "ac-ongc", slug: "ongc-admit-card-2026", badge: "ONGC 2026", title: "ONGC Admit Card 2026 – Non-Executive Written Exam Hall Ticket", org: "ONGC", company: "ONGC", category: "Admit Card", status: "ADMIT CARD RELEASED", date: "22 May 2026", createdAt: "2026-05-22T10:00:00.000Z", tagColor: "blue" },
      { _id: "ac-iocl", slug: "iocl-trade-apprentice-admit-card-2026", badge: "IOCL APPRENTICE", title: "IOCL Trade Apprentice Admit Card 2026 – Written Test Call Letter", org: "IOCL", company: "IOCL", category: "Admit Card", status: "ADMIT CARD RELEASED", date: "14 May 2026", createdAt: "2026-05-14T10:00:00.000Z", tagColor: "emerald" },
      { _id: "ac-guwahati-university", slug: "guwahati-university-admit-card-2026", badge: "GU EXAM", title: "Gauhati University Admit Card 2026 – UG Semester Exam Hall Ticket", org: "Gauhati University", company: "Gauhati University", category: "Admit Card", status: "HALL TICKET AVAILABLE", date: "6 May 2026", createdAt: "2026-05-06T10:00:00.000Z", tagColor: "teal" },
      { _id: "ac-sbi-so", slug: "sbi-so-admit-card-2026", badge: "SBI SO PHASE 1", title: "SBI SO Admit Card 2026 – Specialist Officer Phase 1 Call Letter", org: "State Bank of India", company: "State Bank of India", category: "Admit Card", status: "CALL LETTER AVAILABLE", date: "28 April 2026", createdAt: "2026-04-28T10:00:00.000Z", tagColor: "teal" },
      { _id: "ac-army-agniveer", slug: "indian-army-agniveer-admit-card-2026", badge: "AGNIVEER", title: "Indian Army Agniveer Admit Card 2026 – CEE Hall Ticket", org: "Indian Army", company: "Indian Army", category: "Admit Card", status: "ADMIT CARD RELEASED", date: "20 April 2026", createdAt: "2026-04-20T10:00:00.000Z", tagColor: "sky" },
      { _id: "ac-gmc", slug: "gmc-admit-card-2026", badge: "GMC 2026", title: "GMC Admit Card 2026 – Guwahati Municipal Corporation Exam", org: "GMC", company: "GMC", category: "Admit Card", status: "ADMIT CARD RELEASED", date: "12 April 2026", createdAt: "2026-04-12T10:00:00.000Z", tagColor: "indigo" },
      { _id: "ac-forest", slug: "assam-forest-admit-card-2026", badge: "FOREST GUARD", title: "Assam Forest Guard Admit Card 2026 – Forest Department Exam", org: "Assam Forest Department", company: "Assam Forest Department", category: "Admit Card", status: "ADMIT CARD RELEASED", date: "4 April 2026", createdAt: "2026-04-04T10:00:00.000Z", tagColor: "emerald" },
      { _id: "ac-rrb-alp", slug: "rrb-alp-admit-card-2026", badge: "RRB ALP", title: "RRB ALP Admit Card 2026 – CBT 1 City Intimation & Call Letter", org: "Railway Recruitment Board", company: "Railway Recruitment Board", category: "Admit Card", status: "CITY INTIMATION OUT", date: "28 March 2026", createdAt: "2026-03-28T10:00:00.000Z", tagColor: "blue" },
      { _id: "ac-agvb", slug: "agvb-admit-card-2026", badge: "AGVB 2026", title: "Assam Gramin Vikash Bank Admit Card 2026 – Officer & Office Assistant", org: "Assam Gramin Vikash Bank", company: "Assam Gramin Vikash Bank", category: "Admit Card", status: "CALL LETTER AVAILABLE", date: "20 March 2026", createdAt: "2026-03-20T10:00:00.000Z", tagColor: "amber" },
      { _id: "ac-lic", slug: "lic-assistant-admit-card-2026", badge: "LIC ASSISTANT", title: "LIC Assistant Admit Card 2026 – Prelims Call Letter Download", org: "LIC", company: "LIC", category: "Admit Card", status: "CALL LETTER AVAILABLE", date: "12 March 2026", createdAt: "2026-03-12T10:00:00.000Z", tagColor: "teal" },
      { _id: "ac-aiims", slug: "aiims-admit-card-2026", badge: "AIIMS 2026", title: "AIIMS Admit Card 2026 – Nursing Officer Recruitment Exam", org: "AIIMS", company: "AIIMS", category: "Admit Card", status: "ADMIT CARD RELEASED", date: "4 March 2026", createdAt: "2026-03-04T10:00:00.000Z", tagColor: "indigo" },
      { _id: "ac-jee-main", slug: "jee-main-admit-card-2026", badge: "JEE MAIN", title: "JEE Main Admit Card 2026 – Session 2 Hall Ticket Download", org: "NTA", company: "NTA", category: "Admit Card", status: "HALL TICKET AVAILABLE", date: "24 February 2026", createdAt: "2026-02-24T10:00:00.000Z", tagColor: "sky" },
      { _id: "ac-cotton-university", slug: "cotton-university-admit-card-2026", badge: "COTTON UNIV", title: "Cotton University Admit Card 2026 – Entrance & Semester Exams", org: "Cotton University", company: "Cotton University", category: "Admit Card", status: "HALL TICKET AVAILABLE", date: "16 February 2026", createdAt: "2026-02-16T10:00:00.000Z", tagColor: "emerald" },
      { _id: "ac-kvs", slug: "kvs-admit-card-2026", badge: "KVS 2026", title: "KVS Admit Card 2026 – PRT, TGT, PGT Written Exam", org: "KVS", company: "KVS", category: "Admit Card", status: "ADMIT CARD RELEASED", date: "8 February 2026", createdAt: "2026-02-08T10:00:00.000Z", tagColor: "blue" },
      { _id: "ac-coast-guard", slug: "indian-coast-guard-admit-card-2026", badge: "COAST GUARD", title: "Indian Coast Guard Admit Card 2026 – Navik & Yantrik CBT", org: "Indian Coast Guard", company: "Indian Coast Guard", category: "Admit Card", status: "ADMIT CARD RELEASED", date: "30 January 2026", createdAt: "2026-01-30T10:00:00.000Z", tagColor: "sky" },
      { _id: "ac-bsf", slug: "bsf-constable-admit-card-2026", badge: "BSF 2026", title: "BSF Constable Admit Card 2026 – Tradesman Written Exam", org: "BSF", company: "BSF", category: "Admit Card", status: "ADMIT CARD RELEASED", date: "22 January 2026", createdAt: "2026-01-22T10:00:00.000Z", tagColor: "indigo" },
      { _id: "ac-food-civil", slug: "assam-food-civil-supplies-admit-card-2026", badge: "FCS ASSAM", title: "Assam Food & Civil Supplies Admit Card 2026 – Inspector Exam", org: "Assam Food & Civil Supplies", company: "Assam Food & Civil Supplies", category: "Admit Card", status: "ADMIT CARD RELEASED", date: "14 January 2026", createdAt: "2026-01-14T10:00:00.000Z", tagColor: "amber" },
      { _id: "ac-pwd", slug: "assam-pwd-admit-card-2026", badge: "PWD ASSAM", title: "Assam PWD Admit Card 2026 – Junior Engineer Exam Hall Ticket", org: "Assam PWD", company: "Assam PWD", category: "Admit Card", status: "ADMIT CARD RELEASED", date: "6 January 2026", createdAt: "2026-01-06T10:00:00.000Z", tagColor: "emerald" },
      { _id: "ac-cisf", slug: "cisf-constable-admit-card-2026", badge: "CISF GD", title: "CISF Constable Admit Card 2026 – GD CBT Call Letter", org: "CISF", company: "CISF", category: "Admit Card", status: "ADMIT CARD RELEASED", date: "28 December 2025", createdAt: "2025-12-28T10:00:00.000Z", tagColor: "blue" },
      { _id: "ac-rrb-paramedical", slug: "rrb-paramedical-admit-card-2026", badge: "RRB PARA", title: "RRB Paramedical Admit Card 2026 – Various Categories CBT", org: "Railway Recruitment Board", company: "Railway Recruitment Board", category: "Admit Card", status: "ADMIT CARD RELEASED", date: "20 December 2025", createdAt: "2025-12-20T10:00:00.000Z", tagColor: "teal" },
      { _id: "ac-education-dept", slug: "assam-education-dept-admit-card-2026", badge: "EDUCATION DEPT", title: "Assam Education Department Admit Card 2026 – Non-Teaching Exam", org: "Assam Education Department", company: "Assam Education Department", category: "Admit Card", status: "ADMIT CARD RELEASED", date: "12 December 2025", createdAt: "2025-12-12T10:00:00.000Z", tagColor: "indigo" },
      { _id: "ac-nabard", slug: "nabard-admit-card-2026", badge: "NABARD AM", title: "NABARD Admit Card 2026 – Assistant Manager Prelims", org: "NABARD", company: "NABARD", category: "Admit Card", status: "CALL LETTER AVAILABLE", date: "4 December 2025", createdAt: "2025-12-04T10:00:00.000Z", tagColor: "amber" },
      { _id: "ac-aec", slug: "assam-engineering-college-admit-card-2026", badge: "AEC 2026", title: "Assam Engineering College Admission Test Admit Card 2026", org: "Assam Engineering College", company: "Assam Engineering College", category: "Admit Card", status: "HALL TICKET AVAILABLE", date: "26 November 2025", createdAt: "2025-11-26T10:00:00.000Z", tagColor: "sky" },
      { _id: "ac-ssc-cpo", slug: "ssc-cpo-admit-card-2026", badge: "SSC CPO", title: "SSC CPO Admit Card 2026 – SI & ASI Paper 1 Call Letter", org: "SSC", company: "SSC", category: "Admit Card", status: "ADMIT CARD RELEASED", date: "18 November 2025", createdAt: "2025-11-18T10:00:00.000Z", tagColor: "blue" },
    ],
  },
  results: {
    title: "Results",
    description:
      "Stay updated with the latest examination results, merit lists, scorecards, and recruitment results. Find result dates, official links, and important result information in one place.",
    seo: {
      title: "Results 2026 – Latest Exam Results, Merit Lists & Scorecards | JobCareer",
      description:
        "Check the latest government job results, exam results, merit lists, scorecards, cut-off marks and selection lists on JobCareer.",
    },
    fallbacks: [
      { _id: "rs-1", slug: "indian-navy-result-2026", title: "Indian Navy Result 2026 – Agniveer MR & SSR Result Declared", org: "Indian Navy", company: "Indian Navy", category: "Results", exam: "Agniveer MR & SSR", resultType: "Recruitment Result", group: "government", status: "RESULT DECLARED", date: "17 September 2026", createdAt: "2026-09-17T10:00:00.000Z", officialSite: "https://www.joinindiannavy.gov.in", tagColor: "sky" },
      { _id: "rs-2", slug: "ssuhs-gnm-result-2026", title: "SSUHS GNM Result 2026 – Assam GNM Counselling Schedule", org: "SSUHS", company: "SSUHS", category: "Results", exam: "GNM Entrance 2026", resultType: "Entrance Result", group: "assam", status: "MERIT LIST OUT", date: "15 September 2026", createdAt: "2026-09-15T10:00:00.000Z", officialSite: "https://ssuhs.in", tagColor: "emerald" },
      { _id: "rs-3", slug: "sbi-po-result-2026", title: "SBI PO Result 2026 – Preliminary Exam Result and Merit List", org: "State Bank of India", company: "State Bank of India", category: "Results", exam: "SBI PO 2026 (Prelims)", resultType: "Banking Result", group: "banking", status: "SCORECARD AVAILABLE", date: "28 August 2026", createdAt: "2026-08-28T10:00:00.000Z", officialSite: "https://sbi.co.in", tagColor: "teal" },
      { _id: "rs-4", slug: "ibps-po-result-2026", title: "IBPS PO Result 2026 – Check CRP PO/MT-XVI Prelims Result", org: "IBPS", company: "IBPS", category: "Results", exam: "CRP PO/MT-XVI", resultType: "Banking Result", group: "banking", status: "SCORECARD AVAILABLE", date: "30 August 2026", createdAt: "2026-08-30T10:00:00.000Z", officialSite: "https://www.ibps.in", tagColor: "indigo" },
      { _id: "rs-5", slug: "ssuhs-cee-result-2026", title: "SSUHS CEE Result 2026 – BSc Nursing and Pharmacy Courses", org: "SSUHS", company: "SSUHS", category: "Results", exam: "CEE 2026 (BSc Nursing & Pharmacy)", resultType: "Entrance Result", group: "entrance", status: "MERIT LIST OUT", date: "4 September 2026", createdAt: "2026-09-04T10:00:00.000Z", officialSite: "https://ssuhs.in", tagColor: "emerald" },
      { _id: "rs-6", slug: "assam-deled-result-2026", title: "Assam D.El.Ed Result 2026 – Round 2 Allotment List", org: "SCERT Assam", company: "SCERT Assam", category: "Results", exam: "D.El.Ed Admission 2026", resultType: "Admission Result", group: "assam", status: "MERIT LIST OUT", date: "24 August 2026", createdAt: "2026-08-24T10:00:00.000Z", officialSite: "https://assam.gov.in", tagColor: "blue" },
      { _id: "rs-7", slug: "ssc-mts-result-2026", title: "SSC MTS Result 2026 – Havaldar PET/PST Shortlist & Cut Off", org: "SSC", company: "SSC", category: "Results", exam: "MTS & Havaldar 2026", resultType: "Government Exam Result", group: "government", status: "RESULT DECLARED", date: "3 August 2026", createdAt: "2026-08-03T10:00:00.000Z", officialSite: "https://ssc.gov.in", tagColor: "amber" },
      { _id: "rs-8", slug: "ibps-so-result-2026", title: "IBPS SO Result 2026 – Specialist Officer Prelims Scorecard", org: "IBPS", company: "IBPS", category: "Results", exam: "CRP SPL-XVI", resultType: "Banking Result", group: "banking", status: "SCORECARD AVAILABLE", date: "30 August 2026", createdAt: "2026-08-30T11:00:00.000Z", officialSite: "https://www.ibps.in", tagColor: "indigo" },
      { _id: "rs-9", slug: "apsc-cce-result-2026", title: "APSC CCE Result 2026 – Prelims Result Declared", org: "Assam Public Service Commission", company: "Assam Public Service Commission", category: "Results", exam: "CCE 2026 (Prelims)", resultType: "Government Exam Result", group: "government", status: "RESULT DECLARED", date: "30 July 2026", createdAt: "2026-07-30T10:00:00.000Z", officialSite: "https://apsc.nic.in", tagColor: "blue" },
      { _id: "rs-10", slug: "apex-bank-result-2026", title: "Apex Bank Result 2026 – Assistant Written Exam Merit List", org: "Assam Co-operative Apex Bank", company: "Assam Co-operative Apex Bank", category: "Results", exam: "Assistant Recruitment 2026", resultType: "Banking Result", group: "banking", status: "MERIT LIST OUT", date: "30 July 2026", createdAt: "2026-07-30T09:00:00.000Z", officialSite: "https://www.acabank.in", tagColor: "teal" },
      { _id: "rs-11", slug: "gu-bed-merit-list-2026", title: "GU B.Ed Merit List 2026 – GUBEDCET Rank List & Cut-off Marks", org: "Gauhati University", company: "Gauhati University", category: "Results", exam: "GUBEDCET 2026", resultType: "Admission Result", group: "university", status: "MERIT LIST OUT", date: "2 August 2026", createdAt: "2026-08-02T10:00:00.000Z", officialSite: "https://gauhati.ac.in", tagColor: "indigo" },
      { _id: "rs-12", slug: "neet-result-2026", title: "NEET UG Result 2026 – Scorecard, Cut-off & Toppers", org: "NTA", company: "NTA", category: "Results", exam: "NEET UG 2026", resultType: "Entrance Exam Result", group: "entrance", status: "SCORECARD AVAILABLE", date: "17 July 2026", createdAt: "2026-07-17T10:00:00.000Z", officialSite: "https://nta.ac.in", tagColor: "indigo" },
      { _id: "rs-13", slug: "assam-police-result-2026", title: "Assam Police Result 2026 – Written Exam Result & Merit List", org: "Assam Police", company: "Assam Police", category: "Results", exam: "Constable Recruitment 2026", resultType: "Recruitment Result", group: "assam", status: "RESULT DECLARED", date: "15 September 2026", createdAt: "2026-09-15T08:00:00.000Z", officialSite: "https://assampolice.gov.in", tagColor: "indigo" },
      { _id: "rs-14", slug: "ssc-chsl-result-2026", title: "SSC CHSL Result 2026 – Tier 1 Scorecard & Cut-off Marks", org: "SSC", company: "SSC", category: "Results", exam: "CHSL 2026 (Tier 1)", resultType: "Government Exam Result", group: "government", status: "SCORECARD AVAILABLE", date: "12 September 2026", createdAt: "2026-09-12T08:00:00.000Z", officialSite: "https://ssc.gov.in", tagColor: "blue" },
      { _id: "rs-15", slug: "ssc-gd-result-2026", title: "SSC GD Result 2026 – Constable CBT Result Declared", org: "SSC", company: "SSC", category: "Results", exam: "GD Constable 2026 (CBT)", resultType: "Government Exam Result", group: "government", status: "RESULT DECLARED", date: "10 September 2026", createdAt: "2026-09-10T08:00:00.000Z", officialSite: "https://ssc.gov.in", tagColor: "amber" },
      { _id: "rs-16", slug: "upsc-nda-result-2026", title: "UPSC NDA Result 2026 – Written Exam Result & Interview Schedule", org: "UPSC", company: "UPSC", category: "Results", exam: "NDA & NA (II) 2026", resultType: "Entrance Exam Result", group: "government", status: "RESULT DECLARED", date: "9 September 2026", createdAt: "2026-09-09T08:00:00.000Z", officialSite: "https://upsc.gov.in", tagColor: "sky" },
      { _id: "rs-17", slug: "sbi-clerk-result-2026", title: "SBI Clerk Result 2026 – Prelims Result & Mains Admit Info", org: "State Bank of India", company: "State Bank of India", category: "Results", exam: "SBI Clerk 2026 (Prelims)", resultType: "Banking Result", group: "banking", status: "RESULT DECLARED", date: "8 September 2026", createdAt: "2026-09-08T08:00:00.000Z", officialSite: "https://sbi.co.in", tagColor: "teal" },
      { _id: "rs-18", slug: "rbi-assistant-result-2026", title: "RBI Assistant Result 2026 – Prelims Scorecard Declared", org: "Reserve Bank of India", company: "Reserve Bank of India", category: "Results", exam: "RBI Assistant 2026 (Prelims)", resultType: "Banking Result", group: "banking", status: "SCORECARD AVAILABLE", date: "6 September 2026", createdAt: "2026-09-06T08:00:00.000Z", officialSite: "https://www.rbi.org.in", tagColor: "amber" },
      { _id: "rs-19", slug: "adre-result-2026", title: "Assam Direct Recruitment Result 2026 – Grade III & IV Merit List", org: "Government of Assam", company: "Government of Assam", category: "Results", exam: "ADRE 2026 (Grade III & IV)", resultType: "Recruitment Result", group: "assam", status: "MERIT LIST OUT", date: "5 September 2026", createdAt: "2026-09-05T08:00:00.000Z", officialSite: "https://apsc.nic.in", tagColor: "indigo" },
      { _id: "rs-20", slug: "ssuhs-parametric-result-2026", title: "SSUHS Parametric Result 2026 – DMLT & Radiography Courses", org: "SSUHS", company: "SSUHS", category: "Results", exam: "Parametric Entrance 2026", resultType: "Entrance Result", group: "entrance", status: "MERIT LIST OUT", date: "3 September 2026", createdAt: "2026-09-03T08:00:00.000Z", officialSite: "https://ssuhs.in", tagColor: "emerald" },
      { _id: "rs-21", slug: "assam-tet-result-2026", title: "Assam TET Result 2026 – Lower & Upper Primary Qualifying List", org: "SEBA Assam", company: "SEBA Assam", category: "Results", exam: "Assam TET 2026", resultType: "Government Exam Result", group: "assam", status: "RESULT DECLARED", date: "1 September 2026", createdAt: "2026-09-01T08:00:00.000Z", officialSite: "https://sebaonline.org", tagColor: "blue" },
      { _id: "rs-22", slug: "rrb-ntpc-result-2026", title: "Railway NTPC Result 2026 – CBT 1 Result & Cut-off Marks", org: "RRB", company: "RRB", category: "Results", exam: "NTPC 2026 (CBT 1)", resultType: "Government Exam Result", group: "government", status: "RESULT DECLARED", date: "29 August 2026", createdAt: "2026-08-29T08:00:00.000Z", officialSite: "https://rrb.gov.in", tagColor: "sky" },
      { _id: "rs-23", slug: "ctet-result-2026", title: "CTET Result 2026 – Scorecard, Marks & Qualifying Status", org: "CBSE / CTET", company: "CBSE / CTET", category: "Results", exam: "CTET 2026 (21st Edition)", resultType: "Government Exam Result", group: "entrance", status: "SCORECARD AVAILABLE", date: "27 August 2026", createdAt: "2026-08-27T08:00:00.000Z", officialSite: "https://ctet.nic.in", tagColor: "indigo" },
      { _id: "rs-24", slug: "gauhati-university-result-2026", title: "Gauhati University Result 2026 – UG & PG Semester Results", org: "Gauhati University", company: "Gauhati University", category: "Results", exam: "UG/PG Semester 2026", resultType: "University Result", group: "university", status: "RESULT DECLARED", date: "25 August 2026", createdAt: "2026-08-25T08:00:00.000Z", officialSite: "https://gauhati.ac.in", tagColor: "teal" },
      { _id: "rs-25", slug: "assam-panchayat-result-2026", title: "Assam Panchayat Result 2026 – PRD Various Posts Merit List", org: "Panchayat & Rural Development, Assam", company: "Panchayat & Rural Development, Assam", category: "Results", exam: "Panchayat Recruitment 2026", resultType: "Recruitment Result", group: "assam", status: "MERIT LIST OUT", date: "22 August 2026", createdAt: "2026-08-22T08:00:00.000Z", officialSite: "https://prd.assam.gov.in", tagColor: "emerald" },
      { _id: "rs-26", slug: "rrb-group-d-result-2026", title: "RRB Group D Result 2026 – CBT Result & PET Shortlist", org: "RRB", company: "RRB", category: "Results", exam: "Group D 2026 (CBT)", resultType: "Government Exam Result", group: "government", status: "RESULT DECLARED", date: "20 August 2026", createdAt: "2026-08-20T08:00:00.000Z", officialSite: "https://rrb.gov.in", tagColor: "sky" },
      { _id: "rs-27", slug: "ssc-cgl-result-2026", title: "SSC CGL Result 2026 – Tier 1 Scorecard & Cut-off", org: "SSC", company: "SSC", category: "Results", exam: "CGL 2026 (Tier 1)", resultType: "Government Exam Result", group: "government", status: "SCORECARD AVAILABLE", date: "18 August 2026", createdAt: "2026-08-18T08:00:00.000Z", officialSite: "https://ssc.gov.in", tagColor: "blue" },
      { _id: "rs-28", slug: "ibps-clerk-result-2026", title: "IBPS Clerk Result 2026 – CRP Clerk Prelims Scorecard", org: "IBPS", company: "IBPS", category: "Results", exam: "CRP Clerk-XII", resultType: "Banking Result", group: "banking", status: "SCORECARD AVAILABLE", date: "16 August 2026", createdAt: "2026-08-16T08:00:00.000Z", officialSite: "https://www.ibps.in", tagColor: "indigo" },
      { _id: "rs-29", slug: "assam-postal-circle-result-2026", title: "Assam Postal Circle Result 2026 – GDS Selection List", org: "India Post", company: "India Post", category: "Results", exam: "GDS Recruitment 2026", resultType: "Recruitment Result", group: "assam", status: "MERIT LIST OUT", date: "14 August 2026", createdAt: "2026-08-14T08:00:00.000Z", officialSite: "https://indiapostgdsonline.gov.in", tagColor: "teal" },
      { _id: "rs-30", slug: "navodaya-result-2026", title: "Navodaya JNVST Result 2026 – Class VI Selection List", org: "Navodaya Vidyalaya Samiti", company: "Navodaya Vidyalaya Samiti", category: "Results", exam: "JNVST Class VI 2026", resultType: "Entrance Exam Result", group: "entrance", status: "RESULT DECLARED", date: "12 August 2026", createdAt: "2026-08-12T08:00:00.000Z", officialSite: "https://navodaya.gov.in", tagColor: "amber" },
      { _id: "rs-31", slug: "sbi-so-result-2026", title: "SBI SO Result 2026 – Specialist Officer Prelims Scorecard", org: "State Bank of India", company: "State Bank of India", category: "Results", exam: "SBI SO 2026 (Prelims)", resultType: "Banking Result", group: "banking", status: "SCORECARD AVAILABLE", date: "10 August 2026", createdAt: "2026-08-10T08:00:00.000Z", officialSite: "https://sbi.co.in", tagColor: "amber" },
      { _id: "rs-32", slug: "jee-main-result-2026", title: "JEE Main Result 2026 – Session 2 Scorecard & Rank", org: "NTA", company: "NTA", category: "Results", exam: "JEE Main 2026 (Session 2)", resultType: "Entrance Exam Result", group: "entrance", status: "SCORECARD AVAILABLE", date: "8 August 2026", createdAt: "2026-08-08T08:00:00.000Z", officialSite: "https://jeemain.nta.nic.in", tagColor: "indigo" },
      { _id: "rs-33", slug: "assam-science-tech-university-result-2026", title: "Assam Science & Technology University Result 2026", org: "ASTU", company: "ASTU", category: "Results", exam: "UG Semester 2026", resultType: "University Result", group: "university", status: "RESULT DECLARED", date: "6 August 2026", createdAt: "2026-08-06T08:00:00.000Z", officialSite: "https://www.astu.ac.in", tagColor: "blue" },
      { _id: "rs-34", slug: "assam-hs-final-result-2026", title: "Assam HS Final Result 2026 – AHSEC Result Online", org: "AHSEC", company: "AHSEC", category: "Results", exam: "HS Final 2026", resultType: "Board Result", group: "assam", status: "RESULT DECLARED", date: "4 August 2026", createdAt: "2026-08-04T08:00:00.000Z", officialSite: "https://ahsec.assam.gov.in", tagColor: "emerald" },
      { _id: "rs-35", slug: "bsf-constable-result-2026", title: "BSF Constable Result 2026 – Tradesman Written Exam Result", org: "BSF", company: "BSF", category: "Results", exam: "Constable Tradesman 2026", resultType: "Recruitment Result", group: "government", status: "RESULT DECLARED", date: "2 August 2026", createdAt: "2026-08-02T08:00:00.000Z", officialSite: "https://bsf.gov.in", tagColor: "sky" },
      { _id: "rs-36", slug: "kvs-result-2026", title: "KVS Result 2026 – PRT, TGT & PGT Interview Shortlist", org: "KVS", company: "KVS", category: "Results", exam: "KVS Recruitment 2026", resultType: "Recruitment Result", group: "government", status: "MERIT LIST OUT", date: "30 July 2026", createdAt: "2026-07-30T08:00:00.000Z", officialSite: "https://kvsangathan.nic.in", tagColor: "blue" },
      { _id: "rs-37", slug: "assam-gramin-vikash-bank-result-2026", title: "Assam Gramin Vikash Bank Result 2026 – Officer & Assistant", org: "Assam Gramin Vikash Bank", company: "Assam Gramin Vikash Bank", category: "Results", exam: "RRB Recruitment 2026", resultType: "Banking Result", group: "banking", status: "RESULT DECLARED", date: "28 July 2026", createdAt: "2026-07-28T08:00:00.000Z", officialSite: "https://www.agvb.co.in", tagColor: "teal" },
      { _id: "rs-38", slug: "rrb-alp-result-2026", title: "RRB ALP Result 2026 – CBT 1 Result & Cut-off", org: "RRB", company: "RRB", category: "Results", exam: "ALP 2026 (CBT 1)", resultType: "Government Exam Result", group: "government", status: "RESULT DECLARED", date: "26 July 2026", createdAt: "2026-07-26T08:00:00.000Z", officialSite: "https://rrb.gov.in", tagColor: "sky" },
      { _id: "rs-39", slug: "gauhati-high-court-result-2026", title: "Gauhati High Court Result 2026 – Grade III Merit List", org: "Gauhati High Court", company: "Gauhati High Court", category: "Results", exam: "Grade III Recruitment 2026", resultType: "Recruitment Result", group: "assam", status: "MERIT LIST OUT", date: "24 July 2026", createdAt: "2026-07-24T08:00:00.000Z", officialSite: "https://ghconline.gov.in", tagColor: "indigo" },
      { _id: "rs-40", slug: "ibps-rrb-result-2026", title: "IBPS RRB Result 2026 – Officer Scale I Prelims Scorecard", org: "IBPS", company: "IBPS", category: "Results", exam: "CRP RRB-XV", resultType: "Banking Result", group: "banking", status: "SCORECARD AVAILABLE", date: "22 July 2026", createdAt: "2026-07-22T08:00:00.000Z", officialSite: "https://www.ibps.in", tagColor: "amber" },
      { _id: "rs-41", slug: "assam-hslc-result-2026", title: "Assam HSLC Result 2026 – Class X Board Result", org: "SEBA", company: "SEBA", category: "Results", exam: "HSLC 2026", resultType: "Board Result", group: "assam", status: "RESULT DECLARED", date: "20 July 2026", createdAt: "2026-07-20T08:00:00.000Z", officialSite: "https://sebaonline.org", tagColor: "emerald" },
      { _id: "rs-42", slug: "aiims-result-2026", title: "AIIMS Result 2026 – Nursing Officer Recruitment Result", org: "AIIMS", company: "AIIMS", category: "Results", exam: "Nursing Officer 2026", resultType: "Entrance Result", group: "entrance", status: "RESULT DECLARED", date: "18 July 2026", createdAt: "2026-07-18T08:00:00.000Z", officialSite: "https://www.aiimsexams.ac.in", tagColor: "indigo" },
      { _id: "rs-43", slug: "ongc-result-2026", title: "ONGC Result 2026 – Various Posts Written Exam Result", org: "ONGC", company: "ONGC", category: "Results", exam: "ONGC Recruitment 2026", resultType: "Recruitment Result", group: "government", status: "RESULT DECLARED", date: "16 July 2026", createdAt: "2026-07-16T08:00:00.000Z", officialSite: "https://www.ongcindia.com", tagColor: "blue" },
      { _id: "rs-44", slug: "rbi-result-2026", title: "RBI Result 2026 – Grade B Officer Phase 1 Result", org: "Reserve Bank of India", company: "Reserve Bank of India", category: "Results", exam: "RBI Grade B 2026 (Phase 1)", resultType: "Banking Result", group: "banking", status: "RESULT DECLARED", date: "14 July 2026", createdAt: "2026-07-14T08:00:00.000Z", officialSite: "https://www.rbi.org.in", tagColor: "teal" },
      { _id: "rs-45", slug: "aau-result-2026", title: "Assam Agricultural University Result 2026 – Admission Merit List", org: "AAU", company: "AAU", category: "Results", exam: "UG Admission 2026", resultType: "University Result", group: "university", status: "MERIT LIST OUT", date: "12 July 2026", createdAt: "2026-07-12T08:00:00.000Z", officialSite: "https://www.aau.ac.in", tagColor: "emerald" },
      { _id: "rs-46", slug: "indian-army-agniveer-result-2026", title: "Indian Army Agniveer Result 2026 – Written Exam Result & SSB", org: "Indian Army", company: "Indian Army", category: "Results", exam: "Agniveer 2026 (Written)", resultType: "Recruitment Result", group: "government", status: "RESULT DECLARED", date: "10 July 2026", createdAt: "2026-07-10T08:00:00.000Z", officialSite: "https://joinindianarmy.nic.in", tagColor: "sky" },
      { _id: "rs-47", slug: "assam-tgt-result-2026", title: "Assam TGT Recruitment Result 2026 – SSAM Grade III", org: "SSAM Assam", company: "SSAM Assam", category: "Results", exam: "TGT Recruitment 2026", resultType: "Recruitment Result", group: "assam", status: "MERIT LIST OUT", date: "8 July 2026", createdAt: "2026-07-08T08:00:00.000Z", officialSite: "https://ssam.assam.gov.in", tagColor: "blue" },
      { _id: "rs-48", slug: "jee-advanced-result-2026", title: "JEE Advanced Result 2026 – Rank List & AIR", org: "IIT", company: "IIT", category: "Results", exam: "JEE Advanced 2026", resultType: "Entrance Exam Result", group: "entrance", status: "SCORECARD AVAILABLE", date: "6 July 2026", createdAt: "2026-07-06T08:00:00.000Z", officialSite: "https://jeeadv.ac.in", tagColor: "indigo" },
      { _id: "rs-49", slug: "ssc-stenographer-result-2026", title: "SSC Stenographer Result 2026 – Grade C & D Skill Test List", org: "SSC", company: "SSC", category: "Results", exam: "Stenographer 2026 (CBT)", resultType: "Government Exam Result", group: "government", status: "RESULT DECLARED", date: "4 July 2026", createdAt: "2026-07-04T08:00:00.000Z", officialSite: "https://ssc.gov.in", tagColor: "amber" },
      { _id: "rs-50", slug: "lic-assistant-result-2026", title: "LIC Assistant Result 2026 – Prelims Scorecard Declared", org: "LIC", company: "LIC", category: "Results", exam: "LIC Assistant 2026 (Prelims)", resultType: "Banking Result", group: "banking", status: "SCORECARD AVAILABLE", date: "2 July 2026", createdAt: "2026-07-02T08:00:00.000Z", officialSite: "https://licindia.in", tagColor: "teal" },
      { _id: "rs-51", slug: "nhai-result-2026", title: "NHAI Result 2026 – Deputy Manager Written Exam Result", org: "NHAI", company: "NHAI", category: "Results", exam: "NHAI Recruitment 2026", resultType: "Recruitment Result", group: "government", status: "RESULT DECLARED", date: "30 June 2026", createdAt: "2026-06-30T08:00:00.000Z", officialSite: "https://nhai.gov.in", tagColor: "blue" },
      { _id: "rs-52", slug: "indian-airforce-agniveer-result-2026", title: "Indian Airforce Agniveer Result 2026 – Vayu Written Result", org: "Indian Air Force", company: "Indian Air Force", category: "Results", exam: "Agniveer Vayu 2026", resultType: "Recruitment Result", group: "government", status: "RESULT DECLARED", date: "28 June 2026", createdAt: "2026-06-28T08:00:00.000Z", officialSite: "https://indianairforce.nic.in", tagColor: "sky" },
      { _id: "rs-53", slug: "sbi-cbo-result-2026", title: "SBI CBO Result 2026 – Circle Based Officer Prelims Result", org: "State Bank of India", company: "State Bank of India", category: "Results", exam: "SBI CBO 2026 (Prelims)", resultType: "Banking Result", group: "banking", status: "RESULT DECLARED", date: "26 June 2026", createdAt: "2026-06-26T08:00:00.000Z", officialSite: "https://sbi.co.in", tagColor: "amber" },
      { _id: "rs-54", slug: "apsc-grade-iv-result-2026", title: "APSC Grade IV Result 2026 – Screening Test Merit List", org: "APSC", company: "APSC", category: "Results", exam: "Grade IV 2026", resultType: "Government Exam Result", group: "assam", status: "MERIT LIST OUT", date: "24 June 2026", createdAt: "2026-06-24T08:00:00.000Z", officialSite: "https://apsc.nic.in", tagColor: "indigo" },
      { _id: "rs-55", slug: "gramin-dak-sevak-result-2026", title: "Gramin Dak Sevak Result 2026 – GDS Merit List Assam", org: "India Post", company: "India Post", category: "Results", exam: "GDS 2026", resultType: "Recruitment Result", group: "assam", status: "MERIT LIST OUT", date: "22 June 2026", createdAt: "2026-06-22T08:00:00.000Z", officialSite: "https://indiapostgdsonline.gov.in", tagColor: "teal" },
      { _id: "rs-56", slug: "uco-bank-result-2026", title: "UCO Bank Result 2026 – SO & Various Posts Result", org: "UCO Bank", company: "UCO Bank", category: "Results", exam: "UCO Recruitment 2026", resultType: "Banking Result", group: "banking", status: "RESULT DECLARED", date: "20 June 2026", createdAt: "2026-06-20T08:00:00.000Z", officialSite: "https://www.ucobank.com", tagColor: "blue" },
      { _id: "rs-57", slug: "iocl-apprentice-result-2026", title: "Indian Oil Apprentice Result 2026 – Trades Test Merit List", org: "IOCL", company: "IOCL", category: "Results", exam: "Apprentice 2026", resultType: "Recruitment Result", group: "government", status: "MERIT LIST OUT", date: "18 June 2026", createdAt: "2026-06-18T08:00:00.000Z", officialSite: "https://www.iocl.com", tagColor: "emerald" },
      { _id: "rs-58", slug: "assam-jat-result-2026", title: "Assam JAT Result 2026 – Junior Assistant Exam Merit List", org: "Government of Assam", company: "Government of Assam", category: "Results", exam: "JAT 2026", resultType: "Entrance Exam Result", group: "assam", status: "MERIT LIST OUT", date: "16 June 2026", createdAt: "2026-06-16T08:00:00.000Z", officialSite: "https://assam.gov.in", tagColor: "indigo" },
      { _id: "rs-59", slug: "upsc-capf-result-2026", title: "UPSC CAPF Result 2026 – Assistant Commandant Written Result", org: "UPSC", company: "UPSC", category: "Results", exam: "CAPF 2026 (Written)", resultType: "Government Exam Result", group: "government", status: "RESULT DECLARED", date: "14 June 2026", createdAt: "2026-06-14T08:00:00.000Z", officialSite: "https://upsc.gov.in", tagColor: "sky" },
      { _id: "rs-60", slug: "gmc-result-2026", title: "GMC Result 2026 – Guwahati Municipal Corporation Result", org: "GMC", company: "GMC", category: "Results", exam: "GMC Recruitment 2026", resultType: "Recruitment Result", group: "assam", status: "RESULT DECLARED", date: "12 June 2026", createdAt: "2026-06-12T08:00:00.000Z", officialSite: "https://gmc.assam.gov.in", tagColor: "blue" },
    ],
  },
  scheme: {
    title: "Scheme",
    description:
      "Discover government schemes and financial assistance programs for students, job seekers, farmers, women, and entrepreneurs. Get details about benefits, eligibility, documents, and the application process.",
    seo: {
      title: "Government Schemes 2026 – Latest Assam & India Schemes | JobCareer",
      description:
        "Find the latest government schemes, financial assistance programs, scholarships, student schemes, farmer schemes, women welfare schemes and entrepreneurship programs on JobCareer.",
    },
    fallbacks: [
      { _id: "scm-1", slug: "sirish-scholarship-2026", title: "SIRISH Scholarship 2026 – Schemes, Eligibility & Apply Online", org: "Government of Assam", company: "Government of Assam", category: "Schemes", schemeType: "Student Scheme", group: "student", status: "Application Open", date: "31 August 2026", createdAt: "2026-08-31T10:00:00.000Z", officialSite: "https://assam.gov.in", tagColor: "emerald" },
      { _id: "scm-2", slug: "assam-scooty-scheme-2026", title: "Assam Scooty Scheme 2026 – Eligibility, Benefits & Apply Online", org: "Government of Assam", company: "Government of Assam", category: "Schemes", schemeType: "Student Scheme", group: "student", status: "Application / Notification", date: "25 August 2026", createdAt: "2026-08-25T10:00:00.000Z", officialSite: "https://assam.gov.in", tagColor: "indigo" },
      { _id: "scm-3", slug: "assam-nmms-exam-2026", title: "Assam NMMS Exam 2026 – Apply Online for Class VIII Scholarship", org: "SCERT Assam", company: "SCERT Assam", category: "Schemes", schemeType: "Education Scheme", group: "education", status: "Application Open", date: "22 August 2026", createdAt: "2026-08-22T10:00:00.000Z", officialSite: "https://assam.gov.in", tagColor: "blue" },
      { _id: "scm-4", slug: "assam-nmms-result-2026", title: "Assam NMMS Result 2026 – National Means Merit Scholarship Results", org: "SCERT Assam", company: "SCERT Assam", category: "Schemes", schemeType: "Scholarship Scheme", group: "scholarship", status: "Result Available", date: "25 March 2026", createdAt: "2026-03-25T10:00:00.000Z", officialSite: "https://assam.gov.in", tagColor: "amber" },
      { _id: "scm-5", slug: "cm-jibon-prerana-2026", title: "CM's Jibon Prerana Scheme 2026 – Financial Assistance for Students", org: "Government of Assam", company: "Government of Assam", category: "Schemes", schemeType: "Financial Assistance", group: "financial", status: "Scheme Update", date: "24 November 2025", createdAt: "2025-11-24T10:00:00.000Z", officialSite: "https://assam.gov.in", tagColor: "teal" },
      { _id: "scm-6", slug: "cm-jibon-anuprerana-2026", title: "CM's Jibon Anuprerana Scheme 2026 – Financial Assistance", org: "Government of Assam", company: "Government of Assam", category: "Schemes", schemeType: "Financial Assistance", group: "financial", status: "Scheme Update", date: "4 November 2025", createdAt: "2025-11-04T10:00:00.000Z", officialSite: "https://assam.gov.in", tagColor: "sky" },
      { _id: "scm-7", slug: "atmanirbhar-assam-2026", title: "Atmanirbhar Assam Scheme 2026 – Online Application & Benefits", org: "Government of Assam", company: "Government of Assam", category: "Schemes", schemeType: "Entrepreneurship Scheme", group: "entrepreneurship", status: "Scheme Update", date: "10 March 2026", createdAt: "2026-03-10T10:00:00.000Z", officialSite: "https://assam.gov.in", tagColor: "indigo" },
      { _id: "scm-8", slug: "mission-basundhara-3", title: "Mission Basundhara 3.0 – Apply Online for Assam Land Services", org: "Government of Assam", company: "Government of Assam", category: "Schemes", schemeType: "Government Scheme", group: "government", status: "Application / Service", date: "2 February 2026", createdAt: "2026-02-02T10:00:00.000Z", officialSite: "https://basundhara.assam.gov.in", tagColor: "emerald" },
      { _id: "scm-9", slug: "anundoram-borooah-award-2026", title: "Anundoram Borooah Award Scheme 2026 – Eligibility & Benefits", org: "Government of Assam", company: "Government of Assam", category: "Schemes", schemeType: "Education Scheme", group: "education", status: "Scheme Update", date: "14 March 2026", createdAt: "2026-03-14T10:00:00.000Z", officialSite: "https://assam.gov.in", tagColor: "blue" },
      { _id: "scm-10", slug: "orunodoi-assam", title: "Orunodoi Assam – Apply Process, Beneficiary List & Status", org: "Government of Assam", company: "Government of Assam", category: "Schemes", schemeType: "Financial Assistance", group: "financial", status: "Scheme Information", date: "16 August 2025", createdAt: "2025-08-16T10:00:00.000Z", officialSite: "https://orunodoi.assam.gov.in", tagColor: "teal" },
      { _id: "scm-11", slug: "obc-scholarship-assam-2026", title: "OBC Scholarship Assam 2026 – Eligibility and Application Form", org: "Government of Assam", company: "Government of Assam", category: "Schemes", schemeType: "Scholarship Scheme", group: "scholarship", status: "Application Open", date: "22 August 2026", createdAt: "2026-08-22T11:00:00.000Z", officialSite: "https://assam.gov.in", tagColor: "amber" },
      { _id: "scm-12", slug: "pm-kisan-2026", title: "PM-KISAN Scheme 2026 – Eligibility, Installment & Beneficiary Status", org: "Government of India", company: "Government of India", category: "Schemes", schemeType: "Farmer Scheme", group: "farmer", status: "Scheme Update", date: "September 2026", createdAt: "2026-09-01T10:00:00.000Z", officialSite: "https://pmkisan.gov.in", tagColor: "emerald" },
    ],
  },
  scholarship: {
    title: "Scholarship",
    description:
      "Explore scholarship opportunities for students across various educational levels. Find eligibility criteria, application deadlines, and benefits to support your academic journey.",
    seo: {
      title: "Scholarship 2026 – Latest Government & Assam Scholarships | JobCareer",
      description:
        "Find the latest government scholarships, Assam scholarships, student scholarships, merit scholarships, eligibility criteria, application dates and online application details on JobCareer.",
    },
    fallbacks: [
      { _id: "scho-1", slug: "ishan-uday-scholarship-2026", title: "Ishan Uday Scholarship 2026 – Apply Online for UGC Scholarships", org: "University Grants Commission (UGC)", company: "University Grants Commission (UGC)", category: "Scholarships", schemeType: "Higher Education Scholarship", group: "university", eligibility: "12th Pass", applyMode: "Online", startDate: "16 September 2026", lastDate: "31 October 2026", status: "Application Open", createdAt: "2026-09-16T10:00:00.000Z", officialSite: "https://www.ugc.gov.in", tagColor: "indigo" },
      { _id: "scho-2", slug: "sirish-scholarship-2026", title: "SIRISH Scholarship 2026 – Schemes, Eligibility & Apply Online", org: "Directorate of Tea Tribes and Adivasi Welfare, Assam", company: "Directorate of Tea Tribes and Adivasi Welfare, Assam", category: "Scholarships", schemeType: "Scholarship", group: "assam", eligibility: "Eligible Tea Tribes & Adivasi Students", applyMode: "Online", startDate: "26 August 2026", lastDate: "5 October 2026", status: "Application Open", createdAt: "2026-08-26T10:00:00.000Z", officialSite: "https://sirish.assam.gov.in", tagColor: "emerald" },
      { _id: "scho-3", slug: "assam-nmms-2026", title: "Assam NMMS Exam 2026 – Apply Online for Class VIII Scholarship", org: "Directorate of Secondary Education, Assam", company: "Directorate of Secondary Education, Assam", category: "Scholarships", schemeType: "School Scholarship", group: "school", eligibility: "Class VIII", applyMode: "Online", startDate: "12 August 2026", lastDate: "8 November 2026", status: "Application Open", createdAt: "2026-08-12T10:00:00.000Z", officialSite: "https://assam.gov.in", tagColor: "blue" },
      { _id: "scho-4", slug: "obc-scholarship-assam-2026", title: "OBC Scholarship Assam 2026 – Eligibility and Application Form", org: "Government of Assam", company: "Government of Assam", category: "Scholarships", schemeType: "OBC Scholarship", group: "assam", eligibility: "Class IX and Above", applyMode: "Online", startDate: "1 June 2026", lastDate: "30 September 2026", status: "Application Open", createdAt: "2026-06-01T10:00:00.000Z", officialSite: "https://assam.gov.in", tagColor: "amber" },
      { _id: "scho-5", slug: "assam-nmms-result-2026", title: "Assam NMMS Result 2026 – National Means Merit Scholarship Results", org: "SCERT / Directorate of Secondary Education, Assam", company: "SCERT / Directorate of Secondary Education, Assam", category: "Scholarships", schemeType: "Scholarship Result", group: "school", eligibility: "NMMS Candidates", status: "Result Available", createdAt: "2026-03-25T10:00:00.000Z", officialSite: "https://assam.gov.in", tagColor: "teal" },
      { _id: "scho-6", slug: "nmms-admit-card-2026", title: "NMMS Admit Card 2026 – National Means Merit Scholarship Examination", org: "Directorate of Secondary Education, Assam", company: "Directorate of Secondary Education, Assam", category: "Scholarships", schemeType: "Scholarship Examination", group: "school", eligibility: "Class VIII Students", status: "Admit Card / Exam Update", createdAt: "2026-11-05T10:00:00.000Z", officialSite: "https://assam.gov.in", tagColor: "sky" },
      { _id: "scho-7", slug: "dhe-combined-merit-scholarship-2026", title: "DHE Combined Merit Scholarship 2026 – Apply Online", org: "Directorate of Higher Education, Assam", company: "Directorate of Higher Education, Assam", category: "Scholarships", schemeType: "Higher Education Scholarship", group: "college", eligibility: "Eligible Degree & Master's Students", applyMode: "Online", status: "Scholarship Update", createdAt: "2026-08-20T10:00:00.000Z", officialSite: "https://dhe.assam.gov.in", tagColor: "indigo" },
      { _id: "scho-8", slug: "cm-jibon-anuprerana-scheme", title: "CM's Jibon Anuprerana Scheme – Financial Assistance for Students", org: "Government of Assam", company: "Government of Assam", category: "Scholarships", schemeType: "Financial Assistance", group: "assam", eligibility: "Eligible Research Scholars", applyMode: "Online", status: "Scheme / Scholarship", createdAt: "2025-11-04T10:00:00.000Z", officialSite: "https://assam.gov.in", tagColor: "emerald" },
      { _id: "scho-9", slug: "dhe-mobility-grant", title: "DHE Mobility Grant – Scholarship for Girl Students of Assam", org: "Directorate of Higher Education, Assam", company: "Directorate of Higher Education, Assam", category: "Scholarships", schemeType: "Girl Student Scholarship", group: "college", eligibility: "Eligible Female Students", applyMode: "Online", status: "Scholarship Update", createdAt: "2026-08-18T10:00:00.000Z", officialSite: "https://dhe.assam.gov.in", tagColor: "teal" },
      { _id: "scho-10", slug: "pre-matric-scholarship-assam-2026", title: "Pre-Matric Scholarship Assam 2026 – Apply Online", org: "Government of Assam", company: "Government of Assam", category: "Scholarships", schemeType: "Pre-Matric Scholarship", group: "school", eligibility: "School Students", applyMode: "Online", status: "Application Open", createdAt: "2026-09-01T10:00:00.000Z", officialSite: "https://assam.gov.in", tagColor: "blue" },
      { _id: "scho-11", slug: "post-matric-scholarship-assam-2026", title: "Post-Matric Scholarship Assam 2026 – Eligibility & Apply Online", org: "Government of Assam", company: "Government of Assam", category: "Scholarships", schemeType: "Post-Matric Scholarship", group: "college", eligibility: "Class XI and Above", applyMode: "Online", status: "Application Open", createdAt: "2026-09-02T10:00:00.000Z", officialSite: "https://assam.gov.in", tagColor: "indigo" },
      { _id: "scho-12", slug: "national-scholarship-portal-2026", title: "National Scholarship Portal 2026 – NSP Scholarship Apply Online", org: "Government of India", company: "Government of India", category: "Scholarships", schemeType: "Central Government Scholarship", group: "central", eligibility: "Eligible Students", applyMode: "Online", status: "Application Open", createdAt: "2026-09-10T10:00:00.000Z", officialSite: "https://scholarships.gov.in", tagColor: "amber" },
    ],
  },
  job: {
    title: "Jobs",
    description:
      "Stay updated with the latest government job notifications, recruitment drives, and employment opportunities. Find details on eligibility, application processes, and deadlines to secure your next career opportunity.",
    seo: {
      title: "Jobs 2026 – Latest Government & Private Jobs | JobCareer",
      description:
        "Find the latest government and private jobs, Assam jobs, banking jobs, railway jobs, recruitment notifications, eligibility, vacancies and application details on JobCareer.",
    },
    fallbacks: [
      { _id: "jb-1", slug: "assam-police-recruitment-2026", title: "Assam Police Recruitment 2026 – Apply Online for Various Posts", org: "Assam Police", company: "Assam Police", category: "Jobs", jobType: "Government Job", location: "Assam", lastDate: "30 September 2026", createdAt: "2026-09-05T10:00:00.000Z", tagColor: "indigo", officialLink: "https://slprbassam.in" },
      { _id: "jb-2", slug: "apsc-recruitment-2026", title: "APSC Recruitment 2026 – Apply Online for Various Posts", org: "Assam Public Service Commission", company: "Assam Public Service Commission", category: "Jobs", jobType: "Government Job", location: "Assam", lastDate: "25 September 2026", createdAt: "2026-09-02T10:00:00.000Z", tagColor: "indigo" },
      { _id: "jb-3", slug: "indian-army-recruitment-2026", title: "Indian Army Recruitment 2026 – Apply Online", org: "Indian Army", company: "Indian Army", category: "Jobs", jobType: "Government Job", location: "All India", lastDate: "20 September 2026", createdAt: "2026-08-28T10:00:00.000Z", tagColor: "sky" },
      { _id: "jb-4", slug: "ssc-cgl-recruitment-2026", title: "SSC CGL Recruitment 2026 – Apply Online", org: "Staff Selection Commission", company: "Staff Selection Commission", category: "Jobs", jobType: "Government Job", location: "All India", lastDate: "15 October 2026", createdAt: "2026-09-04T10:00:00.000Z", tagColor: "blue" },
      { _id: "jb-5", slug: "ibps-po-recruitment-2026", title: "IBPS PO Recruitment 2026 – Online Application", org: "IBPS", company: "IBPS", category: "Jobs", jobType: "Banking Job", location: "All India", lastDate: "30 September 2026", createdAt: "2026-09-01T10:00:00.000Z", tagColor: "amber" },
      { _id: "jb-6", slug: "sbi-clerk-recruitment-2026", title: "SBI Clerk Recruitment 2026 – Apply Online", org: "State Bank of India", company: "State Bank of India", category: "Jobs", jobType: "Banking Job", location: "All India", lastDate: "25 September 2026", createdAt: "2026-08-30T10:00:00.000Z", tagColor: "teal" },
      { _id: "jb-7", slug: "assam-direct-recruitment-2026", title: "Assam Direct Recruitment 2026 – Grade III & IV Posts", org: "Government of Assam", company: "Government of Assam", category: "Jobs", jobType: "Government Job", location: "Assam", lastDate: "10 October 2026", createdAt: "2026-09-06T10:00:00.000Z", tagColor: "indigo" },
      { _id: "jb-8", slug: "railway-group-d-recruitment-2026", title: "Railway Group D Recruitment 2026 – Apply Online", org: "Indian Railways", company: "Indian Railways", category: "Jobs", jobType: "Railway Job", location: "All India", lastDate: "5 October 2026", createdAt: "2026-09-03T10:00:00.000Z", tagColor: "sky" },
      { _id: "jb-9", slug: "lic-assistant-recruitment-2026", title: "LIC Assistant Recruitment 2026 – Apply Online", org: "LIC", company: "LIC", category: "Jobs", jobType: "Government Job", location: "All India", lastDate: "12 October 2026", createdAt: "2026-09-02T10:00:00.000Z", tagColor: "emerald" },
      { _id: "jb-10", slug: "gauhati-high-court-recruitment-2026", title: "Gauhati High Court Recruitment 2026 – Various Posts", org: "Gauhati High Court", company: "Gauhati High Court", category: "Jobs", jobType: "Government Job", location: "Guwahati, Assam", lastDate: "28 September 2026", createdAt: "2026-09-01T10:00:00.000Z", tagColor: "teal" },
      { _id: "jb-11", slug: "aau-recruitment-2026", title: "Assam Agricultural University Recruitment 2026", org: "AAU", company: "AAU", category: "Jobs", jobType: "Government Job", location: "Jorhat, Assam", lastDate: "18 September 2026", createdAt: "2026-08-27T10:00:00.000Z", tagColor: "emerald" },
      { _id: "jb-12", slug: "ongc-recruitment-2026", title: "ONGC Recruitment 2026 – Apply Online", org: "ONGC", company: "ONGC", category: "Jobs", jobType: "PSU Job", location: "Assam / All India", lastDate: "30 September 2026", createdAt: "2026-09-05T10:00:00.000Z", tagColor: "blue" },
      { _id: "jb-13", slug: "rpf-constable-recruitment-2026", title: "RPF Constable Recruitment 2026 – Apply Online for Various Posts", org: "Railway Protection Force", company: "Railway Protection Force", category: "Jobs", jobType: "Railway Job", location: "All India", lastDate: "30 July 2026", createdAt: "2026-07-20T10:00:00.000Z", tagColor: "sky" },
      { _id: "jb-14", slug: "ssc-chsl-recruitment-2026", title: "SSC CHSL 2026 – Apply Online for LDC, DEO & Various Posts", org: "Staff Selection Commission", company: "Staff Selection Commission", category: "Jobs", jobType: "Government Job", location: "All India", lastDate: "10 August 2026", createdAt: "2026-07-15T10:00:00.000Z", tagColor: "blue" },
      { _id: "jb-15", slug: "bank-of-baroda-recruitment-2026", title: "Bank of Baroda Recruitment 2026 – Apply Online for Various Posts", org: "Bank of Baroda", company: "Bank of Baroda", category: "Jobs", jobType: "Banking Job", location: "All India", lastDate: "15 July 2026", createdAt: "2026-06-28T10:00:00.000Z", tagColor: "amber" },
      { _id: "jb-16", slug: "iocl-apprentice-recruitment-2026", title: "IOCL Apprentice Recruitment 2026 – Trade Apprentice Online Apply", org: "Indian Oil Corporation", company: "Indian Oil Corporation", category: "Jobs", jobType: "PSU Job", location: "Digboi, Assam", lastDate: "20 July 2026", createdAt: "2026-06-30T10:00:00.000Z", tagColor: "emerald" },
      { _id: "jb-17", slug: "assam-gramin-vikash-bank-recruitment-2026", title: "Assam Gramin Vikash Bank Recruitment 2026 – Officer & Office Assistant", org: "Assam Gramin Vikash Bank", company: "Assam Gramin Vikash Bank", category: "Jobs", jobType: "Banking Job", location: "Assam", lastDate: "10 July 2026", createdAt: "2026-06-20T10:00:00.000Z", tagColor: "teal" },
      { _id: "jb-18", slug: "irctc-catering-recruitment-2026", title: "IRCTC Catering Staff Recruitment 2026 – Online Application", org: "IRCTC", company: "IRCTC", category: "Jobs", jobType: "Railway Job", location: "All India", lastDate: "25 July 2026", createdAt: "2026-06-25T10:00:00.000Z", tagColor: "sky" },
      { _id: "jb-19", slug: "sebi-recruitment-2026", title: "SEBI Recruitment 2026 – Officer Grade A Posts Apply Online", org: "SEBI", company: "SEBI", category: "Jobs", jobType: "Government Job", location: "All India", lastDate: "5 August 2026", createdAt: "2026-07-10T10:00:00.000Z", tagColor: "indigo" },
      { _id: "jb-20", slug: "dibrugarh-university-recruitment-2026", title: "Dibrugarh University Recruitment 2026 – Non-Teaching Posts", org: "Dibrugarh University", company: "Dibrugarh University", category: "Jobs", jobType: "Teaching Job", location: "Dibrugarh, Assam", lastDate: "18 August 2026", createdAt: "2026-07-18T10:00:00.000Z", tagColor: "emerald" },
      { _id: "jb-21", slug: "nhai-recruitment-2026", title: "NHAI Recruitment 2026 – Various Posts Apply Online", org: "NHAI", company: "NHAI", category: "Jobs", jobType: "Government Job", location: "Guwahati, Assam", lastDate: "12 August 2026", createdAt: "2026-07-05T10:00:00.000Z", tagColor: "blue" },
      { _id: "jb-22", slug: "assam-government-secretariat-recruitment-2026", title: "Assam Government Secretariat Recruitment 2026 – Grade III & IV Posts", org: "Government of Assam", company: "Government of Assam", category: "Jobs", jobType: "Government Job", location: "Dispur, Assam", lastDate: "25 August 2026", createdAt: "2026-07-22T10:00:00.000Z", tagColor: "indigo" },
      { _id: "jb-23", slug: "air-india-ground-staff-recruitment-2026", title: "Air India Ground Staff Recruitment 2026 – Various Posts", org: "Air India", company: "Air India", category: "Jobs", jobType: "Private Job", location: "All India", lastDate: "20 August 2026", createdAt: "2026-07-12T10:00:00.000Z", tagColor: "teal" },
      { _id: "jb-24", slug: "indian-coast-guard-recruitment-2026", title: "Indian Coast Guard Recruitment 2026 – Navik GD Apply Online", org: "Indian Coast Guard", company: "Indian Coast Guard", category: "Jobs", jobType: "Government Job", location: "All India", lastDate: "30 August 2026", createdAt: "2026-07-25T10:00:00.000Z", tagColor: "sky" },
      { _id: "jb-25", slug: "sbi-clerk-recruitment-2025", title: "SBI Clerk Recruitment 2025 – Apply Online for Junior Associates", org: "State Bank of India", company: "State Bank of India", category: "Jobs", jobType: "Banking Job", location: "All India", lastDate: "15 October 2025", createdAt: "2025-09-20T10:00:00.000Z", tagColor: "teal" },
      { _id: "jb-26", slug: "tocklai-tea-research-institute-recruitment-2025", title: "Tocklai Tea Research Institute Recruitment 2025 – Scientific & Technical Posts", org: "Tea Research Association", company: "Tea Research Association", category: "Jobs", jobType: "Private Job", location: "Jorhat, Assam", lastDate: "10 November 2025", createdAt: "2025-10-05T10:00:00.000Z", tagColor: "emerald" },
      { _id: "jb-27", slug: "indian-air-force-recruitment-2025", title: "Indian Air Force Recruitment 2025 – Agniveer Vayu Online Apply", org: "Indian Air Force", company: "Indian Air Force", category: "Jobs", jobType: "Government Job", location: "All India", lastDate: "20 November 2025", createdAt: "2025-10-18T10:00:00.000Z", tagColor: "sky" },
      { _id: "jb-28", slug: "aiims-recruitment-2025", title: "AIIMS Recruitment 2025 – Nursing Officer & Various Posts", org: "AIIMS Guwahati", company: "AIIMS Guwahati", category: "Jobs", jobType: "Government Job", location: "Guwahati, Assam", lastDate: "30 November 2025", createdAt: "2025-10-25T10:00:00.000Z", tagColor: "indigo" },
      { _id: "jb-29", slug: "apsc-cce-recruitment-2025", title: "APSC CCE Recruitment 2025 – Combined Competitive Examination Online Apply", org: "Assam Public Service Commission", company: "Assam Public Service Commission", category: "Jobs", jobType: "Government Job", location: "Assam", lastDate: "31 December 2025", createdAt: "2025-11-08T10:00:00.000Z", tagColor: "indigo" },
      { _id: "jb-30", slug: "ibps-po-recruitment-2025", title: "IBPS PO Recruitment 2025 – Probationary Officers Online Application", org: "IBPS", company: "IBPS", category: "Jobs", jobType: "Banking Job", location: "All India", lastDate: "25 November 2025", createdAt: "2025-10-30T10:00:00.000Z", tagColor: "amber" },
      { _id: "jb-31", slug: "south-salmara-mankachar-recruitment-2025", title: "South Salmara Mankachar District Recruitment 2025 – Various Posts", org: "District Administration", company: "District Administration", category: "Jobs", jobType: "Government Job", location: "South Salmara, Assam", lastDate: "15 November 2025", createdAt: "2025-10-12T10:00:00.000Z", tagColor: "teal" },
      { _id: "jb-32", slug: "kokrajhar-recruitment-2025", title: "Kokrajhar Recruitment 2025 – District Level Various Posts", org: "District Administration", company: "District Administration", category: "Jobs", jobType: "Government Job", location: "Kokrajhar, Assam", lastDate: "20 November 2025", createdAt: "2025-10-15T10:00:00.000Z", tagColor: "blue" },
      { _id: "jb-33", slug: "assam-direct-recruitment-3-0-2025", title: "Assam Direct Recruitment 3.0 2025 – Grade III & IV Posts Online", org: "Government of Assam", company: "Government of Assam", category: "Jobs", jobType: "Government Job", location: "Assam", lastDate: "18 December 2025", createdAt: "2025-11-01T10:00:00.000Z", tagColor: "indigo" },
      { _id: "jb-34", slug: "ibps-so-recruitment-2025", title: "IBPS Specialist Officer Recruitment 2025 – SO Posts Apply Online", org: "IBPS", company: "IBPS", category: "Jobs", jobType: "Banking Job", location: "All India", lastDate: "12 December 2025", createdAt: "2025-10-28T10:00:00.000Z", tagColor: "amber" },
      { _id: "jb-35", slug: "forest-department-recruitment-2025", title: "Assam Forest Department Recruitment 2025 – Forest Guard & Various Posts", org: "Assam Forest Department", company: "Assam Forest Department", category: "Jobs", jobType: "Government Job", location: "Assam", lastDate: "8 December 2025", createdAt: "2025-10-20T10:00:00.000Z", tagColor: "emerald" },
      { _id: "jb-36", slug: "sbi-cbo-recruitment-2025", title: "SBI CBO Recruitment 2025 – Circle Based Officer Online Application", org: "State Bank of India", company: "State Bank of India", category: "Jobs", jobType: "Banking Job", location: "All India", lastDate: "5 December 2025", createdAt: "2025-10-22T10:00:00.000Z", tagColor: "teal" },
      { _id: "jb-37", slug: "ssc-mts-recruitment-2025", title: "SSC MTS Recruitment 2025 – Multi Tasking Staff Online Application", org: "Staff Selection Commission", company: "Staff Selection Commission", category: "Jobs", jobType: "Government Job", location: "All India", lastDate: "8 December 2025", createdAt: "2025-10-24T10:00:00.000Z", tagColor: "blue" },
      { _id: "jb-38", slug: "indian-coast-guard-recruitment-2025", title: "Indian Coast Guard Recruitment 2025 – Navik GD & Yantrik Posts", org: "Indian Coast Guard", company: "Indian Coast Guard", category: "Jobs", jobType: "Government Job", location: "All India", lastDate: "15 December 2025", createdAt: "2025-10-26T10:00:00.000Z", tagColor: "sky" },
      { _id: "jb-39", slug: "sbi-po-recruitment-2025", title: "SBI PO Recruitment 2025 – Probationary Officer Online Application", org: "State Bank of India", company: "State Bank of India", category: "Jobs", jobType: "Banking Job", location: "All India", lastDate: "10 December 2025", createdAt: "2025-10-27T10:00:00.000Z", tagColor: "teal" },
      { _id: "jb-40", slug: "ssc-chsl-recruitment-2025", title: "SSC CHSL Recruitment 2025 – LDC, DEO & Various Posts Online", org: "Staff Selection Commission", company: "Staff Selection Commission", category: "Jobs", jobType: "Government Job", location: "All India", lastDate: "18 December 2025", createdAt: "2025-10-29T10:00:00.000Z", tagColor: "blue" },
      { _id: "jb-41", slug: "btr-recruitment-2025", title: "BTR Recruitment 2025 – Bodoland Territorial Region Various Posts", org: "Bodoland Territorial Region", company: "Bodoland Territorial Region", category: "Jobs", jobType: "Government Job", location: "BTR, Assam", lastDate: "20 December 2025", createdAt: "2025-11-02T10:00:00.000Z", tagColor: "indigo" },
      { _id: "jb-42", slug: "upsc-nda-recruitment-2025", title: "UPSC NDA Exam 2025 – Online Application for NDA & NA Posts", org: "UPSC", company: "UPSC", category: "Jobs", jobType: "Government Job", location: "All India", lastDate: "22 December 2025", createdAt: "2025-11-03T10:00:00.000Z", tagColor: "sky" },
      { _id: "jb-43", slug: "anganwadi-recruitment-2025", title: "Anganwadi Recruitment 2025 – Worker & Helper Posts Assam", org: "ICDS Assam", company: "ICDS Assam", category: "Jobs", jobType: "Government Job", location: "Assam", lastDate: "25 December 2025", createdAt: "2025-11-04T10:00:00.000Z", tagColor: "emerald" },
      { _id: "jb-44", slug: "ssc-cgl-recruitment-2025", title: "SSC CGL Recruitment 2025 – Combined Graduate Level Exam Apply", org: "Staff Selection Commission", company: "Staff Selection Commission", category: "Jobs", jobType: "Government Job", location: "All India", lastDate: "28 December 2025", createdAt: "2025-11-05T10:00:00.000Z", tagColor: "blue" },
      { _id: "jb-45", slug: "majuli-recruitment-2025", title: "Majuli Recruitment 2025 – District Level Various Posts", org: "District Administration", company: "District Administration", category: "Jobs", jobType: "Government Job", location: "Majuli, Assam", lastDate: "30 December 2025", createdAt: "2025-11-06T10:00:00.000Z", tagColor: "teal" },
      { _id: "jb-46", slug: "jorhat-recruitment-2025", title: "Jorhat Recruitment 2025 – District Level Various Posts", org: "District Administration", company: "District Administration", category: "Jobs", jobType: "Government Job", location: "Jorhat, Assam", lastDate: "31 December 2025", createdAt: "2025-11-07T10:00:00.000Z", tagColor: "indigo" },
      { _id: "jb-47", slug: "idbi-recruitment-2025", title: "IDBI Bank Recruitment 2025 – Executive & Various Posts Apply", org: "IDBI Bank", company: "IDBI Bank", category: "Jobs", jobType: "Banking Job", location: "All India", lastDate: "5 January 2026", createdAt: "2025-11-09T10:00:00.000Z", tagColor: "amber" },
      { _id: "jb-48", slug: "indian-army-recruitment-2025", title: "Indian Army Recruitment 2025 – Agniveer Various Posts Online", org: "Indian Army", company: "Indian Army", category: "Jobs", jobType: "Government Job", location: "All India", lastDate: "8 January 2026", createdAt: "2025-11-10T10:00:00.000Z", tagColor: "sky" },
      { _id: "jb-49", slug: "assam-tet-recruitment-2026", title: "Assam TET Recruitment 2026 – Teacher Eligibility Test Application", org: "Board of Secondary Education, Assam", company: "Board of Secondary Education, Assam", category: "Jobs", jobType: "Teaching Job", location: "Assam", lastDate: "20 February 2026", createdAt: "2026-01-08T10:00:00.000Z", tagColor: "emerald" },
      { _id: "jb-50", slug: "rbi-assistant-recruitment-2026", title: "RBI Assistant Recruitment 2026 – Apply Online", org: "Reserve Bank of India", company: "Reserve Bank of India", category: "Jobs", jobType: "Banking Job", location: "All India", lastDate: "28 February 2026", createdAt: "2026-01-15T10:00:00.000Z", tagColor: "amber" },
      { _id: "jb-51", slug: "indian-navy-agniveer-recruitment-2026", title: "Indian Navy Agniveer Recruitment 2026 – SSR & MR Posts Online", org: "Indian Navy", company: "Indian Navy", category: "Jobs", jobType: "Government Job", location: "All India", lastDate: "15 March 2026", createdAt: "2026-01-22T10:00:00.000Z", tagColor: "sky" },
      { _id: "jb-52", slug: "bsf-constable-recruitment-2026", title: "BSF Constable Recruitment 2026 – Tradesman Posts Apply Online", org: "BSF", company: "BSF", category: "Jobs", jobType: "Government Job", location: "All India", lastDate: "18 March 2026", createdAt: "2026-01-25T10:00:00.000Z", tagColor: "indigo" },
      { _id: "jb-53", slug: "ssc-gd-recruitment-2026", title: "SSC GD Constable Recruitment 2026 – Apply Online for GD Posts", org: "Staff Selection Commission", company: "Staff Selection Commission", category: "Jobs", jobType: "Government Job", location: "All India", lastDate: "25 March 2026", createdAt: "2026-01-28T10:00:00.000Z", tagColor: "blue" },
      { _id: "jb-54", slug: "nabard-recruitment-2026", title: "NABARD Recruitment 2026 – Assistant Manager & Grade A/B Posts", org: "NABARD", company: "NABARD", category: "Jobs", jobType: "Government Job", location: "All India", lastDate: "30 March 2026", createdAt: "2026-02-02T10:00:00.000Z", tagColor: "emerald" },
      { _id: "jb-55", slug: "drdo-recruitment-2026", title: "DRDO Recruitment 2026 – Technician & Various Posts Apply", org: "DRDO", company: "DRDO", category: "Jobs", jobType: "Government Job", location: "All India", lastDate: "5 April 2026", createdAt: "2026-02-05T10:00:00.000Z", tagColor: "sky" },
      { _id: "jb-56", slug: "uco-bank-recruitment-2026", title: "UCO Bank Recruitment 2026 – Various Posts Online Application", org: "UCO Bank", company: "UCO Bank", category: "Jobs", jobType: "Banking Job", location: "All India", lastDate: "12 April 2026", createdAt: "2026-02-08T10:00:00.000Z", tagColor: "amber" },
      { _id: "jb-57", slug: "assam-health-recruitment-2026", title: "NHM Assam Recruitment 2026 – Various Health Posts Online", org: "NHM Assam", company: "NHM Assam", category: "Jobs", jobType: "Government Job", location: "Assam", lastDate: "18 April 2026", createdAt: "2026-02-10T10:00:00.000Z", tagColor: "teal" },
      { _id: "jb-58", slug: "bpcl-recruitment-2026", title: "BPCL Recruitment 2026 – Apprentice & Various Posts Apply", org: "BPCL", company: "BPCL", category: "Jobs", jobType: "PSU Job", location: "All India", lastDate: "25 April 2026", createdAt: "2026-02-12T10:00:00.000Z", tagColor: "indigo" },
      { _id: "jb-59", slug: "gic-recruitment-2026", title: "GIC Re Recruitment 2026 – Officer Various Posts Application", org: "GIC Re", company: "GIC Re", category: "Jobs", jobType: "Government Job", location: "All India", lastDate: "30 April 2026", createdAt: "2026-02-15T10:00:00.000Z", tagColor: "blue" },
      { _id: "jb-60", slug: "ssa-assam-teacher-recruitment-2026", title: "SSA Assam Teacher Recruitment 2026 – Various Posts Apply Online", org: "SSA Assam", company: "SSA Assam", category: "Jobs", jobType: "Teaching Job", location: "Assam", lastDate: "5 May 2026", createdAt: "2026-02-18T10:00:00.000Z", tagColor: "emerald" },
      { _id: "jb-61", slug: "cotton-university-recruitment-2026", title: "Cotton University Recruitment 2026 – Assistant Professor & Various Posts", org: "Cotton University", company: "Cotton University", category: "Jobs", jobType: "Teaching Job", location: "Guwahati, Assam", lastDate: "15 June 2026", createdAt: "2026-05-01T10:00:00.000Z", tagColor: "emerald" },
      { _id: "jb-62", slug: "rrb-isolated-categories-recruitment-2026", title: "RRB Isolated Categories Recruitment 2026 – Various Posts Apply", org: "RRB", company: "RRB", category: "Jobs", jobType: "Railway Job", location: "All India", lastDate: "20 June 2026", createdAt: "2026-05-04T10:00:00.000Z", tagColor: "sky" },
      { _id: "jb-63", slug: "assam-gt-pgt-tet-recruitment-2026", title: "Assam GT/PGT TET Recruitment 2026 – Teacher Eligibility Test", org: "SEBA Assam", company: "SEBA Assam", category: "Jobs", jobType: "Teaching Job", location: "Assam", lastDate: "25 June 2026", createdAt: "2026-05-06T10:00:00.000Z", tagColor: "emerald" },
      { _id: "jb-64", slug: "adre-2026-recruitment", title: "ADRE 2026 Recruitment – Assam Direct Recruitment Grade III & IV", org: "Government of Assam", company: "Government of Assam", category: "Jobs", jobType: "Government Job", location: "Assam", lastDate: "30 June 2026", createdAt: "2026-05-08T10:00:00.000Z", tagColor: "indigo" },
      { _id: "jb-65", slug: "nagaon-recruitment-2025", title: "Nagaon Recruitment 2025 – District Level Various Posts", org: "District Administration", company: "District Administration", category: "Jobs", jobType: "Government Job", location: "Nagaon, Assam", lastDate: "10 January 2026", createdAt: "2025-12-01T10:00:00.000Z", tagColor: "teal" },
      { _id: "jb-66", slug: "rrb-ntpc-recruitment-2025", title: "RRB NTPC Recruitment 2025 – Non Technical Popular Categories Apply", org: "RRB", company: "RRB", category: "Jobs", jobType: "Railway Job", location: "All India", lastDate: "15 January 2026", createdAt: "2025-12-03T10:00:00.000Z", tagColor: "sky" },
      { _id: "jb-67", slug: "sbi-cbo-recruitment-2026", title: "SBI CBO Recruitment 2026 – Circle Based Officer Online Application", org: "State Bank of India", company: "State Bank of India", category: "Jobs", jobType: "Banking Job", location: "All India", lastDate: "25 June 2026", createdAt: "2026-05-10T10:00:00.000Z", tagColor: "teal" },
      { _id: "jb-68", slug: "assam-pwd-recruitment-2026", title: "Assam PWD Recruitment 2026 – Junior Engineer & Various Posts", org: "Assam PWD", company: "Assam PWD", category: "Jobs", jobType: "Government Job", location: "Assam", lastDate: "5 July 2026", createdAt: "2026-05-12T10:00:00.000Z", tagColor: "indigo" },
      { _id: "jb-69", slug: "cwc-recruitment-2026", title: "Central Warehousing Corporation Recruitment 2026 – Various Posts", org: "CWC", company: "CWC", category: "Jobs", jobType: "Government Job", location: "All India", lastDate: "10 July 2026", createdAt: "2026-05-14T10:00:00.000Z", tagColor: "blue" },
      { _id: "jb-70", slug: "ssc-stenographer-recruitment-2026", title: "SSC Stenographer Recruitment 2026 – Grade C & D Posts Apply", org: "Staff Selection Commission", company: "Staff Selection Commission", category: "Jobs", jobType: "Government Job", location: "All India", lastDate: "15 July 2026", createdAt: "2026-05-16T10:00:00.000Z", tagColor: "blue" },
      { _id: "jb-71", slug: "guwahati-municipal-corporation-recruitment-2026", title: "Guwahati Municipal Corporation Recruitment 2026 – Various Posts", org: "GMC", company: "GMC", category: "Jobs", jobType: "Government Job", location: "Guwahati, Assam", lastDate: "20 July 2026", createdAt: "2026-05-18T10:00:00.000Z", tagColor: "emerald" },
      { _id: "jb-72", slug: "rrb-alp-recruitment-2026", title: "RRB ALP Recruitment 2026 – Assistant Loco Pilot Apply Online", org: "RRB", company: "RRB", category: "Jobs", jobType: "Railway Job", location: "All India", lastDate: "25 July 2026", createdAt: "2026-05-20T10:00:00.000Z", tagColor: "sky" },
    ],
  },
};

// Official application portals for every sample job, keyed by slug. These links
// point to the organization's verified official recruitment page / portal.
const JOB_OFFICIAL_LINKS = {
  "assam-police-recruitment-2026": "https://slprbassam.in",
  "apsc-recruitment-2026": "https://apsc.nic.in",
  "indian-army-recruitment-2026": "https://joinindianarmy.nic.in",
  "ssc-cgl-recruitment-2026": "https://ssc.nic.in",
  "ibps-po-recruitment-2026": "https://www.ibps.in",
  "sbi-clerk-recruitment-2026": "https://sbi.co.in/careers",
  "assam-direct-recruitment-2026": "https://sebaonline.org",
  "railway-group-d-recruitment-2026": "https://www.rrbapply.gov.in",
  "lic-assistant-recruitment-2026": "https://licindia.in",
  "gauhati-high-court-recruitment-2026": "https://ghconline.gov.in",
  "aau-recruitment-2026": "https://www.aau.ac.in",
  "ongc-recruitment-2026": "https://www.ongcindia.com",
  "rpf-constable-recruitment-2026": "https://www.rrbapply.gov.in",
  "ssc-chsl-recruitment-2026": "https://ssc.nic.in",
  "bank-of-baroda-recruitment-2026": "https://www.bankofbaroda.in",
  "iocl-apprentice-recruitment-2026": "https://www.iocl.com",
  "assam-gramin-vikash-bank-recruitment-2026": "https://agvb.bank.in",
  "irctc-catering-recruitment-2026": "https://www.irctc.co.in",
  "sebi-recruitment-2026": "https://www.sebi.gov.in",
  "dibrugarh-university-recruitment-2026": "https://dibru.ac.in",
  "nhai-recruitment-2026": "https://nhai.gov.in",
  "assam-government-secretariat-recruitment-2026": "https://sebaonline.org",
  "air-india-ground-staff-recruitment-2026": "https://careers.airindia.com",
  "indian-coast-guard-recruitment-2026": "https://joinindiancoastguard.cdac.in",
  "sbi-clerk-recruitment-2025": "https://sbi.co.in/careers",
  "tocklai-tea-research-institute-recruitment-2025": "https://tocklai.org",
  "indian-air-force-recruitment-2025": "https://careerindianairforce.cdac.in",
  "aiims-recruitment-2025": "https://www.aiimsguwahati.ac.in/page/recruitapplication",
  "apsc-cce-recruitment-2025": "https://apsc.nic.in",
  "ibps-po-recruitment-2025": "https://www.ibps.in",
  "south-salmara-mankachar-recruitment-2025": "https://southsalmaramankachar.assam.gov.in",
  "kokrajhar-recruitment-2025": "https://kokrajhar.assam.gov.in",
  "assam-direct-recruitment-3-0-2025": "https://sebaonline.org",
  "ibps-so-recruitment-2025": "https://www.ibps.in",
  "forest-department-recruitment-2025": "https://forest.assam.gov.in",
  "sbi-cbo-recruitment-2025": "https://sbi.co.in/careers",
  "ssc-mts-recruitment-2025": "https://ssc.nic.in",
  "indian-coast-guard-recruitment-2025": "https://joinindiancoastguard.cdac.in",
  "sbi-po-recruitment-2025": "https://sbi.co.in/careers",
  "ssc-chsl-recruitment-2025": "https://ssc.nic.in",
  "btr-recruitment-2025": "https://bodoland.gov.in",
  "upsc-nda-recruitment-2025": "https://upsc.gov.in",
  "anganwadi-recruitment-2025": "https://directorateofwomenandchild.assam.gov.in",
  "ssc-cgl-recruitment-2025": "https://ssc.nic.in",
  "majuli-recruitment-2025": "https://majuli.assam.gov.in",
  "jorhat-recruitment-2025": "https://jorhat.assam.gov.in",
  "idbi-recruitment-2025": "https://www.idbibank.in",
  "indian-army-recruitment-2025": "https://joinindianarmy.nic.in",
  "assam-tet-recruitment-2026": "https://sebaonline.org",
  "rbi-assistant-recruitment-2026": "https://rbi.org.in",
  "indian-navy-agniveer-recruitment-2026": "https://www.joinindiannavy.gov.in/en",
  "bsf-constable-recruitment-2026": "https://bsf.nic.in",
  "ssc-gd-recruitment-2026": "https://ssc.nic.in",
  "nabard-recruitment-2026": "https://www.nabard.org",
  "drdo-recruitment-2026": "https://www.drdo.gov.in",
  "uco-bank-recruitment-2026": "https://www.ucobank.com",
  "assam-health-recruitment-2026": "https://nhm.assam.gov.in/portlets/recruitment",
  "bpcl-recruitment-2026": "http://bharatpetroleum.in/careers/job-openings",
  "gic-recruitment-2026": "https://www.gicre.in",
  "ssa-assam-teacher-recruitment-2026": "https://ssa.assam.gov.in",
  "cotton-university-recruitment-2026": "https://cottonuniversity.ac.in",
  "rrb-isolated-categories-recruitment-2026": "https://www.rrbapply.gov.in",
  "assam-gt-pgt-tet-recruitment-2026": "https://sebaonline.org",
  "adre-2026-recruitment": "https://sebaonline.org",
  "nagaon-recruitment-2025": "https://nagaon.assam.gov.in/document/advertisements",
  "rrb-ntpc-recruitment-2025": "https://www.rrbapply.gov.in",
  "sbi-cbo-recruitment-2026": "https://sbi.co.in/careers",
  "assam-pwd-recruitment-2026": "https://pwd.assam.gov.in",
  "cwc-recruitment-2026": "https://cewacor.nic.in",
  "ssc-stenographer-recruitment-2026": "https://ssc.nic.in",
  "guwahati-municipal-corporation-recruitment-2026": "http://gmc.assam.gov.in/",
  "rrb-alp-recruitment-2026": "https://www.rrbapply.gov.in",
};

export function getCategoryMeta(slug) {
  const s = (slug || "").toLowerCase();
  const normalized = s.endsWith("s") && s !== "results" ? s.slice(0, -1) : s;
  return (
    CATEGORY_META[s] ||
    CATEGORY_META[normalized] || {
      title: (s.charAt(0).toUpperCase() + s.slice(1)) || "Category",
      description: `Stay updated on the latest notifications, application forms, and updates for ${s}.`,
      fallbacks: [],
    }
  );
}

export const ADMISSION_POSTS_PER_PAGE = 12;

// Single source of truth for admission posts. Pagination divides this array
// automatically: page 1 → 1-12, page 2 → 13-24, page 3 → 25-36 and so on.
export const admissionPosts = [
  // ────────────── Page 1 (items 1–12) ──────────────
  {
    _id: "adm-1",
    slug: "assam-anm-admission-2026",
    title: "Assam ANM Admission 2026 – Apply Online, Eligibility and Exam Date",
    org: "DHSFW Assam",
    badge: "ANM Training Course",
    category: "Nursing Admission",
    status: "Admission Update",
    date: "17 September 2026",
    createdAt: "2026-09-17T10:00:00.000Z",
    officialSite: "https://dme.assam.gov.in",
    tagColor: "indigo",
  },
  {
    _id: "adm-2",
    slug: "iocl-gnm-nursing-admission-2026",
    title: "IOCL Admission 2026 – Apply Online for GNM Nursing Course",
    org: "Indian Oil Corporation",
    badge: "GNM Nursing 2026",
    category: "Nursing Admission",
    status: "Admission Update",
    date: "12 August 2026",
    createdAt: "2026-08-12T10:00:00.000Z",
    officialSite: "https://www.iocl.com",
    tagColor: "teal",
  },
  {
    _id: "adm-3",
    slug: "assam-navodaya-admission-2027",
    title: "Assam Navodaya Admission 2027 – Apply for JNVST Class VI",
    org: "Navodaya Vidyalaya Samiti",
    badge: "JNVST Class VI",
    category: "School Admission",
    status: "Application Update",
    date: "13 August 2026",
    createdAt: "2026-08-13T10:00:00.000Z",
    officialSite: "https://navodaya.gov.in",
    tagColor: "blue",
  },
  {
    _id: "adm-4",
    slug: "gu-bed-merit-list-2026",
    title: "GU B.Ed Merit List 2026 – GUBEDCET Rank List & Cut-off Marks",
    org: "Gauhati University",
    badge: "GUBEDCET Merit List",
    category: "B.Ed Admission",
    status: "Merit List Out",
    date: "2 August 2026",
    createdAt: "2026-08-02T10:00:00.000Z",
    officialSite: "https://gauhati.ac.in",
    tagColor: "indigo",
  },
  {
    _id: "adm-5",
    slug: "bu-bed-admission-2026",
    title: "BU B.Ed Admission 2026 – Apply for Bodoland University B.Ed Admission",
    org: "Bodoland University",
    badge: "B.Ed CET 2026",
    category: "B.Ed Admission",
    status: "Admission Update",
    date: "28 July 2026",
    createdAt: "2026-07-28T10:00:00.000Z",
    officialSite: "https://bodolanduniversity.ac.in",
    tagColor: "emerald",
  },
  {
    _id: "adm-6",
    slug: "assam-gnm-training-admission-2026",
    title: "Assam GNM Admission 2026 – Apply for GNM Training Course",
    org: "Directorate of Medical Education",
    badge: "GNM Admission 2026",
    category: "Nursing Admission",
    status: "Application Update",
    date: "20 July 2026",
    createdAt: "2026-07-20T10:00:00.000Z",
    officialSite: "https://dme.assam.gov.in",
    tagColor: "teal",
  },
  {
    _id: "adm-7",
    slug: "gauhati-university-pg-admission-2026",
    title: "Gauhati University PG Admission 2026 – Merit List & Counseling",
    org: "Gauhati University",
    badge: "PG Admission 2026",
    category: "University Admission",
    status: "Merit List Out",
    date: "15 July 2026",
    createdAt: "2026-07-15T10:00:00.000Z",
    officialSite: "https://gauhati.ac.in",
    tagColor: "blue",
  },
  {
    _id: "adm-8",
    slug: "assam-iti-admission-2026",
    title: "Assam ITI Admission 2026 – Online Counseling & Seat Allocation",
    org: "Skill Employment & Entrepreneurship",
    badge: "ITI Counseling 2026",
    category: "Polytechnic / ITI Admission",
    status: "Counseling Update",
    date: "10 July 2026",
    createdAt: "2026-07-10T10:00:00.000Z",
    officialSite: "https://assam.gov.in",
    tagColor: "sky",
  },
  {
    _id: "adm-9",
    slug: "aau-admission-2026",
    title: "Assam Agricultural University Admission 2026 – UG & PG Degree Courses",
    org: "AAU Jorhat",
    badge: "AAU Admission 2026",
    category: "University Admission",
    status: "Admission Update",
    date: "5 July 2026",
    createdAt: "2026-07-05T10:00:00.000Z",
    officialSite: "https://aau.ac.in",
    tagColor: "emerald",
  },
  {
    _id: "adm-10",
    slug: "cotton-university-admission-2026",
    title: "Cotton University Admission 2026 – UG Programmes Online Application",
    org: "Cotton University",
    badge: "UG Admission 2026",
    category: "University Admission",
    status: "Application Update",
    date: "22 June 2026",
    createdAt: "2026-06-22T10:00:00.000Z",
    officialSite: "https://cottonuniversity.ac.in",
    tagColor: "amber",
  },
  {
    _id: "adm-11",
    slug: "tezpur-university-pg-admission-2026",
    title: "Tezpur University PG Admission 2026 – Online Application",
    org: "Tezpur University",
    badge: "PG Admission 2026",
    category: "University Admission",
    status: "Application Update",
    date: "18 June 2026",
    createdAt: "2026-06-18T10:00:00.000Z",
    officialSite: "https://tezu.ernet.in",
    tagColor: "indigo",
  },
  {
    _id: "adm-12",
    slug: "astu-btech-admission-2026",
    title: "Assam Science & Technology University B.Tech Admission 2026 – Apply Online",
    org: "ASTU",
    badge: "B.Tech Admission 2026",
    category: "Engineering Admission",
    status: "Application Update",
    date: "15 June 2026",
    createdAt: "2026-06-15T10:00:00.000Z",
    officialSite: "https://astu.ac.in",
    tagColor: "blue",
  },

  // ────────────── Page 2 (items 13–24) ──────────────
  {
    _id: "adm-13",
    slug: "assam-gnm-admission-2026",
    title: "Assam GNM Admission 2026 – GNM Entrance Exam & Eligibility",
    org: "SSUHS / Assam",
    badge: "GNMEE 2026",
    category: "Admission",
    status: "Admission Update",
    date: "14 June 2026",
    createdAt: "2026-06-14T10:00:00.000Z",
    officialSite: "https://ssuhs.in",
    tagColor: "teal",
  },
  {
    _id: "adm-14",
    slug: "dibrugarh-university-pg-admission-2026",
    title: "Dibrugarh University PG Admission 2026 – Apply Online",
    org: "Dibrugarh University",
    badge: "PG Admission 2026",
    category: "University Admission",
    status: "Admission Update",
    date: "19 May 2026",
    createdAt: "2026-05-19T10:00:00.000Z",
    officialSite: "https://dibru.ac.in",
    tagColor: "indigo",
  },
  {
    _id: "adm-15",
    slug: "assam-college-admission-2026",
    title: "Assam College Admission 2026 – SAMARTH Portal Online Application",
    org: "Government of Assam",
    badge: "SAMARTH Portal",
    category: "College Admission",
    status: "Application Update",
    date: "26 July 2026",
    createdAt: "2026-07-26T10:00:00.000Z",
    officialSite: "https://samarth.assam.gov.in",
    tagColor: "emerald",
  },
  {
    _id: "adm-16",
    slug: "ugc-net-june-2026",
    title: "UGC NET June 2026 Notification – Apply Online for 85 Subjects",
    org: "NTA / UGC",
    badge: "UGC NET 2026",
    category: "Entrance Exam",
    status: "Application Update",
    date: "11 May 2026",
    createdAt: "2026-05-11T10:00:00.000Z",
    officialSite: "https://ugcnet.nta.ac.in",
    tagColor: "indigo",
  },
  {
    _id: "adm-17",
    slug: "ssuhs-bsc-nursing-admission-2026",
    title: "SSUHS BSc Nursing Admission 2026 – Entrance Exam & Apply Online",
    org: "SSUHS",
    badge: "CEE 2026",
    category: "Nursing Admission",
    status: "Admission Update",
    date: "4 June 2026",
    createdAt: "2026-06-04T10:00:00.000Z",
    officialSite: "https://ssuhs.in",
    tagColor: "emerald",
  },
  {
    _id: "adm-18",
    slug: "ssuhs-dpharm-bpharm-admission-2026",
    title: "SSUHS DPharm and BPharm Admission 2026 – Online Application",
    org: "SSUHS",
    badge: "D/B Pharm 2026",
    category: "Medical Admission",
    status: "Admission Update",
    date: "4 June 2026",
    createdAt: "2026-06-04T11:00:00.000Z",
    officialSite: "https://ssuhs.in",
    tagColor: "teal",
  },
  {
    _id: "adm-19",
    slug: "assam-polytechnic-admission-2026",
    title: "Assam Polytechnic Admission 2026 – Apply Online for 4385 Seats",
    org: "Directorate of Technical Education Assam",
    badge: "Polytechnic 2026",
    category: "Polytechnic Admission",
    status: "Application Update",
    date: "2 August 2026",
    createdAt: "2026-08-02T11:00:00.000Z",
    officialSite: "https://technician.assam.gov.in",
    tagColor: "blue",
  },
  {
    _id: "adm-20",
    slug: "assam-cee-exam-2026",
    title: "Assam CEE Exam 2026 – Apply Online for B.Tech Admissions",
    org: "ASTU",
    badge: "ASSAM CEE 2026",
    category: "Engineering Admission",
    status: "Entrance Exam",
    date: "4 April 2026",
    createdAt: "2026-04-04T10:00:00.000Z",
    officialSite: "https://cee.astu.ac.in",
    tagColor: "sky",
  },
  {
    _id: "adm-21",
    slug: "tezpur-university-bed-admission-2026",
    title: "Tezpur University B.Ed Admission 2026 – Apply for Entrance Exam",
    org: "Tezpur University",
    badge: "B.Ed 2026",
    category: "B.Ed Admission",
    status: "Admission Update",
    date: "16 April 2026",
    createdAt: "2026-04-16T10:00:00.000Z",
    officialSite: "https://tezu.ernet.in",
    tagColor: "emerald",
  },
  {
    _id: "adm-22",
    slug: "navodaya-result-2026",
    title: "Navodaya Result 2026 – JNVST Class 6 Selection List Declared",
    org: "Jawahar Navodaya Vidyalaya",
    badge: "JNVST Class 6",
    category: "School Admission",
    status: "Result / Selection List",
    date: "17 March 2026",
    createdAt: "2026-03-17T10:00:00.000Z",
    officialSite: "https://navodaya.gov.in",
    tagColor: "amber",
  },
  {
    _id: "adm-23",
    slug: "cuet-ug-2026",
    title: "CUET UG 2026 – Apply Online, Exam Dates & Admission Details",
    org: "NTA",
    badge: "CUET UG 2026",
    category: "University Entrance",
    status: "Entrance Exam",
    date: "30 January 2026",
    createdAt: "2026-01-30T10:00:00.000Z",
    officialSite: "https://exams.nta.ac.in/CUET-UG",
    tagColor: "indigo",
  },
  {
    _id: "adm-24",
    slug: "sainik-school-admission-2026",
    title: "Sainik School Admission 2026 – Apply Online for AISSEE Entrance Exam",
    org: "National Testing Agency",
    badge: "AISSEE 2026",
    category: "School Admission",
    status: "Admission Update",
    date: "11 May 2026",
    createdAt: "2026-05-11T11:00:00.000Z",
    officialSite: "https://aissee.nta.nic.in",
    tagColor: "emerald",
  },

  // ────────────── Page 3 (items 25–36) ──────────────
  {
    _id: "adm-25",
    slug: "nehu-admission-2026",
    title: "NEHU Admission 2026 – UG & PG Programmes Apply Online",
    org: "NEHU Shillong",
    badge: "UG/PG 2026",
    category: "University Admission",
    status: "Application Update",
    date: "10 June 2026",
    createdAt: "2026-06-10T10:00:00.000Z",
    officialSite: "https://www.nehu.ac.in",
    tagColor: "indigo",
  },
  {
    _id: "adm-26",
    slug: "iit-guwahati-admission-2026",
    title: "IIT Guwahati Admission 2026 – JoSAA Counselling & Seat Allotment",
    org: "IIT Guwahati",
    badge: "JoSAA 2026",
    category: "Engineering Admission",
    status: "Counselling Update",
    date: "3 June 2026",
    createdAt: "2026-06-03T10:00:00.000Z",
    officialSite: "https://www.iitg.ac.in",
    tagColor: "blue",
  },
  {
    _id: "adm-27",
    slug: "nit-silchar-admission-2026",
    title: "NIT Silchar Admission 2026 – JEE Main Based Seat Allotment",
    org: "NIT Silchar",
    badge: "NIT 2026",
    category: "Engineering Admission",
    status: "Seat Allotment",
    date: "28 May 2026",
    createdAt: "2026-05-28T10:00:00.000Z",
    officialSite: "https://www.nits.ac.in",
    tagColor: "sky",
  },
  {
    _id: "adm-28",
    slug: "assam-deled-admission-2026",
    title: "Assam D.El.Ed Admission 2026 – Second Counseling Allotment List",
    org: "SCERT Assam",
    badge: "D.El.Ed 2026",
    category: "Teacher Training Admission",
    status: "Allotment List",
    date: "20 May 2026",
    createdAt: "2026-05-20T10:00:00.000Z",
    officialSite: "https://assam.gov.in",
    tagColor: "emerald",
  },
  {
    _id: "adm-29",
    slug: "dibrugarh-university-llm-admission-2026",
    title: "Dibrugarh University LLM Admission 2026 – Online Application",
    org: "Dibrugarh University",
    badge: "LLM 2026",
    category: "University Admission",
    status: "Application Update",
    date: "15 May 2026",
    createdAt: "2026-05-15T10:00:00.000Z",
    officialSite: "https://dibru.ac.in",
    tagColor: "indigo",
  },
  {
    _id: "adm-30",
    slug: "assam-polytechnic-lateral-entry-2026",
    title: "Assam Polytechnic Lateral Entry Admission 2026 – Diploma 2nd Year",
    org: "Directorate of Technical Education Assam",
    badge: "Lateral Entry 2026",
    category: "Polytechnic Admission",
    status: "Application Update",
    date: "9 May 2026",
    createdAt: "2026-05-09T10:00:00.000Z",
    officialSite: "https://technician.assam.gov.in",
    tagColor: "teal",
  },
  {
    _id: "adm-31",
    slug: "gauhati-university-pg-diploma-admission-2026",
    title: "Gauhati University PG Diploma Admission 2026 – Online Application",
    org: "Gauhati University",
    badge: "PG Diploma 2026",
    category: "University Admission",
    status: "Application Update",
    date: "28 April 2026",
    createdAt: "2026-04-28T10:00:00.000Z",
    officialSite: "https://gauhati.ac.in",
    tagColor: "blue",
  },
  {
    _id: "adm-32",
    slug: "assam-nursing-college-admission-2026",
    title: "Assam Nursing College Admission 2026 – B.Sc Nursing & Post Basic",
    org: "Directorate of Medical Education Assam",
    badge: "Nursing 2026",
    category: "Nursing Admission",
    status: "Admission Update",
    date: "22 April 2026",
    createdAt: "2026-04-22T10:00:00.000Z",
    officialSite: "https://dme.assam.gov.in",
    tagColor: "emerald",
  },
  {
    _id: "adm-33",
    slug: "navodaya-class-9-admission-2026",
    title: "Navodaya Vidyalaya Class IX Admission 2026 – BVS / Lateral Entry",
    org: "Navodaya Vidyalaya Samiti",
    badge: "JNV Class IX",
    category: "School Admission",
    status: "Application Update",
    date: "14 April 2026",
    createdAt: "2026-04-14T10:00:00.000Z",
    officialSite: "https://navodaya.gov.in",
    tagColor: "sky",
  },
  {
    _id: "adm-34",
    slug: "gmch-bsc-nursing-admission-2026",
    title: "GMCH Assam BSc Nursing Admission 2026 – Online Application",
    org: "Gauhati Medical College & Hospital",
    badge: "GMCH BSc Nursing",
    category: "Nursing Admission",
    status: "Admission Update",
    date: "8 April 2026",
    createdAt: "2026-04-08T10:00:00.000Z",
    officialSite: "https://gmchassam.org",
    tagColor: "teal",
  },
  {
    _id: "adm-35",
    slug: "kendriya-vidyalaya-admission-2026",
    title: "Kendriya Vidyalaya Admission 2026 – Class I Online Registration",
    org: "Kendriya Vidyalaya Sangathan",
    badge: "KV 2026",
    category: "School Admission",
    status: "Application Update",
    date: "1 April 2026",
    createdAt: "2026-04-01T10:00:00.000Z",
    officialSite: "https://kvsangathan.nic.in",
    tagColor: "indigo",
  },
  {
    _id: "adm-36",
    slug: "gauhati-university-mba-admission-2026",
    title: "Gauhati University MBA Admission 2026 – CMAT Based",
    org: "Gauhati University",
    badge: "MBA Admission 2026",
    category: "Management Admission",
    status: "Admission Update",
    date: "28 March 2026",
    createdAt: "2026-03-28T10:00:00.000Z",
    officialSite: "https://gauhati.ac.in",
    tagColor: "amber",
  },
];

// ─────────────────────────────────────────────────────────────
// Admission SEO slugs
//
// Public slugs are short and clean (matching the reference URL
// structure) even though internal records carry a year suffix.
// e.g. record slug "assam-anm-admission-2026" is served publicly
// at "/admission/assam-anm-admission/". Old year-suffixed URLs keep
// working because record resolution accepts both forms.
// ─────────────────────────────────────────────────────────────
const ADMISSION_SLUG_CANONICAL_MAP = {
  "assam-cee-exam-2026": "assam-cee-admission",
};

// Public URLs that differ from the default "/admission/<slug>" pattern.
// e.g. the ANM flagship article lives at the top level "/assam-anm-admission/".
const ADMISSION_URL_MAP = {
  "assam-anm-admission": "/assam-anm-admission",
};

export function admissionPublicUrl(slug) {
  const canonical = canonicalAdmissionSlug(slug);
  return ADMISSION_URL_MAP[canonical] || `/admission/${canonical}`;
}

export function canonicalAdmissionSlug(slug) {
  if (!slug) return slug;
  if (ADMISSION_SLUG_CANONICAL_MAP[slug]) {
    return ADMISSION_SLUG_CANONICAL_MAP[slug];
  }
  return slug.replace(/-\d{4}$/, "");
}

function resolveAdmissionRecord(slug) {
  if (!slug) return null;
  return (
    admissionPosts.find((p) => p.slug === slug) ||
    admissionPosts.find((p) => canonicalAdmissionSlug(p.slug) === slug) ||
    null
  );
}

function isPublishedAdmission(post) {
  return Boolean(post) && post.active !== false;
}

export function getAdmissionPosts() {
  return admissionPosts.filter(isPublishedAdmission).map(enrichAdmission);
}

export function getAdmissionPost(slug) {
  const post = resolveAdmissionRecord(slug);
  return isPublishedAdmission(post) ? enrichAdmission(post) : null;
}

// ─────────────────────────────────────────────────────────────
// Admission detail content enrichment
//
// `admissionPosts` above is the lean source of truth used by the
// category listing. The detail system enriches each record with the
// full article fields (important dates, eligibility, fees, documents,
// steps, article blocks, links). Flagship records carry curated
// sample content through ADMISSION_DETAIL_OVERRIDES; every other
// record gets a clean, non-wrong fallback generated from its own
// fields (title/org/category) so the pages never show blank sections.
// ─────────────────────────────────────────────────────────────
const ADMISSION_DETAIL_OVERRIDES = {
  "assam-anm-admission-2026": {
    shortDescription:
      "Assam ANM Admission 2026 application process, eligibility criteria, important dates, application fee and how to apply for the two-year Auxiliary Nurse Midwifery (ANM) training course under DHSFW Assam.",
    courseName: "ANM (Auxiliary Nurse Midwifery)",
    admissionYear: "2026-2027",
    applicationStartDate: "2026-09-17",
    applicationLastDate: "2026-10-20",
    examDate: null,
    meritListDate: "2026-11-15",
    counsellingDate: "2026-11-28",
    eligibility: [
      "Citizenship: Candidate must be a citizen of India and ordinarily resident of Assam.",
      "Educational Qualification: Pass HSLC / Madhyamik or equivalent examination from a recognised board.",
      "Minimum Marks: Minimum qualifying percentage as published in the official notification of DHSFW Assam.",
      "Age Limit: 17 to 24 years as on 1st January 2026, with relaxation for reserved categories as per rules.",
      "Residence: Must satisfy the domicile requirements prescribed by the Government of Assam.",
    ],
    ageLimit: "17 to 24 years (relaxation as per Govt. of Assam rules)",
    applicationFee: [
      { category: "General / EWS", amount: "₹700" },
      { category: "OBC / MOBC", amount: "₹500" },
      { category: "SC / ST(P) / ST(H)", amount: "₹300" },
    ],
    selectionProcess: [
      "Online application screening and shortlisting",
      "Publication of merit list / rank list based on qualifying marks",
      "Counselling and seat allotment",
      "Document verification at the allotted institute",
    ],
    requiredDocuments: [
      "Passport-size photograph and scanned signature",
      "HSLC / Madhyamik mark sheet and pass certificate",
      "Residence / domicile certificate of Assam",
      "Caste certificate (if applicable)",
      "Age proof (Birth certificate / school leaving certificate)",
      "Aadhaar card",
    ],
    howToApply: [
      "Visit the official website of DHSFW Assam (dme.assam.gov.in).",
      "Open the ANM Training Admission 2026 link on the admission portal.",
      "Register with a valid mobile number and email address.",
      "Fill in all personal, educational and residence details carefully.",
      "Upload the required documents in the specified format.",
      "Pay the application fee online and submit the application form.",
      "Download and print the submitted application form for future reference.",
    ],
    officialNotificationUrl: null,
    applicationUrl: null,
    prospectusUrl: null,
    importantLinks: [
      { label: "Application Form", url: "https://dme.assam.gov.in" },
      { label: "ANM Entrance Guide", url: "https://dme.assam.gov.in" },
      { label: "Apply Guide (Video)", url: "https://dme.assam.gov.in" },
      { label: "Official Notification", url: "https://dme.assam.gov.in" },
      { label: "WhatsApp Channel", url: "https://dme.assam.gov.in" },
      { label: "Install Android App", url: "https://dme.assam.gov.in" },
      { label: "Official Website", url: "https://dme.assam.gov.in" },
    ],
    content: [
      { type: "heading", text: "Assam ANM Admission 2026 Overview" },
      {
        type: "paragraph",
        text: "DHSFW Assam invites applications for admission into the two-year ANM (Auxiliary Nurse Midwifery) training course for the 2026-2027 academic session. The course is offered through government and private nursing training institutes across Assam.",
      },
      {
        type: "paragraph",
        text: "Candidates who have passed HSLC / Madhyamik or an equivalent examination and fulfil the eligibility criteria published in the official notification can apply online before the last date.",
      },
      { type: "heading", text: "How Selection is Done" },
      {
        type: "list",
        ordered: true,
        items: [
          "Application forms are screened for completeness and eligibility.",
          "Merit list is prepared on the basis of qualifying examination marks.",
          "Shortlisted candidates are called for counselling and document verification.",
          "Seat is allotted and admission is confirmed after fee payment at the institute.",
        ],
      },
      {
        type: "note",
        text: "Candidates are advised to keep checking the official website of DHSFW Assam for the merit list, counselling schedule and institute-wise seat allotment.",
      },
      { type: "heading", text: "Things to Remember" },
      {
        type: "list",
        ordered: false,
        items: [
          "Apply only through the official admission portal.",
          "Keep the application ID and password safe for future reference.",
          "Carry original documents during counselling and verification.",
          "Do not pay any amount to agents for admission.",
        ],
      },
    ],
  },
  "assam-polytechnic-admission-2026": {
    shortDescription:
      "Assam Polytechnic Admission 2026 details for diploma engineering courses under DTE Assam — eligibility, important dates, application fee, selection process and how to apply online.",
    courseName: "Diploma in Engineering (Polytechnic)",
    admissionYear: "2026-2027",
    applicationStartDate: "2026-07-05",
    applicationLastDate: "2026-09-30",
    examDate: null,
    meritListDate: "2026-10-25",
    counsellingDate: "2026-11-10",
    eligibility: [
      "Citizenship: Candidate must be an Indian citizen and resident of Assam.",
      "Educational Qualification: Pass HSLC / Madhyamik or equivalent examination.",
      "Minimum Marks: At least 50% marks in aggregate (relaxation as per norms).",
      "Academic Session: HSLC passed in the current or previous academic year as per notification.",
    ],
    ageLimit: "As per the norms of DTE Assam",
    applicationFee: [
      { category: "General", amount: "₹450" },
      { category: "OBC / MOBC", amount: "₹350" },
      { category: "SC / ST(P) / ST(H)", amount: "₹250" },
    ],
    selectionProcess: [
      "Application is followed by preparation of a merit list based on qualifying marks",
      "Reservation-wise counselling for seat allotment",
      "Admission confirmation with document verification",
    ],
    requiredDocuments: [
      "HSLC / Madhyamik mark sheet and pass certificate",
      "Domicile / residence certificate of Assam",
      "Category certificate (if applicable)",
      "Passport-size photograph and scanned signature",
      "Aadhaar card",
    ],
    howToApply: [
      "Go to the admission portal of DTE Assam for polytechnic admission.",
      "Register with a valid mobile number and email id.",
      "Fill the online application form with correct details.",
      "Upload the required scanned documents.",
      "Pay the application fee and submit the form.",
      "Save and print the acknowledgement slip.",
    ],
    officialNotificationUrl: null,
    applicationUrl: null,
    prospectusUrl: null,
    content: [
      { type: "heading", text: "Assam Polytechnic Admission 2026 Overview" },
      {
        type: "paragraph",
        text: "The Directorate of Technical Education (DTE) Assam conducts admission into diploma engineering (polytechnic) courses for the 2026-2027 session through government and private polytechnic institutes of the state.",
      },
      {
        type: "paragraph",
        text: "Admission is offered in trades such as Civil, Mechanical, Electrical, Computer Science and allied engineering disciplines on the basis of HSLC / Madhyamik marks.",
      },
      { type: "heading", text: "Course Details" },
      {
        type: "list",
        ordered: false,
        items: [
          "Course Duration: 3 years (Diploma in Engineering)",
          "Mode of Selection: Merit based on qualifying examination marks",
          "Conducting Body: DTE Assam",
          "Application Mode: Online only",
        ],
      },
      {
        type: "note",
        text: "The counselling schedule and institute allotment will be published on the official admission portal. Candidates must bring all original certificates during counselling.",
      },
    ],
  },
  "assam-cee-exam-2026": {
    shortDescription:
      "Assam CEE 2026 details for admission into B.Tech / engineering courses across state engineering colleges — eligibility, important dates, exam pattern, application fee and how to apply.",
    courseName: "B.Tech / Engineering (CEE)",
    admissionYear: "2026-2027",
    applicationStartDate: "2026-05-01",
    applicationLastDate: "2026-06-30",
    examDate: "2026-07-19",
    meritListDate: null,
    counsellingDate: "2026-08-05",
    eligibility: [
      "Citizenship: Candidate must be a citizen of India.",
      "Educational Qualification: Pass HSSLC (Science) or equivalent with Physics, Chemistry and Mathematics.",
      "Minimum Marks: At least 55% marks in aggregate in the qualifying examination (relaxation for reserved categories).",
      "Appearing candidates of the current year are also eligible.",
    ],
    ageLimit: "No upper age limit as per the prevailing CEE rules",
    applicationFee: [
      { category: "General / EWS", amount: "₹850" },
      { category: "OBC / MOBC", amount: "₹650" },
      { category: "SC / ST(P) / ST(H)", amount: "₹350" },
    ],
    selectionProcess: [
      "Appear in the Assam CEE entrance examination",
      "Merit list prepared from CEE rank and qualifying marks",
      "Counselling for choice filling and seat allotment",
      "Document verification at the allotted college",
    ],
    requiredDocuments: [
      "HSSLC (Science) mark sheet and pass certificate",
      "CEE admit card and rank card",
      "Residence / domicile certificate of Assam",
      "Category certificate (if applicable)",
      "Passport-size photographs and scanned signature",
      "Aadhaar card",
    ],
    howToApply: [
      "Visit the official CEE application portal for Assam.",
      "Register with a valid mobile number and email id.",
      "Fill in academic and personal details correctly.",
      "Choose the examination centre and upload scanned documents.",
      "Pay the application fee online and submit.",
      "Download the confirmation page and print the admit card when released.",
    ],
    officialNotificationUrl: null,
    applicationUrl: null,
    prospectusUrl: null,
    content: [
      { type: "heading", text: "Assam CEE 2026 Overview" },
      {
        type: "paragraph",
        text: "Assam CEE (Combined Entrance Examination) is the state-level entrance test used for admission into B.Tech and other engineering programmes offered by government and private engineering colleges of Assam.",
      },
      {
        type: "paragraph",
        text: "The examination is conducted on the basis of the HSSLC (Science) syllabus and aspirants are ranked for seat allotment through counselling.",
      },
      { type: "heading", text: "Examination Pattern" },
      {
        type: "list",
        ordered: false,
        items: [
          "Subjects: Physics, Chemistry and Mathematics",
          "Mode of Examination: Offline (OMR based)",
          "Duration: 3 hours",
          "Marking: As per the official CEE notification",
        ],
      },
      {
        type: "note",
        text: "Keep checking the official entrance admission portal for updates on the admit card, answer key, rank list and counselling schedule.",
      },
    ],
  },
  "assam-gnm-admission-2026": {
    shortDescription:
      "Assam GNM Admission 2026 application details for the General Nursing and Midwifery diploma course — eligibility, important dates, application fee, selection process and how to apply.",
    courseName: "GNM (General Nursing and Midwifery)",
    admissionYear: "2026-2027",
    applicationStartDate: "2026-08-01",
    applicationLastDate: "2026-09-15",
    examDate: null,
    meritListDate: null,
    counsellingDate: "2026-10-05",
    eligibility: [
      "Educational Qualification: Pass HSLC / Madhyamik or equivalent examination from a recognised board.",
      "Minimum Marks: As published in the official notification.",
      "Age Limit: 17 to 28 years (relaxation for reserved categories).",
      "Residence: Must be ordinarily resident of Assam with valid residential proof.",
    ],
    ageLimit: "17 to 28 years",
    applicationFee: [
      { category: "General", amount: "₹450" },
      { category: "OBC", amount: "₹350" },
      { category: "SC / ST(P) / ST(H)", amount: "₹250" },
    ],
    selectionProcess: [
      "Screening of online applications",
      "Merit list based on qualifying marks",
      "Counselling and seat allotment",
      "Document verification",
    ],
    requiredDocuments: [
      "HSLC / Madhyamik mark sheet and certificate",
      "Residence certificate of Assam",
      "Caste certificate (if applicable)",
      "Passport-size photograph and signature",
      "Aadhaar card",
    ],
    howToApply: [
      "Open the official nursing admission portal.",
      "Register with a valid mobile number.",
      "Complete the online application form.",
      "Upload scanned documents and photo.",
      "Pay the application fee and submit.",
      "Print the acknowledgement copy for reference.",
    ],
    officialNotificationUrl: null,
    applicationUrl: null,
    prospectusUrl: null,
    content: [
      { type: "heading", text: "Assam GNM Admission 2026 Overview" },
      {
        type: "paragraph",
        text: "Applications are invited for admission into the three-year General Nursing and Midwifery (GNM) diploma course for the 2026-2027 session through the official nursing admission portal of Assam.",
      },
      {
        type: "paragraph",
        text: "Admission is made through merit on the basis of the qualifying examination, followed by counselling for seat allotment in government and private nursing institutes.",
      },
      { type: "heading", text: "Documents to Keep Ready" },
      {
        type: "list",
        ordered: false,
        items: [
          "Mark sheets and certificates of all qualifying examinations",
          "Residence and caste certificates",
          "Recent passport-size photographs",
          "Valid Aadhaar card and mobile number",
        ],
      },
      {
        type: "note",
        text: "Candidates must verify their details before final submission as mistakes may lead to rejection of the application.",
      },
    ],
  },
  "assam-navodaya-admission-2027": {
    shortDescription:
      "Navodaya Vidyalaya Admission 2027 (JNVST Class VI) application details for Assam — eligibility, important dates, exam date, application fee and selection process.",
    courseName: "JNVST Class VI",
    admissionYear: "2027",
    applicationStartDate: "2026-09-01",
    applicationLastDate: "2026-12-15",
    examDate: "2027-01-17",
    meritListDate: null,
    counsellingDate: null,
    eligibility: [
      "Candidates should be studying in Class V in a Government / Government-aided school or a recognised school located in a rural area (as per JNVST norms).",
      "Age Limit: 9 to 13 years on a fixed reference date as per the notification.",
      "The child should be a resident of the district for which admission is being sought.",
    ],
    ageLimit: "9 to 13 years",
    selectionProcess: [
      "JNVST Class VI entrance examination (two sections)",
      "Publication of district-wise selected and wait-list candidates",
    ],
    requiredDocuments: [
      "Birth certificate issued by the competent authority",
      "Certificate of residence / domicile",
      "Certificate from the school of current study",
      "Passport-size photograph",
      "Category certificate (if applicable)",
    ],
    howToApply: [
      "Visit the official Navodaya Vidyalaya Samiti website.",
      "Open the JNVST Class VI admission registration link.",
      "Fill the registration form with the required details.",
      "Submit the form online during the registration window.",
      "Download and print the certificate of registration for future use.",
    ],
    officialNotificationUrl: null,
    applicationUrl: null,
    prospectusUrl: null,
    content: [
      { type: "heading", text: "Navodaya Admission 2027 Overview" },
      {
        type: "paragraph",
        text: "Navodaya Vidyalaya Samiti invites applications from eligible children for admission into Class VI through the Jawahar Navodaya Vidyalaya Selection Test (JNVST) for the 2027-28 academic session.",
      },
      {
        type: "paragraph",
        text: "The entrance test is conducted across the country on a single day and selection is made district wise in accordance with the reservation rules.",
      },
      { type: "heading", text: "Selection Test Details" },
      {
        type: "list",
        ordered: true,
        items: [
          "Mental Ability Test (75 questions)",
          "Arithmetic Test (25 questions)",
          "Language Test (25 questions)",
        ],
      },
      {
        type: "note",
        text: "The answer key, selected list and wait list are published on the official NVS website after the examination.",
      },
    ],
  },
  "dibrugarh-university-pg-admission-2026": {
    shortDescription:
      "Dibrugarh University PG Admission 2026 details for postgraduate courses — eligibility, important dates, application fee, selection process and how to apply online.",
    courseName: "Postgraduate (PG) Courses",
    admissionYear: "2026-2027",
    applicationStartDate: "2026-06-01",
    applicationLastDate: "2026-08-10",
    examDate: null,
    meritListDate: null,
    counsellingDate: null,
    eligibility: [
      "Candidates must hold a bachelor's degree in the relevant discipline from a recognised university.",
      "Minimum qualifying percentage as prescribed for the course in the official notification.",
      "Category-wise relaxation as per university norms.",
    ],
    selectionProcess: [
      "Admission based on the merit of the qualifying examination",
      "Entrance examination for select programmes, if applicable",
      "Counselling for seat allotment and document verification",
    ],
    requiredDocuments: [
      "All educational certificates and mark sheets (Class X onwards)",
      "Degree / provisional certificate of the qualifying examination",
      "Residence and category certificates",
      "Passport-size photographs",
      "Aadhaar card",
    ],
    howToApply: [
      "Visit the Dibrugarh University admission portal.",
      "Register with a valid email / mobile number.",
      "Fill the course-wise application form.",
      "Upload the required documents.",
      "Pay the application fee online and submit.",
    ],
    officialNotificationUrl: null,
    applicationUrl: null,
    prospectusUrl: null,
    content: [
      { type: "heading", text: "Dibrugarh University PG Admission 2026 Overview" },
      {
        type: "paragraph",
        text: "Dibrugarh University invites online applications for admission into various postgraduate programmes for the 2026-2027 academic session through its official admission portal.",
      },
      {
        type: "paragraph",
        text: "Eligible candidates are selected on the basis of merit and, for select programmes, through an entrance examination conducted by the university.",
      },
      {
        type: "note",
        text: "Refer to the programme-wise prospectus on the university admission portal for seat matrix and fee structure.",
      },
    ],
  },
  "gauhati-university-mba-admission-2026": {
    shortDescription:
      "Gauhati University MBA Admission 2026 details — eligibility, important dates, selection process (CMAT / MAT scores), application fee and how to apply.",
    courseName: "MBA",
    admissionYear: "2026-2027",
    applicationStartDate: "2026-03-01",
    applicationLastDate: "2026-06-20",
    examDate: null,
    meritListDate: null,
    counsellingDate: null,
    eligibility: [
      "Bachelor's degree in any discipline from a recognised university with minimum marks as prescribed.",
      "Valid scores in CMAT / MAT / GMAT / CAT as accepted by the university.",
    ],
    selectionProcess: [
      "Screening on the basis of national entrance test scores",
      "Group discussion and personal interview",
      "Publication of merit list",
    ],
    requiredDocuments: [
      "Degree and mark sheets of the qualifying examination",
      "Entrance test score card",
      "Residence and category certificates",
      "Passport-size photograph and signature",
      "Aadhaar card",
    ],
    howToApply: [
      "Visit the official admission portal of Gauhati University.",
      "Register and complete the application form for the MBA programme.",
      "Upload the entrance test score and documents.",
      "Pay the application fee and submit the form.",
    ],
    officialNotificationUrl: null,
    applicationUrl: null,
    prospectusUrl: null,
    content: [
      { type: "heading", text: "Gauhati University MBA Admission 2026 Overview" },
      {
        type: "paragraph",
        text: "Gauhati University invites applications for admission into the MBA programme for the 2026-2027 session. Selection is based on national entrance test scores followed by group discussion and interview.",
      },
      {
        type: "note",
        text: "Candidates are advised to go through the department-specific admission criteria published on the official website.",
      },
    ],
  },
};

function defaultShortIntro(post) {
  const parts = [
    post.title,
    post.category &&
      `is a ${post.category} update announced by ${post.org}`,
    "Eligible candidates can go through the important information such as eligibility criteria, important dates, application fee and the step-by-step application process shared below before applying.",
  ].filter(Boolean);
  return parts.join(". ");
}

function defaultEligibility(post) {
  return [
    `Citizenship: Candidate must be a citizen of India / lawful resident of Assam as applicable.`,
    `Educational Qualification: Qualifying examination and minimum marks as published in the official notification of ${post.org}.`,
    `Age Limit: As per the norms and age relaxation rules of ${post.org}.`,
    `Residence: Domicile / residential requirements of Assam apply where applicable.`,
    `Other Requirements: Any course-specific condition mentioned in the official admission notification.`,
  ];
}

function defaultSelection(post) {
  return [
    "Screening / shortlisting of received applications",
    "Entrance examination or merit list as applicable",
    "Counselling and seat allotment",
    "Document verification before final admission",
  ];
}

function defaultDocs() {
  return [
    "Recent passport-size photographs and scanned signature",
    "Mark sheets and certificates of all qualifying examinations",
    "Residence / domicile certificate of Assam",
    "Category certificate and income certificate (if applicable)",
    "Aadhaar card and a valid mobile number",
  ];
}

function defaultSteps(post) {
  return [
    `Visit the official website of ${post.org}.`,
    "Open the admission / application link for the current session.",
    "Register with a valid mobile number and email address.",
    "Fill in the online application form with correct details.",
    "Upload the required scanned documents.",
    "Pay the application fee online, if applicable.",
    "Submit the application form and download the acknowledgement copy.",
  ];
}

function defaultContent(post) {
  return [
    { type: "heading", text: `${post.title} Overview` },
    {
      type: "paragraph",
      text: `${post.org} has announced the ${post.title}. Admission is carried out through the official process and eligible candidates can apply online before the last date mentioned in the official notification.`,
    },
    {
      type: "paragraph",
      text: `This ${post.category || "admission"} update covers the key information every applicant should review — eligibility criteria, important dates, application fee (where published), selection process, required documents and the application procedure.`,
    },
    { type: "heading", text: "How Admission is Conducted" },
    {
      type: "list",
      ordered: true,
      items: [
        "Applications are received through the official admission portal.",
        "Applications are screened as per the eligibility criteria.",
        "Merit list / rank list is prepared by the conducting authority.",
        "Shortlisted candidates are called for counselling or document verification.",
        "Seat is allotted and admission is confirmed at the institute / department.",
      ],
    },
    { type: "heading", text: "Important Instructions" },
    {
      type: "list",
      ordered: false,
      items: [
        "Submit the application only through the official portal of the conducting authority.",
        "Keep the application number and login credentials safe.",
        "Panic not — read the full official notification before filling the form.",
        "Keep the originals ready for verification wherever required.",
      ],
    },
    {
      type: "note",
      text: `Candidates must regularly check the official website of ${post.org} for the latest schedule, merit lists and counselling updates for the current admission season.`,
    },
  ];
}

// ─────────────────────────────────────────────────────────────
// Extra article metadata for flagship admission posts: admission
// details table rows (duration / mode / authority) and curated FAQs.
// Only data that already exists in the override is repeated here —
// never invented. Posts without an entry get a FAQ derived purely
// from their own published fields (or no FAQ when nothing exists).
// ─────────────────────────────────────────────────────────────
const ADMISSION_ARTICLE_META = {
  "assam-anm-admission-2026": {
    courseDuration: "2 years",
    admissionMode: "Online application + merit-based counselling",
    officialAuthority: "DHSFW Assam",
    faq: [
      {
        question: "What is the Assam ANM admission 2026?",
        answer:
          "It is the admission process for the two-year ANM (Auxiliary Nurse Midwifery) training course under DHSFW Assam for the 2026-27 session. Applications are invited online through the DHSFW Assam portal.",
      },
      {
        question: "Who is eligible to apply for ANM admission?",
        answer:
          "Candidates who are citizens of India, ordinarily resident of Assam, and have passed HSLC / Madhyamik or an equivalent examination with the qualifying marks. The age limit is 17 to 24 years as on 1 January 2026, with relaxation for reserved categories.",
      },
      {
        question: "What is the last date to apply?",
        answer:
          "The online application window closes on 20 October 2026. Candidates are advised to submit the form well before the last date to avoid last-minute server issues.",
      },
      {
        question: "What is the application fee for ANM admission?",
        answer:
          "The fee is ₹700 for General / EWS, ₹500 for OBC / MOBC and ₹300 for SC / ST(P) / ST(H) candidates.",
      },
      {
        question: "How can I apply for Assam ANM admission?",
        answer:
          "Apply online through the official DHSFW Assam portal (dme.assam.gov.in). The apply link, whenever published, will also appear in the Important Links section of this page.",
      },
    ],
  },
  "assam-polytechnic-admission-2026": {
    courseDuration: "3 years (Diploma in Engineering)",
    admissionMode: "Online application + merit list + counselling",
    officialAuthority: "Directorate of Technical Education (DTE) Assam",
    totalSeats: "4385",
    faq: [
      {
        question: "What is the Assam Polytechnic admission 2026?",
        answer:
          "It is the admission process for diploma engineering (polytechnic) courses under DTE Assam for the 2026-27 session, offered through government and private polytechnic institutes of the state.",
      },
      {
        question: "Who can apply for polytechnic admission?",
        answer:
          "Candidates who are Indian citizens and residents of Assam, and have passed HSLC / Madhyamik or equivalent with at least 50% aggregate marks (relaxation as per DTE norms).",
      },
      {
        question: "What is the last date to apply?",
        answer:
          "The online application deadline is 30 September 2026 for the current admission cycle.",
      },
      {
        question: "What is the application fee?",
        answer:
          "General candidates pay ₹450, OBC / MOBC pay ₹350 and SC / ST(P) / ST(H) candidates pay ₹250.",
      },
      {
        question: "How is admission for polytechnic courses done?",
        answer:
          "Admission is merit-based on qualifying examination marks, followed by reservation-wise counselling for seat allotment and document verification.",
      },
    ],
  },
  "assam-cee-exam-2026": {
    courseDuration: "4 years (B.Tech / Engineering)",
    admissionMode: "Entrance exam (Assam CEE) + counselling",
    officialAuthority: "Assam Science and Technology University (ASTU)",
    faq: [
      {
        question: "What is the Assam CEE admission 2026?",
        answer:
          "Assam CEE (Combined Entrance Examination) is the state-level entrance test used for admission into B.Tech and other engineering programmes in government and private colleges of Assam.",
      },
      {
        question: "Who can appear for Assam CEE?",
        answer:
          "Candidates who have passed HSSLC (Science) or equivalent with Physics, Chemistry and Mathematics with at least 55% aggregate marks (relaxation for reserved categories). Appearing candidates of the current year are also eligible.",
      },
      {
        question: "When will the Assam CEE be conducted?",
        answer:
          "The entrance examination is scheduled for 19 July 2026 as per the current schedule.",
      },
      {
        question: "What is the application fee for CEE?",
        answer:
          "General / EWS candidates pay ₹850, OBC / MOBC pay ₹650 and SC / ST(P) / ST(H) candidates pay ₹350.",
      },
      {
        question: "How is seat allotment done in CEE?",
        answer:
          "Seats are allotted through counselling on the basis of the CEE rank and qualifying marks, followed by document verification at the allotted college.",
      },
    ],
  },
  "assam-gnm-admission-2026": {
    courseDuration: "3 years (GNM diploma)",
    admissionMode: "Online application + merit list + counselling",
    officialAuthority: "Directorate of Medical Education, Assam",
    faq: [
      {
        question: "What is the Assam GNM admission 2026?",
        answer:
          "It is the admission process for the three-year General Nursing and Midwifery (GNM) diploma course for the 2026-27 session through the official nursing admission portal of Assam.",
      },
      {
        question: "Who can apply for GNM admission?",
        answer:
          "Candidates who have passed HSLC / Madhyamik or equivalent with the qualifying marks published in the official notification. The age limit is 17 to 28 years with relaxation for reserved categories, and candidates should be ordinarily resident of Assam.",
      },
      {
        question: "What is the application fee for GNM?",
        answer:
          "General candidates pay ₹450, OBC pay ₹350 and SC / ST(P) / ST(H) candidates pay ₹250.",
      },
      {
        question: "How is GNM admission done?",
        answer:
          "Admission is on the basis of merit from qualifying examination marks, followed by counselling for seat allotment in government and private nursing institutes.",
      },
    ],
  },
  "assam-navodaya-admission-2027": {
    courseDuration: "Class VI to Class XII (JNV schooling)",
    admissionMode: "JNVST Class VI entrance test",
    officialAuthority: "Navodaya Vidyalaya Samiti (NVS)",
    faq: [
      {
        question: "What is the Navodaya admission 2027?",
        answer:
          "It is the admission process for Class VI in Jawahar Navodaya Vidyalayas across Assam through the JNVST for the 2027-28 academic session.",
      },
      {
        question: "Who is eligible for JNVST Class VI?",
        answer:
          "Children studying in Class V in a Government / Government-aided or recognised school, aged 9 to 13 years as on the reference date, and resident of the district for which admission is sought.",
      },
      {
        question: "What is the exam date for JNVST?",
        answer:
          "The JNVST Class VI entrance examination is scheduled for 17 January 2027.",
      },
      {
        question: "What is the selection process?",
        answer:
          "Selection is made district-wise through the JNVST entrance test covering Mental Ability, Arithmetic and Language sections, followed by publication of selected and wait-list candidates.",
      },
    ],
  },
  "dibrugarh-university-pg-admission-2026": {
    courseDuration: "Varies by PG programme (1–2 years)",
    admissionMode:
      "Online application + entrance / merit-based selection",
    officialAuthority: "Dibrugarh University",
    faq: [
      {
        question: "What is the Dibrugarh University PG admission 2026?",
        answer:
          "It is the admission process for various postgraduate programmes for the 2026-27 session through the official admission portal of Dibrugarh University.",
      },
      {
        question: "Who can apply for PG admission?",
        answer:
          "Candidates who hold a bachelor's degree in the relevant discipline from a recognised university with the qualifying percentage prescribed in the official notification. Category-wise relaxation applies as per university norms.",
      },
      {
        question: "What is the last date to apply?",
        answer:
          "The online application window closes on 10 August 2026 for the current cycle.",
      },
      {
        question: "How is selection done?",
        answer:
          "Selection is based on the merit of the qualifying examination, with entrance examination for select programmes, followed by counselling and document verification.",
      },
    ],
  },
  "gauhati-university-mba-admission-2026": {
    courseDuration: "2 years (MBA)",
    admissionMode: "Entrance test scores (CMAT / MAT etc.) + GD / PI",
    officialAuthority: "Gauhati University",
    faq: [
      {
        question: "What is the Gauhati University MBA admission 2026?",
        answer:
          "It is the admission process for the MBA programme for the 2026-27 session, based on national entrance test scores followed by group discussion and personal interview.",
      },
      {
        question: "Who can apply for MBA admission?",
        answer:
          "Candidates with a bachelor's degree in any discipline from a recognised university with the minimum marks prescribed, and valid scores in CMAT / MAT / GMAT / CAT as accepted by the university.",
      },
      {
        question: "What is the last date to apply?",
        answer:
          "The online application deadline is 20 June 2026 for the current admission cycle.",
      },
      {
        question: "How is MBA admission done?",
        answer:
          "Candidates are screened on entrance test scores, then shortlisted for group discussion and personal interview before the final merit list is published.",
      },
    ],
  },
};

function deriveFaq(post) {
  const faqs = [];
  const add = (question, answer) => {
    if (question && answer) {
      faqs.push({ question, answer });
    }
  };
  const fmt = (d) => {
    try {
      if (!d) return null;
      const x = new Date(d);
      if (isNaN(x.getTime())) return null;
      return x.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return null;
    }
  };

  const title = post.title || "";
  const course = post.courseName || post.badge || null;
  const org = post.org || null;
  const last = fmt(post.applicationLastDate);
  const exam = fmt(post.examDate);
  const fee =
    Array.isArray(post.applicationFee) && post.applicationFee.length
      ? post.applicationFee.map((f) => `${f.category} – ${f.amount}`).join(", ")
      : null;

  add(
    `What is ${title}?`,
    org && course
      ? `This admission update covers ${course} offered through ${org}. Review the eligibility criteria, important dates, application fee and application procedure on this page before applying.`
      : `This admission update covers the eligibility criteria, important dates, application fee and the step-by-step application procedure published by the conducting authority.`
  );
  add(
    `Which course is offered under this admission?`,
    course && org
      ? `${course} organised by ${org} for the ${post.admissionYear || "current"} academic session.`
      : null
  );
  add(
    "What is the last date to apply?",
    last ? `The last date to apply has been notified as ${last}.` : null
  );
  add(
    "When will the entrance examination be conducted?",
    exam
      ? `The examination has been scheduled for ${exam} as per the official notification.`
      : null
  );
  add(
    "What is the application fee?",
    fee ? `The application fee is ${fee}.` : null
  );
  add(
    "How can I apply online?",
    post.applicationUrl
      ? "Submit the online application form through the official admission portal before the last date. The direct link is available in the Important Links section above."
      : null
  );
  add(
    "Where can I find the official notification?",
    org
      ? `The official notification is published by ${org}. Keep checking this page and the official website for the latest updates.`
      : null
  );
  return faqs.length ? faqs : null;
}

function estimateReadingTime(post) {
  let words = 0;
  const count = (t) => {
    if (!t) return;
    words += String(t).split(/\s+/).filter(Boolean).length;
  };
  count(post.shortDescription);
  (post.eligibility || []).forEach(count);
  (post.selectionProcess || []).forEach(count);
  (post.requiredDocuments || []).forEach(count);
  (post.howToApply || []).forEach(count);
  (post.content || []).forEach((b) => {
    count(b.text || b.heading);
    (b.items || []).forEach(count);
  });
  return Math.max(1, Math.ceil(words / 200));
}

export function enrichAdmission(post) {
  if (!post) return post;
  const override = ADMISSION_DETAIL_OVERRIDES[post.slug] || {};
  const meta = ADMISSION_ARTICLE_META[post.slug] || {};
  const enriched = {
    ...post,
    slug: canonicalAdmissionSlug(post.slug),
    slugKey: post.slug,
    url: admissionPublicUrl(post.slug),
    shortDescription:
      override.shortDescription || defaultShortIntro(post),
    courseName: override.courseName || post.badge || post.category,
    admissionYear: override.admissionYear || null,
    totalSeats: post.totalSeats || override.totalSeats || meta.totalSeats || null,
    videoUrl: post.videoUrl || override.videoUrl || null,
    applicationStartDate: override.applicationStartDate || null,
    applicationLastDate: override.applicationLastDate || null,
    examDate: override.examDate || null,
    meritListDate: override.meritListDate || null,
    counsellingDate: override.counsellingDate || null,
    importantDates: override.importantDates || null,
    eligibility: override.eligibility || defaultEligibility(post),
    ageLimit: override.ageLimit || null,
    applicationFee: override.applicationFee || null,
    selectionProcess: override.selectionProcess || defaultSelection(post),
    requiredDocuments: override.requiredDocuments || defaultDocs(),
    howToApply: override.howToApply || defaultSteps(post),
    courseDuration: override.courseDuration || meta.courseDuration || null,
    admissionMode: override.admissionMode || meta.admissionMode || null,
    officialAuthority:
      override.officialAuthority || meta.officialAuthority || null,
    officialNotificationUrl: override.officialNotificationUrl || null,
    applicationUrl: override.applicationUrl || null,
    prospectusUrl: override.prospectusUrl || null,
    importantLinks:
      override.importantLinks || post.importantLinks || null,
    featuredImage: post.featuredImage || override.featuredImage || meta.featuredImage || null,
    content: override.content || defaultContent(post),
    publishedAt: post.createdAt || post.date || null,
    updatedAt: post.updatedAt || null,
  };
  enriched.faq = override.faq || meta.faq || deriveFaq(enriched);
  enriched.readingTime = estimateReadingTime(enriched);
  return enriched;
}

export function getAdmissionTotalPages(perPage = ADMISSION_POSTS_PER_PAGE) {
  return Math.max(1, Math.ceil(admissionPosts.length / perPage));
}

export function getAdmissionPage(page, perPage = ADMISSION_POSTS_PER_PAGE) {
  const n = Number(page) || 1;
  const start = (n - 1) * perPage;
  return admissionPosts
    .filter(isPublishedAdmission)
    .slice(start, start + perPage)
    .map(enrichAdmission);
}

// ─────────────────────────────────────────────────────────────
// Admit card detail content enrichment + canonical URLs
//
// Record slug "air-force-agniveervayu-admit-card-2026" is served
// publicly at "/admit-card/air-force-admit-card/". Year-suffixed
// URLs keep working because record resolution accepts both forms.
// Flagship records carry curated content through
// ADMIT_CARD_DETAIL_OVERRIDES; every other record gets a clean,
// non-wrong fallback generated from its own fields.
// ─────────────────────────────────────────────────────────────
const ADMIT_CARD_SLUG_CANONICAL_MAP = {
  "air-force-agniveervayu-admit-card-2026": "air-force-admit-card",
};

export function canonicalAdmitCardSlug(slug) {
  if (!slug) return slug;
  if (ADMIT_CARD_SLUG_CANONICAL_MAP[slug]) {
    return ADMIT_CARD_SLUG_CANONICAL_MAP[slug];
  }
  return slug.replace(/-\d{4}$/, "");
}

function resolveAdmitCardRecord(slug) {
  if (!slug) return null;
  const posts = CATEGORY_META["admit-card"].fallbacks;
  return (
    posts.find((p) => p.slug === slug) ||
    posts.find((p) => canonicalAdmitCardSlug(p.slug) === slug) ||
    null
  );
}

function isPublishedAdmitCard(post) {
  return Boolean(post) && post.active !== false;
}

const ADMIT_CARD_DETAIL_OVERRIDES = {
  "air-force-agniveervayu-admit-card-2026": {
    shortDescription:
      "Download the Indian Air Force Agniveervayu Intake 02/2027 admit card. Check the release date, exam date, exam centre details, required documents and the step-by-step process to download the hall ticket from the official website.",
    examName: "Agniveervayu Intake 02/2027 (Phase I CBT)",
    intake: "02/2027",
    postTrade: "Agniveervayu – Science & Non-Science Trades",
    examType: "Computer Based Test (CBT)",
    examMode: "Online",
    admitCardReleaseMode: "Online – via official website",
    officialSite: "https://agnipathvayu.cdac.in",
    admitCardUrl: "https://agnipathvayu.cdac.in",
    officialNotificationUrl: "https://agnipathvayu.cdac.in",
    applicationStartDate: "2026-08-20",
    applicationLastDate: "2026-09-15",
    examDate: "2026-10-30",
    admitCardReleaseDate: "2026-09-16",
    resultDate: "2026-12-10",
    importantDates: [
      { label: "Application Start", date: "2026-08-20" },
      { label: "Application Last Date", date: "2026-09-15" },
      { label: "Admit Card Release", date: "2026-09-16" },
      { label: "Phase I Exam Date", date: "2026-10-30" },
      { label: "Result Declaration", date: "2026-12-10" },
    ],
    importantLinks: [
      { label: "Admit Card Download", url: "https://agnipathvayu.cdac.in" },
      { label: "Official Notification", url: "https://agnipathvayu.cdac.in" },
      { label: "Official Website", url: "https://agnipathvayu.cdac.in" },
    ],
    eligibility: [
      "Candidates who successfully submitted their online application for Agniveervayu Intake 02/2027 and passed the earlier screening stages are eligible to download the admit card.",
      "The admit card is issued only to candidates whose application has been found valid as per the official notification of the Indian Air Force.",
      "Candidates must carry all required documents and follow the instructions printed on the admit card to appear for Phase I.",
    ],
    examCentreInfo: [
      "Exam centre and reporting time are printed on the admit card.",
      "Arrive at the exam venue at least 60 minutes before the reporting time.",
      "The venue is the one allotted by the Indian Air Force through the official portal.",
      "Candidates must follow the dress instructions and behaviour rules at the centre.",
    ],
    documents: [
      "Printed copy of the Agniveervayu admit card",
      "Valid photo identity proof (Aadhaar / PAN / Driving Licence / Passport)",
      "Passport-size photographs as indicated in the instructions",
      "Any other document mentioned on the admit card or official notification",
    ],
    howToDownload: [
      "Visit the official website of the Indian Air Force Agniveervayu portal.",
      "Open the Admit Card / Login section for Intake 02/2027.",
      "Enter the required login details such as registration number and date of birth.",
      "Submit the details to view the admit card.",
      "Download the admit card PDF and check all information carefully.",
      "Take a clear printout of the admit card for the examination day.",
    ],
    importantInstructions: [
      "Admit card without a photograph or with any discrepancy may be rejected at the exam centre.",
      "Digital copies of the admit card are not accepted inside the exam hall – carry a paper printout.",
      "Carry the same photo ID used during registration and application.",
      "In case of any error on the admit card, contact the exam authority immediately.",
      "Keep multiple printouts and a soft copy for future stages.",
    ],
    faq: [
      {
        question: "When will Indian Air Force Admit Card 2026 be released?",
        answer:
          "As per the official schedule, the Agniveervayu Intake 02/2027 admit card has been released in September 2026. Candidates can download it from the official portal of the Indian Air Force.",
      },
      {
        question: "How can I download the admit card?",
        answer:
          "Visit the official Agniveervayu portal, open the admit card section, enter your login details and download the PDF. Follow the steps given in the How to Download section on this page.",
      },
      {
        question: "What details are required to download it?",
        answer:
          "You generally need your registration number / application number and date of birth or the password set during registration.",
      },
      {
        question: "What documents should I carry to the exam?",
        answer:
          "Carry a printed admit card, a valid photo identity proof, and any other document mentioned in the official notification and on the admit card.",
      },
      {
        question: "Where can I find the official website?",
        answer:
          "The official portal for Agniveervayu is available through the Indian Air Force website. The direct link is also provided in the Important Links section above.",
      },
      {
        question: "What should I do if there is an error on my admit card?",
        answer:
          "Do not ignore errors on the admit card. Contact the exam conducting authority immediately and get the details corrected before the examination date.",
      },
    ],
    content: [
      { type: "heading", text: "Indian Air Force Agniveervayu Admit Card 2026 – Overview" },
      {
        type: "paragraph",
        text: "The Indian Air Force has released the admit card for the Agniveervayu Intake 02/2027 examination. The admit card is the entry pass for Phase I, which is conducted as an online computer based test for Agniveervayu candidates in science and non-science trades.",
      },
      {
        type: "paragraph",
        text: "Only candidates who filled the online application and were found eligible as per the official notification can download the select hall ticket. Candidates should verify all details printed on the card before the exam date.",
      },
      { type: "heading", text: "Who can download the Indian Air Force Admit Card?" },
      {
        type: "list",
        ordered: false,
        items: [
          "Applicants who successfully registered for Agniveervayu Intake 02/2027.",
          "Candidates whose application was accepted by the Indian Air Force.",
          "Candidates appearing for Phase I of the selection process.",
        ],
      },
      { type: "heading", text: "When is the Admit Card Released?" },
      {
        type: "paragraph",
        text: "The admit card is released on the official portal a few days before the examination date. Candidates should check the portal regularly and download the hall ticket as soon as it is available.",
      },
      { type: "heading", text: "Where can candidates download the Admit Card?" },
      {
        type: "paragraph",
        text: "The admit card can only be downloaded from the official portal of the Indian Air Force. JobCareer does not host admit cards – candidates must always download them from the official website using their own login credentials.",
      },
      { type: "heading", text: "What information is printed on the Admit Card?" },
      {
        type: "list",
        ordered: false,
        items: [
          "Candidate's name, photograph and signature",
          "Roll number and registration details",
          "Exam date, time and reporting time",
          "Exam centre name and address",
          "Instructions for the examination day",
        ],
      },
      {
        type: "note",
        text: "Candidates are advised not to rely on unofficial websites for admit cards. Download the hall ticket only from the official Agniveervayu portal and cross-check every detail before the examination.",
      },
    ],
  },
};

function defaultAdmitIntro(post) {
  return `Download the ${post.org} admit card for ${post.badge || post.category} 2026 from the official website. Check the release date, exam details and step-by-step download instructions on this page.`;
}

function defaultAdmitDates(post) {
  const rows = [];
  const add = (label, value) => {
    if (value) rows.push({ label, date: value });
  };
  add("Application Start", post.applicationStartDate);
  add("Application Last Date", post.applicationLastDate);
  add("Exam Date", post.examDate);
  add("Admit Card Release", post.admitCardReleaseDate);
  add("Result Date", post.resultDate);
  if (!rows.length && post.date) rows.push({ label: "Released", date: post.date });
  return rows.length ? rows : null;
}

function defaultAdmitEligibility(post) {
  return [
    `Applicants who registered for ${post.badge || post.category} and whose application has been accepted by ${post.org}.`,
    `Candidates whose application details match the official records maintained by the conducting authority.`,
  ];
}

function defaultAdmitDocuments() {
  return [
    "Printed copy of the admit card",
    "Valid photo identity proof (Aadhaar / PAN / Driving Licence / Passport)",
    "Passport-size photograph if required",
    "Any other document mentioned on the admit card",
  ];
}

function defaultAdmitDownloadSteps() {
  return [
    "Visit the official website of the exam conducting authority.",
    "Open the Admit Card / Hall Ticket section for the relevant exam.",
    "Enter the required login details (registration number and date of birth).",
    "Submit the details to view the admit card.",
    "Download the admit card PDF and check all information carefully.",
    "Take a printout of the admit card for the examination day.",
  ];
}

function defaultAdmitInstructions() {
  return [
    "Carry a printed copy of the admit card to the exam centre.",
    "Arrive before the reporting time mentioned on the admit card.",
    "Carry the same identity proof used during registration.",
    "Report any error on the admit card to the exam authority immediately.",
  ];
}

function defaultAdmitContent(post) {
  return [
    { type: "heading", text: `${post.org} Admit Card 2026 – Overview` },
    {
      type: "paragraph",
      text: `The ${post.org} admit card for ${post.badge || post.category} is the official entry pass for the examination. Candidates who registered successfully can download their hall ticket from the official website of the conducting authority.`,
    },
    { type: "heading", text: "How to Download" },
    {
      type: "list",
      ordered: true,
      items: defaultAdmitDownloadSteps(),
    },
    { type: "heading", text: "Things to Carry" },
    {
      type: "list",
      ordered: false,
      items: defaultAdmitDocuments(),
    },
    {
      type: "note",
      text: "Always download the admit card only from the official website. JobCareer aggregates information only and does not host admit cards.",
    },
  ];
}

function defaultAdmitFaq(post) {
  const faqs = [];
  const add = (q, a) => a && faqs.push({ question: q, answer: a });
  add(
    `When will the ${post.org} admit card be released?`,
    post.admitCardReleaseDate
      ? `The admit card has been scheduled for release on ${post.admitCardReleaseDate}.`
      : `The admit card release date is announced by ${post.org} through the official notification.`
  );
  add(
    "How can I download the admit card?",
    "Visit the official website, open the admit card section, enter your registration details and download the PDF. Follow the steps given on this page."
  );
  add(
    "What details do I need to download it?",
    "Generally, you need your registration number and date of birth or the password set during registration."
  );
  add(
    "What documents should I carry to the exam?",
    "A printed admit card, a valid photo identity proof and any other document specified in the official notification."
  );
  add(
    "Where can I find the official website?",
    post.officialSite
      ? `The official website of ${post.org} is listed in the Important Links section above.`
      : null
  );
  return faqs.length ? faqs : null;
}

function estimateAdmitReadingTime(post) {
  let words = 0;
  const count = (t) => {
    if (!t) return;
    words += String(t).split(/\s+/).filter(Boolean).length;
  };
  count(post.shortDescription);
  (post.eligibility || []).forEach(count);
  (post.documents || []).forEach(count);
  (post.howToDownload || []).forEach(count);
  (post.importantInstructions || []).forEach(count);
  (post.content || []).forEach((b) => {
    count(b.text || b.heading);
    (b.items || []).forEach(count);
  });
  return Math.max(1, Math.ceil(words / 200));
}

export function enrichAdmitCard(post) {
  if (!post) return post;
  if (post.slugKey) {
    return post;
  }
  const override = ADMIT_CARD_DETAIL_OVERRIDES[post.slug] || {};
  const enriched = {
    ...post,
    slug: canonicalAdmitCardSlug(post.slug),
    slugKey: post.slug,
    shortDescription:
      override.shortDescription || defaultAdmitIntro(post),
    examName: override.examName || post.badge || null,
    intake: override.intake || null,
    postTrade: override.postTrade || null,
    examType: override.examType || null,
    examMode: override.examMode || null,
    admitCardReleaseMode: override.admitCardReleaseMode || null,
    officialSite:
      override.officialSite || post.officialSite || null,
    admitCardUrl: override.admitCardUrl || null,
    officialNotificationUrl:
      override.officialNotificationUrl || null,
    applicationStartDate: override.applicationStartDate || null,
    applicationLastDate: override.applicationLastDate || null,
    examDate: override.examDate || null,
    admitCardReleaseDate: override.admitCardReleaseDate || null,
    resultDate: override.resultDate || null,
    importantDates:
      override.importantDates || defaultAdmitDates(post),
    eligibility: override.eligibility || defaultAdmitEligibility(post),
    examCentreInfo: override.examCentreInfo || null,
    documents: override.documents || defaultAdmitDocuments(),
    howToDownload:
      override.howToDownload || defaultAdmitDownloadSteps(),
    importantInstructions:
      override.importantInstructions || defaultAdmitInstructions(),
    importantLinks: override.importantLinks || [],
    content: override.content || defaultAdmitContent(post),
    publishedAt: post.createdAt || post.date || null,
    updatedAt: post.updatedAt || null,
  };
  enriched.faq = override.faq || defaultAdmitFaq(enriched);
  enriched.readingTime = estimateAdmitReadingTime(enriched);
  return enriched;
}

export function getAdmitCardPosts() {
  return CATEGORY_META["admit-card"]
    .fallbacks.filter(isPublishedAdmitCard)
    .map(enrichAdmitCard);
}

const totalAdmitCards = getAdmitCardPosts();

export function getAdmitCardPage(page, perPage = 12) {
  const n = Math.max(1, Number(page) || 1);
  const start = (n - 1) * perPage;
  return totalAdmitCards.slice(start, start + perPage);
}

export function getAdmitCardPost(slug) {
  if (!slug) return null;
  const record = resolveAdmitCardRecord(slug);
  if (!record) return null;
  return enrichAdmitCard(record);
}

export function getSampleJobs() {
  return CATEGORY_META.job.fallbacks.map((job) => {
    const link = job.officialLink || JOB_OFFICIAL_LINKS[job.slug];
    return link ? { ...job, officialLink: link } : job;
  });
}

export function getJobPage(page, perPage = 12) {
  const current = Math.max(1, Number(page) || 1);
  const startIndex = (current - 1) * perPage;
  return getSampleJobs().slice(startIndex, startIndex + perPage);
}

export function getSampleJob(slug) {
  return getSampleJobs().find((j) => j.slug === slug) || null;
}

export function getSampleResults() {
  return CATEGORY_META.results.fallbacks;
}

export function getResultPage(page, perPage = 12) {
  const current = Math.max(1, Number(page) || 1);
  const startIndex = (current - 1) * perPage;
  return getSampleResults().slice(startIndex, startIndex + perPage);
}

export function getSampleResult(slug) {
  return getSampleResults().find((r) => r.slug === slug) || null;
}

export function getSampleSchemes() {
  return CATEGORY_META.scheme.fallbacks;
}

export function getSampleScheme(slug) {
  return getSampleSchemes().find((s) => s.slug === slug) || null;
}

export function getSampleScholarships() {
  return CATEGORY_META.scholarship.fallbacks;
}

export function getSampleScholarship(slug) {
  return getSampleScholarships().find((s) => s.slug === slug) || null;
}

export function formatDate(dateStr) {
  if (!dateStr) return "19 September 2026";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}