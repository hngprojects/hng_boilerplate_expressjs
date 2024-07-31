import subprocess
import sys

def run_tests():
    python_executable = sys.executable
    test_command = [python_executable, "-m", "pytest", "-v"]
    result = subprocess.run(test_command, capture_output=True, text=True)
    return result.stdout, result.returncode

if __name__ == "__main__":
    output, exit_code = run_tests()
    print(output)
    if exit_code != 0:
        print("Some tests failed.")
    else:
        print("All tests passed.")
