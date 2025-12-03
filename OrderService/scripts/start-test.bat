@echo off
REM ===================================================================
REM OrderService JMeter Performance Test Execution Script
REM ===================================================================
REM This script runs JMeter performance tests for the OrderService
REM using the Maven JMeter plugin.
REM
REM Prerequisites:
REM - OrderService must be running on http://localhost:8081
REM - Maven must be installed and available in PATH
REM ===================================================================

echo.
echo =================================================================
echo   OrderService JMeter Performance Test
echo =================================================================
echo.

REM Navigate to OrderService directory (parent of scripts folder)
cd /d "%~dp0.."

echo [INFO] Cleaning previous test results...
if exist "target\jmeter\results" (
    rmdir /s /q "target\jmeter\results"
    echo [INFO] Previous results cleaned.
) else (
    echo [INFO] No previous results found.
)
echo.

echo [INFO] Starting JMeter performance tests...
echo [INFO] Test Configuration:
echo        - Threads: 10 users
echo        - Ramp-up: 5 seconds
echo        - Iterations: 2 loops
echo        - Target: http://localhost:8081
echo.
echo [INFO] This may take a few minutes...
echo.

REM Run Maven to compile project and execute JMeter tests
call mvn clean compile jmeter:jmeter

if %ERRORLEVEL% EQU 0 (
    echo.
    echo =================================================================
    echo   JMeter Tests Completed Successfully!
    echo =================================================================
    echo.
    echo [INFO] Test results saved to: target\jmeter\results
    echo.
    echo [NEXT STEPS] Run analyze-results.bat to view the HTML report
    echo.
) else (
    echo.
    echo =================================================================
    echo   JMeter Tests Failed or Encountered Errors
    echo =================================================================
    echo.
    echo [ERROR] Check the console output above for details.
    echo [ERROR] Ensure OrderService is running on http://localhost:8081
    echo.
)

pause
