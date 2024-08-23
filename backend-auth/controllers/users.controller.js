import User from "../models/user.model.js";

const getUsers = async(req,res) => {
    try {
        const users = await User.find({},'username'); // fetch all the users with username field
        res.status(200).json(users);
    } catch (error) {
        console.log(error.message);	
        res.status(500).json({ message: 'Server Error' });
    }
}

export default getUsers;