Garage Service Management System (GSMS)

The Garage Service Management System (GSMS) is a web-based platform designed to streamline the operations of automotive service centers by digitizing the management of service requests, job cards, technician assignments, and repair progress tracking.

Traditional garages often rely on manual record keeping, paper job cards, and verbal communication between customers, technicians, and administrators. This approach can lead to lost information, inefficient workflows, delayed repairs, and poor customer communication.

GSMS addresses these challenges by providing a centralized digital system where customers can submit service requests, administrators can manage repair jobs, and technicians can update service progress in real time. The system improves transparency, accountability, and operational efficiency within garage environments.

System Overview

The system is built as a role-based web application where different users interact with the platform based on their responsibilities within the garage workflow.

The three primary user roles in the system are:

Customers
Customers can book vehicle service requests through the system and track the progress of their repairs. Once a request is submitted, it automatically generates a job card that can be managed by the garage administration.

Administrators
Administrators oversee garage operations by viewing incoming service requests, managing job cards, assigning technicians to specific repairs, and monitoring repair progress.

Technicians
Technicians access their assigned repair tasks through a technician dashboard where they can update repair statuses, add repair notes, and upload images documenting the repair process.

Core Features
User Authentication and Role Management

The system provides a login interface where users can authenticate using a username or email address along with a password. Based on the authenticated role, users are redirected to the appropriate dashboard.

Supported roles include:

Administrator

Technician

Customer

Service Booking

Customers can submit vehicle service requests through a booking form that captures essential information such as:

Customer details

Vehicle information

Description of the problem

Preferred service

Upon submission, the system automatically generates a job card representing the repair task.

Job Card Management

Job cards serve as the central unit of work within the system. Each job card contains detailed information about a repair request, including:

Customer information

Vehicle details

Problem description

Job status

Assigned technician

Repair notes

Uploaded repair images

Administrators can view all job cards and assign technicians to handle specific repairs.

Technician Task Updates

Technicians can access a dashboard displaying all repair tasks assigned to them. From this interface they can:

Update repair progress

Change job status

Add repair notes

Upload images documenting repair stages

This ensures that repair progress is consistently tracked and visible within the system.

Repair Status Tracking

Customers can monitor the progress of their service requests through a dedicated dashboard that displays updates such as:

Job status

Technician notes

Uploaded repair images

Completion notifications

This improves communication between the garage and customers while reducing the need for manual follow-ups.

System Workflow

The typical workflow within the system follows this process:

A customer submits a vehicle service request.

The system automatically generates a job card.

The administrator reviews the job card and assigns a technician.

The technician performs the repair and updates job progress.

The customer tracks repair updates through the dashboard.

Once the repair is completed, the job card status is updated accordingly.

Technology Stack

The system is built using modern web technologies including:

Frontend

HTML

CSS

JavaScript

Backend (Planned Integration)

Node.js

Firebase Authentication

Firebase Firestore

Firebase Storage

The current prototype focuses on the core system interface and workflow, with backend integration planned for later development stages.

Project Goals

The primary goals of this system are:

Digitize traditional garage service workflows

Improve service tracking and transparency

Reduce administrative workload

Enhance communication between customers and technicians

Provide a scalable system that can support multiple garage operations

Future Improvements

Future development plans for the system include:

Full Firebase database integration

Image upload support for repair documentation

Real-time repair status updates

Technician workload management

Service history tracking for customers

Notification system for repair updates

Author

Developed by Tyrone Jack
Bachelor of Science in Computer Technology
Multimedia University of Kenya
