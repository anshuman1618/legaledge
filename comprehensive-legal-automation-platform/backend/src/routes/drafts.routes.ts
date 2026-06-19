/**
 * LegalEdge AI - Draft Management Routes
 * Draft formatting, generation, and CRUD operations
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, type AuthenticatedRequest } from '../middleware/auth.js';
import { apiRateLimiter } from '../middleware/security.js';
import { 
  formatDraftSchema, 
  legalNoticeSchema, 
  rtiApplicationSchema,
  bailApplicationSchema 
} from '../utils/validation.js';
import { formatLegalDraft, numberToIndianWords, formatLegalDate } from '../utils/draftFormatter.js';
import type { APIResponse, FormatDraftResponse, GeneratedDraft } from '../types/index.js';

const router = Router();
const prisma = new PrismaClient();

// ==================== FORMAT DRAFT ====================

router.post('/format', apiRateLimiter, async (req: Request, res: Response) => {
  try {
    const validation = formatDraftSchema.safeParse(req.body);
    if (!validation.success) {
      const response: APIResponse<null> = {
        success: false,
        timestamp: new Date().toISOString(),
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: validation.error.errors[0]?.message || 'Invalid input',
        },
      };
      res.status(400).json(response);
      return;
    }

    const { rawText, config } = validation.data;
    const result = formatLegalDraft(rawText, config);

    const response: APIResponse<FormatDraftResponse> = {
      success: true,
      timestamp: new Date().toISOString(),
      data: result,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('[FORMAT_DRAFT_ERROR]', error);
    const response: APIResponse<null> = {
      success: false,
      timestamp: new Date().toISOString(),
      data: null,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred during formatting',
      },
    };
    res.status(500).json(response);
  }
});

// ==================== GENERATE LEGAL NOTICE ====================

router.post('/generate-notice', authenticate, async (req: Request, res: Response) => {
  try {
    const validation = legalNoticeSchema.safeParse(req.body);
    if (!validation.success) {
      const response: APIResponse<null> = {
        success: false,
        timestamp: new Date().toISOString(),
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: validation.error.errors[0]?.message || 'Invalid input',
        },
      };
      res.status(400).json(response);
      return;
    }

    const data = validation.data;
    const authReq = req as AuthenticatedRequest;
    const currentDate = formatLegalDate(new Date());
    const amountInWords = numberToIndianWords(data.noticeCost);

    const noticeContent = `LEGAL NOTICE

Date: ${currentDate}

Through: ${data.advocateName}, Advocate
${data.advocateAddress}
Enrolment No: ${data.enrollmentNumber}

To,
${data.recipientName}
${data.recipientAddress}

Subject: Legal Notice under ${data.relevantAct} regarding ${data.subject}

Sir/Madam,

Under instructions from and on behalf of my client ${data.senderName}, S/o / D/o ${data.senderFatherName}, R/o ${data.senderAddress}, I serve upon you the following Legal Notice:

1. FACTS OF THE CASE:

${data.facts}

2. CAUSE OF ACTION:

${data.causeOfAction}

3. LEGAL PROVISIONS:

That the above acts/omissions on your part constitute violation of the provisions of ${data.relevantSections} and my client is entitled to the relief of ${data.reliefSought}.

4. DEMAND:

You are hereby called upon to ${data.demand} within ${data.timeLimitDays} days from the receipt of this notice, failing which my client shall be constrained to initiate appropriate legal proceedings against you, both civil and criminal, at your risk, cost and consequences, which please note.

5. That the cost of this notice amounting to Rs. ${data.noticeCost.toLocaleString('en-IN')}/- (Rupees ${amountInWords} Only) be borne by you.

6. That a copy of this notice is being retained in my office for record and further action.

You are advised to take this notice seriously and comply with the demand herein within the stipulated time.

${data.advocateName}
Advocate
Enrolment No: ${data.enrollmentNumber}
${data.advocateAddress}`;

    // Save draft to database
    const draft = await prisma.draft.create({
      data: {
        userId: authReq.user.id,
        type: 'LEGAL_NOTICE',
        title: `Legal Notice - ${data.subject}`,
        content: noticeContent,
        formData: data,
      },
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: authReq.user.id,
        action: 'CREATE',
        resourceType: 'draft',
        resourceId: draft.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    const response: APIResponse<GeneratedDraft> = {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        id: draft.id,
        type: 'LEGAL_NOTICE',
        title: draft.title,
        content: noticeContent,
        generatedAt: draft.createdAt.toISOString(),
      },
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('[GENERATE_NOTICE_ERROR]', error);
    const response: APIResponse<null> = {
      success: false,
      timestamp: new Date().toISOString(),
      data: null,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while generating the notice',
      },
    };
    res.status(500).json(response);
  }
});

// ==================== GENERATE RTI APPLICATION ====================

router.post('/generate-rti', authenticate, async (req: Request, res: Response) => {
  try {
    const validation = rtiApplicationSchema.safeParse(req.body);
    if (!validation.success) {
      const response: APIResponse<null> = {
        success: false,
        timestamp: new Date().toISOString(),
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: validation.error.errors[0]?.message || 'Invalid input',
        },
      };
      res.status(400).json(response);
      return;
    }

    const data = validation.data;
    const authReq = req as AuthenticatedRequest;
    const currentDate = formatLegalDate(new Date());

    let content = '';
    let draftType: 'RTI_APPLICATION' | 'RTI_FIRST_APPEAL' | 'RTI_COMPLAINT' = 'RTI_APPLICATION';

    if (data.type === 'APPLICATION') {
      content = `APPLICATION UNDER SECTION 6 OF THE RIGHT TO INFORMATION ACT, 2005

Date: ${currentDate}

To,
The Public Information Officer,
${data.department},
${data.departmentAddress}

Subject: Request for Information under the Right to Information Act, 2005

Sir/Madam,

I, ${data.applicantName}, S/o / D/o ${data.applicantFatherName}, R/o ${data.applicantAddress}, do hereby request the following information under Section 6 of the Right to Information Act, 2005:

INFORMATION SOUGHT:

${data.informationSought}

PERIOD OF INFORMATION: ${data.period || 'All available records'}

ENCLOSURES:
1. Application fee of Rs. 10/- (Rupees Ten Only) by way of ${getPaymentModeText(data.paymentMode)}.
2. BPL Certificate: ${data.isBPL ? 'Enclosed (Fee Exemption Claimed)' : 'Not Applicable'}

DECLARATION:
I hereby declare that:
(a) I am a citizen of India.
(b) The information sought does not relate to any matter that has been expressly excluded under Section 8 and Section 9 of the RTI Act, 2005.
(c) The above particulars given by me are true and correct to the best of my knowledge and belief.

REQUEST:
1. Kindly provide the above information within the statutory period of 30 days as prescribed under Section 7(1) of the RTI Act, 2005.
2. If the information sought or a part thereof falls within the jurisdiction of another public authority, kindly transfer the application under Section 6(3) of the Act within 5 days.

I would prefer to receive the information in the form of: ☐ Photocopies ☐ Certified Copies ☐ Electronic Format

Place: ${data.place}
Date: ${currentDate}

Yours faithfully,

${data.applicantName}
${data.applicantAddress}
Phone: ${data.phone}
${data.email ? `Email: ${data.email}` : ''}`;
    } else if (data.type === 'FIRST_APPEAL') {
      draftType = 'RTI_FIRST_APPEAL';
      content = `FIRST APPEAL UNDER SECTION 19(1) OF THE RIGHT TO INFORMATION ACT, 2005

Date: ${currentDate}

To,
The First Appellate Authority,
${data.department},
${data.departmentAddress}

Subject: First Appeal under Section 19(1) of the RTI Act, 2005

Sir/Madam,

I, ${data.applicantName}, S/o / D/o ${data.applicantFatherName}, R/o ${data.applicantAddress}, do hereby prefer this First Appeal under Section 19(1) of the Right to Information Act, 2005.

1. DETAILS OF ORIGINAL APPLICATION:
   Application dated: ${data.originalApplicationDate || '[Date]'}
   Filed before: Public Information Officer, ${data.department}

2. INFORMATION SOUGHT IN ORIGINAL APPLICATION:
${data.informationSought}

3. GROUNDS OF APPEAL:
${data.groundsOfAppeal || '[Grounds to be specified]'}

4. RELIEF SOUGHT:
   a) Direction to the PIO to provide the information sought
   b) Imposition of penalty on PIO under Section 20 of the RTI Act
   c) Award of compensation for any loss or detriment suffered

PRAYER:
It is prayed that the First Appellate Authority may be pleased to:
(a) Call for the records from the PIO
(b) Direct the PIO to provide the information as sought
(c) Pass any other order as deemed fit

Place: ${data.place}
Date: ${currentDate}

${data.applicantName}
${data.applicantAddress}
Phone: ${data.phone}`;
    } else {
      draftType = 'RTI_COMPLAINT';
      content = `COMPLAINT UNDER SECTION 18 OF THE RIGHT TO INFORMATION ACT, 2005

Date: ${currentDate}

To,
The Central/State Information Commissioner,
Central/State Information Commission,
[Address]

Subject: Complaint under Section 18 of the RTI Act, 2005

Sir/Madam,

I, ${data.applicantName}, S/o / D/o ${data.applicantFatherName}, R/o ${data.applicantAddress}, do hereby file this complaint under Section 18 of the Right to Information Act, 2005.

1. NAME OF THE PIO:
   ${data.department}

2. FACTS:
${data.informationSought}

3. GROUNDS:
${data.groundsOfAppeal || '[Grounds of complaint]'}

4. RELIEF SOUGHT:
   a) Direction to provide information
   b) Penalty on PIO under Section 20
   c) Compensation for loss suffered

Place: ${data.place}
Date: ${currentDate}

${data.applicantName}
Phone: ${data.phone}
${data.email ? `Email: ${data.email}` : ''}`;
    }

    // Save draft
    const draft = await prisma.draft.create({
      data: {
        userId: authReq.user.id,
        type: draftType,
        title: `RTI ${data.type} - ${data.department}`,
        content,
        formData: data,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: authReq.user.id,
        action: 'CREATE',
        resourceType: 'draft',
        resourceId: draft.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    const response: APIResponse<GeneratedDraft> = {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        id: draft.id,
        type: draftType,
        title: draft.title,
        content,
        generatedAt: draft.createdAt.toISOString(),
      },
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('[GENERATE_RTI_ERROR]', error);
    const response: APIResponse<null> = {
      success: false,
      timestamp: new Date().toISOString(),
      data: null,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while generating the RTI application',
      },
    };
    res.status(500).json(response);
  }
});

// ==================== GENERATE BAIL APPLICATION ====================

router.post('/generate-bail', authenticate, async (req: Request, res: Response) => {
  try {
    const validation = bailApplicationSchema.safeParse(req.body);
    if (!validation.success) {
      const response: APIResponse<null> = {
        success: false,
        timestamp: new Date().toISOString(),
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: validation.error.errors[0]?.message || 'Invalid input',
        },
      };
      res.status(400).json(response);
      return;
    }

    const data = validation.data;
    const authReq = req as AuthenticatedRequest;
    const currentYear = new Date().getFullYear();

    const bailType = data.bailSection === '438' ? 'ANTICIPATORY_BAIL' : 'BAIL_APPLICATION';
    const bailSectionText = data.bailSection === '438' 
      ? 'ANTICIPATORY BAIL UNDER SECTION 438 CrPC'
      : data.bailSection === '439'
        ? 'REGULAR BAIL UNDER SECTION 439 CrPC'
        : 'REGULAR BAIL UNDER SECTION 437 CrPC';

    const groundsList = data.grounds.map((g, i) => `${String.fromCharCode(97 + i)}) ${g}`).join('\n');

    const content = `IN THE COURT OF ${data.courtName.toUpperCase()}
AT ${data.courtPlace.toUpperCase()}

Criminal Misc. ${data.bailSection === '438' ? 'Anticipatory ' : ''}Bail Application No. ___/${currentYear}

IN THE MATTER OF:
${data.applicantName}                                    ...Applicant/Accused

VERSUS

State of ${data.state}                                   ...Respondent

APPLICATION FOR ${bailSectionText}

MOST RESPECTFULLY SHOWETH:

1. That the applicant/accused has been arrested in FIR No. ${data.firNumber} dated ${formatLegalDate(data.firDate)} registered at Police Station ${data.policeStation}, District ${data.district}, under Sections ${data.sections} of IPC.

2. That the applicant was arrested on ${formatLegalDate(data.dateOfArrest)} and has been in judicial custody since ${formatLegalDate(data.custodyDate)}.

3. BRIEF FACTS:
${data.briefFacts}

4. GROUNDS FOR BAIL:
${groundsList}

5. That the applicant undertakes to:
   a) Not leave the jurisdiction without permission of this Hon'ble Court
   b) Mark attendance at the Police Station as directed
   c) Not tamper with evidence or influence witnesses
   d) Appear before the Court on each date of hearing

PRAYER:
It is, therefore, most respectfully prayed that this Hon'ble Court may graciously be pleased to:
a) Release the applicant on ${data.bailSection === '438' ? 'anticipatory bail' : 'regular bail'} in FIR No. ${data.firNumber}
b) Pass any other order which this Court deems fit and proper in the interest of justice.

AND FOR THIS ACT OF KINDNESS, THE APPLICANT SHALL EVER PRAY.

APPLICANT
Through

${data.advocateName}
Advocate
Enrolment No: ${data.enrollmentNumber}`;

    const draft = await prisma.draft.create({
      data: {
        userId: authReq.user.id,
        type: bailType,
        title: `Bail Application - FIR ${data.firNumber}`,
        content,
        formData: data,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: authReq.user.id,
        action: 'CREATE',
        resourceType: 'draft',
        resourceId: draft.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    const response: APIResponse<GeneratedDraft> = {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        id: draft.id,
        type: bailType,
        title: draft.title,
        content,
        generatedAt: draft.createdAt.toISOString(),
      },
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('[GENERATE_BAIL_ERROR]', error);
    const response: APIResponse<null> = {
      success: false,
      timestamp: new Date().toISOString(),
      data: null,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while generating the bail application',
      },
    };
    res.status(500).json(response);
  }
});

// ==================== GET USER DRAFTS ====================

router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = (page - 1) * limit;

    const [drafts, total] = await Promise.all([
      prisma.draft.findMany({
        where: { userId: authReq.user.id },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
        select: {
          id: true,
          type: true,
          title: true,
          status: true,
          version: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.draft.count({ where: { userId: authReq.user.id } }),
    ]);

    const response: APIResponse<typeof drafts> = {
      success: true,
      timestamp: new Date().toISOString(),
      data: drafts,
      meta: {
        page,
        limit,
        total,
        hasMore: offset + drafts.length < total,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('[GET_DRAFTS_ERROR]', error);
    const response: APIResponse<null> = {
      success: false,
      timestamp: new Date().toISOString(),
      data: null,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while fetching drafts',
      },
    };
    res.status(500).json(response);
  }
});

// ==================== GET SINGLE DRAFT ====================

router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { id } = req.params;

    const draft = await prisma.draft.findFirst({
      where: {
        id,
        userId: authReq.user.id,
      },
    });

    if (!draft) {
      const response: APIResponse<null> = {
        success: false,
        timestamp: new Date().toISOString(),
        data: null,
        error: {
          code: 'NOT_FOUND',
          message: 'Draft not found',
        },
      };
      res.status(404).json(response);
      return;
    }

    const response: APIResponse<typeof draft> = {
      success: true,
      timestamp: new Date().toISOString(),
      data: draft,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('[GET_DRAFT_ERROR]', error);
    const response: APIResponse<null> = {
      success: false,
      timestamp: new Date().toISOString(),
      data: null,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while fetching the draft',
      },
    };
    res.status(500).json(response);
  }
});

// Helper function
function getPaymentModeText(mode: string): string {
  const modes: Record<string, string> = {
    'IPO': 'Indian Postal Order',
    'DD': 'Demand Draft',
    'CASH': 'Cash',
    'ONLINE': 'Online Payment',
    'COURT_FEE_STAMP': 'Court Fee Stamp',
  };
  return modes[mode] || mode;
}

export default router;
