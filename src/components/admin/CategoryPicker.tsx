/** Industry checkboxes for a product. Submits one `category` value per tick; actions join them with ", ". */
export default function CategoryPicker({ industries, selected = [] }: { industries: string[]; selected?: string[] }) {
  // Keep values that are no longer an industry so editing a product never silently drops them.
  const names = [...industries, ...selected.filter((s) => !industries.includes(s))];
  return (
    <div className="grid max-h-56 grid-cols-2 gap-2 overflow-y-auto rounded-xl border border-border bg-white p-3 sm:grid-cols-3">
      {names.map((n) => (
        <label key={n} className="flex items-center gap-2 text-sm text-dark">
          <input type="checkbox" name="category" value={n} defaultChecked={selected.includes(n)} className="h-4 w-4 accent-primary" />
          {n}
        </label>
      ))}
    </div>
  );
}
