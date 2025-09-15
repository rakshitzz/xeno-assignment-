@echo off
echo Compiling LaTeX Synopsis Report...
echo.

REM Check if pdflatex is available
where pdflatex >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: pdflatex not found in PATH
    echo Please install MiKTeX or TeX Live
    pause
    exit /b 1
)

echo Running pdflatex (first pass)...
pdflatex Synopsis_Report.tex

echo.
echo Running pdflatex (second pass)...
pdflatex Synopsis_Report.tex

echo.
echo Running pdflatex (third pass for references)...
pdflatex Synopsis_Report.tex

echo.
echo Compilation complete!
echo Output file: Synopsis_Report.pdf

REM Clean up auxiliary files
echo Cleaning up auxiliary files...
del *.aux *.log *.toc *.out *.fdb_latexmk *.fls *.synctex.gz

echo.
echo Done! Check Synopsis_Report.pdf
pause
