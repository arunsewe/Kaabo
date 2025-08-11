import * as express from 'express';

//initialize express app
const app = express();

const PORT = 3000;

// Fake database
let packages: any[] = [];

//setup the middleware
app.use(express.json());

type Update ={
    sender?: string;
    recipient?: string;
    destination?: string;
    weight?: string;
    status?: string;
}

//setup the routes
app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Hello Ayanfe, ...the server is up!');
});


app.post('/api/package', (req, res) => { 
    const { sender, recipient, destination, weight } = req.body;

    //validation
    if (!sender || !recipient || !destination || !weight) {
        return res.status(400).json({
            message: 'All field are required'
        })
        
    }

    //process the package delivery
    const deliveryDetails = {
        id: '0001',
        sender,
        recipient,
        destination,
        weight,
        status: 'In Transit',
    }
     packages.push(deliveryDetails);

    //return the response
    return res.status(201).json({
        message: 'Package delivery initiated successfully',
        data: deliveryDetails,
        status: 201
    });
    
})

app.put('/api/package/:id', (req, res) => {
    const { id } = req.params;


    // validation
    const { sender, recipient, destination, weight, status } = req.body;
     if (!sender || !recipient || !destination || !weight) {
        return res.status(400).json({
            message: 'All field are required'
        })
        
    }

    const index = packages.findIndex(pkg => pkg.id === id);
   

    if (index === -1) {
        return res.status(404).json({ message: 'Package not found' });
    }

    packages[index] = { id, sender, recipient, destination, weight, status };
    return res.json({
        message: 'Package replaced successfully',
        data: packages[index]
    });
});
//doesnt update tthe id
app.patch('/api/package/:id', (req, res) => {
const { id } = req.params;
const updates = req.body;
const {id: userid, ...updateData} = updates;
//console.log('Updates:', updateData);

    

    const packageToUpdate = packages.find(pkg => pkg.id === id);
    if (!packageToUpdate) {
        return res.status(404).json({ message: 'Package not found' });
    }

    Object.assign(packageToUpdate, updateData);
    return res.json({
        message: 'Package updated successfully',
        data: packageToUpdate
    });
});

app.delete('/api/package/:id', (req, res) => {
    const { id } = req.params;

    const index = packages.findIndex(pkg => pkg.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: 'Package not found'
        });
    }

    
    const deletedPackage = packages.splice(index, 1)[0];

    return res.json({
        message: 'Package deleted successfully',
        data: deletedPackage
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});