# Professional website review — October 3, 2026

The review focused on clarity, trust, navigation, accessibility, and the actual behavior of this static website. It is a website implementation review, not a penetration test or a certification of AnthroPrime's operations.

## Findings and implemented changes

| Finding | Change |
| --- | --- |
| Visitors could explore services without understanding assessment boundaries or outputs. | Added `/trust`, a four-part engagement planning guide covering authorization, coordination, evidence, and remediation verification. Linked it from Expertise, Cybersecurity, Contact, and the footer. Scope-specific commitments remain part of an agreed engagement. |
| Forms did not clearly explain appropriate information sharing at the point of submission. | Added non-sensitive inquiry guidance and website data links adjacent to both forms. The existing fields, consent, honeypots, and Netlify submission behavior are retained. |
| Browser preferences and website form handling were not explained. | Added `/data-notice` describing the implemented form processing, browser storage, terminal session, calendar links, and external destinations. Added a control to remove this site's saved preferences without deleting unrelated storage. |
| Repeated discovery tiles lengthened task-focused pages. | Kept discovery tiles on Home, Expertise, and the five discipline pages. Removed them from Contact, Our Practice, Growth Advisory, confirmation, and utility pages. |
| Terminal styling could resemble a real operational tool. | Refined the headline and added a persistent illustrative-scenario label. Commands remain local, predefined workflows without shell execution or system scanning. |
| Missing addresses led to a plain error. | Added a branded 404 page with home and expertise links; the preview returns a real 404 status and Netlify uses its standard `404.html` handling. |
| Confirmation pages could be indexed and had a contact-page canonical. | Added `noindex` and a matching confirmation canonical. The error page is also excluded from indexing; the sitemap includes the new informational pages. |
| Embedded objects and base elements were permitted by the existing CSP fallback. | Explicitly blocked both. Existing same-origin script, connection and form restrictions, frame protection, MIME protection, and permissions policy remain. |

The original company palette, supplied logo, source service catalogue, photography, robot, typewriter, and interactive learning diagrams are retained. Light and dark modes receive the same structure and content.

## Research used

- [NIST SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final): assessment planning, testing limitations, findings, and mitigation guidance. Used as a source for engagement planning, without implying certification.
- [Netlify Forms submissions](https://docs.netlify.com/manage/forms/submissions/): actual form-provider behavior and sensitive-data guidance.
- [Netlify privacy statement](https://www.netlify.com/privacy/) and [data processing agreement](https://www.netlify.com/pdf/netlify-dpa.pdf): distinguish provider account/privacy information from customer-data processing.
- [OWASP CSP guidance](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html): explicit object and base restrictions.

## Business information needed before launch

The website does not invent client logos, testimonials, certifications, named staff, a security operations center, or emergency-response availability. Add those only with approved evidence and current contact information.

The data notice documents the build's features; it does not invent a company-wide retention schedule or claim regulatory compliance. Before launch, the owner should confirm the business identity, applicable privacy wording, inquiry retention and deletion workflow, and any hosting dashboard features or scripts that alter the described behavior. Confirm Netlify form detection and recipients on staging, including both inquiry and consultation delivery. Consultation slots remain requests, not reservations.

No production deployment was performed.

## Validation artifacts

The full existing interaction and accessibility suites cover the ten primary pages, both themes, responsive layouts, reduced motion, native fallbacks, original content preservation, and mocked form success/failure. The new trust suite covers the two new information pages and branded 404 at 320, 390, 768 and 1440px in both themes, plus storage clearing, contact links, indexing metadata, route generation, and absence of external resource requests.

Machine-readable reports are generated in `artifacts/qa-report.json`, `learning-qa.json`, `finishing-qa.json`, `theme-refinement-qa.json`, and `trust-qa.json`. Screenshots include `professional-trust-light.png`, `professional-trust-dark.png`, and the data notice and error-page equivalents.

Final result: 1,923 checks and 109 accessibility scans passed, with no reported browser exceptions. The reduced-motion and paused-navigation suite also passed. New information and error pages contributed 142 checks and 24 scans. Screenshot review confirmed consistent light/dark treatment. Source and Netlify ZIPs were rebuilt after verification.
