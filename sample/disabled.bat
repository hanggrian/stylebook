@ECHO OFF

REM E006: undefined variable, inconsistent because comments are parsed
IF "%VAR%"=="value" ECHO Match

REM E008: unreachable code, inconsistent if there is exit command in if
REM statement
IF EXIST file.txt (
    DEL file.txt 2>nul
    IF ERRORLEVEL 1 (
        EXIT /b 1
    )
)

REM S013: header documentation

REM S003, S022: command and variable casing, inconsistent because comments are
REM parsed
set FOO="Foo"
if "%FOO%"=="Bar" echo Match

GOTO :main

REM S018: missing subroutine documentation
:first
ECHO First
EXIT /b 0

:second
ECHO Second
EXIT /b 0

:main
REM SEC003: confirmation before dangerous command
SET /p confirm="Delete all files? (y/n): "
IF /i "%confirm%"=="y" DEL *.* /q 2>nul
PAUSE

REM SEC006: hardcoded path
SET "PROGRAM_FILES=%ProgramFiles%"
IF "%PROGRAM_FILES%"=="C:\Program Files" ECHO Match

REM SEC013: sanitized variable before use
IF DEFINED user_input ECHO "%user_input%"

REM W028: SET in .bat/.cmd
SET "user_input=hello world"

REM W010: architecture-aware registry operation
IF "%PROCESSOR_ARCHITECTURE%"=="AMD64" (
    REG QUERY "HKLM\SOFTWARE\Wow6432Node\MyApp" >nul 2>&1
    IF ERRORLEVEL 1 ECHO Registry key not found
    EXIT /b 0
) ELSE (
    REG QUERY "HKLM\SOFTWARE\MyApp" >nul 2>&1
    IF ERRORLEVEL 1 ECHO Registry key not found
    EXIT /b 0
)
