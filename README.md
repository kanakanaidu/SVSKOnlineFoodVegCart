# SVSK Online Store - Food E-Commerce App built with React and Firebase

SVSK Online Store is a food e-commerce app that allows users to browse and search a variety of food products, including fruits, vegetables, rice, and more. The project uses modern web development technologies and libraries to provide a seamless shopping experience.

## Demo

Check out the live demo deployed on Vercel: [Fruits Ecommerce App(SVSK Online Store)](https://food-ecommerce-app.vercel.app/)

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Run Locally](#run-locally)
- [Dependencies](#dependencies)

## Features

- **User Authentication:** Utilizes firebase google auth for secure user authentication.
- **Firestore:** Uses firestore for storing items data.
- **Firebase Storage:** Uses firebase storage for storing items image.
- **Responsive Design:** Optimized for both big screens and mobile devices.
- **Search Functionality:** Allows users to search for items.
- **Form Validation:** Utilizes react-hook-form and zod for form validation.
- **Styling:** Uses Tailwind CSS for modern and responsive UI design.
- **State Mangement:** Uses redux and redux-tookit for global state management.
- **Type Safe**: TypeScript is used for static typing and improved code quality.
- **Vite**: Vite is the build tool and development server for a fast and optimized development experience.

## Screenshots

### Desktop View

![Desktop View Screenshot](/public/images/readme/1.png)

![Desktop View Screenshot](/public/images/readme/2.png)

![Desktop View Screenshot](/public/images/readme/3.png)

## Run Locally

To run this project locally, follow these steps:

1. Clone the repository to your local machine:

```bash
  git clone https://github.com/neerajjoshi-github/food-ecommerce-app.git
```

2. Go to the project directory

```bash
  cd food-ecommerce-app
```

3. Install the project dependencies:

```bash
  npm install
```

4. Configure Environment Variables:
   Create a `.env.local` file in the root directory and add your environment variables:

   You can find all these firebase env from your firebase console.

```bash
FIREBASE_API_KEY=
FIREBASE_DATABASE_URL=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
```

5. Run the development server:

```bash
 npm run dev
```

6. Open your browser and visit [http://localhost:5173](http://localhost:5173) to view the app.

## Dependencies

Here are some of the key dependencies used in this project:

- **React Js:** A javascript framework for frontend applications.
- **Firebase:** A cloud-based platform for database, storage and authentication.
- **Tailwind CSS:** A utility-first CSS framework for building responsive and modern UIs.
- **React Hook Form:** A library for flexible and efficient form validation.
- **Zod:** A runtime type checking library for JavaScript.

For a full list of dependencies, refer to the `package.json` file.

## Feel free to explore the project and make any necessary modifications according to your specific use case.If thier any issue with the project please let me know.

# Happy coding! 🍎🥦🍚🥚🛒
