import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import geminiService from './geminiService.js';
import { logEscalationEvent } from '../../logger.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DRAFTS_DIR = path.resolve(__dirname, '../../escalation_drafts');

function ensureDraftsDir() {
  fs.mkdirSync(DRAFTS_DIR, { recursive: true });
}

function newId() {
  return 'escal-' + crypto.randomBytes(6).toString('hex');
}

/**
 * Generate an AI-written email draft (subject + body + suggested recipients) from the conversation context.
 */
export async function generateEscalationDraft(params: { query: string; conversation?: string[]; category?: string; correlationId?: string; }): Promise<{ escalationId: string; subject: string; body: string; recipients: string[]; estimatedResponseWindow: string; }> {
  const { query, conversation = [], category, correlationId } = params;

  // Build prompt for the AI to produce a JSON payload
  const prompt = `You are an assistant that drafts professional escalation emails to course facilitators or mentors.
Use the information below to create a concise subject line, a friendly supportive opening, a clear description of the issue, what you tried, and suggested next steps. Also suggest recipients (role-based emails like mentor@example.com) and an estimated response window.

Context:
Query: ${query}
Category: ${category || 'general'}
Conversation history (most recent last):\n${conversation.slice(-6).join('\n')}

Return a JSON object with keys: subject, body, recipients (array of emails), estimatedResponseWindow.
Respond only with valid JSON.`;

  let aiText = '';
  try {
    aiText = await geminiService.generateResponse(prompt, []);
  } catch (err) {
    aiText = '';
  }

  // Try to parse JSON from model output
  let parsed: any = null;
  try {
    parsed = JSON.parse(aiText);
  } catch (e) {
    // Try to extract JSON substring
    const m = aiText.match(/\{[\s\S]*\}/);
    if (m) {
      try { parsed = JSON.parse(m[0]); } catch {}
    }
  }

  // Fallback simple draft if parsing failed
  const defaultSubject = `Escalation: review requested — ${query.substring(0, 60)}${query.length > 60 ? '…' : ''}`;
  const defaultBody = `Hello,

The learning assistant escalated the following learner query for your review:

"${query}"

Recent context:
${conversation.slice(-6).join('\n')}

Please advise on next steps.

Thanks,
LMS AI Assistant`;

  const subject = (parsed && parsed.subject) ? String(parsed.subject) : defaultSubject;
  const body = (parsed && parsed.body) ? String(parsed.body) : defaultBody;
  const recipients = (parsed && Array.isArray(parsed.recipients) && parsed.recipients.length) ? parsed.recipients : ['mentor@example.com'];
  const estimatedResponseWindow = (parsed && parsed.estimatedResponseWindow) ? String(parsed.estimatedResponseWindow) : 'Within 24 hours';

  const escalationId = newId();
  ensureDraftsDir();
  const filePath = path.join(DRAFTS_DIR, `${escalationId}.json`);
  const saved = {
    escalationId,
    query,
    category,
    conversation,
    subject,
    body,
    recipients,
    estimatedResponseWindow,
    createdAt: new Date().toISOString(),
    correlationId,
  };
  fs.writeFileSync(filePath, JSON.stringify(saved, null, 2), 'utf8');

  // Log escalation event for audit
  logEscalationEvent({ query, category: category || 'general', reason: 'auto_escalation_generated', escalationType: 'human_review', target: 'mentor', severity: 'medium', correlationId });

  return { escalationId, subject, body, recipients, estimatedResponseWindow };
}

/**
 * Send the escalation email via SMTP. Expects final content from user confirmation.
 */
export async function sendEscalationEmail(params: { escalationId: string; subject: string; body: string; recipients: string[]; from?: string; correlationId?: string; }) {
  const { escalationId, subject, body, recipients, from, correlationId } = params;

  // Load SMTP config from env
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const defaultFrom = process.env.EMAIL_FROM || (user || 'no-reply@example.com');

  if (!host || !user || !pass) {
    throw new Error('SMTP not configured (SMTP_HOST/SMTP_USER/SMTP_PASS)');
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for 587
    auth: {
      user,
      pass,
    },
  });

  const mailOptions = {
    from: from || defaultFrom,
    to: recipients.join(', '),
    subject,
    text: body,
  } as const;

  const info = await transporter.sendMail(mailOptions as any);

  // Mark as sent in draft storage
  try {
    const filePath = path.join(DRAFTS_DIR, `${escalationId}.json`);
    if (fs.existsSync(filePath)) {
      const obj = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      obj.sentAt = new Date().toISOString();
      obj.messageId = info.messageId;
      fs.writeFileSync(filePath, JSON.stringify(obj, null, 2), 'utf8');
    }
  } catch {}

  // Log that email was sent
  logEscalationEvent({ query: `email_sent:${escalationId}`, category: 'escalation_email', reason: 'email_sent', escalationType: 'other', target: recipients.join(','), severity: 'low', correlationId });

  return { ok: true, messageId: info.messageId };
}
