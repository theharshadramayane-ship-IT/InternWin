# Training Management System

## Tech Stack

Frontend: React
Backend: Node.js + Express
Database: MongoDB
CSS: External CSS
Do not use Tailwind.

## Rules

- Do not change frontend UI.
- Use App.jsx only for routing.
- Use existing folder structure.
- Reuse existing code.
- Implement only missing backend.

## Application Flow

1. User registers using UserNew module.

2. Admin receives registration.

3. Admin generates User ID and Password.

4. Admin creates Training Batch.

5. Admin assigns Trainer.

6. Admin assigns Students.

7. One student can belong to multiple batches.

8. One trainer can belong to multiple batches.

9. Trainer dashboard displays assigned batches as cards.

10. Student dashboard displays assigned batches as cards.

11. Clicking Trainer card opens:

- Meeting Link
- Notes
- Notices
- Tasks

Trainer can Create, Update and Delete these.

12. Clicking Student card opens:

- Meeting Link
- Notes
- Notices
- Tasks

Student can only view.

## Backend Requirements

Models

- User
- Batch
- Notice
- Note
- Task

Routes

- Authentication
- Admin
- Trainer
- Student
- Batch

Use JWT Authentication.

Use Role Based Authorization.

Connect frontend with backend.

Do not leave TODOs.

Verify every API before finishing.