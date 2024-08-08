# API Test Suite README

## Overview

This repository contains a set of automated tests for verifying various API endpoints. The tests are implemented using Python and the `pytest` framework, and they cover user registration, authentication, help center topics, testimonials, and more.

## Prerequisites

1. **Python**: Ensure Python 3.6 or higher is installed on your system. You can check your Python version by running:
   ```sh
   python --version
   ```
2. **pip**: Python's package installer should be available. If not, you can install it from the [official pip website](https://pip.pypa.io/en/stable/installation/).

3. **Requests Library**: Used for making HTTP requests. Install it using:

   ```sh
   pip install requests
   ```

4. **pytest**: Testing framework used to run the tests. Install it using:

   ```sh
   pip install pytest
   ```

5. **Faker**: Library for generating fake data. Install it using:
   ```sh
   pip install faker
   ```

## Setup

1. **Clone the Repository**:

   ```sh
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install Dependencies**:
   Ensure all required Python packages are installed. You can use a `requirements.txt` file if available. If not, manually install the dependencies using:

   ```sh
   pip install requests pytest faker
   ```

3. **Configure Environment**:
   Modify the `BASE_URL` in the script to point to the correct API endpoint if necessary.

## Running the Tests

1. **Navigate to the Test Script Directory**:
   Make sure you are in the directory containing the test script (e.g., `test_api.py`).

2. **Run the Tests**:
   Execute the tests using `pytest`:
   ```sh
   pytest test_api.py
   ```
   This command will run all the test functions defined in the script.

## Test Results

- **Passing Tests**: You will see output indicating which tests passed successfully.
- **Failing Tests**: Any failures will be reported with details on what went wrong. The `print` statements in the script will also output the responses from the API for debugging purposes.

## Test Script Overview

- **Imports**:

  - `requests`: For making HTTP requests to the API.
  - `pytest`: For running the test cases.
  - `Faker`: For generating random data.

- **Utility Functions**:

  - `generate_random_user()`: Creates random user data.
  - `login_and_get_token()`: Logs in a user and retrieves an authentication token.

- **Test Cases**:
  - **Register User**: Tests user registration.
  - **Verify OTP**: Tests OTP verification.
  - **Forgot Password**: Tests forgot password functionality.
  - **Change Password**: Tests password change functionality.
  - **Help Center Topics**: CRUD operations for help center topics.
  - **Testimonials**: CRUD operations for testimonials.
  - **Topic Comments**: CRUD operations for comments on topics.

## Troubleshooting

- **Issues with Dependencies**:
  If you encounter issues with installing dependencies, ensure you have the correct versions and check for any compatibility issues.

- **API Errors**:
  Ensure that the API endpoints in the script are correct and that the API server is running and accessible.

## Contributing

If you have suggestions or improvements, please fork the repository and submit a pull request. For bug reports or feature requests, open an issue on the repository's GitHub page.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
