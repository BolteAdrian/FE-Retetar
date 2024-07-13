# RetetarFE

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.0.1.

## BE link : 
https://github.com/BolteAdrian/BE-Retetar

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## How to Use the Application

Upon accessing the Home page, before registration, two buttons are displayed in the center of the page. These buttons lead to two sections of the application, but full access is not granted until authentication is completed. In the navigation bar, users have options to register or log in, change the language, currency, and theme colors. Access to the application's functionalities is restricted until authentication is completed.

![image](https://github.com/user-attachments/assets/98cb98e5-4dbf-43a6-9080-bbbb521f8c41)

## Registration

To create an account, the user must provide the following information:
- **Username**
- **Email Address**
- **Password**

## Login

To log in, the user must enter:
- **Email Address**
- **Password**

## Account Roles

**Manager:**
- Has full access to all application functionalities.
- Only database administrators can assign the manager role.

**User:**
- Any newly created account is assigned the user role.
- Users with this role can only view data and do not have permissions to insert, edit, or delete entries in the tables.

## Settings

The application settings allow for user experience customization according to individual preferences.
- **Language:**
  - English
  - Romanian
- **Currency:**
  - Euro
  - Dollar
  - Pound
  - Leu
- **Night Mode**

## Managing Categories

Once authenticated, users are redirected back to the home page, where they can select the "Ingredients" or "Recipes" section. This will take them to a page with ingredient/recipe categories, where they have the option to:
- Create a new category for a specific ingredient/recipe
- Delete an existing category
- Edit an existing category
- Select one of the existing categories

![image](https://github.com/user-attachments/assets/c9d7c09a-7e78-4a87-b644-33586fd3dfdc)

![image](https://github.com/user-attachments/assets/abc132fe-b710-496b-92dd-6eca02a15771)

![image](https://github.com/user-attachments/assets/e380e5d7-c0c9-4f0f-9344-a2f353953e8c)

## Managing Ingredients

After selecting an ingredient category, the user will be redirected to the page with ingredients related to that category. On this page, the following options are available:
- View quantities for each type of ingredient.
- Add new ingredients.
- Modify or delete existing ingredients from the table.

![image](https://github.com/user-attachments/assets/c2936825-09ed-4e44-a7a5-efb5dfbb9ff0)

![image](https://github.com/user-attachments/assets/6d47d5ac-cf77-4f92-a046-efa9c75703a5)

## Managing Quantities

After selecting an ingredient, the user will be redirected to the page with quantities related to that ingredient. On this page, the following options are available:
- Add new quantities.
- Add new quantities by importing a .xlsx file.
- Send an email with an attachment.
- Export quantities to an XLSX file.
- Export quantities to a CSV file.
- Export quantities to a PDF file.
- Print the table.
- Modify or delete existing quantities from the table.

![image](https://github.com/user-attachments/assets/337e8119-a8b6-4605-b31e-19b9daea1863)
![image](https://github.com/user-attachments/assets/0386caa1-e0d3-4bb9-afb1-e77ce9b8166c)
![image](https://github.com/user-attachments/assets/04db894a-d0e9-4be2-a113-8c8d968274b6)

## Managing Recipes

After selecting a recipe category, the user will be redirected to the page with recipes related to that category. On this page, the following options are available:
- View recipes for each category.
- Add new recipes.
- Modify or delete existing recipes from the table.

![image](https://github.com/user-attachments/assets/eadca3ab-4ad4-4006-bcf7-be5b102349a4)
![image](https://github.com/user-attachments/assets/f4d3a097-6aa8-4f59-9e3e-32d9b8a2af53)

## Managing Recipe

After selecting a recipe, the user will be redirected to the recipe details page. On this page, the following options are available:
- View the required ingredients and preparation method.
- View the maximum number of servings that can be prepared with the ingredients in stock.
- View the approximate cost of ingredients per total and per portion.
- Ability to select the number of servings to be prepared; if the number is too high, missing ingredients and required quantities will be displayed.
- Send an email with an attachment.
- Export quantities to a PDF file.
- Print the recipe.
- Modify or delete the recipe.

![image](https://github.com/user-attachments/assets/f24719f0-8c2d-49db-a71d-cca90c1f40ef)
![image](https://github.com/user-attachments/assets/c59e1f57-bb12-4a74-8162-33dbedf95c55)
## Managing Statistics and Sales Prediction

For professional applications like restaurants, bakeries, or patisseries, the application includes a prediction feature to optimize and improve sales.

### Statistics Section

In the Categories section, above the categories, there is a button named "Statistics". Clicking on this button will take us to a page displaying various statistics from the application, including:
- Number of ingredients consumed
- History of prepared dishes
- Consumption diagram
- Sales prediction diagram for products monthly over the span of a year

### Utilizing Predictions

By analyzing this data, establishments can identify consumption trends and customer behaviors, allowing them to adjust their menus and stocks accordingly. For instance, if predictions indicate an increase in sales for a specific dish next month, the restaurant can prepare additional stocks of necessary ingredients and adjust marketing strategies to maximize profits.

### Benefits

In this way, predictions not only facilitate efficient resource management but also enhance customer satisfaction by ensuring consistent availability of popular products.
![image](https://github.com/user-attachments/assets/39ff026f-417b-4ed8-8ae3-c5f3b1984717)
![image](https://github.com/user-attachments/assets/e6817c85-5803-4b45-87a4-cc03a4844764)
![image](https://github.com/user-attachments/assets/f99ae888-9a45-4f3f-aa4e-9105ea8dab45)
![image](https://github.com/user-attachments/assets/4293247d-7950-4846-8fbb-96d6891b1f03)
