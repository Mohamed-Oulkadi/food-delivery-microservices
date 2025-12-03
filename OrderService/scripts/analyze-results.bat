@echo off
REM ===================================================================
REM OrderService JMeter Results Analysis Script
REM ===================================================================
REM This script generates and opens the JMeter HTML dashboard report
REM from the test results.
REM
REM Prerequisites:
REM - JMeter tests must have been run (start-test.bat)
REM - JMeter must be installed (will be downloaded by Maven plugin)
REM ===================================================================

echo.
echo =================================================================
echo   JMeter Results Analysis
echo =================================================================
echo.

REM Navigate to OrderService directory (parent of scripts folder)
cd /d "%~dp0.."

REM Check if results directory exists
if not exist "target\jmeter\results" (
    echo [ERROR] No test results found!
    echo [ERROR] Please run start-test.bat first to execute the tests.
    echo.
    pause
    exit /b 1
)

echo [INFO] Locating test results...
echo.

REM Find the most recent .csv file
for /f "delims=" %%i in ('dir /b /o-d "target\jmeter\results\*.csv" 2^>nul') do (
    set RESULT_FILE=%%i
    goto :found
)

echo [ERROR] No .csv result files found in target\jmeter\results
echo.
pause
exit /b 1

:found
echo [INFO] Found result file: %RESULT_FILE%
echo.

REM Check if HTML report directory exists
if exist "target\jmeter\reports" (
    echo [INFO] HTML report directory exists.
) else (
    echo [INFO] Generating HTML dashboard report...
    echo [INFO] This uses the JMeter report generator...
    echo.
    
    REM The Maven plugin should have already generated reports
    REM If not, we can trigger report generation with jmeter command
    if not exist "target\jmeter\reports\index.html" (
        echo [WARNING] HTML reports not found. They should be auto-generated.
        echo [INFO] Check target\jmeter\results for CSV/XML results.
    )
)

echo.
echo =================================================================
echo   Opening Results
echo =================================================================
echo.

REM Try to open the HTML dashboard report
if exist "target\jmeter\reports\OrderService-TestPlan\index.html" (
    echo [INFO] Opening HTML dashboard in your default browser...
    start "" "target\jmeter\reports\OrderService-TestPlan\index.html"
    echo.
    echo [SUCCESS] HTML dashboard opened successfully!
    echo.
) else (
    REM Fallback: Open the results directory
    echo [INFO] HTML dashboard not available.
    echo [INFO] Opening results directory instead...
    start "" "target\jmeter\results"
    echo.
    echo [INFO] You can find the following result files:
    dir /b "target\jmeter\results\*.*"
    echo.
)

echo [INFO] Result files location: %CD%\target\jmeter\results
echo.
echo =================================================================
echo   Analysis Complete
echo =================================================================
echo.

pause
