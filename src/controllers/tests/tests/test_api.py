import requests
import pytest
from faker import Faker
import logging

fake = Faker()
BASE_URL = "https://deployment.api-expressjs.boilerplate.hng.tech/api/v1"

# Configure logging
logging.basicConfig(filename='test_results.log', level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def generate_random_user():
    return {
        "first_name": fake.first_name(),
        "last_name": fake.last_name(),
        "email": fake.email(),
        "password": fake.password()
    }

@pytest.fixture(scope="module")
def access_token():
    url = f"{BASE_URL}/auth/register"
    payload = generate_random_user()
    response = requests.post(url, json=payload)
    logging.info(f"Register Response: {response.json()}")
    assert response.status_code == 201, f"Expected status code 201, but got {response.status_code}"
    data = response.json()
    # Adjust the assertions based on the actual response structure
    assert "access_token" in data, "Response does not contain 'access_token'"
    return data["access_token"]

def test_register_user():
    url = f"{BASE_URL}/auth/register"
    payload = generate_random_user()
    response = requests.post(url, json=payload)
    logging.info(f"Register Response: {response.json()}")
    assert response.status_code == 201, f"Expected status code 201, but got {response.status_code}"
    data = response.json()
    # Adjust the assertions based on the actual response structure
    assert "access_token" in data, "Response does not contain 'access_token'"

def test_help_center_topics(access_token):
    url = f"{BASE_URL}/help-center/topics"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    response = requests.get(url, headers=headers)
    logging.info(f"Help Center Topics Response: {response.json()}")
    assert response.status_code == 200, f"Expected status code 200, but got {response.status_code}"
    data = response.json()
    assert data["success"] == True, "Response 'success' field is not True"
    assert data["message"] == "Fetch Successful", f"Unexpected message: {data['message']}"
    assert isinstance(data["data"], list), "Response 'data' field is not a list"

if __name__ == "__main__":
    pytest.main()
