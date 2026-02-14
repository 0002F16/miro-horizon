import { KeyboardHelpDialog } from "./KeyboardHelpDialog";
import { Button } from "./ui";

export function Layout({ children, keyboardHelpOpen, setKeyboardHelpOpen, blindMode, currentStep }) {
  const showKeyboardHelp = currentStep >= 1;
  const showBlindToggle = currentStep >= 4;

  return (
    <>
      <div className="flex-1 flex flex-col p-6 relative">
        {children}
        {showKeyboardHelp && (
          <div className="fixed bottom-4 right-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setKeyboardHelpOpen(true)}
              aria-label="Keyboard Help"
              data-speak="Keyboard Help. Press to open shortcuts. Button."
              className="text-sm px-3 py-1"
            >
              Keyboard Help (?)
            </Button>
          </div>
        )}
        {showBlindToggle && blindMode && (
          <div
            className="fixed inset-0 pointer-events-none z-40"
            aria-hidden="true"
            style={{
              background: "rgba(0,0,0,0.95)",
            }}
          />
        )}
      </div>
      <KeyboardHelpDialog open={keyboardHelpOpen} onClose={() => setKeyboardHelpOpen(false)} />
    </>
  );
}
