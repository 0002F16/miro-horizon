import { KeyboardHelpDialog } from "./KeyboardHelpDialog";
import { Button } from "./ui";

export function Layout({ children, keyboardHelpOpen, setKeyboardHelpOpen, currentStep }) {
  const showKeyboardHelp = currentStep >= 1 && currentStep <= 4;

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
              data-speak="Button. Keyboard Help. Press to open shortcuts."
              className="text-sm px-3 py-1"
            >
              Keyboard Help (?)
            </Button>
          </div>
        )}
      </div>
      {showKeyboardHelp && (
        <KeyboardHelpDialog open={keyboardHelpOpen} onClose={() => setKeyboardHelpOpen(false)} currentStep={currentStep} />
      )}
    </>
  );
}
