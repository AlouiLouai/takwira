type BottomSheetProps = {
  teamColor: string;
  sheetTeamLabel: string;
  sheetSlotLabel: string;
  nameInput: string;
  setNameInput: (value: string) => void;
  persistEntry: () => void;
  removeEntry: () => void;
  closeSheet: () => void;
  activePlayer: string | null;
};

export function BottomSheet({
  teamColor,
  sheetTeamLabel,
  sheetSlotLabel,
  nameInput,
  setNameInput,
  persistEntry,
  removeEntry,
  closeSheet,
  activePlayer,
}: BottomSheetProps) {
  return (
    <div className="flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#02120c]/95 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">
            {sheetTeamLabel} · {sheetSlotLabel}
          </p>
          <div className="flex items-center gap-2">
            {activePlayer && (
              <button
                type="button"
                onClick={removeEntry}
                className="text-red-400 hover:text-red-300 text-xl transition"
                aria-label="Delete player"
              >
                🗑️
              </button>
            )}
            <button
              type="button"
              onClick={closeSheet}
              className="text-white/60 hover:text-white text-2xl leading-none transition"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        </div>
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            persistEntry();
          }}
        >
          <label className="flex flex-col gap-2 text-sm text-white/70">
            Player name
            <input
              value={nameInput}
              onChange={(event) => setNameInput(event.target.value)}
              placeholder="e.g. Cristiano"
              autoFocus
              className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-white focus:outline-none"
            />
          </label>
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 rounded-2xl px-4 py-3 text-base font-semibold text-stone-900 hover:opacity-90 transition"
              style={{ backgroundColor: teamColor }}
            >
              {activePlayer ? "Update" : "Add"}
            </button>
            <button
              type="button"
              onClick={() => setNameInput("")}
              className="rounded-2xl border border-white/25 px-4 py-3 text-base text-white hover:bg-white/5 transition"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
