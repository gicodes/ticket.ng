# ticket.ng

- Aplying the MVC Pattern for Backend Engineering (Layered System)
- Applying the principles of Software Engineering ( S M A A G I C )
- Uniform Interface, CS, Stateless, Cacheable, Layered, Code on Demand (Optional)
- Error Handling, Fasst API, Global Error Handling, Prod


app.post('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { updateParams } = req.body;

    // check 1
    const authHeader = req.headers['authorization'];
    if (!authHeader) res.status(401).json({ message: "No Token Available"});

    const token = authHeader.split(' ')[1]; 
    console.log(token);

    // check 2
    let decoded;
    try {
      decoded = jwt.verify({
        token,
        process.env.JWT_SECRET
      })
    } catch (err){
      res.status(401).json({
        message: "Broken, Expired or Invalid Token"
      })
    }

    // check 3
    if (decoded.userId !== id) res.status(403).json({
      message: 'Forbidden Action'
    })

    // go ahead with update
    const updatedUser = await User.update(
      updateParams, {
        where: { id }
      })
    
    res.status(201).json({
      message: "Profile Updated!"
    })
  } catch {
    console.error("Internal Server Error");
    res.status(500).json({
      message: "Internal Server Error"
    })
  }
})


app.delete('/delete-task/:id'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId, etc } = req.body;
    const user = await User.findOne({
      where: { userId }
    });
    if (!user) res.status(403).json({
        message: 'Forbidden Action'
      })

    const task = await Task.findByPk(id);

    if (!task) {
      res.status(404).json({
        message: 'No task found'
      })
    }

    await task.destroy();
    res.status(201).json({
      message: "Task deleted Successfully!"
    })
  } catch(err) {
    console.error("Internal Server Error");
    res.status(500).json({
      message: "Internal Server Error"
    })
    next(err);
  }
} 