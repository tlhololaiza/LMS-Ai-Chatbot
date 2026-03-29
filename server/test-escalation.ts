/**
 * Quick smoke-test for the escalation flow.
 * Run from the server directory:  npx tsx test-escalation.ts
 * The backend server must already be running on :4000.
 */

const BASE = 'http://localhost:4000';

async function main() {
  console.log('\n══════════════════════════════════════════');
  console.log('  Escalation smoke-test');
  console.log('══════════════════════════════════════════\n');

  // ── STEP 1: Generate draft ──────────────────────────────────
  console.log('1) POST /api/log-escalation …');
  const draftRes = await fetch(`${BASE}/api/log-escalation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: 'I am struggling with React hooks, can I get help?',
      category: 'general',
      conversation: [
        'User: I am struggling with React hooks.',
        'Assistant: I can help! Hooks let you use state in functional components.',
      ],
    }),
  });

  if (!draftRes.ok) {
    const err = await draftRes.text();
    console.error('✗ Draft failed:', draftRes.status, err);
    process.exit(1);
  }

  const { draft } = await draftRes.json();
  console.log('  ✓ Draft created');
  console.log('    escalationId     :', draft.escalationId);
  console.log('    subject          :', draft.subject);
  console.log('    recipients       :', draft.recipients.join(', '));
  console.log('    estimatedWindow  :', draft.estimatedResponseWindow);

  // ── STEP 2: Send email ──────────────────────────────────────
  console.log('\n2) POST /api/escalation/send …');
  const sendRes = await fetch(`${BASE}/api/escalation/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      escalationId: draft.escalationId,
      subject: draft.subject,
      body: draft.body,
      recipients: draft.recipients,
    }),
  });

  if (!sendRes.ok) {
    const err = await sendRes.text();
    console.error('✗ Send failed:', sendRes.status, err);
    process.exit(1);
  }

  const sendResult = await sendRes.json();
  console.log('  ✓ Email sent!');
  console.log('    messageId:', sendResult.result?.messageId);

  console.log('\n══════════════════════════════════════════');
  console.log('  All tests passed ✓');
  console.log('══════════════════════════════════════════\n');
}

main().catch((e) => {
  console.error('Test error:', e);
  process.exit(1);
});
