// ===== INDIAN PENAL CODE / BNS SECTIONS =====
export interface LegalSection {
  id: string;
  code: string;
  section: string;
  title: string;
  description: string;
  ingredients: string[];
  punishment: string;
  type: 'substantive' | 'procedural';
  category: string;
  relatedSections: string[];
  caseLaws: CaseLaw[];
}

export interface CaseLaw {
  name: string;
  citation: string;
  year: number;
  court: string;
  summary: string;
  relevance: string;
}

export interface JurisdictionInfo {
  id: string;
  type: 'police_station' | 'court' | 'tribunal';
  name: string;
  address: string;
  jurisdiction: string;
  competentFor: string[];
  state: string;
  district: string;
}

export interface GovernmentDepartment {
  id: string;
  name: string;
  ministry: string;
  functions: string[];
  officers: GovernmentOfficer[];
  relevantActs: string[];
  contactInfo: string;
}

export interface GovernmentOfficer {
  designation: string;
  role: string;
  powers: string[];
  appointedUnder: string;
}

export interface DraftTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  template: string;
  requiredFields: string[];
  relatedSections: string[];
  icon: string;
}

// ===== COMPREHENSIVE LEGAL SECTIONS DATABASE =====
export const legalSections: LegalSection[] = [
  {
    id: 'ipc-302',
    code: 'IPC',
    section: '302',
    title: 'Murder',
    description: 'Punishment for murder. Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.',
    ingredients: [
      'Causing death of a human being',
      'The act was done with the intention of causing death',
      'Or with the intention of causing such bodily injury as the offender knows to be likely to cause death',
      'Or with the intention of causing bodily injury sufficient in the ordinary course of nature to cause death',
      'Or the act is so imminently dangerous that it must in all probability cause death or such bodily injury as is likely to cause death'
    ],
    punishment: 'Death or imprisonment for life, and fine',
    type: 'substantive',
    category: 'Offences Against Body',
    relatedSections: ['IPC 299', 'IPC 300', 'IPC 301', 'IPC 304'],
    caseLaws: [
      {
        name: 'Bachan Singh v. State of Punjab',
        citation: 'AIR 1980 SC 898',
        year: 1980,
        court: 'Supreme Court of India',
        summary: 'Death sentence should be imposed only in the rarest of rare cases. The court laid down guidelines for imposing death penalty.',
        relevance: 'Landmark case on sentencing in murder cases'
      },
      {
        name: 'Machhi Singh v. State of Punjab',
        citation: 'AIR 1983 SC 957',
        year: 1983,
        court: 'Supreme Court of India',
        summary: 'Further elaborated the rarest of rare doctrine and provided categories where death sentence may be appropriate.',
        relevance: 'Categories for death penalty consideration'
      }
    ]
  },
  {
    id: 'ipc-420',
    code: 'IPC',
    section: '420',
    title: 'Cheating and dishonestly inducing delivery of property',
    description: 'Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security.',
    ingredients: [
      'Deception of any person',
      'Fraudulent or dishonest inducement',
      'Delivery of property or alteration of valuable security',
      'Intention to cheat from the beginning',
      'The person deceived must have been induced to deliver property'
    ],
    punishment: 'Imprisonment up to 7 years and fine',
    type: 'substantive',
    category: 'Offences Against Property',
    relatedSections: ['IPC 415', 'IPC 417', 'IPC 418', 'IPC 421'],
    caseLaws: [
      {
        name: 'Hridaya Ranjan Prasad Verma v. State of Bihar',
        citation: '(2000) 4 SCC 168',
        year: 2000,
        court: 'Supreme Court of India',
        summary: 'Mere breach of contract cannot give rise to criminal prosecution for cheating unless fraudulent intention existed from the very beginning.',
        relevance: 'Distinction between civil breach and criminal cheating'
      },
      {
        name: 'Vimla v. Delhi Administration',
        citation: 'AIR 1963 SC 1572',
        year: 1963,
        court: 'Supreme Court of India',
        summary: 'For Section 420, deception must be practiced with dishonest intention at the time of making the promise.',
        relevance: 'Essential elements of cheating'
      }
    ]
  },
  {
    id: 'ipc-498a',
    code: 'IPC',
    section: '498A',
    title: 'Cruelty by Husband or Relatives',
    description: 'Whoever, being the husband or the relative of the husband of a woman, subjects such woman to cruelty shall be punished.',
    ingredients: [
      'The accused must be husband or relative of husband',
      'The woman must be subjected to cruelty',
      'Cruelty includes willful conduct likely to drive the woman to commit suicide',
      'Or cause grave injury or danger to life, limb or health (mental or physical)',
      'Harassment for dowry demand'
    ],
    punishment: 'Imprisonment up to 3 years and fine',
    type: 'substantive',
    category: 'Offences Against Women',
    relatedSections: ['IPC 304B', 'IPC 306', 'DV Act 2005'],
    caseLaws: [
      {
        name: 'Arnesh Kumar v. State of Bihar',
        citation: '(2014) 8 SCC 273',
        year: 2014,
        court: 'Supreme Court of India',
        summary: 'Supreme Court laid down guidelines that police should not automatically arrest in 498A cases. Magistrate should satisfy himself about the necessity of arrest.',
        relevance: 'Safeguards against misuse of 498A'
      },
      {
        name: 'Rajesh Sharma v. State of UP',
        citation: '(2017) 10 SCC 272',
        year: 2017,
        court: 'Supreme Court of India',
        summary: 'Family Welfare Committee to be constituted in every district to examine complaints under 498A before arrest.',
        relevance: 'Procedural safeguards in matrimonial disputes'
      }
    ]
  },
  {
    id: 'ipc-354',
    code: 'IPC',
    section: '354',
    title: 'Assault or criminal force to woman with intent to outrage her modesty',
    description: 'Whoever assaults or uses criminal force to any woman, intending to outrage or knowing it to be likely that he will thereby outrage her modesty.',
    ingredients: [
      'Assault or use of criminal force',
      'Against a woman',
      'Intention to outrage her modesty',
      'Or knowledge that modesty is likely to be outraged',
      'The act must be of such nature as would be perceived as outraging modesty'
    ],
    punishment: 'Imprisonment not less than 1 year extendable to 5 years and fine',
    type: 'substantive',
    category: 'Offences Against Women',
    relatedSections: ['IPC 354A', 'IPC 354B', 'IPC 354C', 'IPC 354D', 'IPC 509'],
    caseLaws: [
      {
        name: 'Vishaka v. State of Rajasthan',
        citation: 'AIR 1997 SC 3011',
        year: 1997,
        court: 'Supreme Court of India',
        summary: 'Guidelines for prevention of sexual harassment at workplace were laid down, which later became the basis for the POSH Act, 2013.',
        relevance: 'Foundational case for workplace safety of women'
      }
    ]
  },
  {
    id: 'ipc-376',
    code: 'IPC',
    section: '376',
    title: 'Punishment for Rape',
    description: 'Whoever commits rape shall be punished with rigorous imprisonment for a term not less than ten years, but which may extend to imprisonment for life and fine.',
    ingredients: [
      'Sexual intercourse with a woman',
      'Against her will or without her consent',
      'With consent obtained by putting her in fear of death or hurt',
      'With consent obtained by impersonation of husband',
      'When the woman is unable to communicate consent',
      'When the woman is under 18 years of age'
    ],
    punishment: 'RI not less than 10 years, extendable to life imprisonment and fine',
    type: 'substantive',
    category: 'Offences Against Women',
    relatedSections: ['IPC 375', 'IPC 376A', 'IPC 376B', 'IPC 376D', 'POCSO Act'],
    caseLaws: [
      {
        name: 'State of Punjab v. Gurmit Singh',
        citation: '(1996) 2 SCC 384',
        year: 1996,
        court: 'Supreme Court of India',
        summary: 'Court held that the testimony of the prosecutrix must be given paramount importance and corroboration is not a must.',
        relevance: 'Evidentiary standard in rape cases'
      }
    ]
  },
  {
    id: 'crpc-154',
    code: 'CrPC',
    section: '154',
    title: 'Information in cognizable cases (FIR)',
    description: 'Every information relating to the commission of a cognizable offence, if given orally to an officer in charge of a police station, shall be reduced to writing.',
    ingredients: [
      'Information relating to commission of cognizable offence',
      'Given to officer in charge of police station',
      'Must be reduced to writing if oral',
      'Must be read over to the informant',
      'Must be signed by the informant',
      'Substance to be entered in station diary',
      'Copy to be given to the informant free of cost'
    ],
    punishment: 'N/A - Procedural provision',
    type: 'procedural',
    category: 'Investigation',
    relatedSections: ['CrPC 155', 'CrPC 156', 'CrPC 157', 'CrPC 190'],
    caseLaws: [
      {
        name: 'Lalita Kumari v. Government of UP',
        citation: '(2014) 2 SCC 1',
        year: 2014,
        court: 'Supreme Court of India',
        summary: 'Registration of FIR is mandatory under Section 154 when information discloses commission of a cognizable offence. Police officer has no discretion.',
        relevance: 'Mandatory registration of FIR'
      },
      {
        name: 'State of Haryana v. Bhajan Lal',
        citation: '1992 Supp (1) SCC 335',
        year: 1992,
        court: 'Supreme Court of India',
        summary: 'Laid down categories where power under Section 482 CrPC can be exercised to quash FIR/complaint.',
        relevance: 'Quashing of FIR guidelines'
      }
    ]
  },
  {
    id: 'crpc-161',
    code: 'CrPC',
    section: '161',
    title: 'Examination of Witnesses by Police',
    description: 'Any police officer making an investigation may examine orally any person supposed to be acquainted with the facts and circumstances of the case.',
    ingredients: [
      'Examination by police officer during investigation',
      'Person acquainted with facts of the case',
      'Oral examination',
      'Person bound to answer all questions except self-incriminating ones',
      'Statement to be recorded in writing',
      'No oath administered'
    ],
    punishment: 'N/A - Procedural provision',
    type: 'procedural',
    category: 'Investigation',
    relatedSections: ['CrPC 162', 'CrPC 163', 'CrPC 164'],
    caseLaws: [
      {
        name: 'Tahsildar Singh v. State of UP',
        citation: 'AIR 1959 SC 1012',
        year: 1959,
        court: 'Supreme Court of India',
        summary: 'Statements recorded under Section 161 CrPC cannot be used as evidence but can be used for contradiction.',
        relevance: 'Evidentiary value of 161 statements'
      }
    ]
  },
  {
    id: 'crpc-41',
    code: 'CrPC',
    section: '41',
    title: 'When Police May Arrest Without Warrant',
    description: 'Any police officer may without an order from a Magistrate and without a warrant, arrest any person in specified circumstances.',
    ingredients: [
      'Person who has been concerned in any cognizable offence',
      'Against whom a reasonable complaint has been made',
      'Against whom credible information has been received',
      'Person found in possession of suspected stolen property',
      'Person who obstructs a police officer',
      'Person who has escaped lawful custody',
      'Satisfaction about necessity of arrest'
    ],
    punishment: 'N/A - Procedural provision',
    type: 'procedural',
    category: 'Arrest & Bail',
    relatedSections: ['CrPC 41A', 'CrPC 41B', 'CrPC 41C', 'CrPC 41D', 'CrPC 42'],
    caseLaws: [
      {
        name: 'DK Basu v. State of West Bengal',
        citation: 'AIR 1997 SC 610',
        year: 1997,
        court: 'Supreme Court of India',
        summary: 'Laid down 11 guidelines to be followed during arrest to prevent custodial violence and protect fundamental rights.',
        relevance: 'Rights of arrested persons'
      },
      {
        name: 'Joginder Kumar v. State of UP',
        citation: '(1994) 4 SCC 260',
        year: 1994,
        court: 'Supreme Court of India',
        summary: 'Arrest should be justified and not routine. Right to have someone informed of arrest.',
        relevance: 'Restrictions on police power of arrest'
      }
    ]
  },
  {
    id: 'crpc-125',
    code: 'CrPC',
    section: '125',
    title: 'Order for Maintenance of Wives, Children and Parents',
    description: 'If any person having sufficient means neglects or refuses to maintain his wife, children, or parents, a Magistrate of the first class may order maintenance.',
    ingredients: [
      'Person with sufficient means',
      'Neglect or refusal to maintain',
      'Wife unable to maintain herself',
      'Legitimate or illegitimate minor child',
      'Father or mother unable to maintain themselves',
      'Monthly allowance as Magistrate thinks fit'
    ],
    punishment: 'Maintenance allowance up to ₹500/month (enhanced by courts in practice)',
    type: 'procedural',
    category: 'Family Law',
    relatedSections: ['HMA Section 24', 'HMA Section 25', 'DV Act 2005'],
    caseLaws: [
      {
        name: 'Mohd. Ahmed Khan v. Shah Bano Begum',
        citation: 'AIR 1985 SC 945',
        year: 1985,
        court: 'Supreme Court of India',
        summary: 'A divorced Muslim woman is entitled to maintenance under Section 125 CrPC. Landmark case on secular maintenance law.',
        relevance: 'Maintenance rights across religions'
      }
    ]
  },
  {
    id: 'ipc-304b',
    code: 'IPC',
    section: '304B',
    title: 'Dowry Death',
    description: 'Where the death of a woman is caused by burns or bodily injury or occurs otherwise than under normal circumstances within seven years of her marriage and it is shown that soon before her death she was subjected to cruelty or harassment by her husband or any relative of her husband for, or in connection with, any demand for dowry.',
    ingredients: [
      'Death of a woman caused by burns/bodily injury/abnormal circumstances',
      'Within 7 years of her marriage',
      'Cruelty or harassment soon before death',
      'By husband or relative of husband',
      'In connection with demand for dowry',
      'Presumption of dowry death under Section 113B of Evidence Act'
    ],
    punishment: 'Imprisonment not less than 7 years extendable to life imprisonment',
    type: 'substantive',
    category: 'Offences Against Women',
    relatedSections: ['IPC 498A', 'IPC 306', 'Dowry Prohibition Act 1961', 'Evidence Act 113B'],
    caseLaws: [
      {
        name: 'Pawan Kumar v. State of Haryana',
        citation: '(1998) 3 SCC 309',
        year: 1998,
        court: 'Supreme Court of India',
        summary: 'The expression "soon before her death" cannot be given a restricted meaning. It must be shown that the cruelty was closely connected to the death.',
        relevance: 'Interpretation of "soon before death"'
      }
    ]
  },
  {
    id: 'ipc-406',
    code: 'IPC',
    section: '406',
    title: 'Criminal Breach of Trust',
    description: 'Whoever, being in any manner entrusted with property, or with any dominion over property, dishonestly misappropriates or converts to his own use that property.',
    ingredients: [
      'Entrustment of property or dominion over property',
      'The accused must be entrusted in some manner',
      'Dishonest misappropriation or conversion',
      'Using the property for own use',
      'In violation of any direction of law or legal contract'
    ],
    punishment: 'Imprisonment up to 3 years, or fine, or both',
    type: 'substantive',
    category: 'Offences Against Property',
    relatedSections: ['IPC 405', 'IPC 407', 'IPC 408', 'IPC 409'],
    caseLaws: [
      {
        name: 'Rashmi Kumar v. Mahesh Kumar Bhada',
        citation: '(1997) 2 SCC 397',
        year: 1997,
        court: 'Supreme Court of India',
        summary: 'Stridhan entrusted to husband amounts to entrustment under Section 405 IPC. Non-return constitutes criminal breach of trust.',
        relevance: 'Stridhan and criminal breach of trust'
      }
    ]
  },
  {
    id: 'crpc-482',
    code: 'CrPC',
    section: '482',
    title: 'Inherent Powers of High Court',
    description: 'Nothing in this Code shall be deemed to limit or affect the inherent powers of the High Court to make such orders as may be necessary to give effect to any order under this Code, or to prevent abuse of the process of any Court or otherwise to secure the ends of justice.',
    ingredients: [
      'Exercise of inherent powers by High Court',
      'To give effect to any order under CrPC',
      'To prevent abuse of process of court',
      'To secure the ends of justice',
      'Should be exercised sparingly and with caution'
    ],
    punishment: 'N/A - Procedural provision',
    type: 'procedural',
    category: 'Court Powers',
    relatedSections: ['CrPC 397', 'CrPC 401', 'Article 226', 'Article 227'],
    caseLaws: [
      {
        name: 'State of Haryana v. Bhajan Lal',
        citation: '1992 Supp (1) SCC 335',
        year: 1992,
        court: 'Supreme Court of India',
        summary: 'Seven categories where FIR can be quashed under Section 482 CrPC were laid down.',
        relevance: 'Guidelines for quashing proceedings'
      }
    ]
  },
  {
    id: 'rti-6',
    code: 'RTI Act',
    section: '6',
    title: 'Request for Obtaining Information',
    description: 'A person who desires to obtain any information under this Act shall make a request in writing or through electronic means to the Central/State Public Information Officer.',
    ingredients: [
      'Request in writing or electronic means',
      'To Central/State Public Information Officer',
      'Specify particulars of information sought',
      'Accompanied by prescribed fee',
      'No requirement to give reasons for requesting',
      'Transfer to concerned authority within 5 days if wrongly addressed'
    ],
    punishment: 'N/A - Right to Information',
    type: 'procedural',
    category: 'Right to Information',
    relatedSections: ['RTI Section 7', 'RTI Section 8', 'RTI Section 19'],
    caseLaws: [
      {
        name: 'CBSE v. Aditya Bandopadhyay',
        citation: '(2011) 8 SCC 497',
        year: 2011,
        court: 'Supreme Court of India',
        summary: 'RTI Act should not be used as a tool for oppression or personal vendetta. Information should serve public interest.',
        relevance: 'Scope and limitations of RTI'
      }
    ]
  },
  {
    id: 'cpc-9',
    code: 'CPC',
    section: '9',
    title: 'Courts to Try All Civil Suits',
    description: 'The Courts shall (subject to the provisions herein contained) have jurisdiction to try all suits of a civil nature excepting suits of which their cognizance is either expressly or impliedly barred.',
    ingredients: [
      'Suit of civil nature',
      'Court jurisdiction not expressly barred',
      'Court jurisdiction not impliedly barred',
      'Civil right must be claimed',
      'Right to property or status or office'
    ],
    punishment: 'N/A - Jurisdictional provision',
    type: 'procedural',
    category: 'Civil Jurisdiction',
    relatedSections: ['CPC Section 15', 'CPC Section 16', 'CPC Section 20'],
    caseLaws: [
      {
        name: 'Dhulabhai v. State of MP',
        citation: 'AIR 1969 SC 78',
        year: 1969,
        court: 'Supreme Court of India',
        summary: 'Laid down principles to determine when civil court jurisdiction is barred. Seven principles enumerated.',
        relevance: 'Bar of civil court jurisdiction'
      }
    ]
  },
  {
    id: 'ipc-34',
    code: 'IPC',
    section: '34',
    title: 'Acts Done by Several Persons in Furtherance of Common Intention',
    description: 'When a criminal act is done by several persons in furtherance of the common intention of all, each of such persons is liable for that act in the same manner as if it were done by him alone.',
    ingredients: [
      'Criminal act done by several persons',
      'In furtherance of common intention',
      'Pre-arranged plan or prior meeting of minds',
      'Participation in the criminal act',
      'Each person liable as if done individually'
    ],
    punishment: 'As per the substantive offence committed',
    type: 'substantive',
    category: 'General Principles',
    relatedSections: ['IPC 35', 'IPC 36', 'IPC 37', 'IPC 38', 'IPC 149'],
    caseLaws: [
      {
        name: 'Mahbub Shah v. Emperor',
        citation: 'AIR 1945 PC 118',
        year: 1945,
        court: 'Privy Council',
        summary: 'Common intention implies pre-arranged plan and prior meeting of minds. It must be proven that the criminal act was done pursuant to pre-arranged plan.',
        relevance: 'Definition of common intention'
      }
    ]
  },
  {
    id: 'con-art21',
    code: 'Constitution',
    section: 'Article 21',
    title: 'Protection of Life and Personal Liberty',
    description: 'No person shall be deprived of his life or personal liberty except according to procedure established by law.',
    ingredients: [
      'Right to life',
      'Right to personal liberty',
      'Procedure established by law must be followed',
      'Procedure must be just, fair and reasonable',
      'Includes right to livelihood, dignity, privacy, health, education'
    ],
    punishment: 'N/A - Fundamental Right',
    type: 'substantive',
    category: 'Fundamental Rights',
    relatedSections: ['Article 14', 'Article 19', 'Article 22', 'Article 32'],
    caseLaws: [
      {
        name: 'Maneka Gandhi v. Union of India',
        citation: 'AIR 1978 SC 597',
        year: 1978,
        court: 'Supreme Court of India',
        summary: 'Procedure under Article 21 must be just, fair and reasonable. Expanded the scope of Article 21 significantly.',
        relevance: 'Expanded interpretation of life and liberty'
      },
      {
        name: 'KS Puttaswamy v. Union of India',
        citation: '(2017) 10 SCC 1',
        year: 2017,
        court: 'Supreme Court of India',
        summary: 'Right to privacy is a fundamental right under Article 21. Nine-judge bench unanimous decision.',
        relevance: 'Right to privacy as fundamental right'
      }
    ]
  }
];

// ===== JURISDICTION DATABASE =====
export const jurisdictionData: JurisdictionInfo[] = [
  {
    id: 'ps-1',
    type: 'police_station',
    name: 'Connaught Place Police Station',
    address: 'Connaught Place, New Delhi - 110001',
    jurisdiction: 'Connaught Place, Barakhamba Road, Janpath area',
    competentFor: ['Cognizable offences', 'Non-cognizable offences', 'FIR registration', 'Patrolling'],
    state: 'Delhi',
    district: 'New Delhi'
  },
  {
    id: 'ps-2',
    type: 'police_station',
    name: 'Saket Police Station',
    address: 'Saket, New Delhi - 110017',
    jurisdiction: 'Saket, Malviya Nagar, Hauz Khas area',
    competentFor: ['Cognizable offences', 'Non-cognizable offences', 'Cyber crimes', 'Women cell'],
    state: 'Delhi',
    district: 'South Delhi'
  },
  {
    id: 'ps-3',
    type: 'police_station',
    name: 'Andheri Police Station',
    address: 'Andheri West, Mumbai - 400058',
    jurisdiction: 'Andheri West, Versova, Four Bungalows area',
    competentFor: ['Cognizable offences', 'FIR registration', 'Economic offences'],
    state: 'Maharashtra',
    district: 'Mumbai Suburban'
  },
  {
    id: 'ps-4',
    type: 'police_station',
    name: 'Kotwali Police Station',
    address: 'Chowk, Lucknow - 226003',
    jurisdiction: 'Chowk, Aminabad, Husainabad area',
    competentFor: ['Cognizable offences', 'Non-cognizable offences', 'FIR registration'],
    state: 'Uttar Pradesh',
    district: 'Lucknow'
  },
  {
    id: 'court-1',
    type: 'court',
    name: 'Patiala House Courts',
    address: 'India Gate, New Delhi - 110001',
    jurisdiction: 'New Delhi District',
    competentFor: ['Criminal cases', 'Civil suits', 'Motor accident claims', 'Family disputes'],
    state: 'Delhi',
    district: 'New Delhi'
  },
  {
    id: 'court-2',
    type: 'court',
    name: 'Saket District Court',
    address: 'Saket, New Delhi - 110017',
    jurisdiction: 'South Delhi District',
    competentFor: ['Criminal cases', 'Civil suits', 'Consumer disputes', 'Rent matters'],
    state: 'Delhi',
    district: 'South Delhi'
  },
  {
    id: 'court-3',
    type: 'court',
    name: 'Bombay City Civil Court',
    address: 'Fort, Mumbai - 400001',
    jurisdiction: 'Mumbai City and Suburban',
    competentFor: ['Civil suits', 'Commercial disputes', 'Company matters'],
    state: 'Maharashtra',
    district: 'Mumbai'
  },
  {
    id: 'court-4',
    type: 'court',
    name: 'Chief Judicial Magistrate Court',
    address: 'Collectorate Compound, Lucknow',
    jurisdiction: 'Lucknow District',
    competentFor: ['Criminal cases', 'Bail applications', 'Remand matters'],
    state: 'Uttar Pradesh',
    district: 'Lucknow'
  },
  {
    id: 'tribunal-1',
    type: 'tribunal',
    name: 'National Consumer Disputes Redressal Commission',
    address: 'Janpath, New Delhi - 110001',
    jurisdiction: 'Pan India (Claims above ₹10 crore)',
    competentFor: ['Consumer complaints above ₹10 crore', 'Appeals from State Commission'],
    state: 'Delhi',
    district: 'New Delhi'
  },
  {
    id: 'tribunal-2',
    type: 'tribunal',
    name: 'National Green Tribunal',
    address: 'Faridkot House, New Delhi',
    jurisdiction: 'Pan India - Environmental matters',
    competentFor: ['Environmental disputes', 'Pollution matters', 'Forest conservation'],
    state: 'Delhi',
    district: 'New Delhi'
  }
];

// ===== GOVERNMENT DEPARTMENTS DATABASE =====
export const governmentDepartments: GovernmentDepartment[] = [
  {
    id: 'dept-1',
    name: 'District Collector / District Magistrate Office',
    ministry: 'Ministry of Home Affairs / State Government',
    functions: [
      'Revenue administration', 'Law and order', 'Disaster management',
      'Land records management', 'Election management', 'Census',
      'Issuance of arms licenses', 'Maintenance of essential services'
    ],
    officers: [
      { designation: 'District Collector/Magistrate', role: 'Head of district administration', powers: ['Revenue powers', 'Magisterial powers', 'Executive powers'], appointedUnder: 'IAS cadre rules' },
      { designation: 'Additional District Magistrate', role: 'Assists DC in administration', powers: ['Delegated magisterial powers'], appointedUnder: 'State Service Rules' },
      { designation: 'Sub-Divisional Magistrate', role: 'Sub-division administration', powers: ['Revenue powers within sub-division'], appointedUnder: 'State Service Rules' },
      { designation: 'Tehsildar', role: 'Tehsil level revenue officer', powers: ['Land records', 'Revenue collection'], appointedUnder: 'State Revenue Code' }
    ],
    relevantActs: ['CrPC', 'Revenue Code', 'Disaster Management Act 2005', 'Arms Act 1959'],
    contactInfo: 'Available at respective district collectorate'
  },
  {
    id: 'dept-2',
    name: 'Superintendent of Police Office',
    ministry: 'Ministry of Home Affairs / State Government',
    functions: [
      'Law and order maintenance', 'Crime investigation', 'Traffic management',
      'VIP security', 'Anti-terrorism', 'Cyber crime prevention',
      'Women safety', 'Community policing'
    ],
    officers: [
      { designation: 'Superintendent of Police', role: 'Head of district police', powers: ['Investigation supervision', 'Law and order'], appointedUnder: 'Police Act 1861' },
      { designation: 'Additional SP', role: 'Assists SP', powers: ['Delegated police powers'], appointedUnder: 'Police Act 1861' },
      { designation: 'Circle Officer/DSP', role: 'Circle level policing', powers: ['Circle level investigation'], appointedUnder: 'Police Act 1861' },
      { designation: 'Station House Officer', role: 'Police station head', powers: ['FIR registration', 'Investigation', 'Arrest'], appointedUnder: 'Police Act / CrPC' }
    ],
    relevantActs: ['Police Act 1861', 'CrPC 1973', 'IPC 1860', 'NDPS Act', 'IT Act 2000'],
    contactInfo: 'Dial 100 for emergency, SP office at district headquarters'
  },
  {
    id: 'dept-3',
    name: 'Municipal Corporation',
    ministry: 'Ministry of Urban Development / State Government',
    functions: [
      'Urban planning', 'Building permissions', 'Water supply',
      'Sewage management', 'Solid waste management', 'Road construction',
      'Birth and death registration', 'Property tax collection',
      'Trade licensing', 'Encroachment removal'
    ],
    officers: [
      { designation: 'Municipal Commissioner', role: 'Head of municipal administration', powers: ['Administrative powers', 'Financial powers'], appointedUnder: 'Municipal Corporation Act' },
      { designation: 'Additional Commissioner', role: 'Assists Commissioner', powers: ['Delegated powers'], appointedUnder: 'Municipal Corporation Act' },
      { designation: 'Zonal Officer', role: 'Zone level administration', powers: ['Zone level approvals'], appointedUnder: 'Municipal Corporation Act' },
      { designation: 'Building Inspector', role: 'Building plan approvals', powers: ['Inspection', 'Approval/Rejection'], appointedUnder: 'Building Bylaws' }
    ],
    relevantActs: ['Municipal Corporation Act', 'Town Planning Act', 'Building Bylaws', 'Environment Protection Act'],
    contactInfo: 'Available at respective Municipal Corporation office'
  },
  {
    id: 'dept-4',
    name: 'Labour Department',
    ministry: 'Ministry of Labour and Employment',
    functions: [
      'Implementation of labour laws', 'Industrial disputes resolution',
      'Minimum wages enforcement', 'Factory inspection',
      'Workers compensation', 'EPFO management',
      'Occupational safety', 'Child labour prevention'
    ],
    officers: [
      { designation: 'Labour Commissioner', role: 'Head of labour administration', powers: ['Adjudicatory powers', 'Inspection powers'], appointedUnder: 'Industrial Disputes Act' },
      { designation: 'Assistant Labour Commissioner', role: 'Conciliation officer', powers: ['Conciliation in industrial disputes'], appointedUnder: 'Industrial Disputes Act' },
      { designation: 'Factory Inspector', role: 'Factory inspection and compliance', powers: ['Inspection', 'Prosecution'], appointedUnder: 'Factories Act 1948' },
      { designation: 'EPFO Commissioner', role: 'Provident fund management', powers: ['PF determination', 'Recovery'], appointedUnder: 'EPF Act 1952' }
    ],
    relevantActs: ['Industrial Disputes Act 1947', 'Factories Act 1948', 'Minimum Wages Act 1948', 'Payment of Wages Act 1936', 'Code on Wages 2019'],
    contactInfo: 'Labour Commissioner office at state/district level'
  },
  {
    id: 'dept-5',
    name: 'Revenue Department',
    ministry: 'Ministry of Finance / State Revenue Department',
    functions: [
      'Land revenue collection', 'Land records maintenance',
      'Land mutation', 'Land acquisition', 'Stamp duty collection',
      'Registration of documents', 'Settlement operations',
      'Land ceiling matters'
    ],
    officers: [
      { designation: 'Commissioner Land Records', role: 'Head of revenue records', powers: ['Revenue administration'], appointedUnder: 'Revenue Code' },
      { designation: 'Collector', role: 'District revenue head', powers: ['Revenue collection', 'Land acquisition'], appointedUnder: 'Revenue Code' },
      { designation: 'Sub-Registrar', role: 'Document registration', powers: ['Registration of documents'], appointedUnder: 'Registration Act 1908' },
      { designation: 'Patwari/Lekhpal', role: 'Village level records', powers: ['Land records maintenance'], appointedUnder: 'Revenue Code' }
    ],
    relevantActs: ['Transfer of Property Act 1882', 'Registration Act 1908', 'Indian Stamp Act 1899', 'RFCTLARR Act 2013', 'State Revenue Code'],
    contactInfo: 'Collectorate / Tehsil office'
  },
  {
    id: 'dept-6',
    name: 'Women & Child Development Department',
    ministry: 'Ministry of Women and Child Development',
    functions: [
      'Women empowerment schemes', 'Child welfare programs',
      'Protection from domestic violence', 'ICDS implementation',
      'Women helpline (181)', 'One Stop Centre management',
      'Dowry prohibition enforcement', 'Child protection'
    ],
    officers: [
      { designation: 'District Women Protection Officer', role: 'DV Act implementation', powers: ['Filing applications under DV Act', 'Shelter assistance'], appointedUnder: 'Protection of Women from DV Act 2005' },
      { designation: 'Child Development Project Officer', role: 'ICDS management', powers: ['Program implementation'], appointedUnder: 'ICDS scheme' },
      { designation: 'Protection Officer', role: 'DV Act implementation', powers: ['Assist aggrieved women', 'File DIR'], appointedUnder: 'DV Act 2005' }
    ],
    relevantActs: ['DV Act 2005', 'Dowry Prohibition Act 1961', 'POCSO Act 2012', 'JJ Act 2015', 'PCPNDT Act 1994'],
    contactInfo: 'Women Helpline: 181, Child Helpline: 1098'
  },
  {
    id: 'dept-7',
    name: 'Public Information Officer (PIO)',
    ministry: 'All Ministries / Departments',
    functions: [
      'Receiving RTI applications', 'Providing information under RTI Act',
      'Transferring requests to concerned departments',
      'Maintaining records for public access',
      'Responding within 30 days',
      'Handling first appeals'
    ],
    officers: [
      { designation: 'Central Public Information Officer (CPIO)', role: 'RTI nodal officer at central level', powers: ['Provide information', 'Reject with reasons'], appointedUnder: 'RTI Act 2005 Section 5' },
      { designation: 'State Public Information Officer (SPIO)', role: 'RTI nodal officer at state level', powers: ['Provide information', 'Transfer applications'], appointedUnder: 'RTI Act 2005 Section 5' },
      { designation: 'First Appellate Authority', role: 'First appeal officer', powers: ['Review PIO decisions', 'Direct disclosure'], appointedUnder: 'RTI Act 2005 Section 19(1)' },
      { designation: 'Central/State Information Commissioner', role: 'Second appeal and complaints', powers: ['Penalty imposition', 'Direction to disclose'], appointedUnder: 'RTI Act 2005 Section 12/15' }
    ],
    relevantActs: ['Right to Information Act 2005', 'Official Secrets Act 1923'],
    contactInfo: 'Respective department PIO office'
  }
];

// ===== DRAFT TEMPLATES =====
export const draftTemplates: DraftTemplate[] = [
  {
    id: 'draft-legal-notice',
    name: 'Legal Notice',
    category: 'Notices',
    description: 'Standard legal notice format under various acts',
    icon: '📜',
    requiredFields: ['senderName', 'senderAddress', 'recipientName', 'recipientAddress', 'subject', 'facts', 'demand', 'timeLimit'],
    relatedSections: ['CPC Section 80', 'Specific Relief Act', 'Transfer of Property Act'],
    template: `LEGAL NOTICE

Date: {{date}}
Through: {{advocateName}}, Advocate
{{advocateAddress}}
Enrolment No: {{enrolmentNo}}

To,
{{recipientName}}
{{recipientAddress}}

Subject: Legal Notice under {{relevantAct}} regarding {{subject}}

Sir/Madam,

Under instructions from and on behalf of my client {{senderName}}, S/o / D/o {{fatherName}}, R/o {{senderAddress}}, I serve upon you the following Legal Notice:

1. FACTS:
{{facts}}

2. CAUSE OF ACTION:
{{causeOfAction}}

3. LEGAL PROVISIONS:
That the above acts/omissions on your part constitute violation of the provisions of {{relevantSections}} and my client is entitled to the relief of {{reliefSought}}.

4. DEMAND:
You are hereby called upon to {{demand}} within {{timeLimit}} days from the receipt of this notice, failing which my client shall be constrained to initiate appropriate legal proceedings against you, both civil and criminal, at your risk and cost.

5. That the cost of this notice amounting to Rs. {{noticeCost}}/- be borne by you.

You are advised to take this notice seriously and comply with the demand herein.

{{advocateName}}
Advocate
Enrolment No: {{enrolmentNo}}`
  },
  {
    id: 'draft-rti',
    name: 'RTI Application',
    category: 'RTI',
    description: 'Application under Right to Information Act, 2005',
    icon: '📋',
    requiredFields: ['applicantName', 'applicantAddress', 'pioDesignation', 'department', 'informationSought'],
    relatedSections: ['RTI Act Section 6', 'RTI Act Section 7', 'RTI Act Section 8'],
    template: `APPLICATION UNDER RIGHT TO INFORMATION ACT, 2005

To,
The Public Information Officer,
{{department}},
{{departmentAddress}}

Subject: Request for Information under RTI Act, 2005

Sir/Madam,

I, {{applicantName}}, S/o / D/o {{fatherName}}, R/o {{applicantAddress}}, do hereby request the following information under Section 6 of the Right to Information Act, 2005:

INFORMATION SOUGHT:
{{informationSought}}

PERIOD: {{period}}

I am enclosing herewith:
1. Application fee of Rs. 10/- (Ten Rupees Only) by way of {{paymentMode}}
2. {{bplStatus}}

I declare that I am a citizen of India and the information sought does not relate to any matter falling under Section 8 of the RTI Act, 2005.

Kindly provide the above information within the statutory period of 30 days as prescribed under Section 7(1) of the RTI Act, 2005.

If the information sought or a part thereof falls within the jurisdiction of another public authority, kindly transfer the application to such authority under Section 6(3) of the Act within 5 days.

Place: {{place}}
Date: {{date}}

{{applicantName}}
{{applicantAddress}}
Phone: {{phone}}
Email: {{email}}`
  },
  {
    id: 'draft-bail',
    name: 'Bail Application',
    category: 'Criminal',
    description: 'Application for regular bail under CrPC',
    icon: '⚖️',
    requiredFields: ['accusedName', 'fatherName', 'address', 'firNumber', 'policeStation', 'sections', 'dateOfArrest', 'grounds'],
    relatedSections: ['CrPC Section 437', 'CrPC Section 439', 'CrPC Section 436'],
    template: `IN THE COURT OF {{courtName}}
AT {{courtPlace}}

Criminal Misc. Application No. ___/{{year}}

IN THE MATTER OF:
{{accusedName}}                                    ...Applicant/Accused

VERSUS

State of {{state}}                                 ...Respondent

APPLICATION FOR REGULAR BAIL UNDER SECTION {{bailSection}} OF CrPC

MOST RESPECTFULLY SHOWETH:

1. That the applicant/accused has been arrested in FIR No. {{firNumber}} dated {{firDate}} registered at Police Station {{policeStation}}, District {{district}}, under Sections {{sections}} of IPC.

2. That the applicant was arrested on {{dateOfArrest}} and has been in judicial custody since {{custodyDate}}.

3. BRIEF FACTS:
{{briefFacts}}

4. GROUNDS FOR BAIL:
{{grounds}}

a) That the applicant is not a flight risk and has deep roots in the society.
b) That the investigation is complete and chargesheet has been/is yet to be filed.
c) That the applicant is willing to cooperate with the investigation.
d) That the applicant is ready to furnish bail bonds and sureties.
e) That continued detention of the applicant is not necessary.
f) That there is no likelihood of the applicant tampering with evidence or influencing witnesses.

5. That the applicant undertakes to:
   a) Not leave the jurisdiction without permission of this Court
   b) Mark attendance at the Police Station as directed
   c) Not tamper with evidence or influence witnesses
   d) Appear before the Court on each date of hearing

PRAYER:
It is, therefore, most respectfully prayed that this Hon'ble Court may graciously be pleased to:
a) Release the applicant on regular bail in FIR No. {{firNumber}}
b) Pass any other order which this Court deems fit and proper in the interest of justice.

AND FOR THIS ACT OF KINDNESS, THE APPLICANT SHALL EVER PRAY.

APPLICANT
Through

{{advocateName}}
Advocate
Enrolment No: {{enrolmentNo}}`
  },
  {
    id: 'draft-writ',
    name: 'Writ Petition',
    category: 'Constitutional',
    description: 'Writ Petition under Article 226/32 of the Constitution',
    icon: '🏛️',
    requiredFields: ['petitionerName', 'respondentName', 'article', 'writType', 'facts', 'prayer'],
    relatedSections: ['Article 32', 'Article 226', 'Article 14', 'Article 19', 'Article 21'],
    template: `IN THE HON'BLE HIGH COURT OF {{highCourt}}
{{bench}} BENCH

Writ Petition (Civil/Criminal) No. ___/{{year}}

IN THE MATTER OF:
{{petitionerName}}                                  ...Petitioner

VERSUS

{{respondentName}}                                  ...Respondent(s)

WRIT PETITION UNDER ARTICLE {{article}} OF THE CONSTITUTION OF INDIA FOR ISSUANCE OF WRIT OF {{writType}}

TO,
THE HON'BLE CHIEF JUSTICE AND HIS COMPANION JUSTICES OF THE HIGH COURT OF {{highCourt}}

THE HUMBLE PETITION OF THE PETITIONER ABOVE NAMED

MOST RESPECTFULLY SHOWETH:

1. PARTIES:
{{parties}}

2. FACTS OF THE CASE:
{{facts}}

3. GROUNDS:
{{grounds}}

4. CAUSE OF ACTION:
{{causeOfAction}}

5. FUNDAMENTAL RIGHTS VIOLATED:
{{fundamentalRights}}

6. NO OTHER REMEDY:
That the petitioner has no other efficacious remedy except to approach this Hon'ble Court under Article {{article}} of the Constitution of India.

PRAYER:
In the premises aforesaid, it is most respectfully prayed that this Hon'ble Court may graciously be pleased to:
{{prayer}}

AND FOR THIS ACT OF KINDNESS, THE PETITIONER SHALL EVER PRAY.

PETITIONER
Through

{{advocateName}}
Advocate
Enrolment No: {{enrolmentNo}}`
  },
  {
    id: 'draft-complaint',
    name: 'Criminal Complaint',
    category: 'Criminal',
    description: 'Criminal complaint to be filed before Magistrate under Section 200 CrPC',
    icon: '🔨',
    requiredFields: ['complainantName', 'accusedName', 'facts', 'sections', 'evidence'],
    relatedSections: ['CrPC Section 200', 'CrPC Section 202', 'CrPC Section 204'],
    template: `IN THE COURT OF {{courtName}}
AT {{courtPlace}}

Complaint Case No. ___/{{year}}

IN THE MATTER OF:
{{complainantName}}                                 ...Complainant

VERSUS

{{accusedName}}                                     ...Accused

COMPLAINT UNDER SECTION 200 OF CrPC READ WITH SECTIONS {{sections}} OF IPC

MOST RESPECTFULLY SHOWETH:

1. That the complainant is {{complainantDescription}}.

2. That the accused is {{accusedDescription}}.

3. FACTS OF THE COMPLAINT:
{{facts}}

4. That the acts of the accused constitute offences punishable under Sections {{sections}} of IPC.

5. EVIDENCE:
{{evidence}}

6. That the cause of action arose on {{causeOfActionDate}} at {{place}}.

7. That this complaint is being filed within the period of limitation.

PRAYER:
It is, therefore, most respectfully prayed that this Hon'ble Court may:
a) Take cognizance of the offences under Sections {{sections}} of IPC
b) Summon the accused and try them according to law
c) Pass any other order as this Court deems fit

AND FOR THIS ACT OF KINDNESS, THE COMPLAINANT SHALL EVER PRAY.

VERIFICATION:
I, {{complainantName}}, do hereby verify that the contents of this complaint are true and correct to the best of my knowledge and belief.

{{complainantName}}
Through
{{advocateName}}, Advocate`
  },
  {
    id: 'draft-consumer',
    name: 'Consumer Complaint',
    category: 'Consumer',
    description: 'Complaint under Consumer Protection Act, 2019',
    icon: '🛒',
    requiredFields: ['complainantName', 'oppositeParty', 'productService', 'deficiency', 'compensation'],
    relatedSections: ['Consumer Protection Act Section 35', 'Section 2(6)', 'Section 2(7)'],
    template: `BEFORE THE DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION
{{district}}, {{state}}

Consumer Complaint No. ___/{{year}}

IN THE MATTER OF:
{{complainantName}}                                 ...Complainant

VERSUS

{{oppositeParty}}                                   ...Opposite Party

CONSUMER COMPLAINT UNDER SECTION 35 OF THE CONSUMER PROTECTION ACT, 2019

1. That the complainant is a consumer as defined under Section 2(7) of the Consumer Protection Act, 2019.

2. That the opposite party is engaged in {{business}} and is amenable to the jurisdiction of this Forum.

3. FACTS:
{{facts}}

4. DEFICIENCY IN SERVICE / DEFECT IN GOODS:
{{deficiency}}

5. That the complainant has suffered loss of Rs. {{lossAmount}}/- on account of the above deficiency/defect.

6. RELIEF SOUGHT:
a) Compensation of Rs. {{compensation}}/- for mental agony and harassment
b) Refund of Rs. {{refundAmount}}/-
c) Cost of litigation Rs. {{litigationCost}}/-

PRAYER:
{{prayer}}

{{complainantName}}
Through
{{advocateName}}, Advocate`
  },
  {
    id: 'draft-divorce',
    name: 'Divorce Petition',
    category: 'Family',
    description: 'Petition for divorce under Hindu Marriage Act / Special Marriage Act',
    icon: '💔',
    requiredFields: ['petitionerName', 'respondentName', 'marriageDate', 'grounds', 'children'],
    relatedSections: ['HMA Section 13', 'HMA Section 13B', 'Special Marriage Act Section 27'],
    template: `IN THE COURT OF FAMILY JUDGE / DISTRICT JUDGE
{{district}}

HMA Petition No. ___/{{year}}

{{petitionerName}}                                  ...Petitioner

VERSUS

{{respondentName}}                                  ...Respondent

PETITION FOR DISSOLUTION OF MARRIAGE UNDER SECTION {{section}} OF {{act}}

MOST RESPECTFULLY SHOWETH:

1. That the petitioner and the respondent were married on {{marriageDate}} at {{marriagePlace}}.

2. That the marriage was solemnized as per {{marriageRites}}.

3. That out of the wedlock, {{children}} child(ren) were born.

4. FACTS:
{{facts}}

5. GROUNDS FOR DIVORCE:
{{grounds}}

6. That the petitioner has no other remedy except to seek dissolution of marriage.

PRAYER:
a) Decree of divorce dissolving the marriage
b) Custody of children
c) Permanent alimony / maintenance
d) Any other relief

{{petitionerName}}
Through
{{advocateName}}, Advocate`
  },
  {
    id: 'draft-anticipatory-bail',
    name: 'Anticipatory Bail Application',
    category: 'Criminal',
    description: 'Application for anticipatory bail under Section 438 CrPC',
    icon: '🛡️',
    requiredFields: ['applicantName', 'firDetails', 'sections', 'grounds'],
    relatedSections: ['CrPC Section 438', 'Article 21', 'Article 22'],
    template: `IN THE HON'BLE HIGH COURT OF {{highCourt}} / COURT OF SESSIONS
AT {{courtPlace}}

Criminal Misc. Anticipatory Bail Application No. ___/{{year}}

{{applicantName}}                                   ...Applicant

VERSUS

State of {{state}}                                  ...Respondent

APPLICATION FOR ANTICIPATORY BAIL UNDER SECTION 438 CrPC

1. That the applicant apprehends arrest in FIR No. {{firNumber}} / on the basis of complaint dated {{complaintDate}}.

2. BRIEF FACTS:
{{facts}}

3. That the apprehension of arrest is based on:
{{apprehension}}

4. GROUNDS:
{{grounds}}

PRAYER:
That this Hon'ble Court may direct that in the event of arrest, the applicant shall be released on bail.

{{applicantName}}
Through
{{advocateName}}, Advocate`
  },
  {
    id: 'draft-police-complaint',
    name: 'Police Complaint / FIR',
    category: 'Criminal',
    description: 'Written complaint to police for FIR registration',
    icon: '🚔',
    requiredFields: ['complainantName', 'accusedName', 'incident', 'dateTime', 'place'],
    relatedSections: ['CrPC Section 154', 'CrPC Section 155', 'CrPC Section 156'],
    template: `To,
The Station House Officer,
{{policeStation}},
{{district}}, {{state}}

Subject: Written complaint for registration of FIR

Sir/Madam,

I, {{complainantName}}, S/o / D/o {{fatherName}}, aged {{age}} years, R/o {{address}}, do hereby lodge the following complaint:

DATE & TIME OF INCIDENT: {{dateTime}}
PLACE OF OCCURRENCE: {{place}}

ACCUSED PERSONS:
{{accusedDetails}}

FACTS OF THE INCIDENT:
{{incident}}

WITNESSES:
{{witnesses}}

PROPERTY LOST/DAMAGED (if any):
{{property}}

I request you to kindly register an FIR under appropriate sections of law and investigate the matter.

I certify that the above facts are true and correct to my knowledge and belief.

Date: {{date}}
Place: {{place}}

{{complainantName}}
(Complainant)
Phone: {{phone}}`
  },
  {
    id: 'draft-civil-suit',
    name: 'Civil Suit (Plaint)',
    category: 'Civil',
    description: 'Plaint for filing civil suit under CPC',
    icon: '📄',
    requiredFields: ['plaintiffName', 'defendantName', 'causeOfAction', 'relief', 'valuation'],
    relatedSections: ['CPC Order VII', 'CPC Section 26', 'CPC Section 9'],
    template: `IN THE COURT OF {{courtName}}
AT {{courtPlace}}

Civil Suit No. ___/{{year}}

{{plaintiffName}}                                   ...Plaintiff

VERSUS

{{defendantName}}                                   ...Defendant(s)

SUIT FOR {{suitType}}

The plaintiff above named most respectfully submits as under:

1. That the plaintiff is {{plaintiffDescription}}.
2. That the defendant is {{defendantDescription}}.

3. FACTS:
{{facts}}

4. CAUSE OF ACTION:
{{causeOfAction}}

5. JURISDICTION:
That this Hon'ble Court has jurisdiction to try this suit as the cause of action arose within its territorial jurisdiction.

6. VALUATION:
That the suit is valued at Rs. {{valuation}}/- for the purpose of court fee and jurisdiction.

7. COURT FEE:
Court fee of Rs. {{courtFee}}/- is affixed.

8. LIMITATION:
That the suit is within limitation.

PRAYER:
{{prayer}}

PLAINTIFF
Through
{{advocateName}}, Advocate`
  }
];

// ===== SITUATION CATEGORIES FOR REAL-TIME SECTION MAPPING =====
export interface SituationCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  substantiveSections: { section: string; description: string }[];
  proceduralSections: { section: string; description: string }[];
  relevantDrafts: string[];
  competentAuthority: string[];
  futureApplications: { name: string; timeline: string; description: string }[];
}

export const situationCategories: SituationCategory[] = [
  {
    id: 'sit-theft',
    name: 'Theft / Robbery / Burglary',
    description: 'Property offences involving taking of movable property',
    icon: '🔓',
    substantiveSections: [
      { section: 'IPC 378', description: 'Theft - Dishonest taking of movable property' },
      { section: 'IPC 379', description: 'Punishment for theft - 3 years or fine or both' },
      { section: 'IPC 380', description: 'Theft in dwelling house - 7 years and fine' },
      { section: 'IPC 381', description: 'Theft by clerk/servant - 7 years and fine' },
      { section: 'IPC 390', description: 'Robbery - Theft with force/fear' },
      { section: 'IPC 392', description: 'Punishment for robbery - 10 years RI and fine' },
      { section: 'IPC 394', description: 'Voluntarily causing hurt in robbery' },
      { section: 'IPC 395', description: 'Dacoity - Robbery by 5 or more persons' },
      { section: 'IPC 397', description: 'Robbery with attempt to cause death' },
      { section: 'IPC 411', description: 'Dishonestly receiving stolen property' },
      { section: 'IPC 414', description: 'Assisting in concealment of stolen property' }
    ],
    proceduralSections: [
      { section: 'CrPC 154', description: 'FIR Registration' },
      { section: 'CrPC 155', description: 'Non-cognizable offence report' },
      { section: 'CrPC 156', description: 'Police investigation powers' },
      { section: 'CrPC 41', description: 'Arrest without warrant' },
      { section: 'CrPC 93', description: 'Search warrant for stolen property' },
      { section: 'CrPC 102', description: 'Power of police to seize property' },
      { section: 'CrPC 437', description: 'Bail in non-bailable offences' },
      { section: 'CrPC 457', description: 'Restoration of seized property' }
    ],
    relevantDrafts: ['draft-police-complaint', 'draft-bail', 'draft-complaint'],
    competentAuthority: ['SHO of concerned Police Station', 'Judicial Magistrate First Class', 'Sessions Judge (for robbery/dacoity)'],
    futureApplications: [
      { name: 'FIR/Complaint', timeline: 'Immediately', description: 'Lodge FIR at nearest police station' },
      { name: 'Application for recovery of property', timeline: 'Within 7 days', description: 'Application to police/court for recovery' },
      { name: 'Bail application (if accused)', timeline: 'After arrest', description: 'Regular bail application' },
      { name: 'Protest petition (if FIR refused)', timeline: 'Within 30 days', description: 'Protest petition before Magistrate under Section 156(3)' },
      { name: 'Revision petition', timeline: 'Within 90 days', description: 'Revision against adverse orders' }
    ]
  },
  {
    id: 'sit-domestic',
    name: 'Domestic Violence / Matrimonial Dispute',
    description: 'Cases involving domestic violence, dowry harassment, and marital disputes',
    icon: '🏠',
    substantiveSections: [
      { section: 'IPC 498A', description: 'Cruelty by husband or relatives' },
      { section: 'IPC 304B', description: 'Dowry death' },
      { section: 'IPC 306', description: 'Abetment of suicide' },
      { section: 'IPC 406', description: 'Criminal breach of trust (Stridhan)' },
      { section: 'IPC 323', description: 'Voluntarily causing hurt' },
      { section: 'IPC 354', description: 'Assault to outrage modesty' },
      { section: 'IPC 506', description: 'Criminal intimidation' },
      { section: 'DV Act Section 3', description: 'Definition of domestic violence' },
      { section: 'DV Act Section 12', description: 'Application to Magistrate' },
      { section: 'Dowry Prohibition Act Section 3', description: 'Penalty for giving/taking dowry' },
      { section: 'Dowry Prohibition Act Section 4', description: 'Penalty for demanding dowry' }
    ],
    proceduralSections: [
      { section: 'CrPC 154', description: 'FIR Registration' },
      { section: 'CrPC 125', description: 'Order for maintenance' },
      { section: 'CrPC 498A Procedure', description: 'Cognizable, non-bailable, non-compoundable' },
      { section: 'DV Act Section 18-22', description: 'Protection, residence, monetary relief orders' },
      { section: 'HMA Section 24', description: 'Interim maintenance during proceedings' },
      { section: 'HMA Section 13', description: 'Grounds for divorce' },
      { section: 'CrPC 41A', description: 'Notice of appearance before arrest' }
    ],
    relevantDrafts: ['draft-police-complaint', 'draft-complaint', 'draft-legal-notice', 'draft-divorce', 'draft-bail'],
    competentAuthority: ['SHO of Police Station (FIR)', 'Women Cell / CAW Cell', 'Judicial Magistrate (498A/DV Act)', 'Family Court (Divorce/Maintenance)', 'Protection Officer (DV Act)'],
    futureApplications: [
      { name: 'DIR (Domestic Incident Report)', timeline: 'Immediately', description: 'Through Protection Officer under DV Act' },
      { name: 'FIR under 498A', timeline: 'Immediately', description: 'At concerned Police Station' },
      { name: 'Application under DV Act', timeline: 'Within 1 month', description: 'For protection, residence, monetary orders' },
      { name: 'Maintenance application', timeline: 'Within 2 months', description: 'Under CrPC 125 or HMA Section 24' },
      { name: 'Divorce petition', timeline: 'As needed', description: 'Under HMA Section 13' },
      { name: 'Stridhan recovery', timeline: 'Within 3 months', description: 'Criminal complaint + civil suit' }
    ]
  },
  {
    id: 'sit-land',
    name: 'Property / Land Dispute',
    description: 'Disputes related to land, property, title, possession',
    icon: '🏗️',
    substantiveSections: [
      { section: 'TPA Section 54', description: 'Sale of immovable property' },
      { section: 'TPA Section 58', description: 'Mortgage of immovable property' },
      { section: 'TPA Section 105', description: 'Lease of immovable property' },
      { section: 'TPA Section 118', description: 'Exchange of property' },
      { section: 'IPC 420', description: 'Cheating in property transactions' },
      { section: 'IPC 447', description: 'Criminal trespass' },
      { section: 'IPC 448', description: 'House trespass' },
      { section: 'IPC 427', description: 'Mischief causing damage' },
      { section: 'Specific Relief Act Section 6', description: 'Suit for recovery of possession' },
      { section: 'Specific Relief Act Section 34', description: 'Declaratory decree' },
      { section: 'Registration Act Section 17', description: 'Documents requiring registration' }
    ],
    proceduralSections: [
      { section: 'CPC Section 9', description: 'Courts to try all civil suits' },
      { section: 'CPC Section 16', description: 'Suits relating to immovable property' },
      { section: 'CPC Order XXXIX', description: 'Temporary injunctions' },
      { section: 'CPC Order VII', description: 'Plaint requirements' },
      { section: 'CPC Section 26', description: 'Institution of suits' },
      { section: 'Limitation Act Article 65', description: '12 years for possession based on title' },
      { section: 'CrPC 145', description: 'Dispute as to immovable property' }
    ],
    relevantDrafts: ['draft-legal-notice', 'draft-civil-suit', 'draft-police-complaint', 'draft-complaint'],
    competentAuthority: ['Civil Judge (Civil suits)', 'Revenue Court (Revenue matters)', 'SDM (CrPC 145 proceedings)', 'Police (Criminal trespass)', 'Sub-Registrar (Registration)'],
    futureApplications: [
      { name: 'Legal notice', timeline: 'Before filing suit', description: 'Notice to opposite party' },
      { name: 'Civil suit for declaration/injunction', timeline: 'Within limitation', description: 'Before Civil Judge' },
      { name: 'Injunction application', timeline: 'Along with suit', description: 'Temporary injunction to maintain status quo' },
      { name: 'FIR for trespass', timeline: 'If criminal element', description: 'At concerned Police Station' },
      { name: 'Revenue appeal', timeline: 'Within 30 days', description: 'Against revenue court orders' },
      { name: 'First appeal', timeline: 'Within 30 days of decree', description: 'Appeal against trial court decree' }
    ]
  },
  {
    id: 'sit-cyberfraud',
    name: 'Cyber Crime / Online Fraud',
    description: 'Offences committed using computers, internet, and digital means',
    icon: '💻',
    substantiveSections: [
      { section: 'IT Act Section 66', description: 'Computer related offences' },
      { section: 'IT Act Section 66C', description: 'Identity theft' },
      { section: 'IT Act Section 66D', description: 'Cheating by personation using computer' },
      { section: 'IT Act Section 67', description: 'Publishing obscene material electronically' },
      { section: 'IT Act Section 72', description: 'Breach of confidentiality and privacy' },
      { section: 'IT Act Section 43', description: 'Penalty for damage to computer system' },
      { section: 'IPC 420', description: 'Cheating and dishonest inducement' },
      { section: 'IPC 468', description: 'Forgery for purpose of cheating' },
      { section: 'IPC 471', description: 'Using forged document as genuine' },
      { section: 'IPC 419', description: 'Cheating by personation' }
    ],
    proceduralSections: [
      { section: 'CrPC 154', description: 'FIR at Cyber Crime Cell' },
      { section: 'IT Act Section 78', description: 'Power of police officer to investigate' },
      { section: 'IT Act Section 80', description: 'Power of police officer to enter/search' },
      { section: 'CrPC 91', description: 'Summons to produce document/electronic record' },
      { section: 'Evidence Act Section 65B', description: 'Admissibility of electronic records' },
      { section: 'Bankers Book Evidence Act', description: 'Bank statement as evidence' }
    ],
    relevantDrafts: ['draft-police-complaint', 'draft-complaint', 'draft-legal-notice', 'draft-bail'],
    competentAuthority: ['Cyber Crime Cell', 'Cyber Crime Portal (cybercrime.gov.in)', 'Jurisdictional Police Station', 'Adjudicating Officer under IT Act', 'Sessions Court (offences above 3 years)'],
    futureApplications: [
      { name: 'Cyber crime complaint', timeline: 'Immediately', description: 'Online at cybercrime.gov.in or Cyber Cell' },
      { name: 'FIR at Police Station', timeline: 'Within 24 hours', description: 'With all evidence preserved' },
      { name: 'Bank complaint', timeline: 'Within 3 days', description: 'For freezing of fraudulent account' },
      { name: 'Application to court for preservation of evidence', timeline: 'Within 1 week', description: 'Direction to intermediaries' },
      { name: 'Civil suit for damages', timeline: 'Within limitation', description: 'Compensation for losses' }
    ]
  },
  {
    id: 'sit-accident',
    name: 'Motor Vehicle Accident',
    description: 'Road traffic accidents, hit and run, negligent driving',
    icon: '🚗',
    substantiveSections: [
      { section: 'IPC 279', description: 'Rash driving on public way' },
      { section: 'IPC 304A', description: 'Death by negligence' },
      { section: 'IPC 337', description: 'Hurt by endangering life' },
      { section: 'IPC 338', description: 'Grievous hurt by endangering life' },
      { section: 'MV Act Section 134', description: 'Duty of driver in accident' },
      { section: 'MV Act Section 140', description: 'Liability to pay compensation - no fault' },
      { section: 'MV Act Section 163A', description: 'Special provision for third party' },
      { section: 'MV Act Section 166', description: 'Application for compensation' }
    ],
    proceduralSections: [
      { section: 'CrPC 154', description: 'FIR Registration' },
      { section: 'MV Act Section 166', description: 'Filing claim petition before MACT' },
      { section: 'MV Act Section 165', description: 'Claims Tribunal procedure' },
      { section: 'CrPC 320', description: 'Compounding of offences' }
    ],
    relevantDrafts: ['draft-police-complaint', 'draft-legal-notice', 'draft-complaint'],
    competentAuthority: ['Traffic Police', 'Jurisdictional Police Station', 'Motor Accident Claims Tribunal', 'Civil Court', 'Sessions Court (304A cases)'],
    futureApplications: [
      { name: 'FIR', timeline: 'Immediately', description: 'At nearest Police Station' },
      { name: 'MLC (Medico Legal Certificate)', timeline: 'Same day', description: 'At hospital' },
      { name: 'Insurance claim', timeline: 'Within 15 days', description: 'To insurance company' },
      { name: 'MACT claim petition', timeline: 'Within 6 months', description: 'Before Motor Accident Claims Tribunal' },
      { name: 'Civil suit for damages', timeline: 'Within limitation', description: 'Additional compensation if needed' }
    ]
  },
  {
    id: 'sit-employment',
    name: 'Employment / Labour Dispute',
    description: 'Disputes between employer and employee, wrongful termination, wages',
    icon: '👷',
    substantiveSections: [
      { section: 'ID Act Section 2(k)', description: 'Definition of industrial dispute' },
      { section: 'ID Act Section 25F', description: 'Conditions for retrenchment' },
      { section: 'ID Act Section 25G', description: 'Procedure for retrenchment' },
      { section: 'Payment of Wages Act Section 3', description: 'Responsibility for payment' },
      { section: 'Payment of Wages Act Section 5', description: 'Time of payment' },
      { section: 'Minimum Wages Act Section 12', description: 'Payment of minimum wages' },
      { section: 'EPF Act Section 14B', description: 'Recovery of damages for default' },
      { section: 'ESI Act Section 39', description: 'Contributions' },
      { section: 'Payment of Gratuity Act Section 4', description: 'Payment of gratuity' }
    ],
    proceduralSections: [
      { section: 'ID Act Section 10', description: 'Reference of dispute to Labour Court' },
      { section: 'ID Act Section 11A', description: 'Powers of Labour Court' },
      { section: 'ID Act Section 33C(2)', description: 'Recovery of money due' },
      { section: 'Labour Court Rules', description: 'Procedure before Labour Court' }
    ],
    relevantDrafts: ['draft-legal-notice', 'draft-complaint', 'draft-rti', 'draft-writ'],
    competentAuthority: ['Labour Commissioner', 'Conciliation Officer', 'Labour Court / Industrial Tribunal', 'EPF Appellate Tribunal', 'High Court (Writ)'],
    futureApplications: [
      { name: 'Demand notice to employer', timeline: 'Immediately', description: 'Legal notice under relevant Act' },
      { name: 'Complaint to Labour Commissioner', timeline: 'Within 30 days', description: 'For non-payment of wages/dues' },
      { name: 'Conciliation proceedings', timeline: 'Within 45 days', description: 'Before Conciliation Officer' },
      { name: 'Reference to Labour Court', timeline: 'After conciliation failure', description: 'Through appropriate government' },
      { name: 'Writ petition', timeline: 'If fundamental rights violated', description: 'Before High Court' }
    ]
  },
  {
    id: 'sit-consumer',
    name: 'Consumer Complaint / Deficiency',
    description: 'Defective goods, deficient services, unfair trade practices',
    icon: '🛍️',
    substantiveSections: [
      { section: 'CPA Section 2(6)', description: 'Definition of defect' },
      { section: 'CPA Section 2(7)', description: 'Definition of deficiency' },
      { section: 'CPA Section 2(9)', description: 'Unfair trade practice' },
      { section: 'CPA Section 35', description: 'Jurisdiction of District Commission' },
      { section: 'CPA Section 47', description: 'Jurisdiction based on value' },
      { section: 'CPA Section 38', description: 'Relief available to complainant' },
      { section: 'CPA Section 39', description: 'Findings of District Commission' }
    ],
    proceduralSections: [
      { section: 'CPA Section 35', description: 'Filing before District Commission' },
      { section: 'CPA Section 36', description: 'Manner of filing complaint' },
      { section: 'CPA Section 37', description: 'Limitation - 2 years' },
      { section: 'CPA Section 41', description: 'Appeal to State Commission' },
      { section: 'CPA Section 51', description: 'Appeal to National Commission' }
    ],
    relevantDrafts: ['draft-consumer', 'draft-legal-notice'],
    competentAuthority: ['District Consumer Disputes Redressal Commission (up to ₹1 crore)', 'State Consumer Disputes Redressal Commission (₹1-10 crore)', 'National Consumer Disputes Redressal Commission (above ₹10 crore)'],
    futureApplications: [
      { name: 'Written complaint to company', timeline: 'Immediately', description: 'Formal complaint to service provider' },
      { name: 'Legal notice', timeline: 'Within 15 days', description: 'Through advocate' },
      { name: 'Consumer complaint', timeline: 'Within 2 years', description: 'Before appropriate Commission' },
      { name: 'Appeal', timeline: 'Within 30 days of order', description: 'Before appellate forum' }
    ]
  },
  {
    id: 'sit-defamation',
    name: 'Defamation / Reputation',
    description: 'Criminal and civil defamation, online defamation',
    icon: '📢',
    substantiveSections: [
      { section: 'IPC 499', description: 'Defamation - definition' },
      { section: 'IPC 500', description: 'Punishment for defamation - 2 years or fine or both' },
      { section: 'IPC 501', description: 'Printing defamatory matter' },
      { section: 'IPC 502', description: 'Sale of printed defamatory matter' },
      { section: 'IT Act Section 66A', description: 'Sending offensive messages (struck down)' },
      { section: 'IT Act Section 79', description: 'Intermediary liability exemption' }
    ],
    proceduralSections: [
      { section: 'CrPC 199', description: 'Prosecution for defamation' },
      { section: 'CrPC 200', description: 'Complaint before Magistrate' },
      { section: 'CPC Order VII', description: 'Civil suit for damages' }
    ],
    relevantDrafts: ['draft-legal-notice', 'draft-complaint', 'draft-civil-suit'],
    competentAuthority: ['Judicial Magistrate First Class', 'Civil Judge (for civil defamation)', 'High Court (for injunction)'],
    futureApplications: [
      { name: 'Cease and desist notice', timeline: 'Immediately', description: 'Legal notice demanding removal' },
      { name: 'Criminal complaint under 500 IPC', timeline: 'Within 3 years', description: 'Before Magistrate' },
      { name: 'Civil suit for damages', timeline: 'Within 1 year', description: 'Before Civil Court' },
      { name: 'Injunction application', timeline: 'Urgent', description: 'To restrain further publication' }
    ]
  }
];

// ===== SEARCH FUNCTIONS =====
export function searchSections(query: string): LegalSection[] {
  const q = query.toLowerCase();
  return legalSections.filter(s =>
    s.section.toLowerCase().includes(q) ||
    s.title.toLowerCase().includes(q) ||
    s.description.toLowerCase().includes(q) ||
    s.code.toLowerCase().includes(q) ||
    s.category.toLowerCase().includes(q)
  );
}

export function searchSituations(query: string): SituationCategory[] {
  const q = query.toLowerCase();
  return situationCategories.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.description.toLowerCase().includes(q) ||
    s.substantiveSections.some(sec => sec.section.toLowerCase().includes(q) || sec.description.toLowerCase().includes(q)) ||
    s.proceduralSections.some(sec => sec.section.toLowerCase().includes(q) || sec.description.toLowerCase().includes(q))
  );
}

export function searchJurisdiction(query: string): JurisdictionInfo[] {
  const q = query.toLowerCase();
  return jurisdictionData.filter(j =>
    j.name.toLowerCase().includes(q) ||
    j.jurisdiction.toLowerCase().includes(q) ||
    j.state.toLowerCase().includes(q) ||
    j.district.toLowerCase().includes(q) ||
    j.competentFor.some(c => c.toLowerCase().includes(q))
  );
}

export function searchDepartments(query: string): GovernmentDepartment[] {
  const q = query.toLowerCase();
  return governmentDepartments.filter(d =>
    d.name.toLowerCase().includes(q) ||
    d.ministry.toLowerCase().includes(q) ||
    d.functions.some(f => f.toLowerCase().includes(q)) ||
    d.relevantActs.some(a => a.toLowerCase().includes(q))
  );
}
