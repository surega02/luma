import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { buttonDanger, buttonPrimary, buttonSecondary } from './stamp';

/**
 * One confirmation surface for every destructive or discarding action, so
 * Delete and "unsaved changes" read the same way (E04-F05, E04-F07).
 */
export default function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel,
    cancelLabel,
    onConfirm,
    onCancel,
    destructive = false,
}: {
    open: boolean;
    title: string;
    description?: string;
    confirmLabel: string;
    cancelLabel: string;
    onConfirm: () => void;
    onCancel: () => void;
    destructive?: boolean;
}) {
    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                if (!next) {
                    onCancel();
                }
            }}
        >
            <DialogContent className="gap-5 rounded-[3px] border border-ink/30 bg-paper p-5 sm:max-w-md">
                <DialogHeader className="gap-2 text-left">
                    <DialogTitle className="stamp text-[16px] tracking-[0.18em] text-ink">
                        {title}
                    </DialogTitle>
                    {description && (
                        <DialogDescription className="font-sans text-[16px] leading-relaxed text-ink-soft">
                            {description}
                        </DialogDescription>
                    )}
                </DialogHeader>

                <DialogFooter className="gap-2 sm:justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        className={buttonSecondary}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className={destructive ? buttonDanger : buttonPrimary}
                    >
                        {confirmLabel}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
