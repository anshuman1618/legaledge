/**
 * LegalEdge AI - Database Seed
 * Comprehensive seed data for legal sections, situations, jurisdictions, and departments
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ==================== LEGAL SECTIONS ====================
  console.log('📚 Seeding legal sections...');

  const legalSections = [
    {
      actType: 'IPC',
      sectionNumber: '302',
      title: 'Murder',
      description: 'Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.',
      ingredients: [
        'Causing death of a human being',
        'The act was done with the intention of causing death',
        'Or with the intention of causing such bodily injury as the offender knows to be likely to cause death',
        'Or with the intention of causing bodily injury sufficient in the ordinary course of nature to cause death',
        'Or the act is so imminently dangerous that it must in all probability cause death'
      ],
      punishment: 'Death or imprisonment for life, and fine',
      sectionType: 'SUBSTANTIVE',
      category: 'Offences Against Body',
      relatedSections: ['IPC 299', 'IPC 300', 'IPC 301', 'IPC 304'],
      caseLaws: [
        {
          caseName: 'Bachan Singh v. State of Punjab',
          citation: 'AIR 1980 SC 898',
          year: 1980,
          court: 'Supreme Court of India',
          summary: 'Death sentence should be imposed only in the rarest of rare cases.',
          ratio: 'The court laid down guidelines for imposing death penalty.',
          relevance: 'Landmark case on sentencing in murder cases'
        },
        {
          caseName: 'Machhi Singh v. State of Punjab',
          citation: 'AIR 1983 SC 957',
          year: 1983,
          court: 'Supreme Court of India',
          summary: 'Further elaborated the rarest of rare doctrine.',
          relevance: 'Categories for death penalty consideration'
        }
      ]
    },
    {
      actType: 'IPC',
      sectionNumber: '420',
      title: 'Cheating and dishonestly inducing delivery of property',
      description: 'Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person.',
      ingredients: [
        'Deception of any person',
        'Fraudulent or dishonest inducement',
        'Delivery of property or alteration of valuable security',
        'Intention to cheat from the beginning',
        'The person deceived must have been induced to deliver property'
      ],
      punishment: 'Imprisonment up to 7 years and fine',
      sectionType: 'SUBSTANTIVE',
      category: 'Offences Against Property',
      relatedSections: ['IPC 415', 'IPC 417', 'IPC 418', 'IPC 421'],
      caseLaws: [
        {
          caseName: 'Hridaya Ranjan Prasad Verma v. State of Bihar',
          citation: '(2000) 4 SCC 168',
          year: 2000,
          court: 'Supreme Court of India',
          summary: 'Mere breach of contract cannot give rise to criminal prosecution for cheating.',
          relevance: 'Distinction between civil breach and criminal cheating'
        }
      ]
    },
    {
      actType: 'IPC',
      sectionNumber: '498A',
      title: 'Cruelty by Husband or Relatives',
      description: 'Whoever, being the husband or the relative of the husband of a woman, subjects such woman to cruelty shall be punished.',
      ingredients: [
        'The accused must be husband or relative of husband',
        'The woman must be subjected to cruelty',
        'Cruelty includes willful conduct likely to drive the woman to commit suicide',
        'Or cause grave injury or danger to life, limb or health',
        'Harassment for dowry demand'
      ],
      punishment: 'Imprisonment up to 3 years and fine',
      sectionType: 'SUBSTANTIVE',
      category: 'Offences Against Women',
      relatedSections: ['IPC 304B', 'IPC 306', 'DV Act 2005'],
      caseLaws: [
        {
          caseName: 'Arnesh Kumar v. State of Bihar',
          citation: '(2014) 8 SCC 273',
          year: 2014,
          court: 'Supreme Court of India',
          summary: 'Police should not automatically arrest in 498A cases.',
          relevance: 'Safeguards against misuse of 498A'
        }
      ]
    },
    {
      actType: 'CRPC',
      sectionNumber: '154',
      title: 'Information in cognizable cases (FIR)',
      description: 'Every information relating to the commission of a cognizable offence shall be reduced to writing.',
      ingredients: [
        'Information relating to commission of cognizable offence',
        'Given to officer in charge of police station',
        'Must be reduced to writing if oral',
        'Must be read over to the informant',
        'Must be signed by the informant',
        'Copy to be given to the informant free of cost'
      ],
      punishment: 'N/A - Procedural provision',
      sectionType: 'PROCEDURAL',
      category: 'Investigation',
      relatedSections: ['CrPC 155', 'CrPC 156', 'CrPC 157'],
      caseLaws: [
        {
          caseName: 'Lalita Kumari v. Government of UP',
          citation: '(2014) 2 SCC 1',
          year: 2014,
          court: 'Supreme Court of India',
          summary: 'Registration of FIR is mandatory under Section 154 when information discloses cognizable offence.',
          relevance: 'Mandatory registration of FIR'
        }
      ]
    },
    {
      actType: 'CRPC',
      sectionNumber: '437',
      title: 'Bail in non-bailable offences',
      description: 'When any person accused of a non-bailable offence is arrested or detained, he may be released on bail.',
      ingredients: [
        'Person accused of non-bailable offence',
        'Arrested or detained without warrant',
        'Court must consider nature of accusation',
        'Severity of punishment',
        'Likelihood of fleeing justice',
        'Tampering with evidence'
      ],
      punishment: 'N/A - Procedural provision',
      sectionType: 'PROCEDURAL',
      category: 'Bail',
      relatedSections: ['CrPC 436', 'CrPC 438', 'CrPC 439'],
      caseLaws: []
    },
    {
      actType: 'RTI_ACT',
      sectionNumber: '6',
      title: 'Request for Obtaining Information',
      description: 'A person who desires to obtain any information shall make a request in writing to the PIO.',
      ingredients: [
        'Request in writing or electronic means',
        'To Central/State Public Information Officer',
        'Specify particulars of information sought',
        'Accompanied by prescribed fee',
        'No requirement to give reasons for requesting'
      ],
      punishment: 'N/A - Right to Information',
      sectionType: 'PROCEDURAL',
      category: 'Right to Information',
      relatedSections: ['RTI Section 7', 'RTI Section 8', 'RTI Section 19'],
      caseLaws: [
        {
          caseName: 'CBSE v. Aditya Bandopadhyay',
          citation: '(2011) 8 SCC 497',
          year: 2011,
          court: 'Supreme Court of India',
          summary: 'RTI Act should not be used as a tool for oppression.',
          relevance: 'Scope and limitations of RTI'
        }
      ]
    },
    {
      actType: 'CONSTITUTION',
      sectionNumber: 'Article 21',
      title: 'Protection of Life and Personal Liberty',
      description: 'No person shall be deprived of his life or personal liberty except according to procedure established by law.',
      ingredients: [
        'Right to life',
        'Right to personal liberty',
        'Procedure established by law must be followed',
        'Procedure must be just, fair and reasonable',
        'Includes right to livelihood, dignity, privacy, health'
      ],
      punishment: 'N/A - Fundamental Right',
      sectionType: 'SUBSTANTIVE',
      category: 'Fundamental Rights',
      relatedSections: ['Article 14', 'Article 19', 'Article 22', 'Article 32'],
      caseLaws: [
        {
          caseName: 'Maneka Gandhi v. Union of India',
          citation: 'AIR 1978 SC 597',
          year: 1978,
          court: 'Supreme Court of India',
          summary: 'Procedure under Article 21 must be just, fair and reasonable.',
          relevance: 'Expanded interpretation of life and liberty'
        },
        {
          caseName: 'KS Puttaswamy v. Union of India',
          citation: '(2017) 10 SCC 1',
          year: 2017,
          court: 'Supreme Court of India',
          summary: 'Right to privacy is a fundamental right under Article 21.',
          relevance: 'Right to privacy as fundamental right'
        }
      ]
    }
  ];

  for (const section of legalSections) {
    const created = await prisma.legalSection.upsert({
      where: {
        actType_sectionNumber: {
          actType: section.actType as any,
          sectionNumber: section.sectionNumber
        }
      },
      update: {},
      create: {
        actType: section.actType as any,
        sectionNumber: section.sectionNumber,
        title: section.title,
        description: section.description,
        ingredients: section.ingredients,
        punishment: section.punishment,
        sectionType: section.sectionType as any,
        category: section.category,
        relatedSections: section.relatedSections,
        caseLaws: {
          create: section.caseLaws
        }
      }
    });
    console.log(`  ✓ ${section.actType} ${section.sectionNumber} - ${section.title}`);
  }

  // ==================== SITUATIONS ====================
  console.log('⚠️ Seeding situations...');

  const situations = [
    {
      name: 'Domestic Violence',
      description: 'Cases involving domestic violence, dowry harassment, and marital disputes',
      icon: '🏠',
      competentAuthorities: [
        'Protection Officer under DV Act',
        'Judicial Magistrate First Class',
        'Women Cell / CAW Cell',
        'Local Police Station',
        'Family Court'
      ],
      futureApplications: [
        { name: 'DIR (Domestic Incident Report)', timeline: 'Immediately', description: 'Through Protection Officer' },
        { name: 'FIR under 498A', timeline: 'Immediately', description: 'At Police Station' },
        { name: 'DV Act Application', timeline: 'Within 30 days', description: 'Before Magistrate' },
        { name: 'Maintenance Application', timeline: 'Within 60 days', description: 'Under CrPC 125' }
      ],
      recommendedDrafts: ['POLICE_COMPLAINT', 'CRIMINAL_COMPLAINT', 'LEGAL_NOTICE']
    },
    {
      name: 'Theft and Robbery',
      description: 'Property offences involving taking of movable property',
      icon: '🔓',
      competentAuthorities: [
        'SHO of concerned Police Station',
        'Judicial Magistrate First Class',
        'Sessions Judge (for robbery/dacoity)'
      ],
      futureApplications: [
        { name: 'FIR', timeline: 'Immediately', description: 'At nearest Police Station' },
        { name: 'Application for recovery', timeline: 'Within 7 days', description: 'To police/court' },
        { name: 'Protest petition', timeline: 'Within 30 days', description: 'If FIR refused' }
      ],
      recommendedDrafts: ['POLICE_COMPLAINT', 'CRIMINAL_COMPLAINT', 'BAIL_APPLICATION']
    },
    {
      name: 'Cyber Crime',
      description: 'Offences committed using computers, internet, and digital means',
      icon: '💻',
      competentAuthorities: [
        'Cyber Crime Cell',
        'Jurisdictional Police Station',
        'Adjudicating Officer under IT Act',
        'Sessions Court'
      ],
      futureApplications: [
        { name: 'Cyber crime complaint', timeline: 'Immediately', description: 'At cybercrime.gov.in' },
        { name: 'FIR', timeline: 'Within 24 hours', description: 'With evidence' },
        { name: 'Bank complaint', timeline: 'Within 3 days', description: 'For account freeze' }
      ],
      recommendedDrafts: ['POLICE_COMPLAINT', 'CRIMINAL_COMPLAINT', 'LEGAL_NOTICE']
    },
    {
      name: 'Motor Vehicle Accident',
      description: 'Road traffic accidents, hit and run, negligent driving',
      icon: '🚗',
      competentAuthorities: [
        'Traffic Police',
        'Jurisdictional Police Station',
        'Motor Accident Claims Tribunal',
        'Sessions Court (for 304A cases)'
      ],
      futureApplications: [
        { name: 'FIR', timeline: 'Immediately', description: 'At Police Station' },
        { name: 'Insurance claim', timeline: 'Within 15 days', description: 'To insurer' },
        { name: 'MACT claim', timeline: 'Within 6 months', description: 'Before Tribunal' }
      ],
      recommendedDrafts: ['POLICE_COMPLAINT', 'LEGAL_NOTICE', 'CIVIL_SUIT']
    }
  ];

  for (const situation of situations) {
    const created = await prisma.situation.upsert({
      where: { name: situation.name },
      update: {},
      create: {
        name: situation.name,
        description: situation.description,
        icon: situation.icon,
        competentAuthorities: situation.competentAuthorities,
        futureApplications: situation.futureApplications,
        recommendedDrafts: situation.recommendedDrafts
      }
    });
    console.log(`  ✓ ${situation.name}`);
  }

  // ==================== JURISDICTIONS ====================
  console.log('📍 Seeding jurisdictions...');

  const jurisdictions = [
    {
      type: 'COURT',
      name: 'Supreme Court of India',
      address: 'Tilak Marg, New Delhi - 110001',
      jurisdictionArea: 'Pan India - Appellate and Original Jurisdiction',
      competentMatters: ['Constitutional matters', 'Appeals from High Courts', 'Special Leave Petitions', 'Writ Petitions'],
      state: 'Delhi',
      district: 'New Delhi',
      city: 'New Delhi'
    },
    {
      type: 'COURT',
      name: 'Delhi High Court',
      address: 'Shershah Road, New Delhi - 110003',
      jurisdictionArea: 'National Capital Territory of Delhi',
      competentMatters: ['Writ Petitions', 'Civil Appeals', 'Criminal Appeals', 'Company matters'],
      state: 'Delhi',
      district: 'New Delhi',
      city: 'New Delhi'
    },
    {
      type: 'COURT',
      name: 'Patiala House Courts',
      address: 'India Gate, New Delhi - 110001',
      jurisdictionArea: 'New Delhi District',
      competentMatters: ['Criminal cases', 'Civil suits', 'Motor accident claims', 'Family disputes'],
      state: 'Delhi',
      district: 'New Delhi',
      city: 'New Delhi'
    },
    {
      type: 'POLICE_STATION',
      name: 'Parliament Street Police Station',
      address: 'Parliament Street, New Delhi - 110001',
      jurisdictionArea: 'Central Delhi, Connaught Place area',
      competentMatters: ['Cognizable offences', 'FIR registration', 'Investigation'],
      state: 'Delhi',
      district: 'New Delhi',
      city: 'New Delhi'
    },
    {
      type: 'TRIBUNAL',
      name: 'National Consumer Disputes Redressal Commission',
      address: 'Janpath, New Delhi - 110001',
      jurisdictionArea: 'Pan India (Claims above Rs. 10 crore)',
      competentMatters: ['Consumer complaints above Rs. 10 crore', 'Appeals from State Commission'],
      state: 'Delhi',
      district: 'New Delhi',
      city: 'New Delhi'
    },
    {
      type: 'TRIBUNAL',
      name: 'National Green Tribunal',
      address: 'Faridkot House, New Delhi',
      jurisdictionArea: 'Pan India - Environmental matters',
      competentMatters: ['Environmental disputes', 'Pollution matters', 'Forest conservation'],
      state: 'Delhi',
      district: 'New Delhi',
      city: 'New Delhi'
    }
  ];

  for (const jurisdiction of jurisdictions) {
    await prisma.jurisdiction.create({
      data: jurisdiction as any
    });
    console.log(`  ✓ ${jurisdiction.name}`);
  }

  // ==================== DEPARTMENTS ====================
  console.log('🏛️ Seeding departments...');

  const departments = [
    {
      name: 'District Collectorate',
      ministry: 'State Government - Revenue Department',
      functions: [
        'Revenue administration',
        'Law and order',
        'Disaster management',
        'Land records management',
        'Election management'
      ],
      relevantActs: ['CrPC', 'Revenue Code', 'Disaster Management Act 2005'],
      contactInfo: 'District Collectorate office',
      officers: [
        { rank: 1, designation: 'District Magistrate / Collector', role: 'Head of district administration', powers: ['Revenue powers', 'Magisterial powers', 'Executive powers'], appointedUnder: 'IAS cadre rules' },
        { rank: 2, designation: 'Additional District Magistrate', role: 'Assists DM', powers: ['Delegated magisterial powers'], appointedUnder: 'State Service Rules' },
        { rank: 3, designation: 'Sub-Divisional Magistrate', role: 'Sub-division administration', powers: ['Revenue powers within sub-division'], appointedUnder: 'State Service Rules' }
      ],
      rtiMatrix: {
        publicInfoOfficer: 'Administrative Officer',
        firstAppellateAuthority: 'District Magistrate',
        processingPeriodDays: 30
      }
    },
    {
      name: 'Superintendent of Police Office',
      ministry: 'State Government - Home Department',
      functions: [
        'Law and order maintenance',
        'Crime investigation',
        'Traffic management',
        'VIP security',
        'Women safety'
      ],
      relevantActs: ['Police Act 1861', 'CrPC 1973', 'IPC 1860'],
      contactInfo: 'Dial 100 for emergency',
      officers: [
        { rank: 1, designation: 'Superintendent of Police', role: 'Head of district police', powers: ['Investigation supervision', 'Law and order'], appointedUnder: 'Police Act 1861' },
        { rank: 2, designation: 'Additional SP', role: 'Assists SP', powers: ['Delegated police powers'], appointedUnder: 'Police Act 1861' },
        { rank: 3, designation: 'Station House Officer', role: 'Police station head', powers: ['FIR registration', 'Investigation', 'Arrest'], appointedUnder: 'CrPC' }
      ],
      rtiMatrix: {
        publicInfoOfficer: 'Inspector (Administration)',
        firstAppellateAuthority: 'Superintendent of Police',
        processingPeriodDays: 30
      }
    }
  ];

  for (const dept of departments) {
    const created = await prisma.department.create({
      data: {
        name: dept.name,
        ministry: dept.ministry,
        functions: dept.functions,
        relevantActs: dept.relevantActs,
        contactInfo: dept.contactInfo,
        officers: {
          create: dept.officers
        },
        rtiMatrix: {
          create: dept.rtiMatrix
        }
      }
    });
    console.log(`  ✓ ${dept.name}`);
  }

  console.log('✅ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
