# 📄 Synopsis Report Compilation Instructions

## Prerequisites

### Required Software
1. **LaTeX Distribution** - Install one of the following:
   - **MiKTeX** (Windows) - https://miktex.org/
   - **TeX Live** (Cross-platform) - https://www.tug.org/texlive/
   - **MacTeX** (macOS) - https://www.tug.org/mactex/

### Required Packages
The following LaTeX packages are used in the synopsis:
- `tikz` - For creating diagrams
- `geometry` - For page margins
- `times` - For Times New Roman font
- `graphicx` - For images
- `float` - For figure positioning
- `enumitem` - For custom lists
- `url` - For URLs
- `cite` - For citations
- `amsmath`, `amsfonts`, `amssymb` - For mathematical symbols
- `booktabs` - For professional tables
- `array`, `multirow` - For table formatting
- `hyperref` - For hyperlinks
- `fancyhdr` - For headers and footers
- `setspace` - For line spacing

## Compilation Methods

### Method 1: Using the Batch File (Windows)
1. Double-click `compile_synopsis.bat`
2. The script will automatically compile the document three times
3. Check for `Synopsis_Report.pdf` in the same directory

### Method 2: Manual Compilation
```bash
# First pass
pdflatex Synopsis_Report.tex

# Second pass (for cross-references)
pdflatex Synopsis_Report.tex

# Third pass (for bibliography)
pdflatex Synopsis_Report.tex
```

### Method 3: Using LaTeX IDE
1. Open `Synopsis_Report.tex` in your LaTeX editor
2. Use the "Build" or "Compile" button
3. Make sure to compile multiple times for proper cross-references

## File Structure
```
├── Synopsis_Report.tex          # Main LaTeX file
├── compile_synopsis.bat         # Windows compilation script
├── system_architecture.tex      # System architecture diagram
├── data_flow_diagram.tex        # Data flow diagram
└── Synopsis_Compilation_Instructions.md
```

## Troubleshooting

### Common Issues

#### 1. Missing Packages
**Error:** `! LaTeX Error: File 'tikz.sty' not found.`
**Solution:** Install the missing package through your LaTeX distribution's package manager.

#### 2. Font Issues
**Error:** `! LaTeX Error: Font shape 'T1/times/m/n' not defined.`
**Solution:** Install the `times` package or use `\usepackage{mathptmx}` as alternative.

#### 3. Compilation Errors
**Error:** `! LaTeX Error: There's no line here to end.`
**Solution:** Check for missing `\\` or `\end{}` commands in the LaTeX code.

#### 4. Bibliography Issues
**Error:** References not showing properly
**Solution:** Make sure to compile the document at least 3 times for proper bibliography processing.

### Manual Package Installation (MiKTeX)
1. Open MiKTeX Console
2. Go to "Packages" tab
3. Search for missing packages
4. Install them individually

### Manual Package Installation (TeX Live)
```bash
# Update package database
tlmgr update --self

# Install specific packages
tlmgr install tikz
tlmgr install geometry
tlmgr install times
```

## Customization

### Updating Personal Information
Edit the following sections in `Synopsis_Report.tex`:
- Line 23: `[STUDENT NAME]`
- Line 24: `[ROLL NO]`
- Line 27: `[GUIDE NAME]`

### Modifying Diagrams
- Edit `system_architecture.tex` for system architecture changes
- Edit `data_flow_diagram.tex` for data flow modifications
- Both files use TikZ for vector graphics

### Adding References
Add new references in the `\begin{thebibliography}{25}` section following IEEE format.

## Output Verification

### Check These Elements
1. **Title Page** - All personal information filled
2. **Table of Contents** - Properly generated
3. **Diagrams** - System architecture and data flow diagrams visible
4. **Tables** - All tables properly formatted
5. **References** - Bibliography correctly numbered
6. **Page Numbers** - Bottom center, Arabic numerals
7. **Margins** - Proper spacing as per requirements

### Page Count
Expected page count: 15-20 pages
- Title page: 1
- Table of contents: 1
- Main content: 13-18 pages

## Final Checklist

- [ ] All personal information updated
- [ ] Diagrams compile without errors
- [ ] Tables are properly formatted
- [ ] References follow IEEE format
- [ ] Page margins are correct (Top: 2.5cm, Bottom: 2.5cm, Left: 3.5cm, Right: 2cm)
- [ ] Font is Times New Roman, 12pt for headings, 11pt for content
- [ ] Line spacing is 1.5
- [ ] Page numbers are at bottom center
- [ ] All figures have proper captions
- [ ] Document compiles without errors

## Support

If you encounter issues:
1. Check the LaTeX log file for specific errors
2. Ensure all required packages are installed
3. Verify the LaTeX distribution is up to date
4. Try compiling with a different LaTeX editor

## Notes

- The document uses `\begin{figure}[H]` for figure positioning
- All diagrams are created using TikZ for scalability
- The document follows academic formatting standards
- Bibliography uses manual entries (not BibTeX) for better control
