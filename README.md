# Route Managing System

## Description

The Route Managing System is a web application designed to solve the following requirements:

1. **Drawing Multiple Lines**: Users can draw multiple lines to represent routes inside a farm or any other location where a machine should follow specific paths.

2. **Draggable Lines**: Each line is draggable, allowing users to move its start and end points as well as the entire line. This functionality resembles tools like draw.io, making it intuitive for users to adjust routes as needed.

3. **Rotatable Lines**: Users can rotate the lines by holding a point (start or end) and rotating the line around the other point. This feature provides flexibility in route planning, allowing users to align routes according to the terrain or other constraints.

4. **Display Line Information**: As an extra feature, the Route Managing System displays selected line's length and angle on the top of the screen in input fields. This information helps users precisely configure and optimize routes.

## Installation

To install and set up the Route Managing System, follow these steps:

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/cyrilirudayaraj/robotic-routing-app.git
   ```
2. cd route-managing-system
3. Install dependencies using npm or yarn:
   npm install
4. For Dev, run 'npm run dev'
5. For Build and Preview,run 'npm run build' and 'npm run preview'
6. Open http://localhost:8080/
7. If you want to configure port, you can do it in vite.config.ts

## Prerequisites

Node - v20.11.1
vs code - v1.88.1

## Credits

This project was created by [Cyril Irudayaraj Joseph](https://github.com/cyrilirudayaraj/).
