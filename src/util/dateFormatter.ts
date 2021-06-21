export const formatter = new Intl.DateTimeFormat(
  Intl.DateTimeFormat().resolvedOptions().locale,
  {
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', hour12: false
  }
)
