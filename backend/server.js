const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');

const prisma = new PrismaClient();
const app = express();
app.use(bodyParser.json());


app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  console.log('Request body:', req.body);
  next();
});

app.post('/users/add', async (req, res) => {
  const { name, username, password, email } = req.body;

  console.log('Received data:', req.body);

  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        password,
        email,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
});

app.get('/users/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user details' });
  }
});

app.post('/courses/add', async (req, res) => {
  const { name, description, author, price, duration, notes } = req.body;

  console.log('Received data:', req.body);

  try {
    const newCourse = await prisma.course.create({
      data: {
        name,
        description,
        author,
        price,
        duration,
        notes,
      },
    });
    res.status(201).json(newCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Error creating course' });
  }
});

app.get('/courses', async (req, res) => {
  try {
    const courses = await prisma.course.findMany();
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Error fetching courses' });
  }
});

app.post('/add-to-cart', async (req, res) => {
  const { username, courseCid } = req.body;

  console.log('Received data:', req.body);

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      console.log('User not found:', username);
      return res.status(404).json({ error: 'User not found' });
    }

    const course = await prisma.course.findUnique({ where: { cid: courseCid } });
    if (!course) {
      console.log('Course not found:', courseCid);
      return res.status(404).json({ error: 'Course not found' });
    }

    const newCourseCart = await prisma.courseCart.create({
      data: {
        username: user.username,
        courseCid: course.cid,
      },
    });

    console.log('Course added to cart:', newCourseCart);
    res.status(201).json(newCourseCart);
  } catch (error) {
    console.error('Error adding course to cart:', error);
    res.status(500).json({ error: 'Error adding course to cart' });
  }
});

app.get('/cart/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return res.status(404).send('User not found');
    }

    const cartItems = await prisma.courseCart.findMany({
      where: { userId: user.id },
      include: { Course: true }
    });

    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).send('Error fetching cart items');
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
