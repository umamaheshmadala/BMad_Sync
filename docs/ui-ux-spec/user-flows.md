# User Flows
For critical user tasks, the system will provide clear, intuitive flows, addressing success paths, decision points, and error states.

User Authentication & Onboarding Flow
User Goal: Successfully sign up, log in, and complete initial profile setup to access the personalized dashboard.

Entry Points: SynC Homepage ("Sign Up" / "Login" buttons), Marketing Campaign redirects.

Success Criteria: User lands on a fully personalized and functional dashboard.

Flow Diagram
Code snippet

graph TD
    A[Start: Access SynC] --> B{Existing User?}
    B -- No --> C[User Signup Form]
    C --> D{Signup Successful?}
    D -- Yes --> E[User Profile Setup: Name, Avatar]
    E --> F[User City & Interests Selection]
    F --> G{Min 5 Interests Selected?}
    G -- Yes --> H[Redirect to User Dashboard]
    D -- No --> CError[Signup Error: Display Message]
    E --> ErrorA[Profile Error: Display Message]
    F --> ErrorB[Interest Selection Error: Display Message]

    B -- Yes --> I[User Login Form]
    I --> J{Login Successful?}
    J -- Yes --> K[Redirect to User Dashboard]
    J -- No --> IError[Login Error: Display Message]
    K --> UserDashboardContent[Personalized Dashboard Content]

    CError --> C
    IError --> I
    ErrorA --> E
    ErrorB --> F