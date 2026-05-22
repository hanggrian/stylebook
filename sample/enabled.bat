@ECHO OFF

REM P004: need to use !variables!
SETLOCAL EnableDelayedExpansion

REM E001: proper parentheses nesting
IF EXIST "file.txt" (
    ECHO Found file
    IF "!VAR!"=="value" (
        ECHO Nested
    )
)

REM E002: GOTO points to existing label
GOTO start
:start

REM E003: proper IF formatting
IF "%VAR%"=="value" ECHO Match

REM E004: proper IF EXIST syntax
IF EXIST file.txt ECHO Found

REM E005: valid path syntax
COPY "%USERPROFILE%\valid\path\file.txt" dest
IF ERRORLEVEL 1 ECHO Error copying file

REM E006: variable defined before use
SET MY_VAR=value
ECHO %MY_VAR%

REM E007: proper empty variable check
IF "%MY_VAR%"=="" ECHO Empty

REM E009: matched quotes
ECHO "Hello World"

REM E010: FOR loop with DO
FOR %%i IN (*.txt) DO ECHO %%i

REM E016: valid errorlevel syntax
IF NOT ERRORLEVEL 1 (
    ECHO Success
)

REM E017: valid percent-tilde syntax
ECHO %~n1

REM E019: percent-tilde on parameter
ECHO %~f1

REM E020: double percent in batch FOR loop
FOR %%i IN (*.txt) DO ECHO %%i

REM E021: valid string operation syntax
ECHO %MY_VAR:~0,5%

REM E022: quoted SET /A expression
SET /a "result=5*2"

REM E023: quoted special chars in SET /A
SET /a "result=(5+3)*2"

REM E027: local path as working directory
CD "%USERPROFILE%"

REM E030: proper caret escape
ECHO Hello World

REM E032: continuation without trailing spaces
ECHO Hello ^
     World

REM SEC005, E034: no removed commands
NET SESSION >nul 2>&1 || NET VIEW \\computer >nul 2>&1
IF ERRORLEVEL 1 ECHO Error querying network
FC /B file1.txt file2.txt >nul 2>&1

REM W002: ERRORLEVEL check after critical operation
DEL "%TEMP%\important_file.txt" 2>nul
IF ERRORLEVEL 1 (
    ECHO Error deleting file
    GOTO cleanup
)

REM W003: error handling on file operation
COPY "%USERPROFILE%\source.txt" "%USERPROFILE%\destination.txt" 2>nul
IF ERRORLEVEL 1 (
    ECHO Error copying file
    GOTO cleanup
)
ECHO Copy successful

REM W004: loop with exit condition
SET /a counter=0
:loop
SET /a counter+=1
IF "%counter%" LSS "10" GOTO loop

REM W005: quoted variable with spaces
SET "PROGRAM_FILES=%ProgramFiles%"
IF "%PROGRAM_FILES%"=="C:\Program Files" ECHO Match

REM W006: network operation with timeout
PING -n 4 google.com >nul 2>&1
IF ERRORLEVEL 1 ECHO Ping failed

REM W008: temporary PATH modification
SET "PATH=%PATH%;C:\MyApp"

REM W009: compatible input method
SET /p answer="Continue? (y/n): "

REM W012: ASCII characters only
ECHO Hello World

REM W013: unique labels
:first
ECHO First
:second
ECHO Second

REM W017: unambiguous errorlevel check
IF NOT ERRORLEVEL 1 (
    ECHO Success only
)

REM W019: GOTO to existing label with CRLF line endings
GOTO aftergoto
:aftergoto

REM W021: quoted IF comparison
IF "%username%"=="admin" ECHO admin

REM W024: modern alternatives to deprecated commands
powershell -Command "Get-WmiObject Win32_OperatingSystem" >nul 2>&1
IF ERRORLEVEL 1 ECHO PowerShell query failed
ICACLS file.txt /grant user:F >nul 2>&1
IF ERRORLEVEL 1 ECHO ICACLS failed
NET SESSION >nul 2>&1 || ^
  SCHTASKS /create /tn "Task" /tr script.bat daily >nul 2>&1
IF ERRORLEVEL 1 ECHO Task creation failed

REM W025: error redirection present
DEL "%TEMP%\temp_%%RANDOM%%.txt" 2>nul
COPY "%USERPROFILE%\file1.txt" "%USERPROFILE%\file2.txt" 2>nul
IF ERRORLEVEL 1 ECHO Copy failed

REM W034: FOR /F with usebackq
FOR /F "usebackq tokens=*" %%i IN (`dir /b`) DO ECHO %%i

REM W035: FOR /F with explicit delimiters
REM W036: FOR /F with skip for headers
FOR /F "skip=1 tokens=* delims=," %%i IN (data.csv) DO ECHO %%i %%j

REM W041: error handling for external commands
NET SESSION >nul 2>&1
IF ERRORLEVEL 1 (
    ECHO This script requires administrator privileges
    GOTO cleanup
)
NET SESSION >nul 2>&1 || QUERY >nul 2>&1
NET SESSION >nul 2>&1
IF ERRORLEVEL 1 (
    ECHO Admin check failed
    EXIT /b 1
)

REM W042: TIMEOUT with /NOBREAK
TIMEOUT /T 10 /NOBREAK >nul

REM S003: consistent uppercase commands
ECHO Hello
SET var=value
IF EXIST file.txt DEL file.txt 2>nul

REM S009: named constant instead of magic number
SET TIMEOUT_SECONDS=30
TIMEOUT /t "%TIMEOUT_SECONDS%" /NOBREAK >nul

REM S016: safe REM comment instead of double-colon
REM This comment is always safe

REM Function: MyFunction
REM Purpose: Demonstrates a documented subroutine
REM Parameters: none
REM Returns: nothing
:MyFunction
ECHO Processing
GOTO :EOF

REM S020: long line split with continuation
COPY "%USERPROFILE%\Very\Long\Path\With\Many\Directories\file.txt" ^
     "%USERPROFILE%\Another\Very\Long\Destination\Path\file.txt" 2>nul
IF ERRORLEVEL 1 ECHO Copy failed

REM S028: no redundant parentheses
ECHO Hello

REM SEC001: validated user input
SET /p input="Enter filename: "
IF DEFINED input DEL "%input%" 2>nul

REM SEC002: safe SET with quotes
SET "var=Hello World"
SET /p userfile="Enter file: "
IF DEFINED userfile (
    COPY "%userfile%" "%USERPROFILE%\backup\"
    IF ERRORLEVEL 1 (
        EXIT /b 1
    )
)

REM SEC004: safe registry query
REG QUERY "HKLM\SOFTWARE\MyApp" >nul 2>&1
IF ERRORLEVEL 1 (
    EXIT /b 1
)

REM SEC006: environment variable instead of hardcoded path
COPY "%USERPROFILE%\file.txt" dest 2>nul
IF ERRORLEVEL 1 ECHO Copy failed

REM SEC007: %TEMP% instead of hardcoded temp path
ECHO data > "%TEMP%\myfile.txt"

REM SEC011: validated destination path
SET "DEST_DIR=C:\Safe\Directory"
COPY file.txt "%DEST_DIR%\" 2>nul
IF ERRORLEVEL 1 (
    EXIT /b 1
)

REM SEC012: random component in temp filename
ECHO content > "%TEMP%\myfile_%RANDOM%.tmp"

REM P001: single existence check, no redundancy
IF EXIST file.txt (
    DEL file.txt 2>nul
    IF ERRORLEVEL 1 (
        EXIT /b 1
    )
)

REM P007: random component in temp filename
ECHO data > "%TEMP%\temp_%RANDOM%.txt"

REM P013: /B flag for DIR in FOR loop
FOR /F "tokens=*" %%i IN ('dir /b *.log') DO ECHO %%i

REM P014: redirect unnecessary output
DIR /F /B >nul 2>&1

REM P015: proper delay with TIMEOUT
TIMEOUT /T 5 /NOBREAK >nul

REM P023: efficient arithmetic
SET /a "result=0+2"

:cleanup
ENDLOCAL
PAUSE
EXIT /b 0
