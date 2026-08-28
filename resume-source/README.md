# Resume source

`resume.html` is the editable source of the resume PDF the site serves at
`public/Bhushan_157317526.pdf` (the "Download Resume" button).

## To update the resume

1. Edit `resume.html` (plain HTML/CSS — the font file next to it must stay).
2. Print it to PDF with headless Chrome (Windows):

```
chrome --headless=new --disable-gpu --user-data-dir="%TEMP%\chrome-pdf-profile" --no-pdf-header-footer --print-to-pdf="out.pdf" "file:///C:/path/to/resume-source/resume.html"
```

Gotchas learned the hard way:
- The `file:///` URL must use forward slashes.
- `--user-data-dir` pointing at a throwaway folder is REQUIRED if Chrome is
  already running (otherwise the PDF silently comes out 0 bytes).
- Do NOT combine `--virtual-time-budget` with `--print-to-pdf` — empty output.

3. Replace `public/Bhushan_157317526.pdf` with the new PDF (same filename —
   the site's download button needs no code change), commit, push. Netlify
   deploys it automatically.
