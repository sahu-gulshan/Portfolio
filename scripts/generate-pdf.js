import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';

async function generatePDF() {
  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Palette
  const primaryColor = rgb(0.82, 0.40, 0.11); // Professional warm amber / terracotta
  const darkColor = rgb(0.08, 0.10, 0.14);    // Slate 900
  const subDarkColor = rgb(0.18, 0.22, 0.28); // Slate 800
  const bodyColor = rgb(0.24, 0.28, 0.33);    // Slate 700
  const lightGray = rgb(0.85, 0.87, 0.90);
  const linkColor = rgb(0.12, 0.35, 0.85);

  // A4 dimensions: 595.28 x 841.89 points
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 38;
  const contentWidth = pageWidth - margin * 2;

  // Helper: Draw multi-line wrapped text
  function drawWrappedText(page, text, startX, startY, maxWidth, size, font, color, lineSpacing = 1.35) {
    const words = text.split(' ');
    let line = '';
    let curY = startY;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + (line ? ' ' : '') + words[i];
      const testWidth = font.widthOfTextAtSize(testLine, size);
      if (testWidth > maxWidth && line.length > 0) {
        page.drawText(line, { x: startX, y: curY, size, font, color });
        line = words[i];
        curY -= size * lineSpacing;
      } else {
        line = testLine;
      }
    }
    if (line.length > 0) {
      page.drawText(line, { x: startX, y: curY, size, font, color });
      curY -= size * lineSpacing;
    }
    return curY;
  }

  // Helper: Draw bullet point with wrapped hanging indent
  function drawBulletItem(page, prefix, body, startX, startY, maxWidth, size, color, prefixColor = darkColor) {
    const bulletIndent = 12;
    page.drawText('•', { x: startX, y: startY, size: size + 1, font: fontBold, color: primaryColor });

    let textStartX = startX + bulletIndent;
    let textWidth = maxWidth - bulletIndent;
    let curY = startY;

    if (prefix) {
      page.drawText(prefix, { x: textStartX, y: curY, size, font: fontBold, color: prefixColor });
      const prefixW = fontBold.widthOfTextAtSize(prefix, size);
      
      // Calculate remaining first line width
      const firstLineMaxW = textWidth - prefixW;
      const words = body.split(' ');
      let firstLine = '';
      let wordIdx = 0;

      for (; wordIdx < words.length; wordIdx++) {
        const test = firstLine + (firstLine ? ' ' : '') + words[wordIdx];
        if (fontRegular.widthOfTextAtSize(test, size) > firstLineMaxW && firstLine.length > 0) {
          break;
        }
        firstLine = test;
      }

      if (firstLine) {
        page.drawText(firstLine, { x: textStartX + prefixW, y: curY, size, font: fontRegular, color });
        curY -= size * 1.35;
      }

      // Remaining words with regular hanging indent
      const remainingText = words.slice(wordIdx).join(' ');
      if (remainingText) {
        curY = drawWrappedText(page, remainingText, textStartX, curY, textWidth, size, fontRegular, color, 1.35);
      }
    } else {
      curY = drawWrappedText(page, body, textStartX, curY, textWidth, size, fontRegular, color, 1.35);
    }

    return curY;
  }

  // Helper: Draw Section Header
  function drawSectionTitle(page, title, currentY) {
    page.drawText(title, {
      x: margin,
      y: currentY,
      size: 10.5,
      font: fontBold,
      color: primaryColor,
    });
    const lineY = currentY - 3;
    page.drawLine({
      start: { x: margin, y: lineY },
      end: { x: pageWidth - margin, y: lineY },
      thickness: 0.8,
      color: lightGray,
    });
    return lineY - 10;
  }

  // ==========================================
  // PAGE 1: Core Profile, Skills & Leadership at Mu-Sigma
  // ==========================================
  const page1 = pdfDoc.addPage([pageWidth, pageHeight]);
  let y1 = pageHeight - margin;

  // Name & Title
  page1.drawText('GULSHAN KUMAR SAHU', {
    x: margin,
    y: y1 - 4,
    size: 20,
    font: fontBold,
    color: primaryColor,
  });
  y1 -= 22;

  page1.drawText('PRODUCT MANAGER', {
    x: margin,
    y: y1,
    size: 10.5,
    font: fontBold,
    color: darkColor,
  });
  y1 -= 14;

  // Contact Strip
  const contactText = 'Bengaluru, India   |   +91 9070599155, +91 7744974713   |   gulshan.sahu@hotmail.com';
  page1.drawText(contactText, {
    x: margin,
    y: y1,
    size: 8.5,
    font: fontRegular,
    color: bodyColor,
  });
  y1 -= 12;

  page1.drawText('LinkedIn: ', {
    x: margin,
    y: y1,
    size: 8.5,
    font: fontBold,
    color: darkColor,
  });
  page1.drawText('https://www.linkedin.com/in/gulshan-sahu', {
    x: margin + fontBold.widthOfTextAtSize('LinkedIn: ', 8.5),
    y: y1,
    size: 8.5,
    font: fontRegular,
    color: linkColor,
  });
  y1 -= 14;

  // Header Divider
  page1.drawLine({
    start: { x: margin, y: y1 },
    end: { x: pageWidth - margin, y: y1 },
    thickness: 1,
    color: rgb(0.8, 0.83, 0.86),
  });
  y1 -= 13;

  // Executive Summary
  const summaryText = 'Strategic and data-driven Product Manager with 5+ years of experience launching AI-powered enterprise products and analytics solutions. Expert in bridging Business Strategy, AI/ML capabilities, and User Experience to deliver scalable products for Fortune 500 clients. Proven track record of leading cross-functional Agile pods, translating complex business requirements into prioritised roadmaps, and driving measurable Go-To-Market success. Adept at leveraging data visualisation, generative AI, and continuous product discovery to optimise ROI, reduce operational friction, and scale user engagement.';
  y1 = drawWrappedText(page1, summaryText, margin, y1, contentWidth, 8.5, fontRegular, bodyColor, 1.38);
  y1 -= 8;

  // SKILLS & OTHER
  y1 = drawSectionTitle(page1, 'SKILLS & OTHER', y1);

  const skillsData = [
    { cat: 'Product Management: ', desc: 'Product Strategy, Roadmapping, Requirement Gathering, Feature Prioritisation, Product Lifecycle Management, Agile & Scrum, User Story Development, OKRs, Stakeholder Management, Cross-functional Collaboration, Market Analysis, Go-To-Market (GTM)' },
    { cat: 'Analytics & Data: ', desc: 'Power BI, Tableau, SQL, Google Analytics, A/B Testing, KPI Tracking & Dashboards, Data-Driven Decision Making, Performance Metrics (DAU/MAU)' },
    { cat: 'AI / GenAI: ', desc: 'AI Chatbot Development, Prompt Engineering, ChatGPT, Claude, Gemini, Midjourney, Dall-E' },
    { cat: 'UX & Research: ', desc: 'User Research, Usability Testing, Wireframing, Prototyping, Information Architecture, Design Thinking, Figma, Adobe XD' },
    { cat: 'Tools: ', desc: 'JIRA, Confluence, Azure DevOps Board, Asana' },
  ];

  for (const item of skillsData) {
    y1 = drawBulletItem(page1, item.cat, item.desc, margin + 2, y1, contentWidth - 2, 8.2, bodyColor, darkColor);
    y1 -= 1.5;
  }
  y1 -= 6;

  // PROFESSIONAL EXPERIENCE (Part 1: Mu-Sigma)
  y1 = drawSectionTitle(page1, 'PROFESSIONAL EXPERIENCE', y1);

  // Role Header
  page1.drawText('Product Manager — ', { x: margin, y: y1, size: 9.5, font: fontBold, color: darkColor });
  const roleW = fontBold.widthOfTextAtSize('Product Manager — ', 9.5);
  page1.drawText('Mu-Sigma, Bengaluru', { x: margin + roleW, y: y1, size: 9.5, font: fontOblique, color: primaryColor });
  const dateStr1 = 'NOV 2022 – Present';
  page1.drawText(dateStr1, { x: pageWidth - margin - fontBold.widthOfTextAtSize(dateStr1, 8.5), y: y1, size: 8.5, font: fontBold, color: darkColor });
  y1 -= 13;

  const muSigmaBullets = [
    'Own the end-to-end product lifecycle for 5+ enterprise tools; led migration from legacy systems to modern UX, cutting usability friction by 23% and lifting feature adoption 19% within the first quarter of launch.',
    'Partnered with VP-level stakeholders to define product roadmaps; led a cross-functional squad of 7 (2 designers, 3 data scientists, 2 developers), improving delivery velocity by 20% by standardising a design system and automating hand-off protocols.',
    'Run user research, usability testing, and heuristic evaluations that inform product decisions, reducing usability issues by 21% and improving user engagement.',
    'Used A/B testing to validate design and feature decisions, and aligned squad priorities to team OKRs to keep delivery focused on business-critical outcomes.',
    'Defined business requirements for executive-level Power BI, React, Angular and Tableau dashboards, empowering leadership to monitor real-time KPIs, track risk signals, and make data-driven operational decisions.',
    'Built stakeholder trust through transparent communication and consultative problem-solving, growing analytics tool adoption across product teams by 28%.'
  ];

  for (const bullet of muSigmaBullets) {
    y1 = drawBulletItem(page1, '', bullet, margin + 4, y1, contentWidth - 4, 8.2, bodyColor);
    y1 -= 2;
  }
  y1 -= 4;

  // Key Project Initiatives Section
  page1.drawText('Key Project Initiatives & Business Impact:', { x: margin + 4, y: y1, size: 8.8, font: fontBold, color: subDarkColor });
  y1 -= 11;

  // Project A
  page1.drawText('A. iOS AI Chatbot for a Defense Firm', { x: margin + 10, y: y1, size: 8.2, font: fontBold, color: darkColor });
  y1 -= 10;
  y1 = drawWrappedText(page1, 'Problem: High volume of routine internal support tickets causing operational bottlenecks.', margin + 18, y1, contentWidth - 18, 7.8, fontRegular, bodyColor, 1.3);
  y1 = drawWrappedText(page1, 'Objective: Automate support workflows and improve employee access to information.', margin + 18, y1, contentWidth - 18, 7.8, fontRegular, bodyColor, 1.3);
  y1 = drawWrappedText(page1, 'Approach: Defined requirements for an LLM-powered chatbot, collaborated with ML engineers on prompt tuning, and launched an MVP focused on core queries.', margin + 18, y1, contentWidth - 18, 7.8, fontRegular, bodyColor, 1.3);
  y1 = drawWrappedText(page1, 'Outcome: Boosted Daily Active Users (DAU) by 37% and successfully reduced manual support ticket volume by 28%.', margin + 18, y1, contentWidth - 18, 7.8, fontBold, darkColor, 1.3);
  y1 -= 4;

  // Project B
  page1.drawText('B. Retail Marketing Mix Models (MMM)', { x: margin + 10, y: y1, size: 8.2, font: fontBold, color: darkColor });
  y1 -= 10;
  y1 = drawWrappedText(page1, 'Problem: Enterprise retail clients struggled with suboptimal, multi-million dollar budget allocations.', margin + 18, y1, contentWidth - 18, 7.8, fontRegular, bodyColor, 1.3);
  y1 = drawWrappedText(page1, 'Objective: Build a data visualisation product to guide optimised marketing and media spend.', margin + 18, y1, contentWidth - 18, 7.8, fontRegular, bodyColor, 1.3);
  y1 = drawWrappedText(page1, 'Approach: Architected the product roadmap for a predictive analytics dashboard, prioritising actionable spend adjustments.', margin + 18, y1, contentWidth - 18, 7.8, fontRegular, bodyColor, 1.3);
  y1 = drawWrappedText(page1, 'Outcome: Delivered a 15% lift in measurable ROI for key retail clients.', margin + 18, y1, contentWidth - 18, 7.8, fontBold, darkColor, 1.3);
  y1 -= 4;

  // Project C
  page1.drawText('C. Membership 360 Loyalty Platform', { x: margin + 10, y: y1, size: 8.2, font: fontBold, color: darkColor });
  y1 -= 10;
  y1 = drawWrappedText(page1, 'Problem: Low customer engagement and retention on a legacy loyalty platform.', margin + 18, y1, contentWidth - 18, 7.8, fontRegular, bodyColor, 1.3);
  y1 = drawWrappedText(page1, 'Objective: Increase platform stickiness and user lifecycle value.', margin + 18, y1, contentWidth - 18, 7.8, fontRegular, bodyColor, 1.3);
  y1 = drawWrappedText(page1, 'Approach: Mapped customer journeys and integrated data-driven loyalty triggers to personalise experience based on analytics.', margin + 18, y1, contentWidth - 18, 7.8, fontRegular, bodyColor, 1.3);
  y1 = drawWrappedText(page1, 'Outcome: Increased overall platform retention and active user engagement by 20%.', margin + 18, y1, contentWidth - 18, 7.8, fontBold, darkColor, 1.3);


  // ==========================================
  // PAGE 2: Prior Experience, Education, Certifications & Achievements
  // ==========================================
  const page2 = pdfDoc.addPage([pageWidth, pageHeight]);
  let y2 = pageHeight - margin;

  // Role 2: Freelance
  y2 = drawSectionTitle(page2, 'PROFESSIONAL EXPERIENCE (CONTINUED)', y2);

  page2.drawText('Operations & Customer Experience Manager — ', { x: margin, y: y2, size: 9.5, font: fontBold, color: darkColor });
  const role2W = fontBold.widthOfTextAtSize('Operations & Customer Experience Manager — ', 9.5);
  page2.drawText('Freelance, Raipur', { x: margin + role2W, y: y2, size: 9.5, font: fontOblique, color: primaryColor });
  const dateStr2 = 'Oct 2020 – Oct 2022';
  page2.drawText(dateStr2, { x: pageWidth - margin - fontBold.widthOfTextAtSize(dateStr2, 8.5), y: y2, size: 8.5, font: fontBold, color: darkColor });
  y2 -= 13;

  const freelanceBullets = [
    'Managed the end-to-end lifecycle and execution of 40+ complex, high-scale events, defining client requirements and prioritising resources to ensure seamless delivery.',
    'Optimised vendor logistics and cross-functional workflows, establishing operational efficiencies that directly drove a 15% increase in client retention and referral rates.',
    'Executed market research and targeted audience engagement strategies to elevate brand identity and maximise customer satisfaction.'
  ];
  for (const bullet of freelanceBullets) {
    y2 = drawBulletItem(page2, '', bullet, margin + 4, y2, contentWidth - 4, 8.2, bodyColor);
    y2 -= 2;
  }
  y2 -= 6;

  // Role 3: Sales Executive
  page2.drawText('Sales Executive — ', { x: margin, y: y2, size: 9.5, font: fontBold, color: darkColor });
  const role3W = fontBold.widthOfTextAtSize('Sales Executive — ', 9.5);
  page2.drawText('Aakaar Medical Technologies, Hyderabad', { x: margin + role3W, y: y2, size: 9.5, font: fontOblique, color: primaryColor });
  const dateStr3 = 'Mar 2020 – Sep 2020';
  page2.drawText(dateStr3, { x: pageWidth - margin - fontBold.widthOfTextAtSize(dateStr3, 8.5), y: y2, size: 8.5, font: fontBold, color: darkColor });
  y2 -= 13;

  const salesBullets = [
    'Partnered with 50+ B2B medical clients to conduct customer discovery, identifying critical business pain points and mapping them to tailored product solutions.',
    'Analysed market trends and competitive landscapes to refine Go-To-Market sales strategies, successfully accelerating new product adoption by 10%.',
    'Influenced key decision-makers through strategic product demonstrations, securing long-term stakeholder buy-in and loyalty.'
  ];
  for (const bullet of salesBullets) {
    y2 = drawBulletItem(page2, '', bullet, margin + 4, y2, contentWidth - 4, 8.2, bodyColor);
    y2 -= 2;
  }
  y2 -= 6;

  // Role 4: Assistant
  page2.drawText('Assistant — ', { x: margin, y: y2, size: 9.5, font: fontBold, color: darkColor });
  const role4W = fontBold.widthOfTextAtSize('Assistant — ', 9.5);
  page2.drawText('Oberoi Hotels & Resorts', { x: margin + role4W, y: y2, size: 9.5, font: fontOblique, color: primaryColor });
  const dateStr4 = 'Sep 2016 – Mar 2017';
  page2.drawText(dateStr4, { x: pageWidth - margin - fontBold.widthOfTextAtSize(dateStr4, 8.5), y: y2, size: 8.5, font: fontBold, color: darkColor });
  y2 -= 13;

  const oberoiBullets = [
    'Analysed customer feedback data to identify service bottlenecks, proactively implementing process improvements that enhanced the end-to-end user journey.',
    'Improved customer satisfaction metrics by 10% through meticulous attention to detail and rapid resolution of operational escalations.'
  ];
  for (const bullet of oberoiBullets) {
    y2 = drawBulletItem(page2, '', bullet, margin + 4, y2, contentWidth - 4, 8.2, bodyColor);
    y2 -= 2;
  }
  y2 -= 8;

  // EDUCATION
  y2 = drawSectionTitle(page2, 'EDUCATION', y2);

  page2.drawText('Post Graduation Diploma in Management, Marketing — ', { x: margin + 4, y: y2, size: 8.5, font: fontBold, color: darkColor });
  const edu1W = fontBold.widthOfTextAtSize('Post Graduation Diploma in Management, Marketing — ', 8.5);
  page2.drawText('Universal Business School, Mumbai', { x: margin + 4 + edu1W, y: y2, size: 8.5, font: fontOblique, color: primaryColor });
  page2.drawText('2018 – 2020', { x: pageWidth - margin - fontBold.widthOfTextAtSize('2018 – 2020', 8.5), y: y2, size: 8.5, font: fontBold, color: darkColor });
  y2 -= 13;

  page2.drawText('Bachelor of Science in Hospitality & Hotel Administration — ', { x: margin + 4, y: y2, size: 8.5, font: fontBold, color: darkColor });
  const edu2W = fontBold.widthOfTextAtSize('Bachelor of Science in Hospitality & Hotel Administration — ', 8.5);
  page2.drawText('IHM Goa', { x: margin + 4 + edu2W, y: y2, size: 8.5, font: fontOblique, color: primaryColor });
  page2.drawText('2013 – 2016', { x: pageWidth - margin - fontBold.widthOfTextAtSize('2013 – 2016', 8.5), y: y2, size: 8.5, font: fontBold, color: darkColor });
  y2 -= 14;

  // CERTIFICATIONS
  y2 = drawSectionTitle(page2, 'CERTIFICATIONS', y2);

  const certsList = [
    'IBM AI Product Manager Specialisation',
    'Generative AI for Product Managers Specialisation',
    'Google UX Design Professional Certificate',
    'UI/UX Specialisation — California Institute of the Arts',
    'Figma UI/UX Design Essentials',
    'Digital Marketing Specialisation',
    'Google Analytics Basics'
  ];
  for (const cert of certsList) {
    y2 = drawBulletItem(page2, '', cert, margin + 4, y2, contentWidth - 4, 8.2, bodyColor);
    y2 -= 1.5;
  }
  y2 -= 8;

  // ACHIEVEMENTS
  y2 = drawSectionTitle(page2, 'KEY ACHIEVEMENTS & HONORS', y2);

  const achievementsData = [
    { title: 'Spot Award, Mu-Sigma: ', desc: 'Recognised for designing high-fidelity UI mock-ups and accelerating enterprise adoption.' },
    { title: 'Sales Achievement, HUL: ', desc: 'Exceeded regional internship sales targets by 130% through consultative client discovery.' },
    { title: 'Research Publication: ', desc: 'Co-authored CSR & Brand Equity Study published in International Journal of Management & Social Sciences.' }
  ];
  for (const ach of achievementsData) {
    y2 = drawBulletItem(page2, ach.title, ach.desc, margin + 4, y2, contentWidth - 4, 8.2, bodyColor, darkColor);
    y2 -= 2;
  }

  // Save PDF bytes
  const pdfBytes = await pdfDoc.save();

  if (!fs.existsSync('public')) {
    fs.mkdirSync('public', { recursive: true });
  }
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }

  fs.writeFileSync('public/Gulshan_Sahu_CV.pdf', pdfBytes);
  fs.writeFileSync('public/Gulshan_Kumar_Sahu_Resume.pdf', pdfBytes);
  fs.writeFileSync('dist/Gulshan_Sahu_CV.pdf', pdfBytes);
  fs.writeFileSync('dist/Gulshan_Kumar_Sahu_Resume.pdf', pdfBytes);

  console.log('Successfully generated professional 2-page PDF document!');
}

generatePDF().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
