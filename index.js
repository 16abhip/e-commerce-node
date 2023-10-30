const res = require("express/lib/response");
const { express, Product, User, app, port, ObjectId, userAdder, productAdder } = require("./moduless");
// Product APIs

productAdder({ type: 'shirt', desc : 'this is desc and be aware of it', img: ['img1', 'img2'], title: 'title1', price: [1221, 65333] });

app.get("/api/products", (req, res) => {
  Product.find({})
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(404).json({}));
});

app.get("/api/products/filter",

async (req, res) => {
  const { filter } = req.query;
  Product.find({ type: filter.toLowerCase() })
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(404).json({}));
});

app.get("/api/products/search", async (req, res) => {
  const { term } = req.query;
  try {
    const first = await Product.find({ type: term.toLowerCase() });
    const second = await Product.find({ title: term.toLowerCase() });
    const third = await Product.find({
      color: { $regex: new RegExp(term.toLowerCase(), "i") },
    });
    res.status(200).json(first.concat(second, third));
  } catch (error) {
    console.log(error);
    res.status(404).json({});
  }
});

app.get('/api/prodcuts/price', async (req, res) => {
  const {range} = req.query;
  try {
    const data = (await Product.find({})).filter(item => item.price[1] <= range);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(404).json({});
  }
})


app.get('/api/products/sort', async (req, res) => {
  const {sortType} = req.query;
  try {
    const sortedData = (await Product.find()).sort((a, b) => sortType === 'asce' ? a.price[1] - b.price[1] : b.price[1] - a.price[1]);
    res.status(200).json(sortedData);
  } catch (err) {
    console.log(err);
    res.status(404).json({});
  }
});



app.get("/api/products/color", async (req, res) => {
  const { color } = req.query;
  try {
    Product.find({ color: { $regex: new RegExp(color.toLowerCase(), "i") } })
      .then((data) => res.status(200).json(data))
      .catch((err) => res.status(200).json({}));
  } catch (err) {
    console.log(err);
    res.status(404).json({});
  }
});

app.get("/api/products/singleProduct", (req, res) => {
  const { id } = req.query;
  if (id.length < 24) res.json({});
  Product.find({ _id: new ObjectId(id) })
    .then((data) => res.json(data))
    .catch((err) => {
      console.log(err);
      res.json({});
    });
});

app.get('/api/products/size', async(req, res) => {
  const {size} = req.query;
  console.log(size);
  try {
    const data = (await Product.find()).filter(item => {
      if(size == 'xs') return item.xs > 0;
      else if(size == 's') return item.s > 0;
      else if(size == 'm') return item.m > 0;
      else if(size == 'l') return item.l > 0;
      else if(size == 'xl') return item.xl > 0;
      else if(size == 'xxl') return item.xxl > 0;
      return false;
    });
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(200).json({});
  }
});

// User APIs

app.post('/api/users/create', async (req, res) => {
  try {
    const {ph} = req.query;
      const singleUser = await User.create({phone: ph, cart: [], wishList: []});
      res.status(200).json(singleUser);
  } catch (err) {
    console.log(err);
    res.status(404).json({});
  }
});

app.get('/api/users/get', async (req, res) => {
  try {
    const {ph} = req.query;
    const user = await User.findOne({phone: ph});
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(404).json({message: 'err'});
  }
});

app.post('/api/users/add', async (req, res) => {
  try {
    const {type, ph, id, size} = req.query;
    const currUser = await User.findOne({phone: ph});
    console.log(currUser);
    if(!currUser){
      res.status(404).json({});
    }
    if(type === 'cart'){
      const item = currUser.cart.find((item) => {
        if(item[0] == id && item[1] == size){
          return true;
        }
        return false;
      });
      if(item) {return res.status(200).json(currUser);}
      currUser.cart.push([id, size, '1']);
      await currUser.save();
    }
    else{
      const item1 = currUser.wishList.find(item => item == id);
      if(item1) {return res.status(200).json(currUser);}
      currUser.wishList.push(id);
      await currUser.save();
    }
    res.status(200).json(currUser);
    
  } catch (err) {
    console.log(err);
    res.status(404).json({});
  }
});

app.delete('/api/users/delete', async (req, res) => {
  try {
    const {id, ph, type, size} = req.query;
    const currUser = await User.findOne({phone: ph});
    if(!currUser) return res.status(404).json({});
    if(type === 'cart') currUser.cart = currUser.cart.filter((item) => {
      if(item[0] != id && item[1] != size){
        return true;
      }
      return false;
    });
    else currUser.wishList = currUser.wishList.filter((item) => item != id);
    await currUser.save();
    res.status(200).json(currUser);
  } catch (err) {
    console.log(err);
    res.status(404).json({});
  }
});

app.listen(port, () => console.log(`Server is Up... Port : ${port}`));
