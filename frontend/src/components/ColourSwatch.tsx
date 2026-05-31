export function ColourSwatch({ colour }: { colour: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
      <span
        className="size-3 rounded-full border border-border"
        style={{ backgroundColor: colour }}
        aria-hidden
      />
      <span className="capitalize">{colour}</span>
    </span>
  )
}
