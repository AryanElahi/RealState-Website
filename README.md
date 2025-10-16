## Project Overview

This repository contains the source code for the **Backend API** of the Zhingeh Real Estate Virtual Experience Platform. The objective of this project is to provide a **secure, scalable, and high-performance RESTful API** that serves as the foundation for advanced client-side functionalities, such as 3D tours and online appointment booking.

This backend layer is responsible for handling all **business logic**, **database interactions**, **user authentication**, and the complex **visit scheduling systems**.

***

## ✨ Key Backend Features (Business Logic Focus)

This API is designed to support sophisticated real estate processes, emphasizing user interaction, property data integrity, and scheduling reliability:

| Key Capability | Technical Description | Relevant API Routes |
| :--- | :--- | :--- |
| **Token-Based Authentication** | Implements a secure login/registration mechanism using **JSON Web Tokens (JWT)** and features phone number verification. Manages profile updates and user sessions. | `/auth/register`, `/auth/login`, `/auth/verify` |
| **Advanced Search & Filtering** | Supports complex, multi-parameter queries to efficiently search property data based on criteria like price, location, size, and property type. | `/announce/search` |
| **Listing Management Workflow (CRUD)** | Manages the full lifecycle of a property listing, including creation, image upload, and tracking the **admin confirmation status**. | `/announce/creatAnnounce`, `/announce/uploadPhotos` |
| **Online Visit Booking System** | Manages the scheduling of physical property viewings. Includes creating, tracking, and updating the status of viewing requests (checked/unchecked). | `/request/creatrequest`, `/request/getAll`, `/request/check` |
| **Role-Based Access Control (RBAC)** | Implements distinct access levels for regular users and administrators, providing dedicated, protected routes for crucial management tasks. | `/admin/varifyannounce`, `/admin/promotToAdmin` |

***

## 🛠️ Technical Stack

| Area | Technology Used | Rationale for Selection |
| :--- | :--- | :--- |
| **Language & Framework** | **[Your Language/Framework, e.g., Node.js/Express, Python/Django]** | Chosen for its high performance, scalability, and suitability for rapid API development. |
| **Database (DB)** | **[Your Database, e.g., PostgreSQL, MongoDB]** | Selected for reliability, transactional support, and efficient management of structured property data. |
| **Authentication** | **JWT (JSON Web Tokens)** | Industry standard for secure, stateless authentication, which is essential for a modern, scalable RESTful API. |
| **Testing** | [Your Testing Framework, e.g., Jest, Pytest] | Ensures API reliability and prevents regressions in business logic. |

***

## 📑 API Documentation (Endpoints)

All API routes are organized in a clear RESTful structure, as extracted from the project documentation.

> **Note:** All routes are prefixed with `/api/V1/`.

### A. User Authentication and Management

| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/V1/auth/register` | Register a new user. |
| `POST` | `/api/V1/auth/login` | User login and token issuance. |
| `POST` | `/api/V1/auth/verify` | Verify the user's phone number. |
| `PUT` | `/api/V1/auth/updateuser` | Update user profile information. |

### B. Announcement (Listing) Management

| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/V1/announce/creatAnnounce` | Create a new property listing (requires authentication). |
| `GET` | `/api/V1/announce/getallannounce` | Retrieve all confirmed listings. |
| `POST` | `/api/V1/announce/search` | Search using advanced filters. |
| `POST` | `/apiV1/announce/uploadPhotos` | Upload and attach images to a listing. |
| `DELETE` | `/api/V1/announce/hdelete` | Delete a listing. |

### C. Viewing Requests and Booking

| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/V1/request/creatrequest` | Submit a request to book a physical viewing. |
| `GET` | `/api/V1/request/getAll` | Retrieve all requests (Admin only). |
| `PUT` | `/api/V1/request/check` | Mark a request as "checked/processed." |

### D. Admin and Management Routes (Admin Access Required)

| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/V1/admin/varifyannounce` | Verify and publish a listing. |
| `POST` | `api/V1/admin/creatVisit` | Log a new visit in the work calendar. |
| `GET` | `/api/V1/admin/notconfirmedannouncements` | Retrieve listings awaiting admin confirmation. |
| `PUT` | `/api/V1/admin/promotToAdmin` | Elevate a user's role to Admin. |

***

## 🌟 Portfolio Showcase

This project demonstrates strong proficiency in the following high-demand areas:

* **Scalable Backend Architecture:** Expertise in designing a modular, performant, and maintainable API structure.
* **Security & Authentication:** Mastery of token-based security and effective implementation of role-based access control (RBAC).
* **Complex Business Logic:** Proven ability to translate intricate business requirements (like multi-step booking and verification workflows) into reliable server-side code.
* **Data Integrity:** Focus on transactional integrity and efficient querying for core property and scheduling data.
