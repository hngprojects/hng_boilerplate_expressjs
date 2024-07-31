import requests
import pytest
from faker import Faker

fake = Faker()

BASE_URL = "https://deployment.api-expressjs.boilerplate.hng.tech/api/v1"

# Utility function to generate random data for tests
def generate_random_user():
    return {
        "first_name": fake.first_name(),
        "last_name": fake.last_name(),
        "email": fake.email(),
        "password": fake.password()
    }

# Utility function to log in and return a token
def login_and_get_token(email, password):
    url = f"{BASE_URL}/auth/login"
    payload = {
        "email": email,
        "password": password
    }
    response = requests.post(url, json=payload)
    assert response.status_code == 200
    data = response.json()
    return data["data"]["token"]

def test_register_user():
    url = f"{BASE_URL}/auth/register"
    payload = generate_random_user()
    response = requests.post(url, json=payload)
    print("Register Response:", response.json())
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == 201
    assert data["message"] == "User registered successfully"
    assert "data" in data

@pytest.mark.parametrize("otp, token, expected_status, expected_message", [
    (968733, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5ZTk4MjY2NC1iOGNmLTRiYTMtOGQyZi00ZjBiODc3N2U4MDQiLCJpYXQiOjE3MjIyODA1MDAsImV4cCI6MTcyMjM2NjkwMH0.PKBEs9jvbsr89Z4XkCrqilvUIXBBQ2lrX-g8ytPQt7o", 200, "OTP verified successfully"),
    (123456, "invalid_token", 400, "Invalid token")
])
def test_verify_otp(otp, token, expected_status, expected_message):
    url = f"{BASE_URL}/auth/verify-otp"
    payload = {
        "otp": otp,
        "token": token
    }
    response = requests.post(url, json=payload)
    print("Verify OTP Response:", response.json())
    assert response.status_code == expected_status
    data = response.json()
    assert data["status"] == expected_status
    assert data["message"] == expected_message

def test_forgot_password():
    url = f"{BASE_URL}/auth/forgot-password"
    payload = {
        "email": "obetscollins1@gmail.com"
    }
    response = requests.post(url, json=payload)
    print("Forgot Password Response:", response.json())
    assert response.status_code in [200, 404]  # Assuming the email might not exist
    data = response.json()
    assert "status" in data
    assert "message" in data

def test_change_password():
    # Assuming user is already registered and logged in
    email = "obetscollins1@gmail.com"
    password = "test123#"
    token = login_and_get_token(email, password)
    
    url = f"{BASE_URL}/auth/change-password"
    payload = {
        "oldPassword": "test123#",
        "newPassword": "test1234#",
        "confirmPassword": "test1234#"
    }
    headers = {
        "Authorization": f"Bearer {token}"
    }
    response = requests.post(url, json=payload, headers=headers)
    print("Change Password Response:", response.json())
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == 200
    assert data["message"] == "Password changed successfully"

# Continue adding tests for other endpoints in a similar manner
def test_help_center_topics_post():
    url = f"{BASE_URL}/help-center/topics"
    payload = {
        "title": "Test Title 22",
        "content": "Test Content",
        "author": "Collins"
    }
    response = requests.post(url, json=payload)
    print("Help Center Topics Post Response:", response.json())
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == 201
    assert data["message"] == "Topic created successfully"
    assert "data" in data

def test_help_center_topics_get():
    url = f"{BASE_URL}/help-center/topics"
    response = requests.get(url)
    print("Help Center Topics Get Response:", response.json())
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == 200
    assert "data" in data

def test_help_center_topic_get():
    url = f"{BASE_URL}/help-center/topics/0f46b8aa-d3a5-48e2-8a95-262778a80f93"
    response = requests.get(url)
    print("Help Center Topic Get Response:", response.json())
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == 200
    assert "data" in data

def test_help_center_topic_delete():
    url = f"{BASE_URL}/help-center/topics/0f46b8aa-d3a5-48e2-8a95-262778a80f93"
    response = requests.delete(url)
    print("Help Center Topic Delete Response:", response.json())
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == 200
    assert data["message"] == "Topic deleted successfully"

def test_help_center_topic_patch():
    url = f"{BASE_URL}/help-center/topics/29ae76ff-fa63-4f60-b20a-a25b62af7f1b"
    payload = {
        "title": "New Test Title 22",
        "content": "Test Content",
        "author": "Collins"
    }
    response = requests.patch(url, json=payload)
    print("Help Center Topic Patch Response:", response.json())
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == 200
    assert data["message"] == "Topic updated successfully"
    assert "data" in data

def test_initiate_payment():
    url = f"{BASE_URL}/payments/flutterwave/initiate"
    payload = {
        "card_number": "string",
        "cvv": "string",
        "expiry_month": "string",
        "expiry_year": "string",
        "email": "string",
        "fullname": "string",
        "phone_number": "string",
        "currency": "string",
        "amount": 0,
        "payer_id": "string",
        "payer_type": "user"
    }
    response = requests.post(url, json=payload)
    print("Initiate Payment Response:", response.json())
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == 200
    assert data["message"] == "Payment initiated successfully"
    assert "data" in data

def test_create_testimonial():
    url = f"{BASE_URL}/testimonials"
    payload = {
        "client_name": "client 1",
        "client_position": "position 1",
        "testimonial": "testimonial 1"
    }
    response = requests.post(url, json=payload)
    print("Create Testimonial Response:", response.json())
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == 201
    assert data["message"] == "Testimonial created successfully"
    assert "data" in data

def test_get_testimonial():
    url = f"{BASE_URL}/testimonials/f284cefc-c636-4fa0-a865-c286043f28b4"
    response = requests.get(url)
    print("Get Testimonial Response:", response.json())
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == 200
    assert "data" in data

def test_update_testimonial():
    url = f"{BASE_URL}/testimonials/f284cefc-c636-4fa0-a865-c286043f28b4"
    payload = {
        "client_name": "client 1",
        "client_position": "position 1",
        "testimonial": "testimonial 1"
    }
    response = requests.patch(url, json=payload)
    print("Update Testimonial Response:", response.json())
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == 200
    assert data["message"] == "Testimonial updated successfully"
    assert "data" in data

def test_delete_testimonial():
    url = f"{BASE_URL}/testimonials/f284cefc-c636-4fa0-a865-c286043f28b4"
    response = requests.delete(url)
    print("Delete Testimonial Response:", response.json())
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == 200
    assert data["message"] == "Testimonial deleted successfully"

def test_create_topic_comment():
    url = f"{BASE_URL}/comments/0f46b8aa-d3a5-48e2-8a95-262778a80f93"
    payload = {
        "comment": "string",
        "author": "string"
    }
    response = requests.post(url, json=payload)
    print("Create Topic Comment Response:", response.json())
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == 201
    assert data["message"] == "Comment added successfully"
    assert "data" in data

def test_get_topic_comment():
    url = f"{BASE_URL}/comments/56cb91bd-c346-41b4-82d6-80d27e56c60e"
    response = requests.get(url)
    print("Get Topic Comment Response:", response.json())
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == 200
    assert "data" in data

def test_update_topic_comment():
    url = f"{BASE_URL}/comments/56cb91bd-c346-41b4-82d6-80d27e56c60e"
    payload = {
        "comment": "string",
        "author": "string"
    }
    response = requests.patch(url, json=payload)
    print("Update Topic Comment Response:", response.json())
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == 200
    assert data["message"] == "Comment updated successfully"
    assert "data" in data

def test_delete_topic_comment():
    url = f"{BASE_URL}/comments/56cb91bd-c346-41b4-82d6-80d27e56c60e"
    response = requests.delete(url)
    print("Delete Topic Comment Response:", response.json())
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == 200
    assert data["message"] == "Comment deleted successfully"

def test_get_user_me():
    # Assuming user is already registered and logged in
    email = "obetscollins1@gmail.com"
    password = "test123#"
    token = login_and_get_token(email, password)
    
    url = f"{BASE_URL}/users/me"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    response = requests.get(url, headers=headers)
    print("Get User Me Response:", response.json())
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == 200
    assert "data" in data

def test_get_users():
    # Assuming user is already registered and logged in
    email = "obetscollins1@gmail.com"
    password = "test123#"
    token = login_and_get_token(email, password)
    
    url = f"{BASE_URL}/users"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    response = requests.get(url, headers=headers)
    print("Get Users Response:", response.json())
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == 200
    assert "data" in data

def test_update_user():
    # Assuming user is already registered and logged in
    email = "obetscollins1@gmail.com"
    password = "test123#"
    token = login_and_get_token(email, password)
    
    url = f"{BASE_URL}/users/me"
    payload = {
        "first_name": "Updated First Name",
        "last_name": "Updated Last Name"
    }
    headers = {
        "Authorization": f"Bearer {token}"
    }
    response = requests.patch(url, json=payload, headers=headers)
    print("Update User Response:", response.json())
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == 200
    assert data["message"] == "User updated successfully"
    assert "data" in data

def login_and_get_token(email, password):
    url = f"{BASE_URL}/auth/login"
    payload = {
        "email": email,
        "password": password
    }
    response = requests.post(url, json=payload)
    data = response.json()
    return data["data"]["token"]

def test_contact_us():
    url = f"{BASE_URL}/contact-us"
    payload = {
        "name": "John Doe",
        "email": "johndoe@example.com",
        "phoneNumber": "1234567890",
        "message": "I would like to inquire about your services."
    }
    response = requests.post(url, json=payload)
    print("Contact Us Response:", response.json())
    data = response.json()
    assert response.status_code == 201
    assert data["status"] == 201
    assert data["message"] == "Contact request created successfully"
    assert "data" in data

def test_create_notification_settings():
    url = f"{BASE_URL}/settings/notification-settings"
    payload = {
        "user_id": "123456",
        "email_notifications": True,
        "push_notifications": False,
        "sms_notifications": True
    }
    response = requests.post(url, json=payload)
    print("Create Notification Settings Response:", response.json())
    data = response.json()
    assert response.status_code == 201
    assert data["status"] == 201
    assert data["message"] == "Notification settings created successfully"
    assert "data" in data

def test_get_notification_settings():
    url = f"{BASE_URL}/settings/notification-settings/123456"
    response = requests.get(url)
    print("Get Notification Settings Response:", response.json())
    data = response.json()
    assert response.status_code == 200
    assert data["status"] == 200
    assert "data" in data

def test_export_members_pdf():
    url = f"{BASE_URL}/organisation/members/export?format=pdf"
    response = requests.get(url)
    print("Export Members PDF Response:", response.content)
    assert response.status_code == 200

def test_export_members_csv():
    url = f"{BASE_URL}/organisation/members/export?format=csv"
    response = requests.get(url)
    print("Export Members CSV Response:", response.content)
    assert response.status_code == 200

def test_create_organisation():
    url = f"{BASE_URL}/organisations"
    payload = {
        "name": "Test Organisation",
        "description": "This is a test organisation"
    }
    response = requests.post(url, json=payload)
    print("Create Organisation Response:", response.json())
    data = response.json()
    assert response.status_code == 201
    assert data["status"] == 201
    assert data["message"] == "Organisation created successfully"
    assert "data" in data

def test_get_user_organisations():
    # Assuming user is already registered and logged in
    email = "testuser@example.com"
    password = "testpassword"
    token = login_and_get_token(email, password)
    
    url = f"{BASE_URL}/users/27bd665d-efae-4dfd-bdb0-4e0ccaf70daf/organisations"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    response = requests.get(url, headers=headers)
    print("Get User Organisations Response:", response.json())
    data = response.json()
    assert response.status_code == 200
    assert data["status"] == 200
    assert "data" in data

def test_get_organisation():
    url = f"{BASE_URL}/organisations/8f4a2050-ccef-48a8-aaac-6094765bb681"
    response = requests.get(url)
    print("Get Organisation Response:", response.json())
    data = response.json()
    assert response.status_code == 200
    assert data["status"] == 200
    assert "data" in data

def test_get_product():
    url = f"{BASE_URL}/product/0887c412-27a8-446e-ba81-fe29ecd5f340"
    response = requests.get(url)
    print("Get Product Response:", response.json())
    data = response.json()
    assert response.status_code == 200
    assert data["status"] == 200
    assert "data" in data

def test_get_products():
    url = f"{BASE_URL}/product/?page=1&limit=10"
    response = requests.get(url)
    print("Get Products Response:", response.json())
    data = response.json()
    assert response.status_code == 200
    assert data["status"] == 200
    assert "data" in data

if __name__ == "__main__":
    pytest.main()