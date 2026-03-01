import React, { useEffect, useMemo, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const POPIA_VERSION = 'v1';
const POPIA_STORAGE_KEY = 'lms_popia_consent';
const POPIA_SESSION_KEY = 'lms_popia_session_acknowledged';

const POPIADisclaimer: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [understood, setUnderstood] = useState(false);

  useEffect(() => {
    const sessionAcknowledged = sessionStorage.getItem(POPIA_SESSION_KEY);
    if (!sessionAcknowledged) {
      setOpen(true);
      return;
    }

    const storedValue = localStorage.getItem(POPIA_STORAGE_KEY);
    if (!storedValue) {
      setOpen(true);
      return;
    }

    try {
      const parsed = JSON.parse(storedValue) as { version?: string };
      if (parsed.version !== POPIA_VERSION) {
        setOpen(true);
      }
    } catch {
      setOpen(true);
    }
  }, []);

  const compliancePoints = useMemo(
    () => [
      'We only ask for the minimum information needed to run learning features.',
      'Do not share ID numbers, home address, medical, or financial details in chat.',
      'Your learning activity is used to improve support and recommendations.',
      'You can ask support to review or remove your stored learner profile data.',
    ],
    []
  );

  const accept = () => {
    sessionStorage.setItem(POPIA_SESSION_KEY, 'true');
    localStorage.setItem(
      POPIA_STORAGE_KEY,
      JSON.stringify({
        version: POPIA_VERSION,
        acceptedAt: new Date().toISOString(),
      })
    );
    setOpen(false);
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-xl"
        onEscapeKeyDown={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <ShieldCheck className="w-5 h-5 text-primary" />
            POPIA Privacy Notice
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed">
            We follow POPIA rules to protect your privacy. Please read and confirm before continuing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          {compliancePoints.map((point) => (
            <div key={point} className="rounded-md border border-border bg-muted/40 px-3 py-2">
              {point}
            </div>
          ))}
        </div>

        <div className="flex items-start gap-3 rounded-md border border-border p-3">
          <Checkbox
            id="popia-understood"
            checked={understood}
            onCheckedChange={(checked) => setUnderstood(checked === true)}
          />
          <Label htmlFor="popia-understood" className="text-sm cursor-pointer leading-relaxed">
            I understand this privacy notice and I agree to continue using the platform.
          </Label>
        </div>

        <div className="flex justify-end">
          <Button onClick={accept} disabled={!understood}>
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default POPIADisclaimer;
